// @ts-nocheck
// CollexIQ — Single-Page App (React + Tailwind)
// Label: V4.3 (Runtime Fix) — Corrected a runtime error by setting the production backend URL.
// Notes:
// - Fixed a 'process is not defined' error by hardcoding the live backend URL.
// - This change connects the live front-end to the live back-end server.
import React, { useEffect, useMemo, useState } from "react";

/*************************************
 * Theme & constants
 *************************************/
const COLORS = {
  base: "#0b1b33",
  baseDeep: "#081427",
  card: "#0f2140",
  border: "#1f3355",
  text: "#ffffff",
  textDim: "#cbd5e1",
  amber: "#f59e0b",
  blue: "#60a5fa",
};

const STRIPE_LINKS = {
  starter: "https://buy.stripe.com/5kQ3cvg82fAeaGkfO6fIs04",
  pro: "https://buy.stripe.com/eVq3cv1d81JobKogSafIs06",
  agency: "https://buy.stripe.com/bJe14n9JEfAe7u8dFYfIs07",
};

// This is the URL of your live backend server on Render.
const BACKEND_URL = "https://collexiq-backend.onrender.com";

/*************************************
 * Data
 *************************************/
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
function makeHeroData(){ return months.map((m,i)=>({ month:m, emails: 20 + ((i*7)%60), syncs: 15 + ((i*11)%50) })); }
function makeDashData(){ return months.map((m,i)=>({ month:m, emails: (i+1)*15 + ((i%3)*10) })); }

const testimonials = [
  { name: "Alex P.", role: "Head of Ops, Fintech", img: "https://i.pravatar.cc/96?img=12", quote: "CollexIQ streamlined our collections workflows. The dashboard is crystal clear and our team ramped up in days." },
  { name: "Morgan S.", role: "Founder, SaaS", img: "https://i.pravatar.cc/96?img=32", quote: "From mapping fields to syncing with our CRM, the setup was minutes. Billing is predictable and fair." },
  { name: "Priya N.", role: "RevOps Lead", img: "https://i.pravatar.cc/96?img=5", quote: "The Stripe billing and export compliance story gave our board instant confidence. We shipped faster." },
  { name: "Diego R.", role: "Collections Manager", img: "https://i.pravatar.cc/96?img=22", quote: "Our agents finally have one clean view. Fewer manual exports and CSV headaches." },
  { name: "Sam T.", role: "Growth", img: "https://i.pravatar.cc/96?img=15", quote: "We turned on the trial and upgraded the same week. Great docs, simple UI, helpful support." },
  { name: "Lin M.", role: "Engineer", img: "https://i.pravatar.cc/96?img=68", quote: "The webhook plus Zapier combo is clutch. We plugged into our stack without backend changes." },
];

const recentCaptures = [
  { email: "jane@example.com", date: "2025-09-01" },
  { email: "mark@company.com", date: "2025-09-02" },
  { email: "sofia@domain.org", date: "2025-09-03" },
  { email: "user@web.com", date: "2025-09-03" },
  { email: "test@demo.co", date: "2025-09-04" },
];

/*************************************
 * Icon shims (lucide-like)
 *************************************/
function Icon({ d, size=20, strokeWidth=2, fill="none", stroke="currentColor", ...rest }){
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      <path d={d}/>
    </svg>
  );
}
const Star = (p)=> <Icon {...p} d="M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill={COLORS.amber} stroke="none" />;
const Menu = (p)=> <Icon {...p} d="M3 6h18M3 12h18M3 18h18"/>;
const BarChart2 = (p)=> <Icon {...p} d="M3 3v18M7 13v8M11 9v12M15 5v16M19 1v20"/>;
const Database = (p)=> <Icon {...p} d="M4 6c0-2 16-2 16 0s-16 2-16 0zm0 6c0-2 16-2 16 0s-16 2-16 0zm0 6c0-2 16-2 16 0s-16 2-16 0"/>;
const Layers = (p)=> <Icon {...p} d="M12 2l9 5-9 5-9-5 9-5zm-9 9l9 5 9-5"/>;
const Check = (p)=> <Icon {...p} d="M20 6L9 17l-5-5"/>;
const Lock = (p)=> <Icon {...p} d="M6 10V8a6 6 0 1112 0v2M5 10h14v10H5z"/>;
const LogOut = (p)=> <Icon {...p} d="M9 21H3v-6M3 21l9-9M21 12H12"/>;
const FileDown = (p)=> <Icon {...p} d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"/>;
const UserCircle = (p)=> <Icon {...p} d="M12 12a5 5 0 100-10 5 5 0 000 10zm-8 10a8 8 0 1116 0z"/>;
const ArrowUp = (p)=> <Icon {...p} d="M12 19V5m0 0l-6 6m6-6l6 6"/>;
const ChevronDown = (p) => <Icon {...p} d="m6 9 6 6 6-6"/>;
const Zap = (p)=> <Icon {...p} d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>;
const CreditCard = (p)=> <Icon {...p} d="M2 6h20v12H2z M2 10h20"/>;
const Settings = (p)=> <Icon {...p} d="M12 8a4 4 0 100 8 4 4 0 000-8z M3 12h3M18 12h3M12 3v3M12 18v3"/>;
const LayoutDashboard = (p)=> <Icon {...p} d="M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z"/>;
const FacebookIcon = (p) => <Icon {...p} fill="currentColor" stroke="none" d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />;
const InstagramIcon = (p) => <Icon {...p} fill="none" stroke="currentColor" d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0 M16.5 7.5v.01"/>;
const XSocialIcon = (p) => <Icon {...p} fill="currentColor" stroke="none" d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 7.184L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298l13.312 17.404z" />;
const LinkedInIcon = (p) => <Icon {...p} fill="currentColor" stroke="none" d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />;

