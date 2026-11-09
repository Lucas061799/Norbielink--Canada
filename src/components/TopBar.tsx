"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Search, Bell, Users, Wrench, X, RotateCcw } from "lucide-react";
import btisLogo from "@/assets/btislogo.png";

interface TopBarProps {
  isDark?: boolean;
  activePage?: string;
  // Team Setup prompt plumbing. The shell owns the state; the bell shows a
  // mirror entry whenever `teamSetupBellVisible` is true and routes a click
  // back to `onOpenTeamSetup`.
  teamSetupBellVisible?: boolean;
  // When the shell raises the Users-tab coachmark it also halos the bell so
  // the user sees "this prompt also lives here" at the same beat. True while
  // the spotlight is on; cleared when the spotlight dismisses.
  teamSetupBellSpotlight?: boolean;
  onOpenTeamSetup?: () => void;
  onDismissTeamSetupBell?: () => void;
  // When set, the top bar surfaces a compact "Acting as <name>" chip beside
  // the bell so the internal user is reminded on every page that quotes they
  // start will post under this external user's account. Cleared via
  // onExitImpersonation (the chip's inline Exit).
  impersonation?: { userName: string; userEmail: string; agencyName: string; agencyCode: string } | null;
  onExitImpersonation?: () => void;
  // First-time teaching spotlight — lights up the chip with a halo + raises
  // a coachmark pointing at it so the user learns where to exit the acting-
  // as mode. One-shot per session; auto-dismisses after 8s.
  impersonationSpotlight?: boolean;
  onDismissImpersonationSpotlight?: () => void;
}

type NotifType = "team-setup" | "maintenance";

type Notification = {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  timestamp: string;
  actionLabel?: string;
};

const FONT = "var(--font-montserrat), Montserrat, sans-serif";
const RAZZ = "#A614C3";
const RAZZ_DEEP = "#5C2ED4";

// License entries pulled on 2026-10-30 pivot. See DashboardShell for the
// Team Setup prompt wiring: this bell entry is the final fallback surface
// after the modal and inline banner get dismissed.
const INITIAL_NOTIFS: Notification[] = [
  {
    id: "team-setup",
    type: "team-setup",
    title: "Finish setting up your team",
    body: "You're the only Admin for Acme Insurance Agency. Choose who else should be an Admin and confirm job titles.",
    timestamp: "Just now",
    actionLabel: "Set up team",
  },
  {
    id: "maint-nov-02",
    type: "maintenance",
    title: "Scheduled maintenance",
    body: "NorbieLink will be unavailable Sun Nov 2, 2026 from 2:00–4:00 AM PST for routine upgrades.",
    timestamp: "3 hours ago",
  },
];

