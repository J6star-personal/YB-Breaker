import React from 'react';
import { X, MousePointer, Smartphone, Shield, Zap, Sparkles, ExternalLink } from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-[#0e133c] border border-[#232e78] rounded-xl shadow-2xl p-5 text-white flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1e296e]">
          <h2 className="text-lg font-bold text-amber-400">راهنمای بازی YB Blocks</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-[#1a2360] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 py-3 text-xs text-slate-300 leading-relaxed">
          {/* Controls */}
          <div className="bg-[#151c50] p-3 rounded-lg border border-[#253282]">
            <span className="font-bold text-sm text-white flex items-center gap-2 mb-2">
              <MousePointer size={15} className="text-amber-400" />
              نحوه کنترل در کامپیوتر و لپ‌تاپ:
            </span>
            <p>
              با حرکت دادن <strong>موس</strong>، راکت سفید پایینی جابجا می‌شود. با <strong>کلیک چپ</strong> یا فشردن کلید <strong>Space</strong> توپ پرتاب می‌شود. با کلیدهای جهت‌نمای چپ و راست یا A و D نیز می‌توانید بازی کنید.
            </p>
          </div>

          <div className="bg-[#151c50] p-3 rounded-lg border border-[#253282]">
            <span className="font-bold text-sm text-white flex items-center gap-2 mb-2">
              <Smartphone size={15} className="text-sky-400" />
              نحوه کنترل در گوشی و تبلت:
            </span>
            <p>
              انگشت خود را روی صفحه بگذارید و به چپ و راست <strong>بکشید (Drag)</strong> تا راکت حرکت کند. برای پرتاب توپ، روی صفحه یک‌بار <strong>ضربه (Tap)</strong> بزنید.
            </p>
          </div>

          {/* Block Types */}
          <div className="space-y-2">
            <span className="font-bold text-sm text-white flex items-center gap-2">
              <Shield size={15} className="text-emerald-400" />
              انواع بلوک‌ها:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-2 bg-[#121844] p-2 rounded border border-[#1e296e]">
                <span className="w-4 h-3 bg-[#e52521] rounded-xs inline-block"></span>
                <span>بلوک قرمز (شکستنی)</span>
              </div>
              <div className="flex items-center gap-2 bg-[#121844] p-2 rounded border border-[#1e296e]">
                <span className="w-4 h-3 bg-[#00d632] rounded-xs inline-block"></span>
                <span>بلوک سبز (شکستنی)</span>
              </div>
              <div className="flex items-center gap-2 bg-[#121844] p-2 rounded border border-[#1e296e]">
                <span className="w-4 h-3 bg-[#737985] rounded-xs inline-block"></span>
                <span>سنگ خاکستری (نشکن)</span>
              </div>
              <div className="flex items-center gap-2 bg-[#121844] p-2 rounded border border-[#1e296e]">
                <span className="w-4 h-3 bg-[#ffb703] rounded-xs inline-block"></span>
                <span>بلوک ویژه (+3 توپ)</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              توپ‌ها از روی سنگ‌های خاکستری کمانه می‌کنند و نمی‌شکنند. با نابود کردن تمام بلوک‌های رنگی، مرحله تمام می‌شود!
            </p>
          </div>

          {/* PowerUps */}
          <div className="space-y-2">
            <span className="font-bold text-sm text-white flex items-center gap-2">
              <Zap size={15} className="text-amber-400" />
              جوایز و قدرت‌ها:
            </span>
            <div className="space-y-1 text-[11px] text-slate-300">
              <p>• <strong>+3</strong>: پرتاب توپ‌های اضافی در آسمان</p>
              <p>• <strong>⚡ لیزر</strong>: شلیک لیزر با کلیک یا ضربه به بلوک‌ها</p>
              <p>• <strong>↔ راکت پهن</strong>: بزرگ‌تر شدن راکت برای دریافت آسان‌تر توپ‌ها</p>
              <p>• <strong>♥ قلب</strong>: اضافه شدن جان اضافه</p>
            </div>
          </div>

          {/* 100 Levels */}
          <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/30 flex items-start gap-2.5">
            <Sparkles size={16} className="text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-200">
              بازی شامل ۱۰۰ مرحله چالش‌برانگیز و جذاب است که به تدریج سخت‌تر می‌شوند. رکورد و مراحل باز شده شما به صورت خودکار ذخیره می‌شود.
            </p>
          </div>
        </div>

        {/* Footer Link */}
        <div className="pt-3 border-t border-[#1e296e] flex items-center justify-between">
          <a
            href="https://yadbegiresh.ir"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
          >
            <span>مشاهده وب‌سایت یادبگیرش</span>
            <ExternalLink size={12} />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
          >
            فهمیدم
          </button>
        </div>
      </div>
    </div>
  );
};
