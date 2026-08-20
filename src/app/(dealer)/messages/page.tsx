'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Bot,
  Send,
  Sparkles,
  User,
  Car,
  DollarSign,
  Calendar,
  FileCheck2,
  Phone,
  Mail,
  Loader2,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency, formatNumber, formatDateTime } from '@/lib/utils';
import { StatusBadge } from '@/components/dealer/StatusBadge';

interface Message {
  id: string;
  senderType: string;
  senderName: string;
  content: string;
  metadataJson?: string | null;
  createdAt: string | Date;
}

interface Conversation {
  id: string;
  buyerName: string;
  buyerPhone?: string | null;
  buyerEmail?: string | null;
  channel: string;
  status: string;
  leadScore: number;
  lastMessageAt: string | Date;
  vehicle?: {
    id: string;
    year: number;
    make: string;
    model: string;
    trim?: string | null;
    stockNumber: string;
    askingPrice: number;
    preferredPrice: number;
    minPrice: number;
    mileage: number;
    photos?: Array<{ url: string }>;
  } | null;
  messages?: Message[];
  lead?: {
    id: string;
    stage: string;
    currentOffer?: number | null;
  } | null;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [simulatingBuyer, setSimulatingBuyer] = useState(false);
  const [buyerSimInput, setBuyerSimInput] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConvId) {
      fetchConversationDetails(activeConvId);
    }
  }, [activeConvId]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data: Conversation[] = await res.json();
        setConversations(data);
        if (data.length > 0 && !activeConvId) {
          setActiveConvId(data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchConversationDetails = async (id: string) => {
    try {
      const res = await fetch(`/api/messages?conversationId=${id}`);
      if (res.ok) {
        const data: Conversation = await res.json();
        setActiveConversation(data);
      }
    } catch (err) {
      console.error('Failed to fetch conversation details:', err);
    }
  };

  const handleSendReply = async (senderType = 'DEALER_USER', textToSend?: string) => {
    const text = textToSend || replyText;
    if (!text.trim() || !activeConversation) return;

    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConversation.id,
          vehicleId: activeConversation.vehicle?.id,
          buyerName: activeConversation.buyerName,
          senderType,
          content: text,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setActiveConversation(data.conversation);
        setReplyText('');
        fetchConversations();
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleSimulateBuyerMessage = async () => {
    if (!buyerSimInput.trim() || !activeConversation) return;
    setSimulatingBuyer(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConversation.id,
          vehicleId: activeConversation.vehicle?.id,
          buyerName: activeConversation.buyerName,
          senderType: 'BUYER',
          content: buyerSimInput,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setActiveConversation(data.conversation);
        setBuyerSimInput('');
        fetchConversations();
      }
    } catch (err) {
      console.error('Buyer simulation error:', err);
    } finally {
      setSimulatingBuyer(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-400" />
            Unified Buyer Inbox & AI Sales Agent
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous multi-channel negotiation desk adhering strictly to dealer price boundaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-purple-500/15 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-purple-400" />
            <span>AI Sales Agent: Active</span>
          </span>
        </div>
      </div>

      {/* Main Inbox Workspace (Dual Pane) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-md overflow-hidden grid grid-cols-1 lg:grid-cols-12 h-[680px]">
        {/* Left Pane: Conversation List (4 Cols) */}
        <div className="lg:col-span-4 border-r border-slate-800 flex flex-col h-full bg-slate-950/40">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Conversations ({conversations.length})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {conversations.map((conv) => {
              const isSelected = conv.id === activeConvId;
              const lastMsg = conv.messages?.[0];
              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full text-left p-4 space-y-1.5 transition-all ${
                    isSelected
                      ? 'bg-emerald-500/10 border-l-4 border-emerald-500'
                      : 'hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{conv.buyerName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {formatDateTime(conv.lastMessageAt)}
                    </span>
                  </div>

                  <div className="text-[11px] text-emerald-400 font-medium">
                    {conv.vehicle ? `${conv.vehicle.year} ${conv.vehicle.make} ${conv.vehicle.model}` : 'Inventory'}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1">
                    {lastMsg ? lastMsg.content : 'No messages yet'}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                      {conv.channel}
                    </span>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono font-bold">
                      Score: {conv.leadScore}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Active Conversation & Negotiation Desk (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col h-full bg-slate-900/50">
          {activeConversation ? (
            <>
              {/* Header Bar: Buyer & Vehicle Context */}
              <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-white">{activeConversation.buyerName}</h2>
                    <StatusBadge status={activeConversation.lead?.stage || 'QUALIFIED'} />
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                    {activeConversation.buyerPhone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-500" /> {activeConversation.buyerPhone}
                      </span>
                    )}
                    {activeConversation.buyerEmail && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-500" /> {activeConversation.buyerEmail}
                      </span>
                    )}
                  </div>
                </div>

                {/* Pricing Bounds & Quick Actions */}
                {activeConversation.vehicle && (
                  <div className="flex items-center gap-3 text-xs">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-right">
                      <div className="text-[10px] text-slate-500 uppercase">Asking / Min Floor</div>
                      <div className="font-bold text-white font-mono">
                        {formatCurrency(activeConversation.vehicle.askingPrice)} /{' '}
                        <span className="text-rose-400 font-semibold">
                          {formatCurrency(activeConversation.vehicle.minPrice)}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/deals?vehicleId=${activeConversation.vehicle.id}&buyerName=${encodeURIComponent(activeConversation.buyerName)}`}
                      className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Start Deal</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Chat Message Transcript */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {activeConversation.messages?.map((msg) => {
                  const isBuyer = msg.senderType === 'BUYER';
                  const isAi = msg.senderType === 'AI_SALES_AGENT';

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${isBuyer ? 'justify-start' : 'justify-end'}`}
                    >
                      {isBuyer && (
                        <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                          {msg.senderName.slice(0, 1).toUpperCase()}
                        </div>
                      )}

                      <div
                        className={`max-w-[75%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-1 ${
                          isBuyer
                            ? 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
                            : isAi
                            ? 'bg-purple-950/40 border border-purple-500/30 text-purple-100 rounded-tr-none'
                            : 'bg-emerald-600 text-white rounded-tr-none'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-[10px] font-bold ${
                              isBuyer ? 'text-slate-400' : isAi ? 'text-purple-300' : 'text-emerald-200'
                            }`}
                          >
                            {msg.senderName}
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono">
                            {formatDateTime(msg.createdAt)}
                          </span>
                        </div>
                        <p className="whitespace-pre-line">{msg.content}</p>
                      </div>

                      {!isBuyer && isAi && (
                        <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Simulation Strip: Allows tester to type a message as the BUYER to test AI instant negotiation! */}
              <div className="p-2.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center gap-2">
                <span className="text-[10px] font-bold text-amber-400 font-mono uppercase whitespace-nowrap">
                  Simulate Buyer Message:
                </span>
                <input
                  type="text"
                  placeholder="e.g. Will you take $23,000 cash? or Can I test drive tomorrow at 3pm?"
                  value={buyerSimInput}
                  onChange={(e) => setBuyerSimInput(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={handleSimulateBuyerMessage}
                  disabled={simulatingBuyer || !buyerSimInput.trim()}
                  className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs transition-colors disabled:opacity-50"
                >
                  {simulatingBuyer ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Send as Buyer'}
                </button>
              </div>

              {/* Staff Manual Reply Input */}
              <div className="p-3 border-t border-slate-800 bg-slate-950">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendReply('DEALER_USER');
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="Type manual response as dealership staff..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={sending || !replyText.trim()}
                    className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              Select a conversation to inspect buyer history and AI negotiation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
