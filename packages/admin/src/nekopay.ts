import fs from 'fs';
import path from 'path';

// NekoPay merchant config. The SECRET KEY must NEVER be committed: put it in a git-ignored
// .nekopay.env file next to the binary, or set NEKOPAY_SECRET in the environment.
export interface NekoPayConfig {
  secret: string;
  endpoint: string; // .../api/merchant/checkout-sessions
  publicBaseUrl: string; // public URL NekoPay can reach for the webhook (notificationUrl)
  publicKey: string; // safe to expose
}

function readEnvFile(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const file of [path.join(process.cwd(), '.nekopay.env'), path.join(process.cwd(), '.env')]) {
    try {
      if (fs.existsSync(file)) {
        for (const line of fs.readFileSync(file, 'utf-8').split(/\r?\n/)) {
          const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
          if (m) out[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
        }
      }
    } catch {
      /* ignore */
    }
  }
  return out;
}

export function loadNekoPay(): NekoPayConfig {
  const env = { ...readEnvFile(), ...process.env } as Record<string, string>;
  return {
    secret: env.NEKOPAY_SECRET ?? '',
    endpoint: env.NEKOPAY_ENDPOINT ?? 'https://pay.nekolive.co.uk/api/merchant/checkout-sessions',
    publicBaseUrl: (env.PUBLIC_BASE_URL ?? `http://localhost:${env.ADMIN_PORT ?? 8088}`).replace(/\/$/, ''),
    publicKey: env.NEKOPAY_PUBLIC_KEY ?? '',
  };
}

export interface CheckoutResult {
  ok: boolean;
  checkoutUrl?: string;
  sessionId?: string;
  raw?: any;
  error?: string;
}

// Creates a NekoPay hosted checkout session for a credit purchase.
export async function createCheckout(
  cfg: NekoPayConfig,
  opts: { itemName: string; amountCents: number; currency: string; externalId: string; metadata: object },
): Promise<CheckoutResult> {
  if (!cfg.secret) return { ok: false, error: 'NEKOPAY_SECRET is not set (add it to .nekopay.env)' };

  const body = {
    itemName: opts.itemName,
    itemDescription: opts.itemName,
    amount: opts.amountCents / 100,
    currency: opts.currency,
    notificationUrl: `${cfg.publicBaseUrl}/api/webhooks/nekopay`,
    successUrl: `${cfg.publicBaseUrl}/pay/success`,
    cancelUrl: `${cfg.publicBaseUrl}/pay/cancel`,
    externalId: opts.externalId,
    metadata: opts.metadata,
  };

  try {
    const res = await fetch(cfg.endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${cfg.secret}` },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data?.error ?? `NekoPay returned ${res.status}`, raw: data };
    return { ok: true, checkoutUrl: data.checkoutUrl ?? data.url, sessionId: data.sessionId ?? data.id, raw: data };
  } catch (e: any) {
    return { ok: false, error: e?.message ?? 'NekoPay request failed' };
  }
}

// NekoPay does not sign outbound webhooks yet, so we identify the order by externalId /
// sessionId from the payload and trust our own DB order mapping (status + idempotency).
export function parseWebhook(payload: any): { event: string; externalId?: string; sessionId?: string; status?: string } {
  const event = payload?.event ?? payload?.type ?? '';
  const d = payload?.data ?? payload ?? {};
  return {
    event,
    externalId: d.externalId ?? d.external_id ?? payload?.externalId,
    sessionId: d.sessionId ?? d.id ?? payload?.sessionId,
    status: d.status ?? payload?.status,
  };
}
