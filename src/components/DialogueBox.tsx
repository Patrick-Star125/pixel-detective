import { useState, useEffect } from 'react';
import { DialogueLine } from '../types';

interface DialogueBoxProps {
  dialogues: DialogueLine[];
  onComplete: () => void;
}

export function DialogueBox({ dialogues, onComplete }: DialogueBoxProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [dialogues]);

  if (dialogues.length === 0) {
    onComplete();
    return null;
  }

  const currentLine = dialogues[currentIndex];

  const handleNext = () => {
    if (currentIndex < dialogues.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 cursor-pointer"
      onClick={handleNext}
    >
      {currentLine.image && (
        <div className="flex-1 flex items-center justify-center p-8">
          <img 
            src={currentLine.image} 
            alt="Scene" 
            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
      
      <div className="bg-gray-900 border-t-2 border-gray-700 p-6 text-white min-h-[160px] relative">
        {currentLine.speaker && (
          <div className="mb-2 text-xl font-bold text-blue-400">
            {currentLine.speaker}
          </div>
        )}
        <div className="text-lg leading-relaxed">
          {currentLine.text}
        </div>
        
        <div className="absolute bottom-4 right-6 text-sm text-gray-500 animate-pulse">
          点击继续 ▶
        </div>
        
        <div className="absolute bottom-4 left-6 text-sm text-gray-600 font-mono">
          {currentIndex + 1} / {dialogues.length}
        </div>
      </div>
    </div>
  );
}
