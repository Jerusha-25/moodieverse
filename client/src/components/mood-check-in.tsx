import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Send, Info, HelpCircle, Flame } from "lucide-react";
import type { InsertMoodEntry, UserProgress } from "@shared/schema";

const MOODS = [
  { id: "happy", emoji: "😄", label: "Amazing", color: "from-red-400 to-red-500" },
  { id: "good", emoji: "😊", label: "Good", color: "from-green-400 to-green-500" },
  { id: "neutral", emoji: "😐", label: "Okay", color: "from-yellow-400 to-yellow-500" },
  { id: "sad", emoji: "😢", label: "Low", color: "from-orange-400 to-orange-500" },
  { id: "anxious", emoji: "😟", label: "Anxious", color: "from-purple-400 to-purple-500" },
];

export function MoodCheckIn() {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [journal, setJournal] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: progress } = useQuery<UserProgress>({
    queryKey: ["/api/user-progress"],
  });

  const submitMoodMutation = useMutation({
    mutationFn: async (data: InsertMoodEntry) => {
      return apiRequest("POST", "/api/mood-entries", data);
    },
    onSuccess: () => {
      toast({
        title: "Mood submitted successfully!",
        description: "Your AI wellness prompt is being generated.",
      });
      setSelectedMood("");
      setJournal("");
      queryClient.invalidateQueries({ queryKey: ["/api/mood-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user-progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard-stats"] });
    },
    onError: () => {
      toast({
        title: "Failed to submit mood",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        description: "Choose how you're feeling today.",
        variant: "destructive",
      });
      return;
    }

    submitMoodMutation.mutate({
      mood: selectedMood,
      journal: journal.trim() || undefined,
    });
  };

  return (
    <Card className="bg-white rounded-3xl shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 gradient-bg opacity-10 rounded-full -mr-16 -mt-16" />
      
      <CardContent className="p-8 relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 flex items-center mb-2">
              How are you feeling today?
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="ml-2 text-teal-500 cursor-help" size={20} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your daily mood helps us personalize your wellness suggestions</p>
                </TooltipContent>
              </Tooltip>
            </h2>
            <p className="text-gray-600 text-sm">
              Choose your mood and optionally add details to get AI-powered wellness prompts
            </p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-right cursor-help">
                <div className="text-sm text-gray-500 flex items-center justify-end">
                  <Flame className="mr-1 text-orange-500" size={14} />
                  Day Streak
                </div>
                <div className="text-2xl font-bold text-gradient bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  {progress?.streakCount || 0}
                </div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                <p className="font-medium">Your wellness streak!</p>
                <p>Current: {progress?.streakCount || 0} days</p>
                <p>Longest: {progress?.longestStreak || 0} days</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Mood Selection */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {MOODS.map((mood) => (
            <button
              key={mood.id}
              onClick={() => setSelectedMood(mood.id)}
              className={`
                flex flex-col items-center p-4 rounded-2xl bg-gradient-to-b ${mood.color} text-white 
                hover:shadow-lg transition-all duration-300 hover:scale-110
                ${selectedMood === mood.id ? "ring-4 ring-white ring-opacity-50" : ""}
              `}
            >
              <span className="text-4xl mb-2">{mood.emoji}</span>
              <span className="text-sm font-medium">{mood.label}</span>
            </button>
          ))}
        </div>

        {/* Optional Journaling */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2 flex items-center">
            Tell us more about your day (optional)
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="ml-1 text-gray-400 cursor-help" size={16} />
              </TooltipTrigger>
              <TooltipContent>
                <p>This helps our AI give you better suggestions</p>
              </TooltipContent>
            </Tooltip>
          </label>
          <Textarea
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-20 resize-none transition-colors"
            rows={3}
            placeholder="What's on your mind today?"
          />
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={submitMoodMutation.isPending || !selectedMood}
          className="w-full bg-gradient-to-r from-red-400 to-teal-400 text-white font-semibold py-4 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all"
        >
          <Send className="mr-2" size={16} />
          {submitMoodMutation.isPending ? "Submitting..." : "Submit My Mood"}
        </Button>
      </CardContent>
    </Card>
  );
}
