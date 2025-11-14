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

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);

  return httpServer;
}
