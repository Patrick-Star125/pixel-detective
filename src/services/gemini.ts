const MAX_HISTORY = 10;
const conversationHistory: Record<string, Array<{role: string, content: string}>> = {};

export async function submitInterrogation(characterName: string, characterDesc: string, userMessage: string): Promise<string> {
  if (!conversationHistory[characterName]) {
    conversationHistory[characterName] = [
      {
        role: 'system',
        content: `你正在扮演一个侦探游戏中的角色。你的名字是：${characterName}。
关于你的设定：${characterDesc}。
你现在正在被侦探审问。请根据你的设定回答侦探的问题。
请注意：
1. 保持角色的语气和性格。
2. 即使侦探态度强硬，你也要坚守你的设定。
3. 如果被问到不知道的事情，可以表示困惑或不知道。
4. 你的回应应当比较简短，像正常的聊天一样，每次最多两三句话。
5. 永远不要承认自己是AI，绝对沉浸在角色中。`
      }
    ];
  }

  const history = conversationHistory[characterName];
  history.push({ role: 'user', content: userMessage });

  // 限制历史记录长度，保留 system 消息和最近的对话
  if (history.length > MAX_HISTORY + 1) {
    const systemMsg = history[0];
    const recentMsgs = history.slice(-MAX_HISTORY);
    conversationHistory[characterName] = [systemMsg, ...recentMsgs];
  }

  try {
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GLM_API_KEY || process.env.GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'glm-5.1',
        messages: history,
        temperature: 1.0,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "（对方沉默不语，似乎在思考什么……）";

    history.push({ role: 'assistant', content: reply });
    return reply;
  } catch (error) {
    console.error("LLM Error:", error);
    return "（对方沉默不语，似乎在思考什么……）";
  }
}
