import type { IncomingMessage, ServerResponse } from "http";

interface VercelRequest extends IncomingMessage {
  body: any;
  query: { [key: string]: string | string[] };
  method?: string;
}

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (body: any) => void;
  send: (body: any) => void;
}

interface StoredCard {
  id: string;
  from: string;
  to: string;
  message: string;
  theme: string;
  imageUrl?: string;
  createdAt: string;
}

// Global cache for serverless environment
declare global {
  // eslint-disable-next-line no-var
  var __SHORT_CARDS_MAP: Map<string, StoredCard> | undefined;
}

if (!global.__SHORT_CARDS_MAP) {
  global.__SHORT_CARDS_MAP = new Map<string, StoredCard>();
  global.__SHORT_CARDS_MAP.set("durga26", {
    id: "durga26",
    from: "অজয় সরকার",
    to: "সকল ভক্তবৃন্দ",
    message: "শুভ শারদীয়া ২০২৬! মা দুর্গার আশীর্বাদে আপনার জীবন অনাবিল আনন্দ ও সুখ-শান্তিতে ভরে উঠুক।",
    theme: "royal-maroon",
    imageUrl: "/durga_art.jpg",
    createdAt: new Date().toISOString(),
  });
}

const shortCards = global.__SHORT_CARDS_MAP;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).send("OK");
    return;
  }

  // GET /api/cards?id=xyz
  if (req.method === "GET") {
    const id = (req.query?.id as string) || "";
    if (!id) {
      res.status(400).json({ error: "Card ID is required" });
      return;
    }
    const card = shortCards.get(id);
    if (!card) {
      res.status(404).json({ error: "Card not found" });
      return;
    }
    res.status(200).json({ success: true, card });
    return;
  }

  // POST /api/cards
  if (req.method === "POST") {
    try {
      let body = req.body;
      if (typeof body === "string") {
        try {
          body = JSON.parse(body);
        } catch (_e) {
          body = {};
        }
      }
      const { from, to, message, theme, imageUrl } = body || {};
      if (!from || !to || !message) {
        res.status(400).json({ error: "From, to, and message are required" });
        return;
      }

      const chars = "abcdefghjkmnpqrstuvwxyz23456789";
      let id = "";
      for (let i = 0; i < 6; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      const card: StoredCard = {
        id,
        from: from.trim(),
        to: to.trim(),
        message: message.trim(),
        theme: theme || "royal-maroon",
        imageUrl: imageUrl || "",
        createdAt: new Date().toISOString(),
      };

      shortCards.set(id, card);

      const host = req.headers.host || "localhost:3000";
      const proto = req.headers["x-forwarded-proto"] || "https";
      const directShortUrl = `${proto}://${host}/?c=${id}`;

      let tinyUrl = "";
      try {
        const tinyRes = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(directShortUrl)}`, {
          signal: AbortSignal.timeout(2500),
        });
        if (tinyRes.ok) {
          tinyUrl = (await tinyRes.text()).trim();
        }
      } catch (_e) {
        // Safe fallback
      }

      res.status(200).json({
        success: true,
        id,
        shortUrl: directShortUrl,
        tinyUrl: tinyUrl || directShortUrl,
        card,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to create card" });
    }
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
