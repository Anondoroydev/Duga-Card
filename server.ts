import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

// Path for persistent card storage
const CARDS_FILE_PATH = path.join(process.cwd(), "data", "cards.json");

// Ensure data folder exists
try {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
} catch (_e) {
  // Ignore
}

app.use(express.json());

// In-memory storage for community wishes wall
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
    message: "সকল বন্ধুদের জানাই শারদীয়ার আন্তরিক প্রীতি ও শুভেচ্ছা। পালের আনন্দে মেতে ওঠো সবাই!",
    theme: "dhunuchi-orange",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  }
];

// API: Generate AI Wish using Gemini
app.post("/api/generate-wish", async (req, res) => {
  try {
    const { sender, recipient, relationship, mood } = req.body;

    const rawApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || "";
    const apiKey = rawApiKey.replace(/^["']|["']$/g, "").trim();
    let generatedText = "";

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const prompt = `Write a warm, festive, and heartfelt Durga Puja greeting message in Bengali (with optional English translation or mixed friendly tone if appropriate, but primarily in lyrical Bengali) from "${sender || 'A friend'}" to "${recipient || 'Friend'}".
Relationship: ${relationship || 'friend'}
Tone/Mood: ${mood || 'joyful and traditional'}
Keep it between 2 to 4 sentences, touching upon Maa Durga, Pujo vibes, dhak, and happiness. Do not include quotes around the output, just the message text.`;

        // Prioritize high-capacity, low-latency models to prevent 503 spikes
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
            // Silently proceed to next candidate model
          }
        }
      } catch (_initErr) {
        // Fallback to festive generator
      }
    }

    // Graceful festive fallback if key missing or temporary high demand
    if (!generatedText) {
      const fromName = sender?.trim() || "আপনার শুভাকাঙ্ক্ষী";
      const toName = recipient?.trim() || "প্রিয় সুহৃদ";
      const rel = (relationship || "friend").toLowerCase();

      if (rel.includes("love") || rel.includes("ভালোবাসা")) {
        generatedText = `প্রিয় ${toName}, শারদীয়ার আলোর রোশনাইয়ে তোমাকে জানাই হৃদয়ের গভীরতম ভালোবাসা। কাশফুলের শুভ্রতা আর অষ্টমীর পবিত্র অঞ্জলির মতো আমাদের বন্ধন চিরন্তন হোক। মা দুর্গা তোমার জীবন অনাবিল আনন্দে ভরিয়ে তুলুন। শুভ শারদীয়া! — ${fromName}`;
      } else if (rel.includes("family") || rel.includes("পরিবার") || rel.includes("elder") || rel.includes("গুরুজন")) {
        generatedText = `শ্রদ্ধেয় ${toName}, শারদ উৎসবের পুণ্যলগ্নে জানাই সশ্রদ্ধ প্রণাম ও আন্তরিক শুভেচ্ছা। মা দুর্গার স্বর্গীয় আশীর্বাদে আপনার ও সমগ্র পরিবারের দিনগুলি সুখ, সুস্বাস্থ্য ও পরম শান্তিতে ভরে উঠুক। শুভ দুর্গোৎসব! — ${fromName}`;
      } else {
        const fallbacks = [
          `প্রিয় ${toName}, আপনাকে ও আপনার পরিবারকে জানাই শারদীয়ার আন্তরিক প্রীতি ও শুভেচ্ছা। মা দুর্গার আশীর্বাদে জীবন ভরে উঠুক অপার আনন্দ ও সাফল্যে। শুভ দুর্গোৎসব! — ${fromName}`,
          `${toName}, ঢাকের বাদ্যি আর কাশফুলের দোলায় শারদ উৎসবের শুভলগ্নে জানাই অফুরন্ত শুভেচ্ছা ও ভালোবাসা। পুজোর প্রতিটি দিন আনন্দময় হোক। শুভ শারদীয়া! — ${fromName}`,
          `শুভ শারদীয়া, ${toName}! দেবী দুর্গার ঐশ্বরিক কৃপায় আপনার জীবনের সব বাধা দূর হোক এবং সুখ-শান্তি বজায় থাকুক। ইতি, ${fromName}`
        ];
        generatedText = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      }
    }

    res.json({ success: true, message: generatedText });
  } catch (error: any) {
    const fromName = req.body?.sender?.trim() || "শুভেচ্ছান্তে";
    const toName = req.body?.recipient?.trim() || "প্রিয়";
    res.json({
      success: true,
      message: `প্রিয় ${toName}, শারদীয়ার এই পুণ্য লগ্নে জানাই অনেক অনেক শুভেচ্ছা ও আন্তরিক ভালোবাসা। মা দুর্গার আশীর্বাদে আপনার জীবন আলোকিত হোক। শুভ শারদীয়া! — ${fromName}`
    });
  }
});

// API: Get Community Wishes
app.get("/api/wishes", (req, res) => {
  res.json(communityWishes);
});

