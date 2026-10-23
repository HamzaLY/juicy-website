"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { categories, products, type CategoryId } from "@/content/products";
import { ProductCard } from "./ProductCard";

type Filter = "all" | CategoryId;

const FILTER_EVENT = "juicy:filter";

/** Jump to the menu with one category selected (used by in-page buttons). */
export function showCategory(id: CategoryId) {
  window.dispatchEvent(new CustomEvent<CategoryId>(FILTER_EVENT, { detail: id }));
  document.getElementById("menu")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

function matches(query: string, haystack: string[]) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return q.split(/\s+/).every((word) => haystack.some((h) => h.toLowerCase().includes(word)));
}

export function MenuExplorer() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  // Deep links such as /?category=smoothies#menu (used by the footer).
  useEffect(() => {
    const read = () => {
      const c = new URLSearchParams(window.location.search).get("category");
      if (c && categories.some((x) => x.id === c)) setFilter(c as CategoryId);
    };
    const onEvent = (e: Event) => {
      setFilter((e as CustomEvent<CategoryId>).detail);
      setQuery("");
    };
    read();
    window.addEventListener("popstate", read);
    window.addEventListener(FILTER_EVENT, onEvent);
    return () => {
      window.removeEventListener("popstate", read);
      window.removeEventListener(FILTER_EVENT, onEvent);
    };
  }, []);

  const results = useMemo(
    () =>
      products.filter(
        (p) => (filter === "all" || p.category === filter) && matches(deferredQuery, [p.name, p.tagline, p.description, ...p.ingredients, categories.find((c) => c.id === p.category)?.label ?? ""]),
      ),
    [filter, deferredQuery],
  );

  const active = categories.find((c) => c.id === filter);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter by category" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          {(["all", ...categories.map((c) => c.id)] as Filter[]).map((id) => {
            const label = id === "all" ? "All drinks" : categories.find((c) => c.id === id)!.label;
            const on = filter === id;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(id)}
                className={`relative min-h-11 shrink-0 rounded-full px-4 text-[0.95rem] font-medium transition-colors ${on ? "text-pulp" : "text-ink hover:bg-ink/5"}`}
              >
                {on && <motion.span layoutId="menu-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span className="relative">{label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:w-[320px]">
          <label htmlFor="menu-search" className="sr-only">
            Search drinks
          </label>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
          <input
            id="menu-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search mango, mint, ginger…"
            autoComplete="off"
            className="h-12 w-full rounded-full border-2 border-pulp-line bg-pulp pl-12 pr-12 text-base placeholder:text-ink-soft/80 focus:border-ink focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="absolute right-1.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full hover:bg-ink/5" aria-label="Clear search">
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <p className="mt-5 text-ink-soft" aria-live="polite">
        {active ? <span className="font-medium text-ink">{active.blurb} </span> : null}
        {results.length} {results.length === 1 ? "drink" : "drinks"}
        {deferredQuery.trim() ? ` matching "${deferredQuery.trim()}"` : ""}
      </p>

      {results.length > 0 ? (
        <motion.ul layout className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {results.map((p) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductCard product={p} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <div className="mt-8 rounded-[28px] border-2 border-dashed border-pulp-line px-6 py-14 text-center">
          <p className="font-display text-2xl font-bold">Nothing on the menu matches that.</p>
          <p className="mt-2 text-ink-soft">Try a fruit, like mango or lime, or clear the filters.</p>
          <button
            type="button"
            className="btn btn-ghost mt-5"
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
          >
            Show all drinks
          </button>
        </div>
      )}
    </div>
  );
}