const GoogleSheetsIcon = (p) => <svg {...p} viewBox="0 0 32 32"><g fill="none" fillRule="evenodd"><path fill="#20A464" d="M20 2H10a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7l-5-5z"/><path fill="#188350" d="M22 7h-5V2l5 5z"/><path fill="#fff" d="M11 14h10v2H11zm0 4h10v2H11zm0 4h5v2h-5z"/></g></svg>;
const MailchimpIcon = (p) => <svg {...p} viewBox="0 0 40 40"><path d="M38.6 22.4c-.8-1-2-1.6-3.3-1.6-1.1 0-2.1.4-2.9 1.2s-1.2 1.8-1.2 2.9c0 1.3 1.1 3.2 1.4 3.7l.5.6c.3.4.7.6 1.1.6.4 0 .8-.2 1.1-.6.3-.4 2.1-2.4 2.1-4.2.1-1.3-.6-2.5-1.8-3.4zm-1.8 4.8c-.3-.4-1.1-2-1.1-2.9 0-.6.2-1.2.7-1.6.5-.4 1-.7 1.6-.7s1.2.2 1.6.7c.4.4.7 1 .7 1.6 0 1.2-1.2 2.9-1.6 3.4-.1.1-.3.1-.4 0-.1 0-.3-.1-.5-.5zM22.5 13c-2.3-1.6-5-2.6-8-2.6-4.6 0-8.8 2.5-11.4 6.4-1.2 1.9-1.9 4-1.9 6.3 0 5.4 3.4 10 8.1 11.4 1.2.3 2.4.5 3.6.5 1.5 0 3-.4 4.4-.9 3.5-1.5 6-4.4 6.9-8H24c-1.7 0-3-1.3-3-3s1.3-3 3-3h3.5c-.1-1.2-.4-2.4-.9-3.5L25 21.3c-1 1.2-2.5 2-4.2 2s-3.2-.8-4.2-2c-1-1.2-1.6-2.8-1.6-4.4 0-1.7.6-3.2 1.6-4.4 1-1.2 2.5-2 4.2-2s3.2.8 4.2 2l1.6 1.8c.4-1.1.6-2.2.6-3.4 0-.7-.1-1.4-.2-2.1z" fill="#FFE01B"/><path d="M22.4 13.1c-2.3-1.6-5-2.6-8-2.6-4.6 0-8.8 2.5-11.4 6.4-1.2 1.9-1.9 4-1.9 6.3 0 5.4 3.4 10 8.1 11.4 1.2.3 2.4.5 3.6.5 1.5 0 3-.4 4.4-.9 3.5-1.5 6-4.4 6.9-8H24c-1.7 0-3-1.3-3-3s1.3-3 3-3h3.5c-.1-1.2-.4-2.4-.9-3.5L25 21.3c-1 1.2-2.5 2-4.2 2s-3.2-.8-4.2-2c-1-1.2-1.6-2.8-1.6-4.4 0-1.7.6-3.2 1.6-4.4 1-1.2 2.5-2 4.2-2s3.2.8 4.2 2l1.6 1.8c.4-1.1.6-2.2.6-3.4.1-.7 0-1.4-.1-2.1z" fill="#241C15" opacity=".1"/></svg>;
const ZapierIcon = (p) => <svg {...p} viewBox="0 0 24 24"><path d="M22 12h-7.58l4.47-5.59L17.31 5 12 11.33V2h-2v9.33L4.69 5 3.11 6.41 7.58 12H0v2h7.58l-4.47 5.59L4.69 21 10 14.67V24h2v-9.33L17.31 21l1.58-1.41L14.42 14H22z" fill="#FF4A00"/></svg>;
const WebhookIcon = (p) => <svg {...p} viewBox="0 0 24 24"><path fill="none" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path fill="#8B5CF6" d="M22 4L12 14.01l-3-3"/></svg>;

const integrations = [
  { name: "Google Sheets", icon: <GoogleSheetsIcon className="w-10 h-10" /> },
  { name: "Mailchimp", icon: <MailchimpIcon className="w-10 h-10" /> },
  { name: "Zapier", icon: <ZapierIcon className="w-10 h-10" /> },
  { name: "Webhook", icon: <WebhookIcon className="w-10 h-10" /> },
];

/*************************************
 * Tiny UI primitives
 *************************************/
