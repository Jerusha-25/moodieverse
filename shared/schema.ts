import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const moodEntries = pgTable("mood_entries", {
  id: serial("id").primaryKey(),
  mood: text("mood").notNull(), // happy, good, neutral, sad, anxious
  journal: text("journal"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  aiPrompt: text("ai_prompt"),
  promptCompleted: boolean("prompt_completed").default(false),
});

export const kindnessMessages = pgTable("kindness_messages", {
  id: serial("id").primaryKey(),
  message: text("message").notNull(),
  isAiGenerated: boolean("is_ai_generated").default(false),
  used: boolean("used").default(false),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().default("default_user"), // For future multi-user support
  streakCount: integer("streak_count").default(0),
  lastCheckIn: timestamp("last_check_in"),
  gardenItems: jsonb("garden_items").default('{"seedlings": 0, "flowers": 0, "trees": 0}'),
  achievements: jsonb("achievements").default('[]'),
  questsCompleted: integer("quests_completed").default(0),
  milestones: jsonb("milestones").default('[]'),
  longestStreak: integer("longest_streak").default(0),
});

export const insertMoodEntrySchema = createInsertSchema(moodEntries).omit({
  id: true,
  timestamp: true,
});

export const insertKindnessMessageSchema = createInsertSchema(kindnessMessages).omit({
  id: true,
  timestamp: true,
  used: true,
  isAiGenerated: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
});

export type MoodEntry = typeof moodEntries.$inferSelect;
export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;

export type KindnessMessage = typeof kindnessMessages.$inferSelect;
export type InsertKindnessMessage = z.infer<typeof insertKindnessMessageSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
