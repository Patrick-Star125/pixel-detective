/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { GameState, DialogueLine } from './types';
import { INTRO_DIALOGUE, SETTLE_DIALOGUE, NPC_INFO } from './gameData';
import { StartScreen } from './components/StartScreen';
import { DialogueBox } from './components/DialogueBox';
import { GameScene } from './components/GameScene';

// Local expanded game states for UI logic
enum InternalGameState {
  START = 'START',
  INTRO = 'INTRO',
  PLAYING = 'PLAYING',
  INTERROGATING = 'INTERROGATING',
  SETTLING = 'SETTLING',
  ENDING = 'ENDING',
  TRANSITIONING = 'TRANSITIONING'
}

export default function App() {
  const [gameState, setGameState] = useState<InternalGameState>(InternalGameState.START);
  const [day, setDay] = useState(1);
  const [endingLines, setEndingLines] = useState<DialogueLine[]>([]);

  const handleStartGame = () => {
    setGameState(InternalGameState.INTRO);
  };

  const handleEnding = (killerId: string) => {
    const killerInfo = NPC_INFO[killerId];
    setEndingLines([
      { image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800" },
      { speaker: "你", text: `凶手就是你，${killerInfo.name}！` },
      { speaker: killerInfo.name, text: "……你有什么证据？！" },
      { speaker: "检察长", text: "带走吧。真相终于大白了。" },
      { text: "（Demo 结束。感谢您的游玩！）" }
    ]);
    setGameState(InternalGameState.ENDING);
  };

  return (
    <div className="w-full h-full bg-black text-white font-sans overflow-hidden relative">
      {gameState === InternalGameState.START && (
        <StartScreen onStart={handleStartGame} />
      )}
      
      {gameState === InternalGameState.INTRO && (
        <DialogueBox 
          dialogues={INTRO_DIALOGUE} 
          onComplete={() => setGameState(InternalGameState.PLAYING)} 
        />
      )}
      
      {gameState === InternalGameState.PLAYING && (
        <GameScene 
          day={day} 
          onSettleDay={() => setGameState(InternalGameState.SETTLING)} 
          onGameEnd={handleEnding}
        />
      )}

      {gameState === InternalGameState.SETTLING && (
        <DialogueBox 
          dialogues={SETTLE_DIALOGUE} 
          onComplete={() => {
             // Fake Black Screen Transition
             setGameState(InternalGameState.TRANSITIONING);
             setTimeout(() => {
               setDay(d => d + 1);
               setGameState(InternalGameState.PLAYING);
             }, 1500);
          }} 
        />
      )}

      {gameState === InternalGameState.TRANSITIONING && (
        <div className="w-full h-full bg-black flex items-center justify-center">
            <div className="text-white text-2xl font-mono animate-pulse">第 {day + 1} 天...</div>
        </div>
      )}

      {gameState === InternalGameState.ENDING && (
        <DialogueBox 
          dialogues={endingLines} 
          onComplete={() => {
             setDay(1);
             setGameState(InternalGameState.START);
          }} 
        />
      )}
    </div>
  );
}
