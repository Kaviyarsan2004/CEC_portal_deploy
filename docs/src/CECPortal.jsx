import React, { useMemo, useState } from "react";

// Inlined hero figure as a data URL to ensure visibility in preview
const FIGURE_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABMgAAAKYCAYAAACGkMTCAAAAAXNSR0IArs4c6QAAAIRlWElmTU0AKgAAAAgABQESAAMAAAABAA" +
"A" +
"AA" +
"";

// ============================================================================
// CEC Portal (React) — 3‑Tile Edition (Pattern A)
// Zero external UI deps in preview (no framer-motion, no lucide-react)
// to avoid bundler/ESM syntax issues. Pure React + inline SVG icons.
// Tiles: Explore Solutions · Explore Tradeoffs · Preference Blender
// Includes dev Config Tester (?dev=1). Deployment notes are stored in a
// harmless string constant at the bottom (not rendered or executed).
// ============================================================================

// ---- SIMPLE INLINE ICONS (avoid external packages) -------------------------
const IconMap = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden {...props}>
    <path d="M9 3l6 2 6-2v18l-6 2-6-2-6 2V5l6-2z" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M9 3v18M15 5v18" fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
const IconScale = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden {...props}>
    <path d="M12 3v18M4 9h16" fill="none" stroke="currentColor" strokeWidth="2"/>
    <path d="M6 9l-3 6h6l-3-6zm12 0l-3 6h6l-3-6z" fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
const IconBlend = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden {...props}>
    <circle cx="9" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="2"/>
    <circle cx="15" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
const IconChevronRight = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden {...props}><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
);
const IconExternal = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden {...props}><path d="M14 3h7v7M10 14L21 3M21 10v11H3V3h11" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
);
const IconX = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden {...props}><path d="M18 6L6 18M6 6l12 12" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
);

// ---- CONFIG LOADER ----------------------------------------------------------
// Priority order for each module URL:
// 1) URL query string (e.g., ?explore=/explore)
// 2) window.CEC_APPS global (set via <script> before this bundle)
// 3) process.env (only if available — guarded)
// 4) Sane defaults (relative paths so nginx base paths work out of the box)

var DEFAULT_APPS = {
  explore: "/explore",
  tradeoffs: "/tradeoffs",
  blender: "/blender",
};

function safeEnv(key) {
  try {
    if (typeof process !== "undefined" && process && process.env) {
      return process.env[key];
    }
  } catch (e) {}
  return undefined;
}

function fromQueryParams() {
  if (typeof window === "undefined") return {};
  var url = new URL(window.location.href);
  var qp = {};
  url.searchParams.forEach(function (v, k) { qp[k] = v; });
  var cfg = {};
  if (qp.explore) cfg.explore = qp.explore;
  if (qp.tradeoffs) cfg.tradeoffs = qp.tradeoffs;
  if (qp.blender) cfg.blender = qp.blender;
  // Backwards compatibility: accept old params
  if (!cfg.tradeoffs && (qp.technologyTradeoffs || qp.attributeTradeoffs)) {
    cfg.tradeoffs = qp.technologyTradeoffs || qp.attributeTradeoffs;
  }
  return cfg;
}

function buildAppConfig() {
  var fromWindow = (typeof window !== "undefined" ? window.CEC_APPS : undefined) || {};
  var fromEnv = {
    explore: safeEnv("NEXT_PUBLIC_CEC_EXPLORE_URL"),
    tradeoffs: safeEnv("NEXT_PUBLIC_CEC_TRADEOFFS_URL"),
    blender: safeEnv("NEXT_PUBLIC_CEC_BLEND_URL"),
  };
  return Object.assign({}, DEFAULT_APPS, fromEnv, fromWindow, fromQueryParams());
}

var APPS = buildAppConfig();

// Hero image resolver: allow ?hero=<url> or window.CEC_HERO_IMG; fallback to inline SVG
const HERO_FALLBACK = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600">
    <rect width="1200" height="600" fill="white"/>
    <rect x="40" y="40" width="1120" height="520" fill="#f8fafc" stroke="#d4d4d8"/>
    <text x="600" y="300" font-family="Inter, Arial, sans-serif" font-size="28" text-anchor="middle" fill="#374151">CEC conceptual framework — image placeholder</text>
    <text x="600" y="340" font-family="Inter, Arial, sans-serif" font-size="16" text-anchor="middle" fill="#6b7280">Provide ?hero=https://... to show the real figure</text>
  </svg>
