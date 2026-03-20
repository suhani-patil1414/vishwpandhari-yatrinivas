import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { BookingStatus, RoomType, UserRole } from "./backend.d";
import type { Booking } from "./backend.d";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

// ─── Types ─────────────────────────────────────────────────────────────────
type View = "home" | "booking" | "my-bookings" | "admin";

// ─── Data ──────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Home", href: "home" },
  { label: "About", href: "about" },
  { label: "Rooms", href: "rooms" },
  { label: "Amenities", href: "amenities" },
  { label: "Gallery", href: "gallery" },
  { label: "Contact", href: "contact" },
];

const ROOMS = [
  {
    id: 1,
    title: "Standard Room",
    image:
      "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=600&q=80",
    description:
      "A cozy, well-appointed room perfect for solo pilgrims or couples seeking a peaceful retreat after temple visits.",
    features: [
      "Queen Bed",
      "Private Bathroom",
      "Hot Water",
      "AC",
      "Free Wi-Fi",
    ],
    price: "₹800",
    type: RoomType.standard,
  },
  {
    id: 2,
    title: "Deluxe Room",
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80",
    description:
      "Spacious and elegantly furnished, our Deluxe Room offers premium amenities and a tranquil ambiance for a blessed stay.",
    features: [
      "King Bed",
      "Ensuite Bathroom",
      "Hot Water",
      "AC",
      "Free Wi-Fi",
      "Room Service",
    ],
    price: "₹1,200",
    type: RoomType.deluxe,
  },
  {
    id: 3,
    title: "Family Room",
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80",
    description:
      "Thoughtfully designed for families on spiritual journeys, with extra space and amenities to ensure everyone's comfort.",
    features: [
      "2 Double Beds",
      "Extra Mattress",
      "Hot Water",
      "AC",
      "Free Wi-Fi",
      "Mini Fridge",
    ],
    price: "₹1,800",
    type: RoomType.family,
  },
];

const AMENITIES = [
  {
    icon: "🚗",
    title: "Free Parking",
    desc: "Spacious and secure parking for your vehicle",
  },
  {
    icon: "🚿",
    title: "Hot Water",
    desc: "24-hour hot water supply for your comfort",
  },
  {
    icon: "🧹",
    title: "Clean Rooms",
    desc: "Daily housekeeping and sanitised spaces",
  },
  {
    icon: "👨‍👩‍👧",
    title: "Family Stay",
    desc: "Family-friendly environment, safe for all ages",
  },
  {
    icon: "🛕",
    title: "Temple Access",
    desc: "Walking distance to Vitthal-Rukmini Temple",
  },
  {
    icon: "📞",
    title: "24/7 Support",
    desc: "Round-the-clock assistance for all guests",
  },
];

const GALLERY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80",
    alt: "Hotel exterior",
  },
  {
    src: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=600&q=80",
    alt: "Dining area",
  },
  {
    src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
    alt: "Room interior",
  },
  {
    src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
    alt: "Lobby",
  },
  {
    src: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80",
    alt: "Garden",
  },
  {
    src: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80",
    alt: "Pool area",
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    name: "Ramesh Kulkarni",
    location: "Pune, Maharashtra",
    avatar: "https://i.pravatar.cc/80?img=1",
    rating: 5,
    review:
      "A truly divine experience! The rooms are spotlessly clean, the staff is warm and welcoming. Being so close to the Vitthal temple made our pilgrimage unforgettable. Highly recommended for families!",
  },
  {
    id: 2,
    name: "Sunita Deshpande",
    location: "Nashik, Maharashtra",
    avatar: "https://i.pravatar.cc/80?img=2",
    rating: 5,
    review:
      "We stayed here during Ashadhi Ekadashi. Despite being a busy time, everything was perfectly organised. The hot water, cleanliness, and hospitality made us feel at home. Will definitely come again!",
  },
  {
    id: 3,
    name: "Vijay Patil",
    location: "Solapur, Maharashtra",
    avatar: "https://i.pravatar.cc/80?img=3",
    rating: 5,
    review:
      "Vishwpandhari Yatrinivas exceeded all our expectations. The family room was spacious and comfortable. The staff helped us with temple timings and local guidance. A gem near Pandharpur!",
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────
function roomTypeLabel(rt: RoomType) {
  const map = {
    [RoomType.standard]: "Standard Room",
    [RoomType.deluxe]: "Deluxe Room",
    [RoomType.family]: "Family Room",
  };
  return map[rt] ?? rt;
}

function statusBadge(status: BookingStatus) {
  if (status === BookingStatus.confirmed)
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        Confirmed
      </Badge>
    );
  if (status === BookingStatus.cancelled)
    return (
      <Badge className="bg-red-100 text-red-800 border-red-200">
        Cancelled
      </Badge>
    );
  return (
    <Badge className="bg-amber-100 text-amber-800 border-amber-200">
      Pending
    </Badge>
  );
}

