import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactSubmissionSchema } from "@shared/schema";
import { getUncachableResendClient } from "./resend-client";

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = contactSubmissionSchema.parse(req.body);
      
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

  const httpServer = createServer(app);

  return httpServer;
}
