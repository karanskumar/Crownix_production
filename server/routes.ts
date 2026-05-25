import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { contactSubmissionSchema, pricingRequestSchema, packageUploadSchema, type AdminSession, type StateCode } from "@shared/schema";
import { getUncachableResendClient } from "./resend-client";

// Extend express-session to include our admin session data
declare module "express-session" {
  interface SessionData {
    admin?: AdminSession;
  }
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function verifyRecaptcha(token: string): Promise<{ success: boolean; score?: number; error?: string }> {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.error('RECAPTCHA_SECRET_KEY environment variable not configured');
      return { success: false, error: 'Server configuration error' };
    }

    const verifyURL = 'https://www.google.com/recaptcha/api/siteverify';
    const params = new URLSearchParams({
      secret: secretKey,
      response: token,
    });

    const response = await fetch(verifyURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!data.success) {
      console.error('reCAPTCHA verification failed:', data);
      return { success: false, error: 'reCAPTCHA verification failed' };
    }

    if (typeof data.score === 'number' && data.score < 0.5) {
      console.warn(`Low reCAPTCHA score: ${data.score}`);
      return { success: false, score: data.score, error: 'Low reCAPTCHA score. Possible bot detected.' };
    }

    console.log(`reCAPTCHA verified successfully with score: ${data.score}`);
    return { success: true, score: data.score };
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return { success: false, error: 'Server error during verification' };
  }
}

// Admin credentials — configured via environment variables only. No hardcoded fallbacks.
// Required env vars: ADMIN_USERNAME, ADMIN_PASSWORD
// Optional state user env vars: NSW_USERNAME, NSW_PASSWORD, QLD_USERNAME, QLD_PASSWORD, VIC_USERNAME, VIC_PASSWORD
// State users are also identified by their email address (set in STATE_USER_EMAILS below).
function buildAdminUsers(): Record<string, { password: string; role: "admin" | "state"; state?: StateCode; email?: string }> {
  const users: Record<string, { password: string; role: "admin" | "state"; state?: StateCode; email?: string }> = {};

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminUsername || !adminPassword) {
    console.warn("WARNING: ADMIN_USERNAME and ADMIN_PASSWORD env vars are not set. Admin login is disabled.");
  } else {
    users[adminUsername] = { password: adminPassword, role: "admin" };
  }

  const stateConfigs: Array<{ usernameVar: string; passwordVar: string; emailVar: string; state: StateCode }> = [
    { usernameVar: "NSW_USERNAME", passwordVar: "NSW_PASSWORD", emailVar: "NSW_USER_EMAIL", state: "NSW" },
    { usernameVar: "QLD_USERNAME", passwordVar: "QLD_PASSWORD", emailVar: "QLD_USER_EMAIL", state: "QLD" },
    { usernameVar: "VIC_USERNAME", passwordVar: "VIC_PASSWORD", emailVar: "VIC_USER_EMAIL", state: "VIC" },
  ];

  for (const cfg of stateConfigs) {
    const username = process.env[cfg.usernameVar];
    const password = process.env[cfg.passwordVar];
    const email = process.env[cfg.emailVar];
    if (username && password) {
      users[username] = { password, role: "state", state: cfg.state, email };
    }
  }

  return users;
}

// Log loaded users at startup (dev/staging only — avoid disclosing usernames in production logs)
if (process.env.NODE_ENV !== "production") {
  const startupUsers = buildAdminUsers();
  console.log("[auth] Loaded admin users:", Object.entries(startupUsers).map(([u, v]) => `${u} (${v.role}${v.state ? "/" + v.state : ""})`).join(", ") || "(none)");
}

// State email addresses (testing — all pointing to test inbox)
const STATE_EMAILS: Record<StateCode, string> = {
  NSW: "22kskumar@gmail.com",
  QLD: "22kskumar@gmail.com",
  VIC: "22kskumar@gmail.com",
};

// Kesh & Pavan / Div email (testing — all pointing to test inbox)
const KESH_PAVAN_EMAIL = "22kskumar@gmail.com";
const DIV_EMAIL = "22kskumar@gmail.com";

