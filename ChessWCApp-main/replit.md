# ChessWC.com - World Chess Champions Gallery

## Overview
ChessWC.com is a fully functional React SPA showcasing the history of 18 world chess champions with a futuristic space theme. Features live game data from Lichess/Chess.com APIs, AI-powered game analysis, interactive particle effects, fuzzy search, sortable match cards, dark mode, and advanced animations.

**Current State**: Fully functional MVP deployed to Replit with all core features implemented.

## Recent Changes
- **Nov 13, 2025**: Complete implementation of ChessWC.com MVP
  - Built all frontend components with space theme (Orbitron font, neon glows, tsParticles)
  - Created backend API routes for champions data
  - Integrated Lichess and Chess.com APIs for live game data
  - Implemented fuzzy search using Fuse.js (replaced react-autosuggest)
  - Added visual chess board using chessboardjsx library
  - Game analysis with chess.js, FEN visualization, and move navigation
  - AI position analysis with loading/error states
  - Fixed React hook errors by removing react-autosuggest dependency
  - Added comprehensive data-testid coverage for testing
  - Implemented dark mode with localStorage persistence
  - Added abort controller for analysis requests to prevent race conditions

## Project Architecture

### Design Theme
**Galactic/Space Theme**: 
- Primary colors: Neon blue (#3b82f6) and purple (#a855f7)
- Font: Orbitron (display) + Inter (body)
- Effects: Neon glows, particle backgrounds, smooth animations
- Dark mode: Nebula variant with deep space backgrounds

### Directory Structure
```
client/
  ├── src/
  │   ├── components/
  │   │   ├── ChampionCard.tsx       # Individual champion cards with animations
  │   │   ├── SearchBar.tsx          # Fuzzy search with Fuse.js
  │   │   ├── MatchCard.tsx          # Game result cards
  │   │   ├── StatsDisplay.tsx       # Win/loss/draw statistics
  │   │   ├── LoadingVortex.tsx      # Particle loading animation
  │   │   ├── StarfieldBackground.tsx # tsParticles space background
  │   │   └── ThemeToggle.tsx        # Dark/light mode toggle
  │   ├── pages/
  │   │   ├── Home.tsx               # Main champions gallery
  │   │   ├── PlayerDetail.tsx       # Champion profile with games
  │   │   └── GameAnalysis.tsx       # Game viewer with chess.js
  │   ├── lib/
  │   │   ├── api.ts                 # API client functions
  │   │   └── queryClient.ts         # TanStack Query config
  │   └── index.css                  # Tailwind + custom CSS
  ├── index.html                     # SEO meta tags, fonts
server/
  ├── routes.ts                      # API endpoints
  └── index.ts                       # Express server
data/
  └── champions.json                 # 18 world champions data
shared/
  └── schema.ts                      # TypeScript types
```

### Key Technologies
- **Frontend**: React 18, TanStack Query, Wouter (routing), Framer Motion, tsParticles
- **Backend**: Express.js, Node.js
- **Chess**: chess.js (PGN parsing, FEN generation), chessboardjsx (visual board)
- **Styling**: Tailwind CSS, shadcn/ui components
- **APIs**: Lichess API, Chess.com API, Chess-API.com (analysis)
- **State**: TanStack Query for server state, localStorage for theme

### Data Flow
1. `/api/champions` → Returns 18 world champions from `data/champions.json`
2. `fetchLichessUser()` → Gets player profile from Lichess API
3. `fetchLichessGames()` → Streams NDJSON game data
4. `fetchChessComGames()` → Gets current month's games
5. `analyzePosition()` → Sends FEN to Chess-API.com for engine analysis

### Build Configuration
**Cloudflare Pages Deployment**:
- Output: `dist/public/` (configured in `vite.config.ts`)
- Build command: `npm run build`
- All static assets compiled to single directory for CF Pages

## User Preferences
- **Testing**: Always add `data-testid` attributes to interactive elements
- **Design**: Space theme with neon effects, minimal borders, smooth animations
- **Code Style**: TypeScript strict mode, functional components, TanStack Query patterns
- **Deployment**: Optimized for Cloudflare Pages (static SPA)

## Feature List
### Implemented ✅
- [x] Home page with 18 champion cards in responsive grid
- [x] Fuzzy search for champions (Fuse.js)
- [x] Player detail pages with stats (win/loss/draw)
- [x] Live games from Lichess and Chess.com
- [x] Infinite scroll for game lists
- [x] Visual chess board (chessboardjsx) with move navigation
- [x] Game analysis with FEN display and clickable move list
- [x] AI position analysis (Chess-API.com) with loading/error states
- [x] Dark mode toggle with localStorage
- [x] Particle effects (starfield, loading vortex)
- [x] Responsive design (mobile-first)
- [x] SEO meta tags
- [x] Comprehensive data-testid coverage for testing
- [x] Abort controller for async analysis (prevents race conditions)

### Known Limitations
- External API calls directly from browser (no backend proxy/rate limiting)
- Chess-API.com may have downtime (no Stockfish.js fallback implemented)
- Historical champions (pre-internet era) have no online game data
- Board interactions are view-only (no drag-drop or click-to-move)

## Development Commands
```bash
npm run dev          # Start development server (port 5000)
npm run build        # Build for production (outputs to dist/public/)
npm run preview      # Preview production build
```

## Dependencies
- React 18 + Vite
- TanStack Query v5
- Tailwind CSS + shadcn/ui
- Framer Motion
- tsParticles
- chess.js
- Fuse.js (fuzzy search)
- Wouter (routing)
- Lucide React (icons)

## Notes
- **API Rate Limits**: Lichess allows 60 requests/min, Chess.com has no documented limit
- **Data Freshness**: Game data refreshed on each page visit (TanStack Query caching)
- **Browser Support**: Modern browsers only (ES2020+, CSS Grid, CSS custom properties)