// ─── Shared UI ─────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-4 h-4 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`}
        />
      ))}
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
}: { eyebrow: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={`mb-12 ${center ? "text-center" : ""}`}>
      <span className="text-saffron font-body font-semibold text-sm uppercase tracking-widest">
        {eyebrow}
      </span>
      <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground max-w-2xl leading-relaxed text-base md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────
function Navbar({ view, setView }: { view: View; setView: (v: View) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { actor } = useActor();
  const isLoggedIn = !!identity;

  const { data: role } = useQuery({
    queryKey: ["role", identity?.getPrincipal().toString()],
    queryFn: () => actor!.getCallerUserRole(),
    enabled: !!actor && isLoggedIn,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSection = (href: string) => {
    setIsOpen(false);
    if (view !== "home") {
      setView("home");
      setTimeout(
        () =>
          document.getElementById(href)?.scrollIntoView({ behavior: "smooth" }),
        100,
      );
    } else
      document.getElementById(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const isAdmin = role === UserRole.admin;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || view !== "home" ? "bg-card/95 backdrop-blur-md shadow-card" : "bg-transparent"}`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 md:h-20">
        <button
          type="button"
          onClick={() => setView("home")}
          className="flex items-center gap-2.5"
          data-ocid="nav.link"
        >
          <span className="text-2xl">🛕</span>
          <span className="font-display font-bold text-lg leading-tight text-foreground">
            Vishwpandhari
            <span className="block text-xs font-body font-normal text-saffron tracking-widest uppercase">
              Yatrinivas
            </span>
          </span>
        </button>

        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <button
                type="button"
                onClick={() => handleSection(link.href)}
                data-ocid="nav.link"
                className="px-3 py-2 rounded-md text-sm font-medium text-foreground hover:text-saffron hover:bg-saffron-light transition-colors"
              >
                {link.label}
              </button>
            </li>
          ))}
          {isLoggedIn && (
            <>
              <li>
                <button
                  type="button"
                  onClick={() => setView("booking")}
                  data-ocid="nav.link"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === "booking" ? "text-saffron bg-saffron-light" : "text-foreground hover:text-saffron hover:bg-saffron-light"}`}
                >
                  Book Now
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setView("my-bookings")}
                  data-ocid="nav.link"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === "my-bookings" ? "text-saffron bg-saffron-light" : "text-foreground hover:text-saffron hover:bg-saffron-light"}`}
                >
                  My Bookings
                </button>
              </li>
              {isAdmin && (
                <li>
                  <button
                    type="button"
                    onClick={() => setView("admin")}
                    data-ocid="nav.link"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === "admin" ? "text-saffron bg-saffron-light" : "text-foreground hover:text-saffron hover:bg-saffron-light"}`}
                  >
                    Admin Panel
                  </button>
                </li>
              )}
            </>
          )}
        </ul>

        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                clear();
                setView("home");
              }}
              className="gap-2"
              data-ocid="nav.button"
            >
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={login}
              disabled={isLoggingIn}
              className="bg-saffron hover:bg-amber-600 text-white border-0 gap-2"
              data-ocid="nav.button"
            >
              {isLoggingIn ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <User className="w-4 h-4" />
              )}
              {isLoggingIn ? "Connecting..." : "Login"}
            </Button>
          )}
        </div>

        <button
          type="button"
          className="md:hidden p-2 rounded-lg text-foreground hover:bg-muted transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          data-ocid="nav.toggle"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-card border-b border-border shadow-warm"
          >
            <ul className="px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <button
                    type="button"
                    onClick={() => handleSection(link.href)}
                    data-ocid="nav.link"
                    className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:text-saffron hover:bg-saffron-light transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              {isLoggedIn && (
                <>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        setView("booking");
                      }}
                      data-ocid="nav.link"
                      className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:text-saffron hover:bg-saffron-light transition-colors"
                    >
                      Book Now
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        setView("my-bookings");
                      }}
                      data-ocid="nav.link"
                      className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:text-saffron hover:bg-saffron-light transition-colors"
                    >
                      My Bookings
                    </button>
                  </li>
                  {isAdmin && (
                    <li>
                      <button
                        type="button"
                        onClick={() => {
                          setIsOpen(false);
                          setView("admin");
                        }}
                        data-ocid="nav.link"
                        className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:text-saffron hover:bg-saffron-light transition-colors"
                      >
                        Admin Panel
                      </button>
                    </li>
                  )}
                </>
              )}
              <li className="pt-2">
                {isLoggedIn ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      clear();
                      setView("home");
                      setIsOpen(false);
                    }}
                    className="w-full gap-2"
                    data-ocid="nav.button"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={login}
                    disabled={isLoggingIn}
                    className="w-full bg-saffron hover:bg-amber-600 text-white border-0 gap-2"
                    data-ocid="nav.button"
                  >
                    {isLoggingIn ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    {isLoggingIn
                      ? "Connecting..."
                      : "Login with Internet Identity"}
                  </Button>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────
function HeroSection({ setView }: { setView: (v: View) => void }) {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-[0.2em] uppercase rounded-full border border-amber-400/60 text-amber-300 bg-black/20">
            🛕 Near Pandharpur Temple
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Welcome to <span className="text-amber-400">Vishwpandhari</span>
            <br />
            <span className="italic font-normal">Yatrinivas</span>
          </h1>
          <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">
            Peaceful homestay near Pandharpur for pilgrims and families — where
            every stay is a blessed experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => (identity ? setView("booking") : login)}
              disabled={isLoggingIn}
              className="bg-saffron hover:bg-amber-600 text-white px-8 py-6 text-base font-semibold rounded-xl shadow-warm border-0 transition-all hover:scale-105"
              data-ocid="hero.primary_button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Book Your Stay"
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollTo("rooms")}
              className="border-2 border-white text-white bg-white/10 hover:bg-white hover:text-foreground px-8 py-6 text-base font-semibold rounded-xl backdrop-blur-sm transition-all hover:scale-105"
              data-ocid="hero.secondary_button"
            >
              View Rooms
            </Button>
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center pt-1.5"
        >
          <div className="w-1.5 h-2.5 bg-white/70 rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}

