import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Search, MapPin, Star, Heart, Sun, Moon, Menu, X, ChevronLeft, ChevronRight,
  Utensils, Camera, CheckCircle, Clock, Navigation, Upload, User, Phone,
  Home as HomeIcon, Compass, Map as MapIcon, PlusCircle, LayoutDashboard,
  SlidersHorizontal, TrendingUp, ShieldCheck, Leaf, Ship, Eye, ArrowRight,
  Trash2, Send, ImagePlus, Filter as FilterIcon
} from "lucide-react";

/* ============================================================================
   TASTE TRAIL KERALA
   A single-file React application. Sections:
   1. Style sheet (design tokens + custom classes, since only core Tailwind
      utilities are available and this palette needs precise brand colors)
   2. Dummy data (districts, dishes, 22 vendors, reviews)
   3. Small reusable pieces (Toasts, Stars, Skeletons, Badges)
   4. Page components (Landing, Explore, Map, VendorDetail, Register, Dashboard)
   5. Shell (Navbar, Footer, Floating action button) + root App component
   ============================================================================ */

/* ---------------------------------- 1. STYLES ---------------------------------- */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

  .ttk-root {
    --coconut-green: #2E7D32;
    --banana-green: #4CAF50;
    --kerala-gold: #D4A017;
    --coconut-white: #FFFDF5;
    --dark-brown: #5D4037;
    --ink: #26301f;
    --surface: #FFFDF5;
    --surface-alt: #F4EFDE;
    --card-bg: rgba(255,255,255,0.72);
    --card-border: rgba(93,64,55,0.10);
    --shadow-soft: 0 10px 30px rgba(46,125,50,0.10);
    font-family: 'Poppins', sans-serif;
    background: var(--surface);
    color: var(--ink);
    min-height: 100vh;
    transition: background .4s ease, color .4s ease;
  }
  .ttk-root.dark {
    --ink: #EDE7D9;
    --surface: #10190F;
    --surface-alt: #16221B;
    --card-bg: rgba(24,36,22,0.75);
    --card-border: rgba(212,160,23,0.16);
    --shadow-soft: 0 10px 30px rgba(0,0,0,0.35);
    --coconut-white: #10190F;
  }
  .ttk-root * { box-sizing: border-box; }
  .ttk-serif { font-family: 'Poppins', sans-serif; }

  .ttk-bg-pattern {
    background-image:
      radial-gradient(circle at 10% 10%, rgba(76,175,80,0.10) 0, transparent 40%),
      radial-gradient(circle at 90% 30%, rgba(212,160,23,0.10) 0, transparent 40%);
  }

  .ttk-leaf-divider { height: 26px; width: 100%; display:block; }

  .ttk-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 22px;
    box-shadow: var(--shadow-soft);
    backdrop-filter: blur(10px);
    transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s ease, border-color .35s ease;
  }
  .ttk-card:hover { transform: translateY(-6px); box-shadow: 0 18px 40px rgba(46,125,50,0.18); }

  .ttk-btn {
    font-family:'Poppins',sans-serif; font-weight:600; border-radius: 999px;
    padding: 12px 26px; border: none; cursor:pointer; transition: transform .25s ease, box-shadow .25s ease, background .25s ease;
    display:inline-flex; align-items:center; gap:8px; white-space:nowrap;
  }
  .ttk-btn:active { transform: scale(0.96); }
  .ttk-btn-primary { background: linear-gradient(135deg, var(--coconut-green), var(--banana-green)); color: #fff; box-shadow: 0 8px 20px rgba(46,125,50,0.35); }
  .ttk-btn-primary:hover { box-shadow: 0 12px 26px rgba(46,125,50,0.45); transform: translateY(-2px); }
  .ttk-btn-gold { background: linear-gradient(135deg, var(--kerala-gold), #f0c14b); color: #3a2a03; box-shadow: 0 8px 20px rgba(212,160,23,0.35);}
  .ttk-btn-gold:hover { transform: translateY(-2px); }
  .ttk-btn-outline { background: transparent; border: 1.5px solid var(--card-border); color: var(--ink); }
  .ttk-btn-outline:hover { border-color: var(--coconut-green); color: var(--coconut-green); }
  .ttk-btn-ghost { background: rgba(76,175,80,0.10); color: var(--coconut-green); }
  .ttk-root.dark .ttk-btn-ghost { color: var(--banana-green); background: rgba(76,175,80,0.16); }

  .ttk-input {
    font-family:'Poppins',sans-serif; border-radius: 16px; border: 1.5px solid var(--card-border);
    background: var(--card-bg); color: var(--ink); padding: 12px 16px; outline:none; width:100%;
    transition: border-color .2s ease, box-shadow .2s ease;
  }
  .ttk-input:focus { border-color: var(--banana-green); box-shadow: 0 0 0 4px rgba(76,175,80,0.15); }
  .ttk-input::placeholder { color: rgba(93,64,55,0.55); }
  .ttk-root.dark .ttk-input::placeholder { color: rgba(237,231,217,0.4); }

  .ttk-badge { border-radius: 999px; padding: 4px 12px; font-size: 12px; font-weight: 600; display:inline-flex; align-items:center; gap:5px; }
  .ttk-badge-open { background: rgba(76,175,80,0.16); color: var(--coconut-green); }
  .ttk-root.dark .ttk-badge-open { color: #7CD87F; }
  .ttk-badge-closed { background: rgba(93,64,55,0.14); color: var(--dark-brown); }
  .ttk-root.dark .ttk-badge-closed { color: #d3a9a0; }
  .ttk-badge-gold { background: rgba(212,160,23,0.16); color: var(--kerala-gold); }

  .ttk-navbar { backdrop-filter: blur(14px); background: var(--card-bg); border-bottom: 1px solid var(--card-border); }
  .ttk-navlink { font-weight: 500; font-size: 14.5px; padding: 8px 14px; border-radius: 999px; cursor:pointer; transition: all .2s ease; color: var(--ink); opacity: .75; }
  .ttk-navlink:hover { opacity: 1; background: rgba(76,175,80,0.10); }
  .ttk-navlink.active { opacity: 1; background: linear-gradient(135deg, var(--coconut-green), var(--banana-green)); color: #fff; }

  .ttk-hero {
    background:
      linear-gradient(160deg, rgba(46,125,50,0.94), rgba(93,64,55,0.90)),
      url('https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=1600&auto=format&fit=crop');
    background-size: cover; background-position: center;
    border-radius: 0 0 40px 40px;
    color: #FFFDF5;
    position: relative;
    overflow: hidden;
  }
  .ttk-hero svg.motif { position:absolute; opacity:.14; }

  @keyframes ttkFadeUp { from { opacity:0; transform: translateY(24px);} to { opacity:1; transform:none;} }
  .ttk-reveal { animation: ttkFadeUp .7s cubic-bezier(.2,.8,.2,1) both; }
  .ttk-reveal-init { opacity:0; }

  @keyframes ttkFloat { 0%,100%{ transform: translateY(0px) rotate(0deg);} 50%{ transform: translateY(-10px) rotate(3deg);} }
  .ttk-float { animation: ttkFloat 4.5s ease-in-out infinite; }
  .ttk-float-slow { animation: ttkFloat 6.5s ease-in-out infinite; }

  @keyframes ttkShimmer { 0%{ background-position: -400px 0;} 100%{ background-position: 400px 0;} }
  .ttk-skeleton { background: linear-gradient(90deg, rgba(93,64,55,0.08) 25%, rgba(93,64,55,0.16) 37%, rgba(93,64,55,0.08) 63%); background-size: 800px 100%; animation: ttkShimmer 1.6s linear infinite; border-radius: 16px; }

  @keyframes ttkPulseRing { 0%{ box-shadow: 0 0 0 0 rgba(212,160,23,0.55);} 100%{ box-shadow: 0 0 0 18px rgba(212,160,23,0);} }
  .ttk-pulse { animation: ttkPulseRing 2.2s ease-out infinite; }

  .ttk-scrollbar::-webkit-scrollbar { height: 8px; width: 8px; }
  .ttk-scrollbar::-webkit-scrollbar-thumb { background: rgba(76,175,80,0.4); border-radius: 10px; }

  .ttk-toast { border-radius: 16px; box-shadow: 0 12px 30px rgba(0,0,0,0.18); padding: 14px 18px; font-weight:500; font-size:14px; display:flex; align-items:center; gap:10px; min-width: 260px; animation: ttkFadeUp .35s ease both; }

  .ttk-map-canvas {
    background: linear-gradient(135deg, #d8ead9, #cfe7d3 40%, #e7dfc2);
    border-radius: 26px; position: relative; overflow: hidden;
  }
  .ttk-root.dark .ttk-map-canvas { background: linear-gradient(135deg, #16221B, #1c2b1e 40%, #24291a); }
  .ttk-map-pin { position:absolute; transform: translate(-50%,-100%); cursor:pointer; transition: transform .25s ease; }
  .ttk-map-pin:hover { transform: translate(-50%,-108%) scale(1.15); z-index: 5; }

  .ttk-star-input svg { cursor:pointer; transition: transform .15s ease; }
  .ttk-star-input svg:hover { transform: scale(1.2); }

  .ttk-progress-track { height: 8px; border-radius: 999px; background: rgba(93,64,55,0.12); overflow:hidden; }
  .ttk-progress-fill { height: 100%; border-radius: 999px; }

  hr.ttk-hr { border: none; border-top: 1px solid var(--card-border); }

  .ttk-tab { padding: 10px 4px; font-weight: 600; font-size: 14px; color: var(--ink); opacity:.55; cursor:pointer; border-bottom: 2.5px solid transparent; }
  .ttk-tab.active { opacity: 1; color: var(--coconut-green); border-color: var(--coconut-green); }
  .ttk-root.dark .ttk-tab.active { color: var(--banana-green); border-color: var(--banana-green); }

  @media (prefers-reduced-motion: reduce) {
    .ttk-float, .ttk-float-slow, .ttk-pulse, .ttk-skeleton, .ttk-reveal { animation: none !important; }
  }
`;

/* ---------------------------------- 2. DATA ---------------------------------- */
const DISTRICT_ORDER = [
  "Kasaragod", "Kannur", "Wayanad", "Kozhikode", "Malappuram", "Palakkad",
  "Thrissur", "Ernakulam", "Idukki", "Kottayam", "Alappuzha", "Pathanamthitta",
  "Kollam", "Thiruvananthapuram"
];

const FEATURED_DISHES = [
  { name: "Puttu & Kadala Curry", img: "1631292784640-2b24be784d5d", blurb: "Steamed rice cylinders, spiced black chickpeas." },
  { name: "Porotta & Beef Fry", img: "1631515243349-e0cb75fb8d3a", blurb: "Flaky layered bread with slow-roasted beef." },
  { name: "Pazhampori", img: "1631452180519-c014fe946bc7", blurb: "Ripe banana fritters, golden and crisp." },
  { name: "Kappa & Meen Curry", img: "1626132647523-66f30bf5a3f5", blurb: "Tapioca mash with a fiery fish curry." },
  { name: "Kozhikodan Halwa", img: "1601050690597-df0568f70950", blurb: "Chewy, glossy Calicut-style sweet halwa." },
  { name: "Appam & Stew", img: "1630910561339-4e22c7150093", blurb: "Lace-edged rice pancakes, coconut milk stew." },
];

const VENDOR_SEED = [
  { name: "Ammachi's Puttu Corner", district: "Thiruvananthapuram", cuisine: "Traditional Kerala", specialty: "Puttu & Kadala Curry", area: "Statue Junction" },
  { name: "Kadalorathu Thattukada", district: "Thiruvananthapuram", cuisine: "Seafood", specialty: "Kallummakaya Fry", area: "Shangumugham" },
  { name: "Kollam Boat Jetty Bites", district: "Kollam", cuisine: "Seafood", specialty: "Meen Pollichathu", area: "Boat Jetty" },
  { name: "Ashtamudi Snack Shack", district: "Kollam", cuisine: "Sweets & Snacks", specialty: "Pazhampori", area: "Ashtamudi Lakeside" },
  { name: "Kaviyoor Kappa Kada", district: "Pathanamthitta", cuisine: "Traditional Kerala", specialty: "Kappa & Meen Curry", area: "Kaviyoor Junction" },
  { name: "Punnamada Toddy Corner", district: "Alappuzha", cuisine: "Toddy Shop", specialty: "Duck Roast & Toddy", area: "Punnamada" },
  { name: "Alleppey Backwater Bites", district: "Alappuzha", cuisine: "Seafood", specialty: "Karimeen Fry", area: "Finishing Point" },
  { name: "Changanassery Chatti Pathiri", district: "Kottayam", cuisine: "Malabar", specialty: "Chatti Pathiri", area: "Changanassery" },
  { name: "Kumarakom Toddy Shop", district: "Kottayam", cuisine: "Toddy Shop", specialty: "Beef Ularthiyathu", area: "Kumarakom" },
  { name: "Munnar Misty Snacks", district: "Idukki", cuisine: "Sweets & Snacks", specialty: "Neyyappam", area: "Munnar Town" },
  { name: "Marine Drive Chaat & Chai", district: "Ernakulam", cuisine: "Street Grill", specialty: "Sulaimani Chai & Grill", area: "Marine Drive" },
  { name: "Fort Kochi Fish Fry", district: "Ernakulam", cuisine: "Seafood", specialty: "Kerala Prawn Roast", area: "Fort Kochi" },
  { name: "Thrissur Round Halwa Stall", district: "Thrissur", cuisine: "Sweets & Snacks", specialty: "Kozhikodan Halwa", area: "Round North" },
  { name: "Vadakkunnathan Vibes Kada", district: "Thrissur", cuisine: "Traditional Kerala", specialty: "Appam & Stew", area: "Vadakkunnathan Temple Rd" },
  { name: "Palakkad Junction Parotta House", district: "Palakkad", cuisine: "Malabar", specialty: "Porotta & Beef Fry", area: "Town Junction" },
  { name: "Malappuram Malabar Grill", district: "Malappuram", cuisine: "Malabar", specialty: "Malabar Parotta", area: "Kottakkal Road" },
  { name: "SM Street Halwa & Chips", district: "Kozhikode", cuisine: "Sweets & Snacks", specialty: "Kozhikodan Halwa", area: "SM Street" },
  { name: "Kozhikode Beach Thattukada", district: "Kozhikode", cuisine: "Street Grill", specialty: "Thattukada Chicken", area: "Beach Road" },
  { name: "Wayanad Bamboo Chicken Hut", district: "Wayanad", cuisine: "Traditional Kerala", specialty: "Bamboo Chicken", area: "Kalpetta" },
  { name: "Thalassery Biriyani Corner", district: "Kannur", cuisine: "Malabar", specialty: "Thalassery Biriyani", area: "Thalassery Town" },
  { name: "Bekal Fort Seafood Shack", district: "Kasaragod", cuisine: "Seafood", specialty: "Fish Molee", area: "Bekal" },
  { name: "Kannur Unniyappam Corner", district: "Kannur", cuisine: "Sweets & Snacks", specialty: "Unniyappam", area: "Payyambalam" },
];

const REVIEW_POOL = [
  "The flavours were spot on, exactly how my grandmother used to make it.",
  "Great value for the portion size, and the stall was spotless.",
  "Loved the spice level, would come back for the chutney alone.",
  "Service was quick even during the evening rush.",
  "A little oily for my taste but the freshness was undeniable.",
  "Hygiene score checks out, the vendor wears gloves while serving.",
  "Best roadside find on our Kerala trip so far.",
  "Portion could be bigger for the price, but taste makes up for it.",
];
const REVIEWER_NAMES = ["Anjali S.", "Rahul M.", "Divya K.", "Arjun P.", "Meera T.", "Sanjay V.", "Nithya R.", "Vishnu B."];

function seededImg(seed, w, h) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

function mapPosition(district, idx) {
  const i = DISTRICT_ORDER.indexOf(district);
  const top = 6 + (i / (DISTRICT_ORDER.length - 1)) * 86;
  const inlandDistricts = ["Wayanad", "Idukki", "Palakkad"];
  const baseLeft = inlandDistricts.includes(district) ? 62 : 38;
  const jitter = ((idx * 37) % 13) - 6;
  return { top: `${top}%`, left: `${Math.min(88, Math.max(12, baseLeft + jitter))}%` };
}

const VENDORS = VENDOR_SEED.map((v, i) => {
  const rating = (4.0 + ((i * 3) % 10) / 10).toFixed(1);
  const hygiene = 68 + ((i * 11) % 30);
  const openNow = i % 4 !== 0;
  const priceLow = 30 + (i % 5) * 10;
  const priceHigh = priceLow + 60 + (i % 4) * 20;
  const menu = [
    { item: v.specialty, price: priceLow + 20 },
    { item: "Sulaimani Chai", price: 15 },
    { item: "Banana Chips", price: 25 },
    { item: i % 2 === 0 ? "Nadan Chicken Curry" : "Fish Molee", price: priceHigh - 10 },
  ];
  const reviews = [0, 1].map((r) => ({
    id: `r-${i}-${r}`,
    name: REVIEWER_NAMES[(i + r * 3) % REVIEWER_NAMES.length],
    rating: 4 + ((i + r) % 2),
    hygiene: 3 + ((i + r * 2) % 3),
    comment: REVIEW_POOL[(i * 2 + r) % REVIEW_POOL.length],
    hasImage: (i + r) % 3 === 0,
  }));
  return {
    id: i + 1,
    ...v,
    rating: Number(rating),
    hygiene,
    openNow,
    priceRange: `₹${priceLow} - ₹${priceHigh}`,
    image: seededImg(v.name, 480, 340),
    gallery: [seededImg(v.name + "1", 480, 340), seededImg(v.name + "2", 480, 340), seededImg(v.name + "3", 480, 340)],
    menu,
    reviews,
    pos: mapPosition(v.district, i),
    phone: `+91 9${(400000000 + i * 137).toString().slice(0, 9)}`,
    owner: `${["Suresh", "Latha", "Rajesh", "Beena", "Mohan", "Anitha"][i % 6]} ${["Nair", "Menon", "Kumar", "Varma"][i % 4]}`,
  };
});

const CUISINES = [...new Set(VENDOR_SEED.map((v) => v.cuisine))];

/* ---------------------------------- 3. SMALL PIECES ---------------------------------- */
function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setShown(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, shown];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, shown] = useReveal();
  return (
    <div ref={ref} className={`${shown ? "ttk-reveal" : "ttk-reveal-init"} ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Stars({ value, size = 15, filledColor = "var(--kerala-gold)" }) {
  const full = Math.round(value);
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} fill={n <= full ? filledColor : "none"} color={n <= full ? filledColor : "rgba(93,64,55,0.35)"} />
      ))}
    </span>
  );
}

function StarInput({ value, onChange, label }) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, opacity: 0.8 }}>{label}</div>
      <div className="ttk-star-input" style={{ display: "flex", gap: 6 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} size={26} onClick={() => onChange(n)}
            fill={n <= value ? "var(--kerala-gold)" : "none"}
            color={n <= value ? "var(--kerala-gold)" : "rgba(93,64,55,0.4)"} />
        ))}
      </div>
    </div>
  );
}

