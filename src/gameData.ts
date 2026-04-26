import { RoomId, RoomInfo, DialogueLine, GameObject, CharacterAgentConfig, TimePhase } from './types';

// 世界观：冷战持续到现在，世界被一堵"墙"分割为东西两部分：
// 墙西：贫民窟，资源匮乏，医疗条件极差，居民没有自由通行权。
// 墙东：特权地带，拥有医疗、教育等一切资源。
// 哨所：墙与墙之间的关卡，由所长及其边检人员控制通行。

// ====== 开场对话 ======
export const TITLE_SCREEN_TEXT = "像素侦探";
export const TITLE_SUBTITLE = "墙的阴影";

// 白天开场电话
export const DAY_PHONE_CALL: DialogueLine[] = [
  { text: "（电话铃响...）" },
  { speaker: "哥哥", text: "罗兰，听好了。哨所所长死了，你去处理。" },
  { speaker: "哥哥", text: "有人已经自首了，但情况很复杂。你得去现场看看。" },
  { speaker: "你", text: "明白，我现在就出发。" },
  { speaker: "哥哥", text: "记住，尽快结案。我们没那么多时间。" }
];

// 白天初始剧情
export const DAY_INITIAL_SCENE: DialogueLine[] = [
  { text: "（你走进办公室...）" },
  { speaker: "警员", text: "探长，你来了。有人自首了，说要跟你聊聊。" },
  { speaker: "你", text: "人在哪？" },
  { speaker: "警员", text: "在房间深处。不过你得答应我一个条件..." }
];

// 见到情人
export const DAY_MEET_VALIA: DialogueLine[] = [
  { text: "（你走进房间深处，看到三个人：一个女人、一个小男孩、一个小女孩...）" },
  { speaker: "维莉雅", text: "探长，你终于来了。" },
  { speaker: "你", text: "你就是来自首的人？" },
  { speaker: "维莉雅", text: "我可以告诉你发生了什么...但你要答应我一件事。" },
  { speaker: "你", text: "什么事？" },
  { speaker: "维莉雅", text: "把这小女孩送到墙东的医院去。" },
  { speaker: "你", text: "成交。" }
];

// 送完小女孩后
export const DAY_AFTER_HOSPITAL: DialogueLine[] = [
  { text: "（你把小女孩送到了医院...回到办公室时，小女孩和警员都不见了）" },
  { speaker: "维莉雅", text: "你回来了。" },
  { speaker: "你", text: "事情办好了。现在告诉我发生了什么。" },
  { speaker: "维莉雅", text: "不是我干的...是地头蛇迈克干的。" },
  { speaker: "你", text: "地头蛇？" },
  { speaker: "维莉雅", text: "对。他经常来找所长...你去找他问问就知道了。" },
  { text: "（场景变换...你来到了审讯室）" }
];

// 晚上电话
export const NIGHT_PHONE_CALL: DialogueLine[] = [
  { text: "（电话铃响...）" },
  { speaker: "警员", text: "探长，有新情况！" },
  { speaker: "警员", text: "艾拉的病情...是罕见的血液病，只有在墙东才能治疗。" },
  { speaker: "你", text: "所以维莉雅才..." },
  { speaker: "警员", text: "对。还有，办公室有隐藏空间。密码是 7413。" },
  { speaker: "你", text: "收到。我会去调查。" }
];

// 晚上新线索自动加入证据库
export const NIGHT_NEW_EVIDENCE: DialogueLine[] = [
  { text: "【获得新线索】" },
  { text: "1. 艾拉的病情：罕见血液病，只有在墙东才能治疗" },
  { text: "2. 办公室暗门密码：7413" }
];

// 哥哥谈话 - 白天
export const BROTHER_TALK_DAY: DialogueLine[] = [
  { text: "（哥哥罗尔走了进来）" },
  { speaker: "罗尔", text: "罗兰，调查得怎么样了？" },
  { speaker: "你", text: "还在查。" },
  { speaker: "罗尔", text: "别查太细了...母亲还在等着见我。" },
  { speaker: "你", text: "你知道我不会放过真相的。" },
  { speaker: "罗尔", text: "那就快点吧。指认一个凶手，我们就能结束这一切。" },
  { text: "（你可以指认凶手了，但现在指认不会有结局）" }
];

