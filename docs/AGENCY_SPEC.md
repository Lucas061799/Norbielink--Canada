# Agency Section — Design Spec

Audience: dev. This doc describes **what was designed** and **the logic behind each decision** for the Agency section. It is a functional spec, not implementation guidance.

---

## 1. Glossary

These terms appear throughout the UI and have specific business meanings. Do not rename without consulting design.

| Term | Meaning |
| --- | --- |
| **Appointed** | Agency has an active appointment with us. Can write new business. |
| **Unappointed** | Agency cannot write new business. Either never appointed, removed, or sold via Book Roll. |
| **NEW** | Agency was appointed within the last **12 months**. Visual indicator only. |
| **Dormant** | Active agency with **no login activity for > 12 months**. Visual indicator only. |
| **Book Roll** | Action that transfers an agency's entire policy book to another agency. The source agency becomes Unappointed (Sold). One-way; not reversible. |
| **BOR** | Broker of Record letter. Authorizes the agency to manage policies for a client. |
| **W-9** | Tax form. Re-uploaded when key tax info (name, EIN, address) changes; old W-9 auto-archived. |
| **E&O** | Errors & Omissions insurance certificate. Required, read-only, synced from external source. |
| **Recognition Tag** | Optional badge shown on Agency Status card: Strategic Partner / VIP / Rising Star. Multi-select, editable in Add/Edit forms. |
| **Principal** | The user who owns the agency relationship. Cannot be archived without first reassigning their accounts. |

### NEW vs Dormant — precedence rule

A brand-new agency that hasn't logged in yet would technically meet both conditions. **NEW always wins.** See `getAgencyTimeStatus()` for the canonical logic.

```
if appointment date is < 12 months ago → "new"
else if last login is > 12 months ago  → "dormant"
else                                    → null (no badge)
```

---

## 2. Agency List View

The top-level table of all agencies the user has access to.

### Columns
- **Star** — pin/favorite (per-user, persisted)
- **Agency Name** — sortable; clicking row opens Agency Detail
- **Agency Code** — short code used as ID across UI (e.g. `PION01`)
- **Location** — city, state
- **Status** — Appointed / Unappointed pill (Title Case, NOT all-caps)
- **Last Login** — date
- **NEW / Dormant** indicator — small purple/gray dot icon next to the status (see precedence rule)

### Filters
- Status filter pills: All / Appointed / Unappointed / **Dormant**
- Search bar — placeholder unified to: `By agency, agency code, or user`

### Rules
- Sort by Agency Name uses a simple ascending/descending arrow toggle (no dropdown).
- Star column is per-user and does not change agency state.

---

## 3. Agency Detail View

Opened by clicking an agency row. Has 6 tabs: **Overview**, **Quotes**, **Policies**, **Users**, **Documents**, **Notes**.

### 3.1 Hero (top of detail page)
Shows: agency name, agency code (brand teal `#74C3B7` in dark mode), Appointed/Unappointed badge, Recognition tags, and the NEW/Dormant indicator.

### 3.2 Overview tab — Info cards
- **Agency Status card** — two rows:
  - Row 1: Appointed / Unappointed (or "Sold" pill if book-rolled)
  - Row 2: Recognition tags, if any (Strategic Partner / VIP / Rising Star). Tags are Title Case, NOT uppercase.
- **Appointed Date card** — swaps to "Sold Date" when the agency has been book-rolled.
- Other cards: Address, Contact, Bill methods (Agency Bill / Direct Bill / Premium Finance), Affiliations, Direct Appointments (Workers Comp).

### 3.3 NPN (National Producer Number)

**NPN is a system field, not a user field.** It is fetched automatically from NIPR and surfaced read-only everywhere it appears.

**Rules:**
- **Source**: NIPR. The backend pulls it (no user-triggered "Verify" button in the UI). A prior Phase 1 flow had a `Verify with NIPR` button in the Add Agency form; that button was pulled on 2026-11-02 — NPN now shows up when the backend has populated it, otherwise shows the empty placeholder.
- **Where it displays**: Agency Detail (Overview tab info row) and the Admin / client surface. Not surfaced anywhere else today.
- **Edit permissions**: **nobody edits it in the UI** — not external agency users, not Shannon's team, not BTIS super admin. The field is rendered as a locked read-only input (muted background + lock icon) in both the Add Agency and Edit Agency forms, with a tooltip reading "NPN populated by backend / NIPR".
- **Empty state**: legacy / older agencies may not have an NPN on record. Render `—` as the value and keep the lock treatment. Do **not** show a "please enter NPN" prompt or an error state — missing NPN is a backend-sourcing concern, not a user action.
- **Onboarding**: the Add Agency form has no NPN entry field. Shannon's team enters License # + State and the backend takes care of looking up NPN separately.
- **ITC form**: ITC does not have an NPN field and does not need one. No ITC Pending Updates row for NPN; no mapping; no sync entry.

