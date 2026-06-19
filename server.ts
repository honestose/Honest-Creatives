import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Persistent file-backed DB path
const STORE_PATH = path.join(process.cwd(), "data-store.json");

// Structure of our backend data store
interface ChatMessage {
  id: string;
  sender: "user" | "bot" | "admin";
  text: string;
  time: string;
  timestamp: number;
}

interface ChatSession {
  id: string;
  name: string;
  email: string;
  mode: "ai_auto" | "active";
  messages: ChatMessage[];
  lastUpdated: number;
}

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  date: string;
  replied: boolean;
  replies: string[];
}

interface CreativeBrief {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  services: string[];
  budget: string;
  timeline: string;
  businessDescription: string;
  projectGoals: string;
  date: string;
  replied: boolean;
  replies: string[];
}

interface NewsletterEmail {
  id: string;
  email: string;
  date: string;
}

interface StoreSchema {
  chats: ChatSession[];
  contacts: ContactInquiry[];
  briefs: CreativeBrief[];
  newsletter: NewsletterEmail[];
  customContent?: {
    homeHeadline?: string;
    homeSubheadline?: string;
    aboutIntro?: string;
    contactHeader?: string;
    contactSubtitle?: string;
  };
}

// Ensure database store exists on startup
function initStore(): StoreSchema {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = fs.readFileSync(STORE_PATH, "utf8");
      const parsed = JSON.parse(data) as StoreSchema;
      if (!parsed.customContent) {
        parsed.customContent = {
          homeHeadline: "Estimate Your Project Metrics",
          homeSubheadline: "Toggle the structural capabilities you require for your digital setup below. Our dynamic algorithmic estimator will map out a precise project roadmap.",
          aboutIntro: "We translate business goals into highly functional codebases, bold digital designs, targeted marketing architectures, and magnificent live experiences.",
          contactHeader: "Get in Touch",
          contactSubtitle: "Have an ambitious project in mind? Connect with us to map out your digital trajectory."
        };
      }
      return parsed;
    }
  } catch (err) {
    console.error("[Store] Failed reading persistent store. Re-initializing...", err);
  }
  const defaultStore: StoreSchema = {
    chats: [],
    contacts: [],
    briefs: [],
    newsletter: [],
    customContent: {
      homeHeadline: "Estimate Your Project Metrics",
      homeSubheadline: "Toggle the structural capabilities you require for your digital setup below. Our dynamic algorithmic estimator will map out a precise project roadmap.",
      aboutIntro: "We translate business goals into highly functional codebases, bold digital designs, targeted marketing architectures, and magnificent live experiences.",
      contactHeader: "Get in Touch",
      contactSubtitle: "Have an ambitious project in mind? Connect with us to map out your digital trajectory."
    }
  };
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(defaultStore, null, 2), "utf8");
  } catch (err) {
    console.error("[Store] Failed writing default store:", err);
  }
  return defaultStore;
}

// Local cache in-memory to prevent disk thrashing
let dbInMemory = initStore();

function persistStore() {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(dbInMemory, null, 2), "utf8");
  } catch (err) {
    console.error("[Store] Sync error writing state to database file:", err);
  }
}

// Lazy-loaded Gemini SDK setup
let aiInstance: GoogleGenAI | null = null;
function getGeminiSDK(): GoogleGenAI | null {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("[Gemini] GEMINI_API_KEY environment variable is missing. Auto-responding with local advocate framework.");
      return null;
    }
    try {
      aiInstance = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      console.log("[Gemini] Configured server-side client successfully with target telemetry headers.");
    } catch (err) {
      console.error("[Gemini] Failed to instantiate SDK:", err);
      return null;
    }
  }
  return aiInstance;
}

