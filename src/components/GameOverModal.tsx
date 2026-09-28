import React from 'react';
import { RotateCcw, LayoutGrid, HeartCrack } from 'lucide-react';

interface GameOverModalProps {
  levelNumber: number;
  score: number;
  highScore: number;
  isOpen: boolean;
  onRestart: () => void;
  onOpenLevelSelector: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  levelNumber,
  score,
  highScore,
  isOpen,
  onRestart,
  onOpenLevelSelector,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-sm bg-[#0e133c] border-2 border-red-500/50 rounded-2xl shadow-2xl p-6 text-white text-center flex flex-col items-center">
        {/* Game Over Icon */}
        <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-400 flex items-center justify-center mb-4 text-red-400 shadow-lg shadow-red-500/20">
          <HeartCrack size={32} />
        </div>

        <h2 className="text-2xl font-black text-red-400 mb-1">باختید!</h2>
        <p className="text-xs text-slate-300 mb-4">
          تمام توپ‌های شما از دست رفت. دوباره تلاش کنید!
        </p>

        {/* Scores */}
        <div className="w-full grid grid-cols-2 gap-2 bg-[#151b52] rounded-xl p-3 mb-6 border border-[#232f7a]">
          <div>
            <span className="text-[11px] text-slate-400 block mb-0.5">امتیاز نهایی</span>
            <span className="text-xl font-bold text-white font-mono tabular-nums">
              {score.toLocaleString('fa-IR')}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block mb-0.5">بهترین رکورد</span>
            <span className="text-xl font-bold text-amber-400 font-mono tabular-nums">
              {highScore.toLocaleString('fa-IR')}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={onRestart}
            className="w-full py-3 px-4 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 transition-all transform active:scale-98"
          >
            <RotateCcw size={18} />
            <span>تلاش مجدد در مرحله {levelNumber}</span>
          </button>

          <button
            onClick={onOpenLevelSelector}
            className="w-full py-2.5 px-3 rounded-lg bg-[#161d56] hover:bg-[#202970] text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <LayoutGrid size={14} />
            <span>انتخاب مراحل</span>
          </button>
        </div>
      </div>
    </div>
  );
};
