'use client';

import { useRef, useState, useCallback } from 'react';
import Image, { StaticImageData } from 'next/image';

interface Props {
  imgOri: StaticImageData;
  imgPdas: StaticImageData;
}

export default function MieStack3D({ imgOri, imgPdas }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  // only true once the return-to-center transition has finished — prevents
  // the CSS animation from snapping in before the element reaches (0,0)
  const [idleReady, setIdleReady] = useState(true);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setRot({
      x: ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -22,
      y: ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 22,
    });
  }, []);

  const onEnter = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    setIdleReady(false);
    setActive(true);
  }, []);

  const onLeave = useCallback(() => {
    setRot({ x: 0, y: 0 });
    setActive(false);
    // wait for the 0.7 s return-to-center transition before starting idle animation
    idleTimer.current = setTimeout(() => setIdleReady(true), 700);
  }, []);

  const isIdle = idleReady && !active;

  const wrapStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    position: 'relative',
    transformStyle: 'preserve-3d',
    // keep inline transform while transitioning back to center; remove it only
    // once we hand off to the CSS idle animation (after the timer fires)
    transform: isIdle
      ? undefined
      : `perspective(1100px) rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
    transition: active
      ? 'transform 0.08s linear'
      : 'transform 0.7s cubic-bezier(0.23,1,0.32,1)',
  };

  const shineAngle = 130 + rot.y * 2;

  return (
    <>
      <style>{`
        /* idle animation starts and ends at (0deg, 0deg) so the handoff from the
           return-to-center transition is seamless — no visual jump */
        @keyframes mieIdle {
          0%   { transform: perspective(1000px) rotateY(0deg)  rotateX(0deg)  translateY(0px);   filter: drop-shadow(0 24px 36px rgba(194,65,12,0.22)); }
          25%  { transform: perspective(1000px) rotateY(-9deg) rotateX(5deg)  translateY(0px);   filter: drop-shadow(0 28px 40px rgba(194,65,12,0.30)); }
          75%  { transform: perspective(1000px) rotateY(9deg)  rotateX(-5deg) translateY(-18px); filter: drop-shadow(0 40px 54px rgba(194,65,12,0.12)); }
          100% { transform: perspective(1000px) rotateY(0deg)  rotateX(0deg)  translateY(0px);   filter: drop-shadow(0 24px 36px rgba(194,65,12,0.22)); }
        }
        .mie-idle { animation: mieIdle 5.5s ease-in-out infinite; }
        .mie-card { transition: filter 0.25s ease, transform 0.25s ease; }
        .mie-card:hover { filter: brightness(1.12) drop-shadow(0 12px 28px rgba(194,65,12,0.50)) !important; }
        @keyframes mieGlow {
          0%,100% { opacity: 0.25; transform: scale(1); }
          50%      { opacity: 0.45; transform: scale(1.1); }
        }
        .mie-glow { animation: mieGlow 3s ease-in-out infinite; }
      `}</style>

      <div
        ref={ref}
        className="flex-shrink-0 relative w-52 h-64 md:w-60 md:h-72 cursor-crosshair select-none"
        style={{ perspective: '1100px' }}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        {/* Ambient glow */}
        <div
          className="mie-glow absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 55% 60%, rgba(251,146,60,0.55) 0%, rgba(245,158,11,0.3) 40%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />

        <div className={isIdle ? 'mie-idle' : ''} style={wrapStyle}>

          {/* ── Pedas — back ── */}
          <div
            className="absolute mie-card"
            style={{
              right: 0, bottom: 0, zIndex: 1,
              transform: 'translateZ(-35px) scale(0.88)',
              transformOrigin: 'bottom right',
              filter: 'brightness(0.82)',
            }}
          >
            <Image
              src={imgPdas}
              alt="Mie Kremes Pedas"
              width={140} height={175}
              className="rounded-2xl object-cover shadow-xl"
            />
          </div>

          {/* ── Original — front ── */}
          <div
            className="absolute mie-card"
            style={{
              left: 0, top: 0, zIndex: 2,
              transform: 'translateZ(30px)',
              transformOrigin: 'top left',
            }}
          >
            <Image
              src={imgOri}
              alt="Mie Kremes Original"
              width={155} height={194}
              className="rounded-2xl object-cover shadow-2xl"
            />
            {/* Dynamic shine */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{
                background: `linear-gradient(${shineAngle}deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.06) 40%, transparent 65%)`,
                transition: active ? 'background 0.08s linear' : 'background 0.6s ease',
              }}
            />
          </div>

        </div>
      </div>
    </>
  );
}
