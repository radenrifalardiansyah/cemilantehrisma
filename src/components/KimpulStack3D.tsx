'use client';

import { useRef, useState, useCallback } from 'react';
import Image, { StaticImageData } from 'next/image';

interface Props {
  imgOri: StaticImageData;
  imgBBQ: StaticImageData;
  imgBBQPdas: StaticImageData;
  imgJgn: StaticImageData;
}

export default function KimpulStack3D({ imgOri, imgBBQ, imgBBQPdas, imgJgn }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [rot, setRot] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setRot({
      x: ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -22,
      y: ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 22,
    });
  }, []);

  const onLeave = useCallback(() => {
    setRot({ x: 0, y: 0 });
    setActive(false);
  }, []);

  const wrapStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    position: 'relative',
    transformStyle: 'preserve-3d',
    transform: active
      ? `perspective(1100px) rotateX(${rot.x}deg) rotateY(${rot.y}deg)`
      : undefined,
    transition: active
      ? 'transform 0.08s linear'
      : 'transform 0.7s cubic-bezier(0.23,1,0.32,1)',
  };

  const shineAngle = 130 + rot.y * 2;

  return (
    <>
      <style>{`
        @keyframes kkIdle {
          0%,100% {
            transform: perspective(1000px) rotateY(-9deg) rotateX(5deg) translateY(0px);
            filter: drop-shadow(0 24px 36px rgba(180,83,9,0.30));
          }
          50% {
            transform: perspective(1000px) rotateY(9deg) rotateX(-5deg) translateY(-18px);
            filter: drop-shadow(0 40px 54px rgba(180,83,9,0.12));
          }
        }
        .kk-idle { animation: kkIdle 5.5s ease-in-out infinite; }
        .kk-card { transition: filter 0.25s ease, transform 0.25s ease; }
        .kk-card:hover { filter: brightness(1.12) drop-shadow(0 12px 28px rgba(180,83,9,0.50)) !important; }
        @keyframes kkGlow {
          0%,100% { opacity: 0.25; transform: scale(1); }
          50%      { opacity: 0.45; transform: scale(1.1); }
        }
        .kk-glow { animation: kkGlow 3s ease-in-out infinite; }
      `}</style>

      <div
        ref={ref}
        className="flex-shrink-0 relative w-60 h-72 md:w-64 md:h-80 cursor-crosshair select-none"
        style={{ perspective: '1100px' }}
        onMouseMove={onMove}
        onMouseEnter={() => setActive(true)}
        onMouseLeave={onLeave}
      >
        {/* Ambient glow behind stack */}
        <div
          className="kk-glow absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 55% 60%, rgba(251,191,36,0.55) 0%, rgba(245,158,11,0.3) 40%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />

        <div className={active ? '' : 'kk-idle'} style={wrapStyle}>

          {/* ── BBQ Pedas — deepest ── */}
          <div
            className="absolute kk-card"
            style={{
              right: 0, bottom: 8, zIndex: 1,
              transform: 'translateZ(-55px)',
              transformOrigin: 'bottom right',
              filter: 'brightness(0.78)',
            }}
          >
            <Image
              src={imgBBQPdas}
              alt="Keripik Kimpul BBQ Pedas"
              width={105} height={132}
              className="rounded-2xl object-cover shadow-xl"
            />
          </div>

          {/* ── Jagung ── */}
          <div
            className="absolute kk-card"
            style={{
              right: 16, bottom: 28, zIndex: 2,
              transform: 'translateZ(-25px) scale(0.76)',
              transformOrigin: 'bottom right',
              filter: 'brightness(0.87)',
            }}
          >
            <Image
              src={imgJgn}
              alt="Keripik Kimpul Jagung"
              width={120} height={150}
              className="rounded-2xl object-cover shadow-xl"
            />
          </div>

          {/* ── BBQ ── */}
          <div
            className="absolute kk-card"
            style={{
              right: 30, top: 28, zIndex: 3,
              transform: 'translateZ(0px) scale(0.87)',
              transformOrigin: 'center',
              filter: 'brightness(0.93)',
            }}
          >
            <Image
              src={imgBBQ}
              alt="Keripik Kimpul BBQ"
              width={138} height={173}
              className="rounded-2xl object-cover shadow-xl"
            />
          </div>

          {/* ── Original — front ── */}
          <div
            className="absolute kk-card"
            style={{
              left: 0, top: 0, zIndex: 4,
              transform: 'translateZ(32px)',
              transformOrigin: 'top left',
            }}
          >
            <Image
              src={imgOri}
              alt="Keripik Kimpul Original"
              width={155} height={194}
              className="rounded-2xl object-cover shadow-2xl"
            />
            {/* Dynamic shine overlay */}
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
