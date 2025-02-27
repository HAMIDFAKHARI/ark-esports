import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Bell, Trophy, User, Gamepad2, ThumbsUp, Award, Sparkles, PartyPopper } from "lucide-react";
import useSound from "use-sound";
import confetti from "canvas-confetti";

export default function ArkPrototype() {
  const [page, setPage] = useState("home");
  const [leaderboard, setLeaderboard] = useState([
    { id: 1, name: "PlayerOne", points: 2000, country: "USA", likes: 0, badges: ["Champion", "MVP"], achievements: [] },
    { id: 2, name: "GamerX", points: 1950, country: "Germany", likes: 0, badges: ["Sharpshooter"], achievements: [] },
    { id: 3, name: "ProMaster", points: 1800, country: "Japan", likes: 0, badges: ["Strategist", "Veteran"], achievements: [] },
  ]);

  const [playAchievementSound] = useSound("/sounds/achievement.mp3");

  useEffect(() => {
    const interval = setInterval(() => {
      setLeaderboard((prev) =>
        prev.map((player) => {
          const newPoints = player.points + Math.floor(Math.random() * 20);
          let newAchievements = [...player.achievements];
          if (newPoints >= 2500 && !newAchievements.includes("Elite Player")) {
            newAchievements.push("Elite Player");
            playAchievementSound();
            confetti();
          }
          if (newPoints >= 3000 && !newAchievements.includes("Grand Champion")) {
            newAchievements.push("Grand Champion");
            playAchievementSound();
            confetti();
          }
          return { ...player, points: newPoints, achievements: newAchievements };
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [playAchievementSound]);

  const handleLike = (id) => {
    setLeaderboard((prev) =>
      prev.map((player) =>
        player.id === id ? { ...player, likes: player.likes + 1 } : player
      )
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4">
        <Avatar size="lg" src="/avatar.png" />
        <h1 className="text-xl font-bold">ARK eSports</h1>
        <Button variant="ghost" onClick={() => setPage("notifications")}>
          <Bell className="text-purple-400" />
        </Button>
      </div>

      {page === "leaderboard" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
          <h2 className="text-lg font-bold mb-2">Leaderboard</h2>
          <AnimatePresence>
            {leaderboard.sort((a, b) => b.points - a.points).map((player) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="mb-2">
                  <CardContent>
                    <p className="text-purple-400">#{player.id} {player.name} - {player.points} Points</p>
                    <p className="text-gray-400">Country: {player.country}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button variant="ghost" onClick={() => handleLike(player.id)}>
                        <ThumbsUp className="text-purple-400" /> {player.likes}
                      </Button>
                      <div className="flex gap-2">
                        {player.badges.map((badge, index) => (
                          <span key={index} className="text-yellow-400 flex items-center gap-1">
                            <Award className="w-4 h-4" /> {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                    {player.achievements.length > 0 && (
                      <motion.div className="mt-2" initial={{ scale: 0.8 }} animate={{ scale: 1.1 }} transition={{ duration: 0.5 }}>
                        <p className="text-green-400 font-bold flex items-center gap-1">
                          <Sparkles className="text-yellow-400 w-5 h-5" /> Achievements Unlocked!
                        </p>
                        {player.achievements.map((ach, index) => (
                          <span key={index} className="text-blue-400 flex items-center gap-1">
                            <Award className="w-4 h-4" /> {ach}
                          </span>
                        ))}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          <Button variant="secondary" onClick={() => setPage("home")}>Back</Button>
        </motion.div>
      )}
    </div>
  );
}
