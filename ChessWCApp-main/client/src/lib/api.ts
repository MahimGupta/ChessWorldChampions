import type { Champion, LichessUser, LichessGame, ChessComPlayer, ChessComGame } from "@shared/schema";

export async function fetchChampions(): Promise<Champion[]> {
  const response = await fetch("/api/champions");
  if (!response.ok) {
    throw new Error("Failed to fetch champions");
  }
  return response.json();
}

export async function fetchLichessUser(username: string): Promise<LichessUser> {
  const response = await fetch(`https://lichess.org/api/user/${username}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Lichess user: ${username}`);
  }
  return response.json();
}

export async function fetchLichessGames(username: string, max: number = 20): Promise<LichessGame[]> {
  const response = await fetch(`https://lichess.org/api/games/user/${username}?max=${max}&pgnInJson=true`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Lichess games for: ${username}`);
  }
  
  const text = await response.text();
  const games = text
    .trim()
    .split('\n')
    .filter(line => line.trim())
    .map(line => JSON.parse(line));
  
  return games;
}

export async function fetchChessComPlayer(username: string): Promise<ChessComPlayer> {
  const response = await fetch(`https://api.chess.com/pub/player/${username}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch Chess.com player: ${username}`);
  }
  return response.json();
}

export async function fetchChessComGames(username: string): Promise<ChessComGame[]> {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  
  const response = await fetch(`https://api.chess.com/pub/player/${username}/games/${year}/${month}`);
  if (!response.ok) {
    const prevMonth = now.getMonth() === 0 ? 12 : now.getMonth();
    const prevYear = now.getMonth() === 0 ? year - 1 : year;
    const prevMonthStr = String(prevMonth).padStart(2, '0');
    
    const fallbackResponse = await fetch(`https://api.chess.com/pub/player/${username}/games/${prevYear}/${prevMonthStr}`);
    if (!fallbackResponse.ok) {
      throw new Error(`Failed to fetch Chess.com games for: ${username}`);
    }
    const data = await fallbackResponse.json();
    return data.games || [];
  }
  
  const data = await response.json();
  return data.games || [];
}

export async function analyzePosition(fen: string, depth: number = 15, signal?: AbortSignal): Promise<any> {
  try {
    const response = await fetch('https://chess-api.com/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fen, depth }),
      signal,
    });
    
    if (!response.ok) {
      throw new Error('Chess API failed');
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    console.error('Chess API error:', error);
    return null;
  }
}
