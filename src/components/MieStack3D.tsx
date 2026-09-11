'use client';

import { useState, useCallback } from 'react';
import Image, { StaticImageData } from 'next/image';

interface Props {
  imgOri: StaticImageData;
  imgPdas: StaticImageData;
}

const STACK = [
  { tx: 0,  ty: 0,   scale: 1.00, rotate:  0, opacity: 1.0,  z: 40, shadow: '0 24px 48px rgba(0,0,0,0.30)' },
  { tx: 18, ty: -10, scale: 0.90, rotate:  6, opacity: 0.65, z: 30, shadow: '0 12px 24px rgba(0,0,0,0.18)' },
];

const LABELS = ['Original', 'Pedas'];
const COLORS = ['#EA580C', '#DC2626'];

export default function MieStack3D({ imgOri, imgPdas }: Props) {
  const imgs = [imgOri, imgPdas];
  const [active, setActive] = useState(0);
  const [flying, setFlying] = useState(false);
  const [justLanded, setJustLanded] = useState<number | null>(null);

  const advance = useCallback(() => {
    if (flying) return;
    setFlying(true);
    setTimeout(() => {
      setActive(a => {
        const next = (a + 1) % 2;
        setJustLanded(a);
        return next;
      });
      setFlying(false);
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
        @keyframes mieFlyOut {
          0%   { transform: translateX(0px)   translateY(0px)   scale(1) rotate(0deg);   opacity: 1;   }
          40%  { transform: translateX(-20px) translateY(-30px) scale(1) rotate(-8deg);  opacity: 0.8; }
          100% { transform: translateX(180%)  translateY(-60px) scale(1) rotate(30deg);  opacity: 0;   }
        }
        .mie-fly { animation: mieFlyOut 0.38s cubic-bezier(0.4,0,1,1) forwards; }

        @keyframes mieFloat {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-8px); }
        }
        .mie-float { animation: mieFloat 4s ease-in-out infinite; }
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
            const pos = (i - active + 2) % 2;
            const p   = STACK[pos];
            const isTop     = pos === 0;
            const isFlying  = isTop && flying;
            const isLanding = i === justLanded;

            return (
              <div
                key={i}
                className={isFlying ? 'mie-fly absolute' : `absolute ${isTop ? 'mie-float' : ''}`}
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
                      {i + 1} / 2
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

          {/* Tap hint arrow */}
          {!flying && (
            <div
              className="absolute bottom-1 right-1 flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm pointer-events-none"
              style={{ zIndex: 50 }}
            >
              <span className="text-orange-700 text-[9px] font-semibold">tap</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5h6M5 2l3 3-3 3" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
                backgroundColor: active === i ? COLORS[active] : '#FED7AA',
                flexShrink: 0,
              }}
              title={label}
            />
          ))}
        </div>

        <p className="text-[10px] text-orange-700/60 font-medium tracking-wide">
          {LABELS[active]} · Klik untuk varian lain
        </p>
      </div>
    </>
  );
}
