import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Crown, Gem, Sparkles } from "lucide-react";

interface MilestoneNotificationProps {
  milestone: string | null;
  onClose: () => void;
}

const milestoneConfig = {
  streak_3: {
    title: "3-Day Streak!",
    message: "You're building a healthy habit! Keep it going!",
    icon: Trophy,
    color: "from-yellow-400 to-orange-500",
    reward: "Unlocked: Golden Seedling"
  },
  streak_7: {
    title: "Week Warrior!",
    message: "A full week of self-care! Amazing dedication!",
    icon: Crown,
    color: "from-purple-400 to-pink-500",
    reward: "Unlocked: Rare Rainbow Flower"
  },
  streak_14: {
    title: "Two Week Champion!",
    message: "Your consistency is inspiring! Keep growing!",
    icon: Star,
    color: "from-blue-400 to-cyan-500",
    reward: "Unlocked: Crystal Tree"
  },
  streak_30: {
    title: "Monthly Master!",
    message: "30 days of wellness! You're absolutely incredible!",
    icon: Gem,
    color: "from-emerald-400 to-green-500",
    reward: "Unlocked: Enchanted Garden Portal"
  },
  streak_50: {
    title: "Wellness Legend!",
    message: "50 days! You've transformed self-care into a superpower!",
    icon: Sparkles,
    color: "from-pink-400 to-red-500",
    reward: "Unlocked: Legendary Phoenix Tree"
  },
  streak_100: {
    title: "Centennial Sage!",
    message: "100 days! You are a beacon of wellness inspiration!",
    icon: Crown,
    color: "from-indigo-400 to-purple-600",
    reward: "Unlocked: Ultimate Wisdom Fountain"
  }
};

export function MilestoneNotification({ milestone, onClose }: MilestoneNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (milestone) {
      setIsVisible(true);
    }
  }, [milestone]);

  if (!milestone || !milestoneConfig[milestone as keyof typeof milestoneConfig]) {
    return null;
  }

  const config = milestoneConfig[milestone as keyof typeof milestoneConfig];
  const Icon = config.icon;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Allow animation to complete
  };

  return (
    <Dialog open={isVisible} onOpenChange={handleClose}>
      <DialogContent className="max-w-md p-0 bg-transparent border-none shadow-none">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden relative">
          {/* Background Animation */}
          <div className="absolute inset-0 bg-gradient-to-br opacity-10 animate-pulse" style={{
            background: `linear-gradient(135deg, ${config.color.split(' ')[1]}, ${config.color.split(' ')[3]})`
          }} />
          
          {/* Floating Elements */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-300 rounded-full opacity-60 animate-float" />
          <div className="absolute top-8 left-6 w-4 h-4 bg-pink-300 rounded-full opacity-40 animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-6 right-8 w-6 h-6 bg-blue-300 rounded-full opacity-50 animate-float" style={{ animationDelay: '2s' }} />
          
          {/* Content */}
          <div className="p-8 text-center relative">
            <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${config.color} rounded-full flex items-center justify-center shadow-lg animate-bounce`}>
              <Icon className="text-white" size={32} />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{config.title}</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">{config.message}</p>
            
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 mb-6">
              <p className="text-purple-800 font-semibold text-sm">🎁 {config.reward}</p>
            </div>
            
            <Button 
              onClick={handleClose}
              className={`w-full bg-gradient-to-r ${config.color} text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all`}
            >
              <Sparkles className="mr-2" size={16} />
              Continue Journey
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}