import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, Clock, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import type { LichessGame, ChessComGame } from "@shared/schema";
import { Link } from "wouter";

interface MatchCardProps {
  game: LichessGame | ChessComGame;
  championUsername: string;
  source: "lichess" | "chess.com";
  championId: number;
}

export function MatchCard({ game, championUsername, source, championId }: MatchCardProps) {
  let opponent = "";
  let result: "win" | "loss" | "draw" = "draw";
  let date = "";
  let opening = "";
  let timeControl = "";

  if (source === "lichess" && "players" in game) {
    const isWhite = game.players?.white?.user?.name?.toLowerCase() === championUsername.toLowerCase();
    opponent = isWhite 
      ? game.players?.black?.user?.name || "Unknown"
      : game.players?.white?.user?.name || "Unknown";
    
    if (game.winner) {
      if ((game.winner === "white" && isWhite) || (game.winner === "black" && !isWhite)) {
        result = "win";
      } else if (game.winner !== "draw") {
        result = "loss";
      }
    }
    
    date = game.createdAt ? new Date(game.createdAt).toLocaleDateString() : "";
    opening = game.opening?.name || "Unknown Opening";
    timeControl = game.speed || "Unknown";
  } else if (source === "chess.com" && "white" in game) {
    const isWhite = game.white?.username?.toLowerCase() === championUsername.toLowerCase();
    opponent = isWhite ? game.black?.username || "Unknown" : game.white?.username || "Unknown";
    
    const playerResult = isWhite ? game.white?.result : game.black?.result;
    if (playerResult === "win") result = "win";
    else if (playerResult === "lose" || playerResult === "resigned" || playerResult === "checkmated") result = "loss";
    
    date = game.end_time ? new Date(game.end_time * 1000).toLocaleDateString() : "";
    timeControl = game.time_control || "Unknown";
    
    if (game.pgn) {
      const openingMatch = game.pgn.match(/\[ECO "(.+?)"\]/);
      opening = openingMatch ? openingMatch[1] : "Unknown Opening";
    }
  }

  const resultColor = result === "win" ? "text-green-500" : result === "loss" ? "text-red-500" : "text-amber-500";
  const resultShadow = result === "win" ? "shadow-win" : result === "loss" ? "shadow-loss" : "shadow-draw";

  const getGameId = () => {
    if (source === "lichess") {
      return game.id;
    } else {
      const url = (game as ChessComGame).url || "";
      const parts = url.split('/').filter(Boolean);
      const gameIdIndex = parts.findIndex(p => p === 'live' || p === 'daily');
      if (gameIdIndex >= 0 && gameIdIndex < parts.length - 1) {
        return parts[gameIdIndex + 1];
      }
      return game.id || url.split('/').filter(Boolean).slice(-2, -1)[0] || "";
    }
  };

  const gameIdForUrl = getGameId();

  return (
    <Link href={`/champion/${championId}/game/${gameIdForUrl}`} data-testid={`link-game-${game.id}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card 
          className={`cursor-pointer hover:shadow-neon transition-all duration-300 hover-elevate active-elevate-2 ${resultShadow}`}
          data-testid={`card-match-${game.id}`}
        >
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <Badge 
                  className={`${resultColor} font-bold shrink-0`}
                  variant="outline"
                  data-testid={`badge-result-${game.id}`}
                >
                  {result === "win" ? "W" : result === "loss" ? "L" : "D"}
                </Badge>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Trophy className="w-4 h-4 shrink-0 text-muted-foreground" />
                    <span className="font-medium truncate" data-testid={`text-opponent-${game.id}`}>
                      vs {opponent}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <BookOpen className="w-3 h-3 shrink-0" />
                    <span className="truncate">{opening}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span data-testid={`text-date-${game.id}`}>{date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{timeControl}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
