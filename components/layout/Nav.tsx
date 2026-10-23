"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingBag, X } from "lucide-react";
import { nav } from "@/content/site";
import { Wordmark } from "@/components/brand/Wordmark";
import { useCart } from "@/components/cart/CartProvider";

export function Nav() {
  const { totals, open, ready } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // Hide on fast downward scroll past the hero, reveal on any upward scroll.
      setHidden(y > 640 && y > lastY.current + 4);
      if (y < lastY.current - 4 || y < 640) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: Escape closes, focus moves into the panel and is kept there, scroll is locked.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = panel.current?.querySelector<HTMLElement>("a,button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
      if (e.key === "Tab" && panel.current) {
        const items = panel.current.querySelectorAll<HTMLElement>("a,button");
        const a = items[0];
        const b = items[items.length - 1];
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault();
          b.focus();
        } else if (!e.shiftKey && document.activeElement === b) {
          e.preventDefault();
          a.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const count = ready ? totals.itemCount : 0;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[var(--ease-out)] ${hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div
        className={`mx-auto mt-2 flex h-[60px] max-w-[1280px] items-center justify-between gap-4 rounded-full px-3 pl-5 transition-[background-color,box-shadow,margin] duration-500 sm:mx-4 xl:mx-auto ${
          scrolled || menuOpen ? "mx-2 bg-pulp/90 shadow-[0_10px_40px_-18px_rgb(30_20_14/0.45)] backdrop-blur-md" : "mx-2 bg-transparent"
        }`}
      >
        <Link href="/#top" className="rounded-full text-[1.7rem]" aria-label="JUICY home">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="rounded-full px-3.5 py-2 text-[0.95rem] font-medium text-ink/80 transition-colors hover:bg-ink/5 hover:text-ink">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={open}
            className="relative grid h-12 w-12 place-items-center rounded-full transition-colors hover:bg-ink/5"
            aria-label={`Open your order, ${count} ${count === 1 ? "item" : "items"}`}
          >
            <ShoppingBag className="h-[22px] w-[22px]" strokeWidth={2} aria-hidden="true" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 22 }}
                  className="absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-orange px-1 font-mono text-[0.7rem] font-medium text-ink"
                  aria-hidden="true"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <Link href="/#menu" className="btn btn-primary !min-h-11 max-sm:!hidden">
            Order Now
          </Link>
          <button
            ref={menuButton}
            type="button"
            className="grid h-12 w-12 place-items-center rounded-full transition-colors hover:bg-ink/5 lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mx-2 mt-2 overflow-hidden rounded-[28px] bg-rind p-3 text-cream shadow-2xl on-rind lg:hidden"
          >
            <ul className="flex flex-col">
              {nav.map((item, i) => (
                <motion.li key={item.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.05 }}>
                  <a
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex min-h-14 items-center rounded-2xl px-4 font-display text-2xl font-bold transition-colors hover:bg-rind-soft"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <Link href="/#menu" onClick={() => setMenuOpen(false)} className="btn btn-primary mt-3 w-full">
              Order Now
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