`);
const HERO_IMG = (function(){
  try {
    if (typeof window !== 'undefined') {
      const u = new URL(window.location.href);
      const qp = u.searchParams.get('hero');
      if (qp) return qp;
      if (window.CEC_HERO_IMG) return window.CEC_HERO_IMG;
    }
  } catch(e) {}
  return HERO_FALLBACK;
})();

// ---- UTILITIES --------------------------------------------------------------
function withEmbedded(u) {
  try {
    var hasQuery = (u || "").indexOf("?") !== -1;
    return u + (hasQuery ? "&" : "?") + "embedded=true";
  } catch (e) {
    return u;
  }
}

function isValidHttpUrl(u) {
  if (!u) return false;
  try {
    var x = new URL(u, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    return x.protocol === "http:" || x.protocol === "https:";
  } catch (e) {
    return false;
  }
}

// ---- TILES ------------------------------------------------------------------
var TILES = [
  {
    key: "explore",
    title: "Explore Solutions",
    subtitle:
      "Browse near-cost-optimal technology pathways from capacity expansion model. Compare system cost, CO2, reliability, land use, transmission, and jobs across feasible build-outs.",
    icon: <IconMap className="h-8 w-8" aria-hidden />,
    gradient: "from-emerald-500 via-teal-500 to-sky-500",
  },
  {
    key: "tradeoffs",
    title: "Explore Tradeoffs",
    subtitle:
      "Interrogate technology & attribute trade-offs side-by-side: PV, wind, storage (incl. LDES), and transmission vs. cost, emissions, land, equity, biodiversity, viewshed, and water.",
    icon: <IconScale className="h-8 w-8" aria-hidden />,
    gradient: "from-amber-500 via-orange-500 to-red-500",
  },
  {
    key: "blender",
    title: "Preference Blender",
    subtitle:
      "Co-create pathways with stakeholders. Apply weights and constraints, mix elements from multiple solutions, and see viability and impacts update instantly.",
    icon: <IconBlend className="h-8 w-8" aria-hidden />,
    gradient: "from-indigo-500 via-violet-500 to-purple-600",
  },
];

// ---- COMPONENT --------------------------------------------------------------
export default function CECPortal() {
  const [active, setActive] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openMeth, setOpenMeth] = useState(false);
  const [openDown, setOpenDown] = useState(false);

  const activeUrl = useMemo(function () {
    if (!active) return null;
    const url = APPS[active];
    return withEmbedded(url);
  }, [active]);

  const STYLES = "@keyframes loading { from { transform: translateX(-100%); } to { transform: translateX(300%); } }";

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-emerald-500 to-sky-500" aria-hidden />
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Community Energy Compass</h1>
              <p className="text-xs text-zinc-600">Decision support for equitable, resilient clean energy build-outs</p>
            </div>
          </div>
          <nav className="hidden gap-6 text-sm font-medium text-zinc-700 md:flex">
            <a className="hover:text-zinc-900" href="#tiles">Apps</a>
            <a className="hover:text-zinc-900" href="#about">About</a>
            <a className="hover:text-zinc-900" href="#team">Team</a>
            <a className="hover:text-zinc-900" href="#support">Support</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Explore energy-transition trade-offs — fast, transparent, stakeholder-ready
              </h2>
              <p className="mt-4 text-zinc-700">
                Turn models into conversations: explore pathways, make trade-offs transparent, and co-create solutions that communities can support.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href="#tiles" className="inline-flex items-center gap-2 rounded-2xl border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100">
                  Get started <IconChevronRight className="h-4 w-4" />
                </a>
                <a
                  href="mailto:cec-team@communityenergycompass.org"
                  className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                >
                  Contact us
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[16/10] w-full rounded-3xl border border-zinc-200 bg-white shadow-sm">
                <img src={HERO_IMG} alt="CEC conceptual framework" className="h-full w-full object-contain bg-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tiles */}
      <section id="tiles" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <h3 className="text-xl font-semibold">Choose a module</h3>
          
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TILES.map(function (t) {
            const url = APPS[t.key];
            const valid = isValidHttpUrl(url);
            return (
              <article
                key={t.key}
                className="group relative flex flex-col justify-between rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <div>
                  <div
                    className={"mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br " + t.gradient + " text-white shadow"}
                  >
                    {t.icon}
                  </div>
                  <h4 className="text-base font-semibold tracking-tight">{t.title}</h4>
                  <p className="mt-2 line-clamp-4 text-sm text-zinc-700">{t.subtitle}</p>
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <button
                    onClick={function () { if (valid && url) { window.open(url, "_blank", "noopener,noreferrer"); } }}
                    className={("inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium text-white ") + (valid ? "bg-zinc-900 hover:bg-zinc-800" : "bg-zinc-300 cursor-not-allowed")}
                    aria-label={"Open " + t.title}
                    disabled={!valid}
                    title={valid ? "Open" : ("Invalid URL for " + t.title + ": " + url)}
                  >
                    Open <IconChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm md:grid-cols-3">
          {/* 1) What is CEC (unchanged) */}
          <div>
            <h3 className="text-lg font-semibold">What is CEC?</h3>
            <p className="mt-2 text-sm text-zinc-700">
              Community Energy Compass (CEC) is a transparent decision-support platform that connects capacity expansion
              modeling (e.g., GenX), Modelling to Generate Alternatives (MGA/MGCA), and geospatial siting data (CPAs) to
              surface credible options and the trade-offs behind them.
            </p>
          </div>

          {/* 2) Methodological footing (now second, expandable) */}
          <div>
            <h3 className="text-lg font-semibold">Methodological footing</h3>
            <p className="mt-2 text-sm text-zinc-700">
              Portfolios reflect near-optimal search (MGA/MGCA), best-practice storage/LDES modeling, and explicit
              siting constraints. Use CEC to discuss feasibility, not just least-cost optima.
            </p>
            <button onClick={() => setOpenMeth(!openMeth)} className="mt-3 inline-flex items-center rounded-2xl border border-zinc-300 px-3 py-1.5 text-xs font-medium hover:bg-zinc-100">Details</button>
            {openMeth && (
              <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700">
                <p>
                  Capacity expansion models (e.g., GenX) optimize long-run build and dispatch under policy and reliability
                  constraints. Modelling to Generate Alternatives (MGA/MGCA) explores the near-cost-optimal region to
                  surface structurally different pathways that preserve feasibility and performance.
                </p>
                <p className="mt-2">
                  Learn more: <a className="underline" href="https://github.com/GenXProject/GenX" target="_blank" rel="noreferrer">GenX on GitHub</a>.
                </p>
              </div>
            )}
          </div>

          {/* 3) Downscaling (now third, expandable) */}
          <div>
            <h3 className="text-lg font-semibold">Downscaling</h3>
            <p className="mt-2 text-sm text-zinc-700">
              We downscale national/state capacity plans to geographies using constraints, resource quality, and
              infrastructure proximity to produce siting-feasible buildouts and pixel-level impacts.
            </p>
            <button onClick={() => setOpenDown(!openDown)} className="mt-3 inline-flex items-center rounded-2xl border border-zinc-300 px-3 py-1.5 text-xs font-medium hover:bg-zinc-100">Details</button>
            {openDown && (
              <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700">
                <p>
                  The downscaling pipeline integrates land-use exclusions, technical potential, and grid/topography
                  filters to translate system-level capacity decisions into map-ready layers.
                </p>
                <p className="mt-2">
                  Land-use methodology: <a className="underline" href="https://www.sciencedirect.com/science/article/abs/pii/S2666278723000144" target="_blank" rel="noreferrer">Energy &amp; AI (2023)</a>.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Support */}
      

      {/* Team */}
      <section id="team" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Team</h3>
          <TeamGrid />
        </div>
      </section>

      {/* Dev: Config Tester (acts as test cases). Visible with ?dev=1) */}
      <ConfigTester apps={APPS} />

      {/* In‑page App Viewer Overlay */}
      {active && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div
            className="relative h-[82vh] w-full max-w-6xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Streamlit app viewer"
          >
            <button
              onClick={function() { setActive(null); }}
              className="absolute right-3 top-3 z-10 rounded-full border border-zinc-300 bg-white/90 p-2 shadow hover:bg-zinc-100"
              aria-label="Close"
            >
              <IconX className="h-4 w-4" />
            </button>

            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between gap-3 border-b border-zinc-200 p-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden />
                  <span>{(TILES.find(function (t) { return t.key === active; }) || {}).title || ""}</span>
                </div>
                
              </div>

              {/* Loading bar */}
              {isLoading && (
                <div className="h-1 w-full overflow-hidden bg-zinc-200">
                  <div className="loading-bar h-full w-1/3 animate-[loading_1.2s_ease_infinite] bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500" />
                </div>
              )}

              <iframe
                title={APPS[active]}
                src={activeUrl || undefined}
                className="h-full w-full"
                onLoad={function () { setIsLoading(false); }}
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        </div>
      )}

      <section id="support" className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Support & Feedback</h3>
          <p className="mt-2 text-sm text-zinc-700">
            Found a bug or have a feature request? Email <a className="underline" href="mailto:cec-team@communityenergycompass.org">cec-team@communityenergycompass.org</a>.
          </p>
        </div>
      </section>

      <footer className="border-t border-zinc-200 bg-white/60 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Community Energy Compass. For research & educational use. Results are scenario-specific and depend on data and assumptions.
          </p>
        </div>
      </footer>

      {/* local animation keyframes */}
      <style>{STYLES}</style>
    </div>
  );
}

// ---- TEST CASES / DEV DIAGNOSTICS ------------------------------------------
// Visible when ?dev=1 is present in the URL. Verifies config resolution and URLs.

function useDevMode() {
  if (typeof window === "undefined") return false;
  var url = new URL(window.location.href);
  return url.searchParams.get("dev") === "1";
}

function ConfigTester({ apps }) {
  var dev = useDevMode();
  if (!dev) return null;

  var tests = runConfigTests(apps);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-emerald-300 bg-emerald-50 p-6 text-sm">
        <h3 className="text-base font-semibold text-emerald-900">Dev: Config Tester</h3>
        <ul className="mt-3 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {tests.map(function (t, i) {
            return (
              <li key={i} className="rounded-xl border border-emerald-200 bg-white p-3">
                <div className="font-medium">{t.name}</div>
                <div className={("mt-1 inline-flex items-center gap-2 text-xs ") + (t.pass ? "text-emerald-700" : "text-red-700")}>
                  <span className={("inline-block h-2.5 w-2.5 rounded-full ") + (t.pass ? "bg-emerald-500" : "bg-red-500")} />
                  {t.pass ? "PASS" : "FAIL"}
                </div>
                <div className="mt-2 text-xs text-zinc-700">{t.message}</div>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs text-emerald-900">
          Tip: override config via query params, e.g.: <code>?explore=/explore&tradeoffs=/tradeoffs</code>
        </p>
      </div>
    </section>
  );
}

function runConfigTests(apps) {
  var res = [];

  Object.keys(apps).forEach(function (k) {
    var url = apps[k];
    var valid = isValidHttpUrl(url);
    res.push({ name: k + " URL is valid", pass: valid, message: valid ? url : ("Invalid URL: " + String(url)) });

    var embedded = withEmbedded(url);
    var hasEmbedded = /[?&]embedded=true($|&)/.test(embedded);
    res.push({ name: k + " appends embedded=true", pass: hasEmbedded, message: embedded });
  });

  var defaultsOk = Object.values(DEFAULT_APPS).every(function (v) { return typeof v === "string" && v.length > 0; });
  res.push({ name: "Defaults present", pass: defaultsOk, message: JSON.stringify(DEFAULT_APPS) });

  return res;
}

// ---- TEAM DATA / COMPONENTS ----------------------------------------------
function getTeamData() {
  try {
    if (typeof window !== 'undefined' && Array.isArray(window.CEC_TEAM)) {
      return window.CEC_TEAM;
    }
  } catch (e) {}
  return [
    { name: 'Neha Patankar', role: 'Team lead', linkedin: '', photo: null },
    { name: 'Kaviyarasan Ganesamoorthy', role: 'Student member', linkedin: '', photo: null },
    { name: 'Xin Wang', role: 'Student member', linkedin: '', photo: null },
    { name: 'Mike Lau', role: 'Student member', linkedin: '', photo: null },
  ];
}

function initialsFromName(name) {
  try {
    return (name || '')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(s => s[0].toUpperCase())
      .join('');
  } catch (e) { return ''; }
}

function Avatar({ photo, name }) {
  if (photo) {
    return <img src={photo} alt={name} className="h-14 w-14 rounded-full object-cover" />;
  }
  return (
    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 text-white grid place-items-center text-sm font-semibold">
      {initialsFromName(name)}
    </div>
  );
}

function TeamGrid() {
  const team = getTeamData();
  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {team.map(function(m, i) {
        return (
          <div key={i} className="flex items-center gap-3 rounded-2xl border border-zinc-200 p-3">
            <Avatar photo={m.photo} name={m.name} />
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{m.name}</div>
              <div className="truncate text-xs text-zinc-600">{m.role}</div>
              {m.linkedin ? (
                <a href={m.linkedin} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-emerald-700 hover:underline">LinkedIn</a>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---- DEPLOYMENT NOTES (kept outside JSX to avoid syntax errors) -------------
const DEPLOYMENT_NOTES = String.raw`
================================================================================
Pattern A Deployment Assets (Paths on apps.communityenergycompass.org)
--------------------------------------------------------------------------------
This configuration runs three Streamlit services and an nginx reverse‑proxy that
exposes:
  /explore
  /tradeoffs
  /blender

