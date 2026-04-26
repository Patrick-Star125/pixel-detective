import type { CharacterAgentConfig } from '../types';

const MAX_HISTORY = 10;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2秒
const conversationHistory: Record<string, Array<{role: string, content: string}>> = {};
const lastRequestTime = { value: 0 };
const MIN_REQUEST_INTERVAL = 1000; // 最小请求间隔 1秒

// 延迟函数
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 根据角色配置生成系统提示词
 * 这个函数负责将角色的背景、性格、态度、秘密等配置拼接成完整的系统提示词
 */
export function generateCharacterSystemPrompt(config: CharacterAgentConfig): string {
  const { name, desc, background, personality, attitudes, secret, ai } = config;

  // 基础角色信息
  let prompt = `你正在扮演一个侦探游戏中的角色。你的名字是：${name}。\n`;

  // 角色背景
  prompt += `\n【你的背景】\n`;
  if (background.backstory) prompt += `- 个人背景：${background.backstory}\n`;
  if (background.roleInMansion) prompt += `- 在庄园中的角色：${background.roleInMansion}\n`;
  if (background.relationshipWithVictim) prompt += `- 与死者的关系：${background.relationshipWithVictim}\n`;
  if (background.alibi) prompt += `- 案发时的活动：${background.alibi}\n`;

  // 角色性格
  prompt += `\n【你的性格】\n`;
  if (personality.traits && personality.traits.length > 0) {
    prompt += `- 性格特点：${personality.traits.join('、')}\n`;
  }
  if (personality.speakingStyle) prompt += `- 说话风格：${personality.speakingStyle}\n`;
  if (personality.emotionalState) prompt += `- 当前情绪状态：${personality.emotionalState}\n`;

  // 对各方的态度
  prompt += `\n【你的态度】\n`;
  if (attitudes.towardsPlayer) prompt += `- 对主角（侦探）的看法：${attitudes.towardsPlayer}\n`;
  if (attitudes.towardsVictim) prompt += `- 对死者的看法：${attitudes.towardsVictim}\n`;
  if (attitudes.towardsOthers) prompt += `- 对其他角色的看法：${attitudes.towardsOthers}\n`;
  if (attitudes.towardsTruth) prompt += `- 对真相的态度：${attitudes.towardsTruth}\n`;

  // 秘密信息（只有角色自己知道，通常不会主动透露）
  if (secret?.secret) {
    prompt += `\n【你掌握的秘密】\n`;
    prompt += `- 秘密内容：${secret.secret}\n`;
    if (secret.secretRevealCondition) {
      prompt += `- 只有在以下情况下才可能透露这个秘密：${secret.secretRevealCondition}\n`;
    } else {
      prompt += `- 默认情况下，不会主动透露这个秘密。\n`;
    }
  }

  // AI交互配置（影响回复策略）
  if (ai?.responseTendency) {
    prompt += `\n【回复倾向】\n`;
    const tendencyMap = {
      conservative: "你的回复比较保守，不愿意主动透露信息，对敏感问题会回避或模糊回答。",
      neutral: "你的回复保持中立，既不会过于保守，也不会过于开放，根据问题性质合理回答。",
      open: "你的回复比较开放，愿意分享信息，但仍然不会轻易透露秘密。"
    };
    prompt += tendencyMap[ai.responseTendency] + "\n";
  }

  // 审问行为指南
  prompt += `\n【审问中的行为指南】\n`;
  prompt += `你现在正在被侦探审问。请根据上述设定回答侦探的问题。\n\n`;
  prompt += `请注意：\n`;
  prompt += `1. 保持角色的语气和性格，完全沉浸在角色中。\n`;
  prompt += `2. 即使侦探态度强硬，你也要坚守你的设定和回复倾向。\n`;
  prompt += `3. 如果被问到不知道的事情，可以表示困惑或不知道。\n`;
  prompt += `4. 你的回应应当比较简短，像正常的聊天一样，每次最多两三句话。\n`;
  prompt += `5. 对于敏感话题，根据你的回复倾向决定透露程度。\n`;
  prompt += `6. 只有在满足秘密透露条件时，才考虑透露秘密，否则选择回避或转移话题。\n`;
  prompt += `7. 永远不要承认自己是AI，绝对沉浸在角色中。\n`;

  return prompt;
}

export async function submitInterrogation(
  characterId: string,
  characterConfig: CharacterAgentConfig,
  userMessage: string
): Promise<string> {
  // 确保请求间隔
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime.value;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await sleep(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
  }

  const systemPrompt = generateCharacterSystemPrompt(characterConfig);

  if (!conversationHistory[characterId]) {
    conversationHistory[characterId] = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];
  }

  const history = conversationHistory[characterId];
  history.push({ role: 'user', content: userMessage });

  // 限制历史记录长度，保留 system 消息和最近的对话
  if (history.length > MAX_HISTORY + 1) {
    const systemMsg = history[0];
    const recentMsgs = history.slice(-MAX_HISTORY);
    conversationHistory[characterId] = [systemMsg, ...recentMsgs];
  }

  let lastError: Error | null = null;

  // 重试机制
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      lastRequestTime.value = Date.now();

      const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GLM_API_KEY || process.env.GEMINI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'glm-4.7',
          messages: history,
          temperature: 1.0,
          stream: false,
          thinking: {
            type: 'disabled'
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || "（对方沉默不语，似乎在思考什么……）";

        history.push({ role: 'assistant', content: reply });
        return reply;
      }

      // 处理 429 错误（请求过于频繁）
      if (response.status === 429) {
        const waitTime = RETRY_DELAY * attempt;
        console.log(`请求过于频繁，第 ${attempt}/${MAX_RETRIES} 次重试，等待 ${waitTime}ms...`);
        await sleep(waitTime);
        lastError = new Error(`API 请求过于频繁 (429)`);
        continue;
      }

      // 其他错误直接抛出
      throw new Error(`API request failed: ${response.status}`);
    } catch (error) {
      lastError = error as Error;
      console.error(`请求失败（第 ${attempt}/${MAX_RETRIES} 次）:`, error);

      // 最后一次重试失败则抛出错误
      if (attempt === MAX_RETRIES) {
        break;
      }

      await sleep(RETRY_DELAY * attempt);
    }
  }

  console.error("LLM Error after retries:", lastError);
  return "（对方沉默不语，似乎在思考什么……）";
}
