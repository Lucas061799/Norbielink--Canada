"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { X, Search, Users, ChevronDown } from "lucide-react";

// -----------------------------------------------------------------------------
// First-run Team Setup modal.
//
// Trigger (mock): the agency was just created and only the primary contact is
// an Admin. The signed-in user IS that primary contact (already an Admin, and
// can't remove themselves here); they pick who else gets Admin permission and
// confirm each person's Job Title.
//
// Three dismissal surfaces (owned by DashboardShell):
//   1. This modal   — primary push on sign-in
//   2. Banner       — fallback on the Marketplace home when the modal is X'd
//   3. Bell entry   — final fallback when the banner is X'd
//
// Visual language matches Agencies > Add User modal: 2xl rounded card, 620px
// wide, Montserrat throughout, razz-gradient primary CTA. The row-level
// controls — Job Title dropdown + Admin toggle — are 1:1 with the Add User
// counterparts so the two surfaces read as one system.
// -----------------------------------------------------------------------------

const FONT = "var(--font-montserrat), Montserrat, sans-serif";
const RAZZ_GRAD = "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)";
const JOB_TITLES = ["Principal", "Producer", "CSR", "Accounting", "Account Manager"];

type MockUser = {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  isAdmin: boolean;
  isYou?: boolean; // signed-in primary contact — Admin is locked on
};

// Mock seed — starts with the Acme Insurance Agency (agencyId=1) roster in
// Agencies.tsx, EXCEPT only the primary contact (Jason, the signed-in user)
// starts as admin. The prompt is for them to pick any other admins. The
// extra agents after Diane stand in for a large agency so the scrolling
// list can be seen.
const SEED_USERS: MockUser[] = [
  { id: "u1",  name: "Jason Smith",  email: "jason@acmeins.com",   jobTitle: "Principal", isAdmin: true, isYou: true },
  { id: "u3",  name: "Tom Garfield", email: "tom.g@acmeins.com",   jobTitle: "Producer",  isAdmin: false },
  { id: "u4",  name: "Amy Chen",     email: "amy.chen@acmeins.com",jobTitle: "Producer",  isAdmin: false },
  { id: "u5",  name: "Brian Nguyen", email: "b.nguyen@acmeins.com",jobTitle: "Producer",  isAdmin: false },
  { id: "u6",  name: "Sandra Park",  email: "s.park@acmeins.com",  jobTitle: "",          isAdmin: false },
  { id: "u7",  name: "Lisa Wong",    email: "l.wong@acmeins.com",  jobTitle: "CSR",       isAdmin: false },
  { id: "u10", name: "Diane Kim",    email: "d.kim@acmeins.com",   jobTitle: "Accounting",isAdmin: false },
  { id: "u11", name: "Marcus Bell",     email: "m.bell@acmeins.com",      jobTitle: "Producer",        isAdmin: false },
  { id: "u12", name: "Priya Raman",     email: "p.raman@acmeins.com",     jobTitle: "Account Manager", isAdmin: false },
  { id: "u13", name: "Carlos Mendez",   email: "c.mendez@acmeins.com",    jobTitle: "Producer",        isAdmin: false },
  { id: "u14", name: "Hannah Lee",      email: "h.lee@acmeins.com",       jobTitle: "CSR",             isAdmin: false },
  { id: "u15", name: "Derek Owens",     email: "d.owens@acmeins.com",     jobTitle: "",                isAdmin: false },
  { id: "u16", name: "Fatima Noor",     email: "f.noor@acmeins.com",      jobTitle: "Producer",        isAdmin: false },
  { id: "u17", name: "Greg Patterson",  email: "g.patterson@acmeins.com", jobTitle: "Account Manager", isAdmin: false },
  { id: "u18", name: "Mei Tanaka",      email: "m.tanaka@acmeins.com",    jobTitle: "CSR",             isAdmin: false },
  { id: "u19", name: "Owen Burke",      email: "o.burke@acmeins.com",     jobTitle: "Producer",        isAdmin: false },
  { id: "u20", name: "Rachel Stein",    email: "r.stein@acmeins.com",     jobTitle: "Accounting",      isAdmin: false },
  { id: "u21", name: "Tyler Brooks",    email: "t.brooks@acmeins.com",    jobTitle: "",                isAdmin: false },
  { id: "u22", name: "Yolanda Diaz",    email: "y.diaz@acmeins.com",      jobTitle: "Producer",        isAdmin: false },
  { id: "u23", name: "Kevin O'Neil",    email: "k.oneil@acmeins.com",     jobTitle: "CSR",             isAdmin: false },
  { id: "u24", name: "Nina Petrov",     email: "n.petrov@acmeins.com",    jobTitle: "Producer",        isAdmin: false },
  { id: "u25", name: "Samuel Grant",    email: "s.grant@acmeins.com",     jobTitle: "Account Manager", isAdmin: false },
];

