import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { MoodCheckIn } from "@/components/mood-check-in";
import { AIPromptCard } from "@/components/ai-prompt-card";
import { GardenVisualization } from "@/components/garden-visualization";
import { KindnessExchange } from "@/components/kindness-exchange";
import { WellnessDashboard } from "@/components/wellness-dashboard";
import { CrisisSupportModal } from "@/components/crisis-support-modal";
import { OnboardingModal } from "@/components/onboarding-modal";
import { MilestoneNotification } from "@/components/milestone-notification";
import { ShareableSnapshot } from "@/components/shareable-snapshot";
import { PrivacyControls } from "@/components/privacy-controls";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Heart, Home, BarChart3, Sprout, User, Settings, Share } from "lucide-react";
import type { UserProgress } from "@shared/schema";

export default function HomePage() {
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useLocalStorage("hasSeenOnboarding", false);
  const [activeTab, setActiveTab] = useState("home");
  const [currentMilestone, setCurrentMilestone] = useState<string | null>(null);
  const gardenRef = useRef<HTMLDivElement>(null);

  const { data: progress } = useQuery<UserProgress>({
    queryKey: ["/api/user-progress"],
  });

  // Check for new milestones
  useEffect(() => {
    if (progress?.milestones) {
      const milestones = progress.milestones as string[];
      const lastMilestone = milestones[milestones.length - 1];
      const seenMilestones = JSON.parse(localStorage.getItem('seenMilestones') || '[]');
      
      if (lastMilestone && !seenMilestones.includes(lastMilestone)) {
        setCurrentMilestone(lastMilestone);
        seenMilestones.push(lastMilestone);
        localStorage.setItem('seenMilestones', JSON.stringify(seenMilestones));
      }
    }
  }, [progress]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                <Sprout className="text-white" size={20} />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-teal-400 bg-clip-text text-transparent">
                MoodieVerse
              </h1>
            </div>
            
            {/* Crisis Help Button - Always Accessible */}
            <Button 
              onClick={() => setShowCrisisModal(true)}
              className="crisis-pulse bg-purple-600 hover:bg-purple-700 text-white font-medium"
            >
              <Heart className="mr-2" size={16} />
              Need Help?
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24 md:pb-8">
        {activeTab === "home" && (
          <>
            <MoodCheckIn />
            <AIPromptCard />
            <div ref={gardenRef}>
              <GardenVisualization />
            </div>
            <KindnessExchange />
          </>
        )}
        
        {activeTab === "dashboard" && <WellnessDashboard />}
        
        {activeTab === "garden" && (
          <>
            <div ref={gardenRef}>
              <GardenVisualization expanded />
            </div>
            <ShareableSnapshot gardenRef={gardenRef} />
          </>
        )}
        
        {activeTab === "privacy" && <PrivacyControls />}
      </main>

      {/* Bottom Navigation for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-30">
        <div className="grid grid-cols-5 gap-1">
          <button 
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center py-3 ${activeTab === "home" ? "text-teal-500" : "text-gray-400"}`}
          >
            <Home size={18} className="mb-1" />
            <span className="text-xs">Home</span>
          </button>
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col items-center py-3 ${activeTab === "dashboard" ? "text-teal-500" : "text-gray-400"}`}
          >
            <BarChart3 size={18} className="mb-1" />
            <span className="text-xs">Stats</span>
          </button>
          <button 
            onClick={() => setActiveTab("garden")}
            className={`flex flex-col items-center py-3 ${activeTab === "garden" ? "text-teal-500" : "text-gray-400"}`}
          >
            <Sprout size={18} className="mb-1" />
            <span className="text-xs">Garden</span>
          </button>
          <button 
            onClick={() => setActiveTab("privacy")}
            className={`flex flex-col items-center py-3 ${activeTab === "privacy" ? "text-teal-500" : "text-gray-400"}`}
          >
            <Settings size={18} className="mb-1" />
            <span className="text-xs">Privacy</span>
          </button>
          <button 
            onClick={() => setShowCrisisModal(true)}
            className="flex flex-col items-center py-3 text-purple-600"
          >
            <Heart size={18} className="mb-1" />
            <span className="text-xs">Help</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <CrisisSupportModal 
        isOpen={showCrisisModal} 
        onClose={() => setShowCrisisModal(false)} 
      />
      
      <OnboardingModal 
        isOpen={!hasSeenOnboarding} 
        onClose={() => setHasSeenOnboarding(true)} 
      />
      
      <MilestoneNotification 
        milestone={currentMilestone}
        onClose={() => setCurrentMilestone(null)}
      />
    </div>
  );
}
