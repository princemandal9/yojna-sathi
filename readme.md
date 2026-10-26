YOJNA-SATHI

Information Disorganization: Centralizing unstructured government portal data into clear, predictable fields (deadlines, typical open windows, documents needed, online/offline availability).

The Form-Filling Blindspot Loophole: Preventing mid-application roadblocks by displaying a complete prerequisite document checklist upfront before users start filling out forms, alongside integrated utilities (like PDF/image compression tools) so students never have to scramble halfway through.

# YojnaSathi

> Know every document you need **before** you start applying.

YojnaSathi is a scholarship aggregator prototype for West Bengal (India) students. It solves the **multi-page application blind spot**: government scholarship portals often reveal required documents only midway through a multi-page form, forcing students to abandon the form and hunt for papers. ScholarSync shows the full document list *upfront*, audits readiness, helps with missing documents, and compresses files to portal size limits, all before the student opens the official portal.

**Status:** front-end prototype / demo. No backend, no real data feed, no real AI model. All scheme data is hardcoded placeholder content.

---

## Table of Contents

1. [Core Features](#core-features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Running Locally](#running-locally)
5. [Architecture & Code Walkthrough](#architecture--code-walkthrough)
6. [Data Model](#data-model)
7. [Adding or Editing Content](#adding-or-editing-content)
8. [Known Limitations](#known-limitations)
9. [Roadmap](#roadmap)
10. [Guidelines for AI Agents & Contributors](#guidelines-for-ai-agents--contributors)
11. [Disclaimer](#disclaimer)

---

## Core Features

| Feature | Description |
|---|---|
| **Scheme home page** | Grid of 4 West Bengal government schemes (SVMCM, Kanyashree, Aikyashree, OASIS). Each card shows logo icon, name, department, status badge, typical application window, eligibility summary, and mode (online/offline/both). |
| **Status badges** | `Applications Open` (green), `Closing Soon` (amber), `Opens Soon` (blue). |
| **Scheme detail view** | Clicking a card opens an overview grid (window, deadline, eligibility, mode) plus the document checklist. |
| **Pre-Flight Document Checklist** | All required documents listed upfront, split into **Mandatory** and **Optional / situational**. Students tick what they already have. |
| **Readiness Audit** | Progress bar + percentage based on *mandatory* documents ticked. Color changes: amber (<50%), blue (50-99%), green (100%). |
| **Sync Assistant (AI chatbot, mocked)** | Student says "I don't have a birth certificate" (or taps "Don't have it?" on a row) and the assistant suggests alternatives (e.g. Aadhaar / Madhyamik admit card). For documents with no safe substitute, it shows the scheme **helpline number** as a tap-to-call link. Currently a keyword lookup, not an LLM. |
| **Helpline card** | Per-scheme tap-to-call (`tel:`) helpline. Currently a placeholder number. |
| **Built-in image compressor** | Client-side JPG/PNG compression with a quality slider and before/after size. Uses Canvas, nothing is uploaded. |
| **PDF compression** | Disabled "coming soon" button (needs server or a WASM/JS PDF library). |
| **Primary CTA** | "Verify Documents & Start Application" checks mandatory items. If any are missing it lists them; if all ticked it shows a demo success message (no real redirect yet). |
| **Accessibility** | Skip link, visible focus ring, labelled inputs, `aria-live` chat region, `role="progressbar"` with `aria-valuenow`. |

## Tech Stack

- **HTML5**, **vanilla JavaScript (ES6)**, no framework, no build step, no bundler, no package manager.
- **Tailwind CSS 3.4.17** via Play CDN (`https://cdn.tailwindcss.com/3.4.17`).
- **Lucide icons 0.383.0** via jsDelivr UMD build.
- **Custom CSS** in `style.css` (font stack, fade animation, focus ring).
- Requires an internet connection at runtime for the two CDN scripts.

## Project Structure

```
scholarsync/
├── index.html    # Markup only: header, home view, detail view, footer
├── style.css     # Small custom CSS (font, .fade animation, :focus-visible)
├── script.js     # All data + logic: schemes, kb, rendering, audit, chatbot, compressor
└── README.md
```

Load order: `index.html` loads Tailwind and Lucide in `<head>`, `style.css` via `<link>`, and `script.js` at the end of `<body>` (so the DOM exists when the script runs).

## Running Locally

No installation needed.

**Option A:** double-click `index.html`.

**Option B (recommended):** VS Code + **Live Server** extension, right-click `index.html` then *Open with Live Server*.

**Option C (any machine with Python):**
```bash
python -m http.server 5500
# open http://localhost:5500
```

## Architecture & Code Walkthrough

This is a **single-page app with two views toggled by the `hidden` class**: `#home` and `#detail`. There is no router and no URL state.

### Important implementation quirk
`script.js` references DOM elements **directly by their `id` as global variables** (e.g. `home`, `detail`, `chat`, `pFill`, `dName`). This works because browsers expose elements with an `id` as `window[id]`. **Do not rename IDs in `index.html` without updating `script.js`.** If refactoring, replace with `document.getElementById(...)` or a cached `$` helper.

### Key element IDs
| ID | Purpose |
|---|---|
| `home`, `detail` | The two views |
| `schemeGrid` | Container for scheme cards |
| `dLogo`, `dName`, `dDept`, `dStatus`, `dWindow`, `dDeadline`, `dElig`, `dMode`, `dHelp` | Detail overview fields |
| `mList`, `oList` | Mandatory / optional checklist `<ul>`s |
| `pFill`, `pText`, `pBar`, `pMsg` | Readiness progress fill, %, progressbar element, message |
| `startMsg` | Result message of the CTA |
| `aiBox`, `chat`, `chips`, `chatIn` | Assistant panel, message log, quick-chips, text input |
| `imgIn`, `q`, `qVal`, `cOut` | Compressor file input, quality slider, quality label, output area |

### Functions in `script.js`
| Function | What it does |
|---|---|
| `showHome()` | Shows `#home`, hides `#detail`, scrolls to top. |
| `renderHome()` | Builds scheme cards from the `schemes` array into `#schemeGrid` and calls `lucide.createIcons()`. |
| `openScheme(id)` | Sets `cur` to the chosen scheme, resets `checked`, fills overview fields, renders mandatory/optional checklists, resets audit and chat. |
| `tick(i, v)` | Records checkbox state in `checked[i]`, restyles the row, calls `updateAudit()`. |
| `updateAudit()` | Computes % of **mandatory** docs ticked; updates bar width/color, text, `aria-valuenow`, and message. |
| `startApp()` | CTA handler. Lists missing mandatory docs, or shows demo success. **Real redirect to the official portal not yet implemented.** |
| `bot(html)` / `me(text)` | Append an assistant / user bubble to `#chat`. `me()` uses `textContent` (XSS-safe); `bot()` takes trusted HTML from `kb`. |
| `resetChat()` | Clears chat, adds greeting and quick chips. |
| `askAbout(doc)` | Called by "Don't have it?" buttons and chips. Posts a user message and calls `reply()`. |
| `sendChat(e)` | Form submit handler for free-text input. |
| `reply(text)` | Lowercases text, finds the first `kb` entry whose keyword is a substring, answers after 400 ms. Falls back to "call the helpline". |
| `openAI()` | Scrolls to and focuses the assistant. |
| `compress(file)` | Draws image to a canvas (max 1200 px on longest side), exports JPEG at `q.value/100`, shows size savings and a download link. |

### State
Global variables only: `cur` (selected scheme object) and `checked` (map of doc index to boolean). Reset every time a scheme is opened. **Nothing is persisted** (no localStorage).

## Data Model

### `schemes[]` entry
```js
{
  id: "svmcm",                       // unique slug, used in onclick
  name: "Swami Vivekananda Merit-cum-Means (SVMCM)",
  short: "SVMCM",
  dept: "Dept. of Higher Education, Govt. of West Bengal",
  icon: "award",                     // any Lucide icon name
  color: "bg-blue-600",              // Tailwind bg class for the logo tile
  status: "open",                    // "open" | "closing" | "soon"  (maps to statusUI)
  window: "Typically Aug – Nov (yearly)",
  deadline: "Check portal – usually early Nov",
  elig: "West Bengal resident student, merit + family income limit",
  mode: "Online",                    // free text: Online / Offline / Online + Offline
  helpline: HELP,                    // string, e.g. "1800-000-0000" (placeholder)
  docs: [ ["Aadhaar card", "m"], ["Birth certificate", "o"] ]
         // [label, type]  type: "m" = mandatory, "o" = optional
}
```

### `kb[]` entry (assistant knowledge base)
```js
{
  k: ["birth"],                      // lowercase keywords, matched with String.includes
  t: "Birth certificate",            // title shown in reply
  a: "You can usually use your <b>Aadhaar card</b> ...", // HTML answer (trusted)
  call: false                        // true => append helpline "call to confirm" box
}
```

### `statusUI`
Maps status key to `[label, tailwindClasses]`.

## Adding or Editing Content

**Add a scheme:** append an object to `schemes` in `script.js` following the model above. The card and detail page render automatically. Use Lucide icon names from https://lucide.dev/icons.

**Add a document alternative:** add an entry to `kb`. Put more specific keywords first, since `reply()` uses the first match (`Array.find`).

**Set real helpline:** change the `HELP` constant at the top of `script.js`, or give each scheme its own `helpline` string. Get numbers only from the official department websites.

**Change colors:** edit the Tailwind classes in `index.html` / `script.js` (blue = primary, emerald = success, amber = warning, rose = mandatory label).

## Known Limitations

- All scheme data (dates, docs, eligibility, helpline) is **illustrative placeholder content** and must be verified against official sources before any real use.
- The "AI assistant" is a **keyword matcher**, not an LLM. It cannot handle typos, Bengali/Hindi, or unseen documents (those fall back to the helpline message).
- No language toggle logic (the "EN | বাং" pill is visual only).
- "Sign in" button is non-functional.
- No persistence: refreshing loses ticked documents.
- No URL routing: the browser back button leaves the page rather than returning to the scheme list.
- Compressor handles **images only**; the PDF button is disabled. Image output is always JPEG (transparency lost).
- Requires internet for CDN assets. Tailwind Play CDN is not recommended for production.
- Chat/dynamic HTML uses `innerHTML` with developer-controlled content; if user-generated or API-fed content is added later, **sanitize it**.

## Roadmap

1. Real backend + database for schemes (admin panel to update dates/docs).
2. Replace keyword matcher with an LLM (e.g. Claude API) grounded on a verified document-substitution knowledge base, with a safe fallback to the helpline.
3. Bengali / Hindi localization (i18n) and make the language toggle functional.
4. Save checklist progress (localStorage, then user accounts).
5. PDF compression (pdf-lib / WASM Ghostscript, or server-side).
6. Per-portal size/format presets (e.g. "photo 50 KB, 200x230 px, JPG") for the compressor.
7. Eligibility quiz and scheme recommendation.
8. Deadline reminders (SMS / WhatsApp / email).
9. Hash-based routing (`#/scheme/svmcm`) so links are shareable and the back button works.
10. Move to a proper Tailwind build (Vite + Tailwind) for production.
11. Real "Start Application" deep link to the official portal.

## Guidelines for AI Agents & Contributors

If you are an AI coding agent (Cursor, Antigravity, Claude Code, Copilot, etc.), follow these rules:

1. **Keep it dependency-free** unless asked: plain HTML/CSS/JS, Tailwind and Lucide via CDN. Do not introduce a bundler or framework without explicit instruction.
2. **Keep the three-file split.** Markup in `index.html`, styling extras in `style.css`, data and logic in `script.js`.
3. **Do not rename element IDs** without updating every reference in `script.js` (they are used as implicit globals).
4. **After inserting HTML that contains `<i data-lucide="...">`, call `lucide.createIcons()`**, otherwise icons will not render.
5. **Tailwind classes built dynamically** (e.g. from `schemes[].color`) work with the Play CDN but would be purged in a production build. If you migrate to a build step, add them to the `safelist`.
6. **Never hardcode unverified government data as fact.** Keep the "typical / check portal" wording and the disclaimers. Mark any new placeholder clearly.
7. **Preserve accessibility**: labels for inputs, focus styles, `aria-*` attributes, color contrast, keyboard operability.
8. **Never insert user input with `innerHTML`.** Use `textContent` (as `me()` does).
9. **Mobile first**: test at ~360 px width. The layout uses `sm:` / `lg:` Tailwind breakpoints.
10. **Do not claim ScholarSync is an official government site.** Keep the footer disclaimer.
11. Keep commits small and descriptive (e.g. `feat: add Taruner Swapno scheme`, `fix: audit % when no mandatory docs`).

### Suggested first tasks for an agent
- Add hash routing for scheme pages.
- Persist `checked` per scheme in `localStorage`.
- Add a PDF compressor using `pdf-lib`.
- Wire the assistant to an LLM API through a small backend proxy (never expose API keys in front-end code).

## Disclaimer

ScholarSync is an independent aggregator and **not** a government website. Dates, eligibility, documents and helpline numbers shown are illustrative. Always verify on the official scholarship portal or with the relevant department before applying. Document alternatives suggested by the assistant are suggestions only; final acceptance rests with the department.

## License

Choose a license before publishing publicly (e.g. MIT). Add a `LICENSE` file at the repo root.