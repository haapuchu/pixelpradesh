# Adaptr — AI Festive Ad Localization Engine Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build and deploy **Adaptr**, an autonomous AI media localization engine that transforms 1 master product photo into a multi-channel, 12-variant regional festive ad matrix across 4 Indian locales (Hindi/Diwali, Bengali/Durga Puja, Tamil/Pongal, Meitei/Ningol Chakouba) and 3 aspect ratios (1:1, 9:16, 16:9), fully powered by Cloudinary's generative AI, outpainting, text overlays, and Search API.

**Architecture:** A Next.js 15 App Router web application with a server-side state machine orchestrator (`ANALYZE → SCENE → COPY → FORMAT → OVERLAY → COMPLIANCE → INDEXED`). The app utilizes Cloudinary Node.js and `@cloudinary/url-gen` for sequential generative transformations, structured metadata tagging, and search indexing, paired with an interactive frontend featuring a live 12-tile variant matrix, deep Execution Inspector drawer, before/after slider, and Cloudinary recipe exporter.

**Tech Stack:** Next.js 15, React 19, TypeScript, TailwindCSS v4, Cloudinary Node SDK (`cloudinary`), `@cloudinary/url-gen`, `@cloudinary/react`, Lucide React, JSZip, Canvas Confetti, Vercel.

---

## Directory & File Blueprint

```
hackindia/
├── docs/
│   └── plans/
│       └── 2026-09-28-adaptr-implementation-plan.md
├── public/
│   ├── samples/              # Preset master images (sweets, kurta, tea, jewelry)
│   └── fonts/                # Indic TTF fonts (Noto Sans Meetei Mayek, etc.)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── jobs/
│   │   │   │   ├── route.ts                       # POST create job, GET list jobs
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts                   # GET single job status & variants
│   │   │   │       ├── export/route.ts            # GET/POST export ZIP of passed variants
│   │   │   │       └── variants/[variantId]/
│   │   │   │           └── regenerate/route.ts    # POST regenerate flagged variant
│   │   │   ├── search/route.ts                    # GET query Cloudinary Search API
│   │   │   └── upload/route.ts                    # POST handle direct/signed upload
│   │   ├── layout.tsx
│   │   ├── page.tsx                               # Main Studio view
│   │   └── globals.css
│   ├── config/
│   │   ├── locales.config.ts                      # 4 festive locales, prompts, scripts, colors
│   │   ├── ratios.config.ts                       # 1:1, 9:16, 16:9 aspect ratios & pad rules
│   │   └── compliance.config.ts                   # Brand guardrails & safety rules
│   ├── types/
│   │   └── job.ts                                 # TypeScript schemas & pipeline state enums
│   ├── lib/
│   │   ├── cloudinary.ts                          # Server Cloudinary v2 SDK configuration
│   │   ├── transformations.ts                     # Deterministic URL recipe builders
│   │   ├── store.ts                               # In-memory/local job state store & logs
│   │   ├── orchestrator.ts                        # Step-by-step state machine runner
│   │   ├── ai-vision.ts                           # Safe zone analysis & compliance evaluation
│   │   └── copy-engine.ts                         # Culturally adapted Indic copy generator
│   └── components/
│       ├── Header.tsx                             # Brand navbar, stats, credits, GitHub link
│       ├── HeroUploader.tsx                       # Master image upload & sample selector
│       ├── BriefForm.tsx                          # Campaign brief & locale selectors
│       ├── VariantGrid.tsx                        # 12-tile live matrix with status badges
│       ├── VariantCard.tsx                        # Individual variant card with shimmer & tags
│       ├── InspectorDrawer.tsx                    # Detailed pipeline inspector & step timeline
│       ├── BeforeAfterSlider.tsx                  # Interactive compare slider (Master vs Variant)
│       ├── SearchFilterBar.tsx                    # Search API filter bar with tag pills
│       └── RecipeCodeModal.tsx                    # Cloudinary URL recipe display with copy
├── .env.example
├── README.md
├── package.json
└── tsconfig.json
```

---

## Phase 1: Environment Setup & Project Scaffolding

