import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Heart, MailOpen, Send, RefreshCw, Shield } from "lucide-react";
import type { KindnessMessage } from "@shared/schema";

export function KindnessExchange() {
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: receivedMessage, isLoading: isLoadingMessage } = useQuery<KindnessMessage>({
    queryKey: ["/api/kindness-messages/random"],
    staleTime: 5 * 60 * 1000, // Don't refetch for 5 minutes
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      return apiRequest("POST", "/api/kindness-messages", { message });
    },
    onSuccess: () => {
      toast({
        title: "Message sent! 💜",
        description: "Your kind words will brighten someone's day.",
      });
      setNewMessage("");
    },
    onError: () => {
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const getNewMessageMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/kindness-messages/random");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/kindness-messages/random"], data);
    },
  });

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      toast({
        title: "Please write a message",
        description: "Share some kindness with others.",
        variant: "destructive",
      });
      return;
    }

    sendMessageMutation.mutate(newMessage.trim());
  };

  return (
    <Card className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl shadow-xl">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center mb-2">
              <Heart className="text-pink-500 mr-2" size={24} />
              Kindness Exchange
            </h2>
            <p className="text-gray-600 text-sm">
              Share and receive anonymous supportive messages from the community
            </p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2 text-sm text-gray-600 cursor-help hover:text-pink-600 transition-colors">
                <Shield size={16} />
                <span>Anonymous & Safe</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                <p className="font-medium mb-1">How it works:</p>
                <p>• All messages are completely anonymous</p>
                <p>• AI generates kind messages when none available</p>
                <p>• Content is filtered for safety and positivity</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Receive Message */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <MailOpen className="text-purple-500 mr-2" size={20} />
              Message for You
            </h3>
            
            {isLoadingMessage ? (
              <div className="animate-pulse">
                <div className="bg-gray-300 rounded-xl h-20 mb-4"></div>
                <div className="bg-gray-300 rounded h-4 w-32"></div>
              </div>
            ) : receivedMessage ? (
              <>
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 mb-4">
                  <p className="text-gray-700 italic">
                    "{receivedMessage.message}"
                  </p>
                  <div className="text-xs text-gray-500 mt-2">
                    From a {receivedMessage.isAiGenerated ? "digital" : "fellow"} friend
                  </div>
                </div>
                <Button 
                  onClick={() => getNewMessageMutation.mutate()}
                  disabled={getNewMessageMutation.isPending}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium"
                >
                  <RefreshCw className="mr-2" size={16} />
                  Get Another Message
                </Button>
              </>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Heart className="mx-auto mb-2 text-gray-400" size={32} />
                <p>Loading a message for you...</p>
              </div>
            )}
          </div>

          {/* Send Message */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <Send className="text-pink-500 mr-2" size={20} />
              Send Kindness
            </h3>
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-2 focus:ring-pink-500 focus:ring-opacity-20 resize-none mb-4"
              rows={3}
              placeholder="Write an encouraging message for someone..."
              maxLength={200}
            />
            <div className="text-xs text-gray-500 mb-4">
              {newMessage.length}/200 characters
            </div>
            <Button 
              onClick={handleSendMessage}
              disabled={sendMessageMutation.isPending || !newMessage.trim()}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium"
            >
              <Heart className="mr-2" size={16} />
              Send Anonymously
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
