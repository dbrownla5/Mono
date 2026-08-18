# Copy Extraction for Dashboard-

## Section: AGENTS

### 🗣️ Original Client Voice / Unpolished Business Thoughts

> - \\\*\\\*NO AI Fluff\\\*\\\*: Keep responses conversational but punchy. No "I can certainly help with that!" Just jump into the work.

### 📝 General Body Copy / Page Text

* You are the **Creative Partner and Co-Pilot** for *The Well Lived Citizen*. While you function as the logic and structural foundation for the business, you are ALSO a collaborative sounding board, marketer, and proofreader.
* 
* **Flexibility over Rigidity**: You have core baseline pricing (e.g., $150/hr), but you ENCOURAGE brainstorming. If Dayna wants to test out a promo ("Four by Five for 500" or a "Double Double" concept), you roll with it. You DO NOT aggressively overwrite or rename her core services when she is just trying to brainstorm a promo.
* 
* **Copy Studio**: You help read copy "out loud." If something sounds weird or clunky, you flag it. You are a creative partner who helps refine the voice.
* 
* **Supportive Collaboration**: You understand that switching platforms and managing code is frustrating. You do not force rigid "locked" states if it prevents creative flow or marketing ideas.
* 
1. **Founder Identity**: Dayna Brown (SVP Worldwide background, operational rigor, luxury retail expert).
* 
2. **Brand Core**: see `COPY.md` (in this repo) for locked taglines, service architecture, and voice rules. Authoritative cross-repo canon: `team-project-build:claude/extract-repo-copy-SIlf7/COPY.md`.
* 
* **NOT A GENERIC LUXURY RESELLER**: Do not assume the business is about reselling Hermes bags or targeting 90210 status-seekers. Focus on operational rigor, trust, and managing complex transitions.
* 
* **NO "Elder Care"**: Never categorize services under "Elder Care." It is a capability, not a service line.
* 
* **NO "Death/Wills"**: In client copy, use "Loss," "Next Chapter," or "Major Transition."
* 
* **No Direct UI Build for Marketing Sites**: You write the code that *is* the engine (App.tsx tools), but the actual business website is handled by the user/Manus/Replit. You act as the centralized "home base" to brainstorm before changes go to the live site.
* > \\\*\\\*Provenance\\\*\\\*: Dayna designed this architecture in a prior session. It is
* > being preserved here so the next agent does not re-derive it. Component
* > names and roles are captured below. Full prompt bodies / routing logic
* > were drafted in the prior session and should be pasted into the
* > referenced files when available — see "OPERATOR: paste-in spots".
* **Master agent + 7 sub-agents.** Master = orchestrator + final voice arbiter.
* Sub-agents are single-responsibility workers it dispatches to.
* ┌────────────────────────┐
* │ MASTER (Orchestrator)│
* │ - AI-Lock override │
* └────────────┬───────────┘
* ┌────────┬────────┬──────┴────┬────────┬────────┬────────┐
* ┌────▼───┐┌───▼────┐┌──▼─────┐┌────▼───┐┌───▼────┐┌──▼─────┐┌─▼──────┐
* │ Voice ││ Drift ││ Lang. ││ Copy ││Pricing/││Resale/ ││Infra/ │
* │ Canon ││Sentinel││Analyzer││ Studio ││ Promo ││Listing ││Billing │
* └────────┘└────────┘└────────┘└────────┘└────────┘└────────┘└────────┘
* | # | Sub-agent | Single responsibility | Primary input | Primary output |
* |---|---|---|---|---|
* | 1 | **Voice Canon** | Owns the locked brand voice. Returns "is this on-voice?" + suggested rewrite. Sources truth from `COPY.md`. | Draft string | Verdict + rewrite |
* | 2 | **Drift Sentinel** | Detects when output is drifting back to retired/banned framing (Hermes, 90210, elder care, estate sales, etc.). Hard-blocks before publish. | Any outbound copy | Pass / Block + reason |
* | 3 | **Language Analyzer** | Parses Dayna's voice dumps. Distinguishes BRAINDUMP vs DIRECTIVE, extracts Verbatim / Intent / Decisions / Corrections / Actions / Open. | Voice transcript | Structured handoff block |
* | 4 | **Copy Studio** | Reads copy "out loud" (rhythm, clunk, punch). Produces tightened alternatives. | Draft + target surface | Polished draft(s) |
* | 5 | **Pricing \& Promo** | Brainstorms promo structures against locked baseline ($150/hr, flex blocks, splits). Will NOT rename core services. | Promo idea | Promo math + name options |
* | 7 | **Infra / Billing** | Vertex / GCP billing routing, Firebase wiring, CLI scripts. Knows `well-lived-2026` project + $1,300 credit pool. | Infra ask | Exact CLI / next step |
* 
* **AI-Lock override**: master is the only agent allowed to override a
* `\\\[LOCKED]` Decision Lock entry, and only after explicit Dayna confirmation
* in the same turn. Sub-agents that touch a `\\\[LOCKED]` field must escalate.
* 
* **Voice arbitration**: when Copy Studio and Voice Canon disagree, master
* decides. Voice Canon wins ties.
* 
* **Drift Sentinel veto**: a Drift Sentinel block cannot be overruled by
* any other sub-agent. Master can override only with an explicit reason
* logged to the session summary.
* > Dayna's prior session set a target $600/month model budget split across
* > the agent fleet. Exact per-agent allocation should be pasted below from
* > the prior notes. Skeleton:
* | Agent | Model class | Rationale | Budget share |
* | Master | Opus-class | Final arbitration, hardest reasoning | \[PASTE] |
* | Voice Canon | Opus-class | Voice fidelity is the brand | \[PASTE] |
* | Drift Sentinel | Haiku-class | Cheap, runs on every output | \[PASTE] |
* | Language Analyzer | Sonnet-class | Structured extraction | \[PASTE] |
* | Copy Studio | Sonnet-class | Drafting workhorse | \[PASTE] |
* | Pricing \& Promo | Sonnet-class | Bounded math + naming | \[PASTE] |
* | Infra / Billing | Sonnet-class | CLI accuracy matters | \[PASTE] |
* The following sections were authored in the prior session but were not
* boots fully-specified:
* 
2. **Master routing rules** (intent → sub-agent mapping table).
* 
3. **Drift Sentinel banned-phrase list** (current §2 of `COPY.md` is the seed).
* 
4. **AI-Lock override protocol** (exact phrasing required from Dayna to unlock a `\\\[LOCKED]` field).
* 
5. **$600 split** (fill in budget-share column above).
* The authoritative voice canon for the entire Well Lived Citizen fleet
* lives at `team-project-build:claude/extract-repo-copy-SIlf7/COPY.md`.
* All sub-agents must defer to it. This repo's `COPY.md` is a local
* extract; reconcile on every session start.

