import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { Bed, Users, Flame, Bath, Utensils, TreePine, Footprints, Moon, Star, ArrowLeft, ArrowRight, Plus, Minus } from "lucide-react";

/* ---------- data ---------- */
const img = (id: string, w = 1000) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;
const P = {
  cabin: "1449158743715-0a90ebb6d2d8",
  rays: "1448375240586-882707db888b",
  living: "1502672260266-1c1ef2d93688",
  mist: "1511497584788-876760111969",
  canopy: "1441974231531-c6227db76b6e",
  trail: "1473448912268-2022ce9509d8",
  stream: "1426604966848-d7adac402bff",
};

const steps = [
  { when: "Day 1, from 3 pm", title: "Arrival", text: "Park at the door. Keys are in a lockbox. The heat is already on.", id: P.rays, alt: "Sunlit forest path with tall pines leading toward the cabin" },
  { when: "Day 1, evening", title: "Settling in", text: "Pick beds, light the fire, cook dinner. Finish the night in the hot tub.", id: P.living, alt: "Cozy living room with a wood fireplace and soft seating" },
  { when: "Day 2 and beyond", title: "Exploring the forest", text: "Walk the loops, find the creek, pack a lunch. Trail maps are on the kitchen wall.", id: P.mist, alt: "Misty forest of tall trees along a hiking trail" },
  { when: "Last day, by 11 am", title: "Departure", text: "Strip the beds, load the dishwasher, lock up. Take one last look at the trees.", id: P.canopy, alt: "Morning sunlight shining through a green forest canopy" },
];

const reviews = [
  { q: "The kids ran for the trails the minute we arrived. We did not see a screen for three days.", by: "Placeholder review, family of 5", s: 5 },
  { q: "Quiet, warm and clean. We lit the fire every night and slept like logs.", by: "Placeholder review, couple with a toddler", s: 5 },
  { q: "Hot tub under the trees was the highlight. Plenty of room for two families.", by: "Placeholder review, group of 7", s: 5 },
  { q: "Easy check-in, great kitchen, and the trail map on the wall was handy.", by: "Placeholder review, family of 4", s: 4 },
];

const faqs = [
  { q: "What are check-in and check-out times?", a: "Check-in is from 3 pm. Check-out is by 11 am. Keys are in a lockbox and the code arrives by email. Need an earlier arrival? Add it to your special requests." },
  { q: "Are pets and children welcome?", a: "Children are very welcome. The kids' room has bunk beds and a crib can be added on request. Up to two dogs are allowed. Keep them off the beds and clean up on the trails." },
  { q: "What is the cancellation policy?", a: "Cancel 14 or more days before arrival for a full refund. Between 14 and 7 days, you get 50% back. Within 7 days, the stay is not refundable." },
];

const gallery = [
  { id: P.cabin, alt: "Timber cabin exterior surrounded by evergreen forest", c: "col-span-6 row-span-2 md:col-span-4" },
  { id: P.trail, alt: "Narrow trail winding through a green forest", c: "col-span-3 md:col-span-2" },
  { id: P.stream, alt: "Clear stream running between mossy forest rocks", c: "col-span-3 md:col-span-2" },
  { id: P.rays, alt: "Sun rays falling through tall trees onto a forest path", c: "col-span-3" },
  { id: P.mist, alt: "Fog drifting between dark trees in the forest", c: "col-span-6 md:col-span-3" },
];

/* ---------- shared bits ---------- */
const glass = "bg-white/[0.06] border border-white/[0.16] backdrop-blur-md";
const btn = "inline-flex items-center justify-center gap-2 rounded-full border border-white bg-neutral-100 px-7 py-3 font-bold text-neutral-950 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={reduce ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.8 }}>
      {children}
    </motion.div>
  );
}

function Photo({ id, alt, w, className = "", eager = false }: { id: string; alt: string; w?: number; className?: string; eager?: boolean }) {
  const [bad, setBad] = useState(false);
  return (
    <figure className={`relative overflow-hidden bg-gradient-to-br from-neutral-700 to-neutral-900 ${className}`}>
      {bad ? (
        <figcaption className="absolute inset-0 grid place-items-center p-4 text-center text-sm text-neutral-500">{alt}</figcaption>
      ) : (
        <img src={img(id, w)} alt={alt} loading={eager ? "eager" : "lazy"} onError={() => setBad(true)} className="h-full w-full object-cover grayscale contrast-105" />
      )}
    </figure>
  );
}

