import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Sparkles, Edit, Check } from "lucide-react";
import type { MoodEntry } from "@shared/schema";

export function AIPromptCard() {
  const [isReflecting, setIsReflecting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: recentEntries, isLoading } = useQuery<MoodEntry[]>({
    queryKey: ["/api/mood-entries"],
    queryFn: async () => {
      const response = await fetch("/api/mood-entries?limit=1");
      return response.json();
    },
  });

  const completePromptMutation = useMutation({
    mutationFn: async (entryId: number) => {
      return apiRequest("PATCH", `/api/mood-entries/${entryId}/complete-prompt`);
    },
    onSuccess: () => {
      toast({
        title: "Quest completed!",
        description: "Your garden grows with your progress.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/mood-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user-progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard-stats"] });
    },
  });

  const latestEntry = recentEntries?.[0];

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl shadow-xl">
        <CardContent className="p-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded mb-4"></div>
            <div className="h-20 bg-gray-300 rounded mb-4"></div>
            <div className="h-10 bg-gray-300 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!latestEntry || !latestEntry.aiPrompt) {
    return (
      <Card className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl shadow-xl">
        <CardContent className="p-8">
          <div className="text-center text-gray-600">
            <Sparkles className="mx-auto mb-4 text-purple-500" size={48} />
            <h3 className="text-xl font-bold mb-2">Ready for your wellness prompt?</h3>
            <p>Submit your mood to receive a personalized AI-generated wellness suggestion.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl shadow-xl">
      <CardContent className="p-8">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center animate-pulse">
            <Sparkles className="text-white" size={20} />
          </div>
          <div className="flex-1">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-1">Your Personalized Wellness Prompt</h3>
              <p className="text-gray-600 text-sm">AI-generated based on your current mood and journal entry</p>
            </div>
            <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border-l-4 border-purple-400">
              <p className="text-gray-700 leading-relaxed italic">
                "{latestEntry.aiPrompt}"
              </p>
            </div>
            
            {!latestEntry.promptCompleted ? (
              <div className="flex space-x-3">
                <Button 
                  onClick={() => setIsReflecting(!isReflecting)}
                  className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-medium"
                  variant={isReflecting ? "outline" : "default"}
                >
                  <Edit className="mr-2" size={16} />
                  {isReflecting ? "Reflecting..." : "Reflect Now"}
                </Button>
                <Button 
                  onClick={() => completePromptMutation.mutate(latestEntry.id)}
                  disabled={completePromptMutation.isPending}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium"
                >
                  <Check className="mr-2" size={16} />
                  Mark as Done
                </Button>
              </div>
            ) : (
              <div className="text-center p-4 bg-green-100 rounded-xl">
                <Check className="mx-auto mb-2 text-green-600" size={24} />
                <p className="text-green-800 font-medium">Quest Completed! 🌱</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