interface TeamSetupModalProps {
  isDark: boolean;
  open: boolean;
  onClose: () => void;       // X or Cancel
  onRemindLater: () => void; // "Remind me later" — same effect as X in the mock
  onSave: (users: MockUser[]) => void;
}

export default function TeamSetupModal({ isDark, open, onClose, onRemindLater, onSave }: TeamSetupModalProps) {
  const [users, setUsers] = useState<MockUser[]>(SEED_USERS);
  const [query, setQuery] = useState("");
  // One dropdown open at a time, keyed by user id ("" = none).
  const [openTitleFor, setOpenTitleFor] = useState<string>("");
  // Rows near the bottom of the scrolling list flip their dropdown upward so
  // it isn't clipped by the list's overflow.
  const [titleOpensUp, setTitleOpensUp] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const titleId = useId();
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Escape closes the modal — matches the DS Dialog convention. Only wired
  // while the modal is open so stray listeners don't pile up.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Move keyboard focus into the dialog on open so Tab lands on in-dialog
  // controls, not whatever was focused on the page behind the overlay.
  useEffect(() => {
    if (open) closeBtnRef.current?.focus();
  }, [open]);

  const bg          = isDark ? "#1E2240" : "#FFFFFF";
  const text        = isDark ? "#F9FAFB" : "#1F2937";
  // One step stronger than the usual muted grey — the intro and footer copy
  // carry real instructions here, so they need to be easy to read.
  const muted       = isDark ? "#C4C8D0" : "#4B5563";
  const border      = isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB";
  const rowDivider  = isDark ? "rgba(255,255,255,0.06)" : "#F3F4F6";
  const fieldBg     = isDark ? "rgba(255,255,255,0.04)" : "#FFFFFF";
  const searchBg    = isDark ? "rgba(255,255,255,0.04)" : "#F9FAFB";
  const togglePillBg= isDark ? "rgba(255,255,255,0.04)" : "#F8FAFC";

  const hasPrincipal = useMemo(() => users.some(u => u.jobTitle === "Principal"), [users]);
  const adminCount   = useMemo(() => users.filter(u => u.isAdmin).length, [users]);
  const missingTitleCount = useMemo(() => users.filter(u => !u.jobTitle).length, [users]);

  // Save only requires at least one admin — always true here because the
  // primary contact is locked on, so the user can save without adding anyone.
  // Job Titles are nice-to-have but NOT a save blocker: with 200+ users on a
  // real agency, forcing every title at setup time is a show-stopper. Anything
  // blank can be filled in later from the Users tab (per-row dropdown) or via
  // Edit User.
  const canSave = adminCount > 0;

  const filteredIds = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return new Set(users.map(u => u.id));
    return new Set(
      users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)).map(u => u.id),
    );
  }, [users, query]);

  if (!open) return null;

  const updateUser = (id: string, patch: Partial<MockUser>) =>
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...patch } : u)));

  const toggleAdmin = (id: string) => {
    const u = users.find(x => x.id === id);
    if (!u || u.isYou) return;
    updateUser(id, { isAdmin: !u.isAdmin });
  };

  const setTitle = (id: string, title: string) => {
    updateUser(id, { jobTitle: title });
    setOpenTitleFor("");
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={() => { setOpenTitleFor(""); onClose(); }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="rounded-2xl w-[640px] max-w-[95vw] max-h-[92vh] flex flex-col"
        style={{ background: bg, boxShadow: "0 20px 60px rgba(0,0,0,0.25)", fontFamily: FONT }}
        onClick={e => { e.stopPropagation(); setOpenTitleFor(""); }}
      >
        {/* Header — razz-tinted icon tile + title + close, mirroring the
            "Import users from legacy BTIS" header. */}
        <div className="flex items-start justify-between px-7 pt-6 pb-5 flex-shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className="flex items-center justify-center flex-shrink-0 rounded-lg"
              style={{ width: 48, height: 48, background: "rgba(166, 20, 195, 0.10)" }}
            >
              <Users className="w-5 h-5" style={{ color: "#A614C3" }} strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <h2 id={titleId} className="text-[18px] font-bold" style={{ fontFamily: FONT, color: text }}>
                Who else should be an Admin?
              </h2>
              <p className="text-[12.5px] mt-1" style={{ fontFamily: FONT, color: muted, lineHeight: 1.5 }}>
                You&apos;re set as an Admin because you&apos;re the primary contact. Admins can view accounting
                statements and add, edit, or delete users. Turn on Admin for anyone who needs it, and check each
                person&apos;s Job Title.
              </p>
              <p className="text-[12.5px] mt-1.5" style={{ fontFamily: FONT, color: muted, lineHeight: 1.5 }}>
                You can add Admins anytime in{" "}
                <span style={{ fontWeight: 600, color: text }}>Admin › Users › Edit</span>.
              </p>
            </div>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-md flex-shrink-0 transition-colors cursor-pointer"
            style={{ background: "transparent", border: "none", color: muted, marginTop: 2, marginRight: -4 }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-7 pt-5 pb-4 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: muted }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search name or email..."
              className="w-full outline-none"
              style={{
                background: searchBg,
                border: `1px solid ${border}`,
                borderRadius: 12,
                padding: "10px 12px 10px 36px",
                fontFamily: FONT,
                fontSize: 13,
                color: text,
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* User list — capped at ~6 rows so large agencies scroll inside the
            list while the header, search and footer stay pinned. The half-
            visible last row hints that there's more below. */}
        <div ref={listRef} className="overflow-y-auto flex-1 px-7" style={{ minHeight: 160, maxHeight: 360 }}>
          {users.map((u, i) => {
            const visible = filteredIds.has(u.id);
            if (!visible) return null;
            const isLast = i === users.length - 1;
            const titleOpen = openTitleFor === u.id;
            // Principal is capped at one across the agency; disable the option
            // in every OTHER user's dropdown once someone holds it. Matches the
            // "Only 1 allowed" rule in the Add User modal.
            const principalTakenByOther = hasPrincipal && u.jobTitle !== "Principal";
            return (
              <div
                key={u.id}
                className="flex items-center gap-3 py-3"
                style={{ borderBottom: isLast ? "none" : `1px solid ${rowDivider}` }}
              >
                {/* Name + email */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[13.5px] font-semibold truncate" style={{ fontFamily: FONT, color: text }}>
                      {u.name}
                    </span>
                    {u.isYou && (
                      <span
                        className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0"
                        style={{ fontFamily: FONT, color: "#A614C3", background: "rgba(166, 20, 195, 0.10)" }}
                      >
                        You · Primary contact
                      </span>
                    )}
                  </div>
                  <div className="text-[11.5px] mt-0.5 truncate" style={{ fontFamily: FONT, color: muted }}>
                    {u.email}
                  </div>
                </div>

                {/* Job Title dropdown — same DropTrigger shape as Add User. */}
                <div className="relative flex-shrink-0" style={{ width: 170 }}>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      const listBottom = listRef.current?.getBoundingClientRect().bottom ?? Infinity;
                      setTitleOpensUp(listBottom - e.currentTarget.getBoundingClientRect().bottom < 230);
                      setOpenTitleFor(titleOpen ? "" : u.id);
                    }}
                    className="w-full px-3 py-2 rounded-lg text-[12.5px] flex items-center justify-between transition-colors cursor-pointer"
                    style={{
                      fontFamily: FONT,
                      background: fieldBg,
                      border: `1px solid ${border}`,
                      color: u.jobTitle ? text : muted,
                      boxSizing: "border-box",
                    }}
                  >
                    <span className="truncate">{u.jobTitle || "Select title"}</span>
                    <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 ml-1" style={{ color: muted }} />
                  </button>
                  {titleOpen && (
                    <div
                      className={`absolute left-0 right-0 ${titleOpensUp ? "bottom-full mb-1" : "top-full mt-1"} rounded-lg overflow-y-auto z-20`}
                      style={{ background: bg, boxShadow: "0 8px 24px rgba(0,0,0,0.18)", border: `1px solid ${border}`, maxHeight: 220 }}
                    >
                      {JOB_TITLES.map(t => {
                        const disabled = t === "Principal" && principalTakenByOther;
                        const selected = u.jobTitle === t;
                        return (
                          <button
                            key={t}
                            type="button"
                            disabled={disabled}
                            onClick={e => { e.stopPropagation(); if (!disabled) setTitle(u.id, t); }}
                            className="w-full text-left px-3 py-2 text-[12.5px] transition-colors"
                            style={{
                              fontFamily: FONT,
                              color: disabled ? muted : text,
                              background: selected ? (isDark ? "rgba(255,255,255,0.08)" : "#F9FAFB") : "transparent",
                              cursor: disabled ? "not-allowed" : "pointer",
                              opacity: disabled ? 0.6 : 1,
                            }}
                            onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.08)" : "#F9FAFB"; }}
                            onMouseLeave={e => (e.currentTarget.style.background = selected ? (isDark ? "rgba(255,255,255,0.08)" : "#F9FAFB") : "transparent")}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span>{t}</span>
                              {disabled && (
                                <span className="text-[10px] italic flex-shrink-0" style={{ color: muted }}>Only 1 allowed</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Admin toggle — identical pattern to Add User's toggle.
                    Locked on for the primary contact (you can't demote
                    yourself here). */}
                <div
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg flex-shrink-0"
                  style={{ background: togglePillBg }}
                  title={u.isYou ? "You're an Admin as the primary contact" : undefined}
                >
                  <span className="text-[11.5px] font-medium" style={{ fontFamily: FONT, color: text }}>Admin</span>
                  <button
                    type="button"
                    disabled={u.isYou}
                    onClick={() => toggleAdmin(u.id)}
                    aria-label={u.isYou ? "You're an Admin as the primary contact" : u.isAdmin ? `Remove ${u.name} as admin` : `Make ${u.name} admin`}
                    className="relative transition-all flex-shrink-0"
                    style={{
                      width: 34,
                      height: 20,
                      borderRadius: 9999,
                      border: "none",
                      padding: 0,
                      background: u.isAdmin ? RAZZ_GRAD : "#D1D5DB",
                      cursor: u.isYou ? "not-allowed" : "pointer",
                      opacity: u.isYou ? 0.6 : 1,
                    }}
                  >
                    <div
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
                      style={{ left: u.isAdmin ? 16 : 2 }}
                    />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredIds.size === 0 && (
            <div className="py-8 text-center text-[12.5px]" style={{ fontFamily: FONT, color: muted }}>
              No users match &quot;{query}&quot;.
            </div>
          )}
        </div>

        {/* Footer — status line + actions */}
        <div
          className="flex items-center justify-between px-7 py-4 flex-shrink-0 gap-3"
          style={{ borderTop: `1px solid ${border}` }}
        >
          <div className="text-[12px] min-w-0" style={{ fontFamily: FONT, color: muted }}>
            <span style={{ color: adminCount > 0 ? "#A614C3" : muted, fontWeight: 600 }}>
              {adminCount === 1 ? "Just you as Admin" : `${adminCount} admins, including you`}
            </span>
            {missingTitleCount > 0 && (
              <>
                {" · "}
                <span>{missingTitleCount} without Job Title — you can add them later</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={onRemindLater}
              className="px-3.5 py-2 rounded-lg text-[12.5px] font-semibold transition-colors cursor-pointer"
              style={{
                fontFamily: FONT,
                background: "transparent",
                border: `1px solid ${border}`,
                color: text,
              }}
            >
              Remind me later
            </button>
            <button
              type="button"
              disabled={!canSave}
              onClick={() => onSave(users)}
              className="px-4 py-2 rounded-lg text-[12.5px] font-semibold text-white whitespace-nowrap transition-all"
              style={{
                fontFamily: FONT,
                background: canSave ? RAZZ_GRAD : "#C7C9D4",
                border: "none",
                cursor: canSave ? "pointer" : "not-allowed",
                opacity: canSave ? 1 : 0.75,
              }}
            >
              {/* Same label at any admin count — being the only Admin is a
                  valid finish, and the footer already shows the count. */}
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
