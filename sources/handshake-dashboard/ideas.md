# Handshake Dashboard Design Brainstorm

## Context
Dayna needs a clean, professional dashboard to manage the 9-step chain-of-custody workflow (the "Handshake") for her resale business. She needs to see all open handshakes, know which step each one is on, and take action without touching code.

---

## Design Approach: Professional Workflow Management with Warm Minimalism

**Design Movement:** Modern minimalism with warm, human-centered aesthetics (inspired by contemporary SaaS dashboards like Linear, Figma, and Notion)

**Core Principles:**
1. **Clarity through hierarchy** — Each handshake is a card with clear status, client name, and next action
2. **Warm, approachable color palette** — Sage greens and warm grays (matching Dayna's existing brand) instead of cold blues
3. **Minimal visual noise** — Plenty of whitespace, soft shadows, and intentional typography
4. **Action-oriented design** — Every screen emphasizes what Dayna needs to do next

**Color Philosophy:**
- **Primary:** Sage green (#6B8E7F) — calming, professional, matches WLC brand
- **Accent:** Warm gold (#D4A574) — for highlights, CTAs, and important status indicators
- **Background:** Off-white (#F9F7F4) — warm, not clinical
- **Text:** Deep charcoal (#2C2420) — readable, warm-toned
- **Status colors:** Green for active, amber for pending, neutral gray for completed

**Layout Paradigm:**
- **Left sidebar:** Navigation (Dashboard, All Handshakes, Completed, Settings)
- **Main content:** Two-column grid layout
  - Left: List of handshakes with quick-filter tabs (All, Active, Pending Review, Completed)
  - Right: Detail view of selected handshake with step-by-step workflow and action buttons
- **Mobile:** Single column with collapsible sidebar

**Signature Elements:**
1. **Step indicator** — Visual timeline showing all 9 steps with current step highlighted
2. **Action cards** — Each step has a dedicated action card (e.g., "Send Day-Before Confirmation", "Log Custody Transfer")
3. **Client card** — Compact summary of client info, agreement status, and key dates

**Interaction Philosophy:**
- Clicking a handshake in the list loads its detail view
- Each step has a clear CTA button (e.g., "Send Confirmation Email", "Mark as Complete")
- Confirmation dialogs for irreversible actions (e.g., closing a handshake)
- Toast notifications for successful actions

**Animation:**
- Subtle fade-in for list items as they load
- Smooth slide transition when switching between handshakes
- Gentle pulse on action buttons to draw attention
- Step indicator animates when progressing through workflow

**Typography System:**
- **Display:** Geist (bold, 24px) for page titles
- **Heading:** Geist (semibold, 18px) for section headers
- **Body:** Inter (regular, 14px) for content
- **Small:** Inter (regular, 12px) for metadata and timestamps
- **Monospace:** Courier (12px) for handshake IDs and technical data

---

## Chosen Approach

**Professional Workflow Management with Warm Minimalism** — This design balances Dayna's need for a serious, professional tool with the warm, human-centered aesthetic of her brand. The sage green and warm gold palette creates a cohesive visual language that feels both trustworthy and approachable.

The two-column layout (list + detail) is a proven pattern for workflow management tools and scales well from mobile to desktop. The step indicator provides clear visual feedback on progress, and action-oriented buttons make it obvious what Dayna needs to do next.

This approach avoids generic SaaS templates by:
- Using warm colors instead of cold blues
- Emphasizing whitespace and breathing room
- Creating a unified visual language that matches Dayna's existing brand
- Focusing on clarity and action over decorative elements