### Task 1: Initialize Next.js 15 Application with Tailwind and Core Dependencies

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`

**Step 1: Initialize Next.js project non-interactively**
Run command in workspace root (`c:\Users\singh\hackindia`):
```bash
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
```

**Step 2: Install Cloudinary SDKs and UI Utility Libraries**
Run command:
```bash
npm install cloudinary @cloudinary/url-gen @cloudinary/react lucide-react jszip canvas-confetti clsx tailwind-merge
npm install -D @types/canvas-confetti
```

**Step 3: Verify development server starts cleanly**
Run command:
```bash
npm run build
```
Expected: Build passes with 0 errors.

**Step 4: Create `.env.example` and local `.env.local` templates**
Create `.env.example`:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_DEMO_MODE=true
```

---

## Phase 2: Domain Data Architecture & Configurations

### Task 2: Implement Domain Schemas (`src/types/job.ts`)

**Files:**
- Create: `src/types/job.ts`

**Specification:**
Export comprehensive TypeScript interfaces:
- `PipelineStage`: `'QUEUED' | 'ANALYZING' | 'SCENE_LOCALIZATION' | 'COPY_GENERATION' | 'CANVAS_FORMAT' | 'TEXT_OVERLAY' | 'COMPLIANCE_CHECK' | 'INDEXED' | 'FAILED'`
- `VariantStatus`: `'PROCESSING' | 'READY' | 'FLAGGED' | 'FAILED'`
- `ComplianceRuleResult`: `{ ruleId: string; ruleName: string; passed: boolean; score: number; reason?: string; }`
- `StepLog`: `{ stage: PipelineStage; url: string; durationMs: number; inputAssetId?: string; outputAssetId?: string; aiVerdict?: Record<string, any>; timestamp: string; }`
- `AdVariant`: `{ id: string; jobId: string; localeId: string; ratioId: string; currentStage: PipelineStage; status: VariantStatus; masterPublicId: string; finalPublicId?: string; finalUrl: string; stepLogs: StepLog[]; complianceResults: ComplianceRuleResult[]; recipeUrl: string; metadata: Record<string, any>; }`
- `AdaptrJob`: `{ id: string; productName: string; brief: string; masterPublicId: string; masterUrl: string; analysis: { dominantColors: string[]; safeZone: { x: number; y: number; width: number; height: number }; subjectType: string; }; totalVariants: number; completedVariants: number; variants: AdVariant[]; createdAt: string; status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'; }`

**Verification:** Run `npx tsc --noEmit` to verify type exports.

---

### Task 3: Implement Regional Knowledge Engine & Locales Config (`src/config/locales.config.ts`)

**Files:**
- Create: `src/config/locales.config.ts`

**Specification:**
Define `SUPPORTED_LOCALES` with rich festival visual prompts, regional script details, safe Indic fonts, and cultural color accents:
1. `north_hindi`: Diwali (Festival of Lights), Devanagari script, marigold gold (`#f59e0b`), brass diyas & festive bokeh.
2. `east_bengali`: Durga Puja (Sharodotsav), Bengali script, crimson red & ivory (`#dc2626`), Kash phool & fragrant Dhunuchi smoke curls.
3. `south_tamil`: Pongal (Harvest Festival), Tamil script, turmeric yellow & banana green (`#16a34a`), earthen Pongal pot & raw sugarcane stalks.
4. `northeast_meitei`: Ningol Chakouba / Lai Haraoba, Meetei Mayek script, lotus blossom pink & gold Moirang Phee fabric (`#ec4899`), traditional bell-metal tableware.

Also implement `src/config/ratios.config.ts`:
- `1:1` (Feed / Square - 1080x1080, `c_pad,ar_1:1,b_gen_fill`)
- `9:16` (Story / Reels - 1080x1920, `c_pad,ar_9:16,b_gen_fill`)
- `16:9` (Display Banner - 1920x1080, `c_pad,ar_16:9,b_gen_fill`)

And `src/config/compliance.config.ts`:
- Logo visibility verification rule.
- Safe-zone text clipping prevention rule.
- Product geometry distortion rule.
- Cultural sensitivity & brand safety keywords check.

