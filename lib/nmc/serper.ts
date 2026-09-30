import type { SerpResponse } from "@/lib/nmc/serp-match";

const URL = "https://google.serper.dev/search";
const PLACES_URL = "https://google.serper.dev/places";

/** Serper.dev — one Google results page per query. `gl=in` keeps results Indian. */
export class SerperClient {
  requests = 0;
  constructor(private readonly apiKey: string, private readonly fetchImpl: typeof fetch = fetch) {}

  async search(q: string): Promise<SerpResponse> {
    this.requests++;
    const res = await this.fetchImpl(URL, { method: "POST", headers: { "Content-Type": "application/json", "X-API-KEY": this.apiKey }, body: JSON.stringify({ q, gl: "in", hl: "en", num: 10 }) });
    if (!res.ok) throw new Error(`serper ${res.status}: ${(await res.text()).slice(0, 200)}`);
    return (await res.json()) as SerpResponse;
  }

  /** The Google local pack for the query: business name, address, category, phone, coordinates. */
  async places(q: string): Promise<SerpResponse> {
    this.requests++;
    const res = await this.fetchImpl(PLACES_URL, { method: "POST", headers: { "Content-Type": "application/json", "X-API-KEY": this.apiKey }, body: JSON.stringify({ q, gl: "in", hl: "en" }) });
    if (!res.ok) throw new Error(`serper places ${res.status}: ${(await res.text()).slice(0, 200)}`);
    return (await res.json()) as SerpResponse;
  }
}
