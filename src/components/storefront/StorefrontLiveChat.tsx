'use client';

import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

interface StorefrontLiveChatProps {
  vehicleId?: string;
  vehicleName?: string;
}

export function StorefrontLiveChat({ vehicleId, vehicleName }: StorefrontLiveChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'buyer' | 'agent'; text: string; time: string }>>([
    {
      sender: 'agent',
      text: `Hello! Welcome to Apex Auto Gallery. I am Alex, your 24/7 AI Sales Concierge.${
        vehicleName ? ` Are you interested in the ${vehicleName}?` : ' How can I assist your car search today?'
      }`,
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [hasProvidedContact, setHasProvidedContact] = useState(false);
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { sender: 'buyer', text: userText, time: now }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          vehicleId,
          buyerName: buyerName || 'Storefront Visitor',
          buyerPhone: buyerPhone || undefined,
          channel: 'STOREFRONT_CHAT',
          content: userText,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setConversationId(data.conversation?.id || null);

        // Find the last agent reply
        const allMsgs = data.conversation?.messages || [];
        const latestAgentMsg = allMsgs
          .filter((m: any) => m.senderType === 'AI_SALES_AGENT')
          .slice(-1)[0];

        if (latestAgentMsg) {
          setMessages((prev) => [
            ...prev,
            {
              sender: 'agent',
              text: latestAgentMsg.content,
              time: new Date(latestAgentMsg.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
            },
          ]);
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs shadow-2xl shadow-emerald-500/30 hover:scale-105 transition-all group"
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
            </div>
            <span>Chat with Sales Concierge</span>
          </button>
        ) : (
          <div className="w-[360px] sm:w-[400px] h-[520px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn glass-panel">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-slate-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    Alex • Apex AI Sales Concierge
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  </h3>
                  <span className="text-[10px] text-slate-400">Instant answers, offers &amp; test drives</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Contact Form (if not filled) */}
            {!hasProvidedContact && (
              <div className="p-3 bg-slate-950/90 border-b border-slate-800 text-xs space-y-2">
                <span className="text-[11px] text-slate-400 font-semibold">
                  Get instant VIP pricing &amp; test drive confirmation:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="Cell Phone"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${
                    msg.sender === 'buyer' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      msg.sender === 'buyer'
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.time}</span>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 p-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  <span>Alex is typing...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Ask a question or make an offer..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
