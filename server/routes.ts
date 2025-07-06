import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMoodEntrySchema, insertKindnessMessageSchema } from "@shared/schema";
import { generateWellnessPrompt, generateKindnessMessage } from "./services/gemini";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Mood entries
  app.post("/api/mood-entries", async (req, res) => {
    try {
      const validatedData = insertMoodEntrySchema.parse(req.body);
      
      // Generate AI prompt based on mood and journal
      let aiPrompt = null;
      try {
        aiPrompt = await generateWellnessPrompt(validatedData.mood, validatedData.journal || "");
      } catch (error) {
        console.error("Failed to generate AI prompt:", error);
      }
      
      const entry = await storage.createMoodEntry({
        ...validatedData,
        aiPrompt,
      });

      // Update user progress and streak
      const progress = await storage.getUserProgress();
      if (progress) {
        const now = new Date();
        const lastCheckIn = progress.lastCheckIn;
        const daysDiff = lastCheckIn ? Math.floor((now.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24)) : 0;
        
        let newStreakCount = progress.streakCount || 0;
        const milestones = [...(progress.milestones as string[] || [])];
        let newLongestStreak = progress.longestStreak || 0;
        
        if (daysDiff === 1) {
          // Continuing streak
          newStreakCount = (progress.streakCount || 0) + 1;
        } else if (daysDiff === 0) {
          // Same day, no change
          newStreakCount = progress.streakCount || 0;
        } else {
          // Streak broken
          newStreakCount = 1;
        }

        // Update longest streak
        if (newStreakCount > newLongestStreak) {
          newLongestStreak = newStreakCount;
        }

        // Check for streak milestones
        const streakMilestones = [3, 7, 14, 30, 50, 100];
        for (const milestone of streakMilestones) {
          if (newStreakCount === milestone && !milestones.includes(`streak_${milestone}`)) {
            milestones.push(`streak_${milestone}`);
          }
        }

        // Add garden items based on mood
        const gardenItems = { ...(progress.gardenItems as { seedlings: number; flowers: number; trees: number } || { seedlings: 0, flowers: 0, trees: 0 }) };
        if (validatedData.mood === "happy") {
          gardenItems.flowers = (gardenItems.flowers || 0) + 1;
        } else if (validatedData.mood === "good") {
          gardenItems.seedlings = (gardenItems.seedlings || 0) + 1;
        } else if (validatedData.mood === "neutral") {
          gardenItems.seedlings = (gardenItems.seedlings || 0) + 1;
        }

        // Bonus items for streaks
        if (newStreakCount >= 7) {
          gardenItems.flowers = (gardenItems.flowers || 0) + 1; // Bonus flower for week streak
        }
        if (newStreakCount >= 30) {
          gardenItems.trees = (gardenItems.trees || 0) + 1; // Bonus tree for month streak
        }

        await storage.updateUserProgress("default_user", {
          streakCount: newStreakCount,
          lastCheckIn: now,
          gardenItems,
          milestones,
          longestStreak: newLongestStreak,
        });
      }

      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: "Failed to create mood entry" });
    }
  });

  app.get("/api/mood-entries", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 30;
      const entries = await storage.getMoodEntries(limit);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mood entries" });
    }
  });

  app.patch("/api/mood-entries/:id/complete-prompt", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const entry = await storage.updateMoodEntry(id, { promptCompleted: true });
      
      if (entry) {
        // Update quest completion count
        const progress = await storage.getUserProgress();
        if (progress) {
          const gardenItems = { ...(progress.gardenItems as { seedlings: number; flowers: number; trees: number } || { seedlings: 0, flowers: 0, trees: 0 }) };
          gardenItems.trees = (gardenItems.trees || 0) + 1; // Tree for completing quest
          
          await storage.updateUserProgress("default_user", {
            questsCompleted: (progress.questsCompleted || 0) + 1,
            gardenItems,
          });
        }
      }
      
      res.json(entry);
    } catch (error) {
      res.status(500).json({ message: "Failed to update mood entry" });
    }
  });

  // Kindness messages
  app.post("/api/kindness-messages", async (req, res) => {
    try {
      const validatedData = insertKindnessMessageSchema.parse(req.body);
      const message = await storage.createKindnessMessage(validatedData);
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Failed to create kindness message" });
    }
  });

  app.get("/api/kindness-messages/random", async (req, res) => {
    try {
      let message = await storage.getUnusedKindnessMessage();
      
      // If no user messages available, generate one with AI
      if (!message) {
        try {
          const aiMessage = await generateKindnessMessage();
          const aiKindnessMessage = await storage.createKindnessMessage({
            message: aiMessage,
          });
          // Mark AI message as AI-generated
          message = { ...aiKindnessMessage, isAiGenerated: true };
        } catch (error) {
          // Fallback message if AI fails
          const fallbackMessage = await storage.createKindnessMessage({
            message: "You're doing better than you think. Every small step matters. 💙",
          });
          message = fallbackMessage;
        }
      }
      
      if (message) {
        await storage.markMessageAsUsed(message.id);
      }
      
      res.json(message);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch kindness message" });
    }
  });

  // User progress
  app.get("/api/user-progress", async (req, res) => {
    try {
      const progress = await storage.getUserProgress();
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user progress" });
    }
  });

  // Dashboard analytics
  app.get("/api/dashboard-stats", async (req, res) => {
    try {
      const entries = await storage.getMoodEntries(30);
      const progress = await storage.getUserProgress();
      
      const stats = {
        checkInsThisMonth: entries.length,
        questsCompleted: progress?.questsCompleted || 0,
        currentStreak: progress?.streakCount || 0,
        gardenItems: progress?.gardenItems || { seedlings: 0, flowers: 0, trees: 0 },
        moodTrends: entries.slice(0, 7).reverse().map(entry => ({
          date: entry.timestamp,
          mood: entry.mood,
          value: getMoodValue(entry.mood),
        })),
        averageMood: entries.length > 0 ? 
          entries.reduce((sum, entry) => sum + getMoodValue(entry.mood), 0) / entries.length : 0,
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function getMoodValue(mood: string): number {
  const moodValues: Record<string, number> = {
    happy: 5,
    good: 4,
    neutral: 3,
    sad: 2,
    anxious: 1,
  };
  return moodValues[mood] || 3;
}
