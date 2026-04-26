import { useState, useEffect, useRef } from 'react';
import { RoomId, Position, GameObject, GameState, DialogueLine } from '../types';
import { INITIAL_ROOMS, NPC_INFO } from '../gameData';
import { DialogueBox } from './DialogueBox';
import { InteractionMenu } from './InteractionMenu';
import { InterrogationChat } from './InterrogationChat';
import { IdentifyKillerMenu } from './IdentifyKillerMenu';
import { submitInterrogation } from '../services/gemini';
import { motion } from 'motion/react';

interface GameSceneProps {
  day: number;
  onSettleDay: () => void;
  onGameEnd: (killerId: string) => void;
}

const MOVE_SPEED = 1.0;
const COL_SIZE = 2; // Hitbox radius

export function GameScene({ day, onSettleDay, onGameEnd }: GameSceneProps) {
  const [currentRoom, setCurrentRoom] = useState<RoomId>('MAIN');
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 50, y: 70 });
  const [interactionTarget, setInteractionTarget] = useState<GameObject | null>(null);
  
  const [activeDialogue, setActiveDialogue] = useState<DialogueLine[] | null>(null);
  
  const [isInterrogating, setIsInterrogating] = useState<GameObject | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  
  const [showIdentifyMenu, setShowIdentifyMenu] = useState(false);

  const keysRef = useRef<{ [key: string]: boolean }>({});
  const rafRef = useRef<number>(0);
  const posRef = useRef(playerPosition);

  const room = INITIAL_ROOMS[currentRoom];

  // Game Loop for Movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't move if we are in a UI overlay
      if (interactionTarget || activeDialogue || isInterrogating || showIdentifyMenu) {
        keysRef.current = {};
        return;
      }
      keysRef.current[e.key.toLowerCase()] = true;
      
      // Interaction key
      if (e.key === ' ' || e.key === 'e') {
        checkForInteraction();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      delete keysRef.current[e.key.toLowerCase()];
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [interactionTarget, activeDialogue, isInterrogating, showIdentifyMenu, room]);

  useEffect(() => {
    const updateLoop = () => {
      if (interactionTarget || activeDialogue || isInterrogating || showIdentifyMenu) {
         rafRef.current = requestAnimationFrame(updateLoop);
         return;
      }

      let dx = 0;
      let dy = 0;
      if (keysRef.current['w'] || keysRef.current['arrowup']) dy -= MOVE_SPEED;
      if (keysRef.current['s'] || keysRef.current['arrowdown']) dy += MOVE_SPEED;
      if (keysRef.current['a'] || keysRef.current['arrowleft']) dx -= MOVE_SPEED;
      if (keysRef.current['d'] || keysRef.current['arrowright']) dx += MOVE_SPEED;

      if (dx !== 0 || dy !== 0) {
        // Normalize diagonal
        if (dx !== 0 && dy !== 0) {
          const length = Math.sqrt(dx * dx + dy * dy);
          dx = (dx / length) * MOVE_SPEED;
          dy = (dy / length) * MOVE_SPEED;
        }

        let newX = posRef.current.x + dx;
        let newY = posRef.current.y + dy;

        // Boundaries
        newX = Math.max(5, Math.min(95, newX));
        newY = Math.max(5, Math.min(95, newY));

        posRef.current = { x: newX, y: newY };
        setPlayerPosition({ x: newX, y: newY });
      }

      rafRef.current = requestAnimationFrame(updateLoop);
    };
    
    rafRef.current = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [interactionTarget, activeDialogue, isInterrogating, showIdentifyMenu]);

  const checkForInteraction = () => {
    const { x, y } = posRef.current;
    const INTERACT_DIST = 8;

    for (const obj of room.objects) {
      const dist = Math.sqrt(Math.pow(obj.position.x - x, 2) + Math.pow(obj.position.y - y, 2));
      if (dist < INTERACT_DIST) {
        if (obj.type === 'DOOR' && obj.targetRoom && obj.targetPosition) {
          setCurrentRoom(obj.targetRoom);
          posRef.current = { ...obj.targetPosition };
          setPlayerPosition({ ...obj.targetPosition });
          keysRef.current = {};
        } else {
          setInteractionTarget(obj);
        }
        break;
      }
    }
  };

  const handleSendInterrogation = async (message: string) => {
    if (!isInterrogating) return;
    setIsThinking(true);
    
    // First, show user question
    setActiveDialogue([{ speaker: "侦探", text: message }]);
    
    // Fetch response from LLM
    const npcKey = Object.keys(NPC_INFO).find(k => NPC_INFO[k].name === isInterrogating.name);
    const npcDesc = npcKey ? NPC_INFO[npcKey].desc : "";
    
    const reply = await submitInterrogation(isInterrogating.name, npcDesc, message);
    setIsThinking(false);
    
    // Split reply by sentences
    const sentences = reply.split(/(?<=[。！？!?])/).filter(s => s.trim().length > 0);
    const dialogueLines = sentences.map(s => ({ speaker: isInterrogating.name, text: s }));
    
    setActiveDialogue([{ speaker: "侦探", text: message }, ...dialogueLines]);
  };

  return (
    <div className="relative w-full h-screen bg-gray-950 flex flex-col items-center justify-center overflow-hidden">
      
      {/* Top UI */}
      <div className="absolute top-4 left-4 text-white bg-gray-900/80 p-4 rounded border border-gray-700">
         <div className="text-xl font-bold">第 {day} 天</div>
         <div className="text-sm text-gray-400">线索: 0</div>
      </div>

      {/* Game Board */}
      <div className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-stone-800 rounded-lg relative shadow-2xl border-4 border-stone-900 overflow-hidden">
        {/* Room Label */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-stone-500 font-bold bg-stone-900/50 px-3 py-1 rounded text-sm z-10">
          {room.name}
        </div>
        
        {/* Render Objects */}
        {room.objects.map(obj => (
          <div 
            key={obj.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer transition-transform hover:scale-110"
            style={{ left: `${obj.position.x}%`, top: `${obj.position.y}%` }}
            onClick={() => {
              if (obj.type === 'DOOR' && obj.targetRoom && obj.targetPosition) {
                setCurrentRoom(obj.targetRoom);
                posRef.current = { ...obj.targetPosition };
                setPlayerPosition({ ...obj.targetPosition });
              } else {
                setInteractionTarget(obj);
              }
            }}
          >
            <div className="text-3xl filter drop-shadow-md bg-black/20 rounded-full w-10 h-10 flex items-center justify-center p-1 border border-white/10">{obj.icon}</div>
            {obj.type !== 'DOOR' && <div className="text-[10px] text-white mt-1 bg-black/50 px-1 rounded truncate max-w-[60px]">{obj.name}</div>}
            {obj.type === 'DOOR' && <div className="text-[10px] text-yellow-300 mt-1 bg-black/50 px-1 rounded truncate max-w-[60px]">{obj.name}</div>}
          </div>
        ))}

        {/* Player */}
        <motion.div 
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none"
          animate={{ left: `${playerPosition.x}%`, top: `${playerPosition.y}%` }}
          transition={{ type: 'tween', duration: 0.05, ease: 'linear' }}
        >
          <div className="text-3xl filter drop-shadow hover:scale-110 bg-blue-500 w-10 h-10 flex items-center justify-center rounded border-2 border-white/20">🕵️</div>
          <div className="text-[10px] text-blue-200 mt-1 bg-black/50 px-1 rounded">侦探</div>
        </motion.div>
      </div>

      {/* Bottom hint text if in dialogue or interaction menu is active we can hide this */}
      {!interactionTarget && !activeDialogue && !isInterrogating && !showIdentifyMenu && (
         <div className="absolute bottom-6 bg-black/80 text-gray-400 px-6 py-2 rounded-full text-sm border border-gray-800">
           按方向键移动，靠近角色或物品按 E 键交互
         </div>
      )}

      {/* Bottom UI Buttons */}
      {!interactionTarget && !activeDialogue && !isInterrogating && !showIdentifyMenu && (
        <div className="absolute bottom-6 right-6 flex gap-4">
          <button 
            onClick={onSettleDay}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium shadow-lg border border-gray-600 transition-colors"
          >
            结算
          </button>
          <button 
            onClick={() => setShowIdentifyMenu(true)}
            className="px-6 py-3 bg-red-800 hover:bg-red-700 text-white rounded font-medium shadow-lg border border-red-700 transition-colors"
          >
            指认凶手
          </button>
        </div>
      )}

      {/* Overlays */}
      {interactionTarget && !activeDialogue && !isInterrogating && (
        <InteractionMenu 
          object={interactionTarget}
          onTalk={() => {
            if (interactionTarget.dialogue) {
              setActiveDialogue(interactionTarget.dialogue);
            } else {
              setActiveDialogue([{ text: '（对方似乎不想说话）' }]);
            }
            setInteractionTarget(null);
          }}
          onInterrogate={() => {
            setIsInterrogating(interactionTarget);
            setInteractionTarget(null);
            // set up history view if needed, but chat handles it initially
          }}
          onClose={() => setInteractionTarget(null)}
        />
      )}

      {isInterrogating && !activeDialogue && (
        <InterrogationChat 
          npc={isInterrogating}
          onSend={handleSendInterrogation}
          onClose={() => setIsInterrogating(null)}
          isThinking={isThinking}
        />
      )}

      {showIdentifyMenu && (
        <IdentifyKillerMenu 
           onConfirm={(id) => {
             setShowIdentifyMenu(false);
             onGameEnd(id);
           }}
           onCancel={() => setShowIdentifyMenu(false)}
        />
      )}

      {activeDialogue && (
        <DialogueBox 
          dialogues={activeDialogue} 
          onComplete={() => setActiveDialogue(null)} 
        />
      )}
    </div>
  );
}
