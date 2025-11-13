import { useRoute, Link } from "wouter";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LoadingVortex } from "@/components/LoadingVortex";
import { Chess } from "chess.js";
import Chessboard from "chessboardjsx";
import { useQuery } from "@tanstack/react-query";
import { fetchChampions, fetchLichessGames, fetchChessComGames, analyzePosition } from "@/lib/api";

export default function GameAnalysis() {
  const [, params] = useRoute("/champion/:championId/game/:gameId");
  const championId = params?.championId ? parseInt(params.championId) : null;
  const gameId = params?.gameId;

  const [chess] = useState(new Chess());
  const [currentMove, setCurrentMove] = useState(0);
  const [moves, setMoves] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [fen, setFen] = useState("start");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const boardInitialized = useRef(false);
  const analysisAbortController = useRef<AbortController | null>(null);

  const { data: champions } = useQuery({
    queryKey: ["/api/champions"],
    queryFn: fetchChampions,
  });

  const champion = champions?.find((c) => c.id === championId);

  const { data: lichessGames } = useQuery({
    queryKey: ["lichess-games", champion?.lichess],
    queryFn: () => fetchLichessGames(champion!.lichess!, 50),
    enabled: !!champion?.lichess,
  });

  const { data: chessComGames } = useQuery({
    queryKey: ["chess-com-games", champion?.chess_com],
    queryFn: () => fetchChessComGames(champion!.chess_com!),
    enabled: !!champion?.chess_com,
  });

  const game = lichessGames?.find(g => g.id === gameId) || chessComGames?.find(g => {
    if (!g.url || !gameId) return false;
    const parts = g.url.split('/').filter(Boolean);
    const gameIdIndex = parts.findIndex(p => p === 'live' || p === 'daily');
    const urlGameId = gameIdIndex >= 0 && gameIdIndex < parts.length - 1 
      ? parts[gameIdIndex + 1] 
      : parts.slice(-2, -1)[0] || '';
    return urlGameId === gameId || g.url.includes(`/${gameId}/`);
  });

  useEffect(() => {
    boardInitialized.current = false;
    setMoves([]);
    setFen("start");
    setCurrentMove(0);
    setAnalysis(null);
    setIsAnalyzing(false);
    setAnalysisError(null);
    
    if (analysisAbortController.current) {
      analysisAbortController.current.abort();
    }
  }, [gameId]);

  useEffect(() => {
    if (game && !boardInitialized.current) {
      let pgn = "";
      if ("pgn" in game && game.pgn) {
        pgn = game.pgn;
      } else if ("moves" in game && game.moves) {
        pgn = game.moves;
      }

      if (pgn) {
        try {
          chess.reset();
          chess.loadPgn(pgn);
          const history = chess.history({ verbose: true });
          setMoves(history.map(m => m.san));
          chess.reset();
          setFen(chess.fen());
          boardInitialized.current = true;
        } catch (error) {
          console.error("Error loading PGN:", error);
        }
      }
    }
  }, [game, chess]);

  const goToMove = async (moveIndex: number) => {
    if (analysisAbortController.current) {
      analysisAbortController.current.abort();
    }

    chess.reset();
    const history = moves.slice(0, moveIndex + 1);
    
    for (const move of history) {
      try {
        chess.move(move);
      } catch (error) {
        console.error("Invalid move:", move, error);
      }
    }

    const newFen = chess.fen();
    setFen(newFen);
    setCurrentMove(moveIndex);

    analysisAbortController.current = new AbortController();
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const analysisResult = await analyzePosition(newFen, 12, analysisAbortController.current.signal);
      if (analysisResult) {
        setAnalysis(analysisResult);
      } else {
        setAnalysisError("No analysis available");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        setAnalysisError("Analysis failed");
        console.error("Analysis error:", error);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const nextMove = () => {
    if (currentMove < moves.length - 1) {
      goToMove(currentMove + 1);
    }
  };

  const prevMove = () => {
    if (currentMove > 0) {
      goToMove(currentMove - 1);
    }
  };

  const reset = () => {
    if (analysisAbortController.current) {
      analysisAbortController.current.abort();
    }
    chess.reset();
    setFen("start");
    setCurrentMove(0);
    setAnalysis(null);
    setIsAnalyzing(false);
    setAnalysisError(null);
  };

  if (!game || !champion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <StarfieldBackground />
        <div className="relative z-10 text-center">
          <h2 className="text-2xl font-display mb-4">Game not found</h2>
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

  return (
    <div className="min-h-screen relative">
      <StarfieldBackground />
      
      <div className="relative z-10">
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href={`/champion/${championId}`}>
              <Button variant="ghost" data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-display font-bold mb-6">
            Game Analysis
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Chess Board</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="max-w-[600px] mx-auto" data-testid="chessboard-container">
                    <Chessboard
                      position={fen}
                      width={600}
                      boardStyle={{
                        borderRadius: "8px",
                        boxShadow: "0 0 20px rgba(147, 51, 234, 0.3)",
                      }}
                      darkSquareStyle={{ backgroundColor: "#6366f1" }}
                      lightSquareStyle={{ backgroundColor: "#c7d2fe" }}
                    />
                  </div>

                  <div className="bg-muted p-3 rounded font-mono text-xs break-all">
                    <span className="text-muted-foreground">FEN: </span>
                    {fen}
                  </div>

                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={reset}
                      data-testid="button-reset"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={prevMove}
                      disabled={currentMove === 0}
                      data-testid="button-prev"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div className="px-4 py-2 bg-muted rounded text-sm font-mono">
                      Move {currentMove} / {moves.length}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={nextMove}
                      disabled={currentMove === moves.length - 1}
                      data-testid="button-next"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Move List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto">
                    {moves.map((move, index) => (
                      <button
                        key={index}
                        onClick={() => goToMove(index)}
                        className={`px-3 py-2 rounded text-sm font-mono transition-colors ${
                          index === currentMove
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-accent"
                        }`}
                        data-testid={`button-move-${index}`}
                      >
                        {Math.floor(index / 2) + 1}.{index % 2 === 0 ? "" : ".."} {move}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Game Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Opening:</span>{" "}
                    <span className="font-medium">
                      {"opening" in game ? game.opening?.name || "Unknown" : "Unknown"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Moves:</span>{" "}
                    <span className="font-medium">{moves.length}</span>
                  </div>
                </CardContent>
              </Card>

              {isAnalyzing && (
                <Card className="border-primary/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Computing best moves with AI engine...
                    </p>
                  </CardContent>
                </Card>
              )}

              {analysisError && !isAnalyzing && (
                <Card className="border-destructive/50">
                  <CardHeader>
                    <CardTitle className="text-lg text-destructive">
                      Analysis Failed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {analysisError}
                    </p>
                  </CardContent>
                </Card>
              )}

              {analysis && !isAnalyzing && !analysisError && (
                <Card className="border-primary/50" data-testid="card-analysis">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      🤖 AI Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {analysis.bestmove && (
                      <div>
                        <span className="text-muted-foreground">Best Move:</span>{" "}
                        <span className="font-mono font-bold text-primary" data-testid="text-best-move">
                          {analysis.bestmove}
                        </span>
                      </div>
                    )}
                    {analysis.score !== undefined && (
                      <div>
                        <span className="text-muted-foreground">Evaluation:</span>{" "}
                        <span className="font-mono font-bold" data-testid="text-evaluation">
                          {analysis.score > 0 ? "+" : ""}{(analysis.score / 100).toFixed(2)}
                        </span>
                      </div>
                    )}
                    {analysis.depth && (
                      <div>
                        <span className="text-muted-foreground">Depth:</span>{" "}
                        <span className="font-mono">{analysis.depth}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