function HygieneBar({ score }) {
  const color = score >= 85 ? "#2E7D32" : score >= 70 ? "#D4A017" : "#c0392b";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4, opacity: 0.75 }}>
        <span>Hygiene score</span><span style={{ fontWeight: 700, color }}>{score}/100</span>
      </div>
      <div className="ttk-progress-track"><div className="ttk-progress-fill" style={{ width: `${score}%`, background: color }} /></div>
    </div>
  );
}

function OpenBadge({ open }) {
  return open
    ? <span className="ttk-badge ttk-badge-open"><Clock size={12} /> Open now</span>
    : <span className="ttk-badge ttk-badge-closed"><Clock size={12} /> Closed</span>;
}

function SkeletonCard() {
  return (
    <div className="ttk-card" style={{ padding: 14 }}>
      <div className="ttk-skeleton" style={{ height: 150, marginBottom: 14 }} />
      <div className="ttk-skeleton" style={{ height: 16, width: "70%", marginBottom: 8 }} />
      <div className="ttk-skeleton" style={{ height: 12, width: "45%", marginBottom: 14 }} />
      <div className="ttk-skeleton" style={{ height: 34, width: "100%" }} />
    </div>
  );
}

function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div className="ttk-float-slow" style={{ display: "inline-flex", padding: 22, borderRadius: "50%", background: "rgba(76,175,80,0.12)", marginBottom: 18 }}>
        {icon}
      </div>
      <h3 className="ttk-serif" style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>{title}</h3>
      <p style={{ opacity: 0.65, maxWidth: 380, margin: "0 auto 18px", fontSize: 14.5 }}>{subtitle}</p>
      {action}
    </div>
  );
}

