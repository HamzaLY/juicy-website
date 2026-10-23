# JUICY: design package

The build's single source of creative decisions. Copy written here ships verbatim (the content files in `content/` hold the live copy).

## 1. Brand premise

**The fill line.** Customers' most common complaints about juice bars are drinks that are too sweet, watered down, or not filled to the top for the price. JUICY's whole idea is the line on the cup: every drink is pressed or blended to order, the customer sets the sweetness and ice, and it is poured to the line. The visual system follows the same idea: every drink is its own color, and a liquid "fill line" runs through the site as the signature element.

Research sources (themes, not quotes): HappyCow, Wanderlog and juice-chain review pages, October 2026. Recurring phrases: "way too sweet", "watered down", "too much ice", "not filled to the top", "overpriced for the size", "freshest I've tasted".

## 2. Palette (CSS tokens in `app/globals.css`)

| Token | Value | Role |
|---|---|---|
| `--pulp` | `#FFF5EA` | Canvas, warm peach off-white (never pure white) |
| `--pulp-deep` | `#FBE7D3` | Raised panels |
| `--rind` | `#0F2A1F` | Deep green contrast sections |
| `--rind-soft` | `#1C3D2F` | Panels on rind |
| `--ink` | `#1E140E` | Primary text |
| `--ink-soft` | `#5C4A3E` | Secondary text (5.9:1 on pulp) |
| `--orange` | `#FF7A1A` | Accent: the call to action, focus rings, rare emphasis |
| Drink colors | per product | Each drink tints its own card, dialog and film segment |

Fruit colors (orange, mango, watermelon, strawberry, lime, turquoise) appear through the drinks themselves, not as decoration on every section.

Deliberate departures from the 10K "AI-cliché" list: the cream canvas is tinted peach and paired with a grotesk (no serif, no terracotta); the dark sections are deep green with orange and mango, never acid green.

## 3. Type

- Display: **Bricolage Grotesque** (variable, opsz + wdth), weights 600 to 800. Chunky optical sizes read as juicy without being childish.
- Body: **Instrument Sans**, 400 and 600.
- Labels and prices: **DM Mono**, 400 and 500.

## 4. Hero band map (scroll-scrubbed, tier 1, about 400vh)

| Band | Range | Footage | Copy | Entrance |
|---|---|---|---|---|
| 1 | 0.00 to 0.30 | Iced glass waits in morning light | Kicker "Fresh-pressed drinks, made to order" / H1 "A little more juice." | Words rise (load ramp) |
| 2 | 0.34 to 0.62 | Juice pours, glass fills | "Pressed when you order. Poured while it's cold." | Drift-down, echoes the pour |
| 3 | 0.68 to 1.00 | Full glass at rest | H1 "A lot more joy." + sub + two CTAs | Word rise into staged settle |

Static hero (phones, reduced motion, no video): "A little more juice. A lot more joy." with the full-glass still.

## 5. Page outline (one call to action: order a drink)

1. Hero
2. Promise ribbon: the four promises (one living element, a slow marquee)
3. The signatures: six featured drinks, varied card sizes
4. The full menu: category filters, search, product dialog with customizer
5. Our story: editorial layout, the fill line drawn on scroll
6. Fresh and full: ingredients wall plus the interactive moment (press and hold to squeeze and fill a glass)
7. Seasonal special and the Color Flight bundle (deep rind section)
8. The film: Remotion brand film with play/pause
9. Sample reviews, labeled as samples
10. Visit and contact (sample details)
11. Footer, with the fictional-brand disclosure

## 6. Vector layer

- The fill line: an SVG meniscus wave between sections, colored by the next section.
- The illustrated glass: an SVG fallback for any drink without a photo, tinted by the drink color.
- Whisper-level bubbles rising behind the hero, paused off-screen and when reduced motion is on.

## 7. Copy gate

Before anyone sees the page: zero em dashes, zero stock words (leverage, seamless, empower, unlock, robust, actionable, data-driven, solutions), and a body-copy sweep for AI tells. No health, organic, sourcing or nutrition claims.
