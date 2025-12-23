'use client';

import { Highlight, themes } from 'prism-react-renderer';
import { Slide, SlideContent as SlideContentType } from '@/data/presentationData';

interface SlideContentProps {
  slide: Slide;
  sectionTitle: string;
  sectionIcon: string;
}

// Desteklenmeyen dilleri desteklenen dillere map et
const languageMap: Record<string, string> = {
  dockerfile: 'bash',
  toml: 'yaml',
  shell: 'bash',
  sh: 'bash',
};

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const inputLang = language || 'typescript';
  const lang = languageMap[inputLang] || inputLang;

  return (
    <div className="relative group">
      {language && (
        <div className="absolute top-0 right-0 px-3 py-1 bg-zinc-700 text-zinc-300 text-xs rounded-bl-lg rounded-tr-lg z-10">
          {language}
        </div>
      )}
      <Highlight theme={themes.nightOwl} code={code.trim()} language={lang}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 overflow-x-auto"
            style={{ ...style, background: 'rgb(24 24 27)' }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} className="table-row">
                <span className="table-cell text-zinc-600 pr-4 select-none text-right text-xs">
                  {i + 1}
                </span>
                <span className="table-cell">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-zinc-800/50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3 text-zinc-300">
            <span className="text-blue-400 mt-1">&#8226;</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ComparisonBlock({
  title,
  columns
}: {
  title: string;
  columns: { title: string; items: string[] }[]
}) {
  return (
    <div className="bg-zinc-800/30 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 text-center">{title}</h3>
      <div className="grid grid-cols-2 gap-6">
        {columns.map((column, colIndex) => (
          <div
            key={colIndex}
            className={`rounded-lg p-4 ${
              colIndex === 0
                ? 'bg-blue-500/10 border border-blue-500/30'
                : 'bg-purple-500/10 border border-purple-500/30'
            }`}
          >
            <h4 className={`font-semibold mb-3 ${
              colIndex === 0 ? 'text-blue-400' : 'text-purple-400'
            }`}>
              {column.title}
            </h4>
            <ul className="space-y-2">
              {column.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-2 text-sm text-zinc-300">
                  <span className={colIndex === 0 ? 'text-blue-400' : 'text-purple-400'}>
                    &#10003;
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function DiagramBlock({ content }: { content: string }) {
  return (
    <div className="relative rounded-2xl overflow-hidden">
      {/* CRT Monitor Frame */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-900 rounded-2xl" />
      <div className="absolute inset-1 bg-gradient-to-b from-zinc-800 to-zinc-950 rounded-xl" />

      {/* Screen bezel */}
      <div className="relative m-2 rounded-xl overflow-hidden">
        {/* Screen background with vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, #001a00 0%, #000800 70%, #000000 100%)',
          }}
        />

        {/* Scanlines overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.3) 2px, rgba(0, 0, 0, 0.3) 4px)',
          }}
        />

        {/* Screen glow */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            background: 'radial-gradient(ellipse at center, #00ff00 0%, transparent 70%)',
          }}
        />

        {/* Content */}
        <div className="relative p-6 overflow-x-auto">
          <pre
            className="text-sm font-mono whitespace-pre leading-relaxed"
            style={{
              color: '#00ff41',
              textShadow: '0 0 5px #00ff41, 0 0 10px #00ff41, 0 0 20px #00aa2a',
              fontFamily: '"Courier New", "Lucida Console", Monaco, monospace',
            }}
          >
            {content}
          </pre>
        </div>

        {/* Screen reflection */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%, transparent 100%)',
          }}
        />
      </div>

      {/* Monitor stand indicator / power LED */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
      </div>
    </div>
  );
}

function HighlightBlock({ content }: { content: string }) {
  return (
    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-4 flex items-center gap-3">
      <span className="text-2xl">💡</span>
      <p className="text-yellow-200 font-medium">{content}</p>
    </div>
  );
}

function TextBlock({ content }: { content: string }) {
  return (
    <p className="text-lg text-zinc-300 leading-relaxed">{content}</p>
  );
}

function renderContent(content: SlideContentType) {
  switch (content.type) {
    case 'code':
      return <CodeBlock code={content.content} language={content.language} />;
    case 'list':
      return <ListBlock title={content.content} items={content.items || []} />;
    case 'comparison':
      return <ComparisonBlock title={content.content} columns={content.columns || []} />;
    case 'diagram':
      return <DiagramBlock content={content.content} />;
    case 'highlight':
      return <HighlightBlock content={content.content} />;
    case 'text':
    default:
      return <TextBlock content={content.content} />;
  }
}

export default function SlideContent({ slide, sectionTitle, sectionIcon }: SlideContentProps) {
  return (
    <div className="min-h-screen pl-80 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <div className="max-w-5xl mx-auto px-12 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-zinc-500 text-sm mb-2">
            <span>{sectionIcon}</span>
            <span>{sectionTitle}</span>
            {slide.duration && (
              <>
                <span className="mx-2">•</span>
                <span>{slide.duration}</span>
              </>
            )}
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">{slide.title}</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
        </div>

        <div className="space-y-6">
          {slide.content.map((content, index) => (
            <div key={index} className="animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>
              {renderContent(content)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
