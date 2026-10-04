# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary audience for the marketing site: engineering and PLM admins at manufacturers.** These are the CAD/PDM administrators and engineering change owners who run the release process. They know exactly what a BOM revision, a release and an ECO are, and they are usually the first to be blamed when a released change never reaches purchasing. They evaluate tools technically and skeptically: they want to see the mechanism, the access model and real screens, not slogans.

Secondary people who touch the product: purchasing / supply teams (who receive Baseline's drafted emails and update ERP) and IT/security (who must sign off on access to PDM and ERP). Not yet confirmed as audiences the site must persuade directly.

## Product Purpose

Baseline is an agent that keeps the BOM engineering designed and the BOM purchasing buys in step. It reads PDM and ERP, notices when a release in PDM has not reached ERP intact, explains what differs and why, routes it to the person who can fix it with a suggested next step, and closes the issue only when a fresh read shows both systems agree.

Success: wrong parts are caught before they are ordered, and engineering stops discovering mismatches after the fact.

**Stage: pre-launch.** The site's job right now is to book demo calls with qualified manufacturing teams.

## Positioning

Baseline sits in the handoff between engineering and purchasing, beside PDM and ERP rather than inside them. It is read-only on both systems, people approve every message it sends, and "closed" means verified by re-reading the systems, not by someone replying. It is not a PLM replacement and not an ERP module.

## Operating Context

- Engineering releases a revision in PDM (e.g. "DA-1000 Drive assembly Rev C released"); ERP may still hold the previous revision's BOM.
- Baseline compares the two on every release and on a schedule.
- Workflow, as described on the site: **Connect → Watch → Decide → Confirm** (home page summarizes it as Notice → Explain → Resolve).
- Inputs: read-only connections to PDM and ERP, or BOM exports uploaded as spreadsheets/CSV.
- Setup is done with the customer before going live: which assemblies to watch, who owns what, how urgent each kind of mismatch is.
- Demo offer: walkthrough on example assemblies, conversation about the customer's PDM/ERP, nothing to install for the demo.

## Capabilities and Constraints

Confirmed product surfaces (shown on the site):
- **Dashboard**: open mismatches ranked by urgency, starting with the part whose order goes out soonest.
- **Alert detail** (e.g. BL-101): what differs (PDM qty Rev C vs ERP qty Rev B), severity, likely cause, recommended next step, actions such as "Prepare email to supply team" or "Accept as intentional".
- **Compare**: any two BOMs side by side, from PDM, ERP or a spreadsheet.
- Drafted emails send from the approving person's own account.

Hard constraints future copy must respect:
- Never write to PDM, ERP or the change-order system.
- A person approves every outgoing message.
- Rules, roles and visibility are agreed with the customer before go-live.

Terminology: PDM, ERP, BOM, release, revision (Rev B / Rev C), mismatch, alert, assembly, supply team.

**Undecided:** the specific PDM and ERP systems supported are not final. Copy must keep saying "your PDM and ERP" (plus spreadsheet/CSV upload) and must not name vendors as supported integrations.

Existing site: static HTML/CSS/JS in `baseline-website/` (five pages: Home, Product, How it works, Trust, Contact/Book a demo), previewed with `node baseline-website/serve.js` on port 5173.

## Brand Commitments

- Name: **Baseline**. Logo: `logo.svg` (teal #0F766E mark with a mint #2DD4BF outline).
- **The logo always keeps its own colours** (user direction). Never use a recoloured or light variant (`logo-light.svg` is retired). If the logo would sit on a dark background, change the background behind it instead.
- Voice on the current site: plain, concrete, calm, written for people who know the domain; short sentences, no hype, explains mechanism and safeguards rather than claiming outcomes.
- Primary call to action: **Book a demo**.

## Evidence on Hand

- Real product screenshots: `baseline-website/assets/img/screens/dashboard.png`, `alert-detail.png`, `compare.png`.
- The read-only / human-approval / verified-close safeguards (Trust page) are confirmed product facts.

**Absent, must not be fabricated:** customer names or logos, testimonials, quotes, case studies, pilot results, metrics or numbers of any kind (mismatches caught, savings, time saved), named PDM/ERP integrations, pricing, certifications or compliance claims.

## Product Principles

1. **Show the mechanism.** The audience runs release processes; earn trust by showing exactly what Baseline reads, compares and proposes, using real screens.
2. **Safety is the product, not a footnote.** Read-only access and human approval are what make the tool adoptable; state them early and plainly.
3. **No claims without evidence.** Pre-launch means no invented numbers, logos or integrations; specificity comes from the product itself.
4. **Speak the engineer's language.** Use real PDM/ERP/BOM terms precisely; never dumb it down or inflate it.
5. **Every path leads to a demo.** The site's single job right now is a qualified demo booking.
