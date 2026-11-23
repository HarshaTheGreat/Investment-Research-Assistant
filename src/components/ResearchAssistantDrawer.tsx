import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, RotateCcw, Send, X } from 'lucide-react';
import { askResearchAssistant } from '../services/aiAssistantService';
import { AssistantMessage, TickerSymbol } from '../types/financial';

interface ResearchAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTicker?: TickerSymbol;
  initialPrompt?: string | null;
  onClearInitialPrompt?: () => void;
}

const EXAMPLE_QUESTIONS: { category: string; label: string; prompt: string }[] = [
  {
    category: 'Terms',
    label: 'Revenue vs. Net Income',
    prompt: 'What is the difference between revenue, gross profit, and net income?',
  },
  {
    category: 'Terms',
    label: 'What is EPS?',
    prompt: 'Explain Earnings Per Share (EPS) in simple language.',
  },
  {
    category: 'Terms',
    label: 'Cash Flow & Debt',
    prompt: 'How do Free Cash Flow and corporate debt affect a company?',
  },
  {
    category: 'Companies',
    label: 'NVIDIA performance',
    prompt: "Explain NVIDIA's financial performance using the dashboard data.",
  },
  {
    category: 'Companies',
    label: 'Microsoft overview',
    prompt: 'How does Microsoft make money and what are its main risks?',
  },
  {
    category: 'Compare',
    label: 'AMD vs. Walmart',
    prompt: 'Compare AMD and Walmart in simple language for a beginner.',
  },
];

function createWelcomeMessage(): AssistantMessage {
  return {
    id: 'welcome',
    role: 'assistant',
    title: 'ClearLedger Research Tutor',
    content: 'Ask any question about financial terms or our four sample companies.',
    sections: [
      {
        heading: 'What You Can Ask Me',
        bullets: [
          'Companies: AMD, NVIDIA (NVDA), Walmart (WMT), and Microsoft (MSFT) financial performance, segments, and risks.',
          'Financial Terms: Revenue, Gross Profit, Net Income, EPS, Operating & Free Cash Flow, Corporate Debt, and P/E Ratio.',
          'Comparisons: Why two companies have different revenue scales, profit margins, and cash flow profiles.',
        ],
      },
    ],
    dataNotice:
      'Educational Guide: All company figures cited come from ClearLedger’s illustrative sample dashboards, not verified real-time filings. I never give buy or sell advice.',
    timestamp: 'Ready',
  };
}

