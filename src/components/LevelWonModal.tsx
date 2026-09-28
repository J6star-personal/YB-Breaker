import React from 'react';
import { Trophy, ArrowLeft, RotateCcw, LayoutGrid } from 'lucide-react';

interface LevelWonModalProps {
  levelNumber: number;
  score: number;
  isOpen: boolean;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplayLevel: () => void;
  onOpenLevelSelector: () => void;
}

export const LevelWonModal: React.FC<LevelWonModalProps> = ({
  levelNumber,
  score,
  isOpen,
  hasNextLevel,
  onNextLevel,
  onReplayLevel,
  onOpenLevelSelector,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-sm bg-[#0e133c] border-2 border-emerald-500/50 rounded-2xl shadow-2xl p-6 text-white text-center flex flex-col items-center">
        {/* Victory Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mb-4 text-emerald-400 shadow-lg shadow-emerald-500/20">
          <Trophy size={32} />
        </div>

        <h2 className="text-2xl font-black text-emerald-400 mb-1">
          مرحله {levelNumber} پاکسازی شد!
        </h2>
        <p className="text-xs text-slate-300 mb-4">
          عالی بود! تمام بلوک‌های تخریب‌پذیر را با موفقیت شکستید.
        </p>

        {/* Score display */}
        <div className="w-full bg-[#151b52] rounded-xl p-3 mb-6 border border-[#232f7a]">
          <span className="text-xs text-slate-400 block mb-1">امتیاز کسب شده</span>
          <span className="text-2xl font-bold text-amber-400 font-mono tabular-nums">
            {score.toLocaleString('fa-IR')}
          </span>
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col gap-2.5">
          {hasNextLevel ? (
            <button
              onClick={onNextLevel}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all transform active:scale-98"
            >
              <span>مرحله بعدی ({levelNumber + 1})</span>
              <ArrowLeft size={18} />
            </button>
          ) : (
            <div className="text-amber-400 font-bold py-2">
              🎉 تبریک! شما تمام ۱۰۰ مرحله بازی را به پایان رساندید! 🎉
            </div>
          )}

          <div className="flex gap-2 w-full mt-1">
            <button
              onClick={onReplayLevel}
              className="flex-1 py-2.5 px-3 rounded-lg bg-[#161d56] hover:bg-[#202970] text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw size={14} />
              <span>تکرار مرحله</span>
            </button>
            <button
              onClick={onOpenLevelSelector}
              className="flex-1 py-2.5 px-3 rounded-lg bg-[#161d56] hover:bg-[#202970] text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <LayoutGrid size={14} />
              <span>انتخاب مرحله</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
