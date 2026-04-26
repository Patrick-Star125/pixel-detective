/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { GameState, TimePhase, DialogueLine, InventoryItem, Clue } from './types';
import {
  TITLE_SCREEN_TEXT, TITLE_SUBTITLE,
  DAY_PHONE_CALL, DAY_INITIAL_SCENE, DAY_MEET_VALIA, DAY_AFTER_HOSPITAL,
  NIGHT_PHONE_CALL, NIGHT_NEW_EVIDENCE,
  BROTHER_TALK_DAY, BROTHER_TALK_NIGHT,
  NPC_INFO, NPCS
} from './gameData';
import { DialogueBox } from './components/DialogueBox';
import { GameScene } from './components/GameScene';
import { StartScreen } from './components/StartScreen';
import { IdentifyKillerMenu } from './components/IdentifyKillerMenu';
import { InventoryMenu } from './components/InventoryMenu';
import { InventoryDetailModal } from './components/InventoryDetailModal';
import { ClueSidebar } from './components/ClueSidebar';
import { ClueDetailModal } from './components/ClueDetailModal';

// 剧情阶段
enum StoryPhase {
  // 白天阶段
  DAY_TITLE = 'DAY_TITLE',
  DAY_PHONE = 'DAY_PHONE',
  DAY_OFFICE_INTRO = 'DAY_OFFICE_INTRO',
  DAY_MEET_PEOPLE = 'DAY_MEET_PEOPLE',
  DAY_AGREE_HOSPITAL = 'DAY_AGREE_HOSPITAL',
  DAY_HOSPITAL_TRANSITION = 'DAY_HOSPITAL_TRANSITION',
  DAY_RETURN = 'DAY_RETURN',
  DAY_INTERROGATION = 'DAY_INTERROGATION',
  DAY_INVESTIGATION = 'DAY_INVESTIGATION',
  DAY_BROTHER_TALK = 'DAY_BROTHER_TALK',
  DAY_IDENTIFY = 'DAY_IDENTIFY',

  // 晚上阶段
  NIGHT_PHONE = 'NIGHT_PHONE',
  NIGHT_EVIDENCE = 'NIGHT_EVIDENCE',
  NIGHT_INVESTIGATION = 'NIGHT_INVESTIGATION',
  NIGHT_BROTHER_TALK = 'NIGHT_BROTHER_TALK',
  NIGHT_IDENTIFY = 'NIGHT_IDENTIFY',

  // 黎明阶段
  DAWN_FINAL = 'DAWN_FINAL'
}

const MAX_ACTIONS_PER_PHASE = 15;