function cn(){ return Array.from(arguments).filter(Boolean).join(" "); }
function Button(props){ const { variant="solid", size="md", className, style, children, ...rest } = props; const base="inline-flex items-center justify-center rounded-lg font-semibold tracking-wide transition-transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 active:scale-[0.98]"; const sizes={ sm:"px-4 py-2 text-sm", md:"px-6 py-2.5 text-base", lg:"px-8 py-3.5 text-lg", icon:"p-2.5"}; const variants={ solid:"bg-amber-500 text-slate-900 hover:bg-amber-400", outline:"border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-slate-900", ghost:"text-white hover:bg-white/10"}; return (<button className={cn(base, sizes[size], variants[variant], className||"")} style={style} {...rest}>{children}</button>); }
const Card = React.forwardRef((props, ref) => {
    const { className, style, children, ...rest } = props;
    return (
        <div ref={ref} className={cn("rounded-2xl border backdrop-blur-sm", className || "")} style={{ ...style, background: "rgba(15, 33, 64, 0.6)", borderColor: COLORS.border }} {...rest}>
            {children}
        </div>
    );
});
function CardHeader(props){ return <div className={cn("p-6", props.className||"")}>{props.children}</div>; }
function CardTitle(props){ return <h3 className={cn("text-xl font-bold", props.className||"")}>{props.children}</h3>; }
function CardDescription(props){ return <p className={cn("text-base opacity-80 mt-1", props.className||"")}>{props.children}</p>; }
function CardContent(props){ return <div className={cn("p-6", props.className||"")} style={props.style}>{props.children}</div>; }
function Input(props){ const { className, style, ...rest } = props; return <input className={cn("w-full rounded-lg border-2 px-4 py-2.5 text-base bg-transparent focus:ring-2 focus:ring-amber-500 focus:border-amber-500", className||"")} style={{borderColor: COLORS.border}} {...rest} />; }

/*************************************
 * Utilities
 *************************************/
function useScrollTo(){ return function(id){ const el = document.getElementById(id); if(el) el.scrollIntoView({behavior:"smooth", block:"start"}); }; }

/*************************************
 * Logo
 *************************************/
function Logo(props) {
    const { size = 180 } = props || {};
    const viewBoxWidth = 175;
    const viewBoxHeight = 48;
    const width = size * (viewBoxWidth / 180);
    const height = size * (viewBoxHeight / 180);
    const textSize = 28;

    return (
        <div className="inline-flex items-center">
            <svg width={width} height={height} viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} aria-hidden="true">
                <defs>
                    <linearGradient id="gradIQ" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={COLORS.amber} />
                        <stop offset="100%" stopColor="#fcd34d" />
                    </linearGradient>
                </defs>
                <g>
                    <path d="M38 24C38 31.73 31.73 38 24 38S10 31.73 10 24 16.27 10 24 10" fill="none" stroke="url(#gradIQ)" strokeWidth="8" strokeLinecap="round"/>
                    <circle cx="24" cy="24" r="6" fill={COLORS.blue} />
                </g>
                <text x="58" y={viewBoxHeight / 2 + textSize / 3.5} style={{ fontSize: textSize, fontWeight: 800 }}>
                    <tspan fill={COLORS.text}>Collex</tspan>
                    <tspan fill="url(#gradIQ)">IQ</tspan>
                </text>
            </svg>
            <span className="sr-only">CollexIQ</span>
        </div>
    );
}

/*************************************
 * Minimal SVG Line Chart (Recharts-like)
 *************************************/
function LineChartSVG({ data, lines, maxY: maxYValue }) {
    const labels = data.map(d => d.month);
    const width = 820, height = 240;
    const pad = { l: 56, r: 24, t: 16, b: 28 };
    const iw = width - pad.l - pad.r, ih = height - pad.t - pad.b;
    const maxY = maxYValue || Math.max(1, ...lines.flatMap(l => data.map(d => d[l.key])));
    const stepX = iw / (labels.length - 1 || 1);

    function getCoords(v, i) {
        const x = pad.l + stepX * i;
        const y = pad.t + (1 - (v / maxY)) * ih;
        return { x, y };
    }

    return (
        <svg className="w-full" viewBox={`0 0 ${width} ${height}`} aria-label="chart">
            <defs>
                <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={COLORS.amber} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={COLORS.amber} stopOpacity={0} />
                </linearGradient>
            </defs>
            {[0, 0.25, 0.5, 0.75, 1].map((t, idx) => {
                const y = pad.t + t * ih;
                return (
                    <g key={idx}>
                        <line x1={pad.l} y1={y} x2={width - pad.r} y2={y} stroke={COLORS.border} strokeDasharray="3 3" />
                        <text x={8} y={y + 3} fontSize="10" fill={COLORS.textDim}>{Math.round(maxY * (1 - t))}</text>
                    </g>
                );
            })}
            {labels.map((lab, i) => {
                const x = pad.l + stepX * i;
                return <text key={lab} x={x} y={height - 6} fontSize="12" textAnchor="middle" fill={COLORS.textDim}>{lab}</text>;
            })}
            {lines.map((l, lineIdx) => {
                const points = data.map((d, i) => getCoords(d[l.key], i));
                const pathData = points.map(p => `${p.x},${p.y}`).join(" ");
                const areaPathData = `M${points[0].x},${height - pad.b} L${pathData} L${points[points.length - 1].x},${height - pad.b} Z`;

                return (
                    <g key={lineIdx}>
                        {l.color === COLORS.amber && <path d={areaPathData} fill="url(#amberGradient)" />}
                        <polyline fill="none" stroke={l.color} strokeWidth={l.w || 2.5} points={pathData} strokeLinecap="round"/>
                        {points.map((p, pointIdx) => ( <circle key={pointIdx} cx={p.x} cy={p.y} r="3" fill={l.color} stroke={COLORS.base} strokeWidth="2" /> ))}
                    </g>
                );
            })}
        </svg>
    );
}

