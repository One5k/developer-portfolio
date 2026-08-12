import React, { useEffect, useState } from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export type ColorDirection = 'neutral-apple' | 'deep-creative' | 'arabic-contemporary';

interface DirectionConfig {
  id: ColorDirection;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  previewBg: string;
  previewAccent: string;
}

const directions: DirectionConfig[] = [
  {
    id: 'neutral-apple',
    titleAr: '1. Neutral / Apple',
    titleEn: '1. Neutral / Apple',
    descAr: 'هوية هادئة وفاخرة — تباين طفيف وأكسنت ناعم جدًا بروح Apple',
    descEn: 'Quiet luxury identity — subtle contrast & ultra-quiet accent',
    previewBg: 'bg-neutral-900',
    previewAccent: 'bg-slate-300',
  },
  {
    id: 'deep-creative',
    titleAr: '2. Deep Creative',
    titleEn: '2. Deep Creative',
    descAr: 'هوية أكثر جرأة وإبداعاً للمطور الشامل ومصمم الواجهات',
    descEn: 'Bolder creative identity for Full-stack Developer & UI/UX',
    previewBg: 'bg-slate-950',
    previewAccent: 'bg-indigo-500',
  },
  {
    id: 'arabic-contemporary',
    titleAr: '3. Arabic Contemporary',
    titleEn: '3. Arabic Contemporary',
    descAr: 'شخصية عربية معاصرة وراقية — درجات السيينا والصحراء الهادئة',
    descEn: 'Refined contemporary Arabic character — Sienna & Desert Bronze',
    previewBg: 'bg-stone-900',
    previewAccent: 'bg-amber-600',
  },
];

const ColorDirectionSwitcher: React.FC = () => {
  const { language } = useLanguage();
  const [activeDirection, setActiveDirection] = useState<ColorDirection>('neutral-apple');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('portfolio-color-direction') as ColorDirection;
    if (saved && directions.some((d) => d.id === saved)) {
      setActiveDirection(saved);
      document.documentElement.setAttribute('data-color-direction', saved);
    } else {
      document.documentElement.setAttribute('data-color-direction', 'neutral-apple');
    }
  }, []);

  const handleSelect = (id: ColorDirection) => {
    setActiveDirection(id);
    localStorage.setItem('portfolio-color-direction', id);
    document.documentElement.setAttribute('data-color-direction', id);
  };

  return (
    <div className="fixed bottom-6 end-6 z-50 transition-all duration-300">
      {isExpanded ? (
        <div className="bg-card/95 backdrop-blur-xl border border-border p-4 rounded-xl shadow-2xl max-w-sm w-[90vw] sm:w-96 space-y-3 animate-fade-in text-start">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                {language === 'ar' ? 'اختيار الاتجاه البصري (Color Direction)' : 'Select Color Direction'}
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-xs text-muted-foreground hover:text-foreground px-2 py-0.5 rounded hover:bg-muted"
            >
              ✕
            </button>
          </div>

          <p className="text-[11px] text-muted-foreground leading-normal">
            {language === 'ar'
              ? 'اختر الاتجاه لتجربته حياً على الواجهة بالكامل وفي كلا الوضعين الداكن والفاتح:'
              : 'Select a direction to preview live across the interface in both Dark & Light modes:'}
          </p>

          <div className="space-y-2">
            {directions.map((dir) => {
              const isSelected = activeDirection === dir.id;
              return (
                <button
                  key={dir.id}
                  onClick={() => handleSelect(dir.id)}
                  className={`w-full text-start p-3 rounded-lg border text-xs transition-all duration-200 flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'border-primary bg-primary/10 text-foreground ring-1 ring-primary'
                      : 'border-border/60 hover:border-primary/40 bg-secondary/40 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 font-bold">
                      <span>{language === 'ar' ? dir.titleAr : dir.titleEn}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                    </div>
                    <p className="text-[10px] opacity-80 leading-relaxed">
                      {language === 'ar' ? dir.descAr : dir.descEn}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`w-3.5 h-3.5 rounded-full border border-white/20 ${dir.previewBg}`} />
                    <span className={`w-3.5 h-3.5 rounded-full ${dir.previewAccent}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-card/90 backdrop-blur-md border border-primary/40 shadow-lg text-foreground hover:border-primary transition-all duration-300 group cursor-pointer text-xs font-semibold"
        >
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <span>
            {language === 'ar'
              ? `اتجاه الألوان: ${directions.find((d) => d.id === activeDirection)?.titleAr.split('.')[1]}`
              : `Color Direction: ${directions.find((d) => d.id === activeDirection)?.titleEn.split('.')[1]}`}
          </span>
        </button>
      )}
    </div>
  );
};

export default ColorDirectionSwitcher;
