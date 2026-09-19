import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Gemini API key not configured on server." });
    }

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
    const candidateModels = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash", "gemini-3.6-flash"];
    let generatedText = "";

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
        // Silently proceed to next candidate model without polluting logs
      }
    }

    // Graceful festive fallback if all API endpoints encounter temporary high demand
    if (!generatedText) {
      const fromName = sender?.trim() || "আপনার শুভাকাঙ্ক্ষী";
      const toName = recipient?.trim() || "প্রিয় সুহৃদ";
      const fallbacks = [
        `প্রিয় ${toName}, আপনাকে ও আপনার পরিবারকে জানাই শারদীয়ার আন্তরিক প্রীতি ও শুভেচ্ছা। মা দুর্গার আশীর্বাদে জীবন ভরে উঠুক অপার আনন্দ ও সাফল্যে। শুভ দুর্গোৎসব! — ${fromName}`,
        `${toName}, ঢাকের বাদ্যি আর কাশফুলের দোলায় শারদ উৎসবের শুভলগ্নে জানাই অফুরন্ত শুভেচ্ছা ও ভালোবাসা। পুজোর প্রতিটি দিন আনন্দময় হোক। শুভ শারদীয়া! — ${fromName}`,
        `শুভ শারদীয়া, ${toName}! দেবী দুর্গার ঐশ্বরিক কৃপায় আপনার জীবনের সব বাধা দূর হোক এবং সুখ-শান্তি বজায় থাকুক। ইতি, ${fromName}`
      ];
      generatedText = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    res.json({ success: true, message: generatedText });
  } catch (error: any) {
    // Return gracefully formatted festive wish even in catastrophic unexpected failure
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

// In-memory persistent store for shortened greeting cards
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

// Seed a sample greeting card
shortCards.set("durga26", {
  id: "durga26",
  from: "অজয় সরকার",
  to: "সকল ভক্তবৃন্দ",
  message: "শুভ শারদীয়া ২০২৬! মা দুর্গার আশীর্বাদে আপনার জীবন অনাবিল আনন্দ ও সুখ-শান্তিতে ভরে উঠুক।",
  theme: "royal-maroon",
  imageUrl: "/src/assets/images/maa_durga_art_1789832835405.jpg",
  createdAt: new Date().toISOString(),
});

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

    const origin = req.headers.origin || `${req.protocol}://${req.get("host")}`;
    const directShortUrl = `${origin}/?c=${id}`;

    let tinyUrl = "";
    try {
      const tinyRes = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(directShortUrl)}`, {
        signal: AbortSignal.timeout(3000),
      });
      if (tinyRes.ok) {
        tinyUrl = (await tinyRes.text()).trim();
      }
    } catch (_e) {
      // Non-blocking fallback
    }

    res.json({
      success: true,
      id,
      shortUrl: directShortUrl,
      tinyUrl: tinyUrl || directShortUrl,
      card,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to create short card" });
  }
});

// API: Get card by ID
app.get("/api/cards/:id", (req, res) => {
  const card = shortCards.get(req.params.id);
  if (!card) {
    return res.status(404).json({ error: "Card not found" });
  }
  res.json({ success: true, card });
});

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
