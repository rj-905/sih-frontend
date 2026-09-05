'use client'

import Image from 'next/image'
import { ScanLine, Loader2, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Phase = 'idle' | 'scanning' | 'done'

export function TrayHud({
  phase,
  onScan,
}: {
  phase: Phase
  onScan: () => void
}) {
  const scanning = phase === 'scanning'

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-medium text-zinc-300">
          <Camera className="size-4 text-zinc-500" />
          Tray Vision Feed
        </h2>
        <span className="flex items-center gap-1.5 rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          15 FPS
        </span>
      </div>

      <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
        <Image
          src="/tray-feed.png"
          alt="Overhead camera view of the checkout tray"
          fill
          sizes="(max-width: 1024px) 100vw, 320px"
          className={cn(
            'object-cover transition-all duration-500',
            scanning ? 'brightness-110 saturate-125' : 'brightness-90',
          )}
          priority
        />

        {/* corner reticles */}
        <div className="pointer-events-none absolute inset-3">
          {['left-0 top-0 border-l-2 border-t-2', 'right-0 top-0 border-r-2 border-t-2', 'left-0 bottom-0 border-l-2 border-b-2', 'right-0 bottom-0 border-r-2 border-b-2'].map(
            (pos) => (
              <span
                key={pos}
                className={cn('absolute size-5 rounded-[3px] border-zinc-100/70', pos)}
              />
            ),
          )}
        </div>

        {/* scan sweep */}
        {scanning && (
          <div className="pointer-events-none absolute inset-x-0 top-0 h-full">
            <div className="animate-scan absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-emerald-400/25 to-transparent" />
          </div>
        )}

        {/* overlay HUD footer */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-zinc-950/90 to-transparent p-3">
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-zinc-300">
            <span
              className={cn(
                'size-1.5 rounded-full',
                scanning ? 'animate-pulse bg-amber-400' : 'bg-emerald-500',
              )}
            />
            {scanning ? 'Inferring · YOLOv8' : 'Idle · ready'}
          </span>
          <span className="font-mono text-[10px] text-zinc-400">cam_0 · 1280×960</span>
        </div>
      </div>

      <Button
        size="lg"
        onClick={onScan}
        disabled={scanning}
        className="w-full bg-zinc-100 text-zinc-950 hover:bg-white"
      >
        {scanning ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Scanning tray…
          </>
        ) : (
          <>
            <ScanLine className="size-4" />
            Scan Tray
          </>
        )}
      </Button>

      <p className="text-center font-mono text-[11px] text-zinc-500">
        Place all items on the tray, then scan.
      </p>
    </section>
  )
}
