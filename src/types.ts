export enum GameState {
  START = 'START',
  INTRO = 'INTRO',
  PLAYING = 'PLAYING',
  INTERROGATING = 'INTERROGATING',
  SETTLING = 'SETTLING',
  IDENTIFYING = 'IDENTIFYING',
  ENDING = 'ENDING'
}

export type RoomId = 'MAIN' | 'STUDY' | 'GARDEN' | 'KITCHEN' | 'BEDROOM';

export interface Position {
  x: number;
  y: number;
}

export interface GameObject {
  id: string;
  name: string;
  type: 'NPC' | 'ITEM' | 'DOOR';
  position: Position;
  icon?: string;
  dialogue?: DialogueLine[];
  onInteract?: () => void;
  targetRoom?: RoomId;
  targetPosition?: Position;
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
