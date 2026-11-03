"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Sidenav from "@/components/Sidenav";
import TopBar from "@/components/TopBar";
import Clients from "@/components/Clients";
import Agencies from "@/components/Agencies";
import Quotes from "@/components/Quotes";
import Policies from "@/components/Policies";
import Endorsements from "@/components/Endorsements";
import Marketplace from "@/components/Marketplace";
import Website from "@/components/Website";
import Pricing from "@/components/Pricing";
import TeamSetupModal from "@/components/TeamSetupModal";
import TeamSetupDismissToast from "@/components/TeamSetupDismissToast";

const TEAM_SETUP_DONE_KEY = "norbielink.teamSetupDone";

function readTeamSetupDone(): boolean {
  try {
    if (new URLSearchParams(window.location.search).get("teamSetup") === "reset") return false;
    return localStorage.getItem(TEAM_SETUP_DONE_KEY) === "1";
  } catch {
    return false; // storage blocked — fall back to prompting this session
  }
}
const noopSubscribe = () => () => {};

interface DashboardShellProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export default function DashboardShell({ children, pageTitle }: DashboardShellProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState("Marketplace");

  // Team Setup prompt state — the mock agency's only admin is the signed-in
  // primary contact, so on first sign-in the modal pops. Three independent dismissal flags because
  // each surface (modal / banner / bell entry) can be dismissed on its own:
  //   - teamSetupDone: user actually saved admins → prompt is gone everywhere
  //   - teamSetupModalDismissed: user X'd or "Remind me later"'d the modal →
  //     prompt falls back to the inline Marketplace banner
  //   - teamSetupBannerDismissed: user X'd the banner → prompt lives only in
  //     the bell panel
  //   - teamSetupBellDismissed: user X'd the bell entry → prompt is gone until
  //     a page reload (same lifetime semantics as the License alerts had)
  // Clicking "Set up team" from the banner or bell re-opens the modal without
  // flipping any of the dismissed flags, so the recovery path is reversible.
  const [teamSetupDone, setTeamSetupDone] = useState(false);
  // "Done" is sticky: once the primary contact finishes setup we never prompt
  // again. Persisted to localStorage as a stand-in for a server-side agency
  // flag. The server snapshot is null ("not loaded yet"), which holds every
  // surface back until the client has read it — so a finished user never
  // sees the modal flash on load. `?teamSetup=reset` clears it for demos.
  const storedTeamSetupDone = useSyncExternalStore(noopSubscribe, readTeamSetupDone, () => null);
  const teamSetupLoaded = storedTeamSetupDone !== null;
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("teamSetup") !== "reset") return;
    try { localStorage.removeItem(TEAM_SETUP_DONE_KEY); } catch { /* nothing stored */ }
  }, []);
  const [teamSetupModalDismissed, setTeamSetupModalDismissed] = useState(false);
  const [teamSetupBannerDismissed, setTeamSetupBannerDismissed] = useState(false);
  const [teamSetupBellDismissed, setTeamSetupBellDismissed] = useState(false);
  // Shows the top-right "Need to come back to this?" toast right after the
  // user dismisses the modal (X or "Remind me later"), so they can see where
  // the prompt still lives.
  const [teamSetupDismissHintOpen, setTeamSetupDismissHintOpen] = useState(false);
  // One-shot flag: tells the Admin surface to jump to the Users tab + raise
  // a razz coachmark so the user sees exactly where to assign admins after
  // leaving the modal. AgencyDetailView calls `onSpotlightConsumed` to flip
  // this back off (its own local timer keeps the coachmark on-screen).
  const [teamSetupSpotlightUsers, setTeamSetupSpotlightUsers] = useState(false);
  // Monotonic counter that bumps once per spotlight trigger. Used as the
  // React key on the Admin-case Agencies instance so a dismiss cleanly
  // remounts it with `initialTab="users"`. We can't flip the key off a
  // boolean (it would remount AGAIN when the one-shot flag clears, undoing
  // the Users tab), so a counter is the simplest stable mount token.
  const [teamSetupMountKey, setTeamSetupMountKey] = useState(0);
  // Lifted spotlight-visible state — shared between the Users-tab coachmark
  // (inside AgencyDetailView) and the TopBar bell. Both call `dismiss` to
  // flip it off (coachmark X / coachmark backdrop click), and the shell runs
  // the 8s auto-dismiss timer so it stays in sync across both surfaces.
  const [teamSetupSpotlightActive, setTeamSetupSpotlightActive] = useState(false);
  // One-shot guard: the full landing routine (jump to Admin + blur +
  // bell halo + toast) fires on the FIRST modal dismiss only. Subsequent
  // dismisses — e.g. the user re-opened the modal from the persistent
  // Users-tab coachmark and X'd again — just close the modal quietly, no
  // repeat spotlight.
  const [teamSetupSpotlightFired, setTeamSetupSpotlightFired] = useState(false);

  // Internal-staff impersonation: BTIS user starts a quote AS an external
  // user. Set from the Agencies "Start a Quote" action; cleared by the
  // persistent Exit affordance on the TopBar chip. While it's set, every page
  // in the shell shows the acting-as chip so the staff member can't forget
  // whose account they're posting under.
  const [impersonation, setImpersonation] = useState<{ userName: string; userEmail: string; agencyName: string; agencyCode: string } | null>(null);
  // Transient spotlight: when impersonation first starts, highlight the
  // TopBar chip (halo + coachmark pointing at it) so the user sees exactly
  // where to exit back to their own identity. Auto-dismisses after 8s, or on
  // any click. One-shot per session (teamSetupSpotlightFired-style gate) so
  // repeat Start-a-Quote invocations don't keep re-teaching the same thing.
  const [impersonationSpotlightActive, setImpersonationSpotlightActive] = useState(false);
  const [impersonationSpotlightFired, setImpersonationSpotlightFired] = useState(false);

  useEffect(() => {
    if (!teamSetupSpotlightActive) return;
    const t = setTimeout(() => setTeamSetupSpotlightActive(false), 8000);
    return () => clearTimeout(t);
  }, [teamSetupSpotlightActive]);

  useEffect(() => {
    if (!impersonationSpotlightActive) return;
    const t = setTimeout(() => setImpersonationSpotlightActive(false), 8000);
    return () => clearTimeout(t);
  }, [impersonationSpotlightActive]);

  const teamSetupPending = teamSetupLoaded && !teamSetupDone && !storedTeamSetupDone;
  const modalOpen   = teamSetupPending && !teamSetupModalDismissed;
  const bannerVisible = teamSetupPending && teamSetupModalDismissed && !teamSetupBannerDismissed;
  const bellEntryVisible = teamSetupPending && !teamSetupBellDismissed;

  // Single exit for every "I'm done" path (modal Save, Users-tab coachmark).
  // Clears all surfaces at once — modal, banner, bell, toast, coachmark,
  // spotlight — and remembers it so no surface comes back on reload.
  const completeTeamSetup = () => {
    setTeamSetupDone(true);
    setTeamSetupDismissHintOpen(false);
    setTeamSetupSpotlightActive(false);
    try { localStorage.setItem(TEAM_SETUP_DONE_KEY, "1"); } catch { /* session-only */ }
  };

  const openTeamSetup = () => {
    setTeamSetupModalDismissed(false);
    // Reopen clears any lingering dismiss hint — they're back inside the
    // modal now, there's nothing to hint toward.
    setTeamSetupDismissHintOpen(false);
  };
  const dismissTeamSetupModal = () => {
    setTeamSetupModalDismissed(true);
    // Spotlight landing only fires ONCE. First-dismiss gets the full
    // three-part attention beat (jump to Admin → coachmark lift + bell
    // halo → top-right hint toast). Second+ dismiss (user reopened via
    // the persistent Users-tab coachmark) just closes the modal — no
    // repeat blur / halo / toast, since they already know where everything
    // lives.
    if (teamSetupSpotlightFired) return;
    setActivePage("Admin");
    setTeamSetupSpotlightUsers(true);
    setTeamSetupSpotlightActive(true);
    setTeamSetupMountKey(k => k + 1);
    setTeamSetupDismissHintOpen(true);
    setTeamSetupSpotlightFired(true);
  };

  if (activePage === "Website") {
    return (
      <div className="h-screen w-screen overflow-hidden">
        <Website isDark={darkMode} />
      </div>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case "Marketplace":
        return (
          <Marketplace
            isDark={darkMode}
            teamSetupBannerVisible={bannerVisible}
            onOpenTeamSetup={openTeamSetup}
            onDismissTeamSetupBanner={() => setTeamSetupBannerDismissed(true)}
          />
        );
      case "Clients":
        return <Clients isDark={darkMode} />;
      case "Agencies":
        // `key` is intentionally distinct from the Admin case so React mounts a
        // FRESH Agencies instance per segment. Without the key, both cases render
        // <Agencies> at the same tree position and React reuses the instance —
        // which leaks state (bookRolled, inactiveUserIds, etc.) from one
        // perspective to the other (internal staff mutations would show up in
        // the agency's own client portal).
        return (
          <Agencies
            key="agencies-internal"
            isDark={darkMode}
            onStartImpersonation={(p) => {
              setImpersonation(p);
              setActivePage("Marketplace");
              // First-ever Start-a-Quote in this session also fires a one-shot
              // teaching spotlight over the TopBar chip so the user learns
              // where to exit back to themselves. Subsequent impersonations
              // skip the spotlight — they already know.
              if (!impersonationSpotlightFired) {
                setImpersonationSpotlightActive(true);
                setImpersonationSpotlightFired(true);
              }
            }}
          />
        );
      case "Admin":
        // External-client view: same Agency detail surface, scoped to the user's
        // own (mock) agency. Distinct `key` from the Agencies case — see above.
        // The `teamSetupMountKey` counter bumps once per spotlight raise so
        // React remounts Agencies with `initialTab="users"` baked in — simpler
        // than chasing a mid-session useEffect that has to race the parent's
        // re-render. The key stays put after the flag clears, so there's no
        // second remount back to Overview.
        return (
          <Agencies
            key={`agencies-client-${teamSetupMountKey}`}
            isDark={darkMode}
            clientMode
            initialTab={teamSetupSpotlightUsers ? "users" : undefined}
            spotlightUsers={teamSetupSpotlightUsers}
            onSpotlightConsumed={() => setTeamSetupSpotlightUsers(false)}
            spotlightActive={teamSetupSpotlightActive}
            onSpotlightDismiss={() => setTeamSetupSpotlightActive(false)}
            teamSetupPending={teamSetupPending}
            onOpenTeamSetup={openTeamSetup}
            onCompleteTeamSetup={completeTeamSetup}
          />
        );
      case "Accounting · Statements":
        // Reuses the external-client agency surface, scoped to the user's own
        // agency, pinned to the Accounting tab so the user lands on their
        // Commission Statements / Statement of Account.
        return <Agencies key="agencies-statements" isDark={darkMode} clientMode initialTab="accounting" pageTitleOverride="Accounting" />;
      case "Quotes":
        return <Quotes isDark={darkMode} />;
      case "Policies":
        return <Policies isDark={darkMode} />;
      case "Endorsements":
        return <Endorsements isDark={darkMode} />;
      case "Pricing":
      case "Pricing · Phase 2":
        return <Pricing isDark={darkMode} phase={2} />;
      case "Pricing · Phase 1":
        return <Pricing isDark={darkMode} phase={1} />;
      default:
        // Un-routed / placeholder segments (Marketplace, Appetite Assistant, Make a
        // Payment, Accounting, Tools & Resources, Support, …) just render whatever
        // children the parent passed. No section-title bar — designed pages own
        // their own title; an orphan title above an empty body just looks broken.
        return <>{children}</>;
    }
  };

  return (
    <div
      className="flex h-screen overflow-hidden transition-colors duration-300"
      style={{ background: darkMode ? "#0F1120" : "#ffffff" }}
    >
      <Sidenav
        isDark={darkMode}
        onToggleDark={() => setDarkMode(!darkMode)}
        activeItem={activePage}
        onActiveChange={setActivePage}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          isDark={darkMode}
          activePage={activePage}
          teamSetupBellVisible={bellEntryVisible}
          teamSetupBellSpotlight={teamSetupSpotlightActive}
          onOpenTeamSetup={openTeamSetup}
          onDismissTeamSetupBell={() => setTeamSetupBellDismissed(true)}
          impersonation={impersonation}
          impersonationSpotlight={impersonationSpotlightActive}
          onDismissImpersonationSpotlight={() => setImpersonationSpotlightActive(false)}
          onExitImpersonation={() => setImpersonation(null)}
        />
        <main
          className="flex-1 overflow-hidden transition-colors duration-300 px-12"
          style={(() => { const fullHeightPages = ["Clients", "Agencies", "Admin", "Quotes", "Policies", "Endorsements", "Accounting · Statements"]; const isFullHeight = fullHeightPages.includes(activePage); return { background: darkMode ? "#0F1120" : "#ffffff", paddingTop: isFullHeight ? 0 : 24, paddingBottom: isFullHeight ? 48 : 24, display: isFullHeight ? "flex" : "block", flexDirection: "column" as const, overflowY: isFullHeight ? "hidden" : "auto", height: isFullHeight ? "100%" : "auto" }; })()}
        >
          {renderPage()}
        </main>
      </div>

      {/* Team Setup prompt — mounted at shell level so the overlay covers the
          whole viewport and so the modal survives page changes. */}
      <TeamSetupModal
        isDark={darkMode}
        open={modalOpen}
        onClose={dismissTeamSetupModal}
        onRemindLater={dismissTeamSetupModal}
        onSave={completeTeamSetup}
      />

      {/* Dismiss-hint toast — pops after the modal is X'd / "Remind me later"'d
          so the user knows the prompt is still reachable (banner + bell).
          Mounted at shell level because the modal unmounts on dismiss. */}
      <TeamSetupDismissToast
        isDark={darkMode}
        open={teamSetupDismissHintOpen && teamSetupPending}
        onClose={() => setTeamSetupDismissHintOpen(false)}
        onOpenTeamSetup={openTeamSetup}
      />
    </div>
  );
}