// API: Post Community Wish
app.post("/api/wishes", (req, res) => {
  const { sender, message, theme } = req.body;
  if (!sender || !message) {
    return res.status(400).json({ error: "Sender and message are required" });
  }

  const newWish = {
    id: Date.now().toString(),
    sender: sender.trim(),
    message: message.trim(),
    theme: theme || "royal-maroon",
    createdAt: new Date().toISOString(),
  };

  communityWishes.unshift(newWish);
  // Keep max 50 recent
  if (communityWishes.length > 50) {
    communityWishes = communityWishes.slice(0, 50);
  }

  res.json({ success: true, wish: newWish });
});

// In-memory persistent store for shortened greeting cards with disk backup
interface StoredCard {
  id: string;
  from: string;
  to: string;
  message: string;
  theme: string;
  imageUrl?: string;
  createdAt: string;
}

const shortCards = new Map<string, StoredCard>();

// Load previously saved cards from disk on startup
function loadCardsFromDisk() {
  try {
    if (fs.existsSync(CARDS_FILE_PATH)) {
      const content = fs.readFileSync(CARDS_FILE_PATH, "utf-8");
      const list: StoredCard[] = JSON.parse(content);
      if (Array.isArray(list)) {
        for (const card of list) {
          if (card && card.id) {
            shortCards.set(card.id, card);
          }
        }
      }
    }
  } catch (err) {
    console.error("Failed to load cards from disk:", err);
  }
}

function saveCardsToDisk() {
  try {
    const list = Array.from(shortCards.values());
    fs.writeFileSync(CARDS_FILE_PATH, JSON.stringify(list, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save cards to disk:", err);
  }
}

loadCardsFromDisk();

// Seed a sample greeting card if empty
if (!shortCards.has("durga26")) {
  const seedCard: StoredCard = {
    id: "durga26",
    from: "অজয় সরকার",
    to: "সকল ভক্তবৃন্দ",
    message: "শুভ শারদীয়া ২০২৬! মা দুর্গার আশীর্বাদে আপনার জীবন অনাবিল আনন্দ ও সুখ-শান্তিতে ভরে উঠুক।",
    theme: "royal-maroon",
    imageUrl: "/slide1.jpg",
    createdAt: new Date().toISOString(),
  };
  shortCards.set("durga26", seedCard);
  saveCardsToDisk();
}

// API: Create short card link
app.post("/api/cards", async (req, res) => {
  try {
    const { from, to, message, theme, imageUrl } = req.body;
    if (!from || !to || !message) {
      return res.status(400).json({ error: "From, to, and message are required" });
    }

    // Generate short 6-character alphanumeric code
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
    saveCardsToDisk();

    // Determine correct public origin (respect reverse proxy headers)
    const host = req.get("x-forwarded-host") || req.get("host") || "localhost:3000";
    const proto = req.get("x-forwarded-proto") || req.protocol || "https";
    const publicOrigin = req.headers.origin || `${proto}://${host}`;
    const directShortUrl = `${publicOrigin}/?c=${id}`;

    res.json({
      success: true,
      id,
      shortUrl: directShortUrl,
      card,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to create short card" });
  }
});

// API: Get card by ID (supports short ID, disk lookup, or direct base64 encoded token)
app.get("/api/cards/:id", (req, res) => {
  const paramId = req.params.id;
  let card = shortCards.get(paramId);

  // If not in memory, re-read disk
  if (!card && fs.existsSync(CARDS_FILE_PATH)) {
    loadCardsFromDisk();
    card = shortCards.get(paramId);
  }

  // If still not found, check if the ID itself is a base64url encoded card
  if (!card && paramId.length > 20) {
    try {
      let clean = paramId.trim().replace(/-/g, '+').replace(/_/g, '/');
      while (clean.length % 4 !== 0) clean += '=';
      const jsonStr = Buffer.from(clean, 'base64').toString('utf-8');
      const parsed = JSON.parse(jsonStr);
      if (parsed && (parsed.f || parsed.from || parsed.m || parsed.message)) {
        card = {
          id: paramId,
          from: parsed.f || parsed.from || '',
          to: parsed.t || parsed.to || '',
          message: parsed.m || parsed.message || '',
          theme: parsed.th || parsed.theme || 'royal-maroon',
          imageUrl: parsed.i || parsed.imageUrl || '',
          createdAt: new Date().toISOString(),
        };
      }
    } catch (_e) {
      // Not a valid base64 token
    }
  }

  if (!card) {
    return res.status(404).json({ error: "Card not found" });
  }
  res.json({ success: true, card });
});

// Serve static audio assets with proper MIME types and range request support
app.use('/audio', express.static(path.join(process.cwd(), 'public/audio')));
app.use(express.static(path.join(process.cwd(), 'public')));

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Durga Puja Greetings Server running on http://localhost:${PORT}`);
  });
}

startServer();
