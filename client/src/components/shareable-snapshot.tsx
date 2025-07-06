import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Share, Download, Sparkles, Sprout, TreePine, Flower } from "lucide-react";
import html2canvas from "html2canvas";
import type { UserProgress } from "@shared/schema";

interface ShareableSnapshotProps {
  gardenRef?: React.RefObject<HTMLDivElement>;
}

export function ShareableSnapshot({ gardenRef }: ShareableSnapshotProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const { data: progress } = useQuery<UserProgress>({
    queryKey: ["/api/user-progress"],
  });

  const generateSnapshot = async () => {
    setIsGenerating(true);
    try {
      // Create a special snapshot div for sharing
      const snapshotDiv = document.createElement('div');
      snapshotDiv.style.cssText = `
        width: 600px;
        height: 600px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        padding: 40px;
        border-radius: 20px;
        font-family: 'Inter', sans-serif;
        position: fixed;
        top: -1000px;
        left: -1000px;
        z-index: 9999;
      `;

      const gardenItems = progress?.gardenItems as { seedlings: number; flowers: number; trees: number } || { seedlings: 0, flowers: 0, trees: 0 };
      const totalGrowth = gardenItems.seedlings + gardenItems.flowers + gardenItems.trees;

      snapshotDiv.innerHTML = `
        <div style="background: white; border-radius: 16px; padding: 32px; height: 100%; display: flex; flex-direction: column; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #FF6B6B, #4ECDC4); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 24px;">🌱</span>
            </div>
            <h1 style="font-size: 28px; font-weight: bold; margin: 0; background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">MoodieVerse</h1>
            <p style="margin: 8px 0 0; color: #666; font-size: 14px;">My Wellness Journey</p>
          </div>

          <!-- Garden Visualization -->
          <div style="flex: 1; background: linear-gradient(to bottom, #E3F2FD 0%, #C8E6C9 100%); border-radius: 16px; position: relative; margin-bottom: 24px; overflow: hidden;">
            <!-- Sky -->
            <div style="position: absolute; top: 16px; right: 16px; width: 40px; height: 40px; background: #FFD54F; border-radius: 50%; box-shadow: 0 0 20px rgba(255, 213, 79, 0.3);"></div>
            
            <!-- Ground -->
            <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 60px; background: linear-gradient(to top, #4CAF50, #66BB6A);"></div>
            
            <!-- Garden Elements -->
            <div style="position: absolute; bottom: 60px; left: 50%; transform: translateX(-50%); display: flex; gap: 16px; align-items: flex-end;">
              ${Array.from({length: Math.min(gardenItems.seedlings, 3)}, (_, i) => 
                `<div style="width: 24px; height: 24px; background: #4CAF50; clip-path: polygon(50% 0%, 0% 100%, 100% 100%);"></div>`
              ).join('')}
              ${Array.from({length: Math.min(gardenItems.flowers, 3)}, (_, i) => 
                `<div style="width: 32px; height: 32px; background: #E91E63; border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; position: relative;">
                   <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 8px; height: 8px; background: #FFC107; border-radius: 50%;"></div>
                 </div>`
              ).join('')}
              ${Array.from({length: Math.min(gardenItems.trees, 2)}, (_, i) => 
                `<div style="position: relative;">
                   <div style="width: 8px; height: 24px; background: #8D6E63; margin: 0 auto;"></div>
                   <div style="width: 40px; height: 40px; background: #4CAF50; border-radius: 50%; margin-top: -20px;"></div>
                 </div>`
              ).join('')}
            </div>

            <!-- Achievement Badge -->
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; border-radius: 12px; padding: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center;">
              <div style="font-size: 20px; margin-bottom: 4px;">🏆</div>
              <div style="font-size: 12px; font-weight: bold; color: #333;">Day ${progress?.streakCount || 0}</div>
              <div style="font-size: 10px; color: #666;">Streak</div>
            </div>
          </div>

          <!-- Stats -->
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 24px;">
            <div style="text-align: center; background: #E8F5E8; padding: 12px; border-radius: 12px;">
              <div style="font-size: 18px; font-weight: bold; color: #2E7D32;">${gardenItems.seedlings}</div>
              <div style="font-size: 12px; color: #66BB6A;">Seedlings</div>
            </div>
            <div style="text-align: center; background: #FCE4EC; padding: 12px; border-radius: 12px;">
              <div style="font-size: 18px; font-weight: bold; color: #C2185B;">${gardenItems.flowers}</div>
              <div style="font-size: 12px; color: #E91E63;">Flowers</div>
            </div>
            <div style="text-align: center; background: #E3F2FD; padding: 12px; border-radius: 12px;">
              <div style="font-size: 18px; font-weight: bold; color: #1976D2;">${gardenItems.trees}</div>
              <div style="font-size: 12px; color: #42A5F5;">Trees</div>
            </div>
          </div>

          <!-- Quote -->
          <div style="text-align: center; padding: 16px; background: linear-gradient(135deg, #F3E5F5, #E1F5FE); border-radius: 12px; border-left: 4px solid #9C27B0;">
            <p style="margin: 0; font-style: italic; color: #666; font-size: 14px;">"Every small step forward in your wellness journey matters. Keep growing! 🌱"</p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 16px; padding-top: 16px; border-top: 1px solid #E0E0E0;">
            <p style="margin: 0; font-size: 12px; color: #999;">Generated with MoodieVerse • ${new Date().toLocaleDateString()}</p>
          </div>
        </div>
      `;

      document.body.appendChild(snapshotDiv);

      // Generate the image
      const canvas = await html2canvas(snapshotDiv, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
      });

      // Clean up
      document.body.removeChild(snapshotDiv);

      // Convert to blob and share/download
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Failed to generate image');
        }

        const url = URL.createObjectURL(blob);
        
        // Try Web Share API first
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'moodieverse-garden.png', { type: 'image/png' })] })) {
          const file = new File([blob], 'moodieverse-garden.png', { type: 'image/png' });
          navigator.share({
            title: 'My MoodieVerse Wellness Journey',
            text: `Day ${progress?.streakCount || 0} of my wellness journey! 🌱 Growing strong with ${totalGrowth} garden items!`,
            files: [file]
          }).catch(() => {
            // Fallback to download
            downloadImage(url);
          });
        } else {
          // Fallback to download
          downloadImage(url);
        }
      }, 'image/png');

    } catch (error) {
      console.error('Failed to generate snapshot:', error);
      toast({
        title: "Failed to generate snapshot",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = (url: string) => {
    const link = document.createElement('a');
    link.download = `moodieverse-garden-day-${progress?.streakCount || 0}.png`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Garden snapshot saved!",
      description: "Your wellness journey image has been downloaded.",
    });
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-800 mb-1 flex items-center">
              <Share className="text-indigo-600 mr-2" size={20} />
              Share Your Journey
            </h3>
            <p className="text-gray-600 text-sm">
              Create a beautiful snapshot of your wellness progress
            </p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="text-white" size={20} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share your progress with friends and family!</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="bg-white rounded-xl p-4 mb-4">
          <div className="text-center">
            <div className="text-2xl mb-2">🌱</div>
            <div className="text-sm text-gray-600 mb-2">Preview: Day {progress?.streakCount || 0} Journey</div>
            <div className="flex justify-center space-x-4 text-xs">
              <span className="flex items-center text-green-600">
                <Sprout size={12} className="mr-1" />
                {(progress?.gardenItems as any)?.seedlings || 0}
              </span>
              <span className="flex items-center text-pink-600">
                <Flower size={12} className="mr-1" />
                {(progress?.gardenItems as any)?.flowers || 0}
              </span>
              <span className="flex items-center text-green-700">
                <TreePine size={12} className="mr-1" />
                {(progress?.gardenItems as any)?.trees || 0}
              </span>
            </div>
          </div>
        </div>

        <Button 
          onClick={generateSnapshot}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg"
        >
          <Share className="mr-2" size={16} />
          {isGenerating ? "Creating Snapshot..." : "Share My Garden"}
        </Button>

        <p className="text-xs text-center text-gray-500 mt-2">
          No personal data is shared - only your garden progress
        </p>
      </CardContent>
    </Card>
  );
}