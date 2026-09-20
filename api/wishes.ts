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

// In-memory store for wishes (persists within serverless container lifecycle)
let communityWishes: Array<{
  id: string;
  sender: string;
  message: string;
  theme: string;
  createdAt: string;
}> = [
  {
    id: "1",
    sender: "অজয় সরকার",
    message: "শুভ শারদীয়া! মা দুর্গার আশীর্বাদে সবার জীবন আনন্দ ও শান্তিতে ভরে উঠুক।",
    theme: "royal-maroon",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "2",
    sender: "প্রিয়া সেন",
    message: "সকল বন্ধুদের জানাই শারদীয়ার আন্তরিক প্রীতি ও শুভেচ্ছা। পুজোর আনন্দে মেতে ওঠো সবাই!",
    theme: "dhunuchi-orange",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  }
];

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

  if (req.method === "GET") {
    res.status(200).json(communityWishes);
    return;
  }

  if (req.method === "POST") {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (_e) {
        body = {};
      }
    }
    const { sender, message, theme } = body || {};
    if (!sender || !message) {
      res.status(400).json({ error: "Sender and message are required" });
      return;
    }

    const newWish = {
      id: Date.now().toString(),
      sender: sender.trim(),
      message: message.trim(),
      theme: theme || "royal-maroon",
      createdAt: new Date().toISOString(),
    };

    communityWishes.unshift(newWish);
    if (communityWishes.length > 50) {
      communityWishes = communityWishes.slice(0, 50);
    }

    res.status(200).json({ success: true, wish: newWish });
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
