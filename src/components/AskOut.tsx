import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  Clock,
  Heart,
  PartyPopper,
  SmilePlus,
} from "lucide-react";
import { Instagram, Github, Twitter, Linkedin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const PLACES = [
  { id: "cafe", label: "Cafe", emoji: "☕" },
  { id: "temple", label: "Temple", emoji: "🛕" },
  { id: "movie", label: "Movie", emoji: "🎬" },
  { id: "beach", label: "Beach", emoji: "🏖️" },
];

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = ["00", "15", "30", "45"];

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.25 } },
};

export default function AskOut() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [place, setPlace] = useState("");
  const [customPlace, setCustomPlace] = useState("");
  const [date, setDate] = useState<Date>();
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState("00");
  const [ampm, setAmpm] = useState<"AM" | "PM">("PM");
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const [noFrozen, setNoFrozen] = useState(false);
  const [noTextIndex, setNoTextIndex] = useState(0);
  const noTexts = [
    "No",
    "Pakka?🤨",
    "Soch lo 😏",
    "Last chance 😬",
    "Are you sure?🥺",
  ];

  const [darkMode, setDarkMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = (file: string) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio("/" + file);
      audioRef.current = audio;
      audio.play();
    } catch (e) {
      console.log("Audio error", e);
    }
  };

  const moveNoButton = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.random() * (rect.width - 100);
    const y = Math.random() * (rect.height - 60);
    setNoPos({ x, y });
  }, []);

  const handleNo = useCallback(() => {
    if (noFrozen) return;

    playSound("No3.mp3");

    setNoTextIndex((prev) => (prev + 1) % noTexts.length); // 🔥 yeh add

    setNoFrozen(true);
    setTimeout(() => {
      setNoFrozen(false);
      moveNoButton();
    }, 1000);
  }, [noFrozen, moveNoButton]);
  const handleYes = useCallback(() => {
    if (!name.trim()) return;

    playSound("YaYaYa.mp3"); // 🔥 add

    setStep(1);
  }, [name]);

  const timeString = `${hour}:${minute} ${ampm}`;
  const dateString = date ? format(date, "PPP") : "";

  const handleWhatsApp = () => {
    playSound("ThankYou.mp3"); // 🔥 sound

    const msg = encodeURIComponent(
      `Hey Chinu, I’ve confirmed the place, date, and time.\n\n📍 Place: ${
        place === "custom"
          ? customPlace
          : PLACES.find((p) => p.id === place)?.label
      }\n📅 Date: ${dateString}\n⏰ Time: ${timeString}\n\nLet me know if everything looks good or if you’d like to change anything.`,
    );

    setTimeout(() => {
      window.open(`https://wa.me/917077863178?text=${msg}`, "_blank");
    }, 1000);
  };

  const BackButton = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="absolute top-4 left-4 z-10 flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm font-body"
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </button>
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden transition-colors duration-300",
        darkMode ? "bg-black text-white" : "bg-white text-black",
      )}
    >
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm bg-primary text-white z-50"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>
      <AnimatePresence mode="wait">
        {/* STEP 0: Landing */}
        {step === 0 && (
          <motion.div
            key="landing"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center gap-8 w-full max-w-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Heart className="w-12 h-12 text-primary fill-primary/20" />
            </motion.div>

            <h1 className="font-display text-3xl md:text-4xl text-center leading-snug text-foreground">
              Will you go out
              <br />
              with me?
            </h1>

            <Input
              placeholder="Enter your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={cn(
                "text-center text-base h-12 rounded-2xl border-border focus:ring-primary",
                darkMode
                  ? "bg-black text-white placeholder:text-gray-400"
                  : "bg-card text-black",
              )}
            />

            <div className="flex gap-4 w-full relative">
              <Button
                onClick={handleYes}
                disabled={!name.trim()}
                className="flex-1 h-12 rounded-2xl text-base font-medium flex items-center justify-center gap-2"
              >
                Yes! Can't wait
              </Button>

              {noPos === null ? (
                <Button
                  variant="secondary"
                  onClick={handleNo}
                  className={cn(
                    "flex-1 h-12 rounded-2xl text-base font-medium transition-opacity",
                    noFrozen && "opacity-50 cursor-not-allowed",
                  )}
                >
                  {noTexts[noTextIndex]}
                </Button>
              ) : null}
            </div>

            {/* Escaped No button */}
            {noPos !== null && (
              <motion.div
                className="absolute"
                animate={{ x: noPos.x, y: noPos.y }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ left: 0, top: 0 }}
              >
                <Button
                  variant="secondary"
                  onClick={handleNo}
                  className={cn(
                    "h-12 rounded-2xl text-base font-medium px-8",
                    noFrozen && "opacity-50 cursor-not-allowed",
                  )}
                  onTouchStart={handleNo}
                >
                  {noTexts[noTextIndex]}
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* STEP 1: Place */}
        {step === 1 && (
          <motion.div
            key="place"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center gap-6 w-full max-w-sm"
          >
            <BackButton onClick={() => setStep(0)} />
            <MapPin className="w-8 h-8 text-primary" />

            <h2 className="font-display text-2xl text-foreground">
              Pick a place
            </h2>

            {/* Default options */}
            <div className="grid grid-cols-2 gap-3 w-full">
              {PLACES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setPlace(p.id);
                    setStep(2);
                  }}
                  className={cn(
                    "flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200",
                    place === p.id
                      ? "border-primary bg-accent"
                      : "border-border bg-card hover:border-primary/40",
                  )}
                >
                  <span className="text-3xl">{p.emoji}</span>
                  <span className="text-sm font-medium text-foreground">
                    {p.label}
                  </span>
                </button>
              ))}
            </div>

            {/* 🔥 Custom Input */}
            <div className="w-full flex flex-col gap-2 mt-2">
              <Input
                placeholder="Or type your own place..."
                value={customPlace}
                onChange={(e) => {
                  setCustomPlace(e.target.value);
                  setPlace("custom");
                }}
                className="h-12 rounded-2xl text-center"
              />

              <Button
                onClick={() => {
                  if (customPlace.trim()) {
                    setPlace("custom");
                    setStep(2);
                  }
                }}
                disabled={!customPlace.trim()}
                className="h-10 rounded-xl text-sm"
              >
                Continue
              </Button>
            </div>
          </motion.div>
        )}
        {/* STEP 2: Date */}
        {step === 2 && (
          <motion.div
            key="date"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center gap-4 w-full max-w-sm"
          >
            <BackButton onClick={() => setStep(1)} />
            <CalendarDays className="w-8 h-8 text-primary" />
            <h2 className="font-display text-2xl text-foreground">
              Pick a date
            </h2>
            <div className="bg-card rounded-2xl border border-border p-2 w-full flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  if (d) {
                    setDate(d);
                    setStep(3);
                  }
                }}
                disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                className="pointer-events-auto"
              />
            </div>
          </motion.div>
        )}

        {/* STEP 3: Time */}
        {step === 3 && (
          <motion.div
            key="time"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center gap-6 w-full max-w-sm"
          >
            <BackButton onClick={() => setStep(2)} />
            <Clock className="w-8 h-8 text-primary" />
            <h2 className="font-display text-2xl text-foreground">
              Pick a time
            </h2>

            <div className="flex items-center gap-2">
              {/* Hour wheel */}
              <div className="relative h-[180px] w-[72px] overflow-hidden rounded-2xl border border-border bg-card">
                <div className="absolute inset-x-0 top-0 h-[60px] bg-gradient-to-b from-card to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-[60px] bg-gradient-to-t from-card to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[44px] rounded-xl bg-primary/10 border border-primary/20 mx-1 z-[5] pointer-events-none" />
                <div
                  className="flex flex-col items-center py-[68px] overflow-y-auto h-full scrollbar-hide snap-y snap-mandatory"
                  ref={(el) => {
                    if (el && !el.dataset.scrolled) {
                      el.dataset.scrolled = "1";
                      const idx = HOURS.indexOf(hour);
                      el.scrollTop = idx * 44;
                    }
                  }}
                  onScroll={(e) => {
                    const el = e.currentTarget;
                    const idx = Math.round(el.scrollTop / 44);
                    if (HOURS[idx] !== undefined) setHour(HOURS[idx]);
                  }}
                >
                  {HOURS.map((h) => (
                    <button
                      key={h}
                      onClick={() => setHour(h)}
                      className={cn(
                        "h-[44px] min-h-[44px] flex items-center justify-center w-full text-lg font-medium snap-center transition-all duration-150",
                        hour === h
                          ? "text-foreground scale-110"
                          : "text-muted-foreground/50 scale-90",
                      )}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              <span className="text-3xl font-display text-primary">:</span>

              {/* Minute wheel */}
              <div className="relative h-[180px] w-[72px] overflow-hidden rounded-2xl border border-border bg-card">
                <div className="absolute inset-x-0 top-0 h-[60px] bg-gradient-to-b from-card to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-[60px] bg-gradient-to-t from-card to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[44px] rounded-xl bg-primary/10 border border-primary/20 mx-1 z-[5] pointer-events-none" />
                <div
                  className="flex flex-col items-center py-[68px] overflow-y-auto h-full scrollbar-hide snap-y snap-mandatory"
                  ref={(el) => {
                    if (el && !el.dataset.scrolled) {
                      el.dataset.scrolled = "1";
                      const idx = MINUTES.indexOf(minute);
                      el.scrollTop = idx * 44;
                    }
                  }}
                  onScroll={(e) => {
                    const el = e.currentTarget;
                    const idx = Math.round(el.scrollTop / 44);
                    if (MINUTES[idx] !== undefined) setMinute(MINUTES[idx]);
                  }}
                >
                  {MINUTES.map((m) => (
                    <button
                      key={m}
                      onClick={() => setMinute(m)}
                      className={cn(
                        "h-[44px] min-h-[44px] flex items-center justify-center w-full text-lg font-medium snap-center transition-all duration-150",
                        minute === m
                          ? "text-foreground scale-110"
                          : "text-muted-foreground/50 scale-90",
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* AM/PM toggle */}
              <div className="flex flex-col gap-2 ml-2">
                {(["AM", "PM"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setAmpm(v)}
                    className={cn(
                      "px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200",
                      ampm === v
                        ? "bg-primary text-primary-foreground shadow-md scale-105"
                        : "bg-secondary text-muted-foreground hover:bg-accent",
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setStep(4)}
              className="w-full h-12 rounded-2xl text-base mt-4"
            >
              Continue
            </Button>
          </motion.div>
        )}

        {/* STEP 4: Summary */}
        {step === 4 && (
          <motion.div
            key="summary"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col items-center gap-6 w-full max-w-sm"
          >
            <BackButton onClick={() => setStep(3)} />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <PartyPopper className="w-12 h-12 text-primary" />
            </motion.div>
            <h2 className="font-display text-2xl text-foreground">
              This is going to be fun!
            </h2>

            <div className="w-full bg-card rounded-2xl border border-border p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground text-sm">Name</span>
                <span className="ml-auto font-medium text-foreground">
                  {name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground text-sm">Place</span>
                <span className="ml-auto font-medium text-foreground">
                  {place === "custom"
                    ? customPlace
                    : `${PLACES.find((p) => p.id === place)?.emoji} ${
                        PLACES.find((p) => p.id === place)?.label
                      }`}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CalendarDays className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground text-sm">Date</span>
                <span className="ml-auto font-medium text-foreground">
                  {dateString}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground text-sm">Time</span>
                <span className="ml-auto font-medium text-foreground">
                  {timeString}
                </span>
              </div>
            </div>

            <Button
              onClick={handleWhatsApp}
              className="w-full h-12 rounded-2xl text-base gap-2 bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-primary-foreground"
            >
              Send via WhatsApp 💬
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="absolute bottom-4 flex flex-col items-center gap-2 text-xs text-muted-foreground">

  {/* Social Icons */}
  <div className="flex gap-4">
  <a
    href="https://www.instagram.com/chinuuu______________/"
    target="_blank"
    rel="noopener noreferrer"
    className="no-underline"
  >
    <Instagram className="w-5 h-5 hover:text-pink-500 transition hover:scale-110" />
  </a>

  <a
    href="https://github.com/Chinu7077"
    target="_blank"
    rel="noopener noreferrer"
    className="no-underline"
  >
    <Github className="w-5 h-5 hover:text-white transition hover:scale-110" />
  </a>

  <a
    href="https://twitter.com/"
    target="_blank"
    rel="noopener noreferrer"
    className="no-underline"
  >
    <Twitter className="w-5 h-5 hover:text-blue-400 transition hover:scale-110" />
  </a>

  <a
    href="https://www.linkedin.com/in/chinmaya-nayak-09226317b/"
    target="_blank"
    rel="noopener noreferrer"
    className="no-underline"
  >
    <Linkedin className="w-5 h-5 hover:text-blue-600 transition hover:scale-110" />
  </a>
</div>

  {/* Text */}
  <p className="text-center leading-relaxed">
    Code & Creativity by Chinu ✨ <br />© 2026 Chinu. All rights reserved.
  </p>
</div>
    </div>
  );
}
