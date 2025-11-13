import { z } from "zod";

export const championSchema = z.object({
  id: z.number(),
  name: z.string(),
  dob: z.string(),
  chess_com: z.string().nullable(),
  lichess: z.string().nullable(),
});

export type Champion = z.infer<typeof championSchema>;

export const lichessUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  perfs: z.record(z.object({
    games: z.number().optional(),
    rating: z.number().optional(),
    rd: z.number().optional(),
    prog: z.number().optional(),
  })).optional(),
  count: z.object({
    all: z.number().optional(),
    rated: z.number().optional(),
    ai: z.number().optional(),
    draw: z.number().optional(),
    drawH: z.number().optional(),
    loss: z.number().optional(),
    lossH: z.number().optional(),
    win: z.number().optional(),
    winH: z.number().optional(),
  }).optional(),
});

export type LichessUser = z.infer<typeof lichessUserSchema>;

export const lichessGameSchema = z.object({
  id: z.string(),
  rated: z.boolean().optional(),
  variant: z.string().optional(),
  speed: z.string().optional(),
  perf: z.string().optional(),
  createdAt: z.number().optional(),
  lastMoveAt: z.number().optional(),
  status: z.string().optional(),
  players: z.object({
    white: z.object({
      user: z.object({
        name: z.string().optional(),
        id: z.string().optional(),
      }).optional(),
      rating: z.number().optional(),
    }).optional(),
    black: z.object({
      user: z.object({
        name: z.string().optional(),
        id: z.string().optional(),
      }).optional(),
      rating: z.number().optional(),
    }).optional(),
  }).optional(),
  winner: z.string().optional(),
  opening: z.object({
    eco: z.string().optional(),
    name: z.string().optional(),
    ply: z.number().optional(),
  }).optional(),
  moves: z.string().optional(),
  pgn: z.string().optional(),
});

export type LichessGame = z.infer<typeof lichessGameSchema>;

export const chessComPlayerSchema = z.object({
  player_id: z.number().optional(),
  username: z.string().optional(),
  name: z.string().optional(),
  avatar: z.string().optional(),
  location: z.string().optional(),
  country: z.string().optional(),
  status: z.string().optional(),
  is_streamer: z.boolean().optional(),
});

export type ChessComPlayer = z.infer<typeof chessComPlayerSchema>;

export const chessComGameSchema = z.object({
  url: z.string().optional(),
  pgn: z.string().optional(),
  time_control: z.string().optional(),
  end_time: z.number().optional(),
  rated: z.boolean().optional(),
  accuracies: z.object({
    white: z.number().optional(),
    black: z.number().optional(),
  }).optional(),
  white: z.object({
    rating: z.number().optional(),
    result: z.string().optional(),
    username: z.string().optional(),
  }).optional(),
  black: z.object({
    rating: z.number().optional(),
    result: z.string().optional(),
    username: z.string().optional(),
  }).optional(),
});

export type ChessComGame = z.infer<typeof chessComGameSchema>;

export const stockfishAnalysisSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  bestmove: z.string().optional(),
  continuation: z.string().optional(),
  depth: z.number().optional(),
  score: z.number().optional(),
  mate: z.number().optional().nullable(),
});

export type StockfishAnalysis = z.infer<typeof stockfishAnalysisSchema>;