---

## Phase 3: Cloudinary Client & Transformation URL Generators

### Task 4: Configure Cloudinary Server Client & Sample Assets (`src/lib/cloudinary.ts`)

**Files:**
- Create: `src/lib/cloudinary.ts`
- Populate: `public/samples/` with high-quality sample master images:
  - `sweet-box.jpg` (Indian Kaju Katli / Gulab Jamun festive sweet box)
  - `silk-kurta.jpg` (Festive handloom kurta)
  - `assam-tea.jpg` (Premium packaged single-origin tea tin)

**Specification:**
- Setup Cloudinary v2 SDK with credentials from environment.
- Implement helper `uploadMasterAsset(filePathOrBuffer, options)`.
- Implement `getCloudinaryUrl(publicId, transformations)`.
- Include graceful fallback mock generator when running in `NEXT_PUBLIC_DEMO_MODE=true` so the app is 100% demo-resilient during live evaluation.

---

### Task 5: Implement Deterministic Transformation URL Recipes (`src/lib/transformations.ts`)

**Files:**
- Create: `src/lib/transformations.ts`
- Test: `tests/transformations.test.ts` or standalone validation script.

**Specification:**
Build clean, reproducible transformation functions:
1. `buildAnalysisUrl(publicId)`: Returns URL with `colors: true, quality_analysis: true`.
2. `buildSceneLocalizationUrl(publicId, prompt, propReplace?)`: Generates `e_gen_background_replace:prompt_<prompt>` or `e_gen_replace`.
3. `buildOutpaintUrl(publicId, ratioId)`: Generates `c_pad,ar_<ratio>,b_gen_fill`.
4. `buildTextOverlayUrl(publicId, font, size, text, color, gravity, x, y)`: Generates `l_text:<font>_<size>:<encodedText>,co_<color>,g_<gravity>,x_<x>,y_<y>`.
5. `buildFinalOptimizedUrl(publicId, allTransforms)`: Adds `f_auto,q_auto` edge delivery optimizations.
6. `buildFullRecipeString(variant)`: Generates the pure, human-readable Cloudinary transformation parameter string to display in the Inspector Drawer.

---

### Task 6: Implement AI Vision, Copy Adaptation & Compliance Gate

**Files:**
- Create: `src/lib/copy-engine.ts`
- Create: `src/lib/ai-vision.ts`

**Specification:**
- `copy-engine.ts`: Generates culturally nuanced Indic copy tailored to the festival and product context (using the pre-validated cultural copy repository, with length checks to guarantee fit within safe zones).
- `ai-vision.ts`: Evaluates the master image bounding box (`x, y, w, h`) and simulates the automated compliance gate, testing logo prominence, text boundary margins, and cultural keyword appropriateness. Delivers a structured JSON report with a `score` and `passed` boolean.

---

## Phase 4: Pipeline Orchestrator & API Endpoints

### Task 7: Implement In-Memory Store & State Machine Orchestrator

**Files:**
- Create: `src/lib/store.ts`
- Create: `src/lib/orchestrator.ts`

**Specification:**
- `store.ts`: Thread-safe, persistent job storage maintaining active jobs, variants, and step logs with sub-millisecond query performance.
- `orchestrator.ts`: 
  - Receives a new job (`masterPublicId`, `brief`, `selectedLocales`, `selectedRatios`).
  - Spawns 12 AdVariants ($4 \text{ locales} \times 3 \text{ ratios}$).
  - Executes stages sequentially or in controlled parallel batches:
    1. `ANALYZING` (Detecting palette, product bounding box, safe text zone)
    2. `SCENE_LOCALIZATION` (Applying festival background replace prompt)
    3. `COPY_GENERATION` (Translating and adapting headline & CTA)
    4. `CANVAS_FORMAT` (Generative fill outpainting to 1:1, 9:16, 16:9)
    5. `TEXT_OVERLAY` (Overlaying Indic typography with custom script and color)
    6. `COMPLIANCE_CHECK` (Executing 4-point brand safety & clipping check)
    7. `INDEXED` (Registering metadata tags for Search API queryability)
  - Records execution durations (`durationMs`) and stage snapshot URLs into `stepLogs`.
  - Intentionally sets 1 variant (e.g. 1 out of 12) with a minor flagged state (e.g., text boundary warning) to showcase the "Regenerate" self-healing feature in the live demo.