export const ResearchAssistantDrawer: React.FC<ResearchAssistantDrawerProps> = ({
  isOpen,
  onClose,
  activeTicker,
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const [focusTicker, setFocusTicker] = useState<TickerSymbol | 'ALL'>(activeTicker ?? 'ALL');
  const [messages, setMessages] = useState<AssistantMessage[]>([createWelcomeMessage()]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (activeTicker) {
      setFocusTicker(activeTicker);
    }
  }, [activeTicker]);

  const sendQuestion = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isThinking) return;

    const userMsg: AssistantMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      const response = await askResearchAssistant(
        trimmed,
        focusTicker === 'ALL' ? undefined : focusTicker
      );
      const botMsg: AssistantMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        title: response.title,
        content: response.text,
        sections: response.sections,
        dataNotice: response.dataNotice,
        relatedTicker: response.relatedTicker,
        timestamp: 'Educational Tutor',
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  useEffect(() => {
    if (isOpen && initialPrompt) {
      sendQuestion(initialPrompt);
      onClearInitialPrompt?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialPrompt]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="AI Financial Research Assistant"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0A1628]/50 backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside className="relative w-full max-w-lg bg-white h-full flex flex-col border-l border-slate-200 shadow-2xl z-10">
        {/* Header */}
        <div className="px-5 py-4 bg-[#0A1628] text-white flex items-center justify-between gap-4 border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#15803D] flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-white truncate">AI Financial Research Tutor</h2>
              <p className="text-xs text-slate-300 truncate">
                Plain-English Explanations · Illustrative Sample Data
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setMessages([createWelcomeMessage()])}
              title="Reset conversation"
              aria-label="Reset conversation"
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close AI Financial Research Tutor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Company Focus Selector + Educational Guardrail */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-slate-500">Company Focus:</span>
            <div className="flex flex-wrap items-center gap-1">
              {(['ALL', 'AMD', 'NVDA', 'WMT', 'MSFT'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFocusTicker(t)}
                  className={`px-2 py-0.5 text-[11px] font-mono font-semibold rounded transition-colors cursor-pointer ${
                    focusTicker === t
                      ? 'bg-[#0A1628] text-white'
                      : 'text-slate-600 hover:text-[#0A1628] hover:bg-slate-200/70'
                  }`}
                >
                  {t === 'ALL' ? 'General' : t}
                </button>
              ))}
            </div>
          </div>
          <div className="text-[11px] text-slate-500">
            Educational tool only · Distinguishes sample data from verified filings · No buy/sell advice
          </div>
        </div>

        {/* Messages Thread */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-[#F8FAFC]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              {msg.role === 'user' ? (
                <div className="max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed bg-[#0A1628] text-white">
                  {msg.content}
                </div>
              ) : (
                <div className="w-full bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                  {msg.title && (
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                      <h3 className="text-sm font-bold text-[#0A1628]">{msg.title}</h3>
                      {msg.relatedTicker && (
                        <span className="font-mono text-[11px] font-semibold text-[#15803D]">
                          {msg.relatedTicker}
                        </span>
                      )}
                    </div>
                  )}

                  {msg.sections && msg.sections.length > 0 ? (
                    <div className="space-y-3">
                      {msg.sections.map((sec, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <h4 className="text-xs font-bold text-[#0A1628]">{sec.heading}</h4>
                          {sec.body && (
                            <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed tabular-nums">
                              {sec.body}
                            </p>
                          )}
                          {sec.bullets && sec.bullets.length > 0 && (
                            <ul className="space-y-1.5 text-xs sm:text-[13px] text-slate-700 leading-relaxed tabular-nums">
                              {sec.bullets.map((b, bIdx) => (
                                <li key={bIdx} className="flex items-start gap-2">
                                  <span className="text-[#15803D] font-bold mt-0.5" aria-hidden="true">
                                    •
                                  </span>
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{msg.content}</p>
                  )}

                  {msg.dataNotice && (
                    <div className="pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed">
                      {msg.dataNotice}
                    </div>
                  )}
                </div>
              )}

              <span className="text-[11px] text-slate-400 mt-1 px-1">
                {msg.role === 'user' ? 'You' : 'ClearLedger Tutor'}
              </span>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-start">
              <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-500">
                Organizing plain-English explanation...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Clickable Example Questions */}
        <div className="px-5 pt-3 pb-2.5 border-t border-slate-200 bg-white">
          <div className="text-[11px] font-semibold text-slate-500 mb-2">
            Example Questions (Click to Ask)
          </div>
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLE_QUESTIONS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => sendQuestion(item.prompt)}
                className="px-2.5 py-1.5 text-xs font-medium text-[#0A1628] bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer whitespace-nowrap"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendQuestion(input);
          }}
          className="p-4 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              focusTicker !== 'ALL'
                ? `Ask about ${focusTicker}, EPS, cash flow, risks...`
                : 'Ask about AMD, NVDA, WMT, MSFT, or financial terms...'
            }
            aria-label="Ask a financial research question"
            className="flex-1 px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-[#0A1628] placeholder:text-slate-400 focus:outline-none focus:border-[#15803D] focus:bg-white"
          />
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="px-4 py-2.5 bg-[#15803D] hover:bg-[#166534] disabled:opacity-40 text-white text-sm font-medium rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer shrink-0"
            aria-label="Send question"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </aside>
    </div>
  );
};