function Toasts({ toasts, remove }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 200, display: "flex", flexDirection: "column", gap: 10 }}>
      {toasts.map((t) => (
        <div key={t.id} className="ttk-toast" style={{ background: "var(--card-bg)", color: "var(--ink)", border: "1px solid var(--card-border)" }}>
          <CheckCircle size={18} color="var(--coconut-green)" />
          <span style={{ flex: 1 }}>{t.message}</span>
          <X size={15} style={{ cursor: "pointer", opacity: 0.5 }} onClick={() => remove(t.id)} />
        </div>
      ))}
    </div>
  );
}

/* Small Kerala motif: stylized boat + leaves, used sparingly */
function KeralaMotif({ style }) {
  return (
    <svg className="motif" width="220" height="140" viewBox="0 0 220 140" fill="none" style={style}>
      <path d="M10 110 Q110 140 210 110 L195 118 Q110 130 25 118 Z" fill="#FFFDF5" />
      <path d="M30 108 C30 60 60 30 60 30 C60 30 65 70 55 108 Z" fill="#FFFDF5" opacity="0.7" />
      <path d="M120 108 C120 50 150 20 150 20 C150 20 158 65 145 108 Z" fill="#FFFDF5" opacity="0.7" />
      <path d="M75 108 C75 75 95 55 95 55 C95 55 100 80 92 108 Z" fill="#FFFDF5" opacity="0.5" />
    </svg>
  );
}