/*************************************
 * Header
 *************************************/
function Header({ onScrollTo, onLogin, loggedIn, onLogout, onOpenDashboard, showDashboard, onNavAndScroll, user }){
  const [open, setOpen] = useState(false);
  
  const handleScrollOrNav = (id) => {
      if (showDashboard && id !== 'dashboard') {
          onNavAndScroll(id);
      } else if (id === 'dashboard') {
          onOpenDashboard();
      } else {
          onScrollTo(id);
      }
      setOpen(false);
  };

  const navItems = loggedIn 
    ? [["Dashboard", "dashboard"], ["Integrations", "integrations"], ["Pricing", "pricing"], ["Contact", "contact"]]
    : [["Solutions", "solutions"], ["Integrations", "integrations"], ["Pricing", "pricing"], ["FAQ", "faq"], ["Contact", "contact"]];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg border-b" style={{ background: "rgba(11, 27, 51, 0.8)", borderColor: COLORS.border }}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between" style={{ color: COLORS.text }}>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => (loggedIn ? onOpenDashboard() : onScrollTo("hero"))}>
          <Logo size={160} />
        </div>
        <nav className="hidden md:flex items-center gap-6 text-base">
           {navItems.map(([label, id]) => (
                <button key={label} className="hover:text-amber-400 transition-colors" onClick={() => handleScrollOrNav(id)}>{label}</button>
            ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          {!loggedIn ? (
            <>
              <Button variant="ghost" size="md" onClick={onLogin}> <FacebookIcon className="w-5 h-5 mr-2" /> Login with Facebook</Button>
              <Button onClick={() => onScrollTo("pricing")}>Start Free Trial</Button>
            </>
          ) : (
            <>
              <div className="hidden lg:flex items-center text-sm opacity-80"><UserCircle className="w-5 h-5 mr-2" /> {user.email}</div>
              <Button variant="outline" size="sm" onClick={onLogout} style={{ borderColor: COLORS.border }}><LogOut className="w-4 h-4 mr-2" /> Logout</Button>
            </>
          )}
        </div>
        <Button className="md:hidden" variant="ghost" size="icon" onClick={() => setOpen(v => !v)}><Menu className="w-6 h-6" /></Button>
      </div>
      {open && (
        <div className="md:hidden px-4 pb-4 border-t" style={{ borderColor: COLORS.border }}>
          <div className="grid gap-2 pt-2">
             {navItems.map(([label, id]) => (
                <Button key={id} variant="ghost" className="justify-start text-lg py-3" style={{ color: COLORS.text }} onClick={() => handleScrollOrNav(id)}>{label}</Button>
            ))}
            <div className="flex gap-2 mt-2">
              {!loggedIn ? (
                <>
                  <Button className="flex-1" variant="outline" onClick={onLogin}><FacebookIcon className="w-5 h-5 mr-2" /> Login</Button>
                  <Button className="flex-1" onClick={() => onScrollTo("pricing")}>Start Trial</Button>
                </>
              ) : (
                <Button className="flex-1" variant="outline" onClick={onLogout}><LogOut className="w-4 h-4 mr-2" /> Logout</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

/*************************************
 * HERO
 *************************************/
function Hero({ onCTAPricing, onCTATrial }){
  const data = useMemo(()=> makeHeroData(), []);
  return (
    <section id="hero" className="relative overflow-hidden">
       <div className="pointer-events-none absolute inset-0 z-0" style={{ background: `radial-gradient(ellipse at top, ${COLORS.baseDeep}, ${COLORS.base} 70%)` }} />
       <div className="pointer-events-none absolute -top-1/4 left-1/2 -translate-x-1/2 w-[200%] h-[150%] z-0" style={{ background: "radial-gradient(closest-side, rgba(245, 158, 11, .15), transparent 80%)" }} />
       
      <div className="max-w-7xl mx-auto px-4 py-20 lg:py-28 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Text Content */}
        <div className="text-center lg:text-left">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tighter"
            style={{textShadow: '0 4px 30px rgba(0,0,0,0.4)'}}>
            Turn Facebook group members into <span style={{color: COLORS.amber}}>customers.</span>
          </h1>
          <p className="mt-6 text-lg max-w-xl mx-auto lg:mx-0" style={{ color: COLORS.textDim }}>
              Auto-capture member approval answers and sync them to Google Sheets, your CRM, and email marketing tools.
          </p>
          <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
            <Button size="lg" onClick={onCTATrial}>Start 3-Day Free Trial</Button>
            <Button size="lg" variant="outline" onClick={onCTAPricing}>See Pricing</Button>
          </div>
           <div className="mt-8 text-center lg:text-left" style={{ color: COLORS.textDim }}>
            <div className="flex justify-center lg:justify-start items-center gap-2">
                {Array.from({length:5}).map((_,s)=> (<Star key={s} size={20} />))}
            </div>
            <p className="mt-2">Trusted by over 1,000+ growing communities</p>
          </div>
        </div>

        {/* Right Column: Visual Element */}
        <div className="relative">
          <div className="rounded-xl shadow-2xl border" style={{ borderColor: COLORS.border, background: "rgba(15, 33, 64, 0.7)", boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)' }}>
            <div className="p-3 border-b flex items-center gap-2" style={{borderColor: COLORS.border}}>
                <span className="w-3.5 h-3.5 rounded-full" style={{background: "#ff5f56"}}></span>
                <span className="w-3.5 h-3.5 rounded-full" style={{background: "#ffbd2e"}}></span>
                <span className="w-3.5 h-3.5 rounded-full" style={{background: "#27c93f"}}></span>
            </div>
            <div className="p-4 sm:p-6">
              <div className="mb-4 text-sm flex items-center gap-2" style={{ color: COLORS.textDim }}><BarChart2 className="w-4 h-4" /> Usage preview</div>
              <LineChartSVG data={data} lines={[{ key:"emails", color: COLORS.amber, w:2.5 }, { key:"syncs", color: COLORS.blue, w:2 }]}/>
              <div className="grid sm:grid-cols-3 gap-4 mt-6 text-center">
                {[
                  { value: "+28%", label: "Emails Captured" },
                  { value: "1-click", label: "Integrations" },
                  { value: "Auto", label: "Syncs" }
                ].map((stat, i) => (
                  <div key={i} className="rounded-lg p-3" style={{ background: COLORS.base }}>
                    <div className="font-bold text-xl">{stat.value}</div>
                    <div className="text-sm opacity-80">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/*************************************
 * Marketing sections
 *************************************/
function HowItWorks(){
  const steps=[
    { icon:<Layers className="w-8 h-8" />, title:"Connect Your Group", desc:"Securely link Sheets, CRM, and email in minutes." },
    { icon:<Database className="w-8 h-8" />, title:"Map Your Fields", desc:"Point-and-click mapping to unify schemas." },
    { icon:<Icon d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" className="w-8 h-8"/>, title:"Auto-Sync Forever", desc:"Delta updates, alerts, and export on demand." },
  ];
  return (
    <section id="solutions" className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold" style={{ color: COLORS.text }}>How it Works in 3 Simple Steps</h2>
          <p className="mt-4 text-lg" style={{ color: COLORS.textDim }}>From first connection to full automation in minutes.</p>
        </div>
        <div className="relative mt-16">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-0.5" style={{ background: `linear-gradient(90deg, transparent 0%, ${COLORS.border} 20%, ${COLORS.border} 80%, transparent 100%)` }}/>
          <div className="grid md:grid-cols-3 gap-8 items-start relative">
            {steps.map((s,i)=> (
              <div key={i} className="text-center flex flex-col items-center p-6 rounded-lg backdrop-blur-sm" style={{ background: "rgba(11, 27, 51, 0.5)" }}>
                <div className="w-24 h-24 rounded-full grid place-items-center mb-6 ring-4 ring-amber-500/30 border-2 border-amber-500/50" style={{ background: COLORS.card, color: COLORS.amber }}>
                  <div className="absolute -top-3 bg-amber-500 text-slate-900 font-bold px-3 py-1 rounded-full text-sm">Step {i+1}</div>
                  {s.icon}
                </div>
                <h3 className="text-2xl font-semibold" style={{ color: COLORS.text }}>{s.title}</h3>
                <p className="mt-2" style={{ color: COLORS.textDim }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Integrations(){
  return (
    <section id="integrations" className="py-20" style={{ background: COLORS.baseDeep }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold" style={{ color: COLORS.text }}>Powerful Integrations</h2>
          <p className="mt-4 text-lg" style={{ color: COLORS.textDim }}>Plug into your stack with zero backend changes.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
          {integrations.map((it,idx)=> (
            <Card key={idx} className="group hover:-translate-y-2 transition-transform duration-300 hover:shadow-2xl hover:shadow-amber-500/20 hover:border-amber-500/50">
              <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                <div className="p-4 rounded-full bg-white/5 flex items-center justify-center h-20 w-20">
                    {it.icon}
                </div>
                <div className="text-xl font-semibold">{it.name}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function DocsPage(){
  return (
    <section id="docs" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold" style={{ color: COLORS.text }}>Get Started in Minutes</h2>
          <p className="mt-4 text-lg" style={{ color: COLORS.textDim }}>Quick start and integration setup guides.</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Create an account, connect a source, and map fields.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ol className="list-decimal pl-5 space-y-2">
                <li>Click <strong className="text-amber-400">Login with Facebook</strong> to create your account.</li>
                <li>Open <strong className="text-amber-400">Integrations</strong> and connect Google Sheets, Mailchimp, or Zapier.</li>
                <li>Use the <strong className="text-amber-400">Field Mapper</strong> to align inputs to your schema.</li>
                <li>Enable <strong className="text-amber-400">Auto-Sync</strong> and optionally webhooks.</li>
              </ol>
            </CardContent>
          </Card>
          <div className="grid gap-8">
            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 rounded-lg" style={{backgroundColor: COLORS.baseDeep}}><Database className="w-6 h-6" style={{color: COLORS.blue}}/></div>
                <div>
                  <CardTitle className="text-lg">Google Sheets & Mailchimp</CardTitle>
                  <p className="mt-1 text-sm text-slate-400">Sync join-form rows into a sheet or capture subscribers and tag by answers.</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 rounded-lg" style={{backgroundColor: COLORS.baseDeep}}><Icon d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" className="w-6 h-6" style={{color: COLORS.amber}}/></div>
                <div>
                  <CardTitle className="text-lg">Zapier & Webhooks</CardTitle>
                  <p className="mt-1 text-sm text-slate-400">Automate with 6,000+ apps or deliver JSON payloads to your own API.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

/*************************************
 * Pricing
 *************************************/
const PRICING_TIERS = [
  { name:"Starter", price:"$19", period:"/mo", highlight:false, link:STRIPE_LINKS.starter, features:["500 members/mo","Daily sync","CSV export"] },
  { name:"Pro", price:"$39", period:"/mo", highlight:true, link:STRIPE_LINKS.pro, features:["2,000 members/mo","Hourly sync","Sheets + Webhook"] },
  { name:"Agency", price:"$99", period:"/mo", highlight:false, link:STRIPE_LINKS.agency, features:["5,000 members/mo","15-min sync","Priority support"] },
];
function Pricing(){
  return (
    <section id="pricing" className="py-20" style={{ background: COLORS.baseDeep }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold" style={{ color: COLORS.text }}>Simple, Predictable Pricing</h2>
          <p className="mt-4 text-lg" style={{ color: COLORS.textDim }}>Start free, upgrade when you scale. Cancel anytime.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {PRICING_TIERS.map((t,i)=> (
            <Card key={i} className={cn("relative flex flex-col", t.highlight && "border-2 border-amber-500")}>
              {t.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full px-4 py-1.5 text-sm font-semibold shadow-md flex items-center gap-2" style={{ background: COLORS.amber, color: COLORS.baseDeep }}>
                    <Star size={16} fill={COLORS.baseDeep} stroke={COLORS.baseDeep}/> Best Value
                  </span>
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{t.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="text-center mb-6">
                  <span className="text-5xl font-bold">{t.price}</span>
                  <span className="text-lg opacity-70">{t.period}</span>
                </div>
                <ul className="space-y-3 text-base flex-1">
                  {t.features.map((f,idx)=> (
                    <li key={idx} className="flex items-center gap-3"><Check className="w-5 h-5 text-green-400" /> {f}</li>
                  ))}
                </ul>
                <a href={t.link} target="_blank" rel="noopener noreferrer" className="mt-8">
                  <Button className="w-full" variant={t.highlight ? "solid" : "outline"}>
                    Choose {t.name}
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/*************************************
 * Security, FAQ, Subscribe
 *************************************/
function Security(){
  const items=[
    { title:"Data Handling", desc:"We minimize data in transit and encrypt all data at rest using industry-standard protocols." },
    { title:"Access Control", desc:"Granular access controls and role-based permissions to protect sensitive information." },
    { title:"Compliance Ready", desc:"Audit trails and one-click export for regulators and internal compliance." },
  ];
  return (
    <section id="security" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold" style={{ color: COLORS.text }}>Security & Compliance</h2>
                <p className="mt-4 text-lg" style={{ color: COLORS.textDim }}>Your data's safety is our top priority. We're built with enterprise-grade security from the ground up.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
                {items.map((it, i) => (
                    <Card key={i} className="text-center p-6 hover:-translate-y-2 transition-transform duration-300">
                        <div className="inline-flex w-16 h-16 rounded-full items-center justify-center mb-6 ring-4 ring-blue-500/20" style={{ background: COLORS.card, color: COLORS.blue }}>
                            <Lock className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-semibold">{it.title}</h3>
                        <p className="mt-2" style={{ color: COLORS.textDim }}>{it.desc}</p>
                    </Card>
                ))}
            </div>
        </div>
    </section>
  );
}

function FAQ(){
  const faqs=[
    { q:"What does Collexiq do?", a:"It captures Facebook group join-form data (emails, names, answers) and syncs it to your connected tools automatically." },
    { q:"Is there a free trial?", a:"Yes, you can create an account and explore the dashboard for free. A subscription is required to connect a group and start capturing data." },
    { q:"Which integrations are supported?", a:"Currently: Google Sheets, Mailchimp, Zapier, and generic Webhook. More coming soon." },
    { q:"Can I export data?", a:"Yes. You can export a CSV of your captured members anytime with one click." },
    { q:"How secure is Collexiq?", a:"All data is encrypted in transit (TLS). We practice least-privilege access and comply with standard data protection policies." },
    { q:"How does billing work?", a:"Billing is handled securely through Stripe. You can manage or cancel your subscription via your Stripe customer portal." },
  ];
  
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center">
            <h2 className="text-4xl font-bold" style={{ color: COLORS.text }}>Frequently Asked Questions</h2>
        </div>
        <div className="mt-12 space-y-4">
            {faqs.map((faq,i) => (
                <div key={i} className="rounded-xl" style={{ background: COLORS.card, borderColor: COLORS.border, border: `1px solid ${COLORS.border}` }}>
                    <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex justify-between items-center text-left p-6">
                        <span className="font-semibold text-lg" style={{color: COLORS.text}}>{faq.q}</span>
                        <ChevronDown className={cn("w-6 h-6 transition-transform", open === i ? 'rotate-180 text-amber-400' : 'text-slate-400')} />
                    </button>
                    <div className={cn("grid transition-all duration-300 ease-in-out", open === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
                      <div className="overflow-hidden">
                        <div className="p-6 pt-0" style={{color: COLORS.textDim}}>
                            <p className="text-base">{faq.a}</p>
                        </div>
                      </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
    return (
        <section id="contact" className="py-20" style={{ background: COLORS.baseDeep }}>
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-4xl font-bold">Get in Touch</h2>
                    <p className="mt-4 text-lg" style={{ color: COLORS.textDim }}>
                        Have a question or feedback? We'd love to hear from you.
                    </p>
                </div>
                <Card className="mt-12">
                    <form onSubmit={e => e.preventDefault()}>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="text-base font-medium mb-2 block">Full Name</label>
                                    <Input id="name" type="text" placeholder="John Doe" required />
                                </div>
                                <div>
                                    <label htmlFor="email" className="text-base font-medium mb-2 block">Email Address</label>
                                    <Input id="email" type="email" placeholder="you@example.com" required />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="message" className="text-base font-medium mb-2 block">Message</label>
                                <textarea id="message" rows="5" placeholder="Your message..." required className={cn("w-full rounded-lg border-2 p-4 text-base bg-transparent focus:ring-2 focus:ring-amber-500 focus:border-amber-500")} style={{borderColor: COLORS.border}}></textarea>
                            </div>
                             <div className="flex justify-end">
                                <Button type="submit" size="md">Send Message</Button>
                            </div>
                        </CardContent>
                    </form>
                </Card>
            </div>
        </section>
    );
}

/*************************************
 * Footer
 *************************************/
function Footer({ onScrollTo }) {
    const links = [
      {label: "Solutions", id: "solutions"}, 
      {label: "Pricing", id: "pricing"}, 
      {label: "Security", id: "security"}, 
      {label: "FAQ", id: "faq"}, 
      {label: "Contact", id: "contact"}
    ];
    return (
        <footer className="border-t py-12" style={{ borderColor: COLORS.border }}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <Logo size={160} />
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-base">
                        {links.map(l => <button key={l.id} onClick={() => onScrollTo(l.id)} className="hover:text-amber-400 transition-colors" style={{color: COLORS.textDim}}>{l.label}</button>)}
                    </div>
                     <div className="flex items-center gap-6">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors"><XSocialIcon className="w-5 h-5"/></a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors"><LinkedInIcon className="w-6 h-6"/></a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors"><FacebookIcon className="w-6 h-6"/></a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors"><InstagramIcon className="w-6 h-6"/></a>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t text-center text-base" style={{borderColor: COLORS.border, color: COLORS.textDim, opacity: 0.7}}>
                    &copy; {new Date().getFullYear()} CollexIQ, Inc. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

/*************************************
 * Reviews
 *************************************/
function Reviews(){
  return (
    <section id="reviews" className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold" style={{ color: COLORS.text }}>Loved by Growing Teams</h2>
            <p className="mt-4 text-lg" style={{ color: COLORS.textDim }}>See why teams at fast-growing companies trust CollexIQ to automate their workflows.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {testimonials.map((t,i)=> (
            <Card key={i} className="flex flex-col">
              <CardContent className="p-8 flex-1 flex flex-col">
                <div className="flex-1">
                    <div className="flex items-center gap-1 mb-4">
                        {Array.from({length:5}).map((_,s)=> (<Star key={s} size={20} />))}
                    </div>
                    <p className="text-lg leading-relaxed" style={{ color: COLORS.text }}>“{t.quote}”</p>
                </div>
                <div className="mt-6 pt-6 border-t" style={{ borderColor: COLORS.border }}>
                    <div className="flex items-center gap-4">
                        <img src={t.img} alt={t.name+" avatar"} className="w-14 h-14 rounded-full object-cover ring-2 ring-amber-500/50" />
                        <div>
                            <div className="font-semibold text-lg" style={{ color: COLORS.text }}>{t.name}</div>
                            <div className="text-base" style={{ color: COLORS.textDim }}>{t.role}</div>
                        </div>
                    </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/*************************************
 * Dashboard (after login)
 *************************************/
function exportToCSV(data, filename) {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));
    for (const row of data) {
        const values = headers.map(header => `"${(''+row[header]).replace(/"/g, '""')}"`);
        csvRows.push(values.join(','));
    }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function Dashboard({ user }) {
    const dashData = useMemo(()=> makeDashData(), []);
    const [activeTab, setActiveTab] = useState('Dashboard');
    
    const dashboardIntegrations = [
      { name: "Google Sheets", icon: <GoogleSheetsIcon className="w-6 h-6" />, status: "Connected" },
      { name: "Mailchimp", icon: <MailchimpIcon className="w-6 h-6" />, status: "Connected" },
      { name: "Zapier", icon: <ZapierIcon className="w-6 h-6" />, status: "Error" },
      { name: "Webhook", icon: <WebhookIcon className="w-6 h-6" />, status: "Connected" },
    ];
    
    const tabs = [
        { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5"/> },
        { label: "Integrations", icon: <Zap className="w-5 h-5"/> },
        { label: "Billing", icon: <CreditCard className="w-5 h-5"/> },
        { label: "Settings", icon: <Settings className="w-5 h-5"/> },
    ];

    const renderContent = () => {
        switch(activeTab) {
            case 'Dashboard':
                return (
                    <div className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Captured Emails Over Time</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <LineChartSVG data={dashData} lines={[{ key:"emails", color: COLORS.amber, w:2.5 }]} maxYValue={160}/>
                            </CardContent>
                        </Card>
                        <div className="grid lg:grid-cols-2 gap-8">
                            <Card>
                                <CardHeader className="flex flex-row justify-between items-center">
                                    <CardTitle>Recent Captures</CardTitle>
                                    <Button onClick={() => exportToCSV(recentCaptures, 'captures.csv')} size="sm" variant="outline"><FileDown className="w-4 h-4 mr-2"/> Export</Button>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {recentCaptures.map(c => (
                                            <li key={c.email} className="p-3 rounded-lg text-base flex justify-between items-center" style={{backgroundColor: COLORS.base}}>
                                                <span>{c.email}</span>
                                                <span className="text-sm opacity-60">{c.date}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                            <div className="space-y-8">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Current Plan</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex items-center justify-between">
                                        <p className="text-2xl font-semibold">Pro (Trial Active)</p>
                                        <Button variant="solid" size="sm" onClick={() => document.getElementById('pricing')?.scrollIntoView()}>Upgrade</Button>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Integrations Status</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                    {dashboardIntegrations.map(it => (
                                        <div key={it.name} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                {it.icon}
                                                <span className="font-medium">{it.name}</span>
                                            </div>
                                            <div className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", it.status==="Error"?"bg-red-500/20 text-red-300":"bg-green-500/20 text-green-300")}>{it.status}</div>
                                        </div>
                                    ))}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                );
            case 'Integrations':
            case 'Billing':
            case 'Settings':
                return (
                    <Card>
                        <CardContent className="p-20 text-center">
                            <h3 className="text-2xl font-bold">{activeTab}</h3>
                            <p className="text-slate-400 mt-2">This section is coming soon.</p>
                        </CardContent>
                    </Card>
                );
            default:
                return null;
        }
    }

    return (
      <main id="dashboard" className="py-12 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-baseline justify-between gap-4 mb-8">
            <div>
                <h1 className="text-4xl font-bold">Welcome, {user.name.split(' ')[0]}!</h1>
                <p className="text-slate-400 mt-1">Here's an overview of your account.</p>
            </div>
            <div className="p-1 rounded-lg flex items-center space-x-1" style={{backgroundColor: COLORS.card}}>
                {tabs.map(tab => (
                    <button 
                        key={tab.label}
                        onClick={() => setActiveTab(tab.label)}
                        className={cn("flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-colors",
                            activeTab === tab.label ? 'bg-amber-500 text-slate-900' : 'text-slate-300 hover:bg-white/5'
                        )}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>
        </div>
        {renderContent()}
      </main>
    );
}

/*************************************
 * Main App
 *************************************/
export default function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [showDashboard, setShowDashboard] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);

    const scrollTo = useScrollTo();

    const handleLogin = () => {
        // Redirect to the backend which will handle the Facebook login flow
        window.location.href = `${BACKEND_URL}/api/facebook/login`;
    };

    const handleLogout = () => {
        setLoggedIn(false);
        setUser(null);
        setShowDashboard(false);
        // Clean up URL params
        window.history.replaceState({}, document.title, window.location.pathname);
    };

    const handleOpenDashboard = () => {
        if (loggedIn) {
            setShowDashboard(true);
        } else {
            handleLogin();
        }
    };
    
    const handleNavAndScroll = (id) => {
        setShowDashboard(false);
        setTimeout(() => scrollTo(id), 50);
    };

    useEffect(() => {
        // This effect runs once when the component mounts to check for login success
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('login_success') === 'true') {
            try {
                const userData = JSON.parse(decodeURIComponent(urlParams.get('user')));
                setUser(userData);
                setLoggedIn(true);
                setShowDashboard(true);

                // Clean up the URL so the params don't stay there on refresh
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch (e) {
                console.error("Failed to parse user data from URL", e);
            }
        }

        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        
        document.body.style.backgroundColor = COLORS.base;
        document.body.style.color = COLORS.text;
        document.querySelector('html').classList.add('scroll-smooth');
        document.body.style.fontFamily = "'Inter', sans-serif";

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');`}</style>
            <div style={{ background: COLORS.base, color: COLORS.text }}>
                <Header
                    onScrollTo={scrollTo}
                    onLogin={handleLogin}
                    loggedIn={loggedIn}
                    user={user}
                    onLogout={handleLogout}
                    onOpenDashboard={handleOpenDashboard}
                    showDashboard={showDashboard}
                    onNavAndScroll={handleNavAndScroll}
                />

                {showDashboard ? (
                    <Dashboard user={user}/>
                ) : (
                    <main>
                        <Hero onCTAPricing={() => scrollTo('pricing')} onCTATrial={() => scrollTo('pricing')} />
                        <HowItWorks />
                        <Integrations />
                        <DocsPage />
                        <Reviews />
                        <Pricing />
                        <Security />
                        <FAQ />
                        <Contact />
                    </main>
                )}

                <Footer onScrollTo={scrollTo} />
                
                <button
                    onClick={() => scrollTo('hero')}
                    className={cn(
                        "fixed bottom-6 right-6 z-50 p-3 rounded-full bg-amber-500 text-slate-900 shadow-lg transition-opacity duration-300 hover:bg-amber-400 active:scale-95",
                        showBackToTop ? "opacity-100" : "opacity-0 pointer-events-none"
                    )}
                    aria-label="Back to top"
                >
                    <ArrowUp className="w-6 h-6" />
                </button>
            </div>
        </>
    );
}

