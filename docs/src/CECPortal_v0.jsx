import React, { useMemo, useState } from "react";

// Hero fallback (unused but available if you set window.CEC_HERO_IMG)
const FIGURE_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABMgAAAKYCAYAAACGkMTCAAAAAXNSR0IArs4c6QAAAIRlWElmTU0AKgAAAAgABQESAAMAAAABAA" + "A" + "AA" + "";

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
var DEFAULT_APPS = { explore: "/explore", tradeoffs: "/tradeoffs", blender: "/blender" };

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
  var qp = {}; url.searchParams.forEach((v,k)=>{ qp[k]=v; });
  var cfg = {};
  if (qp.explore) cfg.explore = qp.explore;
  if (qp.tradeoffs) cfg.tradeoffs = qp.tradeoffs;
  if (qp.blender) cfg.blender = qp.blender;
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

function withEmbedded(u) {
  try { var hasQ = (u||"").includes("?"); return u + (hasQ ? "&" : "?") + "embedded=true"; }
  catch (e) { return u; }
}
function isValidHttpUrl(u) {
  if (!u) return false;
  try {
    var x = new URL(u, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    return x.protocol === "http:" || x.protocol === "https:";
  } catch (e) { return false; }
}

var TILES = [
  { key: "explore", title: "Explore Solutions",
    subtitle: "Browse near-cost-optimal technology pathways from capacity expansion model. Compare system cost, CO2, reliability, land use, transmission, and jobs across feasible build-outs.",
    icon: <IconMap className="h-8 w-8" aria-hidden />, gradient: "from-emerald-500 via-teal-500 to-sky-500" },
  { key: "tradeoffs", title: "Explore Tradeoffs",
    subtitle: "Interrogate technology & attribute trade-offs side-by-side: PV, wind, storage (incl. LDES), and transmission vs. cost, emissions, land, equity, biodiversity, viewshed, and water.",
    icon: <IconScale className="h-8 w-8" aria-hidden />, gradient: "from-amber-500 via-orange-500 to-red-500" },
  { key: "blender", title: "Preference Blender",
    subtitle: "Co-create pathways with stakeholders. Apply weights and constraints, mix elements from multiple solutions, and see viability and impacts update instantly.",
    icon: <IconBlend className="h-8 w-8" aria-hidden />, gradient: "from-indigo-500 via-violet-500 to-purple-600" },
];

export default function CECPortal() {
  const [active, setActive] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openMeth, setOpenMeth] = useState(false);
  const [openDown, setOpenDown] = useState(false);

  const activeUrl = useMemo(() => {
    if (!active) return null;
    const url = APPS[active];
    return withEmbedded(url);
  }, [active]);

  const STYLES = "@keyframes loading { from { transform: translateX(-100%); } to { transform: translateX(300%); } }";

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
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
            <a className="hover:text-zinc-900" href="#support">Support</a>
          </nav>
        </div>
      </header>

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
                  <a href="mailto:cec-team@communityenergycompass.org"
                     className="inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800">
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

        <section id="tiles" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between">
            <h3 className="text-xl font-semibold">Choose a module</h3>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TILES.map((t) => {
              const url = APPS[t.key];
              const valid = isValidHttpUrl(url);
              return (
                <article key={t.key} className="group relative flex flex-col justify-between rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
                  <div>
                    <div className={"mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br " + t.gradient + " text-white shadow"}>
                      {t.icon}
                    </div >
                    <h4 className="text-base font-semibold tracking-tight">{t.title}</h4>
                    <p className="mt-2 line-clamp-4 text-sm text-zinc-700">{t.subtitle}</p>
                  </div>
                  <div className="mt-5 flex items-center gap-3">
                    <button
                      onClick={() => { setIsLoading(true); setActive(t.key); }}
                      className={"inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium text-white " + (valid ? "bg-zinc-900 hover:bg-zinc-800" : "bg-zinc-300 cursor-not-allowed")}
                      aria-label={"Open " + t.title + " in-page"}
                      disabled={!valid}
                      title={valid ? "Open in-page" : ("Invalid URL for " + t.title + ": " + url)}
                    >
                      Open in-page <IconChevronRight className="h-4 w-4" />
                    </button>
                    <a
                      href={valid ? url : undefined}
                      target="_blank"
                      rel="noreferrer"
                      className={"inline-flex items-center justify-center rounded-2xl border px-4 py-2 text-sm font-medium " + (valid ? "border-zinc-300 hover:bg-zinc-100" : "border-zinc-200 text-zinc-400 cursor-not-allowed")}
                      onClick={(e) => { if (!valid) e.preventDefault(); }}
                      title={valid ? "Open in new tab" : ("Invalid URL for " + t.title + ": " + url)}
                    >
                      New tab <IconExternal className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="about" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm md:grid-cols-3">
            <div>
              <h3 className="text-lg font-semibold">What is CEC?</h3>
              <p className="mt-2 text-sm text-zinc-700">
                Community Energy Compass (CEC) is a transparent decision-support platform that connects capacity expansion
                modeling (e.g., GenX), Modelling to Generate Alternatives (MGA/MGCA), and geospatial siting data (CPAs) to
                surface credible options and the trade-offs behind them.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Methodological footing</h3>
              <p className="mt-2 text-sm text-zinc-700">
                Portfolios reflect near-optimal search (MGA/MGCA), best-practice storage/LDES modeling, and explicit
                siting constraints. Use CEC to discuss feasibility, not just least-cost optima.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Downscaling</h3>
              <p className="mt-2 text-sm text-zinc-700">
                We downscale national/state capacity plans to geographies using constraints, resource quality, and
                infrastructure proximity to produce siting-feasible buildouts and pixel-level impacts.
              </p>
            </div>
          </div>
        </section>

        <ConfigTester apps={APPS} />

        {active && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
            <div className="relative h-[82vh] w-full max-w-6xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl" role="dialog" aria-modal="true" aria-label="Streamlit app viewer">
              <button onClick={() => setActive(null)} className="absolute right-3 top-3 z-10 rounded-full border border-zinc-300 bg-white/90 p-2 shadow hover:bg-zinc-100" aria-label="Close">
                <IconX className="h-4 w-4" />
              </button>
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between gap-3 border-b border-zinc-200 p-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden />
                    <span>{(TILES.find((t) => t.key === active) || {}).title || ""}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <a className="inline-flex items-center gap-1 rounded-2xl border border-zinc-300 px-2.5 py-1.5 hover:bg-zinc-100" href={APPS[active]} target="_blank" rel="noreferrer">
                      Open in new tab <IconExternal className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
                <div className="h-1 w-full overflow-hidden bg-zinc-200">
                  <div className="loading-bar h-full w-1/3 animate-[loading_1.2s_ease_infinite] bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500" />
                </div>
                <iframe title={APPS[active]} src={activeUrl || undefined} className="h-full w-full" onLoad={() => { setIsLoading(false); }} referrerPolicy="strict-origin-when-cross-origin" />
              </div>
            </div>
          </div>
        )}

        <footer className="border-t border-zinc-200 bg-white/60 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs text-zinc-600">
              © {new Date().getFullYear()} Community Energy Compass. For research & educational use. Results are scenario-specific and depend on data and assumptions.
            </p>
          </div>
        </footer>

        <style>{"@keyframes loading { from { transform: translateX(-100%); } to { transform: translateX(300%); } }"}</style>
    </div>
  );
}

// ---- DEV TESTER -------------------------------------------------------------
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
          {tests.map((t, i) => (
            <li key={i} className="rounded-xl border border-emerald-200 bg-white p-3">
              <div className="font-medium">{t.name}</div>
              <div className={"mt-1 inline-flex items-center gap-2 text-xs " + (t.pass ? "text-emerald-700" : "text-red-700")}>
                <span className={"inline-block h-2.5 w-2.5 rounded-full " + (t.pass ? "bg-emerald-500" : "bg-red-500")} />
                {t.pass ? "PASS" : "FAIL"}
              </div>
              <div className="mt-2 text-xs text-zinc-700">{t.message}</div>
            </li>
          ))}
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
  Object.keys(apps).forEach((k) => {
    var url = apps[k];
    var valid = isValidHttpUrl(url);
    res.push({ name: k + " URL is valid", pass: valid, message: valid ? url : ("Invalid URL: " + String(url)) });
    var embedded = withEmbedded(url);
    var ok = /[?&]embedded=true($|&)/.test(embedded);
    res.push({ name: k + " appends embedded=true", pass: ok, message: embedded });
  });
  var defaultsOk = Object.values(DEFAULT_APPS).every((v) => typeof v === "string" && v.length > 0);
  res.push({ name: "Defaults present", pass: defaultsOk, message: JSON.stringify(DEFAULT_APPS) });
  return res;
}
