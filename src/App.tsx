import { useState, useEffect, useRef } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
type Screen =
  | 'onboarding'
  | 'login'
  | 'dashboard'
  | 'attendance'
  | 'video'
  | 'scan'
  | 'exam'
  | 'student'
  | 'admin';

type Role = 'teacher' | 'student' | 'admin' | null;

// ─── Icons (inline SVG) ───────────────────────────────────────────────────────
const Icon = {
  check: (cls = '') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  x: (cls = '') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  chevronRight: (cls = '') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  chevronLeft: (cls = '') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  bell: (cls = '') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  ),
  grid: (cls = '') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  users: (cls = '') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  video: (cls = '') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  ),
  scan: (cls = '') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2"/><line x1="3" y1="12" x2="21" y2="12"/>
    </svg>
  ),
  fileText: (cls = '') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  camera: (cls = '') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
    </svg>
  ),
  mic: (cls = '') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  ),
  micOff: (cls = '') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6"/><path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
    </svg>
  ),
  videoOff: (cls = '') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 16v1a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h2m5.66 0H14a2 2 0 012 2v3.34l1 1L23 7v10"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ),
  share: (cls = '') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  ),
  plus: (cls = '') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  clock: (cls = '') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  download: (cls = '') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  trash: (cls = '') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
    </svg>
  ),
  eye: (cls = '') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  send: (cls = '') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  phone: (cls = '') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.22 1.17 2 2 0 012.22 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l.62-.62a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0120.92 16z"/>
    </svg>
  ),
  star: (cls = '') => (
    <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  book: (cls = '') => (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
    </svg>
  ),
  logo: () => (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      <rect width="32" height="32" rx="8" fill="#0D9488"/>
      <path d="M8 16C8 11.582 11.582 8 16 8C18.21 8 20.21 8.894 21.657 10.343" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="16" cy="16" r="3" fill="white"/>
      <path d="M19 19L23 23" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const students = [
  { id: 1, name: 'Alicia Reyes', status: 'present' as const },
  { id: 2, name: 'Benjo Santos', status: 'absent' as const },
  { id: 3, name: 'Carla Mendoza', status: 'late' as const },
  { id: 4, name: 'Diego Villanueva', status: 'present' as const },
  { id: 5, name: 'Elena Cruz', status: 'present' as const },
  { id: 6, name: 'Franz Dela Cruz', status: 'absent' as const },
  { id: 7, name: 'Grace Lim', status: 'present' as const },
  { id: 8, name: 'Hector Bautista', status: 'present' as const },
];

// ─── Shared Components ────────────────────────────────────────────────────────
function Avatar({ name, size = 'md', color = 'teal' }: { name: string; size?: 'sm' | 'md' | 'lg'; color?: string }) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const colors: Record<string, string> = {
    teal: 'bg-teal-100 text-teal-700',
    orange: 'bg-orange-100 text-orange-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
    pink: 'bg-pink-100 text-pink-700',
  };
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  return (
    <div className={`${sizes[size]} ${colors[color] || colors.teal} rounded-full flex items-center justify-center font-semibold flex-shrink-0`} style={{ fontFamily: 'Outfit, sans-serif' }}>
      {initials}
    </div>
  );
}

function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'present' | 'absent' | 'late' | 'live' | 'accent' }) {
  const styles: Record<string, string> = {
    default: 'bg-gray-100 text-gray-600',
    present: 'bg-teal-50 text-teal-700',
    absent: 'bg-red-50 text-red-600',
    late: 'bg-amber-50 text-amber-700',
    live: 'bg-red-500 text-white',
    accent: 'bg-orange-50 text-orange-600',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>
      {variant === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
      {children}
    </span>
  );
}

function ProgressBar({ value, max, color = 'teal' }: { value: number; max: number; color?: string }) {
  const pct = Math.round((value / max) * 100);
  const colors: Record<string, string> = { teal: 'bg-teal-500', orange: 'bg-orange-500', red: 'bg-red-500', amber: 'bg-amber-500' };
  return (
    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
      <div
        className={`h-2 rounded-full transition-all duration-700 ${colors[color] || colors.teal}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ─── Screen: Onboarding ───────────────────────────────────────────────────────
const slides = [
  {
    emoji: '⏱',
    title: 'Reclaim 45 minutes every week',
    body: 'Teachers in Philippine schools lose nearly an hour daily switching between apps. Classly unifies it all.',
    bg: 'from-teal-500 to-teal-600',
  },
  {
    emoji: '📋',
    title: 'Attendance in seconds, not minutes',
    body: 'Tap-to-mark rosters, automatic percentage tracking, and one-tap export to DepEd forms.',
    bg: 'from-teal-600 to-cyan-600',
  },
  {
    emoji: '📄',
    title: 'Auto-grade exams with your camera',
    body: 'Scan bubble-sheet answer sheets and get class analytics before the period ends.',
    bg: 'from-orange-500 to-orange-600',
  },
];

function OnboardingScreen({ onDone }: { onDone: (role: Role) => void }) {
  const [slide, setSlide] = useState(0);
  const [selected, setSelected] = useState<Role>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      if (slide < slides.length - 1) setSlide(s => s + 1);
    }, 3500);
    return () => clearTimeout(t);
  }, [slide]);

  const s = slides[slide];
  return (
    <div className="min-h-screen flex flex-col">
      {/* Carousel */}
      <div className={`flex-1 bg-gradient-to-br ${s.bg} flex flex-col items-center justify-center px-8 text-white transition-all duration-500`}>
        <div className="text-7xl mb-8 animate-slide-up" key={slide + 'emoji'}>{s.emoji}</div>
        <h1 className="text-3xl font-bold text-center mb-4 leading-tight animate-slide-up" key={slide + 'title'} style={{ fontFamily: 'Outfit, sans-serif', animationDelay: '0.05s' }}>
          {s.title}
        </h1>
        <p className="text-center text-white/80 text-base leading-relaxed animate-slide-up" key={slide + 'body'} style={{ animationDelay: '0.1s' }}>
          {s.body}
        </p>
        <div className="flex gap-2 mt-10">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`rounded-full transition-all duration-300 ${i === slide ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40'}`} />
          ))}
        </div>
      </div>

      {/* Bottom card */}
      <div className="bg-white rounded-t-3xl px-6 pt-8 pb-10 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <Icon.logo />
          <div>
            <div className="font-bold text-lg text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Classly</div>
            <div className="text-xs text-gray-400">One platform. Every classroom.</div>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4 font-medium">I am a…</p>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {(['teacher', 'student', 'admin'] as Role[]).map(r => {
            const label = r === 'teacher' ? 'Teacher' : r === 'student' ? 'Student' : 'Admin';
            const emoji = r === 'teacher' ? '👩‍🏫' : r === 'student' ? '👨‍🎓' : '🏫';
            const isSelected = selected === r;
            return (
              <button key={r} onClick={() => setSelected(r)}
                className={`flex flex-col items-center gap-2 py-4 rounded-2xl border-2 transition-all duration-200 active:scale-95 ${isSelected ? 'border-teal-500 bg-teal-50' : 'border-gray-100 hover:border-teal-300 hover:bg-teal-50/50'}`}>
                <span className="text-2xl">{emoji}</span>
                <span className={`text-xs font-semibold ${isSelected ? 'text-teal-700' : 'text-gray-600'}`}>{label}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => selected && onDone(selected)}
          disabled={!selected}
          className="w-full py-3.5 rounded-2xl bg-teal-600 text-white font-semibold text-base transition-all duration-200 active:scale-95 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed">
          {selected ? `Continue as ${selected.charAt(0).toUpperCase() + selected.slice(1)}` : 'Select your role'}
        </button>
      </div>
    </div>
  );
}

