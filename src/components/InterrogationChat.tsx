import { useState } from 'react';
import { GameObject } from '../types';

interface InterrogationChatProps {
  npc: GameObject;
  onSend: (message: string) => Promise<void>;
  onClose: () => void;
  isThinking?: boolean;
}

export function InterrogationChat({ npc, onSend, onClose, isThinking }: InterrogationChatProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim() || isThinking) return;
    onSend(input.trim());
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
          {isThinking && <div className="text-gray-400 italic mb-2">对方正在组织语言...</div>}
          <div className="flex gap-2 w-full mt-2">
             <input 
               type="text" 
               className="flex-1 bg-gray-800 border border-gray-600 rounded px-4 py-3 text-white focus:outline-none focus:border-blue-500"
               placeholder="输入你要问的问题..."
               value={input}
               onChange={e => setInput(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && handleSend()}
               disabled={isThinking}
               autoFocus
             />
             <button 
               onClick={handleSend}
               disabled={isThinking || !input.trim()}
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
