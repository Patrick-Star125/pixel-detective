import { GameObject } from '../types';

interface InteractionMenuProps {
  object: GameObject;
  onTalk: () => void;
  onInterrogate: () => void;
  onCollect?: () => void;
  onClose: () => void;
}

export function InteractionMenu({ object, onTalk, onInterrogate, onCollect, onClose }: InteractionMenuProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="bg-gray-800 border border-gray-600 rounded-lg shadow-xl p-6 min-w-[300px]">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">{object.icon}</div>
          <h2 className="text-xl font-bold text-white">{object.name}</h2>
          <p className="text-gray-400 text-sm mt-1">{object.type === 'NPC' ? '你想做什么？' : '发现了线索！'}</p>
        </div>

        <div className="flex flex-col gap-3">
          {object.type === 'NPC' && (
             <button onClick={onInterrogate} className="bg-blue-600 hover:bg-blue-500 text-white py-3 rounded transition-colors font-medium">
               审问
             </button>
          )}
          {object.type === 'ITEM' && onCollect && (
             <button onClick={onCollect} className="bg-yellow-600 hover:bg-yellow-500 text-white py-3 rounded transition-colors font-medium">
               收集
             </button>
          )}
          {object.dialogue && object.dialogue.length > 0 && (
            <button onClick={onTalk} className="bg-gray-700 hover:bg-gray-600 text-white py-3 rounded transition-colors font-medium">
              交谈 / 查看
            </button>
          )}
          <button onClick={onClose} className="bg-gray-800 border border-gray-600 hover:bg-gray-700 text-gray-300 py-3 rounded transition-colors font-medium">
            离开
          </button>
        </div>
      </div>
    </div>
  );
}
