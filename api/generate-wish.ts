import type { IncomingMessage, ServerResponse } from "http";
import { GoogleGenAI } from "@google/genai";

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

function getFallbackWish(sender?: string, recipient?: string, relationship?: string, mood?: string): string {
  const fromName = sender?.trim() || "আপনার শুভাকাঙ্ক্ষী";
  const toName = recipient?.trim() || "প্রিয় সুহৃদ";
  const rel = (relationship || "friend").toLowerCase();

  if (rel.includes("love") || rel.includes("ভালোবাসা")) {
    return `প্রিয় ${toName}, শারদীয়ার আলোর রোশনাইয়ে তোমাকে জানাই হৃদয়ের গভীরতম ভালোবাসা। কাশফুলের শুভ্রতা আর অষ্টমীর পবিত্র অঞ্জলির মতো আমাদের প্রেম চিরন্তন হোক। মা দুর্গা তোমার জীবন আনন্দে ভরিয়ে তুলুন। শুভ শারদীয়া! — ${fromName}`;
  }

  if (rel.includes("family") || rel.includes("পরিবার") || rel.includes("elder") || rel.includes("গুরুজন")) {
    return `শ্রদ্ধেয় ${toName}, শারদ উৎসবের পুণ্যলগ্নে জানাই সশ্রদ্ধ প্রণাম ও আন্তরিক শুভেচ্ছা। মা দুর্গার স্বর্গীয় আশীর্বাদে আপনার ও সমগ্র পরিবারের দিনগুলি সুখ, সুস্বাস্থ্য ও শান্তিতে ভরে উঠুক। শুভ শারদীয়া! — ${fromName}`;
  }

  const general = [
    `প্রিয় ${toName}, ঢাকের কাঠি আর কাশের দোলায় শারদ উৎসবের শুভলগ্নে জানাই আন্তরিক প্রীতি ও শারদীয় শুভেচ্ছা। দেবী দুর্গার কৃপায় আপনার জীবন সাফল্য ও আনন্দে আলোকিত হোক। শুভ দুর্গোৎসব! — ${fromName}`,
    `শুভ শারদীয়া, ${toName}! ঢাকের মিষ্টি ধ্বনি, শিউলির সুবাস আর মা দুর্গার স্নেহাশিসে দূর হোক সব গ্লানি। আপনার ও আপনার পরিবারের জন্য রইল অফুরন্ত আনন্দ ও সমৃদ্ধির প্রার্থনা। ইতি, ${fromName}`,
    `শারদ উৎসবের পুণ্য তিথিতে জানাই একরাশ প্রীতি ও শুভেচ্ছা, ${toName}। মা দুর্গার আগমনে আপনার জীবনে আসুক নতুন উদ্দীপনা ও অনন্ত খুশি। শুভ শারদীয়া! — ${fromName}`
  ];

  return general[Math.floor(Math.random() * general.length)];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
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

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (_e) {
        body = {};
      }
    }
    const { sender, recipient, relationship, mood } = body || {};

    const rawApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || "";
    const apiKey = rawApiKey.replace(/^["']|["']$/g, "").trim();

    let generatedText = "";

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });

        const prompt = `Write a warm, festive, and heartfelt Durga Puja greeting message in Bengali from "${sender || 'A friend'}" to "${recipient || 'Friend'}".
Relationship: ${relationship || 'friend'}
Tone/Mood: ${mood || 'joyful and traditional'}
Keep it between 2 to 4 sentences, touching upon Maa Durga, Pujo vibes, dhak, and happiness. Do not include quotes around the output, just the message text in lyrical Bengali.`;

        const candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
        for (const model of candidateModels) {
          try {
            const response = await ai.models.generateContent({
              model,
              contents: prompt,
            });
            if (response.text && response.text.trim()) {
              generatedText = response.text.trim();
              break;
            }
          } catch (_err) {
            // Try next candidate model
          }
        }
      } catch (_apiErr) {
        // Fallback below
      }
    }

    if (!generatedText) {
      generatedText = getFallbackWish(sender, recipient, relationship, mood);
    }

    res.status(200).json({ success: true, message: generatedText });
  } catch (error: any) {
    const fallback = getFallbackWish();
    res.status(200).json({ success: true, message: fallback });
  }
}
