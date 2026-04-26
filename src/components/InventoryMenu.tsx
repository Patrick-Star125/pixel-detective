import { motion } from 'motion/react';
import { InventoryItem } from '../types';
import { Package } from 'lucide-react';

interface InventoryMenuProps {
  items: (InventoryItem | null)[];
  onItemClick: (item: InventoryItem) => void;
  selectedEvidenceIds?: string[];
}

export function InventoryMenu({ items, onItemClick, selectedEvidenceIds = [] }: InventoryMenuProps) {
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-48 bg-stone-900/90 border-2 border-stone-700 p-3 rounded-lg shadow-2xl z-[70]">
      <div className="flex items-center gap-2 mb-3 border-b border-stone-700 pb-2">
        <Package size={18} className="text-stone-400" />
        <span className="text-sm font-bold text-stone-200 pixel-font tracking-tighter">物品栏</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {items.map((item, index) => {
          const isSelected = item && selectedEvidenceIds.includes(item.id);
          return (
            <div
              key={index}
              onClick={() => item && onItemClick(item)}
              className={`
                aspect-square rounded border-2 flex flex-col items-center justify-center relative transition-all duration-150 group
                ${item ? 'cursor-pointer' : 'border-stone-900 bg-stone-950 shadow-inner'}
                ${isSelected
                  ? 'border-yellow-500 bg-yellow-900/20 shadow-[0_0_10px_rgba(234,179,8,0.3)]'
                  : item ? 'border-stone-800 bg-stone-950 hover:border-yellow-500 hover:bg-stone-800' : ''}
              `}
            >
              {item ? (
                <>
                  <span className="text-2xl group-hover:scale-110 transition-transform mb-1">{item.icon}</span>
                  <span className={`text-[8px] text-center px-1 truncate w-full uppercase font-bold tracking-tighter ${isSelected ? 'text-yellow-400' : 'text-stone-500 group-hover:text-yellow-500'}`}>
                    {item.name}
                  </span>
                </>
              ) : (
                <div className="w-1 h-1 bg-stone-800 rounded-full" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
