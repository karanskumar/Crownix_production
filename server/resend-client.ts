import { Resend } from 'resend';

async function getReplitCredentials(): Promise<{ apiKey: string; fromEmail: string } | null> {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!hostname || !xReplitToken) return null;

  try {
    const data = await fetch(
      'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
      {
        headers: {
          'Accept': 'application/json',
          'X_REPLIT_TOKEN': xReplitToken,
        },
      }
    ).then(res => res.json()).then(d => d.items?.[0]);

    if (data?.settings?.api_key) {
      return { apiKey: data.settings.api_key, fromEmail: data.settings.from_email };
    }
  } catch {
    // fall through to env var
  }
  return null;
}

export async function getUncachableResendClient(): Promise<{ client: Resend; fromEmail: string }> {
  // Try Replit connector first (works in Replit dev + Replit deployments)
  const replit = await getReplitCredentials();
  if (replit) {
    return { client: new Resend(replit.apiKey), fromEmail: replit.fromEmail };
  }

  // Fall back to plain env vars (Railway, local, any other host)
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!apiKey) {
    throw new Error('Resend is not configured. Set RESEND_API_KEY (and optionally RESEND_FROM_EMAIL) environment variables.');
  }
  return {
    client: new Resend(apiKey),
    fromEmail: fromEmail ?? 'noreply@crownix.com.au',
  };
}