function LeafDivider() {
  return (
    <svg className="ttk-leaf-divider" viewBox="0 0 400 26" preserveAspectRatio="none">
      <path d="M0 13 Q20 0 40 13 T80 13 T120 13 T160 13 T200 13 T240 13 T280 13 T320 13 T360 13 T400 13" stroke="var(--banana-green)" strokeWidth="2" fill="none" opacity="0.5" />
    </svg>
  );
}

/* ---------------------------------- 4. PAGES ---------------------------------- */

function VendorCard({ v, onOpen, favorites, toggleFav }) {
  const fav = favorites.has(v.id);
  return (
    <div className="ttk-card" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "relative", height: 160 }}>
        <img src={v.image} alt={v.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
        <button onClick={() => toggleFav(v.id)} aria-label="Save to favorites"
          style={{ position: "absolute", top: 10, right: 10, background: "rgba(255,255,255,0.85)", border: "none", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Heart size={17} fill={fav ? "#c0392b" : "none"} color={fav ? "#c0392b" : "#5D4037"} />
        </button>
        <div style={{ position: "absolute", bottom: 10, left: 10 }}><OpenBadge open={v.openNow} /></div>
      </div>
      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 6 }}>
          <h3 className="ttk-serif" style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.25 }}>{v.name}</h3>
          <span className="ttk-badge ttk-badge-gold" style={{ flexShrink: 0 }}><Star size={11} fill="var(--kerala-gold)" /> {v.rating}</span>
        </div>
        <div style={{ fontSize: 12.5, opacity: 0.7, display: "flex", alignItems: "center", gap: 5 }}>
          <MapPin size={12} /> {v.area}, {v.district}
        </div>
        <div style={{ fontSize: 12.5, opacity: 0.85, fontWeight: 500 }}>{v.cuisine} · {v.specialty}</div>
        <HygieneBar score={v.hygiene} />
        <button className="ttk-btn ttk-btn-primary" style={{ marginTop: 6, justifyContent: "center", padding: "10px 16px", fontSize: 13.5 }} onClick={() => onOpen(v.id)}>
          View details <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