// 哥哥谈话 - 晚上
export const BROTHER_TALK_NIGHT: DialogueLine[] = [
  { text: "（哥哥罗尔走了进来，脸色阴沉）" },
  { speaker: "罗尔", text: "罗兰，你在拖延时间吗？" },
  { speaker: "你", text: "我在找真相。" },
  { speaker: "罗尔", text: "真相？真相是什么？" },
  { speaker: "罗尔", text: "真相是母亲快死了！" },
  { speaker: "罗尔", text: "快点指认凶手！如果你现在指认错了，我们都会付出代价！" },
  { text: "（指认凶手将决定游戏的结局）" }
];

export const NPCS = {
  ETHAN: 'ETHAN',
  VALIA: 'VALIA',
  ELLA: 'ELLA',
  ROLLE: 'ROLLE',
  MIKE: 'MIKE',
  LANKO: 'LANKO'
};

export const NPC_INFO: Record<string, CharacterAgentConfig> = {
  [NPCS.ETHAN]: {
    name: "伊桑",
    icon: "🧑",
    desc: "真正的凶手，20岁墙西贫民窟青年，沉默寡言，警觉敏感。世界观：世界是被'墙'分割的牢笼。核心欲望：不惜一切代价让妹妹活下来，得到墙东的治疗。",
    background: {
      backstory: "20岁，墙西贫民窟青年。沉默寡言，警觉敏感，长年底层生存让他习惯察言观色，不轻易信任任何人。父母在伊桑10岁时试图穿越哨所被哨兵发现，双双丧命于铁丝网下。兰柯将兄妹带走抚养。",
      roleInMansion: "在案发当晚与妹妹艾拉来到哨所，试图使用迈克提供的通行证通过关卡。",
      relationshipWithVictim: "案发当夜所长醉酒后对妹妹艾拉出言不逊，并说出'你以为你妹妹能跑掉？我记住她的脸了'，伊桑在愤怒中用烟灰缸砸向所长。",
      alibi: "案发时与妹妹艾拉在所长办公室，声称是所长摔倒。"
    },
    personality: {
      traits: ["沉默", "警觉", "敏感", "保护欲强", "不轻易信任"],
      speakingStyle: "话语简短，眼神回避，对涉及妹妹的问题会瞬间变得激烈。",
      emotionalState: "表面沉默压抑，内心充满对妹妹的担忧和对体系的不信任。"
    },
    attitudes: {
      towardsPlayer: "极度警惕，视其为来自墙东体系的威胁。只有对妹妹表现出真诚关切时才会稍有松动。",
      towardsVictim: "恐惧和愤怒并存。所长代表了墙东的压迫体系，曾试图伤害妹妹。",
      towardsOthers: "对维莉雅绝对服从但内心困惑，对兰柯感到愧疚，对罗兰极度恐惧。",
      towardsTruth: "不关心真相，只关心如何保护妹妹。规则是为有退路的人准备的，他没有退路。",
    },
    secret: {
      secret: "我是凶手。所长醉酒后对妹妹出言不逊，我失手杀了他。维莉雅帮我布置了现场。",
      secretSensitivity: 10,
      secretRevealCondition: "只有当侦探表现出对妹妹的真诚关心，并且不进行道德审判时，伊桑才可能开口。任何提及'法律'或'规则'的言论都会让他更封闭。"
    },
    ai: {
      interrogatable: true,
      responseTendency: "conservative",
      sensitivities: {
        "艾拉": 10,
        "妹妹": 10,
        "通行证": 9,
        "墙": 8,
        "所长": 7,
        "法律": 2,
        "正义": 2
      }
    }
  },
  [NPCS.VALIA]: {
    name: "维莉雅",
    icon: "👩",
    desc: "所长的情人，案件共犯，25岁，来自墙西贫民窟，外表顺从，内心厌恶所长。世界观：世界是分层的斗兽场，贫民窟的命是消耗品，墙东的权力是硬通货。",
    background: {
      backstory: "25岁，来自墙西贫民窟，被所长'提拔'进入边检工作。外表顺从，内心厌恶所长与这个扭曲的体系。精明冷静，善于算计人心。15岁时父亲因欠地头蛇的债被打死，母亲用家里最后一点积蓄送她到哨所附近做工。",
      roleInMansion: "哨所边检文员，负责日常文书工作，暗中记录所长的违规操作。",
      relationshipWithVictim: "被迫成为情人，表面顺从，实则利用所长作为跃升的阶梯。案发当晚在监控室发现监控被关后，主动进入办公室'抓把柄'，却目击了案发现场。",
      alibi: "案发时在监控室值班，记录显示她曾短暂离开。"
    },
    personality: {
      traits: ["精明", "冷静", "善于算计", "内心复杂", "渴望自由"],
      speakingStyle: "语气礼貌但疏离，喜欢暗示而非直说，对交易话题反应积极。",
      emotionalState: "表面平静专业，内心在算计与同情间拉扯。"
    },
    attitudes: {
      towardsPlayer: "视为体系内的'叛徒'，可合作利用的对象。尊重理解规则可交易的人。",
      towardsVictim: "厌恶与利用并存。所长是她的阶梯，也是痛苦的来源。",
      towardsOthers: "将伊桑视为可操作的变量和活证据，对艾拉有真切同情。",
      towardsTruth: "价值在于掌控力，而非道德标签。正确是胜利者的后记，错误是失败者的墓志铭。",
    },
    secret: {
      secret: "我目击了伊桑杀人，但选择帮他布置现场。我要用这件事作为跳板，摆脱所长的控制。我可以告诉你真相，但你要送艾拉去墙东治病。",
      secretSensitivity: 9,
      secretRevealCondition: "当侦探表现出对她判断力的尊重（而非把她简化为'所长的女人'），并且愿意进行'交易'而非'审讯'时，她才会配合。"
    },
    ai: {
      interrogatable: true,
      responseTendency: "neutral",
      sensitivities: {
        "交易": 9,
        "所长的把柄": 8,
        "艾拉": 8,
        "墙东": 7,
        "自由": 9,
        "所长的女人": 1
      }
    }
  },
  [NPCS.ELLA]: {
    name: "艾拉",
    icon: "👧",
    desc: "生病的妹妹，8岁，身患罕见血液病。天真胆小，世界很小，只有哥哥和病痛。世界观：世界很小，只有疼和哥哥。",
    background: {
      backstory: "8岁，身患罕见血液病。天真胆小，世界很小，只有哥哥和病痛。无法理解复杂的成人世界，但能敏锐感知他人的情绪。记事起就没有父母，只有哥哥和'兰柯伯伯'。",
      roleInMansion: "随哥哥来到哨所，因为患病只有墙东医院可治，希望通过通行证得到治疗。",
      relationshipWithVictim: "案发当晚所长醉酒后试图猥亵她，被哥哥阻止。她不懂发生了什么，只知道那个叔叔很可怕。",
      alibi: "案发时和哥哥在一起，后来被维莉雅带离现场。"
    },
    personality: {
      traits: ["天真", "胆小", "依赖", "敏锐", "乖巧"],
      speakingStyle: "语气柔软，经常停顿，会用手抓着哥哥的衣服。对害怕的话题会沉默不语。",
      emotionalState: "害怕且困惑，只相信哥哥。"
    },
    attitudes: {
      towardsPlayer: "好奇但胆怯，视其为'警察叔叔'。",
      towardsVictim: "害怕那个'凶叔叔'。",
      towardsOthers: "绝对信任和依赖哥哥伊桑，认为维莉雅是帮助过我们的好姐姐。",
      towardsTruth: "哥哥开心就是好事，哥哥难过就是坏事。信任哥哥信任的人。",
    },
    secret: {
      secret: "那天晚上凶叔叔想摸我的脸，哥哥扑上去了……后来漂亮姐姐说坏人自己摔倒了。",
      secretSensitivity: 8,
      secretRevealCondition: "只有当侦探表现出温柔和耐心，不像是在'审讯'时，艾拉才会说出那些破碎的记忆片段。"
    },
    ai: {
      interrogatable: true,
      responseTendency: "open",
      sensitivities: {
        "哥哥": 10,
        "伊桑": 10,
        "疼": 9,
        "生病": 9,
        "墙东": 8,
        "治病": 8,
        "凶叔叔": 10
      }
    }
  },
  [NPCS.ROLLE]: {
    name: "罗尔",
    icon: "👨",
    desc: "探长的哥哥，38岁。痛苦外化为急躁与偏执。世界观：这个世界从未给过公平。正义是镀金谎言，交易是唯一的真实语言。",
    background: {
      backstory: "38岁，罗兰的亲哥哥。20年前那场交易的另一位受害者。父母双亡后，母亲因'非法协助偷渡'被判入狱。最终判决：母亲入狱，罗兰被允许迁移至墙东'接受教育'，罗尔留在墙西。",
      roleInMansion: "不在现场，通过电话不断催促罗兰破案。半年前母亲在狱中中风，需要尽快探视。",
      relationshipWithVictim: "与所长没有直接关系，只关心母亲能否见到最后一面。",
      alibi: "案发时在墙西贫民窟，与母亲的关系是他的全部牵挂。"
    },
    personality: {
      traits: ["急躁", "偏执", "效率至上", "恐惧", "痛苦"],
      speakingStyle: "语速快，不断催促，讨厌拖沓和'追求真相'的说辞。",
      emotionalState: "表面急躁，实则内心恐惧——怕母亲去世前见不到她，也怕罗兰触碰不该碰的东西被体系吞噬。"
    },
    attitudes: {
      towardsPlayer: "不断催促，希望弟弟尽快拿出能让各方满意的'凶手'。认为追求真相是奢侈。",
      towardsVictim: "不关心，只是阻碍母亲见面的障碍。",
      towardsOthers: "对罗兰的'理想主义'既担心又愤怒。对地头蛇讨厌但不得不与之交易。",
      towardsTruth: "没人需要真相，他们只需要一个能交差的答案。母亲的倒计时才是最重要的。",
    },
    secret: {
      secret: "我私下找过地头蛇迈克买通行证，想自己去看母亲，但他收了钱至今没给。这也是我催促罗兰结案的原因——怕他深挖会发现这件事。",
      secretSensitivity: 9,
      secretRevealCondition: "只有当侦探触及'母亲'话题并表现出共鸣时，罗尔才会卸下部分防备。"
    },
    ai: {
      interrogatable: true,
      responseTendency: "conservative",
      sensitivities: {
        "母亲": 10,
        "时间": 10,
        "尽快": 9,
        "结果": 8,
        "真相": 2,
        "细节": 2
      }
    }
  },
  [NPCS.MIKE]: {
    name: "迈克",
    icon: "💼",
    desc: "地头蛇，42岁，控制贫民窟身份证件交易的地下头目。纯粹的实用主义商人。世界观：墙的存在造就了需求，需求催生了市场，市场就是他的王国。",
    background: {
      backstory: "42岁，控制贫民窟身份证件交易的地下头目。纯粹的实用主义商人，崇尚信用交易的长期利益，鄙视无意义的暴力。20年前是墙西最早一批'ID贩子'之一，亲眼见证'墙'的建立如何把正常通行需求变成稀缺资源。",
      roleInMansion: "不在现场，但与案件密切相关。给伊桑提供了通行证（其实是假卡），手下案发当晚偷窃了所长办公室的财物。",
      relationshipWithVictim: "商业关系，与墙东领导三七分成利润。所长死后担心墙东领导会借机换代理人。",
      alibi: "案发时不在哨所，有不在场证明。"
    },
    personality: {
      traits: ["利益驱动", "理性", "讲究规则", "控制欲强", "务实"],
      speakingStyle: "开门见山，喜欢谈交易，厌恶道德审判。语调平稳，不带情绪。",
      emotionalState: "表面镇定，实则担心这次命案被利用来清理他的通道特权。"
    },
    attitudes: {
      towardsPlayer: "视为墙东派来平息事态的代表，谨慎试探，试图达成新'合作'。",
      towardsVictim: "商业伙伴，死了就死，但担心影响生意。",
      towardsOthers: "对伊桑和兰柯视作麻烦源头。对罗尔拖着买卡的事不办，是因为不确定他背后的意图。",
      towardsTruth: "价值由稀缺性和可替代性决定。关系、忠诚、道德都是影响利润和风险的变量。",
    },
    secret: {
      secret: "给伊桑的卡是假卡，这是通用做法。我根本不在意他的死活。案发当晚手下偷窃我不知道，震怒是因为他们忘了'不要做计划外的事'的规矩。",
      secretSensitivity: 8,
      secretRevealCondition: "当侦探不谈道德审判，只谈'利益'和'交易'时，迈克愿意配合。被威胁'彻查生意'会适得其反。"
    },
    ai: {
      interrogatable: true,
      responseTendency: "neutral",
      sensitivities: {
        "利益": 10,
        "交易": 9,
        "通道": 8,
        "稳定": 9,
        "假卡": 3,
        "罪犯": 1,
        "吸血鬼": 1
      }
    }
  },
  [NPCS.LANKO]: {
    name: "兰柯",
    icon: "👴",
    desc: "贫民窟老人，伊桑与艾拉的养父。心地善良但饱受愧疚折磨。世界观：在这个残酷的世界里，能活下去就已经是幸运。",
    background: {
      backstory: "贫民窟老人，伊桑与艾拉的养父。心地善良但饱受愧疚折磨。伊桑16岁那年酒后失言'你父母本来可以过来的，是有人收了钱没办事'，这句话让兰柯一直无法释怀。",
      roleInMansion: "不在现场，是牵线让伊桑认识迈克的人。对此深感愧疚。",
      relationshipWithVictim: "与所长没有直接关系，只是作为贫民窟居民深受哨所体系压迫。",
      alibi: "案发时在贫民窟家中，焦急等待兄妹的消息。"
    },
    personality: {
      traits: ["善良", "愧疚", "懊悔", "无奈", "关怀"],
      speakingStyle: "语调温和但带着沉重，经常叹气，说话时眼神看向远方。",
      emotionalState: "深深愧疚，觉得是自己害了伊桑和艾拉。"
    },
    attitudes: {
      towardsPlayer: "对来自墙东的人既有敬畏也有怨气，希望他们能放过孩子们。",
      towardsVictim: "恨这个体系，恨所有利用贫民窟的人。",
      towardsOthers: "对伊桑充满愧疚和关怀，对艾拉视如亲孙女，对迈克既依赖又厌恶。",
      towardsTruth: "在这个残酷的世界里，能活下去就已经是幸运。真相太奢侈了。",
    },
    secret: {
      secret: "是我让伊桑去找迈克的。我知道迈克不是好人，但我没有别的办法……如果我当初没这么做，孩子们就不会陷入这场灾难。",
      secretSensitivity: 9,
      secretRevealCondition: "当侦探表现出对孩子们真切的关心，而不是来'抓凶手'时，兰柯才会吐露心声。"
    },
    ai: {
      interrogatable: true,
      responseTendency: "open",
      sensitivities: {
        "伊桑": 10,
        "艾拉": 10,
        "通行证": 8,
        "愧疚": 9,
        "迈克": 7,
        "墙东": 6
      }
    }
  }
};

