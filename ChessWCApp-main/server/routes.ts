import type { Express } from "express";
import { createServer, type Server } from "http";
import { readFileSync } from "fs";
import { join } from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/champions", (req, res) => {
    try {
      const championsPath = join(process.cwd(), "data", "champions.json");
      const championsData = readFileSync(championsPath, "utf-8");
      const champions = JSON.parse(championsData);
      res.json(champions);
    } catch (error) {
      console.error("Error loading champions:", error);
      res.status(500).json({ error: "Failed to load champions data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