// Start core Express runner
async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser middleware
  app.use(express.json());

  // API Route: Blog fetch proxy
  app.get("/api/blog", async (req, res) => {
    const perPage = (req.query.per_page as string) || "100";
    const urls = [
      `https://blog.honestcreatives.com.ng/wp-json/wp/v2/posts?_embed&per_page=${perPage}`,
      `https://honestcreatives.com.ng/blog/wp-json/wp/v2/posts?_embed&per_page=${perPage}`,
      `https://honestcreatives.com.ng/wp-json/wp/v2/posts?_embed&per_page=${perPage}`,
      `http://blog.honestcreatives.com.ng/wp-json/wp/v2/posts?_embed&per_page=${perPage}`,
      `http://honestcreatives.com.ng/blog/wp-json/wp/v2/posts?_embed&per_page=${perPage}`
    ];

    console.log(`[Proxy] Active request for blog posts with limit: ${perPage}`);
    for (const url of urls) {
      try {
        console.log(`[Proxy] Trying wordpress api domain: ${url}`);
        const response = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json"
          },
          signal: AbortSignal.timeout(6000)
        });

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            console.log(`[Proxy] Successfully fetched ${data.length} posts from ${url}`);
            res.setHeader("Cache-Control", "public, max-age=600");
            return res.json(data);
          }
        }
      } catch (err: any) {
        console.error(`[Proxy] Connection failed to ${url}: ${err?.message || err}`);
      }
    }
    return res.status(502).json({ error: "All wordpress server api requests failed or timed out", fallback: true });
  });

  // --- Support Chat Logic ---

  // Start or fetch an existing chat session by email
  app.post("/api/chats/init", (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required to open a support chat session" });
    }

    const cleanEmail = email.trim().toLowerCase();
    let session = dbInMemory.chats.find(c => c.email === cleanEmail);

    if (!session) {
      session = {
        id: "session_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
        name: name.trim(),
        email: cleanEmail,
        mode: "ai_auto",
        messages: [
          {
            id: "system_welcome_1",
            sender: "bot",
            text: `Hello ${name}! Welcome to Honest Creatives' live assistance. 👋`,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            timestamp: Date.now()
          },
          {
            id: "system_welcome_2",
            sender: "bot",
            text: "Our AI Consultant is online to map goals and answer technical questions dynamically. At any time, our senior human directors can take over this channel directly. How can we help?",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            timestamp: Date.now() + 10
          }
        ],
        lastUpdated: Date.now()
      };
      dbInMemory.chats.push(session);
      persistStore();
    }

    return res.json(session);
  });

  // Fetch session messages for active polling from frontend
  app.get("/api/chats/session", (req, res) => {
    const email = req.query.email as string;
    if (!email) {
      return res.status(400).json({ error: "Email query parameter is required" });
    }
    const cleanEmail = email.trim().toLowerCase();
    const session = dbInMemory.chats.find(c => c.email === cleanEmail);
    if (!session) {
      return res.status(404).json({ error: "Chat session not initiated" });
    }
    return res.json(session);
  });

  // Post a user message and trigger automatic AI responses if mode is ai_auto
  app.post("/api/chats/message", async (req, res) => {
    const { email, text } = req.body;
    if (!email || !text) {
      return res.status(400).json({ error: "Email and message body text are required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const session = dbInMemory.chats.find(c => c.email === cleanEmail);
    if (!session) {
      return res.status(440).json({ error: "Your session expired. Please re-register in the chat panel." });
    }

    // Capture User input
    const userMsgTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMessage: ChatMessage = {
      id: "msg_user_" + Date.now(),
      sender: "user",
      text: text.trim(),
      time: userMsgTime,
      timestamp: Date.now()
    };
    session.messages.push(userMessage);
    session.lastUpdated = Date.now();
    persistStore();

    // If chat is in auto mode, call our Gemini framework on the backend
    if (session.mode === "ai_auto") {
      const ai = getGeminiSDK();
      let botResponseText = "";

      if (ai) {
        try {
          // Prepare chat threads context
          const systemContext = `You are the Honest Creatives AI Brand Consultant or Client Officer.
Honest Creatives (honestcreatives.com.ng) is an elite, transparent creative & digital agency.
Our operational addresses: "4 Ino Ingang Cl, Adeba Bus Stop, Lakowe, Ibeju Lekki, Lagos, Nigeria"
Hotline: (+234) 915 649 8230, Email: support@honestcreatives.com.ng
Capabilities:
- Website Design: High-performance, pixel-perfect, custom React + Tailwind code with average 98% Lighthouse speeds. (No cheap prebuilt templates!)
- Digital Design: Complete brand identity, cohesive typography sheets, premium logos, business manuals.
- Digital Marketing: Multi-channel ROI ad planning, data tracking pipelines, growth systems.
- SEO Services: Technical schema repair, organic keywords maps, regional Google My Business ranking.
- Event Planning Services: Brand pop-ups, product stages, vendors schedules, scenery setups.
Instructions:
1. Always be professional, transparent, helpful, and highly clear (never use fluffy jargon or fake claims).
2. Answer queries related to the services of Honest Creatives or direct them on how to fill out a brief.
3. Be friendly and conversational! Keep responses concise (under 3 or 4 normal sentences), readable, and focused.
4. Keep the customer's name (${session.name}) in context.`;

          // Format context history for generateContent
          const historyText = session.messages.slice(-8).map(msg => `${msg.sender === "user" ? "User" : "Consultant"}: ${msg.text}`).join("\n");
          
          const rawPrompt = `System Context:\n${systemContext}\n\nClient Conversation History:\n${historyText}\n\nGenerate the next agency Response:`;

          const result = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: rawPrompt,
            config: {
              temperature: 0.7,
              systemInstruction: "You are an elite digital agency brand representative answering live queries concisely. Always write with professional integrity."
            }
          });

          botResponseText = result.text ? result.text.trim() : "";
        } catch (err) {
          console.error("[Gemini] API execution error:", err);
          botResponseText = "";
        }
      }

      // If Gemini fails or key is missing, utilize active client-representative fallback
      if (!botResponseText) {
        if (text.toLowerCase().includes("hello") || text.toLowerCase().includes("hi")) {
          botResponseText = `Hello ${session.name}! Thanks for saying hi. Outlining a project brief takes under 5 minutes on our Send Brief page. How can we serve your brand goals today?`;
        } else if (text.toLowerCase().includes("price") || text.toLowerCase().includes("cost") || text.toLowerCase().includes("money") || text.toLowerCase().includes("budget")) {
          botResponseText = `Our pricing matrix at Honest Creatives depends completely on specific deliverables. You can detail your requirements using our Estimator on the homepage, or submit a Brief. We prioritize absolute cost transparency.`;
        } else if (text.toLowerCase().includes("location") || text.toLowerCase().includes("address") || text.toLowerCase().includes("office") || text.toLowerCase().includes("lagos")) {
          botResponseText = `Our studio is located at: 4 Ino Ingang Cl, Adeba Bus Stop, Lakowe, Ibeju Lekki, Lagos. We love to host branding workshops! Feel free to stop by or call (+234) 915 649 8230.`;
        } else {
          botResponseText = `Excellent question, ${session.name}! We have recorded this message safely inside our database. Our expert directors can analyze this directly and send an email or telephone roadmap in under 24 hours. Let us know if there is anything else you'd like to map out.`;
        }
      }

      const botMessage: ChatMessage = {
        id: "msg_bot_" + Date.now(),
        sender: "bot",
        text: botResponseText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        timestamp: Date.now() + 100
      };
      session.messages.push(botMessage);
      persistStore();
    }

    return res.json(session);
  });

  // --- Static Form Submissions Syncing with CMS ---

  // Save Contact Inquiry
  app.post("/api/contact", (req, res) => {
    const { name, email, phone, service, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and core message are required" });
    }

    const inquiry: ContactInquiry = {
      id: "contact_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      name: name.trim(),
      email: email.trim(),
      phone: (phone || "").trim(),
      service: service || "other",
      message: message.trim(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      replied: false,
      replies: []
    };

    dbInMemory.contacts.unshift(inquiry);
    persistStore();
    return res.json({ success: true, inquiry });
  });

  // Save Creative Brief
  app.post("/api/briefs", (req, res) => {
    const {
      fullName,
      email,
      phone,
      companyName,
      services,
      budget,
      timeline,
      businessDescription,
      projectGoals
    } = req.body;

    if (!fullName || !email || !businessDescription || !projectGoals) {
      return res.status(400).json({ error: "Missing required fields to submit core creative brief." });
    }

    const brief: CreativeBrief = {
      id: "brief_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
      fullName: fullName.trim(),
      email: email.trim(),
      phone: (phone || "").trim(),
      companyName: (companyName || "N/A").trim(),
      services: Array.isArray(services) ? services : [],
      budget: budget || "under-500k",
      timeline: timeline || "urgent",
      businessDescription: businessDescription.trim(),
      projectGoals: projectGoals.trim(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      replied: false,
      replies: []
    };

    dbInMemory.briefs.unshift(brief);
    persistStore();
    return res.json({ success: true, brief });
  });

  // Save Newsletter Subscription
  app.post("/api/newsletter", (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "A valid email address is required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const exists = dbInMemory.newsletter.some(n => n.email === cleanEmail);

    if (!exists) {
      const newsItem: NewsletterEmail = {
        id: "news_" + Date.now(),
        email: cleanEmail,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      };
      dbInMemory.newsletter.unshift(newsItem);
      persistStore();
    }

    return res.json({ success: true, message: "Subscription logged successfully." });
  });

  // --- CMS Dashboard Admin Control APIs ---

  // Public GET route to fetch dynamic content
  app.get("/api/content", (req, res) => {
    return res.json(dbInMemory.customContent || {});
  });

  // Secure POST route to modify content - strictly for user xtremelyhonest@gmail.com
  app.post("/api/cms/update-content", (req, res) => {
    const { email, content } = req.body;
    if (!email || email.trim().toLowerCase() !== "xtremelyhonest@gmail.com") {
      return res.status(403).json({ error: "Unauthorized access. Only xtremelyhonest@gmail.com can edit website contents." });
    }
    if (!content) {
      return res.status(400).json({ error: "Missing updated content body" });
    }

    dbInMemory.customContent = {
      ...dbInMemory.customContent,
      ...content
    };
    persistStore();

    return res.json({ success: true, customContent: dbInMemory.customContent });
  });

  // Load compiled CMS elements
  app.get("/api/cms/data", (req, res) => {
    // Return all data safely (includes chats, contacts, briefs, newsletters)
    return res.json({
      chatsCount: dbInMemory.chats.length,
      contactsCount: dbInMemory.contacts.length,
      briefsCount: dbInMemory.briefs.length,
      newsletterCount: dbInMemory.newsletter.length,
      chats: dbInMemory.chats,
      contacts: dbInMemory.contacts,
      briefs: dbInMemory.briefs,
      newsletter: dbInMemory.newsletter,
      customContent: dbInMemory.customContent || {}
    });
  });

  // Handle direct Admin operator message reply in support chat
  app.post("/api/cms/reply-chat", (req, res) => {
    const { sessionId, text } = req.body;
    if (!sessionId || !text) {
      return res.status(400).json({ error: "Session ID and reply message body are required" });
    }

    const session = dbInMemory.chats.find(c => c.id === sessionId);
    if (!session) {
      return res.status(404).json({ error: "Active support chat session was not found" });
    }

    // Append Admin/Human message
    const replyMsgTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const adminMessage: ChatMessage = {
      id: "msg_admin_" + Date.now(),
      sender: "admin",
      text: text.trim(),
      time: replyMsgTime,
      timestamp: Date.now()
    };

    session.messages.push(adminMessage);
    // Crucial: Set mode to 'active' so Human chat dominates and AI doesn't double-respond to user inputs! Let there be direct human operator.
    session.mode = "active";
    session.lastUpdated = Date.now();

    persistStore();

    return res.json({ success: true, session });
  });

  // Toggle Support Chat session mode (AI vs Human direct operator)
  app.post("/api/cms/toggle-chat-mode", (req, res) => {
    const { sessionId, mode } = req.body;
    if (!sessionId || !mode) {
      return res.status(400).json({ error: "Session ID and mode are required" });
    }

    const session = dbInMemory.chats.find(c => c.id === sessionId);
    if (!session) {
      return res.status(404).json({ error: "Support chat session was not found" });
    }

    session.mode = mode as "ai_auto" | "active";
    persistStore();

    return res.json({ success: true, session });
  });

  // Log a reply to a Contact Message
  app.post("/api/cms/reply-contact", (req, res) => {
    const { contactId, text } = req.body;
    if (!contactId || !text) {
      return res.status(400).json({ error: "Contact ID and response text are required" });
    }

    const inquiry = dbInMemory.contacts.find(c => c.id === contactId);
    if (!inquiry) {
      return res.status(404).json({ error: "Contact inquiry was not found" });
    }

    inquiry.replies.push(text.trim());
    inquiry.replied = true;
    persistStore();

    return res.json({ success: true, inquiry });
  });

  // Log a reply to a Creative Brief
  app.post("/api/cms/reply-brief", (req, res) => {
    const { briefId, text } = req.body;
    if (!briefId || !text) {
      return res.status(400).json({ error: "Brief ID and response text are required" });
    }

    const brief = dbInMemory.briefs.find(b => b.id === briefId);
    if (!brief) {
      return res.status(404).json({ error: "Briefing form entry was not found" });
    }

    brief.replies.push(text.trim());
    brief.replied = true;
    persistStore();

    return res.json({ success: true, brief });
  });

  // Simple clearing of database store lists (for testing/purposes)
  app.delete("/api/cms/clear-newsletter", (req, res) => {
    dbInMemory.newsletter = [];
    persistStore();
    return res.json({ success: true });
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", environment: process.env.NODE_ENV || "development", data_records: dbInMemory.newsletter.length });
  });

  // Integration of Vite Dev Middleware
  if (process.env.NODE_ENV !== "production") {
    console.log("[Server] Mounting Vite developer middleware mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[Server] Serving production static asset compilation...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical error starting Express + Vite server:", err);
});
