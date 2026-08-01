# Premium Article System Blueprint V1

**System Concept:** The Strategic System
**Status:** Stage 2 Creative Candidate Blueprint
**Goal:** Transform informational checklists into a premium, proprietary decision-making tool experience. The content should feel like reading a high-end management consulting brief (e.g., McKinsey, WSJ) merged with a functional digital workspace (Notion, Linear).

## 1. Editorial Concept & Character
*   **Character:** The System Architect. Decisive, clear, authoritative, and focused on business continuity and risk mitigation.
*   **Voice:** Concrete and human, yet calm and evidence-based. No marketing fluff. We do not use "hostage" language; we use "operational risk" and "dependency" language.
*   **Goal:** Move the reader from a passive learning state (reading a blog) into an active evaluation state (auditing their own business).

## 2. Visual Hierarchy & Typography
*   **Typography Roles:** 
    *   **Display / H1:** A modern serif or high-contrast sans-serif to establish editorial authority and trust.
    *   **Body:** A highly legible sans-serif optimized for long-form screen reading.
    *   **UI/Data (Tables, Ledgers, Labels):** A monospaced or compact sans-serif to convey precision and data orientation.
*   **Width and Rhythm:** Constrained reading width (max ~70ch) for body text to reduce eye fatigue. Wider containers for Data Modules (Matrices, Ledgers) to allow comparison.
*   **Background/Surface Logic:** Light/clean main background with subtle gray/off-white surfaces for "cards" and "modules" to separate practical tools from narrative text.

## 3. Signature Modules & Components

### A. The Hero System
*   Replaces the standard "H1 + text" with an editorial opening.
*   **Components:** 
    *   Category Badge (e.g., *Strategic Brief*, *Due Diligence Guide*).
    *   Primary H1.
    *   **Executive Summary Rail (TL;DR):** A dedicated 2-3 sentence block summarizing the central thesis before the article begins.

### B. Scenario Cards (e.g., The Broken Journey, The Illusion of Page Count)
*   Used to ground abstract concepts in concrete reality.
*   **Visual treatment:** Rendered as a distinct blockquote, callout (`<aside>`), or card with a distinct border or background, clearly labeled as a hypothetical scenario (e.g., "Scenario: The Asymmetric Customer Journey").

### C. Data Transformation: Matrices & Ledgers
*   Standard Markdown tables are transformed into responsive, component-driven layouts.
*   **The Proposal Risk Ledger (Pair 2):** Uses status badges (In/Out/Unresolved, Client/Provider) and color-coded risk markers (Red/Yellow/Green) within a structured grid, rather than a raw text table.
*   **The Language Coverage Matrix (Pair 1):** Uses a clean three-column comparison layout with clear checkmarks/crosses to evaluate operational readiness.
*   *No-JS Behavior:* Always falls back to a semantic HTML `<table>` or stacked `<dl>` (description lists) to ensure full accessibility.

### D. Evidence & Citation Modules
*   References to primary sources (W3C, ICANN, U.S. Copyright Office) are broken out into dedicated "Authority Blocks" to boost E-E-A-T.
*   **Visual treatment:** A distinct icon (e.g., a scale or document) with a small, readable text block, acting as a factual anchor.

### E. Operations Check / Automation Tie-in
*   A contextual module embedded within the narrative (not at the very end). 
*   **Content:** Links the website decision to CRM, intake, or operational automation naturally. 
*   **Example:** *"Operations Check: Is your CRM ready for Spanish inquiries?"*

### F. Decision Gates
*   Replaces long concluding checklists with a "Decision Gate" (e.g., The Red-Risk Decision Gate).
*   **Format:** A strict "Do not pass until..." block.

### G. The CTA System
*   **In-content Contextual Link:** Text-based links connecting the narrative to a specific service (e.g., *"Learn how we connect multilingual routing to CRM automation"*).
*   **Premium Terminus CTA:** A distinct, high-contrast block at the end of the article offering a mature next step (e.g., *"Get an Impartial Proposal Review"*).

## 4. Mobile & Accessibility Behavior
*   **Mobile Table Transformation:** Complex tables (like the Risk Ledger) will not use swipe-only horizontal scrolling as the primary interaction. Instead, they transform into vertically stacked "Cards" or labeled rows to keep headers directly adjacent to data values.
*   **Semantic HTML:** Strict use of `<article>`, `<section>`, `<table>`, `<th>` with `scope`, and `<aside>` for secondary modules.
*   **Reduced Motion:** Restrained motion rules. No scroll-jacking. Hover states and subtle fade-ins only. Respects `prefers-reduced-motion`.
*   **Contrast:** Strict adherence to WCAG AA/AAA color contrast ratios for all Risk Badges (Red/Yellow/Green must also have text labels or icons, not rely on color alone).

## 5. Scalability
*   This system creates reusable components: `Hero Summary`, `Scenario Card`, `Risk Ledger Grid`, `Authority Citation Block`, and `Decision Gate`. These can be natively mapped to any future ProAI Expert article on Branding or Automation.