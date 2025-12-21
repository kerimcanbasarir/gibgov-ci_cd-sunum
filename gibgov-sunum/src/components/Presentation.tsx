'use client';

import { useState, useEffect, useCallback } from 'react';
import { presentationData, Section, Slide } from '@/data/presentationData';
import Sidebar from './Sidebar';
import SlideContent from './SlideContent';

interface CurrentPosition {
  sectionIndex: number;
  slideIndex: number;
}

function getAllSlides(): { section: Section; slide: Slide; globalIndex: number }[] {
  const allSlides: { section: Section; slide: Slide; globalIndex: number }[] = [];
  let globalIndex = 0;

  presentationData.forEach((section) => {
    section.slides.forEach((slide) => {
      allSlides.push({ section, slide, globalIndex });
      globalIndex++;
    });
  });

  return allSlides;
}

export default function Presentation() {
  const [position, setPosition] = useState<CurrentPosition>({
    sectionIndex: 0,
    slideIndex: 0,
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const allSlides = getAllSlides();
  const currentSection = presentationData[position.sectionIndex];
  const currentSlide = currentSection.slides[position.slideIndex];

  const getCurrentGlobalIndex = useCallback(() => {
    let index = 0;
    for (let i = 0; i < position.sectionIndex; i++) {
      index += presentationData[i].slides.length;
    }
    return index + position.slideIndex;
  }, [position]);

  const navigateToGlobalIndex = useCallback((globalIndex: number) => {
    let remaining = globalIndex;
    for (let sectionIndex = 0; sectionIndex < presentationData.length; sectionIndex++) {
      const section = presentationData[sectionIndex];
      if (remaining < section.slides.length) {
        setPosition({ sectionIndex, slideIndex: remaining });
        return;
      }
      remaining -= section.slides.length;
    }
  }, []);

  const goToNext = useCallback(() => {
    const currentGlobal = getCurrentGlobalIndex();
    if (currentGlobal < allSlides.length - 1) {
      navigateToGlobalIndex(currentGlobal + 1);
    }
  }, [getCurrentGlobalIndex, navigateToGlobalIndex, allSlides.length]);

  const goToPrev = useCallback(() => {
    const currentGlobal = getCurrentGlobalIndex();
    if (currentGlobal > 0) {
      navigateToGlobalIndex(currentGlobal - 1);
    }
  }, [getCurrentGlobalIndex, navigateToGlobalIndex]);

  const handleNavigate = useCallback((sectionId: string, slideId: string) => {
    const sectionIndex = presentationData.findIndex((s) => s.id === sectionId);
    if (sectionIndex !== -1) {
      const slideIndex = presentationData[sectionIndex].slides.findIndex(
        (s) => s.id === slideId
      );
      if (slideIndex !== -1) {
        setPosition({ sectionIndex, slideIndex });
      }
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'Home') {
        e.preventDefault();
        navigateToGlobalIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        navigateToGlobalIndex(allSlides.length - 1);
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [goToNext, goToPrev, toggleFullscreen, navigateToGlobalIndex, allSlides.length]);

  const currentGlobalIndex = getCurrentGlobalIndex();

  return (
    <div className="relative">
      <SlideContent
        slide={currentSlide}
        sectionTitle={currentSection.title}
        sectionIcon={currentSection.icon}
      />

      {!isFullscreen && (
        <Sidebar
          sections={presentationData}
          currentSection={currentSection.id}
          currentSlide={currentSlide.id}
          onNavigate={handleNavigate}
          currentSlideIndex={currentGlobalIndex}
        />
      )}

      {/* Navigation Buttons */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50" style={{ marginLeft: isFullscreen ? '0' : '160px' }}>
        <button
          onClick={goToPrev}
          disabled={currentGlobalIndex === 0}
          className="w-12 h-12 rounded-full bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="px-4 py-2 bg-zinc-800 rounded-full text-zinc-300 text-sm">
          {currentGlobalIndex + 1} / {allSlides.length}
        </div>

        <button
          onClick={goToNext}
          disabled={currentGlobalIndex === allSlides.length - 1}
          className="w-12 h-12 rounded-full bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button
          onClick={toggleFullscreen}
          className="w-12 h-12 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white transition-all ml-4"
          title="Tam Ekran (F)"
        >
          {isFullscreen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9L4 4m0 0v5m0-5h5m11 5l-5-5m5 0v5m0-5h-5M9 15l-5 5m0 0v-5m0 5h5m11-5l-5 5m5 0v-5m0 5h-5" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
