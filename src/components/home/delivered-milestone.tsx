"use client";

import { useEffect, useRef, useState } from "react";

/** Count at the epoch moment — grows +2 notebooks every hour after this. */
const BASE_COUNT = 2000;
const NOTEBOOKS_PER_HOUR = 2;
/** IST midnight on launch day of this milestone. */
const EPOCH_MS = Date.parse("2026-08-14T00:00:00+05:30");
const HOUR_MS = 3_600_000;
const INTRO_MS = 2200;
const STEP_MS = 700;

function getLiveDeliveredCount(now = Date.now()) {
  const hours = Math.max(0, Math.floor((now - EPOCH_MS) / HOUR_MS));
  return BASE_COUNT + hours * NOTEBOOKS_PER_HOUR;
}

function msUntilNextHour(now = Date.now()) {
  const elapsed = Math.max(0, now - EPOCH_MS);
  return HOUR_MS - (elapsed % HOUR_MS);
}

/** Smooth ease — always approaches from below, never overshoots. */
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function formatCount(value: number) {
  return Math.round(value).toLocaleString("en-IN");
}

function animateTo(
  from: number,
  to: number,
  duration: number,
  onUpdate: (value: number) => void,
  onDone?: () => void,
) {
  if (from === to) {
    onUpdate(to);
    onDone?.();
    return () => {};
  }

  const start = performance.now();
  let frame = 0;

  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    // Floor while running so the value never visually passes `to`.
    const value =
      t >= 1 ? to : Math.min(to, Math.floor(from + (to - from) * easeOutCubic(t)));
    onUpdate(value);
    if (t < 1) {
      frame = window.requestAnimationFrame(tick);
    } else {
      onDone?.();
    }
  };

  frame = window.requestAnimationFrame(tick);
  return () => window.cancelAnimationFrame(frame);
}

/**
 * Slim, proud milestone — sits just under the homepage hero.
 * Live total: 2,000 at epoch, then +2 notebooks every hour.
 */
export function DeliveredMilestone() {
  const sectionRef = useRef<HTMLElement>(null);
  const hourTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelAnimRef = useRef<(() => void) | null>(null);
  const valueRef = useRef(0);
  const startedRef = useRef(false);
  const introDoneRef = useRef(false);
  const lastTargetRef = useRef(BASE_COUNT);

  const [value, setValue] = useState(0);

  const setValueSync = (next: number) => {
    valueRef.current = next;
    setValue(next);
  };

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const runTo = (target: number, duration: number, onDone?: () => void) => {
      cancelAnimRef.current?.();
      cancelAnimRef.current = animateTo(
        valueRef.current,
        target,
        duration,
        setValueSync,
        onDone,
      );
    };

    const syncLive = () => {
      const target = getLiveDeliveredCount();
      if (target === lastTargetRef.current) return;
      lastTargetRef.current = target;
      if (!introDoneRef.current) return;
      runTo(target, STEP_MS);
    };

    const scheduleHour = () => {
      hourTimerRef.current = setTimeout(() => {
        syncLive();
        scheduleHour();
      }, msUntilNextHour() + 50);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || startedRef.current) return;
        startedRef.current = true;

        const target = getLiveDeliveredCount();
        lastTargetRef.current = target;

        if (reduceMotion) {
          setValueSync(target);
          introDoneRef.current = true;
          scheduleHour();
          return;
        }

        runTo(target, INTRO_MS, () => {
          introDoneRef.current = true;
          scheduleHour();
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimRef.current?.();
      if (hourTimerRef.current) clearTimeout(hourTimerRef.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Notebooks delivered"
      className="relative overflow-hidden border-y border-secondary/25 bg-primary text-on-primary"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(105deg, transparent 0%, rgba(254,211,152,0.18) 42%, transparent 68%)",
        }}
      />
      <div className="relative mx-auto flex max-w-container-max flex-col items-center gap-5 px-margin-mobile py-9 text-center md:flex-row md:justify-between md:gap-10 md:px-margin-desktop md:py-11 md:text-left">
        <p className="font-label-md text-[11px] font-medium uppercase tracking-[0.32em] text-secondary-fixed">
          A quiet privilege
        </p>

        <div className="md:text-center">
          <p className="font-display-lg text-[44px] leading-none tracking-[-0.02em] text-white md:text-[58px]">
            <span className="sr-only">Over {formatCount(value)}</span>
            <span
              aria-hidden
              className="mr-3 align-[0.28em] font-label-md text-[11px] font-medium uppercase tracking-[0.28em] text-secondary-fixed"
            >
              Over
            </span>
            <span
              aria-hidden
              className="inline-block min-w-[4.6ch] text-left tabular-nums"
            >
              {formatCount(value)}
            </span>
          </p>
          <p className="mt-3 font-label-md text-[13px] uppercase tracking-[0.22em] text-white/75">
            Notebooks delivered with care
          </p>
        </div>

        <p className="max-w-[17rem] font-label-md text-[12px] font-medium uppercase leading-relaxed tracking-[0.22em] text-secondary-fixed md:text-right">
          To writers, makers, and thoughtful desks across India.
        </p>
      </div>
    </section>
  );
}