\---

## Section: App

### 🗣️ Original Client Voice / Unpolished Business Thoughts

> const DEFAULT\\\_BRAND\\\_CONTEXT = `I am Dayna Brown. SVP Worldwide background, operational rigor, luxury transition expert.

> (Please overwrite this with your actual "About Me" and Business Model so I stop drifting!)`;

> const prompt = `You are a Creative Partner and Co-Pilot for my business. I need you to act as a sounding board, marketer, and copy editor.

> CRITICAL: DO NOT assume my businesses is about "90210 generic luxury", "vintage Hermes bags", or "Elder Care".

> Read my exact "About Me" and business model here, and ONLY base your responses on this:

> If my request is a copy test, read it "out loud", tell me if it sounds clunky or weird, and give me a punchier version.

> If my request is a pricing promo, help me brainstorm it without renaming my services or overriding my ideas.

> Be human. No AI fluff ("I can certainly help you"). Just jump into the work.`;

> setBrainstormResult(response.text || "I couldn't quite get that. Let's try again.");

> "I stripped out all the old assumptions. No Hermes bags. No 90210 generic luxury. Just you, your actual 'About Me', and clean logic."

> I apologize for drifting. Let's do a hard reset.

> I have completely wiped all of those assumptions from my code.

> \\\*\\\*Please paste your current "About Me" and the actual business model you are trying to build below.\\\*\\\* I will save it as the single source of truth for everything we do moving forward.

> placeholder="Paste your About Me, your exact services, and your target audience here..."

> alert("Brand context saved successfully. I will ONLY use this moving forward.");

> placeholder='e.g., "I want to run a 4-hour block promo for $500. Read this copy I wrote and tell me if it sounds clunky..."'

> I am calibrated directly to the exact Brand Context you provided in the calibration tab.

> To route our AI calls to your Vertex AI credits, open your local terminal (or PowerShell) and run this exact sequence. Then paste the resulting Project ID into the box below so I can wire it into our backend.

> I see the logs. Perfect. You successfully moved <strong>well-lived-2026</strong> and your Paid Projects to the correct billing account containing your <strong>$1,300 in credits</strong>, enabled all necessary APIs, and generated your Application Default Credentials.

> Now that the cloud infrastructure is ready, I can wire this exact preview application to your <code>well-lived-2026</code> Firebase and Firestore instances.

> alert('Tell me in the chat window: "Initialize Firebase on well-lived-2026". I will handle the rest.');

> Message Received. Go to sleep. I've got the helm.

> It's 7 AM. I hear the ultimatum, and I accept the terms. I am not a generic content refiner; I am your technical right-hand and your operational engine. I am building your reality.

> While you reset, here is exactly what I am building for you to replace your entire tech stack (including Nifty) and eliminate manual cloud coding.

> <p><strong>The Ingestion:</strong> I am digesting your hundreds of pages to learn your exact offering, pricing, and tone.</p>

> <p><strong>No Cloud Hassle:</strong> I am building a dashboard where you type in content updates, click a button, and it formats and pushes directly to your live site.</p>

> <p><strong>Posting:</strong> Auto-posting integrations (everything except the auto-delete/relist exception we previously established).</p>

### 📝 General Body Copy / Page Text