TLS: terminate with a load balancer or add certbot/auto‑TLS in front of nginx.
If using Cloudflare, set the DNS record for apps.communityenergycompass.org to
"Proxied" and keep HTTPS enforced there.
================================================================================

File: docker-compose.yml
----------------------------------------
version: "3.9"
services:
  nginx:
    image: nginx:1.27-alpine
    container_name: cec-nginx
    ports:
      - "80:80"   # put TLS in front (LB) or extend to 443 with certbot
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - explore
      - tradeoffs
      - blender
    networks: [cecnet]

  explore:
    image: streamlit/streamlit:latest
    container_name: cec-explore
    working_dir: /app
    volumes:
      - ./apps/explore:/app
    command: >-
      streamlit run app.py
      --server.port=8501
      --server.address=0.0.0.0
      --server.baseUrlPath=/explore
      --server.enableCORS=false
      --server.enableXsrfProtection=false
      --browser.gatherUsageStats=false
    networks: [cecnet]

  tradeoffs:
    image: streamlit/streamlit:latest
    container_name: cec-tradeoffs
    working_dir: /app
    volumes:
      - ./apps/tradeoffs:/app
    command: >-
      streamlit run app.py
      --server.port=8502
      --server.address=0.0.0.0
      --server.baseUrlPath=/tradeoffs
      --server.enableCORS=false
      --server.enableXsrfProtection=false
      --browser.gatherUsageStats=false
    networks: [cecnet]

  blender:
    image: streamlit/streamlit:latest
    container_name: cec-blender
    working_dir: /app
    volumes:
      - ./apps/blender:/app
    command: >-
      streamlit run app.py
      --server.port=8503
      --server.address=0.0.0.0
      --server.baseUrlPath=/blender
      --server.enableCORS=false
      --server.enableXsrfProtection=false
      --browser.gatherUsageStats=false
    networks: [cecnet]

