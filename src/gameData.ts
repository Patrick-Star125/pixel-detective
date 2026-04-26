import { RoomId, RoomInfo, DialogueLine, GameObject } from './types';

export const INTRO_DIALOGUE: DialogueLine[] = [
  { text: "这是一个风雨交加的夜晚……", image: "https://images.unsplash.com/photo-1519077336586-cfed228887aa?auto=format&fit=crop&q=80&w=800" },
  { speaker: "你", text: "富豪庄园发生了一起命案。我作为知名侦探被邀请至此。" },
  { speaker: "你", text: "我要在有限的时间内找出真凶。" },
];

export const SETTLE_DIALOGUE: DialogueLine[] = [
  { text: "夜深了，你回到了房间，脑海中梳理着今天的线索。", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800" },
  { speaker: "你", text: "真相似乎还隐藏在迷雾中……" },
  { text: "点击继续进入下一天。" }
];

export const NPCS = {
  INSPECTOR: 'INSPECTOR',
  BUTLER: 'BUTLER',
  MAID: 'MAID',
  WIFE: 'WIFE',
  PROFESSOR: 'PROFESSOR',
  GARDENER: 'GARDENER'
};

export const NPC_INFO: Record<string, { name: string, icon: string, desc: string }> = {
  [NPCS.INSPECTOR]: { name: "检察长", icon: "👮", desc: "负责此案的长官" },
  [NPCS.BUTLER]: { name: "管家·塞巴斯蒂安", icon: "🎩", desc: "沉稳冷静的管家，似乎知道很多内情。" },
  [NPCS.MAID]: { name: "女仆·艾琳", icon: "🧹", desc: "案发时在清扫走廊" },
  [NPCS.WIFE]: { name: "夫人·伊莎贝拉", icon: "👗", desc: "死者的妻子，悲痛欲绝" },
  [NPCS.PROFESSOR]: { name: "教授·莫里亚蒂", icon: "📚", desc: "死者的密友，知识渊博" },
  [NPCS.GARDENER]: { name: "园丁·汤姆", icon: "🌿", desc: "总是在花园里忙碌" }
};

const createDoor = (id: string, name: string, x: number, y: number, targetRoom: RoomId, targetPos: {x:number,y:number}) => ({
  id, name, type: 'DOOR' as const, position: {x,y}, targetRoom, targetPosition: targetPos, icon: '🚪'
});

export const INITIAL_ROOMS: Record<RoomId, RoomInfo> = {
  MAIN: {
    id: 'MAIN',
    name: '大厅',
    objects: [
      createDoor('door_top', '↑书房', 50, 5, 'STUDY', {x: 50, y: 90}),
      createDoor('door_bottom', '↓花园', 50, 95, 'GARDEN', {x: 50, y: 10}),
      createDoor('door_left', '←厨房', 5, 50, 'KITCHEN', {x: 90, y: 50}),
      createDoor('door_right', '→卧室', 95, 50, 'BEDROOM', {x: 10, y: 50}),
      { id: 'npc_inspector', name: NPC_INFO[NPCS.INSPECTOR].name, type: 'NPC', position: {x: 70, y: 60}, icon: NPC_INFO[NPCS.INSPECTOR].icon, dialogue: [{speaker: '检察长', text: '侦探，你有什么发现吗？如果你指认了凶手，请来找我。'}] },
      { id: 'npc_butler', name: NPC_INFO[NPCS.BUTLER].name, type: 'NPC', position: {x: 40, y: 40}, icon: NPC_INFO[NPCS.BUTLER].icon },
      { id: 'item_1', name: '碎玻璃', type: 'ITEM', position: {x: 30, y: 70}, icon: '📄', dialogue: [{text: '地上有一些碎玻璃。'}] }
    ]
  },
  STUDY: {
    id: 'STUDY',
    name: '书房',
    objects: [
      createDoor('door_back', '↓大厅', 50, 95, 'MAIN', {x: 50, y: 10}),
      { id: 'npc_professor', name: NPC_INFO[NPCS.PROFESSOR].name, type: 'NPC', position: {x: 50, y: 30}, icon: NPC_INFO[NPCS.PROFESSOR].icon }
    ]
  },
  GARDEN: {
    id: 'GARDEN',
    name: '花园',
    objects: [
      createDoor('door_back', '↑大厅', 50, 5, 'MAIN', {x: 50, y: 90}),
      { id: 'npc_gardener', name: NPC_INFO[NPCS.GARDENER].name, type: 'NPC', position: {x: 60, y: 50}, icon: NPC_INFO[NPCS.GARDENER].icon },
      { id: 'item_2', name: '带泥的铲子', type: 'ITEM', position: {x: 80, y: 80}, icon: '⛏️', dialogue: [{text: '一把沾满新鲜泥土的铲子。'}] }
    ]
  },
  KITCHEN: {
    id: 'KITCHEN',
    name: '厨房',
    objects: [
      createDoor('door_back', '→大厅', 95, 50, 'MAIN', {x: 10, y: 50}),
      { id: 'npc_maid', name: NPC_INFO[NPCS.MAID].name, type: 'NPC', position: {x: 40, y: 60}, icon: NPC_INFO[NPCS.MAID].icon }
    ]
  },
  BEDROOM: {
    id: 'BEDROOM',
    name: '卧室',
    objects: [
      createDoor('door_back', '←大厅', 5, 50, 'MAIN', {x: 90, y: 50}),
      { id: 'npc_wife', name: NPC_INFO[NPCS.WIFE].name, type: 'NPC', position: {x: 50, y: 40}, icon: NPC_INFO[NPCS.WIFE].icon }
    ]
  }
};
