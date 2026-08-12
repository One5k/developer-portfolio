import React, { useEffect, useState } from 'react';
import { skillsApi } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Code2,
  Terminal,
  Cpu,
  Database,
  Globe,
  Layers,
  Smartphone,
  Layout,
  Server,
  Zap,
  Cloud,
  Boxes,
  FileCode,
  Braces,
  Component,
  GitBranch,
  Workflow
} from 'lucide-react';

// Icon & Brand Color mapper for tech names
const getTechMeta = (name: string) => {
  const lower = name.toLowerCase();

  if (lower.includes('react') || lower.includes('atom')) return { icon: Component, color: '#61DAFB' };
  if (lower.includes('flutter')) return { icon: Smartphone, color: '#54C5F8' };
  if (lower.includes('mobile') || lower.includes('android') || lower.includes('ios')) return { icon: Smartphone, color: '#3DDC84' };
  if (lower.includes('nest') || lower.includes('node') || lower.includes('express')) return { icon: Server, color: '#E0234E' };
  if (lower.includes('python')) return { icon: FileCode, color: '#3776AB' };
  if (lower.includes('php')) return { icon: FileCode, color: '#777BB4' };
  if (lower.includes('typescript') || lower.includes('js') || lower.includes('javascript')) return { icon: Code2, color: '#3178C6' };
  if (lower.includes('supabase')) return { icon: Database, color: '#3ECF8E' };
  if (lower.includes('postgres') || lower.includes('sql') || lower.includes('data')) return { icon: Database, color: '#4169E1' };
  if (lower.includes('web') || lower.includes('html') || lower.includes('css') || lower.includes('api')) return { icon: Globe, color: '#38BDF8' };
  if (lower.includes('ai') || lower.includes('ml') || lower.includes('intelligence') || lower.includes('cpu')) return { icon: Cpu, color: '#A855F7' };
  if (lower.includes('tailwind')) return { icon: Layout, color: '#06B6D4' };
  if (lower.includes('figma') || lower.includes('ui') || lower.includes('ux') || lower.includes('design')) return { icon: Layout, color: '#F24E1E' };
  if (lower.includes('git') || lower.includes('github')) return { icon: GitBranch, color: '#F05032' };
  if (lower.includes('docker') || lower.includes('cloud') || lower.includes('linux')) return { icon: Cloud, color: '#2496ED' };
  if (lower.includes('architecture') || lower.includes('structure') || lower.includes('system')) return { icon: Boxes, color: '#F59E0B' };
  if (lower.includes('workflow') || lower.includes('ci/cd') || lower.includes('devops')) return { icon: Workflow, color: '#10B981' };

  return { icon: Braces, color: '#94A3B8' };
};

const TechMarquee: React.FC = () => {
  const { language } = useLanguage();
  const [skills, setSkills] = useState<any[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { skills: data } = await skillsApi.getAll();
        setSkills(data);
      } catch (error) {
        console.error('Failed to fetch skills for marquee:', error);
      }
    };
    fetchSkills();
  }, []);

  if (skills.length === 0) return null;

  // Double the list to create a seamless infinite loop
  const doubled = [...skills, ...skills];

  return (
    <div className="relative overflow-hidden border-y border-border/40 bg-secondary/20 py-3.5 select-none">
      {/* Subtle fade edges */}
      <div
        className="absolute inset-y-0 start-0 w-20 sm:w-32 z-10 pointer-events-none"
        style={{
          backgroundImage: language === 'ar'
            ? 'linear-gradient(to right, hsl(var(--background)), transparent)'
            : 'linear-gradient(to left, hsl(var(--background)), transparent)'
        }}
      />
      <div
        className="absolute inset-y-0 end-0 w-20 sm:w-32 z-10 pointer-events-none"
        style={{
          backgroundImage: language === 'ar'
            ? 'linear-gradient(to left, hsl(var(--background)), transparent)'
            : 'linear-gradient(to right, hsl(var(--background)), transparent)'
        }}
      />

      <div
        className="flex gap-6 sm:gap-8 whitespace-nowrap items-center"
        style={{
          animation: `marquee-scroll ${skills.length * 3}s linear infinite`,
          direction: 'ltr',
        }}
      >
        {doubled.map((skill, idx) => {
          const { icon: Icon, color } = getTechMeta(skill.name_en);
          return (
            <div
              key={`${skill.id || skill.name_en}-${idx}`}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-card/80 border border-border/50 shadow-xs hover:border-primary/40 transition-all duration-300 group"
            >
              <div
                className="p-1 rounded-md transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon className="h-3.5 w-3.5" style={{ color }} />
              </div>
              <span className="text-xs font-mono font-medium text-foreground/80 group-hover:text-foreground tracking-wide">
                {skill.name_en}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TechMarquee;
