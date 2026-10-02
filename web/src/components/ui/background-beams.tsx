"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

export const BackgroundBeams = React.memo(
    ({ className }: { className?: string }) => {
        const canvasRef = useRef<HTMLCanvasElement>(null);

        useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            let animId: number;
            let width = (canvas.width = window.innerWidth);
            let height = (canvas.height = window.innerHeight);

            const handleResize = () => {
                if (!canvas) return;
                width = canvas.width = window.innerWidth;
                height = canvas.height = window.innerHeight;
            };

            window.addEventListener("resize", handleResize, { passive: true });

            const motesCount = 42;
            const colors = ["#7bd0ff", "#c0c1ff", "#ddb7ff", "#38bdf8", "#34d399"];
            const motes = Array.from({ length: motesCount }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.5 + 0.6,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.25 - 0.1,
                alpha: Math.random() * 0.35 + 0.15,
                color: colors[Math.floor(Math.random() * colors.length)],
            }));

            const renderMotes = () => {
                ctx.clearRect(0, 0, width, height);

                for (let i = 0; i < motesCount; i++) {
                    const m = motes[i];
                    m.x += m.vx;
                    m.y += m.vy;

                    if (m.x < 0) m.x = width;
                    if (m.x > width) m.x = 0;
                    if (m.y < 0) m.y = height;
                    if (m.y > height) m.y = 0;

                    ctx.beginPath();
                    ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
                    ctx.fillStyle = m.color;
                    ctx.globalAlpha = m.alpha;
                    ctx.fill();
                }

                ctx.globalAlpha = 1;
                animId = requestAnimationFrame(renderMotes);
            };
            renderMotes();

            return () => {
                window.removeEventListener("resize", handleResize);
                cancelAnimationFrame(animId);
            };
        }, []);

        return (
            <div
                aria-hidden="true"
                className={cn(
                    "absolute inset-0 pointer-events-none overflow-hidden z-0 select-none bg-[#09090b]",
                    className
                )}
            >
                <style>{`
          @keyframes beamTravel1 {
            0% { stroke-dashoffset: 1400; opacity: 0; }
            10% { opacity: 0.95; }
            85% { opacity: 0.95; }
            100% { stroke-dashoffset: -1400; opacity: 0; }
          }
          @keyframes beamTravel2 {
            0% { stroke-dashoffset: 1700; opacity: 0; }
            15% { opacity: 0.9; }
            85% { opacity: 0.9; }
            100% { stroke-dashoffset: -1700; opacity: 0; }
          }
          @keyframes beamTravel3 {
            0% { stroke-dashoffset: 1900; opacity: 0; }
            20% { opacity: 1; }
            80% { opacity: 1; }
            100% { stroke-dashoffset: -1900; opacity: 0; }
          }
          @keyframes beamTravelReverse {
            0% { stroke-dashoffset: -1600; opacity: 0; }
            15% { opacity: 0.85; }
            85% { opacity: 0.85; }
            100% { stroke-dashoffset: 1600; opacity: 0; }
          }

          .beam-pulse-1 {
            stroke-dasharray: 220 1000;
            animation: beamTravel1 9s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            will-change: stroke-dashoffset, opacity;
          }
          .beam-pulse-2 {
            stroke-dasharray: 260 1200;
            animation: beamTravel2 12s cubic-bezier(0.4, 0, 0.2, 1) infinite 1.8s;
            will-change: stroke-dashoffset, opacity;
          }
          .beam-pulse-3 {
            stroke-dasharray: 180 900;
            animation: beamTravel3 8s cubic-bezier(0.4, 0, 0.2, 1) infinite 3.5s;
            will-change: stroke-dashoffset, opacity;
          }
          .beam-pulse-4 {
            stroke-dasharray: 300 1350;
            animation: beamTravelReverse 14s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.8s;
            will-change: stroke-dashoffset, opacity;
          }
          .beam-pulse-5 {
            stroke-dasharray: 200 980;
            animation: beamTravel1 10.5s cubic-bezier(0.4, 0, 0.2, 1) infinite 5.2s;
            will-change: stroke-dashoffset, opacity;
          }
          .beam-pulse-6 {
            stroke-dasharray: 240 1150;
            animation: beamTravel3 11s cubic-bezier(0.4, 0, 0.2, 1) infinite 2.4s;
            will-change: stroke-dashoffset, opacity;
          }

          .beams-vignette-mask {
            mask-image: radial-gradient(ellipse 85% 75% at 50% 45%, black 25%, rgba(0,0,0,0.4) 65%, transparent 95%);
            -webkit-mask-image: radial-gradient(ellipse 85% 75% at 50% 45%, black 25%, rgba(0,0,0,0.4) 65%, transparent 95%);
          }
        `}</style>

                {/* Auroras fixas sutis sem oscilação ou animação de opacidade */}
                <div className="absolute -top-[25%] -left-[15%] w-[65vw] h-[65vw] rounded-full bg-gradient-to-br from-[#6366f1]/15 via-[#6f00be]/10 to-transparent blur-[150px] opacity-50" />
                <div className="absolute top-[20%] -right-[15%] w-[58vw] h-[58vw] rounded-full bg-gradient-to-bl from-[#009bd1]/15 via-[#8083ff]/10 to-transparent blur-[160px] opacity-45" />

                {/* Canvas de Partículas Suave */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full opacity-35 mix-blend-screen"
                />

                {/* Grelha de Pontos Isométricos */}
                <div className="absolute inset-0 bg-[radial-gradient(rgba(192,193,255,0.06)_1px,transparent_1px)] [background-size:32px_32px] opacity-40 mix-blend-screen" />

                {/* SVG dos Feixes Arquiteturais */}
                <div className="absolute inset-0 w-full h-full beams-vignette-mask flex items-center justify-center">
                    <svg
                        className="w-full h-full min-w-[1400px] min-h-[900px] select-none transform-gpu will-change-transform"
                        fill="none"
                        viewBox="0 0 1440 960"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <linearGradient id="beamManaCyan" x1="0%" x2="100%" y1="0%" y2="100%">
                                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
                                <stop offset="25%" stopColor="#38bdf8" stopOpacity="0.25" />
                                <stop offset="50%" stopColor="#7bd0ff" stopOpacity="1" />
                                <stop offset="75%" stopColor="#009bd1" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#004c69" stopOpacity="0" />
                            </linearGradient>

                            <linearGradient id="beamManaViolet" x1="0%" x2="100%" y1="0%" y2="100%">
                                <stop offset="0%" stopColor="#6f00be" stopOpacity="0" />
                                <stop offset="30%" stopColor="#c0c1ff" stopOpacity="0.4" />
                                <stop offset="50%" stopColor="#ddb7ff" stopOpacity="1" />
                                <stop offset="75%" stopColor="#8083ff" stopOpacity="0.5" />
                                <stop offset="100%" stopColor="#2c0051" stopOpacity="0" />
                            </linearGradient>

                            <linearGradient id="beamManaIndigo" x1="0%" x2="100%" y1="0%" y2="100%">
                                <stop offset="0%" stopColor="#494bd6" stopOpacity="0" />
                                <stop offset="25%" stopColor="#6366f1" stopOpacity="0.35" />
                                <stop offset="50%" stopColor="#c0c1ff" stopOpacity="1" />
                                <stop offset="75%" stopColor="#8083ff" stopOpacity="0.45" />
                                <stop offset="100%" stopColor="#1000a9" stopOpacity="0" />
                            </linearGradient>

                            <linearGradient id="beamManaEmerald" x1="0%" x2="100%" y1="0%" y2="100%">
                                <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                                <stop offset="35%" stopColor="#34d399" stopOpacity="0.4" />
                                <stop offset="50%" stopColor="#7bd0ff" stopOpacity="1" />
                                <stop offset="75%" stopColor="#059669" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="#002d40" stopOpacity="0" />
                            </linearGradient>

                            <filter id="beamSuperBloom" x="-70%" y="-70%" width="240%" height="240%">
                                <feGaussianBlur in="SourceGraphic" result="blurDeep" stdDeviation="6" />
                                <feGaussianBlur in="SourceGraphic" result="blurMid" stdDeviation="2.5" />
                                <feGaussianBlur in="SourceGraphic" result="sharpCore" stdDeviation="0.8" />
                                <feMerge>
                                    <feMergeNode in="blurDeep" />
                                    <feMergeNode in="blurMid" />
                                    <feMergeNode in="sharpCore" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            <filter id="beamSoftBloom" x="-40%" y="-40%" width="180%" height="180%">
                                <feGaussianBlur in="SourceGraphic" result="softBlur" stdDeviation="2.2" />
                                <feMerge>
                                    <feMergeNode in="softBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Trilhos vetoriais de base estática */}
                        <g stroke="rgba(192, 193, 255, 0.05)" strokeWidth="1.2">
                            <path d="M-120 70 C 320 110, 680 40, 1080 240 C 1280 340, 1450 540, 1600 720" />
                            <path d="M-90 310 C 240 270, 520 210, 930 380 C 1210 490, 1370 690, 1580 930" />
                            <path d="M-40 620 C 300 520, 620 440, 960 550 C 1240 630, 1400 810, 1560 1010" />
                            <path d="M120 -60 C 360 210, 560 450, 710 770 C 810 970, 930 1070, 1060 1140" />
                            <path d="M460 -70 C 600 170, 760 410, 960 650 C 1120 850, 1300 970, 1460 1070" />
                            <path d="M760 -50 C 860 190, 1020 430, 1220 670 C 1360 830, 1480 940, 1580 1010" />
                            <path d="M1180 -60 C 1080 230, 860 490, 620 690 C 420 850, 200 930, -60 970" />
                            <path d="M940 -70 C 820 210, 640 470, 400 670 C 220 830, 60 910, -110 940" />
                            <line stroke="rgba(123, 208, 255, 0.08)" x1="460" x2="600" y1="170" y2="170" />
                            <line stroke="rgba(192, 193, 255, 0.1)" x1="930" x2="1080" y1="380" y2="240" />
                            <line stroke="rgba(221, 183, 255, 0.08)" x1="710" x2="960" y1="770" y2="650" />
                        </g>

                        {/* Trilhas atmosféricas */}
                        <g opacity="0.35">
                            <path d="M-120 70 C 320 110, 680 40, 1080 240 C 1280 340, 1450 540, 1600 720" stroke="url(#beamManaCyan)" strokeWidth="1.5" />
                            <path d="M-90 310 C 240 270, 520 210, 930 380 C 1210 490, 1370 690, 1580 930" stroke="url(#beamManaViolet)" strokeWidth="1.5" />
                            <path d="M460 -70 C 600 170, 760 410, 960 650 C 1120 850, 1300 970, 1460 1070" stroke="url(#beamManaIndigo)" strokeWidth="1.8" />
                            <path d="M1180 -60 C 1080 230, 860 490, 620 690 C 420 850, 200 930, -60 970" stroke="url(#beamManaEmerald)" strokeWidth="1.5" />
                        </g>

                        {/* Feixes dinâmicos de alta energia */}
                        <path className="beam-pulse-1" d="M-120 70 C 320 110, 680 40, 1080 240 C 1280 340, 1450 540, 1600 720" filter="url(#beamSuperBloom)" stroke="url(#beamManaCyan)" strokeLinecap="round" strokeWidth="3" />
                        <path className="beam-pulse-2" d="M-90 310 C 240 270, 520 210, 930 380 C 1210 490, 1370 690, 1580 930" filter="url(#beamSuperBloom)" stroke="url(#beamManaViolet)" strokeLinecap="round" strokeWidth="2.6" />
                        <path className="beam-pulse-3" d="M460 -70 C 600 170, 760 410, 960 650 C 1120 850, 1300 970, 1460 1070" filter="url(#beamSuperBloom)" stroke="url(#beamManaIndigo)" strokeLinecap="round" strokeWidth="3.5" />
                        <path className="beam-pulse-4" d="M1180 -60 C 1080 230, 860 490, 620 690 C 420 850, 200 930, -60 970" filter="url(#beamSuperBloom)" stroke="url(#beamManaEmerald)" strokeLinecap="round" strokeWidth="2.5" />
                        <path className="beam-pulse-5" d="M760 -50 C 860 190, 1020 430, 1220 670 C 1360 830, 1480 940, 1580 1010" filter="url(#beamSoftBloom)" stroke="url(#beamManaCyan)" strokeLinecap="round" strokeWidth="2.2" />
                        <path className="beam-pulse-6" d="M-40 620 C 300 520, 620 440, 960 550 C 1240 630, 1400 810, 1560 1010" filter="url(#beamSoftBloom)" stroke="url(#beamManaViolet)" strokeLinecap="round" strokeWidth="2.4" />

                        {/* Pontos de conexão synapse estáticos */}
                        <g>
                            <circle cx="930" cy="380" fill="#7bd0ff" filter="url(#beamSuperBloom)" r="4" />
                            <circle cx="930" cy="380" fill="#ffffff" r="1.8" />
                            <circle cx="1080" cy="240" fill="#ddb7ff" filter="url(#beamSuperBloom)" r="5" />
                            <circle cx="1080" cy="240" fill="#ffffff" r="2" />
                            <circle cx="710" cy="770" fill="#c0c1ff" filter="url(#beamSuperBloom)" r="4" />
                            <circle cx="710" cy="770" fill="#ffffff" r="1.8" />
                            <circle cx="960" cy="650" fill="#38bdf8" filter="url(#beamSoftBloom)" r="3.5" />
                            <circle cx="960" cy="650" fill="#ffffff" r="1.5" />
                            <circle cx="320" cy="110" fill="#ddb7ff" filter="url(#beamSoftBloom)" r="3" />
                        </g>
                    </svg>
                </div>
            </div>
        );
    }
);

BackgroundBeams.displayName = "BackgroundBeams";