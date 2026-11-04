"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Eye, EyeOff, X, Check, Lock, IdCard, HelpCircle, Mail, MessageSquare, AlertCircle, ChevronRight } from "lucide-react";
import norbielinkLogoDark from "@/assets/norbielink-logo-dark.png";
import btisLogoDark from "@/assets/btislogo-dark.png";
import norbieface from "@/assets/norbieface.png";
import norbieWelcome from "@/assets/norbie-welcome.webp";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";

type Step = "login" | "mfa" | "addphone" | "signup" | "verify" | "create" | "reset" | "unlocked";
type MfaMethod = "email" | "phone";

interface WebsiteProps {
  isDark?: boolean;
}

export default function Website({ isDark = false }: WebsiteProps) {
  const [step, setStep] = useState<Step>("login");
  // Mock: does the returning user have a phone number on file? Controls whether
  // the MFA method-picker step ("mfa") appears between login and the code entry.
  // Email-only users skip method selection and the code is sent to their inbox.
  const [userHasPhone] = useState(true);
  const [mfaMethod, setMfaMethod] = useState<MfaMethod>("email");
  // description is a ReactNode so we can highlight key words (e.g. "Principal's") with the brand magenta.
  // `kind` switches the icon + chip color: "email" for confirmation messages (brand purple
  // Mail icon), "warning" for validation nudges like the agency-code-detected case (amber
  // AlertCircle). Defaults to "email" so any caller that doesn't specify still works.
  // `title` is ReactNode so callers can highlight specific terms (e.g. "Agency Code") inline.
  const [toast, setToast] = useState<{ title: React.ReactNode; description: React.ReactNode; kind?: "email" | "warning" } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  // "Need help?" launcher (bottom-right, every auth step) → slide-up
  // panel branded as Norbie. Lets the user pick a common issue and/or
  // type a description, then submits to a success toast. Prototype
  // doesn't actually send; the receipt uses the same toast chrome as
  // the Reset email flow so the demo stays visually consistent.
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpTopic, setHelpTopic] = useState<string | null>(null);
  const [helpText, setHelpText] = useState("");
  const closeHelp = () => { setHelpOpen(false); setHelpTopic(null); setHelpText(""); };

  const c = {
    text:    isDark ? "#F9FAFB" : "#1F2937",
    muted:   isDark ? "#8B8FA8" : "#6B7280",
    cardBg:  isDark ? "#191D35" : "#fff",
    border:  isDark ? "rgba(255,255,255,0.22)" : "#D1D5DB",
    inputBg: isDark ? "rgba(255,255,255,0.05)" : "#fff",
  };
  const font = { fontFamily: FONT } as React.CSSProperties;
  const btnGrad = isDark
    ? "radial-gradient(171.32% 99.33% at 33.13% -9%, #282550 0%, #191735 55.82%, rgba(0,0,0,0.3) 74%, rgba(0,0,0,0) 100%), linear-gradient(88.34deg, #5C2ED4 0.11%, #A614C3 63.8%)"
    : "linear-gradient(90deg,#5C2ED4 0%,#A614C3 65%)";
  // Separate gradient for background-clip:text spots. The dark-mode
  // `btnGrad` stacks a near-black radial on top of the razz linear so
  // dark-mode BUTTONS get a tactile sheen — but when the same string
  // fills text, the radial dims the glyphs into the navy background.
  // `textGrad` keeps brand razz and lifts both stops in dark mode so
  // headlines like "NorbieLink!" / "Verification Method" read cleanly
  // on #0F1120, without changing how the dark-mode buttons look.
  const textGrad = isDark
    ? "linear-gradient(90deg,#C9A6FF 0%,#E68BF2 65%)"
    : "linear-gradient(90deg,#5C2ED4 0%,#A614C3 65%)";

  const inputStyle: React.CSSProperties = {
    fontFamily: FONT,
    background: c.inputBg,
    border: `1px solid ${c.border}`,
    color: c.text,
    padding: "10px 14px",
    borderRadius: 10,
    fontSize: 13,
    width: "100%",
    outline: "none",
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: FONT,
    color: "#6B7280",
    fontSize: 13,
    fontWeight: 500,
    marginBottom: 6,
    display: "block",
  };

  const primaryBtnStyle = (enabled: boolean): React.CSSProperties => ({
    fontFamily: FONT,
    background: btnGrad,
    padding: "12px 28px",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    border: "none",
    color: "#fff",
    width: "100%",
    opacity: enabled ? 1 : 0.5,
    cursor: enabled ? "pointer" : "not-allowed",
    boxShadow: enabled ? "0 4px 14px rgba(166,20,195,0.25)" : "none",
    transition: "all 0.15s",
  });

  const topBarBg     = "linear-gradient(180deg, #26125A 0%, #29125C 100%)";
  const leftPanelBg  = "linear-gradient(180.36deg, #231258 0.33%, #A720C1 99.29%)";

  return (
    <div className="flex w-full overflow-hidden relative" style={{ ...font, height: "100%" }}>
      {/* LEFT brand panel — full height purple. Logo + powered-by at top, N graphic at bottom. */}
      <div
        className="relative flex-shrink-0 overflow-hidden flex flex-col"
        style={{ width: "33.3333%", maxWidth: 460, background: leftPanelBg }}
      >
        {/* Brand block */}
        <div className="relative z-20 px-10 pt-10 flex-shrink-0">
          <div className="flex flex-col" style={{ width: "fit-content" }}>
            <Image src={norbielinkLogoDark} alt="Norbielink" className="w-auto" style={{ height: 57.6 }} priority />
            <div
              className="flex items-center gap-3 justify-end mt-4 w-full"
              style={{ paddingRight: 10 }}
            >
              <span
                className="text-[12px] tracking-[0.22em] uppercase font-medium"
                style={{ color: "rgba(255,255,255,0.78)" }}
              >
                POWERED BY
              </span>
              <Image src={btisLogoDark} alt="btis" className="h-9 w-auto" />
            </div>
          </div>
        </div>

        {/* Welcome mascot — transparent composite of Norbie + the N
            artwork. Sits over the panel's purple gradient; anchored
            bottom-left at full width. No clip-path needed — the PNG's
            own alpha channel handles masking. */}
        <Image
          src={norbieWelcome}
          alt="Norbie"
          className="absolute pointer-events-none select-none"
          sizes="33vw"
          style={{ left: 0, bottom: 0, width: "100%", height: "auto" }}
          priority
        />
      </div>

      {/* RIGHT side — top purple bar over white form */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Top bar (only over the right side, not across the left) */}
        <header
          className="flex-shrink-0"
          style={{ height: 52, background: topBarBg }}
        />

        {/* White form panel */}
        <div
          className="flex-1 flex flex-col items-center justify-center overflow-y-auto relative"
          style={{ background: c.cardBg, padding: "48px" }}
        >
        {/* Step indicator (top-right) — clickable for demo navigation */}
        <div className="absolute top-6 right-8 flex items-center gap-2">
          {(["login", "mfa", "addphone", "signup", "verify", "create", "reset", "unlocked"] as Step[]).map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className="rounded-full transition-all"
              style={{
                width: step === s ? 22 : 8,
                height: 8,
                background: step === s ? btnGrad : c.border,
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
              aria-label={`Step ${i + 1}`}
            />
          ))}
        </div>

          {/* Form wrapper scaled to ~85% — gives the whole sign-in surface a more compact feel
              without resizing every individual element. `transformOrigin: center` keeps it
              vertically and horizontally centered as it shrinks. */}
          <div className="w-full" style={{ maxWidth: step === "signup" ? 760 : 520, transform: "scale(0.85)", transformOrigin: "center" }}>
            {step === "login"  && <LoginView  c={c} font={font} inputStyle={inputStyle} labelStyle={labelStyle} primaryBtnStyle={primaryBtnStyle} btnGrad={btnGrad} textGrad={textGrad} isDark={isDark}
              onContinue={() => {
                // Users with a phone on file → MFA method picker.
                // Users with only email → "add phone" reminder page, from
                // which they can still finish signing in with email.
                if (userHasPhone) setStep("mfa");
                else setStep("addphone");
              }}
              onResetLinkClicked={() => setStep("reset")}
              onCreateLinkClicked={() => setStep("signup")}
              onAgencyCodeDetected={(code) => {
                // Agency codes identify the agency, not a specific user — they can't be used
                // to sign in. Top-right toast: name what was typed (so user sees we recognized
                // it), tell them what to try instead.
                setToast({
                  kind: "warning",
                  title: <>We can&apos;t find you by <span style={{ fontWeight: 600 }}>Agency Code</span></>,
                  description: (
                    <>
                      <span style={{ fontFamily: "monospace", color: "#A614C3", fontWeight: 600 }}>{code}</span>
                      {" "}looks like an <span style={{ fontWeight: 600 }}>Agency Code</span>. Try your <span style={{ fontWeight: 600 }}>User ID</span> instead.
                    </>
                  ),
                });
              }}
              onResetEmailSent={(_email, mode) => {
                // Generic copy — we intentionally don't echo the user-entered email here.
                // Long addresses break the toast layout, and a stable phrase reads more
                // confidently than a templated one.
                const description = mode === "both" ? (
                  <>
                    We&apos;ve sent your User ID and a password reset link to your inbox. Open it to recover your account.
                  </>
                ) : (
                  <>
                    We&apos;ve sent a password reset link to your inbox. Open it to set a new password.
                  </>
                );
                setToast({ title: "Email sent", description });
                setStep("reset");
              }}
            />}
            {step === "mfa" && <MfaMethodView c={c} font={font} primaryBtnStyle={primaryBtnStyle} btnGrad={btnGrad} textGrad={textGrad} isDark={isDark}
              onSelect={(m) => { setMfaMethod(m); setStep("verify"); }}
              onBack={() => setStep("login")}
            />}
            {step === "addphone" && <AddPhoneView c={c} font={font} primaryBtnStyle={primaryBtnStyle} btnGrad={btnGrad} textGrad={textGrad} isDark={isDark}
              onContinueEmail={() => { setMfaMethod("email"); setStep("verify"); }}
              onBack={() => setStep("login")}
            />}
            {step === "signup" && <SignupView c={c} font={font} inputStyle={inputStyle} labelStyle={labelStyle} primaryBtnStyle={primaryBtnStyle} btnGrad={btnGrad} textGrad={textGrad} isDark={isDark} onContinue={() => setStep("verify")} onSignInClicked={() => setStep("login")} />}
            {step === "verify" && <VerifyView c={c} font={font} primaryBtnStyle={primaryBtnStyle} btnGrad={btnGrad} textGrad={textGrad} method={mfaMethod} onVerify={() => setStep("create")} />}
            {step === "create" && <CreateView c={c} font={font} inputStyle={inputStyle} labelStyle={labelStyle} primaryBtnStyle={primaryBtnStyle} btnGrad={btnGrad} textGrad={textGrad} isDark={isDark} onContinue={() => setStep("login")} />}
            {step === "reset"  && <ResetPasswordView c={c} font={font} inputStyle={inputStyle} labelStyle={labelStyle} primaryBtnStyle={primaryBtnStyle} btnGrad={btnGrad} textGrad={textGrad} isDark={isDark} onContinue={() => setStep("login")} />}
          </div>

          {/* Toast — top-right of the form panel, below the step indicator */}
          {toast && (
            <div className="absolute z-50"
              style={{
                top: 56, right: 32, maxWidth: 360,
                fontFamily: FONT,
                background: c.cardBg,
                border: `1px solid ${c.border}`,
                borderRadius: 12,
                boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                padding: "12px 14px",
                animation: "slideInRight 0.25s ease-out",
              }}>
              <div className="flex items-start gap-3">
                {(() => {
                  // Pick the icon by kind, but both kinds use the brand magenta color so the
                  // toast always reads as "Norbielink" rather than the generic amber that
                  // browsers tend to use for warnings.
                  //   warning → AlertCircle (validation nudge — e.g. agency code in login)
                  //   email   → Mail (confirmation message — reset link sent, etc.)
                  const isWarning = toast.kind === "warning";
                  const Icon = isWarning ? AlertCircle : Mail;
                  return (
                    <span className="flex items-center justify-center flex-shrink-0"
                      style={{ width: 32, height: 32, borderRadius: 9, background: isDark ? "rgba(201,166,255,0.22)" : "rgba(166,20,195,0.08)" }}>
                      <Icon className="w-4 h-4" style={{ color: isDark ? "#E6B8FF" : "#A614C3" }} strokeWidth={1.75} />
                    </span>
                  );
                })()}
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: 13, fontWeight: 600, color: c.text }}>{toast.title}</div>
                  <div style={{ fontSize: 12, color: c.muted, marginTop: 2, lineHeight: "16px" }}>{toast.description}</div>
                </div>
                <button onClick={() => setToast(null)}
                  className="flex-shrink-0 transition-colors"
                  style={{ background: "transparent", border: "none", color: c.muted, cursor: "pointer", padding: 2 }}
                  aria-label="Dismiss">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Need help? — floating Norbie launcher + slide-up panel.
              Sits bottom-right of the right pane across every auth step
              so users with login trouble have one obvious place to go. */}
          {!helpOpen && (
            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              className="absolute flex items-center gap-2.5 transition-all"
              style={{
                bottom: 24,
                right: 32,
                padding: "6px 14px 6px 6px",
                borderRadius: 999,
                fontFamily: FONT,
                background: isDark ? "rgba(255,255,255,0.06)" : "#FFFFFF",
                border: `1.5px solid ${isDark ? "rgba(255,255,255,0.14)" : "#E5E7EB"}`,
                cursor: "pointer",
                boxShadow: isDark ? "0 6px 20px rgba(0,0,0,0.40)" : "0 4px 14px rgba(17,24,39,0.08)",
                zIndex: 40,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.28)" : "#D1D5DB";
                e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.10)" : "#F9FAFB";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.14)" : "#E5E7EB";
                e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "#FFFFFF";
              }}
              aria-label="Need help signing in?"
            >
              <Image src={norbieface} alt="Norbie" className="w-8 h-8 rounded-full object-cover" />
              <span className="text-[12.5px] font-semibold" style={{ color: isDark ? "#F9FAFB" : "#2D3653" }}>
                Need help?
              </span>
            </button>
          )}

          {/* Backdrop. The panel sits above the form; without a soft
              dim the overlap looks like a stray floating card and the
              half-visible form above feels truncated. Dim fades the
              form so the panel reads as the current focus. */}
          {helpOpen && (
            <div
              className="absolute inset-0"
              style={{
                background: isDark ? "rgba(15,17,32,0.55)" : "rgba(17,24,39,0.18)",
                backdropFilter: "blur(2px)",
                WebkitBackdropFilter: "blur(2px)",
                zIndex: 35,
                animation: "fadeIn 0.2s ease-out",
              }}
              onClick={closeHelp}
            />
          )}

          {helpOpen && (
            <div
              className="absolute flex flex-col"
              role="dialog"
              aria-label="Need help signing in?"
              style={{
                bottom: 24,
                right: 32,
                width: 380,
                maxHeight: "80vh",
                fontFamily: FONT,
                background: c.cardBg,
                border: `1px solid ${c.border}`,
                borderRadius: 16,
                boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
                animation: "slideInRight 0.2s ease-out",
                overflow: "hidden",
                zIndex: 40,
              }}
            >
              {/* Header. Subtle razz-tint wash backdrops the Norbie
                  intro so the panel reads as a branded support slot
                  rather than a plain modal. Avatar sits in a razz-ring
                  with a tiny green online dot for personality; "Norbie"
                  is the textGrad so it's the single razz-colored word
                  the eye lands on. */}
              <div
                className="flex items-center gap-3 px-4 pt-4 pb-3.5 relative"
              >
                <span
                  className="relative flex-shrink-0"
                  style={{
                    padding: 2,
                    borderRadius: 999,
                    background: isDark
                      ? "linear-gradient(135deg, rgba(201,166,255,0.45), rgba(201,166,255,0.15))"
                      : "linear-gradient(135deg, rgba(166,20,195,0.35), rgba(166,20,195,0.10))",
                  }}
                >
                  <Image src={norbieface} alt="Norbie" className="w-10 h-10 rounded-full object-cover" />
                  <span
                    className="absolute"
                    aria-hidden="true"
                    style={{
                      bottom: 1,
                      right: 1,
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      background: "#22C55E",
                      border: `2px solid ${c.cardBg}`,
                    }}
                  />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold" style={{ color: c.text }}>
                    Hi, I&apos;m{" "}
                    <span
                      style={{
                        background: textGrad,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      Norbie
                    </span>
                  </div>
                  <div className="text-[11.5px] whitespace-nowrap" style={{ color: c.muted, marginTop: 1 }}>
                    Trouble signing in? I&apos;ll loop in support.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeHelp}
                  aria-label="Close help"
                  className="rounded-md transition-colors self-start"
                  style={{ background: "transparent", border: "none", color: c.muted, cursor: "pointer", padding: 4, flexShrink: 0 }}
                  onMouseEnter={e => { e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)"; e.currentTarget.style.color = c.text; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Inset dividers — same lighter token used in Sidenav
                  (gray-100 / 8% white) with horizontal margin so the
                  rule doesn't bleed into the panel's outer border. */}
              <div style={{ height: 1, background: isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6", marginLeft: 16, marginRight: 16 }} />

              <div className="p-4 overflow-y-auto" style={{ flex: "1 1 auto" }}>
                <div className="text-[10px] font-semibold mb-2 uppercase" style={{ color: c.muted, letterSpacing: "0.08em" }}>
                  Common issues
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {[
                    "Forgot my password",
                    "Didn't get my code",
                    "User ID isn't working",
                    "Something else",
                  ].map(label => {
                    const active = helpTopic === label;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setHelpTopic(active ? null : label)}
                        className="text-[11.5px] font-medium transition-colors"
                        style={{
                          padding: "5px 10px",
                          borderRadius: 999,
                          background: active ? (isDark ? "rgba(201,166,255,0.22)" : "rgba(166,20,195,0.08)") : "transparent",
                          color: active ? (isDark ? "#E6B8FF" : "#A614C3") : c.muted,
                          border: `1px solid ${active ? (isDark ? "rgba(201,166,255,0.40)" : "#A614C3") : c.border}`,
                          cursor: "pointer",
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                <label className="text-[10px] font-semibold uppercase block mb-1.5" style={{ color: c.muted, letterSpacing: "0.08em" }}>
                  What&apos;s going on?
                </label>
                <textarea
                  value={helpText}
                  onChange={e => setHelpText(e.target.value)}
                  placeholder="Describe your issue in a sentence or two…"
                  rows={4}
                  className="w-full text-[13px] outline-none resize-none"
                  style={{
                    background: c.inputBg,
                    border: `1px solid ${c.border}`,
                    color: c.text,
                    padding: "10px 12px",
                    borderRadius: 10,
                    fontFamily: FONT,
                  }}
                />
              </div>

              <div style={{ height: 1, background: isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6", marginLeft: 16, marginRight: 16 }} />

              <div className="p-4">
                <button
                  type="button"
                  disabled={!helpText.trim() && !helpTopic}
                  onClick={() => {
                    closeHelp();
                    setToast({
                      kind: "email",
                      title: "Thanks — Norbie's on it",
                      description: "A rep will follow up in 24 hours.",
                    });
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: btnGrad,
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 13,
                    border: "none",
                    cursor: (helpText.trim() || helpTopic) ? "pointer" : "not-allowed",
                    opacity: (helpText.trim() || helpTopic) ? 1 : 0.5,
                    fontFamily: FONT,
                  }}
                >
                  Send to support
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────── LOGIN ──────────────────────────── */
function LoginView({ c, font, inputStyle, labelStyle, primaryBtnStyle, btnGrad, textGrad, isDark, onContinue, onResetLinkClicked, onCreateLinkClicked, onResetEmailSent, onAgencyCodeDetected }: {
  c: Record<string, string>;
  font: React.CSSProperties;
  inputStyle: React.CSSProperties;
  labelStyle: React.CSSProperties;
  primaryBtnStyle: (enabled: boolean) => React.CSSProperties;
  btnGrad: string;
    textGrad: string;
  isDark: boolean;
  onContinue: () => void;
  onResetLinkClicked: () => void;
  onCreateLinkClicked: () => void;
  onResetEmailSent: (email: string, mode: "password" | "both") => void;
  // Called when the user blurs the identifier field having typed something that looks like
  // an agency code (e.g. ACME01, AAA364). Parent surfaces a toast explaining that agency
  // codes don't sign in here — login needs email or User ID.
  onAgencyCodeDetected: (code: string) => void;
}) {
  // Heuristic for "looks like an agency code": 2–5 uppercase letters followed by 1–4 digits,
  // optionally with a separating dash or space — covers patterns like ACME01, AAA364, AC-364,
  // and the Affiliations strings like "AC364" pulled out of the agency directory. Doesn't
  // false-positive on emails (caught by the @), proper User IDs (lowercase), or short typos.
  const looksLikeAgencyCode = (s: string): boolean => {
    const t = s.trim().toUpperCase().replace(/[\s-]+/g, "");
    if (t.includes("@")) return false;
    return /^[A-Z]{2,5}\d{1,4}$/.test(t);
  };
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  // Mismatch hint: shown when a sign-in attempt fails. There's no backend in
  // this prototype, so any entered credentials count as "no match" — enough to
  // surface the error state. An empty form still takes the demo quick-enter
  // path below, so clicking Continue with nothing typed goes straight in.
  const [mismatch, setMismatch] = useState(false);
  // Demo: always allow Continue. Production would require identifier + password.
  const enabled = true;

  const handleContinue = () => {
    if (identifier.trim() === "" && password === "") {
      setMismatch(false);
      onContinue();
      return;
    }
    setMismatch(true);
  };

  return (
    <>
      <h1 className="mb-3" style={{ ...font, fontSize: 32, fontWeight: 600, lineHeight: "38px", color: c.text }}>
        Welcome to{" "}
        <span
          style={{
            background: textGrad,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          NorbieLink!
        </span>
      </h1>
      <p className="mb-8" style={{ ...font, fontSize: 14, color: c.muted, lineHeight: 1.5 }}>
        Your User ID can be found in your invitation email. Otherwise, sign in with your email address.{" "}
        <span style={{ fontWeight: 600, color: "#A614C3" }}>Agency codes cannot be used as your User ID.</span>
      </p>

      <div className="mb-5">
        <label style={labelStyle}>User ID</label>
        <input type="text" value={identifier} onChange={e => { setIdentifier(e.target.value); setMismatch(false); }}
          onBlur={() => {
            // Detect on blur (when the user leaves the field) rather than every keystroke —
            // avoids firing the toast while they're still typing their actual identifier.
            if (looksLikeAgencyCode(identifier)) onAgencyCodeDetected(identifier.trim());
          }}
          placeholder="Cannot be your Agency code"
          style={inputStyle} />
        {/* No persistent hint here — most users don't have an agency code at all, so a
            preemptive "agency code isn't a login" line would be both presumptuous and noisy
            for the majority. The onBlur toast catches the case contextually if/when someone
            actually does type a code. */}
      </div>

      <div className="mb-5">
        <label style={labelStyle}>Password</label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={e => { setPassword(e.target.value); setMismatch(false); }}
            style={{ ...inputStyle, paddingRight: 40 }}
          />
          <button
            type="button"
            onClick={() => setShowPw(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            style={{ color: c.muted, background: "transparent", border: "none", padding: 0, lineHeight: 0 }}
          >
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <label className="flex items-center gap-2 mb-7 cursor-pointer select-none" style={{ ...font, fontSize: 13, color: c.muted }}>
        <input
          type="checkbox"
          checked={remember}
          onChange={e => setRemember(e.target.checked)}
          className="sr-only"
        />
        <span
          className="flex-shrink-0 flex items-center justify-center"
          style={{
            width: 16,
            height: 16,
            borderRadius: 4,
            border: `1.5px solid ${remember ? "transparent" : c.border}`,
            background: remember ? btnGrad : "transparent",
          }}
        >
          {remember && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </span>
        Remember me for 30 days
      </label>

      {mismatch && (
        <p
          role="alert"
          className="mb-4 -mt-3"
          style={{ ...font, fontSize: 13, fontWeight: 600, color: isDark ? "#F87171" : "#DC2626", lineHeight: 1.5 }}
        >
          Your User ID or password doesn&apos;t match our records.
        </p>
      )}

      <button type="button" disabled={!enabled} onClick={handleContinue} style={primaryBtnStyle(enabled)}>
        Continue
      </button>

      <div className="mt-5" style={{ ...font, fontSize: 13, color: c.muted }}>
        Forgot your User ID or password?{" "}
        <button
          type="button"
          onClick={() => setResetOpen(true)}
          className="underline cursor-pointer"
          style={{
            background: textGrad,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            border: "none",
            padding: 0,
            fontWeight: 700,
            fontFamily: FONT,
            fontSize: 13,
            textUnderlineOffset: 3,
          }}
        >
          Reset
        </button>
      </div>

      <div className="mt-2" style={{ ...font, fontSize: 13, color: c.muted }}>
        If you have not created your individual login,{" "}
        <button
          type="button"
          onClick={onCreateLinkClicked}
          className="underline cursor-pointer"
          style={{
            background: textGrad,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            border: "none",
            padding: 0,
            fontWeight: 700,
            fontFamily: FONT,
            fontSize: 13,
            textUnderlineOffset: 3,
          }}
        >
          click here
        </button>
      </div>

      {resetOpen && (
        <ResetModal
          c={c}
          font={font}
          inputStyle={inputStyle}
          labelStyle={labelStyle}
          btnGrad={btnGrad} textGrad={textGrad}
          isDark={isDark}
          onClose={() => setResetOpen(false)}
          onSimulateEmailClick={() => { setResetOpen(false); onResetLinkClicked(); }}
          onEmailSent={(email, mode) => { setResetOpen(false); onResetEmailSent(email, mode); }}
        />
      )}
    </>
  );
}

/* ──────────────────────────── RESET MODAL (3-step wizard) ──────────────────────────── */
type ResetMode = "password" | "both";
type ResetStep = "choose" | "form" | "done";

function ResetModal({ c, font, inputStyle, labelStyle, btnGrad, textGrad, isDark, onClose, onSimulateEmailClick, onEmailSent }: {
  c: Record<string, string>;
  font: React.CSSProperties;
  inputStyle: React.CSSProperties;
  labelStyle: React.CSSProperties;
  btnGrad: string;
    textGrad: string;
  isDark: boolean;
  onClose: () => void;
  onSimulateEmailClick: () => void;
  onEmailSent: (email: string, mode: ResetMode) => void;
}) {
  const [step, setStep] = useState<ResetStep>("choose");
  const [mode, setMode] = useState<ResetMode>("password");
  const [userIdValue, setUserIdValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  // Extra identity fields collected in the "I Forgot Both" recovery flow —
  // they help the back-end match the account when the email alone is ambiguous.
  const [agencyCode, setAgencyCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleContinue = () => {
    if (step === "choose") { setStep("form"); return; }
    if (step === "form")   {
      // Submitting the form "sends the email" — close the modal and toast at the page level.
      onEmailSent(emailValue, mode);
      return;
    }
  };
  const handleBack = () => {
    if (step === "form") { setStep("choose"); return; }
  };

  // Mode-specific copy for the form step.
  const formCopy = {
    password: {
      title: "Reset Your Password",
      body:  "Enter your User ID. We'll send a reset link to your email on file.",
      fields: "userIdOnly",
    },
    both: {
      title: "Recover Your Account",
      // Plain-text fallback / a11y label; the rendered version below highlights
      // the two deliverables in brand magenta so the payoff reads at a glance.
      body:  "Confirm your agency code, name, and email so we can find your account. If they match, we'll send your User ID and a password reset link to that email.",
      fields: "recoverIdentity",
    },
  } as const;

  // JSX version of the "both" form body — highlights "User ID" and
  // "password reset link" (the two deliverables) so the description has rhythm.
  const bothFormBody = (
    <>
      Confirm your agency code, name, and email so we can find your account.
      If they match, we&apos;ll send your{" "}
      <span style={{ color: "#A614C3", fontWeight: 600 }}>User ID</span>
      {" "}and a{" "}
      <span style={{ color: "#A614C3", fontWeight: 600 }}>Password reset link</span>
      {" "}to that email.
    </>
  );

  // Demo: always allow Continue. Production would gate on filled / valid email & User ID.
  const formValid = true;

  // Per-mode done-step description. The "both" flow echoes the email the user
  // entered (highlighted in brand magenta) so it's clear where we sent it.
  const doneDescription: React.ReactNode = mode === "both"
    ? (
        <>
          If we find a match, we&apos;ve emailed your User ID and a password reset link to{" "}
          <span style={{ color: "#A614C3", fontWeight: 600 }}>{emailValue || "the email you entered"}</span>.
        </>
      )
    : `If ${userIdValue || "your User ID"} matches an account, we've sent a password reset link to your email on file.`;

  // Refined tile picker: small leading icon chip + label/sub + trailing radio dot.
  // Matches the visual weight of other modals (Book Roll, Doc Upload).
  const tile = (key: ResetMode, label: string, sub: string, Icon: typeof Lock) => {
    const active = mode === key;
    return (
      <button
        key={key}
        type="button"
        onClick={() => setMode(key)}
        className="flex items-center gap-3 w-full text-left transition-colors"
        style={{
          ...font,
          padding: "12px 14px",
          borderRadius: 12,
          border: `1px solid ${active ? "#A614C3" : c.border}`,
          background: active ? "rgba(166,20,195,0.04)" : "transparent",
          cursor: "pointer",
        }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(0,0,0,0.025)"; }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
      >
        <span className="flex items-center justify-center flex-shrink-0"
          style={{
            width: 34, height: 34, borderRadius: 9,
            background: isDark ? "rgba(201,166,255,0.22)" : "rgba(166,20,195,0.08)",
          }}>
          <Icon className="w-[18px] h-[18px]" style={{ color: isDark ? "#E6B8FF" : "#A614C3" }} strokeWidth={1.75} />
        </span>
        <div className="flex-1 min-w-0">
          <div style={{ fontSize: 13, fontWeight: 600, color: c.text, lineHeight: "18px" }}>{label}</div>
          <div style={{ fontSize: 12, color: c.muted, marginTop: 2, lineHeight: "16px" }}>{sub}</div>
        </div>
        <span className="flex-shrink-0 flex items-center justify-center"
          style={{
            width: 16, height: 16, borderRadius: 9999,
            border: `1.5px solid ${active ? "#A614C3" : c.border}`,
            background: "transparent",
          }}>
          {active && <span style={{ width: 8, height: 8, borderRadius: 9999, background: "#A614C3" }} />}
        </span>
      </button>
    );
  };

  const titleNode = step === "choose"
    ? <>Reset Your <span style={{
        background: textGrad,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}>Account</span></>
    : step === "form" ? formCopy[mode].title
    : "Check Your Inbox";

  const subhead: React.ReactNode = step === "choose" ? "What do you need help with?"
                 : step === "form" ? (mode === "both" ? bothFormBody : formCopy[mode].body)
                 : doneDescription;

  // Portal to <body> so the fixed-position overlay isn't trapped by the scaled
  // form wrapper's transform (which creates a new containing block for `fixed`).
  if (typeof document === "undefined") return null;
  return createPortal((
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl flex flex-col"
        style={{
          fontFamily: FONT,
          background: c.cardBg,
          border: `1px solid ${c.border}`,
          width: "min(520px, 92vw)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.20)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header — compact, matches the Book Roll / Doc Upload pattern */}
        <div className="flex items-start justify-between px-6 pt-5 pb-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-[16px] font-bold" style={{ color: c.text, lineHeight: "22px" }}>
              {titleNode}
            </h3>
            <p style={{ ...font, fontSize: 13, color: c.muted, marginTop: 4, lineHeight: "18px" }}>{subhead}</p>
          </div>
          <button type="button" onClick={onClose}
            className="flex-shrink-0 transition-colors"
            style={{ background: "transparent", border: "none", color: c.muted, cursor: "pointer", marginLeft: 12, padding: 2 }}
            aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-4">
          {step === "choose" && (
            <div className="flex flex-col gap-2">
              {tile("password", "I Forgot My Password", "I know my User ID, just set a new password.",         Lock)}
              {tile("both",     "I Forgot Both",        "Send me my User ID and a password reset link.",        HelpCircle)}
            </div>
          )}

          {step === "form" && formCopy[mode].fields === "userIdOnly" && (
            <div>
              <label style={labelStyle}>User ID</label>
              <input type="text" value={userIdValue} onChange={e => setUserIdValue(e.target.value)}
                autoFocus style={inputStyle} placeholder="Your User ID" />
            </div>
          )}

          {step === "form" && formCopy[mode].fields === "recoverIdentity" && (
            <div className="flex flex-col gap-3">
              <div>
                <label style={labelStyle}>Agency Code</label>
                <input type="text" value={agencyCode} onChange={e => setAgencyCode(e.target.value)}
                  autoFocus style={inputStyle} placeholder="e.g. AC364" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={labelStyle}>First Name</label>
                  <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                    style={inputStyle} placeholder="First name" />
                </div>
                <div>
                  <label style={labelStyle}>Last Name</label>
                  <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                    style={inputStyle} placeholder="Last name" />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" value={emailValue} onChange={e => setEmailValue(e.target.value)}
                  style={inputStyle} placeholder="you@company.com" />
              </div>
            </div>
          )}

          {step === "done" && (
            <div className="flex flex-col items-center text-center py-4">
              <div className="flex items-center justify-center"
                style={{ width: 56, height: 56, borderRadius: 28, background: isDark ? "rgba(201,166,255,0.22)" : "rgba(166,20,195,0.08)", marginBottom: 14 }}>
                <Mail className="w-6 h-6" style={{ color: isDark ? "#E6B8FF" : "#A614C3" }} strokeWidth={2} />
              </div>
              <div style={{ ...font, fontSize: 12, color: c.muted, maxWidth: 360, marginBottom: 10 }}>
                Didn&apos;t get it? Check spam, or try again in a minute.
              </div>
              <div style={{ ...font, fontSize: 11, color: c.muted, maxWidth: 360, fontStyle: "italic" }}>
                Demo: click <span style={{ fontWeight: 600 }}>Open Reset Link</span> below to simulate clicking the link from the email.
              </div>
            </div>
          )}
        </div>

        {/* Footer — secondary action on the left, primary on the right */}
        <div className="flex items-center justify-between gap-2 px-6 pb-5 pt-2">
          {step === "choose" && (
            <>
              <button onClick={onClose}
                className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
                style={{ ...font, border: `1px solid ${c.border}`, color: c.text, background: "transparent", cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={handleContinue}
                className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-all"
                style={{ ...font, background: btnGrad, border: "none", cursor: "pointer" }}>
                Continue
              </button>
            </>
          )}
          {step === "form" && (
            <>
              <button onClick={handleBack}
                className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
                style={{ ...font, border: `1px solid ${c.border}`, color: c.text, background: "transparent", cursor: "pointer" }}>
                Back
              </button>
              <button onClick={handleContinue} disabled={!formValid}
                className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-all"
                style={{ ...font, background: btnGrad, border: "none",
                  opacity: formValid ? 1 : 0.5,
                  cursor: formValid ? "pointer" : "not-allowed" }}>
                Continue
              </button>
            </>
          )}
          {step === "done" && (
            <>
              <button onClick={onClose}
                className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
                style={{ ...font, border: `1px solid ${c.border}`, color: c.text, background: "transparent", cursor: "pointer" }}>
                Close
              </button>
              <button onClick={onSimulateEmailClick}
                className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-all"
                style={{ ...font, background: btnGrad, border: "none", cursor: "pointer" }}>
                Open Reset Link
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  ), document.body);
}

/* ──────────────────────────── MFA METHOD SELECTION ──────────────────────────── */
// Shown between login and verify only when the returning user has both an
// email AND a phone on file. Email-only users skip straight to the verify
// screen with the code pre-sent to their inbox.
function MfaMethodView({ c, font, primaryBtnStyle, btnGrad, textGrad, isDark, onSelect, onBack }: {
  c: Record<string, string>;
  font: React.CSSProperties;
  primaryBtnStyle: (enabled: boolean) => React.CSSProperties;
  btnGrad: string;
    textGrad: string;
  isDark: boolean;
  onSelect: (method: MfaMethod) => void;
  onBack: () => void;
}) {
  void primaryBtnStyle;
  const options: { key: MfaMethod; icon: typeof Mail; title: string; detail: string }[] = [
    { key: "email", icon: Mail,          title: "Email me a code",     detail: "l***********e@amyntagroup.com" },
    { key: "phone", icon: MessageSquare, title: "Text me a code",      detail: "(•••) •••-4102" },
  ];
  // Icon-chip palette for the method tiles. In dark mode the stock
  // razz-tint (rgba(166,20,195,0.10)) with #A614C3 glyph blends into
  // #0F1120 — bump both to the brighter razz we use elsewhere in dark.
  const chipBg = isDark ? "rgba(201,166,255,0.22)" : "rgba(166,20,195,0.10)";
  const chipFg = isDark ? "#E6B8FF" : "#A614C3";
  return (
    <>
      <h1 className="mb-3" style={{ ...font, fontSize: 28, fontWeight: 600, lineHeight: "34px", color: c.text, whiteSpace: "nowrap" }}>
        Choose your{" "}
        <span
          style={{
            background: textGrad,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Verification Method
        </span>
      </h1>
      <p className="mb-8" style={{ ...font, fontSize: 14, color: c.muted }}>
        Pick how you&apos;d like to receive your one-time code.
      </p>

      <div className="flex flex-col gap-3 mb-6">
        {options.map(o => {
          const Icon = o.icon;
          return (
            <button
              key={o.key}
              type="button"
              onClick={() => onSelect(o.key)}
              className="w-full flex items-center gap-3 text-left transition-colors group"
              style={{
                fontFamily: FONT,
                background: c.cardBg,
                border: `1px solid ${c.border}`,
                borderRadius: 12,
                padding: "14px 16px",
                cursor: "pointer",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#A614C3"; e.currentTarget.style.background = "rgba(166,20,195,0.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.background = c.cardBg; }}
            >
              <span
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: chipBg,
                  color: chipFg,
                }}
              >
                <Icon className="w-4 h-4" />
              </span>
              <span className="flex-1 min-w-0">
                <div style={{ fontSize: 14, fontWeight: 600, color: c.text }}>{o.title}</div>
                <div style={{ fontSize: 12.5, color: c.muted, marginTop: 1 }}>{o.detail}</div>
              </span>
              <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: c.muted }} />
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onBack}
        className="transition-opacity hover:opacity-70"
        style={{
          fontFamily: FONT,
          fontSize: 13,
          color: c.muted,
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
      >
        ← Back to sign in
      </button>
    </>
  );
}

/* ──────────────────────────── ADD PHONE (nudge, shown when only email is on file) ──────────────────────────── */
function AddPhoneView({ c, font, primaryBtnStyle, btnGrad, textGrad, isDark, onContinueEmail, onBack }: {
  c: Record<string, string>;
  font: React.CSSProperties;
  primaryBtnStyle: (enabled: boolean) => React.CSSProperties;
  btnGrad: string;
    textGrad: string;
  isDark: boolean;
  onContinueEmail: () => void;
  onBack: () => void;
}) {
  void primaryBtnStyle;
  // Same icon-chip palette logic as MfaMethodView — see note there.
  // Plus a muted disabled variant that's actually visible on #0F1120
  // instead of the near-invisible rgba(0,0,0,0.05) fallback.
  const chipBg = isDark ? "rgba(201,166,255,0.22)" : "rgba(166,20,195,0.10)";
  const chipFg = isDark ? "#E6B8FF" : "#A614C3";
  const chipBgDisabled = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";
  // Same shape as MfaMethodView options — but here "phone" is unavailable
  // (no mobile on file) so it renders as a disabled row.
  const options: { key: MfaMethod; icon: typeof Mail; title: string; detail: string; disabled: boolean }[] = [
    { key: "email", icon: Mail,          title: "Email me a code",  detail: "l***********e@amyntagroup.com", disabled: false },
    { key: "phone", icon: MessageSquare, title: "Text me a code",   detail: "No mobile number on file",       disabled: true  },
  ];
  return (
    <>
      <h1 className="mb-3" style={{ ...font, fontSize: 28, fontWeight: 600, lineHeight: "34px", color: c.text, whiteSpace: "nowrap" }}>
        Choose your{" "}
        <span
          style={{
            background: textGrad,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Verification Method
        </span>
      </h1>
      <p className="mb-8" style={{ ...font, fontSize: 14, color: c.muted }}>
        Pick how you&apos;d like to receive your one-time code.
      </p>

      <div className="flex flex-col gap-3 mb-6">
        {options.map(o => {
          const Icon = o.icon;
          const disabled = o.disabled;
          return (
            <button
              key={o.key}
              type="button"
              disabled={disabled}
              onClick={() => { if (!disabled) onContinueEmail(); }}
              className="w-full text-left transition-colors group"
              style={{
                fontFamily: FONT,
                background: c.cardBg,
                border: `1px solid ${c.border}`,
                borderRadius: 12,
                padding: "14px 16px",
                cursor: disabled ? "not-allowed" : "pointer",
              }}
              onMouseEnter={e => { if (disabled) return; e.currentTarget.style.borderColor = "#A614C3"; e.currentTarget.style.background = "rgba(166,20,195,0.04)"; }}
              onMouseLeave={e => { if (disabled) return; e.currentTarget.style.borderColor = c.border; e.currentTarget.style.background = c.cardBg; }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: disabled ? chipBgDisabled : chipBg,
                    color: disabled ? c.muted : chipFg,
                  }}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <span className="flex-1 min-w-0">
                  <div style={{ fontSize: 14, fontWeight: 600, color: disabled ? c.muted : c.text }}>{o.title}</div>
                  <div style={{ fontSize: 12.5, color: c.muted, marginTop: 1 }}>{o.detail}</div>
                </span>
                {!disabled && <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: c.muted }} />}
              </div>

              {/* Inline explanation — only for the unavailable option. Text
                  is indented 48px (36px icon + 12px gap) so it flows under
                  the "Text me a code" text column above, and paragraphs use
                  a small "How to enable" eyebrow for structure. */}
              {disabled && (
                <div
                  className="mt-3 pt-3"
                  style={{
                    borderTop: `1px solid ${c.border}`,
                    paddingLeft: 48,
                    fontSize: 13,
                    color: c.text,
                    lineHeight: 1.5,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#A614C3",
                      marginBottom: 6,
                    }}
                  >
                    How to enable
                  </div>
                  <p style={{ margin: 0 }}>
                    Sign in with an email code, then in the NorbieLink Marketplace click your name, select{" "}
                    <span style={{ color: "#A614C3", fontWeight: 600 }}>Profile</span>, and add your mobile number. Text verification will be available on your next login.
                  </p>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onBack}
        className="transition-opacity hover:opacity-70"
        style={{
          fontFamily: FONT,
          fontSize: 13,
          color: c.muted,
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
      >
        ← Back to sign in
      </button>
    </>
  );
}

/* ──────────────────────────── VERIFY ──────────────────────────── */
function VerifyView({ c, font, primaryBtnStyle, btnGrad, textGrad, onVerify, method = "email" }: {
  c: Record<string, string>;
  font: React.CSSProperties;
  primaryBtnStyle: (enabled: boolean) => React.CSSProperties;
  btnGrad: string;
    textGrad: string;
  onVerify: () => void;
  method?: MfaMethod;
}) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [seconds, setSeconds] = useState(594); // 9:54 like original
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setInterval(() => setSeconds(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  // Demo: always allow continue regardless of input. Production would require all 6 digits.
  const enabled = true;

  const updateDigit = (i: number, v: string) => {
    const ch = v.replace(/\D/g, "").slice(-1);
    setDigits(prev => { const next = [...prev]; next[i] = ch; return next; });
    if (ch && i < 5) inputs.current[i + 1]?.focus();
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  return (
    <>
      <h1 className="mb-3" style={{ ...font, fontSize: 32, fontWeight: 600, lineHeight: "38px", color: c.text }}>
        Verify Your{" "}
        <span
          style={{
            background: textGrad,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Code
        </span>
      </h1>
      <p className="mb-8" style={{ ...font, fontSize: 14, color: c.muted }}>
        We sent a 6-digit code to{" "}
        <span style={{ fontWeight: 600, color: c.text }}>
          {method === "phone" ? "(•••) •••-4102" : "l***********e@amyntagroup.com"}
        </span>
      </p>

      <div className="flex gap-2 mb-3 w-full">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={el => { inputs.current[i] = el; }}
            value={d}
            onChange={e => updateDigit(i, e.target.value)}
            onKeyDown={e => onKeyDown(i, e)}
            inputMode="numeric"
            maxLength={1}
            className="text-center transition-all flex-1 min-w-0"
            style={{
              fontFamily: FONT,
              aspectRatio: "1 / 1",
              borderRadius: 10,
              border: `1px solid ${c.border}`,
              background: c.cardBg,
              color: c.text,
              fontSize: 22,
              fontWeight: 600,
              outline: "none",
              padding: 0,
            }}
            onFocus={e => {
              e.currentTarget.style.border = "1px solid transparent";
              e.currentTarget.style.background = `linear-gradient(${c.cardBg},${c.cardBg}) padding-box, ${btnGrad} border-box`;
            }}
            onBlur={e => {
              e.currentTarget.style.border = `1px solid ${c.border}`;
              e.currentTarget.style.background = c.cardBg;
            }}
          />
        ))}
      </div>

      <p className="mb-7" style={{ ...font, fontSize: 12, color: c.muted }}>
        Code expires in <span style={{ fontWeight: 600, color: c.text }}>{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}</span>
      </p>

      <button type="button" disabled={!enabled} onClick={onVerify} style={primaryBtnStyle(enabled)}>
        Verify
      </button>

      <div className="mt-5" style={{ ...font, fontSize: 13, color: c.muted }}>
        Didn&apos;t get the code?{" "}
        <button
          type="button"
          onClick={() => setSeconds(594)}
          className="underline cursor-pointer"
          style={{
            background: textGrad,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            border: "none",
            padding: 0,
            fontWeight: 700,
            fontFamily: FONT,
            fontSize: 13,
            textUnderlineOffset: 3,
          }}
        >
          Resend
        </button>
      </div>
    </>
  );
}

/* ──────────────────────────── CREATE PASSWORD ──────────────────────────── */
function SignupView({ c, font, inputStyle, labelStyle, primaryBtnStyle, btnGrad, textGrad, isDark, onContinue, onSignInClicked }: {
  c: Record<string, string>;
  font: React.CSSProperties;
  inputStyle: React.CSSProperties;
  labelStyle: React.CSSProperties;
  primaryBtnStyle: (enabled: boolean) => React.CSSProperties;
  btnGrad: string;
    textGrad: string;
  isDark: boolean;
  onContinue: () => void;
  onSignInClicked: () => void;
}) {
  const [agencyCode, setAgencyCode] = useState("");
  const [agencyPassword, setAgencyPassword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showAgencyPw, setShowAgencyPw] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [remember, setRemember] = useState(false);

  const rules = [
    { label: "Minimum 8 characters",         ok: password.length >= 8 },
    { label: "At least 1 uppercase letter",  ok: /[A-Z]/.test(password) },
    { label: "At least 1 lowercase letter",  ok: /[a-z]/.test(password) },
    { label: "At least 1 number",            ok: /\d/.test(password) },
    { label: "At least 1 special character (!, etc.)", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  // Demo: always allow Continue. Production would gate on all rules + matching passwords + email + agency creds.
  const allValid = true;

  // Reuse the underlined gradient link pattern used by "Reset" on the login page.
  const linkStyle: React.CSSProperties = {
    background: textGrad,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    border: "none",
    padding: 0,
    fontWeight: 700,
    fontFamily: FONT,
    fontSize: 13,
    textUnderlineOffset: 3,
  };

  return (
    <>
      <h1 className="mb-1" style={{ ...font, fontSize: 28, fontWeight: 600, lineHeight: "34px", color: c.text }}>
        Welcome to{" "}
        <span
          style={{
            background: textGrad,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          NorbieLink!
        </span>
      </h1>
      <p className="mb-8" style={{ ...font, fontSize: 14, color: c.muted }}>
        Sign in with your agency, then create your individual login.
      </p>

      {/* ── Agency-level auth ── */}
      <div className="grid grid-cols-2 gap-5 mb-2">
        <div>
          <label style={labelStyle}>Agency Code</label>
          <input value={agencyCode} onChange={e => setAgencyCode(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Agency Password</label>
          <div className="relative">
            <input
              type={showAgencyPw ? "text" : "password"}
              value={agencyPassword}
              onChange={e => setAgencyPassword(e.target.value)}
              style={{ ...inputStyle, paddingRight: 40 }}
            />
            <button
              type="button"
              onClick={() => setShowAgencyPw(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              style={{ color: c.muted, background: "transparent", border: "none", padding: 0, lineHeight: 0 }}
            >
              {showAgencyPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5 mb-6">
        <button type="button" className="underline cursor-pointer text-left" style={linkStyle}>
          Forgot Agency Code?
        </button>
        <button type="button" className="underline cursor-pointer text-left" style={linkStyle}>
          Forgot Agency Password?
        </button>
      </div>

      {/* Divider between agency auth and individual signup — lighter than input-border
          weight so it reads as a section separator, matching app-wide convention. */}
      <div className="mb-5" style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB"}` }} />

      {/* ── Individual signup section header — gradient accent matches Welcome + Continue.
          24/600/30 keeps proper hierarchy under the h1 (28/600) and uses the app's scale. */}
      <h2 className="mb-5" style={{ ...font, fontSize: 24, fontWeight: 600, lineHeight: "30px", color: c.text }}>
        New!{" "}
        <span
          style={{
            background: textGrad,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Create Your Individual Login
        </span>
      </h2>

      <div className="mb-4">
        <label style={labelStyle}>Email Address</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div className="grid grid-cols-2 gap-5 mb-4">
        <div>
          <label style={labelStyle}>Create Password</label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ ...inputStyle, paddingRight: 40 }}
            />
            <button
              type="button"
              onClick={() => setShowPw(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              style={{ color: c.muted, background: "transparent", border: "none", padding: 0, lineHeight: 0 }}
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label style={labelStyle}>Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              style={{ ...inputStyle, paddingRight: 40 }}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              style={{ color: c.muted, background: "transparent", border: "none", padding: 0, lineHeight: 0 }}
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Rules — plain two-column list beneath the password fields. Unmet rules are
          muted (no red-X noise), met rules go green. */}
      <div className="mb-6 grid grid-cols-2 gap-x-4 gap-y-1.5">
        {rules.map(r => (
          <div key={r.label} className="flex items-center gap-2"
            style={{ ...font, fontSize: 12, color: r.ok ? "#73C9B7" : c.muted }}>
            <span className="flex items-center justify-center flex-shrink-0"
              style={{ width: 14, height: 14, borderRadius: 9999,
                background: r.ok ? "rgba(115,201,183,0.14)" : (isDark ? "rgba(255,255,255,0.06)" : "#E5E7EB") }}>
              {r.ok && <Check className="w-2.5 h-2.5" style={{ color: "#73C9B7" }} strokeWidth={3} />}
            </span>
            {r.label}
          </div>
        ))}
      </div>

      <label className="flex items-center gap-2 mb-6 cursor-pointer select-none" style={{ ...font, fontSize: 13, color: c.muted }}>
        <input
          type="checkbox"
          checked={remember}
          onChange={e => setRemember(e.target.checked)}
          className="sr-only"
        />
        <span
          className="flex-shrink-0 flex items-center justify-center"
          style={{
            width: 16,
            height: 16,
            borderRadius: 4,
            border: `1.5px solid ${remember ? "transparent" : c.border}`,
            background: remember ? btnGrad : "transparent",
          }}
        >
          {remember && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </span>
        Remember me for 30 days
      </label>

      <button type="button" disabled={!allValid} onClick={onContinue} style={primaryBtnStyle(allValid)}>
        Continue
      </button>

      <div className="mt-5" style={{ ...font, fontSize: 13, color: c.muted }}>
        Already created individual login?{" "}
        <button
          type="button"
          onClick={onSignInClicked}
          className="underline cursor-pointer"
          style={linkStyle}
        >
          Sign In
        </button>
      </div>
    </>
  );
}

function CreateView({ c, font, inputStyle, labelStyle, primaryBtnStyle, btnGrad, textGrad, isDark, onContinue }: {
  c: Record<string, string>;
  font: React.CSSProperties;
  inputStyle: React.CSSProperties;
  labelStyle: React.CSSProperties;
  primaryBtnStyle: (enabled: boolean) => React.CSSProperties;
  btnGrad: string;
    textGrad: string;
  isDark: boolean;
  onContinue: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const rules = [
    { label: "Minimum 8 characters",        ok: password.length >= 8 },
    { label: "At least 1 uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "At least 1 lowercase letter", ok: /[a-z]/.test(password) },
    { label: "At least 1 number",           ok: /\d/.test(password) },
    { label: "At least 1 special character", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  // Demo: always allow Continue. Production would require all rules + matching passwords + email.
  const allValid = true;

  return (
    <>
      <h1 className="mb-3" style={{ ...font, fontSize: 32, fontWeight: 600, lineHeight: "38px", color: c.text }}>
        Create{" "}
        <span
          style={{
            background: textGrad,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Password
        </span>
      </h1>
      <p className="mb-8" style={{ ...font, fontSize: 14, color: c.muted }}>
        Set a password to finish activating your account.
      </p>

      <div className="mb-5">
        <label style={labelStyle}>Email Address</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="name@example.com"
          style={inputStyle}
        />
      </div>

      <div className="mb-5">
        <label style={labelStyle}>Password</label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ ...inputStyle, paddingRight: 40 }}
          />
          <button
            type="button"
            onClick={() => setShowPw(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            style={{ color: c.muted, background: "transparent", border: "none", padding: 0, lineHeight: 0 }}
          >
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="mb-5">
        <label style={labelStyle}>Confirm Password</label>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            style={{ ...inputStyle, paddingRight: 40 }}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            style={{ color: c.muted, background: "transparent", border: "none", padding: 0, lineHeight: 0 }}
          >
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Password rules — inline, matches the Reset Password view */}
      <div className="mb-6 grid grid-cols-2 gap-x-4 gap-y-1.5">
        {rules.map(r => (
          <div key={r.label} className="flex items-center gap-2"
            style={{ ...font, fontSize: 12, color: r.ok ? "#73C9B7" : c.muted }}>
            <span className="flex items-center justify-center flex-shrink-0"
              style={{ width: 14, height: 14, borderRadius: 9999,
                background: r.ok ? "rgba(115,201,183,0.12)" : (isDark ? "rgba(255,255,255,0.06)" : "#F3F4F6") }}>
              {r.ok && <Check className="w-2.5 h-2.5" style={{ color: "#73C9B7" }} strokeWidth={3} />}
            </span>
            {r.label}
          </div>
        ))}
      </div>

      <button type="button" disabled={!allValid} onClick={onContinue} style={primaryBtnStyle(allValid)}>
        Continue
      </button>

      <div className="mt-5" style={{ ...font, fontSize: 13, color: c.muted }}>
        Already have an account?{" "}
        <button
          type="button"
          className="underline cursor-pointer"
          style={{
            background: textGrad,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            border: "none",
            padding: 0,
            fontWeight: 700,
            fontFamily: FONT,
            fontSize: 13,
            textUnderlineOffset: 3,
          }}
        >
          Sign in
        </button>
      </div>
    </>
  );
}

/* ──────────────────────────── RESET PASSWORD (landing page from email link) ──────────────────────────── */
function ResetPasswordView({ c, font, inputStyle, labelStyle, primaryBtnStyle, btnGrad, textGrad, isDark, onContinue }: {
  c: Record<string, string>;
  font: React.CSSProperties;
  inputStyle: React.CSSProperties;
  labelStyle: React.CSSProperties;
  primaryBtnStyle: (enabled: boolean) => React.CSSProperties;
  btnGrad: string;
    textGrad: string;
  isDark: boolean;
  onContinue: () => void;
}) {
  // These would come from the URL token in production. Hard-coded here so the dev can see the layout.
  const accountUserId = "lisaarmitage01";
  const accountEmail  = "lisa.armitage@amyntagroup.com";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done, setDone] = useState(false);

  const rules = [
    { label: "Minimum 8 characters",         ok: password.length >= 8 },
    { label: "At least 1 uppercase letter",  ok: /[A-Z]/.test(password) },
    { label: "At least 1 lowercase letter",  ok: /[a-z]/.test(password) },
    { label: "At least 1 number",            ok: /\d/.test(password) },
    { label: "At least 1 special character", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const passwordsMatch = password.length > 0 && password === confirm;
  // Demo: always allow Save. Production would require all rules + matching passwords.
  const allValid = true;

  if (done) {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center justify-center mb-5"
          style={{ width: 64, height: 64, borderRadius: 32, background: isDark ? "rgba(201,166,255,0.22)" : "rgba(166,20,195,0.08)" }}>
          <Check className="w-7 h-7" style={{ color: isDark ? "#E6B8FF" : "#A614C3" }} strokeWidth={2.5} />
        </div>
        <h1 className="mb-3" style={{ ...font, fontSize: 28, fontWeight: 600, lineHeight: "34px", color: c.text }}>
          Password{" "}
          <span style={{
            background: textGrad,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>Updated</span>
        </h1>
        <p className="mb-8" style={{ ...font, fontSize: 14, color: c.muted, maxWidth: 360 }}>
          You can now sign in with your new password.
        </p>
        <button type="button" onClick={onContinue} style={{ ...primaryBtnStyle(true), maxWidth: 240 }}>
          Sign in
        </button>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-3" style={{ ...font, fontSize: 32, fontWeight: 600, lineHeight: "38px", color: c.text }}>
        Reset Your{" "}
        <span
          style={{
            background: textGrad,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Password
        </span>
      </h1>
      <p className="mb-6" style={{ ...font, fontSize: 14, color: c.muted }}>
        You&apos;re resetting the password for the account below.
      </p>

      {/* Account context — read-only so the user remembers their User ID after this flow */}
      <div className="mb-6 flex items-center gap-3"
        style={{
          padding: "12px 14px",
          borderRadius: 12,
          border: `1px solid ${c.border}`,
          background: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB",
        }}>
        <span className="flex items-center justify-center flex-shrink-0"
          style={{ width: 36, height: 36, borderRadius: 10, background: isDark ? "rgba(201,166,255,0.22)" : "rgba(166,20,195,0.08)" }}>
          <IdCard className="w-[18px] h-[18px]" style={{ color: isDark ? "#E6B8FF" : "#A614C3" }} strokeWidth={1.75} />
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span style={{ ...font, fontSize: 11, fontWeight: 600, color: c.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>User ID</span>
            <span style={{ ...font, fontSize: 13, fontWeight: 600, color: c.text }}>{accountUserId}</span>
          </div>
          <div style={{ ...font, fontSize: 12, color: c.muted, marginTop: 2 }}>{accountEmail}</div>
        </div>
      </div>

      <div className="mb-5">
        <label style={labelStyle}>New Password</label>
        <div className="relative">
          <input
            type={showPw ? "text" : "password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter a new password"
            style={{ ...inputStyle, paddingRight: 40 }}
          />
          <button type="button" onClick={() => setShowPw(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            style={{ color: c.muted, background: "transparent", border: "none", padding: 0, lineHeight: 0 }}
            aria-label={showPw ? "Hide password" : "Show password"}>
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label style={labelStyle}>Confirm New Password</label>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="Re-enter the new password"
            style={{ ...inputStyle, paddingRight: 40,
              // Override just the border COLOR for the mismatch state;
              // inputStyle sets `border` as a shorthand (no borderColor
              // property) so we can't read it back — hard-code to c.border
              // instead and the browser's default #E5E7EB won't bleed
              // through in dark mode.
              borderColor: confirm.length > 0 && !passwordsMatch ? "#EF4444" : c.border }}
          />
          <button type="button" onClick={() => setShowConfirm(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            style={{ color: c.muted, background: "transparent", border: "none", padding: 0, lineHeight: 0 }}
            aria-label={showConfirm ? "Hide password" : "Show password"}>
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {confirm.length > 0 && !passwordsMatch && (
          <div style={{ ...font, fontSize: 12, color: "#EF4444", marginTop: 6 }}>Passwords don&apos;t match.</div>
        )}
      </div>

      {/* Password rules — same style as CreateView */}
      <div className="mb-6 grid grid-cols-2 gap-x-4 gap-y-1.5">
        {rules.map(r => (
          <div key={r.label} className="flex items-center gap-2"
            style={{ ...font, fontSize: 12, color: r.ok ? "#73C9B7" : c.muted }}>
            <span className="flex items-center justify-center flex-shrink-0"
              style={{ width: 14, height: 14, borderRadius: 9999,
                background: r.ok ? "rgba(115,201,183,0.12)" : (isDark ? "rgba(255,255,255,0.06)" : "#F3F4F6") }}>
              {r.ok && <Check className="w-2.5 h-2.5" style={{ color: "#73C9B7" }} strokeWidth={3} />}
            </span>
            {r.label}
          </div>
        ))}
      </div>

      <button type="button" disabled={!allValid} onClick={() => setDone(true)} style={primaryBtnStyle(allValid)}>
        Save New Password
      </button>

      <p className="mt-5" style={{ ...font, fontSize: 12, color: c.muted, lineHeight: "18px" }}>
        This link expires in 1 hour. If it expires, request a new reset link from the sign-in page.
      </p>
    </>
  );
}
