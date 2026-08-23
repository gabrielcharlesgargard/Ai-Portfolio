import React from "react";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { landingPageStyles as s } from "../assets/dummyStyles";
import { PageBackdrop } from "../assets/ui";
import {
  ArrowUp,
  ChevronRight,
  Sparkles,
  Zap,
  Wand2,
  Globe,
  Code2,
  Layers,
  Shield,
} from "lucide-react";
import Footer from "../Components/Footer";

const LandingPage = () => {
  return (
    <div className={s.container}>
      <Navbar />
      <Hero />
      <ShowcasePreview />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;

const Hero = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const isAuthed = Boolean(user);
  const [prompt, setPrompt] = useState("");

  // to create
  function handleCreate() {
    const trimed = prompt.trim();
    if (isAuthed) {
      navigate(
        trimed
          ? `/dashboard?prompt=${encodeURIComponent(trimed)}`
          : `/dashboard`,
      );
    } else {
      navigate("/register");
    }
  }

  return (
    <section className={s.heroSection}>
      <PageBackdrop grid />

      <div className={s.heroInner}>
        <button onClick={() => navigate("/pricing")} className={s.trialBadge}>
          <span className={s.trialBadgeNew}>New</span>
          <span className={s.trialBadgeText}>Get started for free</span>
          <ChevronRight className={s.trialBadgeIcon} />
        </button>

        <h1 className={s.heroTitle}>
          Turn thoughts into Websites
          <br />
          Instantly, with{" "}
          <span className={s.heroTitleHighlight}>AI Builder</span>
        </h1>

        <p className={s.heroSub}>
          Create beautiful websites and Published with AI Portfolio. Build your
          own websites, blogs, and publications with AI Portfolio.
        </p>

        <div className={s.heroInputWrapper}>
          <div
            className={s.heroInputGlow}
            style={{
              background:
                "conic-gradient(from 180deg at 50% 50%, #ff8a4c 0deg, transparent 70deg, transparent 290deg, #ff5c5c 360deg)",
            }}
          />
          <div className={s.heroInputBox}>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleCreate();
                }
              }}
              rows={3}
              placeholder="Describe your website in detail..."
              className={s.heroTextarea}
            />
            <div className={s.heroInputFooter}>
              <div className={s.heroInputHint}>
                <Sparkles className={s.heroInputHintIcon} />
                Powered by mintsite
              </div>
              <button onClick={handleCreate} className={s.heroCreateButton}>
                Create with AI <ArrowUp className={s.heroCreateButtonIcon} />
              </button>
            </div>
          </div>
        </div>

        <div className={s.heroTrust}>
          <p className={s.heroTrustLabel}>Trusted by builders shipping with</p>

          <div className={`${s.heroTrustLogos} `}>
            <span className={`${s.heroTrustItem}`}>
              <span className={`${s.heroTrustDot} bg-rose-400`}></span>
              <p>Next.js</p>
            </span>

            <span className={s.heroTrustItem}>
              <span className={`${s.heroTrustDot} bg-orange-400`}></span>
              <p>Tailwind</p>
            </span>

            <span className={s.heroTrustItem}>
              <span className={`${s.heroTrustDot} bg-amber-400`}></span>
              <p>Gimini</p>
            </span>

            <span className={s.heroTrustItem}>
              <span className={`${s.heroTrustDot} bg-violet-400`}></span>
              <p>MongoDB</p>
            </span>

            <span className={s.heroTrustItem}>
              <span className={`${s.heroTrustDot} bg-emerald-400`}></span>
              <p>GitHub</p>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

const previewFiles = [
  { label: "Hero Section", icon: Layers, tint: "text-orange-300" },
  { label: "About Me", icon: Wand2, tint: "text-violet-300" },
  { label: "Projects Grid", icon: Code2, tint: "text-cyan-300" },
  { label: "Contact Form", icon: Globe, tint: "text-emerald-300" },
];

