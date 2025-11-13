# ChessWC.com Design Guidelines

## Design Approach
**Selected Approach:** Reference-Based (Space/Sci-Fi Gaming UI) + Custom Theme
- Primary Inspiration: Futuristic space applications, sci-fi game interfaces, holographic UI patterns
- Aesthetic Direction: Space exploration meets competitive gaming - neon-lit cosmos with sophisticated data visualization
- Core Identity: Prestigious yet futuristic, honoring chess history through a galactic lens

## Typography System
**Primary Font:** Orbitron (Google Fonts) - galactic, futuristic aesthetic
- Hero/Headers: Orbitron Bold, large scale with neon glow text-shadow effects
- Body/Data: System font stack for optimal readability in data-dense sections
- Card Titles: Orbitron Medium with subtle letter-spacing
- Stats/Numbers: Tabular numerals for alignment, slightly larger weight for prominence

## Layout System
**Spacing Primitives:** Tailwind units 2, 4, 8, 12, 16, 20, 24 for consistent rhythm
- Base spacing: p-4, m-8 for standard components
- Section padding: py-16 to py-24 for major sections
- Card spacing: p-6 with gap-8 between grid items
- Tight data rows: py-2, px-4 for match cards

**Grid Patterns:**
- Home: Responsive masonry/grid - 4 columns desktop (grid-cols-4), 2 tablet, 1 mobile, displaying champions chronologically from current (top) to oldest (bottom) in star-trail descending pattern
- Player Pages: Single column centered content (max-w-4xl) with match cards in vertical stack
- Match Cards: Full-width cards in list format, sortable controls at top

## Component Library

### Player Cards (Home Grid)
- Rectangular cards with neon gradient borders (blue/purple spectrum)
- Glowing box-shadow effect (0 0 20px rgba(neon-blue))
- Hover state: Scale 1.1x with pulsing glow intensification
- Card content: Champion portrait placeholder, name (Orbitron), reign ID, DOB, platform icons if available
- Orbiting stats icons around card edges (wins as star icons, games as planet icons)

### Match Cards (Player Pages)
- Horizontal layout cards showing: opponent name, result badge (W/L/D with colored indicators), date, opening name, game length
- Draggable sorting handle on left edge
- Subtle hover lift effect
- Result badges: Win (neon green glow), Loss (red glow), Draw (amber glow)
- Click expands to full game analysis

### Navigation
- Top navigation bar: Semi-transparent with backdrop blur, sticky positioning
- Logo/site name left-aligned (Orbitron font with glow)
- Search bar center (autocomplete dropdown with fuzzy matching)
- Dark mode toggle right-aligned (deep space vs nebula icons)

### Analysis Board Section
- Centered chessboard (react-chessboard) with maximum width of 600px on desktop
- Move controls below board (previous/next, jump to position)
- Side panel showing AI evaluation, best moves list, position commentary
- Desktop: Board left, analysis right in 2-column layout
- Mobile: Stack vertically

### Modals/Overlays
- Semi-transparent dark background with heavy blur effect (backdrop-filter: blur(12px))
- Modal content: Centered with neon border glow, elevated z-index
- Close button: Top-right with subtle hover glow

### Loading States
- Vortex particle swirl animation for API fetches
- Skeleton screens with shimmer effect matching card structures

## Visual Theme Elements

**Color Palette (referenced, not specified):**
- Neon blues and purples for primary accents
- Deep space backgrounds
- Glowing borders and highlights
- Result indicators: green (wins), red (losses), amber (draws)

**Particle Effects:**
- Background: Twinkling stars, interactive magnetic particles (mouse-attracted), layered nebula with parallax depth
- Events: Particle bursts on wins, game completions
- Loading: Vortex swirl patterns

**Glow & Shadow:**
- Card borders: Neon glow (box-shadow with color blur)
- Text headers: Subtle text-shadow for holographic effect
- Hover states: Intensified glow on interactive elements
- Icons: Subtle outer glow for floating effect

## Animations

**Entrance Animations:**
- Player cards: Orbital entrance with staggered timing (react-spring physics)
- Stats: Float upward with fade-in (framer-motion stagger)

**Interaction Animations:**
- Hover: Scale 1.1x with pulse effect (150ms duration)
- Card selection: Glow intensification
- Page transitions: Hyperspace warp effect (particle stretch)

**Ambient Motion:**
- Orbiting stat icons around player cards (slow continuous rotation)
- Floating holographic tooltips with gentle bob motion
- Chessboard piece trails on moves (canvas overlay with glow fade)

**Timing:** Keep animations subtle and performant - 150-300ms for micro-interactions, 500-800ms for page transitions

## Responsive Behavior

**Desktop (1024px+):**
- 4-column player grid, 2-column analysis layout
- Full particle effects and parallax
- Hover states fully active

**Tablet (768-1023px):**
- 2-column player grid
- Stacked analysis sections
- Reduced particle density

**Mobile (<768px):**
- Single column stack for all layouts
- Swipe gestures for player card navigation
- Simplified particle effects for performance
- Touch-optimized spacing (larger tap targets)

## Images
**Hero Image:** No traditional hero section - replace with immediate galactic grid of champion cards on landing. Background is particle-animated starfield, not static imagery.

**Champion Portraits:** Placeholder slots in player cards for champion photos/avatars (stylized with neon border treatment). Historical champions may use chess piece silhouettes if no photos available.

**Icons:** Chess piece SVG icons for stats (king=wins, rook=games played, knight=rapid games, etc.) with neon stroke styling.

## Accessibility & Polish
- High contrast neon on dark ensures readability
- Keyboard navigation with visible focus states (glowing outline)
- Error states: "No online account available" for null usernames with muted styling
- Loading states prevent layout shift
- Tooltips provide context for icons and abbreviated stats
- All interactive elements have 44px minimum touch target on mobile