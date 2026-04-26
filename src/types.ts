export enum GameState {
  START = 'START',
  TITLE_SCREEN = 'TITLE_SCREEN',
  PHONE_CALL = 'PHONE_CALL',
  CUTSCENE = 'CUTSCENE',
  PLAYING = 'PLAYING',
  INTERROGATING = 'INTERROGATING',
  BROTHER_TALK = 'BROTHER_TALK',
  IDENTIFYING = 'IDENTIFYING',
  ENDING = 'ENDING',
  TRANSITION = 'TRANSITION',
  BAD_ENDING = 'BAD_ENDING'
}

export type TimePhase = 'DAY' | 'NIGHT' | 'DAWN';
export const TIME_PHASES: TimePhase[] = ['DAY', 'NIGHT', 'DAWN'];
export const TIME_PHASE_NAMES: Record<TimePhase, string> = {
  DAY: '白天',
  NIGHT: '晚上',
  DAWN: '黎明'
};

export type RoomId = 'OFFICE' | 'BAR' | 'INTERROGATION';

export interface Position {
  x: number;
  y: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Clue {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface GameObject {
  id: string;
  name: string;
  type: 'NPC' | 'ITEM' | 'DOOR';
  position: Position;
  width?: number; // In percentage of board (0-100)
  height?: number; // In percentage of board (0-100)
  icon?: string;
  description?: string;
  dialogue?: DialogueLine[];
  onInteract?: () => void;
  targetRoom?: RoomId;
  targetPosition?: Position;
  clue?: Clue;
  inventoryItem?: InventoryItem;
}

export interface DialogueLine {
  speaker?: string;
  text: string;
  image?: string;
}

export interface RoomInfo {
  id: RoomId;
  name: string;
  objects: GameObject[];
}

// Agent系统类型定义

export interface CharacterAttitudes {
  /** 对主角的看法 */
  towardsPlayer?: string;
  /** 对死者的看法 */
  towardsVictim?: string;
  /** 对其他角色的看法 */
  towardsOthers?: string;
  /** 对真相的态度 */
  towardsTruth?: string;
}

export interface CharacterBackground {
  /** 个人背景故事 */
  backstory?: string;
  /** 在庄园中的角色和职责 */
  roleInMansion?: string;
  /** 与死者的关系 */
  relationshipWithVictim?: string;
  /** 案发时的活动/不在场证明 */
  alibi?: string;
}

export interface CharacterPersonality {
  /** 性格特点 */
  traits?: string[];
  /** 说话风格 */
  speakingStyle?: string;
  /** 情绪状态 */
  emotionalState?: string;
}

export interface CharacterSecret {
  /** 秘密信息（角色知道但不愿主动分享的） */
  secret?: string;
  /** 这个秘密的敏感程度（0-10，10为最敏感） */
  secretSensitivity?: number;
  /** 只有在什么情况下才会透露这个秘密 */
  secretRevealCondition?: string;
}

export interface CharacterAgentConfig {
  /** 基本信息 */
  name: string;
  icon: string;
  desc: string;

  /** Agent核心配置 */
  background: CharacterBackground;
  personality: CharacterPersonality;
  attitudes: CharacterAttitudes;
  secret?: CharacterSecret;

  /** AI交互配置 */
  ai?: {
    /** 是否可审问 */
    interrogatable?: boolean;
    /** 回复倾向（保守/中立/开放） */
    responseTendency?: 'conservative' | 'neutral' | 'open';
    /** 对特定话题的敏感度（话题关键词 -> 0-10） */
    sensitivities?: Record<string, number>;
  };
}