const ShowcasePreview = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-2xl border border-white/8 bg-[#0a0b0c] overflow-hidden shadow-[0_40px_100px_-40px_rgba(0,0,0,0.6)]">
          {/* Window top bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/6 bg-white/3">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-300/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-300/70" />
            <p className="ml-2 text-[12.5px] font-medium text-white/70">
              Creative Portfolio — built with AI Builder
            </p>
            <button
              onClick={() => navigate("/register")}
              className="ml-auto text-[12px] font-semibold px-3 py-1.5 rounded-md bg-white/6 hover:bg-white/10 text-white/80 transition"
            >
              Open
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] min-h-[340px]">
            {/* Left: mini file / section list */}
            <div className="hidden md:flex flex-col border-r border-white/6 bg-[#0c0d0f] p-3 gap-1">
              <p className="text-[11px] uppercase tracking-[0.14em] text-white/35 px-2 mb-1">
                Sections
              </p>
              {previewFiles.map(({ label, icon: Icon, tint }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-2 py-2 rounded-lg text-[12.5px] text-white/70 hover:bg-white/5 transition"
                >
                  <Icon className={`w-3.5 h-3.5 ${tint}`} />
                  {label}
                </div>
              ))}
            </div>

            {/* Right: mock rendered site */}
            <div className="p-6 sm:p-10 bg-[#0f1011] flex flex-col justify-center">
              <p className="text-[11px] uppercase tracking-[0.16em] text-orange-300/80 font-medium mb-2">
                Live preview
              </p>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-3">
                Creative Portfolio
              </h3>
              <p className="text-[13.5px] text-white/55 leading-relaxed max-w-md mb-5">
                Generated from a single prompt — a full portfolio with a hero,
                project gallery, testimonials and a contact form, ready to
                publish in one click.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-md bg-white/6 border border-white/8 text-[12px] text-white/70">
                  Work
                </span>
                <span className="px-3 py-1.5 rounded-md bg-white/6 border border-white/8 text-[12px] text-white/70">
                  Testimonials
                </span>
                <span className="px-3 py-1.5 rounded-md bg-rose-500/90 text-[12px] font-semibold text-white">
                  Contact
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const features = [
  {
    icon: Zap,
    title: "Generate in seconds",
    desc: "Describe what you want and get a finished, working site in under three seconds.",
    tint: "from-orange-400/30 to-red-400/10",
    color: "text-orange-300",
  },
  {
    icon: Wand2,
    title: "Refine by chatting",
    desc: "Iterate on copy, sections and styling with plain-English requests. No design skills required.",
    tint: "from-violet-400/30 to-fuchsia-400/10",
    color: "text-violet-300",
  },
  {
    icon: Globe,
    title: "Publish in one click",
    desc: "Deploy to a free mintsite.app subdomain or bring your own domain when you're ready.",
    tint: "from-cyan-400/30 to-sky-400/10",
    color: "text-cyan-300",
  },
  {
    icon: Code2,
    title: "Own your code",
    desc: "Export production-ready HTML and CSS anytime. No lock-in, no proprietary file formats.",
    tint: "from-emerald-400/30 to-teal-400/10",
    color: "text-emerald-300",
  },
  {
    icon: Layers,
    title: "Component library",
    desc: "Reusable hero, pricing, and feature blocks that always stay visually consistent.",
    tint: "from-amber-400/30 to-yellow-400/10",
    color: "text-amber-300",
  },
  {
    icon: Shield,
    title: "Built-in best practices",
    desc: "Accessible, responsive, and SEO-ready output that scores top marks on Lighthouse.",
    tint: "from-pink-400/30 to-rose-400/10",
    color: "text-pink-300",
  },
];

const Features = () => {
  return (
    <section className={s.featuresSection}>
      <div className={s.featuresInner}>
        <div className={s.featuresHeader}>
          <p className={s.featuresBadge}>Features</p>
          <h2 className={s.featuresTitle}>
            EveryThing you need to{" "}
            <span className={s.featuresTitleHighlight}>build a website</span>
          </h2>

          <p className={s.featuresSub}>
            A complete toolkit for designing, refining, and publishing mordern
            websites - without leaving your browser.
          </p>
        </div>

        <div className={s.featuresGrid}>
          {features.map(({ icon: Icon, title, desc, tint, color }) => (
            <div className={s.featureCard} key={title}>
              <div
                className={`${s.featureIconWrapper} bg-linear-to-br ${tint}`}
              >
                <Icon className={`${s.featureIcon} ${color}`} />
              </div>
              <h3 className={s.featureTitle}>{title}</h3>
              <p className={s.featureDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const isAuthed = Boolean(user);
  const ctaHref = isAuthed ? "/dashboard" : "/register";
  const ctaText = isAuthed ? "Start a new site" : "Create your first site";

  return (
    <section className={s.ctaSection}>
      <div className={s.ctaBg} style={s.ctaBgStyle} />
      <div className={s.ctaInner}>
        <div className={s.ctaFreeBadge}>
          <Sparkles className={s.ctaFreeBadgeIcon} />
          <p className={s.ctaFreeBadgeLabel}>20 free credits on signup</p>
        </div>

        <h2 className={s.ctaTitle}>
          Stop wireframing
          <br />
          Start <span className={s.ctaTitleHighlight}>building</span>
        </h2>

        <p className={s.ctaSub}>
          Your first 20 creadits are on us - enough for 4 new sites or 10
          changes. No card required.
        </p>

        <button className={s.ctaButton} onClick={() => navigate(ctaHref)}>
          {ctaText}
          <ArrowUp className={s.ctaButtonIcon} />
        </button>
      </div>
    </section>
  );
};
