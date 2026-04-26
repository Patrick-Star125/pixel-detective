import { motion, AnimatePresence } from 'motion/react';
import { InventoryItem } from '../types';
import { X } from 'lucide-react';

interface InventoryDetailModalProps {
  item: InventoryItem | null;
  onClose: () => void;
}

export function InventoryDetailModal({ item, onClose }: InventoryDetailModalProps) {
  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-stone-900 border-2 border-stone-600 rounded-lg shadow-2xl w-full max-w-md overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-stone-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-24 h-24 bg-stone-950 border-2 border-stone-700 rounded-lg flex items-center justify-center text-6xl shadow-inner">
                  {item.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-yellow-500 mb-2 font-mono">物品：{item.name}</h2>
                  <div className="w-12 h-0.5 bg-stone-700 mx-auto mb-4" />
                  <p className="text-stone-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-stone-950 p-2 text-center text-[10px] text-stone-600 font-mono">
              点击外部或右上角关闭
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