// ─── About ─────────────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-saffron-light rounded-2xl opacity-60" />
              <div className="absolute -bottom-4 -right-4 w-32 h-16 bg-gold/20 rounded-2xl" />
              <img
                src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80"
                alt="Peaceful homestay interior"
                className="relative rounded-2xl shadow-warm w-full h-80 md:h-96 object-cover"
              />
              <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-card">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
                  Est. since
                </p>
                <p className="font-display text-2xl font-bold text-saffron">
                  2010
                </p>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <SectionHeading
              eyebrow="Our Story"
              title="A Home Away from Home"
              subtitle="Nestled in the holy town of Pandharpur, Vishwpandhari Yatrinivas has been a haven for pilgrims and families for over a decade."
            />
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Our yatrinivas is built on the values of devotion, comfort, and
                cleanliness. We understand that your spiritual journey deserves
                a restful and welcoming place to stay, and we strive to provide
                exactly that.
              </p>
              <p>
                Located just a short walk from the sacred Vitthal-Rukmini
                Temple, our property offers modern amenities while preserving
                the traditional warmth of Maharashtrian hospitality.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { num: "500+", label: "Happy Guests" },
                { num: "14+", label: "Years of Service" },
                { num: "100%", label: "Clean & Safe" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="text-center p-4 bg-saffron-light rounded-xl"
                >
                  <p className="font-display text-2xl font-bold text-saffron">
                    {s.num}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Rooms ─────────────────────────────────────────────────────────────────
function RoomsSection({ setView }: { setView: (v: View) => void }) {
  const { identity, login } = useInternetIdentity();
  return (
    <section id="rooms" className="py-20 md:py-28 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <SectionHeading
            eyebrow="Accommodation"
            title="Choose Your Room"
            subtitle="Each room is designed with your comfort and peace of mind in focus, blending modern amenities with a warm, home-like atmosphere."
            center
          />
        </div>
        <div className="grid md:grid-cols-3 gap-8" data-ocid="rooms.list">
          {ROOMS.map((room, i) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-warm transition-shadow group"
              data-ocid={`rooms.item.${i + 1}`}
            >
              <div className="relative overflow-hidden h-52">
                <img
                  src={room.image}
                  alt={room.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 bg-saffron text-white text-sm font-bold px-3 py-1 rounded-full shadow">
                  {room.price}/night
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  {room.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {room.description}
                </p>
                <ul className="space-y-1.5 mb-6">
                  {room.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-foreground"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-saffron flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-saffron hover:bg-amber-600 text-white font-semibold rounded-xl border-0"
                  onClick={() => (identity ? setView("booking") : login)}
                  data-ocid={`rooms.primary_button.${i + 1}`}
                >
                  Book Now
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Amenities ─────────────────────────────────────────────────────────────
function AmenitiesSection() {
  return (
    <section id="amenities" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <SectionHeading
            eyebrow="What We Offer"
            title="Premium Amenities"
            subtitle="Everything you need for a comfortable and spiritual stay, provided with care and dedication."
            center
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {AMENITIES.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-warm hover:border-saffron/30 transition-all group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {a.icon}
              </div>
              <h3 className="font-display font-bold text-foreground mb-2">
                {a.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {a.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Gallery ───────────────────────────────────────────────────────────────
function GallerySection() {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const prev = useCallback(
    () =>
      setLightboxIdx((i) =>
        i !== null
          ? (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length
          : null,
      ),
    [],
  );
  const next = useCallback(
    () =>
      setLightboxIdx((i) =>
        i !== null ? (i + 1) % GALLERY_IMAGES.length : null,
      ),
    [],
  );

  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIdx, prev, next]);

  return (
    <section id="gallery" className="py-20 md:py-28 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <SectionHeading
            eyebrow="Our Spaces"
            title="Photo Gallery"
            subtitle="A glimpse into the warmth and beauty of Vishwpandhari Yatrinivas."
            center
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {GALLERY_IMAGES.map((img, i) => (
            <motion.button
              type="button"
              key={img.alt}
              onClick={() => setLightboxIdx(i)}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group relative overflow-hidden rounded-2xl aspect-square focus:outline-none focus:ring-2 focus:ring-saffron"
              data-ocid={`gallery.item.${i + 1}`}
              aria-label={`View ${img.alt}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <span className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  🔍
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxIdx(null)}
            data-ocid="gallery.modal"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={GALLERY_IMAGES[lightboxIdx].src.replace("w=600", "w=1200")}
                alt={GALLERY_IMAGES[lightboxIdx].alt}
                className="w-full max-h-[80vh] object-contain rounded-xl"
              />
              <button
                type="button"
                onClick={() => setLightboxIdx(null)}
                className="absolute -top-10 right-0 text-white/80 hover:text-white"
                data-ocid="gallery.close_button"
              >
                <X className="w-7 h-7" />
              </button>
              <button
                type="button"
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-2"
                data-ocid="gallery.pagination_prev"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full p-2"
                data-ocid="gallery.pagination_next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <p className="text-center text-white/60 text-sm mt-3">
                {lightboxIdx + 1} / {GALLERY_IMAGES.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── Testimonials ──────────────────────────────────────────────────────────
function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const prev = () =>
    setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setCurrent((c) => (c + 1) % TESTIMONIALS.length);
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <SectionHeading
            eyebrow="Guest Reviews"
            title="What Our Guests Say"
            subtitle="Hear from the pilgrims and families who made Vishwpandhari Yatrinivas their home away from home."
            center
          />
        </div>
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="bg-card border border-border rounded-2xl p-7 shadow-card hover:shadow-warm transition-shadow"
              data-ocid={`testimonials.item.${i + 1}`}
            >
              <StarRating rating={t.rating} />
              <p className="text-muted-foreground text-sm leading-relaxed mt-4 mb-6 italic">
                &ldquo;{t.review}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-saffron/30"
                />
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {t.name}
                  </p>
                  <p className="text-muted-foreground text-xs">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-card"
              data-ocid="testimonials.card"
            >
              <StarRating rating={TESTIMONIALS[current].rating} />
              <p className="text-muted-foreground text-sm leading-relaxed mt-4 mb-6 italic">
                &ldquo;{TESTIMONIALS[current].review}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={TESTIMONIALS[current].avatar}
                  alt={TESTIMONIALS[current].name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-saffron/30"
                />
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {TESTIMONIALS[current].name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {TESTIMONIALS[current].location}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              type="button"
              onClick={prev}
              className="p-2 rounded-full border border-border hover:border-saffron hover:text-saffron transition-colors"
              data-ocid="testimonials.pagination_prev"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((t, i) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all ${i === current ? "bg-saffron w-5" : "bg-muted-foreground/40 w-2"}`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              className="p-2 rounded-full border border-border hover:border-saffron hover:text-saffron transition-colors"
              data-ocid="testimonials.pagination_next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ───────────────────────────────────────────────────────────────
function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", message: "" });
    setErrors({});
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <SectionHeading
            eyebrow="Get in Touch"
            title="Contact Us"
            subtitle="We'd love to hear from you. Reach out to make a booking or for any queries about your stay."
            center
          />
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-2xl p-8 shadow-card">
              <h3 className="font-display text-xl font-bold mb-6 text-foreground">
                Find Us Here
              </h3>
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-saffron-light flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-saffron" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      Address
                    </p>
                    <p className="text-muted-foreground text-sm mt-0.5 leading-relaxed">
                      Near Vitthal Mandir, Pandharpur,
                      <br />
                      Maharashtra 413304
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-saffron-light flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-saffron" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      Phone
                    </p>
                    <a
                      href="tel:+919876543210"
                      className="text-saffron text-sm hover:underline"
                    >
                      +91 98765 43210
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-saffron-light flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-saffron" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      Email
                    </p>
                    <a
                      href="mailto:info@vishwpandhariyatrinivas.com"
                      className="text-saffron text-sm hover:underline"
                    >
                      info@vishwpandhariyatrinivas.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="contact.primary_button"
              className="flex items-center justify-center gap-3 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-warm transition-all hover:scale-[1.02]"
            >
              <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="bg-card rounded-2xl p-8 shadow-card">
              {submitted ? (
                <div
                  className="text-center py-10"
                  data-ocid="contact.success_state"
                >
                  <div className="text-5xl mb-4">🙏</div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    Thank You!
                  </h3>
                  <p className="text-muted-foreground">
                    Your message has been received. We'll get back to you
                    shortly.
                  </p>
                  <Button
                    className="mt-6 bg-saffron hover:bg-amber-600 text-white border-0"
                    onClick={() => setSubmitted(false)}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                  data-ocid="contact.modal"
                  noValidate
                >
                  <h3 className="font-display text-xl font-bold text-foreground mb-6">
                    Send a Message
                  </h3>
                  <div className="space-y-1.5">
                    <Label htmlFor="cname">
                      Full Name <span className="text-saffron">*</span>
                    </Label>
                    <Input
                      id="cname"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      placeholder="Your name"
                      data-ocid="contact.input"
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && (
                      <p
                        className="text-destructive text-xs"
                        data-ocid="contact.error_state"
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cemail">
                      Email Address <span className="text-saffron">*</span>
                    </Label>
                    <Input
                      id="cemail"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      placeholder="your@email.com"
                      data-ocid="contact.input"
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p
                        className="text-destructive text-xs"
                        data-ocid="contact.error_state"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cphone">Phone Number</Label>
                    <Input
                      id="cphone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      placeholder="+91 XXXXX XXXXX"
                      data-ocid="contact.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cmessage">
                      Message <span className="text-saffron">*</span>
                    </Label>
                    <Textarea
                      id="cmessage"
                      value={form.message}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, message: e.target.value }))
                      }
                      placeholder="Tell us about your stay requirements..."
                      rows={4}
                      data-ocid="contact.textarea"
                      className={errors.message ? "border-destructive" : ""}
                    />
                    {errors.message && (
                      <p
                        className="text-destructive text-xs"
                        data-ocid="contact.error_state"
                      >
                        {errors.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-saffron hover:bg-amber-600 text-white font-semibold py-5 rounded-xl border-0"
                    data-ocid="contact.submit_button"
                  >
                    Send Message 🙏
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────
function Footer({ setView }: { setView: (v: View) => void }) {
  const year = new Date().getFullYear();
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <footer className="bg-foreground text-background/80 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-3 gap-10 pb-10 border-b border-background/10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🛕</span>
              <span className="font-display font-bold text-lg text-background">
                Vishwpandhari Yatrinivas
              </span>
            </div>
            <p className="text-sm leading-relaxed opacity-70">
              A peaceful and blessed stay near Pandharpur, serving pilgrims and
              families with warmth and devotion.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-background mb-4 uppercase text-xs tracking-widest">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <button
                    type="button"
                    onClick={() => {
                      setView("home");
                      setTimeout(() => scrollTo(l.href), 100);
                    }}
                    className="text-sm opacity-70 hover:opacity-100 hover:text-amber-300 transition-all text-left"
                    data-ocid="nav.link"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-background mb-4 uppercase text-xs tracking-widest">
              Contact
            </h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                Near Vitthal Mandir, Pandharpur, Maharashtra 413304
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                info@vishwpandhariyatrinivas.com
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs opacity-60">
          <p>&copy; {year} Vishwpandhari Yatrinivas. All rights reserved.</p>
          <p>
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-100 underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Scroll to top ─────────────────────────────────────────────────────────
function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 bg-saffron hover:bg-amber-600 text-white rounded-full shadow-warm flex items-center justify-center transition-colors"
          aria-label="Scroll to top"
          data-ocid="nav.button"
        >
          <ChevronUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ─── Home Page ─────────────────────────────────────────────────────────────
function HomePage({ setView }: { setView: (v: View) => void }) {
  return (
    <>
      <HeroSection setView={setView} />
      <AboutSection />
      <RoomsSection setView={setView} />
      <AmenitiesSection />
      <GallerySection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}

// ─── Booking Form ──────────────────────────────────────────────────────────
function BookingPage({ setView }: { setView: (v: View) => void }) {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const [form, setForm] = useState({
    guestName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    roomType: "" as RoomType | "",
    numberOfGuests: "1",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmedId, setConfirmedId] = useState<bigint | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.createBooking(
        form.guestName,
        form.email,
        form.phone,
        form.checkIn,
        form.checkOut,
        form.roomType as RoomType,
        BigInt(Number(form.numberOfGuests)),
      );
    },
    onSuccess: (id) => {
      setConfirmedId(id);
      toast.success("Booking confirmed!");
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Booking failed"),
  });

  if (!identity) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Please log in to make a booking.
          </p>
          <Button onClick={() => setView("home")} variant="outline">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.guestName.trim()) e.guestName = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    if (!form.checkIn) e.checkIn = "Check-in date is required";
    if (!form.checkOut) e.checkOut = "Check-out date is required";
    else if (form.checkIn && form.checkOut <= form.checkIn)
      e.checkOut = "Check-out must be after check-in";
    if (!form.roomType) e.roomType = "Please select a room type";
    if (!form.numberOfGuests || Number(form.numberOfGuests) < 1)
      e.numberOfGuests = "At least 1 guest required";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    mutation.mutate();
  };

  if (confirmedId !== null) {
    return (
      <div className="min-h-screen pt-24 bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-card rounded-2xl p-10 shadow-warm text-center"
        >
          <div className="text-6xl mb-4">🙏</div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Booking Confirmed!
          </h2>
          <p className="text-muted-foreground mb-2">
            Your booking has been received successfully.
          </p>
          <div className="bg-saffron-light rounded-xl px-6 py-4 my-6">
            <p className="text-sm text-muted-foreground">Booking ID</p>
            <p className="font-display text-3xl font-bold text-saffron">
              #{confirmedId.toString()}
            </p>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Please save your Booking ID for reference. Our team will confirm
            your stay shortly.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => setView("my-bookings")}
              className="bg-saffron hover:bg-amber-600 text-white border-0"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              My Bookings
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setConfirmedId(null);
                setForm({
                  guestName: "",
                  email: "",
                  phone: "",
                  checkIn: "",
                  checkOut: "",
                  roomType: "",
                  numberOfGuests: "1",
                });
              }}
            >
              Book Another
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-muted pb-16">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => setView("home")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Home
          </button>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Book Your Stay
          </h1>
          <p className="text-muted-foreground mt-1">
            Fill in the details below and we'll confirm your booking.
          </p>
        </div>
        <Card className="shadow-warm">
          <CardContent className="pt-6">
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              noValidate
              data-ocid="booking.modal"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="guestName">
                    Full Name <span className="text-saffron">*</span>
                  </Label>
                  <Input
                    id="guestName"
                    value={form.guestName}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, guestName: e.target.value }))
                    }
                    placeholder="Your full name"
                    data-ocid="booking.input"
                    className={errors.guestName ? "border-destructive" : ""}
                  />
                  {errors.guestName && (
                    <p className="text-destructive text-xs">
                      {errors.guestName}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="bemail">
                    Email Address <span className="text-saffron">*</span>
                  </Label>
                  <Input
                    id="bemail"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    placeholder="your@email.com"
                    data-ocid="booking.input"
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-destructive text-xs">{errors.email}</p>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bphone">
                  Phone Number <span className="text-saffron">*</span>
                </Label>
                <Input
                  id="bphone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  placeholder="+91 XXXXX XXXXX"
                  data-ocid="booking.input"
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && (
                  <p className="text-destructive text-xs">{errors.phone}</p>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="checkIn">
                    Check-in Date <span className="text-saffron">*</span>
                  </Label>
                  <Input
                    id="checkIn"
                    type="date"
                    value={form.checkIn}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, checkIn: e.target.value }))
                    }
                    min={new Date().toISOString().split("T")[0]}
                    data-ocid="booking.input"
                    className={errors.checkIn ? "border-destructive" : ""}
                  />
                  {errors.checkIn && (
                    <p className="text-destructive text-xs">{errors.checkIn}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="checkOut">
                    Check-out Date <span className="text-saffron">*</span>
                  </Label>
                  <Input
                    id="checkOut"
                    type="date"
                    value={form.checkOut}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, checkOut: e.target.value }))
                    }
                    min={form.checkIn || new Date().toISOString().split("T")[0]}
                    data-ocid="booking.input"
                    className={errors.checkOut ? "border-destructive" : ""}
                  />
                  {errors.checkOut && (
                    <p className="text-destructive text-xs">
                      {errors.checkOut}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>
                    Room Type <span className="text-saffron">*</span>
                  </Label>
                  <Select
                    value={form.roomType}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, roomType: v as RoomType }))
                    }
                  >
                    <SelectTrigger
                      data-ocid="booking.select"
                      className={errors.roomType ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="Select room type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={RoomType.standard}>
                        Standard Room – ₹800/night
                      </SelectItem>
                      <SelectItem value={RoomType.deluxe}>
                        Deluxe Room – ₹1,200/night
                      </SelectItem>
                      <SelectItem value={RoomType.family}>
                        Family Room – ₹1,800/night
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.roomType && (
                    <p className="text-destructive text-xs">
                      {errors.roomType}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="guests">
                    Number of Guests <span className="text-saffron">*</span>
                  </Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    max="10"
                    value={form.numberOfGuests}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, numberOfGuests: e.target.value }))
                    }
                    data-ocid="booking.input"
                    className={
                      errors.numberOfGuests ? "border-destructive" : ""
                    }
                  />
                  {errors.numberOfGuests && (
                    <p className="text-destructive text-xs">
                      {errors.numberOfGuests}
                    </p>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-saffron hover:bg-amber-600 text-white font-semibold py-5 rounded-xl border-0"
                data-ocid="booking.submit_button"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  "Confirm Booking 🙏"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Guest Dashboard ───────────────────────────────────────────────────────
function MyBookingsPage({ setView }: { setView: (v: View) => void }) {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["my-bookings", identity?.getPrincipal().toString()],
    queryFn: () => actor!.getCallerBookings(),
    enabled: !!actor && !!identity,
  });

  const cancelMutation = useMutation({
    mutationFn: (id: bigint) =>
      actor!.updateBookingStatus(id, BookingStatus.cancelled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      toast.success("Booking cancelled");
    },
    onError: () => toast.error("Failed to cancel booking"),
  });

  if (!identity)
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Please log in to view your bookings.
          </p>
          <Button onClick={() => setView("home")} variant="outline">
            Go Home
          </Button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen pt-24 bg-background pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => setView("home")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </button>
          <div className="flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-saffron" />
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                My Bookings
              </h1>
              <p className="text-muted-foreground">
                View and manage your stay reservations
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-saffron" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl shadow-card">
            <div className="text-5xl mb-4">🛕</div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">
              No bookings yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Start your spiritual journey by booking a stay with us.
            </p>
            <Button
              onClick={() => setView("booking")}
              className="bg-saffron hover:bg-amber-600 text-white border-0"
            >
              Book Now
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {[...bookings]
              .sort((a, b) => Number(b.createdAt - a.createdAt))
              .map((booking) => (
                <motion.div
                  key={booking.id.toString()}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-2xl p-6 shadow-card border border-border"
                  data-ocid="my_bookings.card"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-display font-bold text-foreground">
                          #{booking.id.toString()}
                        </span>
                        {statusBadge(booking.status)}
                      </div>
                      <p className="text-saffron font-semibold">
                        {roomTypeLabel(booking.roomType)}
                      </p>
                    </div>
                    {booking.status === BookingStatus.pending && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cancelMutation.mutate(booking.id)}
                        disabled={cancelMutation.isPending}
                        className="text-destructive border-destructive/30 hover:bg-destructive/5"
                        data-ocid="my_bookings.cancel_button"
                      >
                        {cancelMutation.isPending ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          "Cancel"
                        )}
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Guest</p>
                      <p className="text-sm font-medium text-foreground">
                        {booking.guestName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Guests</p>
                      <p className="text-sm font-medium text-foreground">
                        {booking.numberOfGuests.toString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Check-in</p>
                      <p className="text-sm font-medium text-foreground">
                        {booking.checkIn}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Check-out</p>
                      <p className="text-sm font-medium text-foreground">
                        {booking.checkOut}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Admin Panel ───────────────────────────────────────────────────────────
function AdminPage({ setView }: { setView: (v: View) => void }) {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>(
    "all",
  );
  const [search, setSearch] = useState("");

  const { data: role } = useQuery({
    queryKey: ["role", identity?.getPrincipal().toString()],
    queryFn: () => actor!.getCallerUserRole(),
    enabled: !!actor && !!identity,
  });

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["all-bookings", identity?.getPrincipal().toString()],
    queryFn: () => actor!.getAllBookings(),
    enabled: !!actor && !!identity && role === UserRole.admin,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: bigint; status: BookingStatus }) =>
      actor!.updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
      toast.success("Status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: bigint) => actor!.deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
      toast.success("Booking deleted");
    },
    onError: () => toast.error("Failed to delete booking"),
  });

  if (!identity || role !== UserRole.admin) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            {!identity ? "Please log in first." : "Admin access required."}
          </p>
          <Button onClick={() => setView("home")} variant="outline">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const filtered = bookings
    .filter((b: Booking) => statusFilter === "all" || b.status === statusFilter)
    .filter(
      (b: Booking) =>
        !search ||
        b.guestName.toLowerCase().includes(search.toLowerCase()) ||
        b.email.toLowerCase().includes(search.toLowerCase()),
    );

  const sorted = [...filtered].sort((a, b) =>
    Number(b.createdAt - a.createdAt),
  );

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b: Booking) => b.status === BookingStatus.pending)
      .length,
    confirmed: bookings.filter(
      (b: Booking) => b.status === BookingStatus.confirmed,
    ).length,
    cancelled: bookings.filter(
      (b: Booking) => b.status === BookingStatus.cancelled,
    ).length,
  };

  return (
    <div className="min-h-screen pt-24 bg-background pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => setView("home")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </button>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-saffron" />
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">
                Admin Panel
              </h1>
              <p className="text-muted-foreground">Manage all guest bookings</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Bookings",
              value: stats.total,
              color: "text-foreground",
            },
            { label: "Pending", value: stats.pending, color: "text-amber-600" },
            {
              label: "Confirmed",
              value: stats.confirmed,
              color: "text-green-600",
            },
            {
              label: "Cancelled",
              value: stats.cancelled,
              color: "text-red-600",
            },
          ].map((s) => (
            <Card key={s.label} className="shadow-card">
              <CardHeader className="pb-1 pt-4">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {s.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`font-display text-3xl font-bold ${s.color}`}>
                  {s.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
            data-ocid="admin.input"
          />
          <div className="flex gap-2">
            {(
              [
                "all",
                BookingStatus.pending,
                BookingStatus.confirmed,
                BookingStatus.cancelled,
              ] as const
            ).map((s) => (
              <Button
                key={s}
                variant={statusFilter === s ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(s)}
                className={
                  statusFilter === s
                    ? "bg-saffron hover:bg-amber-600 text-white border-0"
                    : ""
                }
                data-ocid="admin.filter_button"
              >
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-saffron" />
          </div>
        ) : (
          <div
            className="bg-card rounded-2xl shadow-card overflow-hidden"
            data-ocid="admin.table"
          >
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Guest</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-12 text-muted-foreground"
                      >
                        No bookings found
                      </TableCell>
                    </TableRow>
                  ) : (
                    sorted.map((booking: Booking) => (
                      <TableRow
                        key={booking.id.toString()}
                        data-ocid="admin.row"
                      >
                        <TableCell className="font-mono text-xs">
                          #{booking.id.toString()}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground text-sm">
                              {booking.guestName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {booking.email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {booking.phone}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {roomTypeLabel(booking.roomType)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {booking.checkIn}
                        </TableCell>
                        <TableCell className="text-sm">
                          {booking.checkOut}
                        </TableCell>
                        <TableCell className="text-sm">
                          {booking.numberOfGuests.toString()}
                        </TableCell>
                        <TableCell>{statusBadge(booking.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {booking.status === BookingStatus.pending && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  updateMutation.mutate({
                                    id: booking.id,
                                    status: BookingStatus.confirmed,
                                  })
                                }
                                disabled={updateMutation.isPending}
                                className="text-green-700 border-green-200 hover:bg-green-50 text-xs px-2 py-1 h-auto"
                                data-ocid="admin.confirm_button"
                              >
                                Confirm
                              </Button>
                            )}
                            {booking.status !== BookingStatus.cancelled && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  updateMutation.mutate({
                                    id: booking.id,
                                    status: BookingStatus.cancelled,
                                  })
                                }
                                disabled={updateMutation.isPending}
                                className="text-amber-700 border-amber-200 hover:bg-amber-50 text-xs px-2 py-1 h-auto"
                                data-ocid="admin.cancel_button"
                              >
                                Cancel
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (confirm("Delete this booking?"))
                                  deleteMutation.mutate(booking.id);
                              }}
                              disabled={deleteMutation.isPending}
                              className="text-destructive border-destructive/30 hover:bg-destructive/5 text-xs px-2 py-1 h-auto"
                              data-ocid="admin.delete_button"
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState<View>("home");

  useEffect(() => {
    if (view !== "home") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view]);

  return (
    <div className="min-h-screen">
      <Toaster richColors position="top-right" />
      <Navbar view={view} setView={setView} />
      <main>
        {view === "home" && <HomePage setView={setView} />}
        {view === "booking" && <BookingPage setView={setView} />}
        {view === "my-bookings" && <MyBookingsPage setView={setView} />}
        {view === "admin" && <AdminPage setView={setView} />}
      </main>
      {view === "home" && <Footer setView={setView} />}
      <ScrollToTop />
    </div>
  );
}
