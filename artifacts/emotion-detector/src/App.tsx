import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ArrowRight, BarChart3, Camera, CircleHelp, Eye, EyeOff, FlipHorizontal2, Github, Gauge, LockKeyhole, Menu, Pause, Play, Radio, ScanFace, ShieldCheck, Sparkles, Terminal, Trash2, X } from 'lucide-react';
import { useFaceDetection, type ExpressionName } from '@/hooks/use-face-detection';

const expressionColors: Record<ExpressionName, string> = {
  neutral: '#8f9ba9', happy: '#f2bd63', sad: '#84c9e8', angry: '#e77d73', fearful: '#ba9de4', disgusted: '#83c68f', surprised: '#6fe0cc',
};
const GITHUB_URL = 'https://github.com/lavishrana443-jpg/EmotionDetector';

const features = [
  { icon: Radio, title: 'Real-time', copy: 'Live estimates, rendered as your camera moves. No upload queue, no round trips.' },
  { icon: LockKeyhole, title: 'Private by design', copy: 'Frames stay in this tab. Your camera stream is never sent to a server.' },
  { icon: Terminal, title: 'No API keys', copy: 'The model runs client-side with nothing to configure, provision, or rotate.' },
  { icon: Github, title: 'Open source', copy: 'Inspect the implementation, model path, and every decision that happens here.' },
  { icon: Sparkles, title: 'Free to use', copy: 'A focused instrument for learning, testing, and curious observation.' },
  { icon: ScanFace, title: 'Browser-based', copy: 'Works where modern WebGL and camera permissions work. Start in seconds.' },
];

function Logo({ compact = false }: { compact?: boolean }) {
  return <div className="flex items-center gap-3" data-testid="brand-logo">
    <span className="relative grid h-8 w-8 place-items-center rounded-[10px] border border-primary/40 bg-primary/10 text-primary">
      <span className="absolute h-3 w-3 rounded-full border border-primary" />
      <span className="absolute h-[1px] w-5 bg-primary/80" />
    </span>
    {!compact && <span className="text-sm font-extrabold tracking-[-.03em] text-foreground">Emotion<span className="text-primary">Detector</span></span>}
  </div>;
}