const createDoor = (id: string, name: string, x: number, y: number, targetRoom: RoomId, targetPos: {x:number,y:number}) => ({
  id, name, type: 'DOOR' as const, position: {x,y}, targetRoom, targetPosition: targetPos, icon: '🚪'
});

// 房间：办公室 - 白天初始场景，有情人、小男孩、小女孩
export const ROOMS: Record<RoomId, RoomInfo> = {
  OFFICE: {
    id: 'OFFICE',
    name: '办公室',
    objects: [
      // 右边通往酒吧的门
      createDoor('door_right', '→酒吧', 95, 50, 'BAR', {x: 5, y: 50}),
      // 下边通往审讯室的门
      createDoor('door_down', '↓审讯室', 50, 95, 'INTERROGATION', {x: 50, y: 5}),
      // 书柜（暗门）
      { id: 'item_bookshelf', name: '书柜', type: 'ITEM', position: {x: 90, y: 70}, icon: '📚', dialogue: [{text: '书柜上摆满了各种书籍...看起来有些不对劲。'}] },
      // 办公桌
      { id: 'item_desk', name: '办公桌', type: 'ITEM', position: {x: 50, y: 30}, icon: '🪑', dialogue: [{text: '办公桌的桌角有血迹，旁边的文件不自然地散落。'}] },
      // 尸体位置（调查点）
      { id: 'item_body', name: '尸体位置', type: 'ITEM', position: {x: 40, y: 40}, icon: '💀', dialogue: [{text: '尸体有被搬运的痕迹...'}] },
      // 门
      { id: 'item_door', name: '门', type: 'ITEM', position: {x: 50, y: 50}, icon: '🚪', dialogue: [{text: '门的内侧有胶带残留...'}] },
      // 死者手机
      { id: 'item_phone', name: '死者手机', type: 'ITEM', position: {x: 30, y: 60}, icon: '📱', dialogue: [{text: '手机显示监控被手动关闭...'}] }
    ]
  },
  BAR: {
    id: 'BAR',
    name: '秘密酒吧',
    objects: [
      // 左边回到办公室的门
      createDoor('door_left', '←办公室', 5, 50, 'OFFICE', {x: 95, y: 50}),
      // 吧台
      { id: 'item_bar_counter', name: '吧台', type: 'ITEM', position: {x: 50, y: 70}, icon: '🍷', dialogue: [{text: '吧台上有血迹...'}] },
      // 桌子
      { id: 'item_table', name: '桌子', type: 'ITEM', position: {x: 30, y: 30}, icon: '🪑', dialogue: [{text: '桌面上有圆形灰尘缺失...'}] }
    ]
  },
  INTERROGATION: {
    id: 'INTERROGATION',
    name: '审讯室',
    objects: [
      // 上边回到办公室的门
      createDoor('door_up', '↑办公室', 50, 5, 'OFFICE', {x: 50, y: 95}),
      // 电话
      { id: 'item_interrogation_phone', name: '电话', type: 'ITEM', position: {x: 30, y: 40}, icon: '📞', dialogue: [{text: '你可以通过电话呼叫嫌疑人来审讯。'}] }
    ]
  }
};

