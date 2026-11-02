# Sidenav — Design Spec

Audience: dev. Describes **what was designed** and **the logic behind each decision** for the left-side navigation surfaces that landed in commit `b39caaa`. Companion to [AGENCY_SPEC.md](./AGENCY_SPEC.md); whenever this doc routes to an agency surface, that doc has the agency-side rules.

---

## 1. User profile button (identity + plan tier)

The user card sits at the top of the sidenav, immediately under the NorbieLink wordmark. It is the only persistent identity surface in the chrome, so it has to tell the signed-in user three things at a glance:

1. **Who they are** — their display name.
2. **Which agency they're acting as** — the active agency context, since one person could manage several.
3. **What plan tier they're on** — whether their agency has ProSuite entitlements active.

### Layout

```
┌───────────────────────────────────────┐
│ ┌─────┐  Display Name           ⌄    │
│ │ JS  │  Acme Insurance Agency       │
│ │(PRO)│                              │
│ └─────┘                              │
└───────────────────────────────────────┘
```

- **Line 1**: display name, 13px bold, deep slate `#2D3653` (light) / `#F9FAFB` (dark).
- **Line 2**: agency name, 11px medium, muted gray `#6B7280` (light) / `#D1D5DB` (dark). Truncates with `…` on overflow.
- **Avatar**: 36×36 circle; falls back to the user's uploaded photo, otherwise shows the two-letter teal-gradient initials.
- **PRO pill**: razz-gradient (`#5C2ED4 → #A614C3`) oval anchored to the avatar's bottom-right. Carries a `#FFFFFF` (or `#0F1120` in dark) ring + a `rgba(92,46,212,0.35)` drop shadow so it reads as a crown-style badge, not an overlapping clip.

### Rules

- The agency subtitle **replaces** the generic "ProSuite Member" label that used to live on line 2. Agency identity is more useful than plan identity for day-to-day context, and the plan is now carried by the PRO badge instead.
- The PRO pill renders **only when the user's agency is on the ProSuite plan** (gated by `isProSuite`). Base-plan agencies see the avatar without the badge — no empty frame, no greyed-out variant.
- The "My Account" dropdown row and the expanded Profile pane header both carry the same identity context on a single line: `displayName · ProSuite Member · agencyName`, where the middle segment is omitted for base-plan users. This keeps the three surfaces (sidenav card, dropdown, pane) saying the same thing in the same order.

### Mock values (today)

```
agencyName  = "Acme Insurance Agency"
isProSuite  = true
```

Both are constants in `Sidenav.tsx`. When auth lands, swap them for the authenticated user's agency + plan.

---

## 2. Accounting group + Statements shortcut

### 2.1 Rename

The sidenav parent previously labelled **"Payment Info"** is now **"Accounting"**. The icon (calculator) and chevron behaviour are unchanged.

**Why.** External agency users don't think of their Commission Statements and Statement of Account as "payment info" — those live in the agency's Accounting workflow, with payment-method forms being one child of that larger topic. "Accounting" matches both the terminology on the agency detail page (where there's an Accounting tab) and the mental model of our target users.

### 2.2 Children (in order)

1. **eCheck / Credit Authorization Form** — existing form link; unchanged.
2. **Payment Types** — existing content; unchanged.
3. **Statements** — new. Direct shortcut to the user's own Commission Statements / Statement of Account.

### 2.3 Statements routing

Clicking **Statements** routes to the external-client Agency detail surface (`clientMode`), pinned to the Accounting tab and relabelled.

```
Sidenav: Accounting → Statements
            │
            ▼
DashboardShell case: "Accounting · Statements"
            │
            ▼
<Agencies clientMode
          initialTab="accounting"
          pageTitleOverride="Accounting" />
            │
            ▼
AgencyDetailView (viewMode="client")
   ├── h1 = "Accounting"  (pageTitleOverride wins over the default "Admin")
   ├── Agency header card (unchanged)
   └── Agency tabs row with "Accounting" preselected
```

**Rules**:

- The route reuses the same `Agencies` module used by Admin and Agencies — no second component tree. State for the pinned agency (bookRolled, inactiveUserIds, …) is isolated from the Admin and internal-staff instances by a distinct React `key` (`agencies-statements`), so interactions here don't leak to the other mountings.
- `pageTitleOverride` is a surgical knob that wins over the default `viewMode === "client" ? "Admin" : "Agencies"` title. It exists specifically so the h1 can read "Accounting" when the user clicked a sidenav item labelled "Statements" under "Accounting" — otherwise the h1 would say "Admin" and feel disconnected from the breadcrumb context.
- "Accounting · Statements" is added to the shell's `fullHeightPages` list so the route renders at the same full-viewport height as the other table-heavy pages (Clients, Agencies, Admin, Quotes, Policies, Endorsements).
- Only external agency users see this shortcut; the internal BTIS staff view of the sidenav is unchanged.

### 2.4 Non-goals

- No new content was added to the Accounting tab for this release — the shortcut takes users to the **existing** Accounting tab on the agency detail surface. If the Statements surface needs its own view later (e.g. a flat list of statements across years without the surrounding agency chrome), that's a follow-up.
- The route doesn't pre-filter by statement type or year. The user lands at the top of the tab and uses the existing filters there.