// Single notification row. Lifted into its own component so the hover state
// (razz gradient-border + glow, mirroring the Sidenav NavItem active treatment)
// is per-row, not per-list, and so the ref-free style mutations stay scoped.
function NotifRow({
  isDark, textColor, mutedColor, dividerColor,
  isLast, sev, icon, title, body, timestamp, actionLabel,
  isDismissed, onAction, onDismiss, onRestore,
}: {
  isDark: boolean;
  textColor: string;
  mutedColor: string;
  dividerColor: string;
  isLast: boolean;
  sev: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  timestamp: string;
  actionLabel?: string;
  // Dismissed rows render with faded opacity + a restore affordance instead
  // of a dismiss X, so users can recover something they X'd by accident.
  isDismissed?: boolean;
  onAction: () => void;
  onDismiss: () => void;
  onRestore?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex gap-3 px-4 py-4 transition-colors"
      style={{
        background: hovered ? (isDark ? "rgba(255,255,255,0.04)" : "#F9FAFB") : "transparent",
        borderBottom: isLast ? "none" : `1px solid ${dividerColor}`,
        cursor: "default",
        opacity: isDismissed ? 0.55 : 1,
      }}
    >
      {/* Severity icon in a neutral chip — glyph color carries the hue, chip
          stays neutral so the row reads calmly. */}
      <div
        className="flex-shrink-0 flex items-center justify-center"
        style={{
          width: 32,
          height: 32,
          borderRadius: 9999,
          background: isDark ? "rgba(255,255,255,0.05)" : "#F3F4F6",
          color: sev,
        }}
      >
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span
            style={{
              fontFamily: FONT,
              fontSize: 13,
              fontWeight: 600,
              color: textColor,
              lineHeight: 1.3,
            }}
          >
            {title}
          </span>
          {isDismissed && onRestore ? (
            <button
              type="button"
              onClick={onRestore}
              className="flex-shrink-0 cursor-pointer inline-flex items-center gap-1"
              style={{
                background: "transparent",
                border: "none",
                padding: "2px 4px",
                color: "#A614C3",
                fontFamily: FONT,
                fontSize: 11,
                fontWeight: 600,
                marginTop: -2,
                marginRight: -4,
              }}
              aria-label="Restore"
            >
              <RotateCcw className="w-3 h-3" strokeWidth={2.4} />
              Restore
            </button>
          ) : (
            <button
              type="button"
              onClick={onDismiss}
              className="flex-shrink-0 cursor-pointer"
              style={{
                background: "transparent",
                border: "none",
                padding: 2,
                color: mutedColor,
                marginTop: -2,
                marginRight: -4,
              }}
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <p
          style={{
            fontFamily: FONT,
            fontSize: 12,
            color: mutedColor,
            lineHeight: 1.5,
            margin: "4px 0 0",
          }}
        >
          {body}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span style={{ fontFamily: FONT, fontSize: 11, color: mutedColor }}>{timestamp}</span>
          {actionLabel && (
            <button
              type="button"
              onClick={onAction}
              className="cursor-pointer"
              style={{
                background: "linear-gradient(to right, #5C2ED4 0%, #A614C3 65%)",
                color: "#FFFFFF",
                border: "none",
                padding: "5px 12px",
                borderRadius: 6,
                fontFamily: FONT,
                fontSize: 11,
                fontWeight: 600,
                boxShadow: "0 1px 3px rgba(92,46,212,0.3)",
              }}
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TopBar({ isDark = false, activePage, teamSetupBellVisible = true, teamSetupBellSpotlight = false, onOpenTeamSetup, onDismissTeamSetupBell, impersonation = null, onExitImpersonation, impersonationSpotlight = false, onDismissImpersonationSpotlight }: TopBarProps) {
  const hideSearch = activePage === "Quotes" || activePage === "Policies";
  const [open, setOpen] = useState(false);
  // `notifs` stays stable — dismissing an item adds its id to `dismissedIds`
  // rather than removing it from the list, so the user can recover anything
  // they X'd by accident via the "Show dismissed" toggle at the footer.
  const [notifs] = useState<Notification[]>(INITIAL_NOTIFS);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [showDismissed, setShowDismissed] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  // The team-setup entry is additionally gated by the shell-level flag so
  // dismissing it from here (adding to `dismissedIds`) AND the shell removing
  // it (setting `teamSetupBellVisible` false after the user clicks "Dismiss"
  // on any surface) both collapse it from the panel.
  const shellFilter = (n: Notification) => n.type !== "team-setup" || teamSetupBellVisible;
  const activeNotifs = notifs.filter(n => shellFilter(n) && !dismissedIds.has(n.id));
  const dismissedNotifs = notifs.filter(n => shellFilter(n) && dismissedIds.has(n.id));
  const unreadCount = activeNotifs.filter(n => !readIds.has(n.id)).length;
  // When nothing's active and user has dismissed stuff, auto-flip the toggle
  // on so the panel isn't a sad empty state hiding content behind a link.
  const visibleRows = showDismissed || activeNotifs.length === 0
    ? [...activeNotifs, ...dismissedNotifs]
    : activeNotifs;

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (panelRef.current?.contains(t)) return;
      if (btnRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const markAllRead = () => setReadIds(new Set(notifs.map(n => n.id)));
  const markRead = (id: string) => setReadIds(prev => { const next = new Set(prev); next.add(id); return next; });
  const dismiss = (id: string, type: NotifType) => {
    // Team-setup lives at shell level; dismissing from here forwards up so
    // the inline banner stays consistent with the bell. Everything else is
    // local to the panel.
    if (type === "team-setup") {
      onDismissTeamSetupBell?.();
      return;
    }
    setDismissedIds(prev => { const next = new Set(prev); next.add(id); return next; });
  };
  const restore = (id: string) => setDismissedIds(prev => { const next = new Set(prev); next.delete(id); return next; });

  const iconFor = (type: NotifType) => {
    if (type === "team-setup") return <Users className="w-4 h-4" style={{ color: RAZZ }} />;
    return <Wrench className="w-4 h-4" style={{ color: isDark ? "#9CA3AF" : "#6B7280" }} />;
  };

  const bg = isDark ? "#151828" : "#ffffff";
  const panelBg = isDark ? "#1C2140" : "#ffffff";
  const text = isDark ? "#F3F4F6" : "#111827";
  const muted = isDark ? "#9CA3AF" : "#6B7280";
  const border = isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB";
  const rowDivider = isDark ? "rgba(255,255,255,0.06)" : "#F3F4F6";

  return (
    <header
      className="h-[52px] flex items-center px-5 gap-4 flex-shrink-0 transition-colors duration-300 relative"
      style={{
        background: bg,
        borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6"}`,
      }}
    >
      {/* Search */}
      {!hideSearch && (
        <div className="relative transition-colors duration-300" style={{ width: 400 }}>
          <Search className="absolute left-[12.5px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 flex-shrink-0" style={{ color: isDark ? "#6B7280" : "#9CA3AF" }} />
          <input
            type="text"
            placeholder="Search clients, quotes or policies..."
            className="bg-transparent outline-none w-full"
            style={{
              background: isDark ? "rgba(255,255,255,0.06)" : "#FFFFFF",
              border: `0.78125px solid ${isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB"}`,
              borderRadius: 10.9375,
              padding: "7.8125px 12.5px 7.8125px 34.375px",
              height: 35.94,
              fontSize: 12,
              color: isDark ? "#9CA3AF" : "#6B7280",
              boxSizing: "border-box",
            }}
          />
        </div>
      )}

      <div className="flex-1" />

      {/* Acting-as chip — outlined, no fill, inline alongside the bell. Shows
          whenever an internal user kicked off a "Start a Quote" impersonation
          from Agencies, so every page in the chrome reminds them whose
          account the next quote will post under. Click the inline X to exit.
          First-ever activation also raises a dim/blur backdrop + coachmark
          pointing at the chip (impersonationSpotlight), teaching the user
          where the Exit lives. */}
      {impersonation && impersonationSpotlight && (
        <div
          className="fixed inset-0"
          onClick={() => onDismissImpersonationSpotlight?.()}
          aria-label="Dismiss tip"
          role="button"
          tabIndex={-1}
          style={{
            background: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
            zIndex: 40,
            cursor: "default",
            animation: "impersonationSpotlightIn 220ms ease-out",
          }}
        />
      )}
      {impersonation && (
        <div
          className="relative flex items-center gap-2 flex-shrink-0"
          role="status"
          aria-live="polite"
          style={{
            height: 28,
            padding: "0 6px 0 10px",
            borderRadius: 999,
            border: `1px solid ${impersonationSpotlight
              ? (isDark ? "#C084FC" : RAZZ)
              : (isDark ? "rgba(192,132,252,0.45)" : "rgba(166,20,195,0.40)")}`,
            background: impersonationSpotlight ? (isDark ? "#0F1120" : "#FFFFFF") : "transparent",
            fontFamily: FONT,
            maxWidth: 320,
            zIndex: impersonationSpotlight ? 42 : undefined,
            boxShadow: impersonationSpotlight
              ? `0 0 0 6px ${isDark ? "rgba(192,132,252,0.22)" : "rgba(166,20,195,0.18)"}, 0 12px 32px rgba(0,0,0,0.14)`
              : undefined,
            transition: "box-shadow 220ms ease-out",
          }}
          title={`Acting as ${impersonation.userName} on ${impersonation.agencyName}. Quotes you start post under this user.`}
        >
          <span
            className="inline-block rounded-full flex-shrink-0"
            aria-hidden="true"
            style={{
              width: 6,
              height: 6,
              background: RAZZ,
              boxShadow: `0 0 0 3px ${isDark ? "rgba(192,132,252,0.18)" : "rgba(166,20,195,0.15)"}`,
            }}
          />
          <span
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ letterSpacing: "0.08em", color: isDark ? "#C084FC" : RAZZ_DEEP }}
          >
            Acting as
          </span>
          <span
            className="text-[12px] font-semibold truncate"
            style={{ color: isDark ? "#F9FAFB" : "#2D3653", maxWidth: 160 }}
          >
            {impersonation.userName}
          </span>
          <button
            type="button"
            onClick={() => onExitImpersonation?.()}
            className="flex items-center justify-center transition-colors flex-shrink-0"
            style={{
              width: 20,
              height: 20,
              borderRadius: 999,
              background: "transparent",
              border: "none",
              color: isDark ? "#C084FC" : RAZZ,
              cursor: "pointer",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(192,132,252,0.14)" : "rgba(166,20,195,0.10)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            aria-label={`Exit — stop acting as ${impersonation.userName}`}
          >
            <X className="w-3 h-3" strokeWidth={2.4} />
          </button>
          {impersonationSpotlight && (
            <>
              <div
                onClick={e => e.stopPropagation()}
                className="absolute rounded-xl p-3.5 flex items-start gap-3"
                style={{
                  top: "calc(100% + 10px)",
                  right: 0,
                  width: 300,
                  background: isDark ? "#1E2240" : "#FFFFFF",
                  border: `1px solid ${isDark ? "rgba(192,132,252,0.35)" : "rgba(166,20,195,0.28)"}`,
                  boxShadow: "0 20px 48px rgba(0,0,0,0.18)",
                  zIndex: 43,
                  animation: "impersonationCoachmarkIn 220ms ease-out",
                }}
                role="dialog"
                aria-label="Acting-as tip"
              >
                {/* Pointer arrow at the top-right */}
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: -6,
                    right: 18,
                    width: 10,
                    height: 10,
                    background: isDark ? "#1E2240" : "#FFFFFF",
                    borderTop: `1px solid ${isDark ? "rgba(192,132,252,0.35)" : "rgba(166,20,195,0.28)"}`,
                    borderLeft: `1px solid ${isDark ? "rgba(192,132,252,0.35)" : "rgba(166,20,195,0.28)"}`,
                    transform: "rotate(45deg)",
                  }}
                />
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, rgba(92,46,212,0.14), rgba(166,20,195,0.14))" }}
                >
                  <Users className="w-4 h-4" style={{ color: isDark ? "#C084FC" : RAZZ }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold mb-0.5" style={{ fontFamily: FONT, color: isDark ? "#F9FAFB" : "#2D3653" }}>
                    You're acting as {impersonation.userName}
                  </div>
                  <div className="text-[11px] leading-relaxed" style={{ fontFamily: FONT, color: isDark ? "#D1D5DB" : "#6B7280" }}>
                    Quotes you start post under this user. Click <strong style={{ color: isDark ? "#C084FC" : RAZZ, fontWeight: 700 }}>×</strong> on this badge any time to switch back to yourself.
                  </div>
                  <button
                    type="button"
                    onClick={() => onDismissImpersonationSpotlight?.()}
                    className="mt-2 text-[11px] font-semibold transition-opacity"
                    style={{ color: isDark ? "#C084FC" : RAZZ, background: "transparent", border: "none", padding: 0, cursor: "pointer" }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                  >
                    Got it
                  </button>
                </div>
              </div>
              <style>{`
                @keyframes impersonationSpotlightIn {
                  from { opacity: 0; backdrop-filter: blur(0px); -webkit-backdrop-filter: blur(0px); }
                  to   { opacity: 1; backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px); }
                }
                @keyframes impersonationCoachmarkIn {
                  from { opacity: 0; transform: translateY(-6px); }
                  to   { opacity: 1; transform: translateY(0); }
                }
              `}</style>
            </>
          )}
        </div>
      )}

      {/* Notification bell + its popover — wrapped in a `relative` so the
          panel can anchor to the bell's own right edge (right: 0), keeping
          the panel visually tied to its trigger regardless of what sits
          beyond it in the chrome (divider, btis mark, etc.).
          When the Team Setup spotlight is on, this wrapper is elevated
          above the shell-level dim backdrop (z-index 42, same stacking tier
          as the Users-tab coachmark at 41 — bell wins so the halo lands on
          top) and gets a razz ring + inner bg to read as the second
          "lit island". */}
      <div
        className="relative flex-shrink-0"
        style={teamSetupBellSpotlight ? {
          zIndex: 42,
          borderRadius: 10,
          padding: 4,
          margin: -4,
          background: bg,
          boxShadow: `0 0 0 6px ${isDark ? "rgba(192,132,252,0.22)" : "rgba(166,20,195,0.18)"}, 0 12px 32px rgba(0,0,0,0.14)`,
          animation: "teamSetupBellHaloIn 220ms ease-out",
        } : undefined}
      >
        {teamSetupBellSpotlight && (
          <style>{`
            @keyframes teamSetupBellHaloIn {
              from { box-shadow: 0 0 0 0 transparent, 0 0 0 0 transparent; }
              to   { box-shadow: 0 0 0 6px ${isDark ? "rgba(192,132,252,0.22)" : "rgba(166,20,195,0.18)"}, 0 12px 32px rgba(0,0,0,0.14); }
            }
          `}</style>
        )}
        <button
          ref={btnRef}
          type="button"
          onClick={() => setOpen(o => !o)}
          onMouseEnter={e => {
            if (open) return;
            e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "#F3F4F6";
          }}
          onMouseLeave={e => {
            if (open) return;
            e.currentTarget.style.background = "transparent";
          }}
          className="relative flex items-center justify-center cursor-pointer transition-colors"
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: open ? (isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6") : "transparent",
            border: "none",
            color: isDark ? "#8B8FA8" : "#9CA3AF",
            boxSizing: "border-box",
          }}
          aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
        >
          <Bell className="w-[15px] h-[15px]" strokeWidth={2} />
          {unreadCount > 0 && (
            <span
              className="absolute pointer-events-none"
              style={{
                top: 5,
                right: 6,
                width: 5,
                height: 5,
                borderRadius: 9999,
                background: RAZZ,
                boxShadow: `0 0 0 1.5px ${bg}`,
              }}
            />
          )}
        </button>
        {/* Notification panel — mirrors the Sidenav "My Account" dropdown
            language: #1E2240/#fff bg, 12-radius, 0 12px 32px shadow, Montserrat
            throughout, section header in uppercase/muted/tracking-wider, and
            action rows that pick up a razz gradient-border on hover (same trick
            as NavItem). No pink-tinted row backgrounds — clean white rows, a
            small razz dot marks unread, a severity glyph carries the color. */}
        {open && (
          <div
            ref={panelRef}
            className="absolute flex flex-col"
            style={{
              // Anchored to the bell's own wrapper: `top: calc(100% + 4px)`
              // sits 4px below the header's bottom edge, `right: calc(100% - 28)`
              // doesn't apply here — instead we set the panel's right edge to
              // the bell's right edge by positioning it inside the bell's
              // relative wrapper (see the wrapping div in the header above).
              top: "calc(100% + 4px)",
              right: 0,
              width: 380,
              maxHeight: 520,
              background: panelBg,
              border: `1px solid ${border}`,
              borderRadius: 12,
              boxShadow: "0 12px 32px rgba(0,0,0,0.14)",
              overflow: "hidden",
              zIndex: 50,
              fontFamily: FONT,
            }}
          >
            {/* Header strip — label + Mark all as read, matching the "MY ACCOUNT"
                label row in the Sidenav dropdown. */}
            <div
              className="flex items-center justify-between px-3 py-2 flex-shrink-0"
              style={{ borderBottom: `1px solid ${rowDivider}` }}
            >
              <span
                className="text-[11px] font-semibold uppercase"
                style={{ color: muted, letterSpacing: "0.06em" }}
              >
                Notifications
              </span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="cursor-pointer"
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: "2px 4px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: RAZZ,
                  }}
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {visibleRows.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4" style={{ color: muted }}>
                  <Bell className="w-6 h-6 mb-2" style={{ opacity: 0.5 }} />
                  <span style={{ fontSize: 13 }}>You&apos;re all caught up.</span>
                </div>
              ) : (
                visibleRows.map((n, i) => {
                  const isTeamSetup = n.type === "team-setup";
                  const sev = isTeamSetup ? RAZZ : (isDark ? "#8B8FA8" : "#9CA3AF");
                  const isDismissed = dismissedIds.has(n.id);
                  return (
                    <NotifRow
                      key={n.id}
                      isDark={isDark}
                      textColor={text}
                      mutedColor={muted}
                      dividerColor={rowDivider}
                      isLast={i === visibleRows.length - 1}
                      sev={sev}
                      icon={iconFor(n.type)}
                      title={n.title}
                      body={n.body}
                      timestamp={n.timestamp}
                      actionLabel={n.actionLabel}
                      isDismissed={isDismissed}
                      onAction={() => {
                        markRead(n.id);
                        if (isTeamSetup && onOpenTeamSetup) {
                          onOpenTeamSetup();
                          setOpen(false);
                        }
                      }}
                      onDismiss={() => dismiss(n.id, n.type)}
                      onRestore={() => restore(n.id)}
                    />
                  );
                })
              )}
            </div>

            {/* Footer — single "View all notifications" toggle. Default view
                hides dismissed items; "View all" reveals them (dismissed rows
                fade + swap X for Restore). Click again to collapse back to the
                active-only view. Keeps the panel surface quiet without losing
                recovery for an accidental X. */}
            <div
              className="flex-shrink-0 px-3 py-2 text-center"
              style={{ borderTop: `1px solid ${rowDivider}` }}
            >
              <button
                type="button"
                onClick={() => setShowDismissed(s => !s)}
                className="cursor-pointer"
                style={{
                  background: "transparent",
                  border: "none",
                  padding: "2px 4px",
                  fontFamily: FONT,
                  fontSize: 11,
                  fontWeight: 600,
                  color: dismissedIds.size > 0 ? RAZZ : muted,
                  cursor: dismissedIds.size > 0 ? "pointer" : "default",
                }}
                disabled={dismissedIds.size === 0}
              >
                {dismissedIds.size === 0
                  ? "View all notifications"
                  : showDismissed
                    ? `Hide dismissed (${dismissedIds.size})`
                    : `View all notifications (${dismissedIds.size} dismissed)`}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Vertical divider — splits interactive chrome (the bell) from the
          purely-informational "powered by" mark, so the bell doesn't look like
          it's floating next to a logo. */}
      <span
        aria-hidden
        className="flex-shrink-0"
        style={{
          width: 1,
          height: 20,
          background: isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB",
        }}
      />

      {/* Powered by btis */}
      <div className="flex items-center gap-2">
        <span
          className="text-[10px] tracking-widest uppercase font-medium"
          style={{ color: isDark ? "#4B5563" : "#9CA3AF" }}
        >
          POWERED BY
        </span>
        <Image
          src={btisLogo}
          alt="btis"
          className="h-5 w-auto"
          style={{ filter: isDark ? "brightness(0) invert(0.4)" : "none" }}
        />
      </div>

    </header>
  );
}
