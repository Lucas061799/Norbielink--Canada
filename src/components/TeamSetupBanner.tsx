"use client";

import { useId } from "react";
import { X, ArrowRight, Users } from "lucide-react";

// -----------------------------------------------------------------------------
// Fallback inline banner for the Team Setup prompt. Rendered on the
// Marketplace home when the user dismissed the first-run modal but hasn't
// finished picking admins yet.
//
// Visual pattern mirrors LicenseAlertBanner (same shell, radius, dark-mode
// surface, razz accent) so critical push-prompts across the app read as one
// family. Content and CTA swap: here the primary action re-opens the Team
// Setup modal (owned by DashboardShell).
// -----------------------------------------------------------------------------

interface TeamSetupBannerProps {
  isDark: boolean;
  onOpen: () => void;   // Re-opens the Team Setup modal
  onDismiss: () => void; // Collapses the banner → bell-only
}

const FONT = "var(--font-montserrat), Montserrat, sans-serif";

export default function TeamSetupBanner({ isDark, onOpen, onDismiss }: TeamSetupBannerProps) {
  const bg          = isDark ? "#1E2240" : "#F9FAFB";
  const borderCol   = isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB";
  const bodyColor   = isDark ? "#9CA3AF" : "#6B7280";
  const dismissColor = isDark ? "#8B8FA8" : "#9CA3AF";
  // Per-instance so two banners on one page don't collide on the same DOM id.
  const gradId = useId();

  return (
    <div
      className="rounded-xl p-4 mb-6 flex items-start gap-3"
      style={{ background: bg, border: `1px solid ${borderCol}` }}
    >
      {/* Users glyph — razz-gradient stroke in light mode, solid light razz in
          dark (same move LicenseAlertBanner uses to stay legible on #1E2240). */}
      <svg
        className="w-5 h-5 flex-shrink-0 mt-0.5"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {!isDark && (
          <defs>
            <linearGradient id={gradId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="0">
              <stop offset="0%" stopColor="#5C2ED4" />
              <stop offset="100%" stopColor="#A614C3" />
            </linearGradient>
          </defs>
        )}
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke={isDark ? "#C084FC" : `url(#${gradId})`} />
        <circle cx="9" cy="7" r="4" stroke={isDark ? "#C084FC" : `url(#${gradId})`} />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke={isDark ? "#C084FC" : `url(#${gradId})`} />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke={isDark ? "#C084FC" : `url(#${gradId})`} />
      </svg>

      <div className="flex-1 min-w-0">
        <div
          className="text-[13px] font-semibold"
          style={isDark ? {
            fontFamily: FONT,
            color: "#C084FC",
          } : {
            fontFamily: FONT,
            backgroundImage: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Finish setting up your team
        </div>
        <div className="text-[12px] mt-0.5" style={{ fontFamily: FONT, color: bodyColor }}>
          You&apos;re the only Admin for Acme Insurance Agency. Choose who else should be an Admin — Admins can view accounting statements and add, edit, or delete users.
        </div>
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white transition-all whitespace-nowrap cursor-pointer"
        style={{
          fontFamily: FONT,
          background: "linear-gradient(90deg, #5C2ED4 0%, #A614C3 65%)",
        }}
      >
        <Users className="w-3.5 h-3.5" strokeWidth={2.2} />
        Set up team
        <ArrowRight className="w-3 h-3" strokeWidth={2.4} />
      </button>

      <button
        type="button"
        onClick={onDismiss}
        className="flex-shrink-0 cursor-pointer self-start"
        aria-label="Dismiss team-setup banner"
        style={{
          background: "transparent",
          border: "none",
          padding: 2,
          color: dismissColor,
          marginTop: 2,
          marginRight: -4,
        }}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
