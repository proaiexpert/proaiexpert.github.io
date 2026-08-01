# Premium Article System Blueprint V2

**System Concept:** The Strategic System (Hybrid Adaptation)
**Status:** Stage 2 V2 Blueprint
**Goal:** Merge the rigorous factual precision, operational scope, and legal/technical safety boundaries of the baseline with a premium, highly readable, module-based editorial layout. Create a proprietary visual system for ProAI Expert, not a generic clone of Notion or WSJ.

## 1. Editorial Concept & Character
*   **Character:** The Analytical Architect. Calm, concrete, evidence-based, rigorous.
*   **Voice:** Professional business English/Russian. Refrains from emotional marketing, overstatements, and extreme phrases (e.g., avoids "hostage", "devastating", "never sign").
*   **Goal:** Guide the reader through a structured decision sequence using facts and operational realities.

## 2. Visual Hierarchy & Typography
*   **Proprietary Visual Language:** A ProAI Expert aesthetic that aligns with existing site architecture. Neutral surfaces, clear dividing lines, structured whitespace, relying on typographic contrast.
*   **Typography Roles:** 
    *   **Primary H1/H2:** Strong, highly readable sans-serif or modern serif depending on global brand guidelines. Sets the structural backbone.
    *   **Body:** High-legibility sans-serif targeting ~70-80 characters per line for reading comfort.
    *   **Data Modules/Tables:** Compact sans-serif to support high-density scanning without wrapping breakages.
*   **Background/Surface Logic:** Light default surfaces. Cards and data grids use subtle borders or 2-4% opacity background fills to distinguish them from standard narrative paragraphs. No heavy drop-shadows or "glassmorphism".

## 3. Signature Modules & Components

### A. The Hero System
*   **Category Label:** A brief, restrained context tag above the H1 (e.g., *Strategic Brief*).
*   **Primary H1:** Unmodified from the metadata manifest.
*   **Executive Summary Rail:** A 2-3 sentence introductory block highlighting the core thesis (e.g., "The decision is built around real customer behavior, operational capacity, and a content system the business can maintain after launch.").

### B. Decision Frameworks (e.g., The Language Coverage Ladder)
*   Instead of flat text, present structural options (Option A, Option B, Option C) as distinct, comparable blocks.
*   Clearly separated criteria: *When to choose this*, *What it requires*, *What it looks like*.

### C. Data Transformation: Risk Ledgers & Matrices
*   **Transformation Rule:** Tables must preserve header relationships and comparison abilities. Do not turn complex comparative tables into swipe-only mobile cards.
*   **Mobile Strategy:** Use vertically stacked `<dl>` (description lists) or labeled rows for mobile viewports to keep data keys strictly associated with their values. Avoid horizontal scrolling unless explicit visual affordances exist.
*   **Risk Colors/Labels:** If using Red/Yellow/Green, always pair the color with explicit text labels or icons (e.g., [!] Unresolved). Never rely on color alone (WCAG 2.2 AA requirement).

### D. Contextual Evidence Blocks (Authority Blocks)
*   **Purpose:** To support the adjacent claim and help the reader verify it with a primary source. Do not claim this "boosts E-E-A-T."
*   **Visual Treatment:** Distinct semantic `<aside>` or blockquote-style box adjacent to the related text, directly referencing entities like ICANN, W3C, U.S. Copyright Office, or Google Search Central.

### E. Operations/Continuity Checks
*   Embedded diagnostic blocks (e.g., "Language Continuity Check" or "Definition of Done") using ordered lists or verification fields.

### F. Decision Gates
*   Clearly defined stopping points (e.g., "A practical decision sequence"). Uses step-by-step numbered logic.

### G. Mature CTA System
*   **In-content Contextual Links:** Natural hyperlinking to related services without interrupting flow.
*   **Final CTA:** A distinct call-to-action explicitly clarifying the service boundary (e.g., "This review identifies what is included and which questions remain open. It does not replace legal review of the contract.").

## 4. Web Standards & Accessibility Target
*   **Target:** WCAG 2.2 AA is the minimum design and implementation baseline. Do not claim universal AAA compliance.
*   **Semantic HTML:** Strict adherence to semantic HTML5. Data tables use `<table>`, `<th>`, `<th scope="col/row">`, and `<caption>`. Asides use `<aside>`.
*   **No-JS Fallback:** Every module, including ledgers, matrices, and tabs (if used), must be fully readable and structured without JavaScript.
*   **Motion:** Restrained motion only. Focus on fast rendering. Must respect CSS `@media (prefers-reduced-motion: reduce)`.

## 5. Scalability & Progressive Enhancement
*   The layout is designed for progressive enhancement. HTML loads first, CSS provides the structural grid (CSS Grid/Flexbox), and minimal JS handles optional interactions (like table responsive toggle hints).
*   These modules will seamlessly map to future articles on Automation and Branding.