# Architecture Decision: Multi-Step Forms + Member Portal Auth
**Sprint:** 04-05 | **Date:** 04-06-2026
**Status:** Draft — for Sagie's review and decision

---

## 1. Current Form Inventory

| Form | Route | Fields Collected | Notion DB |
|------|-------|-----------------|-----------|
| Membership (ECO) | /apply | Name, email, phone, LinkedIn, country/city, role, interests, 3 open questions, referral | Member DB |
| Chapter Lead | /apply/chapter | Name, email, city info, motivation | (via membership DB?) |
| Solutions Provider | /apply/solutions | Name, email, expertise, portfolio | Solutions DB |
| Ventures — Founder | /apply/ventures/founder | Name, email, company, stage, pitch | Ventures Intake DB |
| Ventures — Investor | /apply/ventures/investor | Name, email, firm, thesis, check size | Ventures Intake DB |
| Contact | /contact | Name, email, subject, message | (email only?) |
| Suggest Event | /suggest-event | Name, event details + email (being added) | Event DB |

**Total:** 7 forms collecting overlapping PII across separate Notion databases.

---

## 2. The Problem

When the member portal launches, users will sign up and create a profile. That profile will contain most of the data currently collected across these forms:
- Name, email, phone, LinkedIn → profile basics
- Country/city → profile location
- Role, interests → profile preferences
- Company, stage, expertise → profile professional context

**Without consolidation:** Users fill out the same fields repeatedly across forms. The portal profile becomes yet another data silo alongside 4+ Notion databases.

**With consolidation:** Sign-up captures the universal fields once. Each form becomes a thin "intent layer" — just the fields specific to that action (e.g., "Why do you want to lead a chapter?" for chapter lead, "What's your investment thesis?" for investor).

---

## 3. Multi-Step Form Architecture

### Recommended pattern: Wizard with progress indicator

Think of it like an onboarding flow — each step is a screen, progress bar at top, back/next navigation. Like Typeform but built into the site.

**Step structure for membership (as example):**
```
Step 1: About You (name, email, phone, LinkedIn)
Step 2: Location (country → state → city)
Step 3: Your Role (role selector, interests checkboxes)
Step 4: Tell Us More (3 open questions)
Step 5: Review + Submit (summary of all inputs, consent checkbox)
```

**Technical implementation options:**

| Approach | How it works | Pros | Cons |
|----------|-------------|------|------|
| **A. Client-side wizard** | Single page, react-hook-form with step state, show/hide sections | Simple, fast, no URL changes | Can't bookmark a step, loses progress on refresh |
| **B. URL-based steps** | Each step is a route segment `/apply/step-1`, `/apply/step-2` | Bookmarkable, browser back works | More complex routing, need to persist data between pages |
| **C. Hybrid** | Single page with `nuqs` URL params for step tracking | Best of both — URL reflects state, single-page performance | Slightly more complex than A |

**Recommendation:** Option C (Hybrid). You already use `nuqs` for URL state on blog/events/resources. The pattern is established.

```
/apply?step=about-you
/apply?step=location
/apply?step=your-role
/apply?step=tell-us-more
/apply?step=review
```

### Data persistence between steps
- **react-hook-form** already holds all data in memory across the wizard
- Add `sessionStorage` backup so data survives accidental refresh
- On final submit, send everything to the API route in one POST

---

## 4. Form Consolidation for Portal

### Phase 1 (now): Multi-step forms, no portal
- Implement wizard pattern on the membership form first (it's the most complex)
- Other forms keep current single-page layout but get the validation UX improvements
- All forms POST to their existing API routes

### Phase 2 (portal launch): Unified profile + thin intent forms
- Sign-up creates a profile (universal fields captured once)
- Membership form → just the 3 open questions + interests (profile has the rest)
- Chapter lead → just motivation + city proposal
- Solutions provider → just expertise + portfolio
- Ventures founder → just company + stage + pitch
- Ventures investor → just firm + thesis + check size
- Contact → just subject + message (profile has name/email)

### Data migration
- Existing Notion databases remain the source of truth for historical submissions
- New portal writes to its own DB (Supabase/Clerk user profiles)
- Notion receives a copy via API webhook for the team's existing workflow
- No migration of old data needed — it's archived in Notion

---

## 5. Auth Decision: Clerk vs Supabase Auth

### Context
The member portal needs authentication. Two strong options for the Next.js ecosystem:

### Clerk

| Dimension | Assessment |
|-----------|-----------|
| **Setup speed** | Fast — drop-in React components, hosted UI, 5-minute integration |
| **Auth features** | Email/password, social login (Google, LinkedIn, GitHub), magic link, MFA |
| **User management** | Built-in dashboard for viewing/managing users, organizations |
| **Next.js integration** | First-class — `@clerk/nextjs` with middleware, server components, App Router support |
| **Pricing** | Free up to 10K MAUs, then $0.02/MAU. Free tier is generous for SAGIE's scale. |
| **Data ownership** | Clerk hosts user data. You access via API. Can export but don't own the DB directly. |
| **LinkedIn OAuth** | Built-in social provider — one toggle in dashboard |
| **Custom UI** | Possible but less flexible than Supabase — components are styled but opinionated |

### Supabase Auth

| Dimension | Assessment |
|-----------|-----------|
| **Setup speed** | Medium — more configuration, you build the UI, but straightforward |
| **Auth features** | Email/password, social login, magic link, MFA, phone auth |
| **User management** | Dashboard available, but less polished than Clerk |
| **Next.js integration** | Good — `@supabase/ssr` for server components, middleware helpers |
| **Pricing** | Free up to 50K MAUs. The free tier includes auth + database + storage. |
| **Data ownership** | Full ownership — Postgres database you control. Can self-host. |
| **LinkedIn OAuth** | Supported but requires manual OAuth app setup |
| **Custom UI** | Full control — you build every component, which means it matches your brand perfectly |

### Recommendation: **Supabase Auth**

**Why:**
1. **Data ownership** — SAGIE is building an ecosystem. Owning the user database (Postgres) gives you full control over the data model, queries, and future features (matching, recommendations, activity feeds) that Clerk's API can't support as flexibly.
2. **Bundled database** — You get auth + database + storage in one service. The portal will need to store more than just auth data (profile details, activity, connections). Supabase gives you a full Postgres DB alongside auth.
3. **Cost at scale** — 50K free MAUs vs 10K. And when you exceed free tier, Supabase is cheaper per user.
4. **Custom UI** — SAGIE has a distinctive dark-mode aesthetic. Building your own auth UI means it matches the brand perfectly. Clerk's components would need heavy customization to not look like Clerk.
5. **No vendor lock-in** — Supabase is open source. Worst case, you self-host.

**Trade-off:** More setup work than Clerk. But for a portal that will be a core product surface, the investment in ownership pays off.

---

## 6. Next Steps

1. **This sprint:** Sagie reviews and decides on auth (Clerk vs Supabase)
2. **Next sprint:** Implement multi-step wizard on membership form (Phase 1)
3. **Sprint after:** Set up Supabase project, implement auth flow, build profile schema
4. **Following sprint:** Connect forms to portal, begin Phase 2 consolidation

---

## Decision Needed From Sagie

- [ ] Confirm auth choice: Clerk or Supabase?
- [ ] Confirm wizard pattern (Option C — hybrid with nuqs) or prefer a different approach?
- [ ] Which form gets the multi-step treatment first? (Recommendation: membership)
- [ ] Any fields to add/remove from the current forms before portal consolidation?
