'use client';

import { Slide, SlideContent as SlideContentType } from '@/data/presentationData';

interface SlideContentProps {
  slide: Slide;
  sectionTitle: string;
  sectionIcon: string;
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  return (
    <div className="relative group">
      {language && (
        <div className="absolute top-0 right-0 px-3 py-1 bg-zinc-700 text-zinc-300 text-xs rounded-bl-lg rounded-tr-lg">
          {language}
        </div>
      )}
      <pre className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 overflow-x-auto">
        <code className="text-sm text-zinc-300 font-mono whitespace-pre">
          {code}
        </code>
      </pre>
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
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 overflow-x-auto">
      <pre className="text-sm text-green-400 font-mono whitespace-pre leading-relaxed">
        {content}
      </pre>
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
