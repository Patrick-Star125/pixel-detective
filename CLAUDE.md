**注意**：always respond in 中文

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a pixel art detective game (像素侦探) built with React, TypeScript, and Vite. Players navigate a mansion, interrogate NPCs using AI-powered dialogue (Google Gemini), and identify the killer within a limited timeframe.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (runs on port 3000, host 0.0.0.0)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Clean build artifacts
npm run clean

# Type-check without emitting files
npm run lint
```

## Environment Variables

The app requires a `GEMINI_API_KEY` for AI-powered NPC interactions. Create a `.env.local` file in the project root:

```bash
GEMINI_API_KEY=your_api_key_here
```

The `.env.example` file shows the required format. AI Studio automatically injects this at runtime.

## Architecture

### Game State Management

The game uses a state machine pattern managed in `App.tsx`:

- `START` → Initial screen
- `INTRO` → Story introduction (dialogue sequence)
- `PLAYING` → Main gameplay loop
- `SETTLING` → End of day dialogue
- `TRANSITIONING` → Black screen between days
- `ENDING` → Game conclusion

Note: `App.tsx` defines an `InternalGameState` enum that extends the `GameState` type from `types.ts` for UI-specific states.

### Core Components

- **`App.tsx`** - Main game controller, manages high-level state transitions
- **`GameScene.tsx`** - Main gameplay area with:
  - Player movement (WASD/Arrow keys)
  - Room navigation via doors
  - Object interaction detection
  - Game loop using `requestAnimationFrame`
  - Coordinate system: 0-100% relative positioning
- **`DialogueBox.tsx`** - Displays dialogue sequences with typing effect
- **`InteractionMenu.tsx`** - Context menu for NPC interaction (Talk/Interrogate)
- **`InterrogationChat.tsx`** - Chat interface for AI-powered NPC interrogation
- **`IdentifyKillerMenu.tsx`** - UI for player to identify the murderer
- **`StartScreen.tsx`** - Title/start screen

### Data Structure

**`gameData.ts`** contains:
- `INTRO_DIALOGUE` and `SETTLE_DIALOGUE` - Prescribed dialogue sequences
- `NPC_INFO` - Character metadata (name, icon emoji, description)
- `INITIAL_ROOMS` - Room layouts with positions for NPCs, items, and doors

**Room System:**
- 5 rooms: MAIN (hall), STUDY, GARDEN, KITCHEN, BEDROOM
- Each room has `GameObject[]` with position (x, y as percentages)
- Doors connect rooms with target room and spawn position

### AI Integration

**`services/gemini.ts`** handles NPC interrogation:
- Uses Google Gemini 2.5 Flash model
- Maintains conversation history per character (max 10 messages)
- Characters respond based on their description from `NPC_INFO`
- System prompt enforces role-playing constraints
- Fallback response on API errors

### Key Patterns

**Movement System:**
- Player position stored in both state (`playerPosition`) and ref (`posRef`)
- Ref used in game loop to avoid React re-renders
- State updated periodically for UI rendering
- Boundary clamping at 5-95% range

**Interaction Flow:**
1. Player approaches object (distance < 8%)
2. Press E/Space or click to interact
3. NPC: Show `InteractionMenu` (Talk/Interrogate options)
4. Item: Show dialogue directly
5. Door: Teleport to target room

**Type System:**
- `RoomId` - Union type for room identifiers
- `GameObject` - Can be NPC, ITEM, or DOOR
- `DialogueLine` - Optional speaker + text + optional image URL
- Positions use percentage-based coordinates (0-100)

## Build Configuration

- **Vite** with React plugin and Tailwind CSS
- **TypeScript** with `paths` alias: `@/*` maps to `./`
- **Tailwind CSS v4** via Vite plugin
- Environment variables are injected via `vite.config.ts` define
- HMR can be disabled via `DISABLE_HMR=true` (for AI Studio)

## Notes

- The game uses emoji icons for all sprites (NPCs, items, player)
- Animations use `motion` (Framer Motion)
- Demo ends after identifying the killer
- Day counter tracks game progression
- NPC interrogation history is not persisted across sessions