// ─── Screen: Login ────────────────────────────────────────────────────────────
function LoginScreen({ role, onLogin }: { role: Role; onLogin: (role: Role) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const roleLabel = role === 'teacher' ? 'Teacher' : role === 'student' ? 'Student' : 'Admin';
  const roleEmoji = role === 'teacher' ? '👩‍🏫' : role === 'student' ? '👨‍🎓' : '🏫';
  const gradients: Record<string, string> = {
    teacher: 'from-teal-500 to-teal-700',
    student: 'from-sky-500 to-sky-700',
    admin: 'from-violet-500 to-violet-700',
  };
  const gradient = role ? gradients[role] : gradients.teacher;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(role); }, 1200);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header band */}
      <div className={`bg-gradient-to-br ${gradient} px-6 pt-16 pb-16 flex flex-col items-center`}>
        <div className="text-4xl mb-2">{roleEmoji}</div>
        <h1 className="mt-2 text-3xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Sign in as {roleLabel}</h1>
        <p className="text-white/70 text-sm mt-1">Welcome to Classly</p>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-t-3xl -mt-8 flex-1 px-6 pt-8 pb-10 shadow-xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Email address</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="juan.dela.cruz@school.edu.ph"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Password</label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"
            />
          </div>
          <div className="flex justify-end">
            <button type="button" className="text-xs text-teal-600 font-medium">Forgot password?</button>
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-teal-600 text-white font-semibold text-base mt-2 flex items-center justify-center gap-2 hover:bg-teal-700 transition-all active:scale-95 disabled:opacity-70">
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Signing in…</span></>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full h-px bg-gray-100" /></div>
          <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">or continue with</span></div>
        </div>

        <button onClick={() => onLogin(role)}
          className="w-full py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
          <span className="text-lg">🏫</span> Sign in with DepEd SSO
        </button>

        <p className="text-center text-xs text-gray-400 mt-8">
          New to Classly? <button onClick={() => onLogin(role)} className="text-teal-600 font-semibold">Create account</button>
        </p>
      </div>
    </div>
  );
}

