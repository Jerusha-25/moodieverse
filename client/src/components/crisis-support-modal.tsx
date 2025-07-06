import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  X, 
  Wind, 
  Hand, 
  Phone, 
  Music, 
  Sun, 
  Edit,
  ExternalLink 
} from "lucide-react";

interface CrisisSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CrisisSupportModal({ isOpen, onClose }: CrisisSupportModalProps) {
  const [isBreathing, setIsBreathing] = useState(false);
  const [groundingStep, setGroundingStep] = useState(0);
  const [journalText, setJournalText] = useState("");
  const [currentAffirmation, setCurrentAffirmation] = useState(0);

  const affirmations = [
    "This feeling is temporary. You have survived difficult times before, and you will get through this too.",
    "You are stronger than you know. Every breath you take is an act of courage.",
    "It's okay to not be okay. Your feelings are valid, and healing takes time.",
    "You matter. Your life has value, and the world is better with you in it.",
    "One moment at a time. You don't have to carry tomorrow's worries today.",
  ];

  const groundingSteps = [
    "Name 5 things you can see around you",
    "Identify 4 things you can hear right now", 
    "Find 3 things you can touch or feel",
    "Notice 2 things you can smell",
    "Think of 1 thing you can taste",
  ];

  const startBreathing = () => {
    setIsBreathing(true);
    // Simple breathing exercise - could be enhanced with actual timing
    setTimeout(() => setIsBreathing(false), 10000);
  };