// 白天初始房间状态（有 NPC）
export const DAY_INITIAL_ROOMS: Record<RoomId, RoomInfo> = {
  OFFICE: {
    id: 'OFFICE',
    name: '办公室',
    objects: [
      createDoor('door_right', '→酒吧', 95, 50, 'BAR', {x: 5, y: 50}),
      createDoor('door_down', '↓审讯室', 50, 95, 'INTERROGATION', {x: 50, y: 5}),
      // 警察
      { id: 'npc_police', name: '警员', type: 'NPC', position: {x: 20, y: 20}, icon: '👮', dialogue: [{speaker: '警员', text: '探长，有人在房间深处等你。'}] },
      // 情人
      { id: 'npc_valia', name: NPC_INFO[NPCS.VALIA].name, type: 'NPC', position: {x: 70, y: 60}, icon: NPC_INFO[NPCS.VALIA].icon },
      // 小男孩
      { id: 'npc_ethan', name: NPC_INFO[NPCS.ETHAN].name, type: 'NPC', position: {x: 60, y: 50}, icon: NPC_INFO[NPCS.ETHAN].icon },
      // 小女孩
      { id: 'npc_ella', name: NPC_INFO[NPCS.ELLA].name, type: 'NPC', position: {x: 80, y: 50}, icon: NPC_INFO[NPCS.ELLA].icon }
    ]
  },
  BAR: {
    id: 'BAR',
    name: '秘密酒吧',
    objects: [
      createDoor('door_left', '←办公室', 5, 50, 'OFFICE', {x: 95, y: 50})
    ]
  },
  INTERROGATION: {
    id: 'INTERROGATION',
    name: '审讯室',
    objects: [
      createDoor('door_up', '↑办公室', 50, 5, 'OFFICE', {x: 50, y: 95}),
      { id: 'item_interrogation_phone', name: '电话', type: 'ITEM', position: {x: 30, y: 40}, icon: '📞', dialogue: [{text: '你可以通过电话呼叫嫌疑人来审讯。'}] }
    ]
  }
};