**Why this rule:** NPN is an authoritative identifier that must match NIPR. A hand-typed value is authoritative in the wrong direction — if the user types a value that disagrees with NIPR, the whole record becomes untrustworthy. Treating NPN like Agency Code (system-assigned, read-only) prevents that failure mode entirely.

---

## 4. Recognition Tags

Multi-select badges that highlight the agency's strategic standing. Editable from Add/Edit Agency form via checkboxes.

| Tag | Use case |
| --- | --- |
| Strategic Partner | Long-term high-value relationship |
| VIP | High premium volume / executive sponsorship |
| Rising Star | Strong recent growth |

**Display rules:**
- Title Case ("Strategic Partner"), not uppercase.
- Light mode background: `rgba(168,85,247,0.10)` with `#5C2ED4 → #A614C3` gradient text.
- Dark mode background: `rgba(168,85,247,0.22)` with `#A855F7 → #D946EF` gradient text (brighter for legibility).
- Persisted via `badgesOverride` so changes survive across sessions for the demo.

---

## 5. Documents tab

The Documents tab is the most complex surface. It manages all agency-related files.

### 5.1 Categories
1. **Broker of Record (BOR)**
2. **W-9**
3. **License**
4. **Agreements**
5. **Other**

### 5.2 View modes (toolbar)
- **All Documents** — flat list of every doc.
- **By Type** — grouped by category, with a category multi-select dropdown built into the button itself (shows "By Type" / "Category Name" / "X categories" depending on selection).
- **Table** — dense tabular view with sortable columns.

### 5.3 Toolbar actions
- **Archive** badge — count of archived docs, click to view archived list.
- **Trash** — moved-to-trash docs (with restore / permanently-delete actions).
- **Filter** (funnel icon) — multi-select category filter that mirrors the By Type dropdown.
- **Sort** — sort by name / date / category.
- **Search** — collapsible inline search.
- **Multi-select toggle** (CheckSquare icon) — enters select mode. While active, every doc row's file icon becomes a checkbox.
- **Upload** — opens the Document Upload modal.

### 5.4 Multi-select & bulk download
- Toggle with the CheckSquare button in the toolbar (matches the Notes pattern).
- In select mode, each row's `FileText` icon swaps to an empty checkbox; clicking selects it (filled gradient checkmark).
- Bulk action bar appears below the toolbar when select mode is on:
  - 0 selected → "Select documents to download" placeholder
  - ≥1 selected → "{N} document(s) selected" + gradient **Download N** button + Cancel
- Cancel exits select mode and clears selection.

### 5.5 Document Upload modal
- Drag-and-drop OR click to pick a file (PDF, JPG, PNG, max 10 MB).
- Category picker (required) — uses our branded dropdown.
- Filename is editable inline with a Replace action to swap files.

### 5.6 Documents Required modal (compliance gate)
- Triggered when user edits Agency Info and the change requires re-upload (e.g. tax ID change → new W-9; license expiry change → new license).
- **Save Changes is BLOCKED until uploads complete.**
- Drag-drop zone per required document.
- On save: old W-9 is auto-archived (W-9 archived label says "Replaced", not "Archived").

### 5.7 E&O Certificate
- Special read-only section at the bottom of All Documents view.
- Synced from external source — users do not upload E&O directly.
- Shows expiry date.
- **No "Read-only" badge** in the section header (intentionally removed — confused users).

### 5.8 Preview pane
- Right-side preview panel opens when clicking the eye icon on any doc row.
- Has expand/collapse — expanded mode is a right-side drawer matching the Notes drawer pattern.
- Shows breadcrumb (Documents › Category › Filename), meta strip, and a faux PDF body.

---

## 6. Users tab

Manages users associated with this agency.

### 6.1 Columns
Name, Job Title, Email, Phone, Last Login, **Status** (Active/Inactive badge), Actions.

### 6.2 Per-user actions
- **Reset Password** — fires a "Password reset link sent" toast.
- **Archive User** — always opens the **Reassign Accounts modal** first. Never undoable.

### 6.3 Archive User flow
1. User clicks Archive User.
2. Modal opens: "Continue" button → reassign step.
3. Reassign step: pick a target user to receive this user's accounts.
4. Confirm: "Reassign & Archive".
5. Toast confirms: "Their accounts went to {toName}." (No undo.)

The reasoning: **archiving a user with accounts must NOT orphan those accounts.** Reassignment is a hard requirement, hence one unified flow that ends in archive.

### 6.4 Principal handling
- Principal user is pinned at the top of the table.
- Same archive flow as anyone else (must reassign first).

