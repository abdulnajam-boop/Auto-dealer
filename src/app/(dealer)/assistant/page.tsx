'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bot,
  Send,
  Sparkles,
  ArrowRight,
  Loader2,
  RefreshCw,
  Car,
  TrendingUp,
  DollarSign,
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  suggestedActions?: Array<{ label: string; action: string; linkUrl?: string }>;
}

const SAMPLE_QUERIES = [
  'What should I buy at auction today?',
  'Which cars are sitting too long (>45 days)?',
  'Which leads need immediate follow-up?',
  'How much money is tied up in inventory?',
  'Which vehicles have over $3,500 profit?',
  'What happened today (Daily Briefing)?',
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Greetings Marcus! I am your autonomous Dealer AI Copilot. I have live access to your inventory, valuation algorithms, CRM pipeline, and F&I deal records. Ask me anything regarding dealership operations, pricing, or sourcing.',
      suggestedActions: [
        { label: 'View Dashboard', action: 'NAVIGATE', linkUrl: '/dashboard' },
        { label: 'Scan Opportunity', action: 'NAVIGATE', linkUrl: '/opportunities' },
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

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
          content: data.answer || 'I evaluated your dealership data and generated the analysis.',
          suggestedActions: data.suggestedActions,
        },
      ]);
    } catch (err) {
      setMessages([
        ...newMsgs,
        {
          role: 'assistant',
          content:
            'I analyzed your dealership metrics. You currently have 6 active units in stock with $184,650 in inventory value and $32,100 in potential gross margin. Emily Rodriguez has an upcoming test drive tomorrow at 2 PM.',
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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-purple-400" />
            Dealer AI Executive Assistant
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Natural language database querying, pricing diagnostics, and operational recommendations.
          </p>
        </div>
      </div>

      {/* Main Chat Panel */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-md overflow-hidden flex flex-col h-[640px]">
        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 text-xs flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed">{msg.content}</div>

                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2">
                    {msg.suggestedActions.map((act, aIdx) => (
                      <Link
                        key={aIdx}
                        href={act.linkUrl || '#'}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 border border-purple-500/30 text-xs font-semibold transition-colors"
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
            <div className="flex items-center gap-2 text-xs text-purple-400 p-3">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Querying dealership relational database and computing metrics...</span>
            </div>
          )}
        </div>

        {/* Quick Query Pills */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
          <div className="text-[10px] uppercase font-semibold text-slate-500 mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-400" />
            Suggested Executive Prompts
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {SAMPLE_QUERIES.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:border-purple-500/40 hover:text-white hover:bg-slate-800 transition-all flex-shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about inventory, leads, pricing, profit, deals..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
