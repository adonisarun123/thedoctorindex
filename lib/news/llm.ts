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

export async function askJson<T>(opts: { system: string; user: string; maxTokens?: number; model?: string; usage?: LlmUsage; timeoutMs?: number; noThinking?: boolean }): Promise<T> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new LlmError("ANTHROPIC_API_KEY is not set.");
  const send = (thinking: string | null) =>
    fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({
        model,
        max_tokens: opts.maxTokens ?? 4000,
        system: opts.system,
        messages: [{ role: "user", content: opts.user }],
        // Short structured replies: thinking would spend the token budget and can leave no text block.
        ...(thinking ? { thinking: { type: thinking } } : {}),
      }),
      signal: AbortSignal.timeout(opts.timeoutMs ?? 150_000),
    });
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
    if (!alt) throw new LlmError(`Anthropic API 400: ${body.slice(0, 300)}`);
    thinkingOff.set(model, alt);
    res = await send(alt);
  }
  if (!res.ok) throw new LlmError(`Anthropic API ${res.status}: ${(await res.text()).slice(0, 300)}`);
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
