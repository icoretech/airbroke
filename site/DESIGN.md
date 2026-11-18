# Airbroke Site Design System

The website at airbroke.icorete.ch, not the app (the app's system is the
repository's root `DESIGN.md`).

## 1. Atmosphere and identity

A roll of numbered paper tickets lying on a dark counter. Every section is a
ticket of its own card stock, with a perforated stub that carries what the
ticket is about and a tear line of punched holes to the next. Errors in the
product are tickets too: a repeat punches the same ticket and moves its
counter. Print is flat: two inks per stock, no gradients, glass or glow.

## 2. Color

| Role          | Token           | Value     | Use                                                              |
| ------------- | --------------- | --------- | ---------------------------------------------------------------- |
| Counter       | `--ground`      | `#120e19` | Page ground, nav, footer, punched holes                          |
| Coral stock   | `--stock-coral` | `#ff8a6c` | Hero, Replay, closing ticket; the product colour                 |
| White stock   | `--stock-white` | `#ffffff` | How it works, Self-host, mini tickets                            |
| Lilac stock   | `--stock-lilac` | `#e2dcff` | Agents, FAQ                                                      |
| Ink stock     | `--stock-ink`   | `#282038` | The UI gallery                                                   |
| Ink           | `--ink`         | `#1c1222` | Text and fills on light stocks                                   |
| Secondary ink | `--ink-2`       | per stock | `#4b4054` white, `#4a1d1f` coral, `#3f3557` lilac, `#c3b9d2` ink |
| Coral ink     | `--coral-ink`   | `#b02a3d` | Links and labels on white                                        |
| Stamp violet  | `--violet`      | `#7563eb` | The mark, selection, focus, the punch stamp                      |
| Violet ink    | `--violet-ink`  | `#4732c9` | Violet text on white and lilac; `#34199c` on coral               |

Rules: colour commits by region (a whole ticket is one stock); secondary text
is tinted from its stock, never grey; every text, decorative included, meets
4.5:1 (3:1 large).

## 3. Typography

- Archivo variable (`wdth` axis) through `next/font`. Headlines 800 at
  `font-stretch: 112%`, tracking -0.03em; ticket labels 800 at 125%, caps,
  tracking 0.1 to 0.16em; serials and counters 800 at 125% with tabular
  figures; body 400 at 100%, 18px.
- Geist Mono only for code, routes, endpoints and identifiers.
- Scale: h1 `clamp(2.65rem, 6.6vw, 5.9rem)`, h2 `clamp(2.05rem, 4.3vw, 3.75rem)`,
  lede `clamp(1.08rem, 1.45vw, 1.28rem)`.
- No eyebrows above headings; labels live on the stub.

## 4. Layout

- The roll is `min(1360px, 100% - 2 * clamp(0px, 2.4vw, 36px))` wide, centered
  on the counter; tickets are a `112px` stub plus body, padded
  `clamp(56px, 7.5vw, 104px)` by `clamp(20px, 5vw, 72px)`.
- Below 760px the stub turns into a strip across the top of each ticket and
  drops its label; columns stack below 1080px.
- Ruled lists (route, specs, tools, timetable, FAQ) open with a 2px ink rule
  and separate rows with dashed hairlines.

## 5. Components

- **Ticket and Seam** (`components/Ticket.tsx`): section shell with stub, and
  the tear line whose top half is the upper stock and bottom half the next.
- **Buttons**: rectangles with a punched notch at each end in the colour they
  sit on. Ink (primary on light stocks), white (secondary), coral (nav).
- **Mini ticket** (punch demo): white ticket with a dotted tear before a
  counter stub; the counter turns violet and a "+1" stamp lands when punched.
- **Code card**: dark `#191320` card with a title bar and copy button;
  highlighted at build time; long lines scroll inside the card.
- **Tabs**: pills, ink when selected on light stocks, coral on the ink stock;
  arrow keys, Home and End move between them.
- **Shot frame**: real UI capture in a dark frame with a 1px light ring.

## 6. Motion

One authored moment: the hero's punch demo (a report travels a dashed wire,
the ticket's counter moves, a violet stamp fades). It runs only on screen,
pauses with the tab hidden, and never runs under reduced motion. Otherwise
only hover lifts and a short fade when a gallery tab changes, both gated on
`prefers-reduced-motion: no-preference`.

## 7. Assets

- Mark and wordmark from the app's `public/logo-full.svg` (`components/Logo.tsx`).
- UI captures in `public/screens/` from a local stack with synthetic data.
- Social card rendered at build by `app/og.png/route.tsx`.