function Head({ title, sub }: { title: string; sub?: string }) {
  return (
    <Reveal className="mb-10 max-w-xl md:mb-14">
      <h2 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">{title}</h2>
      {sub && <p className="mt-3 text-neutral-400">{sub}</p>}
    </Reveal>
  );
}

const Section = ({ id, children }: { id: string; children: ReactNode }) => (
  <section id={id} className="py-20 md:py-28">
    <div className="mx-auto w-[min(1120px,100%-40px)]">{children}</div>
  </section>
);

/* ---------- sections ---------- */
function Nav() {
  return (
    <header className="sticky top-3 z-50 mx-auto mt-3 w-[min(1120px,100%-24px)]">
      <div className={`${glass} flex h-16 items-center justify-between rounded-full bg-neutral-900/60 pl-6 pr-2.5`}>
        <a href="#top" className={`flex items-center gap-2.5 text-lg font-extrabold tracking-tight ${focus} rounded-md`}>
          <span aria-hidden className="grid h-[18px] w-[18px] grid-cols-2 gap-0.5 rounded-[5px] border-2 border-white p-px">
            <i className="rounded-[1px] bg-white" /><i /><i /><i className="rounded-[1px] bg-white" />
          </span>
          Bento House
        </a>
        <div className="flex items-center gap-6">
          <nav aria-label="Main" className="hidden gap-6 text-sm font-medium text-neutral-400 lg:flex">
            {[["House", "#house"], ["Your stay", "#stay"], ["Reviews", "#reviews"], ["FAQ", "#faq"], ["Trails", "#trails"]].map(([l, h]) => (
              <a key={h} href={h} className={`hover:text-white ${focus} rounded`}>{l}</a>
            ))}
          </nav>
          <a href="#book" className={`${btn} !px-5 !py-2.5 text-sm`}>Book now</a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" aria-label="Welcome" className="relative -mt-[88px] flex min-h-screen items-end overflow-hidden border-b border-white/[0.16]">
      <Photo id={P.cabin} w={2000} eager alt="Wooden cabin among tall trees in a forest" className="!absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/85" />
      <div className="relative mx-auto w-[min(1120px,100%-40px)] pb-10 md:pb-20">
        <div className={`${glass} max-w-3xl rounded-3xl bg-neutral-950/40 p-6 md:p-10`}>
          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tighter md:text-7xl">A forest cabin for the whole family.</h1>
          <p className="my-5 max-w-[46ch] text-xl text-neutral-300">Four bedrooms. A fireplace. A hot tub. Trails start at the back door.</p>
          <div className="flex flex-wrap gap-3">
            <a href="#book" className={btn}>Book now</a>
            <a href="#house" className={`${btn} !border-white/[0.16] !bg-white/10 !text-white backdrop-blur-md hover:!bg-white/20`}>See the house</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function House() {
  const card = `${glass} flex flex-col gap-2.5 rounded-3xl p-6`;
  const rows = (items: [string, string][]) => (
    <ul>{items.map(([a, b]) => (
      <li key={a} className="flex justify-between gap-3 border-t border-white/[0.16] py-3"><span>{a}</span><span className="text-neutral-400">{b}</span></li>
    ))}</ul>
  );
  return (
    <Section id="house">
      <Head title="The house" sub="Room for everyone. Quiet all around." />
      <div className="grid grid-cols-6 gap-3.5">
        <Reveal className="col-span-6 md:col-span-3"><article className={`${card} h-full`}>
          <h3 className="flex items-center gap-2 text-xl font-bold"><Users size={20} aria-hidden /> Sleeps</h3>
          <p className="text-5xl font-extrabold tracking-tighter text-neutral-100 md:text-6xl">8 guests</p>
          {rows([["Primary bedroom", "1 king"], ["Second bedroom", "1 queen"], ["Kids' room", "2 bunk beds"], ["Loft", "2 singles"]])}
        </article></Reveal>
        <Reveal className="col-span-6 md:col-span-3"><article className={`${card} h-full`}>
          <h3 className="flex items-center gap-2 text-xl font-bold"><Bed size={20} aria-hidden /> Amenities</h3>
          <p className="text-5xl font-extrabold tracking-tighter text-neutral-100 md:text-6xl">4 bedrooms</p>
          {rows([["Wood fireplace", "Living room"], ["Hot tub", "Back deck"], ["Full kitchen", "Dishwasher"], ["Wi-Fi, heating, parking", "Included"]])}
        </article></Reveal>
        {[
          { Icon: Flame, t: "Fireplace", d: "Logs are stocked. Settle in with a board game and a blanket." },
          { Icon: Bath, t: "Hot tub", d: "Under the trees, open year round. Kids and adults both welcome." },
          { Icon: Utensils, t: "Kitchen", d: "Cook together. The big table seats eight." },
        ].map(({ Icon, t, d }) => (
          <Reveal key={t} className="col-span-6 md:col-span-2"><article className={`${card} h-full`}>
            <h3 className="flex items-center gap-2 text-xl font-bold"><Icon size={20} aria-hidden /> {t}</h3><p className="text-neutral-400">{d}</p>
          </article></Reveal>
        ))}
        <Reveal className="col-span-6"><article className={card}>
          <h3 className="text-xl font-bold">Trails and things to do</h3>
          <div className="mt-2 grid gap-3.5 md:grid-cols-3">
            {[
              { Icon: Footprints, t: "Forest trails", d: "Easy loops of 1 to 5 km start at the cabin." },
              { Icon: TreePine, t: "Creek and picnic spot", d: "A 15 minute walk. Good for skipping stones." },
              { Icon: Moon, t: "Stargazing", d: "No streetlights. Clear nights show the whole sky." },
            ].map(({ Icon, t, d }) => (
              <div key={t} className="rounded-2xl border border-white/[0.16] bg-white/[0.03] p-4">
                <b className="mb-1 flex items-center gap-2"><Icon size={18} aria-hidden /> {t}</b><p className="text-[.95rem] text-neutral-400">{d}</p>
              </div>
            ))}
          </div>
        </article></Reveal>
      </div>
    </Section>
  );
}

function Timeline() {
  return (
    <Section id="stay">
      <Head title="Your stay, start to finish" sub="Four stages. No rush in any of them." />
      <ol className="relative grid gap-9 before:absolute before:inset-y-0 before:left-[21px] before:w-px before:bg-white/[0.16] md:before:left-1/2">
        {steps.map((s, i) => (
          <li key={s.title} className="grid grid-cols-[44px_1fr] gap-4 md:grid-cols-[1fr_44px_1fr] md:gap-9">
            <span aria-hidden className="relative z-10 col-start-1 row-start-1 grid h-11 w-11 place-items-center rounded-full border border-white bg-neutral-900 font-bold md:col-start-2">{i + 1}</span>
            <Reveal className={`col-start-2 row-start-1 md:col-start-1 ${i % 2 ? "md:col-start-3" : ""}`}>
              <div className={`${glass} overflow-hidden rounded-3xl`}>
                <Photo id={s.id} alt={s.alt} className="aspect-[16/10]" />
                <div className="p-5">
                  <p className="mb-1 text-sm font-semibold text-neutral-500">{s.when}</p>
                  <h3 className="text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 text-neutral-400">{s.text}</p>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function Gallery() {
  return (
    <Section id="photos">
      <Head title="Around the cabin" sub="Trees on every side." />
      <Reveal className="grid auto-rows-[130px] grid-cols-6 gap-3 md:auto-rows-[230px]">
        {gallery.map((g) => <Photo key={g.id + g.alt} id={g.id} alt={g.alt} w={1400} className={`rounded-3xl border border-white/[0.16] ${g.c}`} />)}
      </Reveal>
    </Section>
  );
}

function Reviews() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const go = (n: number) => setI((n + reviews.length) % reviews.length);
  useEffect(() => {
    if (paused || reduce) return;
    const t = setInterval(() => setI((x) => (x + 1) % reviews.length), 6500);
    return () => clearInterval(t);
  }, [paused, reduce]);
  const r = reviews[i];
  const round = `grid h-11 w-11 place-items-center rounded-full border border-white/[0.16] bg-white/10 ${focus}`;
  return (
    <Section id="reviews">
      <Head title="What guests say" />
      <Reveal>
        <div className={`${glass} rounded-3xl p-6 md:p-14`} role="region" aria-roledescription="carousel" aria-label="Guest reviews"
          onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
          <div className="min-h-[250px] md:min-h-[220px]" aria-live={paused ? "polite" : "off"}>
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${reviews.length}`}>
                <div className="mb-5 flex gap-1" role="img" aria-label={`${r.s} out of 5 stars`}>
                  {[0, 1, 2, 3, 4].map((n) => <Star key={n} size={20} aria-hidden className={n < r.s ? "fill-neutral-100 text-neutral-100" : "text-neutral-600"} />)}
                </div>
                <blockquote className="max-w-[30ch] text-2xl font-semibold leading-snug tracking-tight md:text-4xl">“{r.q}”</blockquote>
                <cite className="mt-5 block not-italic text-neutral-400">{r.by}</cite>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-2" role="group" aria-label="Choose review">
              {reviews.map((_, n) => (
                <button key={n} type="button" aria-label={`Show review ${n + 1}`} aria-current={n === i} onClick={() => go(n)}
                  className={`h-3 w-3 rounded-full border border-white ${n === i ? "bg-white" : ""} ${focus}`} />
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" aria-label="Previous review" className={round} onClick={() => go(i - 1)}><ArrowLeft size={18} /></button>
              <button type="button" aria-label="Next review" className={round} onClick={() => go(i + 1)}><ArrowRight size={18} /></button>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function Faq() {
  return (
    <Section id="faq">
      <Head title="Questions" />
      <Reveal className="max-w-3xl">
        <Accordion.Root type="single" collapsible className="grid gap-3">
          {faqs.map((f) => (
            <Accordion.Item key={f.q} value={f.q} className={`${glass} group overflow-hidden rounded-3xl`}>
              <Accordion.Header>
                <Accordion.Trigger className={`flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-lg font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white`}>
                  {f.q}
                  <span aria-hidden className="grid h-7 w-7 flex-none place-items-center rounded-full border border-white/[0.16]">
                    <Plus size={16} className="group-data-[state=open]:hidden" /><Minus size={16} className="hidden group-data-[state=open]:block" />
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="px-6 pb-5 text-neutral-400">{f.a}</Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </Reveal>
    </Section>
  );
}

function TrailMap() {
  const s = "fill-none stroke-neutral-200 stroke-[3]";
  const t = "fill-neutral-200 text-[26px] font-bold";
  return (
    <Section id="trails">
      <Head title="Trail map" sub="Hand-drawn, not to scale. A paper copy waits in the kitchen." />
      <Reveal>
        <div className={`${glass} rounded-3xl p-3 md:p-5`}>
          <svg viewBox="0 0 900 520" role="img" aria-labelledby="mt md" className="block h-auto w-full" strokeLinecap="round" strokeLinejoin="round" style={{ fontFamily: "Caveat, 'Comic Sans MS', cursive" }}>
            <title id="mt">Illustrated trail map</title>
            <desc id="md">A sketch with the cabin in the middle, a loop trail to the north, a creek and picnic spot to the east, a lookout hill to the west and a meadow to the south.</desc>
            <path className={`${s} opacity-30`} d="M40 60 Q220 30 420 52 T860 40 L866 480 Q640 505 430 480 T36 488 Z" />
            <path className={`${s} opacity-60`} d="M70 330 Q130 250 210 300 T330 250" />
            <path className={s} d="M600 70 Q640 150 600 210 T660 330 T620 470" />
            <path className={`${s} opacity-50`} d="M616 70 Q656 150 616 210 T676 330 T636 470" />
            {["M440 270 Q470 190 430 140 Q390 100 330 130 Q300 170 350 210 Q400 240 440 270", "M470 285 Q540 270 600 255", "M420 290 Q330 300 260 285", "M450 310 Q460 380 440 440"].map((d) => (
              <path key={d} d={d} className={`${s} stroke-neutral-400`} strokeDasharray="3 11" />
            ))}
            <g className={s}><path d="M410 255h60v45h-60zM402 257l38-32 38 32M455 300v-22h-14v22" /></g>
            <g className={s}><path d="M120 120l18-34 18 34zM140 160l16-30 16 30zM520 130l16-30 16 30zM530 420l18-34 18 34zM740 190l16-30 16 30zM760 400l18-34 18 34zM300 440l16-30 16 30zM690 90l16-30 16 30zM200 300l24-48 24 48" /><circle cx="660" cy="250" r="10" /></g>
            <text x="372" y="210" className={t}>Bento House</text>
            <text x="420" y="108" className={t}>Forest loop, 2 km</text>
            <text x="650" y="236" className={t}>Picnic spot</text>
            <text x="655" y="165" className={t}>Creek</text>
            <text x="150" y="238" className={t}>Lookout hill</text>
            <text x="470" y="492" className={t}>Meadow, stargazing</text>
            <text x="800" y="505" className="fill-neutral-400 text-xl">N ↑</text>
          </svg>
          <p className="px-3 pb-2 pt-3 text-sm text-neutral-400">Dotted lines are walking trails. The wavy line is the creek.</p>
        </div>
      </Reveal>
    </Section>
  );
}

function Booking() {
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const [f, setF] = useState({ ci: "", co: "", guests: 4, req: "" });
  const [msg, setMsg] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!f.ci || !f.co) return setMsg("Choose your check-in and check-out dates.");
    if (f.co <= f.ci) return setMsg("Check-out must be after check-in.");
    if (!(f.guests >= 1 && f.guests <= 8)) return setMsg("Guests must be between 1 and 8.");
    setMsg("Thanks. This is a demo form, so nothing was sent.");
  };
  const field = `w-full rounded-2xl border border-white/[0.16] bg-black/35 px-3.5 py-3 text-neutral-100 placeholder:text-neutral-600 [color-scheme:dark] ${focus}`;
  return (
    <Section id="book">
      <Reveal>
        <div className={`${glass} grid gap-8 rounded-3xl p-6 md:p-12 lg:grid-cols-[1fr_1.2fr]`}>
          <div>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Book your stay</h2>
            <p className="mt-3 max-w-[36ch] text-neutral-400">Pick your dates and tell us who is coming. We will confirm by email.</p>
          </div>
          <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-semibold">Check-in
              <input type="date" min={today} value={f.ci} onChange={(e) => setF({ ...f, ci: e.target.value })} className={`${field} font-normal`} required />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold">Check-out
              <input type="date" min={f.ci || today} value={f.co} onChange={(e) => setF({ ...f, co: e.target.value })} className={`${field} font-normal`} required />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold sm:col-span-2">Number of guests (max 8)
              <input type="number" min={1} max={8} value={f.guests} onChange={(e) => setF({ ...f, guests: Number(e.target.value) })} className={`${field} font-normal`} required />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold sm:col-span-2">Special requests
              <textarea rows={4} value={f.req} onChange={(e) => setF({ ...f, req: e.target.value })} placeholder="Early arrival, a crib, dietary needs…" className={`${field} font-normal`} />
            </label>
            <button type="submit" className={`${btn} sm:col-span-2`}>Book now</button>
            <p role="status" aria-live="polite" className="min-h-6 font-medium sm:col-span-2">{msg}</p>
          </form>
        </div>
      </Reveal>
    </Section>
  );
}

function Footer() {
  const link = `text-neutral-400 hover:text-white ${focus} rounded`;
  return (
    <footer className="border-t border-white/[0.16] bg-neutral-950/60 pb-8 pt-14 backdrop-blur-md">
      <div className="mx-auto w-[min(1120px,100%-40px)]">
        <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-4">
          <div><p className="text-lg font-extrabold">Bento House</p><p className="mt-3 max-w-[30ch] text-neutral-400">A forest cabin for families. Somewhere in the woods.</p></div>
          <div><h3 className="mb-3 font-bold">Contact</h3><ul className="grid gap-2"><li><a className={link} href="mailto:hello@bentohouse.example">hello@bentohouse.example</a></li><li><a className={link} href="tel:+15550100199">+1 (555) 010-0199</a></li></ul></div>
          <div><h3 className="mb-3 font-bold">Follow</h3><ul className="grid gap-2">{["Instagram", "Facebook", "Pinterest"].map((s) => <li key={s}><a className={link} href="#">{s}</a></li>)}</ul></div>
          <div><h3 className="mb-3 font-bold">House rules</h3><ul className="grid gap-2 text-neutral-400"><li>Quiet hours: 10 pm to 8 am</li><li>No smoking indoors</li><li>Fires only in the fireplace</li><li>Leave no trace on the trails</li></ul></div>
        </div>
        <p className="mt-10 border-t border-white/[0.16] pt-5 text-sm text-neutral-500">© 2026 Bento House. All rights reserved.</p>
      </div>
    </footer>
  );
}

/* ---------- page ---------- */
export default function BentoHouse() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-neutral-950 font-sans text-[17px] leading-relaxed text-neutral-200 antialiased" style={{ fontFamily: "Figtree, system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=Caveat:wght@500;700&display=swap');html{scroll-behavior:smooth;scroll-padding-top:84px}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}`}</style>
      {/* signature grid */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-0 opacity-45"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.16) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at 50% 30%,#000 30%,rgba(0,0,0,.45) 100%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 30%,#000 30%,rgba(0,0,0,.45) 100%)",
        }} />
      <a href="#main" className="absolute -top-16 left-3 z-[100] rounded-xl bg-white px-4 py-2 font-semibold text-black focus:top-3">Skip to content</a>
      <div className="relative z-10">
        <Nav />
        <main id="main">
          <Hero /><House /><Timeline /><Gallery /><Reviews /><Faq /><TrailMap /><Booking />
        </main>
        <Footer />
      </div>
    </div>
  );
}