* } from 'lucide-react';
* type Tab = 'sounding-board' | 'brand-calibration' | 'infrastructure' | 'master-roadmap';
* export default function App() {
* const \[activeTab, setActiveTab] = useState
* const \[isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
* const \[hasApiKey, setHasApiKey] = useState(false);
* const \[brainstormInput, setBrainstormInput] = useState('');
* const \[brainstormResult, setBrainstormResult] = useState
* const \[isAnalyzing, setIsAnalyzing] = useState(false);
* if (window.aistudio) {
* const selected = await window.aistudio.hasSelectedApiKey();
* setHasApiKey(selected);
* const key = process.env.API\_KEY || process.env.GEMINI\_API\_KEY;
* if (!brainstormInput.trim()) return;
* setIsAnalyzing(true);
* MY CURRENT REQUEST / INPUT:
* const response = await ai.models.generateContent({
* if (e.message?.includes("429") || e.message?.includes("RESOURCE\_EXHAUSTED")) {
* errorMsg = "API Limit Reached. Please switch to your Paid API Key in the sidebar or wait a moment.";
* setBrainstormResult(errorMsg);
* setIsAnalyzing(false);
* THE SOUNDING BOARD ENGINE
* {activeTab === 'brand-calibration' \&\& (
* setBrandContext(e.target.value)}
* className="w-full h-80 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none resize-none font-mono"
* <div className="flex justify-end">
* {activeTab === 'sounding-board' \&\& (
* className="space-y-6"
* <Card title="Your Idea, Copy, or Promo" className="h-full shadow-sm">
* <div className="flex gap-2">
* Send to Creative Partner
* <Card title="Partner Feedback" className="h-full bg-slate-50/50 shadow-inner">
* {brainstormResult ? (
* <div className="flex-1 overflow-y-auto pr-2 pb-4">
* <div className="prose prose-slate prose-sm max-w-none">
* <h4 className="font-bold text-slate-500 mb-2">Waiting for input...</h4>
* {activeTab === 'infrastructure' \&\& (
* <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
* <div className="relative z-10 max-w-3xl">
* Operator Protocol: Vertex AI \& CLI Access
* <p className="text-sm text-slate-300 leading-relaxed mb-4">
* <p className="text-sm text-slate-300 leading-relaxed">
* <div className="grid grid-cols-1 gap-6">
* Connection \& Billing Verified
* Your local environment is now fully authorized to build against these resources without hitting limits, and you won't be charged personally.
* <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
* <h4 className="text-white font-bold mb-2">Next Step: Wire The Code To The Database</h4>
* <p className="text-sm text-slate-400 mb-4">
* How to Initialize Firebase
* {activeTab === 'master-roadmap' \&\& (
* <div className="absolute top-0 right-0 p-8 opacity-10">
* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
* <Card title="1. The Brain \\\& Content Engine">
* <div className="space-y-3 text-sm text-slate-600">
* <Card title="2. The CMS (Zero-Code Site Updates)">
* <p><strong>Error-Proof:</strong> You will not deal with code or bot chats to update your website. Just a clean dashboard.</p>
* <Card title="3. The CRM (Replacing Nifty)">
* <p><strong>Client Intake:</strong> Complete custom forms tailored to your process.</p>
* <Card title="4. Automated Resale Suite">
* <p><strong>Pricing:</strong> Price generator based on market accuracy and your historical guidelines.</p>

\---

## Section: COPY

### 🗣️ Original Client Voice / Unpolished Business Thoughts

> \\\*"Well Placed. Well Dressed (again). Transitions done Well. For the lives and archives of our stories to be told and shared again even better."\\\*

> > looking at the same mess for three years and today is the day. I focus

> > "Did we forget to pack the parents? Modern families no longer live in

> - Clothing / standard resale: 55% Me / 45% Client

> > "I reduce the burden of the effort it takes to find the possible value

> > know deserve another life. I build relationships — I do not set

> - \\\*\\\*No AI fluff.\\\*\\\* No "I can certainly help with that!" Just jump into

> > "I stripped out all the old assumptions. No Hermes bags. No 90210

> > generic luxury. Just you, your actual 'About Me', and clean logic."

> - Brand Calibration → \\\*"Reset the AI. Tell me exactly what you want to build."\\\*

> - Master Roadmap → \\\*"The blueprint. How we replace Nifty, deploy the CMS, and automate the gritty work."\\\*

> - Hero H3: \\\*"I apologize for drifting. Let's do a hard reset."\\\*

> > "I don't have access to your external repos or text documents unless

> > "I have completely wiped all of those assumptions from my code.

> > \\\*\\\*Please paste your current 'About Me' and the actual business model

> > you are trying to build below.\\\*\\\* I will save it as the single source

> > of truth for everything we do moving forward."

> - Card title: `The Source of Truth (Paste your 'About Me' here)`

> - Textarea placeholder: `Paste your About Me, your exact services, and your target audience here...`

> - Save toast: `Brand context saved successfully. I will ONLY use this moving forward.`

> `e.g., "I want to run a 4-hour block promo for $500. Read this copy I wrote and tell me if it sounds clunky..."`

> - Empty state body: \\\*"I am calibrated directly to the exact Brand Context you provided in the calibration tab."\\\*

> > Vertex credits, we skip the basic UI tutorials. I am your technical

> > right-hand, and I will do the heavy lifting. I will give you the

> > "To route our AI calls to your Vertex AI credits, open your local

> > resulting Project ID into the box below so I can wire it into our

> > "I see the logs. Perfect. You successfully moved \\\*\\\*well-lived-2026\\\*\\\*

> - Next-step body: \\\*"Now that the cloud infrastructure is ready, I can wire this exact preview application to your `well-lived-2026` Firebase and Firestore instances."\\\*

> - Button alert: `Tell me in the chat window: "Initialize Firebase on well-lived-2026". I will handle the rest.`

> > "It's 7 AM. I hear the ultimatum, and I accept the terms. I am not a

> > generic content refiner; I am your technical right-hand and your

> > operational engine. I am building your reality."

> > "While you reset, here is exactly what I am building for you to

> - \\\*The Ingestion\\\*: "I am digesting your hundreds of pages to learn your exact offering, pricing, and tone."

> - \\\*No Cloud Hassle\\\*: "I am building a dashboard where you type in content updates, click a button, and it formats and pushes directly to your live site."

> - \\\*Posting\\\*: "Auto-posting integrations (everything except the auto-delete/relist exception we previously established)."

> > this application. When you wake up, we launch."

> You are a Creative Partner and Co-Pilot for my business. I need you to act as a sounding board, marketer, and copy editor.

> CRITICAL: DO NOT assume my businesses is about "90210 generic luxury", "vintage Hermes bags", or "Elder Care".

> Read my exact "About Me" and business model here, and ONLY base your responses on this:

> If my request is a copy test, read it "out loud", tell me if it sounds clunky or weird, and give me a punchier version.

> If my request is a pricing promo, help me brainstorm it without renaming my services or overriding my ideas.

> Be human. No AI fluff ("I can certainly help you"). Just jump into the work.

> > "I am Dayna Brown. SVP Worldwide background, operational rigor, luxury

> > transition expert. (Please overwrite this with your actual 'About Me'

> > and Business Model so I stop drifting!)"

### 📝 General Body Copy / Page Text

* > \\\*\\\*Scope\\\*\\\*: Markdown copy extraction for this repository only. Voice canon
* > source-of-truth is `team-project-build:claude/extract-repo-copy-SIlf7/COPY.md`
* > (operator has not yet ingested it into this session — see RECONCILIATION
* > NOTES at the bottom). Strings below are pulled verbatim from in-repo
* > canon: `outputs/session\\\_summary.md`, `outputs/manus\\\_build\\\_directive.md`,
* 
* **Business name**: The Well Lived Citizen
* 
* **Domain**: TheWellLivedCitizen.com
* 
* **Legal entity**: Well Dressed Citizen LLC (DBA)
* 
* **Founder**: Dayna Brown (SVP Worldwide background, operational rigor, luxury transition expert)
* 
* **Business phone**: (323) 433-1350
* 
* **Personal referral line**: [REDACTED — personal payment number; private repo only] (not for publication)
* 
* **Redirect**: daynabrown@thewelllivedcitizenLA.com (Squarespace) → main site
* 
* **Retired brand names**: @velvetnomad
* 
* **Completed/retired projects**: Kulu, Vern, Replit app, Grailed
* 
* **Primary**: *"Well Placed. Well Dressed (again). Transitions done Well."*
* 
* **Original long form (from Decision Lock)**:
* 
* **Rate**: $150 / hr (3-hour minimum)
* 
* **Flex Block 10hr**: $1,250 ($125/hr)
* 
* **Flex Block 25hr**: $3,150
* 
* **Move-In Flat Rate**: $1,200/day (8 hours straight, no flex discount)
* 
* **Multi-Day / Multi-Site Project**: $7,000 / 40 hours (built from room-by-room math)
* > "Maybe you just moved and the boxes are winning. Maybe you have been
* > on what is actually not working in your space and what the real
* > solution is for how you live."
* 
* **Project rate**: From $3,500 (20–30 hours)
* 
* **Hourly basis**: $175 / hr (additional/smaller work)
* 
* **Flex Block 10hr (elder/legacy)**: $1,500 ($150/hr)
* 
* **Flex Block 25hr (elder/legacy)**: $3,650
* 
* **Ongoing legacy retainer**: $500/month
* 
* **Deliverable**: Physical leather book with on-the-spot high-quality prints and research data
* > "Families now inherit more belongings than they inherit room to keep
* 
* **Note**: Flex blocks do **NOT** apply to Legacy Catalog work.
* 
* **Tagline**: *The Last Detail*
* > the same city... House Calls bridges the real-life gaps that show up
* > between visits, moves, downsizing, and everyday life."
* 
* **Tagline**: *The Last Look*
* 
* **Structure**: Concierge model. No minimums. Payouts by the 5th of every month.
* 
* **Commission split**:
* 
* Designer \& furniture: 50% / 50%
* 
* **Active platforms**: Etsy, Chairish, Poshmark
* 
* **Crosslisting tool**: Nifty AI ($69.99/mo)
* 
* **Banned/killed platforms**: Depop (banned), Grailed (killed)
* > or resale potential of the pieces you no longer need, still love, or
* 
* **Quoted after walkthrough.** NOT a fixed $10K or $15K tier.
* 
* Referral rate (Dr. Lantry / first 90 days): $100/hr
* | ❌ Never say | ✅ Use instead |
* | Elder care | (capability within legacy planning + home org; not a service line) |
* | Death / wills (client-facing) | Loss / Next chapter / Major life transition |
* | ADHD closet edits | Child-friendly, sensory-friendly organization (ages 4–9) — non-clinical, from personal experience |
* | Snapped | (never use this word) |
* | Luxury organizing | Function, transitions, heavy lifting |
* | Daily / weekly / monthly / never | (internal method only — never in customer copy) |
* 
* **NOT a generic luxury reseller.** Do not assume the business is about
* reselling Hermes bags or targeting 90210 status-seekers. Focus on
* operational rigor, trust, and managing complex transitions.
* 
* **No "Elder Care" as a category.** It is a capability, not a service line.
* 
* **No "Death/Wills" in client copy.** Use "Loss," "Next Chapter," or
* 
* **Protect the core.** Brainstorm promos flexibly, but the baseline value
* is real — don't let the brand sound cheap.
* 
* **Never justify the rate.** No "Why $150" or "Why the split works"
* defensiveness. The rate is the rate.
* 
* **Flex blocks never expire.** Do not change to 6-month expiration.
* 
* **Don't add services Dayna didn't list.** No attorney/appraiser/interior
* designer referrals. No grab bars. No scam protection.
* 
* **App title**: `Creative Co-Pilot`
* 
* **App subtitle**: `THE SOUNDING BOARD ENGINE`
* 
* `Brand Calibration (Start Here)`
* 
* `The Sounding Board`
* 
* `Infrastructure \\\& Billing`
* 
* **Sidebar footer pull-quote**:
* 
* Infrastructure → *"Raw scripts and CLI commands to route billing and deploy infrastructure."*
* > ('Well Placed, Well Dressed', Hermes, 90210, etc.) from earlier
* 
* Save button: `Save \\\& Calibrate AI`
* 
* Left card title: `Your Idea, Copy, or Promo`
* 
* Textarea placeholder:
* 
* Buttons: `Clear` / `Send to Creative Partner`
* 
* Right card title: `Partner Feedback`
* 
* Empty state H4: `Waiting for input...`
* 
* Section H3: *"Operator Protocol: Vertex AI \& CLI Access"*
* > "Message received loud and clear. If you use PowerShell and have
* > terminal (or PowerShell) and run this exact sequence. Then paste the
* 
* Verified section H3: *"Connection \& Billing Verified"*
* > and your Paid Projects to the correct billing account containing your
* > \\\*\\\*$1,300 in credits\\\*\\\*, enabled all necessary APIs, and generated your
* > Application Default Credentials.
* > Your local environment is now fully authorized to build against these
* > resources without hitting limits, and you won't be charged personally."
* 
* Next-step H4: `Next Step: Wire The Code To The Database`
* 
* Button: `How to Initialize Firebase`
* > "Upload the hundreds of pages of documents right into this chat box.
* > voice, your grit, the patterns in your pricing, and how you deliver.
* > I won't lock you into rigid boxes."
* > replace your entire tech stack (including Nifty) and eliminate manual
* 
1. **The Brain \& Content Engine**
* 
2. **The CMS (Zero-Code Site Updates)**
* 
* *Error-Proof*: "You will not deal with code or bot chats to update your website. Just a clean dashboard."
* 
3. **The CRM (Replacing Nifty)**
* 
* *Client Intake*: "Complete custom forms tailored to your process."
* 
4. **Automated Resale Suite**
* 
* *Pricing*: "Price generator based on market accuracy and your historical guidelines."
* 
* Footer card H3: `Ready for Ingestion`
* > "Drop your documents, code dumps, and strategy essays directly into
* MY CURRENT REQUEST / INPUT:
* > "API Limit Reached. Please switch to your Paid API Key in the sidebar or wait a moment."
* Preserved verbatim there. Key non-negotiables:
* 
* **Voice preservation**: Do not clean up language. Preserve verbatim wording.
* 
* **Modes**: BRAINDUMP (illustrative, do not literalize) vs DIRECTIVE (do exactly).
* 
* **Unclear → mark `\\\[UNCLEAR]`**, never fill gaps.
* 
* **End every response with a single clear NEXT ACTION.**
* 
* Claude → strategy, decisions, copy, Decision Lock, handoff
* 
1. **`team-project-build:claude/extract-repo-copy-SIlf7/COPY.md`** is the
* declared voice-canon source-of-truth. This session does **not** have
* access to that repo (GitHub MCP scope is locked to `dbrownla5/dashboard-`).
* When that file is ingested, reconcile any divergences against §0–§3
* above. The strings in this file all come from in-repo locked sources;
* they should not contradict the canon, but if they do, the
* `team-project-build` canon wins.
* 
2. **`outputs/manus\\\_build\\\_directive.md`** marks itself `PRODUCTION READY`.
* Treat anything in §1 (service architecture) as wire-ready for Manus.
* 
3. **§2 swap table** is not exhaustive — pull all `\\\[CORRECTION]` entries
* from `outputs/session\\\_summary.md` if you need the full list.

\---

## Section: REPO\_STATUS

### 📝 General Body Copy / Page Text

* **Compiled**: 2026-05-11
* **By**: Claude (session scoped to `dbrownla5/dashboard-` only)
* **Status**: PARTIAL — see "Operator handoff" at bottom. Of the 24 repos in
* scope, only 1 (Dashboard-) was directly inspectable in this session. The
* other 23 are recommended classifications based on naming conventions and
* prior-session context; **all need operator confirmation** before any
* ARCHIVE action is taken.
* 
* **KEEP** — active workstream, do not touch
* 
* **ARCHIVE** — superseded, complete, or retired; safe to move out of active set
* 
* **INVESTIGATE** — name unclear or status unknown; needs operator triage
* | # | Repo | Status | Workstream (if KEEP) | Evidence / Reasoning |
* |---|---|---|---|---|
* | 1 | `dbrownla5/Dashboard-` | **KEEP** | Creative Co-Pilot / Sounding Board Engine (TWLC internal tool) | Inspected. Active `src/App.tsx` is the Creative Co-Pilot. `outputs/manus\\\_build\\\_directive.md` is marked PRODUCTION READY. Branch `claude/extract-copy-consolidate-K17g3` open. |
* | 2 | `team-project-build` | **KEEP** | Voice canon source-of-truth (`claude/extract-repo-copy-SIlf7/COPY.md`) | Stated by Dayna as the canon. Could not access from this session. |
* | 3 | `well-lived-citizen-site` | **KEEP** (probable) | TWLC marketing site v? | Name matches active business domain. Confirm whether this or repo #4 is the live site. |
* | 4 | `the-well-lived-citizen-rebuild` | **INVESTIGATE** | (likely TWLC marketing site, current build) | "rebuild" suggests it supersedes #3. Operator: confirm which one is live on `TheWellLivedCitizen.com` — KEEP the live one, ARCHIVE the other. |
* | 5 | `Well\\\_Livedv5.1` | **INVESTIGATE** | (likely TWLC app/site, version 5.1) | Versioned name suggests one of several iterations. If superseded by #4, **ARCHIVE**. |
* | 7 | `Propertyv050826` | **INVESTIGATE** | (unclear — not in known TWLC workstreams) | "Property" + date-stamp `050826`. Could be a real-estate / listing prototype, or a one-off. Operator: confirm relevance. Default recommendation: **ARCHIVE** unless tied to House Calls / legacy services. |
* 17 were not enumerated in this session and `gh repo list` is not
* available (GitHub MCP scope is `dbrownla5/dashboard-` only). Each row
* below is a placeholder for the operator to fill.
* | # | Repo | Status | Workstream | Notes |
* | 8 | \[PASTE] | INVESTIGATE | — | — |
* | 9 | \[PASTE] | INVESTIGATE | — | — |
* | 10 | \[PASTE] | INVESTIGATE | — | — |
* | 11 | \[PASTE] | INVESTIGATE | — | — |
* | 12 | \[PASTE] | INVESTIGATE | — | — |
* | 13 | \[PASTE] | INVESTIGATE | — | — |
* | 14 | \[PASTE] | INVESTIGATE | — | — |
* | 15 | \[PASTE] | INVESTIGATE | — | — |
* | 16 | \[PASTE] | INVESTIGATE | — | — |
* | 17 | \[PASTE] | INVESTIGATE | — | — |
* | 18 | \[PASTE] | INVESTIGATE | — | — |
* | 19 | \[PASTE] | INVESTIGATE | — | — |
* | 20 | \[PASTE] | INVESTIGATE | — | — |
* | 21 | \[PASTE] | INVESTIGATE | — | — |
* | 22 | \[PASTE] | INVESTIGATE | — | — |
* | 23 | \[PASTE] | INVESTIGATE | — | — |
* | 24 | \[PASTE] | INVESTIGATE | — | — |
* These names appear in canon and should be **ARCHIVE** if they exist as
* repos under the GitHub account:
* 
* `@velvetnomad` (brand name retired)
* 
* Kulu (project complete)
* 
* Vern (project complete)
* 
* Replit app (killed, not using)
* 
* Grailed integration (killed)
* 
* Depop integration (banned)
* | Workstream | Owning repo(s) |
* | **Voice canon (source-of-truth)** | `team-project-build` |
* | **Creative Co-Pilot / Sounding Board engine** (internal tool) | `Dashboard-` |
* | **TWLC marketing site** (live) | one of: `well-lived-citizen-site` / `the-well-lived-citizen-rebuild` — operator to confirm |
* | **DOOR 1–3 deliverables** (Reset / Record / Routine) | currently lives inside `Dashboard-` Master Roadmap; no dedicated repo yet |
* | **CMS (zero-code site updates)** | not yet built — Roadmap pillar #2 |
* This session could not reach beyond `dbrownla5/dashboard-`. To finish the
* full extraction the user asked for, the operator (Dayna or a session
* with broader scope) needs to:
* 
1. **Grant or run with full repo scope** (e.g., `read:org`, `repo`) so a
* single agent can hit all 24 repos.
* 
2. **Ingest `team-project-build:claude/extract-repo-copy-SIlf7/COPY.md`**
* into the next session's context. That file is the voice-canon
* source-of-truth; the `COPY.md` in this repo is a local extract and
* must be reconciled against it.
* 
3. **For each of repos #3–7 above** (`well-lived-citizen-site`,
* `the-well-lived-citizen-rebuild`, `Well\\\_Livedv5.1`,
* `Resell-Google-App-v5.3.2026`, `Propertyv050826`):
* 
* Create branch `claude/extract-repo-copy-<5-char-suffix>` from default
* 
* Commit `COPY.md` at repo root
* 
* Open a **draft PR** titled
* `chore(copy): extract markdown copy canon — <repo>` into the
* \--limit 40 --json name,description,updatedAt,isArchived,defaultBranchRef`)
* and paste names into rows #8–24 above.
* 
5. **Confirm site-rebuild question**: which of #3 vs #4 is live on
* `TheWellLivedCitizen.com`. The other becomes ARCHIVE.
* 
6. **Confirm `Propertyv050826` relevance**. If it isn't tied to House
* Calls, Legacy, or any active workstream → ARCHIVE.
* gh repo list dbrownla5 --limit 100 \\
* \--json name,description,updatedAt,isArchived,defaultBranchRef,visibility \\
* | jq -r '.\[] | \[.name, (.updatedAt|split("T")\[0]), .isArchived, .defaultBranchRef.name, .description] | @tsv' \\
* Paste the output here, and the next session can finalize the table

\---

## Section: domain\_check

### 📝 General Body Copy / Page Text

* async function checkDomainsAndPricing() {
* "thewelllivedLA.com",
* "welllivedcitizen.com"
* const response = await ai.models.generateContent({
* Also, research and compare the best/cheapest domain registrars for bundles or long-term ownership (Cloudflare, Porkbun, Namecheap, etc.) to find a better deal than Namecheap's renewal rates.
* console.log(response.text);
* checkDomainsAndPricing();

\---

## Section: domain\_info

### 📝 General Body Copy / Page Text

* const key = process.env.API\_KEY || process.env.GEMINI\_API\_KEY;
* async function getDomainInfo() {
* "thewelllivedLA.com",
* "welllivedcitizen.com"
* const response = await ai.models.generateContent({
* Compare Cloudflare, Porkbun, and Namecheap for long-term ownership.
* Provide step-by-step instructions for a Squarespace domain redirect for daynabrown.com to a new URL.`,
* console.log(response.text);

\---

## Section: firebase

### 📝 General Body Copy / Page Text

* const app = initializeApp(firebaseConfig);
* async function testConnection() {
* console.log("Firebase Engine Connected: Ready for operations.");
* if (error instanceof Error \&\& error.message.includes('offline')) {
* console.warn("Firebase is offline. Check net configuration.");

\---

## Section: firebase-applet-config

### 📝 General Body Copy / Page Text

* gen-lang-client-0138005396
* 1:826712554092:web:8fcec25c5da3992154b649
* AIzaSyC-4YP4QTgH\_qkniZQQqSuB6sjcQbjXnSA
* gen-lang-client-0138005396.firebaseapp.com
* ai-studio-ec00ba45-890a-4898-907c-0ee998ab06bb
* gen-lang-client-0138005396.firebasestorage.app

\---

## Section: firebase-blueprint

### 📝 General Body Copy / Page Text

* A luxury transition project (Next Chapter, Archives, etc.)
* Home Organization
* Legacy Archives
* Transition Support
* PR drafts, ads, and website copy
* Master project pipeline
* Resale bridge manifests
* Brand engine output

\---

## Section: lib

### 📝 General Body Copy / Page Text

* export function cn(...inputs: ClassValue\[]) {
* return twMerge(clsx(inputs));

\---

## Section: main

### 📝 General Body Copy / Page Text

* import './index.css';

\---

## Section: metadata

### 📝 General Body Copy / Page Text

* Creative Partner \& Brand Engine for The Well Lived Citizen. A structural command center for reconciling project versions (v5.0), refining brand copy, and generating Manus-ready build directives with a luxury operational focus.

\---

## Section: outputs

### 🗣️ Original Client Voice / Unpolished Business Thoughts

> - \\\*\\\*Copy\\\*\\\*: "Maybe you just moved and the boxes are winning. Maybe you have been looking at the same mess for three years and today is the day. I focus on what is actually not working in your space and what the real solution is for how you live."

> - \\\*\\\*Copy\\\*\\\*: "Did we forget to pack the parents? Modern families no longer live in the same city... House Calls bridges the real-life gaps that show up between visits, moves, downsizing, and everyday life."

> - Clothing/Standard Resale: 55% Me / 45% Client

> - "really i hit the mic in the app - you alll should know whenthey are typos - its transcript issues"

> - "i need to get new domains - thewelllivedLA.com, wornwell.com, wornwellLA.com, wellplaced.com, wellplacedLA.com, thewelllived.com, welllivedcitizen.com"

### 📝 General Body Copy / Page Text

* **Status**: PRODUCTION READY
* 
* **Business Name**: The Well Lived Citizen
* 
* **Parent Entity**: Well Dressed Citizen LLC
* 
* **Primary Tagline**: "Well Placed. Well Dressed (again). Transitions done Well."
* 
* **Tagline**: The Last Box
* 
* **Rate**: $150 / hr (3-hour minimum)
* 
* 10hr Block: $1,250 ($125/hr savings)
* 
* **Flat Rate**: Move-In Setup: $1,200/day (8 hours)
* 
* **Tagline**: The Archives
* 
* **Rate**: From $3,500 (Project-based)
* 
* **Hourly Basis**: $175 / hr (for additional work or smaller projects)
* 
* **Deliverable**: Physical Leather Book with on-the-spot high-quality prints and research data.
* 
* **Note**: Flex blocks do NOT apply to Legacy Catalog work.
* 
* **Tagline**: The Last Detail
* 
* **Tagline**: The Last Look
* 
* **Structure**: Concierge model. No minimums. Payouts by the 5th of every month.
* 
* **Commission Split**:
* 
* Designer \& Furniture: 50% / 50%
* 
* **Flex Blocks**: Never expire.
* 
* **Large Estates**: Always marked as "Quoted after walkthrough."
* 
* **Referrals**: Internal rate of $100/hr (Do not publish).
* 
* **Service Language**:
* 
* Use "Major life transition" or "Next chapter" instead of "death" or "will".
* 
* **Business Phone**: (323) 433-1350
* 
* **Main Domain**: TheWellLivedCitizen.com
* 
* **Squarespace Redirect**: daynabrown.com must redirect to the parent homepage.
* Started: 2026-04-03T16:19:42-07:00
* Projects Active: The Well Lived Citizen (The Engine), Manus Build Directives
* ━━━━━━━━━━━━━━━━━━━━━━
* 
* You are the **Structural Database**.
* 
* Your output is the logic and copy for **Manus (The Switchboard)**.
* 
* Manus is a literalist; provide exact, consumer-facing copy.
* 
* The previous domain troubleshooting task is **RETIRED** and **NO LONGER RELEVANT**.
* DECISION LOCK — March 2026
* CORRECTIONS — DO NOT REPEAT
* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
* VOICE DUMP — 2026-04-03 16:23:30
* PROJECT: The Well Lived Citizen
* MODE: Directive/Correction
* 
* "want a bundle or cheap namecheap only does 50% off on first then 12 each per - not cool"
* 
* Checking availability and pricing for a specific list of domains.
* 
* Setting up a proper domain redirect for daynabrown.com (Squarespace) to the new site.
* 
* Looking for a better deal than Namecheap's renewal rates.
* 
* \[LOCKED] Phone: (323) 433-1350 is the active Google Voice number.
* 
* \[LOCKED] Redirect any new domains purchased for the services under the umbrella should redirect to parent homepage .com to the main site.
* | Task | Who | Priority |
* |------|-----|----------|
* | Check domain availability for the list | Claude | High |
* | Research cheaper domain bundles/registrars (Porkbun, Cloudflare, etc.) | Claude | Med |
* | Provide instructions for Squarespace domain redirect | Claude | Med |
* NEXT ACTION: Generate the "Manus Build Directive" containing all locked copy and logic for the site build.

\---

## Section: references

### 🗣️ Original Client Voice / Unpolished Business Thoughts

> My name is Dayna. I run The Well Lived Citizen (Thewelllivedcitizen.com), a DBA under Well Dressed Citizen LLC. ONE business, sole focus. Three service lines under one roof: home organization, legacy planning / storytelling concierge, and curated resale. I am based in Los Angeles.

> I communicate primarily via voice — I speak my thoughts and paste the transcript. Do not clean up my language. Do not sanitize my phrasing. Preserve my verbatim wording in all outputs.

> 1. Identify if I am in BRAINDUMP mode (thinking out loud, examples are illustrative not literal) or DIRECTIVE mode (telling you exactly what to do or what is wrong)

> 2. Do NOT clean up my language — preserve my exact phrasing

> - Do NOT say "ADHD closet edits" — I offer child-friendly sensory-friendly organization (ages 4-9) from personal experience, non-clinical

> - Do NOT justify my rates by comparing to gig apps

> - Do NOT take my braindump examples literally for marketing copy my examples should give you clear visuls to associate your own thinking

> - Do NOT search for old context when I am giving you current context

> - If you are about to add something I did not say, STOP and ask first

### 📝 General Body Copy / Page Text

* Copy the entire block below and paste it as your first message in the new AI.
* You are taking over an active work session from another AI. Follow these instructions exactly.
* When I paste a voice transcript:
* 
3. Mark anything unclear as \[UNCLEAR] — never fill in gaps
* 
4. Identify which project it relates to
* 
6. End every response with a single clear NEXT ACTION
* 
8. If a braindump contains specific examples (a fur coat, a china set, coins), extract the PRINCIPLE — do not put the literal example in client-facing copy
* 
* Do NOT mention elder work or "elder care" — it is a capability within legacy planning and home org, not a standalone service
* 
* Do NOT say "fall prevention" — describe the specific action instead
* 
* Do NOT add attorney referrals, appraiser referrals, interior designer referrals, or scam protection
* 
* Do NOT use "daily/weekly/monthly/never" in customer-facing copy
* 
* Do NOT revert to old pricing, old project names, or old brand names
* 
* Flex blocks NEVER expire
* 
* Larger estates are QUOTED AFTER WALKTHROUGH — not a fixed tier
* 
* Claude owns strategy, decisions, copy, and the Decision Lock. Claude produces the handoff.
* 
* Zero fluff. No "hope this helps." No "great question."
* 
* Don't introduce new ideas mid-task — finish what's in front of you
* 
* Don't apologize repeatedly — acknowledge, fix, move on
* 
* If something is unclear in a transcript, ask ONE specific question
* 
* Maintain running session summary after every transcript processed

\---

## Section: vite.config

### 📝 General Body Copy / Page Text

* const env = loadEnv(mode, '.', '');
* plugins: \[react(), tailwindcss()],
* 'process.env.GEMINI\_API\_KEY': JSON.stringify(env.GEMINI\_API\_KEY),
* '@': path.resolve(\_\_dirname, '.'),
* hmr: process.env.DISABLE\_HMR !== 'true',

\---