### 6.5 Action menu position
- Action menu flips upward when the user row is near the bottom of the viewport. Prevents the menu from being clipped.

---

## 7. Book Roll

A destructive admin action. Sells the entire policy book to another agency.

### Flow
1. Admin clicks Book Roll.
2. **Step 1 — form:** pick target agency from a branded dropdown.
3. **Step 2 — confirm:** type the source agency's code to confirm. (Same pattern as deleting a GitHub repo.)
4. On confirm:
   - Source agency status flips to **Unappointed (Sold)**.
   - Appointed Date card flips to **Sold Date**.
   - Policies tab shows a gray banner: "These policies were transferred to {target} on {date}." with the table dimmed (`opacity: 0.65`, slight grayscale).
   - A "Sold to {targetCode}" pill appears on the agency card. **The pill is clickable** and navigates to the target agency's Policies tab.

Not reversible (in the demo).

---

## 8. Theming rules

The app supports light and dark mode. The Agency section enforces these conventions:

### Brand gradients
- **Light mode primary**: `#5C2ED4 → #A614C3` (purple → magenta)
- **Dark mode primary**: `#A855F7 → #D946EF` (brighter purple → fuchsia, for legibility)
- **Button gradient (`btnGrad`)** in dark mode adds a radial overlay on top of the linear gradient — used on Upload, Download N, and other primary CTAs.

### Brand teal
- `#74C3B7` (or `#73C9B7`) — used for agency codes, quote IDs, policy numbers, and active status pills in dark mode.

### Active button text in dark mode
- Yes/No, Agency Type (Retail/Wholesale), and Create Code buttons: when active, text is **solid white** in dark mode (gradient text in light mode). Gradient on dark backgrounds is hard to read.

### Inactive button border
- Use `c.border` (theme-aware), never hardcoded grays like `#E5E7EB`. Light gray borders look harsh in dark mode.

---

## 9. State persistence (demo notes)

These overrides exist so the demo behaves like a real app even though there's no backend:

| State | What it overrides |
| --- | --- |
| `badgesOverride` | Recognition tags after Save |
| `extraDocs` | Newly uploaded documents |
| `archivedDocIds` / `deletedDocIds` | Archive / Trash transitions |
| `docNameOverrides` | Renamed documents |
| `bookRolled` | Set of agencies that have been book-rolled |
| `removedUserIds` / `inactiveUserIds` / `statusInactiveUserIds` | User archive states |

When a real backend is wired up, these become regular DB writes — but the front-end state pattern stays the same.

---

## 10. Out of scope (intentionally)

- Hard delete of agencies (trash + permanent delete is doc-only).
- Manual override of NEW / Dormant indicator — purely date-driven.
- E&O upload from the agency-side UI — synced only.
- Undo for Archive User and Book Roll.

---

## 11. Agency creation & onboarding flow

This section answers the dev's clarification questions about communication and access provisioning.

### 11.1 Roles model (current)

Norbielink has **two permission tiers**, set per user:

| Role | `isAdmin` | What they can do |
| --- | --- | --- |
| **Admin** | `true`  | Add/remove/archive users, edit agency info, upload documents, run Book Roll |
| **Non-Admin** | `false` | View their own dashboard, work policies/quotes assigned to them |

`jobTitle` (Principal / Producer / CSR / Account Manager / Accounting) is a **label only** — it does not grant permissions. The mapping from job title → admin status is a convention, not a rule:

- **Principal** → Admin (always; this is the agency owner)
- Producer / Account Manager → can be either, defaults Non-Admin
- CSR / Accounting → typically Non-Admin

### 11.2 Who receives the initial invite email

**Only the Primary Contact** entered in the Add Agency form.

That person becomes the agency's **Principal** user, with `isAdmin: true`, and they own the relationship from there. After they finish onboarding, they invite the rest of their team themselves from the Users tab. We do **not** invite other contacts (Inspection / Accounting / Claims contacts on the Client side, or any secondary agency contact) — those are reference contacts only, not user accounts.

### 11.3 Primary Contact role assignment

The Add Agency form's Primary Contact section currently collects name + phone + email but does not surface a role picker. **The Primary Contact is always created as Admin (Principal).** Reasoning:

- They need to add the rest of their team — only Admins can do that.
- They need to maintain agency info, upload the W-9 / license / BOR, etc.
- They are the legally accountable party (Principal of the agency).
- Every Principal in our existing data is `isAdmin: true` — there is no precedent for a non-admin Principal.

Dev: **no role-picker UI is needed** at agency creation. The first user is always the Principal (admin). Additional users get their role chosen by the Principal later via Add User.

### 11.4 Approval before granting access

**No approval step in MVP.** The internal admin who creates the agency in Norbielink is the approver — that's why agency creation is gated behind admin permissions. We send the invite email **immediately on agency creation**.

