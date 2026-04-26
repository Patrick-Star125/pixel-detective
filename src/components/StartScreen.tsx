interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white font-sans">
      <h1 className="text-5xl font-bold mb-4 tracking-wider text-red-500 pixel-font drop-shadow-lg">风雨庄园谋杀案</h1>
      <p className="text-gray-400 mb-12 text-lg">像素推理解谜游戏 Demo</p>
      
      <button 
        onClick={onStart}
        className="px-8 py-3 bg-red-800 hover:bg-red-700 text-white text-xl rounded shadow-[0_4px_0_rgb(127,29,29)] active:shadow-[0_0px_0_rgb(127,29,29)] active:translate-y-1 transition-all"
      >
        开始游戏
      </button>
      
      <div className="mt-12 text-gray-500 text-sm max-w-md text-center">
        操作说明：<br/>
        使用 W/A/S/D 或 方向键 移动。<br/>
        靠近角色/物品以互动。
      </div>
    </div>
  );
}
