import { 
  moodEntries, 
  kindnessMessages, 
  userProgress, 
  type MoodEntry, 
  type KindnessMessage, 
  type UserProgress,
  type InsertMoodEntry,
  type InsertKindnessMessage,
  type InsertUserProgress
} from "@shared/schema";

export interface IStorage {
  // Mood entries
  createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry>;
  getMoodEntries(limit?: number): Promise<MoodEntry[]>;
  updateMoodEntry(id: number, updates: Partial<MoodEntry>): Promise<MoodEntry | undefined>;
  
  // Kindness messages
  createKindnessMessage(message: InsertKindnessMessage): Promise<KindnessMessage>;
  getUnusedKindnessMessage(): Promise<KindnessMessage | undefined>;
  markMessageAsUsed(id: number): Promise<void>;
  
  // User progress
  getUserProgress(userId?: string): Promise<UserProgress | undefined>;
  updateUserProgress(userId: string, updates: Partial<UserProgress>): Promise<UserProgress>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
}

export class MemStorage implements IStorage {
  private moodEntries: Map<number, MoodEntry>;
  private kindnessMessages: Map<number, KindnessMessage>;
  private userProgress: Map<string, UserProgress>;
  private currentMoodId: number;
  private currentMessageId: number;
  private currentProgressId: number;

  constructor() {
    this.moodEntries = new Map();
    this.kindnessMessages = new Map();
    this.userProgress = new Map();
    this.currentMoodId = 1;
    this.currentMessageId = 1;
    this.currentProgressId = 1;

    // Initialize default user progress
    this.userProgress.set("default_user", {
      id: 1,
      userId: "default_user",
      streakCount: 0,
      lastCheckIn: null,
      gardenItems: { seedlings: 0, flowers: 0, trees: 0 },
      achievements: [],
      questsCompleted: 0,
      milestones: [],
      longestStreak: 0,
    });
  }

  async createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry> {
    const id = this.currentMoodId++;
    const moodEntry: MoodEntry = {
      id,
      mood: entry.mood,
      journal: entry.journal || null,
      timestamp: new Date(),
      aiPrompt: entry.aiPrompt || null,
      promptCompleted: entry.promptCompleted || false,
    };
    this.moodEntries.set(id, moodEntry);
    return moodEntry;
  }

  async getMoodEntries(limit = 30): Promise<MoodEntry[]> {
    const entries = Array.from(this.moodEntries.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
    return entries;
  }

  async updateMoodEntry(id: number, updates: Partial<MoodEntry>): Promise<MoodEntry | undefined> {
    const entry = this.moodEntries.get(id);
    if (!entry) return undefined;
    
    const updated = { ...entry, ...updates };
    this.moodEntries.set(id, updated);
    return updated;
  }

  async createKindnessMessage(message: InsertKindnessMessage): Promise<KindnessMessage> {
    const id = this.currentMessageId++;
    const kindnessMessage: KindnessMessage = {
      ...message,
      id,
      timestamp: new Date(),
      used: false,
      isAiGenerated: false,
    };
    this.kindnessMessages.set(id, kindnessMessage);
    return kindnessMessage;
  }

  async getUnusedKindnessMessage(): Promise<KindnessMessage | undefined> {
    const unused = Array.from(this.kindnessMessages.values()).find(msg => !msg.used);
    return unused;
  }

  async markMessageAsUsed(id: number): Promise<void> {
    const message = this.kindnessMessages.get(id);
    if (message) {
      message.used = true;
      this.kindnessMessages.set(id, message);
    }
  }

  async getUserProgress(userId = "default_user"): Promise<UserProgress | undefined> {
    return this.userProgress.get(userId);
  }

  async updateUserProgress(userId: string, updates: Partial<UserProgress>): Promise<UserProgress> {
    const existing = this.userProgress.get(userId);
    if (!existing) {
      throw new Error("User progress not found");
    }
    
    const updated = { ...existing, ...updates };
    this.userProgress.set(userId, updated);
    return updated;
  }

  async createUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const id = this.currentProgressId++;
    const userProgress: UserProgress = {
      id,
      userId: progress.userId || "default_user",
      streakCount: progress.streakCount || 0,
      lastCheckIn: progress.lastCheckIn || null,
      gardenItems: progress.gardenItems || { seedlings: 0, flowers: 0, trees: 0 },
      achievements: progress.achievements || [],
      questsCompleted: progress.questsCompleted || 0,
      milestones: progress.milestones || [],
      longestStreak: progress.longestStreak || 0,
    };
    this.userProgress.set(progress.userId || "default_user", userProgress);
    return userProgress;
  }
}

export const storage = new MemStorage();
