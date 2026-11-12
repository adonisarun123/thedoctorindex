import "server-only";

/**
 * Minimal Anthropic Messages API client for the newsroom. No SDK: one POST,
 * JSON out. Every call asks for a single JSON object and is parsed strictly;
 * a reply that does not parse is an error, never a guess.
 */

export const NEWS_MODEL = () => process.env.NEWS_MODEL || "claude-sonnet-5-5";

export class LlmError extends Error {}

export interface LlmUsage {
  input: number;
  output: number;
}

/** How each model wants thinking switched off, learned from its first 400 (per server instance). */
const thinkingOff = new Map<string, string>();

/**
 * Where a Messages request can go, in order of preference:
 *  1. Anthropic directly, with ANTHROPIC_API_KEY;
 *  2. Vercel AI Gateway, with AI_GATEWAY_API_KEY or the deployment's own
 *     VERCEL_OIDC_TOKEN (no key to manage; billed to the Vercel team's AI
 *     credits).
 * A provider that answers 401/403 (bad or revoked key, no gateway credits)
 * is skipped for the rest of this server instance and the next one is tried,
 * so one dead credential no longer stops the newsroom.
 */
interface Provider {
  name: "anthropic" | "gateway";
  url: string;
  key: string;
  model: (m: string) => string;
}

const deadProviders = new Set<string>();

/** "claude-sonnet-5-5" → "anthropic/claude-sonnet-5.5"; "claude-haiku-4-5-20251001" → "anthropic/claude-haiku-4.5". */
export function gatewayModel(m: string): string {
  if (process.env.NEWS_GATEWAY_MODEL) return process.env.NEWS_GATEWAY_MODEL;
  if (m.includes("/")) return m;
  const bare = m.replace(/-\d{8}$/, "").replace(/-(\d+)-(\d+)$/, "-$1.$2");
  return `anthropic/${bare}`;
}

export function llmProviders(): Provider[] {
  const out: Provider[] = [];
  const key = process.env.ANTHROPIC_API_KEY;
  if (key) out.push({ name: "anthropic", url: "https://api.anthropic.com/v1/messages", key, model: (m) => m });
  const gw = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN;
  if (gw) out.push({ name: "gateway", url: "https://ai-gateway.vercel.sh/v1/messages", key: gw, model: gatewayModel });
  return out.filter((p) => !deadProviders.has(p.name));
}

/** POST a Messages body to the first provider that accepts our credential. Auth failures fall through; anything else is returned as is. */
export async function postMessages(body: Record<string, unknown>, timeoutMs: number): Promise<Response> {
  const providers = llmProviders();
  if (!providers.length) throw new LlmError("No model provider configured: set ANTHROPIC_API_KEY, or enable Vercel AI Gateway (AI_GATEWAY_API_KEY / VERCEL_OIDC_TOKEN).");
  const failures: string[] = [];
  for (const p of providers) {
    const res = await fetch(p.url, {
      method: "POST",
      headers: { "x-api-key": p.key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ ...body, model: p.model(String(body.model)) }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    const credentialProblem = res.status === 401 || res.status === 403 || (p.name === "gateway" && res.status === 402);
    if (!credentialProblem) return res;
    failures.push(`${p.name} ${res.status}: ${(await res.text()).slice(0, 200)}`);
    deadProviders.add(p.name);
  }
  throw new LlmError(`Every model provider refused our credentials — ${failures.join(" | ")}`);
}

export async function askJson<T>(opts: { system: string; user: string; maxTokens?: number; model?: string; usage?: LlmUsage; timeoutMs?: number; noThinking?: boolean }): Promise<T> {
  const send = (thinking: string | null) =>
    postMessages(
      {
        model,
        max_tokens: opts.maxTokens ?? 4000,
        system: opts.system,
        messages: [{ role: "user", content: opts.user }],
        // Short structured replies: thinking would spend the token budget and can leave no text block.
        ...(thinking ? { thinking: { type: thinking } } : {}),
      },
      opts.timeoutMs ?? 150_000,
    );
  const model = opts.model ?? NEWS_MODEL();
  let res = await send(opts.noThinking ? (thinkingOff.get(model) ?? "disabled") : null);
  // Models differ in how thinking is switched off ("disabled" vs "between_tools"); the 400 names the right value.
  if (opts.noThinking && res.status === 400) {
    const body = await res.text();
    let message = body;
    try {
      message = (JSON.parse(body) as { error?: { message?: string } }).error?.message ?? body;
    } catch {
      /* not JSON: match the raw text */
    }
    const alt = /"type":\s*"([a-z_]+)"\s*\}\s*instead of/.exec(message)?.[1];
    if (!alt) throw new LlmError(`Model API 400: ${body.slice(0, 300)}`);
    thinkingOff.set(model, alt);
    res = await send(alt);
  }
  if (!res.ok) throw new LlmError(`Model API ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = (await res.json()) as { content: Array<{ type: string; text?: string }>; stop_reason?: string; usage?: { input_tokens: number; output_tokens: number } };
  if (opts.usage && data.usage) {
    opts.usage.input += data.usage.input_tokens;
    opts.usage.output += data.usage.output_tokens;
  }
  const text = data.content.filter((c) => c.type === "text").map((c) => c.text ?? "").join("");
  if (!text.trim()) throw new LlmError(`Empty reply (stop_reason: ${data.stop_reason ?? "unknown"}).`);
  return parseJsonObject<T>(text);
}

/** The first complete top-level JSON object in a reply (tolerates a ```json fence). */
export function parseJsonObject<T>(text: string): T {
  const t = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  const start = t.indexOf("{");
  if (start < 0) throw new LlmError(`No JSON object in reply: ${text.slice(0, 200)}`);
  let depth = 0;
  let inStr = false;
  let esc = false;
  for (let i = start; i < t.length; i++) {
    const c = t[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === "\\") esc = true;
      else if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') inStr = true;
    else if (c === "{") depth++;
    else if (c === "}" && --depth === 0) return JSON.parse(t.slice(start, i + 1)) as T;
  }
  throw new LlmError("Unterminated JSON object in reply.");
}