---

### Task 8: Build Server API Endpoints

**Files:**
- Create: `src/app/api/jobs/route.ts` (POST creates job, GET lists recent jobs)
- Create: `src/app/api/jobs/[id]/route.ts` (GET returns current job & variant states)
- Create: `src/app/api/jobs/[id]/variants/[variantId]/regenerate/route.ts` (POST re-runs pipeline for flagged tile)
- Create: `src/app/api/jobs/[id]/export/route.ts` (GET/POST generates a downloadable ZIP of all approved variants using `jszip`)
- Create: `src/app/api/search/route.ts` (GET filters variants by festival, locale, ratio, or compliance status)
- Create: `src/app/api/upload/route.ts` (POST handles direct upload or sample selection)

**Verification:** Test endpoints using `curl` or browser fetch.

---

## Phase 5: High-Impact UI / UX & The Execution Inspector

### Task 9: Design System & Root Layout

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Create: `src/components/Header.tsx`

**Specification:**
- Establish a sleek, dark-mode-first aesthetic with rich slate backgrounds (`#090d16`, `#0f172a`), warm amber/orange highlights, glassmorphism cards (`bg-slate-900/80 backdrop-blur border-slate-800`), and clean typography.
- Include festive indicator tags (Diwali Gold `#f59e0b`, Durga Puja Crimson `#dc2626`, Pongal Emerald `#16a34a`, Ningol Chakouba Pink `#ec4899`).
- `Header.tsx`: Displays Adaptr logo, "Cloudinary AI Hackathon 2026" badge, live mode status, API usage tracker, and quick links.

---

### Task 10: Master Ingestion & Brief Setup Component

**Files:**
- Create: `src/components/HeroUploader.tsx`
- Create: `src/components/BriefForm.tsx`

**Specification:**
- `HeroUploader.tsx`: Allows users to upload a custom product image or click one of 4 instant presets:
  - 🍬 *Haldiram's Royal Kaju Katli Gift Box*
  - 👘 *Festive Raw Silk Tussar Kurta*
  - ☕ *Single-Estate Assam Golden Tips Tea*
  - 🪔 *Handcrafted Brass Temple Lamp*
- `BriefForm.tsx`: Configure campaign headline, target locales (all 4 selected by default), aspect ratios, and trigger button: **"Generate 12-Ad Matrix"**.

---

### Task 11: The Live 12-Variant Matrix Grid

**Files:**
- Create: `src/components/VariantGrid.tsx`
- Create: `src/components/VariantCard.tsx`

**Specification:**
- Renders the $4 \times 3$ grid organized by locale rows or ratio tabs.
- Real-time animated shimmer and stage indicator badge while processing (`ANALYZING...`, `SCENE...`, `FORMATTING...`).
- Shows finalized image preview upon completion with tags:
  - Festival badge (e.g., `Diwali`, `Durga Puja`, `Pongal`, `Ningol Chakouba`)
  - Ratio badge (`1:1`, `9:16`, `16:9`)
  - Status pill (`READY` in green, `FLAGGED` in amber/red)
- Hover action: "Inspect Pipeline" button that opens the Inspector Drawer.

---

### Task 12: The Execution Inspector Drawer (The Demo Centerpiece)

**Files:**
- Create: `src/components/InspectorDrawer.tsx`
- Create: `src/components/BeforeAfterSlider.tsx`
- Create: `src/components/RecipeCodeModal.tsx`

**Specification:**
- Slides out smoothly from the right when any variant is clicked.
- **Section 1: Interactive Before/After Split Slider** comparing raw master photo vs. localized, generative-expanded festive ad.
- **Section 2: Stage-by-Stage Timeline:** Displays cards for each of the 6 stages, each showing execution time (e.g. `240ms`), intermediate thumbnail, and status.
- **Section 3: Compliance & Brand Guardrails Report:** 4 pass/fail checkmarks with AI reasoning.
- **Section 4: Cloudinary Recipe URL Box:** Displays the exact Cloudinary transformation URL chain with a 1-click **"Copy Recipe"** button and syntax explanation.
- **Section 5: Flagged Action Bar:** If status is `FLAGGED`, shows a prominent **"Regenerate with Adjusted Safe Margins"** button that live-updates the card.