function Button({ children, variant = 'primary', onClick, className = '', testId, type = 'button' }: { children: ReactNode; variant?: 'primary' | 'outline' | 'ghost'; onClick?: () => void; className?: string; testId: string; type?: 'button' | 'submit' }) {
  const styles = variant === 'primary'
    ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_10px_30px_hsl(var(--primary)/.15)]'
    : variant === 'outline'
      ? 'border border-border bg-card/40 text-foreground hover:border-primary/60 hover:bg-primary/5'
      : 'text-muted-foreground hover:text-foreground hover:bg-secondary';
  return <button type={type} onClick={onClick} data-testid={testId} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${styles} ${className}`}>{children}</button>;
}

function Header({ onStart }: { onStart: () => void }) {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
    <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
      <a href="#top" aria-label="EmotionDetector home" data-testid="link-home"><Logo /></a>
      <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
        <a href="#why" className="text-sm text-muted-foreground transition-colors hover:text-foreground" data-testid="link-why">Why it works</a>
        <a href="#process" className="text-sm text-muted-foreground transition-colors hover:text-foreground" data-testid="link-process">How it works</a>
       <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-foreground" data-testid="link-github"><Github className="mr-2 inline h-4 w-4" />Source</a>
        <Button onClick={onStart} testId="button-header-start" className="min-h-10 px-4">Start detection <ArrowRight className="h-4 w-4" /></Button>
      </nav>
      <button onClick={() => setOpen((v) => !v)} className="rounded-lg p-2 text-muted-foreground md:hidden" aria-label="Toggle navigation" data-testid="button-mobile-menu">{open ? <X /> : <Menu />}</button>
    </div>
    {open && <nav className="border-t border-border bg-background px-5 py-4 md:hidden" aria-label="Mobile navigation">
      <div className="flex flex-col gap-1">
        <a href="#why" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm text-muted-foreground" data-testid="link-mobile-why">Why it works</a>
        <a href="#process" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm text-muted-foreground" data-testid="link-mobile-process">How it works</a>
        <Button onClick={() => { setOpen(false); onStart(); }} testId="button-mobile-start" className="mt-2">Start detection <ArrowRight className="h-4 w-4" /></Button>
      </div>
    </nav>}
  </header>;
}

function Hero({ onStart }: { onStart: () => void }) {
  return <section id="top" className="relative overflow-hidden">
    <div className="absolute inset-0 grid-lines opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
    <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-16 md:pb-32 md:pt-24 lg:grid-cols-[1.06fr_.94fr] lg:px-8">
      <div className="relative z-10 max-w-2xl">
        <div className="eyebrow reveal mb-7 flex items-center gap-3"><span className="h-px w-7 bg-primary" />Local inference / v1.0</div>
        <h1 className="reveal delay-1 text-[clamp(3.4rem,8vw,7.2rem)] font-extrabold leading-[.91] tracking-[-.085em] text-foreground">Understand<br /><span className="text-primary">expressions</span><br />in real time.</h1>
        <p className="reveal delay-2 mt-8 max-w-xl text-lg leading-8 text-muted-foreground">A free, open-source facial emotion recognition system that runs directly in your browser.</p>
        <div className="reveal delay-3 mt-9 flex flex-wrap items-center gap-3">
          <Button onClick={onStart} testId="button-hero-start">Start detection <ArrowRight className="h-4 w-4" /></Button>
           <a href={GITHUB_URL} target="_blank" rel="noreferrer" data-testid="link-hero-github" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card/50 px-5 text-sm font-bold text-foreground transition hover:border-primary/50"><Github className="h-4 w-4" /> View on GitHub</a>
        </div>
        <p className="mono mt-8 text-[11px] tracking-wide text-muted-foreground/80"><span className="mr-2 text-primary">●</span> camera frames never leave your device</p>
      </div>
      <HeroInstrument />
    </div>
  </section>;
}

function HeroInstrument() {
  return <div className="relative mx-auto w-full max-w-[540px] reveal delay-2">
    <div className="absolute -inset-10 rounded-full bg-primary/5 blur-3xl" />
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card/80 p-3 shadow-2xl shadow-background">
      <div className="flex items-center justify-between px-3 py-3">
        <span className="eyebrow">Signal preview</span><span className="mono flex items-center gap-2 text-[10px] text-primary"><span className="h-1.5 w-1.5 rounded-full bg-primary" />LOCAL</span>
      </div>
      <div className="relative aspect-[1.15] overflow-hidden rounded-xl border border-border bg-[#15212a]">
        <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(ellipse at 50% 43%, #456878 0%, transparent 42%), linear-gradient(135deg, #1a2930, #101921 80%)' }} />
        <div className="absolute left-[27%] top-[16%] h-[67%] w-[46%] rounded-[48%_48%_44%_44%] border border-primary/80 shadow-[0_0_0_1px_hsl(var(--primary)/.1),inset_0_0_50px_hsl(var(--primary)/.08)]">
          <span className="absolute left-[23%] top-[37%] h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" /><span className="absolute right-[23%] top-[37%] h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
          <span className="absolute left-[34%] top-[59%] h-px w-[32%] rotate-[-6deg] bg-primary/80" />
        </div>
        <span className="absolute left-[22%] top-[13%] h-3 w-3 border-l border-t border-primary" /><span className="absolute right-[22%] top-[13%] h-3 w-3 border-r border-t border-primary" /><span className="absolute bottom-[17%] left-[22%] h-3 w-3 border-b border-l border-primary" /><span className="absolute bottom-[17%] right-[22%] h-3 w-3 border-b border-r border-primary" />
        <div className="absolute bottom-4 left-4 rounded-lg border border-primary/20 bg-background/70 px-3 py-2 backdrop-blur"><div className="eyebrow text-primary">instrument preview</div><div className="mt-1 text-sm font-bold">local signal</div></div>
        <div className="absolute right-4 top-4 text-right"><div className="mono text-[10px] text-muted-foreground">FACE DETECTOR</div><div className="mono mt-1 text-[10px] text-muted-foreground">READY</div></div>
      </div>
      <div className="grid grid-cols-3 gap-2 px-1 pb-1 pt-3 text-center">
        <div><div className="mono text-sm text-foreground">FACE</div><div className="eyebrow mt-1 text-[9px]">detection</div></div>
        <div><div className="mono text-sm text-foreground">LOCAL</div><div className="eyebrow mt-1 text-[9px]">processing</div></div>
        <div><div className="mono text-sm text-primary">READY</div><div className="eyebrow mt-1 text-[9px]">inference</div></div>
      </div>
    </div>
  </div>;
}

function FeatureSection() {
  return <section id="why" className="border-y border-border/70 bg-card/25">
    <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28"><div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><div className="eyebrow mb-4 text-primary">01 / The instrument</div><h2 className="max-w-xl text-3xl font-extrabold tracking-[-.05em] md:text-5xl">Clarity without<br />the black box.</h2></div><p className="max-w-sm text-sm leading-6 text-muted-foreground">A small, transparent tool for exploring what a browser can see — without treating an estimate like a fact.</p></div>
      <div className="grid border-l border-t border-border md:grid-cols-2 lg:grid-cols-3">{features.map(({ icon: Icon, title, copy }, index) => <article key={title} className="group min-h-[190px] border-b border-r border-border p-6 transition-colors hover:bg-primary/[.035] md:p-8" data-testid={`feature-${index}`}><Icon className="mb-12 h-5 w-5 text-primary transition-transform group-hover:translate-x-1" strokeWidth={1.5} /><h3 className="text-base font-bold">{title}</h3><p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">{copy}</p></article>)}</div>
    </div>
  </section>;
}

function ProcessSection() {
  const steps = [{ n: '01', title: 'Allow camera', copy: 'Your browser asks for access. Nothing starts until you say yes.' }, { n: '02', title: 'Detect faces', copy: 'Tiny Face Detector finds visible faces in each local video frame.' }, { n: '03', title: 'Read expressions', copy: 'A lightweight expression model scores seven visible patterns.' }];
  return <section id="process" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28"><div className="eyebrow mb-4 text-primary">02 / Method</div><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><h2 className="text-3xl font-extrabold tracking-[-.05em] md:text-5xl">A short path<br />from light to signal.</h2><p className="mt-6 max-w-sm text-sm leading-7 text-muted-foreground">No account. No server. No mystery transit. The complete pipeline lives in the tab you are looking at.</p></div><div className="divide-y divide-border border-y border-border">{steps.map((step) => <div key={step.n} className="grid gap-4 py-7 sm:grid-cols-[80px_1fr]"><span className="mono text-xs text-primary">{step.n}</span><div><h3 className="text-lg font-bold">{step.title}</h3><p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{step.copy}</p></div></div>)}</div></div></section>;
}

function Disclaimer() {
  return <section className="mx-5 mb-16 rounded-2xl border border-accent/25 bg-accent/[.06] p-5 lg:mx-auto lg:max-w-7xl lg:p-7"><div className="flex gap-4"><CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-accent" /><div><h3 className="text-sm font-bold">A note on interpretation</h3><p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">Expression estimates describe visible facial patterns, not a person’s true internal emotional state. Use them for exploration and interface research — never as a diagnosis or a verdict about someone.</p></div></div></section>;
}

type HistoryEntry = { time: string; emotion: ExpressionName; confidence: number };

function HistoryChart({ history }: { history: HistoryEntry[] }) {
  const points = history.length > 1 ? history.map((entry, index) => `${(index / (history.length - 1)) * 100},${100 - entry.confidence * 100}`).join(' ') : '';
  return <div className="relative h-24 overflow-hidden rounded-lg border border-border bg-background/50"><div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/.35)_1px,transparent_1px)] bg-[size:100%_25%]" />{points ? <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full"><polyline points={points} fill="none" stroke="#5ce0c0" strokeWidth="2" vectorEffect="non-scaling-stroke" /></svg> : <div className="grid h-full place-items-center"><span className="mono text-[10px] text-muted-foreground">waiting for signal</span></div>}</div>;
}

function CameraOverlay({ state, error, onStart }: { state: string; error: string | null; onStart: () => void }) {
  if (state === 'running') return null;
  if (state === 'error') return <div className="absolute inset-0 grid place-items-center bg-[#111c24]/80 p-5 text-center backdrop-blur-sm"><div className="max-w-sm" role="alert" data-testid="status-camera-error"><div className="mx-auto mb-4 grid h-11 w-11 place-items-center rounded-full bg-destructive/10 text-destructive"><Camera className="h-5 w-5" /></div><h2 className="font-bold">Camera access needed</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{error}</p><Button onClick={onStart} testId="button-retry-camera" className="mt-5">Try again <ArrowRight className="h-4 w-4" /></Button></div></div>;
  if (state === 'loading') return <div className="absolute inset-0 grid place-items-center bg-[#111c24]/80 p-5 text-center backdrop-blur-sm"><div className="max-w-sm" role="status" data-testid="status-model-loading"><div className="mx-auto mb-4 h-10 w-10 animate-pulse rounded-full border border-primary/30 bg-primary/10" /><h2 className="font-bold">Preparing local models</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Loading the detector into your browser. This can take a moment on the first visit.</p></div></div>;
  return <div className="absolute inset-0 grid place-items-center bg-[#111c24]/80 p-5 text-center backdrop-blur-sm"><div className="max-w-sm" data-testid="status-camera-empty"><div className="mx-auto mb-4 grid h-11 w-11 place-items-center rounded-full border border-primary/30 bg-primary/10 text-primary"><Play className="h-4 w-4 fill-current" /></div><h2 className="font-bold">Your camera stays here</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Start the camera to load the models and begin local inference.</p><Button onClick={onStart} testId="button-workspace-start" className="mt-5">Start camera <ArrowRight className="h-4 w-4" /></Button></div></div>;
}

function Workspace({ onBack }: { onBack: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const { state, faces, fps, processingMs, error, start, stop, togglePause, paused } = useFaceDetection(videoRef, overlayRef);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [mirror, setMirror] = useState(true);
  const [showBoxes, setShowBoxes] = useState(true);
  const lastHistorySampleRef = useRef(0);
  const dominant = faces[0];
  const historyValue = dominant?.expressions[dominant.dominant] || 0;
  const historyForChart = useMemo(() => history.slice(-32), [history]);
  const handleStart = () => { void start(); };
  const handlePause = () => { togglePause(); };
  const statusLabel = state === 'running' ? 'LIVE INFERENCE' : state === 'loading' ? 'LOADING MODELS' : state === 'error' ? 'ACTION NEEDED' : 'READY TO START';
  useEffect(() => {
    const now = performance.now();
    if (state === 'running' && dominant && historyValue > 0 && now - lastHistorySampleRef.current >= 1000) {
      lastHistorySampleRef.current = now;
      setHistory((values) => [...values.slice(-31), {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        emotion: dominant.dominant,
        confidence: historyValue,
      }]);
    }
  }, [dominant, historyValue, state]);
  return <main className="min-h-[calc(100dvh-72px)] bg-background">
    <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-4"><button onClick={onBack} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="Back to overview" data-testid="button-workspace-back"><ArrowRight className="h-4 w-4 rotate-180" /></button><div><div className="eyebrow text-primary">Workspace / camera 01</div><h1 className="mt-1 text-xl font-bold tracking-tight">Live observation</h1></div></div><div className="mono flex items-center gap-2 text-[10px] text-muted-foreground"><span className={`h-2 w-2 rounded-full ${state === 'running' ? 'bg-primary' : state === 'error' ? 'bg-destructive' : 'bg-muted-foreground'}`} />{statusLabel}</div></div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(330px,.65fr)]">
        <section className="overflow-hidden rounded-2xl border border-border bg-card/70"><div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5"><span className="eyebrow flex items-center gap-2"><Camera className="h-3.5 w-3.5 text-primary" /> Camera feed</span><span className="mono text-[10px] text-muted-foreground">{faces.length ? `${faces.length} ${faces.length === 1 ? 'face' : 'faces'} detected` : 'no faces detected'}</span></div>
           <div className="relative aspect-video min-h-[280px] overflow-hidden bg-[#111c24]"><video ref={videoRef} muted playsInline className={`h-full w-full object-cover transition-opacity ${mirror ? 'scale-x-[-1]' : ''} ${paused ? 'opacity-60' : ''}`} data-testid="video-camera-feed" /><canvas ref={overlayRef} className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity ${mirror ? 'scale-x-[-1]' : ''} ${showBoxes ? 'opacity-100' : 'opacity-0'}`} data-testid="canvas-face-overlay" /><CameraOverlay state={state} error={error} onStart={handleStart} /></div>
           <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 sm:px-5"><div className="flex items-center gap-5"><div><div className="eyebrow">FPS</div><div className="mono mt-1 text-sm">{fps || '—'}</div></div><div><div className="eyebrow">PROCESSING</div><div className="mono mt-1 text-sm">{processingMs ? `${processingMs}ms` : '—'}</div></div><div><div className="eyebrow">MODEL</div><div className="mono mt-1 text-sm text-primary">TINY FACE</div></div></div><div className="flex flex-wrap gap-2">{state === 'running' && <><button type="button" onClick={() => setMirror((value) => !value)} aria-pressed={mirror} aria-label="Mirror camera" data-testid="button-mirror-camera" className={`inline-flex min-h-9 items-center gap-2 rounded-xl border px-3 text-xs font-bold transition ${mirror ? 'border-primary/60 bg-primary/10 text-primary' : 'border-border bg-card/40 text-muted-foreground hover:text-foreground'}`}><FlipHorizontal2 className="h-3.5 w-3.5" /><span className="hidden sm:inline">Mirror</span></button><button type="button" onClick={() => setShowBoxes((value) => !value)} aria-pressed={showBoxes} aria-label="Show or hide bounding boxes" data-testid="button-toggle-boxes" className={`inline-flex min-h-9 items-center gap-2 rounded-xl border px-3 text-xs font-bold transition ${showBoxes ? 'border-primary/60 bg-primary/10 text-primary' : 'border-border bg-card/40 text-muted-foreground hover:text-foreground'}`}>{showBoxes ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}<span className="hidden sm:inline">Boxes</span></button><Button variant="outline" onClick={handlePause} testId="button-pause-camera" className="min-h-9 px-3">{paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}<span className="hidden sm:inline">{paused ? 'Resume' : 'Pause'}</span></Button><Button variant="ghost" onClick={stop} testId="button-stop-camera" className="min-h-9 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive">Stop</Button></>}</div></div>
        </section>
        <aside className="flex flex-col gap-5">
          <section className="rounded-2xl border border-border bg-card/70 p-5" data-testid="panel-expression-summary"><div className="flex items-start justify-between"><div><div className="eyebrow text-primary">Primary estimate</div><div className="mt-3 text-3xl font-extrabold capitalize tracking-[-.04em]">{dominant?.dominant || 'Awaiting face'}</div></div><Gauge className="h-5 w-5 text-primary" /></div><div className="mt-6"><div className="mb-2 flex justify-between text-xs text-muted-foreground"><span>confidence</span><span className="mono text-foreground">{dominant ? `${Math.round(dominant.confidence * 100)}%` : '—'}</span></div><div className="h-1.5 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${dominant ? dominant.confidence * 100 : 0}%` }} /></div></div></section>
          <section className="rounded-2xl border border-border bg-card/70 p-5" data-testid="panel-expression-breakdown"><div className="mb-4 flex items-center justify-between"><div className="eyebrow">Expression scores</div><BarChart3 className="h-4 w-4 text-muted-foreground" /></div>{dominant ? Object.entries(dominant.expressions).sort((a, b) => b[1] - a[1]).map(([name, value]) => <div key={name} className="mb-3 last:mb-0"><div className="mb-1 flex justify-between text-xs capitalize"><span className="text-muted-foreground">{name}</span><span className="mono text-[10px] text-foreground">{Math.round(value * 100)}%</span></div><div className="h-1 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full transition-all duration-300" style={{ width: `${value * 100}%`, backgroundColor: expressionColors[name as ExpressionName] }} /></div></div>) : <div className="rounded-lg border border-dashed border-border py-7 text-center"><p className="text-xs text-muted-foreground">Scores appear when a face is visible.</p></div>}</section>
           <section className="rounded-2xl border border-border bg-card/70 p-5" data-testid="panel-history"><div className="mb-4 flex items-center justify-between gap-3"><div><div className="eyebrow">Expression history</div><span className="mono mt-1 block text-[10px] text-muted-foreground">last 32 samples</span></div><button type="button" onClick={() => setHistory([])} disabled={!history.length} aria-label="Clear expression history" data-testid="button-clear-history" className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] font-bold text-muted-foreground transition hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"><Trash2 className="h-3 w-3" /> Clear</button></div><HistoryChart history={historyForChart} /><div className="mt-4 space-y-2">{history.slice(-4).reverse().map((entry, index) => <div key={`${entry.time}-${index}`} className="flex items-center justify-between text-xs"><span className="mono text-[10px] text-muted-foreground">{entry.time}</span><span className="capitalize text-foreground">{entry.emotion} <span className="mono ml-2 text-[10px] text-muted-foreground">{Math.round(entry.confidence * 100)}%</span></span></div>)}</div></section>
        </aside>
      </div>
      <div className="mt-5 flex items-start gap-3 rounded-xl border border-border/70 bg-card/30 p-4 text-xs leading-5 text-muted-foreground"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>Local processing is active. Expression estimates are not a person’s true internal emotional state and should not be used for diagnosis, hiring, or decisions about people.</span></div>
    </div>
  </main>;
}

function App() {
  const [workspace, setWorkspace] = useState(false);
  const enterWorkspace = () => { setWorkspace(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const exitWorkspace = () => setWorkspace(false);
  return <div className="noise min-h-[100dvh] overflow-x-hidden">{workspace ? <><header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl"><div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8"><button onClick={exitWorkspace} aria-label="Return to EmotionDetector overview" data-testid="button-return-overview"><Logo /></button><a href={GITHUB_URL} target="_blank" rel="noreferrer" className="hidden items-center gap-2 text-sm text-muted-foreground hover:text-foreground sm:flex" data-testid="link-workspace-github"><Github className="h-4 w-4" /> View source</a></div></header><Workspace onBack={exitWorkspace} /></> : <><Header onStart={enterWorkspace} /><Hero onStart={enterWorkspace} /><FeatureSection /><ProcessSection /><Disclaimer /><footer className="border-t border-border/70"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8"><Logo compact /><span>Facial expression estimates, processed locally in your browser.</span><a href={GITHUB_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-foreground" data-testid="link-footer-github"><Github className="h-4 w-4" /> Open source</a></div></footer></>}</div>;
}

export default App;