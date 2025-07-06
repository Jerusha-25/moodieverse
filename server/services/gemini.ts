import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini with API Key (from .env)
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || ""
);

const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // use "gemini-pro" or "gemini-1.5-flash"

export async function generateWellnessPrompt(mood: string, journal?: string): Promise<string> {
  try {
    const contextualInfo = journal ? `The user also shared: "${journal}"` : "";

    const prompt = `You are a compassionate wellness coach. A user has checked in with their mood as "${mood}". ${contextualInfo}

Based on their current emotional state, provide a single, personalized wellness prompt that:
- Is encouraging and supportive
- Offers a specific, actionable suggestion or reflection question
- Is appropriate for their current mood
- Is brief (1-2 sentences maximum)
- Focuses on self-care, mindfulness, or emotional wellness

Examples of good prompts:
- For happy mood: "Take a moment to savor this positive feeling. What three things contributed to your happiness today?"
- For sad mood: "It's okay to feel sad. Try writing down one small thing you're grateful for right now."
- For anxious mood: "When anxiety visits, remember that your breath is always available as an anchor. Try taking five deep, slow breaths."

Respond with just the wellness prompt, no additional text or explanations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    const generatedPrompt = response?.trim();
    if (!generatedPrompt) throw new Error("Empty response from Gemini");

    return generatedPrompt;
  } catch (error) {
    console.error("Failed to generate wellness prompt:", error);

    const fallbackPrompts: Record<string, string> = {
      happy: "Take a moment to appreciate this positive feeling. What can you do to share this joy with others?",
      good: "You're feeling good today! Consider setting a small, meaningful intention for the rest of your day.",
      neutral: "Sometimes neutral is exactly where we need to be. What's one small thing that could bring a spark to your day?",
      sad: "It's okay to feel sad. Your emotions are valid. Try reaching out to someone you trust or doing one gentle thing for yourself.",
      anxious: "When anxiety feels overwhelming, remember that this feeling will pass. Focus on what you can control in this moment."
    };

    return fallbackPrompts[mood] || "Take a deep breath and be gentle with yourself. You're doing better than you think.";
  }
}

export async function generateKindnessMessage(): Promise<string> {
  try {
    const prompt = `Generate a short, uplifting, anonymous message of support for someone who might be going through a difficult time. The message should be:
- Encouraging and compassionate
- Universal (not specific to any particular situation)
- Positive and hopeful
- Brief (1-2 sentences)
- Appropriate for all audiences
- Include a supportive emoji if fitting

Examples:
- "You're stronger than you know, and braver than you feel. Tomorrow is a new day full of possibilities. 💙"
- "Remember that storms don't last forever. You've weathered difficult times before, and you'll make it through this too. ✨"
- "Your presence in this world matters more than you realize. Take it one breath at a time. 🌟"

Respond with just the supportive message, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    const generatedMessage = response?.trim();
    if (!generatedMessage) throw new Error("Empty response from Gemini");

    return generatedMessage;
  } catch (error) {
    console.error("Failed to generate kindness message:", error);

    const fallbackMessages = [
      "You're doing better than you think. Every small step forward matters. 💜",
      "Remember that you are worthy of love and kindness, especially from yourself. 🌸",
      "This too shall pass. You have the strength to get through whatever you're facing. ✨",
      "Your story isn't over yet. There are still beautiful chapters to be written. 🌟",
      "Be gentle with yourself today. You're exactly where you need to be. 💙"
    ];

    return fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
  }
}
