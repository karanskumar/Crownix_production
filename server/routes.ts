import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactSubmissionSchema } from "@shared/schema";
import { getUncachableResendClient } from "./resend-client";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = contactSubmissionSchema.parse(req.body);
      
      const { client, fromEmail } = await getUncachableResendClient();
      
      const emailHtml = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        ${validatedData.company ? `<p><strong>Company:</strong> ${validatedData.company}</p>` : ''}
        <p><strong>Email:</strong> ${validatedData.email}</p>
        ${validatedData.phone ? `<p><strong>Phone:</strong> ${validatedData.phone}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${validatedData.message.replace(/\n/g, '<br>')}</p>
      `;

      await client.emails.send({
        from: fromEmail,
        to: 'info@crownix.com.au',
        subject: `New Contact Form Submission from ${validatedData.name}`,
        html: emailHtml,
      });

      res.json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to send message" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
