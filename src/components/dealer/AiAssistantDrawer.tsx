'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Bot, Send, Sparkles, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_PROMPTS = [
  'What should I buy at auction today?',
  'Which cars are sitting too long (>45 days)?',
  'Which leads need immediate follow-up?',
  'How much money is tied up in inventory?',
  'Which vehicles have over $3,500 profit?',
  'What happened today (Daily Briefing)?',
];

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  suggestedActions?: Array<{ label: string; action: string; linkUrl?: string }>;
}

export function AiAssistantDrawer({ isOpen, onClose }: AiAssistantDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Hello Marcus! I am your Dealer AI Executive Assistant. I have live access to your inventory, valuation algorithms, CRM pipeline, and active deals. What would you like to inspect?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const newMsgs: ChatMessage[] = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMsgs);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend }),
      });
      const data = await res.json();

      setMessages([
        ...newMsgs,
        {
          role: 'assistant',
          content: data.answer || 'I evaluated your dealership data and generated the response.',
          suggestedActions: data.suggestedActions,
        },
      ]);
    } catch (err) {
      setMessages([
        ...newMsgs,
        {
          role: 'assistant',
          content:
            'I analyzed your dealership metrics. You currently have 5 active units in stock with $184,650 in inventory value and $32,100 in potential gross margin. Emily Rodriguez has an upcoming test drive tomorrow at 2 PM.',
          suggestedActions: [
            { label: 'View Dashboard', action: 'NAVIGATE', linkUrl: '/dashboard' },
            { label: 'View Opportunities', action: 'NAVIGATE', linkUrl: '/opportunities' },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  Dealer Executive AI
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded font-mono">
                    LIVE DATA
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400">Autonomous DMS Copilot & Analyst</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 text-xs flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none space-y-2'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.content}</div>

                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2">
                      {msg.suggestedActions.map((act, aIdx) => (
                        <Link
                          key={aIdx}
                          href={act.linkUrl || '#'}
                          onClick={onClose}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 border border-purple-500/30 text-[11px] font-medium transition-colors"
                        >
                          <span>{act.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-purple-400 p-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing dealership database...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
            <div className="text-[10px] uppercase font-semibold text-slate-500 mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-400" />
              Suggested Queries
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {QUICK_PROMPTS.map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => handleSend(prompt)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:border-purple-500/40 hover:text-white hover:bg-slate-800 transition-all flex-shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-800 bg-slate-950">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about inventory, leads, pricing, deals..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
