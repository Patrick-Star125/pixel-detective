import { useState } from 'react';
import { GameObject, Clue, InventoryItem } from '../types';

interface InterrogationChatProps {
  npc: GameObject;
  onSend: (message: string) => Promise<void>;
  onClose: () => void;
  isThinking?: boolean;
  selectedEvidence?: (Clue | InventoryItem)[];
}

export function InterrogationChat({ npc, onSend, onClose, isThinking, selectedEvidence = [] }: InterrogationChatProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if ((!input.trim() && selectedEvidence.length === 0) || isThinking) return;

    let fullMessage = input.trim();
    if (selectedEvidence.length > 0) {
      const evidenceStr = selectedEvidence.map(e => `[${e.name}]`).join(', ');
      fullMessage = `(拿出证物: ${evidenceStr}) ${fullMessage}`;
    }

    onSend(fullMessage);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 cursor-default">
      <div className="absolute top-4 right-4">
        <button onClick={onClose} className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700">结束审问</button>
      </div>

      <div className="bg-gray-900 border-t-2 border-gray-700 p-6 flex flex-col items-center justify-end min-h-[160px]">
        <div className="w-full max-w-2xl">
          <div className="mb-2 text-blue-400 font-bold">审问：{npc.name}</div>

          {selectedEvidence.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-3">
              {selectedEvidence.map(item => {
                const isClue = 'id' in item && item.id.startsWith('clue-');

                return (
                  <div
                    key={item.id}
                    className={`border rounded px-2 py-1 flex items-center gap-1 shadow-sm ${
                      isClue
                        ? 'bg-blue-900/30 border-blue-500/50'
                        : 'bg-stone-800 border-yellow-500/50'
                    }`}
                  >
                    <span className="text-sm">{item.icon}</span>
                    <span className={`text-[10px] font-bold ${isClue ? 'text-blue-400' : 'text-yellow-500'}`}>{item.name}</span>
                  </div>
                );
              })}
            </div>
          )}

          {isThinking && <div className="text-gray-400 italic mb-2">对方正在组织语言...</div>}
          <div className="flex gap-2 w-full mt-2">
             <input
               type="text"
               className="flex-1 bg-gray-800 border border-gray-600 rounded px-4 py-3 text-white focus:outline-none focus:border-blue-500"
               placeholder={selectedEvidence.length > 0 ? "针对以上证物提问..." : "输入你要问的问题..."}
               value={input}
               onChange={e => setInput(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && handleSend()}
               disabled={isThinking}
               autoFocus
             />
             <button
               onClick={handleSend}
               disabled={isThinking || (!input.trim() && selectedEvidence.length === 0)}
               className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-3 rounded font-medium transition-colors"
             >
               提问
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