function LandingPage({ go, search, setSearch, favorites, toggleFav }) {
  const stats = [
    { label: "Vendors listed", value: VENDORS.length + "+", icon: <Utensils size={20} /> },
    { label: "Verified reviews", value: "4,80+", icon: <Star size={20} /> },
    { label: "Districts covered", value: "14", icon: <MapPin size={20} /> },
  ];
  return (
    <div>
      <section className="ttk-hero" style={{ padding: "90px 24px 120px" }}>
        <KeralaMotif style={{ top: 20, right: 20 }} />
        <KeralaMotif style={{ bottom: -20, left: -30, transform: "scaleX(-1)" }} />
        <div style={{ maxWidth: 780, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <Reveal>
            <span className="ttk-badge" style={{ background: "rgba(212,160,23,0.25)", color: "#FFF3D6", marginBottom: 18 }}>
              <Leaf size={13} /> Kerala's street food, mapped &amp; verified
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="ttk-serif" style={{ fontSize: "clamp(32px, 6vw, 54px)", fontWeight: 800, lineHeight: 1.12, margin: "14px 0" }}>
              Taste every trail Kerala's streets have to offer
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p style={{ fontSize: 16.5, opacity: 0.9, maxWidth: 560, margin: "0 auto 30px" }}>
              Discover hygiene-rated thattukadas, toddy shops and sweet stalls from Kasaragod to Thiruvananthapuram, and support the vendors keeping local flavour alive.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div style={{ display: "flex", gap: 10, maxWidth: 560, margin: "0 auto 18px", background: "rgba(255,253,245,0.95)", padding: 8, borderRadius: 999, boxShadow: "0 12px 30px rgba(0,0,0,0.2)" }}>
              <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, padding: "0 10px" }}>
                <Search size={18} color="#5D4037" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search dish, district or vendor…"
                  style={{ border: "none", outline: "none", width: "100%", background: "transparent", fontFamily: "Poppins", color: "#26301f", fontSize: 14.5 }} />
              </div>
              <button className="ttk-btn ttk-btn-primary" onClick={() => go("explore")}>Search</button>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <button className="ttk-btn ttk-btn-gold ttk-pulse" onClick={() => go("map")}>
              <Compass size={17} /> Explore food near you
            </button>
          </Reveal>
        </div>
      </section>

      <section style={{ maxWidth: 1180, margin: "-64px auto 0", padding: "0 24px", position: "relative", zIndex: 2 }}>
        <div className="ttk-card" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around", padding: "26px 20px", gap: 16 }}>
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 100}>
              <div style={{ textAlign: "center", minWidth: 140 }}>
                <div style={{ display: "inline-flex", padding: 10, borderRadius: 14, background: "rgba(76,175,80,0.14)", color: "var(--coconut-green)", marginBottom: 8 }}>{s.icon}</div>
                <div className="ttk-serif" style={{ fontSize: 26, fontWeight: 800 }}>{s.value}</div>
                <div style={{ fontSize: 13, opacity: 0.65 }}>{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1180, margin: "70px auto 0", padding: "0 24px" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 22 }}>
            <div>
              <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: 1, color: "var(--kerala-gold)", textTransform: "uppercase" }}>Featured on the trail</span>
              <h2 className="ttk-serif" style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>Dishes everyone's chasing</h2>
            </div>
          </div>
        </Reveal>
        <div className="ttk-scrollbar" style={{ display: "flex", gap: 18, overflowX: "auto", paddingBottom: 14 }}>
          {FEATURED_DISHES.map((d, i) => (
            <Reveal key={d.name} delay={i * 70} className="" >
              <div className="ttk-card" style={{ minWidth: 230, overflow: "hidden", flexShrink: 0 }}>
                <img src={`https://images.unsplash.com/photo-${d.img}?q=80&w=500&auto=format&fit=crop`} alt={d.name}
                  style={{ width: "100%", height: 140, objectFit: "cover" }} loading="lazy"
                  onError={(e) => { e.currentTarget.src = seededImg(d.name, 500, 340); }} />
                <div style={{ padding: 14 }}>
                  <h4 className="ttk-serif" style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{d.name}</h4>
                  <p style={{ fontSize: 12.5, opacity: 0.65 }}>{d.blurb}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1180, margin: "70px auto 90px", padding: "0 24px" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
            <div>
              <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: 1, color: "var(--coconut-green)", textTransform: "uppercase" }}>Nearby &amp; trending</span>
              <h2 className="ttk-serif" style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>Top-rated stalls this week</h2>
            </div>
            <button className="ttk-btn ttk-btn-outline" onClick={() => go("explore")}>View all vendors <ArrowRight size={15} /></button>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
          {[...VENDORS].sort((a, b) => b.rating - a.rating).slice(0, 6).map((v, i) => (
            <Reveal key={v.id} delay={i * 60}><VendorCard v={v} onOpen={(id) => go("vendor", id)} favorites={favorites} toggleFav={toggleFav} /></Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

function FiltersBar({ filters, setFilters, resultCount }) {
  const set = (k, val) => setFilters((f) => ({ ...f, [k]: val }));
  return (
    <div className="ttk-card" style={{ padding: 18, marginBottom: 22, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: 13.5, color: "var(--coconut-green)" }}>
        <SlidersHorizontal size={16} /> Filters
      </div>
      <select className="ttk-input" style={{ width: "auto" }} value={filters.district} onChange={(e) => set("district", e.target.value)}>
        <option value="">All districts</option>
        {DISTRICT_ORDER.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>
      <select className="ttk-input" style={{ width: "auto" }} value={filters.cuisine} onChange={(e) => set("cuisine", e.target.value)}>
        <option value="">All cuisines</option>
        {CUISINES.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <select className="ttk-input" style={{ width: "auto" }} value={filters.rating} onChange={(e) => set("rating", e.target.value)}>
        <option value="0">Any rating</option>
        <option value="4">4★ &amp; up</option>
        <option value="4.5">4.5★ &amp; up</option>
      </select>
      <select className="ttk-input" style={{ width: "auto" }} value={filters.hygiene} onChange={(e) => set("hygiene", e.target.value)}>
        <option value="0">Any hygiene score</option>
        <option value="70">70+ hygiene</option>
        <option value="85">85+ hygiene</option>
      </select>
      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, cursor: "pointer" }}>
        <input type="checkbox" checked={filters.openNow} onChange={(e) => set("openNow", e.target.checked)} /> Open now
      </label>
      <span style={{ marginLeft: "auto", fontSize: 13, opacity: 0.6 }}>{resultCount} vendors found</span>
    </div>
  );
}

function ExplorePage({ go, favorites, toggleFav, search, setSearch }) {
  const [filters, setFilters] = useState({ district: "", cuisine: "", rating: "0", hygiene: "0", openNow: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, [filters, search]);

  const results = useMemo(() => {
    return VENDORS.filter((v) => {
      if (filters.district && v.district !== filters.district) return false;
      if (filters.cuisine && v.cuisine !== filters.cuisine) return false;
      if (v.rating < Number(filters.rating)) return false;
      if (v.hygiene < Number(filters.hygiene)) return false;
      if (filters.openNow && !v.openNow) return false;
      if (search) {
        const q = search.toLowerCase();
        const hay = `${v.name} ${v.district} ${v.cuisine} ${v.specialty} ${v.area}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [filters, search]);

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "40px 24px 90px" }}>
      <Reveal>
        <h1 className="ttk-serif" style={{ fontSize: 30, fontWeight: 800, marginBottom: 6 }}>Explore vendors</h1>
        <p style={{ opacity: 0.65, marginBottom: 22, fontSize: 14.5 }}>Every stall here has a hygiene score, so you can trust the trail.</p>
      </Reveal>
      <div className="ttk-input" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, maxWidth: 460 }}>
        <Search size={16} style={{ opacity: 0.5, flexShrink: 0 }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by district, cuisine or dish…"
          style={{ border: "none", outline: "none", background: "transparent", width: "100%", fontFamily: "Poppins", color: "var(--ink)", fontSize: 14 }} />
      </div>
      <FiltersBar filters={filters} setFilters={setFilters} resultCount={results.length} />
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : results.length === 0 ? (
        <EmptyState icon={<Utensils size={30} color="var(--coconut-green)" />} title="No vendors match yet"
          subtitle="Try clearing a filter or searching a different district, cuisine or dish."
          action={<button className="ttk-btn ttk-btn-outline" onClick={() => setFilters({ district: "", cuisine: "", rating: "0", hygiene: "0", openNow: false })}>Clear filters</button>} />
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
          {results.map((v, i) => (
            <Reveal key={v.id} delay={(i % 6) * 50}><VendorCard v={v} onOpen={(id) => go("vendor", id)} favorites={favorites} toggleFav={toggleFav} /></Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

function MapPage({ go }) {
  const [active, setActive] = useState(null);
  const activeVendor = VENDORS.find((v) => v.id === active);
  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "40px 24px 90px" }}>
      <Reveal>
        <h1 className="ttk-serif" style={{ fontSize: 30, fontWeight: 800, marginBottom: 6 }}>Vendor map</h1>
        <p style={{ opacity: 0.65, marginBottom: 22, fontSize: 14.5 }}>Pins are placed by district, roughly north (Kasaragod) to south (Thiruvananthapuram). Tap a pin for details.</p>
      </Reveal>
      <div className="ttk-map-canvas" style={{ height: 560, position: "relative" }}>
        <div style={{ position: "absolute", top: 14, left: 14, background: "var(--card-bg)", padding: "8px 12px", borderRadius: 12, fontSize: 12, display: "flex", alignItems: "center", gap: 6, border: "1px solid var(--card-border)" }}>
          <MapIcon size={14} /> Google Maps (placeholder key: <code>YOUR_GOOGLE_MAPS_API_KEY</code>)
        </div>
        {VENDORS.map((v) => (
          <div key={v.id} className="ttk-map-pin" style={{ top: v.pos.top, left: v.pos.left }} onClick={() => setActive(v.id)}>
            <MapPin size={active === v.id ? 34 : 26} color={active === v.id ? "#c0392b" : "#2E7D32"} fill={active === v.id ? "#c0392b" : "#4CAF50"} />
          </div>
        ))}
      </div>
      {activeVendor && (
        <Reveal>
          <div className="ttk-card" style={{ marginTop: 20, padding: 18, display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            <img src={activeVendor.image} alt={activeVendor.name} style={{ width: 96, height: 96, borderRadius: 16, objectFit: "cover" }} />
            <div style={{ flex: 1, minWidth: 180 }}>
              <h3 className="ttk-serif" style={{ fontSize: 17, fontWeight: 700 }}>{activeVendor.name}</h3>
              <div style={{ fontSize: 13, opacity: 0.65, display: "flex", alignItems: "center", gap: 5, margin: "4px 0" }}><MapPin size={12} /> {activeVendor.area}, {activeVendor.district}</div>
              <Stars value={activeVendor.rating} />
            </div>
            <button className="ttk-btn ttk-btn-primary" onClick={() => go("vendor", activeVendor.id)}>View details <ArrowRight size={15} /></button>
          </div>
        </Reveal>
      )}
    </div>
  );
}

function VendorDetailPage({ vendorId, go, favorites, toggleFav, addReview, addRecentlyViewed, notify }) {
  const vendor = VENDORS.find((v) => v.id === vendorId) || VENDORS[0];
  const [tab, setTab] = useState("menu");
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [rating, setRating] = useState(0);
  const [hygieneRating, setHygieneRating] = useState(0);
  const [foodQuality, setFoodQuality] = useState(0);
  const [comment, setComment] = useState("");
  const [imgAttached, setImgAttached] = useState(false);
  const [extraReviews, setExtraReviews] = useState([]);

  useEffect(() => { addRecentlyViewed(vendor.id); }, [vendor.id]);

  const allReviews = [...extraReviews, ...vendor.reviews];
  const fav = favorites.has(vendor.id);

  const submitReview = (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) { notify("Please add a star rating and a comment."); return; }
    const r = { id: `local-${Date.now()}`, name: "You", rating, hygiene: hygieneRating || rating, comment, hasImage: imgAttached };
    setExtraReviews((prev) => [r, ...prev]);
    addReview(vendor, r);
    setRating(0); setHygieneRating(0); setFoodQuality(0); setComment(""); setImgAttached(false);
    notify("Review submitted, thank you!");
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px 90px" }}>
      <button className="ttk-navlink" style={{ marginBottom: 16, display: "inline-flex", alignItems: "center", gap: 6 }} onClick={() => go("explore")}>
        <ChevronLeft size={15} /> Back to explore
      </button>

      <Reveal>
        <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", height: 320 }}>
          <img src={vendor.gallery[galleryIdx]} alt={vendor.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <button onClick={() => setGalleryIdx((i) => (i - 1 + vendor.gallery.length) % vendor.gallery.length)}
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.85)", border: "none", borderRadius: "50%", width: 36, height: 36 }}><ChevronLeft size={18} /></button>
          <button onClick={() => setGalleryIdx((i) => (i + 1) % vendor.gallery.length)}
            style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.85)", border: "none", borderRadius: "50%", width: 36, height: 36 }}><ChevronRight size={18} /></button>
          <div style={{ position: "absolute", bottom: 14, left: 14, display: "flex", gap: 8 }}>
            <OpenBadge open={vendor.openNow} />
            <span className="ttk-badge ttk-badge-gold"><ShieldCheck size={12} /> Hygiene certified</span>
          </div>
          <button onClick={() => toggleFav(vendor.id)} style={{ position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: 40, height: 40, cursor: "pointer" }}>
            <Heart size={19} fill={fav ? "#c0392b" : "none"} color={fav ? "#c0392b" : "#5D4037"} />
          </button>
        </div>
      </Reveal>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 16, marginTop: 22 }}>
        <div>
          <h1 className="ttk-serif" style={{ fontSize: 28, fontWeight: 800 }}>{vendor.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
            <Stars value={vendor.rating} /> <span style={{ fontWeight: 700 }}>{vendor.rating}</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span style={{ fontSize: 13.5, opacity: 0.7, display: "flex", alignItems: "center", gap: 4 }}><MapPin size={13} /> {vendor.area}, {vendor.district}</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 14, fontWeight: 500, color: "var(--coconut-green)" }}>{vendor.cuisine} · {vendor.priceRange}</div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "start" }}>
          <a className="ttk-btn ttk-btn-outline" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(vendor.name + " " + vendor.district + " Kerala")}`} target="_blank" rel="noreferrer">
            <Navigation size={15} /> Directions
          </a>
          <button className="ttk-btn ttk-btn-primary" onClick={() => toggleFav(vendor.id)}>
            <Heart size={15} fill={fav ? "#fff" : "none"} /> {fav ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <HygieneBar score={vendor.hygiene} />
      </div>

      <div style={{ display: "flex", gap: 22, marginTop: 28, borderBottom: "1px solid var(--card-border)" }}>
        {["menu", "reviews", "certificate"].map((t) => (
          <div key={t} className={`ttk-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)} style={{ textTransform: "capitalize" }}>{t}</div>
        ))}
      </div>

      {tab === "menu" && (
        <div className="ttk-card" style={{ padding: 20, marginTop: 20 }}>
          {vendor.menu.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: i < vendor.menu.length - 1 ? "1px dashed var(--card-border)" : "none" }}>
              <span style={{ fontWeight: 500 }}>{m.item}</span>
              <span style={{ fontWeight: 700, color: "var(--kerala-gold)" }}>₹{m.price}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "certificate" && (
        <div className="ttk-card" style={{ padding: 24, marginTop: 20, textAlign: "center" }}>
          <ShieldCheck size={40} color="var(--coconut-green)" style={{ marginBottom: 10 }} />
          <h4 className="ttk-serif" style={{ fontWeight: 700, marginBottom: 6 }}>Hygiene certificate on file</h4>
          <p style={{ fontSize: 13.5, opacity: 0.65, maxWidth: 380, margin: "0 auto" }}>
            {vendor.owner} submitted a municipal hygiene certificate during registration. Score last updated this season: <strong>{vendor.hygiene}/100</strong>.
          </p>
        </div>
      )}

      {tab === "reviews" && (
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          <form onSubmit={submitReview} className="ttk-card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            <h4 className="ttk-serif" style={{ fontWeight: 700 }}>Leave a review</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 26 }}>
              <StarInput value={rating} onChange={setRating} label="Overall rating" />
              <StarInput value={hygieneRating} onChange={setHygieneRating} label="Hygiene rating" />
              <StarInput value={foodQuality} onChange={setFoodQuality} label="Food quality" />
            </div>
            <textarea className="ttk-input" rows={3} placeholder="Tell other food-trailers what stood out…" value={comment} onChange={(e) => setComment(e.target.value)} />
            <button type="button" onClick={() => setImgAttached((s) => !s)} className="ttk-btn ttk-btn-ghost" style={{ alignSelf: "flex-start" }}>
              <ImagePlus size={15} /> {imgAttached ? "Photo attached ✓" : "Attach a food photo"}
            </button>
            <button type="submit" className="ttk-btn ttk-btn-primary" style={{ alignSelf: "flex-start" }}><Send size={15} /> Submit review</button>
          </form>

          {allReviews.map((r) => (
            <div key={r.id} className="ttk-card" style={{ padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</span>
                <Stars value={r.rating} size={13} />
              </div>
              <p style={{ fontSize: 13.5, opacity: 0.75, marginBottom: r.hasImage ? 10 : 0 }}>{r.comment}</p>
              {r.hasImage && <div className="ttk-skeleton" style={{ height: 100, width: 140 }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RegisterPage({ notify }) {
  const [form, setForm] = useState({ stall: "", owner: "", phone: "", district: "", address: "", cuisine: "", menuFile: null, hygieneFile: null });
  const [submitted, setSubmitted] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.stall || !form.owner || !form.phone || !form.district) { notify("Please fill in the required fields."); return; }
    setSubmitted(true);
    notify(`${form.stall} registered — our team will verify within 3 days.`);
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "70px 24px" }}>
        <EmptyState icon={<CheckCircle size={32} color="var(--coconut-green)" />} title="Registration received"
          subtitle={`Thanks ${form.owner || "there"}! We'll verify ${form.stall}'s hygiene certificate and publish the stall on the trail within 3 working days.`}
          action={<button className="ttk-btn ttk-btn-primary" onClick={() => { setSubmitted(false); setForm({ stall: "", owner: "", phone: "", district: "", address: "", cuisine: "", menuFile: null, hygieneFile: null }); }}>Register another stall</button>} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 24px 90px" }}>
      <Reveal>
        <h1 className="ttk-serif" style={{ fontSize: 30, fontWeight: 800, marginBottom: 6 }}>Register your stall</h1>
        <p style={{ opacity: 0.65, marginBottom: 26, fontSize: 14.5 }}>Join the trail, reach more customers and showcase your hygiene score.</p>
      </Reveal>
      <form onSubmit={submit} className="ttk-card" style={{ padding: 26, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <Field label="Stall name *"><input className="ttk-input" value={form.stall} onChange={(e) => set("stall", e.target.value)} placeholder="e.g. Ammachi's Puttu Corner" /></Field>
          <Field label="Owner name *"><input className="ttk-input" value={form.owner} onChange={(e) => set("owner", e.target.value)} placeholder="Full name" /></Field>
          <Field label="Phone number *"><input className="ttk-input" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 9XXXXXXXXX" /></Field>
          <Field label="District *">
            <select className="ttk-input" value={form.district} onChange={(e) => set("district", e.target.value)}>
              <option value="">Select district</option>
              {DISTRICT_ORDER.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Address"><input className="ttk-input" value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Street, landmark" /></Field>
        <Field label="Cuisine">
          <select className="ttk-input" value={form.cuisine} onChange={(e) => set("cuisine", e.target.value)}>
            <option value="">Select cuisine</option>
            {CUISINES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <UploadField label="Menu upload" file={form.menuFile} onChange={(f) => set("menuFile", f)} />
          <UploadField label="Hygiene certificate upload" file={form.hygieneFile} onChange={(f) => set("hygieneFile", f)} />
        </div>
        <button type="submit" className="ttk-btn ttk-btn-primary" style={{ justifyContent: "center", marginTop: 6 }}>Submit registration</button>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "block", fontSize: 13, fontWeight: 600, opacity: 0.8 }}>
      <span style={{ display: "block", marginBottom: 6 }}>{label}</span>
      {children}
    </label>
  );
}

function UploadField({ label, file, onChange }) {
  const inputRef = useRef(null);
  return (
    <label style={{ display: "block", fontSize: 13, fontWeight: 600, opacity: 0.8 }}>
      <span style={{ display: "block", marginBottom: 6 }}>{label}</span>
      <div className="ttk-input" style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => inputRef.current?.click()}>
        <Upload size={15} />
        <span style={{ fontWeight: 400, fontSize: 13, opacity: 0.75 }}>{file ? file.name : "Choose file…"}</span>
      </div>
      <input ref={inputRef} type="file" style={{ display: "none" }} onChange={(e) => onChange(e.target.files?.[0] || null)} />
    </label>
  );
}

function DashboardPage({ go, favorites, recentlyViewed, myReviews, toggleFav }) {
  const savedVendors = VENDORS.filter((v) => favorites.has(v.id));
  const recentVendors = recentlyViewed.map((id) => VENDORS.find((v) => v.id === id)).filter(Boolean).slice(0, 6);
  const recommended = [...VENDORS].filter((v) => !favorites.has(v.id)).sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "40px 24px 90px" }}>
      <Reveal>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div style={{ background: "rgba(76,175,80,0.14)", borderRadius: "50%", padding: 10 }}><User size={20} color="var(--coconut-green)" /></div>
          <h1 className="ttk-serif" style={{ fontSize: 28, fontWeight: 800 }}>Your dashboard</h1>
        </div>
        <p style={{ opacity: 0.65, marginBottom: 30, fontSize: 14.5 }}>Saved stalls, your review history and picks worth trying next.</p>
      </Reveal>

      <Section title="Saved vendors" icon={<Heart size={16} />}>
        {savedVendors.length === 0
          ? <EmptyState icon={<Heart size={26} color="var(--coconut-green)" />} title="Nothing saved yet" subtitle="Tap the heart on any vendor card to save it here for later." action={<button className="ttk-btn ttk-btn-outline" onClick={() => go("explore")}>Browse vendors</button>} />
          : <CardGrid vendors={savedVendors} go={go} favorites={favorites} toggleFav={toggleFav} />}
      </Section>

      <Section title="Review history" icon={<Star size={16} />}>
        {myReviews.length === 0
          ? <EmptyState icon={<Star size={26} color="var(--kerala-gold)" />} title="No reviews yet" subtitle="Reviews you leave on vendor pages will show up here." />
          : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {myReviews.map((r) => (
                <div key={r.review.id} className="ttk-card" style={{ padding: 16, display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{r.vendor.name}</div>
                    <div style={{ fontSize: 13, opacity: 0.65 }}>{r.review.comment}</div>
                  </div>
                  <Stars value={r.review.rating} />
                </div>
              ))}
            </div>
          )}
      </Section>

      <Section title="Recently viewed" icon={<Eye size={16} />}>
        {recentVendors.length === 0
          ? <EmptyState icon={<Eye size={26} color="var(--coconut-green)" />} title="Nothing viewed yet" subtitle="Vendors you open will be tracked here for quick access." />
          : <CardGrid vendors={recentVendors} go={go} favorites={favorites} toggleFav={toggleFav} />}
      </Section>

      <Section title="Recommended nearby" icon={<TrendingUp size={16} />}>
        <CardGrid vendors={recommended} go={go} favorites={favorites} toggleFav={toggleFav} />
      </Section>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <Reveal className="" delay={0}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, color: "var(--coconut-green)" }}>
          {icon}<h2 className="ttk-serif" style={{ fontSize: 18, fontWeight: 700, color: "var(--ink)" }}>{title}</h2>
        </div>
        {children}
      </div>
    </Reveal>
  );
}

function CardGrid({ vendors, go, favorites, toggleFav }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18 }}>
      {vendors.map((v) => <VendorCard key={v.id} v={v} onOpen={(id) => go("vendor", id)} favorites={favorites} toggleFav={toggleFav} />)}
    </div>
  );
}

/* ---------------------------------- 5. SHELL ---------------------------------- */
const NAV_ITEMS = [
  { key: "landing", label: "Home", icon: HomeIcon },
  { key: "explore", label: "Explore", icon: Compass },
  { key: "map", label: "Map", icon: MapIcon },
  { key: "register", label: "Register stall", icon: PlusCircle },
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
];

function Navbar({ page, go, dark, setDark }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ttk-navbar" style={{ position: "sticky", top: 0, zIndex: 100, padding: "12px 24px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => go("landing")}>
          <div className="ttk-float-slow" style={{ background: "linear-gradient(135deg, var(--coconut-green), var(--banana-green))", borderRadius: 12, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Leaf size={19} color="#fff" />
          </div>
          <span className="ttk-serif" style={{ fontWeight: 800, fontSize: 17 }}>Taste Trail <span style={{ color: "var(--kerala-gold)" }}>Kerala</span></span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="ttk-desktop-nav">
          {NAV_ITEMS.map((item) => (
            <div key={item.key} className={`ttk-navlink ${page === item.key ? "active" : ""}`} style={{ display: "none" }} data-nav onClick={() => go(item.key)}>
              {item.label}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setDark((d) => !d)} aria-label="Toggle dark mode"
            style={{ background: "rgba(76,175,80,0.12)", border: "none", borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            {dark ? <Sun size={17} color="var(--kerala-gold)" /> : <Moon size={17} color="var(--coconut-green)" />}
          </button>
          <button className="ttk-btn ttk-btn-primary" style={{ display: "none" }} data-cta onClick={() => go("register")}>List your stall</button>
          <button onClick={() => setOpen((o) => !o)} style={{ background: "transparent", border: "none", cursor: "pointer" }} data-hamburger>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div style={{ maxWidth: 1180, margin: "14px auto 0", display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className={`ttk-navlink ${page === item.key ? "active" : ""}`} style={{ display: "flex", alignItems: "center", gap: 8 }}
                onClick={() => { go(item.key); setOpen(false); }}>
                <Icon size={15} /> {item.label}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @media (min-width: 860px) {
          [data-nav] { display: flex !important; }
          [data-cta] { display: inline-flex !important; }
          [data-hamburger] { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function Footer({ go }) {
  return (
    <footer style={{ background: "linear-gradient(160deg, var(--dark-brown), #3d2b26)", color: "#FFFDF5", marginTop: 40, position: "relative" }}>
      <svg viewBox="0 0 1200 40" style={{ display: "block", width: "100%", height: 30 }} preserveAspectRatio="none">
        <path d="M0 20 C150 0 300 40 450 20 C600 0 750 40 900 20 C1000 5 1100 30 1200 15 V0 H0 Z" fill="var(--surface)" opacity="0" />
        <path d="M0 30 C150 10 300 45 450 25 C600 5 750 45 900 25 C1000 12 1100 35 1200 20" stroke="#D4A017" strokeWidth="2" fill="none" opacity="0.5" />
      </svg>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "20px 24px 40px", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 30 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Ship size={20} color="var(--kerala-gold)" />
            <span className="ttk-serif" style={{ fontWeight: 800, fontSize: 17 }}>Taste Trail Kerala</span>
          </div>
          <p style={{ fontSize: 13.5, opacity: 0.75, maxWidth: 320 }}>Mapping God's Own Country, one thattukada at a time — supporting local vendors with visibility, hygiene transparency and honest reviews.</p>
        </div>
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "var(--kerala-gold)", textTransform: "uppercase", letterSpacing: 1 }}>Explore</h4>
          {["explore", "map", "dashboard"].map((k) => (
            <div key={k} onClick={() => go(k)} style={{ fontSize: 13.5, opacity: 0.8, marginBottom: 8, cursor: "pointer", textTransform: "capitalize" }}>{k}</div>
          ))}
        </div>
        <div>
          <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "var(--kerala-gold)", textTransform: "uppercase", letterSpacing: 1 }}>For vendors</h4>
          <div onClick={() => go("register")} style={{ fontSize: 13.5, opacity: 0.8, marginBottom: 8, cursor: "pointer" }}>Register your stall</div>
          <div style={{ fontSize: 13.5, opacity: 0.8 }}>Hygiene certification info</div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", padding: "14px 24px", textAlign: "center", fontSize: 12, opacity: 0.6 }}>
        © {new Date().getFullYear()} Taste Trail Kerala · Built for local food, by local food lovers.
      </div>
    </footer>
  );
}

function FloatingFindButton({ go, notify }) {
  return (
    <button
      onClick={() => { notify("Locating nearby stalls…"); go("map"); }}
      className="ttk-btn ttk-btn-primary ttk-pulse"
      style={{ position: "fixed", bottom: 26, left: 26, zIndex: 90, boxShadow: "0 14px 30px rgba(46,125,50,0.4)" }}
    >
      <Navigation size={16} /> Find nearby food
    </button>
  );
}

/* ---------------------------------- ROOT APP ---------------------------------- */
export default function App() {
  const [page, setPage] = useState("landing");
  const [vendorId, setVendorId] = useState(VENDORS[0].id);
  const [dark, setDark] = useState(false);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState(new Set());
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [toasts, setToasts] = useState([]);

  const notify = useCallback((message) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  const removeToast = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  const go = useCallback((p, id) => {
    if (id) setVendorId(id);
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const toggleFav = useCallback((id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); notify("Removed from favorites"); }
      else { next.add(id); notify("Saved to favorites"); }
      return next;
    });
  }, [notify]);

  const addRecentlyViewed = useCallback((id) => {
    setRecentlyViewed((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 8));
  }, []);

  const addReview = useCallback((vendor, review) => {
    setMyReviews((prev) => [{ vendor, review }, ...prev]);
  }, []);

  return (
    <div className={`ttk-root ttk-bg-pattern ${dark ? "dark" : ""}`}>
      <style>{STYLES}</style>
      <Navbar page={page} go={go} dark={dark} setDark={setDark} />

      {page === "landing" && <LandingPage go={go} search={search} setSearch={setSearch} favorites={favorites} toggleFav={toggleFav} />}
      {page === "explore" && <ExplorePage go={go} favorites={favorites} toggleFav={toggleFav} search={search} setSearch={setSearch} />}
      {page === "map" && <MapPage go={go} />}
      {page === "vendor" && (
        <VendorDetailPage vendorId={vendorId} go={go} favorites={favorites} toggleFav={toggleFav}
          addReview={addReview} addRecentlyViewed={addRecentlyViewed} notify={notify} />
      )}
      {page === "register" && <RegisterPage notify={notify} />}
      {page === "dashboard" && <DashboardPage go={go} favorites={favorites} recentlyViewed={recentlyViewed} myReviews={myReviews} toggleFav={toggleFav} />}

      <Footer go={go} />
      <FloatingFindButton go={go} notify={notify} />
      <Toasts toasts={toasts} remove={removeToast} />
    </div>
  );
}