If compliance later requires a "review before activation" gate, we can add an `Approved` boolean and a queue, but it is not in scope today.

### 11.5 End-to-end onboarding workflow

```
1. Internal admin opens Add Agency form
   ├── Fills agency info (name, address, agency type, EIN, etc.)
   ├── Fills Primary Contact (name, email, phone)
   ├── Clicks Create Code (or enters one manually)
   └── Submits

2. System creates:
   ├── Agency record (status: Appointed; appointed date = today)
   ├── Principal user (isAdmin: true, jobTitle: "Principal")
   │   ├── Account status: Pending Activation
   │   └── Password: not yet set
   └── Activation token (single-use, 7-day expiry)

3. System sends invite email
   ├── To: Primary Contact email
   ├── Subject: "Welcome to Norbielink — activate your account"
   ├── Body: Greeting · Agency Name + Agency Code · CTA button
   └── CTA links to: /verify?token=<activation-token>

4. Principal clicks email link
   ├── Lands on the existing "Verify your Code" page
   ├── Enters the verification code from the email
   ├── Sets a password (existing Create Password page)
   └── First login → lands on their agency dashboard

5. Principal is now active
   ├── Account status: Active
   ├── Can use Users tab to invite team members
   └── Can upload required docs (W-9, License, Agreements)
```

### 11.6 Email template (recommended copy — to be designed)

We do **not** have a template yet. Suggested baseline for the dev to wire up; final copy belongs to design / marketing.

```
Subject: Welcome to Norbielink — activate your account

Hi {{firstName}},

{{adminName}} at Norbielink has set up an account for {{agencyName}}
(Agency Code: {{agencyCode}}).

Click below to verify your email and create your password. The link
expires in 7 days.

[ Activate account ]   ← CTA button, links to /verify?token=...

If the button doesn't work, paste this into your browser:
https://app.norbielink.com/verify?token={{token}}

Need help? Reply to this email and we'll get back to you.

— The Norbielink team
```

**Variables required from the backend:**
- `firstName` — first name of Primary Contact
- `adminName` — internal admin who created the agency (for accountability)
- `agencyName`, `agencyCode`
- `token` — single-use activation token, 7-day TTL

**Token rules:**
- Single use (consumed on first verify)
- 7-day TTL
- If expired, a logged-in admin can re-issue from the Users tab → user row → "Resend invite"
- Re-issue invalidates any prior outstanding token for the same user

### 11.7 What if the Principal never activates

After 7 days the activation token expires. Suggested handling:
- User row in Users tab shows status = **Pending** (vs Active / Inactive).
- Admin can click "Resend invite" to issue a new token.
- We do NOT auto-archive — the agency relationship is real even if the Principal hasn't logged in.

### 11.8 Multi-Principal / Principal handover

Out of scope for MVP. If a Principal leaves, the existing **Archive User flow** (Section 6.3) forces an account reassignment to another user, who then becomes the effective Principal. We don't currently let two users hold the Principal title simultaneously.

---

## 12. Admin-gated features

Features gated to `isAdmin: true` users. Non-admin users do not see the entry point at all (hide, don't disable) — no sidenav link, no tab, no action row.

### 12.1 Accounting → Statements

- **Who sees it**: Admin users only (`isAdmin: true`), on both the Agency Detail → Accounting tab and the sidenav Accounting group.
  - Specifically the **Statements** sub-item (Commission Statement + Statement of Account). The other Accounting items (eCheck / Credit Authorization Form, Payment Types) remain visible to all users on the agency.
- **Why**: Commission data is sensitive compensation information. Agency Principals control who on their team gets to see it; by default only they do. This matches how brokers already treat commission reports today (Principal-only email distribution).
- **Non-admin behavior**: The Statements row is omitted from the sidenav Accounting group and from the Accounting tab's sub-nav. Direct URL navigation returns the user to the Accounting tab's default sub-tab with no error message (treated as not-found, not permission-denied, to avoid confirming the surface exists).
- **Internal (BTIS) view**: Internal users always see Statements regardless of impersonation state. When impersonating a non-admin agency user via "Start a Quote", the chrome still reflects internal visibility — Statements remains visible — because the impersonation is scoped to quote submission, not to full UI role masking.

---

## 13. Open questions for backend

- What is the source of truth for `apptDate` (used for NEW indicator)?
- What is the threshold for "Dormant"? Currently 12 months of no login — confirm.
- Recognition Tags: stored on the agency record, or a separate `agency_tags` table?
- Book Roll: does it create a snapshot/audit log, or just flip a flag?
- E&O sync: which provider? What is the polling interval / webhook trigger?
- W-9 auto-archive on tax ID change: is this server-side enforced, or only UI-side?