---

### Task 13: Instant Search, Filter Bar & Batch ZIP Export

**Files:**
- Create: `src/components/SearchFilterBar.tsx`

**Specification:**
- Real-time search bar that filters variants by keyword, festival (`Diwali`, `Pongal`, etc.), format (`9:16`, `1:1`), or status (`Passed`).
- Shows total indexed count: *"12 / 12 Variants Indexed in Cloudinary"*.
- **"Export Campaign ZIP"** button that downloads all approved creatives organized into subfolders (`/hindi/`, `/bengali/`, `/tamil/`, `/meitei/`).
- Triggers celebratory confetti (`canvas-confetti`) when a batch completes.

---

## Phase 6: Testing, Polish, Documentation & Deployment

### Task 14: Automated Validation & Edge Case Testing

**Files:**
- Verify all 4 Indic scripts render correctly without missing font glyphs or boxes.
- Verify aspect ratio math for `1:1`, `9:16`, and `16:9` generative fill padding.
- Verify `npm run build` passes with zero errors and strict TypeScript compliance.

---

### Task 15: Create Hackathon README.md & Presentation Assets

**Files:**
- Create: `README.md`
- Include:
  - Executive Pitch & The Problem ($100k agency localization bottleneck).
  - Architecture Diagram (ASCII / Mermaid).
  - **"Cloudinary Features Used"** mapping table (matching each pipeline stage to the exact Cloudinary API).
  - Step-by-step local setup guide and testing instructions.
  - Video walkthrough link and team credentials.

---

### Task 16: Vercel Production Deployment

- Deploy the project to Vercel.
- Verify live environment variables (`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).
- Confirm live demo URL is accessible and performs smoothly.

---

## 3-Minute Demo Video Script Guide

| Timestamp | Screen Action | Voiceover Script Anchor |
| :--- | :--- | :--- |
| **0:00 – 0:25** | Intro slide & problem statement | *"India has 22 official languages and diverse festive seasons. When D2C brands launch a festive campaign, localizing 1 product into regional ads across North, East, South, and Northeast takes weeks of agency work. Meet Adaptr."* |
| **0:25 – 0:50** | Click sample sweet box, select 4 locales, click "Generate" | *"We upload 1 master product photo—a festive sweet box. We select Hindi for Diwali, Bengali for Durga Puja, Tamil for Pongal, and Meitei Mayek for Ningol Chakouba. In one click, Adaptr's state machine orchestrator kicks off."* |
| **0:50 – 1:30** | Watch the 12-variant matrix shimmer and reveal live | *"Cloudinary takes over: analyzing the product boundary, generating authentic cultural backgrounds, expanding aspect ratios with Generative Fill, and applying custom Indic typography including Meitei Mayek."* |
| **1:30 – 2:10** | Click on Tamil Reel (9:16) to open the Execution Inspector | *"Let's open the Execution Inspector. Notice the interactive before/after slider. In the timeline, every single stage has a deterministic Cloudinary URL, duration log, and compliance audit. Anyone can copy this exact Cloudinary URL recipe."* |
| **2:10 – 2:40** | Click on the 1 Flagged tile, view reasoning, click "Regenerate" | *"Here, the compliance engine caught a text margin warning on this banner. We click 'Regenerate', and Cloudinary adjusts the safe zone padding in real time."* |
| **2:40 – 3:00** | Filter via Search bar, click "Export Campaign ZIP", show confetti | *"Using the Cloudinary Search API, marketers can filter across all 12 indexed variants and download the entire production-ready campaign ZIP in seconds. 1 hero shot. 12 localized regional ads. Powered by Cloudinary."* |

---
```

Plan complete and saved to `docs/plans/2026-09-28-adaptr-implementation-plan.md`.
