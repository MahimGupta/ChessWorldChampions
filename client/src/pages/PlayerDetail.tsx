import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { useState } from "react";
import { ArrowLeft, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import { LoadingVortex } from "@/components/LoadingVortex";
import { MatchCard } from "@/components/MatchCard";
import { StatsDisplay } from "@/components/StatsDisplay";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  fetchChampions, 
  fetchLichessUser, 
  fetchLichessGames,
  fetchChessComGames 
} from "@/lib/api";
import type { LichessGame, ChessComGame } from "@shared/schema";
import InfiniteScroll from "react-infinite-scroll-component";

export default function PlayerDetail() {
  const [, params] = useRoute("/champion/:id");
  const championId = params?.id ? parseInt(params.id) : null;
  const [sortBy, setSortBy] = useState<"date" | "result">("date");
  const [displayedGames, setDisplayedGames] = useState(20);

  const { data: champions } = useQuery({
    queryKey: ["/api/champions"],
    queryFn: fetchChampions,
  });

  const champion = champions?.find((c) => c.id === championId);

  const { data: lichessUser, isLoading: lichessUserLoading } = useQuery({
    queryKey: ["lichess-user", champion?.lichess],
    queryFn: () => fetchLichessUser(champion!.lichess!),
    enabled: !!champion?.lichess,
  });

  const { data: lichessGames, isLoading: lichessGamesLoading } = useQuery({
    queryKey: ["lichess-games", champion?.lichess],
    queryFn: () => fetchLichessGames(champion!.lichess!, 50),
    enabled: !!champion?.lichess,
  });

  const { data: chessComGames, isLoading: chessComGamesLoading } = useQuery({
    queryKey: ["chess-com-games", champion?.chess_com],
    queryFn: () => fetchChessComGames(champion!.chess_com!),
    enabled: !!champion?.chess_com,
  });

  if (!championId || !champions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingVortex />
      </div>
    );
  }

  if (!champion) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <StarfieldBackground />
        <div className="relative z-10 text-center">
          <h2 className="text-2xl font-display mb-4">Champion not found</h2>
          <Link href="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const hasOnlineData = champion.lichess || champion.chess_com;

  const allGames: Array<{ game: LichessGame | ChessComGame; source: "lichess" | "chess.com" }> = [
    ...(lichessGames?.map(g => ({ game: g, source: "lichess" as const })) || []),
    ...(chessComGames?.map(g => ({ game: g, source: "chess.com" as const })) || []),
  ];

  const sortedGames = [...allGames].sort((a, b) => {
    if (sortBy === "date") {
      const dateA = "createdAt" in a.game ? a.game.createdAt || 0 : ("end_time" in a.game ? a.game.end_time || 0 : 0);
      const dateB = "createdAt" in b.game ? b.game.createdAt || 0 : ("end_time" in b.game ? b.game.end_time || 0 : 0);
      return dateB - dateA;
    }
    return 0;
  });

  const stats = {
    wins: lichessUser?.count?.win || 0,
    losses: lichessUser?.count?.loss || 0,
    draws: lichessUser?.count?.draw || 0,
    totalGames: lichessUser?.count?.all || 0,
  };

  const loadMoreGames = () => {
    setDisplayedGames(prev => Math.min(prev + 20, sortedGames.length));
  };

  return (
    <div className="min-h-screen relative">
      <StarfieldBackground />
      
      <div className="relative z-10">
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <Badge variant="secondary" className="font-display">
                World Champion #{champion.id}
              </Badge>
            </div>
            <h1 className="text-4xl font-display font-bold mb-2" data-testid="heading-champion-name">
              {champion.name}
            </h1>
            <p className="text-muted-foreground">
              Born {new Date(champion.dob).toLocaleDateString('en-US', { 
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {!hasOnlineData ? (
            <div className="text-center py-12 bg-card border border-card-border rounded-lg">
              <p className="text-muted-foreground">
                No online account available for this historical champion
              </p>
            </div>
          ) : (
            <Tabs defaultValue="games" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="games" data-testid="tab-games">Games</TabsTrigger>
                {champion.lichess && (
                  <TabsTrigger value="stats" data-testid="tab-stats">Statistics</TabsTrigger>
                )}
              </TabsList>

              {champion.lichess && (
                <TabsContent value="stats">
                  {lichessUserLoading ? (
                    <LoadingVortex />
                  ) : (
                    <StatsDisplay {...stats} />
                  )}
                </TabsContent>
              )}

              <TabsContent value="games">
                <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
                  <h2 className="text-xl font-display">Recent Games</h2>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <Button
                      variant={sortBy === "date" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSortBy("date")}
                      data-testid="button-sort-date"
                    >
                      By Date
                    </Button>
                  </div>
                </div>

                {(lichessGamesLoading || chessComGamesLoading) && <LoadingVortex />}

                {!lichessGamesLoading && !chessComGamesLoading && sortedGames.length === 0 && (
                  <div className="text-center py-12 bg-card border border-card-border rounded-lg">
                    <p className="text-muted-foreground">No recent games found</p>
                  </div>
                )}

                {sortedGames.length > 0 && (
                  <InfiniteScroll
                    dataLength={displayedGames}
                    next={loadMoreGames}
                    hasMore={displayedGames < sortedGames.length}
                    loader={<div className="text-center py-4 text-muted-foreground">Loading more...</div>}
                    endMessage={<div className="text-center py-4 text-muted-foreground">No more games</div>}
                  >
                    <div className="space-y-3">
                      {sortedGames.slice(0, displayedGames).map((item, index) => (
                        <MatchCard
                          key={item.game.id || index}
                          game={item.game}
                          championUsername={item.source === "lichess" ? champion.lichess! : champion.chess_com!}
                          source={item.source}
                          championId={champion.id}
                        />
                      ))}
                    </div>
                  </InfiniteScroll>
                )}
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </div>
  );
}
