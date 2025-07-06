import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { CalendarCheck, Target, Flame, TrendingUp, Medal, Sprout, Heart, Sparkles, Info, Zap, Crown, Star } from "lucide-react";

interface DashboardStats {
  checkInsThisMonth: number;
  questsCompleted: number;
  currentStreak: number;
  gardenItems: {
    seedlings: number;
    flowers: number;
    trees: number;
  };
  moodTrends: Array<{
    date: string;
    mood: string;
    value: number;
  }>;
  averageMood: number;
}

export function WellnessDashboard() {
  const [timeRange, setTimeRange] = useState("30D");

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard-stats"],
  });

  if (isLoading) {
    return (
      <Card className="bg-white rounded-3xl shadow-xl">
        <CardContent className="p-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-300 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-300 rounded-2xl"></div>
              ))}
            </div>
            <div className="h-48 bg-gray-300 rounded-2xl"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const moodColors = {
    happy: "from-red-400 to-red-500",
    good: "from-green-400 to-green-500", 
    neutral: "from-yellow-400 to-yellow-500",
    sad: "from-orange-400 to-orange-500",
    anxious: "from-purple-400 to-purple-500",
  };

  return (
    <Card className="bg-white rounded-3xl shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 gradient-bg-rainbow opacity-10 rounded-full -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-32 h-32 gradient-bg-wellness opacity-15 rounded-full -ml-16 -mb-16" />
      
      <CardContent className="p-8 relative">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 gradient-bg-rainbow rounded-xl flex items-center justify-center animate-pulse">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Your Wellness Universe
              </h2>
              <p className="text-gray-600 text-sm">Track your amazing progress</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {["7D", "30D", "90D"].map((range) => (
              <Button
                key={range}
                onClick={() => setTimeRange(range)}
                variant={timeRange === range ? "default" : "outline"}
                className={timeRange === range ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600" : "hover:bg-purple-100"}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-6 text-center relative overflow-hidden group hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 right-0 w-16 h-16 bg-green-300 opacity-20 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform" />
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <CalendarCheck className="text-white" size={24} />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{stats?.checkInsThisMonth || 0}</div>
            <div className="text-sm text-gray-600 font-medium">Check-ins This Month</div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="mt-2 text-xs text-green-600 font-medium cursor-help flex items-center justify-center">
                  <Info size={12} className="mr-1" />
                  {stats?.checkInsThisMonth ? "+15% from last month" : "Start tracking!"}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Track your daily mood to see how you're doing over time</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-6 text-center relative overflow-hidden group hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-300 opacity-20 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform" />
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Target className="text-white" size={24} />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{stats?.questsCompleted || 0}</div>
            <div className="text-sm text-gray-600 font-medium">Wellness Quests</div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="mt-2 text-xs text-blue-600 font-medium cursor-help flex items-center justify-center">
                  <Zap size={12} className="mr-1" />
                  {stats?.questsCompleted ? "78% completion rate" : "Complete your first quest!"}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Complete AI-generated wellness prompts to grow your garden</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 text-center relative overflow-hidden group hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 right-0 w-16 h-16 bg-purple-300 opacity-20 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform" />
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Flame className="text-white" size={24} />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">{stats?.currentStreak || 0}</div>
            <div className="text-sm text-gray-600 font-medium">Day Streak</div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="mt-2 text-xs text-purple-600 font-medium cursor-help flex items-center justify-center">
                  <Crown size={12} className="mr-1" />
                  {(stats?.currentStreak || 0) > 0 ? "Keep it up!" : "Start your streak today!"}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Check in daily to maintain your wellness streak</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-6 text-center relative overflow-hidden group hover:scale-105 transition-all duration-300">
            <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-300 opacity-20 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform" />
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div className="text-3xl font-bold text-gray-800 mb-1">
              {stats?.averageMood ? stats.averageMood.toFixed(1) : "0.0"}
            </div>
            <div className="text-sm text-gray-600 font-medium">Average Mood</div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="mt-2 text-xs text-yellow-600 font-medium cursor-help flex items-center justify-center">
                  <Star size={12} className="mr-1" />
                  {(stats?.averageMood || 0) > 3 ? "Trending upward" : "Room to grow"}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Your overall emotional wellbeing score (1-5 scale)</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Mood Trend Chart Area */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Mood Trends (Last 7 Days)</h3>
          <div className="h-48 flex items-end space-x-2 justify-center">
            {stats?.moodTrends && stats.moodTrends.length > 0 ? (
              stats.moodTrends.map((trend, index) => (
                <div key={index} className="flex-1 max-w-16 flex flex-col items-center">
                  <div 
                    className={`w-full bg-gradient-to-t ${moodColors[trend.mood as keyof typeof moodColors] || "from-gray-400 to-gray-500"} rounded-t transition-all duration-500`}
                    style={{ height: `${(trend.value / 5) * 100}%` }}
                  />
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(trend.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <TrendingUp className="mx-auto mb-2" size={32} />
                  <p>Start tracking your mood to see trends</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Achievements */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Recent Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(stats?.currentStreak || 0) >= 7 && (
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl p-4 flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                  <Medal className="text-white" size={20} />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Week Warrior</div>
                  <div className="text-sm text-gray-600">7-day check-in streak</div>
                </div>
              </div>
            )}
            
            {(stats?.gardenItems && (stats.gardenItems.seedlings + stats.gardenItems.flowers + stats.gardenItems.trees) >= 10) && (
              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-4 flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <Sprout className="text-white" size={20} />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Garden Keeper</div>
                  <div className="text-sm text-gray-600">Grew 10+ plants</div>
                </div>
              </div>
            )}
            
            {(stats?.questsCompleted || 0) >= 5 && (
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-4 flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <Heart className="text-white" size={20} />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Quest Master</div>
                  <div className="text-sm text-gray-600">Completed 5+ quests</div>
                </div>
              </div>
            )}
            
            {/* Show placeholder if no achievements */}
            {((stats?.currentStreak || 0) < 7 && 
              (!stats?.gardenItems || (stats.gardenItems.seedlings + stats.gardenItems.flowers + stats.gardenItems.trees) < 10) &&
              (stats?.questsCompleted || 0) < 5) && (
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-4 flex items-center space-x-3 col-span-full">
                <div className="w-12 h-12 bg-gray-400 rounded-xl flex items-center justify-center">
                  <Medal className="text-white" size={20} />
                </div>
                <div>
                  <div className="font-medium text-gray-800">Start Your Journey</div>
                  <div className="text-sm text-gray-600">Complete activities to unlock achievements</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