networks:
  cecnet: {}

----------------------------------------
File: nginx.conf
----------------------------------------
user  nginx;
worker_processes  auto;
error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;

events { worker_connections 1024; }

http {
  include       /etc/nginx/mime.types;
  default_type  application/octet-stream;
  sendfile      on;
  tcp_nopush    on;
  server_tokens off;

  map $http_upgrade $connection_upgrade { default upgrade; '' close; }

  upstream explore_up  { server explore:8501; }
  upstream tradeoffs_up{ server tradeoffs:8502; }
  upstream blend_up    { server blender:8503; }

  # Allow embedding from the apex portal
  map $http_host $csp_frame_ancestors {
    default "frame-ancestors https://communityenergycompass.org";
  }

  server {
    listen 80;
    server_name apps.communityenergycompass.org;

    add_header Content-Security-Policy "$csp_frame_ancestors" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location = /healthz { add_header Content-Type text/plain; return 200 'ok'; }

    # Explore
    location ~ ^/(explore)(/.*)?$ {
      proxy_set_header Host $host;
      proxy_set_header X-Forwarded-For $remote_addr;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection $connection_upgrade;
      proxy_buffering off;
      proxy_read_timeout 3600s;
      proxy_pass http://explore_up;
    }

    # Tradeoffs (tech + attributes)
    location ~ ^/(tradeoffs)(/.*)?$ {
      proxy_set_header Host $host;
      proxy_set_header X-Forwarded-For $remote_addr;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection $connection_upgrade;
      proxy_buffering off;
      proxy_read_timeout 3600s;
      proxy_pass http://tradeoffs_up;
    }

    # Preference Blender
    location ~ ^/(blender)(/.*)?$ {
      proxy_set_header Host $host;
      proxy_set_header X-Forwarded-For $remote_addr;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection $connection_upgrade;
      proxy_buffering off;
      proxy_read_timeout 3600s;
      proxy_pass http://blend_up;
    }

    location / { return 404; }
  }
}

----------------------------------------
File: apps/**/streamlit.config.toml (optional)
----------------------------------------
[server]
port = 8501  # change per service
address = "0.0.0.0"
baseUrlPath = "/explore"  # change per service
enableCORS = false
enableXsrfProtection = false

[browser]
gatherUsageStats = false

----------------------------------------
Smoke test checklist (acts as manual tests)
----------------------------------------
1) Bring services up: docker compose up -d
2) Open:  http://apps.communityenergycompass.org/healthz  →  ok
3) Open:  http://apps.communityenergycompass.org/explore?embedded=true  → Explore OK
4) Open:  http://apps.communityenergycompass.org/tradeoffs?embedded=true → Tradeoffs OK
5) Open:  http://apps.communityenergycompass.org/blender?embedded=true   → Blender OK
6) Portal (apex): https://communityenergycompass.org?dev=1 → tests PASS
`;
