'use client'

import { useEffect, useRef, useState } from 'react'
import { Send, Bot, User, Sparkles, Cpu, Wifi } from 'lucide-react'
import { PRODUCTS } from '@/lib/data'
import { cn } from '@/lib/utils'

type Source = 'NIM Assistant' | 'Edge Fallback'

type Message = {
  id: number
  role: 'user' | 'assistant'
  text: string
  source?: Source
  latency?: number
}

const SUGGESTIONS = ['Where is Maggi?', 'Store hours?', 'Do you take UPI?', 'Where is Amul Milk?']

function answer(query: string): { text: string; source: Source; latency: number } {
  const q = query.toLowerCase()

  const product = PRODUCTS.find((p) => {
    const first = p.name.toLowerCase().split(' ')[0]
    return q.includes(p.name.toLowerCase()) || q.includes(first)
  })

  if (product && (q.includes('where') || q.includes('find') || q.includes('aisle'))) {
    return {
      text: `${product.name} is stocked at ${product.aisle}. We currently have ${product.stock} units on the shelf, priced at ₹${product.price}.`,
      source: 'NIM Assistant',
      latency: 120 + Math.floor(Math.random() * 60),
    }
  }

  if (q.includes('hour') || q.includes('open') || q.includes('close') || q.includes('time')) {
    return {
      text: 'The store is open every day from 7:00 AM to 11:00 PM. Self-checkout lanes stay open the full duration.',
      source: 'NIM Assistant',
      latency: 90 + Math.floor(Math.random() * 40),
    }
  }

  if (q.includes('upi') || q.includes('pay') || q.includes('card') || q.includes('cash')) {
    return {
      text: 'Yes — we accept UPI, all major debit/credit cards, and cash at every self-checkout lane.',
      source: 'NIM Assistant',
      latency: 95 + Math.floor(Math.random() * 40),
    }
  }

  if (product) {
    return {
      text: `${product.name} costs ₹${product.price} and is located at ${product.aisle}.`,
      source: 'NIM Assistant',
      latency: 130 + Math.floor(Math.random() * 50),
    }
  }

  return {
    text: "I couldn't reach the cloud assistant, so here's a best-effort answer from the on-device model: please ask a store associate near the entrance, or try asking about a specific product, store hours, or payment options.",
    source: 'Edge Fallback',
    latency: 320 + Math.floor(Math.random() * 120),
  }
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'assistant',
      text: 'Namaste! I am the SmartRetail in-store assistant. Ask me where to find a product, our store hours, or how to pay.',
      source: 'NIM Assistant',
      latency: 78,
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || typing) return
    const userMsg: Message = { id: Date.now(), role: 'user', text: trimmed }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setTyping(true)

    const res = answer(trimmed)
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: res.text,
          source: res.source,
          latency: res.latency,
        },
      ])
      setTyping(false)
    }, 700 + Math.random() * 500)
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
          Customer AI Assistant
        </h1>
        <p className="text-sm text-zinc-500">In-store kiosk · NVIDIA NIM with on-device fallback</p>
      </div>

      <div className="flex justify-center">
        {/* Phone / kiosk frame */}
        <div className="flex h-[640px] w-full max-w-sm flex-col overflow-hidden rounded-[28px] border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/40">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-950 px-4 py-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-950">
              <Bot className="size-5" />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-zinc-100">Store Assistant</span>
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                online
              </span>
            </div>
            <span className="ml-auto font-mono text-[10px] text-zinc-600">Kiosk #7</span>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-zinc-950/50 px-4 py-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn('flex gap-2', m.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                {m.role === 'assistant' && (
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
                    <Bot className="size-3.5" />
                  </span>
                )}
                <div className={cn('flex max-w-[78%] flex-col gap-1', m.role === 'user' && 'items-end')}>
                  <div
                    className={cn(
                      'rounded-2xl px-3 py-2 text-sm leading-relaxed',
                      m.role === 'user'
                        ? 'rounded-br-sm bg-zinc-100 text-zinc-950'
                        : 'rounded-bl-sm border border-zinc-800 bg-zinc-900 text-zinc-200',
                    )}
                  >
                    {m.text}
                  </div>
                  {m.role === 'assistant' && m.source && (
                    <div className="flex items-center gap-1.5 pl-1">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider',
                          m.source === 'NIM Assistant'
                            ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-400'
                            : 'border-amber-500/25 bg-amber-500/10 text-amber-400',
                        )}
                      >
                        {m.source === 'NIM Assistant' ? (
                          <Wifi className="size-2.5" />
                        ) : (
                          <Cpu className="size-2.5" />
                        )}
                        {m.source}
                      </span>
                      <span className="font-mono text-[9px] text-zinc-600">{m.latency}ms</span>
                    </div>
                  )}
                </div>
                {m.role === 'user' && (
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
                    <User className="size-3.5" />
                  </span>
                )}
              </div>
            ))}

            {typing && (
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
                  <Bot className="size-3.5" />
                </span>
                <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-zinc-800 bg-zinc-900 px-3 py-2.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="size-1.5 animate-bounce rounded-full bg-zinc-500"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap gap-1.5 border-t border-zinc-800 bg-zinc-950 px-3 pt-2.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                disabled={typing}
                className="flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-[11px] text-zinc-300 transition-colors hover:border-zinc-700 hover:bg-zinc-800 disabled:opacity-50"
              >
                <Sparkles className="size-2.5 text-zinc-500" />
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
            className="flex items-center gap-2 border-t border-zinc-800 bg-zinc-950 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) {
                  e.preventDefault()
                  send(input)
                }
              }}
              placeholder="Ask about products, hours, payment…"
              className="flex-1 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-zinc-700"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              aria-label="Send message"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-950 transition-colors hover:bg-white disabled:opacity-40"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
