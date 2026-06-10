import type { AnchorHTMLAttributes } from "react";
import {
  ArrowRight,
  Camera,
  ChefHat,
  ChevronDown,
  Eye,
  Flame,
  HeartHandshake,
  Leaf,
  MessageCircle,
  Receipt,
  Shield,
  ShoppingBasket,
  Sparkles,
  Sprout,
  Timer,
  TrendingDown,
  Utensils,
  Wallet,
} from "lucide-react";
import {
  createElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

function Link({ to, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  return <a href={to} {...props} />;
}

function Reveal({
  as = "div",
  children,
  className,
  delay = 0,
  style,
  ...props
}: HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  children: ReactNode;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node || isVisible) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [isVisible]);

  return createElement(
    as,
    {
      ...props,
      ref,
      className: cn("reveal-on-scroll", isVisible && "is-visible", className),
      style: {
        ...style,
        "--reveal-delay": `${delay}ms`,
      } as CSSProperties,
    },
    children,
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-canvas font-sans text-earth-950 antialiased">
      <SiteNav />
      <main>
        <Hero />
        <ProblemStrip />
        <HowItWorks />
        <FeatureRows />
        <Journey />
        <TrustSection />
        <FAQ />
        <FinalCTA />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ---------------- Nav ---------------- */

function SiteNav() {
  return (
    <Reveal
      as="header"
      className="sticky top-0 z-40 border-b border-earth-200/60 bg-canvas/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-xl bg-earth-950 text-canvas">
            <ChefHat className="size-4" />
          </div>
          <span className="font-serif text-2xl leading-none">Remy</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-earth-700 md:flex">
          <a href="#how" className="transition-colors hover:text-earth-950">
            How it works
          </a>
          <a href="#features" className="transition-colors hover:text-earth-950">
            Features
          </a>
          <a href="#trust" className="transition-colors hover:text-earth-950">
            Trust
          </a>
          <a href="#faq" className="transition-colors hover:text-earth-950">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/app"
            className="hidden rounded-full px-3 py-2 text-sm font-medium text-earth-800 hover:bg-earth-100 sm:inline-flex"
          >
            See the app
          </Link>
          <Link
            to="/app/onboarding"
            className="inline-flex items-center gap-1.5 rounded-full bg-earth-950 px-4 py-2 text-sm font-semibold text-canvas transition-transform active:scale-95"
          >
            Open Remy <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------------- Hero ---------------- */

function Hero() {
  return (
    <Reveal
      as="section"
      className="relative overflow-hidden"
      style={{
        background:
          "radial-gradient(60% 70% at 75% 25%, color-mix(in oklab, var(--warm) 14%, transparent) 0%, transparent 60%), radial-gradient(50% 60% at 15% 80%, color-mix(in oklab, var(--leaf) 10%, transparent) 0%, transparent 65%)",
      }}
    >
      <div className="mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-6xl items-center gap-8 px-5 py-8 sm:py-10 md:grid-cols-[1.05fr_1fr] md:gap-8 md:px-8 lg:py-12">
        <Reveal className="space-y-5 lg:space-y-6" delay={120}>
          <span className="inline-flex items-center gap-2 rounded-full bg-warm-soft px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-warm ring-1 ring-warm/20">
            <Sparkles className="size-3" /> AI co-pilot · cooking, first
          </span>
          <h1 className="text-balance font-serif text-[2.35rem] leading-[1.02] sm:text-5xl md:text-6xl lg:text-[4rem]">
            Cook with quiet
            <br />
            confidence.
          </h1>
          <p className="max-w-[50ch] text-pretty text-sm leading-relaxed text-earth-700 sm:text-base md:text-[1.05rem]">
            Remy is a calm AI coach for your kitchen. It sees what you have, guides you through the
            cook with gentle real-time tips, and helps you spend less at the grocery store ” without
            ever making you feel watched.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              to="/app/onboarding"
              className="inline-flex items-center gap-2 rounded-2xl bg-earth-950 px-6 py-3.5 text-sm font-semibold text-canvas transition-transform active:scale-[0.98]"
            >
              <Flame className="size-4" /> Start cooking
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-earth-950 ring-1 ring-black/5 transition-colors hover:bg-earth-100"
            >
              See how it works
            </a>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-[12px] text-earth-600">
            <span className="inline-flex items-center gap-1.5">
              <Shield className="size-3.5" /> Camera footage stays on device
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Leaf className="size-3.5" /> Free during beta
            </span>
          </div>
        </Reveal>

        {/* Phone mock cluster */}
        <Reveal
          className="relative mx-auto h-[300px] w-full max-w-[300px] sm:h-[360px] sm:max-w-[340px] md:h-[460px] md:max-w-[360px] lg:h-[500px] lg:max-w-[380px]"
          delay={260}
        >
          {/* Tilted background phone */}
          <div className="absolute right-0 top-6 hidden h-full w-[80%] -rotate-6 sm:block">
            <PhoneFrame tone="dark" />
          </div>
          {/* Foreground phone */}
          <div className="absolute left-0 top-0 h-full w-[78%] rotate-[-2deg] sm:left-2">
            <PhoneFrame>
              <LiveCookingMock />
            </PhoneFrame>
          </div>
          {/* Floating swap card */}
          <div className="absolute -bottom-2 right-0 w-[235px] rotate-[4deg] sm:-bottom-6 sm:-right-4">
            <SwapCard />
          </div>
          {/* Floating step chip */}
          <div className="absolute -top-3 right-3 rotate-[-4deg] rounded-full bg-canvas px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-earth-800 shadow-lg ring-1 ring-black/5">
            Step 3 of 8 · 12 min left
          </div>
        </Reveal>
      </div>
    </Reveal>
  );
}

/* ---------------- Problem ---------------- */

const problems = [
  {
    icon: ShoppingBasket,
    title: "Empty fridge, blank mind",
    body: "You have ingredients, you just can't see the meal.",
  },
  { icon: Receipt, title: "Wasted ingredients", body: "Half a bunch of herbs goes brown again." },
  {
    icon: MessageCircle,
    title: "Stuck mid-recipe",
    body: "Is the pan hot enough? Is this burning? Recipes won't say.",
  },
  {
    icon: Wallet,
    title: "Grocery creep",
    body: "Twenty dollars for an ingredient you'll use twice.",
  },
];

function ProblemStrip() {
  return (
    <Section eyebrow="The everyday friction" title="Cooking shouldn't feel like a quiz.">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {problems.map((p, i) => {
          const Icon = p.icon;
          return (
            <Reveal
              key={p.title}
              delay={i * 80}
              className="rounded-[24px] bg-white p-6 ring-1 ring-black/5"
            >
              <div className="grid size-10 place-items-center rounded-xl bg-earth-100 text-earth-800">
                <Icon className="size-5" strokeWidth={1.8} />
              </div>
              <p className="mt-4 font-serif text-xl leading-snug">{p.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-earth-600">{p.body}</p>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* ---------------- How it works ---------------- */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Tell us what you have",
      body: "Snap your fridge or tap a few items. Remy figures out what you can realistically make tonight.",
      mock: <SetupMock />,
    },
    {
      n: "02",
      title: "Cook with a calm coach",
      body: "Point your camera at the pan. Remy nudges in the moment ” heat down, garlic ready, sauce glossy.",
      mock: <CameraMock />,
    },
    {
      n: "03",
      title: "Reflect & save money",
      body: "A warm recap with wins and one small thing to try. Plus cheaper swaps for next week's shop.",
      mock: <FeedbackMock />,
    },
  ];
  return (
    <Section id="how" eyebrow="How Remy works" title="Three moments, one calm flow.">
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((s, i) => (
          <Reveal key={s.n} className="space-y-5" delay={i * 100}>
            <div className="overflow-hidden rounded-[28px] bg-earth-100/60 p-5 ring-1 ring-black/5">
              {s.mock}
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-warm">
                {s.n}
              </p>
              <h3 className="mt-1.5 font-serif text-2xl leading-tight">{s.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-earth-600">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- Feature rows ---------------- */

const features = [
  {
    eyebrow: "Recipes from what you have",
    title: "No more 'what's for dinner?'",
    body: "Remy looks at your pantry photos and the chips you've tapped, then suggests something doable ” not aspirational. Always with a realistic time and skill level.",
    bullets: [
      "Photo-based ingredient detection",
      "Filters for time, mood & skill",
      "Saves what you actually liked",
    ],
    mock: <RecipeMock />,
  },
  {
    eyebrow: "Live camera guidance",
    title: "A coach that's actually there.",
    body: "Remy watches the pan with you and offers quiet, well-timed nudges. No popups, no lectures ” just the small note you wish someone had said.",
    bullets: [
      "Real-time pan & timing cues",
      "Voice or silent mode",
      "Pause, rewind a step, ask a question",
    ],
    mock: <CameraMockLarge />,
  },
  {
    eyebrow: "Thoughtful post-cook feedback",
    title: "A recap that feels like a friend.",
    body: "Wins first. One thing to try next time. No streaks, no shame. Remy tracks the skill, not the calories.",
    bullets: [
      "Wins & gentle 'to try' notes",
      "Skill tree progress",
      "Explainable ” every tip cites why",
    ],
    mock: <FeedbackMockLarge />,
  },
  {
    eyebrow: "Smarter grocery help",
    title: "Cook well, spend less.",
    body: "Pine nuts for $9? Try toasted sunflower seeds. Remy suggests honest swaps and flags what's on sale nearby ” no upsells, no affiliate noise.",
    bullets: [
      "Cheaper ingredient swaps",
      "Sale-aware suggestions",
      "Tracks your real monthly savings",
    ],
    mock: <SavingsMock />,
  },
  {
    eyebrow: "Progress that compounds",
    title: "Confidence, one cook at a time.",
    body: "Each session feeds a quiet skill tree. You'll feel saute, knife work, and seasoning move from 'shaky' to 'second nature' ” without a single notification chasing you.",
    bullets: [
      "Skill tree across techniques",
      "Weekly recap, no streaks",
      "Coach voice you can tune",
    ],
    mock: <ProgressMock />,
  },
];

function FeatureRows() {
  return (
    <Reveal as="section" id="features" className="border-t border-earth-200/60 bg-earth-100/40">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <Reveal as="header" className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-warm">
            What Remy does
          </p>
          <h2 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
            Built for the way you actually cook.
          </h2>
        </Reveal>

        <div className="mt-16 space-y-20 md:space-y-28">
          {features.map((f, i) => (
            <Reveal
              key={f.title}
              delay={80}
              className={cn(
                "grid items-center gap-10 md:grid-cols-2 md:gap-16",
                i % 2 === 1 && "md:[&>*:first-child]:order-2",
              )}
            >
              <div className="space-y-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-warm">
                  {f.eyebrow}
                </p>
                <h3 className="text-balance font-serif text-3xl leading-tight md:text-4xl">
                  {f.title}
                </h3>
                <p className="text-pretty text-base leading-relaxed text-earth-700">{f.body}</p>
                <ul className="space-y-2 pt-1">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-earth-800">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-warm" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">{f.mock}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

/* ---------------- Example journey ---------------- */

const beats = [
  {
    time: "6:42 PM",
    title: "Opens the app, tired.",
    body: "Remy greets her by name. 'What do you have on hand?'",
  },
  {
    time: "6:43 PM",
    title: "Snaps the fridge.",
    body: "Three photos. Remy identifies pasta, garlic, half a lemon, parmesan, wilted spinach.",
  },
  {
    time: "6:44 PM",
    title: "Picks a 20-minute pasta.",
    body: "Easy+ difficulty. The coach quietly notes today's skill: garlic that's golden, not burnt.",
  },
  {
    time: "6:51 PM",
    title: "Cooks with the coach.",
    body: "'Ease the heat down a notch.' She does. The garlic stays sweet. She smiles.",
  },
  {
    time: "7:09 PM",
    title: "A calm recap.",
    body: "One win, one tiny thing to try. And a $4 swap for next week's pine nuts.",
  },
];

function Journey() {
  return (
    <Section eyebrow="A Tuesday with Remy" title="A small story.">
      <div className="relative mx-auto max-w-3xl">
        <div className="absolute left-[14px] top-2 bottom-2 w-px bg-earth-200 md:left-[19px]" />
        <ol className="space-y-6">
          {beats.map((b, i) => (
            <Reveal
              as="li"
              key={b.time}
              delay={i * 80}
              className="relative grid grid-cols-[40px_1fr] items-start gap-4"
            >
              <div className="relative z-10 grid size-[30px] place-items-center rounded-full bg-earth-950 font-serif text-xs text-canvas md:size-10 md:text-sm">
                {i + 1}
              </div>
              <div className="rounded-[20px] bg-white p-5 ring-1 ring-black/5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-warm">
                  {b.time}
                </p>
                <p className="mt-1 font-serif text-xl leading-snug">{b.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-earth-600">{b.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}

/* ---------------- Trust ---------------- */

const trust = [
  {
    icon: Eye,
    title: "You're in control",
    body: "Camera and mic are off by default. Turn them on per session, never globally.",
  },
  {
    icon: HeartHandshake,
    title: "Guidance, not judgment",
    body: "Remy suggests, never scolds. No streaks, no shame, no leaderboard.",
  },
  {
    icon: Shield,
    title: "Explainable feedback",
    body: "Every tip cites why. You can tap any note to see what the coach saw.",
  },
];

function TrustSection() {
  return (
    <Reveal as="section" id="trust" className="border-y border-earth-200/60 bg-earth-100/40">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <Reveal as="header" className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-leaf">
            Trust & care
          </p>
          <h2 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
            Guidance, not judgment.
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-earth-700">
            An AI that helps you cook should also know when to stay quiet. Remy is built to feel
            calm, explainable, and yours.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {trust.map((t, i) => {
            const Icon = t.icon;
            return (
              <Reveal
                key={t.title}
                delay={i * 80}
                className="rounded-[24px] bg-leaf-soft p-6 ring-1 ring-leaf/15"
              >
                <div className="grid size-10 place-items-center rounded-xl bg-white/70 text-leaf">
                  <Icon className="size-5" strokeWidth={1.8} />
                </div>
                <p className="mt-4 font-serif text-xl leading-snug">{t.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-earth-700">{t.body}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Reveal>
  );
}

/* ---------------- FAQ ---------------- */

const faqs = [
  {
    q: "What happens to my camera footage?",
    a: "Frames are processed on device whenever possible and never stored without your say-so. You can review and delete every session in Settings.",
  },
  {
    q: "Do I need a fancy phone?",
    a: "No. Remy runs on any modern Android or iOS phone with a rear camera. A tripod or phone stand helps, but isn't required.",
  },
  {
    q: "Will this cost money?",
    a: "Remy is free during beta. We'll always keep a generous free tier; paid plans (if any) will unlock advanced skills, not basic guidance.",
  },
  {
    q: "Is cooking the only skill?",
    a: "It's where we're starting ” kitchens are full of small skills that benefit from a patient coach. More everyday skills are on the way.",
  },
];

function FAQ() {
  return (
    <Section id="faq" eyebrow="Common questions" title="The honest answers.">
      <div className="mx-auto max-w-3xl divide-y divide-earth-200 overflow-hidden rounded-[28px] bg-white ring-1 ring-black/5">
        {faqs.map((f, i) => (
          <Reveal key={f.q} delay={i * 70}>
            <FAQItem q={f.q} a={f.a} defaultOpen={i === 0} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function FAQItem({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-earth-100/40"
      >
        <span className="font-serif text-lg leading-snug">{q}</span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-earth-600 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && <div className="px-6 pb-6 text-[14px] leading-relaxed text-earth-700">{a}</div>}
    </div>
  );
}

/* ---------------- Final CTA ---------------- */

function FinalCTA() {
  return (
    <Reveal as="section" className="px-5 py-20 md:px-8 md:py-28">
      <div
        className="mx-auto w-full max-w-5xl overflow-hidden rounded-[36px] p-10 ring-1 ring-warm/15 md:p-16"
        style={{
          background:
            "radial-gradient(70% 100% at 80% 0%, color-mix(in oklab, var(--warm) 22%, var(--canvas)) 0%, var(--canvas) 70%)",
        }}
      >
        <div className="grid items-center gap-10 md:grid-cols-[1.2fr_1fr]">
          <div className="space-y-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-warm">
              Your kitchen, your coach
            </p>
            <h2 className="text-balance font-serif text-4xl leading-[1.05] md:text-6xl">
              Cook something good
              <br />
              tonight.
            </h2>
            <p className="max-w-[44ch] text-base leading-relaxed text-earth-700">
              Open Remy, snap your fridge, and let a calm coach help you build real, everyday
              kitchen confidence.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/app/onboarding"
                className="inline-flex items-center gap-2 rounded-2xl bg-earth-950 px-6 py-3.5 text-sm font-semibold text-canvas transition-transform active:scale-[0.98]"
              >
                <Flame className="size-4" /> Start cooking
              </Link>
              <Link
                to="/app"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-earth-950 ring-1 ring-black/5 hover:bg-earth-100"
              >
                Tour the app
              </Link>
            </div>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="rounded-[24px] bg-white p-6 ring-1 ring-black/5"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-earth-600">
              Or join the waitlist
            </p>
            <p className="mt-1 font-serif text-xl leading-snug">
              We'll email you when Remy lands on Android.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                placeholder="you@kitchen.com"
                className="flex-1 rounded-2xl bg-earth-100/70 px-4 py-3 text-sm outline-none ring-1 ring-transparent placeholder:text-earth-600 focus:ring-warm/40"
              />
              <button
                type="submit"
                className="rounded-2xl bg-warm px-5 py-3 text-sm font-semibold text-white ring-4 ring-warm/10"
              >
                Notify me
              </button>
            </div>
            <p className="mt-3 text-[11px] text-earth-600">
              No spam. One short note when we open the doors.
            </p>
          </form>
        </div>
      </div>
    </Reveal>
  );
}

/* ---------------- Footer ---------------- */

function SiteFooter() {
  return (
    <Reveal as="footer" className="border-t border-earth-200/60">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid size-8 place-items-center rounded-xl bg-earth-950 text-canvas">
              <ChefHat className="size-4" />
            </div>
            <span className="font-serif text-2xl leading-none">Remy</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-earth-600">
            A calm AI coach for the kitchen ” and, one day, for every small skill that makes
            everyday life better.
          </p>
        </div>
        <FooterCol
          title="Product"
          items={[
            { label: "Open the app", to: "/app" },
            { label: "How it works", href: "#how" },
            { label: "Features", href: "#features" },
            { label: "FAQ", href: "#faq" },
          ]}
        />
        <FooterCol
          title="Company"
          items={[
            { label: "About", href: "#" },
            { label: "Press", href: "#" },
            { label: "Privacy", href: "#" },
            { label: "Contact", href: "#" },
          ]}
        />
      </div>
      <div className="border-t border-earth-200/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 text-[12px] text-earth-600 md:flex-row md:px-8">
          <p>© {new Date().getFullYear()} Remy Labs. Made with care.</p>
          <p className="inline-flex items-center gap-1.5">
            <Sprout className="size-3.5 text-leaf" /> Cooking, first.
          </p>
        </div>
      </div>
    </Reveal>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { label: string; href?: string; to?: string }[];
}) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-earth-600">
        {title}
      </p>
      <ul className="mt-3 space-y-2 text-sm text-earth-800">
        {items.map((it) =>
          it.to ? (
            <li key={it.label}>
              <Link to={it.to} className="hover:text-earth-950">
                {it.label}
              </Link>
            </li>
          ) : (
            <li key={it.label}>
              <a href={it.href} className="hover:text-earth-950">
                {it.label}
              </a>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}

/* ---------------- Shared section wrapper ---------------- */

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Reveal as="section" id={id} className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto w-full max-w-6xl">
        <Reveal as="header" className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-warm">
            {eyebrow}
          </p>
          <h2 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">{title}</h2>
        </Reveal>
        <div className="mt-14">{children}</div>
      </div>
    </Reveal>
  );
}

/* ---------------- Phone frame & mocks ---------------- */

function PhoneFrame({
  children,
  tone = "light",
}: {
  children?: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "relative h-full w-full rounded-[44px] p-2 shadow-2xl shadow-earth-950/15 ring-1 ring-black/10",
        tone === "dark" ? "bg-earth-900" : "bg-earth-950",
      )}
    >
      <div
        className={cn(
          "relative h-full w-full overflow-hidden rounded-[36px]",
          tone === "dark" ? "bg-earth-800" : "bg-canvas",
        )}
      >
        {/* notch */}
        <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-earth-950/90" />
        {children}
      </div>
    </div>
  );
}

function LiveCookingMock() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#5a4838_0%,#241a12_60%,#0a0604_100%)]" />
      <div className="absolute inset-0 opacity-50 mix-blend-overlay bg-[conic-gradient(at_40%_60%,#fdba74,#92400e,#1c1917,#fdba74)]" />
      <div className="absolute inset-0 grid place-items-center text-[5rem] opacity-30">ðŸ³</div>
      {/* Step pill */}
      <div className="absolute left-1/2 top-8 -translate-x-1/2 rounded-full bg-black/30 px-3 py-1.5 ring-1 ring-white/10 backdrop-blur-md">
        <p className="text-[10px] font-medium tracking-wide text-white">
          Step 4 of 12 · Saute the garlic
        </p>
      </div>
      {/* AI bubble */}
      <div className="absolute inset-x-3 bottom-3 flex gap-2.5 rounded-[20px] bg-white/95 p-3.5 shadow-xl ring-1 ring-black/5 backdrop-blur-sm">
        <div className="grid size-8 shrink-0 place-items-center rounded-full bg-warm-soft">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warm opacity-70" />
            <span className="relative inline-flex size-2 rounded-full bg-warm" />
          </span>
        </div>
        <div className="space-y-0.5">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-earth-600">
            Coach · live
          </p>
          <p className="text-pretty text-[12.5px] leading-snug text-earth-950">
            Garlic looks golden ” ease the heat down a notch.
          </p>
        </div>
      </div>
    </div>
  );
}

function SwapCard() {
  return (
    <div className="rounded-[20px] bg-white p-4 shadow-xl ring-1 ring-black/5">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-leaf">
        <TrendingDown className="size-3" /> Smart swap
      </div>
      <p className="mt-1.5 text-sm leading-snug">
        <span className="text-earth-600 line-through">Pine nuts</span>{" "}
        <span className="font-semibold">†’ sunflower seeds</span>
      </p>
      <div className="mt-2 inline-flex rounded-full bg-leaf-soft px-2 py-0.5 text-[11px] font-semibold text-leaf">
        ˆ’$4.80
      </div>
    </div>
  );
}

/* Small mocks used in How-It-Works */

function SetupMock() {
  const chips = ["Pasta", "Garlic", "Olive oil", "Parmesan", "Lemon", "Chili"];
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-2xl bg-white p-2.5 text-xs ring-1 ring-black/5">
        <div className="grid size-7 place-items-center rounded-lg bg-warm text-white">
          <Camera className="size-3.5" />
        </div>
        <span className="font-medium">Snap fridge & pantry</span>
        <span className="ml-auto rounded-full bg-warm-soft px-2 py-0.5 text-[10px] font-semibold text-warm">
          3 photos
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {chips.map((c, i) => (
          <span
            key={c}
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-medium ring-1",
              i < 4
                ? "bg-earth-950 text-canvas ring-earth-950"
                : "bg-white text-earth-700 ring-black/5",
            )}
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

function CameraMock() {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#5a4838_0%,#1f160e_70%)]" />
      <div className="absolute inset-0 grid place-items-center text-4xl opacity-40">ðŸ³</div>
      <div className="absolute inset-x-2 bottom-2 flex gap-2 rounded-xl bg-white/95 p-2.5 backdrop-blur">
        <span className="relative mt-1 flex size-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warm opacity-70" />
          <span className="relative inline-flex size-2 rounded-full bg-warm" />
        </span>
        <p className="text-[11px] leading-snug">Ease the heat down a notch.</p>
      </div>
    </div>
  );
}

function FeedbackMock() {
  return (
    <div className="space-y-2">
      <div className="rounded-2xl bg-leaf-soft p-3 ring-1 ring-leaf/15">
        <p className="text-[10px] font-bold uppercase tracking-wider text-leaf">Win</p>
        <p className="text-[12px] font-medium leading-snug">Steady heat through the sear.</p>
      </div>
      <div className="rounded-2xl bg-warm-soft p-3 ring-1 ring-warm/15">
        <p className="text-[10px] font-bold uppercase tracking-wider text-warm">To try</p>
        <p className="text-[12px] font-medium leading-snug">Slice garlic a touch thinner.</p>
      </div>
      <div className="rounded-2xl bg-white p-3 ring-1 ring-black/5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-medium">Saute</span>
          <span className="text-earth-600">70%</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-earth-200">
          <div className="h-full w-[70%] rounded-full bg-warm" />
        </div>
      </div>
    </div>
  );
}

/* Larger feature mocks */

function RecipeMock() {
  return (
    <div className="overflow-hidden rounded-[28px] bg-white ring-1 ring-black/5">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-warm-soft via-earth-100 to-earth-200">
        <div className="absolute inset-0 grid place-items-center text-7xl opacity-80">ðŸ</div>
        <span className="absolute right-4 top-4 rounded-full bg-canvas/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-earth-800 backdrop-blur">
          Suggested
        </span>
      </div>
      <div className="space-y-3 p-5">
        <h4 className="font-serif text-2xl leading-tight">Pasta + 3 pantry items</h4>
        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-earth-100/70 p-3 ring-1 ring-black/5">
          <MiniMeta icon={Timer} label="20 min" />
          <div className="border-x border-earth-200">
            <MiniMeta icon={Flame} label="Easy+" />
          </div>
          <MiniMeta icon={ChefHat} label="Saute" />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["Rigatoni", "Butter", "Garlic", "Parmesan"].map((t) => (
            <span
              key={t}
              className="rounded-full bg-white px-2.5 py-1 text-[11px] ring-1 ring-earth-200"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniMeta({ icon: Icon, label }: { icon: typeof Timer; label: string }) {
  return (
    <div className="flex flex-col items-center text-earth-800">
      <Icon className="size-3.5 text-earth-600" />
      <p className="mt-1 text-[11px] font-medium">{label}</p>
    </div>
  );
}

function CameraMockLarge() {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-earth-950 shadow-xl ring-1 ring-black/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#5a4838_0%,#241a12_60%,#0a0604_100%)]" />
      <div className="absolute inset-0 opacity-50 mix-blend-overlay bg-[conic-gradient(at_40%_60%,#fdba74,#92400e,#1c1917,#fdba74)]" />
      <div className="absolute inset-0 grid place-items-center text-7xl opacity-25">ðŸ³</div>

      <div className="absolute left-1/2 top-5 -translate-x-1/2 rounded-full bg-black/30 px-3 py-1.5 ring-1 ring-white/10 backdrop-blur">
        <p className="text-[11px] font-medium text-white">Step 4 · Saute the garlic</p>
      </div>

      <div className="absolute inset-x-4 bottom-4 space-y-2.5">
        <div className="flex gap-2.5 rounded-[20px] bg-white/95 p-3.5 shadow-xl ring-1 ring-black/5 backdrop-blur">
          <div className="grid size-8 shrink-0 place-items-center rounded-full bg-warm-soft">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warm opacity-70" />
              <span className="relative inline-flex size-2 rounded-full bg-warm" />
            </span>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-earth-600">
              Coach
            </p>
            <p className="text-[13px] leading-snug">
              Garlic is looking golden ” ease the heat down.
            </p>
          </div>
        </div>
        <div className="rounded-[20px] bg-canvas p-4 ring-1 ring-black/5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-earth-600">Next</p>
          <p className="mt-1 font-serif text-base leading-tight">
            Add the reserved pasta water, slowly.
          </p>
        </div>
      </div>
    </div>
  );
}

function FeedbackMockLarge() {
  return (
    <div className="space-y-3 rounded-[28px] bg-white p-6 ring-1 ring-black/5">
      <div className="grid size-12 place-items-center rounded-full bg-leaf-soft text-leaf">
        <Sparkles className="size-5" />
      </div>
      <h4 className="font-serif text-2xl leading-tight">Beautifully done.</h4>
      <p className="text-sm text-earth-600">
        That sauce had a real gloss to it. About 2 minutes quicker than last week.
      </p>
      <div className="grid grid-cols-2 gap-2 pt-2">
        <div className="rounded-2xl bg-leaf-soft p-3 ring-1 ring-leaf/15">
          <p className="text-[10px] font-bold uppercase tracking-wider text-leaf">Win</p>
          <p className="text-[12px] font-medium leading-snug">Steady heat through the sear.</p>
        </div>
        <div className="rounded-2xl bg-warm-soft p-3 ring-1 ring-warm/15">
          <p className="text-[10px] font-bold uppercase tracking-wider text-warm">To try</p>
          <p className="text-[12px] font-medium leading-snug">Slice garlic a touch thinner.</p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-2xl bg-earth-100/70 p-3 text-[11px]">
        <Utensils className="size-3.5 text-earth-600" />
        <span className="text-earth-700">
          Skill +1 · <span className="font-semibold">Saute</span>
        </span>
      </div>
    </div>
  );
}

function SavingsMock() {
  const items = [
    { from: "Pine nuts", to: "Sunflower seeds", save: "$4.80" },
    { from: "Heavy cream", to: "Milk + butter", save: "$2.10" },
    { from: "Fresh basil", to: "Frozen cubes", save: "$1.40" },
  ];
  return (
    <div className="space-y-3 rounded-[28px] bg-white p-6 ring-1 ring-black/5">
      <div className="flex items-center justify-between rounded-2xl bg-leaf-soft p-4 ring-1 ring-leaf/15">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-leaf">
            Saved this month
          </p>
          <p className="mt-0.5 font-serif text-3xl">$32.40</p>
        </div>
        <div className="grid size-11 place-items-center rounded-xl bg-white/70 text-leaf">
          <TrendingDown className="size-5" />
        </div>
      </div>
      <ul className="space-y-2">
        {items.map((s) => (
          <li
            key={s.from}
            className="flex items-center justify-between rounded-2xl bg-earth-100/60 p-3 text-[13px]"
          >
            <span>
              <span className="text-earth-600 line-through">{s.from}</span>{" "}
              <span className="font-semibold">†’ {s.to}</span>
            </span>
            <span className="rounded-full bg-leaf-soft px-2 py-0.5 text-[11px] font-semibold text-leaf">
              ˆ’{s.save}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProgressMock() {
  const skills = [
    { name: "Saute", level: 0.7 },
    { name: "Knife work", level: 0.5 },
    { name: "Roasting", level: 0.35 },
    { name: "Sauces", level: 0.2 },
  ];
  return (
    <div className="space-y-4 rounded-[28px] bg-white p-6 ring-1 ring-black/5">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-earth-600">
            This week
          </p>
          <p className="font-serif text-2xl">Quietly leveling up.</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-leaf-soft px-2 py-1 text-[11px] font-semibold text-leaf">
          <Sparkles className="size-3" /> +1 skill
        </span>
      </div>
      <ul className="space-y-3">
        {skills.map((s) => (
          <li key={s.name}>
            <div className="mb-1 flex justify-between text-[12px]">
              <span className="font-medium">{s.name}</span>
              <span className="text-earth-600">{Math.round(s.level * 100)}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-earth-200">
              <div className="h-full rounded-full bg-warm" style={{ width: `${s.level * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
