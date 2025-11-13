import { useQuery } from "@tanstack/react-query";
import { ChampionCard } from "@/components/ChampionCard";
import { SearchBar } from "@/components/SearchBar";
import { LoadingVortex } from "@/components/LoadingVortex";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import { ThemeToggle } from "@/components/ThemeToggle";
import { fetchChampions } from "@/lib/api";
import { Trophy } from "lucide-react";

export default function Home() {
  const { data: champions, isLoading, error } = useQuery({
    queryKey: ["/api/champions"],
    queryFn: fetchChampions,
  });

  return (
    <div className="min-h-screen relative">
      <StarfieldBackground />
      
      <div className="relative z-10">
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-primary" />
                <h1 
                  className="text-2xl sm:text-3xl font-display font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse"
                  style={{ textShadow: "0 0 20px rgba(147, 51, 234, 0.5)" }}
                >
                  ChessWC
                </h1>
              </div>
              
              <div className="flex-1 max-w-md">
                {champions && <SearchBar champions={champions} />}
              </div>
              
              <div data-testid="container-theme-toggle">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
              World Chess Champions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore the legendary lineage of world chess champions from modern grandmasters to historical pioneers. 
              Click on any champion to view their games, statistics, and AI-powered analysis.
            </p>
          </div>

          {isLoading && <LoadingVortex />}

          {error && (
            <div className="text-center py-12">
              <p className="text-destructive">Failed to load champions data</p>
            </div>
          )}

          {champions && (
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              data-testid="grid-champions"
            >
              {champions.map((champion, index) => (
                <ChampionCard 
                  key={champion.id} 
                  champion={champion} 
                  index={index}
                />
              ))}
            </div>
          )}
        </main>

        <footer className="mt-20 border-t border-border/50 backdrop-blur-xl bg-background/80">
          <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
            <p>Data sourced from Lichess and Chess.com public APIs</p>
            <p className="mt-2">Built with ♟️ for chess enthusiasts</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
