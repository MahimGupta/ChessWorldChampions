import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Trophy, Calendar } from "lucide-react";
import { SiLichess } from "react-icons/si";
import { SiChessdotcom } from "react-icons/si";
import type { Champion } from "@shared/schema";
import { Link } from "wouter";

interface ChampionCardProps {
  champion: Champion;
  index: number;
}

export function ChampionCard({ champion, index }: ChampionCardProps) {
  const hasOnlineAccounts = champion.chess_com || champion.lichess;
  
  return (
    <Link href={`/champion/${champion.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
          type: "spring",
          stiffness: 100,
        }}
        whileHover={{ scale: 1.05 }}
        className="h-full"
      >
        <Card 
          className="group relative overflow-hidden border-2 hover:shadow-neon-intense transition-all duration-300 cursor-pointer hover-elevate active-elevate-2 h-full"
          style={{
            borderColor: `hsl(${260 - index * 3}, 60%, 50%)`,
          }}
          data-testid={`card-champion-${champion.id}`}
        >
          <div 
            className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          />
          
          <CardHeader className="space-y-2 relative z-10">
            <div className="flex items-start justify-between gap-2">
              <Badge 
                variant="secondary" 
                className="font-display text-xs shrink-0"
                data-testid={`badge-rank-${champion.id}`}
              >
                <Crown className="w-3 h-3 mr-1" />
                #{champion.id}
              </Badge>
              {hasOnlineAccounts && (
                <div className="flex gap-1" data-testid={`icons-platforms-${champion.id}`}>
                  {champion.lichess && (
                    <SiLichess className="w-4 h-4 text-foreground/70" title="Lichess" />
                  )}
                  {champion.chess_com && (
                    <SiChessdotcom className="w-4 h-4 text-foreground/70" title="Chess.com" />
                  )}
                </div>
              )}
            </div>
            <CardTitle className="font-display text-lg leading-tight">
              {champion.name}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 relative z-10">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span data-testid={`text-dob-${champion.id}`}>
                Born {new Date(champion.dob).toLocaleDateString('en-US', { 
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>

            {!hasOnlineAccounts && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground italic">
                <Trophy className="w-3 h-3" />
                <span>Historical champion</span>
              </div>
            )}
          </CardContent>

          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
        </Card>
      </motion.div>
    </Link>
  );
}
