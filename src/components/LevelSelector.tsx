import React, { useState } from 'react';
import { X, Lock, CheckCircle2, Play } from 'lucide-react';

interface LevelSelectorProps {
  currentLevel: number;
  maxUnlockedLevel: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectLevel: (lvl: number) => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  currentLevel,
  maxUnlockedLevel,
  isOpen,
  onClose,
  onSelectLevel,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0); // 0: 1-20, 1: 21-40, etc.

  if (!isOpen) return null;

  const tabs = [
    { label: '۱ تا ۲۰', start: 1, end: 20 },
    { label: '۲۱ تا ۴۰', start: 21, end: 40 },
    { label: '۴۱ تا ۶۰', start: 41, end: 60 },
    { label: '۶۱ تا ۸۰', start: 61, end: 80 },
    { label: '۸۱ تا ۱۰۰', start: 81, end: 100 },
  ];

  const currentTabRange = tabs[activeTab];
  const levels = Array.from(
    { length: currentTabRange.end - currentTabRange.start + 1 },
    (_, i) => currentTabRange.start + i
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-[#0e133c] border border-[#232e78] rounded-xl shadow-2xl p-5 text-white flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1e296e]">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-amber-400">انتخاب مرحله</span>
            <span className="text-xs text-slate-400">(از ۱ تا ۱۰۰)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#1a2360] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Range Tabs */}
        <div className="flex items-center gap-1 my-3 overflow-x-auto pb-1 text-xs">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-colors ${
                activeTab === idx
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-[#151c50] text-slate-300 hover:bg-[#1e276b]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 overflow-y-auto py-2 my-1 pr-1">
          {levels.map((lvl) => {
            const isUnlocked = lvl <= maxUnlockedLevel;
            const isCurrent = lvl === currentLevel;

            return (
              <button
                key={lvl}
                disabled={!isUnlocked}
                onClick={() => {
                  onSelectLevel(lvl);
                  onClose();
                }}
                className={`relative flex flex-col items-center justify-center h-16 rounded-lg border transition-all text-sm font-bold ${
                  isCurrent
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/40'
                    : isUnlocked
                    ? 'bg-[#151b54] border-[#253282] text-white hover:bg-[#1f2878] hover:border-amber-400/50'
                    : 'bg-[#0a0d2a] border-[#151b46] text-slate-600 cursor-not-allowed'
                }`}
              >
                {isUnlocked ? (
                  <>
                    <span className="text-base">{lvl}</span>
                    {lvl < maxUnlockedLevel ? (
                      <CheckCircle2 size={12} className="text-emerald-400 mt-0.5" />
                    ) : isCurrent ? (
                      <Play size={11} className="text-amber-400 mt-0.5" />
                    ) : (
                      <span className="text-[10px] text-slate-400 mt-0.5">آماده</span>
                    )}
                  </>
                ) : (
                  <>
                    <span className="text-sm opacity-50">{lvl}</span>
                    <Lock size={13} className="text-slate-600 mt-1" />
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick cheat / test unlock for user convenience */}
        <div className="flex items-center justify-between pt-3 mt-auto border-t border-[#1e296e] text-xs text-slate-400">
          <span>مراحل باز شده: {maxUnlockedLevel} از ۱۰۰</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#1a2360] hover:bg-[#253185] text-white font-medium transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
