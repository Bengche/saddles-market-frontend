"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, ChevronRight, RotateCcw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";

interface ProductResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_price: number | null;
  discipline: string | null;
  condition: string | null;
  image_url: string | null;
  brand: string | null;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  products?: ProductResult[];
}

const GREETING: Message = {
  id: "greeting",
  role: "assistant",
  text: "Hello! I'm Sterling, your personal equestrian advisor at Saddles Market. I can help you find the perfect saddle, answer questions about fit, pricing, our 30-day trial, and more — all based on what we actually have available. What are you looking for today?",
};

const QUICK_PROMPTS = [
  "What western saddles do you have?",
  "How does the 30-day trial work?",
  "Do you have dressage saddles?",
  "Tell me about free shipping",
];

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3.5">
        <div className="flex gap-1.5 items-center">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.18}s`,
                animationDuration: "0.9s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  onClose,
}: {
  product: ProductResult;
  onClose: () => void;
}) {
  const discount =
    product.compare_price && product.compare_price > product.price
      ? Math.round(
          ((product.compare_price - product.price) / product.compare_price) *
            100,
        )
      : 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      onClick={onClose}
      className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-2.5 hover:border-primary-200 hover:shadow-md transition-all group cursor-pointer"
    >
      <div className="w-[52px] h-[52px] rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="52px"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
        )}
        {discount > 0 && (
          <span className="absolute top-0.5 left-0.5 bg-red-500 text-white text-[8px] font-bold px-1 rounded">
            -{discount}%
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-snug">
          {product.name}
        </p>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-sm font-bold text-primary-600">
            $
            {product.price.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          {product.compare_price && (
            <span className="text-[10px] text-gray-400 line-through">
              $
              {product.compare_price.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          )}
        </div>
        {product.discipline && (
          <span className="text-[10px] text-gray-400 capitalize">
            {product.discipline.replace(/_/g, " ")}
          </span>
        )}
      </div>

      <ChevronRight
        size={14}
        className="text-gray-300 group-hover:text-primary-400 flex-shrink-0 transition-colors"
      />
    </Link>
  );
}

export default function AiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, isOpen]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;
      setError(null);

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        text: text.trim(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);
      setHasInteracted(true);

      // Build history (skip greeting, cap at 8 turns)
      const history = messages
        .filter((m) => m.id !== "greeting")
        .slice(-8)
        .map((m) => ({ role: m.role, content: m.text }));

      try {
        const res = await api.post("/api/chat", {
          message: text.trim(),
          history,
        });
        const aiMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          text: res.data.reply,
          products:
            res.data.products?.length > 0 ? res.data.products : undefined,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch {
        setError("Something went wrong. Please try again.");
        // Remove the user message on error so they can retry
        setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
      } finally {
        setLoading(false);
      }
    },
    [messages, loading],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleReset = () => {
    setMessages([GREETING]);
    setHasInteracted(false);
    setError(null);
    setInput("");
  };

  return (
    <>
      {/* ── Chat Panel ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            key="chat-panel"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-[88px] right-4 sm:right-6 z-50 flex flex-col bg-white rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.18)] overflow-hidden"
            style={{
              width: "min(400px, calc(100vw - 2rem))",
              height: "min(580px, calc(100svh - 110px))",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 px-5 py-3.5 bg-[#0f2340] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#C4A862]/15 border border-[#C4A862]/30 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={15} className="text-[#C4A862]" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm leading-none">
                    Sterling
                  </p>
                  <p className="text-white/40 text-[11px] mt-0.5 tracking-wide">
                    Equestrian AI Advisor
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
                <button
                  onClick={handleReset}
                  title="New conversation"
                  className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
                  aria-label="Close chat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50/60">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`space-y-2 ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}
                      style={{ maxWidth: "88%" }}
                    >
                      {/* Bubble */}
                      <div
                        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "bg-[#1C3557] text-white rounded-br-sm"
                            : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm"
                        }`}
                      >
                        {msg.text}
                      </div>

                      {/* Product cards */}
                      {msg.products && msg.products.length > 0 && (
                        <div className="w-full space-y-2">
                          {msg.products.map((p) => (
                            <ProductCard
                              key={p.id}
                              product={p}
                              onClose={() => setIsOpen(false)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <TypingIndicator />
                </motion.div>
              )}

              {/* Error */}
              {error && (
                <p className="text-xs text-red-500 text-center px-2">{error}</p>
              )}

              {/* Quick prompts — shown only before first interaction */}
              {!hasInteracted && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pt-2"
                >
                  <p className="text-[11px] text-gray-400 text-center mb-2.5 tracking-wide uppercase font-medium">
                    Quick questions
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {QUICK_PROMPTS.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="text-[11px] px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-[#1C3557]/30 hover:text-[#1C3557] hover:bg-[#1C3557]/5 transition-colors shadow-sm font-medium"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 px-3 pt-2.5 pb-3 border-t border-gray-100 bg-white">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 focus-within:border-[#1C3557]/40 focus-within:ring-2 focus-within:ring-[#1C3557]/10 transition-all">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about saddles, sizing, shipping…"
                    className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
                    disabled={loading}
                    maxLength={500}
                    autoComplete="off"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-9 h-9 rounded-xl bg-[#1C3557] flex items-center justify-center text-white disabled:opacity-35 disabled:cursor-not-allowed hover:bg-[#16293f] active:scale-95 transition-all flex-shrink-0"
                  aria-label="Send message"
                >
                  <Send size={15} />
                </button>
              </form>
              <p className="text-[10px] text-gray-300 text-center mt-2 tracking-wide">
                Powered by Saddles Market AI · Responses based on live inventory
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Trigger ─────────────────────────────────────────────────── */}
      <motion.button
        key="chat-trigger"
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-5 right-4 sm:right-6 z-50 flex items-center gap-2.5 bg-[#0f2340] hover:bg-[#16293f] text-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.22)] transition-colors overflow-hidden"
        style={{ padding: isOpen ? "11px 16px" : "11px 20px" }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.96 }}
        aria-label={isOpen ? "Close AI chat" : "Open AI chat"}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={18} />
            </motion.span>
          ) : (
            <motion.span
              key="spark"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Sparkles size={18} className="text-[#C4A862]" />
            </motion.span>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {!isOpen && (
            <motion.span
              key="label"
              initial={{ opacity: 0, maxWidth: 0 }}
              animate={{ opacity: 1, maxWidth: 120 }}
              exit={{ opacity: 0, maxWidth: 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-semibold whitespace-nowrap overflow-hidden tracking-wide"
            >
              Ask Sterling
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
