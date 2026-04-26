import { useState, useEffect, useRef } from 'react';
import { RoomId, Position, GameObject, TimePhase, DialogueLine, Clue, InventoryItem, RoomInfo } from '../types';
import { ROOMS, NPC_INFO, NPCS } from '../gameData';
import { DialogueBox } from './DialogueBox';
import { InteractionMenu } from './InteractionMenu';
import { InterrogationChat } from './InterrogationChat';
import { submitInterrogation } from '../services/gemini';
import { motion } from 'motion/react';

interface GameSceneProps {
  timePhase: TimePhase;
  actionsRemaining: number;
  onUseAction: () => void;
  onEndInvestigation: () => void;
  onCollectItem?: (item: InventoryItem) => void;
  onAddClue?: (clue: Clue) => void;
  isDetailModalOpen?: boolean;
  clueCount?: number;
  onStateUpdate?: (status: { isInterrogating: boolean; activeDialogue: any[] | null }) => void;
  selectedEvidence?: (Clue | InventoryItem)[];
  onEvidenceSent?: () => void;
}

const MOVE_SPEED = 1.0;
const PLAYER_SIZE = 5; // Default size in %
const DEFAULT_OBJ_SIZE = 5; // Default size in %

export function GameScene({ timePhase, actionsRemaining, onUseAction, onEndInvestigation, onCollectItem, onAddClue, isDetailModalOpen = false, clueCount = 0, onStateUpdate, selectedEvidence = [], onEvidenceSent }: GameSceneProps) {
  const [currentRoom, setCurrentRoom] = useState<RoomId>('OFFICE');
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 50, y: 90 });
  const [interactionTarget, setInteractionTarget] = useState<GameObject | null>(null);

  const [activeDialogue, setActiveDialogue] = useState<DialogueLine[] | null>(null);

  const [isInterrogating, setIsInterrogating] = useState<GameObject | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const keysRef = useRef<{ [key: string]: boolean }>({});
  const rafRef = useRef<number>(0);
  const posRef = useRef(playerPosition);

  const [roomsState, setRoomsState] = useState<Record<RoomId, RoomInfo>>(ROOMS);
  const room = roomsState[currentRoom];

  const removeItemFromRoom = (roomId: RoomId, objectId: string) => {
    setRoomsState(prev => ({
      ...prev,
      [roomId]: {
        ...prev[roomId],
        objects: prev[roomId].objects.filter(obj => obj.id !== objectId)
      }
    }));
  };

  // Game state reporting to parent (used for evidence selection mode)
  const lastStateRef = useRef({ isInterrogating: false, hasDialogue: false });
  useEffect(() => {
    const isInt = !!isInterrogating;
    const hasDiag = !!(activeDialogue && activeDialogue.length > 0);

    if (onStateUpdate && (lastStateRef.current.isInterrogating !== isInt || lastStateRef.current.hasDialogue !== hasDiag)) {
      lastStateRef.current = { isInterrogating: isInt, hasDialogue: hasDiag };
      onStateUpdate({
        isInterrogating: isInt,
        activeDialogue: activeDialogue
      });
    }
  }, [isInterrogating, activeDialogue, onStateUpdate]);

  // 根据时段获取背景色
  const getBackgroundColor = (phase: TimePhase): string => {
    switch (phase) {
      case 'DAY':
        return 'bg-stone-800';
      case 'NIGHT':
        return 'bg-slate-900';
      case 'DAWN':
        return 'bg-amber-900';
      default:
        return 'bg-stone-800';
    }
  };

  // Game Loop for Movement
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // Don't move if we are in a UI overlay
      if (interactionTarget || activeDialogue || isInterrogating || isDetailModalOpen) {
        keysRef.current = {};
        return;
      }
      keysRef.current[key] = true;

      // Interaction key
      if (key === ' ' || key === 'e') {
        checkForInteraction();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [interactionTarget, activeDialogue, isInterrogating, isDetailModalOpen, room]);

  useEffect(() => {
    const checkCollision = (px: number, py: number) => {
      const pHalf = PLAYER_SIZE / 2;
      const pLeft = px - pHalf;
      const pRight = px + pHalf;
      const pTop = py - pHalf;
      const pBottom = py + pHalf;

      for (const obj of room.objects) {
        if (obj.type === 'DOOR') continue;

        const oW = obj.width || DEFAULT_OBJ_SIZE;
        const oH = obj.height || DEFAULT_OBJ_SIZE;
        const oHalfW = oW / 2;
        const oHalfH = oH / 2;

        const oLeft = obj.position.x - oHalfW;
        const oRight = obj.position.x + oHalfW;
        const oTop = obj.position.y - oHalfH;
        const oBottom = obj.position.y + oHalfH;

        if (pLeft < oRight && pRight > oLeft && pTop < oBottom && pBottom > oTop) {
          return true;
        }
      }
      return false;
    };

    const updateLoop = () => {
      if (interactionTarget || activeDialogue || isInterrogating || isDetailModalOpen) {
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
        if (dx !== 0 && dy !== 0) {
          const length = Math.sqrt(dx * dx + dy * dy);
          dx = (dx / length) * MOVE_SPEED;
          dy = (dy / length) * MOVE_SPEED;
        }

        const currentPos = posRef.current;
        let nextX = currentPos.x;
        let nextY = currentPos.y;

        const intendedX = Math.max(5, Math.min(95, currentPos.x + dx));
        if (!checkCollision(intendedX, currentPos.y)) {
          nextX = intendedX;
        }

        const intendedY = Math.max(5, Math.min(95, currentPos.y + dy));
        if (!checkCollision(nextX, intendedY)) {
          nextY = intendedY;
        }

        if (nextX !== currentPos.x || nextY !== currentPos.y) {
          posRef.current = { x: nextX, y: nextY };
          setPlayerPosition({ x: nextX, y: nextY });
        }
      }

      rafRef.current = requestAnimationFrame(updateLoop);
    };

    rafRef.current = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [interactionTarget, activeDialogue, isInterrogating, isDetailModalOpen, room]);

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
    const npcConfig = npcKey ? NPC_INFO[npcKey] : null;

    const reply = await submitInterrogation(npcKey || isInterrogating.name, npcConfig!, message);
    setIsThinking(false);

    // Split reply by sentences
    const sentences = reply.split(/(?<=[。！？!?])/).filter(s => s.trim().length > 0);
    const dialogueLines = sentences.map(s => ({ speaker: isInterrogating.name, text: s }));

    setActiveDialogue([{ speaker: "侦探", text: message }, ...dialogueLines]);

    // Clear evidence in parent state if sent
    if (onEvidenceSent) {
      onEvidenceSent();
    }
  };

  const handleTalkOrInteract = () => {
    if (!interactionTarget) return;

    if (interactionTarget.type === 'NPC') {
      // NPC interaction
      setActiveDialogue([{ speaker: interactionTarget.name, text: "你想知道什么？" }]);
    } else if (interactionTarget.type === 'ITEM' && interactionTarget.dialogue) {
      // Item interaction
      setActiveDialogue(interactionTarget.dialogue);
      // Use an action for examining items
      if (actionsRemaining > 0) {
        onUseAction();
      }
    }

    setInteractionTarget(null);
  };

  return (
    <div className="relative w-full h-screen bg-gray-950 flex flex-col items-center justify-center overflow-hidden">

      {/* Top UI */}
      <div className={`absolute top-4 left-4 text-white bg-gray-900/90 p-4 rounded border border-gray-700 ${getBackgroundColor(timePhase)} transition-colors duration-500`}>
         <div className="text-xl font-bold">{timePhase === 'DAY' ? '🌞 白天' : timePhase === 'NIGHT' ? '🌙 晚上' : '🌅 黎明'}</div>
         <div className="text-sm text-gray-400">行动次数: {actionsRemaining}</div>
         <div className="text-sm text-gray-400">线索: {clueCount}</div>
      </div>

      {/* Game Board */}
      <div className={`w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] ${getBackgroundColor(timePhase)} rounded-lg relative shadow-2xl border-4 border-stone-900 overflow-hidden transition-colors duration-500`}>
        {/* Room Label */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-stone-500 font-bold bg-stone-900/50 px-3 py-1 rounded text-sm z-10">
          {room.name}
        </div>

        {/* Render Objects */}
        {room.objects.map(obj => (
          <div
            key={obj.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
            style={{
              left: `${obj.position.x}%`,
              top: `${obj.position.y}%`,
              width: `${obj.width || DEFAULT_OBJ_SIZE}%`,
              height: `${obj.height || DEFAULT_OBJ_SIZE}%`
            }}
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
            <div
              className="text-3xl filter drop-shadow-md bg-black/20 rounded-full w-full h-full flex items-center justify-center p-1 border border-white/10"
              style={{
                minWidth: !obj.width ? '100%' : 'auto',
                minHeight: !obj.height ? '100%' : 'auto'
              }}
            >
              {obj.icon}
            </div>
            {obj.type !== 'DOOR' && <div className="text-[10px] text-white mt-1 bg-black/50 px-1 rounded truncate max-w-[80px] absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap">{obj.name}</div>}
            {obj.type === 'DOOR' && <div className="text-[10px] text-yellow-300 mt-1 bg-black/50 px-1 rounded truncate max-w-[80px] absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap">{obj.name}</div>}
          </div>
        ))}

        {/* Player */}
        <motion.div
          className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none"
          animate={{ left: `${playerPosition.x}%`, top: `${playerPosition.y}%` }}
          transition={{ type: 'tween', duration: 0.05, ease: 'linear' }}
          style={{ width: `${PLAYER_SIZE}%`, height: `${PLAYER_SIZE}%` }}
        >
          <div className="text-3xl filter drop-shadow hover:scale-110 bg-blue-500 w-full h-full flex items-center justify-center rounded border-2 border-white/20">🕵️</div>
          <div className="text-[10px] text-blue-200 mt-1 bg-black/50 px-1 rounded whitespace-nowrap absolute top-full">侦探</div>
        </motion.div>
      </div>

      {/* Bottom hint text */}
      {!interactionTarget && !activeDialogue && !isInterrogating && (
         <div className="absolute bottom-6 bg-black/80 text-gray-400 px-6 py-2 rounded-full text-sm border border-gray-800">
           按方向键移动，靠近角色或物品按 E 键交互
         </div>
      )}

      {/* End Investigation Button */}
      {!interactionTarget && !activeDialogue && !isInterrogating && actionsRemaining > 0 && (
        <div className="absolute bottom-6 right-6">
          <button
            onClick={onEndInvestigation}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium shadow-lg border border-gray-600 transition-colors"
          >
            结束调查
          </button>
        </div>
      )}

      {/* Overlays */}
      {interactionTarget && !activeDialogue && !isInterrogating && (
        <InteractionMenu
          object={interactionTarget}
          onTalk={handleTalkOrInteract}
          onInterrogate={() => {
            if (interactionTarget.type === 'NPC') {
              setIsInterrogating(interactionTarget);
              setInteractionTarget(null);
            }
          }}
          onCollect={() => {
            if (interactionTarget.clue) {
              onAddClue?.(interactionTarget.clue);
            }
            if (interactionTarget.inventoryItem) {
              onCollectItem?.(interactionTarget.inventoryItem);
              removeItemFromRoom(currentRoom, interactionTarget.id);
            } else if (interactionTarget.type === 'ITEM') {
              const data = {
                id: interactionTarget.id,
                name: interactionTarget.name,
                icon: interactionTarget.icon || '?',
                description: interactionTarget.description || '一件神秘的物品。'
              };
              onCollectItem?.(data);
              onAddClue?.(data);
              removeItemFromRoom(currentRoom, interactionTarget.id);
            }
            setInteractionTarget(null);
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
          selectedEvidence={selectedEvidence}
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