// ─── Screen: Dashboard ────────────────────────────────────────────────────────
const modules = [
  { id: 'attendance', label: 'Attendance', icon: Icon.users, color: 'bg-teal-500', light: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-100', badge: '3 pending' },
  { id: 'video', label: 'Video Class', icon: Icon.video, color: 'bg-violet-500', light: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-100', badge: 'Live now', live: true },
  { id: 'scan', label: 'Test Scan', icon: Icon.scan, color: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100', badge: 'New results' },
  { id: 'exam', label: 'Exam Builder', icon: Icon.fileText, color: 'bg-sky-500', light: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-100', badge: '2 drafts' },
];

const todayClasses = [
  { subject: 'Mathematics 10-A', time: '7:30 – 8:30 AM', room: 'Room 204', status: 'done' },
  { subject: 'Science 9-B', time: '9:00 – 10:00 AM', room: 'Room 112', status: 'live' },
  { subject: 'English 11-C', time: '1:00 – 2:00 PM', room: 'Room 305', status: 'upcoming' },
  { subject: 'Filipino 12-A', time: '2:30 – 3:30 PM', room: 'Room 201', status: 'upcoming' },
];

function DashboardScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-5 pt-12 pb-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <p className="text-xs text-gray-400">Good morning,</p>
          <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Ms. Santos 👋</h2>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setNotifOpen(n => !n)} className="relative w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all">
            {Icon.bell('w-5 h-5 text-gray-500')}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full animate-[badge-bounce_1s_ease-in-out_infinite]" />
          </button>
          <Avatar name="Maria Santos" size="md" color="teal" />
        </div>
      </div>

      {/* Notification dropdown */}
      {notifOpen && (
        <div className="absolute top-24 right-4 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 z-20 animate-slide-up overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
            <span className="font-semibold text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>Notifications</span>
            <Badge variant="accent">3 new</Badge>
          </div>
          {[
            { icon: '📋', msg: 'Attendance for Science 9-B is pending', time: '5 min ago' },
            { icon: '📄', msg: 'Test scan results ready for Math 10-A', time: '1 hr ago' },
            { icon: '🎥', msg: 'Video class starts in 10 minutes', time: '2 hr ago' },
          ].map((n, i) => (
            <div key={i} className="px-4 py-3 hover:bg-gray-50 transition-all border-b border-gray-50 last:border-0">
              <div className="flex items-start gap-3">
                <span className="text-lg">{n.icon}</span>
                <div>
                  <p className="text-sm text-gray-800 leading-snug">{n.msg}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
        {/* Date strip */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Today</p>
            <p className="text-sm text-gray-400">Monday, September 22</p>
          </div>
          <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-full">
            {Icon.clock('w-3.5 h-3.5 text-orange-500')}
            <span className="text-xs font-semibold text-orange-600">4 classes</span>
          </div>
        </div>

        {/* Live class banner */}
        <div
          className="bg-gradient-to-r from-violet-600 to-violet-700 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all duration-200"
          onClick={() => onNavigate('video')}
        >
          <div>
            <Badge variant="live">LIVE</Badge>
            <h3 className="text-white font-bold mt-1" style={{ fontFamily: 'Outfit, sans-serif' }}>Science 9-B</h3>
            <p className="text-violet-200 text-xs mt-0.5">9:00 – 10:00 AM · 28 students online</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            {Icon.video('w-6 h-6 text-white')}
          </div>
        </div>

        {/* Module grid */}
        <div>
          <h3 className="font-semibold text-gray-700 text-sm mb-3">Quick Access</h3>
          <div className="grid grid-cols-2 gap-3">
            {modules.map(m => (
              <button
                key={m.id}
                onClick={() => onNavigate(m.id as Screen)}
                className={`${m.light} ${m.border} border rounded-2xl p-4 text-left hover:shadow-md hover:scale-[1.02] transition-all duration-200 active:scale-95`}
              >
                <div className={`w-10 h-10 ${m.color} rounded-xl flex items-center justify-center mb-3`}>
                  <m.icon cls="w-5 h-5 text-white" />
                </div>
                <div className={`text-xs font-semibold ${m.text} mb-0.5`}>{m.label}</div>
                <div className="text-[11px] text-gray-400 flex items-center gap-1">
                  {m.live && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                  {m.badge}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Today's schedule */}
        <div>
          <h3 className="font-semibold text-gray-700 text-sm mb-3">Today's Schedule</h3>
          <div className="space-y-2.5">
            {todayClasses.map((c, i) => (
              <div key={i} className={`bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 border ${c.status === 'live' ? 'border-violet-200 shadow-sm' : 'border-transparent'}`}>
                <div className={`w-1 self-stretch rounded-full ${c.status === 'done' ? 'bg-gray-200' : c.status === 'live' ? 'bg-violet-500' : 'bg-teal-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm truncate ${c.status === 'done' ? 'text-gray-400' : 'text-gray-800'}`} style={{ fontFamily: 'Outfit, sans-serif' }}>{c.subject}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{c.time} · {c.room}</p>
                </div>
                {c.status === 'live' && <Badge variant="live">Live</Badge>}
                {c.status === 'done' && <span className="text-xs text-gray-300 font-medium">Done</span>}
                {c.status === 'upcoming' && Icon.chevronRight('w-4 h-4 text-gray-300')}
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div>
          <h3 className="font-semibold text-gray-700 text-sm mb-3">This Week</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Avg Attendance', value: '87%', trend: '+2%', color: 'text-teal-600' },
              { label: 'Tests Scanned', value: '142', trend: 'today', color: 'text-orange-600' },
              { label: 'Exams Published', value: '3', trend: 'active', color: 'text-sky-600' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-2xl p-3 text-center border border-gray-50">
                <div className={`text-xl font-bold ${stat.color}`} style={{ fontFamily: 'Outfit, sans-serif' }}>{stat.value}</div>
                <div className="text-[10px] text-gray-400 leading-tight mt-0.5">{stat.label}</div>
                <div className="text-[10px] text-gray-300 mt-0.5">{stat.trend}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-6" />
      </div>

      {/* Bottom nav */}
      <BottomNav active="dashboard" onNavigate={onNavigate} />
    </div>
  );
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
function BottomNav({ active, onNavigate }: { active: string; onNavigate: (s: Screen) => void }) {
  const items = [
    { id: 'dashboard', label: 'Home', icon: Icon.grid },
    { id: 'attendance', label: 'Attendance', icon: Icon.users },
    { id: 'exam', label: 'Exams', icon: Icon.fileText },
    { id: 'student', label: 'Students', icon: Icon.book },
  ];
  return (
    <div className="bg-white border-t border-gray-100 px-2 pb-6 pt-2 flex items-center justify-around sticky bottom-0 z-10">
      {items.map(item => (
        <button key={item.id} onClick={() => onNavigate(item.id as Screen)}
          className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all ${active === item.id ? 'text-teal-600' : 'text-gray-400 hover:text-gray-600'}`}>
          <item.icon cls={`w-5 h-5 ${active === item.id ? 'stroke-teal-600' : ''}`} />
          <span className="text-[10px] font-medium">{item.label}</span>
          {active === item.id && <span className="w-1 h-1 rounded-full bg-teal-500" />}
        </button>
      ))}
    </div>
  );
}

// ─── Screen: Attendance ───────────────────────────────────────────────────────
type AttStatus = 'present' | 'absent' | 'late' | 'none';

function AttendanceScreen({ onBack }: { onBack: () => void }) {
  const [roster, setRoster] = useState<{ id: number; name: string; status: AttStatus }[]>(
    students.map(s => ({ ...s, status: s.status as AttStatus }))
  );
  const [saved, setSaved] = useState(false);

  const mark = (id: number, status: AttStatus) =>
    setRoster(r => r.map(s => s.id === id ? { ...s, status } : s));

  const counts = {
    present: roster.filter(s => s.status === 'present').length,
    absent: roster.filter(s => s.status === 'absent').length,
    late: roster.filter(s => s.status === 'late').length,
  };
  const pct = Math.round((counts.present / roster.length) * 100);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all">
            {Icon.chevronLeft('w-4 h-4 text-gray-600')}
          </button>
          <div>
            <h2 className="font-bold text-lg text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Attendance</h2>
            <p className="text-xs text-gray-400">Science 9-B · Sept 22, 2026</p>
          </div>
          <div className="ml-auto">
            <button onClick={handleSave} className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all ${saved ? 'bg-teal-50 text-teal-600' : 'bg-teal-600 text-white hover:bg-teal-700'}`}>
              {saved ? '✓ Saved' : 'Save'}
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { label: 'Present', count: counts.present, color: 'text-teal-600', bg: 'bg-teal-50' },
            { label: 'Absent', count: counts.absent, color: 'text-red-500', bg: 'bg-red-50' },
            { label: 'Late', count: counts.late, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map(stat => (
            <div key={stat.label} className={`${stat.bg} rounded-xl py-2 text-center`}>
              <div className={`text-xl font-bold ${stat.color}`} style={{ fontFamily: 'Outfit, sans-serif' }}>{stat.count}</div>
              <div className="text-[10px] text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ProgressBar value={counts.present} max={roster.length} />
          <span className="text-sm font-bold text-teal-600 whitespace-nowrap">{pct}%</span>
        </div>
      </div>

      {/* Roster */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2.5">
        {roster.map((s, i) => (
          <div key={s.id} className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 animate-fade-in border border-gray-50" style={{ animationDelay: `${i * 0.04}s` }}>
            <Avatar name={s.name} color={['teal', 'orange', 'blue', 'purple', 'pink'][i % 5] as any} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-800 truncate">{s.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">Student #{String(i + 1).padStart(2, '0')}</p>
            </div>
            {/* Status buttons */}
            <div className="flex items-center gap-1.5">
              {(['present', 'late', 'absent'] as AttStatus[]).map(st => (
                <button
                  key={st}
                  onClick={() => mark(s.id, st)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-150 active:scale-90 ${
                    s.status === st
                      ? st === 'present' ? 'bg-teal-500 text-white shadow-sm'
                        : st === 'absent' ? 'bg-red-500 text-white shadow-sm'
                        : 'bg-amber-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {st === 'present' ? '✓' : st === 'absent' ? '✗' : 'L'}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Export bar */}
      <div className="bg-white border-t border-gray-100 px-5 py-4 pb-8 flex gap-3">
        <button className="flex-1 py-3 rounded-xl bg-teal-50 text-teal-700 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-teal-100 transition-all">
          {Icon.download('w-4 h-4')} Export CSV
        </button>
        <button className="flex-1 py-3 rounded-xl bg-orange-50 text-orange-700 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-orange-100 transition-all">
          {Icon.share('w-4 h-4')} Share
        </button>
      </div>
    </div>
  );
}

// ─── Screen: Video Conferencing ───────────────────────────────────────────────
const participants = [
  { name: 'Maria Santos', role: 'teacher', muted: false },
  { name: 'Alicia Reyes', role: 'student', muted: false },
  { name: 'Benjo Santos', role: 'student', muted: true },
  { name: 'Carla Mendoza', role: 'student', muted: false },
  { name: 'Diego Villanueva', role: 'student', muted: true },
  { name: 'Elena Cruz', role: 'student', muted: false },
];

function VideoScreen({ onBack }: { onBack: () => void }) {
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState('');
  const [messages, setMessages] = useState([
    { from: 'Alicia Reyes', text: 'Good morning Ma\'am!', time: '9:02 AM' },
    { from: 'Benjo Santos', text: 'Ma\'am yung slides po?', time: '9:04 AM' },
    { from: 'Elena Cruz', text: 'Present po! 🙋‍♀️', time: '9:05 AM' },
  ]);

  const sendMsg = () => {
    if (!chatMsg.trim()) return;
    setMessages(m => [...m, { from: 'You', text: chatMsg, time: 'now' }]);
    setChatMsg('');
  };

  const colors = ['teal', 'orange', 'blue', 'purple', 'pink', 'teal'];

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Top bar */}
      <div className="px-4 pt-12 pb-3 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="live">LIVE</Badge>
            <span className="text-white font-semibold text-sm" style={{ fontFamily: 'Outfit, sans-serif' }}>Science 9-B</span>
          </div>
          <p className="text-gray-400 text-xs mt-0.5">28 participants · 34:12</p>
        </div>
        <button onClick={onBack} className="px-3 py-1.5 bg-red-500/20 rounded-xl text-red-400 text-sm font-semibold hover:bg-red-500/30 transition-all flex items-center gap-1.5">
          {Icon.phone('w-3.5 h-3.5')} End
        </button>
      </div>

      {/* Main video (teacher) */}
      <div className="mx-4 rounded-2xl overflow-hidden bg-gradient-to-br from-teal-800 to-teal-900 relative" style={{ height: 200 }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <Avatar name="Maria Santos" size="lg" color="teal" />
        </div>
        <div className="absolute bottom-2 left-2 bg-black/60 rounded-lg px-2 py-1">
          <span className="text-white text-xs font-medium">Ms. Santos (You)</span>
        </div>
        <div className="absolute top-2 right-2 flex gap-1.5">
          {!micOn && <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">{Icon.micOff('w-3 h-3 text-white')}</span>}
        </div>
      </div>

      {/* Participant grid */}
      <div className="px-4 mt-3 grid grid-cols-3 gap-2 flex-1">
        {participants.slice(1).map((p, i) => (
          <div key={i} className="rounded-xl bg-gray-800 relative overflow-hidden flex items-center justify-center" style={{ height: 80 }}>
            <Avatar name={p.name} size="sm" color={colors[i] as any} />
            <div className="absolute bottom-1 left-1 right-1">
              <p className="text-white text-[9px] font-medium truncate text-center leading-tight bg-black/40 rounded px-1 py-0.5">{p.name.split(' ')[0]}</p>
            </div>
            {p.muted && (
              <div className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                {Icon.micOff('w-2 h-2 text-white')}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="px-4 py-4 pb-8 flex items-center justify-between">
        <button onClick={() => setMicOn(m => !m)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${micOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}>
          {micOn ? Icon.mic('w-6 h-6 text-white') : Icon.micOff('w-6 h-6 text-white')}
        </button>
        <button onClick={() => setCamOn(c => !c)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${camOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}>
          {camOn ? Icon.video('w-6 h-6 text-white') : Icon.videoOff('w-6 h-6 text-white')}
        </button>
        <button onClick={() => setChatOpen(c => !c)}
          className="w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-all relative">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full" />
        </button>
        <button className="w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-all">
          {Icon.share('w-6 h-6 text-white')}
        </button>
      </div>

      {/* Chat drawer */}
      {chatOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 flex items-end" onClick={() => setChatOpen(false)}>
          <div className="w-full bg-white rounded-t-3xl max-h-[70vh] flex flex-col animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <span className="font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Class Chat</span>
              <button onClick={() => setChatOpen(false)} className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center">
                {Icon.x('w-3.5 h-3.5 text-gray-500')}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.from === 'You' ? 'flex-row-reverse' : ''}`}>
                  <Avatar name={m.from} size="sm" color="teal" />
                  <div className={`max-w-[75%] px-3 py-2 rounded-2xl ${m.from === 'You' ? 'bg-teal-600 text-white rounded-tr-sm' : 'bg-gray-100 text-gray-800 rounded-tl-sm'}`}>
                    {m.from !== 'You' && <p className="text-[10px] font-semibold text-gray-500 mb-0.5">{m.from}</p>}
                    <p className="text-sm">{m.text}</p>
                    <p className={`text-[10px] mt-0.5 ${m.from === 'You' ? 'text-teal-200' : 'text-gray-400'}`}>{m.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 pb-6 pt-2 flex gap-2">
              <input value={chatMsg} onChange={e => setChatMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMsg()}
                placeholder="Type a message…"
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm outline-none"
              />
              <button onClick={sendMsg} className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center hover:bg-teal-700 transition-all">
                {Icon.send('w-4 h-4 text-white')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Screen: Test Scan ────────────────────────────────────────────────────────
type ScanPhase = 'idle' | 'scanning' | 'processing' | 'results';

function ScanScreen({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<ScanPhase>('idle');
  const [progress, setProgress] = useState(0);

  const startScan = () => {
    setPhase('scanning');
    setProgress(0);
    const t = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(t);
          setPhase('processing');
          setTimeout(() => setPhase('results'), 1500);
          return 100;
        }
        return p + 4;
      });
    }, 80);
  };

  const results = [
    { name: 'Alicia Reyes', score: 45, total: 50, pct: 90 },
    { name: 'Benjo Santos', score: 38, total: 50, pct: 76 },
    { name: 'Carla Mendoza', score: 42, total: 50, pct: 84 },
    { name: 'Diego Villanueva', score: 28, total: 50, pct: 56 },
    { name: 'Elena Cruz', score: 47, total: 50, pct: 94 },
    { name: 'Grace Lim', score: 35, total: 50, pct: 70 },
  ];
  const avgPct = Math.round(results.reduce((a, r) => a + r.pct, 0) / results.length);

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      <div className="bg-white border-b border-gray-100 px-5 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all">
            {Icon.chevronLeft('w-4 h-4 text-gray-600')}
          </button>
          <div>
            <h2 className="font-bold text-lg text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Test Scan</h2>
            <p className="text-xs text-gray-400">Math 10-A · Auto-grading</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        {phase === 'idle' && (
          <div className="space-y-5 animate-fade-in">
            {/* Camera viewfinder */}
            <div className="bg-gray-900 rounded-3xl overflow-hidden relative" style={{ height: 280 }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-64 border-2 border-orange-400 rounded-xl relative">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-orange-400 rounded-tl" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-orange-400 rounded-tr" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-orange-400 rounded-bl" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-orange-400 rounded-br" />
                  <p className="absolute inset-0 flex items-center justify-center text-white/40 text-xs text-center px-4">Position answer sheet within frame</p>
                </div>
              </div>
              <div className="absolute top-4 right-4 bg-black/60 rounded-xl px-3 py-1.5">
                <span className="text-white text-xs font-medium">Auto · 12MP</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={startScan}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl py-4 flex flex-col items-center gap-2 transition-all active:scale-95">
                {Icon.camera('w-6 h-6')}
                <span className="font-semibold text-sm">Scan Answer Sheet</span>
              </button>
              <button className="bg-white border border-gray-200 text-gray-700 rounded-2xl py-4 flex flex-col items-center gap-2 transition-all hover:bg-gray-50 active:scale-95">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span className="font-semibold text-sm">Upload Image</span>
              </button>
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
              <p className="text-sm font-semibold text-orange-700 mb-1">📋 Previous batch</p>
              <p className="text-xs text-orange-600">Math 10-A Quiz #3 · Scanned 2 hours ago · 30 sheets</p>
              <button className="mt-2 text-xs text-orange-700 font-semibold underline underline-offset-2">View results →</button>
            </div>
          </div>
        )}

        {(phase === 'scanning' || phase === 'processing') && (
          <div className="flex flex-col items-center justify-center py-16 space-y-6 animate-fade-in">
            <div className="w-32 h-44 bg-gray-100 rounded-2xl relative overflow-hidden border-2 border-orange-200">
              <div className="absolute inset-x-0 h-0.5 bg-orange-500 shadow-lg" style={{
                top: `${(progress / 100) * 100}%`,
                boxShadow: '0 0 8px 2px rgba(249, 115, 22, 0.5)',
                transition: 'top 0.08s linear',
              }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="space-y-1.5 opacity-30">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <div key={j} className={`w-3 h-3 rounded-sm ${Math.random() > 0.5 ? 'bg-gray-800' : 'bg-gray-300'}`} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                {phase === 'scanning' ? 'Scanning…' : 'Processing…'}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {phase === 'scanning' ? `${progress}% complete` : 'Detecting bubbles & computing scores'}
              </p>
            </div>
            {phase === 'scanning' && (
              <div className="w-48">
                <ProgressBar value={progress} max={100} color="orange" />
              </div>
            )}
            {phase === 'processing' && (
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            )}
          </div>
        )}

        {phase === 'results' && (
          <div className="space-y-4 animate-slide-up">
            {/* Summary card */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white">
              <p className="text-orange-100 text-sm font-medium">Math 10-A · Quiz #4</p>
              <div className="flex items-end gap-3 mt-1">
                <span className="text-5xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>{avgPct}%</span>
                <span className="text-orange-200 text-sm mb-2">class average</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-orange-400/40">
                <div className="text-center">
                  <div className="text-xl font-bold">{results.filter(r => r.pct >= 75).length}</div>
                  <div className="text-[10px] text-orange-200 uppercase tracking-wide">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">{results.filter(r => r.pct < 75).length}</div>
                  <div className="text-[10px] text-orange-200 uppercase tracking-wide">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold">{results.length}</div>
                  <div className="text-[10px] text-orange-200 uppercase tracking-wide">Total</div>
                </div>
              </div>
            </div>

            <h3 className="font-semibold text-gray-700 text-sm">Individual Scores</h3>
            {results.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl px-4 py-3.5 border border-gray-50 animate-slide-up" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="flex items-center gap-3">
                  <Avatar name={r.name} size="sm" color={['teal', 'orange', 'blue', 'purple', 'pink', 'teal'][i] as any} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="font-semibold text-sm text-gray-800 truncate">{r.name}</p>
                      <span className={`text-sm font-bold ${r.pct >= 75 ? 'text-teal-600' : 'text-red-500'}`}>
                        {r.score}/{r.total}
                      </span>
                    </div>
                    <ProgressBar value={r.score} max={r.total} color={r.pct >= 75 ? 'teal' : 'red'} />
                  </div>
                </div>
              </div>
            ))}

            <div className="grid grid-cols-2 gap-3">
              <button className="bg-orange-50 text-orange-700 font-semibold text-sm py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-100 transition-all">
                {Icon.download('w-4 h-4')} Export
              </button>
              <button onClick={() => setPhase('idle')} className="bg-teal-50 text-teal-700 font-semibold text-sm py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-teal-100 transition-all">
                {Icon.scan('w-4 h-4')} Scan More
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Screen: Exam Builder ─────────────────────────────────────────────────────
type QuestionType = 'multiple_choice' | 'true_false' | 'essay';

interface Question {
  id: number;
  type: QuestionType;
  text: string;
  choices?: string[];
  answer?: string | number;
}

function ExamScreen({ onBack }: { onBack: () => void }) {
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, type: 'multiple_choice', text: 'What is the SI unit of force?', choices: ['Newton', 'Joule', 'Watt', 'Pascal'], answer: 0 },
    { id: 2, type: 'true_false', text: 'Photosynthesis occurs in the mitochondria.', answer: 'False' },
    { id: 3, type: 'essay', text: 'Explain the law of conservation of energy in your own words.' },
  ]);
  const [preview, setPreview] = useState(false);
  const [published, setPublished] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newType, setNewType] = useState<QuestionType>('multiple_choice');
  const [newText, setNewText] = useState('');

  const addQuestion = () => {
    if (!newText.trim()) return;
    const q: Question = {
      id: Date.now(),
      type: newType,
      text: newText,
      choices: newType === 'multiple_choice' ? ['Option A', 'Option B', 'Option C', 'Option D'] : undefined,
      answer: newType === 'true_false' ? 'True' : 0,
    };
    setQuestions(qs => [...qs, q]);
    setNewText('');
    setAdding(false);
  };

  const remove = (id: number) => setQuestions(qs => qs.filter(q => q.id !== id));

  const typeLabel: Record<QuestionType, string> = {
    multiple_choice: 'Multiple Choice',
    true_false: 'True / False',
    essay: 'Essay',
  };
  const typeColor: Record<QuestionType, string> = {
    multiple_choice: 'bg-sky-50 text-sky-600',
    true_false: 'bg-violet-50 text-violet-600',
    essay: 'bg-orange-50 text-orange-600',
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      <div className="bg-white border-b border-gray-100 px-5 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all">
            {Icon.chevronLeft('w-4 h-4 text-gray-600')}
          </button>
          <div className="flex-1">
            <h2 className="font-bold text-lg text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>Exam Builder</h2>
            <p className="text-xs text-gray-400">Science 9-B · Quiz #5</p>
          </div>
          <button onClick={() => setPreview(p => !p)} className="p-2 hover:bg-gray-100 rounded-xl transition-all">
            {Icon.eye('w-5 h-5 text-gray-500')}
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="font-medium text-gray-600">{questions.length} questions</span>
          <span>·</span>
          <span>{questions.filter(q => q.type === 'multiple_choice').length} MC</span>
          <span>·</span>
          <span>{questions.filter(q => q.type === 'essay').length} essay</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
        {questions.map((q, i) => (
          <div key={q.id} className={`bg-white rounded-2xl p-4 border border-gray-50 animate-slide-up ${preview ? '' : 'hover:border-sky-200 transition-colors'}`} style={{ animationDelay: `${i * 0.04}s` }}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-gray-400">Q{i + 1}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeColor[q.type]}`}>{typeLabel[q.type]}</span>
              </div>
              {!preview && (
                <button onClick={() => remove(q.id)} className="w-6 h-6 bg-red-50 rounded-full flex items-center justify-center hover:bg-red-100 transition-all flex-shrink-0">
                  {Icon.trash('w-3 h-3 text-red-400')}
                </button>
              )}
            </div>
            <p className="text-sm text-gray-800 font-medium leading-snug">{q.text}</p>

            {q.type === 'multiple_choice' && q.choices && (
              <div className="mt-3 space-y-1.5">
                {q.choices.map((c, ci) => (
                  <div key={ci} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm ${ci === q.answer ? 'bg-teal-50 border border-teal-200 text-teal-700 font-medium' : 'bg-gray-50 text-gray-600'}`}>
                    <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${ci === q.answer ? 'border-teal-500 bg-teal-500 text-white' : 'border-gray-300 text-gray-400'}`}>
                      {String.fromCharCode(65 + ci)}
                    </span>
                    {c}
                  </div>
                ))}
              </div>
            )}

            {q.type === 'true_false' && (
              <div className="mt-3 flex gap-2">
                {['True', 'False'].map(opt => (
                  <div key={opt} className={`px-4 py-1.5 rounded-xl text-sm font-medium ${q.answer === opt ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-gray-100 text-gray-400'}`}>
                    {opt}
                  </div>
                ))}
              </div>
            )}

            {q.type === 'essay' && !preview && (
              <div className="mt-3 px-3 py-2 bg-gray-50 rounded-xl text-sm text-gray-400 italic">Student response area</div>
            )}
          </div>
        ))}

        {/* Add question */}
        {!preview && !adding && (
          <button onClick={() => setAdding(true)}
            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-2 text-gray-400 hover:border-sky-400 hover:text-sky-500 transition-all">
            {Icon.plus('w-5 h-5')} Add Question
          </button>
        )}

        {adding && (
          <div className="bg-white rounded-2xl p-4 border-2 border-sky-200 animate-slide-up space-y-3">
            <p className="font-semibold text-sm text-gray-800">New Question</p>
            <div className="flex gap-2 flex-wrap">
              {(['multiple_choice', 'true_false', 'essay'] as QuestionType[]).map(t => (
                <button key={t} onClick={() => setNewType(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${newType === t ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                  {typeLabel[t]}
                </button>
              ))}
            </div>
            <textarea value={newText} onChange={e => setNewText(e.target.value)}
              placeholder="Type your question here…"
              rows={3}
              className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-800 outline-none focus:bg-gray-100 transition-all resize-none"
            />
            <div className="flex gap-2">
              <button onClick={() => setAdding(false)} className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-all">Cancel</button>
              <button onClick={addQuestion} className="flex-1 py-2 rounded-xl bg-sky-500 text-white text-sm font-semibold hover:bg-sky-600 transition-all">Add</button>
            </div>
          </div>
        )}

        <div className="h-4" />
      </div>

      {/* Publish bar */}
      <div className="bg-white border-t border-gray-100 px-5 py-4 pb-8 space-y-3">
        {published && (
          <div className="bg-teal-50 border border-teal-200 rounded-xl px-4 py-3 flex items-center gap-2 animate-slide-up">
            {Icon.check('w-4 h-4 text-teal-600')}
            <p className="text-sm text-teal-700 font-medium">Exam published to Science 9-B!</p>
          </div>
        )}
        <div className="flex gap-3">
          <button className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 transition-all">
            Save Draft
          </button>
          <button onClick={() => setPublished(true)}
            className="flex-1 py-3 rounded-xl bg-sky-500 text-white font-semibold text-sm hover:bg-sky-600 transition-all flex items-center justify-center gap-2">
            {Icon.send('w-4 h-4')} Publish
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Screen: Student View ─────────────────────────────────────────────────────
function StudentScreen({ onBack }: { onBack: () => void }) {
  const schedule = [
    { subject: 'Mathematics 10-A', teacher: 'Mr. Cruz', time: '7:30 AM', room: '204', status: 'done' },
    { subject: 'Science 9-B', teacher: 'Ms. Santos', time: '9:00 AM', room: '112', status: 'live' },
    { subject: 'English 11-C', teacher: 'Ms. Reyes', time: '1:00 PM', room: '305', status: 'upcoming' },
  ];
  const grades = [
    { subject: 'Mathematics', score: 88, grade: 'A' },
    { subject: 'Science', score: 92, grade: 'A+' },
    { subject: 'English', score: 79, grade: 'B+' },
    { subject: 'Filipino', score: 85, grade: 'A' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-sky-500 to-teal-600 px-5 pt-12 pb-8">
        <button onClick={onBack} className="mb-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
          {Icon.chevronLeft('w-4 h-4 text-white')}
        </button>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">👨‍🎓</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Juan dela Cruz</h2>
            <p className="text-sky-200 text-sm">Grade 10-A · Student</p>
            <div className="flex items-center gap-1.5 mt-1">
              {Icon.star('w-3 h-3 text-yellow-400')}
              <span className="text-white text-xs font-medium">86 avg · Honor Roll</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 -mt-3 space-y-5">
        {/* Today's classes */}
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-50">
          <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
            <span className="font-semibold text-sm text-gray-800" style={{ fontFamily: 'Outfit, sans-serif' }}>Today's Classes</span>
            <Badge variant="accent">Sept 22</Badge>
          </div>
          <div className="divide-y divide-gray-50">
            {schedule.map((c, i) => (
              <div key={i} className="px-4 py-3.5 flex items-center gap-3">
                <div className={`w-1.5 h-10 rounded-full ${c.status === 'live' ? 'bg-violet-500' : c.status === 'done' ? 'bg-gray-200' : 'bg-teal-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm truncate ${c.status === 'done' ? 'text-gray-400' : 'text-gray-800'}`}>{c.subject}</p>
                  <p className="text-xs text-gray-400">{c.teacher} · {c.time} · Room {c.room}</p>
                </div>
                {c.status === 'live' && (
                  <button className="px-3 py-1.5 bg-violet-600 text-white text-xs font-semibold rounded-xl hover:bg-violet-700 transition-all active:scale-95 flex items-center gap-1.5">
                    {Icon.video('w-3.5 h-3.5')} Join
                  </button>
                )}
                {c.status === 'done' && <span className="text-xs text-gray-300">Done</span>}
                {c.status === 'upcoming' && <span className="text-xs text-teal-500 font-medium">Soon</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Grades */}
        <div>
          <h3 className="font-semibold text-gray-700 text-sm mb-3">My Grades</h3>
          <div className="space-y-2.5">
            {grades.map((g, i) => (
              <div key={i} className="bg-white rounded-2xl px-4 py-3.5 flex items-center gap-4 border border-gray-50 animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${g.score >= 90 ? 'bg-teal-50 text-teal-700' : g.score >= 80 ? 'bg-sky-50 text-sky-700' : 'bg-amber-50 text-amber-700'}`} style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {g.grade}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800 truncate">{g.subject}</p>
                  <ProgressBar value={g.score} max={100} color={g.score >= 90 ? 'teal' : g.score >= 80 ? 'teal' : 'amber'} />
                </div>
                <span className="font-bold text-sm text-gray-600">{g.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending assignments */}
        <div>
          <h3 className="font-semibold text-gray-700 text-sm mb-3">Pending</h3>
          {[
            { title: 'Math Quiz #5', subject: 'Mathematics', due: 'Today, 11:59 PM', urgent: true },
            { title: 'Science Lab Report', subject: 'Science', due: 'Tomorrow, 8:00 AM', urgent: false },
          ].map((a, i) => (
            <div key={i} className={`bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3 border mb-2.5 ${a.urgent ? 'border-orange-100' : 'border-gray-50'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${a.urgent ? 'bg-orange-50' : 'bg-gray-50'}`}>
                {Icon.fileText(`w-5 h-5 ${a.urgent ? 'text-orange-500' : 'text-gray-400'}`)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-800">{a.title}</p>
                <p className="text-xs text-gray-400">{a.subject} · Due {a.due}</p>
              </div>
              {a.urgent && <Badge variant="accent">Due soon</Badge>}
            </div>
          ))}
        </div>

        <div className="h-6" />
      </div>

      <BottomNav active="student" onNavigate={onBack as any} />
    </div>
  );
}

// ─── Screen: Admin Dashboard ──────────────────────────────────────────────────
function AdminScreen({ onBack }: { onBack: () => void }) {
  const schools = [
    { name: 'Rizal National High School', teachers: 48, students: 1240, attendance: 91 },
    { name: 'Bonifacio Elementary School', teachers: 22, students: 580, attendance: 88 },
    { name: 'Luna College', teachers: 61, students: 2100, attendance: 85 },
  ];
  const stats = [
    { label: 'Total Students', value: '3,920', icon: '👨‍🎓', color: 'bg-sky-50 text-sky-700' },
    { label: 'Active Teachers', value: '131', icon: '👩‍🏫', color: 'bg-teal-50 text-teal-700' },
    { label: 'Classes Today', value: '284', icon: '📚', color: 'bg-orange-50 text-orange-700' },
    { label: 'Avg Attendance', value: '88%', icon: '📋', color: 'bg-violet-50 text-violet-700' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-600 to-violet-800 px-5 pt-12 pb-8">
        <button onClick={onBack} className="mb-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
          {Icon.chevronLeft('w-4 h-4 text-white')}
        </button>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">🏫</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>Admin Portal</h2>
            <p className="text-violet-300 text-sm">DepEd Division Office · Region IV-A</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white text-xs font-medium">3 schools · All systems operational</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 -mt-3 space-y-5">
        {/* KPI grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s, i) => (
            <div key={i} className={`${s.color} rounded-2xl p-4 animate-slide-up`} style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>{s.value}</div>
              <div className="text-xs font-medium opacity-70 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Schools */}
        <div>
          <h3 className="font-semibold text-gray-700 text-sm mb-3">Schools Overview</h3>
          <div className="space-y-3">
            {schools.map((sc, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-gray-50 animate-slide-up" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0 pr-2">
                    <p className="font-semibold text-sm text-gray-800 leading-snug">{sc.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{sc.teachers} teachers · {sc.students.toLocaleString()} students</p>
                  </div>
                  <Badge variant={sc.attendance >= 90 ? 'present' : sc.attendance >= 85 ? 'default' : 'late'}>
                    {sc.attendance}%
                  </Badge>
                </div>
                <div>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                    <span>Attendance rate</span><span>{sc.attendance}%</span>
                  </div>
                  <ProgressBar value={sc.attendance} max={100} color={sc.attendance >= 90 ? 'teal' : sc.attendance >= 85 ? 'teal' : 'amber'} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <h3 className="font-semibold text-gray-700 text-sm mb-3">Recent Activity</h3>
          <div className="bg-white rounded-2xl border border-gray-50 divide-y divide-gray-50 overflow-hidden">
            {[
              { icon: '📋', text: 'Attendance submitted — Rizal NHS Grade 10-A', time: '5 min ago', color: 'bg-teal-50' },
              { icon: '🎥', text: '14 live classes currently in session', time: '9:00 AM', color: 'bg-violet-50' },
              { icon: '📄', text: '3 new exam results published', time: '8:45 AM', color: 'bg-orange-50' },
              { icon: '👤', text: 'New teacher account: Engr. Dela Torre', time: 'Yesterday', color: 'bg-sky-50' },
            ].map((a, i) => (
              <div key={i} className="px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-all">
                <div className={`w-8 h-8 rounded-xl ${a.color} flex items-center justify-center text-base flex-shrink-0`}>{a.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 leading-snug">{a.text}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{a.time}</p>
                </div>
                {Icon.chevronRight('w-4 h-4 text-gray-300 flex-shrink-0')}
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <h3 className="font-semibold text-gray-700 text-sm mb-3">Admin Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Add Teacher', icon: '➕', color: 'bg-teal-50 text-teal-700' },
              { label: 'Enroll Students', icon: '📝', color: 'bg-sky-50 text-sky-700' },
              { label: 'Generate Report', icon: '📊', color: 'bg-orange-50 text-orange-700' },
              { label: 'System Settings', icon: '⚙️', color: 'bg-violet-50 text-violet-700' },
            ].map((a, i) => (
              <button key={i} className={`${a.color} rounded-2xl py-4 flex flex-col items-center gap-2 font-semibold text-sm hover:opacity-80 transition-all active:scale-95`}>
                <span className="text-2xl">{a.icon}</span>
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-6" />
      </div>

      {/* Bottom nav */}
      <div className="bg-white border-t border-gray-100 px-2 pb-6 pt-2 flex items-center justify-around sticky bottom-0 z-10">
        {[
          { label: 'Overview', icon: Icon.grid },
          { label: 'Schools', icon: Icon.users },
          { label: 'Reports', icon: Icon.fileText },
          { label: 'Settings', icon: Icon.scan },
        ].map((item, i) => (
          <button key={i} className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all ${i === 0 ? 'text-violet-600' : 'text-gray-400 hover:text-gray-600'}`}>
            <item.icon cls={`w-5 h-5 ${i === 0 ? 'stroke-violet-600' : ''}`} />
            <span className="text-[10px] font-medium">{item.label}</span>
            {i === 0 && <span className="w-1 h-1 rounded-full bg-violet-500" />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>('onboarding');
  const [role, setRole] = useState<Role>(null);

  const nav = (s: Screen) => setScreen(s);

  // Route to the correct home screen after login based on role
  const homeForRole = (r: Role): Screen => {
    if (r === 'student') return 'student';
    if (r === 'admin') return 'admin';
    return 'dashboard'; // teacher
  };

  const screens: Record<Screen, React.ReactNode> = {
    onboarding: <OnboardingScreen onDone={(r) => { setRole(r); setScreen('login'); }} />,
    login: <LoginScreen role={role} onLogin={(r) => { setRole(r); setScreen(homeForRole(r)); }} />,
    dashboard: <DashboardScreen onNavigate={nav} />,
    attendance: <AttendanceScreen onBack={() => nav('dashboard')} />,
    video: <VideoScreen onBack={() => nav('dashboard')} />,
    scan: <ScanScreen onBack={() => nav('dashboard')} />,
    exam: <ExamScreen onBack={() => nav('dashboard')} />,
    student: <StudentScreen onBack={() => nav(homeForRole(role))} />,
    admin: <AdminScreen onBack={() => nav('onboarding')} />,
  };

  return (
    <div className="max-w-sm mx-auto min-h-screen relative overflow-hidden shadow-2xl bg-white">
      <div className="hidden lg:flex fixed top-0 left-0 right-0 bg-teal-700 text-white text-xs py-1.5 px-4 items-center justify-center gap-2 z-50">
        <span>📱 Classly · Select a role on the first screen to see different dashboards</span>
      </div>

      <div key={screen} className="animate-fade-in">
        {screens[screen]}
      </div>
    </div>
  );
}