// Helper: read uploaded files from disk and return Resend-compatible attachment objects.
// Only reads files that are inside the known uploadsDir to prevent path traversal.
// Files that cannot be read are silently skipped.
function buildEmailAttachments(files: Array<{ originalName: string; path: string }>): Array<{ filename: string; content: Buffer }> {
  const safeDirPrefix = path.resolve(uploadsDir) + path.sep;
  const result: Array<{ filename: string; content: Buffer }> = [];
  for (const f of files) {
    try {
      const resolved = path.resolve(f.path);
      if (!resolved.startsWith(safeDirPrefix)) {
        console.warn(`[email] Skipping file outside uploadsDir: ${f.path}`);
        continue;
      }
      const content = fs.readFileSync(resolved);
      result.push({ filename: f.originalName, content });
    } catch (err) {
      console.warn(`[email] Could not read attachment ${f.path}:`, err);
    }
  }
  return result;
}

// Admin auth middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.admin) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  next();
}

// Set up multer for file uploads
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  dest: uploadsDir,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB per file
    files: 10,
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET ?? (() => { if (process.env.NODE_ENV === "production") { throw new Error("SESSION_SECRET env var must be set in production"); } return "crownix-dev-only-secret"; })(),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  // File download endpoint — admin only, serves by multer filename with original name
  app.get("/admin/api/files/:filename", requireAdmin, (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(uploadsDir, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "File not found" });
    }
    // Look up original name and mimetype from package uploads and pricing request attachments
    Promise.all([storage.getAllPackageUploads(), storage.getAllPricingRequests()]).then(([uploads, requests]) => {
      let originalName = filename;
      let mimetype = "application/octet-stream";
      outer: for (const u of uploads) {
        const allFiles = [
          ...(u.floorPlanFiles ?? []),
          ...(u.sitedFloorPlanFiles ?? []),
          ...(u.areaTableFiles ?? []),
          ...(u.facadeFiles ?? []),
          ...(u.inclusionFiles ?? []),
        ];
        for (const f of allFiles) {
          if (f.filename === filename) { originalName = f.originalName; mimetype = f.mimetype; break outer; }
        }
      }
      for (const r of requests) {
        for (const f of (r.attachments ?? [])) {
          if (f.filename === filename) { originalName = f.originalName; mimetype = f.mimetype; break; }
        }
      }
      res.setHeader("Content-Type", mimetype);
      res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(originalName)}"`);
      res.sendFile(filePath);
    }).catch(() => {
      res.sendFile(filePath);
    });
  });

  // ========== Public Contact Route ==========
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = contactSubmissionSchema.parse(req.body);
      
      const recaptchaResult = await verifyRecaptcha(validatedData.recaptchaToken);
      if (!recaptchaResult.success) {
        const isServerError = recaptchaResult.error === 'Server configuration error' || 
                              recaptchaResult.error === 'Server error during verification';
        return res.status(isServerError ? 500 : 400).json({ 
          success: false, 
          message: recaptchaResult.error || "reCAPTCHA verification failed"
        });
      }
      
      const { client, fromEmail } = await getUncachableResendClient();
      
      const escapedName = escapeHtml(validatedData.name);
      const escapedCompany = validatedData.company ? escapeHtml(validatedData.company) : '';
      const escapedEmail = escapeHtml(validatedData.email);
      const escapedPhone = validatedData.phone ? escapeHtml(validatedData.phone) : '';
      const escapedMessage = escapeHtml(validatedData.message).replace(/\n/g, '<br>');
      
      const emailHtml = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapedName}</p>
        ${escapedCompany ? `<p><strong>Company:</strong> ${escapedCompany}</p>` : ''}
        <p><strong>Email:</strong> ${escapedEmail}</p>
        ${escapedPhone ? `<p><strong>Phone:</strong> ${escapedPhone}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${escapedMessage}</p>
      `;

      const plainText = `
New Contact Form Submission

Name: ${validatedData.name}
${validatedData.company ? `Company: ${validatedData.company}\n` : ''}Email: ${validatedData.email}
${validatedData.phone ? `Phone: ${validatedData.phone}\n` : ''}
Message:
${validatedData.message}
      `;

      await client.emails.send({
        from: fromEmail,
        to: 'info@crownix.com.au',
        subject: `New Contact Form Submission from ${validatedData.name}`,
        html: emailHtml,
        text: plainText,
      });

      res.json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      console.error("Contact form error:", error);
      
      if (error instanceof Error && error.name === 'ZodError') {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data" 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Failed to send message. Please try again later." 
        });
      }
    }
  });

  // ========== Admin Auth Routes ==========
  app.post("/admin/api/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password are required" });
    }

    // Rebuild user map at login time so any secret/env changes since startup are honoured
    const currentUsers = buildAdminUsers();
    const userConfig = currentUsers[username];
    if (!userConfig || userConfig.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    req.session.admin = {
      username,
      role: userConfig.role,
      state: userConfig.state,
    };

    res.json({
      success: true,
      user: {
        username,
        role: userConfig.role,
        state: userConfig.state,
      },
    });
  });

  app.post("/admin/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  app.get("/admin/api/me", requireAdmin, (req, res) => {
    res.json({
      success: true,
      user: req.session.admin,
    });
  });

  // ========== File Upload ==========
  app.post("/admin/api/upload", requireAdmin, upload.array("files", 10), (req, res) => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    const fileMetas = files.map((f) => ({
      originalName: f.originalname,
      filename: f.filename,
      mimetype: f.mimetype,
      size: f.size,
      path: f.path,
    }));

    res.json({ success: true, files: fileMetas });
  });

  // ========== Pricing Requests ==========
  app.post("/admin/api/pricing-requests", requireAdmin, async (req, res) => {
    // Only admin role can create pricing requests
    if (req.session.admin!.role !== "admin") {
      return res.status(403).json({ success: false, message: "Only admin users can submit pricing requests" });
    }
    try {
      const validatedData = pricingRequestSchema.parse(req.body);
      const request = await storage.createPricingRequest(validatedData);

      // Upsert "Incomplete" package uploads for each lot in each stage.
      // Uses lotNumber+stageName as the unique key so re-submitting the
      // same pricing request never creates duplicate rows.
      for (const stage of validatedData.stages) {
        for (const lot of stage.lots) {
          const lotAddress = `Lot ${lot.lotNumber}, ${validatedData.estate}, ${validatedData.suburb}`;
          const existing = await storage.findPackageUploadByLot(request.id, lot.lotNumber, stage.stageName);
          if (existing) {
            // Already exists — update without changing status
            await storage.updatePackageUpload(existing.id, {
              lotAddress,
              landSize: lot.landSize,
              landPrice: lot.price,
              floorPlanName: lot.floorPlans[0],
              registration: stage.registration,
              state: validatedData.state,
              lotNumber: lot.lotNumber,
              stageName: stage.stageName,
            });
          } else {
            await storage.createPackageUpload({
              pricingRequestId: request.id,
              lotNumber: lot.lotNumber,
              stageName: stage.stageName,
              lotAddress,
              landSize: lot.landSize,
              landPrice: lot.price,
              floorPlanName: lot.floorPlans[0],
              registration: stage.registration,
              state: validatedData.state,
            }, "Incomplete");
          }
        }
      }

      // Send email notification to state team
      try {
        const { client, fromEmail } = await getUncachableResendClient();
        const stateEmail = STATE_EMAILS[validatedData.state];
        const estateSuburb = `${validatedData.estate} – ${validatedData.suburb}`;
        
        const lotsHtml = validatedData.stages.map(stage => `
          <h4>Stage: ${escapeHtml(stage.stageName)}</h4>
          ${stage.registration ? `<p>Registration: ${escapeHtml(stage.registration)}</p>` : ''}
          <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%">
            <thead>
              <tr>
                <th>Lot Number</th>
                <th>Land Size (sqm)</th>
                <th>Price ($)</th>
                <th>Floor Plans</th>
              </tr>
            </thead>
            <tbody>
              ${stage.lots.map(lot => `
                <tr>
                  <td>${escapeHtml(lot.lotNumber)}</td>
                  <td>${escapeHtml(lot.landSize)}</td>
                  <td>${escapeHtml(lot.price)}</td>
                  <td>${lot.floorPlans.map(fp => escapeHtml(fp)).join(', ')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `).join('');

        const pricingAttachments = buildEmailAttachments(validatedData.attachments ?? []);

        await client.emails.send({
          from: fromEmail,
          to: stateEmail,
          subject: `New Crownix Pricing Request – ${estateSuburb}`,
          html: `
            <h2>New Pricing Request – ${escapeHtml(estateSuburb)}</h2>
            <p><strong>State:</strong> ${validatedData.state}</p>
            <p><strong>Suburb:</strong> ${escapeHtml(validatedData.suburb)}</p>
            <p><strong>Estate:</strong> ${escapeHtml(validatedData.estate)}</p>
            <h3>Stages & Lots</h3>
            ${lotsHtml}
            <h3>Additional Costs</h3>
            <p>Land BDM Expense: $${escapeHtml(validatedData.additionalCosts.landBdmExpense)} inc GST</p>
            <p>Independent Inspection: $${escapeHtml(validatedData.additionalCosts.independentInspection)} inc GST</p>
            ${validatedData.additionalCosts.additionalMarketing ? `<p>Additional Marketing: ${escapeHtml(validatedData.additionalCosts.additionalMarketing)}</p>` : ''}
            ${validatedData.landLinks && validatedData.landLinks.length > 0 ? `
              <h3>Land Links</h3>
              <ul>${validatedData.landLinks.map(link => `<li><a href="${escapeHtml(link)}">${escapeHtml(link)}</a></li>`).join('')}</ul>
            ` : ''}
          `,
          ...(pricingAttachments.length > 0 ? { attachments: pricingAttachments } : {}),
        });
      } catch (emailError) {
        console.error("Failed to send pricing request email:", emailError);
        // Don't fail the request if email fails
      }

      res.json({ success: true, request });
    } catch (error: unknown) {
      console.error("Pricing request error:", error);
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ success: false, message: "Invalid form data" });
      }
      res.status(500).json({ success: false, message: "Failed to create pricing request" });
    }
  });

  app.get("/admin/api/pricing-requests", requireAdmin, async (req, res) => {
    try {
      let requests = await storage.getAllPricingRequests();
      // State-scoped users only see their state's requests
      if (req.session.admin!.role === "state" && req.session.admin!.state) {
        requests = requests.filter(r => r.state === req.session.admin!.state);
      }
      res.json({ success: true, requests });
    } catch (error) {
      console.error("Get pricing requests error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch pricing requests" });
    }
  });

  app.get("/admin/api/pricing-requests/:id", requireAdmin, async (req, res) => {
    try {
      const request = await storage.getPricingRequest(req.params.id);
      if (!request) {
        return res.status(404).json({ success: false, message: "Pricing request not found" });
      }
      // State-scoped users can only view their own state's requests
      if (req.session.admin!.role === "state" && req.session.admin!.state && request.state !== req.session.admin!.state) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
      res.json({ success: true, request });
    } catch (error) {
      console.error("Get pricing request error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch pricing request" });
    }
  });

  // ========== Package Uploads ==========
  app.post("/admin/api/package-uploads", requireAdmin, async (req, res) => {
    try {
      let validatedData = packageUploadSchema.parse(req.body);

      // State-role users can only create uploads for their own state.
      // Override whatever state was sent in the body to prevent spoofing.
      if (req.session.admin!.role === "state" && req.session.admin!.state) {
        validatedData = { ...validatedData, state: req.session.admin!.state };
      }

      const upload = await storage.createPackageUpload(validatedData);

      // If linked to a pricing request, update its status to Pending
      if (validatedData.pricingRequestId) {
        await storage.updatePricingRequestStatus(validatedData.pricingRequestId, "Pending");
      }

      // Send notification emails
      try {
        const { client, fromEmail } = await getUncachableResendClient();
        const state = validatedData.state;

        // Derive estate/suburb label from linked pricing request when available
        let estateSuburbLabel = validatedData.lotAddress;
        if (validatedData.pricingRequestId) {
          const pr = await storage.getPricingRequest(validatedData.pricingRequestId);
          if (pr) {
            estateSuburbLabel = `${pr.estate} – ${pr.suburb}`;
          }
        }

        const packageHtml = `
          <h2>New Crownix Pricing Received – ${escapeHtml(estateSuburbLabel)}</h2>
          <p><strong>Lot Address:</strong> ${escapeHtml(validatedData.lotAddress)}</p>
          <p><strong>Land Size:</strong> ${escapeHtml(validatedData.landSize)} sqm</p>
          <p><strong>Land Price:</strong> $${escapeHtml(validatedData.landPrice)}</p>
          ${validatedData.floorPlanSize ? `<p><strong>Floor Plan Size:</strong> ${escapeHtml(validatedData.floorPlanSize)}</p>` : ''}
          ${validatedData.floorPlanName ? `<p><strong>Floor Plan Name:</strong> ${escapeHtml(validatedData.floorPlanName)}</p>` : ''}
          ${validatedData.facadeName ? `<p><strong>Facade Name:</strong> ${escapeHtml(validatedData.facadeName)}</p>` : ''}
          ${validatedData.registration ? `<p><strong>Registration:</strong> ${escapeHtml(validatedData.registration)}</p>` : ''}
        `;

        const recipients: string[] = [KESH_PAVAN_EMAIL, DIV_EMAIL];
        if (state) {
          recipients.push(STATE_EMAILS[state]);
        }

        const uniqueRecipients = recipients.filter((v, i, a) => a.indexOf(v) === i);
        await client.emails.send({
          from: fromEmail,
          to: uniqueRecipients,
          subject: `New Crownix Pricing Received – ${estateSuburbLabel}`,
          html: packageHtml,
        });
      } catch (emailError) {
        console.error("Failed to send package upload email:", emailError);
      }

      res.json({ success: true, upload });
    } catch (error: unknown) {
      console.error("Package upload error:", error);
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ success: false, message: "Invalid form data" });
      }
      res.status(500).json({ success: false, message: "Failed to create package upload" });
    }
  });

  app.get("/admin/api/package-uploads", requireAdmin, async (req, res) => {
    try {
      let uploads = await storage.getAllPackageUploads();
      // State-scoped users only see their state's uploads
      if (req.session.admin!.role === "state" && req.session.admin!.state) {
        uploads = uploads.filter(u => u.state === req.session.admin!.state);
      }
      res.json({ success: true, uploads });
    } catch (error) {
      console.error("Get package uploads error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch package uploads" });
    }
  });

  app.get("/admin/api/package-uploads/:id", requireAdmin, async (req, res) => {
    try {
      const upload = await storage.getPackageUpload(req.params.id);
      if (!upload) {
        return res.status(404).json({ success: false, message: "Package upload not found" });
      }
      if (req.session.admin!.role === "state" && req.session.admin!.state && upload.state !== req.session.admin!.state) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
      res.json({ success: true, upload });
    } catch (error) {
      console.error("Get package upload error:", error);
      res.status(500).json({ success: false, message: "Failed to fetch package upload" });
    }
  });

  app.patch("/admin/api/package-uploads/:id", requireAdmin, async (req, res) => {
    try {
      const validatedData = packageUploadSchema.partial().parse(req.body);
      const existing = await storage.getPackageUpload(req.params.id);
      if (!existing) {
        return res.status(404).json({ success: false, message: "Package upload not found" });
      }
      // State-scoped users can only update their own state's uploads
      if (req.session.admin!.role === "state" && req.session.admin!.state && existing.state !== req.session.admin!.state) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
      const updated = await storage.updatePackageUpload(req.params.id, validatedData);
      if (!updated) {
        return res.status(404).json({ success: false, message: "Package upload not found" });
      }

      // If the upload was "Incomplete" and is now being edited (i.e., submitted with more info), move it to Pending
      // and send submission notification emails to state team, Div, and Kesh & Pavan
      if (existing && existing.status === "Incomplete") {
        await storage.updatePackageUploadStatus(req.params.id, "Pending");
        const withPending = await storage.getPackageUpload(req.params.id);

        // Send notification emails (same as POST path)
        try {
          const { client, fromEmail } = await getUncachableResendClient();
          const finalUpload = withPending ?? updated;
          const state = finalUpload.state;

          // Derive estate/suburb label from linked pricing request when available
          let estateSuburbLabel = finalUpload.lotAddress;
          if (finalUpload.pricingRequestId) {
            const pr = await storage.getPricingRequest(finalUpload.pricingRequestId);
            if (pr) {
              estateSuburbLabel = `${pr.estate} – ${pr.suburb}`;
            }
          }

          const packageHtml = `
            <h2>New Crownix Pricing Received – ${escapeHtml(estateSuburbLabel)}</h2>
            <p><strong>Lot Address:</strong> ${escapeHtml(finalUpload.lotAddress)}</p>
            <p><strong>Land Size:</strong> ${escapeHtml(finalUpload.landSize)} sqm</p>
            <p><strong>Land Price:</strong> $${escapeHtml(finalUpload.landPrice)}</p>
            ${finalUpload.floorPlanSize ? `<p><strong>Floor Plan Size:</strong> ${escapeHtml(finalUpload.floorPlanSize)}</p>` : ''}
            ${finalUpload.floorPlanName ? `<p><strong>Floor Plan Name:</strong> ${escapeHtml(finalUpload.floorPlanName)}</p>` : ''}
            ${finalUpload.facadeName ? `<p><strong>Facade Name:</strong> ${escapeHtml(finalUpload.facadeName)}</p>` : ''}
            ${finalUpload.registration ? `<p><strong>Registration:</strong> ${escapeHtml(finalUpload.registration)}</p>` : ''}
          `;

          const recipients: string[] = [KESH_PAVAN_EMAIL, DIV_EMAIL];
          if (state) {
            recipients.push(STATE_EMAILS[state]);
          }
          const uniqueRecipients = recipients.filter((v, i, a) => a.indexOf(v) === i);

          await client.emails.send({
            from: fromEmail,
            to: uniqueRecipients,
            subject: `New Crownix Pricing Received – ${estateSuburbLabel}`,
            html: packageHtml,
          });
        } catch (emailError) {
          console.error("Failed to send package completion email:", emailError);
        }

        return res.json({ success: true, upload: withPending });
      }

      res.json({ success: true, upload: updated });
    } catch (error: unknown) {
      console.error("Update package upload error:", error);
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ success: false, message: "Invalid form data" });
      }
      res.status(500).json({ success: false, message: "Failed to update package upload" });
    }
  });

  app.post("/admin/api/package-uploads/:id/approve", requireAdmin, async (req, res) => {
    try {
      const upload = await storage.getPackageUpload(req.params.id);
      if (!upload) {
        return res.status(404).json({ success: false, message: "Package upload not found" });
      }

      const role = req.session.admin!.role;

      // Double-approval policy:
      // Step 1 — Pending → Reviewed: any admin (including state users)
      // Step 2 — Reviewed → Approved: admin role only
      if (upload.status === "Pending") {
        const updated = await storage.updatePackageUploadStatus(req.params.id, "Reviewed");

        try {
          const { client, fromEmail } = await getUncachableResendClient();
          await client.emails.send({
            from: fromEmail,
            to: KESH_PAVAN_EMAIL,
            cc: [DIV_EMAIL],
            subject: `Package Reviewed (1st Approval) – ${upload.lotAddress}`,
            html: `
              <h2>Package Upload – 1st Approval</h2>
              <p>The following package has been reviewed and is awaiting final approval:</p>
              <p><strong>Lot Address:</strong> ${escapeHtml(upload.lotAddress)}</p>
              <p><strong>Land Size:</strong> ${escapeHtml(upload.landSize)} sqm</p>
              <p><strong>Land Price:</strong> $${escapeHtml(upload.landPrice)}</p>
              ${upload.floorPlanName ? `<p><strong>Floor Plan:</strong> ${escapeHtml(upload.floorPlanName)}</p>` : ''}
            `,
          });
        } catch (emailError) {
          console.error("Failed to send 1st approval email:", emailError);
        }

        return res.json({ success: true, upload: updated });
      }

      if (upload.status === "Reviewed") {
        if (role !== "admin") {
          return res.status(403).json({ success: false, message: "Only admin users can give final approval" });
        }

        const updated = await storage.updatePackageUploadStatus(req.params.id, "Approved");

        try {
          const { client, fromEmail } = await getUncachableResendClient();

          const allPackageFiles = [
            ...(upload.floorPlanFiles ?? []),
            ...(upload.sitedFloorPlanFiles ?? []),
            ...(upload.areaTableFiles ?? []),
            ...(upload.facadeFiles ?? []),
            ...(upload.inclusionFiles ?? []),
          ];
          const approvalAttachments = buildEmailAttachments(allPackageFiles);

          await client.emails.send({
            from: fromEmail,
            to: KESH_PAVAN_EMAIL,
            cc: [DIV_EMAIL],
            subject: `Package Approved – ${upload.lotAddress}`,
            html: `
              <h2>Package Upload Approved</h2>
              <p>The following package has been approved:</p>
              <p><strong>Lot Address:</strong> ${escapeHtml(upload.lotAddress)}</p>
              <p><strong>Land Size:</strong> ${escapeHtml(upload.landSize)} sqm</p>
              <p><strong>Land Price:</strong> $${escapeHtml(upload.landPrice)}</p>
              ${upload.floorPlanName ? `<p><strong>Floor Plan:</strong> ${escapeHtml(upload.floorPlanName)}</p>` : ''}
              <!-- TODO: Trigger Zoho CRM product creation on approval -->
            `,
            ...(approvalAttachments.length > 0 ? { attachments: approvalAttachments } : {}),
          });
        } catch (emailError) {
          console.error("Failed to send final approval email:", emailError);
        }

        return res.json({ success: true, upload: updated });
      }

      return res.status(400).json({ success: false, message: "Package is not in an approvable state" });
    } catch (error) {
      console.error("Approve package upload error:", error);
      res.status(500).json({ success: false, message: "Failed to approve package upload" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