export default function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.TITLE_SCREEN);
  const [storyPhase, setStoryPhase] = useState<StoryPhase>(StoryPhase.DAY_TITLE);
  const [currentDialogue, setCurrentDialogue] = useState<DialogueLine[] | null>(null);
  const [timePhase, setTimePhase] = useState<TimePhase>('DAY');
  const [actionsRemaining, setActionsRemaining] = useState(MAX_ACTIONS_PER_PHASE);

  // 结局相关
  const [endingLines, setEndingLines] = useState<DialogueLine[]>([]);
  const [showIdentifyMenu, setShowIdentifyMenu] = useState(false);

  // Inventory State
  const [inventory, setInventory] = useState<(InventoryItem | null)[]>(Array(6).fill(null));
  const [activeInventoryDetail, setActiveInventoryDetail] = useState<InventoryItem | null>(null);

  const addToInventory = useCallback((item: InventoryItem) => {
    setInventory(prev => {
      const firstEmptyIndex = prev.findIndex(i => i === null);
      if (firstEmptyIndex !== -1) {
        const newInv = [...prev];
        newInv[firstEmptyIndex] = item;
        return newInv;
      }
      return prev;
    });
  }, []);

  const addClue = useCallback((clue: Clue) => {
    setClues(prev => {
      if (prev.find(c => c.id === clue.id)) return prev;
      return [...prev, clue];
    });
  }, []);

  // Clue State
  const [clues, setClues] = useState<Clue[]>([]);
  const [activeClueDetail, setActiveClueDetail] = useState<Clue | null>(null);

  // Evidence Selection State
  const [selectedEvidence, setSelectedEvidence] = useState<(Clue | InventoryItem)[]>([]);
  const [inInteraction, setInInteraction] = useState(false);

  const toggleEvidence = useCallback((item: Clue | InventoryItem) => {
    setSelectedEvidence(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) return prev.filter(i => i.id !== item.id);
      return [...prev, item];
    });
  }, []);

  // 白天流程
  const handleStartGame = () => {
    setStoryPhase(StoryPhase.DAY_PHONE);
    setCurrentDialogue(DAY_PHONE_CALL);
  };

  const handleDayPhoneComplete = () => {
    setCurrentDialogue(DAY_INITIAL_SCENE);
    setStoryPhase(StoryPhase.DAY_OFFICE_INTRO);
  };

  const handleDayIntroComplete = () => {
    setCurrentDialogue(DAY_MEET_VALIA);
    setStoryPhase(StoryPhase.DAY_MEET_PEOPLE);
  };

  const handleMeetValiaComplete = () => {
    setStoryPhase(StoryPhase.DAY_HOSPITAL_TRANSITION);
    setCurrentDialogue([{text: '（你把小女孩送到了医院...）'}]);
  };

  const handleHospitalTransitionComplete = () => {
    setCurrentDialogue(DAY_AFTER_HOSPITAL);
    setStoryPhase(StoryPhase.DAY_RETURN);
  };

  const handleDayReturnComplete = () => {
    setStoryPhase(StoryPhase.DAY_INTERROGATION);
    setGameState(GameState.PLAYING);
    setCurrentDialogue(null);
    setActionsRemaining(MAX_ACTIONS_PER_PHASE);
  };

  // 行动次数管理
  const useAction = () => {
    setActionsRemaining(prev => {
      if (prev <= 1) {
        // 行动次数用完，触发哥哥谈话
        setTimeout(() => {
          handleInvestigationEnd();
        }, 500);
        return 0;
      }
      return prev - 1;
    });
  };

  const handleEndInvestigation = () => {
    setActionsRemaining(0);
  };

  const handleInvestigationEnd = () => {
    setGameState(GameState.BROTHER_TALK);
    if (timePhase === 'DAY') {
      setCurrentDialogue(BROTHER_TALK_DAY);
      setStoryPhase(StoryPhase.DAY_BROTHER_TALK);
    } else if (timePhase === 'NIGHT') {
      setCurrentDialogue(BROTHER_TALK_NIGHT);
      setStoryPhase(StoryPhase.NIGHT_BROTHER_TALK);
    }
  };

  // 白天哥哥谈话后
  const handleDayBrotherTalkComplete = () => {
    setStoryPhase(StoryPhase.DAY_IDENTIFY);
    setShowIdentifyMenu(true);
  };

  // 白天指认犯人
  const handleDayIdentifyKiller = (killerId: string) => {
    setShowIdentifyMenu(false);
    // 白天指认无影响，进入晚上
    setCurrentDialogue([{text: `（你指认了 ${NPC_INFO[killerId].name}）`}, {text: '白天的调查结束了...'}]);
    setStoryPhase(StoryPhase.NIGHT_PHONE);

    // 进入晚上的流程
    setTimeout(() => {
      handleDayIdentifyComplete();
    }, 2000);
  };

  const handleDayIdentifyComplete = () => {
    setTimePhase('NIGHT');
    setCurrentDialogue(NIGHT_PHONE_CALL);
    setStoryPhase(StoryPhase.NIGHT_PHONE);
  };

  // 晚上电话后
  const handleNightPhoneComplete = () => {
    setCurrentDialogue(NIGHT_NEW_EVIDENCE);
    setStoryPhase(StoryPhase.NIGHT_EVIDENCE);
  };

  const handleNightEvidenceComplete = () => {
    setStoryPhase(StoryPhase.NIGHT_INVESTIGATION);
    setGameState(GameState.PLAYING);
    setCurrentDialogue(null);
    setActionsRemaining(MAX_ACTIONS_PER_PHASE);
  };

  // 晚上哥哥谈话后
  const handleNightBrotherTalkComplete = () => {
    setStoryPhase(StoryPhase.NIGHT_IDENTIFY);
    setShowIdentifyMenu(true);
  };

  // 晚上指认犯人
  const handleNightIdentifyKiller = (killerId: string) => {
    setShowIdentifyMenu(false);

    const correctKiller = NPCS.ETHAN;

    if (killerId === correctKiller) {
      // 正确指认
      handleGoodEnding();
    } else {
      // 错误指认 - 坏结局
      handleBadEnding(killerId);
    }
  };

  const handleGoodEnding = () => {
    const goodEnding: DialogueLine[] = [
      { text: "（你指认了伊桑）" },
      { speaker: "伊桑", text: "......" },
      { speaker: "你", text: "所长是你杀的。" },
      { speaker: "伊桑", text: "是他先对艾拉动手的！" },
      { speaker: "你", text: "我知道。但正义必须得到伸张。" },
      { text: "墙依然矗立，但至少这一次，真相被看见了。" },
      { text: "（游戏结束 - True Ending）" }
    ];
    setEndingLines(goodEnding);
    setGameState(GameState.ENDING);
  };

  const handleBadEnding = (killerId: string) => {
    const wrongPerson = NPC_INFO[killerId];
    const badEnding: DialogueLine[] = [
      { text: `（你指认了 ${wrongPerson.name}）` },
      { speaker: wrongPerson.name, text: "什么？不是我！" },
      { text: "真正的凶手逍遥法外..." },
      { text: "墙依然矗立，真相被埋葬在阴影中。" },
      { speaker: "罗尔", text: "你做错了，罗兰..." },
      { text: "（游戏结束 - Bad Ending）" }
    ];
    setEndingLines(badEnding);
    setGameState(GameState.BAD_ENDING);
  };

  const handleEndingComplete = () => {
    // 重置游戏
    setGameState(GameState.TITLE_SCREEN);
    setTimePhase('DAY');
    setStoryPhase(StoryPhase.DAY_TITLE);
    setCurrentDialogue(null);
    setActionsRemaining(MAX_ACTIONS_PER_PHASE);
    setEndingLines([]);
    setShowIdentifyMenu(false);
  };

  // 处理对话完成
  const handleDialogueComplete = () => {
    switch (storyPhase) {
      case StoryPhase.DAY_PHONE:
        handleDayPhoneComplete();
        break;
      case StoryPhase.DAY_OFFICE_INTRO:
        handleDayIntroComplete();
        break;
      case StoryPhase.DAY_MEET_PEOPLE:
        handleMeetValiaComplete();
        break;
      case StoryPhase.DAY_HOSPITAL_TRANSITION:
        handleHospitalTransitionComplete();
        break;
      case StoryPhase.DAY_RETURN:
        handleDayReturnComplete();
        break;
      case StoryPhase.NIGHT_PHONE:
        handleNightPhoneComplete();
        break;
      case StoryPhase.NIGHT_EVIDENCE:
        handleNightEvidenceComplete();
        break;
      case StoryPhase.DAY_BROTHER_TALK:
        handleDayBrotherTalkComplete();
        break;
      case StoryPhase.NIGHT_BROTHER_TALK:
        handleNightBrotherTalkComplete();
        break;
      default:
        break;
    }
  };

  // 处理指认犯人
  const handleIdentifyKiller = (killerId: string) => {
    if (timePhase === 'DAY') {
      handleDayIdentifyKiller(killerId);
    } else if (timePhase === 'NIGHT') {
      handleNightIdentifyKiller(killerId);
    }
  };

  return (
    <div className="w-full h-full bg-black text-white font-sans overflow-hidden relative">
      {/* 标题屏幕 */}
      {gameState === GameState.TITLE_SCREEN && (
        <StartScreen
          title={TITLE_SCREEN_TEXT}
          subtitle={TITLE_SUBTITLE}
          onStart={handleStartGame}
        />
      )}

      {/* 电话/黑屏 */}
      {gameState === GameState.PHONE_CALL && currentDialogue && (
        <div className="w-full h-full bg-black flex items-center justify-center">
          <DialogueBox
            dialogues={currentDialogue}
            onComplete={handleDialogueComplete}
          />
        </div>
      )}

      {/* 剧情对话 */}
      {gameState === GameState.BROTHER_TALK && currentDialogue && (
        <div className="w-full h-full bg-black flex items-center justify-center">
          <DialogueBox
            dialogues={currentDialogue}
            onComplete={handleDialogueComplete}
          />
        </div>
      )}

      {/* 游戏场景 */}
      {gameState === GameState.PLAYING && (
        <>
          <GameScene
            timePhase={timePhase}
            actionsRemaining={actionsRemaining}
            onUseAction={useAction}
            onEndInvestigation={handleEndInvestigation}
            onCollectItem={addToInventory}
            onAddClue={addClue}
            isDetailModalOpen={!!activeClueDetail || !!activeInventoryDetail}
            clueCount={clues.length}
            onStateUpdate={(status) => {
              const active = status.isInterrogating || (status.activeDialogue && status.activeDialogue.length > 0);
              setInInteraction(!!active);
              if (!active) setSelectedEvidence([]);
            }}
            selectedEvidence={selectedEvidence}
            onEvidenceSent={() => setSelectedEvidence([])}
          />
          {/* Modals handle their own masks now for better synchronization */}
          <InventoryMenu
            items={inventory}
            onItemClick={(item) => {
              if (inInteraction) {
                toggleEvidence(item);
              } else {
                setActiveInventoryDetail(item);
              }
            }}
            selectedEvidenceIds={selectedEvidence.map(i => i.id)}
          />
          <ClueSidebar
            clues={clues}
            onClueClick={(clue) => {
              if (inInteraction) {
                toggleEvidence(clue);
              } else {
                setActiveClueDetail(clue);
              }
            }}
            selectedEvidenceIds={selectedEvidence.map(i => i.id)}
          />
          {selectedEvidence.length > 0 && (
             <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[80%] bg-black/60 p-2 rounded border border-white/20 z-[70] pointer-events-none">
                {selectedEvidence.map(item => {
                  const isClue = item.id.startsWith('clue-');
                  return (
                    <div
                      key={item.id}
                      className={`flex flex-col items-center min-w-[60px] p-1 rounded border ${
                        isClue
                          ? 'bg-blue-900/30 border-blue-500/50'
                          : 'bg-stone-800 border-yellow-500/50'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className={`text-[8px] truncate w-full text-center ${isClue ? 'text-blue-400' : 'text-yellow-500'}`}>
                        {item.name}
                      </span>
                    </div>
                  );
                })}
             </div>
          )}
          <ClueDetailModal
            clue={activeClueDetail}
            onClose={() => setActiveClueDetail(null)}
          />
          <InventoryDetailModal
            item={activeInventoryDetail}
            onClose={() => setActiveInventoryDetail(null)}
          />
        </>
      )}

      {/* 指认犯人菜单 */}
      {showIdentifyMenu && (
        <IdentifyKillerMenu
          onConfirm={handleIdentifyKiller}
          onCancel={() => setShowIdentifyMenu(false)}
        />
      )}

      {/* 好结局 */}
      {gameState === GameState.ENDING && (
        <div className="w-full h-full bg-black flex items-center justify-center">
          <DialogueBox
            dialogues={endingLines}
            onComplete={handleEndingComplete}
          />
        </div>
      )}

      {/* 坏结局 */}
      {gameState === GameState.BAD_ENDING && (
        <div className="w-full h-full bg-red-950 flex items-center justify-center">
          <DialogueBox
            dialogues={endingLines}
            onComplete={handleEndingComplete}
          />
        </div>
      )}
    </div>
  );
}
