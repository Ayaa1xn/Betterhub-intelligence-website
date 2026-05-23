import { ArrowUpRight, Bot, SendHorizontal, Sparkles, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSiteContent } from '../context/SiteContentContext';
import {
  ASSISTANT_SUGGESTIONS,
  answerKnowledgeQuery,
  buildKnowledgeChunks,
  type KnowledgeMatch,
} from '../lib/assistantKnowledge';

interface SiteAssistantProps {
  onNavigate: (path: string) => void;
}

interface AssistantMessage {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  matches?: KnowledgeMatch[];
}

export default function SiteAssistant({ onNavigate }: SiteAssistantProps) {
  const { content } = useSiteContent();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesViewportRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: 'Hello. Ask me about BetterHub services, products, careers, contact details, or blog posts.',
    },
  ]);

  const knowledgeChunks = useMemo(() => buildKnowledgeChunks(content), [content]);

  useEffect(() => {
    const viewport = messagesViewportRef.current;
    if (!viewport) {
      return;
    }

    window.requestAnimationFrame(() => {
      viewport.scrollTop = viewport.scrollHeight;
    });
  }, [messages, isOpen]);

  const askQuestion = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed) {
      return;
    }

    const reply = answerKnowledgeQuery(knowledgeChunks, trimmed);
    setMessages((current) => [
      ...current,
      {
        id: `user-${createMessageId()}`,
        role: 'user',
        text: trimmed,
      },
      {
        id: `assistant-${createMessageId()}`,
        role: 'assistant',
        text: reply.lead,
        matches: reply.matches,
      },
    ]);
    setInput('');
    setIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="group fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full border border-cyan-300/35 bg-slate-950 text-white shadow-[0_24px_80px_-28px_rgba(15,23,42,0.55)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_90px_-26px_rgba(34,197,94,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        aria-label="Open BetterHub assistant"
      >
        <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top_left,_rgba(52,211,153,0.95),_rgba(59,130,246,0.98)_55%,_rgba(15,23,42,1)_100%)] text-white shadow-lg shadow-blue-900/35">
          <span className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md transition group-hover:bg-emerald-400/25" />
          <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400 motion-safe:animate-pulse" />
          <Bot className="relative h-5 w-5" />
        </span>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 left-4 right-4 z-50 flex h-[min(72vh,34rem)] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-2xl shadow-slate-900/15 sm:left-auto sm:right-6 sm:w-[25rem] dark:border-slate-800 dark:bg-slate-950">
          <div className="border-b border-slate-200 bg-slate-950 px-5 py-4 text-white dark:border-slate-800">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="rounded-2xl bg-blue-500/15 p-2.5 text-blue-300">
                  <Bot className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-black">BetterHub Assistant</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-blue-200/90">
                    Ask about the website
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Close assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div
            ref={messagesViewportRef}
            aria-live="polite"
            className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            {messages.map((message, index) => (
              <div
                key={message.id}
                className="space-y-3"
              >
                <div className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <div
                    className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-7 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200'
                    }`}
                  >
                    <p>{message.text}</p>

                    {message.matches?.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.matches.map((match) => (
                          <button
                            key={match.id}
                            type="button"
                            onClick={() => {
                              if (match.path) {
                                onNavigate(match.path);
                              }
                            }}
                            className={`inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-2 text-left text-[11px] font-bold uppercase tracking-[0.12em] transition ${
                              match.path
                                ? 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-700 dark:hover:bg-slate-800 dark:hover:text-blue-300'
                                : 'border-slate-200/80 bg-slate-50/60 text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400'
                            }`}
                            disabled={!match.path}
                          >
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                              {match.category}
                            </span>
                            <span className="truncate">{match.title}</span>
                            {match.path ? (
                              <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
                            ) : null}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                {index === 0 ? (
                  <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      Quick start
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {ASSISTANT_SUGGESTIONS.map((question) => (
                        <button
                          key={question}
                          type="button"
                          onClick={() => askQuestion(question)}
                          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-left text-[11px] font-bold uppercase tracking-[0.14em] text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-blue-700 dark:hover:bg-slate-800 dark:hover:text-blue-300"
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 px-4 py-4 dark:border-slate-800">
            <div className="flex items-center gap-2 rounded-[1.25rem] border border-slate-200 bg-slate-50 px-3 py-2.5 dark:border-slate-700 dark:bg-slate-900">
              <Sparkles className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-300" />
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    askQuestion(input);
                  }
                }}
                placeholder="Ask about services, products, hiring, or contact..."
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={() => askQuestion(input)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-700"
                aria-label="Send assistant question"
              >
                <SendHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function createMessageId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
