import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Sprout, Flower, TreePine, Trophy, Sun } from "lucide-react";
import type { UserProgress } from "@shared/schema";

interface GardenVisualizationProps {
  expanded?: boolean;
}

export function GardenVisualization({ expanded = false }: GardenVisualizationProps) {
  const { data: progress, isLoading } = useQuery<UserProgress>({
    queryKey: ["/api/user-progress"],
  });

  if (isLoading) {
    return (
      <Card className="bg-white rounded-3xl shadow-xl">
        <CardContent className="p-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded mb-6"></div>
            <div className="h-64 bg-gray-300 rounded-2xl mb-6"></div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-xl mx-auto mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded mb-1"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const gardenItems = progress?.gardenItems || { seedlings: 0, flowers: 0, trees: 0 };

  return (
    <Card className="bg-white rounded-3xl shadow-xl">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Growing Digital Garden</h2>
            <p className="text-gray-600 text-sm">
              Watch your wellness progress bloom into a beautiful world
            </p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2 text-sm text-gray-600 cursor-help hover:text-teal-600 transition-colors">
                <Info size={16} />
                <span>How it grows</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm">
                <p className="font-medium mb-1">Garden Growth Rules:</p>
                <p>• Daily check-ins = Seedlings & Flowers</p>
                <p>• Completed quests = Trees</p>
                <p>• Streak bonuses = Extra growth</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
        
        {/* Garden Visual Area */}
        <div className={`relative ${expanded ? "h-96" : "h-64"} bg-gradient-to-b from-sky-200 to-green-200 rounded-2xl overflow-hidden mb-6`}>
          {/* Sky/Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-300 to-blue-100 opacity-80" />
          
          {/* Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-green-400 to-green-300" />
          
          {/* Sun */}
          <div className="absolute top-4 right-4 animate-pulse">
            <Sun className="text-yellow-400" size={expanded ? 48 : 32} />
          </div>
          
          {/* Animated Garden Elements */}
          {gardenItems.seedlings > 0 && (
            <div className="absolute bottom-20 left-8 animate-float">
              <Sprout className="text-green-600" size={expanded ? 40 : 24} />
            </div>
          )}
          
          {gardenItems.seedlings > 1 && (
            <div className="absolute bottom-20 left-20 animate-float" style={{ animationDelay: "1s" }}>
              <Sprout className="text-green-500" size={expanded ? 32 : 20} />
            </div>
          )}
          
          {gardenItems.trees > 0 && (
            <div className="absolute bottom-20 left-32 animate-grow">
              <TreePine className="text-green-700" size={expanded ? 56 : 32} />
            </div>
          )}
          
          {gardenItems.flowers > 0 && (
            <div className="absolute bottom-20 right-20 animate-float" style={{ animationDelay: "2s" }}>
              <Flower className="text-pink-500" size={expanded ? 40 : 24} />
            </div>
          )}
          
          {gardenItems.flowers > 1 && (
            <div className="absolute bottom-20 right-32 animate-float" style={{ animationDelay: "3s" }}>
              <Flower className="text-purple-500" size={expanded ? 32 : 20} />
            </div>
          )}
          
          {/* Achievement Badge */}
          {(gardenItems.seedlings + gardenItems.flowers + gardenItems.trees) > 0 && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-3 shadow-lg animate-float">
              <div className="text-center">
                <Trophy className="text-yellow-400 mx-auto mb-1" size={expanded ? 32 : 24} />
                <div className="text-xs font-medium text-gray-800">Growing Strong!</div>
              </div>
            </div>
          )}
        </div>

        {/* Garden Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Sprout className="text-green-600" size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-800">{gardenItems.seedlings}</div>
            <div className="text-sm text-gray-600">Seedlings</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Flower className="text-pink-600" size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-800">{gardenItems.flowers}</div>
            <div className="text-sm text-gray-600">Flowers</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <TreePine className="text-green-700" size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-800">{gardenItems.trees}</div>
            <div className="text-sm text-gray-600">Trees</div>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Trophy className="text-yellow-600" size={20} />
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {gardenItems.seedlings + gardenItems.flowers + gardenItems.trees}
            </div>
            <div className="text-sm text-gray-600">Total Growth</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
