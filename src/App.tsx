/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  LayoutGrid,
  Pause,
  Play,
  HelpCircle,
  Heart,
  Trophy,
  ExternalLink,
  FastForward,
} from 'lucide-react';
import { GameCanvas } from './components/GameCanvas';
import { LevelSelector } from './components/LevelSelector';
import { LevelWonModal } from './components/LevelWonModal';
import { GameOverModal } from './components/GameOverModal';
import { InstructionsModal } from './components/InstructionsModal';
import { getLevel } from './utils/levels';
import { soundManager } from './utils/audio';

export default function App() {
  // Game State
  const [currentLevel, setCurrentLevel] = useState<number>(() => {
    const saved = localStorage.getItem('yb_blocks_level');
    return saved ? Math.max(1, Math.min(100, parseInt(saved, 10))) : 1;
  });

  const [maxUnlockedLevel, setMaxUnlockedLevel] = useState<number>(() => {
    const saved = localStorage.getItem('yb_blocks_unlocked');
    return saved ? Math.max(1, Math.min(100, parseInt(saved, 10))) : 1;
  });

  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('yb_blocks_highscore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [lives, setLives] = useState<number>(3);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);

  // Modals
  const [isLevelSelectorOpen, setIsLevelSelectorOpen] = useState<boolean>(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState<boolean>(false);
  const [isLevelWonOpen, setIsLevelWonOpen] = useState<boolean>(false);
  const [isGameOverOpen, setIsGameOverOpen] = useState<boolean>(false);

  // Key for forcing canvas remount on level change or restart
  const [canvasKey, setCanvasKey] = useState<number>(0);

  // Get current level grid data
  const currentLevelData = useMemo(() => {
    return getLevel(currentLevel);
  }, [currentLevel]);

  // Persist progress
  useEffect(() => {
    localStorage.setItem('yb_blocks_level', currentLevel.toString());
  }, [currentLevel]);

  useEffect(() => {
    localStorage.setItem('yb_blocks_unlocked', maxUnlockedLevel.toString());
  }, [maxUnlockedLevel]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('yb_blocks_highscore', score.toString());
    }
  }, [score, highScore]);

  // Handle Score Delta
  const handleScoreUpdate = useCallback((delta: number) => {
    setScore((prev) => prev + delta);
  }, []);

  // Handle Lives Update
  const handleLivesUpdate = useCallback((newLives: number) => {
    setLives(newLives);
  }, []);

  // Handle Level Complete
  const handleLevelComplete = useCallback(() => {
    setIsLevelWonOpen(true);
    const nextLvl = currentLevel + 1;
    if (nextLvl <= 100 && nextLvl > maxUnlockedLevel) {
      setMaxUnlockedLevel(nextLvl);
    }
  }, [currentLevel, maxUnlockedLevel]);

  // Handle Game Over
  const handleGameOver = useCallback(() => {
    setIsGameOverOpen(true);
  }, []);

  // Actions
  const restartLevel = useCallback(() => {
    setLives(3);
    setIsGameOverOpen(false);
    setIsLevelWonOpen(false);
    setIsPaused(false);
    setCanvasKey((k) => k + 1);
  }, []);

  const proceedToNextLevel = useCallback(() => {
    if (currentLevel < 100) {
      const nextLvl = currentLevel + 1;
      setCurrentLevel(nextLvl);
      setMaxUnlockedLevel((prev) => Math.max(prev, nextLvl));
      setLives(3);
      setIsLevelWonOpen(false);
      setIsGameOverOpen(false);
      setIsPaused(false);
      setCanvasKey((k) => k + 1);
    }
  }, [currentLevel]);

  const selectLevel = useCallback((lvl: number) => {
    setCurrentLevel(lvl);
    setLives(3);
    setIsGameOverOpen(false);
    setIsLevelWonOpen(false);
    setIsPaused(false);
    setCanvasKey((k) => k + 1);
  }, []);

  const toggleSound = useCallback(() => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  }, []);

  const cycleSpeed = useCallback(() => {
    setSpeedMultiplier((prev) => {
      if (prev === 1.0) return 1.4;
      if (prev === 1.4) return 1.8;
      return 1.0;
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0e2b] text-slate-100 flex flex-col justify-between items-center selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Top Header */}
      <header className="w-full max-w-2xl px-3 py-2.5 sm:py-3 border-b border-[#1c2460] bg-[#0d1238]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center justify-between gap-2">
          {/* Brand & Level Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-red-600 via-amber-500 to-green-500 flex items-center justify-center p-0.5 shadow-md shadow-red-500/20">
              <div className="w-full h-full bg-[#101546] rounded-xs flex items-center justify-center font-black text-[10px] text-white">
                YB
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-wide text-white">
                  YB Blocks
                </h1>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  مرحله {currentLevel} از ۱۰۰
                </span>
              </div>
              <p className="text-[10px] text-slate-400 truncate max-w-[150px] sm:max-w-xs">
                {currentLevelData.title}
              </p>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Speed toggle */}
            <button
              onClick={cycleSpeed}
              title="سرعت بازی"
              className="px-2 py-1 rounded-lg bg-[#141b4e] hover:bg-[#1d2770] border border-[#253282] text-xs font-bold text-amber-300 transition-colors flex items-center gap-1"
            >
              <FastForward size={13} />
              <span>{speedMultiplier}x</span>
            </button>

            {/* Level Select button */}
            <button
              onClick={() => setIsLevelSelectorOpen(true)}
              title="انتخاب مرحله"
              className="p-1.5 sm:p-2 rounded-lg bg-[#141b4e] hover:bg-[#1d2770] border border-[#253282] text-slate-200 transition-colors"
            >
              <LayoutGrid size={16} />
            </button>

            {/* Sound toggle */}
            <button
              onClick={toggleSound}
              title={isMuted ? 'روشن کردن صدا' : 'قطع صدا'}
              className="p-1.5 sm:p-2 rounded-lg bg-[#141b4e] hover:bg-[#1d2770] border border-[#253282] text-slate-200 transition-colors"
            >
              {isMuted ? <VolumeX size={16} className="text-red-400" /> : <Volume2 size={16} className="text-emerald-400" />}
            </button>

            {/* Pause toggle */}
            <button
              onClick={() => setIsPaused((p) => !p)}
              title={isPaused ? 'ادامه بازی' : 'توقف بازی'}
              className="p-1.5 sm:p-2 rounded-lg bg-[#141b4e] hover:bg-[#1d2770] border border-[#253282] text-slate-200 transition-colors"
            >
              {isPaused ? <Play size={16} className="text-emerald-400" /> : <Pause size={16} />}
            </button>

            {/* Restart */}
            <button
              onClick={restartLevel}
              title="شروع مجدد این مرحله"
              className="p-1.5 sm:p-2 rounded-lg bg-[#141b4e] hover:bg-[#1d2770] border border-[#253282] text-slate-200 transition-colors"
            >
              <RotateCcw size={16} />
            </button>

            {/* Instructions */}
            <button
              onClick={() => setIsInstructionsOpen(true)}
              title="راهنمای بازی"
              className="p-1.5 sm:p-2 rounded-lg bg-[#141b4e] hover:bg-[#1d2770] border border-[#253282] text-amber-400 transition-colors"
            >
              <HelpCircle size={16} />
            </button>
          </div>
        </div>

        {/* Status Bar: Score, Lives, HighScore */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#182055] text-xs">
          {/* Lives hearts */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-[11px] ml-1">جان:</span>
            {Array.from({ length: 5 }).map((_, i) => (
              <Heart
                key={i}
                size={14}
                className={
                  i < lives
                    ? 'text-red-500 fill-red-500 drop-shadow-sm'
                    : 'text-slate-700'
                }
              />
            ))}
          </div>

          {/* Score & High Score */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[11px]">امتیاز:</span>
              <span className="font-bold text-amber-300 font-mono tabular-nums">
                {score.toLocaleString('fa-IR')}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
              <Trophy size={13} className="text-amber-400" />
              <span className="text-[11px]">رکورد:</span>
              <span className="font-medium text-slate-300 font-mono tabular-nums">
                {highScore.toLocaleString('fa-IR')}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Game Screen */}
      <main className="flex-1 w-full max-w-xl flex flex-col items-center justify-center p-2 sm:p-4">
        <GameCanvas
          key={canvasKey}
          levelData={currentLevelData}
          speedMultiplier={speedMultiplier}
          isPaused={isPaused}
          onScoreUpdate={handleScoreUpdate}
          onLivesUpdate={handleLivesUpdate}
          onLevelComplete={handleLevelComplete}
          onGameOver={handleGameOver}
          currentLives={lives}
        />
      </main>

      {/* Footer with Yadbegiresh link as requested */}
      <footer className="w-full border-t border-[#182055] bg-[#0a0d28] py-3 px-4 text-center">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-300">YB Blocks</span>
            <span>-</span>
            <span>بازی شکستن بلوک‌ها به سبک Many Bricks Breaker</span>
          </div>

          <a
            href="https://yadbegiresh.ir"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-bold bg-[#141b4e] hover:bg-[#1e276e] border border-[#253282] px-3 py-1.5 rounded-lg transition-colors shadow-xs"
          >
            <span>بازگشت به سایت یادبگیرش (yadbegiresh.ir)</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </footer>

      {/* Modals */}
      <LevelSelector
        currentLevel={currentLevel}
        maxUnlockedLevel={maxUnlockedLevel}
        isOpen={isLevelSelectorOpen}
        onClose={() => setIsLevelSelectorOpen(false)}
        onSelectLevel={selectLevel}
      />

      <LevelWonModal
        levelNumber={currentLevel}
        score={score}
        isOpen={isLevelWonOpen}
        hasNextLevel={currentLevel < 100}
        onNextLevel={proceedToNextLevel}
        onReplayLevel={restartLevel}
        onOpenLevelSelector={() => {
          setIsLevelWonOpen(false);
          setIsLevelSelectorOpen(true);
        }}
      />

      <GameOverModal
        levelNumber={currentLevel}
        score={score}
        highScore={highScore}
        isOpen={isGameOverOpen}
        onRestart={restartLevel}
        onOpenLevelSelector={() => {
          setIsGameOverOpen(false);
          setIsLevelSelectorOpen(true);
        }}
      />

      <InstructionsModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
      />
    </div>
  );
}
