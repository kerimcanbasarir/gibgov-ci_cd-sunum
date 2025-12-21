'use client';

import { Section, getTotalSlides, getTotalDuration } from '@/data/presentationData';

interface SidebarProps {
  sections: Section[];
  currentSection: string;
  currentSlide: string;
  onNavigate: (sectionId: string, slideId: string) => void;
  currentSlideIndex: number;
}

export default function Sidebar({
  sections,
  currentSection,
  currentSlide,
  onNavigate,
  currentSlideIndex,
}: SidebarProps) {
  const totalSlides = getTotalSlides();
  const totalDuration = getTotalDuration();

  return (
    <aside className="fixed left-0 top-0 h-screen w-80 bg-zinc-900 border-r border-zinc-800 overflow-y-auto">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">CI/CD & DevOps</h2>
          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <span>{totalSlides} Slayt</span>
            <span>~{totalDuration} dk</span>
          </div>
          <div className="mt-3 bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full transition-all duration-300"
              style={{ width: `${((currentSlideIndex + 1) / totalSlides) * 100}%` }}
            />
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            {currentSlideIndex + 1} / {totalSlides}
          </p>
        </div>

        <nav className="space-y-2">
          {sections.map((section) => {
            const isActiveSection = section.id === currentSection;

            return (
              <div key={section.id} className="space-y-1">
                <button
                  onClick={() => onNavigate(section.id, section.slides[0].id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                    isActiveSection
                      ? 'bg-zinc-800 text-white'
                      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                  }`}
                >
                  <span className="text-xl">{section.icon}</span>
                  <span className="font-medium">{section.title}</span>
                </button>

                {isActiveSection && (
                  <div className="ml-4 pl-4 border-l border-zinc-700 space-y-1">
                    {section.slides.map((slide, index) => {
                      const isActiveSlide = slide.id === currentSlide;

                      return (
                        <button
                          key={slide.id}
                          onClick={() => onNavigate(section.id, slide.id)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 flex items-center gap-2 ${
                            isActiveSlide
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                            isActiveSlide
                              ? 'bg-blue-500 text-white'
                              : 'bg-zinc-700 text-zinc-400'
                          }`}>
                            {index + 1}
                          </span>
                          <span className="truncate flex-1">{slide.title}</span>
                          {slide.duration && (
                            <span className="text-xs text-zinc-600">{slide.duration}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-zinc-800">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            Klavye Kısayolları
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-zinc-400">
              <span>Sonraki slayt</span>
              <kbd className="px-2 py-1 bg-zinc-800 rounded text-xs">→</kbd>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Önceki slayt</span>
              <kbd className="px-2 py-1 bg-zinc-800 rounded text-xs">←</kbd>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Tam ekran</span>
              <kbd className="px-2 py-1 bg-zinc-800 rounded text-xs">F</kbd>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
