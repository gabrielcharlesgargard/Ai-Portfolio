import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { PageBackdrop } from "../assets/ui";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#08090a] text-white flex flex-col overflow-hidden">
      <style>{`
        @keyframes nf-punch {
          0%   { transform: rotate(-12deg); }
          20%  { transform: rotate(8deg); }
          35%  { transform: rotate(-22deg); }
          50%  { transform: rotate(12deg); }
          65%  { transform: rotate(-18deg); }
          80%  { transform: rotate(6deg); }
          100% { transform: rotate(-12deg); }
        }
        
        @keyframes nf-bob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(6px); }
        }
        
        @keyframes nf-sign-swing {
          0%, 100% { transform: rotate(0deg); }
          48%      { transform: rotate(-4deg); }
          58%      { transform: rotate(3.5deg); }
          75%      { transform: rotate(-1.5deg); }
        }
        
        @keyframes nf-flicker {
          0%, 40%   { opacity: .75; filter: brightness(0.9) saturate(0.9); }
          44%       { opacity: 1;   filter: brightness(1.4) saturate(1.2); }
          48%       { opacity: .85; filter: brightness(0.95) saturate(0.9); }
          52%       { opacity: 1;   filter: brightness(1.45) saturate(1.25); }
          63%       { opacity: .78; filter: brightness(0.85) saturate(0.85); }
          75%       { opacity: 1;   filter: brightness(1.3) saturate(1.1); }
          100%      { opacity: .75; filter: brightness(0.9) saturate(0.9); }
        }
        
        @keyframes nf-glow {
          0%, 40%  { opacity: .15; }
          52%      { opacity: .65; }
          63%      { opacity: .12; }
          100%     { opacity: .15; }
        }
        
        @keyframes nf-spark {
          0%, 49%  { opacity: 0; transform: scale(0.2) translate(0,0); }
          52%      { opacity: 1; transform: scale(1) translate(var(--sx), var(--sy)); }
          70%      { opacity: 0; transform: scale(1.6) translate(calc(var(--sx) * 1.6), calc(var(--sy) * 1.8)); }
          100%     { opacity: 0; }
        }
        
        @keyframes nf-sweat {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50%      { transform: translateY(14px); opacity: 1; }
        }

        .nf-arm    { transform-origin: 88px 172px; animation: nf-punch 2.4s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite; }
        .nf-body   { animation: nf-bob 2.4s ease-in-out infinite; }
        .nf-sign   { transform-origin: 50% 0%; animation: nf-sign-swing 2.8s ease-in-out infinite; }
        .nf-tube   { animation: nf-flicker 2.4s linear infinite; }
        .nf-glow   { animation: nf-glow 2.4s linear infinite; }
        .nf-spark  { animation: nf-spark 2.4s linear infinite; }
        .nf-sweat  { animation: nf-sweat 1.8s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .nf-arm, .nf-body, .nf-sign, .nf-tube, .nf-glow, .nf-spark, .nf-sweat {
            animation: none !important;
          }
          .nf-tube { opacity: 1; }
        }
      `}</style>

      <Navbar />

      <main className="relative flex-1 flex items-center justify-center px-6 py-16">
        <PageBackdrop grid />

        <div className="relative z-10 w-full max-w-lg flex flex-col items-center text-center">
          <p className="text-[12px] font-semibold tracking-[0.25em] text-amber-300/80 uppercase mb-3">
            Error 404 &middot; no signal
          </p>

          <div className="relative mb-10 select-none" aria-hidden="true">
            <svg
              viewBox="0 0 340 310"
              width="290"
              height="272"
              className="max-w-full h-auto drop-shadow-2xl"
            >
              <defs>
                <radialGradient id="nfGlowGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fb923c" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
                </radialGradient>
                
                <linearGradient id="helmetGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#e4e4e7" />
                  <stop offset="100%" stopColor="#a1a1aa" />
                </linearGradient>
              </defs>

              {/* Neon Sign */}
              <line x1="200" y1="0" x2="200" y2="38" stroke="#3f3f46" strokeWidth="3" />

              <g className="nf-sign">
                <ellipse className="nf-glow" cx="200" cy="82" rx="125" ry="72" fill="url(#nfGlowGradient)" />
                
                <rect x="152" y="32" width="96" height="12" rx="6" fill="#27272a" />
                
                <text
                  x="200"
                  y="102"
                  textAnchor="middle"
                  className="nf-tube"
                  style={{
                    fontSize: "58px",
                    fontWeight: 900,
                    fontFamily: "ui-sans-serif, system-ui, sans-serif",
                    fill: "#fed7aa",
                    filter: "drop-shadow(0 0 12px #fb923c)",
                  }}
                >
                  404
                </text>

                {/* Sparks */}
                <g className="nf-spark" style={{ "--sx": "28px", "--sy": "-18px" }}>
                  <circle cx="158" cy="78" r="3.5" fill="#fed7aa" />
                </g>
                <g className="nf-spark" style={{ "--sx": "-26px", "--sy": "-12px", animationDelay: "0.08s" }}>
                  <circle cx="172" cy="71" r="2.8" fill="#fb923c" />
                </g>
                <g className="nf-spark" style={{ "--sx": "18px", "--sy": "-26px", animationDelay: "0.18s" }}>
                  <circle cx="218" cy="65" r="2.2" fill="#fed7aa" />
                </g>
              </g>

              {/* Improved Character */}
              <g className="nf-body">
                {/* Shadow */}
                <ellipse cx="122" cy="278" rx="52" ry="9" fill="#000" opacity="0.4" />

                {/* Legs */}
                <rect x="98" y="212" width="18" height="58" rx="8" fill="#27272a" />
                <rect x="128" y="212" width="18" height="58" rx="8" fill="#18181b" />

                {/* Shoes */}
                <rect x="92" y="264" width="28" height="14" rx="4" fill="#450a0a" />
                <rect x="124" y="264" width="28" height="14" rx="4" fill="#450a0a" />

                {/* Body */}
                <rect x="82" y="158" width="52" height="68" rx="12" fill="#27272a" />
                <rect x="78" y="162" width="60" height="28" rx="8" fill="#e11d48" />
                
                {/* Tool belt */}
                <rect x="85" y="198" width="58" height="12" fill="#18181b" />
                <circle cx="102" cy="204" r="4" fill="#eab308" />
                <circle cx="128" cy="204" r="4" fill="#eab308" />

                {/* Left Arm */}
                <rect 
                  x="68" 
                  y="158" 
                  width="18" 
                  height="48" 
                  rx="9" 
                  fill="#e4e4e7" 
                  transform="rotate(-12 75 170)" 
                />

                {/* Right Arm with Wrench */}
                <g className="nf-arm">
                  <rect 
                    x="52" 
                    y="142" 
                    width="22" 
                    height="52" 
                    rx="11" 
                    fill="#e4e4e7" 
                  />
                  
                  {/* Wrench */}
                  <g transform="translate(42 138) rotate(38)">
                    <rect x="0" y="18" width="38" height="7" rx="3" fill="#64748b" />
                    <rect x="29" y="8" width="14" height="26" rx="3" fill="#475569" />
                  </g>
                </g>

                {/* Head Group */}
                <g>
                  {/* Helmet */}
                  <ellipse cx="122" cy="118" rx="42" ry="38" fill="url(#helmetGradient)" />
                  <ellipse cx="118" cy="104" rx="34" ry="19" fill="#18181b" />
                  
                  {/* Goggles */}
                  <ellipse cx="107" cy="115" rx="15" ry="17" fill="#1e2937" />
                  <ellipse cx="139" cy="115" rx="15" ry="17" fill="#1e2937" />
                  <ellipse cx="107" cy="114" rx="9.5" ry="11.5" fill="#67e8f9" />
                  <ellipse cx="139" cy="114" rx="9.5" ry="11.5" fill="#67e8f9" />
                  
                  {/* Face */}
                  <ellipse cx="123" cy="128" rx="26" ry="29" fill="#f8d7b2" />
                  
                  {/* Angry Eyebrows */}
                  <path d="M102 112 Q111 106 119 109" fill="none" stroke="#1e2937" strokeWidth="2.8" strokeLinecap="round"/>
                  <path d="M128 109 Q137 105 149 111" fill="none" stroke="#1e2937" strokeWidth="2.8" strokeLinecap="round"/>
                  
                  {/* Eyes */}
                  <ellipse cx="107" cy="119" rx="4.2" ry="6.5" fill="#1e2937" />
                  <ellipse cx="139" cy="119" rx="4.2" ry="6.5" fill="#1e2937" />
                  
                  {/* Frustrated Mouth */}
                  <path d="M112 140 Q123 147 136 141" fill="none" stroke="#9f1239" strokeWidth="2.4" strokeLinecap="round"/>
                  
                  {/* Sweat Drop */}
                  <circle cx="157" cy="105" r="3.8" fill="#60a5fa" className="nf-sweat" />
                </g>
              </g>
            </svg>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            This page won't turn on.
          </h1>
          <p className="text-[15px] leading-relaxed text-zinc-400 max-w-sm mb-8">
            Our technician has been trying to fix it for hours. 
            Turns out there's just nothing behind this URL.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-zinc-950 font-bold tracking-tight bg-gradient-to-br from-rose-500 via-orange-500 to-amber-400 shadow-[0_10px_30px_-8px_rgba(249,115,22,0.6)] hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <Home className="w-4 h-4" />
              Take me back to the light
            </button>
            
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-zinc-300 border border-white/10 hover:bg-white/5 hover:text-white transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Go back
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}