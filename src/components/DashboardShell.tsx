"use client";

import { useEffect, useState } from "react";
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

interface DashboardShellProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export default function DashboardShell({ children, pageTitle }: DashboardShellProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState("Marketplace");

  // Team Setup prompt state — the mock agency has no admin assigned, so on
  // first sign-in the modal pops. Three independent dismissal flags because
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

  useEffect(() => {
    if (!teamSetupSpotlightActive) return;
    const t = setTimeout(() => setTeamSetupSpotlightActive(false), 8000);
    return () => clearTimeout(t);
  }, [teamSetupSpotlightActive]);

  const modalOpen   = !teamSetupDone && !teamSetupModalDismissed;
  const bannerVisible = !teamSetupDone && teamSetupModalDismissed && !teamSetupBannerDismissed;
  const bellEntryVisible = !teamSetupDone && !teamSetupBellDismissed;

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
        return <Agencies key="agencies-internal" isDark={darkMode} />;
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
            teamSetupPending={!teamSetupDone}
            onOpenTeamSetup={openTeamSetup}
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
        onSave={() => { setTeamSetupDone(true); setTeamSetupDismissHintOpen(false); }}
      />

      {/* Dismiss-hint toast — pops after the modal is X'd / "Remind me later"'d
          so the user knows the prompt is still reachable (banner + bell).
          Mounted at shell level because the modal unmounts on dismiss. */}
      <TeamSetupDismissToast
        isDark={darkMode}
        open={teamSetupDismissHintOpen && !teamSetupDone}
        onClose={() => setTeamSetupDismissHintOpen(false)}
        onOpenTeamSetup={openTeamSetup}
      />
    </div>
  );
}
