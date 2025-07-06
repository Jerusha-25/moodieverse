import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Smile, Sprout, Heart, X } from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0">
        {/* Header with close button */}
        <div className="bg-gradient-to-r from-red-400 to-teal-400 text-white p-6 rounded-t-lg">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center animate-float">
                  <Sparkles className="text-white" size={24} />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold">Welcome to MoodieVerse!</DialogTitle>
                  <p className="text-red-100 text-sm">Your wellness journey starts here</p>
                </div>
              </div>
              <Button 
                onClick={onClose}
                variant="ghost" 
                className="w-10 h-10 bg-white bg-opacity-20 rounded-xl hover:bg-white hover:bg-opacity-30 text-white"
              >
                <X size={16} />
              </Button>
            </div>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <p className="text-gray-600 mb-6">Track your mood, grow your digital garden, and discover personalized wellness tools.</p>
          
          <div className="space-y-3 text-left mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-400 rounded-full flex items-center justify-center">
                <Smile className="text-white" size={16} />
              </div>
              <span className="text-sm text-gray-700">Check in with your daily mood</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-teal-400 rounded-full flex items-center justify-center">
                <Sprout className="text-white" size={16} />
              </div>
              <span className="text-sm text-gray-700">Watch your digital world grow</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <Heart className="text-white" size={16} />
              </div>
              <span className="text-sm text-gray-700">Get support when you need it</span>
            </div>
          </div>
          
          <Button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-red-400 to-teal-400 text-white font-medium py-3 rounded-xl hover:shadow-lg transition-all"
          >
            Start My Journey
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