  const nextAffirmation = () => {
    setCurrentAffirmation((prev) => (prev + 1) % affirmations.length);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white p-6 rounded-t-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-20" />
          <DialogHeader className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-white bg-opacity-25 rounded-2xl flex items-center justify-center animate-pulse shadow-lg">
                  <Heart className="text-white" size={24} />
                </div>
                <div>
                  <DialogTitle className="text-3xl font-bold mb-1">Crisis Support Toolkit</DialogTitle>
                  <p className="text-purple-100 text-lg">You're not alone. Help is always here.</p>
                  <p className="text-purple-200 text-sm mt-1">Choose any tool below that feels right for you right now</p>
                </div>
              </div>
              <Button 
                onClick={onClose}
                variant="ghost" 
                className="w-12 h-12 bg-white bg-opacity-20 rounded-xl hover:bg-white hover:bg-opacity-30 text-white transition-all"
              >
                <X size={20} />
              </Button>
            </div>
          </DialogHeader>
        </div>

        {/* Crisis Tools Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Breathing Exercise */}
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Wind className="text-white" size={20} />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Breathing Exercise</h3>
              <p className="text-gray-600 text-sm mb-4">
                <strong>How it works:</strong> Slow, deep breathing activates your body's relaxation response, 
                reducing stress hormones and calming your mind.
              </p>
              <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full transition-all duration-2000 ${isBreathing ? "animate-pulse scale-125 shadow-xl" : "shadow-md"}`}>
                <div className="w-full h-full rounded-full bg-white bg-opacity-30 flex items-center justify-center">
                  <div className="text-white font-bold text-sm">
                    {isBreathing ? "Breathe" : "Ready"}
                  </div>
                </div>
              </div>
              <Button 
                onClick={startBreathing}
                disabled={isBreathing}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white shadow-lg"
              >
                <Wind className="mr-2" size={16} />
                {isBreathing ? "Keep Breathing..." : "Start 4-7-8 Breathing"}
              </Button>
              {isBreathing && (
                <p className="text-xs text-center text-blue-600 mt-2">
                  Inhale for 4, hold for 7, exhale for 8
                </p>
              )}
            </CardContent>
          </Card>

          {/* 5-4-3-2-1 Grounding */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <Hand className="text-white" size={20} />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">5-4-3-2-1 Grounding</h3>
              <p className="text-gray-600 text-sm mb-4">
                <strong>How it works:</strong> This technique interrupts anxiety by redirecting your focus to your physical senses, 
                bringing you back to the present moment.
              </p>
              <div className="space-y-2 text-sm mb-4">
                {groundingSteps.map((step, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg transition-all duration-300 ${
                      groundingStep > index 
                        ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 shadow-sm" 
                        : groundingStep === index
                        ? "bg-gradient-to-r from-green-200 to-emerald-200 text-green-900 shadow-md"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <span className="font-medium">{index + 1}.</span> {step}
                  </div>
                ))}
              </div>
              <Button 
                onClick={() => setGroundingStep(prev => Math.min(prev + 1, groundingSteps.length))}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                disabled={groundingStep >= groundingSteps.length}
              >
                <Hand className="mr-2" size={16} />
                {groundingStep >= groundingSteps.length ? "All Steps Complete!" : `Step ${groundingStep + 1}`}
              </Button>
              {groundingStep >= groundingSteps.length && (
                <p className="text-xs text-center text-green-600 mt-2">
                  Great job! You've anchored yourself to the present moment.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card className="bg-gradient-to-br from-red-50 to-pink-50">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center mb-4">
                <Phone className="text-white" size={20} />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Emergency Helplines</h3>
              <p className="text-gray-600 text-sm mb-4">24/7 support when you need it most</p>
              <div className="space-y-3">
                <Button 
                  asChild
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                >
                  <a href="tel:988" className="flex items-center justify-center">
                    <Phone className="mr-2" size={16} />
                    988 - Crisis Lifeline
                  </a>
                </Button>
                <Button 
                  asChild
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                >
                  <a href="sms:741741" className="flex items-center justify-center">
                    <Phone className="mr-2" size={16} />
                    Text HOME to 741741
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Calming Sounds */}
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                <Music className="text-white" size={20} />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Calming Sounds</h3>
              <p className="text-gray-600 text-sm mb-4">Soothing audio to help you relax</p>
              <div className="space-y-2">
                <Button 
                  variant="outline"
                  className="w-full justify-start border-purple-200 hover:bg-purple-100"
                >
                  <Music className="mr-2" size={16} />
                  Ocean Waves
                </Button>
                <Button 
                  variant="outline"
                  className="w-full justify-start border-purple-200 hover:bg-purple-100"
                >
                  <Music className="mr-2" size={16} />
                  Rain Sounds
                </Button>
                <Button 
                  variant="outline"
                  className="w-full justify-start border-purple-200 hover:bg-purple-100"
                >
                  <Music className="mr-2" size={16} />
                  Forest Birds
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Positive Affirmations */}
          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mb-4">
                <Sun className="text-white" size={20} />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Positive Affirmations</h3>
              <p className="text-gray-600 text-sm mb-4">Gentle reminders of your strength</p>
              <div className="bg-yellow-100 rounded-xl p-4 mb-4 min-h-[80px] flex items-center">
                <p className="text-gray-700 italic text-center w-full">
                  "{affirmations[currentAffirmation]}"
                </p>
              </div>
              <Button 
                onClick={nextAffirmation}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Next Affirmation
              </Button>
            </CardContent>
          </Card>

          {/* Crisis Journal */}
          <Card className="bg-gradient-to-br from-gray-50 to-slate-50">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gray-500 rounded-xl flex items-center justify-center mb-4">
                <Edit className="text-white" size={20} />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Safe Space Journal</h3>
              <p className="text-gray-600 text-sm mb-4">Express your feelings in a private space</p>
              <Textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-gray-400 resize-none mb-3"
                rows={3}
                placeholder="Write your thoughts here... they're safe with you."
              />
              <Button 
                onClick={() => {
                  // In a real app, this could save to local storage
                  setJournalText("");
                }}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white"
              >
                Clear & Reset
              </Button>
            </CardContent>
          </Card>

        </div>

        {/* Professional Help Resources */}
        <div className="p-6 pt-0">
          <Card className="bg-gradient-to-r from-indigo-100 to-purple-100">
            <CardContent className="p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <ExternalLink className="text-indigo-600 mr-2" size={20} />
                Professional Help Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4">
                  <h4 className="font-medium text-gray-800 mb-2">Find a Therapist</h4>
                  <p className="text-sm text-gray-600 mb-3">Connect with licensed mental health professionals</p>
                  <Button 
                    variant="link" 
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium p-0"
                    asChild
                  >
                    <a href="https://www.psychologytoday.com/us/therapists" target="_blank" rel="noopener noreferrer">
                      Search Directory →
                    </a>
                  </Button>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <h4 className="font-medium text-gray-800 mb-2">Support Groups</h4>
                  <p className="text-sm text-gray-600 mb-3">Connect with others who understand your journey</p>
                  <Button 
                    variant="link" 
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium p-0"
                    asChild
                  >
                    <a href="https://www.nami.org/Support-Education/Support-Groups" target="_blank" rel="noopener noreferrer">
                      Find Groups →
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </DialogContent>
    </Dialog>
  );
}
