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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).send("OK");
    return;
  }

  const id = (req.query?.id as string) || "";
  const shortCards = (global as any).__SHORT_CARDS_MAP;
  const card = shortCards ? shortCards.get(id) : null;

  if (!card) {
    res.status(404).json({ error: "Card not found" });
    return;
  }

  res.status(200).json({ success: true, card });
}
