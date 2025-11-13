import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface StatsDisplayProps {
  wins: number;
  losses: number;
  draws: number;
  totalGames: number;
}

export function StatsDisplay({ wins, losses, draws, totalGames }: StatsDisplayProps) {
  const winRate = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="hover-elevate">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" />
              Total Games
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-display font-bold" data-testid="stat-total-games">
              {totalGames}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="hover-elevate">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-green-500" />
              Win Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-16 h-16">
              <CircularProgressbar
                value={Number(winRate)}
                text={`${winRate}%`}
                styles={buildStyles({
                  textSize: "24px",
                  pathColor: "rgb(34, 197, 94)",
                  textColor: "hsl(var(--foreground))",
                  trailColor: "hsl(var(--muted))",
                })}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="hover-elevate">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              Wins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-display font-bold text-green-500" data-testid="stat-wins">
              {wins}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="hover-elevate">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              W/D/L Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 text-sm">
              <span className="text-green-500 font-bold">{wins}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-amber-500 font-bold">{draws}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-red-500 font-bold">{losses}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
