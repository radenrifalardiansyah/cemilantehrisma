'use client';

import { useState, useCallback } from 'react';
import Image, { StaticImageData } from 'next/image';

interface Props {
  imgOri: StaticImageData;
  imgBBQ: StaticImageData;
  imgBBQPdas: StaticImageData;
  imgJgn: StaticImageData;
}

const STACK = [
  { tx: 0,  ty: 0,   scale: 1.00, rotate:  0, opacity: 1.0,  z: 40, shadow: '0 24px 48px rgba(0,0,0,0.30)' },
  { tx: 14, ty: -8,  scale: 0.92, rotate:  5, opacity: 0.80, z: 30, shadow: '0 12px 24px rgba(0,0,0,0.18)' },
  { tx: 26, ty: -14, scale: 0.85, rotate: 10, opacity: 0.55, z: 20, shadow: '0  8px 16px rgba(0,0,0,0.12)' },
  { tx: 36, ty: -20, scale: 0.78, rotate: 15, opacity: 0.30, z: 10, shadow: '0  4px  8px rgba(0,0,0,0.08)' },
];

const LABELS = ['Original', 'BBQ', 'BBQ Pedas', 'Jagung'];
const COLORS = ['#B45309', '#C2410C', '#B91C1C', '#CA8A04'];

export default function KimpulCardStack({ imgOri, imgBBQ, imgBBQPdas, imgJgn }: Props) {
  const imgs = [imgOri, imgBBQ, imgBBQPdas, imgJgn];
  const [active, setActive] = useState(0);
  const [flying, setFlying] = useState(false);
  // tracks which image index just landed so we suppress its transition for one frame
  const [justLanded, setJustLanded] = useState<number | null>(null);

  const advance = useCallback(() => {
    if (flying) return;
    setFlying(true);
    setTimeout(() => {
      setActive(a => {
        const next = (a + 1) % 4;
        // the flying card (index = current active) will land at pos 3 in next frame
        setJustLanded(a);
        return next;
      });
      setFlying(false);
      // clear the no-transition flag after two frames so normal transitions resume
      requestAnimationFrame(() => requestAnimationFrame(() => setJustLanded(null)));
    }, 380);
  }, [flying]);

  const goTo = useCallback((i: number) => {
    if (flying || i === active) return;
    setActive(i);
  }, [flying, active]);

  return (
    <>
      <style>{`
        /* flyOut: consistent 4-function transform list across all keyframes so the
           browser can interpolate smoothly (no var() concatenation which breaks
           function-count matching and causes jumps). Top card always has pos=0
           → STACK[0] tx=0 ty=0 scale=1 rotate=0, so these are the correct start values. */
        @keyframes flyOut {
          0%   { transform: translateX(0px)   translateY(0px)   scale(1) rotate(0deg);   opacity: 1;   }
          40%  { transform: translateX(-20px) translateY(-30px) scale(1) rotate(-8deg);  opacity: 0.8; }
          100% { transform: translateX(180%)  translateY(-60px) scale(1) rotate(30deg);  opacity: 0;   }
        }
        .kk-fly { animation: flyOut 0.38s cubic-bezier(0.4,0,1,1) forwards; }

        @keyframes stackFloat {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-8px); }
        }
        .kk-float { animation: stackFloat 4s ease-in-out infinite; }
      `}</style>

      <div className="flex-shrink-0 flex flex-col items-center gap-5 select-none">

        {/* Stack */}
        <div
          className="relative cursor-pointer"
          style={{ width: 210, height: 240 }}
          onClick={advance}
          title="Klik untuk varian berikutnya"
        >
          {imgs.map((img, i) => {
            const pos = (i - active + 4) % 4;
            const p   = STACK[pos];
            const isTop    = pos === 0;
            const isFlying = isTop && flying;
            const isLanding = i === justLanded;

            return (
              <div
                key={i}
                className={isFlying ? 'kk-fly absolute' : `absolute ${isTop ? 'kk-float' : ''}`}
                style={{
                  width: 155,
                  height: 194,
                  top: 24,
                  left: 12,
                  borderRadius: 16,
                  overflow: 'hidden',
                  background: 'white',
                  zIndex: p.z,
                  boxShadow: p.shadow,
                  transform: isFlying
                    ? undefined
                    : `translateX(${p.tx}px) translateY(${p.ty}px) scale(${p.scale}) rotate(${p.rotate}deg)`,
                  opacity: isFlying ? undefined : p.opacity,
                  // suppress transition for one frame after the fly animation ends so the
                  // card snaps directly to its new stack position instead of sliding in
                  transition: isFlying || isLanding ? 'none' : 'transform 0.45s cubic-bezier(0.23,1,0.32,1), opacity 0.45s ease',
                  transformOrigin: 'bottom center',
                  willChange: 'transform, opacity',
                }}
              >
                <Image
                  src={img}
                  alt={LABELS[i]}
                  width={155}
                  height={194}
                  className="w-full h-full object-contain pointer-events-none"
                  draggable={false}
                  priority={i === active}
                />

                {/* Label overlay — only on top card */}
                {isTop && !isFlying && (
                  <div
                    className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-3 pb-2 pt-8"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)' }}
                  >
                    <span className="text-white text-xs font-bold tracking-wide drop-shadow">{LABELS[i]}</span>
                    <span
                      className="text-white text-[9px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: COLORS[i] }}
                    >
                      {i + 1} / 4
                    </span>
                  </div>
                )}

                {/* Shine on top card */}
                {isTop && !isFlying && (
                  <div
                    className="absolute inset-0 pointer-events-none rounded-2xl"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 55%)' }}
                  />
                )}
              </div>
            );
          })}

          {/* Tap hint arrow — bottom right */}
          {!flying && (
            <div
              className="absolute bottom-1 right-1 flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm pointer-events-none"
              style={{ zIndex: 50 }}
            >
              <span className="text-amber-700 text-[9px] font-semibold">tap</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5h6M5 2l3 3-3 3" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>

        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {LABELS.map((label, i) => (
            <button
              key={label}
              onClick={() => goTo(i)}
              className="transition-all duration-300 rounded-full border-0 p-0 cursor-pointer focus:outline-none"
              style={{
                width:  active === i ? 24 : 8,
                height: 8,
                backgroundColor: active === i ? COLORS[active] : '#FDE68A',
                flexShrink: 0,
              }}
              title={label}
            />
          ))}
        </div>

        <p className="text-[10px] text-amber-700/60 font-medium tracking-wide">
          {LABELS[active]} · Klik untuk varian lain
        </p>
      </div>
    </>
  );
}
