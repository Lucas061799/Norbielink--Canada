"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search, Plus, Star, MapPin, Users, ChevronDown, ChevronUp,
  ChevronsUpDown, Building2, ChevronLeft, ChevronRight, ArrowRight, X,
  Calendar, RefreshCw, FileText, Edit2, Network, User,
  FileText as QuoteIcon, Shield,
  StickyNote, LayoutGrid, Trash2, Archive, Pin, List, Table2, FolderOpen, FileCheck,
  CheckSquare, Maximize2, Minimize2, Lock, Unlock, Copy, CopyPlus,
  MoreVertical, UserCircle, UserX, UserMinus, Download, Upload, UserCog, Pencil, Globe, Eye, Mail, Phone, Bell, Bookmark, FilePen, AlertCircle, Filter, Paperclip, Check, Send,
  Landmark,
} from "lucide-react";
import { AddressAutocomplete } from "./AddressAutocomplete";
import { StyledSelect } from "./StyledSelect";
// LicenseAlertBanner render paused on 2026-10-30; import kept out so the file
// doesn't carry an unused import warning. Re-add when License expiration ships.
// import LicenseAlertBanner from "./LicenseAlertBanner";

const FONT = "var(--font-montserrat), Montserrat, sans-serif";
const AGENCY_PHONE = "+1 (888) 555-0188";

// UserCog icon stroked with the brand magenta. Used to denote admins.
function GradientUserCog({ size = 18 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block" aria-hidden="true">
      <path d="M10 15H6a4 4 0 0 0-4 4v2" />
      <path d="m14.305 16.53.923-.382" />
      <path d="m15.228 13.852-.923-.383" />
      <path d="m16.852 12.228-.383-.923" />
      <path d="m16.852 17.772-.383.924" />
      <path d="m19.148 12.228.383-.923" />
      <path d="m19.53 18.696-.382-.924" />
      <path d="m20.772 13.852.924-.383" />
      <path d="m20.772 16.148.924.383" />
      <circle cx="18" cy="15" r="3" />
      <circle cx="9" cy="7" r="4" />
    </svg>
  );
}

function generateAgencyCode(): string {
  const letters = Array.from({ length: 2 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join("");
  const digits = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  return letters + digits;
}

function DatePicker({ value, onChange, inputStyle, c, btnGrad, font }: {
  value: string;
  onChange: (v: string) => void;
  inputStyle: React.CSSProperties;
  c: Record<string, string>;
  btnGrad: string;
  font: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"day" | "month" | "year">("day");
  const parts = value?.split("/") ?? [];
  const initDate = parts[2] ? new Date(+parts[2], +parts[0] - 1, +parts[1]) : new Date();
  const [viewY, setViewY] = useState(initDate.getFullYear());
  const [viewM, setViewM] = useState(initDate.getMonth());
  const [yearPage, setYearPage] = useState(Math.floor(initDate.getFullYear() / 12) * 12);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) { setOpen(false); setMode("day"); }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const WEEKDAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  const daysInMonth = new Date(viewY, viewM + 1, 0).getDate();
  const firstDay = new Date(viewY, viewM, 1).getDay();
  const selY = parts[2] ? +parts[2] : null;
  const selM = parts[0] ? +parts[0] - 1 : null;
  const selD = parts[1] ? +parts[1] : null;
  const today = new Date();

  const prev = () => {
    if (mode === "day") { if (viewM === 0) { setViewY(viewY - 1); setViewM(11); } else setViewM(viewM - 1); }
    else if (mode === "month") setViewY(viewY - 1);
    else setYearPage(yearPage - 12);
  };
  const next = () => {
    if (mode === "day") { if (viewM === 11) { setViewY(viewY + 1); setViewM(0); } else setViewM(viewM + 1); }
    else if (mode === "month") setViewY(viewY + 1);
    else setYearPage(yearPage + 12);
  };
  const pick = (d: number) => {
    const mm = String(viewM + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    onChange(`${mm}/${dd}/${viewY}`);
    setOpen(false);
    setMode("day");
  };

  const headerLabel = mode === "day"
    ? `${MONTHS[viewM]} ${viewY}`
    : mode === "month"
    ? String(viewY)
    : `${yearPage} – ${yearPage + 11}`;
  const onHeaderClick = () => {
    if (mode === "day") setMode("month");
    else if (mode === "month") { setYearPage(Math.floor(viewY / 12) * 12); setMode("year"); }
    else setMode("day");
  };

  const cellStyle = (isSel: boolean, isCurrent: boolean): React.CSSProperties => ({
    height: 30,
    color: isSel ? "#fff" : (isCurrent ? "#A855F7" : c.text),
    background: isSel ? btnGrad : "transparent",
    fontWeight: (isSel || isCurrent) ? 700 : 500,
    border: isCurrent && !isSel ? "1px solid rgba(168,85,247,0.45)" : "1px solid transparent",
  });

  return (
    <div ref={wrapRef} className="relative">
      <input value={value} readOnly style={{ ...inputStyle, cursor: "pointer" }} onClick={() => setOpen(o => !o)} />
      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer" style={{ color: c.muted }} onClick={() => setOpen(o => !o)} />
      {open && (
        <div className="absolute z-50 mt-2 rounded-2xl p-4"
          style={{ ...font, background: c.cardBg, border: `1px solid ${c.border}`, width: 280, boxShadow: "0 10px 30px rgba(0,0,0,0.12)", left: 0 }}>
          <div className="flex items-center justify-between mb-3">
            <button type="button" onClick={prev} className="p-1.5 rounded-lg transition-colors"
              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <ChevronLeft className="w-4 h-4" style={{ color: c.text }} />
            </button>
            <button type="button" onClick={onHeaderClick}
              className="text-[13px] font-semibold px-2 py-1 rounded-lg transition-colors"
              style={{ color: c.text }}
              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              {headerLabel}
            </button>
            <button type="button" onClick={next} className="p-1.5 rounded-lg transition-colors"
              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <ChevronRight className="w-4 h-4" style={{ color: c.text }} />
            </button>
          </div>
          {mode === "day" && (
            <>
              <div className="grid grid-cols-7 gap-1 mb-1">
                {WEEKDAYS.map((w, i) => (
                  <div key={i} className="text-center text-[10px] font-semibold py-1" style={{ color: c.muted }}>{w}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const d = i + 1;
                  const isSel = selY === viewY && selM === viewM && selD === d;
                  const isToday = !isSel && today.getFullYear() === viewY && today.getMonth() === viewM && today.getDate() === d;
                  return (
                    <button key={d} type="button" onClick={() => pick(d)}
                      className="text-[12px] rounded-lg transition-all"
                      style={cellStyle(isSel, isToday)}
                      onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = c.hoverBg; }}
                      onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = "transparent"; }}>
                      {d}
                    </button>
                  );
                })}
              </div>
            </>
          )}
          {mode === "month" && (
            <div className="grid grid-cols-3 gap-2">
              {MONTHS_SHORT.map((m, i) => {
                const isSel = selY === viewY && selM === i;
                const isCurrent = !isSel && today.getFullYear() === viewY && today.getMonth() === i;
                return (
                  <button key={m} type="button" onClick={() => { setViewM(i); setMode("day"); }}
                    className="text-[12px] rounded-lg transition-all"
                    style={{ ...cellStyle(isSel, isCurrent), height: 40 }}
                    onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = c.hoverBg; }}
                    onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = "transparent"; }}>
                    {m}
                  </button>
                );
              })}
            </div>
          )}
          {mode === "year" && (
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 12 }).map((_, i) => {
                const y = yearPage + i;
                const isSel = selY === y;
                const isCurrent = !isSel && today.getFullYear() === y;
                return (
                  <button key={y} type="button" onClick={() => { setViewY(y); setMode("month"); }}
                    className="text-[12px] rounded-lg transition-all"
                    style={{ ...cellStyle(isSel, isCurrent), height: 40 }}
                    onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = c.hoverBg; }}
                    onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = "transparent"; }}>
                    {y}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Types ─────────────────────────────────────────────────────────────── */
interface Agency {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  totalUsers: number;
  status: "Appointed" | "Unappointed";
  isStarred: boolean;
  affiliations: string[];
  lastLogin: string;
}

type FilterStatus = "All" | "Starred" | "Appointed" | "Unappointed" | "NeedsAction";
type SortKey = "name" | "code" | "location" | "totalUsers" | "lastLogin" | "status" | null;
type SortDir = "asc" | "desc";
type TabKey = "agencies" | "users" | "affiliations";

/**
 * Classifies an agency as "new" (appointed within last 12 months) or "dormant"
 * (no login activity for >12 months). New takes precedence — a brand-new
 * agency that hasn't logged in yet should still read as new, not dormant.
 */
function getAgencyTimeStatus(apptDate?: string, lastLogin?: string): "new" | "dormant" | null {
  const monthsAgo = (s?: string) => {
    if (!s) return Infinity;
    const t = Date.parse(s);
    if (isNaN(t)) return Infinity;
    const now = new Date();
    const d = new Date(t);
    return (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
  };
  const apptMonths = monthsAgo(apptDate);
  if (apptMonths >= 0 && apptMonths < 12) return "new";
  if (monthsAgo(lastLogin) > 12) return "dormant";
  return null;
}

function TimeStatusBadge({ status, isDark = false }: { status: "new" | "dormant" | null; isDark?: boolean }) {
  if (!status) return null;
  const isNew = status === "new";
  return (
    <span title={isNew ? "New agency · onboarded within the last 12 months" : "Dormant agency · no login activity for over 12 months"}
      className="inline-flex items-center justify-center rounded-full flex-shrink-0 align-middle"
      style={{ width: 18, height: 18, background: isNew
        ? (isDark ? "rgba(168,85,247,0.32)" : "rgba(166,20,195,0.10)")
        : (isDark ? "rgba(148,163,184,0.30)" : "rgba(100,116,139,0.12)") }}>
      {isNew ? (
        <svg width="12" height="12" viewBox="0 -960 960 960" aria-hidden="true" style={{ display: "block" }}>
          <defs>
            <linearGradient id={`tsb-new-grad-${isDark ? "d" : "l"}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={isDark ? "#A855F7" : "#5C2ED4"} />
              <stop offset="100%" stopColor={isDark ? "#D946EF" : "#A614C3"} />
            </linearGradient>
          </defs>
          <path fill={`url(#tsb-new-grad-${isDark ? "d" : "l"})`} d="M440-120v-319q-64 0-123-24.5T213-533q-45-45-69-104t-24-123v-80h80q63 0 122 24.5T426-746q31 31 51.5 68t31.5 79q5-7 11-13.5t13-13.5q45-45 104-69.5T760-720h80v80q0 64-24.5 123T746-413q-45 45-103.5 69T520-320v200h-80Zm0-400q0-48-18.5-91.5T369-689q-34-34-77.5-52.5T200-760q0 48 18 92t52 78q34 34 78 52t92 18Zm80 120q48 0 91.5-18t77.5-52q34-34 52.5-78t18.5-92q-48 0-92 18.5T590-569q-34 34-52 77.5T520-400Zm0 0Zm-80-120Z"/>
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 1024 1024" fill={isDark ? "#94A3B8" : "#64748B"} aria-hidden="true" style={{ display: "block" }}>
          <path d="M927.892105 480.285694c-0.005117 0-0.005117 0-0.010233 0-17.652032 0-31.968086 14.305821-31.973202 31.961946-0.025583 66.875107-17.822924 133.022643-51.467185 191.295837-51.232848 88.73702-133.953851 152.21475-232.927003 178.733731-98.978269 26.508747-202.354708 12.905938-291.086611-38.32691-88.73702-51.232848-152.209634-133.953851-178.728614-232.927003s-12.911054-202.348568 38.321794-291.085588c63.815421-110.531396 178.041976-181.90291 305.542858-190.916191 17.615193-1.248434 30.885428-16.537651 29.641087-34.147728-1.249457-17.615193-16.569374-30.848589-34.147728-29.641087-148.722206 10.517541-281.963837 93.779873-356.416526 222.732827C64.87045 391.496485 48.992831 512.102331 79.930447 627.577319c30.942733 115.469871 104.999402 211.981972 208.526267 271.753287 68.962651 39.814798 145.495722 60.151985 223.050052 60.151985 38.868239 0 78.006632-5.110391 116.562762-15.439644 115.469871-30.942733 211.980949-104.994286 271.753287-208.526267 39.242769-67.973114 60.001559-145.168264 60.032258-223.24755C959.860191 494.611981 945.549254 480.290811 927.892105 480.285694zM614.243639 149.879566l205.200522 0L593.302701 345.894891c-10.085706 8.742105-13.681604 22.829961-9.013281 35.33988 4.663206 12.504802 16.60519 20.794605 29.954219 20.794605l290.904463 0c17.657148 0 31.973202-14.316054 31.973202-31.973202 0-17.657148-14.316054-31.973202-31.973202-31.973202L699.946556 338.082972l226.14146-196.015326c10.084683-8.742105 13.681604-22.829961 9.013281-35.33988-4.663206-12.504802-16.60519-20.794605-29.954219-20.794605L614.243639 85.933161c-17.657148 0-31.973202 14.316054-31.973202 31.973202S596.58649 149.879566 614.243639 149.879566zM355.527273 498.609015l0 31.165814c0 17.657148 14.316054 31.973202 31.973202 31.973202s31.973202-14.316054 31.973202-31.973202L419.473677 498.609015c0-17.657148-14.316054-31.973202-31.973202-31.973202S355.527273 480.951867 355.527273 498.609015zM604.872201 498.609015l0 31.165814c0 17.657148 14.316054 31.973202 31.973202 31.973202 17.657148 0 31.973202-14.316054 31.973202-31.973202L668.818605 498.609015c0-17.657148-14.316054-31.973202-31.973202-31.973202C619.188254 466.635813 604.872201 480.951867 604.872201 498.609015zM479.33402 613.901855c-9.392928-14.763239-28.939099-19.234063-43.837414-9.986445-15.002692 9.320273-19.608593 29.03222-10.288321 44.029796 11.276834 18.151405 42.219567 48.864918 86.660732 48.864918 44.212968 0 75.534324-30.479175 87.072101-48.490388 9.434883-14.732539 5.157463-34.127262-9.450233-43.754526-14.602579-9.617032-34.366715-5.542226-44.181245 8.93551-0.135076 0.192382-13.368472 19.364023-33.440623 19.364023C492.375034 632.864742 480.18234 615.166661 479.33402 613.901855z"/>
        </svg>
      )}
    </span>
  );
}

/* ─── Mock Data ─────────────────────────────────────────────────────────── */
const mockAgencies: Agency[] = [
  { id: "1", name: "Acme Insurance Agency", code: "ACME01", city: "Des Moines", state: "IA", totalUsers: 7,  status: "Appointed",   isStarred: true,  affiliations: ["AAA/ACG (AC364)", "Acrisure"], lastLogin: "04/24/2026" },
  { id: "2", name: "Summit Solutions",      code: "SUMIT22", city: "Chicago",    state: "IL", totalUsers: 3,  status: "Appointed",   isStarred: true,  affiliations: ["Acrisure", "Acceptance"], lastLogin: "04/22/2026" },
  { id: "3", name: "Pioneer Brokers",       code: "PION33",  city: "",           state: "",   totalUsers: 1,  status: "Unappointed", isStarred: true,  affiliations: ["SIAA"], lastLogin: "01/10/2025" },
  { id: "4", name: "Lakefront Coverage",    code: "LAKE04",  city: "Denver",     state: "CO", totalUsers: 10, status: "Appointed",   isStarred: false, affiliations: ["Farmers", "HUB International Limited", "SIAA"], lastLogin: "04/23/2026" },
  { id: "5", name: "Ridgeline Insurance",   code: "RIDG05",  city: "Des Moines", state: "IA", totalUsers: 23, status: "Appointed",   isStarred: false, affiliations: ["AAA/ACG (AC364)", "ASNOA (AL335)", "Acrisure"], lastLogin: "04/24/2026" },
  { id: "6", name: "Harbor Risk Group",     code: "HARB06",  city: "New York",   state: "NY", totalUsers: 5,  status: "Unappointed", isStarred: false, affiliations: ["IronPeak", "ISU"], lastLogin: "02/05/2026" },
  { id: "7", name: "Midland Shield Co.",    code: "MIDL07",  city: "Des Moines", state: "IA", totalUsers: 3,  status: "Unappointed", isStarred: false, affiliations: ["Premier Group (PR196)"], lastLogin: "01/12/2026" },
  { id: "8", name: "Coastal Guard LLC",     code: "COAS08",  city: "New York",   state: "NY", totalUsers: 6,  status: "Unappointed", isStarred: false, affiliations: ["SIAA", "Smart Choice"], lastLogin: "02/15/2025" },
  { id: "9", name: "Apex Risk Partners",    code: "APEX09",  city: "Austin",     state: "TX", totalUsers: 12, status: "Appointed",   isStarred: false, affiliations: ["Foundation Risk Partners", "Renaissance Alliance", "PIIB"], lastLogin: "04/20/2026" },
  { id: "10", name: "Keystone Group",       code: "KEYS10",  city: "Philadelphia", state: "PA", totalUsers: 8, status: "Appointed",  isStarred: false, affiliations: ["United Agencies"], lastLogin: "04/18/2026" },
  { id: "11", name: "BlueSky Brokers",      code: "BLUE11",  city: "Seattle",    state: "WA", totalUsers: 4,  status: "Unappointed", isStarred: false, affiliations: ["Insurance Alliance Network", "Join the Brokers"], lastLogin: "03/30/2026" },
  { id: "12", name: "Ironclad Insurance",   code: "IRON12",  city: "Dallas",     state: "TX", totalUsers: 15, status: "Appointed",   isStarred: false, affiliations: ["LTA Marketing Group (LT006)", "Pacific Crest (PA004)", "TWFG (TW037)"], lastLogin: "04/24/2026" },
];

// ── ITC (accounting) records ─────────────────────────────────────────────
// Super-admin-only surface — mirrors the downstream ITC producer record
// (ViewProducer API). Field set matches the AddProducer / EditProducer
// payloads so the Norbielink UI stays 1:1 with what ITC round-trips. A
// `null` value means the agency exists in Norbielink but has NOT been
// registered in ITC yet (empty state).
type ITCStatus = "Active" | "Suspended" | "Terminated" | "Pending";
type AgentBroker = "Agent" | "Broker";
type Tax1099Type = "Individual" | "Corporation" | "Partnership" | "LLC";

interface ITCRecord {
  // Producer
  producerCode: string;
  agentOrBroker: AgentBroker;
  shortName: string;
  name: string;
  dba: string;
  status: ITCStatus;

  // Contact
  address: string;
  city: string;
  state: string;
  zip: string;
  telephone: string;
  email: string;
  accountingEmail: string;
  statementEmail: string;

  // Appointment & compliance
  appointmentDate: string;   // MM/DD/YYYY
  licenseNo: string;
  licenseExpires: string;
  // (NPN is NOT an ITC column — it lives in Norbielink's NASCP database,
  // sourced from NIPR. We don't store or display it on the ITC Record
  // surface; the agency's NPN is shown on the Overview tab only.)
  eoPolicyNo: string;
  eoPolicyExpires: string;
  taxId: string;
  tax1099Type: Tax1099Type;
  tax1099Name: string;

  // Preferences
  emailStatements: boolean;
  directDeposits: boolean;
  directDepositsCommissionOnly: boolean;
  farmersAgent: boolean;
  smartChoiceAgent: boolean;
  piibAgent: boolean;

  // Consolidated Billing
  useConsolidatedBillingId: boolean;
  consolidatedBillingId: string;
  isConsolidatedBillingProducer: boolean;

  // Affiliation
  isAffiliatedWith: boolean;
  affiliatedWithId: string;
  isAffiliationMain: boolean;
  subProducerName: string;
}

const INITIAL_ITC_RECORDS: Record<string, ITCRecord | null> = {
  ACME01: {
    producerCode: "AC192", agentOrBroker: "Agent", shortName: "AC192", name: "ACME INSURANCE AGENCY", dba: "", status: "Active",
    // Deliberate demo mismatch: agency Overview has 1111 6th Ave / 515-222-1000,
    // ITC still has the older Cherry Ave + a stale phone — surfaces as
    // "2 pending updates" on the ITC Record for the super admin to review.
    address: "980 Cherry Ave", city: "Des Moines", state: "IA", zip: "50314",
    telephone: "5152220999", email: "jason@acmeins.com", accountingEmail: "d.kim@acmeins.com", statementEmail: "d.kim@acmeins.com",
    appointmentDate: "03/24/2026", licenseNo: "LC-88210", licenseExpires: "03/24/2028",
    eoPolicyNo: "EO-4421", eoPolicyExpires: "03/24/2027", taxId: "121222334455", tax1099Type: "LLC", tax1099Name: "Acme Insurance Agency LLC",
    emailStatements: true, directDeposits: true, directDepositsCommissionOnly: false,
    farmersAgent: false, smartChoiceAgent: true, piibAgent: false,
    useConsolidatedBillingId: false, consolidatedBillingId: "", isConsolidatedBillingProducer: false,
    isAffiliatedWith: true, affiliatedWithId: "ACRS01", isAffiliationMain: false, subProducerName: "",
  },
  SUMIT22: {
    producerCode: "SU447", agentOrBroker: "Agent", shortName: "SU447", name: "SUMMIT SOLUTIONS INC", dba: "Summit Sol", status: "Active",
    address: "200 N Michigan", city: "Chicago", state: "IL", zip: "60601",
    telephone: "3125550100", email: "m.chen@summitsol.com", accountingEmail: "billing@summitsol.com", statementEmail: "billing@summitsol.com",
    appointmentDate: "01/12/2024", licenseNo: "LC-22110", licenseExpires: "01/15/2027",
    eoPolicyNo: "EO-1120", eoPolicyExpires: "01/15/2027", taxId: "930011223", tax1099Type: "Corporation", tax1099Name: "Summit Solutions Inc",
    emailStatements: true, directDeposits: false, directDepositsCommissionOnly: false,
    farmersAgent: false, smartChoiceAgent: false, piibAgent: false,
    useConsolidatedBillingId: false, consolidatedBillingId: "", isConsolidatedBillingProducer: true,
    isAffiliatedWith: false, affiliatedWithId: "", isAffiliationMain: false, subProducerName: "",
  },
  PION33: null, // Not registered in ITC — demo empty state
  LAKE04: {
    producerCode: "LK211", agentOrBroker: "Broker", shortName: "LK211", name: "LAKEFRONT COVERAGE", dba: "", status: "Active",
    address: "820 Lakefront Blvd", city: "Denver", state: "CO", zip: "80203",
    telephone: "3035551010", email: "o.bennett@lakefrontcov.com", accountingEmail: "", statementEmail: "",
    appointmentDate: "08/02/2023", licenseNo: "LC-11245", licenseExpires: "08/02/2027",
    eoPolicyNo: "EO-9911", eoPolicyExpires: "08/02/2026", taxId: "845123765", tax1099Type: "Corporation", tax1099Name: "Lakefront Coverage",
    emailStatements: true, directDeposits: true, directDepositsCommissionOnly: true,
    farmersAgent: false, smartChoiceAgent: false, piibAgent: true,
    useConsolidatedBillingId: false, consolidatedBillingId: "", isConsolidatedBillingProducer: false,
    isAffiliatedWith: false, affiliatedWithId: "", isAffiliationMain: false, subProducerName: "",
  },
  RIDG05: {
    producerCode: "RI083", agentOrBroker: "Agent", shortName: "RI083", name: "RIDGELINE INSURANCE", dba: "", status: "Suspended",
    address: "445 Ridgeway Dr", city: "Des Moines", state: "IA", zip: "50310",
    telephone: "5155552020", email: "n.avery@ridgelineins.com", accountingEmail: "n.avery@ridgelineins.com", statementEmail: "n.avery@ridgelineins.com",
    appointmentDate: "11/15/2022", licenseNo: "LC-33902", licenseExpires: "11/15/2026",
    eoPolicyNo: "EO-2210", eoPolicyExpires: "11/15/2025", taxId: "223456781", tax1099Type: "Individual", tax1099Name: "Nicole Avery",
    emailStatements: true, directDeposits: true, directDepositsCommissionOnly: false,
    farmersAgent: true, smartChoiceAgent: false, piibAgent: false,
    useConsolidatedBillingId: false, consolidatedBillingId: "", isConsolidatedBillingProducer: false,
    isAffiliatedWith: false, affiliatedWithId: "", isAffiliationMain: false, subProducerName: "",
  },
  HARB06: null,
  MIDL07: {
    producerCode: "MD020", agentOrBroker: "Agent", shortName: "MD020", name: "MIDLAND INSURANCE PARTNERS", dba: "", status: "Pending",
    address: "77 Main St", city: "Wichita", state: "KS", zip: "67202",
    telephone: "3165550707", email: "contact@midlandins.com", accountingEmail: "", statementEmail: "",
    appointmentDate: "04/01/2026", licenseNo: "LC-77801", licenseExpires: "04/01/2028",
    eoPolicyNo: "EO-4408", eoPolicyExpires: "04/01/2027", taxId: "556789012", tax1099Type: "LLC", tax1099Name: "Midland Insurance Partners LLC",
    emailStatements: false, directDeposits: false, directDepositsCommissionOnly: false,
    farmersAgent: false, smartChoiceAgent: true, piibAgent: false,
    useConsolidatedBillingId: false, consolidatedBillingId: "", isConsolidatedBillingProducer: false,
    isAffiliatedWith: false, affiliatedWithId: "", isAffiliationMain: false, subProducerName: "",
  },
  COAS08: null,
  APEX09: {
    producerCode: "AP188", agentOrBroker: "Agent", shortName: "AP188", name: "APEX RISK ADVISORS", dba: "", status: "Active",
    address: "500 Congress Ave", city: "Austin", state: "TX", zip: "78701",
    telephone: "5125559090", email: "b.carlson@apexrisk.com", accountingEmail: "billing@apexrisk.com", statementEmail: "billing@apexrisk.com",
    appointmentDate: "06/14/2024", licenseNo: "LC-55621", licenseExpires: "06/14/2027",
    eoPolicyNo: "EO-8801", eoPolicyExpires: "06/14/2027", taxId: "743210987", tax1099Type: "Corporation", tax1099Name: "Apex Risk Advisors",
    emailStatements: true, directDeposits: true, directDepositsCommissionOnly: false,
    farmersAgent: false, smartChoiceAgent: false, piibAgent: false,
    useConsolidatedBillingId: true, consolidatedBillingId: "CB-9902", isConsolidatedBillingProducer: false,
    isAffiliatedWith: false, affiliatedWithId: "", isAffiliationMain: false, subProducerName: "Apex-Central",
  },
  KEYS10: {
    producerCode: "KY145", agentOrBroker: "Broker", shortName: "KY145", name: "KEYSTONE UNDERWRITERS", dba: "", status: "Active",
    address: "18 Market St", city: "Philadelphia", state: "PA", zip: "19107",
    telephone: "2155551045", email: "ops@keystone-uw.com", accountingEmail: "", statementEmail: "",
    appointmentDate: "09/03/2023", licenseNo: "LC-90112", licenseExpires: "09/03/2026",
    eoPolicyNo: "EO-6620", eoPolicyExpires: "09/03/2026", taxId: "334567890", tax1099Type: "Corporation", tax1099Name: "Keystone Underwriters",
    emailStatements: true, directDeposits: false, directDepositsCommissionOnly: false,
    farmersAgent: false, smartChoiceAgent: false, piibAgent: false,
    useConsolidatedBillingId: false, consolidatedBillingId: "", isConsolidatedBillingProducer: false,
    isAffiliatedWith: false, affiliatedWithId: "", isAffiliationMain: false, subProducerName: "",
  },
  BLUE11: null,
  IRON12: {
    producerCode: "IR203", agentOrBroker: "Agent", shortName: "IR203", name: "IRONBRIDGE INSURANCE GROUP", dba: "", status: "Active",
    address: "9 Founders Way", city: "Boston", state: "MA", zip: "02110",
    telephone: "6175551212", email: "info@ironbridge.com", accountingEmail: "acct@ironbridge.com", statementEmail: "acct@ironbridge.com",
    appointmentDate: "02/28/2025", licenseNo: "LC-44412", licenseExpires: "02/28/2028",
    eoPolicyNo: "EO-3341", eoPolicyExpires: "02/28/2027", taxId: "998765432", tax1099Type: "LLC", tax1099Name: "Ironbridge Insurance Group LLC",
    emailStatements: true, directDeposits: true, directDepositsCommissionOnly: false,
    farmersAgent: false, smartChoiceAgent: false, piibAgent: true,
    useConsolidatedBillingId: false, consolidatedBillingId: "", isConsolidatedBillingProducer: false,
    isAffiliatedWith: false, affiliatedWithId: "", isAffiliationMain: false, subProducerName: "",
  },
};

/* ─── Extended mock detail data ─────────────────────────────────────────── */
interface AgencyDetail extends Agency {
  website: string;
  street: string;
  zip: string;
  apptDate: string;
  contact: string;
  contactPhone: string;
  contactEmail: string;
  bizType: string;
  taxId: string;
  phone: string;
  tollFree: string;
  npn: string;             // National Producer Number — persists to agency_details on Register
  licenseNo: string;
  licenseExp: string;
  eoPolicyNo: string;
  eoExp: string;
  agencyBill: boolean;
  directBill: boolean;
  premiumFin: boolean;
  agencyType: "Retail" | "Wholesale";
  affiliations: string[];
  workersComp: string[];
  badges?: string[];
}

const mockDetails: Record<string, Partial<AgencyDetail>> = {
  "1": { website: "www.acmeins.com",      street: "1111 6th Ave",   zip: "50314", apptDate: "03/24/2026", contact: "Jason Smith",      contactPhone: "650-768-0850", contactEmail: "jason@acmeins.com",     bizType: "LLC",            taxId: "121222334455", phone: "515-222-1000", tollFree: "",             npn: "17482910", licenseNo: "LC-88210", licenseExp: "12/24/2027", eoPolicyNo: "EO-4421", eoExp: "03/24/2026", agencyBill: true,  directBill: true,  premiumFin: true,  agencyType: "Retail",     affiliations: ["AAA/ACG (AC364)", "Acrisure"], workersComp: ["AIG", "AmTrust"], badges: ["Strategic Partner", "VIP"] },
  "2": { website: "www.summitsol.com",    street: "200 N Michigan",  zip: "60601", apptDate: "01/15/2025", contact: "Maria Chen",       contactPhone: "312-555-0190", contactEmail: "m.chen@summitsol.com",  bizType: "Corporation",    taxId: "930011223",   phone: "312-555-0100", tollFree: "800-555-0100", npn: "20911345", licenseNo: "LC-22110", licenseExp: "01/15/2027", eoPolicyNo: "EO-1120", eoExp: "01/15/2027", agencyBill: true,  directBill: false, premiumFin: true,  agencyType: "Wholesale",  affiliations: ["Acrisure", "Acceptance"], workersComp: ["CNA"], badges: ["DreamTeam"] },
  "3": { website: "",                     street: "",                zip: "",      apptDate: "06/01/2024", contact: "Tom Lawson",       contactPhone: "",             contactEmail: "",                      bizType: "Sole Proprietor",taxId: "456789012",   phone: "",             tollFree: "",             licenseNo: "LC-77001", licenseExp: "06/01/2026", eoPolicyNo: "EO-7701", eoExp: "06/01/2026", agencyBill: false, directBill: true,  premiumFin: false, agencyType: "Retail",     affiliations: ["Farmers", "ISU"], workersComp: ["GUARD", "Zenith"], badges: [] },
};

function getDetail(a: Agency): AgencyDetail {
  const d = mockDetails[a.id] ?? {};
  return {
    ...a,
    website:       d.website       ?? "www.example.com",
    street:        d.street        ?? "100 Main St",
    zip:           d.zip           ?? "00000",
    apptDate:      d.apptDate      ?? "03/24/2026",
    contact:       d.contact       ?? "Agency Contact",
    contactPhone:  d.contactPhone  ?? "000-000-0000",
    contactEmail:  d.contactEmail  ?? "contact@example.com",
    bizType:       d.bizType       ?? "-Business Type",
    taxId:         d.taxId         ?? "",
    phone:         d.phone         ?? "000-000-0000",
    tollFree:      d.tollFree      ?? "",
    npn:           d.npn           ?? "",
    licenseNo:     d.licenseNo     ?? "",
    licenseExp:    d.licenseExp    ?? "03/24/2026",
    eoPolicyNo:    d.eoPolicyNo    ?? "",
    eoExp:         d.eoExp         ?? "03/24/2026",
    agencyBill:    d.agencyBill    ?? true,
    directBill:    d.directBill    ?? true,
    premiumFin:    d.premiumFin    ?? true,
    agencyType:    d.agencyType    ?? "Retail",
    affiliations:  d.affiliations  ?? ["AAA/ACG (AC364)"],
    workersComp:   d.workersComp   ?? ["AIG"],
    badges:        d.badges        ?? [],
  };
}

// Shared with the agency-list badge: how many Norbielink agency-info fields
// differ from what's currently frozen in the ITC producer record. Same
// normalization the ITC Record view uses so pure formatting differences
// (phone digits, name casing) don't count as diffs.
function countPendingItcUpdates(a: AgencyDetail, record: ITCRecord | null): number {
  if (!record) return 0;
  const norm = (label: string, v: string) => {
    const s = (v ?? "").trim();
    if (label === "Telephone") return s.replace(/\D/g, "");
    if (label === "Name" || label === "DBA") return s.toLowerCase();
    return s;
  };
  const map: Array<[keyof ITCRecord, string, string]> = [
    ["name",           "Name",            a.name],
    ["address",        "Address",         a.street],
    ["city",           "City",            a.city],
    ["state",          "State",           a.state],
    ["zip",            "Zip",             a.zip],
    ["telephone",      "Telephone",       a.phone],
    ["email",          "Email",           a.contactEmail],
    ["licenseNo",      "License No",      a.licenseNo],
    ["licenseExpires", "License Expires", a.licenseExp],
  ];
  return map.reduce((n, [k, label, av]) => n + (norm(label, av) !== norm(label, String(record[k] ?? "")) ? 1 : 0), 0);
}

/* ─── Agency Quotes & Policies ──────────────────────────────────────────── */
interface AgencyQuote {
  id: string; quoteId: string; applicant: string; dba?: string;
  createdDate: string; effectiveDate?: string; lob: string;
  status: string; producer: string; agencyId: string; premium: number;
}
interface AgencyPolicy {
  id: string; policyNumber: string; applicant: string; dba?: string;
  createdDate: string; effectiveDate: string; lob: string;
  status: string; producer: string; agencyId: string; premium: number;
}

const mockAgencyQuotes: AgencyQuote[] = [
  { id:"aq1",  quoteId:"QMWC-A001-2026", applicant:"Riverside Auto LLC",   dba:"Riverside",    createdDate:"2026-01-10", effectiveDate:"2026-02-01", lob:"Commercial Auto",   status:"Issued",         producer:"Jane Smith",    agencyId:"1", premium:14200 },
  { id:"aq2",  quoteId:"QMWC-A002-2026", applicant:"Summit Builders Inc",  dba:"SummitBuild",  createdDate:"2026-02-05", effectiveDate:"2026-03-01", lob:"General Liability", status:"Under Review",   producer:"Sarah Johnson", agencyId:"1", premium:8500  },
  { id:"aq3",  quoteId:"QMWC-A003-2026", applicant:"NorthStar Logistics",  dba:"NSL",          createdDate:"2026-02-18", effectiveDate:"2026-04-01", lob:"Worker's Comp",     status:"Approved",       producer:"Jane Smith",    agencyId:"1", premium:22000 },
  { id:"aq4",  quoteId:"QMWC-A004-2026", applicant:"Prairie Home Rentals", dba:"PHR",          createdDate:"2026-03-01", effectiveDate:"2026-04-15", lob:"Property",          status:"Incomplete",     producer:"Mike Chen",     agencyId:"1", premium:6800  },
  { id:"aq5",  quoteId:"QMWC-A005-2026", applicant:"Keystone Transport",                       createdDate:"2026-03-15", effectiveDate:"2026-05-01", lob:"Commercial Auto",   status:"Declined",       producer:"Sarah Johnson", agencyId:"1", premium:9300  },
  { id:"aq6",  quoteId:"QMWC-B001-2026", applicant:"Great Lakes Freight",  dba:"GLF",          createdDate:"2026-01-20", effectiveDate:"2026-02-15", lob:"Worker's Comp",     status:"Bound",          producer:"Maria Chen",    agencyId:"2", premium:31500 },
  { id:"aq7",  quoteId:"QMWC-B002-2026", applicant:"Lakeview Contractors",                     createdDate:"2026-03-08", effectiveDate:"2026-04-01", lob:"General Liability", status:"Requested Info", producer:"Tom Harris",    agencyId:"2", premium:7200  },
];
const mockAgencyPolicies: AgencyPolicy[] = [
  { id:"ap1", policyNumber:"POL-A-10041", applicant:"Riverside Auto LLC",  dba:"Riverside",   createdDate:"2026-02-01", effectiveDate:"2026-02-01", lob:"Commercial Auto",   status:"Bound",           producer:"Jane Smith",    agencyId:"1", premium:14200 },
  { id:"ap2", policyNumber:"POL-A-10042", applicant:"NorthStar Logistics", dba:"NSL",         createdDate:"2026-04-01", effectiveDate:"2026-04-01", lob:"Worker's Comp",     status:"Issued",          producer:"Jane Smith",    agencyId:"1", premium:22000 },
  { id:"ap3", policyNumber:"POL-A-10039", applicant:"Clearfield Bakery",   dba:"CB Sweets",   createdDate:"2025-06-01", effectiveDate:"2025-06-01", lob:"General Liability", status:"Renewal Created", producer:"Sarah Johnson", agencyId:"1", premium:5500  },
  { id:"ap4", policyNumber:"POL-A-10022", applicant:"Delta Roofing Co",                       createdDate:"2025-01-15", effectiveDate:"2025-01-15", lob:"Property",          status:"File Closed",     producer:"Mike Chen",     agencyId:"1", premium:8100  },
  { id:"ap5", policyNumber:"POL-B-20011", applicant:"Great Lakes Freight", dba:"GLF",         createdDate:"2026-02-15", effectiveDate:"2026-02-15", lob:"Worker's Comp",     status:"Bound",           producer:"Maria Chen",    agencyId:"2", premium:31500 },
];

/* ─── Agency Notes ───────────────────────────────────────────────────────── */
interface AgencyNote {
  id: string; title: string; content: string; author: string;
  timestamp: string; agencyId: string;
  type: "General" | "Policy" | "Follow-up" | "Meeting" | "Task";
  visibility?: "Private" | "Shared";
}
const mockAgencyNotes: AgencyNote[] = [
  { id:"an1", title:"Initial Appointment Call",   content:"Spoke with Jason Smith about getting appointed. They handle primarily commercial lines in the Midwest. Sent onboarding packet.",       author:"Sarah Johnson", timestamp:"2026-03-01T10:00:00", agencyId:"1", type:"Meeting",   visibility:"Shared"  },
  { id:"an2", title:"E&O Verification",           content:"Confirmed E&O policy is current. Expires 03/24/2026. Requested updated cert for file.",                                              author:"Jane Smith",    timestamp:"2026-03-10T14:30:00", agencyId:"1", type:"Policy",    visibility:"Shared"  },
  { id:"an3", title:"Follow up on license renewal", content:"License renewal reminder sent. LC-88210 expires soon. Jason confirmed they are in process.",                                      author:"Sarah Johnson", timestamp:"2026-03-20T09:00:00", agencyId:"1", type:"Follow-up", visibility:"Private" },
  { id:"an4", title:"Portal access set up",       content:"Created login credentials for the agency portal. Sent welcome email with training links.",                                          author:"Mike Chen",     timestamp:"2026-04-01T11:15:00", agencyId:"1", type:"General",   visibility:"Shared"  },
  { id:"an5", title:"Q1 Performance Review",      content:"Agency submitted 12 quotes in Q1. Conversion rate 41%. Strong performance in Workers Comp and GL lines. Recommended for Pro tier.", author:"Jane Smith",    timestamp:"2026-04-10T16:00:00", agencyId:"1", type:"Meeting",   visibility:"Shared"  },
];

/* ─── Quote / Policy filter constants ───────────────────────────────────── */
const ALL_LOBS = [
  "All LOBs","General Liability","Worker's Comp","Business Owners","Professional Liability",
  "Excess","Bonds","Commercial Auto","Builders Risk","Cannabis","Cyber","Home Based Business",
  "Inland Marine","Lessor's Risk","Non-Profit","Pollution Liability","Special Events",
  "Truckers GL","Vacant Risks","Boats/Marine","Contractors GL",
];
// Vocabularies mirror the main Quotes / Policies pages so the STATUS pill
// + filter list read as one system across surfaces.
const QUOTE_STATUSES  = [
  "All Statuses",
  "Incomplete", "Submitted", "Under Review", "Requested Info",
  "Declined", "File Closed", "Cancelled",
  "Renewal Pending", "Renewal Created",
  "Approved", "Bound",
  "Paid-Bind Incomplete", "Submission Incomplete",
  "Issued", "Bind Incomplete",
];
const POLICY_STATUSES = [
  "All Statuses",
  "File Closed", "Cancelled", "Renewal Created",
  "Bound", "Paid-Bind Incomplete", "Issued",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sortItems<T>(items: T[], key: string | null, dir: "asc" | "desc"): T[] {
  if (!key) return items;
  return [...items].sort((a, b) => {
    const va = String((a as any)[key] ?? "");
    const vb = String((b as any)[key] ?? "");
    return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
  });
}

/* ─── Agency Users ───────────────────────────────────────────────────────── */
interface AgencyUser {
  id: string; name: string; isAdmin: boolean;
  jobTitle: string; email: string; phone: string; ext: string; agencyId: string;
}
const mockAgencyUsers: AgencyUser[] = [
  // Acme Insurance Agency (1)
  { id:"u1",  name:"Jason Smith",      isAdmin:true,  jobTitle:"Principal",       email:"jason@acmeins.com",        phone:"(888) 888-8888", ext:"125", agencyId:"1" },
  { id:"u3",  name:"Tom Garfield",     isAdmin:true,  jobTitle:"Producer",        email:"tom.g@acmeins.com",        phone:"(888) 888-8888", ext:"126", agencyId:"1" },
  { id:"u4",  name:"Amy Chen",         isAdmin:true,  jobTitle:"Producer",        email:"amy.chen@acmeins.com",     phone:"(888) 888-8888", ext:"127", agencyId:"1" },
  { id:"u5",  name:"Brian Nguyen",     isAdmin:false, jobTitle:"Producer",        email:"b.nguyen@acmeins.com",     phone:"(888) 888-8888", ext:"128", agencyId:"1" },
  { id:"u6",  name:"Sandra Park",      isAdmin:false, jobTitle:"Producer",        email:"s.park@acmeins.com",       phone:"(888) 888-8888", ext:"129", agencyId:"1" },
  { id:"u7",  name:"Lisa Wong",        isAdmin:false, jobTitle:"CSR",             email:"l.wong@acmeins.com",       phone:"(888) 888-8888", ext:"130", agencyId:"1" },
  { id:"u10", name:"Diane Kim",        isAdmin:false, jobTitle:"Accounting",      email:"d.kim@acmeins.com",        phone:"(888) 888-8888", ext:"131", agencyId:"1" },

  // Summit Solutions (2)
  { id:"u8",  name:"Maria Chen",       isAdmin:true,  jobTitle:"Principal",       email:"m.chen@summitsol.com",     phone:"(312) 555-0190", ext:"",    agencyId:"2" },
  { id:"u9",  name:"Tom Harris",       isAdmin:false, jobTitle:"Producer",        email:"tom@summitsol.com",        phone:"(312) 555-0191", ext:"201", agencyId:"2" },
  { id:"u11", name:"Rachel Brooks",    isAdmin:false, jobTitle:"Account Manager", email:"r.brooks@summitsol.com",   phone:"(312) 555-0192", ext:"202", agencyId:"2" },

  // Pioneer Brokers (3)
  { id:"u12", name:"Tom Lawson",       isAdmin:true,  jobTitle:"Principal",       email:"t.lawson@pioneerbrok.com", phone:"(515) 555-3300", ext:"",    agencyId:"3" },

  // Lakefront Coverage (4)
  { id:"u13", name:"Karen Wells",      isAdmin:true,  jobTitle:"Principal",       email:"k.wells@lakefrontcov.com", phone:"(303) 555-1010", ext:"",    agencyId:"4" },
  { id:"u14", name:"Michael Foster",   isAdmin:true,  jobTitle:"Producer",        email:"m.foster@lakefrontcov.com",phone:"(303) 555-1011", ext:"110", agencyId:"4" },
  { id:"u15", name:"Jenna Patel",      isAdmin:false, jobTitle:"Producer",        email:"j.patel@lakefrontcov.com", phone:"(303) 555-1012", ext:"111", agencyId:"4" },
  { id:"u16", name:"David Cho",        isAdmin:false, jobTitle:"Account Manager", email:"d.cho@lakefrontcov.com",   phone:"(303) 555-1013", ext:"112", agencyId:"4" },
  { id:"u17", name:"Erin Stewart",     isAdmin:false, jobTitle:"CSR",             email:"e.stewart@lakefrontcov.com",phone:"(303) 555-1014", ext:"113", agencyId:"4" },
  { id:"u18", name:"Paul Ramirez",     isAdmin:false, jobTitle:"Producer",        email:"p.ramirez@lakefrontcov.com",phone:"(303) 555-1015", ext:"114", agencyId:"4" },
  { id:"u19", name:"Olivia Bennett",   isAdmin:false, jobTitle:"Accounting",      email:"o.bennett@lakefrontcov.com",phone:"(303) 555-1016", ext:"115", agencyId:"4" },

  // Ridgeline Insurance (5)
  { id:"u20", name:"Marcus Reed",      isAdmin:true,  jobTitle:"Principal",       email:"m.reed@ridgelineins.com",  phone:"(515) 555-2020", ext:"",    agencyId:"5" },
  { id:"u21", name:"Hannah Lee",       isAdmin:true,  jobTitle:"Producer",        email:"h.lee@ridgelineins.com",   phone:"(515) 555-2021", ext:"210", agencyId:"5" },
  { id:"u22", name:"Trevor Howard",    isAdmin:false, jobTitle:"Producer",        email:"t.howard@ridgelineins.com",phone:"(515) 555-2022", ext:"211", agencyId:"5" },
  { id:"u23", name:"Sophie Martin",    isAdmin:false, jobTitle:"Account Manager", email:"s.martin@ridgelineins.com",phone:"(515) 555-2023", ext:"212", agencyId:"5" },
  { id:"u24", name:"Caleb Hughes",     isAdmin:false, jobTitle:"CSR",             email:"c.hughes@ridgelineins.com",phone:"(515) 555-2024", ext:"213", agencyId:"5" },
  { id:"u25", name:"Nicole Avery",     isAdmin:false, jobTitle:"Accounting",      email:"n.avery@ridgelineins.com", phone:"(515) 555-2025", ext:"214", agencyId:"5" },

  // Harbor Risk Group (6)
  { id:"u26", name:"Frank DeLuca",     isAdmin:true,  jobTitle:"Principal",       email:"f.deluca@harborrisk.com",  phone:"(212) 555-6060", ext:"",    agencyId:"6" },
  { id:"u27", name:"Megan O'Brien",    isAdmin:false, jobTitle:"Producer",        email:"m.obrien@harborrisk.com",  phone:"(212) 555-6061", ext:"310", agencyId:"6" },
  { id:"u28", name:"Ethan Park",       isAdmin:false, jobTitle:"Account Manager", email:"e.park@harborrisk.com",    phone:"(212) 555-6062", ext:"311", agencyId:"6" },

  // Midland Shield Co. (7)
  { id:"u29", name:"Greg Sullivan",    isAdmin:true,  jobTitle:"Principal",       email:"g.sullivan@midlandshield.com",phone:"(515) 555-7070", ext:"",    agencyId:"7" },
  { id:"u30", name:"Aiden Cole",       isAdmin:false, jobTitle:"Producer",        email:"a.cole@midlandshield.com", phone:"(515) 555-7071", ext:"410", agencyId:"7" },

  // Coastal Guard LLC (8)
  { id:"u31", name:"Priya Shah",       isAdmin:true,  jobTitle:"Principal",       email:"p.shah@coastalguard.com",  phone:"(212) 555-8080", ext:"",    agencyId:"8" },
  { id:"u32", name:"Jordan Blake",     isAdmin:false, jobTitle:"Producer",        email:"j.blake@coastalguard.com", phone:"(212) 555-8081", ext:"510", agencyId:"8" },
  { id:"u33", name:"Megan Russo",      isAdmin:false, jobTitle:"CSR",             email:"m.russo@coastalguard.com", phone:"(212) 555-8082", ext:"511", agencyId:"8" },

  // Apex Risk Partners (9)
  { id:"u34", name:"Diana Cole",       isAdmin:true,  jobTitle:"Principal",       email:"d.cole@apexrisk.com",      phone:"(512) 555-9090", ext:"",    agencyId:"9" },
  { id:"u35", name:"Ryan Walsh",       isAdmin:true,  jobTitle:"Producer",        email:"r.walsh@apexrisk.com",     phone:"(512) 555-9091", ext:"610", agencyId:"9" },
  { id:"u36", name:"Lauren Kim",       isAdmin:false, jobTitle:"Producer",        email:"l.kim@apexrisk.com",       phone:"(512) 555-9092", ext:"611", agencyId:"9" },
  { id:"u37", name:"Henry Tan",        isAdmin:false, jobTitle:"Account Manager", email:"h.tan@apexrisk.com",       phone:"(512) 555-9093", ext:"612", agencyId:"9" },
  { id:"u38", name:"Beth Carlson",     isAdmin:false, jobTitle:"Accounting",      email:"b.carlson@apexrisk.com",   phone:"(512) 555-9094", ext:"613", agencyId:"9" },

  // Keystone Group (10)
  { id:"u39", name:"Marvin Lopez",     isAdmin:true,  jobTitle:"Principal",       email:"m.lopez@keystonegrp.com",  phone:"(215) 555-1010", ext:"",    agencyId:"10" },
  { id:"u40", name:"Kayla Bryant",     isAdmin:false, jobTitle:"Producer",        email:"k.bryant@keystonegrp.com", phone:"(215) 555-1011", ext:"710", agencyId:"10" },
  { id:"u41", name:"Sean Murphy",      isAdmin:false, jobTitle:"CSR",             email:"s.murphy@keystonegrp.com", phone:"(215) 555-1012", ext:"711", agencyId:"10" },

  // BlueSky Brokers (11)
  { id:"u42", name:"Anna Rivera",      isAdmin:true,  jobTitle:"Principal",       email:"a.rivera@blueskybrok.com", phone:"(206) 555-1100", ext:"",    agencyId:"11" },
  { id:"u43", name:"Devin Yamamoto",   isAdmin:false, jobTitle:"Producer",        email:"d.yamamoto@blueskybrok.com",phone:"(206) 555-1101", ext:"810", agencyId:"11" },

  // Ironclad Insurance (12)
  { id:"u44", name:"Bruno Mancini",    isAdmin:true,  jobTitle:"Principal",       email:"b.mancini@ironcladins.com",phone:"(214) 555-1200", ext:"",    agencyId:"12" },
  { id:"u45", name:"Vera Holmes",      isAdmin:true,  jobTitle:"Producer",        email:"v.holmes@ironcladins.com", phone:"(214) 555-1201", ext:"910", agencyId:"12" },
  { id:"u46", name:"Carlos Mendez",    isAdmin:false, jobTitle:"Account Manager", email:"c.mendez@ironcladins.com", phone:"(214) 555-1202", ext:"911", agencyId:"12" },
  { id:"u47", name:"Holly Park",       isAdmin:false, jobTitle:"Producer",        email:"h.park@ironcladins.com",   phone:"(214) 555-1203", ext:"912", agencyId:"12" },
  { id:"u48", name:"Trevor Knox",      isAdmin:false, jobTitle:"CSR",             email:"t.knox@ironcladins.com",   phone:"(214) 555-1204", ext:"913", agencyId:"12" },
];

/* ─── Agency Detail View ─────────────────────────────────────────────────── */
type DetailTab = "overview" | "quotes" | "policies" | "users" | "documents" | "notes" | "accounting";

// Shared status pill for the Quotes/Policies tables inside the Agency
// detail view — same dot + label + soft frame as the main Policies page's
// STATUS column so both surfaces read as one system.
// Mirrors the main Quotes / Policies STATUS_DOT palette: teal (complete),
// razz (in-progress / brand accent), red (terminal negative), gray
// (neutral/inactive). Covers the full status vocabulary used by
// mockAgencyQuotes and mockAgencyPolicies.
const AGENCY_STATUS_DOT: Record<string, string> = {
  // Policy vocabulary
  "File Closed":           "#9CA3AF",
  "Cancelled":             "#EF4444",
  "Renewal Created":       "#73C9B7",
  "Bound":                 "#73C9B7",
  "Paid-Bind Incomplete":  "#A614C3",
  "Issued":                "#73C9B7",
  // Quote vocabulary
  "Incomplete":            "#9CA3AF",
  "Submitted":             "#A614C3",
  "Under Review":          "#A614C3",
  "Requested Info":        "#A614C3",
  "Declined":              "#EF4444",
  "Renewal Pending":       "#A614C3",
  "Approved":              "#73C9B7",
  "Submission Incomplete": "#9CA3AF",
  "Bind Incomplete":       "#A614C3",
};
const StatusPill = ({ status, isDark }: { status: string; isDark: boolean }) => (
  <span
    className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-[3px] rounded-md whitespace-nowrap"
    style={{
      fontFamily: FONT,
      background: isDark ? "rgba(255,255,255,0.04)" : "#F9FAFB",
      color: isDark ? "#F9FAFB" : "#1F2937",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6"}`,
    }}
  >
    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: AGENCY_STATUS_DOT[status] || "#9CA3AF" }} />
    {status}
  </span>
);

function AgencyDetailView({ agency, isDark, onBack, c, btnGrad, stars, onToggleStar, inactiveUserIds, setInactiveUserIds, statusInactiveUserIds, setStatusInactiveUserIds, removedUserIds, setRemovedUserIds, bookRolled, setBookRolled, allAgencies, initialTab, onNavigateToAgency, viewMode = "internal", itcRecords, setItcRecords, isSuperAdmin = true, pageTitleOverride, spotlightUsers = false, onSpotlightConsumed, spotlightActive = false, onSpotlightDismiss, teamSetupPending = false, onOpenTeamSetup, onCompleteTeamSetup, onStartImpersonation }: {
  agency: AgencyDetail;
  isDark: boolean;
  onBack: () => void;
  c: Record<string, string>;
  btnGrad: string;
  stars: Set<string>;
  onToggleStar: (id: string) => void;
  inactiveUserIds: Set<string>;
  setInactiveUserIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  statusInactiveUserIds: Set<string>;
  setStatusInactiveUserIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  removedUserIds: Set<string>;
  setRemovedUserIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  bookRolled: Map<string, { targetCode: string; date: string }>;
  setBookRolled: React.Dispatch<React.SetStateAction<Map<string, { targetCode: string; date: string }>>>;
  allAgencies: Agency[];
  initialTab?: DetailTab;
  onNavigateToAgency?: (targetCode: string, tab?: DetailTab) => void;
  // "internal" = BTIS staff viewing all agencies (default, full edit power).
  // "client"   = the agency's own external user, viewing their single agency. Their edit
  //             power depends on whether they're the agency admin — see `clientIsAdmin`.
  viewMode?: "internal" | "client";
  // ITC records live at the Agencies-component level so edits persist across
  // detail-view remounts. Both are optional so the client-mode invocation
  // (which never renders the Accounting tab anyway) can leave them off.
  itcRecords?: Record<string, ITCRecord | null>;
  setItcRecords?: React.Dispatch<React.SetStateAction<Record<string, ITCRecord | null>>>;
  // BTIS super-admin gate for the ITC Record surface. Only super admins can
  // Edit the record — regular internal users see the read-only card without
  // the Edit button. Defaults to true so demo/mock use is unaffected until
  // real auth wires it up.
  isSuperAdmin?: boolean;
  // Optional override for the h1 title at the top of the detail surface.
  // Defaults to "Admin" (client view) / "Agencies" (internal). Used by the
  // Accounting → Statements shortcut route so the header reads "Accounting".
  pageTitleOverride?: string;
  // Set true by the shell right after the user dismisses the first-run Team
  // Setup modal — jumps to the Users tab and pops a dismissible razz-tinted
  // coachmark above the user table so they can see where to assign admins.
  // `onSpotlightConsumed` fires once the user dismisses the coachmark or the
  // auto-dismiss timer expires, letting the shell flip the prop back off.
  spotlightUsers?: boolean;
  onSpotlightConsumed?: () => void;
  // Lifted spotlight-visible state: shared with the TopBar bell so the
  // coachmark + the bell halo stay in sync. The shell dismisses via
  // onSpotlightDismiss (any-click-outside, X, or its 8s timer).
  spotlightActive?: boolean;
  onSpotlightDismiss?: () => void;
  // Persistent-pending state: while team setup is not done, the Users-tab
  // coachmark stays visible as the standing entry back into bulk setup.
  // The spotlight effects (dim backdrop, bell halo, coachmark lift) layer
  // on top transiently when it's `spotlightActive`.
  teamSetupPending?: boolean;
  // Optional: when supplied, the spotlight coachmark surfaces an "Open bulk
  // setup" button that reopens the shell-owned Team Setup modal. Lets users
  // jump back to the one-shot "set everyone at once" flow without hunting
  // for a trigger.
  onOpenTeamSetup?: () => void;
  // Optional: when supplied, the coachmark also offers "Done setting up" so
  // a user who assigned admins right here in the Users tab can end the
  // prompt everywhere (modal, banner, bell, coachmark) for good.
  onCompleteTeamSetup?: () => void;
  // Internal-staff impersonation entry — the per-user "Start a Quote" action
  // calls this with the chosen user's identity, and the shell flips into
  // acting-as mode (banner + routes back to Marketplace).
  onStartImpersonation?: (payload: { userName: string; userEmail: string; agencyName: string; agencyCode: string }) => void;
}) {
  // Mock role toggle for the Admin (client) section. In production internal & client are
  // separate deployments and this flag would come from auth; here we let the demo user
  // flip roles from a segmented control in the section header. `true` = admin (full
  // edit power like BTIS staff), `false` = non-admin (edit buttons show a "no permission"
  // tooltip on hover instead of opening the edit modal).
  const [clientIsAdmin, setClientIsAdmin] = useState(true);
  // Accounting tab local state — editing mode and the in-flight draft. The
  // committed record lives on the parent (itcRecords / setItcRecords) so
  // changes survive when the user switches agencies.
  const [itcEditing, setItcEditing] = useState(false);
  const [itcDraft, setItcDraft] = useState<ITCRecord | null>(null);
  // Review-changes modal (Super-Admin two-step commit). Amit's rule: no
  // silent push to ITC — admin sees a diff of only the changed fields
  // before Update ITC actually writes.
  const [itcReviewing, setItcReviewing] = useState(false);
  // Side-panel expansion for the ITC edit form. Same UX as the Overview
  // edit expand — a long form is easier to eyeball when it fills the
  // right 70vw with the read-only card still visible on the left.
  const [itcEditExpanded, setItcEditExpanded] = useState(false);
  // Modal that lists fields the agency has edited on Overview (or an
  // external agent edited on their side) that aren't yet pushed to ITC.
  // Super admin approves each Push to ITC in the same review-first
  // pattern as the Review Changes modal.
  const [pendingItcOpen, setPendingItcOpen] = useState(false);
  // Per-field editable overrides for the pending-updates modal. Lets the
  // super admin tweak the incoming value inline instead of having to
  // bounce out to the full ITC edit form. Keyed by ITCRecord field name,
  // cleared whenever the modal closes so a fresh diff loads next time.
  const [pendingOverrides, setPendingOverrides] = useState<Record<string, string>>({});
  // Field-level validation for the Overview Edit form. Save Changes
  // runs runEditValidation() first, sets fieldErrors, and blocks the
  // save + scrolls to the first invalid input if anything fails.
  // Errors clear per-field as the user types.
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const editErr = (k: string) => fieldErrors[k];
  const editErrStyle = (k: string): React.CSSProperties => editErr(k)
    ? { borderColor: "#DC2626", boxShadow: "0 0 0 1px rgba(220,38,38,0.15)" }
    : {};
  const clearEditErr = (k: string) => {
    setFieldErrors(prev => {
      if (!(k in prev)) return prev;
      const next = { ...prev }; delete next[k]; return next;
    });
  };
  const EditErrLine = ({ k }: { k: string }) => {
    const msg = editErr(k);
    if (!msg) return null;
    return (
      <div className="flex items-center gap-1.5 mt-1 text-[11px]" style={{ ...font, color: "#DC2626" }}>
        <AlertCircle className="w-3 h-3 flex-shrink-0" strokeWidth={2.25} />
        {msg}
      </div>
    );
  };
  const editValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
  const editValidPhone = (s: string) => s.replace(/\D/g, "").length === 10;
  const editValidZip   = (s: string) => /^\d{5}(-\d{4})?$/.test(s.trim());
  const runEditValidation = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    if (!eName.trim())    errs.name    = "Agency Name is required.";
    if (!eStreet.trim())  errs.street  = "Street address is required.";
    if (!eCity.trim())    errs.city    = "City is required.";
    if (!eState.trim())   errs.state   = "State is required.";
    if (!eZip.trim())     errs.zip     = "Zip is required.";
    else if (!editValidZip(eZip)) errs.zip = "Zip must be 5 digits (12345 or 12345-6789).";
    if (!eSameAddr) {
      if (!eMStreet.trim()) errs.mStreet = "Mailing street is required.";
      if (!eMCity.trim())   errs.mCity   = "Mailing city is required.";
      if (!eMState.trim())  errs.mState  = "Mailing state is required.";
      if (!eMZip.trim())    errs.mZip    = "Mailing zip is required.";
      else if (!editValidZip(eMZip)) errs.mZip = "Mailing zip must be 5 digits (12345 or 12345-6789).";
    }
    if (!eContact.trim()) errs.contact = "Agency Contact is required.";
    if (!eEmail.trim())   errs.email   = "Email is required.";
    else if (!editValidEmail(eEmail)) errs.email = "Enter a valid email address.";
    if (!ePhone.trim())   errs.phone   = "Phone Number is required.";
    else if (!editValidPhone(ePhone)) errs.phone = "Phone must be 10 digits (US format).";
    if (eTollFree.trim() && !editValidPhone(eTollFree)) errs.tollFree = "Toll Free must be 10 digits.";
    if (!eLicNo.trim())   errs.licNo   = "License Number is required.";
    if (!eLicExp.trim())  errs.licExp  = "License Expiration is required.";
    return errs;
  };
  // Reject-with-reason flow inside the Pending Updates modal. When the
  // super admin clicks Reject on a row, that row transforms into a
  // reason-capture card. Sending the rejection reverts the field to
  // the ITC value AND surfaces a mock email confirmation naming the
  // editor + reason so Accounting has a paper trail.
  const [rejectingKey, setRejectingKey] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>("");
  // Close-confirmation for the Pending Updates modal. If the admin has
  // staged edits in the NEW column but hasn't clicked Push to ITC, closing
  // would silently discard them — so we intercept with a small confirm
  // offering Save for later (keep pendingOverrides for next open) vs
  // Discard changes (full reset, current behavior).
  const [pendingCloseConfirm, setPendingCloseConfirm] = useState(false);
  const closePendingItc = () => { setPendingItcOpen(false); setPendingOverrides({}); setRejectingKey(null); setRejectReason(""); setPendingCloseConfirm(false); };
  // Default escape from the close-confirmation — dismisses the confirm and
  // leaves the admin back in the Pending Updates modal with their inline
  // edits intact. Wired to the X in the confirm's top-right.
  const keepEditingPendingItc = () => setPendingCloseConfirm(false);
  // Soft close — closes the Pending Updates modal but preserves
  // pendingOverrides so the same edits reappear next time the admin
  // opens the modal, ready to review + push.
  const saveForLaterPendingItc = () => { setPendingItcOpen(false); setRejectingKey(null); setRejectReason(""); setPendingCloseConfirm(false); };
  // Intercepts both the X button and the backdrop click. If there's
  // nothing staged we close straight through — the confirm is only here
  // to protect accidental loss of in-progress work.
  const requestClosePendingItc = () => {
    if (Object.keys(pendingOverrides).length > 0) setPendingCloseConfirm(true);
    else closePendingItc();
  };
  // Sub-tabs within the Accounting tab — same segmented-control pattern
  // as the Documents toolbar so users don't have to scroll to switch
  // between the ITC record and the monthly statements archive.
  // Sub-tabs across the top of the Accounting tab. Splitting Statements into
  // Commission vs Account lets users jump straight to the file type they want
  // without a second-level tab switch inside the Statements card.
  const [accountingView, setAccountingView] = useState<"record" | "comm" | "soa">(viewMode === "internal" ? "record" : "comm");
  // Statements view state — mirrors the Documents toolbar language
  // (search, filter by type, sort, select mode, per-item preview).
  const [stmtSearch, setStmtSearch] = useState("");
  const [stmtSearchOpen, setStmtSearchOpen] = useState(false);
  const [stmtFilterOpen, setStmtFilterOpen] = useState(false);
  const [stmtSortOpen, setStmtSortOpen] = useState(false);
  const [stmtFilterTypes, setStmtFilterTypes] = useState<Set<"comm" | "soa">>(new Set());
  const [stmtSortDir, setStmtSortDir] = useState<"desc" | "asc">("desc");
  const [stmtSelectMode, setStmtSelectMode] = useState(false);
  const [selectedStmts, setSelectedStmts] = useState<Set<string>>(new Set());
  const [stmtBulkFormat, setStmtBulkFormat] = useState<"pdf" | "xlsx" | "both">("pdf");
  const [stmtPreview, setStmtPreview] = useState<{ id: string; type: "comm" | "soa"; label: string; issued: string; sizePdf: string; sizeXls: string } | null>(null);
  const [stmtPreviewFormat, setStmtPreviewFormat] = useState<"pdf" | "xlsx">("pdf");
  // Row-level Download popover — only one open at a time, keyed by row id.
  const [stmtDownloadFor, setStmtDownloadFor] = useState<string | null>(null);
  const [stmtPreviewExpanded, setStmtPreviewExpanded] = useState(false);
  const [detailTab, setDetailTab] = useState<DetailTab>(initialTab ?? "overview");
  // Jump to the Users tab the moment the shell asks us to spotlight; signal
  // consumption so the shell can clear its one-shot prop. The coachmark's
  // own render + 8s auto-dismiss are now driven by `spotlightActive` (lifted
  // to shell so the TopBar bell halo stays in sync).
  useEffect(() => {
    if (!spotlightUsers) return;
    setDetailTab("users");
    onSpotlightConsumed?.();
  }, [spotlightUsers, onSpotlightConsumed]);
  // The coachmark banner itself persists for the whole pending window
  // (standing entry back into bulk setup). The spotlight layer — dim
  // backdrop, bell halo (shell-owned), raised shadow — is transient and
  // tied to `spotlightActive` only.
  const coachmarkVisible = teamSetupPending;
  const dismissSpotlight = () => onSpotlightDismiss?.();
  const [isEditing, setIsEditing]           = useState(false);
  const [editExpanded, setEditExpanded]     = useState(false);
  // Read-only "view expanded" side panel for the Agency Information card
  // on the Overview tab. Header's maximize icon toggles this — matches the
  // edit-mode expand pattern but without any edit affordance.
  const [overviewExpanded, setOverviewExpanded] = useState(false);
  const [contactCardEditing, setContactCardEditing] = useState(false);
  const [contactMode, setContactMode] = useState<"edit"|"reassign"|"new">("edit");
  const [reassignSelection, setReassignSelection] = useState<string>("");
  const [reassignSearch,    setReassignSearch]    = useState<string>("");
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  // Permission derivation. Internal staff always full power. External-client users split
  // by the mock role toggle: admin gets the same edit affordances as internal; non-admin
  // sees Edit buttons but they surface a "no permission" tooltip on hover instead of
  // opening modals, and per-row action menus stay hidden.
  const currentUserIsAdmin = viewMode === "internal" || (viewMode === "client" && clientIsAdmin);
  const currentUserIsReadOnlyAdmin = viewMode === "client" && !clientIsAdmin;
  const [lockedUserIds, setLockedUserIds] = useState<Set<string>>(() => new Set(["u5"])); // mock: Brian Nguyen locked by default
  const [eContactPhone, setEContactPhone]   = useState(agency.contactPhone);
  const font = { fontFamily: FONT };
  const isStarred = stars.has(agency.id);

  /* ── edit form states (pre-filled from agency) ── */
  const [eName,       setEName]       = useState(agency.name);
  const [eCode,       setECode]       = useState(agency.code);
  const [eType,       setEType]       = useState<"Retail"|"Wholesale">(agency.agencyType);
  const [eCountry,    setECountry]    = useState("United States of America");
  const [eStreet,     setEStreet]     = useState(agency.street);
  const [eCity,       setECity]       = useState(agency.city);
  const [eState,      setEState]      = useState(agency.state);
  const [eZip,        setEZip]        = useState(agency.zip);
  const [eSameAddr,   setESameAddr]   = useState(true);
  const [eMCountry,   setEMCountry]   = useState("United States of America");
  const [eMStreet,    setEMStreet]    = useState("");
  const [eMCity,      setEMCity]      = useState("");
  const [eMState,     setEMState]     = useState("");
  const [eMZip,       setEMZip]       = useState("");
  const [eStatus,     setEStatus]     = useState<string>(agency.status);
  const [eApptDate,   setEApptDate]   = useState(agency.apptDate);
  const [eContact,    setEContact]    = useState(agency.contact);
  const [eEmail,      setEEmail]      = useState(agency.contactEmail);
  const [eBizType,    setEBizType]    = useState(agency.bizType);
  const [eTaxId,      setETaxId]      = useState(agency.taxId);
  const [eWebsite,    setEWebsite]    = useState(agency.website);
  const [ePhone,      setEPhone]      = useState(agency.phone);
  const [eTollFree,   setETollFree]   = useState(agency.tollFree);
  const [eNpn,        setENpn]        = useState(agency.npn);
  const [eLicNo,      setELicNo]      = useState(agency.licenseNo);
  const [eLicExp,     setELicExp]     = useState(agency.licenseExp);
  const [eEoNo,       setEEoNo]       = useState(agency.eoPolicyNo);
  const [eEoExp,      setEEoExp]      = useState(agency.eoExp);
  const [eAffil,      setEAffil]      = useState<Set<string>>(new Set(agency.affiliations));
  const [eWC,         setEWC]         = useState<Set<string>>(new Set(agency.workersComp));
  // "Show all / Show less" toggle for the long read-only Affiliations and Workers Comp lists.
  const [affilExpanded, setAffilExpanded] = useState(false);
  const [wcExpanded, setWcExpanded] = useState(false);
  // Ref to scroll to the read-only Affiliations section when the user clicks "+N more" in the InfoCard.
  const affilSectionRef = useRef<HTMLDivElement | null>(null);
  const scrollToAffiliations = () => {
    setAffilExpanded(true);
    setTimeout(() => {
      affilSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  };
  const [eBadges,     setEBadges]     = useState<Set<string>>(new Set(agency.badges ?? []));
  // Persisted badges override — set after Save Changes so the read-only Overview reflects edits.
  const [badgesOverride, setBadgesOverride] = useState<string[] | null>(null);
  const effectiveBadges = badgesOverride ?? agency.badges ?? [];
  // Same override pattern for affiliations and workers comp so Save Changes actually persists those selections.
  const [affilOverride, setAffilOverride] = useState<string[] | null>(null);
  const [wcOverride,    setWcOverride]    = useState<string[] | null>(null);
  const effectiveAffils = affilOverride ?? agency.affiliations ?? [];
  const effectiveWC     = wcOverride    ?? agency.workersComp ?? [];
  // Persisted overrides for the ITC-diffed core fields. Save Changes writes
  // the current edit-form values in here so the Accounting → ITC Record view
  // sees the drift as pending updates the super admin can push. Keeps the
  // parent `agency` object unmodified — this is just the UI's local memory
  // of "what the agency should look like now."
  type AgencyFieldOverride = Partial<Pick<AgencyDetail, "name" | "street" | "city" | "state" | "zip" | "phone" | "contactEmail" | "licenseNo" | "licenseExp" | "npn" | "eoPolicyNo" | "eoExp">>;
  // Concurrency model = last-write-wins by design. Save Changes always
  // overwrites the whole override object (see the Save handler below);
  // if two people submit against the same agency, the later Save wins
  // and the earlier pending diff is lost silently. The Edit form shows
  // a razz-tint "pending edits on file" banner to warn the second user
  // before they save (see the isEditing block).
  const [agencyFieldOverride, setAgencyFieldOverride] = useState<AgencyFieldOverride>({});
  const effectiveAgency: AgencyDetail = { ...agency, ...agencyFieldOverride };
  const hasPendingOverride = Object.keys(agencyFieldOverride).length > 0;

  // (License-expired banner + Renew modal removed on 2026-10-27 after
  // the Shannon + Kiran meeting. Phase 1 scope narrows this feature
  // to a single thing: the Add Agency form checks the license through
  // NIPR before letting Shannon save, and blocks expired licenses from
  // being added in the first place. Everything else — the dashboard
  // banner for existing expired agencies, 30/15-day notification
  // emails, and the "needs action" flag on the agency list — belongs
  // to phase 2 once the NIPR batch job is enabled and the data cleanup
  // (~75k agencies) is complete.)
  // Map from ITC-record field key → agencyFieldOverride key. Used by
  // the Reject action in the Pending Updates modal to revert a single
  // field back to its ITC value without touching the other pending
  // changes in the batch.
  const OVERRIDE_KEY_FOR_ITC: Record<string, keyof AgencyFieldOverride> = {
    name: "name",
    address: "street",
    city: "city",
    state: "state",
    zip: "zip",
    telephone: "phone",
    email: "contactEmail",
    licenseNo: "licenseNo",
    licenseExpires: "licenseExp",
    // NPN deliberately NOT here. Per Shannon + Kiran meeting on
    // 2026-10-27: NPN is auto-populated from NIPR (two background API
    // calls on agency registration — license#+state → NPN, then NPN →
    // full detail), so neither agent nor Shannon's team edits it. It
    // doesn't go through Pending Updates / ITC review. Treated like
    // Agency Code: display-only on the UI.
    eoPolicyNo: "eoPolicyNo",
    eoPolicyExpires: "eoExp",
  };
  // Inline editing in the Pending Updates modal is available on every
  // field, including the doc-gated ones (Name / Address / City / State /
  // Zip / License #). The whole point of inline is that the super admin
  // is reviewing against the uploaded W-9 or License copy in the side
  // panel — if the submitter typed a typo, super admin corrects it here
  // to match the source doc, then Push to ITC.
  // Small "In review" pill shown next to any field that has an
  // unpushed override, mirroring the Appointed / DreamTeam badge
  // language so a returning editor can spot at a glance which
  // fields are staged for ITC review on the next push. (Previously
  // worded "Pending" — Shannon preferred "In review" so the label
  // matches the Pending Updates modal's "review" vocabulary.)
  const pendingTag = (keys: (keyof AgencyFieldOverride)[]) => {
    const isPending = keys.some(k => agencyFieldOverride[k] !== undefined);
    if (!isPending) return null;
    return (
      <span
        className="inline-flex items-center justify-center align-middle ml-2"
        title="Edited — waiting for ITC review"
        style={{
          background: "linear-gradient(88.54deg, rgba(92,46,212,0.08) 0.1%, rgba(166,20,195,0.08) 63.88%)",
          borderRadius: 9999,
          padding: "2px 8px",
        }}
      >
        <span
          style={{
            backgroundImage: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: 10,
            fontWeight: 600,
            lineHeight: "14px",
            letterSpacing: "0.02em",
          }}
        >
          In review
        </span>
      </span>
    );
  };
  const [eStatusOpen, setEStatusOpen] = useState(false);
  const [eBizTypeOpen, setEBizTypeOpen] = useState(false);
  const [eReason, setEReason] = useState("");
  const [eReasonOpen, setEReasonOpen] = useState(false);
  const E_REASON_OPTIONS = ["Closed", "Sold", "Credit Hold", "Missing Info", "Suspended", "Terminated"];

  const formatPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 10);
    if (digits.length === 0) return "";
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  /* ── extra colours ── */
  const teal    = "#73C9B7";
  const mutedBg = isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB";
  const sub     = isDark ? "#6B7280" : "#9CA3AF";

  /* ── quotes / policies state ── */
  const [detailSearch,    setDetailSearch]    = useState("");
  const [lobFilter,       setLobFilter]       = useState<Set<string>>(new Set());
  const [statusFilter,    setStatusFilter]    = useState<Set<string>>(new Set());
  const [applicantFilter, setApplicantFilter] = useState<Set<string>>(new Set());
  const [producerFilter,  setProducerFilter]  = useState<Set<string>>(new Set());
  const [lobOpen,         setLobOpen]         = useState(false);
  const [statusOpen,      setStatusOpen]      = useState(false);
  const [applicantOpen,   setApplicantOpen]   = useState(false);
  const [producerOpen,    setProducerOpen]    = useState(false);
  const [lobSearch,       setLobSearch]       = useState("");
  const [statusSearch,    setStatusSearch]    = useState("");
  const [applicantSearch, setApplicantSearch] = useState("");
  const [producerSearch,  setProducerSearch]  = useState("");
  const [qpSortKey,       setQpSortKey]       = useState<string|null>(null);
  const [qpSortDir,       setQpSortDir]       = useState<"asc"|"desc">("asc");
  const [qpViewOpen,      setQpViewOpen]      = useState(false);
  const [qpHiddenCols,    setQpHiddenCols]    = useState<Set<string>>(new Set());
  const QP_COLUMNS: Array<{ key: string; label: string; width: string }> = [
    { key: "created",      label: "Created",       width: "1.1fr" },
    { key: "policyNumber", label: "Policy Number", width: "1.6fr" },
    { key: "applicant",    label: "Applicant",     width: "1.2fr" },
    { key: "dba",          label: "DBA",           width: "1fr"   },
    { key: "effective",    label: "Effective",     width: "1.1fr" },
    { key: "lob",          label: "LOB",           width: "1.1fr" },
    { key: "status",       label: "Status",        width: "1.2fr" },
    { key: "producer",     label: "Producer",      width: "1.2fr" },
  ];
  const qpVisibleCols = QP_COLUMNS.filter(c => !qpHiddenCols.has(c.key));
  const qpGridTemplate = qpVisibleCols.map(c => c.width).join(" ");

  const closeAllDropdowns = () => { setLobOpen(false); setStatusOpen(false); setApplicantOpen(false); setProducerOpen(false); };

  // Shared multi-select column-header filter — mirrors the Quotes / Policies
  // page pattern (Search + Select All + per-option checkbox + Reset Filter).
  // Used for LOB and Status on both the Quotes and Policies tabs so all four
  // column filters read as one system.
  const renderMultiFilter = ({
    label, options, filter, setFilter, search, setSearch, open, setOpen, searchPlaceholder,
  }: {
    label: string;
    options: readonly string[];
    filter: Set<string>;
    setFilter: React.Dispatch<React.SetStateAction<Set<string>>>;
    search: string;
    setSearch: (v: string) => void;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    searchPlaceholder: string;
  }) => (
    <div className="relative" onClick={e => e.stopPropagation()}>
      <button onClick={() => { closeAllDropdowns(); setOpen(o => !o); }}
        className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none"
        style={{ fontFamily: FONT, color: filter.size > 0 ? "#A614C3" : c.muted }}>
        {label}<span className="inline-flex ml-1"><svg width="7" height="5" viewBox="0 0 7 5" fill="none"><path d="M3.5 5L0.5 0H6.5L3.5 5Z" fill={filter.size > 0 ? "#A614C3" : sub}/></svg></span>
      </button>
      {/* Full-screen click catcher — closes the popover when anywhere
          outside is clicked. Sits below the popover z-order. */}
      {open && <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />}
      {open && (
        <div className="absolute top-full mt-1 z-30 rounded-xl shadow-lg overflow-hidden min-w-[220px]"
          style={{ background: c.cardBg, border: `1px solid ${c.border}`, left: 0 }}>
          <div className="p-2" style={{ borderBottom: `1px solid ${c.border}` }}>
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
              style={{ background: isDark ? "rgba(255,255,255,0.05)" : "#F9FAFB", border: `1px solid ${c.border}` }}>
              <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: c.muted }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder={searchPlaceholder}
                className="outline-none text-[12px] flex-1 bg-transparent" style={{ fontFamily: FONT, color: c.text }} />
            </div>
          </div>
          <div className="px-3 py-2" style={{ borderBottom: `1px solid ${c.border}` }}>
            <button className="flex items-center gap-2 text-[12px] w-full text-left" style={{ fontFamily: FONT, color: c.text }}
              onClick={() => { setFilter(filter.size === options.length ? new Set() : new Set(options)); }}>
              <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0"
                style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>
                {filter.size === options.length && options.length > 0 &&
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              Select All
            </button>
          </div>
          <div className="max-h-[180px] overflow-y-auto py-1">
            {options.filter(o => !search || o.toLowerCase().includes(search.toLowerCase())).map(opt => (
              <button key={opt} className="flex items-center gap-2 px-3 py-1.5 text-[12px] w-full text-left transition-colors"
                style={{ fontFamily: FONT, color: c.text }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                onClick={() => { const s = new Set(filter); s.has(opt) ? s.delete(opt) : s.add(opt); setFilter(s); }}>
                <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0"
                  style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>
                  {filter.has(opt) &&
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                {opt}
              </button>
            ))}
          </div>
          <button onClick={() => { setFilter(new Set()); setSearch(""); }}
            className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors"
            style={{ fontFamily: FONT, color: "#A614C3", borderTop: `1px solid ${c.border}` }}
            onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
            <RefreshCw className="w-3.5 h-3.5" />Reset Filter
          </button>
        </div>
      )}
    </div>
  );
  const LOB_OPTIONS = ALL_LOBS.filter(l => l !== "All LOBs");
  const QUOTE_STATUS_OPTIONS  = QUOTE_STATUSES.filter(s => s !== "All Statuses");
  const POLICY_STATUS_OPTIONS = POLICY_STATUSES.filter(s => s !== "All Statuses");

  const rawQuotes   = mockAgencyQuotes.filter(q => q.agencyId === agency.id);
  const rawPolicies = mockAgencyPolicies.filter(p => p.agencyId === agency.id);
  const uniqueQApplicants = [...new Set(rawQuotes.map(q => q.applicant))];
  const uniqueQProducers  = [...new Set(rawQuotes.map(q => q.producer))];
  const uniquePApplicants = [...new Set(rawPolicies.map(p => p.applicant))];
  const uniquePProducers  = [...new Set(rawPolicies.map(p => p.producer))];

  const agencyQuotes = sortItems(
    rawQuotes
      .filter(q => !detailSearch || q.applicant.toLowerCase().includes(detailSearch.toLowerCase()) || q.quoteId.toLowerCase().includes(detailSearch.toLowerCase()))
      .filter(q => lobFilter.size === 0 || lobFilter.has(q.lob))
      .filter(q => statusFilter.size === 0 || statusFilter.has(q.status))
      .filter(q => applicantFilter.size === 0 || applicantFilter.has(q.applicant))
      .filter(q => producerFilter.size === 0 || producerFilter.has(q.producer)),
    qpSortKey, qpSortDir
  );
  const agencyPolicies = sortItems(
    rawPolicies
      .filter(p => !detailSearch || p.applicant.toLowerCase().includes(detailSearch.toLowerCase()) || p.policyNumber.toLowerCase().includes(detailSearch.toLowerCase()))
      .filter(p => lobFilter.size === 0 || lobFilter.has(p.lob))
      .filter(p => statusFilter.size === 0 || statusFilter.has(p.status))
      .filter(p => applicantFilter.size === 0 || applicantFilter.has(p.applicant))
      .filter(p => producerFilter.size === 0 || producerFilter.has(p.producer)),
    qpSortKey, qpSortDir
  );

  /* ── notes states ── */
  const NOTE_TYPES: AgencyNote["type"][] = ["General","Policy","Follow-up","Meeting","Task"];
  const typeColor: Record<string, { bg: string; text: string }> = {
    "General":   { bg: isDark ? "rgba(156,163,175,0.15)" : "#F3F4F6",                text: isDark ? "#9CA3AF" : "#6B7280" },
    "Policy":    { bg: isDark ? "rgba(166,20,195,0.18)"  : "rgba(166,20,195,0.10)",  text: isDark ? "#C87BE0" : "#A614C3" },
    "Follow-up": { bg: isDark ? "rgba(255,164,124,0.18)" : "rgba(255,164,124,0.20)", text: isDark ? "#FFA47C" : "#D96B3E" },
    "Meeting":   { bg: isDark ? "rgba(115,201,183,0.18)" : "rgba(115,201,183,0.20)", text: "#73C9B7" },
    "Task":      { bg: isDark ? "rgba(239,68,68,0.15)"   : "rgba(239,68,68,0.10)",   text: "#EF4444" },
  };
  const [agNotes,        setAgNotes]        = useState<AgencyNote[]>(mockAgencyNotes.filter(n => n.agencyId === agency.id));
  const [newNote,        setNewNote]        = useState("");
  const [newNoteTitle,   setNewNoteTitle]   = useState("");
  const [newNoteType,    setNewNoteType]    = useState<AgencyNote["type"]>("General");
  const [noteView,       setNoteView]       = useState<"list"|"board"|"table">("list");
  const [noteSearch,     setNoteSearch]     = useState("");
  const [noteSearchOpen, setNoteSearchOpen] = useState(false);
  const [noteSortDir,    setNoteSortDir]    = useState<"asc"|"desc">("desc");
  const [noteFilterType, setNoteFilterType] = useState<"All"|AgencyNote["type"]>("All");
  const [noteFilterOpen, setNoteFilterOpen] = useState(false);
  const [noteSortOpen,   setNoteSortOpen]   = useState(false);
  const [noteNewOpen,    setNoteNewOpen]    = useState(false);
  const [noteAddOpen,    setNoteAddOpen]    = useState(false);
  const [selectedNote,   setSelectedNote]   = useState<AgencyNote|null>(null);
  const [editNoteTitle,  setEditNoteTitle]  = useState("");
  const [editNoteContent,setEditNoteContent]= useState("");
  const [editNoteType,   setEditNoteType]   = useState<AgencyNote["type"]>("General");
  const [editNoteVisibility, setEditNoteVisibility] = useState<NonNullable<AgencyNote["visibility"]>>("Shared");
  const [visibilityFilter, setVisibilityFilter] = useState<"All"|"Private"|"Shared">("All");
  const [noteExpanded,   setNoteExpanded]   = useState(false);
  const [noteLocked,     setNoteLocked]     = useState(false);
  const [lockedBy,       setLockedBy]       = useState("Sarah Johnson");
  const [archivedIds,    setArchivedIds]    = useState<Set<string>>(new Set());
  const [trashedIds,     setTrashedIds]     = useState<Set<string>>(new Set());
  const [pinnedIds,      setPinnedIds]      = useState<Set<string>>(new Set());
  const [showArchived,   setShowArchived]   = useState(false);
  const [showTrashed,    setShowTrashed]    = useState(false);
  const [noteMoreOpen,   setNoteMoreOpen]   = useState(false);
  const [copyToast,      setCopyToast]      = useState("");
  const [isSelectMode,   setIsSelectMode]   = useState(false);
  const [selectedNoteIds,setSelectedNoteIds]= useState<Set<string>>(new Set());
  const [deleteNoteId,   setDeleteNoteId]   = useState<string|null>(null);
  const CURRENT_USER = "Sarah Johnson";

  /* ── users tab state ── */
  const [importUsersOpen, setImportUsersOpen] = useState(false);
  // Legacy BTIS import flow — separate from the CSV/XLSX bulk upload.
  // When this agency has a legacy BTIS admin page with existing users,
  // we offer to copy them straight over instead of making the admin
  // re-enter 100+ users by hand. Two entry points: an auto-detect
  // banner on first visit to the Users tab, and an "Import from
  // Legacy" button in the toolbar for later re-opens.
  const [legacyImportOpen, setLegacyImportOpen] = useState(false);
  const [legacyBannerDismissed, setLegacyBannerDismissed] = useState(false);
  const [legacyImportSearch, setLegacyImportSearch] = useState("");
  const [legacyImportSelected, setLegacyImportSelected] = useState<Set<string>>(new Set());
  // The Bulk Upload modal phases:
  //   "empty"    — paperclip prompt, click/drag to upload
  //   "mapping"  — file uploaded but at least one column didn't auto-match; user maps unmatched columns manually
  //   "ready"    — file mapped + validated; editable table for fixing issues inline before send
  //   "sent"     — green-check success message with skipped-row download link if any
  // Send-confirmation is an OVERLAY within "ready" (sendConfirmOpen state below) rather than its own
  // phase, so the modal width doesn't jitter and the editable table stays visible underneath.
  type ImportPhase = "empty" | "mapping" | "ready" | "sent";
  const [importPhase, setImportPhase] = useState<ImportPhase>("empty");
  const [sendConfirmOpen, setSendConfirmOpen] = useState(false);
  // Custom-dropdown state for the Admin / Job Title cells in the editable bulk-upload table.
  // We replace the native <select> for two reasons: (1) the native caret sits flush against
  // the right border with no breathing room, and (2) the browser's dropdown menu doesn't match
  // app styling. One overlay is open at a time; rect is captured at open so the panel can use
  // `position: fixed` and float above the table's scroll container without being clipped.
  type CellSelectState = {
    rowIdx: number;
    field: "admin" | "jobTitle";
    options: string[];
    triggerRect: { top: number; left: number; width: number; height: number };
  };
  const [cellSelect, setCellSelect] = useState<CellSelectState | null>(null);
  // Table filter — lets the user focus the editable table on just the problem rows. Clicking
  // the "X errors" chip filters to error rows, etc. Indispensable at 500-row scale: scrolling
  // through every row to find the 30 with issues isn't workable, and a wall-of-text tooltip on
  // the chip doesn't help fix them. Filter auto-resets when the chosen category becomes empty.
  const [tableFilter, setTableFilter] = useState<"all" | "errors" | "warnings">("all");
  const [importFileName, setImportFileName] = useState<string | null>(null);
  const [importUserCount, setImportUserCount] = useState<number>(0);
  // Parsed users from the uploaded file. Address is optional (the Add New User modal asks for it,
  // but bulk-invite admins typically only have name/email/role, so we don't force it). Everything
  // else is required and gets validated.
  type ParsedUser = {
    firstName: string; lastName: string;
    admin: string; jobTitle: string;
    email: string; phone: string; ext: string;
    address: string;
  };
  // Issue field names map to the ParsedUser keys so the editable table can paint the right cell red.
  type ImportIssue = { rowIndex: number; severity: "error" | "warning"; field: "firstName" | "lastName" | "email" | "admin" | "jobTitle" | "phone" | "principal"; message: string };
  // Canonical fields we accept in the bulk-upload schema. "ignore" is a sentinel for the mapping
  // step that lets the user explicitly drop unrecognized columns.
  type CanonicalField = "firstName" | "lastName" | "admin" | "jobTitle" | "email" | "phone" | "ext" | "address" | "ignore";
  // Result of parsing the file before we apply column mapping. We hold on to the raw header strings
  // and the raw row values so the mapping step can show the user what was found.
  type RawParsedFile = { headers: string[]; rows: string[][]; fileName: string };
  const [parsedUsers, setParsedUsers] = useState<ParsedUser[]>([]);
  const [importIssues, setImportIssues] = useState<ImportIssue[]>([]);
  const [importError, setImportError] = useState<string | null>(null);
  const [importBusy, setImportBusy] = useState(false);
  // Column-mapping flow state. `rawParsed` is the file as read (headers + raw rows) before mapping is applied.
  // `headerMapping` is the user's chosen mapping (header index → canonical field). When every header auto-matches,
  // we skip the mapping phase and go straight to "ready".
  const [rawParsed,     setRawParsed]     = useState<RawParsedFile | null>(null);
  const [headerMapping, setHeaderMapping] = useState<CanonicalField[]>([]);
  // Sent-phase summary so we can show "X sent · Y skipped" and offer a skipped-rows download.
  const [sentSummary, setSentSummary] = useState<{ sent: number; skipped: ParsedUser[] } | null>(null);
  // Pending draft prompt — set on modal open if localStorage has saved progress for this agency.
  const [draftPrompt, setDraftPrompt] = useState<{ fileName: string; count: number } | null>(null);
  const importFileInputRef = useRef<HTMLInputElement | null>(null);
  const closeImportModal = () => {
    setImportUsersOpen(false);
    setImportPhase("empty");
    setImportFileName(null);
    setImportUserCount(0);
    setParsedUsers([]);
    setImportIssues([]);
    setImportError(null);
    setImportBusy(false);
    setRawParsed(null);
    setHeaderMapping([]);
    setSentSummary(null);
    setDraftPrompt(null);
    setSendConfirmOpen(false);
    setCellSelect(null);
    setTableFilter("all");
  };

  // Cell-select scroll-to-close. The panel uses fixed coords captured at open time, so a
  // scroll would float it detached from its trigger. Click-outside is handled by a visible
  // backdrop element in the overlay JSX (more reliable than a document mousedown listener,
  // which can race with React batching and lose the option click). Capture phase = true so
  // scrolls inside nested containers (the table scroller) trigger as well.
  useEffect(() => {
    if (!cellSelect) return;
    const close = () => setCellSelect(null);
    document.addEventListener("scroll", close, true);
    return () => document.removeEventListener("scroll", close, true);
  }, [cellSelect]);

  // Auto-reset the table filter when the filtered category becomes empty — otherwise the
  // user fixes the last error and is left looking at a blank table with no obvious recovery.
  useEffect(() => {
    if (tableFilter === "all") return;
    const stillHasErrors   = importIssues.some(i => i.severity === "error");
    const stillHasWarnings = importIssues.some(i => i.severity === "warning");
    if (tableFilter === "errors" && !stillHasErrors)     setTableFilter("all");
    if (tableFilter === "warnings" && !stillHasWarnings) setTableFilter("all");
  }, [importIssues, tableFilter]);

  /**
   * Normalize a header string for fuzzy matching: lowercase, strip non-alphanumeric.
   * Used both for matching the user's file headers against our canonical fields and for
   * matching Job Title values against the allowed set.
   *   "First Name" → "firstname"
   *   "FNAME"      → "fname"
   *   "first_name" → "firstname"
   */
  const slugify = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]/g, "");

  /**
   * Map of canonical field → list of normalized alias strings we'll accept as that field
   * in an uploaded file. Keep generous to be forgiving of how admins name their columns.
   */
  const HEADER_ALIASES: Record<Exclude<CanonicalField, "ignore">, string[]> = {
    firstName: ["firstname", "first", "fname", "givenname", "given"],
    lastName:  ["lastname", "last", "lname", "surname", "familyname", "family"],
    email:     ["email", "emailaddress", "mail", "emailid"],
    admin:     ["admin", "isadmin", "adminuser", "administrator"],
    jobTitle:  ["jobtitle", "title", "job", "position", "designation"],
    phone:     ["phone", "phonenumber", "tel", "telephone", "mobile", "mobilephone", "cell", "cellphone", "contact"],
    ext:       ["ext", "extension", "phoneext", "phoneextension"],
    address:   ["address", "streetaddress", "mailingaddress", "location"],
  };

  /**
   * Try to auto-map a single header to a canonical field. Returns null when nothing matches —
   * the user will manually pick the mapping in the mapping phase.
   */
  const autoMapHeader = (header: string): CanonicalField | null => {
    const slug = slugify(header);
    if (!slug) return null;
    for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
      if (aliases.includes(slug)) return field as CanonicalField;
    }
    return null;
  };

  const normalizeJobTitleValue = (raw: string): string => {
    const trimmed = raw.trim();
    if (!trimmed) return "";
    const slug = slugify(trimmed);
    const hit = JOB_TITLES.find(v => slugify(v) === slug);
    return hit ?? trimmed;
  };

  /**
   * Normalize the Admin Yes/No cell. Accepts the obvious spellings of true / false
   * (yes, y, true, 1 ↔ no, n, false, 0) so a spreadsheet typed by hand still maps.
   * Anything else falls through as the original trimmed string — validate() will then
   * flag it so the user can correct it in the editable preview.
   */
  const normalizeAdminValue = (raw: string): string => {
    const trimmed = raw.trim();
    if (!trimmed) return "";
    const slug = slugify(trimmed);
    if (["yes", "y", "true", "1"].includes(slug)) return "Yes";
    if (["no", "n", "false", "0"].includes(slug)) return "No";
    return trimmed;
  };

  /**
   * Phone helpers — strip non-digits for storage, format for display.
   * Accept 10 digits (US) or 11 digits starting with 1. NOTE: a sibling `formatPhone`
   * exists higher up in this component for LIVE input formatting (progressive `(123) 456…`
   * as the user types). These are post-parse helpers for display + validation, hence the
   * `importPhone*` / `…Display` naming to avoid the name collision.
   */
  const importPhoneDigits = (raw: string): string => raw.replace(/\D/g, "");
  const isValidPhone = (raw: string): boolean => {
    const d = importPhoneDigits(raw);
    return d.length === 10 || (d.length === 11 && d.startsWith("1"));
  };
  const formatPhoneDisplay = (raw: string): string => {
    const d = importPhoneDigits(raw);
    if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
    if (d.length === 11 && d.startsWith("1")) return `+1 (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
    return raw;
  };
  const isValidEmail = (raw: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.trim());

  /**
   * Validate the parsed rows against the template rules. Address is optional (no validation
   * beyond accepting whatever the user provides). Phone is required and must be 10 (or 11 with
   * a leading 1) digits after stripping non-digits.
   *
   * Admin is required and must be "Yes" or "No"; Job Title uses slug-match. The parse layer
   * normalizes both to canonical casing, so what hits validate is either an exact allowed
   * value or unrecognizable (and we surface a clear error in that case).
   *
   * Returns issues with the original spreadsheet row number (1-indexed, +1 for the header).
   */
  const validateParsedUsers = (users: ParsedUser[]): ImportIssue[] => {
    const issues: ImportIssue[] = [];
    const seenEmails = new Map<string, number>();
    let principalRowIdx = -1;
    users.forEach((u, idx) => {
      const sheetRow = idx + 2;
      if (!u.firstName.trim()) {
        issues.push({ rowIndex: idx, severity: "error", field: "firstName", message: `Row ${sheetRow}: missing first name.` });
      }
      if (!u.lastName.trim()) {
        issues.push({ rowIndex: idx, severity: "error", field: "lastName", message: `Row ${sheetRow}: missing last name.` });
      }
      const email = u.email.trim();
      if (!email) {
        issues.push({ rowIndex: idx, severity: "error", field: "email", message: `Row ${sheetRow}: missing email.` });
      } else if (!isValidEmail(email)) {
        issues.push({ rowIndex: idx, severity: "error", field: "email", message: `Row ${sheetRow}: "${email}" doesn't look like a valid email.` });
      } else {
        const key = email.toLowerCase();
        if (seenEmails.has(key)) {
          issues.push({ rowIndex: idx, severity: "error", field: "email", message: `Row ${sheetRow}: duplicate email — also on row ${seenEmails.get(key)! + 2}.` });
        } else {
          seenEmails.set(key, idx);
        }
      }
      if (!u.admin.trim()) {
        issues.push({ rowIndex: idx, severity: "error", field: "admin", message: `Row ${sheetRow}: missing Admin (Yes or No).` });
      } else if (!["Yes", "No"].includes(u.admin.trim())) {
        issues.push({ rowIndex: idx, severity: "error", field: "admin", message: `Row ${sheetRow}: "${u.admin}" isn't a valid Admin value — use Yes or No.` });
      }
      if (!u.jobTitle.trim()) {
        issues.push({ rowIndex: idx, severity: "error", field: "jobTitle", message: `Row ${sheetRow}: missing job title.` });
      } else if (!JOB_TITLES.includes(u.jobTitle.trim())) {
        issues.push({ rowIndex: idx, severity: "error", field: "jobTitle", message: `Row ${sheetRow}: "${u.jobTitle}" isn't a valid job title.` });
      }
      // Phone now required (per the schema decision). Address is optional → no validation.
      if (!u.phone.trim()) {
        issues.push({ rowIndex: idx, severity: "error", field: "phone", message: `Row ${sheetRow}: missing phone.` });
      } else if (!isValidPhone(u.phone)) {
        issues.push({ rowIndex: idx, severity: "error", field: "phone", message: `Row ${sheetRow}: "${u.phone}" doesn't look like a valid phone number.` });
      }
      if (u.jobTitle.trim() === "Principal") {
        if (principalRowIdx === -1) {
          principalRowIdx = idx;
        } else {
          issues.push({ rowIndex: idx, severity: "warning", field: "principal", message: `Row ${sheetRow}: another Principal already on row ${principalRowIdx + 2}. Only one Principal is allowed per agency.` });
        }
      }
    });
    return issues;
  };

  /**
   * Read an uploaded file into raw header strings + raw row values. No column-mapping yet —
   * this is the "what's in the file" pass. Column mapping happens in a separate step (either
   * auto-applied when every header matches, or via the mapping phase when some don't).
   * Returns null on a parse error (we surface the error via importError).
   */
  const parseImportFile = async (file: File): Promise<RawParsedFile | null> => {
    try {
      const name = file.name.toLowerCase();
      let headers: string[] = [];
      const rows: string[][] = [];
      if (name.endsWith(".csv")) {
        // Minimal CSV parser — handles commas + quoted fields with escaped quotes.
        const text = await file.text();
        const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
        if (lines.length < 2) return { headers: [], rows: [], fileName: file.name };
        const splitCsvLine = (line: string): string[] => {
          const out: string[] = []; let cur = ""; let inQ = false;
          for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (inQ) {
              if (ch === '"' && line[i+1] === '"') { cur += '"'; i++; }
              else if (ch === '"') { inQ = false; }
              else { cur += ch; }
            } else {
              if (ch === '"') inQ = true;
              else if (ch === ",") { out.push(cur); cur = ""; }
              else { cur += ch; }
            }
          }
          out.push(cur);
          return out.map(v => v.trim());
        };
        headers = splitCsvLine(lines[0]);
        for (let i = 1; i < lines.length; i++) rows.push(splitCsvLine(lines[i]));
      } else if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
        // Lazy-load exceljs only on file-pick — keeps the initial bundle slim.
        const ExcelJS = (await import("exceljs")).default;
        const wb = new ExcelJS.Workbook();
        const buf = await file.arrayBuffer();
        await wb.xlsx.load(buf);
        const ws = wb.worksheets[0];
        if (!ws) return { headers: [], rows: [], fileName: file.name };
        const cellText = (cell: ReturnType<typeof ws.getCell>): string => {
          const v = cell?.value;
          if (v == null) return "";
          if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") return String(v).trim();
          if (typeof v === "object") {
            const obj = v as { text?: string; result?: string | number; hyperlink?: string };
            if (obj.text != null) return String(obj.text).trim();
            if (obj.result != null) return String(obj.result).trim();
            if (obj.hyperlink != null) return String(obj.hyperlink).trim();
          }
          return "";
        };
        // Capture headers from row 1 — width follows columns in the worksheet
        const headerRow = ws.getRow(1);
        const colCount = headerRow.cellCount;
        for (let c = 1; c <= colCount; c++) headers.push(cellText(headerRow.getCell(c)));
        // Then every other row as raw strings, indexed parallel to headers.
        ws.eachRow({ includeEmpty: false }, (row, rowNum) => {
          if (rowNum === 1) return;
          const cells: string[] = [];
          for (let c = 1; c <= colCount; c++) cells.push(cellText(row.getCell(c)));
          rows.push(cells);
        });
      } else {
        setImportError("Unsupported file type. Please upload a .xlsx or .csv file.");
        return null;
      }
      return { headers, rows, fileName: file.name };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not read the file.";
      setImportError(`Couldn't parse the file: ${msg}`);
      return null;
    }
  };

  /**
   * Apply a header → canonical-field mapping to the raw parsed file, building ParsedUser rows.
   * Admin is normalized to "Yes" / "No" (accepting common alternates like Y / true / 1);
   * Job Title is slug-matched so "Producer" / "producer" / "Producer " all land canonical.
   * Empty rows (no name AND no email) are dropped.
   */
  const buildParsedUsers = (raw: RawParsedFile, mapping: CanonicalField[]): ParsedUser[] => {
    // colIndex[field] = index into the raw header array that maps to that field, or -1 if unmapped.
    const colIndex: Record<Exclude<CanonicalField, "ignore">, number> = {
      firstName: -1, lastName: -1, admin: -1, jobTitle: -1,
      email: -1, phone: -1, ext: -1, address: -1,
    };
    mapping.forEach((field, idx) => {
      if (field !== "ignore" && colIndex[field] === -1) colIndex[field] = idx;
    });
    const pick = (row: string[], field: Exclude<CanonicalField, "ignore">): string => {
      const i = colIndex[field];
      return i >= 0 ? (row[i] ?? "") : "";
    };
    return raw.rows.map(row => ({
      firstName: pick(row, "firstName").trim(),
      lastName:  pick(row, "lastName").trim(),
      admin:     normalizeAdminValue(pick(row, "admin")),
      jobTitle:  normalizeJobTitleValue(pick(row, "jobTitle")),
      email:     pick(row, "email").trim(),
      // Format phones at parse time so a file with raw digits ("5551234567") or assorted
      // separators ("555.123.4567") all land as canonical "(555) 123-4567" in the table.
      phone:     formatPhone(pick(row, "phone").trim()),
      ext:       pick(row, "ext").trim(),
      address:   pick(row, "address").trim(),
    })).filter(r => r.firstName || r.lastName || r.email);
  };

  /**
   * After a file is uploaded, decide whether to enter the mapping phase (some headers
   * unrecognized) or skip straight to "ready" (every header auto-matched). The mapping
   * defaults to autoMapHeader's best guess; the user confirms or adjusts in the mapping phase.
   */
  const handleImportFileChosen = async (file: File) => {
    setImportError(null);
    setImportBusy(true);
    const raw = await parseImportFile(file);
    setImportBusy(false);
    if (!raw) return; // error already set
    if (raw.rows.length === 0) {
      setImportError("That file didn't contain any data rows.");
      return;
    }
    const guesses: CanonicalField[] = raw.headers.map(h => autoMapHeader(h) ?? "ignore");
    const hasUnmapped = raw.headers.some((h, i) => h.trim() !== "" && guesses[i] === "ignore");
    setRawParsed(raw);
    setHeaderMapping(guesses);
    setImportFileName(file.name);
    if (hasUnmapped) {
      // Some columns need user confirmation before we can build ParsedUser rows.
      setImportPhase("mapping");
      setParsedUsers([]);
      setImportIssues([]);
      setImportUserCount(0);
    } else {
      // Clean auto-match — go straight to the editable preview.
      const users = buildParsedUsers(raw, guesses);
      setParsedUsers(users);
      setImportIssues(validateParsedUsers(users));
      setImportUserCount(users.length);
      setImportPhase("ready");
    }
  };

  /**
   * Confirm the user's column mapping from the mapping phase and transition to "ready".
   * Builds ParsedUser rows + runs validation with the now-finalized mapping.
   */
  const confirmMapping = () => {
    if (!rawParsed) return;
    const users = buildParsedUsers(rawParsed, headerMapping);
    setParsedUsers(users);
    setImportIssues(validateParsedUsers(users));
    setImportUserCount(users.length);
    setImportPhase("ready");
  };

  /**
   * localStorage draft persistence — protects the user from accidentally closing the
   * modal mid-upload. We save under a per-agency key so drafts for Agency A don't pollute
   * Agency B. Draft shape is { fileName, users } only; mapping/raw state isn't needed
   * because saved drafts are always in canonical ParsedUser form (resume picks up at "ready").
   */
  const draftStorageKey = `norbielink:bulk-upload-draft:${agency.id}`;
  // On modal open: peek at localStorage. If there's a saved draft AND we're not already in a
  // workflow (i.e. user just opened the modal fresh), surface the "Resume previous?" prompt.
  useEffect(() => {
    if (!importUsersOpen) return;
    if (importPhase !== "empty") return; // already mid-flow, don't prompt
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(draftStorageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { fileName?: string; users?: ParsedUser[] };
      if (Array.isArray(parsed.users) && parsed.users.length > 0) {
        setDraftPrompt({ fileName: parsed.fileName ?? "previous upload", count: parsed.users.length });
      }
    } catch {
      // Corrupt draft — clear it and move on. Better than crashing the modal.
      try { window.localStorage.removeItem(draftStorageKey); } catch { /* noop */ }
    }
    // We only want to check ONCE per modal open, not on every state change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importUsersOpen]);

  // On every change to parsedUsers (i.e. each inline edit) we re-persist the draft so the
  // user can recover from an accidental close. Skips when the modal is closed OR phase is empty.
  useEffect(() => {
    if (!importUsersOpen) return;
    if (importPhase !== "ready") return;
    if (parsedUsers.length === 0) return;
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(draftStorageKey, JSON.stringify({
        fileName: importFileName,
        users: parsedUsers,
        savedAt: new Date().toISOString(),
      }));
    } catch {
      // Quota exceeded or storage disabled — degrade silently; the in-memory state is still authoritative.
    }
  }, [parsedUsers, importPhase, importUsersOpen, importFileName, draftStorageKey]);

  // Resume from the saved draft: skip parsing + mapping, jump straight to "ready" with the
  // persisted rows and freshly recomputed issues.
  const resumeDraft = () => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(draftStorageKey);
      if (!raw) { setDraftPrompt(null); return; }
      const parsed = JSON.parse(raw) as { fileName?: string; users?: Partial<ParsedUser>[] };
      const rawUsers = Array.isArray(parsed.users) ? parsed.users : [];
      if (rawUsers.length === 0) { setDraftPrompt(null); return; }
      // Backfill defaults so older drafts (saved before `address` was added) don't render
      // `undefined` into controlled inputs. Coerce to strings defensively.
      const users: ParsedUser[] = rawUsers.map(u => ({
        firstName: String(u.firstName ?? ""),
        lastName:  String(u.lastName  ?? ""),
        admin:     String(u.admin     ?? ""),
        jobTitle:  String(u.jobTitle  ?? ""),
        email:     String(u.email     ?? ""),
        phone:     String(u.phone     ?? ""),
        ext:       String(u.ext       ?? ""),
        address:   String(u.address   ?? ""),
      }));
      setParsedUsers(users);
      setImportIssues(validateParsedUsers(users));
      setImportUserCount(users.length);
      setImportFileName(parsed.fileName ?? "draft.xlsx");
      setImportPhase("ready");
      setDraftPrompt(null);
    } catch {
      setDraftPrompt(null);
    }
  };

  // Discard the saved draft and start fresh from the empty phase.
  const discardDraft = () => {
    if (typeof window !== "undefined") {
      try { window.localStorage.removeItem(draftStorageKey); } catch { /* noop */ }
    }
    setDraftPrompt(null);
  };

  // Clear the draft after a successful send so the next modal open isn't haunted by stale work.
  const clearDraftStorage = () => {
    if (typeof window === "undefined") return;
    try { window.localStorage.removeItem(draftStorageKey); } catch { /* noop */ }
  };

  /**
   * Update a single field on a single row in the editable table. Re-runs validation against
   * the whole file (cheap at 500 rows) so cross-row checks like duplicate-email + multiple-
   * Principal stay accurate after every edit. Admin / Job Title cells pass through the
   * normalizer so a dropdown pick lands as the canonical value even if the user later
   * pastes a slug-equivalent string.
   */
  const updateRow = (rowIdx: number, field: keyof ParsedUser, value: string) => {
    setParsedUsers(prev => {
      const next = prev.map((u, i) => {
        if (i !== rowIdx) return u;
        // Normalize on the way in for Admin / Job Title so the cell snaps to canonical casing.
        if (field === "admin")    return { ...u, admin:    normalizeAdminValue(value) };
        if (field === "jobTitle") return { ...u, jobTitle: normalizeJobTitleValue(value) };
        // Phone gets live-formatted as the user types — `formatPhone` is the same
        // progressive `(XXX) XXX-XXXX` formatter used in the single-user input forms
        // elsewhere in this component, so the bulk-upload table feels consistent.
        if (field === "phone")    return { ...u, phone:    formatPhone(value) };
        return { ...u, [field]: value };
      });
      setImportIssues(validateParsedUsers(next));
      return next;
    });
  };

  /**
   * Final send. Filters out rows with any error, transitions to the sent phase, captures
   * a summary so the success screen can show "sent vs skipped" with a download link for the
   * skipped rows, and clears the localStorage draft so a future modal open starts fresh.
   */
  const executeSend = () => {
    // Build a row-index → has-error map so we partition the parsed users in one pass.
    const errorRowIdx = new Set(importIssues.filter(iss => iss.severity === "error").map(iss => iss.rowIndex));
    const sent: ParsedUser[]    = [];
    const skipped: ParsedUser[] = [];
    parsedUsers.forEach((u, i) => (errorRowIdx.has(i) ? skipped : sent).push(u));
    setSentSummary({ sent: sent.length, skipped });
    setImportPhase("sent");
    clearDraftStorage();
    // Top-right toast matching the rest of the app's notification pattern — confirms the send
    // happened independently of the modal's own success screen, so users get a familiar signal
    // even if they close the modal right after clicking Send.
    const sentCount = sent.length;
    showToast({
      title: sentCount === 1 ? "1 invitation sent" : `${sentCount} invitations sent`,
      description: skipped.length > 0
        ? `${skipped.length} ${skipped.length === 1 ? "row was" : "rows were"} skipped due to errors.`
        : "Each user will receive an email with a secure registration link.",
    }, 5000);
  };

  /**
   * Download just the rows that didn't make it through (called from the sent-phase summary).
   * Lets the admin grab the failures, fix them in Excel, and re-upload as a follow-up batch.
   */
  const downloadSkippedRows = async () => {
    if (!sentSummary || sentSummary.skipped.length === 0) return;
    const base = (importFileName ?? "users")
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]+/g, "_");
    await downloadExcelTemplate(sentSummary.skipped, `${base}_skipped.xlsx`);
  };
  const [addUserOpen,     setAddUserOpen]     = useState(false);
  const [editUserId,      setEditUserId]      = useState<string|null>(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [userSearch,      setUserSearch]      = useState("");
  const [userSort,        setUserSort]        = useState<{ key: "name"|"admin"|"status"|null; dir: "asc"|"desc" }>({ key: null, dir: "asc" });
  const [jobTitleFilter,  setJobTitleFilter]  = useState<Set<string>>(new Set());
  const [jobTitleOpen,    setJobTitleOpen]    = useState(false);
  const [jobTitleSearch,  setJobTitleSearch]  = useState("");
  const [userMenuId,      setUserMenuId]      = useState<string|null>(null);
  const [userMenuPos,     setUserMenuPos]     = useState<{top?: number; bottom?: number; right: number} | null>(null);
  // inactiveUserIds and removedUserIds are now lifted to the parent Agencies component
  // so the All Users tab in the main view can also respect deactivation/removal state.
  const [usersView,       setUsersView]       = useState<"active"|"inactive">("active");
  type ToastData = { title: string; description?: string; action?: { label: string; onClick: () => void } };
  const [userToast,       setUserToast]       = useState<ToastData | null>(null);
  const showToast = (t: ToastData, ms = 4000) => { setUserToast(t); setTimeout(() => setUserToast(null), ms); };
  const [removeUserConfirm, setRemoveUserConfirm] = useState<{id: string; name: string} | null>(null);
  // Internal-staff "Start a Quote" impersonation confirm. Shows a modal before
  // routing to Quotes so the staff member sees exactly whose account they're
  // about to act as — this is a surrogate action, so making the identity
  // switch obvious up-front prevents mis-posted quotes under the wrong user.
  const [startQuoteAs, setStartQuoteAs] = useState<{id: string; name: string; email: string} | null>(null);
  const [deactivateUserConfirm, setDeactivateUserConfirm] = useState<{id: string; name: string} | null>(null);
  // When deactivating/removing a Principal or Agency Contact, force the user to pick a replacement first.
  const [roleReassign, setRoleReassign] = useState<{
    userId: string;
    userName: string;
    action: "deactivate" | "remove";
    needsPrincipal: boolean;
    needsContact: boolean;
  } | null>(null);
  const [reassignPrincipalId, setReassignPrincipalId] = useState("");
  const [reassignContactId, setReassignContactId] = useState("");
  const [reassignAccountsFrom, setReassignAccountsFrom] = useState<{userId: string; userName: string; andArchive?: boolean} | null>(null);
  const [reassignAccountsToId, setReassignAccountsToId] = useState("");
  // Open state for the custom Reassign Accounts dropdown (replaces the native <select> so the
  // popup menu matches the app's styling). Rect is captured on open so the panel can use
  // `position: fixed` and float above the modal's overflow-hidden clip. Click-outside closes.
  const [reassignAccountsDropOpen, setReassignAccountsDropOpen] = useState(false);
  const [reassignAccountsDropRect, setReassignAccountsDropRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const reassignAccountsDropRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!reassignAccountsDropOpen) return;
    const close = (e: MouseEvent) => {
      if (reassignAccountsDropRef.current && !reassignAccountsDropRef.current.contains(e.target as Node)) {
        setReassignAccountsDropOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [reassignAccountsDropOpen]);
  const [reassignAccountsConfirm, setReassignAccountsConfirm] = useState<{ toName: string } | null>(null);
  // Optional overrides applied after a reassign — used to reflect the new Principal / Contact in the UI.
  const [principalOverride, setPrincipalOverride] = useState<{ oldId: string; newId: string } | null>(null);
  const [agencyContactOverride, setAgencyContactOverride] = useState<string | null>(null);
  // Track users granted admin permissions via the Principal-reassign flow (Principal implies admin).
  const [adminGrantOverrides, setAdminGrantOverrides] = useState<Set<string>>(new Set());
  // Inline Admin-column overrides: lets the user click an Admin cell in the
  // user table to toggle admin on/off per user without opening Edit User.
  // Takes precedence over the raw `u.isAdmin` + Principal-reassignment grants
  // when present; falls back to those when the user hasn't touched the cell.
  const [inlineAdminOverrides, setInlineAdminOverrides] = useState<Map<string, boolean>>(new Map());
  // ── Documents tab state (demo only — files are mock entries; uploads add rows but don't store anything). ──
  type AgencyDocCategory = "bor" | "w9" | "license" | "agreement" | "other" | "eo";
  type AgencyDoc = { id: string; category: AgencyDocCategory; name: string; date: string; size?: string; archived?: boolean; trashed?: boolean };
  const [agencyDocs, setAgencyDocs] = useState<AgencyDoc[]>([
    { id: "d1", category: "bor",       name: "BOR Request - 2025.pdf",      date: "Mar 15, 2025", size: "1.4 MB" },
    { id: "d2", category: "bor",       name: "BOR Letter Signed.pdf",       date: "Mar 20, 2025", size: "0.9 MB" },
    { id: "d3", category: "w9",        name: "W9-2025.pdf",                  date: "Feb 1, 2025", size: "0.2 MB" },
    { id: "d4", category: "w9",        name: "W9-2024.pdf",                  date: "Feb 1, 2024", size: "0.2 MB", archived: true },
    { id: "d5", category: "license",   name: `${agency.state || "NY"}-License.pdf`, date: "Jan 10, 2025", size: "0.6 MB" },
    { id: "d6", category: "agreement", name: "Appointment Letter.pdf",      date: agency.apptDate || "Mar 24, 2026", size: "0.5 MB" },
    { id: "d7", category: "agreement", name: "Producer Agreement.pdf",      date: agency.apptDate || "Mar 24, 2026", size: "1.1 MB" },
    { id: "d8", category: "eo",        name: "EO-Certificate.pdf",          date: `Expires ${agency.eoExp || "Mar 1, 2027"}`, size: "0.4 MB" },
  ]);
  // Documents toolbar state
  const [docView,        setDocView]        = useState<"all"|"byType"|"table">("byType");
  const [docSearch,      setDocSearch]      = useState("");
  const [docSearchOpen,  setDocSearchOpen]  = useState(false);
  const [docSortDir,     setDocSortDir]     = useState<"asc"|"desc">("desc");
  const [docSortKey,     setDocSortKey]     = useState<"name"|"category"|"date">("date");
  // Multi-select category filter — empty set means "All Categories".
  const [docFilterCats,  setDocFilterCats]  = useState<Set<AgencyDocCategory>>(new Set());
  const toggleDocFilterCat = (t: AgencyDocCategory) =>
    setDocFilterCats(prev => { const s = new Set(prev); s.has(t) ? s.delete(t) : s.add(t); return s; });
  const [docFilterOpen,  setDocFilterOpen]  = useState(false);
  // Separate state for the inline By-Type-view category picker so it doesn't open in tandem with the toolbar filter icon.
  const [docByTypeFilterOpen, setDocByTypeFilterOpen] = useState(false);
  const [docSortOpen,    setDocSortOpen]    = useState(false);
  const [showDocArchived,setShowDocArchived]= useState(false);
  const [showDocTrashed, setShowDocTrashed] = useState(false);
  const [docUploadOpen,  setDocUploadOpen]  = useState(false);
  // Drag-and-drop upload modal (replaces the old "Upload to" picklist dropdown).
  const [docUploadModalOpen, setDocUploadModalOpen] = useState(false);
  const [docUploadModalFile, setDocUploadModalFile] = useState<string | null>(null);
  const [docUploadModalCat,  setDocUploadModalCat]  = useState<AgencyDocCategory | "">("");
  const [docUploadModalCatOpen, setDocUploadModalCatOpen] = useState(false);
  const [docUploadModalDrag, setDocUploadModalDrag] = useState(false);
  const [docConfirm,     setDocConfirm]     = useState<{
    title: string;
    body: React.ReactNode;
    confirmLabel: string;
    danger: boolean;
    icon: "archive" | "trash";
    onConfirm: () => void;
  } | null>(null);
  type PreviewDoc = { id: string; category: AgencyDocCategory; name: string; date: string; archived?: boolean; trashed?: boolean };
  const [previewDoc,     setPreviewDoc]     = useState<PreviewDoc | null>(null);
  const [previewExpanded, setPreviewExpanded] = useState(false);
  // Multi-select for bulk download (toggleable from toolbar — matches Notes pattern)
  const [isDocSelectMode, setIsDocSelectMode] = useState(false);
  const [selectedDocIds, setSelectedDocIds] = useState<Set<string>>(new Set());
  const toggleDocSelected = (id: string) =>
    setSelectedDocIds(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const clearDocSelection = () => setSelectedDocIds(new Set());
  // Users-tab export (preview + format selector, mirrors main Agencies export)
  const [userExportFormat,    setUserExportFormat]    = useState<"csv"|"xlsx">("csv");
  const [userExportFormatOpen,setUserExportFormatOpen]= useState(false);
  // After saving Agency Info edits, prompt the user to upload fresh docs if W-9/license-relevant fields drifted.
  const [docUpdateModal, setDocUpdateModal] = useState<{ w9: boolean; license: boolean } | null>(null);
  // Files queued in the doc-update modal — Save Changes is gated on these.
  const [docModalUploads, setDocModalUploads] = useState<{ w9?: string; license?: string }>({});
  const [docModalDragOver, setDocModalDragOver] = useState<"w9" | "license" | null>(null);

  // Book Roll modal — admin sells the entire policy book to another agency.
  const [bookRollOpen, setBookRollOpen] = useState(false);
  const [bookRollTargetId, setBookRollTargetId] = useState("");
  const [bookRollTargetOpen, setBookRollTargetOpen] = useState(false);
  const [bookRollDate, setBookRollDate] = useState(() => {
    const d = new Date();
    return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
  });
  const [bookRollConfirmText, setBookRollConfirmText] = useState("");
  const [bookRollStep, setBookRollStep] = useState<"form" | "confirm">("form");
  // "Assign Principal" modal — fired when an agency has no Principal at all.
  const [assignPrincipalOpen, setAssignPrincipalOpen] = useState(false);
  const [assignPrincipalChoice, setAssignPrincipalChoice] = useState("");
  /* add-user form fields */
  const [auFirstName,  setAuFirstName]  = useState("");
  const [auLastName,   setAuLastName]   = useState("");
  const [auIsAdmin,    setAuIsAdmin]    = useState(false);
  const [auJobTitle,   setAuJobTitle]   = useState("");
  const [auJobOpen,    setAuJobOpen]    = useState(false);
  const [auStatus,     setAuStatus]     = useState("");
  const [auStatusOpen, setAuStatusOpen] = useState(false);
  const [auPhone,      setAuPhone]      = useState("");
  const [auExt,        setAuExt]        = useState("");
  const [auMobile,     setAuMobile]     = useState("");
  const [auSms,        setAuSms]        = useState(false);
  const [auEmail,      setAuEmail]      = useState("");
  const [auAddress,    setAuAddress]    = useState("");
  const [auCity,       setAuCity]       = useState("");
  const [auState,      setAuState]      = useState("");
  const [auStateOpen,  setAuStateOpen]  = useState(false);
  const [auZip,        setAuZip]        = useState("");
  const JOB_TITLES   = ["Principal","Producer","CSR","Accounting","Account Manager"];
  const USER_STATUSES = ["Active","Inactive"];

  /**
   * Build an .xlsx workbook for bulk user import.
   * Columns mirror the bulk-upload schema. Address is optional; everything else is required.
   * Admin and Job Title columns get real Excel data-validation dropdowns so the uploader
   * picks from allowed values instead of typing them.
   *
   * If `seedRows` is provided, the template is pre-filled with those rows (used by the
   * "Download progress" button to export the user's current in-progress edits as a draft file).
   */
  const downloadExcelTemplate = async (seedRows?: ParsedUser[], filename = "users_template.xlsx") => {
    const ExcelJS = (await import("exceljs")).default;
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Users");
    ws.columns = [
      { header: "First Name", key: "firstName", width: 16 },
      { header: "Last Name",  key: "lastName",  width: 16 },
      { header: "Admin",      key: "admin",     width: 10 },
      { header: "Job title",  key: "jobTitle",  width: 18 },
      { header: "Email",      key: "email",     width: 28 },
      { header: "Phone",      key: "phone",     width: 16 },
      { header: "Ext",        key: "ext",       width: 8  },
      { header: "Address",    key: "address",   width: 32 },
    ];
    ws.getRow(1).font = { bold: true };
    if (seedRows && seedRows.length > 0) {
      // Re-export current progress (Download progress button). One row per ParsedUser.
      seedRows.forEach(u => ws.addRow({
        firstName: u.firstName, lastName: u.lastName,
        admin: u.admin, jobTitle: u.jobTitle,
        email: u.email, phone: u.phone, ext: u.ext, address: u.address,
      }));
    } else {
      // Fresh template — one example row so the format is obvious at a glance.
      ws.addRow({ firstName: "John", lastName: "Doe", admin: "No", jobTitle: "Producer", email: "john@example.com", phone: "(555) 123-4567", ext: "123", address: "123 Main St, Springfield, IL 62701" });
    }

    // Apply data-validation dropdowns to Admin (col C: Yes/No) and Job Title (col D), rows 2..501.
    // Bumped the range from 200 to 500 to fit the 500-row "large file" use case.
    // exceljs's per-cell assignment is the documented + most reliably serialised path.
    // A FRESH validation object is assigned per cell — sharing the same object can let
    // exceljs drop entries when it dedupes.
    const adminFormula    = `"Yes,No"`;
    const jobTitleFormula = `"${JOB_TITLES.join(",")}"`;
    for (let r = 2; r <= 501; r++) {
      ws.getCell(`C${r}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [adminFormula],
      };
      ws.getCell(`D${r}`).dataValidation = {
        type: "list",
        allowBlank: true,
        formulae: [jobTitleFormula],
      };
    }

    ws.getCell("D1").note = "Only one Principal is allowed per agency.";
    ws.getCell("H1").note = "Address is optional. Leave blank if you don't have it.";

    ws.addConditionalFormatting({
      ref: "D2:D501",
      rules: [
        {
          type: "expression",
          formulae: [`AND(D2="Principal", COUNTIF($D$2:$D$501,"Principal")>1)`],
          priority: 1,
          style: {
            fill:   { type: "pattern", pattern: "solid", bgColor: { argb: "FFFEE2E2" } },
            font:   { color: { argb: "FFB91C1C" }, bold: true },
          },
        },
      ],
    });

    const buffer = await wb.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Download the user's current in-progress edits as an .xlsx file matching the template
   * format. Lets admins continue their bulk upload on another device or resume after losing
   * the browser tab — the file can be re-uploaded and the rows will be auto-mapped because
   * the headers match our template exactly.
   */
  const downloadProgressFile = async () => {
    const base = (importFileName ?? "users_in_progress")
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]+/g, "_");
    await downloadExcelTemplate(parsedUsers, `${base}_in_progress.xlsx`);
  };

  const US_STATES    = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
  const agencyUsers = mockAgencyUsers
    .filter(u => u.agencyId === agency.id)
    .filter(u => !removedUserIds.has(u.id))
    .filter(u => usersView === "active" ? !inactiveUserIds.has(u.id) : inactiveUserIds.has(u.id))
    .filter(u => !userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
    .filter(u => jobTitleFilter.size === 0 || jobTitleFilter.has(u.jobTitle))
    .sort((a, b) => {
      // Pin the effective Principal to the top so role-transferred users surface immediately.
      const aJob = principalOverride && a.id === principalOverride.newId ? "Principal"
        : principalOverride && a.id === principalOverride.oldId && a.jobTitle === "Principal" ? "Producer"
        : a.jobTitle;
      const bJob = principalOverride && b.id === principalOverride.newId ? "Principal"
        : principalOverride && b.id === principalOverride.oldId && b.jobTitle === "Principal" ? "Producer"
        : b.jobTitle;
      if (aJob === "Principal" && bJob !== "Principal") return -1;
      if (bJob === "Principal" && aJob !== "Principal") return 1;
      if (userSort.key) {
        const sign = userSort.dir === "asc" ? 1 : -1;
        if (userSort.key === "name") return sign * a.name.localeCompare(b.name);
        if (userSort.key === "admin") {
          const aAdmin = (a.isAdmin || adminGrantOverrides.has(a.id)) ? 1 : 0;
          const bAdmin = (b.isAdmin || adminGrantOverrides.has(b.id)) ? 1 : 0;
          return sign * (bAdmin - aAdmin);
        }
        if (userSort.key === "status") {
          const aInactive = inactiveUserIds.has(a.id) || statusInactiveUserIds.has(a.id) ? 1 : 0;
          const bInactive = inactiveUserIds.has(b.id) || statusInactiveUserIds.has(b.id) ? 1 : 0;
          return sign * (aInactive - bInactive);
        }
      }
      return 0;
    });
  const inactiveCount = mockAgencyUsers.filter(u => u.agencyId === agency.id && !removedUserIds.has(u.id) && inactiveUserIds.has(u.id)).length;
  const activeCount = mockAgencyUsers.filter(u => u.agencyId === agency.id && !removedUserIds.has(u.id) && !inactiveUserIds.has(u.id)).length;

  // Mock roster that the legacy BTIS admin page would return for this
  // agency. In production this comes from a legacy sync; here we fake
  // ~18 brokers so the demo looks like a real import. Pre-flag
  // duplicates against the current NL roster (same email → already in
  // NorbieLink; skipped by default).
  const legacyRoster: Array<{ id: string; name: string; email: string; isAdmin: boolean }> = [
    { id: "l1",  name: "Adriana Padilla",   email: "adriana.padilla@btis.com",    isAdmin: true  },
    { id: "l2",  name: "Alena Groth",       email: "alena.groth@btis.com",         isAdmin: false },
    { id: "l3",  name: "Allyson Woody",     email: "allyson.woody@btis.com",       isAdmin: true  },
    { id: "l4",  name: "Alyssa Mulder",     email: "alyssa.mulder@btis.com",       isAdmin: false },
    { id: "l5",  name: "Amit K Gupta",      email: "amit.gupta@btis.com",          isAdmin: true  },
    { id: "l6",  name: "Amy Allen",         email: "amy.allen@btis.com",           isAdmin: false },
    { id: "l7",  name: "Amy Hadrick",       email: "amy.hadrick@btis.com",         isAdmin: false },
    { id: "l8",  name: "Andrew Schultz",    email: "andrew.schultz@btis.com",      isAdmin: false },
    { id: "l9",  name: "Angelica Calvo",    email: "angelica.calvo@btis.com",      isAdmin: true  },
    { id: "l10", name: "Anil Kumar",        email: "anil.kumar@btis.com",          isAdmin: false },
    { id: "l11", name: "Ben Carter",        email: "ben.carter@btis.com",          isAdmin: false },
    { id: "l12", name: "Caroline Ng",       email: "caroline.ng@btis.com",         isAdmin: true  },
    { id: "l13", name: "David Rossi",       email: "david.rossi@btis.com",         isAdmin: false },
    { id: "l14", name: "Elena Vargas",      email: "elena.vargas@btis.com",        isAdmin: false },
    { id: "l15", name: "Frank Oduya",       email: "frank.oduya@btis.com",         isAdmin: false },
    { id: "l16", name: "Grace Liu",         email: "grace.liu@btis.com",           isAdmin: true  },
    { id: "l17", name: "Henry Okafor",      email: "henry.okafor@btis.com",        isAdmin: false },
    { id: "l18", name: "Ivy Robinson",      email: "ivy.robinson@btis.com",        isAdmin: false },
    // "Jason Smith" matches the existing agency 1 Principal — same
    // email, so the import flow flags it as a duplicate.
    { id: "l19", name: "Jason Smith",       email: "jason@acmeins.com",            isAdmin: true  },
  ];
  const existingEmails = new Set(mockAgencyUsers.filter(u => u.agencyId === agency.id && !removedUserIds.has(u.id)).map(u => u.email.toLowerCase()));
  const legacyRosterTagged = legacyRoster.map(u => ({ ...u, duplicate: existingEmails.has(u.email.toLowerCase()) }));
  const legacyNewCount = legacyRosterTagged.filter(u => !u.duplicate).length;
  const legacyDupCount = legacyRosterTagged.length - legacyNewCount;
  const legacyRosterFiltered = legacyRosterTagged.filter(u => {
    if (!legacyImportSearch) return true;
    const q = legacyImportSearch.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });
  const openLegacyImport = () => {
    // Default-select every non-duplicate user — the common path is "pull them all in".
    setLegacyImportSelected(new Set(legacyRosterTagged.filter(u => !u.duplicate).map(u => u.id)));
    setLegacyImportSearch("");
    setLegacyImportOpen(true);
  };
  const closeLegacyImport = () => { setLegacyImportOpen(false); setLegacyImportSearch(""); };
  const toggleLegacyUser = (id: string) => setLegacyImportSelected(prev => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const fmtDate = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" }) + " " +
      d.toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit" });
  };
  const openNote = (n: AgencyNote) => { setSelectedNote(n); setEditNoteTitle(n.title); setEditNoteContent(n.content); setEditNoteType(n.type); setEditNoteVisibility(n.visibility || "Shared"); };
  const saveNote = () => { if (!selectedNote) return; setAgNotes(prev => prev.map(n => n.id === selectedNote.id ? { ...n, title: editNoteTitle, content: editNoteContent, type: editNoteType, visibility: editNoteVisibility } : n)); setSelectedNote(s => s ? { ...s, title: editNoteTitle, content: editNoteContent, type: editNoteType, visibility: editNoteVisibility } : s); };

  const TypeBadge = ({ type }: { type: string }) => (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium whitespace-nowrap"
      style={{ fontFamily: FONT, background: typeColor[type]?.bg, color: typeColor[type]?.text }}>{type}</span>
  );

  const visibleNotes = agNotes
    .filter(n => showTrashed ? trashedIds.has(n.id) : showArchived ? archivedIds.has(n.id) : (!trashedIds.has(n.id) && !archivedIds.has(n.id)))
    .filter(n => (n.visibility ?? "Shared") !== "Private" || n.author === CURRENT_USER)
    .filter(n => noteFilterType === "All" || n.type === noteFilterType)
    .filter(n => visibilityFilter === "All" || (n.visibility ?? "Shared") === visibilityFilter)
    .filter(n => !noteSearch || n.title.toLowerCase().includes(noteSearch.toLowerCase()) || n.content.toLowerCase().includes(noteSearch.toLowerCase()))
    .sort((a, b) => {
      const pa = pinnedIds.has(a.id) ? 1 : 0, pb = pinnedIds.has(b.id) ? 1 : 0;
      if (pa !== pb) return pb - pa;
      return noteSortDir === "desc"
        ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        : new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });

  const inputStyle: React.CSSProperties = {
    fontFamily: FONT, color: c.text, background: c.cardBg,
    border: `1px solid ${c.borderStrong}`, borderRadius: 8,
    padding: "9px 12px", fontSize: 13, outline: "none", width: "100%",
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: FONT, fontSize: 13, fontWeight: 600, color: c.text, marginBottom: 6, display: "block",
  };
  const selectStyle: React.CSSProperties = {
    ...inputStyle, appearance: "none", cursor: "pointer",
    // Right padding gives text room; chevron sits 12px from the border so it
    // doesn't hug the stroke.
    paddingRight: 32,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
  };
  // External-client mode: only the agency principal can edit Agency Address / Phone
  // Number / Agency Contact. Every other Agency Information field mirrors the Agency
  // Code padlock affordance — readOnly input, muted color, not-allowed cursor, lock
  // icon overlay. `clientLocked` is the on/off switch; the helpers below are the
  // rendering primitives used across the edit form.
  const clientLocked = viewMode === "client";
  const lockedInputStyle: React.CSSProperties = {
    ...inputStyle,
    paddingRight: 34,
    background: isDark ? "rgba(255,255,255,0.04)" : "#F9FAFB",
    color: c.muted,
    cursor: "not-allowed",
  };
  const LOCKED_HINT = "Only the agency principal can modify this — contact them to request a change.";
  const LockedInput = ({ value }: { value: string | number }) => (
    <div className="relative">
      <input value={value} readOnly aria-readonly="true" title={LOCKED_HINT} style={lockedInputStyle} />
      <Lock className="w-3.5 h-3.5 absolute pointer-events-none"
        style={{ right: 10, top: "50%", transform: "translateY(-50%)", color: c.muted }} />
    </div>
  );
  // Multi-select grids (Affiliations / Direct Appointments / Tags): keep the visual
  // layout so the reader still sees which items are selected, but block interaction
  // and dim the group.
  const LockedGroupOverlay = ({ children }: { children: React.ReactNode }) => (
    <div title={LOCKED_HINT}
      style={{ pointerEvents: "none", opacity: 0.55, cursor: "not-allowed" }}>
      {children}
    </div>
  );

  // Note: rendered as <span> not <button> because Radio is typically nested inside a parent
  // <button> (e.g. the Agency Type toggle), and HTML disallows nested buttons.
  const Radio = ({ checked, onClick }: { checked: boolean; onClick?: () => void }) => (
    <span onClick={onClick} role="radio" aria-checked={checked}
      className="inline-flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 transition-all cursor-pointer"
      style={{ border: `2px solid ${checked ? "#A855F7" : c.borderStrong}`, background: "transparent" }}>
      {checked && <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#A855F7" }} />}
    </span>
  );

  const Checkbox = ({ checked, onClick }: { checked: boolean; onClick: () => void }) => (
    <button onClick={onClick} className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0 transition-all"
      style={{
        border: checked ? "none" : `1.5px solid ${c.borderStrong}`,
        background: checked ? "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)" : c.cardBg,
      }}>
      {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </button>
  );

  const SectionDivider = ({ title }: { title: string }) => (
    <div className="mt-6 mb-3 pb-2" style={{ borderBottom: `1px solid ${c.border}` }}>
      <h3 className="text-[15px] font-bold" style={{ ...font, color: c.text }}>{title}</h3>
    </div>
  );

  const InfoCard = ({ title, icon, children }: { title: string; icon: React.ReactElement; children: React.ReactNode }) => (
    <div className="flex-1 rounded-2xl p-5 relative min-w-0" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
      <p className="text-[12px] font-semibold mb-3" style={{ ...font, color: c.muted }}>{title}</p>
      <div className="absolute top-4 right-4 p-2 rounded-lg" style={{ background: "rgba(168,85,247,0.10)" }}>{icon}</div>
      {children}
    </div>
  );

  const LabelValue = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div>
      <p className="text-[13px] font-semibold mb-1" style={{ ...font, color: c.text }}>{label}:</p>
      <p className="text-[13px]" style={{ ...font, color: c.muted }}>{value}</p>
    </div>
  );

  // Notes are an internal staff scratchpad about an agency; hidden from the agency's
  // own client view (viewMode="client") since they have no business reading staff notes.
  const detailTabs: [DetailTab, string, React.ReactElement][] = [
    ["overview",  "Overview",  <Building2  className="w-[15px] h-[15px]" />],
    ["quotes",    "Quotes",    <QuoteIcon  className="w-[15px] h-[15px]" />],
    ["policies",  "Policies",  <Shield     className="w-[15px] h-[15px]" />],
    ["users",     "Users",     <Users      className="w-[15px] h-[15px]" />],
    ["documents", "Documents", <FolderOpen className="w-[15px] h-[15px]" />],
    ...(viewMode === "internal"
      ? [["notes", "Notes", <CopyPlus className="w-[15px] h-[15px]" />] as [DetailTab, string, React.ReactElement]]
      : []),
    // Accounting — surfaces the agency's ITC record + statements. Available
    // to both internal staff and Admin (agency-facing) users. Sits at the
    // end because it's a specialized view rather than day-to-day workflow.
    ["accounting", "Accounting", <Landmark className="w-[15px] h-[15px]" />] as [DetailTab, string, React.ReactElement],
  ];

  /* ── helpers ── */
  const toggleSet = (set: Set<string>, val: string, setter: (s: Set<string>) => void) => {
    const s = new Set(set);
    s.has(val) ? s.delete(val) : s.add(val);
    setter(s);
  };

  const AppointedBadge = () => (
    <span className="inline-flex items-center justify-center w-fit"
      style={{ fontFamily: FONT, background: isDark
        ? "rgba(168,85,247,0.22)"
        : "linear-gradient(88.54deg, rgba(92,46,212,0.05) 0.1%, rgba(166,20,195,0.05) 63.88%)", borderRadius: 9999, padding: "3px 10px" }}>
      <span style={{ backgroundImage: isDark
          ? "linear-gradient(88.54deg, #A855F7 0.1%, #D946EF 63.88%)"
          : "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)",
        backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent", fontSize: 11, fontWeight: 600, lineHeight: "16px" }}>Appointed</span>
    </span>
  );
  const UnapptBadge = () => (
    <span className="inline-flex items-center px-[10px] py-[3px] rounded-full"
      style={{ fontFamily: FONT, color: "#73C9B7", background: isDark ? "rgba(115,201,183,0.22)" : "rgba(115,201,183,0.10)", fontSize: 11, fontWeight: 600, lineHeight: "16px" }}>Unappointed</span>
  );

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto" style={{ fontFamily: FONT, overflowX: "hidden" }}>
      {userToast && (
        <div className="fixed top-[68px] right-6 z-50 flex items-center gap-3"
          style={{ background: isDark ? "#1E2240" : "#fff", border: `1px solid ${c.border}`, borderRadius: 12, padding: "12px 16px", boxShadow: "0 4px 16px rgba(0,0,0,0.10)", minWidth: 360, maxWidth: 460, fontFamily: FONT }}>
          <span className="flex items-center justify-center flex-shrink-0"
            style={{ width: 26, height: 26, borderRadius: 9999, background: isDark ? "rgba(168,85,247,0.22)" : "rgba(166,20,195,0.10)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isDark ? "#D946EF" : "#A614C3"} strokeWidth={2.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold truncate" style={{ color: c.text }}>{userToast.title}</div>
            {userToast.description && (
              <div className="text-[12px] mt-0.5" style={{ color: c.muted }}>{userToast.description}</div>
            )}
          </div>
          {userToast.action && (
            <button onClick={() => { userToast.action!.onClick(); setUserToast(null); }}
              className="flex-shrink-0 text-[12px] font-semibold transition-colors"
              style={{ padding: "6px 12px", borderRadius: 8, border: `1px solid ${c.borderStrong}`, color: c.text, background: "transparent" }}
              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              {userToast.action.label}
            </button>
          )}
        </div>
      )}
      {bookRollOpen && (() => {
        // Admin-only flow. Excludes the source agency itself from the target picker.
        const targetCandidates = allAgencies.filter(a => a.id !== agency.id);
        const target = targetCandidates.find(a => a.id === bookRollTargetId);
        const policyCount = rawPolicies.length;
        const canContinue = !!target && !!bookRollDate.trim();
        const canConfirm = !!target && bookRollConfirmText.trim().toUpperCase() === agency.code.toUpperCase();
        const closeModal = () => {
          setBookRollOpen(false);
          setBookRollStep("form");
          setBookRollConfirmText("");
          setBookRollTargetOpen(false);
        };
        const proceed = () => {
          if (!canConfirm || !target) return;
          // 1. Track the book-roll mapping (source → target).
          setBookRolled(prev => { const m = new Map(prev); m.set(agency.id, { targetCode: target.code, date: bookRollDate }); return m; });
          // 2. Auto-add a system note in the source agency's Notes tab.
          const noteContent = `Book of business rolled from ${agency.name} (${agency.code}) to ${target.name} (${target.code}) on ${bookRollDate}. ${policyCount} ${policyCount === 1 ? "policy" : "policies"} reassigned.`;
          const newNote: AgencyNote = {
            id: `br-${Date.now()}`,
            title: `Book Roll → ${target.code}`,
            content: noteContent,
            author: "System",
            timestamp: new Date().toISOString(),
            agencyId: agency.id,
            type: "General",
            visibility: "Shared",
          };
          setAgNotes(prev => [newNote, ...prev]);
          // 3. Update agency status to Unappointed with reason "Sold".
          setEStatus("Unappointed");
          setEReason("Sold");
          // 4. Toast.
          showToast({ title: "Book rolled", description: `${policyCount} ${policyCount === 1 ? "policy" : "policies"} transferred to ${target.name}. Agency unappointed.` }, 5000);
          closeModal();
        };
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onClick={closeModal}>
            <div className="rounded-2xl overflow-hidden flex flex-col"
              style={{ background: c.cardBg, border: `1px solid ${c.border}`, width: "min(540px, 92vw)", boxShadow: "0 20px 50px rgba(0,0,0,0.20)" }}
              onClick={e => e.stopPropagation()}>
              <div className="px-6 pt-5 pb-4">
                <h3 className="text-[16px] font-bold mb-1" style={{ fontFamily: FONT, color: c.text }}>{bookRollStep === "form" ? "Book Roll" : "Confirm Book Roll"}</h3>
                <p className="text-[13px] flex items-start gap-1.5" style={{ fontFamily: FONT, color: c.muted }}>
                  {bookRollStep === "form"
                    ? <span>Transfer this agency&apos;s entire book to another agency.</span>
                    : <>
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#EF4444" }} />
                        <span>This action <strong style={{ color: "#EF4444" }}>cannot be undone</strong>. Type the agency code to verify.</span>
                      </>}
                </p>
              </div>
              {bookRollStep === "form" ? (
                <div className="px-6 pb-4 flex flex-col gap-3">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ fontFamily: FONT, color: c.muted, letterSpacing: "0.06em" }}>Agency Transferring To</label>
                    <div className="relative" onClick={e => e.stopPropagation()}>
                      <button type="button" onClick={() => setBookRollTargetOpen(o => !o)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] outline-none transition-colors"
                        style={{ fontFamily: FONT, background: c.cardBg, border: `1px solid ${bookRollTargetOpen ? "#A614C3" : c.border}`, color: target ? c.text : c.muted, cursor: "pointer" }}>
                        <span className="truncate">{target ? `${target.name} · ${target.code}` : "Select an agency…"}</span>
                        <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${bookRollTargetOpen ? "rotate-180" : ""}`} style={{ color: c.muted }} />
                      </button>
                      {bookRollTargetOpen && (
                        <div className="absolute left-0 right-0 top-full mt-1 z-30 rounded-lg overflow-hidden"
                          style={{ background: c.cardBg, border: `1px solid ${c.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", maxHeight: 260, overflowY: "auto" }}>
                          {targetCandidates.map(a => {
                            const active = bookRollTargetId === a.id;
                            return (
                              <button key={a.id} type="button"
                                onClick={() => { setBookRollTargetId(a.id); setBookRollTargetOpen(false); }}
                                className="w-full flex items-center justify-between px-3 py-2 text-[13px] text-left transition-colors"
                                style={{ fontFamily: FONT, color: active ? "#A614C3" : c.text, background: active ? "rgba(168,85,247,0.08)" : "transparent" }}
                                onMouseEnter={e => { if (!active) e.currentTarget.style.background = c.hoverBg; }}
                                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                                <span className="truncate">{a.name} <span style={{ color: c.muted }}>· {a.code}</span></span>
                                {active && <svg width="10" height="8" viewBox="0 0 9 7" fill="none" className="flex-shrink-0"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ fontFamily: FONT, color: c.muted, letterSpacing: "0.06em" }}>Effective Date</label>
                    <input value={bookRollDate} onChange={e => setBookRollDate(e.target.value)}
                      placeholder="MM/DD/YYYY"
                      className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                      style={{ fontFamily: FONT, background: c.cardBg, border: `1px solid ${c.border}`, color: c.text }} />
                  </div>
                  <div className="px-3 py-2.5 rounded-lg text-[12px] flex items-start gap-2"
                    style={{ backgroundImage: "linear-gradient(88.54deg, rgba(92,46,212,0.06) 0.1%, rgba(166,20,195,0.08) 63.88%)", border: "1px solid rgba(166,20,195,0.18)", color: c.text, fontFamily: FONT }}>
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#A614C3" }} />
                    <div>
                      Transfers <strong>{policyCount}</strong> {policyCount === 1 ? "policy" : "policies"} and marks this agency Unappointed (Sold).
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-6 pb-4 flex flex-col gap-3">
                  <div className="px-3 py-2.5 rounded-lg text-[12px]"
                    style={{ background: c.hoverBg, border: `1px solid ${c.border}`, color: c.text, fontFamily: FONT }}>
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ color: c.muted }}>Transferring to</span>
                      <span style={{ fontWeight: 600 }}>{target?.name} · {target?.code}</span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ color: c.muted }}>Effective Date</span>
                      <span style={{ fontWeight: 600 }}>{bookRollDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ color: c.muted }}>Policies transferred</span>
                      <span style={{ fontWeight: 600 }}>{policyCount}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ fontFamily: FONT, color: c.muted, letterSpacing: "0.06em" }}>Type <span style={{ color: "#A614C3" }}>{agency.code}</span> to confirm</label>
                    <input autoFocus value={bookRollConfirmText} onChange={e => setBookRollConfirmText(e.target.value)}
                      placeholder={agency.code}
                      className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                      style={{ fontFamily: FONT, background: c.cardBg, border: `1px solid ${c.border}`, color: c.text }} />
                  </div>
                </div>
              )}
              <div className="px-6 py-3 flex justify-end gap-2" style={{ borderTop: `1px solid ${c.border}` }}>
                {bookRollStep === "form" ? (
                  <>
                    <button onClick={closeModal}
                      className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
                      style={{ fontFamily: FONT, border: `1px solid ${c.border}`, color: c.text, background: c.cardBg }}>
                      Cancel
                    </button>
                    <button onClick={() => canContinue && setBookRollStep("confirm")} disabled={!canContinue}
                      className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-all"
                      style={{ fontFamily: FONT, background: btnGrad, opacity: canContinue ? 1 : 0.5, cursor: canContinue ? "pointer" : "not-allowed" }}>
                      Continue
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setBookRollStep("form"); setBookRollConfirmText(""); }}
                      className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
                      style={{ fontFamily: FONT, border: `1px solid ${c.border}`, color: c.text, background: c.cardBg }}>
                      Back
                    </button>
                    <button onClick={proceed} disabled={!canConfirm}
                      className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-all"
                      style={{ fontFamily: FONT, background: btnGrad, opacity: canConfirm ? 1 : 0.5, cursor: canConfirm ? "pointer" : "not-allowed", boxShadow: canConfirm ? "0 4px 14px rgba(166,20,195,0.25)" : "none" }}>
                      Confirm Book Roll
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })()}
      {assignPrincipalOpen && (() => {
        // Standalone assign — used when agency has no Principal at all (after deactivations/removals).
        const candidates = mockAgencyUsers.filter(u =>
          u.agencyId === agency.id
          && !removedUserIds.has(u.id)
          && !inactiveUserIds.has(u.id)
        );
        const picked = candidates.find(u => u.id === assignPrincipalChoice);
        const willGrantAdmin = picked && !picked.isAdmin && !adminGrantOverrides.has(picked.id);
        const proceed = () => {
          if (!picked) return;
          setPrincipalOverride({ oldId: "", newId: picked.id });
          showToast({ title: "Principal assigned", description: `${picked.name} is now the Principal.` });
          if (willGrantAdmin) {
            setAdminGrantOverrides(prev => { const s = new Set(prev); s.add(picked.id); return s; });
            showToast({ title: "Admin permissions granted", description: `${picked.name} was granted admin access (required for Principal).` });
          }
          setAssignPrincipalOpen(false);
        };
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onClick={() => setAssignPrincipalOpen(false)}>
            <div className="rounded-2xl overflow-hidden flex flex-col"
              style={{ background: c.cardBg, border: `1px solid ${c.border}`, width: "min(480px, 92vw)", boxShadow: "0 20px 50px rgba(0,0,0,0.20)" }}
              onClick={e => e.stopPropagation()}>
              <div className="px-6 pt-5 pb-4">
                <h3 className="text-[16px] font-bold mb-1" style={{ fontFamily:FONT, color: c.text }}>Assign Principal</h3>
                <p className="text-[13px]" style={{ fontFamily:FONT, color: c.muted }}>
                  This agency has no Principal. Choose one from the active users below.
                </p>
              </div>
              <div className="px-6 pb-4">
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ fontFamily: FONT, color: c.muted, letterSpacing: "0.06em" }}>New Principal</label>
                {/* appearance-none hides the browser's default caret position so we can place
                    our own ChevronDown with proper margin from the right border. */}
                <div className="relative">
                  <select value={assignPrincipalChoice} onChange={e => setAssignPrincipalChoice(e.target.value)}
                    className="w-full pl-3 pr-9 py-2 rounded-lg text-[13px] outline-none appearance-none"
                    style={{ fontFamily: FONT, background: c.cardBg, border: `1px solid ${c.border}`, color: c.text }}>
                    <option value="">Select a user…</option>
                    {candidates.map(u => (
                      <option key={u.id} value={u.id}>{u.name} · {u.jobTitle}{!u.isAdmin && !adminGrantOverrides.has(u.id) ? " · (no admin yet)" : ""}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute w-4 h-4 pointer-events-none" style={{ right: 12, top: "50%", transform: "translateY(-50%)", color: c.muted }} />
                </div>
                {willGrantAdmin && (
                  <div className="mt-2 px-3 py-2 rounded-lg text-[12px] flex items-start gap-2"
                    style={{ backgroundImage: "linear-gradient(88.54deg, rgba(92,46,212,0.08) 0.1%, rgba(166,20,195,0.10) 63.88%)", border: "1px solid rgba(166,20,195,0.22)", color: "#5C2ED4", fontFamily: FONT }}>
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#A614C3" }} />
                    <span>{picked!.name} doesn&apos;t have admin yet. Promoting them to Principal will also grant admin permissions.</span>
                  </div>
                )}
              </div>
              <div className="px-6 py-3 flex justify-end gap-2" style={{ borderTop: `1px solid ${c.border}` }}>
                <button onClick={() => setAssignPrincipalOpen(false)}
                  className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
                  style={{ fontFamily: FONT, border: `1px solid ${c.border}`, color: c.text, background: c.cardBg }}>
                  Cancel
                </button>
                <button onClick={proceed} disabled={!picked}
                  className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-all"
                  style={{ fontFamily: FONT, background: btnGrad, opacity: picked ? 1 : 0.5, cursor: picked ? "pointer" : "not-allowed" }}>
                  Assign Principal
                </button>
              </div>
            </div>
          </div>
        );
      })()}
      {roleReassign && (() => {
        // Eligible replacements: active, non-removed, not the user being deactivated/removed.
        const candidates = mockAgencyUsers.filter(u =>
          u.agencyId === agency.id
          && u.id !== roleReassign.userId
          && !removedUserIds.has(u.id)
          && !inactiveUserIds.has(u.id)
        );
        const canConfirm =
          (!roleReassign.needsPrincipal || !!reassignPrincipalId)
          && (!roleReassign.needsContact || !!reassignContactId);
        const proceed = () => {
          if (!canConfirm) return;
          if (roleReassign.needsPrincipal) {
            const newPrin = candidates.find(u => u.id === reassignPrincipalId);
            if (newPrin) {
              setPrincipalOverride({ oldId: roleReassign.userId, newId: newPrin.id });
              showToast({ title: "Principal role transferred", description: `${newPrin.name} is now the Principal.` });
              // Principal implies admin — auto-grant admin permissions to a non-admin pick.
              if (!newPrin.isAdmin && !adminGrantOverrides.has(newPrin.id)) {
                setAdminGrantOverrides(prev => { const s = new Set(prev); s.add(newPrin.id); return s; });
                showToast({ title: "Admin permissions granted", description: `${newPrin.name} was granted admin access (required for Principal).` });
              }
            }
          }
          if (roleReassign.needsContact) {
            const newCon = candidates.find(u => u.id === reassignContactId);
            if (newCon) {
              setAgencyContactOverride(newCon.name);
              setEContact(newCon.name);
              if (newCon.email) setEEmail(newCon.email);
              if (newCon.phone) setEContactPhone(newCon.phone);
              showToast({ title: "Agency Contact updated", description: `${newCon.name} is now the Agency Contact.` });
            }
          }
          if (roleReassign.action === "deactivate") {
            const id = roleReassign.userId;
            const name = roleReassign.userName;
            setInactiveUserIds(prev => { const s = new Set(prev); s.add(id); return s; });
            showToast({
              title: "User archived",
              description: `${name} moved to the archive.`,
            });
          } else if (roleReassign.action === "remove") {
            setRemoveUserConfirm({ id: roleReassign.userId, name: roleReassign.userName });
          }
          setRoleReassign(null);
        };
        const rolesText = [roleReassign.needsPrincipal && "Principal", roleReassign.needsContact && "Agency Contact"].filter(Boolean).join(" and ");
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onClick={() => setRoleReassign(null)}>
            <div className="rounded-2xl overflow-hidden flex flex-col"
              style={{ background: c.cardBg, border: `1px solid ${c.border}`, width: "min(480px, 92vw)", boxShadow: "0 20px 50px rgba(0,0,0,0.20)" }}
              onClick={e => e.stopPropagation()}>
              <div className="px-6 pt-5 pb-4">
                <h3 className="text-[16px] font-bold mb-1" style={{ fontFamily:FONT, color: c.text }}>Reassign {rolesText} first</h3>
                <p className="text-[13px]" style={{ fontFamily:FONT, color: c.muted }}>
                  This user is the {rolesText}. Choose {roleReassign.needsPrincipal && roleReassign.needsContact ? "replacements" : "a replacement"} before {roleReassign.action === "deactivate" ? "archiving" : "removing"} them.
                </p>
              </div>
              <div className="px-6 pb-4 flex flex-col gap-3">
                {candidates.length === 0 ? (
                  <div className="px-3 py-4 rounded-lg text-[12px]" style={{ background: c.hoverBg, border: `1px dashed ${c.border}`, color: c.muted, fontFamily: FONT }}>
                    No other active users in this agency. Add or reactivate a user before continuing.
                  </div>
                ) : (
                  <>
                    {roleReassign.needsPrincipal && (() => {
                      const picked = candidates.find(u => u.id === reassignPrincipalId);
                      const willGrantAdmin = picked && !picked.isAdmin && !adminGrantOverrides.has(picked.id);
                      return (
                        <div>
                          <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ fontFamily: FONT, color: c.muted, letterSpacing: "0.06em" }}>New Principal</label>
                          <div className="relative">
                          <select value={reassignPrincipalId} onChange={e => setReassignPrincipalId(e.target.value)}
                            className="w-full pl-3 pr-9 py-2 rounded-lg text-[13px] outline-none appearance-none"
                            style={{ fontFamily: FONT, background: c.cardBg, border: `1px solid ${c.border}`, color: c.text }}>
                            <option value="">Select a user…</option>
                            {candidates.map(u => (
                              <option key={u.id} value={u.id}>{u.name} · {u.jobTitle}{!u.isAdmin && !adminGrantOverrides.has(u.id) ? " · (no admin yet)" : ""}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute w-4 h-4 pointer-events-none" style={{ right: 12, top: "50%", transform: "translateY(-50%)", color: c.muted }} />
                          </div>
                          {willGrantAdmin && (
                            <div className="mt-2 px-3 py-2 rounded-lg text-[12px] flex items-start gap-2"
                              style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.20)", color: "#92400E", fontFamily: FONT }}>
                              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                              <span>{picked!.name} doesn&apos;t have admin yet. Promoting them to Principal will also grant admin permissions.</span>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                    {roleReassign.needsContact && (
                      <div>
                        <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ fontFamily: FONT, color: c.muted, letterSpacing: "0.06em" }}>New Agency Contact</label>
                        <div className="relative">
                          <select value={reassignContactId} onChange={e => setReassignContactId(e.target.value)}
                            className="w-full pl-3 pr-9 py-2 rounded-lg text-[13px] outline-none appearance-none"
                            style={{ fontFamily: FONT, background: c.cardBg, border: `1px solid ${c.border}`, color: c.text }}>
                            <option value="">Select a user…</option>
                            {candidates.map(u => (
                              <option key={u.id} value={u.id}>{u.name} · {u.jobTitle}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute w-4 h-4 pointer-events-none" style={{ right: 12, top: "50%", transform: "translateY(-50%)", color: c.muted }} />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="px-6 py-3 flex justify-end gap-2" style={{ borderTop: `1px solid ${c.border}` }}>
                <button onClick={() => setRoleReassign(null)}
                  className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
                  style={{ fontFamily: FONT, border: `1px solid ${c.border}`, color: c.text, background: c.cardBg }}>
                  Cancel
                </button>
                <button onClick={proceed} disabled={!canConfirm || candidates.length === 0}
                  className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-all"
                  style={{ fontFamily: FONT, background: btnGrad, opacity: canConfirm && candidates.length > 0 ? 1 : 0.5, cursor: canConfirm && candidates.length > 0 ? "pointer" : "not-allowed" }}>
                  Reassign & {roleReassign.action === "deactivate" ? "Archive" : "Continue"}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
      {reassignAccountsFrom && (() => {
        const candidates = mockAgencyUsers.filter(u =>
          u.agencyId === agency.id
          && u.id !== reassignAccountsFrom.userId
          && !removedUserIds.has(u.id)
          && !inactiveUserIds.has(u.id)
        );
        const picked = candidates.find(u => u.id === reassignAccountsToId);
        const proceed = () => {
          if (!picked) return;
          // Reassign is permanent (no Undo) — require explicit confirmation before executing.
          setReassignAccountsConfirm({ toName: picked.name });
        };
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onClick={() => setReassignAccountsFrom(null)}>
            <div className="rounded-2xl overflow-hidden flex flex-col"
              style={{ background: c.cardBg, border: `1px solid ${c.border}`, width: "min(480px, 92vw)", boxShadow: "0 20px 50px rgba(0,0,0,0.20)" }}
              onClick={e => e.stopPropagation()}>
              <div className="px-6 pt-5 pb-4">
                <h3 className="text-[16px] font-bold mb-1" style={{ fontFamily:FONT, color: c.text }}>
                  {reassignAccountsFrom.andArchive ? "Deactivate User" : "Reassign Accounts"}
                </h3>
                <p className="text-[13px]" style={{ fontFamily:FONT, color: c.muted }}>
                  {reassignAccountsFrom.andArchive
                    ? "Pick another active user to take over this user's accounts before deactivating."
                    : "Transfer this user's accounts to another active user in this agency."}
                </p>
              </div>
              <div className="px-6 pb-4 flex flex-col gap-3">
                {candidates.length === 0 ? (
                  <div className="px-3 py-4 rounded-lg text-[12px]" style={{ background: c.hoverBg, border: `1px dashed ${c.border}`, color: c.muted, fontFamily: FONT }}>
                    No other active users in this agency. Add or reactivate a user before continuing.
                  </div>
                ) : (
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ fontFamily: FONT, color: c.muted, letterSpacing: "0.06em" }}>Reassign To</label>
                    {/* Custom dropdown replacing the native <select>. The panel uses
                        `position: fixed` with the trigger's rect captured at open time, so it
                        floats ABOVE the modal's `overflow-hidden` clip (the previous absolute-
                        positioned panel was getting cut off by the modal card). Drop-up detection
                        opens upward when there isn't enough room below. */}
                    <div ref={reassignAccountsDropRef} className="relative">
                      <button type="button"
                        onClick={e => {
                          if (!reassignAccountsDropOpen) {
                            const r = e.currentTarget.getBoundingClientRect();
                            setReassignAccountsDropRect({ top: r.top, left: r.left, width: r.width, height: r.height });
                          }
                          setReassignAccountsDropOpen(o => !o);
                        }}
                        className="w-full pl-3 pr-9 py-2 rounded-lg text-[13px] outline-none text-left flex items-center relative"
                        style={{ fontFamily: FONT, background: c.cardBg, border: `1px solid ${c.border}`, color: reassignAccountsToId ? c.text : c.muted, cursor: "pointer" }}>
                        <span className="flex-1 truncate">
                          {(() => {
                            const picked = candidates.find(u => u.id === reassignAccountsToId);
                            return picked ? `${picked.name} · ${picked.jobTitle}` : "Select a user…";
                          })()}
                        </span>
                        <ChevronDown className="absolute w-4 h-4 pointer-events-none" style={{ right: 12, top: "50%", transform: `translateY(-50%) rotate(${reassignAccountsDropOpen ? 180 : 0}deg)`, color: c.muted, transition: "transform 0.15s" }} />
                      </button>
                      {reassignAccountsDropOpen && reassignAccountsDropRect && (() => {
                        // Drop-up when there's not enough room below the trigger (e.g. when the
                        // modal sits near the viewport bottom).
                        const panelMaxHeight = Math.min(candidates.length * 42 + 8, 240);
                        const spaceBelow = window.innerHeight - (reassignAccountsDropRect.top + reassignAccountsDropRect.height);
                        const openUp = spaceBelow < panelMaxHeight + 16;
                        const top = openUp
                          ? reassignAccountsDropRect.top - panelMaxHeight - 4
                          : reassignAccountsDropRect.top + reassignAccountsDropRect.height + 4;
                        return (
                          <div className="fixed rounded-xl overflow-y-auto"
                            style={{
                              top, left: reassignAccountsDropRect.left, width: reassignAccountsDropRect.width,
                              maxHeight: panelMaxHeight,
                              background: c.cardBg,
                              boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                              border: `1px solid ${c.border}`,
                              zIndex: 9999,
                            }}>
                            {candidates.map(u => {
                              const selected = u.id === reassignAccountsToId;
                              const selectedBg = isDark ? "rgba(166,20,195,0.18)" : "rgba(166,20,195,0.08)";
                              const hoverBg    = isDark ? "rgba(255,255,255,0.06)" : "#F9FAFB";
                              return (
                                <button key={u.id} type="button"
                                  onClick={() => { setReassignAccountsToId(u.id); setReassignAccountsDropOpen(false); }}
                                  className="w-full text-left px-3 py-2.5 text-[13px] transition-colors flex items-center justify-between gap-2"
                                  style={{
                                    fontFamily: FONT,
                                    color: selected ? "#A614C3" : c.text,
                                    fontWeight: selected ? 600 : 400,
                                    background: selected ? selectedBg : "transparent",
                                    cursor: "pointer",
                                  }}
                                  onMouseEnter={e => (e.currentTarget.style.background = selected ? selectedBg : hoverBg)}
                                  onMouseLeave={e => (e.currentTarget.style.background = selected ? selectedBg : "transparent")}>
                                  <span className="truncate">{u.name} · <span style={{ color: selected ? "#A614C3" : c.muted }}>{u.jobTitle}</span></span>
                                  {selected && <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#A614C3" }} />}
                                </button>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
              <div className="px-6 py-3 flex justify-end gap-2" style={{ borderTop: `1px solid ${c.border}` }}>
                <button onClick={() => setReassignAccountsFrom(null)}
                  className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
                  style={{ fontFamily: FONT, border: `1px solid ${c.border}`, color: c.text, background: c.cardBg }}>
                  Cancel
                </button>
                <button onClick={proceed} disabled={!picked}
                  className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-all"
                  style={{ fontFamily: FONT, background: btnGrad, opacity: picked ? 1 : 0.5, cursor: picked ? "pointer" : "not-allowed" }}>
                  Continue
                </button>
              </div>
            </div>
          </div>
        );
      })()}
      {reassignAccountsFrom && reassignAccountsConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6"
          onClick={() => setReassignAccountsConfirm(null)}
          style={{ background: "rgba(0,0,0,0.45)" }}>
          <div className="w-[440px] rounded-2xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}
            style={{ background: c.cardBg, border: `1px solid ${c.border}`, fontFamily: FONT }}>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(245,158,11,0.12)" }}>
                <AlertCircle className="w-6 h-6" style={{ color: "#F59E0B" }} />
              </div>
              <div>
                <h3 className="text-[16px] font-bold mb-1" style={{ color: c.text }}>
                  {reassignAccountsFrom.andArchive ? "Deactivate this user?" : "Reassign all accounts?"}
                </h3>
                <p className="text-[12px] leading-relaxed" style={{ color: c.muted }}>
                  {reassignAccountsFrom.andArchive
                    ? "All accounts will be transferred to the selected user, and this user will be permanently removed from the agency."
                    : "All accounts will be transferred to the selected user."}
                </p>
                <p className="text-[12px] leading-relaxed mt-2 font-semibold" style={{ color: "#B45309" }}>
                  This action can&apos;t be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setReassignAccountsConfirm(null)}
                className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
                style={{ border: `1px solid ${c.borderStrong}`, color: c.text, background: "transparent" }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                Cancel
              </button>
              <button onClick={() => {
                  const fromName = reassignAccountsFrom.userName;
                  const toName = reassignAccountsConfirm.toName;
                  const fromUserId = reassignAccountsFrom.userId;
                  const deactivateToo = !!reassignAccountsFrom.andArchive;
                  if (deactivateToo) {
                    // Permanently remove the user from the agency (was: setInactiveUserIds for
                    // the archive flow). Their accounts already moved to `toName` above.
                    setRemovedUserIds(prev => { const s = new Set(prev); s.add(fromUserId); return s; });
                    showToast({
                      title: "User deactivated",
                      description: `${fromName} was removed. Their accounts went to ${toName}.`,
                    });
                  } else {
                    showToast({ title: "Accounts reassigned", description: `${fromName}'s accounts transferred to ${toName}.` });
                  }
                  setReassignAccountsConfirm(null);
                  setReassignAccountsFrom(null);
                  setReassignAccountsToId("");
                }}
                className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-colors"
                style={{ background: btnGrad }}>
                {reassignAccountsFrom.andArchive ? "Reassign & Deactivate" : "Yes, reassign"}
              </button>
            </div>
          </div>
        </div>
      )}
      {deactivateUserConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={() => setDeactivateUserConfirm(null)}
          style={{ background: "rgba(0,0,0,0.45)" }}>
          <div className="w-[420px] rounded-2xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}
            style={{ background: c.cardBg, border: `1px solid ${c.border}`, fontFamily: FONT }}>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(166,20,195,0.10)" }}>
                <Archive className="w-6 h-6" style={{ color: "#A614C3" }} />
              </div>
              <div>
                <h3 className="text-[16px] font-bold mb-1" style={{ color: c.text }}>Archive this user?</h3>
                <p className="text-[12px] leading-relaxed" style={{ color: c.muted }}>
                  This will immediately disable their access — they won&apos;t be able to log in or submit applications. You can <strong style={{ background: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>Reactivate</strong> them later from the archive.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeactivateUserConfirm(null)}
                className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
                style={{ border: `1px solid ${c.borderStrong}`, color: c.text, background: "transparent" }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                Cancel
              </button>
              <button onClick={() => {
                  const id = deactivateUserConfirm.id;
                  const name = deactivateUserConfirm.name;
                  setInactiveUserIds(prev => { const s = new Set(prev); s.add(id); return s; });
                  showToast({
                    title: "User archived",
                    description: `${name} moved to the archive.`,
                  });
                  setDeactivateUserConfirm(null);
                }}
                className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-colors"
                style={{ background: btnGrad }}>
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
      {docUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: "rgba(0,0,0,0.45)" }}>
          <div className="w-[460px] rounded-2xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}
            style={{ background: c.cardBg, border: `1px solid ${c.border}`, fontFamily: FONT }}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: isDark
                  ? "linear-gradient(88.54deg, rgba(168,85,247,0.25) 0.1%, rgba(217,70,239,0.25) 63.88%)"
                  : "linear-gradient(88.54deg, rgba(92,46,212,0.12) 0.1%, rgba(166,20,195,0.12) 63.88%)" }}>
                <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
                  <defs>
                    <linearGradient id="doc-modal-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={isDark ? "#A855F7" : "#5C2ED4"} />
                      <stop offset="100%" stopColor={isDark ? "#D946EF" : "#A614C3"} />
                    </linearGradient>
                  </defs>
                  <circle cx="8" cy="8" r="7" stroke="url(#doc-modal-grad)" strokeWidth="1.5" />
                  <rect x="7.25" y="3.5" width="1.5" height="5.5" rx="0.75" fill="url(#doc-modal-grad)" />
                  <circle cx="8" cy="11.5" r="0.9" fill="url(#doc-modal-grad)" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-[16px] font-bold mb-1.5" style={{ color: c.text }}>Documents required</h3>
                <p className="text-[12px] leading-relaxed" style={{ color: c.muted }}>
                  The change in agency information requires the following document{docUpdateModal.w9 && docUpdateModal.license ? "s" : ""}.
                </p>
              </div>
            </div>
            {(() => {
              const required: Array<{ key: "w9" | "license"; label: string; hint: string }> = [];
              if (docUpdateModal.w9)      required.push({ key: "w9",      label: "New W-9",          hint: "Name · Entity · Address · TIN" });
              if (docUpdateModal.license) required.push({ key: "license", label: "New License copy", hint: "License number changed" });
              const allUploaded = required.every(r => docModalUploads[r.key]);
              const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
              const onPickFile = (key: "w9" | "license", file: File | null | undefined) => {
                if (!file) return;
                // W-9 restricted to PDF (Accounting requirement); catches
                // the drag-and-drop case where the input `accept` attribute
                // is not enforced by the browser.
                if (key === "w9") {
                  const isPdf = /\.pdf$/i.test(file.name) || file.type === "application/pdf";
                  if (!isPdf) {
                    showToast({ title: "PDF required", description: `W-9 must be a PDF. "${file.name}" was not attached.` }, 5000);
                    return;
                  }
                }
                // Size cap matches the label under the drop zone (10MB).
                if (file.size > MAX_UPLOAD_BYTES) {
                  const mb = (file.size / (1024 * 1024)).toFixed(1);
                  showToast({ title: "File too large", description: `"${file.name}" is ${mb}MB. Max 10MB.` }, 5000);
                  return;
                }
                setDocModalUploads(p => ({ ...p, [key]: file.name }));
              };
              return (
                <>
                  <div className="space-y-3 mb-5">
                    {required.map(r => {
                      const fileName = docModalUploads[r.key];
                      const isOver = docModalDragOver === r.key;
                      return (
                        <div key={r.key}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)" }} />
                            <span className="text-[12px]" style={{ color: c.text, fontFamily: FONT }}><strong>{r.label}</strong> required</span>
                            <span className="ml-auto text-[11px]" style={{ color: c.muted, fontFamily: FONT }}>{r.hint}</span>
                          </div>
                          {fileName ? (
                              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
                                style={{ background: "rgba(115,201,183,0.10)", border: "1px solid rgba(115,201,183,0.35)", fontFamily: FONT }}>
                                <CheckSquare className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#73C9B7" }} />
                                <input value={fileName}
                                  onChange={e => setDocModalUploads(p => ({ ...p, [r.key]: e.target.value }))}
                                  className="text-[12px] flex-1 outline-none bg-transparent min-w-0"
                                  style={{ color: c.text, fontFamily: FONT }}
                                  spellCheck={false}
                                  title="Rename before uploading" />
                                <button onClick={() => setDocModalUploads(p => { const n = { ...p }; delete n[r.key]; return n; })}
                                  className="text-[11px] font-medium transition-opacity hover:opacity-70 flex-shrink-0"
                                  style={{ color: c.muted }}>Replace</button>
                              </div>
                            ) : (
                            <label className="flex flex-col items-center justify-center cursor-pointer transition-colors rounded-lg py-5"
                              style={{ background: isOver ? "rgba(168,85,247,0.08)" : c.hoverBg, border: `1.5px dashed ${isOver ? "#A614C3" : c.borderStrong}`, fontFamily: FONT }}
                              onDragOver={e => { e.preventDefault(); setDocModalDragOver(r.key); }}
                              onDragLeave={() => setDocModalDragOver(null)}
                              onDrop={e => { e.preventDefault(); setDocModalDragOver(null); onPickFile(r.key, e.dataTransfer.files?.[0]); }}>
                              {/* W-9 must be a PDF (Accounting requirement — searchable
                                  taxpayer data, digital signatures). License copies
                                  still allow images since scans are common. */}
                              <input type="file" className="hidden"
                                accept={r.key === "w9" ? ".pdf,application/pdf" : ".pdf,.jpg,.jpeg,.png"}
                                onChange={e => onPickFile(r.key, e.target.files?.[0])} />
                              <Paperclip className="w-5 h-5 mb-1.5" style={{ color: "#A614C3" }} />
                              <span className="text-[12px] font-medium" style={{ color: c.text }}>Drag &amp; Drop or Click to Browse</span>
                              <span className="text-[11px] mt-0.5" style={{ color: c.muted }}>{r.key === "w9" ? "PDF only · Max 10MB" : "PDF, JPG, PNG · Max 10MB"}</span>
                            </label>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-3 items-center justify-between">
                    <button onClick={() => { setDocUpdateModal(null); setDocModalUploads({}); }}
                      className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
                      style={{ border: `1px solid ${c.borderStrong}`, color: c.text, background: "transparent" }}
                      onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      Cancel Changes
                    </button>
                    <button onClick={() => {
                        if (!allUploaded) return;
                        // Persist new docs into the agency's documents list (mock).
                        const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                        setAgencyDocs(prev => {
                          const next = [...prev];
                          if (docUpdateModal.w9 && docModalUploads.w9) {
                            // Archive the previous current W-9.
                            for (let i = 0; i < next.length; i++) {
                              if (next[i].category === "w9" && !next[i].archived) next[i] = { ...next[i], archived: true };
                            }
                            next.unshift({ id: `d${Date.now()}-w9`, category: "w9", name: docModalUploads.w9, date: today });
                          }
                          if (docUpdateModal.license && docModalUploads.license) {
                            next.unshift({ id: `d${Date.now()}-lic`, category: "license", name: docModalUploads.license, date: today });
                          }
                          return next;
                        });
                        if (clientLocked) {
                          // Client (Admin view) upload flow — mirrors the plain
                          // Save toast so the client knows their change + doc is
                          // in the review queue rather than pushed live.
                          showToast({
                            title: "Changes submitted for review",
                            description: "We'll review your edits and update the agency record shortly.",
                          }, 5000);
                        } else {
                          // Internal staff upload — same messaging as the no-doc
                          // internal save path so the workflow reads consistently.
                          showToast({
                            title: "Sent to Accounting for review",
                            description: "They'll review and push to ITC.",
                          }, 5000);
                        }
                        setBadgesOverride(Array.from(eBadges));
                        setAffilOverride(Array.from(eAffil));
                        setWcOverride(Array.from(eWC));
                        setAgencyFieldOverride({
                          name: eName, street: eStreet, city: eCity, state: eState, zip: eZip,
                          phone: ePhone, contactEmail: eEmail, licenseNo: eLicNo, licenseExp: eLicExp,
                        });
                        setIsEditing(false);
                        setDocUpdateModal(null);
                        setDocModalUploads({});
                      }}
                      disabled={!allUploaded}
                      className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-all"
                      style={{ background: btnGrad, opacity: allUploaded ? 1 : 0.5, cursor: allUploaded ? "pointer" : "not-allowed" }}
                      onMouseEnter={e => { if (allUploaded) e.currentTarget.style.filter = "brightness(1.10)"; }}
                      onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
                      Upload Document{required.length > 1 ? "s" : ""}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
      {startQuoteAs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={() => setStartQuoteAs(null)}
          style={{ background: "rgba(0,0,0,0.45)" }}>
          <div className="w-[460px] rounded-2xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}
            style={{ background: c.cardBg, border: `1px solid ${c.border}`, fontFamily: FONT }}>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, rgba(92,46,212,0.14), rgba(166,20,195,0.14))" }}>
                <QuoteIcon className="w-6 h-6" style={{ color: "#A614C3" }} strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[16px] font-bold mb-1.5" style={{ color: c.text }}>Start a quote as this user?</h3>
                <p className="text-[12px] leading-relaxed" style={{ color: c.muted }}>
                  You'll start a quote as{" "}
                  <strong style={{ color: c.text, fontWeight: 700 }}>{startQuoteAs.name}</strong>
                  {" "}on <strong style={{ color: c.text, fontWeight: 700 }}>{agency.name}</strong>. An "Acting as" badge stays in the top bar — click it to switch back any time.
                </p>
                <div className="mt-3 rounded-lg px-3 py-2 text-[12px] flex items-center gap-2"
                  style={{ background: isDark ? "rgba(166,20,195,0.10)" : "#F9F4FC", color: c.text }}>
                  <UserCircle className="w-4 h-4" style={{ color: "#A614C3" }} />
                  <span style={{ fontWeight: 600 }}>{startQuoteAs.name}</span>
                  <span style={{ color: c.muted }}>·</span>
                  <span style={{ color: c.muted }} className="truncate">{startQuoteAs.email}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setStartQuoteAs(null)}
                className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
                style={{ border: `1px solid ${c.borderStrong}`, color: c.text, background: "transparent" }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                Cancel
              </button>
              <button onClick={() => {
                  const payload = {
                    userName: startQuoteAs.name,
                    userEmail: startQuoteAs.email,
                    agencyName: agency.name,
                    agencyCode: agency.code,
                  };
                  setStartQuoteAs(null);
                  onStartImpersonation?.(payload);
                }}
                className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-opacity"
                style={{ background: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.92")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                Start Quote
              </button>
            </div>
          </div>
        </div>
      )}
      {removeUserConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={() => setRemoveUserConfirm(null)}
          style={{ background: "rgba(0,0,0,0.45)" }}>
          <div className="w-[420px] rounded-2xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}
            style={{ background: c.cardBg, border: `1px solid ${c.border}`, fontFamily: FONT }}>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(239,68,68,0.10)" }}>
                <Trash2 className="w-6 h-6" style={{ color: "#EF4444" }} />
              </div>
              <div>
                <h3 className="text-[16px] font-bold mb-1" style={{ color: c.text }}>Remove this user?</h3>
                <p className="text-[12px] leading-relaxed" style={{ color: c.muted }}>
                  This action <strong style={{ color: "#EF4444", fontWeight: 700 }}>cannot be undone</strong>. They will be permanently removed from this agency. To restore access instead, choose <strong style={{ background: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>Reactivate</strong>.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setRemoveUserConfirm(null)}
                className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
                style={{ border: `1px solid ${c.borderStrong}`, color: c.text, background: "transparent" }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                Cancel
              </button>
              <button onClick={() => {
                  const removedId = removeUserConfirm.id;
                  const removedName = removeUserConfirm.name;
                  setRemovedUserIds(prev => { const s = new Set(prev); s.add(removedId); return s; });
                  showToast({
                    title: "User removed",
                    description: `${removedName} was removed from this agency.`,
                  }, 3000);
                  setRemoveUserConfirm(null);
                }}
                className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-colors"
                style={{ background: "#EF4444" }}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
      {docConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={() => setDocConfirm(null)}
          style={{ background: "rgba(0,0,0,0.45)" }}>
          <div className="w-[420px] rounded-2xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}
            style={{ background: c.cardBg, border: `1px solid ${c.border}`, fontFamily: FONT }}>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: docConfirm.danger ? "rgba(239,68,68,0.10)" : "rgba(245,158,11,0.10)" }}>
                {docConfirm.icon === "trash"
                  ? <Trash2 className="w-6 h-6" style={{ color: "#EF4444" }} />
                  : <Archive className="w-6 h-6" style={{ color: "#F59E0B" }} />}
              </div>
              <div>
                <h3 className="text-[16px] font-bold mb-1" style={{ color: c.text }}>{docConfirm.title}</h3>
                <p className="text-[12px] leading-relaxed" style={{ color: c.muted }}>{docConfirm.body}</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDocConfirm(null)}
                className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
                style={{ border: `1px solid ${c.borderStrong}`, color: c.text, background: "transparent" }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                Cancel
              </button>
              <button onClick={() => { docConfirm.onConfirm(); setDocConfirm(null); }}
                className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-colors"
                style={{ background: docConfirm.danger ? "#EF4444" : "#F59E0B" }}>
                {docConfirm.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Section title — same as list view. In production the external-client user's role
          would come from auth (see `clientIsAdmin` in AgencyDetailView); here we simply
          default to admin, so the header renders the h1 alone as it did originally. */}
      <div className="flex flex-col justify-center flex-shrink-0 mb-12"
        style={{ height: 71, borderBottom: `0.87px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E5E7EB"}` }}>
        <h1 className="text-[22px] font-normal" style={{ ...font, color: c.text }}>{pageTitleOverride ?? (viewMode === "client" ? "Admin" : "Agencies")}</h1>
      </div>

        {/* License alert banner paused — see 2026-10-30 pivot to the Team
            Setup prompt (owned by DashboardShell). Re-enable this slot when
            the License expiration flow lands.
            {viewMode === "client" && <LicenseAlertBanner isDark={isDark} />} */}

        {/* Back link — only useful in the internal staff view (the list is one level up).
            Hidden in client view because there's no list to return to. */}
        {viewMode === "internal" && (
          <div className="pb-4 flex-shrink-0">
            <button onClick={onBack} className="flex items-center gap-1.5 text-[12px] transition-all" style={{ ...font, color: c.muted }}
              onMouseEnter={e => (e.currentTarget.style.color = c.text)}
              onMouseLeave={e => (e.currentTarget.style.color = c.muted)}>
              <ChevronLeft className="w-3.5 h-3.5" />Back to Agencies
            </button>
          </div>
        )}

        {/* Agency hero row */}
        <div className="flex items-start justify-between mb-5 flex-shrink-0">
          <div>
            {/* Title row — star inline with h2 and badge. Star is internal-staff-only
                (BTIS staff favoriting an agency in their list); hidden in client view. */}
            <div className="flex items-center gap-2.5">
              {viewMode === "internal" && (
                <button onClick={() => onToggleStar(agency.id)} className="flex-shrink-0 transition-all"
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.18)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
                  <Star className="w-5 h-5" style={{ color: "#F59E0B", fill: isStarred ? "#F59E0B" : "none" }} />
                </button>
              )}
              <h2 className="text-[24px] font-bold" style={{ ...font, color: c.text }}>{agency.name}</h2>
              <TimeStatusBadge status={getAgencyTimeStatus(agency.apptDate, agency.lastLogin)} isDark={isDark} />
            </div>
            {/* Subtitle indented to sit under the title text (offset accounts for the star);
                no offset in client view since the star isn't rendered. */}
            <p className="text-[12px] mt-0.5" style={{ ...font, color: c.muted, marginLeft: viewMode === "internal" ? 29 : 0 }}>Agency Code: {agency.code}</p>
          </div>
          {/* Action cluster (Website / Address / Send Email / Phone Call / Book Roll) is
              internal-staff-only — these are quick links for BTIS staff to reach the agency.
              Hidden in the client view because the agency wouldn't be contacting themselves. */}
          {viewMode === "internal" && (
          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            {agency.website ? (
              <a href={agency.website.startsWith("http") ? agency.website : `https://${agency.website}`}
                target="_blank" rel="noopener noreferrer"
                title={agency.website}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all"
                style={{ ...font, background: "transparent", border: `1px solid ${c.border}`, color: c.muted }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <Globe className="w-3.5 h-3.5" />Website
              </a>
            ) : (
              <button onClick={() => setIsEditing(true)}
                title="Add a website"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium transition-all"
                style={{ ...font, background: "transparent", border: `1px dashed ${c.borderStrong}`, color: c.muted }}
                onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                <Plus className="w-3.5 h-3.5" />Add Website
              </button>
            )}
            {(agency.street || agency.city || agency.state || agency.zip) ? (
              <button onClick={() => setAddressModalOpen(true)}
                title={`${agency.street}, ${agency.city}, ${agency.state}, ${agency.zip}`}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all"
                style={{ ...font, background: "transparent", border: `1px solid ${c.border}`, color: c.muted }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <MapPin className="w-3.5 h-3.5" />Address
              </button>
            ) : (
              <button onClick={() => setIsEditing(true)}
                title="Add an address"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium transition-all"
                style={{ ...font, background: "transparent", border: `1px dashed ${c.borderStrong}`, color: c.muted }}
                onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                <Plus className="w-3.5 h-3.5" />Add Address
              </button>
            )}
            {agency.contactEmail ? (
              <a href={`mailto:${agency.contactEmail}`}
                title={agency.contactEmail}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all"
                style={{ ...font, background: "transparent", border: `1px solid ${c.border}`, color: c.muted }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <Mail className="w-3.5 h-3.5" />Send Email
              </a>
            ) : (
              <button onClick={() => setIsEditing(true)}
                title="Add an email"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium transition-all"
                style={{ ...font, background: "transparent", border: `1px dashed ${c.borderStrong}`, color: c.muted }}
                onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                <Plus className="w-3.5 h-3.5" />Add Email
              </button>
            )}
            {agency.contactPhone ? (
              <button onClick={() => setCallModalOpen(true)}
                title="Phone Call"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all"
                style={{ ...font, background: "transparent", border: `1px solid ${c.border}`, color: c.muted }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <Phone className="w-3.5 h-3.5" />Phone Call
              </button>
            ) : (
              <button onClick={() => setIsEditing(true)}
                title="Add a phone number"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-medium transition-all"
                style={{ ...font, background: "transparent", border: `1px dashed ${c.borderStrong}`, color: c.muted }}
                onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                <Plus className="w-3.5 h-3.5" />Add Phone
              </button>
            )}
            {/* Admin-only: Book Roll — sells this agency's entire policy book to another agency. */}
            {currentUserIsAdmin && !bookRolled.has(agency.id) && (
              <button onClick={() => { setBookRollTargetId(""); setBookRollConfirmText(""); setBookRollOpen(true); }}
                title="Sell this agency's policy book to another agency"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all"
                style={{ ...font, background: "transparent", border: `1px solid ${c.border}`, color: c.muted }}
                onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true"><path d="m648-140 112-112v92h40v-160H640v40h92L620-168l28 28Zm-448 20q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v268q-19-9-39-15.5t-41-9.5v-243H200v560h242q3 22 9.5 42t15.5 38H200Zm0-120v40-560 243-3 280Zm80-40h163q3-21 9.5-41t14.5-39H280v80Zm0-160h244q32-30 71.5-50t84.5-27v-3H280v80Zm0-160h400v-80H280v80ZM720-40q-83 0-141.5-58.5T520-240q0-83 58.5-141.5T720-440q83 0 141.5 58.5T920-240q0 83-58.5 141.5T720-40Z" /></svg>Book Roll
              </button>
            )}
            {bookRolled.has(agency.id) && (() => {
              const sold = bookRolled.get(agency.id)!;
              const targetAgency = allAgencies.find(a => a.code === sold.targetCode);
              return (
                <button
                  onClick={() => onNavigateToAgency?.(sold.targetCode, "policies")}
                  title={targetAgency ? `View ${targetAgency.name}'s policies` : `Sold on ${sold.date}`}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all cursor-pointer"
                  style={{ ...font, backgroundImage: "linear-gradient(88.54deg, rgba(92,46,212,0.08) 0.1%, rgba(166,20,195,0.10) 63.88%)", border: "1px solid rgba(166,20,195,0.22)" }}
                  onMouseEnter={e => { e.currentTarget.style.filter = "brightness(0.96)"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(166,20,195,0.18)"; }}
                  onMouseLeave={e => { e.currentTarget.style.filter = "none"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                  {/* Gradient-stroked archive icon */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <defs>
                      <linearGradient id={`soldArchiveGrad-${agency.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#5C2ED4" />
                        <stop offset="100%" stopColor="#A614C3" />
                      </linearGradient>
                    </defs>
                    <g stroke={`url(#soldArchiveGrad-${agency.id})`}>
                      <rect width="20" height="5" x="2" y="3" rx="1" />
                      <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
                      <path d="M10 12h4" />
                    </g>
                  </svg>
                  <span style={{ backgroundImage: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Sold to {sold.targetCode}</span>
                </button>
              );
            })()}
          </div>
          )}
        </div>

        {/* 4 info cards */}
        <div className="flex gap-4 mb-6 flex-shrink-0">
          {/* Agency Contact — editable card */}
          <div className="flex-1 rounded-2xl p-5 relative min-w-0 group transition-all cursor-pointer"
            style={{ background: c.cardBg, border: `1px solid ${c.border}` }}
            onMouseEnter={e => { if (!contactCardEditing) { e.currentTarget.style.background = `linear-gradient(${c.cardBg},${c.cardBg}) padding-box, linear-gradient(90deg,#5C2ED4 0%,#A614C3 65%) border-box`; e.currentTarget.style.border = "1px solid transparent"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(110,33,196,0.18)"; }}}
            onMouseLeave={e => { if (!contactCardEditing) { e.currentTarget.style.background = c.cardBg; e.currentTarget.style.border = `1px solid ${c.border}`; e.currentTarget.style.boxShadow = "none"; }}}>
            {/* Header row */}
            <div className="flex items-center mb-3">
              <p className="text-[12px] font-semibold" style={{ ...font, color: c.muted }}>Agency Contact</p>
            </div>
            {/* User icon — pinned at top-right, purple chip matching InfoCards */}
            {!contactCardEditing && (
              <div className="absolute top-4 right-4 p-2 rounded-lg" style={{ background: "rgba(168,85,247,0.10)" }}>
                <User className="w-5 h-5" style={{ color: "#A855F7" }} />
              </div>
            )}
            {/* Edit button — floats left of icon on card hover.
                • Admin (internal staff OR external admin): opens the contact edit modal.
                • Non-admin external user: button is disabled and its own hover shows a
                  small tooltip explaining the permission gate. No modal, no submit flow. */}
            {!contactCardEditing && (
              currentUserIsAdmin ? (
                <button onClick={() => setContactCardEditing(true)}
                  className="absolute opacity-0 group-hover:opacity-100 flex items-center gap-1.5 px-3 rounded-lg text-[12px] font-semibold transition-all"
                  style={{ top: "16px", right: "56px", height: 36, fontFamily: FONT, color: c.text, border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "#E5E7EB"}`, background: isDark ? "rgba(255,255,255,0.05)" : c.cardBg }}
                  onMouseEnter={e => e.currentTarget.style.background = c.hoverBg}
                  onMouseLeave={e => e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.05)" : c.cardBg}>
                  <Pencil className="w-3.5 h-3.5" />Edit
                </button>
              ) : (
                <div className="absolute opacity-0 group-hover:opacity-100 transition-all"
                  style={{ top: "16px", right: "56px" }}>
                  <div className="relative group/lockedit">
                    <button disabled
                      className="flex items-center gap-1.5 px-3 rounded-lg text-[12px] font-semibold cursor-not-allowed"
                      style={{ height: 36, fontFamily: FONT, color: c.muted, border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB"}`, background: isDark ? "rgba(255,255,255,0.03)" : c.cardBg, opacity: 0.75 }}>
                      <Lock className="w-3.5 h-3.5" />Edit
                    </button>
                    {/* Tooltip surfaces on the button's own hover (nested tailwind group:
                        `group/lockedit`). Hidden by default, visible when the Edit button
                        itself is hovered — the card-hover already brought the button into
                        view, so the extra hover feels natural. */}
                    <div className="absolute pointer-events-none opacity-0 group-hover/lockedit:opacity-100 transition-opacity whitespace-nowrap"
                      style={{ top: "calc(100% + 6px)", right: 0, background: isDark ? "#1F2233" : "#111827", color: "#fff", fontFamily: FONT, fontSize: 11, padding: "6px 10px", borderRadius: 8, zIndex: 20, boxShadow: "0 6px 20px rgba(15,23,42,0.15)" }}>
                      You don&apos;t have permission — only your admin can modify this
                    </div>
                  </div>
                </div>
              )
            )}
            {/* Content */}
            <p className="text-[13px] font-semibold mb-0.5" style={{ ...font, color: c.text }}>{eContact}</p>
            <p className="text-[12px]" style={{ ...font, color: c.muted }}>{eContactPhone}</p>
            <p className="text-[12px]" style={{ ...font, color: c.muted }}>{eEmail}</p>
          </div>
          <InfoCard title="Agency Status" icon={<Building2 className="w-5 h-5" style={{ color: "#A855F7" }} />}>
            <div className="flex flex-col items-start gap-1.5">
              {bookRolled.has(agency.id) || eStatus === "Unappointed" ? <UnapptBadge /> : <AppointedBadge />}
              {effectiveBadges.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  {effectiveBadges.map(b => (
                    <span key={b} className="inline-flex items-center justify-center rounded-full whitespace-nowrap"
                      style={{ background: isDark ? "rgba(168,85,247,0.22)" : "rgba(168,85,247,0.10)", padding: "3px 10px" }}>
                      <span style={{
                        backgroundImage: isDark
                          ? "linear-gradient(88.54deg, #A855F7 0.1%, #D946EF 63.88%)"
                          : "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontSize: 11, fontWeight: 600, lineHeight: "16px",
                      }}>{b}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </InfoCard>
          {/* Appointed Date card swaps to "Sold Date" when the agency has been book-rolled. */}
          {bookRolled.has(agency.id) ? (
            <InfoCard title="Sold Date" icon={<Archive className="w-5 h-5" style={{ color: "#A855F7" }} />}>
              <p className="text-[14px] font-semibold" style={{ ...font, color: c.text }}>{bookRolled.get(agency.id)!.date}</p>
              <p className="text-[11px] mt-1" style={{ ...font, color: c.muted }}>Originally appointed {agency.apptDate}</p>
            </InfoCard>
          ) : (
            <InfoCard title="Appointed Date" icon={<Calendar className="w-5 h-5" style={{ color: "#A855F7" }} />}>
              <p className="text-[14px] font-semibold" style={{ ...font, color: c.text }}>{agency.apptDate}</p>
            </InfoCard>
          )}
          <InfoCard title="Affiliations" icon={<Network className="w-5 h-5" style={{ color: "#A855F7" }} />}>
            <div style={{ paddingRight: 40 }}>
              {effectiveAffils.length === 0 ? (
                <p className="text-[12px]" style={{ ...font, color: c.muted }}>None</p>
              ) : (() => {
                // Pill style, max 5 visible. Beyond that, a muted "+N more" pill.
                const CAP = 5;
                const visible = effectiveAffils.slice(0, CAP);
                const extra = effectiveAffils.length - CAP;
                return (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {visible.map(a => (
                      <span key={a} className="inline-flex items-center justify-center rounded-full whitespace-nowrap"
                        style={{
                          ...font,
                          background: isDark ? "rgba(255,255,255,0.06)" : "#F3F4F6",
                          padding: "3px 10px",
                          fontSize: 11, fontWeight: 600, lineHeight: "16px", color: c.text,
                        }}>{a}</span>
                    ))}
                    {extra > 0 && (
                      <button
                        type="button"
                        onClick={scrollToAffiliations}
                        title="See all affiliations"
                        className="inline-flex items-center justify-center rounded-full whitespace-nowrap transition-colors"
                        style={{
                          background: isDark ? "rgba(255,255,255,0.04)" : "#F9FAFB",
                          border: "none",
                          padding: "3px 10px",
                          ...font,
                          fontSize: 11, fontWeight: 600, lineHeight: "16px", color: c.muted,
                          cursor: "pointer",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = isDark ? "rgba(168,85,247,0.18)" : "rgba(168,85,247,0.08)"; e.currentTarget.style.color = "#A614C3"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.04)" : "#F9FAFB"; e.currentTarget.style.color = c.muted; }}>
                        +{extra} more
                      </button>
                    )}
                  </div>
                );
              })()}
            </div>
          </InfoCard>
        </div>

        {/* (License-expired banner removed from this detail surface on
            2026-10-27 — phase 1 only covers the Add Agency NIPR check.
            The dashboard-wide banner for existing expired agencies is
            phase 2 scope, once the daily NIPR batch job is live.) */}

        {/* Tab bar */}
        <div className="flex items-center gap-1 mb-5 flex-shrink-0" style={{ borderBottom: `1px solid ${c.border}` }}>
          {detailTabs.map(([key, label, icon]) => {
            const active = detailTab === key;
            const activeTextColor  = isDark ? "#fff"     : "#A614C3";
            const activeIconColor  = "#A614C3";
            const activeUnderline  = "linear-gradient(90deg,#5C2ED4 0%,#A614C3 65%)";
            // Accounting tab surfaces a pending-updates dot when the
            // agency's ITC record is behind the Norbielink agency info,
            // so the super admin knows there's something to review before
            // opening the tab. Internal + super-admin gated.
            const pendingItc = key === "accounting" && viewMode === "internal" && isSuperAdmin
              ? countPendingItcUpdates(effectiveAgency, itcRecords?.[agency.code] ?? null)
              : 0;
            return (
              <button key={key} onClick={() => { setDetailTab(key); }}
                className="flex items-center gap-1.5 px-4 py-3 text-[13px] font-normal relative transition-colors"
                style={{ ...font, color: active ? activeTextColor : c.muted, letterSpacing: "0.01em" }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = c.text; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = c.muted; }}>
                <span style={{ color: active ? activeIconColor : undefined }}>{icon}</span>
                {label}
                {pendingItc > 0 && (
                  <span
                    title="Pending updates to push to ITC"
                    aria-label="Pending updates"
                    className="inline-flex items-center justify-center rounded-full flex-shrink-0"
                    style={{ width: 16, height: 16, background: "rgba(166, 20, 195, 0.12)" }}
                  >
                    <Bell className="w-3 h-3" style={{ color: "#A614C3" }} strokeWidth={2.25} />
                  </span>
                )}
                {active && <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: activeUnderline }} />}
              </button>
            );
          })}
        </div>


        {/* ── Overview tab ── */}
        {detailTab === "overview" && !isEditing && (
          <div className="pb-6">
          <div className="rounded-2xl p-8 mb-8" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[17px] font-bold" style={{ ...font, color: c.text }}>Agency Information</h3>
              {currentUserIsAdmin && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                  style={{ ...font, border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB"}`, color: c.muted }}
                  onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <Pencil className="w-3.5 h-3.5" />Edit
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-x-12 gap-y-6">
              <LabelValue label="Agency Name" value={agency.name} />
              <LabelValue label="Agency Code" value={agency.code} />
              <LabelValue label="Agency Type" value={<span style={{ color: c.text }}>{agency.agencyType}</span>} />
              <LabelValue label="Mailing Address" value={`${agency.street}, ${agency.city}, ${agency.state}, ${agency.zip}`} />
              <LabelValue label="Agency Address" value="Same as Mailing Address" />
              <div />
              <div>
                <p className="text-[13px] font-semibold mb-2" style={{ ...font, color: c.text }}>Status:</p>
                {bookRolled.has(agency.id) || eStatus === "Unappointed"
                  ? <UnapptBadge />
                  : <AppointedBadge />}
              </div>
              {/* When sold or unappointed, swap Appt. Date → Reason. Book-rolled agencies always show "Sold". */}
              {bookRolled.has(agency.id) || eStatus === "Unappointed" ? (() => {
                const reasonText = bookRolled.has(agency.id) ? "Sold" : (eReason || "—");
                return <LabelValue label="Reason" value={<span style={{ color: "#A614C3", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{reasonText}</span>} />;
              })() : (
                <LabelValue label="Appt. Date" value={agency.apptDate} />
              )}
              {bookRolled.has(agency.id)
                ? <LabelValue label="Sold To" value={<span style={{ color: "#A614C3", fontWeight: 600 }}>{bookRolled.get(agency.id)!.targetCode}</span>} />
                : <div />}
              <LabelValue label="Agency Contact" value={agency.contact} />
              <LabelValue label="Email Address"  value={agency.contactEmail} />
              <div />
              <LabelValue label="Type of Business" value={agency.bizType} />
              <LabelValue label="Tax ID"           value={agency.taxId || "—"} />
              <LabelValue
                label="Website Url"
                value={
                  agency.website
                    ? agency.website
                    : <span style={{ fontStyle: "italic", color: c.muted }}>No website added for this agency yet.</span>
                }
              />
              <LabelValue label="Phone Number"     value={agency.phone} />
              <LabelValue label="Toll Free Number" value={agency.tollFree || "—"} />
              <div />
              <LabelValue label="License Number"  value={agency.licenseNo || "—"} />
              <LabelValue label="Expiration Date" value={agency.licenseExp} />
              <LabelValue label="NPN"             value={agency.npn || "—"} />
              <LabelValue label="E&O Policy #"    value={agency.eoPolicyNo || "—"} />
              <LabelValue label="Expiration Date" value={agency.eoExp} />
              {/* Billing-type fields (Agency Bill / Direct Bill / Premium
                  Finance) intentionally omitted from the agent-facing
                  view — accounting-only info, not useful to agents. */}
              {/* Spacer — pushes Affiliations / Direct Appointments / Tags
                  onto their own row so the trio reads as one group. */}
              <div />
              {(() => {
                const CAP = 5;
                const affils = effectiveAffils;
                const wcs    = effectiveWC;
                const affilVisible = affilExpanded ? affils : affils.slice(0, CAP);
                const wcVisible    = wcExpanded    ? wcs    : wcs.slice(0, CAP);
                const toggleStyle: React.CSSProperties = {
                  fontFamily: FONT, fontSize: 12, fontWeight: 600,
                  background: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  border: "none", padding: 0, cursor: "pointer", marginTop: 6,
                  display: "inline-flex", alignItems: "center", gap: 4,
                };
                return (
                  <>
                    <div ref={affilSectionRef} style={{ scrollMarginTop: 80 }}>
                      <p className="text-[13px] font-semibold mb-2" style={{ ...font, color: c.text }}>Affiliations</p>
                      <div className="space-y-1">{affilVisible.map(a => <p key={a} className="text-[13px]" style={{ ...font, color: c.text }}>{a}</p>)}</div>
                      {affils.length > CAP && (
                        <button onClick={() => setAffilExpanded(e => !e)} style={toggleStyle}>
                          {affilExpanded
                            ? <>Show less <ChevronUp className="w-3 h-3" style={{ color: "#A614C3" }} /></>
                            : <>Show all ({affils.length}) <ChevronDown className="w-3 h-3" style={{ color: "#A614C3" }} /></>}
                        </button>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-[13px] font-semibold" style={{ ...font, color: c.text }}>Direct Appointments</p>
                        <span style={{ color: c.border }}>|</span>
                        <p className="text-[13px] font-semibold" style={{ ...font, color: "#A614C3" }}>Workers Compensation</p>
                      </div>
                      <div className="space-y-1">{wcVisible.map(w => <p key={w} className="text-[13px]" style={{ ...font, color: c.text }}>{w}</p>)}</div>
                      {wcs.length > CAP && (
                        <button onClick={() => setWcExpanded(e => !e)} style={toggleStyle}>
                          {wcExpanded
                            ? <>Show less <ChevronUp className="w-3 h-3" style={{ color: "#A614C3" }} /></>
                            : <>Show all ({wcs.length}) <ChevronDown className="w-3 h-3" style={{ color: "#A614C3" }} /></>}
                        </button>
                      )}
                    </div>
                  </>
                );
              })()}
              <div>
                <p className="text-[13px] font-semibold mb-2" style={{ ...font, color: c.text }}>Tags</p>
                {effectiveBadges.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {effectiveBadges.map(b => (
                      <span key={b} className="inline-flex items-center justify-center rounded-full whitespace-nowrap"
                        style={{ background: isDark ? "rgba(168,85,247,0.22)" : "rgba(168,85,247,0.10)", padding: "3px 10px" }}>
                        <span style={{
                          backgroundImage: isDark
                            ? "linear-gradient(88.54deg, #A855F7 0.1%, #D946EF 63.88%)"
                            : "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)",
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          fontSize: 11, fontWeight: 600, lineHeight: "16px",
                        }}>{b}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px]" style={{ ...font, color: c.muted, fontStyle: "italic" }}>None — add a tag in Edit.</p>
                )}
              </div>
            </div>
          </div>
          </div>
        )}

        {/* ── Edit form + footer ── */}
        {detailTab === "overview" && isEditing && (
          <>
          {editExpanded && <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.35)" }} onClick={() => setEditExpanded(false)} />}
          <div className={editExpanded ? "fixed inset-y-0 right-0 z-50 flex flex-col shadow-2xl overflow-y-auto" : "pb-6"}
            style={editExpanded ? { width: "70vw", background: c.cardBg, borderLeft: `1px solid ${c.border}` } : undefined}>
          <div className={editExpanded ? "p-6 mb-6" : "rounded-2xl p-6 mb-6"} style={editExpanded ? { background: c.cardBg } : { background: c.cardBg, border: `1px solid ${c.border}`, maxWidth: 1590 }}>
            {/* Card header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[17px] font-bold" style={{ ...font, color: c.text }}>Agency Information</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => setEditExpanded(p => !p)} title={editExpanded ? "Collapse" : "Expand"}
                  className="p-1.5 rounded-md transition-colors" style={{ color: editExpanded ? "#A855F7" : c.muted }}
                  onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  {editExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button onClick={() => { setIsEditing(false); setEditExpanded(false); setFieldErrors({}); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                  style={{ ...font, border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB"}`, color: c.text }}
                  onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <Pencil className="w-3.5 h-3.5" />Cancel Edit
                </button>
              </div>
            </div>

            {/* Concurrent-edit warning. If someone (internal or external)
                already saved unpushed edits since ITC was last synced,
                surface that state so the current editor knows a Save
                will overwrite the earlier diff (last-write-wins).
                Uses the same visual language as the Accounting-tab
                Pending Updates alert so it reads as one family. The
                "check the ITC Record tab" hint is only shown to viewers
                who can actually see that tab (internal + super admin);
                other viewers get the truncated form without the pointer. */}
            {hasPendingOverride && (
              <div className="rounded-xl p-4 mb-6 flex items-start gap-3"
                style={{ background: isDark ? "rgba(255,255,255,0.04)" : "#F9FAFB", border: `1px solid ${c.border}` }}>
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <defs>
                    <linearGradient id="alert-razz-conflict" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="0">
                      <stop offset="0%" stopColor="#5C2ED4" />
                      <stop offset="100%" stopColor="#A614C3" />
                    </linearGradient>
                  </defs>
                  <circle cx="12" cy="12" r="10" stroke="url(#alert-razz-conflict)" />
                  <line x1="12" x2="12" y1="8" y2="12" stroke="url(#alert-razz-conflict)" />
                  <line x1="12" x2="12.01" y1="16" y2="16" stroke="url(#alert-razz-conflict)" />
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold" style={{
                    ...font,
                    backgroundImage: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>
                    Unpushed edits on file
                  </div>
                  <div className="text-[12px] mt-0.5" style={{ ...font, color: c.muted }}>
                    This agency was already edited and is waiting for Accounting to review. Saving now will overwrite any conflicting field — last save wins.{viewMode === "internal" && isSuperAdmin ? " Check the Accounting → ITC Record tab if you want to see what’s pending first." : ""}
                  </div>
                </div>
              </div>
            )}

            {/* Row 1: Name | Code | Type */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <label style={labelStyle}>Agency Name:{pendingTag(["name"])}</label>
                {clientLocked
                  ? <LockedInput value={eName} />
                  : <div data-edit-error={editErr("name") ? "true" : undefined}>
                      <input value={eName} onChange={e => { setEName(e.target.value); clearEditErr("name"); }} style={{ ...inputStyle, ...editErrStyle("name") }} />
                      <EditErrLine k="name" />
                    </div>}
              </div>
              <div>
                <label style={labelStyle}>Agency Code:</label>
                {/* Locked on edit — the agency code is an external identifier the agency
                    relies on. Changing it after the fact would break inbound references
                    (link sharing, support tickets, partner integrations), so we surface
                    it as read-only with a lock affordance instead of an editable input. */}
                <div className="relative">
                  <input value={eCode} readOnly aria-readonly="true"
                    title="Agency Code is locked — external systems reference this value."
                    style={{
                      ...inputStyle,
                      width: "100%",
                      paddingRight: 34,
                      background: isDark ? "rgba(255,255,255,0.04)" : "#F9FAFB",
                      color: c.muted,
                      cursor: "not-allowed",
                    }} />
                  <Lock className="w-3.5 h-3.5 absolute pointer-events-none"
                    style={{ right: 10, top: "50%", transform: "translateY(-50%)", color: c.muted }} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Agency Type:</label>
                {clientLocked ? <LockedInput value={eType} /> : (
                  <div className="flex" style={{ gap: 10 }}>
                    {(["Retail","Wholesale"] as const).map(t => {
                      const active = eType === t;
                      return (
                        <button key={t} onClick={() => setEType(t)}
                          className="flex items-center gap-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap justify-center transition-all"
                          style={{ ...font, width: 120, height: 40, boxSizing: "border-box",
                            border: active ? "1px solid transparent" : `1px solid ${c.border}`,
                            background: active ? undefined : c.cardBg,
                            backgroundImage: active
                              ? `linear-gradient(88.54deg, rgba(92,46,212,0.06) 0.1%, rgba(166,20,195,0.06) 63.88%), linear-gradient(${c.cardBg}, ${c.cardBg}), linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)`
                              : undefined,
                            backgroundOrigin: active ? "padding-box, padding-box, border-box" : undefined,
                            backgroundClip: active ? "padding-box, padding-box, border-box" : undefined,
                          }}>
                          <Radio checked={active} onClick={() => setEType(t)} />
                          {active
                            ? <span style={isDark ? { color: "#FFFFFF" } : { backgroundImage: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t}</span>
                            : <span style={{ color: c.muted }}>{t}</span>
                          }
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Agency Address */}
            {(() => {
              // StyledSelect palette — matches the popover language used in
              // ITC editing so Country / State pickers here look identical
              // to the ones on the Accounting → ITC Record surface.
              const selectC = {
                text: c.text, muted: c.muted, border: c.border, cardBg: c.cardBg, hoverBg: c.hoverBg,
                razz: "#A614C3", razzTintBg: isDark ? "rgba(168,85,247,0.14)" : "rgba(168,85,247,0.08)",
              };
              const COUNTRIES = ["United States of America", "Canada", "Mexico"] as const;
              const STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"] as const;
              type Country = typeof COUNTRIES[number];
              type StateCode = typeof STATES[number];
              return (
            <>
            <div className="mb-4">
              <label style={{ ...labelStyle, marginBottom: 12 }}>Mailing Address:{pendingTag(["street", "city", "state", "zip"])}</label>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-6">
                  <StyledSelect<Country>
                    value={(COUNTRIES as readonly string[]).includes(eCountry) ? (eCountry as Country) : "United States of America"}
                    onChange={v => setECountry(v)}
                    options={COUNTRIES}
                    triggerStyle={selectStyle}
                    c={selectC}
                    font={font}
                  />
                  <div data-edit-error={editErr("street") ? "true" : undefined}>
                    <AddressAutocomplete
                      value={eStreet}
                      onChange={v => { setEStreet(v); clearEditErr("street"); }}
                      onSelect={a => {
                        setEStreet(a.street); clearEditErr("street");
                        if (a.city) { setECity(a.city); clearEditErr("city"); }
                        if (a.state) { setEState(a.state); clearEditErr("state"); }
                        if (a.zip) { setEZip(a.zip); clearEditErr("zip"); }
                        if (a.country) setECountry(a.country);
                      }}
                      placeholder="Street address"
                      containerStyle={{ width: "100%" }}
                      inputStyle={{ ...inputStyle, width: "100%", ...editErrStyle("street") }}
                      dropdownBg={c.cardBg} dropdownText={c.text} dropdownBorder={c.border}
                    />
                    <EditErrLine k="street" />
                  </div>
                  <div />
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div data-edit-error={editErr("city") ? "true" : undefined}>
                    <input value={eCity} onChange={e => { setECity(e.target.value); clearEditErr("city"); }} placeholder="City" style={{ ...inputStyle, ...editErrStyle("city") }} />
                    <EditErrLine k="city" />
                  </div>
                  <div className="flex gap-4">
                    <div style={{ flex: 1 }} data-edit-error={editErr("state") ? "true" : undefined}>
                      <StyledSelect<StateCode>
                        value={(STATES as readonly string[]).includes(eState) ? (eState as StateCode) : "IA"}
                        onChange={v => { setEState(v); clearEditErr("state"); }}
                        options={STATES}
                        triggerStyle={{ ...selectStyle, width: "100%", ...editErrStyle("state") }}
                        c={selectC}
                        font={font}
                      />
                      <EditErrLine k="state" />
                    </div>
                    <div style={{ flex: 1 }} data-edit-error={editErr("zip") ? "true" : undefined}>
                      <input value={eZip} onChange={e => { setEZip(e.target.value); clearEditErr("zip"); }} placeholder="ZIP" style={{ ...inputStyle, ...editErrStyle("zip") }} />
                      <EditErrLine k="zip" />
                    </div>
                  </div>
                  <div />
                </div>
              </div>
            </div>

            {/* Agency Address (secondary — can mirror the mailing address
                via the "Same as Mailing Address" checkbox. The label block
                above holds the primary mailing address.) */}
            <div className="mb-6">
              <label style={{ ...labelStyle, marginBottom: 8 }}>Agency Address:</label>
              <div className="flex items-center gap-2 mb-3">
                <Checkbox checked={eSameAddr} onClick={() => setESameAddr(p => !p)} />
                <span className="text-[13px] font-semibold" style={{ ...font, color: c.text }}>Same as Mailing Address</span>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-6">
                  <div style={{ opacity: eSameAddr ? 0.5 : 1, pointerEvents: eSameAddr ? "none" : "auto" }}>
                    <StyledSelect<Country>
                      value={(COUNTRIES as readonly string[]).includes(eSameAddr ? eCountry : eMCountry) ? ((eSameAddr ? eCountry : eMCountry) as Country) : "United States of America"}
                      onChange={v => setEMCountry(v)}
                      options={COUNTRIES}
                      triggerStyle={selectStyle}
                      c={selectC}
                      font={font}
                    />
                  </div>
                  <AddressAutocomplete
                    value={eSameAddr ? eStreet : eMStreet}
                    onChange={setEMStreet}
                    onSelect={a => {
                      setEMStreet(a.street);
                      if (a.city) setEMCity(a.city);
                      if (a.state) setEMState(a.state);
                      if (a.zip) setEMZip(a.zip);
                      if (a.country) setEMCountry(a.country);
                    }}
                    placeholder="Street address"
                    containerStyle={{ width: "100%", opacity: eSameAddr ? 0.5 : 1 }}
                    inputStyle={{ ...inputStyle, width: "100%" }}
                    disabled={eSameAddr}
                    dropdownBg={c.cardBg} dropdownText={c.text} dropdownBorder={c.border}
                  />
                  <div />
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <input value={eSameAddr ? eCity : eMCity} onChange={e => setEMCity(e.target.value)}
                    placeholder="City" style={{ ...inputStyle, opacity: eSameAddr ? 0.5 : 1 }} disabled={eSameAddr} />
                  <div className="flex gap-4">
                    <div style={{ flex: 1, opacity: eSameAddr ? 0.5 : 1, pointerEvents: eSameAddr ? "none" : "auto" }}>
                      <StyledSelect<StateCode>
                        value={(STATES as readonly string[]).includes(eSameAddr ? eState : eMState) ? ((eSameAddr ? eState : eMState) as StateCode) : "IA"}
                        onChange={v => setEMState(v)}
                        options={STATES}
                        triggerStyle={{ ...selectStyle, width: "100%" }}
                        c={selectC}
                        font={font}
                      />
                    </div>
                    <input value={eSameAddr ? eZip : eMZip} onChange={e => setEMZip(e.target.value)}
                      placeholder="ZIP" style={{ ...inputStyle, flex: 1, opacity: eSameAddr ? 0.5 : 1 }} disabled={eSameAddr} />
                  </div>
                  <div />
                </div>
              </div>
            </div>
            </>
              );
            })()}

            {/* Status | Appt Date */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <label style={labelStyle}>Status:</label>
                {clientLocked ? <LockedInput value={eStatus || "—"} /> : (
                  <div className="relative" onClick={e => e.stopPropagation()}>
                    <button type="button" onClick={() => { setEStatusOpen(o => !o); setEBizTypeOpen(false); }}
                      className="w-full flex items-center justify-between outline-none"
                      style={{ ...inputStyle, cursor: "pointer" }}>
                      <span style={{ color: eStatus ? c.text : c.muted }}>{eStatus || "- Select one"}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${eStatusOpen ? "rotate-180" : ""}`} style={{ color: c.muted }} />
                    </button>
                    {eStatusOpen && (
                      <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-lg overflow-hidden"
                        style={{ background: c.cardBg, border: `1px solid ${c.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                        {["Appointed", "Unappointed"].map(opt => {
                          const active = eStatus === opt;
                          return (
                            <button key={opt} type="button" onClick={() => { setEStatus(opt); setEStatusOpen(false); }}
                              className="w-full text-left px-3 py-2 text-[13px] flex items-center justify-between transition-colors"
                              style={{ ...font, color: active ? "#A614C3" : c.text, background: active ? "rgba(168,85,247,0.08)" : "transparent" }}
                              onMouseEnter={e => { if (!active) e.currentTarget.style.background = c.hoverBg; }}
                              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                              <span>{opt}</span>
                              {active && <svg width="10" height="8" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {eStatus === "Unappointed" ? (
                <div>
                  <label style={labelStyle}>Reason:</label>
                  {clientLocked ? <LockedInput value={eReason || "—"} /> : (
                    <div className="relative" onClick={e => e.stopPropagation()}>
                      <button type="button" onClick={() => { setEReasonOpen(o => !o); setEStatusOpen(false); setEBizTypeOpen(false); }}
                        className="w-full flex items-center justify-between outline-none"
                        style={{ ...inputStyle, cursor: "pointer" }}>
                        <span style={{ color: eReason ? c.text : c.muted }}>{eReason || "Select reason"}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${eReasonOpen ? "rotate-180" : ""}`} style={{ color: c.muted }} />
                      </button>
                      {eReasonOpen && (
                        <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-lg overflow-hidden"
                          style={{ background: c.cardBg, border: `1px solid ${c.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                          {E_REASON_OPTIONS.map(opt => {
                            const active = eReason === opt;
                            return (
                              <button key={opt} type="button" onClick={() => { setEReason(opt); setEReasonOpen(false); }}
                                className="w-full text-left px-3 py-2 text-[13px] flex items-center justify-between transition-colors"
                                style={{ ...font, color: active ? "#A614C3" : c.text, background: active ? "rgba(168,85,247,0.08)" : "transparent" }}
                                onMouseEnter={e => { if (!active) e.currentTarget.style.background = c.hoverBg; }}
                                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                                <span>{opt}</span>
                                {active && <svg width="10" height="8" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label style={labelStyle}>Appt. Date</label>
                  {clientLocked
                    ? <LockedInput value={eApptDate || "—"} />
                    : <DatePicker value={eApptDate} onChange={setEApptDate} inputStyle={inputStyle} c={c} btnGrad={btnGrad} font={font} />}
                </div>
              )}
              <div />
            </div>

            {/* Agency Contact | Email */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div data-edit-error={editErr("contact") ? "true" : undefined}>
                <label style={labelStyle}>Agency Contact:</label>
                <input value={eContact} onChange={e => { setEContact(e.target.value); clearEditErr("contact"); }} style={{ ...inputStyle, ...editErrStyle("contact") }} />
                <EditErrLine k="contact" />
              </div>
              <div data-edit-error={editErr("email") ? "true" : undefined}>
                <label style={labelStyle}>Email Address:{pendingTag(["contactEmail"])}</label>
                <input value={eEmail} onChange={e => { setEEmail(e.target.value); clearEditErr("email"); }} style={{ ...inputStyle, ...editErrStyle("email") }} type="email" />
                <EditErrLine k="email" />
              </div>
            </div>

            {/* Business Type | Tax ID | Website */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <label style={labelStyle}>Type of Business:</label>
                {clientLocked ? <LockedInput value={eBizType && eBizType !== "-Business Type" ? eBizType : "—"} /> : (
                  <div className="relative" onClick={e => e.stopPropagation()}>
                    <button type="button" onClick={() => { setEBizTypeOpen(o => !o); setEStatusOpen(false); }}
                      className="w-full flex items-center justify-between outline-none"
                      style={{ ...inputStyle, cursor: "pointer" }}>
                      <span style={{ color: eBizType && eBizType !== "-Business Type" ? c.text : c.muted }}>{eBizType && eBizType !== "-Business Type" ? eBizType : "-Business Type"}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${eBizTypeOpen ? "rotate-180" : ""}`} style={{ color: c.muted }} />
                    </button>
                    {eBizTypeOpen && (
                      <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-lg overflow-hidden"
                        style={{ background: c.cardBg, border: `1px solid ${c.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                        {["Corporation","Joint Venture","Limited Liability Company","Limited Partnership","Partnership","Sole Proprietorship or individual","Sole Proprietorship"].map(opt => {
                          const active = eBizType === opt;
                          return (
                            <button key={opt} type="button" onClick={() => { setEBizType(opt); setEBizTypeOpen(false); }}
                              className="w-full text-left px-3 py-2 text-[13px] flex items-center justify-between transition-colors"
                              style={{ ...font, color: active ? "#A614C3" : c.text, background: active ? "rgba(168,85,247,0.08)" : "transparent" }}
                              onMouseEnter={e => { if (!active) e.currentTarget.style.background = c.hoverBg; }}
                              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                              <span>{opt}</span>
                              {active && <svg width="10" height="8" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label style={labelStyle}>Tax ID:</label>
                {clientLocked
                  ? <LockedInput value={eTaxId || "—"} />
                  : <input value={eTaxId} onChange={e => setETaxId(e.target.value)} style={inputStyle} />}
              </div>
              <div>
                <label style={labelStyle}>Website Url:</label>
                {clientLocked
                  ? <LockedInput value={eWebsite || "—"} />
                  : <input value={eWebsite} onChange={e => setEWebsite(e.target.value)} style={inputStyle} />}
              </div>
            </div>

            {/* Phone | Toll Free */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div data-edit-error={editErr("phone") ? "true" : undefined}>
                <label style={labelStyle}>Phone Number:{pendingTag(["phone"])}</label>
                <input value={ePhone} onChange={e => { setEPhone(formatPhone(e.target.value)); clearEditErr("phone"); }} placeholder="(000) 000-0000" style={{ ...inputStyle, ...editErrStyle("phone") }} inputMode="tel" />
                <EditErrLine k="phone" />
              </div>
              <div data-edit-error={editErr("tollFree") ? "true" : undefined}>
                <label style={labelStyle}>Toll Free Number:</label>
                {clientLocked
                  ? <LockedInput value={eTollFree || "—"} />
                  : (<>
                      <input value={eTollFree} onChange={e => { setETollFree(formatPhone(e.target.value)); clearEditErr("tollFree"); }} placeholder="(000) 000-0000" style={{ ...inputStyle, ...editErrStyle("tollFree") }} inputMode="tel" />
                      <EditErrLine k="tollFree" />
                    </>)}
              </div>
              <div />
            </div>

            {/* License */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div data-edit-error={editErr("licNo") ? "true" : undefined}>
                <label style={labelStyle}>License Number:{pendingTag(["licenseNo"])}</label>
                {clientLocked
                  ? <LockedInput value={eLicNo || "—"} />
                  : (<>
                      <input value={eLicNo} onChange={e => { setELicNo(e.target.value); clearEditErr("licNo"); }} style={{ ...inputStyle, ...editErrStyle("licNo") }} />
                      <EditErrLine k="licNo" />
                    </>)}
              </div>
              <div data-edit-error={editErr("licExp") ? "true" : undefined}>
                <label style={labelStyle}>Expiration Date:{pendingTag(["licenseExp"])}</label>
                {clientLocked
                  ? <LockedInput value={eLicExp || "—"} />
                  : (<>
                      <DatePicker value={eLicExp} onChange={v => { setELicExp(v); clearEditErr("licExp"); }} inputStyle={{ ...inputStyle, ...editErrStyle("licExp") }} c={c} btnGrad={btnGrad} font={font} />
                      <EditErrLine k="licExp" />
                    </>)}
              </div>
              <div>
                <label style={labelStyle}>NPN:</label>
                {/* NPN is populated from NIPR on registration (two
                    background calls — license#+state → NPN, then NPN →
                    full detail). No one edits this on the UI, including
                    Shannon's team — treated like Agency Code. Lock it
                    for every viewer, not just clientMode. */}
                <LockedInput value={eNpn || "—"} />
              </div>
            </div>

            {/* E&O */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <label style={labelStyle}>E&O Policy #:</label>
                {clientLocked
                  ? <LockedInput value={eEoNo || "—"} />
                  : <input value={eEoNo} onChange={e => setEEoNo(e.target.value)} style={inputStyle} />}
              </div>
              <div>
                <label style={labelStyle}>Expiration Date:</label>
                {clientLocked
                  ? <LockedInput value={eEoExp || "—"} />
                  : <DatePicker value={eEoExp} onChange={setEEoExp} inputStyle={inputStyle} c={c} btnGrad={btnGrad} font={font} />}
              </div>
              <div />
            </div>

            {/* Affiliations — checkbox grid, wrapped in LockedGroupOverlay for client mode so
                the reader can still see which affiliations are selected but can't edit. */}
            <SectionDivider title="Affiliations" />
            {(() => {
              const grid = (
                <div className="grid grid-cols-4 gap-x-6 gap-y-3">
                  {AFFILIATIONS.map(aff => (
                    <label key={aff} className="flex items-center gap-2.5 cursor-pointer select-none min-w-0" style={{ height: 24 }}>
                      <div className="flex-shrink-0">
                        <Checkbox checked={eAffil.has(aff)} onClick={() => toggleSet(eAffil, aff, setEAffil)} />
                      </div>
                      <span className="text-[12px] truncate" style={{ ...font, color: c.text }} title={aff}>{aff}</span>
                    </label>
                  ))}
                </div>
              );
              return clientLocked ? <LockedGroupOverlay>{grid}</LockedGroupOverlay> : grid;
            })()}

            {/* Direct Appointments */}
            <SectionDivider title="Direct Appointments" />
            <p className="text-[12px] mb-3" style={{ ...font, color: c.muted }}>Workers Compensation</p>
            {(() => {
              const grid = (
                <div className="grid grid-cols-4 gap-x-6 gap-y-3">
                  {WORKERS_COMP.map(w => (
                    <label key={w} className="flex items-center gap-2.5 cursor-pointer select-none min-w-0" style={{ height: 24 }}>
                      <div className="flex-shrink-0">
                        <Checkbox checked={eWC.has(w)} onClick={() => toggleSet(eWC, w, setEWC)} />
                      </div>
                      <span className="text-[12px] truncate" style={{ ...font, color: c.text }} title={w}>{w}</span>
                    </label>
                  ))}
                </div>
              );
              return clientLocked ? <LockedGroupOverlay>{grid}</LockedGroupOverlay> : grid;
            })()}

            {/* Tags */}
            <SectionDivider title="Tags" />
            <p className="text-[12px] mb-3" style={{ ...font, color: c.muted }}>Shown on the Agency Status card. Pick any that apply.</p>
            {(() => {
              const grid = (
                <div className="grid grid-cols-4 gap-x-6 gap-y-3">
                  {AGENCY_BADGES.map(b => {
                    const checked = eBadges.has(b);
                    return (
                      <label key={b} className="flex items-center gap-2.5 cursor-pointer select-none min-w-0" style={{ height: 24 }}>
                        <div className="flex-shrink-0">
                          <Checkbox checked={checked} onClick={() => toggleSet(eBadges, b, setEBadges)} />
                        </div>
                        <span className="inline-flex items-center justify-center rounded-full whitespace-nowrap"
                          style={{ background: checked ? (isDark ? "rgba(168,85,247,0.22)" : "rgba(168,85,247,0.10)") : (isDark ? "rgba(255,255,255,0.04)" : "#F3F4F6"), padding: "3px 10px" }}>
                          {checked ? (
                            <span style={{ backgroundImage: isDark ? "linear-gradient(88.54deg, #A855F7 0.1%, #D946EF 63.88%)" : "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: 11, fontWeight: 600, lineHeight: "16px" }}>{b}</span>
                          ) : (
                            <span style={{ color: c.muted, fontSize: 11, fontWeight: 600, lineHeight: "16px" }}>{b}</span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
              );
              return clientLocked ? <LockedGroupOverlay>{grid}</LockedGroupOverlay> : grid;
            })()}

            {/* Footer buttons — inside the card so they share width and don't float independently */}
            <div className="flex items-center justify-between" style={{ marginTop: 36, paddingTop: 28, paddingBottom: 8, borderTop: `1px solid ${c.border}` }}>
              <button onClick={() => { setIsEditing(false); setFieldErrors({}); }}
                className="px-6 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
                style={{ ...font, border: `1px solid ${c.borderStrong}`, color: c.text, background: "transparent" }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                Cancel
              </button>
              <button onClick={() => {
                  const errs = runEditValidation();
                  if (Object.keys(errs).length > 0) {
                    setFieldErrors(errs);
                    // Scroll the first error into view + focus so the
                    // user doesn't have to hunt for what's wrong.
                    setTimeout(() => {
                      const el = document.querySelector<HTMLElement>('[data-edit-error="true"]');
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth", block: "center" });
                        (el.querySelector("input, textarea, select, button") as HTMLElement | null)?.focus?.();
                      }
                    }, 0);
                    return;
                  }
                  setFieldErrors({});
                  // Doc-refresh gate. Per Shannon (Accounting), final call:
                  // any address change requires a fresh W-9 — physical,
                  // mailing, or both. Simpler than the earlier
                  // "effective mailing only" rule, and matches what she
                  // asked for: "to make it easier, we should just require
                  // a W-9 on all address changes."
                  const physChanged = (
                    eStreet !== agency.street
                    || eCity !== agency.city
                    || eState !== agency.state
                    || eZip !== agency.zip
                  );
                  const mailingChanged = !eSameAddr && (
                    eMStreet !== "" || eMCity !== "" || eMState !== "" || eMZip !== ""
                  );
                  const addressChanged = physChanged || mailingChanged;
                  const w9Changed = (
                    eName !== agency.name
                    || eType !== agency.agencyType
                    || eTaxId !== agency.taxId
                    || addressChanged
                  );
                  const licChanged = eLicNo !== agency.licenseNo;
                  if (w9Changed || licChanged) {
                    setDocModalUploads({});
                    setDocUpdateModal({ w9: w9Changed, license: licChanged });
                    return;
                  }
                  setBadgesOverride(Array.from(eBadges));
                  setAffilOverride(Array.from(eAffil));
                  setWcOverride(Array.from(eWC));
                  // Persist ITC-diffed field edits so the Accounting → ITC
                  // Record view sees them as pending updates the super admin
                  // can review and push.
                  setAgencyFieldOverride({
                    name: eName, street: eStreet, city: eCity, state: eState, zip: eZip,
                    phone: ePhone, contactEmail: eEmail, licenseNo: eLicNo, licenseExp: eLicExp,
                  });
                  setIsEditing(false);
                  if (clientLocked) {
                    // Principal (external admin) submitted their editable-tier changes.
                    // Toast is neutral — the diff also lights up the ITC Record via
                    // the pending-updates alert on the internal super-admin view,
                    // which everyone can see.
                    showToast({
                      title: "Changes submitted for review",
                      description: "We'll review your edits and update the agency record shortly.",
                    }, 5000);
                  } else {
                    // Internal staff editing agency info — remind them that even
                    // internal edits still need Accounting to sign off before they
                    // push to ITC. Toast names the team explicitly for internal
                    // workflow transparency.
                    showToast({
                      title: "Sent to Accounting for review",
                      description: "They'll review and push to ITC.",
                    }, 5000);
                  }
                }}
                className="text-[13px] font-semibold text-white transition-all"
                style={{ ...font, background: btnGrad, padding:"10px 24px", borderRadius:"5.58px" }}
                onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.10)")}
                onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
                Save Changes
              </button>
            </div>
          </div>
          </div>
          </>
        )}

        {/* ── Documents tab ── */}
        {detailTab === "documents" && (() => {
          const docsByCat = (cat: AgencyDocCategory) => agencyDocs.filter(d => d.category === cat && !d.trashed);
          const archivedDocs = agencyDocs.filter(d => d.archived && !d.trashed);
          const trashedDocs  = agencyDocs.filter(d => d.trashed);
          const archivedCount = archivedDocs.length;
          const trashedCount  = trashedDocs.length;
          const CAT_LABEL: Record<AgencyDocCategory, string> = { bor: "Broker of Record", w9: "W-9", license: "License", agreement: "Agreements", other: "Other", eo: "E&O Certificate" };
          const parseDate = (s: string) => { const t = Date.parse(s); return isNaN(t) ? 0 : t; };
          const baseDocs: AgencyDoc[] = showDocTrashed
            ? trashedDocs
            : showDocArchived
              ? archivedDocs
              : agencyDocs.filter(d => !d.trashed && !d.archived);
          // Shared category set across internal + client views so both surfaces
          // expose the same 6 categories (Broker of Record / W-9 / License /
          // Agreements / E&O Certificate / Other). The earlier internal-only
          // hide of W-9 + Other has been retired.
          const HIDDEN_AGENCY_DOC_CATEGORIES = new Set<AgencyDocCategory>();
          // Category list for pickers (Filter, By Type filter, Upload modal) and
          // the By Type section ORDER.
          const DOC_CATEGORY_LIST: AgencyDocCategory[] = ["bor","w9","license","agreement","eo","other"];
          const visibleDocs = baseDocs
            .filter(d => !HIDDEN_AGENCY_DOC_CATEGORIES.has(d.category))
            .filter(d => docFilterCats.size === 0 || docFilterCats.has(d.category))
            .filter(d => !docSearch || d.name.toLowerCase().includes(docSearch.toLowerCase()) || CAT_LABEL[d.category].toLowerCase().includes(docSearch.toLowerCase()))
            .sort((a, b) => {
              const dir = docSortDir === "desc" ? -1 : 1;
              if (docSortKey === "name")     return dir * a.name.localeCompare(b.name);
              if (docSortKey === "category") return dir * CAT_LABEL[a.category].localeCompare(CAT_LABEL[b.category]);
              return dir * (parseDate(a.date) - parseDate(b.date));
            });
          // Mock E&O record — read-only per agreement clause.
          const eoExpiry = agency.eoExp || "Mar 1, 2027";
          const isAdmin = currentUserIsAdmin;
          const handleUpload = (cat: AgencyDocCategory) => {
            // Demo: add a mock row for the new upload. Old W-9 auto-archives.
            const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
            const fileName = cat === "bor" ? `BOR-${Date.now()}.pdf`
              : cat === "w9" ? `W9-${new Date().getFullYear()}.pdf`
              : cat === "license" ? `${agency.state || "NY"}-License-Updated.pdf`
              : `Agreement-${Date.now()}.pdf`;
            setAgencyDocs(prev => {
              if (cat === "w9") {
                // Archive previous current W-9, add new one as current.
                return [
                  { id: `d${Date.now()}`, category: "w9", name: fileName, date: today },
                  ...prev.map(d => d.category === "w9" && !d.archived ? { ...d, archived: true } : d),
                ];
              }
              return [{ id: `d${Date.now()}`, category: cat, name: fileName, date: today }, ...prev];
            });
            showToast({ title: "Document uploaded", description: `${fileName} added to ${cat === "bor" ? "Broker of Record" : cat === "w9" ? "W-9" : cat === "license" ? "License" : "Agreements"}.` });
          };
          const archiveDoc = (id: string) => {
            setAgencyDocs(prev => prev.map(d => d.id === id ? { ...d, archived: true } : d));
          };
          const unarchiveDoc = (id: string) => {
            setAgencyDocs(prev => prev.map(d => d.id === id ? { ...d, archived: false } : d));
          };
          const removeDoc = (id: string) => {
            setAgencyDocs(prev => prev.map(d => d.id === id ? { ...d, trashed: true } : d));
          };
          const restoreDoc = (id: string) => {
            setAgencyDocs(prev => prev.map(d => d.id === id ? { ...d, trashed: false } : d));
          };
          const purgeDoc = (id: string) => {
            setAgencyDocs(prev => prev.filter(d => d.id !== id));
          };
          const requestArchive = (d: AgencyDoc) => setDocConfirm({
            title: "Archive document?",
            body: <>Archive <strong style={{ color: c.text }}>{d.name}</strong>? It will be moved to the Archive tab and can be restored later.</>,
            confirmLabel: "Archive",
            danger: false,
            icon: "archive",
            onConfirm: () => {
              archiveDoc(d.id);
              showToast({ title: "Document archived", description: `${d.name} moved to archive.`, action: { label: "Undo", onClick: () => unarchiveDoc(d.id) } });
            },
          });
          const requestTrash = (d: AgencyDoc) => setDocConfirm({
            title: "Move to Trash?",
            body: <>Move <strong style={{ color: c.text }}>{d.name}</strong> to Trash? You can restore it from the Trash tab.</>,
            confirmLabel: "Move to Trash",
            danger: true,
            icon: "trash",
            onConfirm: () => {
              removeDoc(d.id);
              showToast({ title: "Document moved to Trash", description: `${d.name} sent to Trash.`, action: { label: "Undo", onClick: () => restoreDoc(d.id) } });
            },
          });
          const requestPurge = (d: AgencyDoc) => setDocConfirm({
            title: "Delete permanently?",
            body: <><strong style={{ color: c.text }}>{d.name}</strong> will be permanently deleted. This action <strong style={{ color: c.text }}>cannot be undone</strong>.</>,
            confirmLabel: "Delete forever",
            danger: true,
            icon: "trash",
            onConfirm: () => {
              purgeDoc(d.id);
              showToast({ title: "Document deleted", description: `${d.name} permanently deleted.` });
            },
          });
          const handleUnarchive = (d: AgencyDoc) => {
            unarchiveDoc(d.id);
            showToast({ title: "Document unarchived", description: `${d.name} restored to active.`, action: { label: "Undo", onClick: () => archiveDoc(d.id) } });
          };
          const handleRestore = (d: AgencyDoc) => {
            restoreDoc(d.id);
            showToast({ title: "Document restored", description: `${d.name} restored.`, action: { label: "Undo", onClick: () => removeDoc(d.id) } });
          };

          // Selectable file icon: when select mode is OFF → static FileText icon.
          // When select mode is ON → empty/filled checkbox toggle. Triggered from the toolbar CheckSquare button.
          const SelectableFileIcon = ({ id, size = "w-4 h-4" }: { id: string; size?: string }) => {
            const checked = selectedDocIds.has(id);
            if (!isDocSelectMode) {
              return <FileText className={`${size} flex-shrink-0`} style={{ color: c.muted }} />;
            }
            return (
              <button
                type="button"
                title={checked ? "Deselect" : "Select"}
                onClick={(e) => { e.stopPropagation(); toggleDocSelected(id); }}
                className={`relative flex items-center justify-center flex-shrink-0 rounded transition-colors ${size}`}
                style={{ background: "transparent", padding: 0 }}>
                {checked ? (
                  <span className={`${size} inline-flex items-center justify-center rounded`}
                    style={{ background: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)" }}>
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                ) : (
                  <span className={`${size} inline-flex items-center justify-center rounded`}
                    style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }} />
                )}
              </button>
            );
          };

          // Reusable section component
          const Section = ({ category, title, count, hint }: { category: AgencyDocCategory; title: string; count: string; hint?: string }) => (
            <div className="rounded-xl mb-4" style={{ border: `1px solid ${c.border}`, background: c.cardBg }}>
              <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: `1px solid ${c.border}` }}>
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" style={{ color: "#A855F7" }} />
                  <span className="text-[13px] font-bold" style={{ ...font, color: c.text }}>{title}</span>
                  <span className="text-[12px]" style={{ ...font, color: c.muted }}>({count})</span>
                </div>
                {isAdmin && (
                  <button onClick={() => handleUpload(category)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-semibold transition-colors"
                    style={{ ...font, color: isDark ? "#C87BE0" : "#A614C3", background: isDark ? "rgba(168,85,247,0.20)" : "rgba(168,85,247,0.08)", border: `1px solid ${isDark ? "rgba(168,85,247,0.35)" : "rgba(168,85,247,0.20)"}` }}
                    onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(168,85,247,0.28)" : "rgba(168,85,247,0.14)")}
                    onMouseLeave={e => (e.currentTarget.style.background = isDark ? "rgba(168,85,247,0.20)" : "rgba(168,85,247,0.08)")}>
                    <Upload className="w-3 h-3" />Upload
                  </button>
                )}
              </div>
              {docsByCat(category).length === 0 ? (
                <div className="px-5 py-6 text-center text-[12px]" style={{ ...font, color: c.muted }}>
                  No documents yet. {isAdmin && "Click Upload to add one."}
                </div>
              ) : (
                <div>
                  {docsByCat(category).map((d, idx, arr) => (
                    <div key={d.id} className="flex items-center gap-3 px-5 py-2.5"
                      style={{ borderBottom: idx !== arr.length - 1 ? `1px solid ${c.border}` : "none" }}>
                      <SelectableFileIcon id={d.id} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] truncate" style={{ ...font, color: c.text }}>{d.name}</span>
                        </div>
                        <div className="text-[11px]" style={{ ...font, color: c.muted }}>{d.date}</div>
                      </div>
                      <button title="View" onClick={() => setPreviewDoc(d)} className="p-1.5 rounded transition-colors"
                        style={{ color: previewDoc?.id === d.id ? "#A855F7" : c.muted, background: previewDoc?.id === d.id ? "rgba(168,85,247,0.10)" : "transparent" }}
                        onMouseEnter={e => { if (previewDoc?.id !== d.id) { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; } }}
                        onMouseLeave={e => { if (previewDoc?.id !== d.id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; } }}>
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button title="Download" className="p-1.5 rounded transition-colors"
                        style={{ color: c.muted }}
                        onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      {isAdmin && !d.archived && (
                        <button title="Archive" onClick={() => requestArchive(d)}
                          className="p-1.5 rounded transition-colors"
                          style={{ color: c.muted }}
                          onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {isAdmin && (
                        <button title="Delete" onClick={() => requestTrash(d)}
                          className="p-1.5 rounded transition-colors"
                          style={{ color: c.muted }}
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#EF4444"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {hint && (
                <div className="px-5 py-2.5 text-[11px] flex items-start gap-1.5" style={{ ...font, color: c.muted, borderTop: `1px solid ${c.border}` }}>
                  <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  <span>{hint}</span>
                </div>
              )}
            </div>
          );

          // Row used by All / Archive / Trash flat-list views.
          const FlatRow = ({ d }: { d: AgencyDoc }) => (
            <div className="flex items-center gap-3 px-5 py-2.5"
              style={{ borderBottom: `1px solid ${c.border}` }}>
              <SelectableFileIcon id={d.id} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] truncate" style={{ ...font, color: c.text }}>{d.name}</span>
                  <span className="flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ ...font, color: isDark ? "#C87BE0" : "#A614C3", background: isDark ? "rgba(168,85,247,0.22)" : "rgba(168,85,247,0.10)" }}>{CAT_LABEL[d.category]}</span>
                  {d.archived && !d.trashed && (
                    <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ ...font, color: c.muted, background: c.hoverBg, letterSpacing: "0.04em" }}>{d.category === "w9" ? "Replaced" : "Archived"}</span>
                  )}
                </div>
                <div className="text-[11px]" style={{ ...font, color: c.muted }}>{d.date}</div>
              </div>
              {/* Action cluster — tight gap so the icons read as one group, not four floating ones. */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {!d.trashed && (
                  <>
                    <button title="View" onClick={() => setPreviewDoc(d)} className="p-1.5 rounded transition-colors"
                      style={{ color: previewDoc?.id === d.id ? "#A855F7" : c.muted, background: previewDoc?.id === d.id ? "rgba(168,85,247,0.10)" : "transparent" }}
                      onMouseEnter={e => { if (previewDoc?.id !== d.id) { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; } }}
                      onMouseLeave={e => { if (previewDoc?.id !== d.id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; } }}>
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button title="Download" className="p-1.5 rounded transition-colors" style={{ color: c.muted }}
                      onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
                {isAdmin && d.trashed && (
                  <>
                    <button title="Restore" onClick={() => handleRestore(d)}
                      className="p-1.5 rounded transition-colors" style={{ color: c.muted }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(115,201,183,0.10)"; e.currentTarget.style.color = "#73C9B7"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button title="Delete permanently" onClick={() => requestPurge(d)}
                      className="p-1.5 rounded transition-colors" style={{ color: c.muted }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.10)"; e.currentTarget.style.color = "#EF4444"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
                {isAdmin && d.archived && !d.trashed && (
                  <button title="Unarchive" onClick={() => handleUnarchive(d)}
                    className="p-1.5 rounded transition-colors" style={{ color: c.muted }}
                    onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                )}
                {isAdmin && !d.archived && !d.trashed && (
                  <button title="Archive" onClick={() => requestArchive(d)}
                    className="p-1.5 rounded transition-colors" style={{ color: c.muted }}
                    onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                )}
                {isAdmin && !d.trashed && (
                  <button title="Move to Trash" onClick={() => requestTrash(d)}
                    className="p-1.5 rounded transition-colors" style={{ color: c.muted }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#EF4444"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );

          return (
            <div className="flex gap-4 pb-4" onClick={() => { setDocFilterOpen(false); setDocSortOpen(false); setDocUploadOpen(false); setDocByTypeFilterOpen(false); }}>
            {/* Left panel */}
            <div className="flex flex-col min-h-0 transition-all"
              style={{ flex: previewDoc && !previewExpanded ? "0 0 38%" : "1 1 100%", minWidth: 0 }}>
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-3 flex-shrink-0 min-w-0">
                {(() => { const previewOpen = !!previewDoc && !previewExpanded; return (
                <div className="flex items-center gap-0.5 min-w-0">
                  {([["all","All Documents",List],["byType","By Type",LayoutGrid],["table","Table",Table2]] as [typeof docView, string, ({className}:{className?:string})=>React.ReactElement][]).map(([v, label, Icon]) => {
                    const isActive = docView === v && !showDocArchived && !showDocTrashed;
                    // "By Type" doubles as a category picker — clicking it switches to that view AND opens the dropdown.
                    if (v === "byType") {
                      const selectedLabels = Array.from(docFilterCats).map(k => CAT_LABEL[k]);
                      const filterLabel = selectedLabels.length === 0
                        ? "By Type"
                        : selectedLabels.length === 1
                          ? selectedLabels[0]
                          : `${selectedLabels.length} categories`;
                      return (
                        <div key={v} className="relative" onClick={e => e.stopPropagation()}>
                          <button title={label}
                            onClick={() => {
                              if (!isActive) { setDocView("byType"); setShowDocArchived(false); setShowDocTrashed(false); }
                              setDocByTypeFilterOpen(o => !o);
                            }}
                            className={`flex items-center ${previewOpen ? "px-1.5" : "gap-1.5 px-3"} py-1.5 rounded-md text-[12px] font-medium transition-all whitespace-nowrap`}
                            style={{ fontFamily: FONT, background: isActive ? (isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6") : "transparent", color: isActive ? c.text : c.muted }}>
                            <Icon className="w-3 h-3" />
                            {!previewOpen && filterLabel}
                            {!previewOpen && <ChevronDown className={`w-3 h-3 transition-transform ${docByTypeFilterOpen ? "rotate-180" : ""}`} />}
                          </button>
                          {docByTypeFilterOpen && (
                            <div className="absolute left-0 top-full mt-1 z-30 rounded-lg overflow-hidden min-w-[220px]"
                              style={{ background: c.cardBg, border: `1px solid ${c.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                              {/* "All Categories" clears the multi-select. */}
                              <button onClick={() => { setDocFilterCats(new Set()); }}
                                className="w-full flex items-center justify-between px-3 py-2 text-[12px] text-left transition-colors"
                                style={{ fontFamily: FONT, color: docFilterCats.size === 0 ? "#A614C3" : c.text, background: docFilterCats.size === 0 ? "rgba(168,85,247,0.08)" : "transparent" }}
                                onMouseEnter={e => { if (docFilterCats.size > 0) e.currentTarget.style.background = c.hoverBg; }}
                                onMouseLeave={e => { if (docFilterCats.size > 0) e.currentTarget.style.background = "transparent"; }}>
                                <span className="flex items-center gap-2"><FolderOpen className="w-3.5 h-3.5" style={{ color: "#A855F7" }} />All Categories</span>
                                {docFilterCats.size === 0 && <svg width="10" height="8" viewBox="0 0 9 7" fill="none" className="flex-shrink-0"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                              </button>
                              <div style={{ height: 1, background: c.border }} />
                              {DOC_CATEGORY_LIST.map(t => {
                                const checked = docFilterCats.has(t);
                                return (
                                  <button key={t} onClick={() => toggleDocFilterCat(t)}
                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[12px] text-left transition-colors"
                                    style={{ fontFamily: FONT, color: c.text }}
                                    onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                                    <span className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0"
                                      style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>
                                      {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                    </span>
                                    <FolderOpen className="w-3.5 h-3.5" style={{ color: "#A855F7" }} />
                                    <span>{CAT_LABEL[t]}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    }
                    return (
                      <button key={v} title={label} onClick={e => { e.stopPropagation(); setDocView(v); setShowDocArchived(false); setShowDocTrashed(false); }}
                        className={`flex items-center ${previewOpen ? "px-1.5" : "gap-1.5 px-3"} py-1.5 rounded-md text-[12px] font-medium transition-all whitespace-nowrap`}
                        style={{ fontFamily: FONT, background: isActive ? (isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6") : "transparent", color: isActive ? c.text : c.muted }}>
                        <Icon className="w-3 h-3" />{!previewOpen && label}
                      </button>
                    );
                  })}
                  <div className="mx-1.5" style={{ width:1, height:16, background:c.border }} />
                  <button title="Archive" onClick={e => { e.stopPropagation(); setShowDocArchived(true); setShowDocTrashed(false); }}
                    className={`flex items-center ${previewOpen ? "px-1.5" : "gap-1.5 px-2.5"} py-1.5 rounded-md text-[12px] font-medium transition-all`}
                    style={{ fontFamily: FONT, background: showDocArchived ? "rgba(245,158,11,0.10)" : "transparent", color: showDocArchived ? "#F59E0B" : c.muted }}>
                    <Archive className="w-3 h-3" />{!previewOpen && "Archive"}
                    {!previewOpen && archivedCount > 0 && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: showDocArchived ? "rgba(245,158,11,0.25)" : (isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6"), color: showDocArchived ? "#F59E0B" : c.muted }}>{archivedCount}</span>}
                  </button>
                  <button title="Trash" onClick={e => { e.stopPropagation(); setShowDocTrashed(true); setShowDocArchived(false); }}
                    className={`flex items-center ${previewOpen ? "px-1.5" : "gap-1.5 px-2.5"} py-1.5 rounded-md text-[12px] font-medium transition-all`}
                    style={{ fontFamily: FONT, background: showDocTrashed ? "rgba(239,68,68,0.10)" : "transparent", color: showDocTrashed ? "#EF4444" : c.muted }}>
                    <Trash2 className="w-3 h-3" />{!previewOpen && "Trash"}
                    {!previewOpen && trashedCount > 0 && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: showDocTrashed ? "rgba(239,68,68,0.20)" : (isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6"), color: showDocTrashed ? "#EF4444" : c.muted }}>{trashedCount}</span>}
                  </button>
                </div>
                ); })()}
                <div className="flex items-center gap-1">
                  {/* Filter */}
                  <div className="relative" onClick={e => e.stopPropagation()}>
                    <button onClick={() => { setDocFilterOpen(p => !p); setDocSortOpen(false); setDocUploadOpen(false); }}
                      className="p-1.5 rounded-md transition-all"
                      style={{ color: docFilterCats.size > 0 ? "#A855F7" : c.muted, background: docFilterCats.size > 0 ? "rgba(168,85,247,0.10)" : "transparent" }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M1 3h14v1.5L9.5 10v5l-3-1.5V10L1 4.5V3z"/></svg>
                    </button>
                    {docFilterOpen && (
                      <div className="absolute right-0 top-8 z-30 w-52 rounded-xl shadow-xl py-1.5" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                        <p className="text-[10px] font-semibold uppercase tracking-wide px-3 py-1.5" style={{ fontFamily: FONT, color: c.muted }}>Filter by Category</p>
                        <button onClick={() => setDocFilterCats(new Set())}
                          className="w-full text-left px-3 py-1.5 text-[12px] flex items-center justify-between transition-colors"
                          style={{ fontFamily: FONT, color: docFilterCats.size === 0 ? "#A614C3" : c.text, background: docFilterCats.size === 0 ? "rgba(168,85,247,0.08)" : "transparent" }}>
                          All Categories
                          {docFilterCats.size === 0 && <svg width="10" height="8" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </button>
                        {DOC_CATEGORY_LIST.map(t => {
                          const checked = docFilterCats.has(t);
                          return (
                            <button key={t} onClick={() => toggleDocFilterCat(t)}
                              className="w-full text-left px-3 py-1.5 text-[12px] flex items-center gap-2.5 transition-colors"
                              style={{ fontFamily: FONT, color: c.text }}
                              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                              <span className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0"
                                style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>
                                {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                              </span>
                              <span>{CAT_LABEL[t]}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {/* Sort */}
                  <div className="relative" onClick={e => e.stopPropagation()}>
                    <button onClick={() => { setDocSortOpen(p => !p); setDocFilterOpen(false); setDocUploadOpen(false); }}
                      className="p-1.5 rounded-md transition-all" style={{ color: c.muted }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M2 4h12v1.5H2V4zm2 3.5h8V9H4V7.5zm2 3.5h4v1.5H6V11z"/></svg>
                    </button>
                    {docSortOpen && (
                      <div className="absolute right-0 top-8 z-30 w-40 rounded-xl shadow-xl overflow-hidden" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                        <p className="text-[10px] font-semibold uppercase tracking-wide px-3 pt-2 pb-1.5" style={{ fontFamily: FONT, color: c.muted }}>Sort by Date</p>
                        {([["desc","Newest first"],["asc","Oldest first"]] as const).map(([d, label]) => (
                          <button key={d} onClick={() => { setDocSortDir(d); setDocSortOpen(false); }}
                            className="w-full text-left px-3 py-2 text-[12px] flex items-center justify-between"
                            style={{ fontFamily: FONT, color: docSortDir === d ? "#A614C3" : c.text, background: docSortDir === d ? "rgba(168,85,247,0.08)" : "transparent" }}>
                            <span>{label}</span>{docSortDir === d && <svg width="10" height="8" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Search */}
                  <div className="flex items-center transition-all overflow-hidden" style={{ width: docSearchOpen ? 160 : 28 }}>
                    <button onClick={e => { e.stopPropagation(); setDocSearchOpen(p => !p); if (docSearchOpen) setDocSearch(""); }}
                      className="p-1.5 rounded-md flex-shrink-0" style={{ color: docSearch ? "#A855F7" : c.muted }}>
                      <Search className="w-3.5 h-3.5" />
                    </button>
                    {docSearchOpen && (
                      <input autoFocus value={docSearch} onChange={e => setDocSearch(e.target.value)}
                        onClick={e => e.stopPropagation()} placeholder="Search documents…"
                        className="outline-none text-[12px] flex-1 min-w-0"
                        style={{ fontFamily: FONT, color: c.text, background: "transparent", borderBottom: `1px solid ${c.border}` }} />
                    )}
                  </div>
                  {/* Select toggle — matches Notes pattern */}
                  <button title={isDocSelectMode ? "Exit selection" : "Select documents"}
                    onClick={e => { e.stopPropagation(); setIsDocSelectMode(p => { if (p) clearDocSelection(); return !p; }); }}
                    className="p-1.5 rounded-md transition-all"
                    style={{ color: isDocSelectMode ? "#A855F7" : c.muted, background: isDocSelectMode ? "rgba(168,85,247,0.10)" : "transparent" }}>
                    <CheckSquare className="w-3.5 h-3.5" />
                  </button>
                  {/* Upload — hidden in archive/trash. Available to both internal staff
                      (isAdmin) and client view since agencies submit their own docs here. */}
                  {!showDocArchived && !showDocTrashed && (
                    <button onClick={() => { setDocUploadModalOpen(true); setDocUploadModalFile(null); setDocUploadModalCat(""); }}
                      className="ml-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white transition-all"
                      style={{ background: btnGrad, fontFamily: FONT }}
                      onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.10)")}
                      onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
                      <Upload className="w-3 h-3" />Upload
                    </button>
                  )}
                  {docUploadModalOpen && (() => {
                    const closeModal = () => { setDocUploadModalOpen(false); setDocUploadModalFile(null); setDocUploadModalCat(""); setDocUploadModalCatOpen(false); setDocUploadModalDrag(false); };
                    const onPick = (f?: File | null) => {
                      if (!f) return;
                      if (f.size > 10 * 1024 * 1024) {
                        const mb = (f.size / (1024 * 1024)).toFixed(1);
                        showToast({ title: "File too large", description: `"${f.name}" is ${mb}MB. Max 10MB.` }, 5000);
                        return;
                      }
                      setDocUploadModalFile(f.name);
                    };
                    const canUpload = !!docUploadModalFile && !!docUploadModalCat;
                    return (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
                        style={{ background: "rgba(0,0,0,0.45)" }}
                        onClick={closeModal}>
                        <div className="rounded-2xl flex flex-col"
                          style={{ background: c.cardBg, border: `1px solid ${c.border}`, width: "min(480px, 92vw)", boxShadow: "0 20px 50px rgba(0,0,0,0.20)", fontFamily: FONT }}
                          onClick={e => { e.stopPropagation(); setDocUploadModalCatOpen(false); }}>
                          <div className="px-6 pt-5 pb-4">
                            <h3 className="text-[16px] font-bold mb-1" style={{ color: c.text }}>Upload document</h3>
                            <p className="text-[13px]" style={{ color: c.muted }}>Drop a file and pick its category to add it to this agency&apos;s documents.</p>
                          </div>
                          <div className="px-6 pb-4 flex flex-col gap-3">
                            {/* Drag-and-drop zone */}
                            {docUploadModalFile ? (
                                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
                                  style={{ background: "rgba(115,201,183,0.10)", border: "1px solid rgba(115,201,183,0.35)" }}>
                                  <CheckSquare className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#73C9B7" }} />
                                  <input value={docUploadModalFile}
                                    onChange={e => setDocUploadModalFile(e.target.value)}
                                    className="text-[12px] flex-1 outline-none bg-transparent min-w-0"
                                    style={{ color: c.text, fontFamily: FONT }}
                                    spellCheck={false}
                                    title="Rename before uploading" />
                                  <button onClick={() => setDocUploadModalFile(null)}
                                    className="text-[11px] font-medium transition-opacity hover:opacity-70 flex-shrink-0"
                                    style={{ color: c.muted }}>Replace</button>
                                </div>
                              ) : (
                              <label className="flex flex-col items-center justify-center cursor-pointer transition-colors rounded-lg py-6"
                                style={{ background: docUploadModalDrag ? "rgba(168,85,247,0.08)" : c.hoverBg, border: `1.5px dashed ${docUploadModalDrag ? "#A614C3" : c.borderStrong}` }}
                                onDragOver={e => { e.preventDefault(); setDocUploadModalDrag(true); }}
                                onDragLeave={() => setDocUploadModalDrag(false)}
                                onDrop={e => { e.preventDefault(); setDocUploadModalDrag(false); onPick(e.dataTransfer.files?.[0]); }}>
                                <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={e => onPick(e.target.files?.[0])} />
                                <Paperclip className="w-5 h-5 mb-1.5" style={{ color: "#A614C3" }} />
                                <span className="text-[12px] font-medium" style={{ color: c.text }}>Drag &amp; Drop or Click to Browse</span>
                                <span className="text-[11px] mt-0.5" style={{ color: c.muted }}>PDF, JPG, PNG · Max 10MB</span>
                              </label>
                            )}
                            {/* Category picker */}
                            <div>
                              <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: c.muted, letterSpacing: "0.06em" }}>Category</label>
                              <div className="relative" onClick={e => e.stopPropagation()}>
                                <button type="button" onClick={() => setDocUploadModalCatOpen(o => !o)}
                                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] outline-none transition-colors"
                                  style={{ background: c.cardBg, border: `1px solid ${docUploadModalCatOpen ? "#A614C3" : c.border}`, color: docUploadModalCat ? c.text : c.muted, cursor: "pointer" }}>
                                  <span className="truncate">{docUploadModalCat ? CAT_LABEL[docUploadModalCat as AgencyDocCategory] : "Select a category…"}</span>
                                  <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${docUploadModalCatOpen ? "rotate-180" : ""}`} style={{ color: c.muted }} />
                                </button>
                                {docUploadModalCatOpen && (
                                  <div className="absolute left-0 right-0 top-full mt-1 z-30 rounded-lg overflow-hidden"
                                    style={{ background: c.cardBg, border: `1px solid ${c.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                                    {DOC_CATEGORY_LIST.map(cat => {
                                      const active = docUploadModalCat === cat;
                                      return (
                                        <button key={cat} type="button"
                                          onClick={() => { setDocUploadModalCat(cat); setDocUploadModalCatOpen(false); }}
                                          className="w-full flex items-center justify-between px-3 py-2 text-[13px] text-left transition-colors"
                                          style={{ color: active ? "#A614C3" : c.text, background: active ? "rgba(168,85,247,0.08)" : "transparent" }}
                                          onMouseEnter={e => { if (!active) e.currentTarget.style.background = c.hoverBg; }}
                                          onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                                          <span className="flex items-center gap-2"><FolderOpen className="w-3.5 h-3.5" style={{ color: "#A855F7" }} />{CAT_LABEL[cat]}</span>
                                          {active && <svg width="10" height="8" viewBox="0 0 9 7" fill="none" className="flex-shrink-0"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="px-6 py-3 flex items-center justify-between gap-2" style={{ borderTop: `1px solid ${c.border}` }}>
                            <button onClick={closeModal}
                              className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
                              style={{ border: `1px solid ${c.border}`, color: c.text, background: c.cardBg }}>
                              Cancel
                            </button>
                            <button disabled={!canUpload}
                              onClick={() => {
                                if (!canUpload) return;
                                const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                                setAgencyDocs(prev => {
                                  if (docUploadModalCat === "w9") {
                                    return [
                                      { id: `d${Date.now()}`, category: "w9", name: docUploadModalFile!, date: today },
                                      ...prev.map(d => d.category === "w9" && !d.archived ? { ...d, archived: true } : d),
                                    ];
                                  }
                                  return [{ id: `d${Date.now()}`, category: docUploadModalCat as AgencyDocCategory, name: docUploadModalFile!, date: today }, ...prev];
                                });
                                showToast({ title: "Document uploaded", description: `${docUploadModalFile} added to ${CAT_LABEL[docUploadModalCat as AgencyDocCategory]}.` });
                                closeModal();
                              }}
                              className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-all"
                              style={{ background: btnGrad, opacity: canUpload ? 1 : 0.5, cursor: canUpload ? "pointer" : "not-allowed" }}>
                              Upload
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Divider */}
              <div className="flex-shrink-0 mb-3" style={{ height:1, background:c.border }} />

              {/* Bulk-select action bar (shown whenever select mode is on) */}
              {isDocSelectMode && (
                <div className="flex items-center justify-between px-4 py-2 mb-3 rounded-lg flex-shrink-0"
                  style={{ background: isDark ? "rgba(168,85,247,0.12)" : "rgba(168,85,247,0.06)", border: `1px solid ${isDark ? "rgba(168,85,247,0.30)" : "rgba(168,85,247,0.20)"}` }}>
                  <div className="flex items-center gap-2 text-[12px]" style={{ ...font, color: c.text }}>
                    {selectedDocIds.size > 0 ? (
                      <>
                        <span className="inline-flex items-center justify-center rounded"
                          style={{ width: 18, height: 18, background: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)" }}>
                          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                            <path d="M1 3.5L3.5 6L8 1" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                        <span className="font-semibold">{selectedDocIds.size}</span>
                        <span style={{ color: c.muted }}>{selectedDocIds.size === 1 ? "document selected" : "documents selected"}</span>
                      </>
                    ) : (
                      <span style={{ color: c.muted }}>Select documents to download</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {selectedDocIds.size > 0 && (
                      <button onClick={() => {
                          const names = agencyDocs.filter(d => selectedDocIds.has(d.id)).map(d => d.name);
                          showToast({ title: `Downloading ${names.length} ${names.length === 1 ? "document" : "documents"}`, description: names.length <= 3 ? names.join(", ") : `${names.slice(0,2).join(", ")} and ${names.length - 2} more` });
                          clearDocSelection();
                          setIsDocSelectMode(false);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white transition-all"
                        style={{ ...font, background: btnGrad }}
                        onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.10)")}
                        onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
                        <Download className="w-3 h-3" />
                        Download {selectedDocIds.size}
                      </button>
                    )}
                    <button onClick={() => { clearDocSelection(); setIsDocSelectMode(false); }}
                      className="px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-colors"
                      style={{ ...font, color: c.muted, background: "transparent" }}
                      onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div>

                {/* By Type view — grouped by category so each type is visually separated. */}
                {!showDocArchived && !showDocTrashed && docView === "byType" && (() => {
                  // Render order: regular categories → E&O Certificate → Other (catch-all at the end).
                  const ORDER: AgencyDocCategory[] = DOC_CATEGORY_LIST;
                  const renderGroup = (cat: AgencyDocCategory) => {
                    const docs = visibleDocs.filter(d => d.category === cat);
                    if (docs.length === 0) return null;
                    return (
                      <div key={cat} className="rounded-xl overflow-hidden mb-3" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                        <div className="flex items-center gap-2 px-5 py-2.5" style={{ borderBottom: `1px solid ${c.border}`, background: c.hoverBg }}>
                          <FolderOpen className="w-3.5 h-3.5" style={{ color: "#A855F7" }} />
                          <span className="text-[12px] font-semibold" style={{ ...font, color: c.text }}>{CAT_LABEL[cat]}</span>
                          <span className="text-[11px]" style={{ ...font, color: c.muted }}>({docs.length})</span>
                        </div>
                        {docs.map(d => <FlatRow key={d.id} d={d} />)}
                      </div>
                    );
                  };
                  const showEmpty = visibleDocs.length === 0;
                  return (
                  <>
                    {showEmpty && (
                      <div className="rounded-xl overflow-hidden mb-3 px-5 py-10 text-center text-[12px]" style={{ ...font, color: c.muted, background: c.cardBg, border: `1px solid ${c.border}` }}>
                        No documents in this category yet.
                      </div>
                    )}
                    {ORDER.map(renderGroup)}
                  </>
                  );
                })()}

                {/* All / Archive / Trash list view */}
                {(showDocArchived || showDocTrashed || docView === "all") && (
                  <div className="rounded-xl" style={{ border: `1px solid ${c.border}`, background: c.cardBg }}>
                    {visibleDocs.length === 0 ? (
                      <div className="px-5 py-10 text-center text-[12px]" style={{ ...font, color: c.muted }}>
                        {showDocTrashed ? "Trash is empty." : showDocArchived ? "No archived documents." : "No documents match."}
                      </div>
                    ) : (
                      visibleDocs.map(d => <FlatRow key={d.id} d={d} />)
                    )}
                  </div>
                )}

                {/* Table view */}
                {!showDocArchived && !showDocTrashed && docView === "table" && (() => {
                  // Drop the Category column when the preview panel is open — at 38% width
                  // the colored badge wraps and squeezes Name/Date into unreadable widths.
                  // Category is recoverable from the preview itself, Name + Date isn't.
                  const tableCompact = !!previewDoc && !previewExpanded;
                  const sortableKeys = tableCompact ? (["name","date"] as const) : (["name","category","date"] as const);
                  const tableGrid = tableCompact
                    ? "minmax(0,1.6fr) minmax(0,1fr) 130px"
                    : "minmax(0,1.3fr) minmax(0,1fr) minmax(0,1fr) 140px";
                  return (
                  <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${c.border}`, background: c.cardBg }}>
                    <div className="grid items-center px-5 py-2 text-[11px] font-semibold uppercase tracking-wider"
                      style={{ ...font, color: c.muted, background: c.hoverBg, letterSpacing: "0.04em", gridTemplateColumns: tableGrid }}>
                      {sortableKeys.map(k => {
                        const label = k === "name" ? "Name" : k === "category" ? "Category" : "Date";
                        const active = docSortKey === k;
                        const sub = isDark ? "#6B7280" : "#9CA3AF";
                        const upColor   = active && docSortDir === "asc"  ? c.text : sub;
                        const downColor = active && docSortDir === "desc" ? c.text : sub;
                        return (
                          <button key={k}
                            onClick={() => {
                              if (docSortKey === k) setDocSortDir(d => d === "asc" ? "desc" : "asc");
                              else { setDocSortKey(k); setDocSortDir("asc"); }
                            }}
                            className="flex items-center gap-1 select-none cursor-pointer text-[11px] font-semibold uppercase tracking-wider"
                            style={{ ...font, color: active ? c.text : c.muted, letterSpacing: "0.04em", justifyContent: "flex-start" }}>
                            {label}
                            <span className="inline-flex items-center ml-1 flex-shrink-0" style={{ verticalAlign: "middle", gap: 1 }}>
                              <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
                                <path d="M3.5 9V2M3.5 2L1.5 4M3.5 2L5.5 4" stroke={upColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
                                <path d="M3.5 1V8M3.5 8L1.5 6M3.5 8L5.5 6" stroke={downColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </span>
                          </button>
                        );
                      })}
                      <span className="text-right">Actions</span>
                    </div>
                    {visibleDocs.length === 0 ? (
                      <div className="px-5 py-10 text-center text-[12px]" style={{ ...font, color: c.muted }}>No documents match.</div>
                    ) : (
                      visibleDocs.map(d => (
                        <div key={d.id} className="grid items-center px-5 py-2.5 text-[12px]"
                          style={{ ...font, color: c.text, borderTop: `1px solid ${c.border}`, gridTemplateColumns: tableGrid }}>
                          <span className="flex items-center gap-2 min-w-0">
                            <SelectableFileIcon id={d.id} size="w-3.5 h-3.5" />
                            <span className="truncate">{d.name}</span>
                          </span>
                          {!tableCompact && (
                            <span>
                              <span className="inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded"
                                style={{ fontFamily: FONT, color: isDark ? "#C87BE0" : "#A614C3", background: isDark ? "rgba(168,85,247,0.22)" : "rgba(168,85,247,0.10)" }}>
                                {CAT_LABEL[d.category]}
                              </span>
                            </span>
                          )}
                          <span style={{ color: c.muted }}>{d.date}</span>
                          <span className="flex items-center justify-end gap-1">
                            <button title="View" onClick={() => setPreviewDoc(d)} className="p-1.5 rounded transition-colors"
                              style={{ color: previewDoc?.id === d.id ? "#A855F7" : c.muted, background: previewDoc?.id === d.id ? "rgba(168,85,247,0.10)" : "transparent" }}
                              onMouseEnter={e => { if (previewDoc?.id !== d.id) { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; } }}
                              onMouseLeave={e => { if (previewDoc?.id !== d.id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; } }}>
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button title="Download" className="p-1.5 rounded transition-colors" style={{ color: c.muted }}
                              onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            {isAdmin && !d.archived && !d.trashed && (
                              <button title="Archive" onClick={() => requestArchive(d)}
                                className="p-1.5 rounded transition-colors" style={{ color: c.muted }}
                                onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                                <Archive className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {isAdmin && (
                              <button title="Move to Trash" onClick={() => requestTrash(d)}
                                className="p-1.5 rounded transition-colors" style={{ color: c.muted }}
                                onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#EF4444"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  );
                })()}
              </div>
            </div>
            {/* Right panel: doc preview */}
            {previewDoc && !previewExpanded && (
              <div className="flex flex-col flex-1 min-h-0 rounded-2xl overflow-hidden transition-all"
                style={{ background: c.cardBg, border: `1px solid ${c.border}` }}
                onClick={e => e.stopPropagation()}>
                {/* Top bar */}
                <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
                  style={{ borderBottom: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.02)" : "rgba(249,250,251,0.80)" }}>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <FileText className="w-3.5 h-3.5 flex-shrink-0" style={{ color: c.muted }} />
                    <span className="text-[11px] flex-shrink-0" style={{ fontFamily: FONT, color: c.muted }}>Documents</span>
                    <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: c.muted }} />
                    <span className="text-[11px] flex-shrink-0" style={{ fontFamily: FONT, color: c.muted }}>{CAT_LABEL[previewDoc.category]}</span>
                    <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: c.muted }} />
                    <span className="text-[11px] font-medium truncate" style={{ fontFamily: FONT, color: c.text }}>{previewDoc.name}</span>
                  </div>
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <button title="Download" className="p-1.5 rounded-md transition-colors" style={{ color: c.muted }}
                      onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button title="Expand" onClick={() => setPreviewExpanded(true)} className="p-1.5 rounded-md transition-colors" style={{ color: c.muted }}
                      onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                    <button title="Close" onClick={() => setPreviewDoc(null)} className="p-1.5 rounded-md transition-colors" style={{ color: c.muted }}
                      onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {/* Meta strip */}
                <div className="flex items-center gap-4 px-5 py-3 flex-shrink-0 text-[12px]" style={{ ...font, color: c.muted, borderBottom: `1px solid ${c.border}` }}>
                  <span className="flex items-center gap-1.5"><FolderOpen className="w-3.5 h-3.5" style={{ color: "#A855F7" }} />{CAT_LABEL[previewDoc.category]}</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{previewDoc.date}</span>
                  {previewDoc.archived && <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ color: "#F59E0B", background: "rgba(245,158,11,0.10)", letterSpacing: "0.04em" }}>Archived</span>}
                  {previewDoc.trashed && <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ color: "#EF4444", background: "rgba(239,68,68,0.10)", letterSpacing: "0.04em" }}>In Trash</span>}
                </div>
                {/* PDF placeholder */}
                <div className="flex-1 min-h-0 overflow-auto p-6" style={{ background: isDark ? "rgba(255,255,255,0.02)" : "#F9FAFB" }}>
                  <div className="mx-auto rounded shadow-sm flex flex-col items-center justify-center"
                    style={{ background: "#FFFFFF", border: `1px solid ${c.border}`, aspectRatio: "8.5 / 11", maxWidth: 520, minHeight: 520, fontFamily: FONT }}>
                    <FileText className="w-16 h-16 mb-3" style={{ color: "#D1D5DB" }} />
                    <div className="text-[13px] font-semibold mb-1" style={{ color: "#374151" }}>{previewDoc.name}</div>
                    <div className="text-[11px]" style={{ color: "#9CA3AF" }}>Preview not available in demo</div>
                  </div>
                </div>
              </div>
            )}
            </div>
          );
        })()}
        {/* Expanded preview drawer (right side, matches Notes expanded pattern) */}
        {previewDoc && previewExpanded && detailTab === "documents" && (() => {
          const CAT_LABEL: Record<AgencyDocCategory, string> = { bor: "Broker of Record", w9: "W-9", license: "License", agreement: "Agreements", other: "Other", eo: "E&O Certificate" };
          return (
          <div className="fixed inset-y-0 right-0 z-50 flex" style={{ width: "58vw" }}>
            <div className="flex-1 cursor-pointer" onClick={() => setPreviewExpanded(false)} style={{ background: "rgba(0,0,0,0.25)" }} />
            <div className="flex flex-col h-full shadow-2xl" style={{ width: "100%", background: c.cardBg, borderLeft: `1px solid ${c.border}` }}>
              {/* Top bar */}
              <div className="flex items-center justify-between px-6 py-3 flex-shrink-0" style={{ borderBottom: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.02)" : "rgba(249,250,251,0.80)" }}>
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-3.5 h-3.5 flex-shrink-0" style={{ color: c.muted }} />
                  <span className="text-[11px] flex-shrink-0" style={{ fontFamily: FONT, color: c.muted }}>Documents</span>
                  <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: c.muted }} />
                  <span className="text-[11px] flex-shrink-0" style={{ fontFamily: FONT, color: c.muted }}>{CAT_LABEL[previewDoc.category]}</span>
                  <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: c.muted }} />
                  <span className="text-[12px] font-semibold truncate max-w-[420px]" style={{ fontFamily: FONT, color: c.text }}>{previewDoc.name}</span>
                  {previewDoc.archived && <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ fontFamily: FONT, color: "#F59E0B", background: "rgba(245,158,11,0.10)", letterSpacing: "0.04em" }}>{previewDoc.category === "w9" ? "Replaced" : "Archived"}</span>}
                  {previewDoc.trashed && <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ fontFamily: FONT, color: "#EF4444", background: "rgba(239,68,68,0.10)", letterSpacing: "0.04em" }}>In Trash</span>}
                </div>
                <div className="flex items-center gap-0.5 flex-shrink-0">
                  <button title="Download" className="p-1.5 rounded-md transition-colors" style={{ color: c.muted }}
                    onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button title="Collapse" onClick={() => setPreviewExpanded(false)} className="p-1.5 rounded-md transition-colors">
                    <Minimize2 className="w-3.5 h-3.5" style={{ color: "#A855F7" }} />
                  </button>
                  <button title="Close" onClick={() => { setPreviewExpanded(false); setPreviewDoc(null); }} className="p-1.5 rounded-md transition-colors" style={{ color: c.muted }}
                    onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              {/* Meta strip */}
              <div className="flex items-center gap-4 px-6 py-3 flex-shrink-0 text-[12px]" style={{ ...font, color: c.muted, borderBottom: `1px solid ${c.border}` }}>
                <span className="flex items-center gap-1.5"><FolderOpen className="w-3.5 h-3.5" style={{ color: "#A855F7" }} />{CAT_LABEL[previewDoc.category]}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{previewDoc.date}</span>
              </div>
              {/* PDF placeholder */}
              <div className="flex-1 min-h-0 overflow-auto p-8" style={{ background: isDark ? "rgba(255,255,255,0.02)" : "#F9FAFB" }}>
                <div className="mx-auto rounded shadow-sm flex flex-col items-center justify-center"
                  style={{ background: "#FFFFFF", border: `1px solid ${c.border}`, aspectRatio: "8.5 / 11", maxWidth: 720, minHeight: 720, fontFamily: FONT }}>
                  <FileText className="w-20 h-20 mb-3" style={{ color: "#D1D5DB" }} />
                  <div className="text-[14px] font-semibold mb-1" style={{ color: "#374151" }}>{previewDoc.name}</div>
                  <div className="text-[12px]" style={{ color: "#9CA3AF" }}>Preview not available in demo</div>
                </div>
              </div>
            </div>
          </div>
        ); })()}

        {/* ── Notes tab ── */}
        {detailTab === "notes" && (
          <div className="flex gap-4 pb-4" onClick={() => { setNoteFilterOpen(false); setNoteSortOpen(false); setNoteNewOpen(false); setNoteMoreOpen(false); }}>

            {/* Left panel */}
            <div className="flex flex-col min-h-0 transition-all"
              style={{ flex: selectedNote && !noteExpanded ? "0 0 30%" : "1 1 100%", minWidth: 0 }}>

              {/* Toolbar */}
              <div className="flex items-center justify-between mb-3 flex-shrink-0">
                <div className="flex items-center gap-0.5">
                  {(() => { const collapsed = !!selectedNote && !noteExpanded; return (<>
                  {([["list","All Notes",List],["board","By Type",LayoutGrid],["table","Table",Table2]] as [typeof noteView, string, ({className}:{className?:string})=>React.ReactElement][]).map(([v, label, Icon]) => {
                    const isActive = noteView === v && !showArchived && !showTrashed;
                    return (
                      <button key={v} title={label} onClick={e => { e.stopPropagation(); setNoteView(v); setShowArchived(false); setShowTrashed(false); setIsSelectMode(false); setSelectedNoteIds(new Set()); }}
                        className={`flex items-center ${collapsed ? "px-1.5" : "gap-1.5 px-3"} py-1.5 rounded-md text-[12px] font-medium transition-all whitespace-nowrap`}
                        style={{ fontFamily: FONT, background: isActive ? (isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6") : "transparent", color: isActive ? c.text : c.muted }}>
                        <Icon className="w-3 h-3" />{!collapsed && label}
                      </button>
                    );
                  })}
                  <div className="mx-1.5" style={{ width:1, height:16, background:c.border }} />
                  {(() => { const n = agNotes.filter(x => archivedIds.has(x.id)).length; return (
                    <button title="Archive" onClick={e => { e.stopPropagation(); setShowArchived(true); setShowTrashed(false); }}
                      className={`flex items-center ${collapsed ? "px-1.5" : "gap-1.5 px-2.5"} py-1.5 rounded-md text-[12px] font-medium transition-all`}
                      style={{ fontFamily: FONT, background: showArchived ? "rgba(245,158,11,0.10)" : "transparent", color: showArchived ? "#F59E0B" : c.muted }}>
                      <Archive className="w-3 h-3" />{!collapsed && "Archive"}
                      {!collapsed && n > 0 && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: showArchived ? "rgba(245,158,11,0.25)" : (isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6"), color: showArchived ? "#F59E0B" : c.muted }}>{n}</span>}
                    </button>
                  ); })()}
                  {(() => { const n = agNotes.filter(x => trashedIds.has(x.id)).length; return (
                    <button title="Trash" onClick={e => { e.stopPropagation(); setShowTrashed(true); setShowArchived(false); }}
                      className={`flex items-center ${collapsed ? "px-1.5" : "gap-1.5 px-2.5"} py-1.5 rounded-md text-[12px] font-medium transition-all`}
                      style={{ fontFamily: FONT, background: showTrashed ? "rgba(239,68,68,0.10)" : "transparent", color: showTrashed ? "#EF4444" : c.muted }}>
                      <Trash2 className="w-3 h-3" />{!collapsed && "Trash"}
                      {!collapsed && n > 0 && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: showTrashed ? "rgba(239,68,68,0.20)" : (isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6"), color: showTrashed ? "#EF4444" : c.muted }}>{n}</span>}
                    </button>
                  ); })()}
                  </>); })()}
                </div>
                <div className="flex items-center gap-1">
                  {/* Filter */}
                  <div className="relative" onClick={e => e.stopPropagation()}>
                    <button onClick={() => { setNoteFilterOpen(p => !p); setNoteSortOpen(false); setNoteNewOpen(false); }}
                      className="p-1.5 rounded-md transition-all"
                      style={{ color: (noteFilterType !== "All" || visibilityFilter !== "All") ? "#A855F7" : c.muted, background: (noteFilterType !== "All" || visibilityFilter !== "All") ? "rgba(168,85,247,0.10)" : "transparent" }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M1 3h14v1.5L9.5 10v5l-3-1.5V10L1 4.5V3z"/></svg>
                    </button>
                    {noteFilterOpen && (
                      <div className="absolute right-0 top-8 z-30 w-52 rounded-xl shadow-xl py-1.5" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                        <p className="text-[10px] font-semibold uppercase tracking-wide px-3 py-1.5" style={{ fontFamily: FONT, color: c.muted }}>Filter by Type</p>
                        {(["All",...NOTE_TYPES] as const).map(t => (
                          <button key={t} onClick={() => { setNoteFilterType(t as typeof noteFilterType); }}
                            className="w-full text-left px-3 py-1.5 text-[12px] flex items-center justify-between transition-colors"
                            style={{ fontFamily: FONT, color: noteFilterType === t ? "#A614C3" : c.text, background: noteFilterType === t ? "rgba(168,85,247,0.08)" : "transparent" }}>
                            {t === "All" ? "All Types" : t}
                            {noteFilterType === t && <svg width="10" height="8" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </button>
                        ))}
                        <div style={{ height:1, background:c.border, margin:"6px 0" }} />
                        <p className="text-[10px] font-semibold uppercase tracking-wide px-3 py-1.5" style={{ fontFamily: FONT, color: c.muted }}>Filter by Visibility</p>
                        {([
                          ["All", null],
                          ["Private", Lock],
                          ["Shared", Users],
                        ] as const).map(([v, Icon]) => (
                          <button key={v} onClick={() => { setVisibilityFilter(v as typeof visibilityFilter); }}
                            className="w-full text-left px-3 py-1.5 text-[12px] flex items-center justify-between transition-colors"
                            style={{ fontFamily: FONT, color: visibilityFilter === v ? "#A614C3" : c.text, background: visibilityFilter === v ? "rgba(168,85,247,0.08)" : "transparent" }}>
                            <span className="flex items-center gap-2">{Icon && <Icon className="w-3 h-3" />}{v === "All" ? "All Visibility" : v}</span>
                            {visibilityFilter === v && <svg width="10" height="8" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Sort */}
                  <div className="relative" onClick={e => e.stopPropagation()}>
                    <button onClick={() => { setNoteSortOpen(p => !p); setNoteFilterOpen(false); setNoteNewOpen(false); }}
                      className="p-1.5 rounded-md transition-all" style={{ color: c.muted }}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M2 4h12v1.5H2V4zm2 3.5h8V9H4V7.5zm2 3.5h4v1.5H6V11z"/></svg>
                    </button>
                    {noteSortOpen && (
                      <div className="absolute right-0 top-8 z-30 w-40 rounded-xl shadow-xl overflow-hidden" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                        <p className="text-[10px] font-semibold uppercase tracking-wide px-3 pt-2 pb-1.5" style={{ fontFamily: FONT, color: c.muted }}>Sort by Date</p>
                        {([["desc","Newest first"],["asc","Oldest first"]] as const).map(([d, label]) => (
                          <button key={d} onClick={() => { setNoteSortDir(d); setNoteSortOpen(false); }}
                            className="w-full text-left px-3 py-2 text-[12px] flex items-center justify-between"
                            style={{ fontFamily: FONT, color: noteSortDir === d ? "#A614C3" : c.text, background: noteSortDir === d ? "rgba(168,85,247,0.08)" : "transparent" }}>
                            <span>{label}</span>{noteSortDir === d && <svg width="10" height="8" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Search */}
                  <div className="flex items-center transition-all overflow-hidden" style={{ width: noteSearchOpen ? 160 : 28 }}>
                    <button onClick={e => { e.stopPropagation(); setNoteSearchOpen(p => !p); if (noteSearchOpen) setNoteSearch(""); }}
                      className="p-1.5 rounded-md flex-shrink-0" style={{ color: noteSearch ? "#A855F7" : c.muted }}>
                      <Search className="w-3.5 h-3.5" />
                    </button>
                    {noteSearchOpen && (
                      <input autoFocus value={noteSearch} onChange={e => setNoteSearch(e.target.value)}
                        onClick={e => e.stopPropagation()} placeholder="Search notes…"
                        className="outline-none text-[12px] flex-1 min-w-0"
                        style={{ fontFamily: FONT, color: c.text, background: "transparent", borderBottom: `1px solid ${c.border}` }} />
                    )}
                  </div>
                  {/* Select toggle */}
                  <button onClick={e => { e.stopPropagation(); setIsSelectMode(p => { if (p) setSelectedNoteIds(new Set()); return !p; }); }}
                    className="p-1.5 rounded-md transition-all"
                    style={{ color: isSelectMode ? "#A855F7" : c.muted, background: isSelectMode ? "rgba(168,85,247,0.10)" : "transparent" }}>
                    <CheckSquare className="w-3.5 h-3.5" />
                  </button>
                  {/* New button — hidden in archive/trash */}
                  {!showArchived && !showTrashed && <div className="relative ml-1" onClick={e => e.stopPropagation()}>
                    {selectedNote ? (
                      <button onClick={() => setNoteAddOpen(true)} className="w-7 h-7 flex items-center justify-center rounded-lg text-white transition-all" style={{ background: btnGrad }}>
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div className="flex items-center rounded-lg overflow-hidden" style={{ background: btnGrad }}>
                        <button onClick={() => setNoteAddOpen(true)} className="px-3 py-1.5 text-[12px] font-semibold text-white" style={{ fontFamily: FONT }}>New</button>
                        <div style={{ width:1, height:20, background:"rgba(255,255,255,0.2)" }} />
                        <button onClick={() => setNoteNewOpen(p => !p)} className="px-2 py-1.5 text-white flex items-center"><ChevronDown className="w-3 h-3" /></button>
                      </div>
                    )}
                    {noteNewOpen && (
                      <div className="absolute right-0 top-9 z-30 w-44 rounded-xl shadow-xl py-1.5" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                        <p className="text-[10px] font-semibold uppercase tracking-wide px-3 py-1.5" style={{ fontFamily: FONT, color: c.muted }}>Create new</p>
                        {NOTE_TYPES.map(t => (
                          <button key={t} onClick={() => { setNewNoteType(t); setNoteNewOpen(false); setNoteAddOpen(true); }}
                            className="w-full text-left px-3 py-1.5 text-[12px] flex items-center gap-2 transition-colors"
                            style={{ fontFamily: FONT, color: c.text }}
                            onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: typeColor[t]?.text }} />{t} Note
                          </button>
                        ))}
                      </div>
                    )}
                  </div>}
                </div>
              </div>

              {/* Divider */}
              <div className="flex-shrink-0 mb-3" style={{ height:1, background:c.border }} />

              {/* Batch action bar */}
              {isSelectMode && selectedNoteIds.size > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 mb-2.5 rounded-xl flex-shrink-0"
                  style={{ background: isDark ? "rgba(255,255,255,0.05)" : "#ffffff", border: `1px solid ${c.border}` }}>
                  {(() => {
                    const allSel = visibleNotes.length > 0 && visibleNotes.every(n => selectedNoteIds.has(n.id));
                    const someSel = !allSel && selectedNoteIds.size > 0;
                    return (
                      <button onClick={() => { if (allSel) setSelectedNoteIds(new Set()); else setSelectedNoteIds(new Set(visibleNotes.map(n => n.id))); }}
                        className="flex items-center gap-2 transition-all">
                        <div className="w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0"
                          style={{ border: `1.5px solid ${allSel ? "#A855F7" : (isDark ? "rgba(255,255,255,0.20)" : "rgba(0,0,0,0.13)")}`, background: allSel ? "#A855F7" : (isDark ? "rgba(255,255,255,0.08)" : "#ffffff") }}>
                          {allSel && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          {someSel && <div className="w-2 h-0.5 rounded-full" style={{ background:"#A855F7" }} />}
                        </div>
                        <span className="text-[12px] font-semibold" style={{ fontFamily: FONT, color: c.text }}>{selectedNoteIds.size} selected</span>
                      </button>
                    );
                  })()}
                  <div className="flex-1" />
                  <button onClick={() => { setPinnedIds(prev => { const s = new Set(prev); const allPinned = [...selectedNoteIds].every(id => s.has(id)); selectedNoteIds.forEach(id => allPinned ? s.delete(id) : s.add(id)); return s; }); }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-medium transition-all"
                    style={{ fontFamily: FONT, color: c.text, background: isDark ? "rgba(255,255,255,0.07)" : "#ffffff", border: `1px solid ${isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.12)"}` }}
                    onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.12)" : "#F3F4F6")}
                    onMouseLeave={e => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.07)" : "#F3F4F6")}>
                    <Pin className="w-3 h-3" style={{ color:"#F59E0B" }} />Pin
                  </button>
                  <button onClick={() => { setArchivedIds(prev => { const s = new Set(prev); selectedNoteIds.forEach(id => s.add(id)); return s; }); setSelectedNoteIds(new Set()); setIsSelectMode(false); }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-medium transition-all"
                    style={{ fontFamily: FONT, color: c.text, background: "rgba(245,158,11,0.10)", border: "1px solid rgba(245,158,11,0.40)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(245,158,11,0.18)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(245,158,11,0.10)")}>
                    <Archive className="w-3 h-3" style={{ color:"#F59E0B" }} />Archive
                  </button>
                  <button onClick={() => { setTrashedIds(prev => { const s = new Set(prev); selectedNoteIds.forEach(id => s.add(id)); return s; }); setSelectedNoteIds(new Set()); setIsSelectMode(false); }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-medium transition-all"
                    style={{ fontFamily: FONT, color: c.text, background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.35)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.18)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.10)")}>
                    <Trash2 className="w-3 h-3" style={{ color:"#EF4444" }} />Trash
                  </button>
                  <button onClick={() => setSelectedNoteIds(new Set())} className="p-1 rounded-md ml-1 transition-all" style={{ color: c.muted }}
                    onMouseEnter={e => (e.currentTarget.style.color = c.text)} onMouseLeave={e => (e.currentTarget.style.color = c.muted)}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* List view */}
              {noteView === "list" && (
                <div className="flex flex-col gap-2.5 overflow-y-auto flex-1 pr-1">
                  {visibleNotes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-2">
                      <StickyNote className="w-8 h-8" style={{ color: c.muted, opacity: 0.4 }} />
                      <p className="text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>No notes found</p>
                    </div>
                  ) : visibleNotes.map(n => {
                    const isChecked = selectedNoteIds.has(n.id);
                    const isPinned = pinnedIds.has(n.id);
                    return (
                      <div key={n.id} className="rounded-xl p-4 transition-all cursor-pointer"
                        style={{ background: isChecked ? (isDark ? "rgba(168,85,247,0.12)" : "rgba(92,46,212,0.07)") : selectedNote?.id === n.id ? (isDark ? "rgba(168,85,247,0.07)" : "rgba(92,46,212,0.04)") : c.cardBg, border: `1px solid ${isChecked ? (isDark ? "rgba(168,85,247,0.45)" : "rgba(92,46,212,0.35)") : selectedNote?.id === n.id ? (isDark ? "rgba(168,85,247,0.35)" : "rgba(92,46,212,0.30)") : c.border}` }}
                        onClick={e => { e.stopPropagation(); if (isSelectMode) { setSelectedNoteIds(prev => { const s = new Set(prev); s.has(n.id) ? s.delete(n.id) : s.add(n.id); return s; }); } else { openNote(n); } }}
                        onMouseEnter={e => { if (!isChecked && selectedNote?.id !== n.id) e.currentTarget.style.borderColor = isDark ? "rgba(168,85,247,0.25)" : "rgba(92,46,212,0.20)"; }}
                        onMouseLeave={e => { if (!isChecked && selectedNote?.id !== n.id) e.currentTarget.style.borderColor = c.border; }}>
                        <div className="flex items-start justify-between gap-3 mb-1.5">
                          <div className="flex items-center gap-2 flex-wrap min-w-0">
                            {isSelectMode && (
                              <div className="w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 transition-all"
                                style={{ border: `1.5px solid ${isChecked ? "#A855F7" : (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.13)")}`, background: isChecked ? "#A855F7" : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)") }}>
                                {isChecked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                              </div>
                            )}
                            <button onClick={e => { e.stopPropagation(); setPinnedIds(prev => { const s = new Set(prev); s.has(n.id) ? s.delete(n.id) : s.add(n.id); return s; }); }}
                              className="p-0.5 rounded flex-shrink-0 transition-all"
                              style={{ color: isPinned ? "#F59E0B" : c.muted, opacity: isPinned ? 1 : (isDark ? 0.6 : 0.3) }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.color = "#F59E0B"; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = isPinned ? "1" : "0.3"; (e.currentTarget as HTMLElement).style.color = isPinned ? "#F59E0B" : c.muted; }}>
                              <Pin className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[13px] font-semibold" style={{ fontFamily: FONT, color: c.text }}>{n.title}</span>
                            <TypeBadge type={n.type} />
                          </div>
                          {!isSelectMode && (
                            <button onClick={e => { e.stopPropagation(); if (showTrashed) { setDeleteNoteId(n.id); } else { setTrashedIds(prev => { const s = new Set(prev); s.add(n.id); return s; }); } }} className="p-1 rounded-md flex-shrink-0" style={{ color:"#EF4444", opacity:0.6 }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity="1"; (e.currentTarget as HTMLElement).style.background="rgba(239,68,68,0.08)"; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity="0.6"; (e.currentTarget as HTMLElement).style.background="transparent"; }}>
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <p className="text-[12px] leading-relaxed mb-2" style={{ fontFamily: FONT, color: isDark ? "rgba(255,255,255,0.72)" : c.muted }}>{n.content}</p>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                            style={{ background: isDark ? "rgba(168,85,247,0.18)" : "rgba(168,85,247,0.10)", color: "#A855F7" }}>{n.author.charAt(0)}</div>
                          <span className="text-[11px]" style={{ fontFamily: FONT, color: c.muted }}>{n.author} · {fmtDate(n.timestamp)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Board view */}
              {noteView === "board" && (
                <div className="flex gap-3 flex-1 pb-2 overflow-y-auto">
                  {NOTE_TYPES.map(type => {
                    const col = visibleNotes.filter(n => n.type === type);
                    return (
                      <div key={type} className="flex flex-col flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 px-1">
                          <span className="w-2 h-2 rounded-full" style={{ background: typeColor[type]?.text }} />
                          <span className="text-[12px] font-semibold" style={{ fontFamily: FONT, color: typeColor[type]?.text }}>{type}</span>
                          <span className="text-[11px] ml-auto" style={{ fontFamily: FONT, color: c.muted }}>{col.length}</span>
                        </div>
                        <div className="flex flex-col gap-2 overflow-y-auto flex-1">
                          {col.map(n => {
                            const isChecked = selectedNoteIds.has(n.id);
                            const isPinned = pinnedIds.has(n.id);
                            return (
                              <div key={n.id} className="rounded-xl transition-all cursor-pointer"
                                style={{ padding: selectedNote ? "8px 10px" : "14px", background: isChecked ? (isDark ? "rgba(168,85,247,0.12)" : "rgba(92,46,212,0.07)") : selectedNote?.id === n.id ? (isDark ? "rgba(168,85,247,0.07)" : "rgba(92,46,212,0.04)") : c.cardBg, border: `1px solid ${isChecked ? "rgba(168,85,247,0.45)" : selectedNote?.id === n.id ? typeColor[type]?.text + "66" : c.border}` }}
                                onClick={e => { e.stopPropagation(); if (isSelectMode) { setSelectedNoteIds(prev => { const s = new Set(prev); s.has(n.id) ? s.delete(n.id) : s.add(n.id); return s; }); } else { openNote(n); } }}
                                onMouseEnter={e => { if (!isChecked && selectedNote?.id !== n.id) e.currentTarget.style.borderColor = typeColor[type]?.text + "55"; }}
                                onMouseLeave={e => { if (!isChecked && selectedNote?.id !== n.id) e.currentTarget.style.borderColor = c.border; }}>
                                <div className="flex items-start justify-between gap-1" style={{ marginBottom: selectedNote ? 0 : 4 }}>
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    {isSelectMode && (
                                      <div className="w-3.5 h-3.5 rounded-md flex items-center justify-center flex-shrink-0"
                                        style={{ border: `1.5px solid ${isChecked ? "#A855F7" : (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.13)")}`, background: isChecked ? "#A855F7" : "transparent" }}>
                                        {isChecked && <svg width="7" height="5" viewBox="0 0 7 5" fill="none"><path d="M0.5 2.5L2.5 4.5L6.5 0.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                      </div>
                                    )}
                                    <button onClick={e => { e.stopPropagation(); setPinnedIds(prev => { const s = new Set(prev); s.has(n.id) ? s.delete(n.id) : s.add(n.id); return s; }); }}
                                      className="p-0.5 rounded flex-shrink-0 transition-all"
                                      style={{ color: isPinned ? "#F59E0B" : c.muted, opacity: isPinned ? 1 : (isDark ? 0.6 : 0.3) }}
                                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity="1"; (e.currentTarget as HTMLElement).style.color="#F59E0B"; }}
                                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity=isPinned?"1":(isDark?"0.6":"0.3"); (e.currentTarget as HTMLElement).style.color=isPinned?"#F59E0B":c.muted; }}>
                                      <Pin className="w-2.5 h-2.5" />
                                    </button>
                                    <span className="text-[11px] font-semibold leading-snug truncate" style={{ fontFamily: FONT, color: c.text }}>{n.title}</span>
                                  </div>
                                  {!isSelectMode && (
                                    <button onClick={e => { e.stopPropagation(); if (showTrashed) { setDeleteNoteId(n.id); } else { setTrashedIds(prev => { const s = new Set(prev); s.add(n.id); return s; }); } }} className="p-0.5 rounded flex-shrink-0" style={{ color: c.muted, opacity:0.5 }}
                                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity="1"; (e.currentTarget as HTMLElement).style.color="#EF4444"; }}
                                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity="0.5"; (e.currentTarget as HTMLElement).style.color=c.muted; }}>
                                      <X className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                                {/* Content + author — hidden in compact mode */}
                                {!selectedNote && <>
                                  <p className="text-[11px] leading-relaxed mb-2.5 line-clamp-3" style={{ fontFamily: FONT, color: isDark ? "rgba(255,255,255,0.72)" : c.muted }}>{n.content}</p>
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
                                      style={{ background: isDark ? "rgba(168,85,247,0.18)" : "rgba(168,85,247,0.10)", color: "#A855F7" }}>{n.author.charAt(0)}</div>
                                    <span className="text-[10px]" style={{ fontFamily: FONT, color: c.muted }}>{fmtDate(n.timestamp).split(" ").slice(0,3).join(" ")}</span>
                                  </div>
                                </>}
                              </div>
                            );
                          })}
                          {col.length === 0 && (
                            <div className="rounded-xl p-4 text-center" style={{ background: isDark ? "rgba(255,255,255,0.02)" : "#FAFAFA", border: `1px dashed ${c.border}` }}>
                              <p className="text-[11px]" style={{ fontFamily: FONT, color: c.muted }}>No {type} notes</p>
                            </div>
                          )}
                          {!showArchived && !showTrashed && (
                            <button onClick={() => { setNewNoteType(type); setNoteAddOpen(true); }}
                              className="flex items-center gap-1.5 px-2 py-2 rounded-lg text-[11px] transition-all w-full"
                              style={{ fontFamily: FONT, color: c.muted, border: `1px dashed ${c.border}` }}
                              onMouseEnter={e => (e.currentTarget.style.borderColor = typeColor[type]?.text + "66")}
                              onMouseLeave={e => (e.currentTarget.style.borderColor = c.border)}>
                              <Plus className="w-3 h-3" />New {type}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Table view */}
              {noteView === "table" && (
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${c.border}` }}>
                        {isSelectMode && <th className="pb-2 w-8" />}
                        {(!!selectedNote && !noteExpanded ? ["Title","Created"] : ["Title","Created","Created By","Type"]).map(h => (
                          <th key={h} className="text-[11px] font-semibold pb-2 pr-6" style={{ fontFamily: FONT, color: c.muted }}>{h}</th>
                        ))}
                        <th className="text-[11px] font-semibold pb-2 w-12" />
                      </tr>
                    </thead>
                    <tbody>
                      {visibleNotes.map((n, i) => {
                        const isChecked = selectedNoteIds.has(n.id);
                        const isPinned = pinnedIds.has(n.id);
                        return (
                          <tr key={n.id} className="cursor-pointer"
                            style={{ borderBottom: `1px solid ${c.border}`, background: isChecked ? (isDark ? "rgba(168,85,247,0.10)" : "rgba(92,46,212,0.06)") : selectedNote?.id === n.id ? (isDark ? "rgba(168,85,247,0.07)" : "rgba(92,46,212,0.04)") : (i%2===0 ? "transparent" : (isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)")) }}
                            onClick={e => { e.stopPropagation(); if (isSelectMode) { setSelectedNoteIds(prev => { const s = new Set(prev); s.has(n.id) ? s.delete(n.id) : s.add(n.id); return s; }); } else { openNote(n); } }}
                            onMouseEnter={e => { if (!isChecked && selectedNote?.id !== n.id) e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB"; }}
                            onMouseLeave={e => { if (!isChecked && selectedNote?.id !== n.id) e.currentTarget.style.background = i%2===0 ? "transparent" : (isDark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)"); }}>
                            {isSelectMode && (
                              <td className="py-2.5 pr-2 w-8">
                                <div className="w-4 h-4 rounded-md flex items-center justify-center"
                                  style={{ border: `1.5px solid ${isChecked ? "#A855F7" : (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.13)")}`, background: isChecked ? "#A855F7" : "transparent" }}>
                                  {isChecked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                </div>
                              </td>
                            )}
                            <td className="py-2.5 pr-6">
                              <div className="flex items-center gap-1.5">
                                <button onClick={e => { e.stopPropagation(); setPinnedIds(prev => { const s = new Set(prev); s.has(n.id) ? s.delete(n.id) : s.add(n.id); return s; }); }}
                                  className="p-0.5 rounded flex-shrink-0 transition-all"
                                  style={{ color: isPinned ? "#F59E0B" : c.muted, opacity: isPinned ? 1 : (isDark ? 0.6 : 0.3) }}
                                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity="1"; (e.currentTarget as HTMLElement).style.color="#F59E0B"; }}
                                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity=isPinned?"1":(isDark?"0.6":"0.3"); (e.currentTarget as HTMLElement).style.color=isPinned?"#F59E0B":c.muted; }}>
                                  <Pin className="w-3 h-3" />
                                </button>
                                <div>
                                  <span className="text-[12px] font-medium" style={{ fontFamily: FONT, color: c.text }}>{n.title}</span>
                                  <p className="text-[11px] truncate max-w-[200px]" style={{ fontFamily: FONT, color: isDark ? "rgba(255,255,255,0.72)" : c.muted }}>{n.content}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-2.5 pr-6 text-[12px] whitespace-nowrap" style={{ fontFamily: FONT, color: c.muted }}>{fmtDate(n.timestamp)}</td>
                            {!(!!selectedNote && !noteExpanded) && <td className="py-2.5 pr-6 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                                  style={{ background: isDark ? "rgba(168,85,247,0.18)" : "rgba(168,85,247,0.10)", color: "#A855F7" }}>{n.author.charAt(0)}</div>
                                <span className="text-[12px]" style={{ fontFamily: FONT, color: c.text }}>{n.author}</span>
                              </div>
                            </td>}
                            {!(!!selectedNote && !noteExpanded) && <td className="py-2.5 pr-6 whitespace-nowrap"><TypeBadge type={n.type} /></td>}
                            <td className="py-2.5">
                              {!isSelectMode && (
                                <button onClick={e => { e.stopPropagation(); setDeleteNoteId(n.id); }} className="p-1 rounded" style={{ color: c.muted, opacity:0.5 }}
                                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity="1"; (e.currentTarget as HTMLElement).style.color="#EF4444"; }}
                                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity="0.5"; (e.currentTarget as HTMLElement).style.color=c.muted; }}>
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      {visibleNotes.length === 0 && (
                        <tr><td colSpan={isSelectMode ? 6 : 5} className="py-12 text-center text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>No notes found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Delete confirmation */}
              {deleteNoteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }}
                  onClick={() => setDeleteNoteId(null)}>
                  <div className="w-80 rounded-2xl shadow-2xl p-6" style={{ background: c.cardBg, border: `1px solid ${c.border}` }} onClick={e => e.stopPropagation()}>
                    <p className="text-[15px] font-bold mb-2" style={{ fontFamily: FONT, color: c.text }}>Delete note?</p>
                    <p className="text-[13px] mb-5" style={{ fontFamily: FONT, color: c.muted }}>This action cannot be undone.</p>
                    <div className="flex gap-3 justify-end">
                      <button onClick={() => setDeleteNoteId(null)} className="px-4 py-2 rounded-lg text-[12px]" style={{ fontFamily: FONT, border: `1px solid ${c.border}`, color: c.text }}>Cancel</button>
                      <button onClick={() => { setAgNotes(prev => prev.filter(n => n.id !== deleteNoteId)); if (selectedNote?.id === deleteNoteId) { setSelectedNote(null); setNoteExpanded(false); } setDeleteNoteId(null); }}
                        className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white" style={{ fontFamily: FONT, background: "#EF4444" }}>Delete</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Add Note modal */}
              {noteAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background:"rgba(0,0,0,0.45)" }} onClick={() => setNoteAddOpen(false)}>
                  <div className="w-[480px] rounded-2xl shadow-2xl" style={{ background: c.cardBg, border: `1px solid ${c.border}`, fontFamily: FONT }} onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: `1px solid ${c.border}` }}>
                      <h2 className="text-[15px] font-bold" style={{ fontFamily: FONT, color: c.text }}>New Note</h2>
                      <button onClick={() => setNoteAddOpen(false)} style={{ color: c.muted }}><X className="w-4 h-4" /></button>
                    </div>
                    <div className="px-6 py-5 space-y-4">
                      <div>
                        <label className="text-[11px] font-semibold uppercase tracking-wide block mb-1.5" style={{ fontFamily: FONT, color: c.muted }}>Title</label>
                        <input value={newNoteTitle} onChange={e => setNewNoteTitle(e.target.value)} placeholder="Note title…" className="outline-none w-full text-[13px]"
                          style={{ fontFamily: FONT, background: isDark ? "rgba(255,255,255,0.05)" : "#F9FAFB", border: `1px solid ${c.border}`, color: c.text, padding:"9px 12px", borderRadius:8 }} />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold uppercase tracking-wide block mb-1.5" style={{ fontFamily: FONT, color: c.muted }}>Type</label>
                        <div className="flex flex-wrap gap-2">
                          {NOTE_TYPES.map(t => (
                            <button key={t} onClick={() => setNewNoteType(t)}
                              className="px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
                              style={{ fontFamily: FONT, background: newNoteType === t ? typeColor[t]?.bg : "transparent", color: newNoteType === t ? typeColor[t]?.text : c.muted, border: `1px solid ${newNoteType === t ? typeColor[t]?.text + "44" : c.border}` }}>
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold uppercase tracking-wide block mb-1.5" style={{ fontFamily: FONT, color: c.muted }}>Content</label>
                        <textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Write your note here…" rows={4} className="w-full outline-none resize-none text-[13px]"
                          style={{ fontFamily: FONT, background: isDark ? "rgba(255,255,255,0.05)" : "#F9FAFB", border: `1px solid ${c.border}`, color: c.text, padding:"9px 12px", borderRadius:8 }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: `1px solid ${c.border}` }}>
                      <button onClick={() => setNoteAddOpen(false)} className="px-4 py-[7px] rounded-lg text-[12px]"
                        style={{ fontFamily: FONT, border: `1px solid ${c.border}`, color: c.text, background: "transparent" }}>Cancel</button>
                      <button onClick={() => {
                        const titleFinal = newNoteTitle.trim() || (newNote.trim() ? newNote.trim().slice(0,40)+(newNote.trim().length>40?"…":"") : "Untitled Note");
                        if (!titleFinal) return;
                        setAgNotes(prev => [{ id: Date.now().toString(), title: titleFinal, content: newNote.trim(), author: CURRENT_USER, timestamp: new Date().toISOString(), agencyId: agency.id, type: newNoteType }, ...prev]);
                        setNewNoteTitle(""); setNewNote(""); setNoteAddOpen(false);
                      }} className="px-5 py-[7px] rounded-lg text-[12px] font-semibold text-white" style={{ fontFamily: FONT, background: btnGrad }}>
                        Create Note
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right panel: note detail */}
            {selectedNote && !noteExpanded && (
              <div className="flex flex-col flex-1 min-h-0 rounded-2xl overflow-hidden transition-all"
                style={{ background: c.cardBg, border: `1px solid ${c.border}` }}
                onClick={e => { e.stopPropagation(); setNoteMoreOpen(false); }}>
                {(() => {
                  const isLockedByOther = noteLocked && lockedBy !== CURRENT_USER;
                  return (
                    <>
                      {/* Top bar */}
                      <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
                        style={{ borderBottom: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.02)" : "rgba(249,250,251,0.80)" }}>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <StickyNote className="w-3.5 h-3.5 flex-shrink-0" style={{ color: c.muted }} />
                          <span className="text-[11px] flex-shrink-0" style={{ fontFamily: FONT, color: c.muted }}>Notes</span>
                          <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: c.muted }} />
                          <span className="text-[11px] font-medium truncate" style={{ fontFamily: FONT, color: c.text }}>{selectedNote.title}</span>
                          {noteLocked && <Lock className="w-3 h-3 flex-shrink-0 ml-0.5" style={{ color: "#A855F7" }} />}
                          {pinnedIds.has(selectedNote.id) && <Pin className="w-3 h-3 flex-shrink-0" style={{ color: "#F59E0B" }} />}
                        </div>
                        <div className="flex items-center gap-0.5 flex-shrink-0">
                          <button onClick={e => { e.stopPropagation(); setPinnedIds(prev => { const s = new Set(prev); s.has(selectedNote.id) ? s.delete(selectedNote.id) : s.add(selectedNote.id); return s; }); }}
                            className="p-1.5 rounded-md transition-colors"
                            style={{ color: pinnedIds.has(selectedNote.id) ? "#F59E0B" : c.muted, background: pinnedIds.has(selectedNote.id) ? "rgba(245,158,11,0.10)" : "transparent" }}>
                            <Pin className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={e => { e.stopPropagation(); if (noteLocked && isLockedByOther) return; setNoteLocked(p => !p); if (!noteLocked) setLockedBy(CURRENT_USER); }}
                            className="p-1.5 rounded-md transition-colors"
                            style={{ color: noteLocked ? "#A855F7" : c.muted, background: noteLocked ? "rgba(168,85,247,0.10)" : "transparent" }}>
                            {noteLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          </button>
                          <button onClick={e => { e.stopPropagation(); setNoteExpanded(p => !p); }} className="p-1.5 rounded-md transition-colors">
                            <Maximize2 className="w-3.5 h-3.5" style={{ color: c.muted }} />
                          </button>
                          <div className="relative" onClick={e => e.stopPropagation()}>
                            <button onClick={() => { setNoteMoreOpen(p => !p); }} className="p-1.5 rounded-md" style={{ color: c.muted }}>
                              <MoreVertical className="w-3.5 h-3.5" />
                            </button>
                            {noteMoreOpen && (
                              <div className="absolute right-0 top-9 z-50 w-52 rounded-xl shadow-2xl py-1.5" style={{ background: c.cardBg, border: `1px solid ${c.border}` }} onClick={e => e.stopPropagation()}>
                                {!showTrashed && <>
                                  <button onClick={() => { navigator.clipboard.writeText(`${editNoteTitle}\n\n${editNoteContent}`); setCopyToast("Copied!"); setTimeout(()=>setCopyToast(""),2000); setNoteMoreOpen(false); }}
                                    className="w-full text-left px-3 py-2 text-[12px] flex items-center gap-2.5" style={{ fontFamily: FONT, color: c.text }}
                                    onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                                    <Copy className="w-3.5 h-3.5" style={{ color: c.muted }} />Copy content
                                  </button>
                                  <button onClick={() => { setAgNotes(prev => [{ ...selectedNote, id: Date.now().toString(), title: `Copy of ${editNoteTitle}`, content: editNoteContent, timestamp: new Date().toISOString() }, ...prev]); setCopyToast("Duplicated!"); setTimeout(()=>setCopyToast(""),2000); setNoteMoreOpen(false); }}
                                    className="w-full text-left px-3 py-2 text-[12px] flex items-center gap-2.5" style={{ fontFamily: FONT, color: c.text }}
                                    onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                                    <CopyPlus className="w-3.5 h-3.5" style={{ color: c.muted }} />Duplicate
                                  </button>
                                  <div style={{ height:1, background:c.border, margin:"4px 0" }} />
                                  <button onClick={() => { setArchivedIds(prev => { const s = new Set(prev); s.has(selectedNote.id)?s.delete(selectedNote.id):s.add(selectedNote.id); return s; }); setSelectedNote(null); setNoteExpanded(false); setNoteMoreOpen(false); }}
                                    className="w-full text-left px-3 py-2 text-[12px] flex items-center gap-2.5" style={{ fontFamily: FONT, color: "#F59E0B" }}
                                    onMouseEnter={e=>(e.currentTarget.style.background="rgba(245,158,11,0.08)")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                                    <Archive className="w-3.5 h-3.5" />{archivedIds.has(selectedNote.id) ? "Unarchive" : "Archive"}
                                  </button>
                                  <div style={{ height:1, background:c.border, margin:"4px 0" }} />
                                  <button onClick={() => { setTrashedIds(prev => { const s = new Set(prev); s.add(selectedNote.id); return s; }); setSelectedNote(null); setNoteExpanded(false); setNoteMoreOpen(false); }}
                                    className="w-full text-left px-3 py-2 text-[12px] flex items-center gap-2.5" style={{ fontFamily: FONT, color: "#EF4444" }}
                                    onMouseEnter={e=>(e.currentTarget.style.background="rgba(239,68,68,0.08)")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                                    <Trash2 className="w-3.5 h-3.5" />Move to Trash
                                  </button>
                                </>}
                                {showTrashed && <>
                                  <button onClick={() => { setTrashedIds(prev => { const s = new Set(prev); s.delete(selectedNote.id); return s; }); setSelectedNote(null); setNoteMoreOpen(false); }}
                                    className="w-full text-left px-3 py-2 text-[12px] flex items-center gap-2.5" style={{ fontFamily: FONT, color: "#73C9B7" }}
                                    onMouseEnter={e=>(e.currentTarget.style.background="rgba(115,201,183,0.08)")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                                    <RefreshCw className="w-3.5 h-3.5" />Restore note
                                  </button>
                                  <button onClick={() => { setDeleteNoteId(selectedNote.id); setSelectedNote(null); setNoteExpanded(false); setNoteMoreOpen(false); }}
                                    className="w-full text-left px-3 py-2 text-[12px] flex items-center gap-2.5" style={{ fontFamily: FONT, color: "#EF4444" }}
                                    onMouseEnter={e=>(e.currentTarget.style.background="rgba(239,68,68,0.08)")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                                    <Trash2 className="w-3.5 h-3.5" />Delete permanently
                                  </button>
                                </>}
                                <div className="px-3 pt-1.5 pb-1" style={{ borderTop: `1px solid ${c.border}`, marginTop:4 }}>
                                  <p className="text-[10px]" style={{ fontFamily: FONT, color: c.muted }}>Last edited {fmtDate(selectedNote.timestamp)}</p>
                                </div>
                              </div>
                            )}
                          </div>
                          {!noteLocked && !showTrashed && (
                            <button onClick={saveNote} className="ml-1 px-3 py-1 rounded-lg text-[11px] font-semibold text-white transition-all"
                              style={{ fontFamily: FONT, background: btnGrad }}
                              onMouseEnter={e=>(e.currentTarget.style.filter="brightness(1.12)")} onMouseLeave={e=>(e.currentTarget.style.filter="none")}>Save</button>
                          )}
                          <button onClick={() => { setSelectedNote(null); setNoteExpanded(false); setNoteMoreOpen(false); }}
                            className="p-1.5 rounded-md transition-colors" style={{ color: c.muted }}
                            onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="flex-1 overflow-y-auto py-6 relative" style={{ paddingLeft:28, paddingRight:28 }}>
                        {copyToast && <div className="absolute top-3 right-4 z-50 px-3 py-1.5 rounded-lg text-[12px] font-medium text-white shadow-lg" style={{ background: btnGrad, fontFamily: FONT }}>{copyToast}</div>}
                        {noteLocked && isLockedByOther && (
                          <div className="mb-4 flex items-center justify-between px-4 py-3 rounded-xl" style={{ background:"rgba(168,85,247,0.07)", border:"1px solid rgba(168,85,247,0.20)" }}>
                            <div className="flex items-center gap-2">
                              <Lock className="w-4 h-4" style={{ color:"#A855F7" }} />
                              <span className="text-[12px]" style={{ fontFamily: FONT, color: c.text }}>Locked by <strong>{lockedBy}</strong></span>
                            </div>
                          </div>
                        )}
                        <input value={editNoteTitle} onChange={e => setEditNoteTitle(e.target.value)} readOnly={noteLocked || showTrashed}
                          className="w-full outline-none font-bold bg-transparent mb-5"
                          style={{ fontFamily: FONT, color: c.text, fontSize:22, border:"none", cursor:(noteLocked||showTrashed)?"default":"text" }} />
                        {/* Properties */}
                        <div className="mb-6 rounded-xl overflow-hidden" style={{ border: `1px solid ${c.border}` }}>
                          {[
                            { icon: <Calendar className="w-3.5 h-3.5" />, label:"Created", value:<span className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{fmtDate(selectedNote.timestamp)}</span> },
                            { icon: <UserCircle className="w-3.5 h-3.5" />, label:"Created By", value:<div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background:isDark?"rgba(168,85,247,0.18)":"rgba(168,85,247,0.10)", color:"#A855F7" }}>{selectedNote.author.charAt(0)}</div><span className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{selectedNote.author}</span></div> },
                            { icon: <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="8" cy="8" r="2.5"/></svg>, label:"Type", value:<div className="flex flex-wrap gap-1.5">{NOTE_TYPES.map(t => (<button key={t} onClick={() => (!noteLocked&&!showTrashed)&&setEditNoteType(t)} className="px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all" style={{ fontFamily:FONT, background:editNoteType===t?typeColor[t]?.bg:"transparent", color:editNoteType===t?typeColor[t]?.text:c.muted, border:`1px solid ${editNoteType===t?typeColor[t]?.text+"44":c.border}`, cursor:(noteLocked||showTrashed)?"default":"pointer" }}>{t}</button>))}</div> },
                            { icon: <Lock className="w-3.5 h-3.5" />, label:"Visibility", value:(
  <div className="flex flex-col gap-2 min-w-0">
    <div className="flex flex-wrap gap-1.5">
      {([["Private",Lock,"Only you can see this note"],["Shared",Users,"Visible to everyone in your team"]] as const).map(([v,Ic,tip]) => (
        <button key={v} title={tip} onClick={() => (!noteLocked&&!showTrashed)&&setEditNoteVisibility(v)}
          className="px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5"
          style={{ fontFamily:FONT, background:editNoteVisibility===v?"rgba(168,85,247,0.10)":"transparent", color:editNoteVisibility===v?"#A855F7":c.muted, border:`1px solid ${editNoteVisibility===v?"rgba(168,85,247,0.35)":c.border}`, cursor:(noteLocked||showTrashed)?"default":"pointer" }}>
          <Ic className="w-3 h-3" />{v}
        </button>
      ))}
    </div>
  </div>
) },
                            { icon: <Building2 className="w-3.5 h-3.5" />, label:"Agency", value:<span className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{agency.name}</span> },
                          ].map(({ icon, label, value }, idx, arr) => (
                            <div key={label} className="flex items-center px-4 py-2.5" style={{ borderBottom: idx<arr.length-1 ? `1px solid ${c.border}` : undefined }}>
                              <div className="flex items-center gap-2 flex-shrink-0" style={{ width:130, color:c.muted }}>{icon}<span className="text-[12px]" style={{ fontFamily:FONT }}>{label}</span></div>
                              {value}
                            </div>
                          ))}
                        </div>
                        <div className="mb-4" style={{ height:1, background:c.border }} />
                        <textarea value={editNoteContent} onChange={e => setEditNoteContent(e.target.value)} readOnly={noteLocked||showTrashed}
                          placeholder={(noteLocked||showTrashed) ? "" : "Start writing your note here…"}
                          className="w-full outline-none resize-none leading-relaxed bg-transparent" rows={12}
                          style={{ fontFamily:FONT, fontSize:13, color:c.text, border:"none", cursor:(noteLocked||showTrashed)?"default":"text" }} />
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between px-5 py-2.5 flex-shrink-0" style={{ borderTop: `1px solid ${c.border}` }}>
                        <div className="flex items-center gap-3">
                          <span className="text-[11px]" style={{ fontFamily:FONT, color:c.muted }}>{editNoteContent.trim().split(/\s+/).filter(Boolean).length} words</span>
                          {noteLocked && <span className="text-[11px] flex items-center gap-1.5" style={{ fontFamily:FONT, color:"#A855F7" }}><Lock className="w-3 h-3" />{lockedBy===CURRENT_USER ? "Locked by you · Read-only for others" : `Locked by ${lockedBy} · Read-only`}</span>}
                          {pinnedIds.has(selectedNote.id) && <span className="text-[11px] flex items-center gap-1" style={{ fontFamily:FONT, color:"#F59E0B" }}><Pin className="w-3 h-3" />Pinned</span>}
                        </div>
                        <span className="text-[11px]" style={{ fontFamily:FONT, color:c.muted }}>{fmtDate(selectedNote.timestamp)}</span>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Expanded overlay */}
            {selectedNote && noteExpanded && (() => {
              const isLockedByOther = noteLocked && lockedBy !== CURRENT_USER;
              return (
              <div className="fixed inset-y-0 right-0 z-50 flex" style={{ width:"58vw" }}
                onClick={e => { e.stopPropagation(); setNoteMoreOpen(false); }}>
                <div className="flex-1 cursor-pointer" onClick={() => setNoteExpanded(false)} style={{ background:"rgba(0,0,0,0.25)" }} />
                <div className="flex flex-col h-full shadow-2xl" style={{ width:"100%", background:c.cardBg, borderLeft:`1px solid ${c.border}` }}>
                  {/* Top bar */}
                  <div className="flex items-center justify-between px-6 py-3 flex-shrink-0" style={{ borderBottom:`1px solid ${c.border}`, background:isDark?"rgba(255,255,255,0.02)":"rgba(249,250,251,0.8)" }}>
                    <div className="flex items-center gap-2 min-w-0">
                      <StickyNote className="w-3.5 h-3.5 flex-shrink-0" style={{ color:c.muted }} />
                      <span className="text-[11px] flex-shrink-0" style={{ fontFamily:FONT, color:c.muted }}>Notes</span>
                      <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color:c.muted }} />
                      <span className="text-[12px] font-semibold truncate max-w-[280px]" style={{ fontFamily:FONT, color:c.text }}>{selectedNote.title}</span>
                      {noteLocked && <Lock className="w-3 h-3 flex-shrink-0" style={{ color:"#A855F7" }} />}
                      {pinnedIds.has(selectedNote.id) && <Pin className="w-3 h-3 flex-shrink-0" style={{ color:"#F59E0B" }} />}
                    </div>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <button onClick={e => { e.stopPropagation(); setPinnedIds(prev => { const s = new Set(prev); s.has(selectedNote.id) ? s.delete(selectedNote.id) : s.add(selectedNote.id); return s; }); }}
                        className="p-1.5 rounded-md transition-colors"
                        style={{ color: pinnedIds.has(selectedNote.id) ? "#F59E0B" : c.muted, background: pinnedIds.has(selectedNote.id) ? "rgba(245,158,11,0.10)" : "transparent" }}>
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={e => { e.stopPropagation(); if (noteLocked && isLockedByOther) return; setNoteLocked(p => !p); if (!noteLocked) setLockedBy(CURRENT_USER); }}
                        className="p-1.5 rounded-md transition-colors"
                        style={{ color: noteLocked ? "#A855F7" : c.muted, background: noteLocked ? "rgba(168,85,247,0.10)" : "transparent" }}>
                        {noteLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => setNoteExpanded(false)} className="p-1.5 rounded-md transition-colors" title="Collapse">
                        <Minimize2 className="w-3.5 h-3.5" style={{ color: "#A855F7" }} />
                      </button>
                      <div className="relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => { setNoteMoreOpen(p => !p); }} className="p-1.5 rounded-md" style={{ color: c.muted }}>
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                        {noteMoreOpen && (
                          <div className="absolute right-0 top-9 z-50 w-52 rounded-xl shadow-2xl py-1.5" style={{ background: c.cardBg, border: `1px solid ${c.border}` }} onClick={e => e.stopPropagation()}>
                            {!showTrashed && <>
                              <button onClick={() => { navigator.clipboard.writeText(`${editNoteTitle}\n\n${editNoteContent}`); setCopyToast("Copied!"); setTimeout(()=>setCopyToast(""),2000); setNoteMoreOpen(false); }}
                                className="w-full text-left px-3 py-2 text-[12px] flex items-center gap-2.5" style={{ fontFamily: FONT, color: c.text }}
                                onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                                <Copy className="w-3.5 h-3.5" style={{ color: c.muted }} />Copy content
                              </button>
                              <button onClick={() => { setAgNotes(prev => [{ ...selectedNote, id: Date.now().toString(), title: `Copy of ${editNoteTitle}`, content: editNoteContent, timestamp: new Date().toISOString() }, ...prev]); setCopyToast("Duplicated!"); setTimeout(()=>setCopyToast(""),2000); setNoteMoreOpen(false); }}
                                className="w-full text-left px-3 py-2 text-[12px] flex items-center gap-2.5" style={{ fontFamily: FONT, color: c.text }}
                                onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                                <CopyPlus className="w-3.5 h-3.5" style={{ color: c.muted }} />Duplicate
                              </button>
                              <div style={{ height:1, background:c.border, margin:"4px 0" }} />
                              <button onClick={() => { setArchivedIds(prev => { const s = new Set(prev); s.has(selectedNote.id)?s.delete(selectedNote.id):s.add(selectedNote.id); return s; }); setSelectedNote(null); setNoteExpanded(false); setNoteMoreOpen(false); }}
                                className="w-full text-left px-3 py-2 text-[12px] flex items-center gap-2.5" style={{ fontFamily: FONT, color: "#F59E0B" }}
                                onMouseEnter={e=>(e.currentTarget.style.background="rgba(245,158,11,0.08)")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                                <Archive className="w-3.5 h-3.5" />{archivedIds.has(selectedNote.id) ? "Unarchive" : "Archive"}
                              </button>
                              <div style={{ height:1, background:c.border, margin:"4px 0" }} />
                              <button onClick={() => { setTrashedIds(prev => { const s = new Set(prev); s.add(selectedNote.id); return s; }); setSelectedNote(null); setNoteExpanded(false); setNoteMoreOpen(false); }}
                                className="w-full text-left px-3 py-2 text-[12px] flex items-center gap-2.5" style={{ fontFamily: FONT, color: "#EF4444" }}
                                onMouseEnter={e=>(e.currentTarget.style.background="rgba(239,68,68,0.08)")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                                <Trash2 className="w-3.5 h-3.5" />Move to Trash
                              </button>
                            </>}
                            {showTrashed && <>
                              <button onClick={() => { setTrashedIds(prev => { const s = new Set(prev); s.delete(selectedNote.id); return s; }); setSelectedNote(null); setNoteMoreOpen(false); }}
                                className="w-full text-left px-3 py-2 text-[12px] flex items-center gap-2.5" style={{ fontFamily: FONT, color: "#73C9B7" }}
                                onMouseEnter={e=>(e.currentTarget.style.background="rgba(115,201,183,0.08)")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                                <RefreshCw className="w-3.5 h-3.5" />Restore note
                              </button>
                              <button onClick={() => { setDeleteNoteId(selectedNote.id); setSelectedNote(null); setNoteExpanded(false); setNoteMoreOpen(false); }}
                                className="w-full text-left px-3 py-2 text-[12px] flex items-center gap-2.5" style={{ fontFamily: FONT, color: "#EF4444" }}
                                onMouseEnter={e=>(e.currentTarget.style.background="rgba(239,68,68,0.08)")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                                <Trash2 className="w-3.5 h-3.5" />Delete permanently
                              </button>
                            </>}
                            <div className="px-3 pt-1.5 pb-1" style={{ borderTop: `1px solid ${c.border}`, marginTop:4 }}>
                              <p className="text-[10px]" style={{ fontFamily: FONT, color: c.muted }}>Last edited {fmtDate(selectedNote.timestamp)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      {!noteLocked && !showTrashed && (
                        <button onClick={saveNote} className="ml-1 px-3 py-1 rounded-lg text-[11px] font-semibold text-white transition-all"
                          style={{ fontFamily: FONT, background: btnGrad }}
                          onMouseEnter={e=>(e.currentTarget.style.filter="brightness(1.12)")} onMouseLeave={e=>(e.currentTarget.style.filter="none")}>Save</button>
                      )}
                      <button onClick={() => { setSelectedNote(null); setNoteExpanded(false); setNoteMoreOpen(false); }}
                        className="p-1.5 rounded-md transition-colors" style={{ color: c.muted }}
                        onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {/* Body */}
                  <div className="flex-1 overflow-y-auto relative" style={{ paddingLeft:72, paddingRight:72, paddingTop:24, paddingBottom:24 }}>
                    {copyToast && <div className="absolute top-3 right-6 z-50 px-3 py-1.5 rounded-lg text-[12px] font-medium text-white shadow-lg" style={{ background:btnGrad, fontFamily:FONT }}>{copyToast}</div>}
                    {noteLocked && isLockedByOther && (
                      <div className="mb-4 flex items-center justify-between px-4 py-3 rounded-xl" style={{ background:"rgba(168,85,247,0.07)", border:"1px solid rgba(168,85,247,0.20)" }}>
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4" style={{ color:"#A855F7" }} />
                          <span className="text-[12px]" style={{ fontFamily: FONT, color: c.text }}>Locked by <strong>{lockedBy}</strong></span>
                        </div>
                      </div>
                    )}
                    <input value={editNoteTitle} onChange={e=>setEditNoteTitle(e.target.value)} readOnly={noteLocked||showTrashed}
                      className="w-full outline-none font-bold bg-transparent mb-5"
                      style={{ fontFamily:FONT, color:c.text, fontSize:26, border:"none", cursor:(noteLocked||showTrashed)?"default":"text" }} />
                    {/* Properties */}
                    <div className="mb-6 rounded-xl overflow-hidden" style={{ border: `1px solid ${c.border}` }}>
                      {[
                        { icon: <Calendar className="w-3.5 h-3.5" />, label:"Created", value:<span className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{fmtDate(selectedNote.timestamp)}</span> },
                        { icon: <UserCircle className="w-3.5 h-3.5" />, label:"Created By", value:<div className="flex items-center gap-2"><div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background:isDark?"rgba(168,85,247,0.18)":"rgba(168,85,247,0.10)", color:"#A855F7" }}>{selectedNote.author.charAt(0)}</div><span className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{selectedNote.author}</span></div> },
                        { icon: <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.5"/><circle cx="8" cy="8" r="2.5"/></svg>, label:"Type", value:<div className="flex flex-wrap gap-1.5">{NOTE_TYPES.map(t => (<button key={t} onClick={() => (!noteLocked&&!showTrashed)&&setEditNoteType(t)} className="px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all" style={{ fontFamily:FONT, background:editNoteType===t?typeColor[t]?.bg:"transparent", color:editNoteType===t?typeColor[t]?.text:c.muted, border:`1px solid ${editNoteType===t?typeColor[t]?.text+"44":c.border}`, cursor:(noteLocked||showTrashed)?"default":"pointer" }}>{t}</button>))}</div> },
                        { icon: <Lock className="w-3.5 h-3.5" />, label:"Visibility", value:(
  <div className="flex flex-col gap-2 min-w-0">
    <div className="flex flex-wrap gap-1.5">
      {([["Private",Lock,"Only you can see this note"],["Shared",Users,"Visible to everyone in your team"]] as const).map(([v,Ic,tip]) => (
        <button key={v} title={tip} onClick={() => (!noteLocked&&!showTrashed)&&setEditNoteVisibility(v)}
          className="px-2.5 py-0.5 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5"
          style={{ fontFamily:FONT, background:editNoteVisibility===v?"rgba(168,85,247,0.10)":"transparent", color:editNoteVisibility===v?"#A855F7":c.muted, border:`1px solid ${editNoteVisibility===v?"rgba(168,85,247,0.35)":c.border}`, cursor:(noteLocked||showTrashed)?"default":"pointer" }}>
          <Ic className="w-3 h-3" />{v}
        </button>
      ))}
    </div>
  </div>
) },
                        { icon: <Building2 className="w-3.5 h-3.5" />, label:"Agency", value:<span className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{agency.name}</span> },
                      ].map(({ icon, label, value }, idx, arr) => (
                        <div key={label} className="flex items-center px-4 py-2.5" style={{ borderBottom: idx<arr.length-1 ? `1px solid ${c.border}` : undefined }}>
                          <div className="flex items-center gap-2 flex-shrink-0" style={{ width:130, color:c.muted }}>{icon}<span className="text-[12px]" style={{ fontFamily:FONT }}>{label}</span></div>
                          {value}
                        </div>
                      ))}
                    </div>
                    <div className="mb-4" style={{ height:1, background:c.border }} />
                    <textarea value={editNoteContent} onChange={e=>setEditNoteContent(e.target.value)} readOnly={noteLocked||showTrashed}
                      placeholder={(noteLocked||showTrashed)?"":"Start writing your note here…"}
                      className="w-full outline-none resize-none leading-relaxed bg-transparent" rows={22}
                      style={{ fontFamily:FONT, fontSize:13, color:c.text, border:"none", cursor:(noteLocked||showTrashed)?"default":"text" }} />
                  </div>
                  {/* Footer */}
                  <div className="flex items-center justify-between px-6 py-2.5 flex-shrink-0" style={{ borderTop:`1px solid ${c.border}` }}>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px]" style={{ fontFamily:FONT, color:c.muted }}>{editNoteContent.trim().split(/\s+/).filter(Boolean).length} words</span>
                      {noteLocked && <span className="text-[11px] flex items-center gap-1.5" style={{ fontFamily:FONT, color:"#A855F7" }}><Lock className="w-3 h-3" />{lockedBy===CURRENT_USER ? "Locked by you · Read-only for others" : `Locked by ${lockedBy} · Read-only`}</span>}
                      {pinnedIds.has(selectedNote.id) && <span className="text-[11px] flex items-center gap-1" style={{ fontFamily:FONT, color:"#F59E0B" }}><Pin className="w-3 h-3" />Pinned</span>}
                    </div>
                    <span className="text-[11px]" style={{ fontFamily:FONT, color:c.muted }}>{fmtDate(selectedNote.timestamp)}</span>
                  </div>
                </div>
              </div>
              );
            })()}
          </div>
        )}

        {/* ── Accounting tab ── ITC record view + edit. Mirrors the Overview
             tab's single-big-card layout (LabelValue stacks, outlined muted
             Edit button, `grid-cols-3 gap-x-12 gap-y-6`) instead of the
             one-card-per-field grid it used to have — that read as a stat
             dashboard and clashed with the rest of the detail view. */}
        {detailTab === "accounting" && (() => {
          const record = itcRecords?.[agency.code] ?? null;
          const statusColor = (s: ITCStatus) => s === "Active" ? "#73C9B7"
            : s === "Suspended" ? "#F59E0B"
            : s === "Terminated" ? "#EF4444"
            : "#A614C3";

          const SectionHeader = ({ title, first }: { title: string; first?: boolean }) => (
            <div className={first ? "mb-4" : "mt-8 pt-6 mb-4"} style={first ? undefined : { borderTop: `1px solid ${c.border}` }}>
              <p className="text-[11px] font-bold uppercase tracking-wider" style={{ ...font, color: c.muted, letterSpacing: "0.08em" }}>{title}</p>
            </div>
          );

          const YesNo = ({ v }: { v: boolean }) => (
            <span className="text-[13px]" style={{ ...font, color: c.text }}>{v ? "Yes" : "No"}</span>
          );

          // ── Empty state ── (BTIS-internal only; client view skips
          // straight to the statements sub-tabs since ITC record surface
          // is gated to super-admin BTIS users per spec.)
          if (viewMode === "internal" && !record && !itcEditing) {
            return (
              <div className="pb-6">
                <div className="rounded-2xl p-8 mb-8" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                  <h3 className="text-[17px] font-bold mb-6" style={{ ...font, color: c.text }}>ITC Record</h3>
                  <div className="rounded-xl p-10 text-center" style={{ border: `1px dashed ${c.border}` }}>
                    <AlertCircle className="w-9 h-9 mx-auto mb-3" style={{ color: c.muted }} strokeWidth={1.5} />
                    <p className="text-[15px] font-bold mb-1.5" style={{ ...font, color: c.text }}>Not registered in ITC</p>
                    <p className="text-[12.5px] leading-relaxed max-w-[520px] mx-auto" style={{ ...font, color: c.muted }}>
                      <b>{agency.name}</b> exists in Norbielink but has no ITC producer record yet. New agencies are pushed to ITC via <span style={{ fontFamily: "monospace", fontSize: 12 }}>AddProducer</span> after onboarding completes.
                    </p>
                  </div>
                </div>
              </div>
            );
          }

          // ── Edit mode ── (BTIS-internal only)
          if (viewMode === "internal" && itcEditing && itcDraft) {
            const set = <K extends keyof ITCRecord>(k: K, v: ITCRecord[K]) => setItcDraft(prev => prev ? { ...prev, [k]: v } : prev);
            // Tokens the StyledSelect needs — c doesn't ship razz, so provide it here.
            const selectC = {
              text: c.text, muted: c.muted, border: c.border, cardBg: c.cardBg, hoverBg: c.hoverBg,
              razz: "#A614C3", razzTintBg: isDark ? "rgba(168,85,247,0.14)" : "rgba(168,85,247,0.08)",
            };
            // Segmented radio pair — Yes / No pills side by side. Active pill
            // uses the razz gradient border + tinted bg + inner-dot radio.
            const YesNoSelect = <K extends keyof ITCRecord>({ k }: { k: K }) => {
              const v = itcDraft[k] as unknown as boolean;
              const PillBtn = ({ label, active, onClick }: { label: "Yes" | "No"; active: boolean; onClick: () => void }) => (
                <button
                  type="button"
                  onClick={onClick}
                  className="flex items-center gap-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap justify-center transition-all"
                  style={{
                    fontFamily: FONT,
                    width: 120,
                    height: 40,
                    boxSizing: "border-box",
                    border: active ? "1.65px solid transparent" : `1.65px solid ${c.border}`,
                    ...(active
                      ? {
                          backgroundImage: `linear-gradient(88.54deg, rgba(92,46,212,0.06) 0.1%, rgba(166,20,195,0.06) 63.88%), linear-gradient(${c.cardBg}, ${c.cardBg}), linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)`,
                          backgroundOrigin: "padding-box, padding-box, border-box",
                          backgroundClip: "padding-box, padding-box, border-box",
                        }
                      : { background: c.cardBg }),
                    cursor: "pointer",
                  }}
                >
                  <span
                    role="radio"
                    aria-checked={active}
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 transition-all"
                    style={{ border: `2px solid ${active ? "#A855F7" : "#D1D5DB"}`, background: "transparent" }}
                  >
                    {active && <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#A855F7" }} />}
                  </span>
                  {active ? (
                    <span
                      style={{
                        backgroundImage: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {label}
                    </span>
                  ) : (
                    <span style={{ color: c.muted }}>{label}</span>
                  )}
                </button>
              );
              return (
                <div className="flex gap-3">
                  <PillBtn label="Yes" active={v}  onClick={() => set(k, true  as unknown as ITCRecord[K])} />
                  <PillBtn label="No"  active={!v} onClick={() => set(k, false as unknown as ITCRecord[K])} />
                </div>
              );
            };
            // Diff pristine record vs current draft — used by the Review
            // modal. Only fields whose display value differs are listed;
            // booleans are Yes/No so the diff reads naturally to the admin.
            const FIELD_LABELS: [keyof ITCRecord, string][] = [
              ["producerCode", "Producer Code"],
              ["agentOrBroker", "Agent / Broker"],
              ["status", "Status"],
              ["shortName", "Short Name"],
              ["name", "Name"],
              ["dba", "DBA"],
              ["address", "Address"],
              ["city", "City"],
              ["state", "State"],
              ["zip", "Zip"],
              ["telephone", "Telephone"],
              ["email", "Email"],
              ["accountingEmail", "Accounting Email"],
              ["statementEmail", "Statement Email"],
              ["appointmentDate", "Appointment Date"],
              ["licenseNo", "License No"],
              ["licenseExpires", "License Expires"],
              ["eoPolicyNo", "E&O Policy No"],
              ["eoPolicyExpires", "E&O Expires"],
              ["taxId", "Tax ID"],
              ["tax1099Type", "1099 Type"],
              ["tax1099Name", "1099 Name"],
              ["emailStatements", "Email Statements"],
              ["directDeposits", "Direct Deposits"],
              ["directDepositsCommissionOnly", "Direct Deposits (Commission Only)"],
              ["farmersAgent", "Farmers Agent"],
              ["smartChoiceAgent", "Smart Choice Agent"],
              ["piibAgent", "PIIB Agent"],
              ["useConsolidatedBillingId", "Use Consolidated Billing ID"],
              ["consolidatedBillingId", "Consolidated Billing ID"],
              ["isConsolidatedBillingProducer", "Is Consolidated Billing Producer"],
              ["isAffiliatedWith", "Is Affiliated With"],
              ["affiliatedWithId", "Affiliated With ID"],
              ["isAffiliationMain", "Is Affiliation Main"],
              ["subProducerName", "Sub-Producer Name"],
            ];
            const fmt = (v: string | boolean) => typeof v === "boolean" ? (v ? "Yes" : "No") : (v || "—");
            const diff = record
              ? FIELD_LABELS
                  .filter(([k]) => (record[k] as unknown) !== (itcDraft[k] as unknown))
                  .map(([k, label]) => ({ key: k, label, before: fmt(record[k] as string | boolean), after: fmt(itcDraft[k] as string | boolean) }))
              : [];
            return (
              <>
              {itcEditExpanded && <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.35)" }} onClick={() => setItcEditExpanded(false)} />}
              <div className={itcEditExpanded ? "fixed inset-y-0 right-0 z-50 flex flex-col shadow-2xl overflow-y-auto" : "pb-6"}
                style={itcEditExpanded ? { width: "70vw", background: c.cardBg, borderLeft: `1px solid ${c.border}` } : undefined}>
                <div className={itcEditExpanded ? "p-6 mb-6" : "rounded-2xl p-6 mb-6"} style={itcEditExpanded ? { background: c.cardBg } : { background: c.cardBg, border: `1px solid ${c.border}` }}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[17px] font-bold" style={{ ...font, color: c.text }}>ITC Record</h3>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setItcEditExpanded(p => !p)} title={itcEditExpanded ? "Collapse" : "Expand"}
                        className="p-1.5 rounded-md transition-colors" style={{ color: itcEditExpanded ? "#A855F7" : c.muted }}
                        onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                        {itcEditExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                      </button>
                      <button onClick={() => { setItcEditing(false); setItcDraft(null); setItcEditExpanded(false); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                        style={{ ...font, border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB"}`, color: c.text }}
                        onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                        <Pencil className="w-3.5 h-3.5" />Cancel Edit
                      </button>
                    </div>
                  </div>

                  <SectionHeader title="Producer" first />
                  <div className="grid grid-cols-3 gap-6">
                    <div><label style={labelStyle}>Producer Code:</label>
                      <input value={itcDraft.producerCode} onChange={e => set("producerCode", e.target.value)} style={inputStyle} /></div>
                    <div><label style={labelStyle}>Agent / Broker:</label>
                      <StyledSelect<AgentBroker>
                        value={itcDraft.agentOrBroker}
                        onChange={v => set("agentOrBroker", v)}
                        options={["Agent","Broker"] as const}
                        triggerStyle={selectStyle}
                        c={selectC}
                        font={font}
                      /></div>
                    <div><label style={labelStyle}>Status:</label>
                      <StyledSelect<ITCStatus>
                        value={itcDraft.status}
                        onChange={v => set("status", v)}
                        options={["Active","Suspended","Terminated","Pending"] as const}
                        triggerStyle={selectStyle}
                        c={selectC}
                        font={font}
                      /></div>
                    <div><label style={labelStyle}>Short Name:</label>
                      <input value={itcDraft.shortName} onChange={e => set("shortName", e.target.value)} style={inputStyle} /></div>
                    <div><label style={labelStyle}>Name:</label>
                      <input value={itcDraft.name} onChange={e => set("name", e.target.value)} style={inputStyle} /></div>
                    <div><label style={labelStyle}>DBA:</label>
                      <input value={itcDraft.dba} onChange={e => set("dba", e.target.value)} style={inputStyle} /></div>
                  </div>

                  <SectionHeader title="Contact" />
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-3"><label style={labelStyle}>Address:</label>
                      <input value={itcDraft.address} onChange={e => set("address", e.target.value)} style={inputStyle} /></div>
                    <div className="col-span-3" />{/* spacer so Address stays half-width like the Overview edit */}
                    <div className="col-span-2"><label style={labelStyle}>City:</label>
                      <input value={itcDraft.city} onChange={e => set("city", e.target.value)} style={inputStyle} /></div>
                    <div className="col-span-2"><label style={labelStyle}>State:</label>
                      <input value={itcDraft.state} onChange={e => set("state", e.target.value)} maxLength={2} style={inputStyle} /></div>
                    <div className="col-span-2"><label style={labelStyle}>Zip:</label>
                      <input value={itcDraft.zip} onChange={e => set("zip", e.target.value)} style={inputStyle} /></div>
                    <div className="col-span-2"><label style={labelStyle}>Telephone:</label>
                      <input
                        value={itcDraft.telephone}
                        onChange={e => {
                          const d = e.target.value.replace(/\D/g, "").slice(0, 10);
                          const formatted = d.length > 6 ? `${d.slice(0,3)}-${d.slice(3,6)}-${d.slice(6)}`
                            : d.length > 3 ? `${d.slice(0,3)}-${d.slice(3)}`
                            : d;
                          set("telephone", formatted);
                        }}
                        inputMode="numeric"
                        maxLength={12}
                        placeholder="xxx-xxx-xxxx"
                        style={inputStyle}
                      /></div>
                    <div className="col-span-4"><label style={labelStyle}>Email:</label>
                      <input value={itcDraft.email} onChange={e => set("email", e.target.value)} style={inputStyle} /></div>
                    <div className="col-span-3"><label style={labelStyle}>Accounting Email:</label>
                      <input value={itcDraft.accountingEmail} onChange={e => set("accountingEmail", e.target.value)} style={inputStyle} /></div>
                    <div className="col-span-3"><label style={labelStyle}>Statement Email:</label>
                      <input value={itcDraft.statementEmail} onChange={e => set("statementEmail", e.target.value)} style={inputStyle} /></div>
                  </div>

                  <SectionHeader title="Appointment & Compliance" />
                  <div className="grid grid-cols-3 gap-6">
                    <div><label style={labelStyle}>Appointment Date:</label>
                      <input value={itcDraft.appointmentDate} onChange={e => set("appointmentDate", e.target.value)} placeholder="MM/DD/YYYY" style={inputStyle} /></div>
                    <div><label style={labelStyle}>License No:</label>
                      <input value={itcDraft.licenseNo} onChange={e => set("licenseNo", e.target.value)} style={inputStyle} /></div>
                    <div><label style={labelStyle}>License Expires:</label>
                      <input value={itcDraft.licenseExpires} onChange={e => set("licenseExpires", e.target.value)} placeholder="MM/DD/YYYY" style={inputStyle} /></div>
                    <div><label style={labelStyle}>E&amp;O Policy No:</label>
                      <input value={itcDraft.eoPolicyNo} onChange={e => set("eoPolicyNo", e.target.value)} style={inputStyle} /></div>
                    <div><label style={labelStyle}>E&amp;O Expires:</label>
                      <input value={itcDraft.eoPolicyExpires} onChange={e => set("eoPolicyExpires", e.target.value)} placeholder="MM/DD/YYYY" style={inputStyle} /></div>
                    <div /> {/* spacer */}
                    <div><label style={labelStyle}>Tax ID:</label>
                      <input value={itcDraft.taxId} onChange={e => set("taxId", e.target.value)} style={inputStyle} /></div>
                    <div><label style={labelStyle}>1099 Type:</label>
                      <StyledSelect<Tax1099Type>
                        value={itcDraft.tax1099Type}
                        onChange={v => set("tax1099Type", v)}
                        options={["Individual","Corporation","Partnership","LLC"] as const}
                        triggerStyle={selectStyle}
                        c={selectC}
                        font={font}
                      /></div>
                    <div><label style={labelStyle}>1099 Name:</label>
                      <input value={itcDraft.tax1099Name} onChange={e => set("tax1099Name", e.target.value)} style={inputStyle} /></div>
                  </div>

                  <SectionHeader title="Preferences" />
                  <div className="grid grid-cols-3 gap-6">
                    <div><label style={labelStyle}>Email Statements:</label><YesNoSelect k="emailStatements" /></div>
                    <div><label style={labelStyle}>Direct Deposits:</label><YesNoSelect k="directDeposits" /></div>
                    <div><label style={labelStyle}>Direct Deposits (Commission Only):</label><YesNoSelect k="directDepositsCommissionOnly" /></div>
                    <div><label style={labelStyle}>Farmers Agent:</label><YesNoSelect k="farmersAgent" /></div>
                    <div><label style={labelStyle}>Smart Choice Agent:</label><YesNoSelect k="smartChoiceAgent" /></div>
                    <div><label style={labelStyle}>PIIB Agent:</label><YesNoSelect k="piibAgent" /></div>
                  </div>

                  <SectionHeader title="Consolidated Billing" />
                  <div className="grid grid-cols-3 gap-6 items-start">
                    <div><label style={labelStyle}>Use Consolidated Billing ID:</label><YesNoSelect k="useConsolidatedBillingId" /></div>
                    <div><label style={labelStyle}>Consolidated Billing ID:</label>
                      <input value={itcDraft.consolidatedBillingId} onChange={e => set("consolidatedBillingId", e.target.value)} style={{ ...inputStyle, height: 40, boxSizing: "border-box", display: "block" }} /></div>
                    <div><label style={labelStyle}>Is Consolidated Billing Producer:</label><YesNoSelect k="isConsolidatedBillingProducer" /></div>
                  </div>

                  <SectionHeader title="Affiliation" />
                  <div className="grid grid-cols-3 gap-6 items-start">
                    <div><label style={labelStyle}>Is Affiliated With:</label><YesNoSelect k="isAffiliatedWith" /></div>
                    <div><label style={labelStyle}>Affiliated With ID:</label>
                      <input value={itcDraft.affiliatedWithId} onChange={e => set("affiliatedWithId", e.target.value)} style={{ ...inputStyle, height: 40, boxSizing: "border-box", display: "block" }} /></div>
                    <div><label style={labelStyle}>Is Affiliation Main:</label><YesNoSelect k="isAffiliationMain" /></div>
                    <div><label style={labelStyle}>Sub-Producer Name:</label>
                      <input value={itcDraft.subProducerName} onChange={e => set("subProducerName", e.target.value)} style={inputStyle} /></div>
                  </div>

                  {/* Mirror the header action pair at the bottom so the
                      admin doesn't have to scroll back up to submit after
                      editing the tail of a long form. */}
                  <div className="flex items-center justify-between gap-2 mt-8 pt-6" style={{ borderTop: `1px solid ${c.border}` }}>
                    <button onClick={() => { setItcEditing(false); setItcDraft(null); setItcEditExpanded(false); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                      style={{ ...font, border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB"}`, color: c.text }}
                      onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <Pencil className="w-3.5 h-3.5" />Cancel Edit
                    </button>
                    <button onClick={() => setItcReviewing(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white transition-colors"
                      style={{ ...font, background: btnGrad }}>
                      Review Changes &amp; Update
                    </button>
                  </div>
                </div>

                {/* ── Review Changes modal ──
                    Fires on Review Changes button. Lists only fields that
                    differ from the pristine ITC record so the super admin
                    can eyeball the exact payload that Update ITC will push
                    (no "spot the yellow highlight in 40 fields" like the
                    legacy WIN screen). */}
                {itcReviewing && (
                  <>
                    <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.35)" }} onClick={() => setItcReviewing(false)} />
                    <div className="fixed left-1/2 top-1/2 z-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                      style={{ transform: "translate(-50%, -50%)", background: c.cardBg, border: `1px solid ${c.border}`, width: "min(560px, 92vw)", maxHeight: "82vh" }}>
                      <div className="p-6 pb-4">
                        <h3 className="text-[17px] font-bold mb-1" style={{ ...font, color: c.text }}>Review ITC Changes</h3>
                        <p className="text-[12.5px]" style={{ ...font, color: c.muted }}>
                          {diff.length === 0
                            ? "No changes yet — go back and edit a field first."
                            : `${diff.length} ${diff.length === 1 ? "change" : "changes"} will be updated in ITC.`}
                        </p>
                      </div>
                      <div className="overflow-y-auto px-6" style={{ flex: "1 1 auto" }}>
                        {diff.map(d => (
                          <div key={d.key as string} className="py-4" style={{ borderTop: `1px solid ${c.border}` }}>
                            <p className="text-[13px] font-semibold mb-2" style={{ ...font, color: c.text }}>{d.label}</p>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-[11px] uppercase tracking-wider mb-1" style={{ ...font, color: c.muted, letterSpacing: "0.06em" }}>Current ITC value</p>
                                <p className="text-[13px]" style={{ ...font, color: c.muted, textDecoration: "line-through" }}>{d.before}</p>
                              </div>
                              <div>
                                <p className="text-[11px] uppercase tracking-wider mb-1" style={{ ...font, color: c.muted, letterSpacing: "0.06em" }}>New value</p>
                                <p className="text-[13px] font-semibold" style={{ ...font, color: c.text }}>{d.after}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-6 pt-4 flex items-center justify-between gap-2" style={{ borderTop: `1px solid ${c.border}` }}>
                        <button onClick={() => setItcReviewing(false)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                          style={{ ...font, border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB"}`, color: c.text }}
                          onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                          Back to Edit
                        </button>
                        <button
                          disabled={diff.length === 0}
                          onClick={() => {
                            if (itcDraft && setItcRecords) setItcRecords(prev => ({ ...prev, [agency.code]: itcDraft }));
                            setItcReviewing(false);
                            setItcEditing(false);
                            setItcDraft(null);
                            showToast({ title: "ITC updated", description: `${diff.length} ${diff.length === 1 ? "change" : "changes"} pushed to ITC for ${agency.name}.` });
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white transition-colors"
                          style={{ ...font, background: btnGrad, opacity: diff.length === 0 ? 0.5 : 1, cursor: diff.length === 0 ? "not-allowed" : "pointer" }}>
                          Update ITC
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              </>
            );
          }

          // ── View mode ── (clients also enter here — even when the
          // agency has no ITC record — so they can reach the Commission
          // Statement / Statement of Account sub-tabs. The ITC Record
          // card render itself is gated to internal below.)
          if (record || viewMode === "client") {
            const statusBadge = record ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[12px] font-semibold"
                style={{ background: `${statusColor(record.status)}1A`, color: statusColor(record.status) }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor(record.status) }} />
                {record.status}
              </span>
            ) : null;
            const fullAddr = record
              ? [record.address, [record.city, record.state].filter(Boolean).join(", "), record.zip].filter(Boolean).join(" · ")
              : "";
            // Pending updates = fields that were edited on the Overview
            // tab (or on the external agent side) but haven't been pushed
            // to ITC yet. Compares agency detail (source of truth for
            // Norbielink) against the frozen ITC record, with light
            // normalization so pure formatting differences (phone digits,
            // Name casing) don't false-positive.
            const norm = (label: string, v: string) => {
              const s = (v ?? "").trim();
              if (label === "Telephone") return s.replace(/\D/g, "");
              if (label === "Name" || label === "DBA") return s.toLowerCase();
              return s;
            };
            const ITC_AGENCY_MAP: Array<{ key: keyof ITCRecord; label: string; agencyValue: string }> = record ? [
              { key: "name",            label: "Name",             agencyValue: effectiveAgency.name },
              { key: "address",         label: "Address",          agencyValue: effectiveAgency.street },
              { key: "city",            label: "City",             agencyValue: effectiveAgency.city },
              { key: "state",           label: "State",            agencyValue: effectiveAgency.state },
              { key: "zip",             label: "Zip",              agencyValue: effectiveAgency.zip },
              { key: "telephone",       label: "Telephone",        agencyValue: effectiveAgency.phone },
              { key: "email",           label: "Email",            agencyValue: effectiveAgency.contactEmail },
              { key: "licenseNo",       label: "License No",       agencyValue: effectiveAgency.licenseNo },
              { key: "licenseExpires",  label: "License Expires",  agencyValue: effectiveAgency.licenseExp },
              // NPN removed from the review flow per 2026-10-27 meeting:
              // it's auto-populated from NIPR in the background, never
              // edited by agent or Shannon, so it skips Pending Updates
              // entirely. See OVERRIDE_KEY_FOR_ITC for the full note.
              { key: "eoPolicyNo",      label: "E&O Policy No",    agencyValue: effectiveAgency.eoPolicyNo },
              { key: "eoPolicyExpires", label: "E&O Policy Expires", agencyValue: effectiveAgency.eoExp },
            ] : [];
            const pendingUpdates = record
              ? ITC_AGENCY_MAP
                  .map(m => ({ ...m, itcValue: String(record[m.key] ?? "") }))
                  .filter(m => norm(m.label, m.agencyValue) !== norm(m.label, m.itcValue))
              : [];
            const pendingKeys = new Set(pendingUpdates.map(p => p.key as string));
            return (
              <div className="pb-6">
                {/* Sub-tab toolbar — same segmented-control language as
                    the Documents tab. Lets users jump directly to
                    Statements without scrolling past the ITC Record. */}
                <div
                  className="flex items-center gap-0.5 pb-3 mb-5"
                  style={{ borderBottom: `1px solid ${c.border}` }}
                >
                  {([
                    ...(viewMode === "internal"
                      ? [{ key: "record" as const, label: "ITC Record" }]
                      : []),
                    { key: "comm"   as const, label: "Commission Statement" },
                    { key: "soa"    as const, label: "Statement of Account" },
                  ]).map(t => {
                    const active = accountingView === t.key;
                    return (
                      <button
                        key={t.key}
                        onClick={() => setAccountingView(t.key)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all whitespace-nowrap"
                        style={{
                          fontFamily: FONT,
                          background: active ? (isDark ? "rgba(255,255,255,0.06)" : "#F3F4F6") : "transparent",
                          color: active ? c.text : c.muted,
                        }}
                        onMouseEnter={e => { if (!active) e.currentTarget.style.background = c.hoverBg; }}
                        onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>


                {/* Pending-updates alert — surfaces Overview / external-agent
                    edits that haven't been synced to ITC yet, so the super
                    admin knows the frozen ITC record is now stale and can
                    review/push in one action. */}
                {viewMode === "internal" && isSuperAdmin && record && accountingView === "record" && pendingUpdates.length > 0 && (
                  <div className="rounded-xl p-4 mb-6 flex items-start gap-3"
                    style={{ background: isDark ? "rgba(255,255,255,0.04)" : "#F9FAFB", border: `1px solid ${c.border}` }}>
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <defs>
                        <linearGradient id="alert-razz-pending" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="0">
                          {/* Dark-mode razz needs lighter stops so the
                              gradient doesn't disappear into #0F1120. */}
                          <stop offset="0%" stopColor={isDark ? "#C9A6FF" : "#5C2ED4"} />
                          <stop offset="100%" stopColor={isDark ? "#E68BF2" : "#A614C3"} />
                        </linearGradient>
                      </defs>
                      <circle cx="12" cy="12" r="10" stroke="url(#alert-razz-pending)" />
                      <line x1="12" x2="12" y1="8" y2="12" stroke="url(#alert-razz-pending)" />
                      <line x1="12" x2="12.01" y1="16" y2="16" stroke="url(#alert-razz-pending)" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold" style={{
                        ...font,
                        backgroundImage: isDark
                          ? "linear-gradient(88.54deg, #C9A6FF 0.1%, #E68BF2 63.88%)"
                          : "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}>
                        Pending updates from recent edits
                      </div>
                      <div className="text-[12px] mt-0.5" style={{ ...font, color: c.muted }}>
                        The agency info was edited — the ITC record is now behind. Review the changes and push to ITC.
                      </div>
                    </div>
                    <button onClick={() => setPendingItcOpen(true)}
                      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white transition-all whitespace-nowrap"
                      style={{ ...font, background: btnGrad }}
                      onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.10)")}
                      onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
                      Review Updates
                    </button>
                  </div>
                )}
                {viewMode === "internal" && record && accountingView === "record" && (
                <>
                {overviewExpanded && <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.35)" }} onClick={() => setOverviewExpanded(false)} />}
                <div className={overviewExpanded ? "fixed inset-y-0 right-0 z-50 flex flex-col shadow-2xl overflow-y-auto" : ""}
                  style={overviewExpanded ? { width: "70vw", background: c.cardBg, borderLeft: `1px solid ${c.border}` } : undefined}>
                <div className={overviewExpanded ? "p-8 mb-8" : "rounded-2xl p-8 mb-8"}
                  style={overviewExpanded ? { background: c.cardBg } : { background: c.cardBg, border: `1px solid ${c.border}` }}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[17px] font-bold" style={{ ...font, color: c.text }}>ITC Record</h3>
                    <button onClick={() => setOverviewExpanded(p => !p)} title={overviewExpanded ? "Collapse" : "Expand"}
                      className="p-1.5 rounded-md transition-colors" style={{ color: overviewExpanded ? "#A855F7" : c.muted }}
                      onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      {overviewExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                  </div>

                  <SectionHeader title="Producer" first />
                  <div className="grid grid-cols-3 gap-x-12 gap-y-6">
                    <LabelValue label="Producer Code" value={record.producerCode} />
                    <LabelValue label="Agent / Broker" value={record.agentOrBroker} />
                    <div>
                      <p className="text-[13px] font-semibold mb-2" style={{ ...font, color: c.text }}>Status:</p>
                      {statusBadge}
                    </div>
                    <LabelValue label="Short Name" value={record.shortName || "—"} />
                    <div className="col-span-2">
                      <p className="text-[13px] font-semibold mb-1" style={{ ...font, color: c.text }}>Name:</p>
                      <p className="text-[13px]" style={{ ...font, color: c.muted }}>{record.name}</p>
                    </div>
                    <div className="col-span-3">
                      <p className="text-[13px] font-semibold mb-1" style={{ ...font, color: c.text }}>DBA:</p>
                      <p className="text-[13px]" style={{ ...font, color: c.muted }}>{record.dba || "—"}</p>
                    </div>
                  </div>

                  <SectionHeader title="Contact" />
                  <div className="grid grid-cols-3 gap-x-12 gap-y-6">
                    <div className="col-span-3">
                      <p className="text-[13px] font-semibold mb-1" style={{ ...font, color: c.text }}>Address:</p>
                      <p className="text-[13px]" style={{ ...font, color: c.muted }}>{fullAddr || "—"}</p>
                    </div>
                    <LabelValue label="Telephone" value={(() => {
                      const d = (record.telephone || "").replace(/\D/g, "");
                      return d.length === 10 ? `${d.slice(0,3)}-${d.slice(3,6)}-${d.slice(6)}` : (record.telephone || "—");
                    })()} />
                    <div className="col-span-2">
                      <p className="text-[13px] font-semibold mb-1" style={{ ...font, color: c.text }}>Email:</p>
                      <p className="text-[13px]" style={{ ...font, color: c.muted }}>{record.email || "—"}</p>
                    </div>
                    <LabelValue label="Accounting Email" value={record.accountingEmail || "—"} />
                    <LabelValue label="Statement Email" value={record.statementEmail || "—"} />
                  </div>

                  <SectionHeader title="Appointment & Compliance" />
                  <div className="grid grid-cols-3 gap-x-12 gap-y-6">
                    <LabelValue label="Appointment Date" value={record.appointmentDate} />
                    <LabelValue label="License No" value={record.licenseNo || "—"} />
                    <LabelValue label="License Expires" value={record.licenseExpires || "—"} />
                    <LabelValue label="E&O Policy No" value={record.eoPolicyNo || "—"} />
                    <LabelValue label="E&O Expires" value={record.eoPolicyExpires || "—"} />
                    <div /> {/* spacer */}
                    <LabelValue label="Tax ID" value={record.taxId || "—"} />
                    <LabelValue label="1099 Type" value={record.tax1099Type} />
                    <LabelValue label="1099 Name" value={record.tax1099Name || "—"} />
                  </div>

                  <SectionHeader title="Preferences" />
                  <div className="grid grid-cols-3 gap-x-12 gap-y-6">
                    <LabelValue label="Email Statements"                    value={<YesNo v={record.emailStatements} />} />
                    <LabelValue label="Direct Deposits"                     value={<YesNo v={record.directDeposits} />} />
                    <LabelValue label="Direct Deposits (Commission Only)"   value={<YesNo v={record.directDepositsCommissionOnly} />} />
                    <LabelValue label="Farmers Agent"                       value={<YesNo v={record.farmersAgent} />} />
                    <LabelValue label="Smart Choice Agent"                  value={<YesNo v={record.smartChoiceAgent} />} />
                    <LabelValue label="PIIB Agent"                          value={<YesNo v={record.piibAgent} />} />
                  </div>

                  <SectionHeader title="Consolidated Billing" />
                  <div className="grid grid-cols-3 gap-x-12 gap-y-6">
                    <LabelValue label="Use Consolidated Billing ID"        value={<YesNo v={record.useConsolidatedBillingId} />} />
                    <LabelValue label="Consolidated Billing ID"            value={record.consolidatedBillingId || "—"} />
                    <LabelValue label="Is Consolidated Billing Producer"   value={<YesNo v={record.isConsolidatedBillingProducer} />} />
                  </div>

                  <SectionHeader title="Affiliation" />
                  <div className="grid grid-cols-3 gap-x-12 gap-y-6">
                    <LabelValue label="Is Affiliated With"      value={<YesNo v={record.isAffiliatedWith} />} />
                    <LabelValue label="Affiliated With ID"      value={record.affiliatedWithId || "—"} />
                    <LabelValue label="Is Affiliation Main"     value={<YesNo v={record.isAffiliationMain} />} />
                    <div className="col-span-3">
                      <p className="text-[13px] font-semibold mb-1" style={{ ...font, color: c.text }}>Sub-Producer Name:</p>
                      <p className="text-[13px]" style={{ ...font, color: c.muted }}>{record.subProducerName || "—"}</p>
                    </div>
                  </div>
                </div>
                </div>
                </>
                )}

                {/* ── Pending ITC Updates modal ──
                    Same review-first pattern as Review Changes, but the
                    diff direction is inverted: Current ITC on the left,
                    New value (from the Overview edit) on the right. Push
                    to ITC applies the agency values field-by-field. */}
                {pendingItcOpen && record && (
                  <>
                    <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.35)" }} onClick={requestClosePendingItc} />
                    {/* When the supporting-doc preview slides in on the right,
                        park the pending-updates modal on the left half so the
                        reviewer can compare field-for-field without flipping
                        between overlays. Center otherwise. */}
                    <div className="fixed top-1/2 z-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-200"
                      style={{
                        // Compare-mode: center within the LEFT half of the
                        // viewport (preview panel occupies the right 50vw).
                        // Center of the whole viewport otherwise.
                        left: previewDoc ? "25vw" : "50%",
                        transform: "translate(-50%, -50%)",
                        background: c.cardBg,
                        border: `1px solid ${c.border}`,
                        width: previewDoc ? "min(460px, 46vw)" : "min(560px, 92vw)",
                        maxHeight: "82vh",
                      }}>
                      <div className="p-6 pb-4 flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="text-[17px] font-bold mb-1" style={{ ...font, color: c.text }}>Pending Updates from Agency Info</h3>
                          <p className="text-[12.5px]" style={{ ...font, color: c.muted }}>
                            Fields out of sync with ITC. Review and push.
                          </p>
                        </div>
                        <button
                          onClick={requestClosePendingItc}
                          title="Close — I'll review this later"
                          aria-label="Close"
                          className="flex-shrink-0 p-1.5 rounded-md transition-colors"
                          style={{ color: c.muted }}
                          onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="overflow-y-auto px-6" style={{ flex: "1 1 auto" }}>
                        {(() => {
                          // Fields sharing a supporting doc (W-9 or License)
                          // get merged into one bucket so the doc card only
                          // renders once per group — no more four "Supporting
                          // W-9" strips for Address/City/State/Zip.
                          const docFor = (k: string): AgencyDocCategory | null =>
                            k === "licenseNo" || k === "licenseExpires" ? "license"
                            : (k === "name" || k === "address" || k === "city" || k === "state" || k === "zip" || k === "taxId") ? "w9"
                            : null;
                          type Bucket = { cat: AgencyDocCategory | null; items: typeof pendingUpdates };
                          const buckets: Bucket[] = [];
                          for (const p of pendingUpdates) {
                            const cat = docFor(p.key as string);
                            const last = buckets[buckets.length - 1];
                            if (last && last.cat === cat) last.items.push(p);
                            else buckets.push({ cat, items: [p] });
                          }
                          return buckets.map((bucket, bIdx) => {
                            const supportingDoc = bucket.cat
                              ? agencyDocs.find(d => d.category === bucket.cat && !d.archived && !d.trashed) ?? null
                              : null;
                            return (
                              <div key={bIdx} className="py-4" style={{ borderTop: `1px solid ${c.border}` }}>
                                {(() => {
                                  // Within a bucket, further group fields that belong to the
                                  // same logical artifact (full street address, license block)
                                  // so ONE Reject covers the whole block instead of showing
                                  // four separate "Reject" buttons for one address edit.
                                  const groupKey = (k: string): string => {
                                    if (k === "address" || k === "city" || k === "state" || k === "zip") return "address";
                                    if (k === "licenseNo" || k === "licenseExpires") return "license";
                                    return `solo:${k}`;
                                  };
                                  const GROUP_TITLE: Record<string, string> = { address: "Address", license: "License" };
                                  // Sub-row eyebrow for the primary street line inside the
                                  // address block — avoids "Address › Address · Current"
                                  // reading as a duplicate.
                                  const SUB_LABEL: Record<string, string> = { address: "Street" };
                                  type SubGroup = { gid: string; items: typeof bucket.items };
                                  const subs: SubGroup[] = [];
                                  for (const p of bucket.items) {
                                    const gid = groupKey(p.key as string);
                                    const last = subs[subs.length - 1];
                                    if (last && last.gid === gid) last.items.push(p);
                                    else subs.push({ gid, items: [p] });
                                  }
                                  return subs.map((sub, sIdx) => {
                                    const isGroup = sub.items.length > 1;
                                    const gid = sub.gid;
                                    const groupTitle = isGroup ? (GROUP_TITLE[gid] ?? sub.items[0].label) : sub.items[0].label;
                                    const targetId = isGroup ? `grp:${gid}` : (sub.items[0].key as string);
                                    const isRejecting = rejectingKey === targetId;
                                    if (isRejecting) {
                                      return (
                                        <div key={targetId}
                                          className="rounded-lg p-3"
                                          style={{ background: isDark ? "rgba(220,38,38,0.10)" : "rgba(220,38,38,0.05)", border: `1px solid ${isDark ? "rgba(248,113,113,0.35)" : "rgba(220,38,38,0.28)"}`, marginTop: sIdx === 0 ? 0 : 16 }}>
                                          <div className="flex items-center justify-between mb-2">
                                            <p className="text-[12px] font-semibold" style={{ ...font, color: isDark ? "#FCA5A5" : "#B91C1C" }}>
                                              Reject {isGroup ? "these changes" : "this change"}
                                            </p>
                                            <button onClick={() => { setRejectingKey(null); setRejectReason(""); }}
                                              title="Cancel"
                                              className="p-1 rounded transition-colors"
                                              style={{ color: c.muted }}
                                              onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                                              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                                              <X className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                          {isGroup ? (
                                            <div className="text-[11px] mb-2" style={{ ...font, color: c.muted }}>
                                              <p className="mb-1.5">
                                                All {sub.items.length} {groupTitle.toLowerCase()} fields will revert to their ITC values:
                                              </p>
                                              <ul className="space-y-0.5 pl-3">
                                                {sub.items.map(i => (
                                                  <li key={i.key as string}>
                                                    <span className="font-medium" style={{ color: c.text }}>{SUB_LABEL[i.key as string] ?? i.label}</span>: <span style={{ textDecoration: "line-through" }}>{i.agencyValue}</span> → <span className="font-semibold" style={{ color: c.text }}>{i.itcValue || "—"}</span>
                                                  </li>
                                                ))}
                                              </ul>
                                              <p className="mt-1.5">
                                                The agency contact (<span className="font-semibold" style={{ color: c.text }}>{effectiveAgency.contactEmail || "—"}</span>) will be notified and the reason logged for audit.
                                              </p>
                                            </div>
                                          ) : (
                                            <p className="text-[11px] mb-2" style={{ ...font, color: c.muted }}>
                                              {sub.items[0].label}: <span style={{ textDecoration: "line-through" }}>{sub.items[0].agencyValue}</span> → reverts to <span className="font-semibold" style={{ color: c.text }}>{sub.items[0].itcValue || "—"}</span>. The agency contact (<span className="font-semibold" style={{ color: c.text }}>{effectiveAgency.contactEmail || "—"}</span>) will be notified and the reason logged for audit.
                                            </p>
                                          )}
                                          <textarea
                                            value={rejectReason}
                                            onChange={e => setRejectReason(e.target.value)}
                                            placeholder={isGroup ? `Reason for rejection (e.g. ${groupTitle.toLowerCase()} doesn't match uploaded W-9)…` : "Reason for rejection (e.g. address doesn't match uploaded W-9)…"}
                                            rows={2}
                                            className="w-full text-[12px] outline-none resize-none"
                                            style={{ ...font, color: c.text, background: c.cardBg, border: `1px solid ${c.border}`, borderRadius: 6, padding: "6px 8px" }}
                                          />
                                          <div className="flex justify-end gap-2 mt-2">
                                            <button onClick={() => { setRejectingKey(null); setRejectReason(""); }}
                                              className="px-3 py-1.5 rounded-md text-[11px] font-semibold transition-colors"
                                              style={{ ...font, color: c.text, border: `1px solid ${c.borderStrong}`, background: "transparent" }}
                                              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                                              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                                              Cancel
                                            </button>
                                            <button
                                              disabled={!rejectReason.trim()}
                                              onClick={() => {
                                                const reason = rejectReason.trim();
                                                if (!reason) return;
                                                const keys = sub.items.map(i => i.key as string);
                                                const overrideKeys = keys.map(kk => OVERRIDE_KEY_FOR_ITC[kk]).filter(Boolean) as Array<keyof AgencyFieldOverride>;
                                                if (overrideKeys.length > 0) {
                                                  setAgencyFieldOverride(prev => {
                                                    const next = { ...prev };
                                                    overrideKeys.forEach(ok => { delete next[ok]; });
                                                    return next;
                                                  });
                                                }
                                                setPendingOverrides(prev => {
                                                  const next = { ...prev };
                                                  keys.forEach(kk => { delete next[kk]; });
                                                  return next;
                                                });
                                                setRejectingKey(null);
                                                setRejectReason("");
                                                showToast({
                                                  title: isGroup ? `${groupTitle} changes rejected` : "Change rejected",
                                                  description: "The agency contact has been notified.",
                                                });
                                              }}
                                              className="px-3 py-1.5 rounded-md text-[11px] font-semibold text-white transition-all"
                                              style={{ ...font, background: "#DC2626", opacity: rejectReason.trim() ? 1 : 0.5, cursor: rejectReason.trim() ? "pointer" : "not-allowed" }}
                                              onMouseEnter={e => { if (rejectReason.trim()) e.currentTarget.style.filter = "brightness(1.10)"; }}
                                              onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
                                              {isGroup ? "Reject all" : "Reject change"}
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    }
                                    const hasAnyOverride = sub.items.some(i => Boolean(OVERRIDE_KEY_FOR_ITC[i.key as string]));
                                    return (
                                      <div key={gid + sIdx} style={{ marginTop: sIdx === 0 ? 0 : 16 }}>
                                        <div className="flex items-center justify-between mb-2">
                                          <p className="text-[13px] font-semibold" style={{ ...font, color: c.text }}>{groupTitle}</p>
                                          {hasAnyOverride && (
                                            <button
                                              title={`Reject — revert ${isGroup ? `all ${groupTitle} fields` : groupTitle} to the ITC value and notify the agency`}
                                              onClick={() => { setRejectingKey(targetId); setRejectReason(""); }}
                                              className="flex items-center gap-1 text-[11px] font-medium transition-colors px-2 py-1 rounded-md"
                                              style={{ ...font, color: c.muted }}
                                              onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = "#DC2626"; }}
                                              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}
                                            >
                                              <X className="w-3 h-3" />Reject{isGroup ? " all" : ""}
                                            </button>
                                          )}
                                        </div>
                                        {sub.items.map((p, rIdx) => {
                                          const k = p.key as string;
                                          const editedValue = pendingOverrides[k] ?? p.agencyValue;
                                          const subLabel = isGroup ? (SUB_LABEL[k] ?? p.label) : null;
                                          return (
                                            <div key={k} className="flex items-center gap-3" style={{ marginTop: rIdx === 0 ? 0 : 10 }}>
                                              <div className="flex-1 min-w-0">
                                                <p className="text-[10px] uppercase tracking-wider mb-1" style={{ ...font, color: c.muted, letterSpacing: "0.06em" }}>
                                                  {isGroup ? `${subLabel} · Current` : "Current"}
                                                </p>
                                                <p className="text-[13px] truncate" style={{ ...font, color: c.muted, textDecoration: "line-through" }}>{p.itcValue || "—"}</p>
                                              </div>
                                              <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 mt-4" style={{ color: c.muted }} />
                                              <div className="flex-1 min-w-0">
                                                <p className="text-[10px] uppercase tracking-wider mb-1" style={{ ...font, color: c.muted, letterSpacing: "0.06em" }}>
                                                  {isGroup ? `${subLabel} · New` : "New"}
                                                </p>
                                                <input
                                                  value={editedValue}
                                                  onChange={e => setPendingOverrides(prev => ({ ...prev, [k]: e.target.value }))}
                                                  className="w-full text-[13px] font-semibold"
                                                  style={{ ...font, color: c.text, background: c.cardBg, border: `1px solid ${c.border}`, borderRadius: 6, padding: "5px 8px", outline: "none" }}
                                                />
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    );
                                  });
                                })()}
                                {supportingDoc && (
                                  <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg"
                                    style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB", border: `1px solid ${c.border}` }}>
                                    <Paperclip className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#A614C3" }} />
                                    <div className="flex-1 min-w-0">
                                      <div className="text-[11px] font-medium truncate" style={{ ...font, color: c.text }}>{supportingDoc.name}</div>
                                      <div className="text-[10px]" style={{ ...font, color: c.muted }}>
                                        Supporting {bucket.cat === "license" ? "License copy" : "W-9"} for {bucket.items.length === 1 ? bucket.items[0].label : `${bucket.items.length} fields`}
                                      </div>
                                    </div>
                                    <button title="Preview"
                                      onClick={() => setPreviewDoc({ id: supportingDoc.id, category: supportingDoc.category, name: supportingDoc.name, date: supportingDoc.date, archived: supportingDoc.archived, trashed: supportingDoc.trashed })}
                                      className="p-1.5 rounded transition-colors flex-shrink-0"
                                      style={{ color: c.muted }}
                                      onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>
                                    <button title="Download"
                                      onClick={() => showToast({ title: `Downloading ${supportingDoc.name}`, description: `${bucket.cat === "license" ? "License copy" : "W-9"} · ${supportingDoc.date}` })}
                                      className="p-1.5 rounded transition-colors flex-shrink-0"
                                      style={{ color: c.muted }}
                                      onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                                      <Download className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          });
                        })()}
                      </div>
                      <div className="p-6 pt-4 flex items-center justify-end gap-2" style={{ borderTop: `1px solid ${c.border}` }}>
                        <button
                          onClick={() => {
                            if (setItcRecords) setItcRecords(prev => {
                              const cur = prev[agency.code];
                              if (!cur) return prev;
                              const next = { ...cur };
                              pendingUpdates.forEach(p => {
                                const k = p.key as string;
                                (next as unknown as Record<string, string>)[k] = pendingOverrides[k] ?? p.agencyValue;
                              });
                              return { ...prev, [agency.code]: next };
                            });
                            const count = pendingUpdates.length;
                            closePendingItc();
                            showToast({ title: "ITC updated", description: `${count} ${count === 1 ? "change" : "changes"} pushed to ITC for ${effectiveAgency.name}.` });
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white transition-colors"
                          style={{ ...font, background: btnGrad }}>
                          Push to ITC
                        </button>
                      </div>
                    </div>
                    {/* Close-confirmation. Sits on top of the Pending Updates
                        modal (z-[55]) so Save for later / Discard are the only
                        way out — backdrop click here is intentionally inert to
                        avoid a second accidental discard. */}
                    {pendingCloseConfirm && (() => {
                      const stagedCount = Object.keys(pendingOverrides).length;
                      return (
                        <>
                          <div className="fixed inset-0 z-[55]" style={{ background: "rgba(0,0,0,0.45)" }} />
                          <div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="pending-close-title"
                            className="fixed top-1/2 left-1/2 z-[60] rounded-2xl shadow-2xl"
                            style={{
                              transform: "translate(-50%, -50%)",
                              background: c.cardBg,
                              border: `1px solid ${c.border}`,
                              width: "min(420px, 90vw)",
                            }}
                          >
                            <div className="p-5 pb-3 flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <h4 id="pending-close-title" className="text-[14px] font-bold mb-1.5" style={{ ...font, color: c.text }}>
                                  Unpushed changes
                                </h4>
                                <p className="text-[12.5px] leading-relaxed" style={{ ...font, color: c.muted }}>
                                  You have <span className="font-semibold" style={{ color: c.text }}>{stagedCount}</span> accepted {stagedCount === 1 ? "change" : "changes"} that {stagedCount === 1 ? "hasn't" : "haven't"} been pushed to ITC yet. Save {stagedCount === 1 ? "it" : "them"} for later, or discard?
                                </p>
                              </div>
                              <button
                                onClick={keepEditingPendingItc}
                                title="Keep editing"
                                aria-label="Keep editing"
                                className="flex-shrink-0 p-1.5 rounded-md transition-colors"
                                style={{ color: c.muted }}
                                onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="px-5 pb-5 flex items-center justify-between gap-2">
                              <button
                                onClick={saveForLaterPendingItc}
                                className="px-3 py-1.5 rounded-md text-[12px] font-semibold transition-colors"
                                style={{ ...font, color: c.text, background: "transparent", border: `1px solid ${c.border}` }}
                                onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                              >
                                Save for later
                              </button>
                              <button
                                onClick={closePendingItc}
                                className="px-3 py-1.5 rounded-md text-[12px] font-semibold text-white transition-all"
                                style={{ ...font, background: "#DC2626" }}
                                onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.10)"; }}
                                onMouseLeave={e => { e.currentTarget.style.filter = "none"; }}
                              >
                                Discard changes
                              </button>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </>
                )}

                {/* Side-drawer preview for pending-updates supporting docs.
                    The Documents-tab preview slots don't render here, so this
                    dedicated overlay lets the reviewer inspect the W-9 or
                    License copy without leaving the Accounting tab. Placeholder
                    body mirrors the Documents-tab preview so styling stays
                    consistent across surfaces. */}
                {previewDoc && (() => {
                  const CAT_LABEL: Record<AgencyDocCategory, string> = { bor: "Broker of Record", w9: "W-9", license: "License", agreement: "Agreements", other: "Other", eo: "E&O Certificate" };
                  return (
                    <div className="fixed inset-y-0 right-0 z-[60] flex" style={{ width: "50vw", minWidth: 480 }}>
                      {/* Skip the dim overlay when the pending-updates modal
                          is also open — it sits on the left half by design,
                          and dimming it would defeat the side-by-side compare. */}
                      {!pendingItcOpen && (
                        <div className="flex-1 cursor-pointer" onClick={() => setPreviewDoc(null)} style={{ background: "rgba(0,0,0,0.25)" }} />
                      )}
                      <div className="flex flex-col h-full shadow-2xl" style={{ width: "100%", background: c.cardBg, borderLeft: `1px solid ${c.border}` }}>
                        <div className="flex items-center justify-between px-6 py-3 flex-shrink-0"
                          style={{ borderBottom: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.02)" : "rgba(249,250,251,0.80)" }}>
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="w-3.5 h-3.5 flex-shrink-0" style={{ color: c.muted }} />
                            <span className="text-[11px] flex-shrink-0" style={{ fontFamily: FONT, color: c.muted }}>Supporting doc</span>
                            <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: c.muted }} />
                            <span className="text-[11px] flex-shrink-0" style={{ fontFamily: FONT, color: c.muted }}>{CAT_LABEL[previewDoc.category]}</span>
                            <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: c.muted }} />
                            <span className="text-[12px] font-semibold truncate max-w-[420px]" style={{ fontFamily: FONT, color: c.text }}>{previewDoc.name}</span>
                          </div>
                          <div className="flex items-center gap-0.5 flex-shrink-0">
                            <button title="Download"
                              onClick={() => showToast({ title: `Downloading ${previewDoc.name}`, description: `${CAT_LABEL[previewDoc.category]} · ${previewDoc.date}` })}
                              className="p-1.5 rounded-md transition-colors" style={{ color: c.muted }}
                              onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            <button title="Close" onClick={() => setPreviewDoc(null)} className="p-1.5 rounded-md transition-colors" style={{ color: c.muted }}
                              onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 px-6 py-3 flex-shrink-0 text-[12px]" style={{ ...font, color: c.muted, borderBottom: `1px solid ${c.border}` }}>
                          <span className="flex items-center gap-1.5"><FolderOpen className="w-3.5 h-3.5" style={{ color: "#A855F7" }} />{CAT_LABEL[previewDoc.category]}</span>
                          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{previewDoc.date}</span>
                        </div>
                        <div className="flex-1 min-h-0 overflow-auto p-6" style={{ background: isDark ? "rgba(255,255,255,0.02)" : "#F9FAFB" }}>
                          <div className="mx-auto rounded shadow-sm flex flex-col items-center justify-center"
                            style={{ background: "#FFFFFF", border: `1px solid ${c.border}`, aspectRatio: "8.5 / 11", maxWidth: 560, minHeight: 560, fontFamily: FONT }}>
                            <FileText className="w-16 h-16 mb-3" style={{ color: "#D1D5DB" }} />
                            <div className="text-[13px] font-semibold mb-1" style={{ color: "#374151" }}>{previewDoc.name}</div>
                            <div className="text-[11px]" style={{ color: "#9CA3AF" }}>Preview not available in demo</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* ── Statements card — 12-month rolling archive.
                    Phase 1 scope: two statements per month (commission +
                    statement of account), each in PDF and Excel. Source is
                    the ITC WIN J-drive path. Older records live with
                    the accounting team. */}
                {(accountingView === "comm" || accountingView === "soa") && (() => {
                  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                  const anchor = { y: 2026, m: 10 }; // Nov 2026
                  type Stmt = { id: string; type: "comm" | "soa"; label: string; year: number; monthIdx: number; issued: string; sizePdf: string; sizeXls: string };
                  const all: Stmt[] = [];
                  for (let i = 0; i < 12; i++) {
                    let m = anchor.m - i;
                    let y = anchor.y;
                    while (m < 0) { m += 12; y -= 1; }
                    const monthLabel = `${MONTHS[m]} ${y}`;
                    const lastDay = new Date(y, m + 1, 0).getDate();
                    all.push({
                      id: `comm-${y}-${m}`, type: "comm",
                      label: `Commission Statement — ${monthLabel}`,
                      year: y, monthIdx: m,
                      issued: `${MONTHS[m]} 14, ${y}`,
                      sizePdf: `${180 + ((i * 37) % 90)} KB`,
                      sizeXls: `${52 + ((i * 13) % 40)} KB`,
                    });
                    all.push({
                      id: `soa-${y}-${m}`, type: "soa",
                      label: `Statement of Account — ${monthLabel}`,
                      year: y, monthIdx: m,
                      issued: `${MONTHS[m]} ${lastDay}, ${y}`,
                      sizePdf: `${210 + ((i * 41) % 110)} KB`,
                      sizeXls: `${64 + ((i * 17) % 48)} KB`,
                    });
                  }

                  const TYPE_LABEL: Record<"comm" | "soa", string> = { comm: "Commission Statement", soa: "Statement of Account" };
                  const q = stmtSearch.trim().toLowerCase();
                  const filtered = all.filter(s =>
                    (stmtFilterTypes.size === 0 || stmtFilterTypes.has(s.type)) &&
                    (!q || s.label.toLowerCase().includes(q) || s.issued.toLowerCase().includes(q))
                  );
                  filtered.sort((a, b) => {
                    const ka = a.year * 12 + a.monthIdx;
                    const kb = b.year * 12 + b.monthIdx;
                    return stmtSortDir === "desc" ? kb - ka : ka - kb;
                  });
                  const groupComm = filtered.filter(s => s.type === "comm");
                  const groupSoa  = filtered.filter(s => s.type === "soa");
                  const toggleSel = (id: string) => setSelectedStmts(prev => {
                    const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s;
                  });
                  const toggleFilterType = (t: "comm" | "soa") => setStmtFilterTypes(prev => {
                    const s = new Set(prev); s.has(t) ? s.delete(t) : s.add(t); return s;
                  });
                  const clearSel = () => setSelectedStmts(new Set());
                  const closeDropdowns = () => { setStmtFilterOpen(false); setStmtSortOpen(false); setStmtDownloadFor(null); };
                  // Refs to each folder card so the cadence chips can smooth-scroll to them.
                  const groupRefs: Record<"comm" | "soa", HTMLDivElement | null> = { comm: null, soa: null };
                  const jumpTo = (type: "comm" | "soa") => {
                    groupRefs[type]?.scrollIntoView({ behavior: "smooth", block: "start" });
                  };

                  const StmtRow = ({ s, isLast }: { s: Stmt; isLast: boolean }) => {
                    const selected = selectedStmts.has(s.id);
                    const isPreview = stmtPreview?.id === s.id;
                    return (
                      <div
                        className="flex items-center gap-3 px-5 py-2 transition-colors cursor-pointer group"
                        style={{ borderBottom: isLast ? "none" : `1px solid ${c.border}`, background: isPreview ? (isDark ? "rgba(168,85,247,0.10)" : "rgba(168,85,247,0.06)") : "transparent" }}
                        onClick={() => {
                          if (stmtSelectMode) toggleSel(s.id);
                          else setStmtPreview({ id: s.id, type: s.type, label: s.label, issued: s.issued, sizePdf: s.sizePdf, sizeXls: s.sizeXls });
                        }}
                        onMouseEnter={e => { if (!isPreview) e.currentTarget.style.background = c.hoverBg; }}
                        onMouseLeave={e => { if (!isPreview) e.currentTarget.style.background = "transparent"; }}
                      >
                        {stmtSelectMode && (
                          <span
                            className="flex items-center justify-center flex-shrink-0 rounded"
                            style={{ width: 16, height: 16, background: selected ? "linear-gradient(88.54deg,#5C2ED4 0.1%,#A614C3 63.88%)" : c.cardBg, border: selected ? "none" : `1.5px solid ${c.borderStrong}` }}
                          >
                            {selected && (
                              <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                <path d="M1 3.5L3.5 6L8 1" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </span>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] leading-tight" style={{ ...font, color: c.text }}>{MONTHS[s.monthIdx]} {s.year}</div>
                          <div className="text-[11px] mt-0.5" style={{ ...font, color: c.muted }}>Issued {s.issued}</div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
                          <button title="Preview" onClick={() => setStmtPreview({ id: s.id, type: s.type, label: s.label, issued: s.issued, sizePdf: s.sizePdf, sizeXls: s.sizeXls })}
                            className="p-1.5 rounded-md transition-colors"
                            style={{ color: isPreview ? "#A614C3" : c.muted, background: isPreview ? (isDark ? "rgba(168,85,247,0.14)" : "rgba(168,85,247,0.08)") : "transparent" }}
                            onMouseEnter={e => { if (!isPreview) { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; } }}
                            onMouseLeave={e => { if (!isPreview) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; } }}>
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <div className="relative">
                            <button title="Download" onClick={() => setStmtDownloadFor(p => p === s.id ? null : s.id)}
                              className="p-1.5 rounded-md transition-colors"
                              style={{ color: stmtDownloadFor === s.id ? "#A614C3" : c.muted, background: stmtDownloadFor === s.id ? (isDark ? "rgba(168,85,247,0.14)" : "rgba(168,85,247,0.08)") : "transparent" }}
                              onMouseEnter={e => { if (stmtDownloadFor !== s.id) { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; } }}
                              onMouseLeave={e => { if (stmtDownloadFor !== s.id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; } }}>
                              <Download className="w-3.5 h-3.5" />
                            </button>
                            {stmtDownloadFor === s.id && (
                              <div className="absolute right-0 top-full mt-1 z-30 rounded-lg overflow-hidden"
                                style={{ background: c.cardBg, border: `1px solid ${c.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.10)", minWidth: 140 }}>
                                {([
                                  { fmt: "pdf" as const,  label: "PDF",   size: s.sizePdf },
                                  { fmt: "xlsx" as const, label: "Excel", size: s.sizeXls },
                                ]).map(opt => (
                                  <button key={opt.fmt}
                                    onClick={() => {
                                      showToast({ title: `Downloading ${s.label}`, description: `${opt.label} · ${opt.size}` });
                                      setStmtDownloadFor(null);
                                    }}
                                    className="w-full flex items-center justify-between gap-4 px-3 py-2 text-[12px] transition-colors"
                                    style={{ fontFamily: FONT, color: c.text }}
                                    onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                                    <span className="flex items-center gap-2">
                                      <Download className="w-3 h-3" style={{ color: "#A614C3" }} />
                                      {opt.label}
                                    </span>
                                    <span className="text-[11px]" style={{ color: c.muted }}>{opt.size}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  };

                  const renderGroup = (type: "comm" | "soa", rows: Stmt[]) => {
                    if (rows.length === 0) return null;
                    return (
                      <div key={type}
                        ref={el => { groupRefs[type] = el; }}
                        className="rounded-xl overflow-hidden mb-3"
                        style={{ background: c.cardBg, border: `1px solid ${c.border}`, scrollMarginTop: 12 }}>
                        <div className="flex items-center gap-2 px-5 py-2" style={{ borderBottom: `1px solid ${c.border}`, background: c.hoverBg }}>
                          <FolderOpen className="w-3.5 h-3.5" style={{ color: "#A855F7" }} />
                          <span className="text-[12px] font-semibold" style={{ ...font, color: c.text }}>{TYPE_LABEL[type]}s</span>
                          <span className="text-[11px]" style={{ ...font, color: c.muted }}>{rows.length}</span>
                        </div>
                        {rows.map((r, i) => <StmtRow key={r.id} s={r} isLast={i === rows.length - 1} />)}
                      </div>
                    );
                  };

                  const previewSideOpen = !!stmtPreview;
                  // Latest posting date across the archive — surfaces "when the newest file dropped".
                  const latest = filtered.length ? filtered[0] : all[0];
                  const latestPosted = latest ? `${MONTHS[latest.monthIdx]} ${latest.type === "comm" ? 14 : new Date(latest.year, latest.monthIdx + 1, 0).getDate()}, ${latest.year}` : "";
                  return (
                    <div className="rounded-2xl p-8 mb-8" style={{ background: c.cardBg, border: `1px solid ${c.border}` }} onClick={closeDropdowns}>
                      {/* Header — title on the left, last-posted pill + toolbar
                          on the right, vertically centered on the same line. */}
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <h3 className="text-[17px] font-bold leading-tight" style={{ ...font, color: c.text }}>
                          {accountingView === "soa" ? "Statement of Account" : "Commission Statement"}
                        </h3>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(115,201,183,0.15)" }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#73C9B7" }} />
                            <span className="text-[11.5px] font-semibold" style={{ ...font, color: isDark ? "#73C9B7" : "#0F7A63" }}>
                              Last posted {latestPosted}
                            </span>
                          </div>
                          <div className="w-px h-5" style={{ background: c.border }} />
                          <div className="flex items-center gap-1">
                          {/* Sort */}
                          <div className="relative" onClick={e => e.stopPropagation()}>
                            <button onClick={() => { setStmtSortOpen(p => !p); setStmtFilterOpen(false); }}
                              className="p-1.5 rounded-md transition-all" style={{ color: c.muted }}>
                              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M2 4h12v1.5H2V4zm2 3.5h8V9H4V7.5zm2 3.5h4v1.5H6V11z"/></svg>
                            </button>
                            {stmtSortOpen && (
                              <div className="absolute right-0 top-8 z-30 w-40 rounded-xl shadow-xl overflow-hidden" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                                <p className="text-[10px] font-semibold uppercase tracking-wide px-3 pt-2 pb-1.5" style={{ fontFamily: FONT, color: c.muted }}>Sort by Month</p>
                                {([["desc","Newest first"],["asc","Oldest first"]] as const).map(([d, label]) => (
                                  <button key={d} onClick={() => { setStmtSortDir(d); setStmtSortOpen(false); }}
                                    className="w-full text-left px-3 py-2 text-[12px] flex items-center justify-between"
                                    style={{ fontFamily: FONT, color: stmtSortDir === d ? "#A614C3" : c.text, background: stmtSortDir === d ? "rgba(168,85,247,0.08)" : "transparent" }}>
                                    <span>{label}</span>{stmtSortDir === d && <svg width="10" height="8" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          {/* Search */}
                          <div className="flex items-center transition-all overflow-hidden" style={{ width: stmtSearchOpen ? 180 : 28 }}>
                            <button onClick={e => { e.stopPropagation(); setStmtSearchOpen(p => !p); if (stmtSearchOpen) setStmtSearch(""); }}
                              className="p-1.5 rounded-md flex-shrink-0" style={{ color: stmtSearch ? "#A855F7" : c.muted }}>
                              <Search className="w-3.5 h-3.5" />
                            </button>
                            {stmtSearchOpen && (
                              <input autoFocus value={stmtSearch} onChange={e => setStmtSearch(e.target.value)}
                                onClick={e => e.stopPropagation()} placeholder="Search month or type…"
                                className="outline-none text-[12px] flex-1 min-w-0"
                                style={{ fontFamily: FONT, color: c.text, background: "transparent", borderBottom: `1px solid ${c.border}` }} />
                            )}
                          </div>
                          {/* Select toggle */}
                          <button title={stmtSelectMode ? "Exit selection" : "Select statements"}
                            onClick={e => { e.stopPropagation(); setStmtSelectMode(p => { if (p) clearSel(); return !p; }); }}
                            className="p-1.5 rounded-md transition-all"
                            style={{ color: stmtSelectMode ? "#A855F7" : c.muted, background: stmtSelectMode ? "rgba(168,85,247,0.10)" : "transparent" }}>
                            <CheckSquare className="w-3.5 h-3.5" />
                          </button>
                          </div>
                        </div>
                      </div>

                      {/* Cadence callout — full-width secondary row under the header. */}
                      <div
                        className="flex items-start gap-2 mb-4 px-3 py-2.5 rounded-lg"
                        style={{
                          fontFamily: FONT,
                          fontSize: 12.5,
                          color: c.text,
                          background: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB",
                          border: `1px solid ${c.border}`,
                          lineHeight: 1.5,
                        }}
                      >
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: isDark ? "#A855F7" : "#A614C3", marginTop: 2 }} />
                        <span>
                          {(() => {
                            // Brighter razz in dark mode so the emphasized dates
                            // stay legible against the dark navy background.
                            const razzGrad = isDark
                              ? "linear-gradient(90deg, #C084FC 0%, #E879F9 65%)"
                              : "linear-gradient(90deg, #5C2ED4 0%, #A614C3 65%)";
                            const gradB: React.CSSProperties = { backgroundImage: razzGrad, backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 };
                            return accountingView === "soa"
                              ? <>12-month rolling archive — new statements post on the <b style={gradB}>first day</b> of each month.</>
                              : <>12-month rolling archive — new statements post around the <b style={gradB}>12th–15th</b> of each month.</>;
                          })()}
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="mb-3" style={{ height: 1, background: c.border }} />

                      {/* Bulk-select action bar — neutral surface, subtle razz accent-bar on
                          the left. Format pills are outlined-only when active; Download reads
                          as a real disabled state instead of a ghosted gradient. */}
                      {stmtSelectMode && (() => {
                        const hasSel = selectedStmts.size > 0;
                        const allChecked = filtered.length > 0 && filtered.every(s => selectedStmts.has(s.id));
                        return (
                        <div className="flex items-center justify-between gap-4 pl-4 pr-3 py-2 mb-3 rounded-lg"
                          style={{
                            background: isDark ? "rgba(255,255,255,0.03)" : "#FAFAFB",
                            border: `1px solid ${c.border}`,
                            borderLeft: "3px solid #A614C3",
                          }}>
                          <div className="flex items-center gap-3 text-[12px] min-w-0" style={{ ...font, color: c.text }}>
                            <span className="font-semibold" style={{ color: hasSel ? c.text : c.muted }}>
                              {hasSel ? `${selectedStmts.size} selected` : "0 selected"}
                            </span>
                            <button onClick={() => setSelectedStmts(allChecked ? new Set() : new Set(filtered.map(s => s.id)))}
                              className="text-[11px] font-medium transition-opacity"
                              style={{ fontFamily: FONT, color: "#A614C3" }}
                              onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
                              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
                              {allChecked ? "Clear" : "Select all"}
                            </button>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            {/* Format — outlined pill group, active state uses razz text + tint, no gradient */}
                            <div className="flex items-center gap-1">
                              <span className="text-[10.5px] uppercase tracking-wider" style={{ fontFamily: FONT, color: c.muted, letterSpacing: "0.06em" }}>Format</span>
                              <div className="flex items-center rounded-md overflow-hidden" style={{ border: `1px solid ${c.border}`, background: c.cardBg }}>
                                {(["pdf","xlsx","both"] as const).map(f => {
                                  const active = stmtBulkFormat === f;
                                  return (
                                    <button key={f} onClick={() => setStmtBulkFormat(f)}
                                      className="px-2.5 py-1 text-[11px] font-semibold transition-colors"
                                      style={{
                                        fontFamily: FONT,
                                        color: active ? "#A614C3" : c.muted,
                                        background: active ? (isDark ? "rgba(168,85,247,0.14)" : "rgba(168,85,247,0.08)") : "transparent",
                                      }}
                                      onMouseEnter={e => { if (!active) e.currentTarget.style.color = c.text; }}
                                      onMouseLeave={e => { if (!active) e.currentTarget.style.color = c.muted; }}>
                                      {f === "pdf" ? "PDF" : f === "xlsx" ? "Excel" : "Both"}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="w-px h-5" style={{ background: c.border }} />
                            <button onClick={() => { clearSel(); setStmtSelectMode(false); }}
                              className="px-2 py-1 rounded-md text-[11px] font-medium transition-colors"
                              style={{ fontFamily: FONT, color: c.muted, background: "transparent" }}
                              onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                              Cancel
                            </button>
                            <button
                              disabled={!hasSel}
                              onClick={() => {
                                if (!hasSel) return;
                                const names = all.filter(s => selectedStmts.has(s.id)).map(s => s.label);
                                const fmt = stmtBulkFormat === "both" ? "PDF + Excel" : stmtBulkFormat === "pdf" ? "PDF" : "Excel";
                                showToast({
                                  title: `Downloading ${names.length} ${names.length === 1 ? "statement" : "statements"} (${fmt})`,
                                  description: names.length <= 3 ? names.join(", ") : `${names.slice(0,2).join(", ")} and ${names.length - 2} more`,
                                });
                                clearSel(); setStmtSelectMode(false);
                              }}
                              className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[11.5px] font-semibold transition-all"
                              style={hasSel ? {
                                background: btnGrad,
                                color: "#FFFFFF",
                                fontFamily: FONT,
                                cursor: "pointer",
                              } : {
                                background: c.cardBg,
                                color: c.muted,
                                fontFamily: FONT,
                                border: `1px solid ${c.border}`,
                                cursor: "not-allowed",
                              }}
                              onMouseEnter={e => { if (hasSel) e.currentTarget.style.filter = "brightness(1.10)"; }}
                              onMouseLeave={e => { e.currentTarget.style.filter = "none"; }}>
                              <Download className="w-3 h-3" />
                              Download{hasSel ? ` ${selectedStmts.size}` : ""}
                            </button>
                          </div>
                        </div>
                        );
                      })()}

                      {/* Body — list + optional preview side panel */}
                      <div className="flex gap-4">
                        <div style={{ flex: previewSideOpen ? "0 0 62%" : "1 1 100%", minWidth: 0 }}>
                          {((accountingView === "soa" ? "soa" : "comm") === "comm" ? groupComm : groupSoa).length === 0 ? (
                            <div className="rounded-xl overflow-hidden px-5 py-10 text-center text-[12px]"
                              style={{ ...font, color: c.muted, background: c.cardBg, border: `1px solid ${c.border}` }}>
                              No statements match your search.
                            </div>
                          ) : (
                            renderGroup((accountingView === "soa" ? "soa" : "comm"), (accountingView === "soa" ? "soa" : "comm") === "comm" ? groupComm : groupSoa)
                          )}
                        </div>
                        {previewSideOpen && stmtPreview && (
                          <div className="rounded-2xl overflow-hidden flex flex-col" style={{ flex: "1 1 38%", minWidth: 0, background: c.cardBg, border: `1px solid ${c.border}` }}
                            onClick={e => e.stopPropagation()}>
                            {/* Top bar — breadcrumb + action icons, matches the Documents preview */}
                            <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0"
                              style={{ borderBottom: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.02)" : "rgba(249,250,251,0.80)" }}>
                              <div className="flex items-center gap-1.5 min-w-0">
                                <FileText className="w-3.5 h-3.5 flex-shrink-0" style={{ color: c.muted }} />
                                <span className="text-[11px] flex-shrink-0" style={{ fontFamily: FONT, color: c.muted }}>Statements</span>
                                <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: c.muted }} />
                                <span className="text-[11px] font-medium truncate" style={{ fontFamily: FONT, color: c.text }}>{TYPE_LABEL[stmtPreview.type]}s</span>
                              </div>
                              <div className="flex items-center gap-0.5 flex-shrink-0">
                                <button title={`Download ${stmtPreviewFormat === "pdf" ? "PDF" : "Excel"}`}
                                  onClick={() => {
                                    const label = stmtPreviewFormat === "pdf" ? "PDF" : "Excel";
                                    const size = stmtPreviewFormat === "pdf" ? stmtPreview.sizePdf : stmtPreview.sizeXls;
                                    showToast({ title: `Downloading ${stmtPreview.label}`, description: `${label} · ${size}` });
                                  }}
                                  className="p-1.5 rounded-md transition-colors" style={{ color: c.muted }}
                                  onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                                <button title="Open in side drawer" onClick={() => setStmtPreviewExpanded(true)}
                                  className="p-1.5 rounded-md transition-colors" style={{ color: c.muted }}
                                  onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                                  <Maximize2 className="w-3.5 h-3.5" />
                                </button>
                                <button title="Close" onClick={() => setStmtPreview(null)}
                                  className="p-1.5 rounded-md transition-colors" style={{ color: c.muted }}
                                  onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            {/* Meta strip — issued date on the left, PDF/Excel view toggle on the right */}
                            <div className="flex items-center gap-4 px-5 py-3 flex-shrink-0 text-[12px] flex-wrap"
                              style={{ ...font, color: c.muted, borderBottom: `1px solid ${c.border}` }}>
                              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />Issued {stmtPreview.issued}</span>
                              <div className="ml-auto flex items-center rounded-md overflow-hidden" style={{ border: `1px solid ${c.border}`, background: c.cardBg }}>
                                {(["pdf","xlsx"] as const).map(f => {
                                  const active = stmtPreviewFormat === f;
                                  return (
                                    <button key={f} type="button" onClick={() => setStmtPreviewFormat(f)}
                                      className="px-2.5 py-1 text-[11px] font-semibold transition-colors"
                                      style={{ fontFamily: FONT, color: active ? "#A614C3" : c.muted, background: active ? (isDark ? "rgba(168,85,247,0.14)" : "rgba(168,85,247,0.08)") : "transparent" }}
                                      onMouseEnter={e => { if (!active) e.currentTarget.style.color = c.text; }}
                                      onMouseLeave={e => { if (!active) e.currentTarget.style.color = c.muted; }}>
                                      {f === "pdf" ? "PDF" : "Excel"}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                            {/* File placeholder — icon/extension follow the format toggle */}
                            <div className="flex-1 min-h-0 overflow-auto p-6" style={{ background: isDark ? "rgba(255,255,255,0.02)" : "#F9FAFB" }}>
                              <div className="mx-auto rounded shadow-sm flex flex-col items-center justify-center"
                                style={{ background: "#FFFFFF", border: `1px solid ${c.border}`, aspectRatio: "8.5 / 11", maxWidth: 520, minHeight: 360, fontFamily: FONT }}>
                                <FileText className="w-16 h-16 mb-3" style={{ color: "#D1D5DB" }} />
                                <div className="text-[13px] font-semibold mb-1" style={{ color: "#374151" }}>{stmtPreview.label}.{stmtPreviewFormat === "pdf" ? "pdf" : "xlsx"}</div>
                                <div className="text-[11px]" style={{ color: "#9CA3AF" }}>{stmtPreviewFormat === "pdf" ? "PDF" : "Excel"} preview not available in demo</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div
                        className="mt-4 flex items-start gap-2 px-3 py-2.5 rounded-lg"
                        style={{
                          fontFamily: FONT,
                          fontSize: 12,
                          color: c.text,
                          background: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB",
                          border: `1px solid ${c.border}`,
                          lineHeight: 1.5,
                        }}
                      >
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#A614C3", marginTop: 2 }} />
                        <span>
                          Need older statements? The accounting team keeps a full history —
                          reach out to <a href="mailto:Accounting@btisinc.com" className="font-semibold" style={{ color: "#A614C3" }}>Accounting@btisinc.com</a> with the agency code and the month you need.
                        </span>
                      </div>

                      {/* Expanded side drawer — mirrors the Documents expanded preview */}
                      {stmtPreviewExpanded && stmtPreview && (
                        <div className="fixed inset-y-0 right-0 z-50 flex" style={{ width: "58vw" }}>
                          <div className="flex-1 cursor-pointer"
                            onClick={() => setStmtPreviewExpanded(false)}
                            style={{ background: "rgba(0,0,0,0.25)" }} />
                          <div className="flex flex-col h-full shadow-2xl"
                            style={{ width: "100%", background: c.cardBg, borderLeft: `1px solid ${c.border}` }}>
                            <div className="flex items-center justify-between px-6 py-3 flex-shrink-0"
                              style={{ borderBottom: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.02)" : "rgba(249,250,251,0.80)" }}>
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText className="w-3.5 h-3.5 flex-shrink-0" style={{ color: c.muted }} />
                                <span className="text-[11px] flex-shrink-0" style={{ fontFamily: FONT, color: c.muted }}>Statements</span>
                                <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: c.muted }} />
                                <span className="text-[12px] font-semibold truncate max-w-[420px]" style={{ fontFamily: FONT, color: c.text }}>{TYPE_LABEL[stmtPreview.type]}s</span>
                              </div>
                              <div className="flex items-center gap-0.5 flex-shrink-0">
                                <button title={`Download ${stmtPreviewFormat === "pdf" ? "PDF" : "Excel"}`}
                                  onClick={() => {
                                    const label = stmtPreviewFormat === "pdf" ? "PDF" : "Excel";
                                    const size = stmtPreviewFormat === "pdf" ? stmtPreview.sizePdf : stmtPreview.sizeXls;
                                    showToast({ title: `Downloading ${stmtPreview.label}`, description: `${label} · ${size}` });
                                  }}
                                  className="p-1.5 rounded-md transition-colors" style={{ color: c.muted }}
                                  onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                                <button title="Collapse" onClick={() => setStmtPreviewExpanded(false)}
                                  className="p-1.5 rounded-md transition-colors">
                                  <Minimize2 className="w-3.5 h-3.5" style={{ color: "#A855F7" }} />
                                </button>
                                <button title="Close" onClick={() => { setStmtPreviewExpanded(false); setStmtPreview(null); }}
                                  className="p-1.5 rounded-md transition-colors" style={{ color: c.muted }}
                                  onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 px-6 py-3 flex-shrink-0 text-[12px] flex-wrap"
                              style={{ ...font, color: c.muted, borderBottom: `1px solid ${c.border}` }}>
                              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />Issued {stmtPreview.issued}</span>
                              <div className="ml-auto flex items-center rounded-md overflow-hidden" style={{ border: `1px solid ${c.border}`, background: c.cardBg }}>
                                {(["pdf","xlsx"] as const).map(f => {
                                  const active = stmtPreviewFormat === f;
                                  return (
                                    <button key={f} type="button" onClick={() => setStmtPreviewFormat(f)}
                                      className="px-2.5 py-1 text-[11px] font-semibold transition-colors"
                                      style={{ fontFamily: FONT, color: active ? "#A614C3" : c.muted, background: active ? (isDark ? "rgba(168,85,247,0.14)" : "rgba(168,85,247,0.08)") : "transparent" }}
                                      onMouseEnter={e => { if (!active) e.currentTarget.style.color = c.text; }}
                                      onMouseLeave={e => { if (!active) e.currentTarget.style.color = c.muted; }}>
                                      {f === "pdf" ? "PDF" : "Excel"}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="flex-1 min-h-0 overflow-auto p-8" style={{ background: isDark ? "rgba(255,255,255,0.02)" : "#F9FAFB" }}>
                              <div className="mx-auto rounded shadow-sm flex flex-col items-center justify-center"
                                style={{ background: "#FFFFFF", border: `1px solid ${c.border}`, aspectRatio: "8.5 / 11", maxWidth: 620, minHeight: 600, fontFamily: FONT }}>
                                <FileText className="w-20 h-20 mb-4" style={{ color: "#D1D5DB" }} />
                                <div className="text-[14px] font-semibold mb-1" style={{ color: "#374151" }}>{stmtPreview.label}.{stmtPreviewFormat === "pdf" ? "pdf" : "xlsx"}</div>
                                <div className="text-[12px]" style={{ color: "#9CA3AF" }}>{stmtPreviewFormat === "pdf" ? "PDF" : "Excel"} preview not available in demo</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            );
          }

          return null;
        })()}

        {/* ── Policies tab ── */}
        {detailTab === "policies" && (() => {
          const isSold = bookRolled.has(agency.id);
          const sold = isSold ? bookRolled.get(agency.id)! : null;
          const soldTargetName = sold ? (allAgencies.find(a => a.code === sold.targetCode)?.name ?? sold.targetCode) : "";
          const soldTooltip = sold ? `Sold on ${sold.date} — policies transferred to ${soldTargetName}.` : undefined;
          return (
          <div className="flex flex-col flex-1 min-h-0 relative">
            {isSold && (
              <div className="mb-3 flex items-start gap-2 px-3 py-2.5 rounded-lg flex-shrink-0"
                style={{ backgroundImage: "linear-gradient(88.54deg, rgba(92,46,212,0.06) 0.1%, rgba(166,20,195,0.08) 63.88%)", border: "1px solid rgba(166,20,195,0.18)", color: c.text, fontFamily: FONT, fontSize: 12 }}>
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#A614C3" }} />
                <div className="flex-1">
                  These policies were transferred to{" "}
                  <button onClick={() => onNavigateToAgency?.(sold!.targetCode, "policies")}
                    className="font-semibold transition-opacity hover:opacity-80"
                    style={{ background: "linear-gradient(88.54deg,#5C2ED4 0.1%,#A614C3 63.88%) text", WebkitTextFillColor: "transparent" }}>
                    {soldTargetName} · {sold!.targetCode}
                  </button>
                  {" "}on {sold!.date}.
                </div>
              </div>
            )}
            <div style={isSold ? { opacity: 0.65, filter: "grayscale(0.3)" } : undefined} title={soldTooltip}>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-stretch overflow-hidden transition-all"
                style={{ background: c.cardBg, border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB"}`, borderRadius:10 }}
                onMouseEnter={e=>(e.currentTarget.style.filter="brightness(1.12)")} onMouseLeave={e=>(e.currentTarget.style.filter="none")}>
                <input placeholder="Search Policies" value={detailSearch} onChange={e=>setDetailSearch(e.target.value)}
                  className="outline-none px-4 py-2 text-[13px]"
                  style={{ fontFamily:FONT, background:"transparent", color:c.text, width:200, borderRadius:"10px 0 0 10px" }} />
                <button className="px-5 text-[12px] font-semibold text-white flex-shrink-0"
                  style={{ background:btnGrad, fontFamily:FONT, borderRadius:"0 7px 7px 0" }}>Submit</button>
              </div>
              <div className="relative">
                <select className="appearance-none pl-3 pr-8 py-2 outline-none cursor-pointer"
                  style={{ fontFamily:FONT, background:`linear-gradient(${c.cardBg},${c.cardBg}) padding-box, linear-gradient(90deg,#5C2ED4 0%,#A614C3 65%) border-box`, border:"1px solid transparent", color:c.text, fontSize:11, fontWeight:500, borderRadius:7 }}>
                  <option>Past 20 Days</option><option>Past 60 Days</option><option>Past 90 Days</option><option>All Time</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color:c.muted }} />
              </div>
              <div className="flex items-center gap-1 ml-1" style={{ borderLeft:`1px solid ${c.border}`, paddingLeft:10 }}>
                <button title="Reset filters" onClick={() => { setDetailSearch(""); setLobFilter(new Set()); setStatusFilter(new Set()); setApplicantFilter(new Set()); setProducerFilter(new Set()); setLobSearch(""); setStatusSearch(""); setApplicantSearch(""); setProducerSearch(""); setLobOpen(false); setStatusOpen(false); setApplicantOpen(false); setProducerOpen(false); setQpSortKey(null); setQpSortDir("asc"); }}
                  className="p-2 rounded-lg transition-colors" style={{ color:"#A614C3" }} onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}><RefreshCw className="w-4 h-4"/></button>
                <div className="relative" onClick={e=>e.stopPropagation()}><button title="View columns" onClick={()=>setQpViewOpen(o=>!o)} className="p-2 rounded-lg transition-colors" style={{ color:"#A614C3", background: qpViewOpen ? c.hoverBg : "transparent" }} onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background = qpViewOpen ? c.hoverBg : "transparent")}><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="2" y="2" rx="1"/><rect width="5" height="5" x="9.5" y="2" rx="1"/><rect width="5" height="5" x="17" y="2" rx="1"/><rect width="5" height="5" x="2" y="9.5" rx="1"/><rect width="5" height="5" x="9.5" y="9.5" rx="1"/><rect width="5" height="5" x="17" y="9.5" rx="1"/><rect width="5" height="5" x="2" y="17" rx="1"/><rect width="5" height="5" x="9.5" y="17" rx="1"/><rect width="5" height="5" x="17" y="17" rx="1"/></svg></button>{qpViewOpen && (<div className="absolute right-0 top-full mt-1 z-30 w-[220px] rounded-xl shadow-xl overflow-hidden" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}><div className="px-4 py-2.5 text-[11px] uppercase tracking-wider font-semibold" style={{ fontFamily: FONT, color: c.muted, borderBottom: `1px solid ${c.border}`, letterSpacing: "0.06em" }}>Show Columns</div><div className="py-1.5 max-h-[280px] overflow-y-auto">{QP_COLUMNS.map(col => { const visible = !qpHiddenCols.has(col.key); return (<label key={col.key} className="flex items-center gap-2.5 px-4 py-2 cursor-pointer transition-colors" onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")} onClick={() => setQpHiddenCols(prev => { const s = new Set(prev); s.has(col.key) ? s.delete(col.key) : s.add(col.key); return s; })}><div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0" style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>{visible && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div><span className="text-[12px]" style={{ fontFamily: FONT, color: c.text }}>{col.label}</span></label>); })}</div><button onClick={() => setQpHiddenCols(new Set())} className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors" style={{ fontFamily: FONT, color: "#A614C3", borderTop: `1px solid ${c.border}` }} onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}><RefreshCw className="w-3.5 h-3.5" />Show All</button></div>)}</div>
                <button title="Export" className="p-2 rounded-lg transition-colors" style={{ color:"#A614C3" }} onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}><Download className="w-4 h-4"/></button>
              </div>
            </div>
            <div className="rounded-xl flex flex-col flex-1 min-h-0" style={{ background:c.cardBg, border:`1px solid ${c.border}` }}>
              <div className="grid px-5 py-3 gap-4 rounded-t-xl" style={{ gridTemplateColumns:qpGridTemplate, borderBottom:`1px solid ${c.border}`, background:mutedBg }}>
                {/* Created */}
                {!qpHiddenCols.has("created") && (
                <button onClick={()=>{if(qpSortKey==="createdDate")setQpSortDir(d=>d==="asc"?"desc":"asc");else{setQpSortKey("createdDate");setQpSortDir("asc");}}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none text-left" style={{fontFamily:FONT,color:c.muted}}>
                  Created<span className="inline-flex ml-0.5"><svg width="14" height="9" viewBox="0 0 14 9" fill="none"><path d="M4 8V1M4 1L2 3M4 1L6 3" stroke={qpSortKey==="createdDate"&&qpSortDir==="asc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 1V8M10 8L8 6M10 8L12 6" stroke={qpSortKey==="createdDate"&&qpSortDir==="desc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                </button>
                )}
                {/* Policy Number */}
                {!qpHiddenCols.has("policyNumber") && (
                <button onClick={()=>{if(qpSortKey==="policyNumber")setQpSortDir(d=>d==="asc"?"desc":"asc");else{setQpSortKey("policyNumber");setQpSortDir("asc");}}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none text-left" style={{fontFamily:FONT,color:c.muted}}>
                  Policy Number<span className="inline-flex ml-0.5"><svg width="14" height="9" viewBox="0 0 14 9" fill="none"><path d="M4 8V1M4 1L2 3M4 1L6 3" stroke={qpSortKey==="policyNumber"&&qpSortDir==="asc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 1V8M10 8L8 6M10 8L12 6" stroke={qpSortKey==="policyNumber"&&qpSortDir==="desc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                </button>
                )}
                {/* Applicant */}
                {!qpHiddenCols.has("applicant") && (
                <div className="relative">
                  <button onClick={()=>{closeAllDropdowns();setApplicantOpen(o=>!o);}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none" style={{fontFamily:FONT,color:applicantFilter.size>0?"#A614C3":c.muted}}>
                    Applicant<span className="inline-flex ml-1"><svg width="7" height="5" viewBox="0 0 7 5" fill="none"><path d="M3.5 5L0.5 0H6.5L3.5 5Z" fill={applicantFilter.size>0?"#A614C3":sub}/></svg></span>
                  </button>
                  {applicantOpen&&(<>
                    <div className="fixed inset-0 z-10" onClick={()=>setApplicantOpen(false)}/>
                    <div className="absolute top-full mt-1 z-30 rounded-xl shadow-lg overflow-hidden min-w-[220px]" style={{background:c.cardBg,border:`1px solid ${c.border}`, left: -50}}>
                      <div className="p-2" style={{borderBottom:`1px solid ${c.border}`}}>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg" style={{background:isDark?"rgba(255,255,255,0.05)":"#F9FAFB",border:`1px solid ${c.border}`}}>
                          <Search className="w-3.5 h-3.5 flex-shrink-0" style={{color:c.muted}}/><input value={applicantSearch} onChange={e=>setApplicantSearch(e.target.value)} placeholder="Search Agent" className="outline-none text-[12px] flex-1 bg-transparent" style={{fontFamily:FONT,color:c.text}}/>
                        </div>
                      </div>
                      <div className="px-3 py-2" style={{borderBottom:`1px solid ${c.border}`}}>
                        <button className="flex items-center gap-2 text-[12px] w-full text-left" style={{fontFamily:FONT,color:c.text}} onClick={()=>{const all=uniquePApplicants;setApplicantFilter(applicantFilter.size===all.length?new Set():new Set(all));}}>
                          <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0" style={{border:`1.5px solid ${c.borderStrong}`,background:c.cardBg}}>{applicantFilter.size===uniquePApplicants.length&&uniquePApplicants.length>0&&<svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div>
                          Select All
                        </button>
                      </div>
                      <div className="max-h-[180px] overflow-y-auto py-1">
                        {uniquePApplicants.filter(a=>!applicantSearch||a.toLowerCase().includes(applicantSearch.toLowerCase())).map(applicant=>(
                          <button key={applicant} className="flex items-center gap-2 px-3 py-1.5 text-[12px] w-full text-left transition-colors" style={{fontFamily:FONT,color:c.text}} onMouseEnter={e=>e.currentTarget.style.background=c.hoverBg} onMouseLeave={e=>e.currentTarget.style.background="transparent"} onClick={()=>toggleSet(applicantFilter,applicant,setApplicantFilter)}>
                            <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0" style={{border:`1.5px solid ${c.borderStrong}`,background:c.cardBg}}>{applicantFilter.has(applicant)&&<svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div>
                            {applicant}
                          </button>
                        ))}
                      </div>
                      <button onClick={()=>{setApplicantFilter(new Set());setApplicantSearch("");}} className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors" style={{fontFamily:FONT,color:"#A614C3",borderTop:`1px solid ${c.border}`}} onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}><RefreshCw className="w-3.5 h-3.5"/>Reset Filter</button>
                    </div>
                  </>)}
                </div>
                )}
                {/* DBA */}
                {!qpHiddenCols.has("dba") && (
                <button onClick={()=>{if(qpSortKey==="dba")setQpSortDir(d=>d==="asc"?"desc":"asc");else{setQpSortKey("dba");setQpSortDir("asc");}}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none text-left" style={{fontFamily:FONT,color:c.muted}}>
                  DBA<span className="inline-flex ml-0.5"><svg width="14" height="9" viewBox="0 0 14 9" fill="none"><path d="M4 8V1M4 1L2 3M4 1L6 3" stroke={qpSortKey==="dba"&&qpSortDir==="asc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 1V8M10 8L8 6M10 8L12 6" stroke={qpSortKey==="dba"&&qpSortDir==="desc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                </button>
                )}
                {/* Effective */}
                {!qpHiddenCols.has("effective") && (
                <button onClick={()=>{if(qpSortKey==="effectiveDate")setQpSortDir(d=>d==="asc"?"desc":"asc");else{setQpSortKey("effectiveDate");setQpSortDir("asc");}}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none text-left" style={{fontFamily:FONT,color:c.muted}}>
                  Effective<span className="inline-flex ml-0.5"><svg width="14" height="9" viewBox="0 0 14 9" fill="none"><path d="M4 8V1M4 1L2 3M4 1L6 3" stroke={qpSortKey==="effectiveDate"&&qpSortDir==="asc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 1V8M10 8L8 6M10 8L12 6" stroke={qpSortKey==="effectiveDate"&&qpSortDir==="desc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                </button>
                )}
                {/* LOB */}
                {!qpHiddenCols.has("lob") && renderMultiFilter({
                  label: "LOB", options: LOB_OPTIONS, filter: lobFilter, setFilter: setLobFilter,
                  search: lobSearch, setSearch: setLobSearch, open: lobOpen, setOpen: setLobOpen,
                  searchPlaceholder: "Search LOB",
                })}
                {/* Status */}
                {!qpHiddenCols.has("status") && renderMultiFilter({
                  label: "Status", options: POLICY_STATUS_OPTIONS, filter: statusFilter, setFilter: setStatusFilter,
                  search: statusSearch, setSearch: setStatusSearch, open: statusOpen, setOpen: setStatusOpen,
                  searchPlaceholder: "Search Status",
                })}
                {/* Producer */}
                {!qpHiddenCols.has("producer") && (
                <div className="relative">
                  <button onClick={()=>{closeAllDropdowns();setProducerOpen(o=>!o);}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none" style={{fontFamily:FONT,color:producerFilter.size>0?"#A614C3":c.muted}}>
                    Producer<span className="inline-flex ml-1"><svg width="7" height="5" viewBox="0 0 7 5" fill="none"><path d="M3.5 5L0.5 0H6.5L3.5 5Z" fill={producerFilter.size>0?"#A614C3":sub}/></svg></span>
                  </button>
                  {producerOpen&&(<>
                    <div className="fixed inset-0 z-10" onClick={()=>setProducerOpen(false)}/>
                    <div className="absolute top-full mt-1 z-30 rounded-xl shadow-lg overflow-hidden min-w-[220px]" style={{background:c.cardBg,border:`1px solid ${c.border}`, left: -50}}>
                      <div className="p-2" style={{borderBottom:`1px solid ${c.border}`}}>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg" style={{background:isDark?"rgba(255,255,255,0.05)":"#F9FAFB",border:`1px solid ${c.border}`}}>
                          <Search className="w-3.5 h-3.5 flex-shrink-0" style={{color:c.muted}}/><input value={producerSearch} onChange={e=>setProducerSearch(e.target.value)} placeholder="Search Agent" className="outline-none text-[12px] flex-1 bg-transparent" style={{fontFamily:FONT,color:c.text}}/>
                        </div>
                      </div>
                      <div className="px-3 py-2" style={{borderBottom:`1px solid ${c.border}`}}>
                        <button className="flex items-center gap-2 text-[12px] w-full text-left" style={{fontFamily:FONT,color:c.text}} onClick={()=>{const all=uniquePProducers;setProducerFilter(producerFilter.size===all.length?new Set():new Set(all));}}>
                          <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0" style={{border:`1.5px solid ${c.borderStrong}`,background:c.cardBg}}>{producerFilter.size===uniquePProducers.length&&uniquePProducers.length>0&&<svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div>
                          Select All
                        </button>
                      </div>
                      <div className="max-h-[180px] overflow-y-auto py-1">
                        {uniquePProducers.filter(p=>!producerSearch||p.toLowerCase().includes(producerSearch.toLowerCase())).map(producer=>(
                          <button key={producer} className="flex items-center gap-2 px-3 py-1.5 text-[12px] w-full text-left transition-colors" style={{fontFamily:FONT,color:c.text}} onMouseEnter={e=>e.currentTarget.style.background=c.hoverBg} onMouseLeave={e=>e.currentTarget.style.background="transparent"} onClick={()=>toggleSet(producerFilter,producer,setProducerFilter)}>
                            <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0" style={{border:`1.5px solid ${c.borderStrong}`,background:c.cardBg}}>{producerFilter.has(producer)&&<svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div>
                            {producer}
                          </button>
                        ))}
                      </div>
                      <button onClick={()=>{setProducerFilter(new Set());setProducerSearch("");}} className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors" style={{fontFamily:FONT,color:"#A614C3",borderTop:`1px solid ${c.border}`}} onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}><RefreshCw className="w-3.5 h-3.5"/>Reset Filter</button>
                    </div>
                  </>)}
                </div>
                )}
              </div>
              <div className="overflow-y-auto flex-1">
                {agencyPolicies.length === 0 ? (
                  <div className="flex items-center justify-center py-16 text-[13px]" style={{ fontFamily:FONT, color:c.muted }}>No policies found</div>
                ) : agencyPolicies.map((p,i,arr) => {
                  const isRenewal = p.status === "Upcoming Renewal";
                  return (
                    <div key={p.id} className="grid px-5 py-3.5 items-center gap-4 transition-colors cursor-pointer"
                      style={{ gridTemplateColumns:qpGridTemplate, borderBottom:i!==arr.length-1?`1px solid ${c.border}`:"none", background:isRenewal?"rgba(116,195,183,0.08)":"transparent", borderLeft:isRenewal?"3px solid #74C3B7":"3px solid transparent" }}
                      onMouseEnter={e=>(e.currentTarget.style.background=isRenewal?"rgba(116,195,183,0.14)":c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background=isRenewal?"rgba(116,195,183,0.08)":"transparent")}>
                      {!qpHiddenCols.has("created")      && <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{new Date(p.createdDate).toLocaleDateString()}</div>}
                      {!qpHiddenCols.has("policyNumber") && <div className="text-[12px] font-semibold" style={{ fontFamily:FONT, color: isDark ? "#74C3B7" : "#A614C3" }}>{p.policyNumber}</div>}
                      {!qpHiddenCols.has("applicant")    && <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{p.applicant}</div>}
                      {!qpHiddenCols.has("dba")          && <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{p.dba||"—"}</div>}
                      {!qpHiddenCols.has("effective")    && <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{new Date(p.effectiveDate).toLocaleDateString()}</div>}
                      {!qpHiddenCols.has("lob")          && <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{p.lob}</div>}
                      {!qpHiddenCols.has("status")       && <div><StatusPill status={p.status} isDark={isDark} /></div>}
                      {!qpHiddenCols.has("producer")     && <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{p.producer}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
            </div>
          </div>
          );
        })()}

        {/* ── Quotes tab ── */}
        {detailTab === "quotes" && (
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-stretch overflow-hidden transition-all"
                style={{ background: c.cardBg, border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB"}`, borderRadius:10 }}
                onMouseEnter={e=>(e.currentTarget.style.filter="brightness(1.12)")} onMouseLeave={e=>(e.currentTarget.style.filter="none")}>
                <input placeholder="Search Quotes" value={detailSearch} onChange={e=>setDetailSearch(e.target.value)}
                  className="outline-none px-4 py-2 text-[13px]"
                  style={{ fontFamily:FONT, background:"transparent", color:c.text, width:200, borderRadius:"10px 0 0 10px" }} />
                <button className="px-5 text-[12px] font-semibold text-white flex-shrink-0"
                  style={{ background:btnGrad, fontFamily:FONT, borderRadius:"0 7px 7px 0" }}>Submit</button>
              </div>
              <div className="relative">
                <select className="appearance-none pl-3 pr-8 py-2 outline-none cursor-pointer"
                  style={{ fontFamily:FONT, background:`linear-gradient(${c.cardBg},${c.cardBg}) padding-box, linear-gradient(90deg,#5C2ED4 0%,#A614C3 65%) border-box`, border:"1px solid transparent", color:c.text, fontSize:11, fontWeight:500, borderRadius:7 }}>
                  <option>Past 20 Days</option><option>Past 60 Days</option><option>Past 90 Days</option><option>All Time</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color:c.muted }} />
              </div>
              <div className="flex items-center gap-1 ml-1" style={{ borderLeft:`1px solid ${c.border}`, paddingLeft:10 }}>
                <button title="Reset filters" onClick={() => { setDetailSearch(""); setLobFilter(new Set()); setStatusFilter(new Set()); setApplicantFilter(new Set()); setProducerFilter(new Set()); setLobSearch(""); setStatusSearch(""); setApplicantSearch(""); setProducerSearch(""); setLobOpen(false); setStatusOpen(false); setApplicantOpen(false); setProducerOpen(false); setQpSortKey(null); setQpSortDir("asc"); }}
                  className="p-2 rounded-lg transition-colors" style={{ color:"#A614C3" }} onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}><RefreshCw className="w-4 h-4"/></button>
                <div className="relative" onClick={e=>e.stopPropagation()}><button title="View columns" onClick={()=>setQpViewOpen(o=>!o)} className="p-2 rounded-lg transition-colors" style={{ color:"#A614C3", background: qpViewOpen ? c.hoverBg : "transparent" }} onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background = qpViewOpen ? c.hoverBg : "transparent")}><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="2" y="2" rx="1"/><rect width="5" height="5" x="9.5" y="2" rx="1"/><rect width="5" height="5" x="17" y="2" rx="1"/><rect width="5" height="5" x="2" y="9.5" rx="1"/><rect width="5" height="5" x="9.5" y="9.5" rx="1"/><rect width="5" height="5" x="17" y="9.5" rx="1"/><rect width="5" height="5" x="2" y="17" rx="1"/><rect width="5" height="5" x="9.5" y="17" rx="1"/><rect width="5" height="5" x="17" y="17" rx="1"/></svg></button>{qpViewOpen && (<div className="absolute right-0 top-full mt-1 z-30 w-[220px] rounded-xl shadow-xl overflow-hidden" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}><div className="px-4 py-2.5 text-[11px] uppercase tracking-wider font-semibold" style={{ fontFamily: FONT, color: c.muted, borderBottom: `1px solid ${c.border}`, letterSpacing: "0.06em" }}>Show Columns</div><div className="py-1.5 max-h-[280px] overflow-y-auto">{QP_COLUMNS.map(col => { const visible = !qpHiddenCols.has(col.key); return (<label key={col.key} className="flex items-center gap-2.5 px-4 py-2 cursor-pointer transition-colors" onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")} onClick={() => setQpHiddenCols(prev => { const s = new Set(prev); s.has(col.key) ? s.delete(col.key) : s.add(col.key); return s; })}><div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0" style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>{visible && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div><span className="text-[12px]" style={{ fontFamily: FONT, color: c.text }}>{col.label}</span></label>); })}</div><button onClick={() => setQpHiddenCols(new Set())} className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors" style={{ fontFamily: FONT, color: "#A614C3", borderTop: `1px solid ${c.border}` }} onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}><RefreshCw className="w-3.5 h-3.5" />Show All</button></div>)}</div>
                <button title="Export" className="p-2 rounded-lg transition-colors" style={{ color:"#A614C3" }} onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}><Download className="w-4 h-4"/></button>
              </div>
            </div>
            <div className="rounded-xl flex flex-col flex-1 min-h-0" style={{ background:c.cardBg, border:`1px solid ${c.border}` }}>
              <div className="grid px-5 py-3 gap-4 rounded-t-xl" style={{ gridTemplateColumns:qpGridTemplate, borderBottom:`1px solid ${c.border}`, background:mutedBg }}>
                {/* Created */}
                {!qpHiddenCols.has("created") && (
                <button onClick={()=>{if(qpSortKey==="createdDate")setQpSortDir(d=>d==="asc"?"desc":"asc");else{setQpSortKey("createdDate");setQpSortDir("asc");}}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none text-left" style={{fontFamily:FONT,color:c.muted}}>
                  Created<span className="inline-flex ml-0.5"><svg width="14" height="9" viewBox="0 0 14 9" fill="none"><path d="M4 8V1M4 1L2 3M4 1L6 3" stroke={qpSortKey==="createdDate"&&qpSortDir==="asc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 1V8M10 8L8 6M10 8L12 6" stroke={qpSortKey==="createdDate"&&qpSortDir==="desc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                </button>
                )}
                {/* Submission ID */}
                {!qpHiddenCols.has("policyNumber") && (
                <button onClick={()=>{if(qpSortKey==="quoteId")setQpSortDir(d=>d==="asc"?"desc":"asc");else{setQpSortKey("quoteId");setQpSortDir("asc");}}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none text-left" style={{fontFamily:FONT,color:c.muted}}>
                  Submission ID<span className="inline-flex ml-0.5"><svg width="14" height="9" viewBox="0 0 14 9" fill="none"><path d="M4 8V1M4 1L2 3M4 1L6 3" stroke={qpSortKey==="quoteId"&&qpSortDir==="asc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 1V8M10 8L8 6M10 8L12 6" stroke={qpSortKey==="quoteId"&&qpSortDir==="desc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                </button>
                )}
                {/* Applicant */}
                {!qpHiddenCols.has("applicant") && (
                <div className="relative">
                  <button onClick={()=>{closeAllDropdowns();setApplicantOpen(o=>!o);}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none" style={{fontFamily:FONT,color:applicantFilter.size>0?"#A614C3":c.muted}}>
                    Applicant<span className="inline-flex ml-1"><svg width="7" height="5" viewBox="0 0 7 5" fill="none"><path d="M3.5 5L0.5 0H6.5L3.5 5Z" fill={applicantFilter.size>0?"#A614C3":sub}/></svg></span>
                  </button>
                  {applicantOpen&&(<>
                    <div className="fixed inset-0 z-10" onClick={()=>setApplicantOpen(false)}/>
                    <div className="absolute top-full mt-1 z-30 rounded-xl shadow-lg overflow-hidden min-w-[220px]" style={{background:c.cardBg,border:`1px solid ${c.border}`, left: -50}}>
                      <div className="p-2" style={{borderBottom:`1px solid ${c.border}`}}>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg" style={{background:isDark?"rgba(255,255,255,0.05)":"#F9FAFB",border:`1px solid ${c.border}`}}>
                          <Search className="w-3.5 h-3.5 flex-shrink-0" style={{color:c.muted}}/><input value={applicantSearch} onChange={e=>setApplicantSearch(e.target.value)} placeholder="Search Agent" className="outline-none text-[12px] flex-1 bg-transparent" style={{fontFamily:FONT,color:c.text}}/>
                        </div>
                      </div>
                      <div className="px-3 py-2" style={{borderBottom:`1px solid ${c.border}`}}>
                        <button className="flex items-center gap-2 text-[12px] w-full text-left" style={{fontFamily:FONT,color:c.text}} onClick={()=>{const all=uniqueQApplicants;setApplicantFilter(applicantFilter.size===all.length?new Set():new Set(all));}}>
                          <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0" style={{border:`1.5px solid ${c.borderStrong}`,background:c.cardBg}}>{applicantFilter.size===uniqueQApplicants.length&&uniqueQApplicants.length>0&&<svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div>
                          Select All
                        </button>
                      </div>
                      <div className="max-h-[180px] overflow-y-auto py-1">
                        {uniqueQApplicants.filter(a=>!applicantSearch||a.toLowerCase().includes(applicantSearch.toLowerCase())).map(applicant=>(
                          <button key={applicant} className="flex items-center gap-2 px-3 py-1.5 text-[12px] w-full text-left transition-colors" style={{fontFamily:FONT,color:c.text}} onMouseEnter={e=>e.currentTarget.style.background=c.hoverBg} onMouseLeave={e=>e.currentTarget.style.background="transparent"} onClick={()=>toggleSet(applicantFilter,applicant,setApplicantFilter)}>
                            <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0" style={{border:`1.5px solid ${c.borderStrong}`,background:c.cardBg}}>{applicantFilter.has(applicant)&&<svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div>
                            {applicant}
                          </button>
                        ))}
                      </div>
                      <button onClick={()=>{setApplicantFilter(new Set());setApplicantSearch("");}} className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors" style={{fontFamily:FONT,color:"#A614C3",borderTop:`1px solid ${c.border}`}} onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}><RefreshCw className="w-3.5 h-3.5"/>Reset Filter</button>
                    </div>
                  </>)}
                </div>
                )}
                {/* DBA */}
                {!qpHiddenCols.has("dba") && (
                <button onClick={()=>{if(qpSortKey==="dba")setQpSortDir(d=>d==="asc"?"desc":"asc");else{setQpSortKey("dba");setQpSortDir("asc");}}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none text-left" style={{fontFamily:FONT,color:c.muted}}>
                  DBA<span className="inline-flex ml-0.5"><svg width="14" height="9" viewBox="0 0 14 9" fill="none"><path d="M4 8V1M4 1L2 3M4 1L6 3" stroke={qpSortKey==="dba"&&qpSortDir==="asc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 1V8M10 8L8 6M10 8L12 6" stroke={qpSortKey==="dba"&&qpSortDir==="desc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                </button>
                )}
                {/* Effective */}
                {!qpHiddenCols.has("effective") && (
                <button onClick={()=>{if(qpSortKey==="effectiveDate")setQpSortDir(d=>d==="asc"?"desc":"asc");else{setQpSortKey("effectiveDate");setQpSortDir("asc");}}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none text-left" style={{fontFamily:FONT,color:c.muted}}>
                  Effective<span className="inline-flex ml-0.5"><svg width="14" height="9" viewBox="0 0 14 9" fill="none"><path d="M4 8V1M4 1L2 3M4 1L6 3" stroke={qpSortKey==="effectiveDate"&&qpSortDir==="asc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 1V8M10 8L8 6M10 8L12 6" stroke={qpSortKey==="effectiveDate"&&qpSortDir==="desc"?(isDark?"#fff":"#374151"):sub} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                </button>
                )}
                {/* LOB */}
                {!qpHiddenCols.has("lob") && renderMultiFilter({
                  label: "LOB", options: LOB_OPTIONS, filter: lobFilter, setFilter: setLobFilter,
                  search: lobSearch, setSearch: setLobSearch, open: lobOpen, setOpen: setLobOpen,
                  searchPlaceholder: "Search LOB",
                })}
                {/* Status */}
                {!qpHiddenCols.has("status") && renderMultiFilter({
                  label: "Status", options: QUOTE_STATUS_OPTIONS, filter: statusFilter, setFilter: setStatusFilter,
                  search: statusSearch, setSearch: setStatusSearch, open: statusOpen, setOpen: setStatusOpen,
                  searchPlaceholder: "Search Status",
                })}
                {/* Producer */}
                {!qpHiddenCols.has("producer") && (
                <div className="relative">
                  <button onClick={()=>{closeAllDropdowns();setProducerOpen(o=>!o);}} className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider cursor-pointer select-none" style={{fontFamily:FONT,color:producerFilter.size>0?"#A614C3":c.muted}}>
                    Producer<span className="inline-flex ml-1"><svg width="7" height="5" viewBox="0 0 7 5" fill="none"><path d="M3.5 5L0.5 0H6.5L3.5 5Z" fill={producerFilter.size>0?"#A614C3":sub}/></svg></span>
                  </button>
                  {producerOpen&&(<>
                    <div className="fixed inset-0 z-10" onClick={()=>setProducerOpen(false)}/>
                    <div className="absolute top-full mt-1 z-30 rounded-xl shadow-lg overflow-hidden min-w-[220px]" style={{background:c.cardBg,border:`1px solid ${c.border}`, left: -50}}>
                      <div className="p-2" style={{borderBottom:`1px solid ${c.border}`}}>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg" style={{background:isDark?"rgba(255,255,255,0.05)":"#F9FAFB",border:`1px solid ${c.border}`}}>
                          <Search className="w-3.5 h-3.5 flex-shrink-0" style={{color:c.muted}}/><input value={producerSearch} onChange={e=>setProducerSearch(e.target.value)} placeholder="Search Agent" className="outline-none text-[12px] flex-1 bg-transparent" style={{fontFamily:FONT,color:c.text}}/>
                        </div>
                      </div>
                      <div className="px-3 py-2" style={{borderBottom:`1px solid ${c.border}`}}>
                        <button className="flex items-center gap-2 text-[12px] w-full text-left" style={{fontFamily:FONT,color:c.text}} onClick={()=>{const all=uniqueQProducers;setProducerFilter(producerFilter.size===all.length?new Set():new Set(all));}}>
                          <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0" style={{border:`1.5px solid ${c.borderStrong}`,background:c.cardBg}}>{producerFilter.size===uniqueQProducers.length&&uniqueQProducers.length>0&&<svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div>
                          Select All
                        </button>
                      </div>
                      <div className="max-h-[180px] overflow-y-auto py-1">
                        {uniqueQProducers.filter(p=>!producerSearch||p.toLowerCase().includes(producerSearch.toLowerCase())).map(producer=>(
                          <button key={producer} className="flex items-center gap-2 px-3 py-1.5 text-[12px] w-full text-left transition-colors" style={{fontFamily:FONT,color:c.text}} onMouseEnter={e=>e.currentTarget.style.background=c.hoverBg} onMouseLeave={e=>e.currentTarget.style.background="transparent"} onClick={()=>toggleSet(producerFilter,producer,setProducerFilter)}>
                            <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0" style={{border:`1.5px solid ${c.borderStrong}`,background:c.cardBg}}>{producerFilter.has(producer)&&<svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div>
                            {producer}
                          </button>
                        ))}
                      </div>
                      <button onClick={()=>{setProducerFilter(new Set());setProducerSearch("");}} className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors" style={{fontFamily:FONT,color:"#A614C3",borderTop:`1px solid ${c.border}`}} onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}><RefreshCw className="w-3.5 h-3.5"/>Reset Filter</button>
                    </div>
                  </>)}
                </div>
                )}
              </div>
              <div className="overflow-y-auto flex-1">
                {agencyQuotes.length === 0 ? (
                  <div className="flex items-center justify-center py-16 text-[13px]" style={{ fontFamily:FONT, color:c.muted }}>No quotes found</div>
                ) : agencyQuotes.map((q,i,arr) => {
                  const isIncomplete = q.status === "Incomplete";
                  return (
                    <div key={q.id} className="grid px-5 py-3.5 items-center gap-4 transition-colors cursor-pointer"
                      style={{ gridTemplateColumns:qpGridTemplate, borderBottom:i!==arr.length-1?`1px solid ${c.border}`:"none", background:isIncomplete?"rgba(245,158,11,0.06)":"transparent", borderLeft:isIncomplete?"3px solid #F59E0B":"3px solid transparent" }}
                      onMouseEnter={e=>(e.currentTarget.style.background=isIncomplete?"rgba(245,158,11,0.10)":c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background=isIncomplete?"rgba(245,158,11,0.06)":"transparent")}>
                      {!qpHiddenCols.has("created")      && <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{new Date(q.createdDate).toLocaleDateString()}</div>}
                      {!qpHiddenCols.has("policyNumber") && <div className="text-[12px] font-semibold" style={{ fontFamily:FONT, color: isDark ? "#74C3B7" : "#A614C3" }}>{q.quoteId}</div>}
                      {!qpHiddenCols.has("applicant")    && <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{q.applicant}</div>}
                      {!qpHiddenCols.has("dba")          && <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{q.dba||"—"}</div>}
                      {!qpHiddenCols.has("effective")    && <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{q.effectiveDate?new Date(q.effectiveDate).toLocaleDateString():"—"}</div>}
                      {!qpHiddenCols.has("lob")          && <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{q.lob}</div>}
                      {!qpHiddenCols.has("status")       && <div><StatusPill status={q.status} isDark={isDark} /></div>}
                      {!qpHiddenCols.has("producer")     && <div className="text-[12px]" style={{ fontFamily:FONT, color:c.text }}>{q.producer}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Users tab ── */}
        {detailTab === "users" && (
          <>
            {/* Spotlight dim/blur backdrop — ONLY on the transient attention
                beat right after modal dismiss. Clicking anywhere clears the
                spotlight; the coachmark banner itself stays as the persistent
                entry (see render guarded on `coachmarkVisible` below). */}
            {spotlightActive && (
              <div
                className="fixed inset-0"
                onClick={() => dismissSpotlight()}
                aria-label="Dismiss tip"
                role="button"
                tabIndex={-1}
                style={{
                  background: "rgba(0,0,0,0.35)",
                  backdropFilter: "blur(2px)",
                  WebkitBackdropFilter: "blur(2px)",
                  zIndex: 40,
                  cursor: "default",
                  animation: "teamSetupSpotlightIn 220ms ease-out",
                }}
              />
            )}
            <div
              className="flex flex-col"
              onClick={() => { setUserMenuId(null); setUserMenuPos(null); setJobTitleOpen(false); }}
            >
            {/* Team-setup coachmark — PERSISTENT standing entry back into
                bulk setup. Visible for the entire pending window (not just
                the first-dismiss beat). On the transient `spotlightActive`
                moment it lifts above the dim backdrop with a shadow; the
                rest of the time it sits flush as a normal informational
                banner matching the Legacy BTIS banner family. */}
            {coachmarkVisible && (
              <div
                className="rounded-xl p-4 mb-4 flex items-start gap-3"
                onClick={e => e.stopPropagation()}
                style={{
                  background: isDark ? "#1E2240" : "#F9FAFB",
                  border: `1px solid ${c.border}`,
                  // Lift above the dim backdrop only while spotlight is on.
                  position: spotlightActive ? "relative" : undefined,
                  zIndex: spotlightActive ? 41 : undefined,
                  boxShadow: spotlightActive
                    ? (isDark
                        ? "0 20px 48px rgba(0,0,0,0.45)"
                        : "0 20px 48px rgba(0,0,0,0.12)")
                    : undefined,
                  transition: "box-shadow 220ms ease-out",
                }}
              >
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <defs>
                    <linearGradient id="team-coach-razz" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="0">
                      <stop offset="0%" stopColor={isDark ? "#C9A6FF" : "#5C2ED4"} />
                      <stop offset="100%" stopColor={isDark ? "#E68BF2" : "#A614C3"} />
                    </linearGradient>
                  </defs>
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="url(#team-coach-razz)" />
                  <circle cx="9" cy="7" r="4" stroke="url(#team-coach-razz)" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="url(#team-coach-razz)" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="url(#team-coach-razz)" />
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold"
                    style={{
                      ...font,
                      backgroundImage: isDark
                        ? "linear-gradient(88.54deg, #C9A6FF 0.1%, #E68BF2 63.88%)"
                        : "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}>
                    Assign admins & titles here
                  </div>
                  <div className="text-[12px] mt-0.5" style={{ ...font, color: c.muted }}>
                    Click the <span style={{ fontWeight: 600, color: c.text }}>Admin</span> icon in any row to grant or revoke admin. For <span style={{ fontWeight: 600, color: c.text }}>Job title</span> changes, use the <span style={{ fontWeight: 600, color: c.text }}>⋮</span> menu → Edit User, or reopen the bulk setup.
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 self-start">
                  {onCompleteTeamSetup && (
                    <button
                      type="button"
                      onClick={() => { onCompleteTeamSetup(); dismissSpotlight(); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap transition-all cursor-pointer"
                      style={{
                        ...font,
                        background: "transparent",
                        border: `1px solid ${c.border}`,
                        color: c.text,
                      }}
                    >
                      Done setting up
                    </button>
                  )}
                  {onOpenTeamSetup && (
                    <button
                      type="button"
                      onClick={() => { onOpenTeamSetup(); dismissSpotlight(); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white whitespace-nowrap transition-all cursor-pointer"
                      style={{
                        ...font,
                        background: "linear-gradient(90deg, #5C2ED4 0%, #A614C3 65%)",
                        border: "none",
                        marginTop: 0,
                      }}
                    >
                      Open bulk setup
                    </button>
                  )}
                </div>
              </div>
            )}
            {/* Legacy BTIS auto-detect banner — shown when there are new
                users on the legacy admin page that haven't been copied
                to NorbieLink yet. External-admin only (clientMode); the
                internal super-admin surface doesn't own user migration
                for an agency, so this banner would just be noise there.
                Matches the "Pending updates" banner style (neutral card
                + razz-gradient title + razz-stroked icon) so it reads
                as one of the standard alert rows. */}
            {viewMode === "client" && !legacyBannerDismissed && legacyNewCount > 0 && (
              <div className="rounded-xl p-4 mb-4 flex items-start gap-3"
                style={{
                  background: isDark ? "rgba(255,255,255,0.04)" : "#F9FAFB",
                  border: `1px solid ${c.border}`,
                }}>
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <defs>
                    <linearGradient id="legacy-import-razz" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="24" y2="0">
                      <stop offset="0%" stopColor={isDark ? "#C9A6FF" : "#5C2ED4"} />
                      <stop offset="100%" stopColor={isDark ? "#E68BF2" : "#A614C3"} />
                    </linearGradient>
                  </defs>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="url(#legacy-import-razz)" />
                  <polyline points="7 10 12 15 17 10" stroke="url(#legacy-import-razz)" />
                  <line x1="12" x2="12" y1="15" y2="3" stroke="url(#legacy-import-razz)" />
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold"
                    style={{
                      ...font,
                      backgroundImage: isDark
                        ? "linear-gradient(88.54deg, #C9A6FF 0.1%, #E68BF2 63.88%)"
                        : "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}>
                    We found {legacyRosterTagged.length} users in your legacy BTIS account
                  </div>
                  <div className="text-[12px] mt-0.5" style={{ ...font, color: c.muted }}>
                    {legacyNewCount} haven&apos;t been added to NorbieLink yet
                    {legacyDupCount > 0 ? ` (${legacyDupCount} already exist here)` : ""}. Import them in one click instead of re-entering by hand.
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={openLegacyImport}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold text-white rounded-lg transition-all whitespace-nowrap"
                    style={{ ...font, background: btnGrad }}
                    onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.08)")}
                    onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
                    Review & import
                  </button>
                  {/* Dismiss — collapsed from a labeled "Not now" button into an
                      icon-only X to match the Team Setup coachmark pattern and
                      drop a redundant verbal control next to the primary CTA. */}
                  <button
                    onClick={() => setLegacyBannerDismissed(true)}
                    aria-label="Dismiss legacy BTIS import prompt"
                    className="flex-shrink-0 cursor-pointer self-start"
                    style={{
                      background: "transparent",
                      border: "none",
                      padding: 2,
                      color: isDark ? "#8B8FA8" : "#9CA3AF",
                      marginTop: 2,
                      marginRight: -4,
                    }}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            {/* Toolbar */}
            <div className="flex items-center gap-2 mb-4 flex-shrink-0">
              <div className="flex items-stretch overflow-hidden transition-all"
                style={{ background: c.cardBg, border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB"}`, borderRadius:10 }}
                onMouseEnter={e=>(e.currentTarget.style.filter="brightness(1.12)")} onMouseLeave={e=>(e.currentTarget.style.filter="none")}>
                <input placeholder="Search User" value={userSearch} onChange={e=>setUserSearch(e.target.value)}
                  className="outline-none px-4 py-2 text-[13px]"
                  style={{ fontFamily:FONT, background:"transparent", color:c.text, width:180, borderRadius:"10px 0 0 10px" }} />
                <button className="px-5 text-[12px] font-semibold text-white flex-shrink-0"
                  style={{ background:btnGrad, fontFamily:FONT, borderRadius:"0 7px 7px 0" }}>Submit</button>
              </div>
              <button className="flex items-center gap-1.5 text-[12px] font-semibold text-white transition-all flex-shrink-0"
                style={{ fontFamily:FONT, background:btnGrad, height:37, padding:"9px 16px", borderRadius:10, boxSizing:"border-box" as const }}
                onMouseEnter={e=>(e.currentTarget.style.filter="brightness(1.1)")}
                onMouseLeave={e=>(e.currentTarget.style.filter="none")}
                onClick={e=>{e.stopPropagation();setAddUserOpen(true);}}>
                <Plus className="w-3.5 h-3.5" />Add New User
              </button>
              <button className="flex items-center gap-[10px] text-[12px] font-semibold transition-all flex-shrink-0"
                style={{ fontFamily:FONT, height:37, padding:"9px 16px", borderRadius:"5.58px",
                  border: isDark ? "1.04px solid rgba(255,255,255,0.15)" : "1.04px solid #E5E7EB",
                  background: isDark
                    ? "linear-gradient(180deg, rgba(255,255,255,0.10) -0.44%, rgba(192,192,192,0.10) 49.45%, rgba(172,172,172,0.10) 99.33%)"
                    : "linear-gradient(180deg, rgba(255,255,255,0.1) -0.44%, rgba(192,192,192,0.1) 49.45%, rgba(172,172,172,0.1) 99.33%), #FFFFFF",
                  color: c.text, boxSizing:"border-box" as const }}
                onMouseEnter={e=>(e.currentTarget.style.background = isDark
                  ? "linear-gradient(180deg, rgba(255,255,255,0.18) -0.44%, rgba(192,192,192,0.18) 49.45%, rgba(172,172,172,0.18) 99.33%)"
                  : "linear-gradient(180deg, rgba(255,255,255,0.15) -0.44%, rgba(192,192,192,0.15) 49.45%, rgba(172,172,172,0.15) 99.33%), #F9FAFB")}
                onMouseLeave={e=>(e.currentTarget.style.background = isDark
                  ? "linear-gradient(180deg, rgba(255,255,255,0.10) -0.44%, rgba(192,192,192,0.10) 49.45%, rgba(172,172,172,0.10) 99.33%)"
                  : "linear-gradient(180deg, rgba(255,255,255,0.1) -0.44%, rgba(192,192,192,0.1) 49.45%, rgba(172,172,172,0.1) 99.33%), #FFFFFF")}
                onClick={e=>{e.stopPropagation();setImportUsersOpen(true);}}>
                <Upload className="w-3.5 h-3.5" style={{ color: teal }} />Import Users
              </button>
              {/* Legacy import button — available in BOTH views so super
                  admin can still migrate on behalf of an agency. The
                  auto-detect BANNER stays client-only (less useful as a
                  nudge for internal staff), but the manual entry point
                  is universal. */}
              <button className="flex items-center gap-[10px] text-[12px] font-semibold transition-all flex-shrink-0"
                style={{ fontFamily:FONT, height:37, padding:"9px 16px", borderRadius:"5.58px",
                  border: isDark ? "1.04px solid rgba(255,255,255,0.15)" : "1.04px solid #E5E7EB",
                  background: isDark
                    ? "linear-gradient(180deg, rgba(255,255,255,0.10) -0.44%, rgba(192,192,192,0.10) 49.45%, rgba(172,172,172,0.10) 99.33%)"
                    : "linear-gradient(180deg, rgba(255,255,255,0.1) -0.44%, rgba(192,192,192,0.1) 49.45%, rgba(172,172,172,0.1) 99.33%), #FFFFFF",
                  color: c.text, boxSizing:"border-box" as const }}
                onMouseEnter={e=>(e.currentTarget.style.background = isDark
                  ? "linear-gradient(180deg, rgba(255,255,255,0.18) -0.44%, rgba(192,192,192,0.18) 49.45%, rgba(172,172,172,0.18) 99.33%)"
                  : "linear-gradient(180deg, rgba(255,255,255,0.15) -0.44%, rgba(192,192,192,0.15) 49.45%, rgba(172,172,172,0.15) 99.33%), #F9FAFB")}
                onMouseLeave={e=>(e.currentTarget.style.background = isDark
                  ? "linear-gradient(180deg, rgba(255,255,255,0.10) -0.44%, rgba(192,192,192,0.10) 49.45%, rgba(172,172,172,0.10) 99.33%)"
                  : "linear-gradient(180deg, rgba(255,255,255,0.1) -0.44%, rgba(192,192,192,0.1) 49.45%, rgba(172,172,172,0.1) 99.33%), #FFFFFF")}
                onClick={e=>{e.stopPropagation(); openLegacyImport();}}>
                <Download className="w-3.5 h-3.5" style={{ color: "#A614C3" }} />Import from Legacy
              </button>
              <div className="ml-auto flex items-center gap-2">
                {/* Archive toggle removed — the "Deactivate User" action now permanently removes
                    the user (after reassigning their accounts) instead of moving them to an
                    archived list, so there's no separate archived view to toggle into. */}
                {/* Export — split-button matching Notes "New" style. Main click downloads in current format, chevron picks format. */}
                {(() => {
                  const cols: { label: string; get: (u: typeof agencyUsers[number]) => string }[] = [
                    { label: "Name",      get: u => u.name },
                    { label: "Job title", get: u => u.jobTitle },
                    { label: "Email",     get: u => u.email },
                    { label: "Phone",     get: u => u.phone || "" },
                    { label: "Ext",       get: u => u.ext || "" },
                    { label: "Status",    get: u => inactiveUserIds.has(u.id) ? "Inactive" : "Active" },
                  ];
                  const triggerDownload = (fmt: "csv"|"xlsx") => {
                    const rows = agencyUsers.map(u => cols.map(col => col.get(u)));
                    const fname = `${agency.code}-users.${fmt === "csv" ? "csv" : "xlsx"}`;
                    const csv = [cols.map(c => c.label).join(","), ...rows.map(r => r.map(v => /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v).join(","))].join("\n");
                    const blob = new Blob([csv], { type: fmt === "csv" ? "text/csv" : "application/vnd.ms-excel" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a"); a.href = url; a.download = fname; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
                    setUserExportFormatOpen(false);
                    showToast({ title: "Export started", description: `${fname} (${rows.length} ${rows.length === 1 ? "row" : "rows"}) downloading.` });
                  };
                  return (
                    <div className="relative" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center rounded-lg overflow-hidden" style={{ background: btnGrad }}>
                        <button onClick={() => triggerDownload(userExportFormat)}
                          className="px-3 py-1.5 text-[12px] font-semibold text-white flex items-center gap-1.5"
                          style={{ fontFamily: FONT }}>
                          <Download className="w-3 h-3" />Export {userExportFormat === "csv" ? "CSV" : "Excel"}
                        </button>
                        <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.2)" }} />
                        <button onClick={() => setUserExportFormatOpen(p => !p)} className="px-2 py-1.5 text-white flex items-center" title="Choose format">
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                      {userExportFormatOpen && (
                        <div className="absolute right-0 top-10 z-30 w-56 rounded-xl shadow-xl py-1.5" style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                          <p className="text-[10px] font-semibold uppercase tracking-wide px-3 py-1.5" style={{ fontFamily: FONT, color: c.muted }}>Download as</p>
                          {([["csv", "CSV", "Comma-separated"], ["xlsx", "Excel", "Native .xlsx file"]] as ["csv"|"xlsx", string, string][]).map(([f, label, desc]) => (
                            <button key={f} onClick={() => { setUserExportFormat(f); triggerDownload(f); }}
                              className="w-full text-left px-3 py-2 transition-colors"
                              style={{ fontFamily: FONT, background: userExportFormat === f ? "rgba(168,85,247,0.08)" : "transparent" }}
                              onMouseEnter={e => { if (userExportFormat !== f) e.currentTarget.style.background = c.hoverBg; }}
                              onMouseLeave={e => { if (userExportFormat !== f) e.currentTarget.style.background = "transparent"; }}>
                              <div className="flex items-center justify-between">
                                <span className="text-[12px] font-semibold" style={{ color: userExportFormat === f ? "#A614C3" : c.text }}>{label}</span>
                                {userExportFormat === f && <svg width="10" height="8" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                              </div>
                              <div className="text-[11px] mt-0.5" style={{ color: c.muted }}>{desc}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl overflow-hidden flex flex-col flex-1 min-h-0" style={{ border:`1px solid ${c.border}` }}>
              {/* Header */}
              <div className="flex-shrink-0" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#FAFAFA", borderBottom:`1px solid ${c.border}`, overflow: "hidden", scrollbarGutter: "stable" }}>
                <div className="grid items-center px-6" style={{ gridTemplateColumns:"minmax(0,1.1fr) minmax(0,2.75fr) minmax(0,1.7fr) minmax(0,1.9fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)", gap:16, height:44 }}>
                  {[
                    { label:"NAME", sort:true, filter:false },
                    { label:"ADMIN", sort:true, filter:false },
                    { label:"JOB TITLE", sort:false, filter:true },
                    { label:"EMAIL", sort:false, filter:false },
                    { label:"PHONE", sort:false, filter:false },
                    { label:"EXT", sort:false, filter:false },
                    { label:"STATUS", sort:true, filter:false },
                    { label:"ACTION", sort:false, filter:false },
                  ].map(({ label, sort, filter }) => (
                    filter ? (
                      <div key={label} className="relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setJobTitleOpen(p => !p)}
                          className="flex items-center gap-1 select-none cursor-pointer"
                          style={{ color: jobTitleFilter.size > 0 ? "#A614C3" : c.muted }}>
                          <span className="text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap" style={{ fontFamily:FONT }}>{label}</span>
                          <ChevronDown className="w-3 h-3" />
                        </button>
                        {jobTitleOpen && (
                          <div className="absolute left-0 top-8 z-30 w-[240px] rounded-xl shadow-xl overflow-hidden"
                            style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                            <div className="p-3" style={{ borderBottom: `1px solid ${c.border}` }}>
                              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ border: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB" }}>
                                <Search className="w-3.5 h-3.5" style={{ color: c.muted }} />
                                <input placeholder="Search Title" value={jobTitleSearch} onChange={e => setJobTitleSearch(e.target.value)}
                                  className="flex-1 outline-none text-[12px] bg-transparent" style={{ fontFamily: FONT, color: c.text }} />
                              </div>
                            </div>
                            <div className="py-1.5 max-h-[260px] overflow-y-auto">
                              {JOB_TITLES.filter(t => !jobTitleSearch || t.toLowerCase().includes(jobTitleSearch.toLowerCase())).map(t => {
                                const checked = jobTitleFilter.has(t);
                                return (
                                  <label key={t} className="flex items-center gap-2.5 px-4 py-2 cursor-pointer transition-colors"
                                    onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                                    <Checkbox checked={checked} onClick={() => { setJobTitleFilter(prev => { const s = new Set(prev); checked ? s.delete(t) : s.add(t); return s; }); }} />
                                    <span className="text-[13px]" style={{ fontFamily: FONT, color: c.text }}>{t}</span>
                                  </label>
                                );
                              })}
                            </div>
                            <button onClick={() => { setJobTitleFilter(new Set()); setJobTitleSearch(""); }}
                              className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors"
                              style={{ fontFamily: FONT, color: "#A614C3", borderTop: `1px solid ${c.border}` }}
                              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                              <RefreshCw className="w-3.5 h-3.5" />Reset Filter
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (() => {
                      const sortKey = label === "NAME" ? "name" : label === "ADMIN" ? "admin" : label === "STATUS" ? "status" : null;
                      const isActive = sortKey && userSort.key === sortKey;
                      const ascStroke = isActive && userSort.dir === "asc" ? c.text : sub;
                      const descStroke = isActive && userSort.dir === "desc" ? c.text : sub;
                      const onClick = sort && sortKey
                        ? () => setUserSort(prev => prev.key === sortKey ? { key: sortKey, dir: prev.dir === "asc" ? "desc" : "asc" } : { key: sortKey, dir: "asc" })
                        : undefined;
                      return (
                      <div key={label} className={`flex items-center gap-1 select-none ${label === "ADMIN" || label === "EXT" || label === "ACTION" || label === "STATUS" ? "justify-center" : "justify-start"}`} style={{ cursor: sort ? "pointer" : "default" }} onClick={onClick}>
                        <span className="text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap" style={{ fontFamily:FONT, color:c.muted }}>{label}</span>
                        {sort && (
                          <span className="inline-flex items-center ml-1 flex-shrink-0" style={{ verticalAlign: "middle", gap: 1 }}>
                            <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
                              <path d="M3.5 9V2M3.5 2L1.5 4M3.5 2L5.5 4" stroke={ascStroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
                              <path d="M3.5 1V8M3.5 8L1.5 6M3.5 8L5.5 6" stroke={descStroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                        )}
                      </div>
                      );
                    })()
                  ))}
                </div>
              </div>

              {/* No-Principal guard — if the agency has active users but none of them is Principal,
                  surface a CTA to assign one. Either pick from existing users or jump to the Add User flow. */}
              {(() => {
                const activeForAgency = mockAgencyUsers.filter(u => u.agencyId === agency.id && !removedUserIds.has(u.id) && !inactiveUserIds.has(u.id));
                const hasPrincipal = activeForAgency.some(u =>
                  principalOverride && u.id === principalOverride.newId ? true
                  : principalOverride && u.id === principalOverride.oldId ? false
                  : u.jobTitle === "Principal"
                );
                if (hasPrincipal || usersView !== "active" || activeForAgency.length === 0) return null;
                return (
                  <div className="px-6 py-2.5 flex items-center gap-2 text-[12px]"
                    style={{ fontFamily: FONT, color: c.text, background: c.cardBg, borderBottom: `1px solid ${c.border}` }}>
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#F59E0B" }} />
                    <span>No Principal assigned — every agency requires one.</span>
                    <button onClick={() => { setAssignPrincipalChoice(""); setAssignPrincipalOpen(true); }}
                      className="font-semibold transition-colors ml-auto" style={{ color: "#A614C3" }}>Pick existing</button>
                    <span style={{ color: c.muted }}>·</span>
                    <button onClick={() => { setAuJobTitle("Principal"); setAddUserOpen(true); }}
                      className="font-semibold transition-colors" style={{ color: "#A614C3" }}>Add new user</button>
                  </div>
                );
              })()}

              {/* Rows */}
              <div className="overflow-y-auto flex-1" style={{ background: c.cardBg, scrollbarGutter: "stable" }}>
                {agencyUsers.length === 0 ? (() => {
                  // When search has 0 active matches, check if any inactive users would match the same query
                  // and offer to surface them with a one-click "Show inactive" affordance.
                  const q = userSearch.trim().toLowerCase();
                  const inactiveMatchCount = q && usersView === "active"
                    ? mockAgencyUsers.filter(u =>
                        u.agencyId === agency.id
                        && !removedUserIds.has(u.id)
                        && inactiveUserIds.has(u.id)
                        && (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
                        && (jobTitleFilter.size === 0 || jobTitleFilter.has(u.jobTitle))
                      ).length
                    : 0;
                  return (
                    <div className="flex flex-col items-center justify-center py-16 gap-3" style={{ fontFamily: FONT }}>
                      <span className="text-[13px]" style={{ color: c.muted }}>No users found</span>
                      {inactiveMatchCount > 0 && (
                        <button onClick={() => setUsersView("inactive")}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
                          style={{ background: "rgba(245,158,11,0.10)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.25)" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(245,158,11,0.16)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "rgba(245,158,11,0.10)")}>
                          {inactiveMatchCount} inactive {inactiveMatchCount === 1 ? "user" : "users"} also match — Show inactive
                        </button>
                      )}
                    </div>
                  );
                })() : agencyUsers.map((u, i, arr) => {
                  // Honor a Principal-role transfer: the new user becomes Principal, the old one is demoted in the UI.
                  const effectiveJobTitle =
                    principalOverride && u.id === principalOverride.newId ? "Principal"
                    : principalOverride && u.id === principalOverride.oldId && u.jobTitle === "Principal" ? "Producer"
                    : u.jobTitle;
                  const isPrincipal = effectiveJobTitle === "Principal";
                  const isInactive = inactiveUserIds.has(u.id);
                  return (
                    <div key={u.id}
                      className="grid items-center px-6 cursor-pointer transition-colors relative"
                      style={{ gridTemplateColumns:"minmax(0,1.1fr) minmax(0,2.75fr) minmax(0,1.7fr) minmax(0,1.9fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)", gap:16, height:60,
                        borderBottom: i !== arr.length-1 ? `1px solid ${c.border}` : "none" }}
                      onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)}
                      onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>

                      {/* Principal pin — preserved for archived principals so the role marker stays visible.
                          Non-principal archived users get no left bar. */}
                      {isPrincipal && (
                        <div className="absolute left-0 top-0 bottom-0 rounded-l-sm" style={{ width:3, background:"#A614C3" }} />
                      )}

                      {/* Name */}
                      <div className="min-w-0 flex items-center gap-2">
                        <div className="text-[13px] font-semibold truncate" style={{ fontFamily:FONT, color:c.text }}>{u.name}</div>
                      </div>

                      {/* Admin — inline toggle button. Click to flip admin
                          on/off for this user without opening Edit User.
                          `inlineAdminOverrides` wins when present; otherwise
                          we fall back to the raw `u.isAdmin` + any grant
                          that came from a Principal reassignment. */}
                      <div className="flex items-center justify-center" onClick={e => e.stopPropagation()}>
                        {(() => {
                          const effectiveIsAdmin = inlineAdminOverrides.has(u.id)
                            ? !!inlineAdminOverrides.get(u.id)
                            : (u.isAdmin || adminGrantOverrides.has(u.id));
                          const toggle = () => {
                            setInlineAdminOverrides(prev => {
                              const next = new Map(prev);
                              next.set(u.id, !effectiveIsAdmin);
                              return next;
                            });
                          };
                          return (
                            <button
                              type="button"
                              onClick={toggle}
                              aria-label={effectiveIsAdmin ? `Revoke admin from ${u.name}` : `Grant admin to ${u.name}`}
                              aria-pressed={effectiveIsAdmin}
                              title={effectiveIsAdmin ? "Admin — click to revoke" : "Not admin — click to grant"}
                              className="flex items-center justify-center rounded-md transition-all cursor-pointer"
                              style={{
                                width: 32,
                                height: 32,
                                background: "transparent",
                                border: "none",
                                padding: 0,
                              }}
                              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                            >
                              {effectiveIsAdmin
                                ? <GradientUserCog size={18} />
                                : <span className="text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>—</span>}
                            </button>
                          );
                        })()}
                      </div>

                      {/* Job title */}
                      <div className="text-[13px] text-left" style={{ fontFamily:FONT, color:c.text }}>{effectiveJobTitle || "—"}</div>

                      {/* Email */}
                      <div className="text-[13px] truncate text-left" style={{ fontFamily:FONT, color:c.muted }}>{u.email}</div>

                      {/* Phone */}
                      <div className="text-[13px] text-left whitespace-nowrap" style={{ fontFamily:FONT, color:c.text }}>{u.phone || "—"}</div>

                      {/* Ext */}
                      <div className="text-[13px] text-center" style={{ fontFamily:FONT, color:c.muted }}>{u.ext || "—"}</div>

                      {/* Status — Inactive (whether status-only or archived) shows greyed; Active uses the brand teal. */}
                      {(() => {
                        const showInactive = isInactive || statusInactiveUserIds.has(u.id);
                        const bg = showInactive ? (isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6") : (isDark ? "rgba(115,201,183,0.22)" : "rgba(115,201,183,0.15)");
                        const fg = showInactive ? c.muted : (isDark ? "#4ECDC4" : "#73C9B7");
                        return (
                          <div className="flex items-center justify-center">
                            <span className="inline-flex items-center px-3 py-[3px] rounded-full text-[11px] font-semibold w-fit"
                              style={{ fontFamily:FONT, background: bg, color: fg }}>
                              {showInactive ? "Inactive" : "Active"}
                            </span>
                          </div>
                        );
                      })()}

                      {/* Action */}
                      <div className="relative flex justify-center" onClick={e=>e.stopPropagation()}>
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                          style={{ color:c.muted }}
                          onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)}
                          onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
                          onClick={(e) => {
                            if (userMenuId === u.id) { setUserMenuId(null); setUserMenuPos(null); return; }
                            const r = e.currentTarget.getBoundingClientRect();
                            // Estimate menu height (≈ row count × 33px + padding) and flip upward when there
                            // isn't enough room below — keeps the menu visible even for the bottom-most user.
                            const estHeight = 220;
                            const flipUp = r.bottom + estHeight > window.innerHeight - 8;
                            setUserMenuId(u.id);
                            setUserMenuPos(flipUp
                              ? { bottom: window.innerHeight - r.top + 4, right: window.innerWidth - r.right }
                              : { top: r.bottom + 4, right: window.innerWidth - r.right });
                          }}>
                          <MoreVertical className="w-4 h-4"/>
                        </button>
                        {userMenuId === u.id && userMenuPos && (() => {
                          const isInactive = inactiveUserIds.has(u.id);
                          const isLocked = lockedUserIds.has(u.id);
                          // "Start a Quote" is an internal-staff shortcut: lets BTIS users
                          // open the Quotes flow acting as this external user, instead of
                          // having to log out and sign back in under their account.
                          // Only shown in internal view and only for active users.
                          const impersonate = viewMode === "internal" && !isInactive ? ["Start a Quote"] : [];
                          const base = isInactive ? [] : [...impersonate, "Edit User", "Reset Password", "Reassign Accounts"];
                          // Unlock User and Deactivate User both go to the bottom of the menu
                          // because they're rarer / heavier-weight actions. Unlock specifically
                          // is most often disabled (only meaningful when the account is locked),
                          // so anchoring it at the bottom keeps the more common actions on top.
                          const adminOnly = isInactive ? ["Reactivate", "Remove"] : ["Deactivate User", "Unlock User"];
                          // Read-only admin sees no menu items — only full Admin can operate.
                          const actions = currentUserIsReadOnlyAdmin ? [] : currentUserIsAdmin ? [...base, ...adminOnly] : [];
                          return (
                          <div className="fixed rounded-xl shadow-xl overflow-hidden"
                            style={{ background:isDark?"#1E2240":"#FFFFFF", border:`1px solid ${c.border}`, top: userMenuPos.top, bottom: userMenuPos.bottom, right: userMenuPos.right, zIndex: 1000, width: 170 }}>
                            {actions.map(action => {
                              // "Unlock User" is only meaningful when the account is actually locked.
                              // Render it disabled (gray) with a tooltip when the user is unlocked already.
                              const isUnlockDisabled = action === "Unlock User" && !isLocked;
                              return (
                              <button key={action} className="w-full text-left px-4 py-2 text-[12px] transition-colors"
                                disabled={isUnlockDisabled}
                                title={isUnlockDisabled ? "Account is currently active — nothing to unlock." : undefined}
                                style={{ fontFamily:FONT,
                                  color: isUnlockDisabled ? c.muted : action==="Remove"?"#EF4444":action==="Reactivate"?"#73C9B7":action==="Start a Quote"?"#A614C3":c.text,
                                  fontWeight: action === "Start a Quote" ? 600 : undefined,
                                  cursor: isUnlockDisabled ? "not-allowed" : "pointer",
                                  opacity: isUnlockDisabled ? 0.55 : 1 }}
                                onMouseEnter={e=>{ if (!isUnlockDisabled) e.currentTarget.style.background=c.hoverBg; }}
                                onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
                                onClick={() => {
                                  if (isUnlockDisabled) return;
                                  if (action === "Start a Quote") {
                                    setStartQuoteAs({ id: u.id, name: u.name, email: u.email });
                                  } else if (action === "Edit User") {
                                    const parts = u.name.trim().split(/\s+/);
                                    setAuFirstName(parts[0] || "");
                                    setAuLastName(parts.slice(1).join(" "));
                                    setAuIsAdmin(u.isAdmin);
                                    setAuJobTitle(u.jobTitle);
                                    setAuStatus((inactiveUserIds.has(u.id) || statusInactiveUserIds.has(u.id)) ? "Inactive" : "Active");
                                    setAuPhone(u.phone);
                                    setAuExt(u.ext);
                                    setAuMobile("");
                                    setAuSms(false);
                                    setAuEmail(u.email);
                                    setAuAddress("");
                                    setAuCity("");
                                    setAuState("");
                                    setAuZip("");
                                    setEditUserId(u.id);
                                  } else if (action === "Reset Password") {
                                    showToast({
                                      title: "Password reset link sent",
                                      description: "A reset email has been sent to this user.",
                                    });
                                  } else if (action === "Reassign Accounts") {
                                    setReassignAccountsFrom({ userId: u.id, userName: u.name });
                                    setReassignAccountsToId("");
                                  } else if (action === "Unlock User") {
                                    setLockedUserIds(prev => { const s = new Set(prev); s.delete(u.id); return s; });
                                    showToast({
                                      title: "Account unlocked",
                                      description: "This user can sign in again.",
                                      action: { label: "Undo", onClick: () => setLockedUserIds(prev => { const s = new Set(prev); s.add(u.id); return s; }) },
                                    });
                                  } else if (action === "Deactivate User") {
                                    // Deactivating a user reassigns their book of business to another
                                    // active user, then removes the user from the agency. `andArchive`
                                    // is the internal flag name kept from the previous "archive" flow —
                                    // its semantics now mean "remove after reassign" (see the confirm
                                    // handler which adds to removedUserIds rather than inactiveUserIds).
                                    setReassignAccountsFrom({ userId: u.id, userName: u.name, andArchive: true });
                                    setReassignAccountsToId("");
                                  } else if (action === "Reactivate") {
                                    setInactiveUserIds(prev => { const s = new Set(prev); s.delete(u.id); return s; });
                                    showToast({
                                      title: "User reactivated",
                                      description: "This user is active again.",
                                      action: { label: "Undo", onClick: () => setInactiveUserIds(prev => { const s = new Set(prev); s.add(u.id); return s; }) },
                                    });
                                  } else if (action === "Remove") {
                                    // For archived users we already reassigned their book during archive,
                                    // so skip the role-reassign modal — just confirm + remove.
                                    if (isInactive) {
                                      setRemoveUserConfirm({ id: u.id, name: u.name });
                                    } else {
                                      const isPrin = u.jobTitle === "Principal" && !(principalOverride && principalOverride.oldId === u.id);
                                      const currentContactName = agencyContactOverride ?? agency.contact;
                                      const isCon = u.name === currentContactName;
                                      if (isPrin || isCon) {
                                        setRoleReassign({ userId: u.id, userName: u.name, action: "remove", needsPrincipal: isPrin, needsContact: isCon });
                                        setReassignPrincipalId("");
                                        setReassignContactId("");
                                      } else {
                                        setRemoveUserConfirm({ id: u.id, name: u.name });
                                      }
                                    }
                                  }
                                  setUserMenuId(null);
                                  setUserMenuPos(null);
                                }}>
                                {action}
                              </button>
                              );
                            })}
                          </div>
                          );
                        })()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
            <style>{`
              @keyframes teamSetupSpotlightIn {
                from { opacity: 0; backdrop-filter: blur(0px); -webkit-backdrop-filter: blur(0px); }
                to   { opacity: 1; backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px); }
              }
            `}</style>
          </>
        )}

      {/* ── Add/Edit User Modal ── */}
      {(addUserOpen || editUserId) && (() => {
        const isEditMode = !!editUserId;
        const closeModal = () => { setAddUserOpen(false); setEditUserId(null); };
        const fieldBg   = isDark ? "rgba(255,255,255,0.06)" : "#fff";
        const fieldBorder = isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid #E5E7EB";
        const labelColor  = isDark ? "#D1D5DB" : "#374151";
        const inputStyle  = { fontFamily:FONT, background:fieldBg, border:fieldBorder, color:c.text } as React.CSSProperties;
        const labelStyle  = { fontFamily:FONT, color:labelColor } as React.CSSProperties;
        const dropdownBg  = isDark ? "#1E2240" : "#fff";
        const closeAll    = () => { setAuJobOpen(false); setAuStatusOpen(false); setAuStateOpen(false); };

        const Field = ({ label, children }: { label:string; children:React.ReactNode }) => (
          <div>
            <label className="block text-[13px] font-medium mb-1.5" style={labelStyle}>{label}</label>
            {children}
          </div>
        );

        const TextInput = ({ value, onChange, placeholder }: { value:string; onChange:(v:string)=>void; placeholder?:string }) => (
          <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
            className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-colors"
            style={{ ...inputStyle, boxSizing:"border-box" as const }} />
        );

        const DropTrigger = ({ label, open, onClick }: { label:string; open:boolean; onClick:()=>void }) => (
          <button onClick={e=>{e.stopPropagation();onClick();}}
            className="w-full px-3.5 py-2.5 rounded-xl text-[13px] flex items-center justify-between transition-colors"
            style={{ ...inputStyle, color: label ? c.text : c.muted, boxSizing:"border-box" as const,
              border: fieldBorder }}>
            <span>{label}</span>
            <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color:c.muted }} />
          </button>
        );

        const DropList = ({ items, selected, onSelect, disabledReasons }: { items:string[]; selected:string; onSelect:(v:string)=>void; disabledReasons?: Record<string,string> }) => (
          <div className="absolute left-0 right-0 top-full mt-1 rounded-xl overflow-y-auto z-20"
            style={{ background:dropdownBg, boxShadow:"0 8px 24px rgba(0,0,0,0.18)", border:`1px solid ${c.border}`, maxHeight:200 }}>
            {items.map(item => {
              const disabledReason = disabledReasons?.[item];
              const disabled = !!disabledReason;
              return (
                <button key={item} onClick={e=>{e.stopPropagation(); if (!disabled) onSelect(item);}}
                  title={disabledReason}
                  disabled={disabled}
                  className="w-full text-left px-4 py-2.5 text-[13px] transition-colors"
                  style={{ fontFamily:FONT, color: disabled ? c.muted : c.text, background:selected===item?(isDark?"rgba(255,255,255,0.08)":"#F9FAFB"):"transparent", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.6 : 1 }}
                  onMouseEnter={e=>{ if (!disabled) e.currentTarget.style.background=isDark?"rgba(255,255,255,0.08)":"#F9FAFB"; }}
                  onMouseLeave={e=>(e.currentTarget.style.background=selected===item?(isDark?"rgba(255,255,255,0.08)":"#F9FAFB"):"transparent")}>
                  <div className="flex items-center justify-between gap-2">
                    <span>{item}</span>
                    {disabledReason && <span className="text-[10px] italic flex-shrink-0" style={{ color: c.muted }}>{disabledReason}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        );

        const hasPrincipal = agencyUsers.some(u => u.jobTitle === "Principal");
        const jobTitleDisabled: Record<string,string> = hasPrincipal ? { "Principal": "Only 1 allowed" } : {};

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background:"rgba(0,0,0,0.45)" }}
            onClick={()=>{ closeModal(); closeAll(); }}>
            <div className="rounded-2xl w-[620px] max-w-[95vw] max-h-[92vh] flex flex-col"
              style={{ background:isDark?"#1E2240":"#fff", boxShadow:"0 20px 60px rgba(0,0,0,0.25)" }}
              onClick={e=>{ e.stopPropagation(); closeAll(); }}>

              {/* Header */}
              <div className="flex items-center justify-between px-8 pt-7 pb-4 flex-shrink-0" style={{ borderBottom: `1px solid ${c.border}` }}>
                <h2 className="text-[20px] font-semibold" style={{ fontFamily:FONT, color:c.text }}>{isEditMode ? "Edit User" : "Add User"}</h2>
                <button onClick={()=>{ closeModal(); closeAll(); }}
                  className="p-1.5 rounded-lg transition-colors" style={{ color:c.muted }}
                  onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)}
                  onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                  <X className="w-5 h-5"/>
                </button>
              </div>

              {/* Scrollable body */}
              <div className="px-8 pt-5 overflow-y-auto flex-1 space-y-4 pb-2">

                {/* Row: First Name, Last Name, Admin toggle */}
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-[13px] font-medium mb-1.5" style={labelStyle}>First Name</label>
                    <TextInput value={auFirstName} onChange={setAuFirstName} placeholder="First name" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[13px] font-medium mb-1.5" style={labelStyle}>Last Name</label>
                    <TextInput value={auLastName} onChange={setAuLastName} placeholder="Last name" />
                  </div>
                  <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl flex-shrink-0 self-end"
                    style={{ background: isDark ? "rgba(255,255,255,0.04)" : "#F8FAFC" }}>
                    <span className="text-[13px] font-medium" style={{ fontFamily:FONT, color:c.text }}>Admin</span>
                    <button onClick={e=>{e.stopPropagation();setAuIsAdmin(!auIsAdmin);}}
                      className="w-11 h-6 rounded-full relative transition-all flex-shrink-0"
                      style={{ background: auIsAdmin ? "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)" : "#D1D5DB" }}>
                      <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
                        style={{ left:auIsAdmin?"22px":"2px" }} />
                    </button>
                  </div>
                </div>

                {/* Row: Job Title + Status */}
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <label className="block text-[13px] font-medium mb-1.5" style={labelStyle}>Job title</label>
                    <DropTrigger label={auJobTitle} open={auJobOpen} onClick={()=>{ setAuJobOpen(!auJobOpen); setAuStatusOpen(false); setAuStateOpen(false); }} />
                    {auJobOpen && <DropList items={JOB_TITLES} selected={auJobTitle} onSelect={v=>{setAuJobTitle(v);setAuJobOpen(false);}} disabledReasons={jobTitleDisabled} />}
                  </div>
                  <div className="flex-1 relative">
                    <label className="block text-[13px] font-medium mb-1.5" style={labelStyle}>Status</label>
                    <DropTrigger label={auStatus} open={auStatusOpen} onClick={()=>{ setAuStatusOpen(!auStatusOpen); setAuJobOpen(false); setAuStateOpen(false); }} />
                    {auStatusOpen && <DropList items={USER_STATUSES} selected={auStatus} onSelect={v=>{setAuStatus(v);setAuStatusOpen(false);}} />}
                  </div>
                </div>

                {/* Row: Phone + Ext */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-[13px] font-medium mb-1.5" style={labelStyle}>Phone</label>
                    <TextInput value={auPhone} onChange={setAuPhone} placeholder="(888) 888-8888" />
                  </div>
                  <div style={{ width:140 }}>
                    <label className="block text-[13px] font-medium mb-1.5" style={labelStyle}>Ext</label>
                    <TextInput value={auExt} onChange={setAuExt} placeholder="175" />
                  </div>
                </div>

                {/* Row: Mobile Phone + SMS */}
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="block text-[13px] font-medium mb-1.5" style={labelStyle}>Mobile Phone</label>
                    <TextInput value={auMobile} onChange={setAuMobile} placeholder="(888) 888-8888" />
                  </div>
                  <button onClick={e=>{e.stopPropagation();setAuSms(!auSms);}}
                    className="flex items-center gap-2 pb-2.5 flex-shrink-0 transition-opacity"
                    style={{ fontFamily:FONT, color:c.text, fontSize:13 }}>
                    <span className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all"
                      style={{ border:`1.5px solid ${auSms?"transparent":c.borderStrong}`, backgroundImage: auSms ? "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)" : "none", background: auSms ? undefined : "transparent" }}>
                      {auSms && <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4.5L4 7.5L10 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </span>
                    I agree to receive SMS texts
                  </button>
                </div>

                {/* Email */}
                <Field label="Email">
                  <TextInput value={auEmail} onChange={setAuEmail} placeholder="Email@gmail.com" />
                </Field>

                {/* Address */}
                <Field label="Address">
                  <TextInput value={auAddress} onChange={setAuAddress} placeholder="123 Main Street" />
                </Field>

                {/* Row: City, State, Zip */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-[13px] font-medium mb-1.5" style={labelStyle}>City</label>
                    <TextInput value={auCity} onChange={setAuCity} placeholder="Anytown" />
                  </div>
                  <div className="flex-1 relative">
                    <label className="block text-[13px] font-medium mb-1.5" style={labelStyle}>State</label>
                    <DropTrigger label={auState} open={auStateOpen} onClick={()=>{ setAuStateOpen(!auStateOpen); setAuJobOpen(false); setAuStatusOpen(false); }} />
                    {auStateOpen && <DropList items={US_STATES} selected={auState} onSelect={v=>{setAuState(v);setAuStateOpen(false);}} />}
                  </div>
                  <div className="flex-1">
                    <label className="block text-[13px] font-medium mb-1.5" style={labelStyle}>Zip Code</label>
                    <TextInput value={auZip} onChange={setAuZip} placeholder="21354" />
                  </div>
                </div>

                {/* Info note */}
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                  style={{ background:isDark?"rgba(255,255,255,0.03)":"#fff", border:`1px solid ${c.border}` }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="8" strokeWidth="2.5"/>
                    <line x1="12" y1="12" x2="12" y2="16"/>
                  </svg>
                  <span className="text-[13px]" style={{ fontFamily:FONT, color:c.muted }}>An email will be sent to the user.</span>
                </div>

              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-8 py-5 flex-shrink-0">
                <button
                  className="px-[17px] py-[9px] rounded-lg text-[12px] font-normal transition-colors"
                  style={{ fontFamily:FONT, border:`1px solid ${c.borderStrong}`, color: c.text, background:"transparent" }}
                  onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)}
                  onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
                  onClick={()=>{ closeModal(); closeAll(); }}>
                  Cancel
                </button>
                <button
                  className="text-[13px] font-semibold text-white transition-all"
                  style={{ fontFamily:FONT, background:btnGrad, padding:"10px 32px", borderRadius:"8px" }}
                  onMouseEnter={e=>(e.currentTarget.style.filter="brightness(1.12)")}
                  onMouseLeave={e=>(e.currentTarget.style.filter="none")}
                  onClick={()=>{
                    if (isEditMode && editUserId) {
                      const wantInactive = auStatus === "Inactive";
                      setStatusInactiveUserIds(prev => {
                        const s = new Set(prev);
                        if (wantInactive) s.add(editUserId); else s.delete(editUserId);
                        return s;
                      });
                      showToast({ title: "User updated", description: `${auFirstName} ${auLastName} saved.` });
                    }
                    closeModal();
                    closeAll();
                  }}>
                  {isEditMode ? "Save Changes" : "Send Invite"}
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ── Address Modal ── */}
      {addressModalOpen && (() => {
        const fullAddress = `${agency.street}, ${agency.city}, ${agency.state} ${agency.zip}`;
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
        const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }} onClick={() => setAddressModalOpen(false)}>
            <div className="w-[480px] max-w-[95vw] rounded-2xl shadow-2xl overflow-hidden" style={{ background: c.cardBg, border: `1px solid ${c.border}`, fontFamily: FONT }} onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-start justify-between px-6 py-5" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(243,244,246,0.30)", borderBottom: `1px solid ${c.border}` }}>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl" style={{ background: "linear-gradient(135deg,rgba(92,46,212,0.15) 0%,rgba(166,20,195,0.15) 100%)" }}>
                    <MapPin className="w-5 h-5" style={{ color: "#A855F7" }} />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-bold" style={{ fontFamily: FONT, color: c.text }}>{agency.name}</h2>
                    <p className="text-[11px] mt-0.5" style={{ fontFamily: FONT, color: c.muted }}>Agency location</p>
                  </div>
                </div>
                <button onClick={() => setAddressModalOpen(false)} className="p-1 rounded-lg transition-colors" style={{ color: c.muted }}
                  onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <X className="w-4 h-4" />
                </button>
              </div>
              {/* Body */}
              <div className="px-6 py-5 space-y-4">
                <div className="rounded-xl p-4 relative" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB", border: `1px solid ${c.border}` }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-wide font-semibold mb-1.5" style={{ fontFamily: FONT, color: c.muted }}>Address</p>
                      <p className="text-[14px] font-semibold leading-relaxed" style={{ fontFamily: FONT, color: c.text }}>{agency.street}</p>
                      <p className="text-[14px] font-semibold leading-relaxed" style={{ fontFamily: FONT, color: c.text }}>{agency.city}, {agency.state} {agency.zip}</p>
                    </div>
                    <button onClick={() => { setAddressModalOpen(false); setIsEditing(true); }}
                      title="Edit in Agency Info"
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-colors flex-shrink-0"
                      style={{ fontFamily: FONT, color: c.muted, border: `1px solid ${c.border}`, background: "transparent" }}
                      onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                      <Pencil className="w-3 h-3" />Edit
                    </button>
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${c.border}` }}>
                  <iframe src={embedUrl} className="w-full" style={{ height: 220, border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                </div>
              </div>
              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: `1px solid ${c.border}` }}>
                <button onClick={() => setAddressModalOpen(false)}
                  className="px-5 py-[9px] rounded-lg text-[12px] font-normal transition-colors"
                  style={{ fontFamily: FONT, border: `1px solid ${c.border}`, color: c.text, background: "transparent" }}
                  onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  Close
                </button>
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-[9px] rounded-lg text-[12px] font-semibold text-white no-underline"
                  style={{ fontFamily: FONT, background: btnGrad }}>
                  <Globe className="w-3.5 h-3.5" />Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Phone Call Modal ── */}
      {callModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }} onClick={() => setCallModalOpen(false)}>
          <div className="w-[420px] rounded-2xl shadow-2xl" style={{ background: c.cardBg, border: `1px solid ${c.border}`, fontFamily: FONT }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-start justify-between px-6 py-5 rounded-t-2xl" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(243,244,246,0.30)", borderBottom: `1px solid ${c.border}` }}>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl" style={{ background: "linear-gradient(135deg,rgba(92,46,212,0.15) 0%,rgba(166,20,195,0.15) 100%)" }}>
                  <Phone className="w-5 h-5" style={{ color: "#A855F7" }} />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold" style={{ fontFamily: FONT, color: c.text }}>Call {agency.name}</h2>
                  <p className="text-[11px] mt-0.5" style={{ fontFamily: FONT, color: c.muted }}>Outbound call from your agency line</p>
                </div>
              </div>
              <button onClick={() => setCallModalOpen(false)} className="p-1 rounded-lg" style={{ color: c.muted }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 space-y-4">
              <div className="rounded-xl p-4 space-y-3" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB", border: `1px solid ${c.border}` }}>
                {/* From (your line) */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,rgba(92,46,212,0.15) 0%,rgba(166,20,195,0.15) 100%)" }}>
                    <Phone className="w-3.5 h-3.5" style={{ color: "#A855F7" }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-wide font-semibold mb-0.5" style={{ fontFamily: FONT, color: c.muted }}>From (Your Agency Line)</p>
                    <p className="text-[14px] font-semibold" style={{ fontFamily: FONT, color: c.text }}>{AGENCY_PHONE}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-4">
                  <div className="w-px h-4 ml-3.5" style={{ background: c.border }} />
                </div>

                {/* To (agency) */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[12px] font-bold text-white" style={{ background: btnGrad }}>
                    {agency.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-wide font-semibold mb-0.5" style={{ fontFamily: FONT, color: c.muted }}>To (Agency)</p>
                    <p className="text-[14px] font-semibold" style={{ fontFamily: FONT, color: c.text }}>{agency.contactPhone || "No number on file"}</p>
                    <p className="text-[11px] mt-0.5" style={{ fontFamily: FONT, color: c.muted }}>{agency.name}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-lg" style={{ background: isDark ? "rgba(168,85,247,0.06)" : "rgba(92,46,212,0.04)", border: `1px solid ${isDark ? "rgba(168,85,247,0.15)" : "rgba(92,46,212,0.10)"}` }}>
                <Bell className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#A855F7" }} />
                <p className="text-[11px] leading-relaxed" style={{ fontFamily: FONT, color: c.muted }}>
                  Clicking <span style={{ color: c.text, fontWeight: 600 }}>Call Now</span> will open your default phone dialer. On desktop this may launch software like FaceTime, Skype, or your VoIP app.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: `1px solid ${c.border}` }}>
              <button onClick={() => setCallModalOpen(false)}
                className="px-5 py-[9px] rounded-lg text-[12px] font-normal"
                style={{ fontFamily: FONT, border: `1px solid ${c.border}`, color: c.text, background: "transparent" }}>
                Cancel
              </button>
              <a href={`tel:${(agency.contactPhone || "").replace(/\D/g, "")}`}
                onClick={() => setCallModalOpen(false)}
                className="inline-flex items-center gap-2 px-5 py-[9px] rounded-lg text-[12px] font-semibold text-white no-underline"
                style={{ fontFamily: FONT, background: btnGrad }}>
                <Phone className="w-3.5 h-3.5" />Call Now
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Update Agency Contact Modal (admin) — Edit / Reassign / Add New ── */}
      {contactCardEditing && (() => {
        const eligibleUsers = mockAgencyUsers
          .filter(u => u.agencyId === agency.id)
          .filter(u => !inactiveUserIds.has(u.id) && !removedUserIds.has(u.id));
        const closeModal = () => { setContactCardEditing(false); setContactMode("edit"); setReassignSelection(""); setReassignSearch(""); setNewContactName(""); setNewContactPhone(""); setNewContactEmail(""); };
        const canSave =
          contactMode === "edit" ? eContact.trim().length > 0 :
          contactMode === "reassign" ? reassignSelection !== "" :
          newContactName.trim().length > 0;
        const handleSave = () => {
          if (contactMode === "reassign") {
            const u = eligibleUsers.find(x => x.id === reassignSelection);
            if (u) { setEContact(u.name); setEContactPhone(u.phone); setEEmail(u.email); }
            showToast({ title: "Contact reassigned", description: `Agency contact set to ${u?.name ?? "selected user"}.` });
          } else if (contactMode === "new") {
            setEContact(newContactName.trim());
            setEContactPhone(newContactPhone.trim());
            setEEmail(newContactEmail.trim());
            showToast({ title: "Contact added", description: `${newContactName.trim()} is now the agency contact.` });
          } else {
            // edit mode: eContact / eContactPhone / eEmail are already updated via inputs
            showToast({ title: "Contact updated", description: "Changes saved." });
          }
          closeModal();
        };
        const tabs: [typeof contactMode, string][] = [["edit", "Edit Info"], ["reassign", "Reassign"]];
        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }}
          onClick={closeModal}>
          <div className="rounded-2xl w-[480px] max-w-[95vw] max-h-[85vh] flex flex-col overflow-hidden"
            style={{ background: c.cardBg, boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 pt-5 pb-4 flex-shrink-0" style={{ borderBottom: `1px solid ${c.border}` }}>
              <div>
                <h3 className="text-[16px] font-bold" style={{ fontFamily: FONT, color: c.text }}>Update Agency Contact</h3>
                <p className="text-[12px] mt-0.5" style={{ fontFamily: FONT, color: c.muted }}>
                  {contactMode === "edit" ? "Tweak the current contact's info." : "Hand off to another existing user."}
                </p>
              </div>
              <button onClick={closeModal} className="p-1 rounded-md transition-colors flex-shrink-0" style={{ color: c.muted }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Segmented tab control */}
            <div className="px-6 pt-4 pb-1 flex-shrink-0">
              <div className="flex p-1 rounded-lg" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "#F3F4F6" }}>
                {tabs.map(([key, label]) => {
                  const active = contactMode === key;
                  return (
                    <button key={key} onClick={() => setContactMode(key)}
                      className="flex-1 text-[12px] font-semibold py-1.5 rounded-md transition-all"
                      style={{ fontFamily: FONT,
                        background: active ? c.cardBg : "transparent",
                        color: active ? "#A614C3" : c.muted,
                        boxShadow: active ? "0 1px 2px rgba(0,0,0,0.06)" : "none" }}>
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {contactMode === "edit" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold mb-1" style={{ fontFamily: FONT, color: c.muted }}>Contact Name<span style={{ color: "#EF4444" }}>*</span></label>
                    <input value={eContact} onChange={e => setEContact(e.target.value)} placeholder="Full name"
                      className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                      style={{ fontFamily: FONT, background: isDark ? "rgba(255,255,255,0.05)" : "#fff", border: `1px solid ${c.border}`, color: c.text }} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold mb-1" style={{ fontFamily: FONT, color: c.muted }}>Phone</label>
                    <input value={eContactPhone} onChange={e => setEContactPhone(formatPhone(e.target.value))} placeholder="(000) 000-0000"
                      className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                      style={{ fontFamily: FONT, background: isDark ? "rgba(255,255,255,0.05)" : "#fff", border: `1px solid ${c.border}`, color: c.text }} inputMode="tel" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold mb-1" style={{ fontFamily: FONT, color: c.muted }}>Email</label>
                    <input value={eEmail} onChange={e => setEEmail(e.target.value)} placeholder="email@example.com"
                      className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                      style={{ fontFamily: FONT, background: isDark ? "rgba(255,255,255,0.05)" : "#fff", border: `1px solid ${c.border}`, color: c.text }} type="email" />
                  </div>
                  <p className="text-[11px] mt-2" style={{ fontFamily: FONT, color: c.muted }}>Use this to fix typos. To change who the contact is, switch to <strong style={{ color: c.text }}>Reassign</strong>.</p>
                </div>
              )}
              {contactMode === "reassign" && (() => {
                const q = reassignSearch.trim().toLowerCase();
                // Match on word prefixes only — "T" should match "Tom Garfield" (name starts with T)
                // but NOT "Jason Smith" (has T mid-word) or "Diane Kim" (jobTitle "Accounting").
                const matches = q
                  ? eligibleUsers.filter(u => {
                      const nameWords = u.name.toLowerCase().split(/\s+/);
                      const emailLocal = u.email.toLowerCase().split("@")[0];
                      return nameWords.some(w => w.startsWith(q)) || emailLocal.startsWith(q);
                    })
                  : [];
                const selectedUser = eligibleUsers.find(u => u.id === reassignSelection);
                const visibleMatches = matches.slice(0, 6);
                return (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ fontFamily: FONT, color: c.muted }}>Search User</p>
                  {eligibleUsers.length === 0 ? (
                    <p className="text-[12px] py-3" style={{ fontFamily: FONT, color: c.muted }}>No active users for this agency.</p>
                  ) : (
                    <>
                      {/* Search input */}
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-2"
                        style={{ border: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB" }}>
                        <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: c.muted }} />
                        <input autoFocus value={reassignSearch} onChange={e => setReassignSearch(e.target.value)}
                          placeholder="Search by name, email, or role…"
                          className="flex-1 outline-none text-[13px] bg-transparent"
                          style={{ fontFamily: FONT, color: c.text }} />
                        {reassignSearch && (
                          <button onClick={() => setReassignSearch("")}
                            className="p-0.5 rounded transition-colors"
                            onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                            <X className="w-3 h-3" style={{ color: c.muted }} />
                          </button>
                        )}
                      </div>

                      {/* Selected user (always visible once picked) */}
                      {selectedUser && (
                        <div className="mb-2">
                          <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ fontFamily: FONT, color: c.muted }}>Selected</p>
                          <label className="flex items-center gap-3 p-3 rounded-lg"
                            style={{ border: `1px solid rgba(168,85,247,0.35)`, background: "rgba(168,85,247,0.06)" }}>
                            <div className="w-[16px] h-[16px] rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ background: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)" }}>
                              <div className="w-[6px] h-[6px] rounded-full" style={{ background: "#FFFFFF" }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[13px] font-semibold truncate" style={{ fontFamily: FONT, color: c.text }}>{selectedUser.name}</span>
                                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0"
                                  style={{ fontFamily: FONT, background: "rgba(168,85,247,0.10)", color: "#A855F7" }}>{selectedUser.jobTitle}</span>
                              </div>
                              <div className="text-[11px] truncate mt-0.5" style={{ fontFamily: FONT, color: c.muted }}>{selectedUser.email}</div>
                            </div>
                            <button onClick={() => setReassignSelection("")}
                              className="text-[11px] font-medium flex-shrink-0 transition-opacity hover:opacity-80"
                              style={{ fontFamily: FONT, color: c.muted }}>Change</button>
                          </label>
                        </div>
                      )}

                      {/* Search results */}
                      {q ? (
                        matches.length === 0 ? (
                          <p className="text-[12px] py-3 text-center" style={{ fontFamily: FONT, color: c.muted }}>No users match &ldquo;{reassignSearch}&rdquo;.</p>
                        ) : (
                          <div className="space-y-1.5">
                            {visibleMatches.map(u => {
                              const checked = reassignSelection === u.id;
                              if (checked) return null;
                              return (
                                <label key={u.id} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                                  style={{ border: `1px solid ${c.border}`, background: "transparent" }}
                                  onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                                  <div onClick={() => { setReassignSelection(u.id); setReassignSearch(""); }}
                                    className="w-[16px] h-[16px] rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ background: c.cardBg, border: `1.5px solid ${c.borderStrong}` }} />
                                  <input type="radio" checked={false} onChange={() => { setReassignSelection(u.id); setReassignSearch(""); }} className="sr-only" />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[13px] font-semibold truncate" style={{ fontFamily: FONT, color: c.text }}>{u.name}</span>
                                      <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0"
                                        style={{ fontFamily: FONT, background: "rgba(168,85,247,0.10)", color: "#A855F7" }}>{u.jobTitle}</span>
                                    </div>
                                    <div className="text-[11px] truncate mt-0.5" style={{ fontFamily: FONT, color: c.muted }}>{u.email}</div>
                                  </div>
                                </label>
                              );
                            })}
                            {matches.length > 6 && (
                              <p className="text-[11px] text-center pt-1" style={{ fontFamily: FONT, color: c.muted }}>{matches.length - 6} more match — refine your search.</p>
                            )}
                          </div>
                        )
                      ) : !selectedUser && (
                        <p className="text-[12px] py-3 text-center" style={{ fontFamily: FONT, color: c.muted }}>Start typing to find a user from {eligibleUsers.length} active {eligibleUsers.length === 1 ? "user" : "users"}.</p>
                      )}
                    </>
                  )}
                </div>
                );
              })()}
              {contactMode === "new" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold mb-1" style={{ fontFamily: FONT, color: c.muted }}>Contact Name<span style={{ color: "#EF4444" }}>*</span></label>
                    <input value={newContactName} onChange={e => setNewContactName(e.target.value)} placeholder="Full name"
                      className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                      style={{ fontFamily: FONT, background: isDark ? "rgba(255,255,255,0.05)" : "#fff", border: `1px solid ${c.border}`, color: c.text }} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold mb-1" style={{ fontFamily: FONT, color: c.muted }}>Phone</label>
                    <input value={newContactPhone} onChange={e => setNewContactPhone(formatPhone(e.target.value))} placeholder="(000) 000-0000"
                      className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                      style={{ fontFamily: FONT, background: isDark ? "rgba(255,255,255,0.05)" : "#fff", border: `1px solid ${c.border}`, color: c.text }} inputMode="tel" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold mb-1" style={{ fontFamily: FONT, color: c.muted }}>Email</label>
                    <input value={newContactEmail} onChange={e => setNewContactEmail(e.target.value)} placeholder="email@example.com"
                      className="w-full px-3 py-2 rounded-lg text-[13px] outline-none"
                      style={{ fontFamily: FONT, background: isDark ? "rgba(255,255,255,0.05)" : "#fff", border: `1px solid ${c.border}`, color: c.text }} type="email" />
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between gap-2 px-6 py-4 flex-shrink-0" style={{ borderTop: `1px solid ${c.border}` }}>
              <button onClick={closeModal}
                className="px-[17px] py-[9px] rounded-lg text-[12px] font-normal transition-colors"
                style={{ fontFamily: FONT, border: `1px solid ${c.borderStrong}`, color: c.text, background: "transparent" }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={!canSave}
                className="px-[17px] py-[9px] rounded-lg text-[12px] font-semibold text-white transition-all"
                style={{ fontFamily: FONT, background: canSave ? btnGrad : (isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB"), color: canSave ? "#fff" : c.muted, cursor: canSave ? "pointer" : "not-allowed" }}
                onMouseEnter={e => { if (canSave) e.currentTarget.style.filter = "brightness(1.1)"; }}
                onMouseLeave={e => { if (canSave) e.currentTarget.style.filter = "none"; }}>
                {contactMode === "edit" ? "Save Changes" : "Reassign Contact"}
              </button>
            </div>
          </div>
        </div>
        );
      })()}

      {/* Renew License modal removed on 2026-10-27 — see state comment in AgencyDetailView for context. */}

      {/* ── Import from Legacy Modal ── */}
      {legacyImportOpen && (() => {
        const selectableIds = legacyRosterTagged.filter(u => !u.duplicate).map(u => u.id);
        const allSelected = selectableIds.length > 0 && selectableIds.every(id => legacyImportSelected.has(id));
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }} onClick={closeLegacyImport}>
            <div className="rounded-2xl w-[720px] max-w-[95vw] max-h-[85vh] overflow-hidden flex flex-col"
              style={{ background: isDark ? "#1E2240" : "#fff", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
              onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex items-center justify-center flex-shrink-0 rounded-lg"
                    style={{ width: 48, height: 48, background: isDark ? "rgba(201,166,255,0.22)" : "rgba(166,20,195,0.10)" }}>
                    <Download className="w-[22px] h-[22px]" style={{ color: isDark ? "#E6B8FF" : "#A614C3" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[18px] font-bold" style={{ ...font, color: c.text }}>Import users from legacy BTIS</h3>
                    <p className="text-[12.5px] mt-0.5" style={{ ...font, color: c.muted }}>
                      Pulled users from <span className="font-semibold" style={{ color: c.text }}>BTIS Internal · {agency.code}</span>. Select who to copy over.
                    </p>
                  </div>
                </div>
                <button onClick={closeLegacyImport} className="p-1.5 rounded-md transition-colors flex-shrink-0" style={{ color: c.muted }}
                  onMouseEnter={e => { e.currentTarget.style.background = c.hoverBg; e.currentTarget.style.color = c.text; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; }}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Inset divider — stops short of the modal edges on both
                  sides so the rule doesn't look soldered to the frame. */}
              <div style={{ height: 1, background: isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6", marginLeft: 24, marginRight: 24 }} />

              {/* Search + select-all row. Both controls are forced to the
                  same 34px height so the input and button line up. */}
              <div className="flex items-center gap-3 px-6 py-3">
                <div className="flex-1 relative" style={{ height: 34 }}>
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: c.muted }} />
                  <input value={legacyImportSearch} onChange={e => setLegacyImportSearch(e.target.value)}
                    placeholder="Search name or email…"
                    className="w-full outline-none text-[13px]"
                    style={{ ...font, color: c.text, background: isDark ? "rgba(255,255,255,0.04)" : "#F9FAFB", border: `1px solid ${c.border}`, borderRadius: 8, padding: "0 10px 0 32px", height: 34, boxSizing: "border-box" }} />
                </div>
                <button onClick={() => setLegacyImportSelected(allSelected ? new Set() : new Set(selectableIds))}
                  className="text-[12px] font-semibold px-4 rounded-md transition-all whitespace-nowrap"
                  style={{
                    ...font,
                    color: isDark ? "#E6B8FF" : "#A614C3",
                    border: isDark ? "1.04px solid rgba(255,255,255,0.15)" : "1.04px solid #E5E7EB",
                    background: isDark
                      ? "linear-gradient(180deg, rgba(255,255,255,0.10) -0.44%, rgba(192,192,192,0.10) 49.45%, rgba(172,172,172,0.10) 99.33%)"
                      : "linear-gradient(180deg, rgba(255,255,255,0.1) -0.44%, rgba(192,192,192,0.1) 49.45%, rgba(172,172,172,0.1) 99.33%), #FFFFFF",
                    height: 34,
                    boxSizing: "border-box",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = isDark
                    ? "linear-gradient(180deg, rgba(255,255,255,0.18) -0.44%, rgba(192,192,192,0.18) 49.45%, rgba(172,172,172,0.18) 99.33%)"
                    : "linear-gradient(180deg, rgba(255,255,255,0.15) -0.44%, rgba(192,192,192,0.15) 49.45%, rgba(172,172,172,0.15) 99.33%), #F9FAFB")}
                  onMouseLeave={e => (e.currentTarget.style.background = isDark
                    ? "linear-gradient(180deg, rgba(255,255,255,0.10) -0.44%, rgba(192,192,192,0.10) 49.45%, rgba(172,172,172,0.10) 99.33%)"
                    : "linear-gradient(180deg, rgba(255,255,255,0.1) -0.44%, rgba(192,192,192,0.1) 49.45%, rgba(172,172,172,0.1) 99.33%), #FFFFFF")}>
                  {allSelected ? "Clear all" : "Select all new"}
                </button>
              </div>

              <div style={{ height: 1, background: isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6", marginLeft: 24, marginRight: 24 }} />

              {/* List */}
              <div className="overflow-y-auto flex-1" style={{ minHeight: 0 }}>
                {legacyRosterFiltered.length === 0 ? (
                  <div className="py-12 text-center text-[13px]" style={{ ...font, color: c.muted }}>No users match &ldquo;{legacyImportSearch}&rdquo;.</div>
                ) : legacyRosterFiltered.map((u, i, arr) => {
                  const checked = legacyImportSelected.has(u.id);
                  const disabled = u.duplicate;
                  const isLast = i === arr.length - 1;
                  return (
                    <label key={u.id}
                      className={`flex items-center gap-3 px-6 py-3 transition-colors ${disabled ? "" : "cursor-pointer"}`}
                      style={{
                        // Inset bottom border — skipped on the last row
                        // so the list doesn't double up against the
                        // footer divider.
                        boxShadow: isLast ? "none" : `inset 0 -1px 0 ${isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6"}`,
                        marginLeft: 24, marginRight: 24, paddingLeft: 0, paddingRight: 0,
                        background: disabled ? (isDark ? "rgba(255,255,255,0.02)" : "#FAFAFA") : "transparent",
                        opacity: disabled ? 0.6 : 1,
                      }}
                      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "#FAFAFB"; }}
                      onMouseLeave={e => { if (!disabled) e.currentTarget.style.background = "transparent"; }}>
                      <Checkbox checked={checked} onClick={() => { if (!disabled) toggleLegacyUser(u.id); }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-semibold truncate" style={{ ...font, color: c.text }}>{u.name}</span>
                          {u.isAdmin && (
                            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
                              style={{ ...font, color: isDark ? "#86EFAC" : "#15803D", background: isDark ? "rgba(34,197,94,0.18)" : "rgba(34,197,94,0.10)" }}>
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="text-[11.5px] truncate" style={{ ...font, color: c.muted }}>{u.email}</div>
                      </div>
                      {u.duplicate && (
                        <span className="text-[11px] font-medium px-2 py-1 rounded flex items-center gap-1 flex-shrink-0"
                          style={{ ...font, color: c.muted, background: isDark ? "rgba(255,255,255,0.05)" : "#F3F4F6" }}>
                          <Check className="w-3 h-3" strokeWidth={2.5} />
                          Already in NorbieLink
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>

              <div style={{ height: 1, background: isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6", marginLeft: 24, marginRight: 24 }} />

              {/* Footer */}
              <div className="px-6 py-4 flex items-center justify-between flex-shrink-0">
                <span className="text-[12px]" style={{ ...font, color: c.muted }}>
                  <span className="font-semibold" style={{ color: c.text }}>{legacyImportSelected.size}</span> of {legacyNewCount} selected
                  {legacyDupCount > 0 ? ` · ${legacyDupCount} duplicate${legacyDupCount === 1 ? "" : "s"} skipped` : ""}
                </span>
                <div className="flex items-center gap-2">
                  <button onClick={closeLegacyImport}
                    className="px-4 py-2 text-[12px] font-semibold rounded-md transition-colors"
                    style={{ ...font, color: c.text, background: "transparent", border: `1px solid ${c.border}` }}
                    onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    Cancel
                  </button>
                  <button
                    disabled={legacyImportSelected.size === 0}
                    onClick={() => {
                      const count = legacyImportSelected.size;
                      closeLegacyImport();
                      setLegacyBannerDismissed(true);
                      showToast({
                        title: `${count} ${count === 1 ? "user" : "users"} imported`,
                        description: `Each will receive an invite email to finish setting up their NorbieLink account.`,
                      });
                    }}
                    className="px-4 py-2 text-[12px] font-semibold text-white rounded-md transition-all"
                    style={{ ...font, background: btnGrad, opacity: legacyImportSelected.size === 0 ? 0.5 : 1, cursor: legacyImportSelected.size === 0 ? "not-allowed" : "pointer" }}
                    onMouseEnter={e => { if (legacyImportSelected.size > 0) e.currentTarget.style.filter = "brightness(1.08)"; }}
                    onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
                    Import {legacyImportSelected.size || ""} {legacyImportSelected.size === 1 ? "user" : "users"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── Import Users Modal ── */}
      {importUsersOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background:"rgba(0,0,0,0.45)" }}
          onClick={closeImportModal}>
          {/* Phase-responsive width: empty/confirm/sent stay compact (600px) for the dialog
              feel; mapping/ready expand to 1200px because they hold real working surfaces
              (column-mapper grid, editable table with 8 cols × N rows). Tailwind JIT picks up
              both classes from the literal source so they're always generated. */}
          <div className={`rounded-2xl ${importPhase === "ready" || importPhase === "mapping" ? "w-[1200px]" : "w-[600px]"} max-w-[95vw] overflow-hidden`}
            style={{ background:isDark?"#1E2240":"#fff", boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}
            onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between px-8 pt-7 pb-5" style={{ borderBottom:`1px solid ${c.border}` }}>
              <h2 className="text-[20px] font-bold" style={{ fontFamily:FONT, color:c.text }}>Bulk Upload Users</h2>
              <button onClick={closeImportModal} className="p-1.5 rounded-lg transition-colors" style={{ color:c.muted }}
                onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                <X className="w-5 h-5"/>
              </button>
            </div>

            <div className="px-8 py-6 space-y-4">
              {/* Draft-resume prompt — protects the user from losing in-progress work if they
                  accidentally closed the modal. localStorage stores per-agency drafts; on modal
                  open we check for one and surface this prompt. User picks Resume (jumps to the
                  ready phase with the saved rows) or Start Fresh (clears the draft). Replaces
                  the normal empty-phase content while open. */}
              {importPhase === "empty" && draftPrompt && (
                <div className="rounded-xl px-5 py-6 flex flex-col items-center text-center" style={{ border:`1px solid ${c.border}`, background:isDark?"rgba(166,20,195,0.05)":"#FAF7FF" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background:"rgba(166,20,195,0.12)" }}>
                    <FileText className="w-5 h-5" style={{ color:"#A614C3" }} />
                  </div>
                  <p className="text-[16px] font-bold mb-1" style={{ fontFamily:FONT, color:c.text }}>Resume your previous upload?</p>
                  <p className="text-[12.5px] mb-1.5" style={{ fontFamily:FONT, color:c.muted, lineHeight:"18px" }}>
                    We saved your in-progress work from <span style={{ fontWeight:600, color:c.text }}>{draftPrompt.fileName}</span>{" "}
                    with <span style={{ fontWeight:600, color:c.text }}>{draftPrompt.count} {draftPrompt.count === 1 ? "user" : "users"}</span> ready to review.
                  </p>
                  <p className="text-[11px] mb-5" style={{ fontFamily:FONT, color:c.muted }}>You can pick up where you left off, or discard it and start over.</p>
                  <div className="flex items-center gap-2.5">
                    <button onClick={discardDraft}
                      className="px-5 py-2.5 rounded-lg text-[13px] font-semibold transition-colors"
                      style={{ fontFamily:FONT, color:c.text, border:`1px solid ${c.border}`, background:isDark?"rgba(255,255,255,0.04)":"#fff" }}
                      onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)}
                      onMouseLeave={e=>(e.currentTarget.style.background=isDark?"rgba(255,255,255,0.04)":"#fff")}>
                      Start fresh
                    </button>
                    <button onClick={resumeDraft}
                      className="px-5 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all"
                      style={{ fontFamily:FONT, background:btnGrad, boxShadow:"0 2px 10px rgba(166,20,195,0.25)" }}
                      onMouseEnter={e=>(e.currentTarget.style.filter="brightness(1.08)")}
                      onMouseLeave={e=>(e.currentTarget.style.filter="none")}>
                      Resume editing
                    </button>
                  </div>
                </div>
              )}

              {/* Format reference + template download — only shown in the empty phase.
                  Once the user has uploaded a file, those preparation aids step out of the way so
                  the ready (confirmation) and sent (success) phases each get one focused card. */}
              {importPhase === "empty" && !draftPrompt && (<>
              {/* Single help panel — intro ("what is this and how do I use it") at the top,
                  then a dashed divider, then the dry column-format specs. Merging the two
                  into one container reads as a coherent "why → how" reference instead of two
                  stacked boxes competing for attention. */}
              {/* 3-step workflow card — visual process overview with branded icon chips.
                  Step 1 is "Prepare" (not "Download") so smart column matching handles arbitrary
                  files. Step boxes are direct flex children with flex-1 each + non-grow chevrons
                  between them, so all three boxes end up EXACTLY the same width (the previous
                  layout shared flex cells with chevrons, which made box 3 wider than 1 and 2). */}
              {/* Simple intro — icon + bold title + descriptive paragraph. The earlier
                  step-box version was overkill for what's essentially "fill a file, upload it";
                  a single sentence reads faster and doesn't need spacing/overflow gymnastics. */}
              <div className="rounded-xl px-4 py-3.5 flex items-start gap-2.5" style={{ border:`1px solid ${c.border}`, background:isDark?"rgba(255,255,255,0.02)":"#FAFAFB" }}>
                <Users className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color:"#A614C3" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold" style={{ fontFamily:FONT, color:c.text }}>Create multiple users at once</p>
                  <p className="text-[12px] mt-0.5" style={{ fontFamily:FONT, color:c.muted, lineHeight:"17px" }}>
                    Fill in the template (or use your own file) and upload it. We&apos;ll email every valid user a secure registration link.
                  </p>
                </div>
              </div>

              {/* Example-row card — the format reference. Users can use the downloaded
                  template OR upload their own file (smart column mapping handles either).
                  Card has three rows inside:
                    1. Example data table (the canonical row shape)
                    2. Allowed values list (Admin / Job Title — the only restricted columns)
                    3. Principal-uniqueness note (footer) */}
              <div className="rounded-xl overflow-hidden" style={{ border:`1px solid ${c.border}`, background:isDark?"rgba(255,255,255,0.02)":"#fff" }}>
                <div className="px-4 py-2.5" style={{ borderBottom:`1px solid ${c.border}`, background:isDark?"rgba(255,255,255,0.03)":"#FAFAFB" }}>
                  <p className="text-[10px] font-bold uppercase" style={{ fontFamily:FONT, color:c.muted, letterSpacing:"0.08em" }}>
                    Example row
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="text-[11px]" style={{ fontFamily:FONT, borderCollapse:"separate", borderSpacing:0, width:"100%" }}>
                    <thead>
                      <tr style={{ background:isDark?"rgba(255,255,255,0.04)":"#FAFAFB" }}>
                        {["First Name","Last Name","Admin","Job title","Email","Phone","Ext","Address"].map((h, i) => (
                          <th key={h} className="text-left px-3 py-2 font-semibold whitespace-nowrap" style={{ color:c.muted, borderBottom:`1px solid ${c.border}`, borderRight: i < 7 ? `1px solid ${c.border}` : "none" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { firstName:"John",  lastName:"Doe",   admin:"No",  jobTitle:"Producer",  email:"john@example.com", phone:"(555) 123-4567", ext:"101", address:"123 Main St" },
                        { firstName:"Jane",  lastName:"Smith", admin:"Yes", jobTitle:"Principal", email:"jane@example.com", phone:"(555) 987-6543", ext:"",    address:"" },
                      ].map((r, ri) => (
                        <tr key={ri}>
                          {[r.firstName, r.lastName, r.admin, r.jobTitle, r.email, r.phone, r.ext, r.address].map((v, ci) => (
                            <td key={ci} className="px-3 py-2 whitespace-nowrap font-mono" style={{ color: v ? c.text : c.muted, borderRight: ci < 7 ? `1px solid ${c.border}` : "none", borderBottom: `1px solid ${c.border}` }}>
                              {v || <span style={{ opacity:0.5 }}>—</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Allowed values list — explicit text format, brand-purple values. User said the
                    listed version was clearer than the "use dropdowns" hand-wave. */}
                <div className="px-4 py-3 space-y-1" style={{ background:isDark?"rgba(255,255,255,0.02)":"#FAFAFB" }}>
                  <div className="flex items-baseline gap-2 text-[11px]" style={{ fontFamily:FONT }}>
                    <span className="flex-shrink-0 w-[60px]" style={{ color:c.muted }}>Admin</span>
                    <span className="font-mono" style={{ color:"#A614C3" }}>Yes / No</span>
                  </div>
                  <div className="flex items-baseline gap-2 text-[11px]" style={{ fontFamily:FONT }}>
                    <span className="flex-shrink-0 w-[60px]" style={{ color:c.muted }}>Job title</span>
                    <span className="font-mono" style={{ color:"#A614C3" }}>{JOB_TITLES.join(" / ")}</span>
                  </div>
                </div>
                {/* Principal-uniqueness footer */}
                <div className="flex items-center gap-1.5 px-4 py-2 text-[11px]" style={{ fontFamily:FONT, color:c.muted, borderTop:`1px solid ${c.border}`, background:isDark?"rgba(255,255,255,0.02)":"#FAFAFB" }}>
                  <AlertCircle className="w-3 h-3 flex-shrink-0" style={{ color:"#A614C3" }} />
                  <span>Only one <span style={{ fontFamily:"monospace", color:"#A614C3", fontWeight:600 }}>Principal</span> allowed per agency.</span>
                </div>
              </div>

              {/* Template download — single Excel-only button. CSV was dropped because it can't carry
                  the Admin / Job Title dropdowns that make the template foolproof. */}
              <button type="button" onClick={() => downloadExcelTemplate()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold text-white transition-all"
                style={{ fontFamily:FONT, background: btnGrad, boxShadow:"0 2px 10px rgba(166,20,195,0.20)" }}
                onMouseEnter={e=>(e.currentTarget.style.filter="brightness(1.08)")}
                onMouseLeave={e=>(e.currentTarget.style.filter="none")}>
                <Download className="w-4 h-4"/>
                Download Excel Template
              </button>
              </>)}

              {/* Upload zone — single container, three inline phases */}
              {importPhase === "empty" && !draftPrompt && (
                <>
                  {/* Hidden native file input — triggered by the dropzone click + the drag/drop handlers below. */}
                  <input
                    ref={importFileInputRef}
                    type="file"
                    // Extension-only accept list is the most reliable cross-browser path —
                    // MIME-type strings are inconsistent across macOS/Windows and sometimes
                    // hide .xlsx in the picker when paired with text/csv.
                    accept=".xlsx,.xls,.csv"
                    style={{ display: "none" }}
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) void handleImportFileChosen(f);
                      // Reset so the same file can be re-picked after Cancel.
                      e.target.value = "";
                    }}
                  />
                  <div onClick={() => { if (!importBusy) importFileInputRef.current?.click(); }}
                    onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = "rgba(168,85,247,0.6)"; e.currentTarget.style.background = "rgba(168,85,247,0.08)"; }}
                    onDragLeave={e => { e.currentTarget.style.borderColor = isDark?"rgba(255,255,255,0.2)":"#D1D5DB"; e.currentTarget.style.background = isDark?"rgba(255,255,255,0.02)":"#fff"; }}
                    onDrop={e => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = isDark?"rgba(255,255,255,0.2)":"#D1D5DB";
                      e.currentTarget.style.background = isDark?"rgba(255,255,255,0.02)":"#fff";
                      const f = e.dataTransfer.files?.[0];
                      if (f) void handleImportFileChosen(f);
                    }}
                    className="rounded-xl flex flex-col items-center justify-center py-10 cursor-pointer transition-all"
                    style={{ border:`1.5px dashed ${isDark?"rgba(255,255,255,0.2)":"#D1D5DB"}`, background:isDark?"rgba(255,255,255,0.02)":"#fff", opacity: importBusy ? 0.6 : 1 }}
                    onMouseEnter={e=>{ if (!importBusy) { e.currentTarget.style.borderColor = "rgba(168,85,247,0.45)"; e.currentTarget.style.background = "rgba(168,85,247,0.04)"; } }}
                    onMouseLeave={e=>{ e.currentTarget.style.borderColor = isDark?"rgba(255,255,255,0.2)":"#D1D5DB"; e.currentTarget.style.background = isDark?"rgba(255,255,255,0.02)":"#fff"; }}>
                    <svg className="mb-2.5" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A614C3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                    </svg>
                    <p className="text-[14px] font-semibold mb-1" style={{ fontFamily:FONT, color:c.text }}>
                      {importBusy ? "Reading file…" : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-[12px]" style={{ fontFamily:FONT, color:c.muted }}>Any spreadsheet — we&apos;ll match your columns automatically</p>
                  </div>
                  {importError && (
                    <p className="text-[12px] mt-2 px-3 py-2 rounded-lg" style={{ fontFamily:FONT, color:"#B91C1C", background:"#FEF2F2", border:"1px solid #FECACA" }}>
                      {importError}
                    </p>
                  )}
                </>
              )}

              {/* ── Mapping phase — fuzzy header reconciliation ── */}
              {importPhase === "mapping" && rawParsed && (() => {
                // Split headers into auto-matched (already on a canonical field) and unmapped
                // (currently "ignore"). The auto-matched group is shown read-only as confirmation;
                // unmapped ones get a dropdown so the user can pick a field or explicitly ignore.
                const headers = rawParsed.headers;
                const isAuto = (idx: number): boolean => {
                  const h = headers[idx];
                  return !!h && autoMapHeader(h) !== null;
                };
                const matchedIndices   = headers.map((_, i) => i).filter(i => isAuto(i));
                const unmatchedIndices = headers.map((_, i) => i).filter(i => !isAuto(i) && headers[i].trim() !== "");
                // Sample value from the first data row, for context — helps the user decide
                // what an ambiguous column actually contains.
                const sampleFor = (colIdx: number): string => {
                  const v = rawParsed.rows[0]?.[colIdx] ?? "";
                  return v.length > 28 ? v.slice(0, 25) + "…" : v;
                };
                // Each unmapped column needs a chosen field before we can continue. "ignore" counts
                // as a chosen field too — user is explicitly dropping it. The blank/initial state
                // is "ignore" by default, so this is essentially always true; we keep the check
                // for future tightening (e.g. require explicit confirmation).
                const allChosen = unmatchedIndices.every(i => headerMapping[i] !== undefined);
                // Available field options for the dropdowns — exclude fields already mapped by
                // auto-match so we don't offer them twice (user can still pick "ignore").
                const usedByAuto = new Set<CanonicalField>(matchedIndices.map(i => headerMapping[i]));
                const allFieldOptions: { value: CanonicalField; label: string }[] = [
                  { value: "ignore",    label: "Ignore this column" },
                  { value: "firstName", label: "First Name" },
                  { value: "lastName",  label: "Last Name" },
                  { value: "email",     label: "Email" },
                  { value: "admin",     label: "Admin (Yes/No)" },
                  { value: "jobTitle",  label: "Job title" },
                  { value: "phone",     label: "Phone" },
                  { value: "ext",       label: "Ext" },
                  { value: "address",   label: "Address (optional)" },
                ];
                const fieldOptions = allFieldOptions.filter(o => o.value === "ignore" || !usedByAuto.has(o.value));
                return (
                <div>
                  <p className="text-[18px] font-bold text-center mb-1.5" style={{ fontFamily:FONT, color:c.text }}>Map your columns</p>
                  <p className="text-[13px] text-center mx-auto mb-6 max-w-[560px]" style={{ fontFamily:FONT, color:c.muted, lineHeight:"19px", textWrap:"balance" }}>
                    We found <span style={{ fontWeight:600, color:c.text }}>{headers.filter(h => h.trim() !== "").length}</span> columns in your file. {matchedIndices.length > 0 && <>Auto-matched <span style={{ fontWeight:600, color:c.text }}>{matchedIndices.length}</span>{matchedIndices.length === 1 ? "" : ""} — </>}please tell us what these unrecognized columns are.
                  </p>

                  {/* Auto-matched columns — compact summary, read-only chips */}
                  {matchedIndices.length > 0 && (
                    <div className="rounded-xl px-4 py-3 mb-4" style={{ border:`1px solid ${c.border}`, background:isDark?"rgba(255,255,255,0.02)":"#F9FAFB" }}>
                      <p className="text-[12px] font-semibold mb-2" style={{ fontFamily:FONT, color:c.muted }}>Auto-matched</p>
                      <div className="flex flex-wrap gap-1.5">
                        {matchedIndices.map(i => {
                          const field = headerMapping[i];
                          const fieldLabel = fieldOptions.find(o => o.value === field)?.label ?? field;
                          return (
                            <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11.5px]" style={{ fontFamily:FONT, background:"rgba(115,201,183,0.12)", color:"#73C9B7", border:"1px solid rgba(115,201,183,0.35)" }}>
                              <Check className="w-3 h-3" strokeWidth={3}/>
                              <span className="font-mono">{headers[i]}</span>
                              <span style={{ opacity:0.6 }}>→</span>
                              <span className="font-semibold">{fieldLabel}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Unmapped columns — each gets a dropdown. Bordered card per row so the user
                      can see the header, a sample value, and pick what it maps to in one glance. */}
                  {unmatchedIndices.length > 0 ? (
                    <div className="rounded-xl overflow-hidden mb-5" style={{ border:`1px solid ${c.border}` }}>
                      <div className="px-4 py-2.5 text-[12px] font-semibold flex items-center gap-2" style={{ fontFamily:FONT, color:c.text, background:isDark?"rgba(255,255,255,0.02)":"#FAFAFB", borderBottom:`1px solid ${c.border}` }}>
                        <AlertCircle className="w-3.5 h-3.5" style={{ color:"#A614C3" }}/>
                        <span>Needs mapping — {unmatchedIndices.length} {unmatchedIndices.length === 1 ? "column" : "columns"}</span>
                      </div>
                      <div style={{ maxHeight: 260, overflowY:"auto" }}>
                        {unmatchedIndices.map((colIdx, displayIdx) => {
                          const choice = headerMapping[colIdx] ?? "ignore";
                          return (
                            <div key={colIdx} className="px-4 py-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3" style={{ borderBottom: displayIdx < unmatchedIndices.length - 1 ? `1px solid ${c.border}` : "none", fontFamily:FONT }}>
                              <div className="min-w-0">
                                <div className="text-[12.5px] font-semibold font-mono truncate" style={{ color:c.text }}>{headers[colIdx]}</div>
                                <div className="text-[11px] truncate" style={{ color:c.muted }}>
                                  e.g. {sampleFor(colIdx) || <span style={{ fontStyle:"italic" }}>(empty)</span>}
                                </div>
                              </div>
                              <div className="text-[12px]" style={{ color:c.muted }}>→</div>
                              <select value={choice}
                                onChange={e => {
                                  const nextField = e.target.value as CanonicalField;
                                  setHeaderMapping(prev => {
                                    const out = [...prev];
                                    out[colIdx] = nextField;
                                    return out;
                                  });
                                }}
                                className="w-full px-3 py-2 rounded-lg text-[12.5px] outline-none transition-colors"
                                style={{ fontFamily:FONT, color:c.text, background:isDark?"rgba(255,255,255,0.05)":"#fff", border:`1px solid ${c.border}` }}>
                                {fieldOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                              </select>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl px-4 py-6 mb-5 text-center" style={{ border:`1px solid ${c.border}`, background:isDark?"rgba(255,255,255,0.02)":"#F9FAFB" }}>
                      <p className="text-[12.5px]" style={{ fontFamily:FONT, color:c.muted }}>
                        Everything in your file auto-matched cleanly. Hit Continue to review the rows.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <button onClick={() => { setImportPhase("empty"); setRawParsed(null); setHeaderMapping([]); setImportFileName(null); }}
                      className="px-5 py-2.5 rounded-lg text-[13px] font-semibold transition-colors"
                      style={{ fontFamily:FONT, color:c.text, border:`1px solid ${c.border}`, background:isDark?"rgba(255,255,255,0.04)":"#fff" }}
                      onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)}
                      onMouseLeave={e=>(e.currentTarget.style.background=isDark?"rgba(255,255,255,0.04)":"#fff")}>
                      Back
                    </button>
                    <button onClick={confirmMapping} disabled={!allChosen}
                      className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all"
                      style={{ fontFamily:FONT, background: allChosen ? btnGrad : "#9CA3AF", cursor: allChosen ? "pointer" : "not-allowed", boxShadow: allChosen ? "0 2px 10px rgba(166,20,195,0.25)" : "none" }}
                      onMouseEnter={e=>{ if (allChosen) e.currentTarget.style.filter = "brightness(1.08)"; }}
                      onMouseLeave={e=>(e.currentTarget.style.filter="none")}>
                      Continue<ChevronRight className="w-3.5 h-3.5"/>
                    </button>
                  </div>
                </div>
                );
              })()}

              {importPhase === "ready" && (() => {
                // Derived state from parsedUsers + importIssues. Recomputed every render — at
                // 500 rows this is sub-millisecond, much simpler than memo dance.
                const totalUsers   = parsedUsers.length;
                const errorRowIdx  = new Set(importIssues.filter(i => i.severity === "error").map(i => i.rowIndex));
                const warnRowIdx   = new Set(importIssues.filter(i => i.severity === "warning").map(i => i.rowIndex));
                const errorCount   = errorRowIdx.size;
                const warningCount = warnRowIdx.size;
                const validCount   = totalUsers - errorCount;
                // For per-cell error highlighting + tooltip-on-hover.
                const issuesByRow = new Map<number, ImportIssue[]>();
                importIssues.forEach(iss => {
                  const list = issuesByRow.get(iss.rowIndex) ?? [];
                  list.push(iss);
                  issuesByRow.set(iss.rowIndex, list);
                });
                // Ordered list of error-row indices for the [↑ Prev] [↓ Next] navigation.
                const errorRowIndices   = Array.from(errorRowIdx).sort((a, b) => a - b);
                const warningRowIndices = Array.from(warnRowIdx).sort((a, b) => a - b);
                // Build human-readable summaries of all error + warning messages for the chip
                // tooltips. Without these, a chip like "1 warning" is opaque — the user knows
                // there IS a warning but doesn't know WHICH one or how to fix it.
                const errorSummary   = importIssues.filter(i => i.severity === "error").map(i => i.message).join("\n");
                const warningSummary = importIssues.filter(i => i.severity === "warning").map(i => i.message).join("\n");
                // Helper: scroll a row into view (used by the jump buttons). DOM lookup is
                // intentional — we attach a stable id per row so this works regardless of which
                // rows are currently in the viewport, no per-row refs needed.
                const jumpToRow = (rowIdx: number) => {
                  if (typeof document === "undefined") return;
                  const el = document.getElementById(`bulk-row-${rowIdx}`);
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                };
                const jumpToNextError = () => {
                  if (errorRowIndices.length === 0) return;
                  // Find the next error AFTER the topmost visible row. For simplicity, just cycle:
                  // remember the last jumped index in a window data attribute. This avoids needing
                  // another piece of state for a tiny UX detail.
                  const container = document.getElementById("bulk-table-scroll");
                  const lastIdxStr = container?.dataset.lastJumpIdx;
                  const lastIdx = lastIdxStr ? parseInt(lastIdxStr, 10) : -1;
                  const next = errorRowIndices.find(i => i > lastIdx) ?? errorRowIndices[0];
                  jumpToRow(next);
                  if (container) container.dataset.lastJumpIdx = String(next);
                };
                const jumpToPrevError = () => {
                  if (errorRowIndices.length === 0) return;
                  const container = document.getElementById("bulk-table-scroll");
                  const lastIdxStr = container?.dataset.lastJumpIdx;
                  const lastIdx = lastIdxStr ? parseInt(lastIdxStr, 10) : errorRowIndices.length;
                  const reversed = [...errorRowIndices].reverse();
                  const prev = reversed.find(i => i < lastIdx) ?? errorRowIndices[errorRowIndices.length - 1];
                  jumpToRow(prev);
                  if (container) container.dataset.lastJumpIdx = String(prev);
                };
                // Column definitions for the editable table. `width` is a hint for the layout;
                // the table is fixed-width so columns stay aligned during scroll.
                type ColKey = "firstName" | "lastName" | "admin" | "jobTitle" | "email" | "phone" | "ext" | "address";
                type Col = { key: ColKey; label: string; required: boolean; width: number; kind: "text" | "select"; options?: readonly string[] };
                const columns: Col[] = [
                  { key: "firstName", label: "First Name", required: true,  width: 120, kind: "text" },
                  { key: "lastName",  label: "Last Name",  required: true,  width: 120, kind: "text" },
                  { key: "admin",     label: "Admin",      required: true,  width: 90,  kind: "select", options: ["Yes", "No"] as const },
                  { key: "jobTitle",  label: "Job title",  required: true,  width: 145, kind: "select", options: JOB_TITLES },
                  { key: "email",     label: "Email",      required: true,  width: 200, kind: "text" },
                  { key: "phone",     label: "Phone",      required: true,  width: 130, kind: "text" },
                  { key: "ext",       label: "Ext",        required: false, width: 70,  kind: "text" },
                  { key: "address",   label: "Address",    required: false, width: 220, kind: "text" },
                ];
                // Map each ImportIssue field to the ParsedUser key for per-cell coloring.
                // "principal" maps to jobTitle so the Principal-conflict warning paints that cell.
                const issueFieldToCol = (field: ImportIssue["field"]): ColKey => field === "principal" ? "jobTitle" : field;
                return (
                <div style={{ position: "relative" }}>
                  {/* Sticky toolbar — file caption, summary counts, error-nav, download progress */}
                  <div className="flex items-center gap-3 px-4 py-2.5 mb-3 rounded-xl flex-wrap" style={{ border:`1px solid ${c.border}`, background:isDark?"rgba(255,255,255,0.02)":"#FAFAFB" }}>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <FileText className="w-3.5 h-3.5 flex-shrink-0" style={{ color:"#73C9B7" }}/>
                      <span className="text-[12.5px] font-semibold truncate" style={{ fontFamily:FONT, color:c.text }}>{importFileName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11.5px]" style={{ fontFamily:FONT }}>
                      {/* "X users" chip = "Show all" filter. Active when no filter is applied. */}
                      <button type="button" title="Show all rows"
                        onClick={() => setTableFilter("all")}
                        className="px-2 py-0.5 rounded font-semibold cursor-pointer transition-colors"
                        style={{
                          background: tableFilter === "all" ? "rgba(168,85,247,0.22)" : "rgba(168,85,247,0.10)",
                          color: "#A614C3", border: "none",
                          outline: tableFilter === "all" ? "1.5px solid rgba(166,20,195,0.55)" : "none",
                          outlineOffset: -1,
                        }}>
                        {totalUsers} {totalUsers === 1 ? "user" : "users"}
                      </button>
                      {/* Error / warning chips are filter TOGGLES — click to focus the table on
                          just the rows of that severity (essential at 500-row scale). Active filter
                          has a stronger background + outline ring. Tooltip still lists the messages
                          so a quick hover shows what the issues actually are. */}
                      {errorCount > 0 && (
                        <button type="button"
                          title={errorSummary || "Click to filter to error rows"}
                          onClick={() => setTableFilter(prev => prev === "errors" ? "all" : "errors")}
                          className="px-2 py-0.5 rounded font-semibold cursor-pointer transition-colors"
                          style={{
                            background: tableFilter === "errors" ? "rgba(239,68,68,0.22)" : "rgba(239,68,68,0.10)",
                            color: "#B91C1C", border: "none",
                            outline: tableFilter === "errors" ? "1.5px solid rgba(185,28,28,0.55)" : "none",
                            outlineOffset: -1,
                          }}
                          onMouseEnter={e => { if (tableFilter !== "errors") e.currentTarget.style.background = "rgba(239,68,68,0.18)"; }}
                          onMouseLeave={e => { if (tableFilter !== "errors") e.currentTarget.style.background = "rgba(239,68,68,0.10)"; }}>
                          {errorCount} {errorCount === 1 ? "error" : "errors"}
                        </button>
                      )}
                      {warningCount > 0 && (
                        <button type="button"
                          title={warningSummary || "Click to filter to warning rows"}
                          onClick={() => setTableFilter(prev => prev === "warnings" ? "all" : "warnings")}
                          className="px-2 py-0.5 rounded font-semibold cursor-pointer transition-colors"
                          style={{
                            background: tableFilter === "warnings" ? "rgba(245,158,11,0.22)" : "rgba(245,158,11,0.10)",
                            color: "#B45309", border: "none",
                            outline: tableFilter === "warnings" ? "1.5px solid rgba(180,83,9,0.55)" : "none",
                            outlineOffset: -1,
                          }}
                          onMouseEnter={e => { if (tableFilter !== "warnings") e.currentTarget.style.background = "rgba(245,158,11,0.18)"; }}
                          onMouseLeave={e => { if (tableFilter !== "warnings") e.currentTarget.style.background = "rgba(245,158,11,0.10)"; }}>
                          {warningCount} {warningCount === 1 ? "warning" : "warnings"}
                        </button>
                      )}
                      {errorCount === 0 && warningCount === 0 && <span className="px-2 py-0.5 rounded font-semibold" style={{ background:"rgba(115,201,183,0.15)", color:"#73C9B7" }}>all clear</span>}
                    </div>
                    <div className="flex items-center gap-1.5 ml-auto">
                      {/* Error-nav buttons — only meaningful when at least one error exists */}
                      <button type="button" onClick={jumpToPrevError} disabled={errorCount === 0} title="Previous error"
                        className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
                        style={{ fontFamily:FONT, color:errorCount === 0 ? c.muted : c.text, border:`1px solid ${c.border}`, background:isDark?"rgba(255,255,255,0.04)":"#fff", cursor: errorCount === 0 ? "not-allowed" : "pointer", opacity: errorCount === 0 ? 0.5 : 1 }}
                        onMouseEnter={e=>{ if (errorCount > 0) e.currentTarget.style.background = c.hoverBg; }}
                        onMouseLeave={e=>(e.currentTarget.style.background = isDark?"rgba(255,255,255,0.04)":"#fff")}>
                        <ChevronUp className="w-3.5 h-3.5"/>
                      </button>
                      <button type="button" onClick={jumpToNextError} disabled={errorCount === 0} title="Next error"
                        className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
                        style={{ fontFamily:FONT, color:errorCount === 0 ? c.muted : c.text, border:`1px solid ${c.border}`, background:isDark?"rgba(255,255,255,0.04)":"#fff", cursor: errorCount === 0 ? "not-allowed" : "pointer", opacity: errorCount === 0 ? 0.5 : 1 }}
                        onMouseEnter={e=>{ if (errorCount > 0) e.currentTarget.style.background = c.hoverBg; }}
                        onMouseLeave={e=>(e.currentTarget.style.background = isDark?"rgba(255,255,255,0.04)":"#fff")}>
                        <ChevronDown className="w-3.5 h-3.5"/>
                      </button>
                      <button type="button" onClick={() => { void downloadProgressFile(); }} title="Download in-progress file"
                        className="flex items-center gap-1.5 px-3 h-7 rounded-md text-[11.5px] font-semibold transition-colors"
                        style={{ fontFamily:FONT, color:c.text, border:`1px solid ${c.border}`, background:isDark?"rgba(255,255,255,0.04)":"#fff" }}
                        onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)}
                        onMouseLeave={e=>(e.currentTarget.style.background=isDark?"rgba(255,255,255,0.04)":"#fff")}>
                        <Download className="w-3 h-3"/>Download progress
                      </button>
                    </div>
                  </div>

                  {/* Combined info strip — warning summary (left) + filter status (right) in
                      ONE row instead of two stacked banners. Either segment is conditional, so
                      the strip might show just warning, just filter, or both with a vertical
                      divider between them. Container color: amber-tinted when warnings present,
                      red-tinted when only an error filter is active. */}
                  {(warningCount > 0 || tableFilter !== "all") && (() => {
                    // Build warning info (currently only "Multiple Principals" exists, but the
                    // categoryOf branch keeps it extensible).
                    let warningContent: React.ReactNode = null;
                    if (warningCount > 0) {
                      const warnings = importIssues.filter(i => i.severity === "warning");
                      const categoryOf = (iss: ImportIssue): string =>
                        iss.field === "principal" ? "Multiple Principals" : "Warning";
                      const groups = new Map<string, { rows: number[]; rule: string }>();
                      warnings.forEach(iss => {
                        const key = categoryOf(iss);
                        const rule = iss.field === "principal"
                          ? "only one Principal allowed per agency"
                          : "review the affected rows";
                        const existing = groups.get(key);
                        if (existing) existing.rows.push(iss.rowIndex + 2);
                        else groups.set(key, { rows: [iss.rowIndex + 2], rule });
                      });
                      // For the single-line strip we render only the FIRST category. (Multi-
                      // category warnings would push back to a multi-line layout if it ever
                      // comes up; right now there's only ever one warning type.)
                      const [label, info] = Array.from(groups.entries())[0];
                      const shown = info.rows.slice(0, 6);
                      const rowText = info.rows.length === 1
                        ? `Row ${shown[0]}`
                        : `Rows ${shown.join(", ")}${info.rows.length > shown.length ? `, +${info.rows.length - shown.length} more` : ""}`;
                      warningContent = (
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#B45309" }} />
                          <div className="truncate">
                            <span style={{ color: "#B45309", fontWeight: 600 }}>{label}</span>
                            <span style={{ color: c.muted }}> · {rowText} · {info.rule}</span>
                          </div>
                        </div>
                      );
                    }
                    // Container background: amber wins (warnings are persistent info), only fall
                    // back to red when there are no warnings but the error filter is active.
                    const useAmber = warningCount > 0;
                    const bg = useAmber ? "rgba(245,158,11,0.06)" : "rgba(239,68,68,0.06)";
                    const borderColor = useAmber ? "rgba(245,158,11,0.25)" : "rgba(239,68,68,0.25)";
                    return (
                      <div className="flex items-center gap-3 px-3 py-1.5 mb-2 rounded-md text-[11.5px]"
                        style={{ fontFamily: FONT, background: bg, border: `1px solid ${borderColor}` }}>
                        {warningContent}
                        {warningContent && tableFilter !== "all" && (
                          <div className="flex-shrink-0" style={{ width: 1, height: 16, background: borderColor }} />
                        )}
                        {tableFilter !== "all" && (
                          <div className={`flex items-center gap-2 flex-shrink-0 ${warningContent ? "" : "ml-auto"}`}>
                            <span style={{ color: tableFilter === "errors" ? "#B91C1C" : "#B45309", fontWeight: 600 }}>
                              {tableFilter === "errors" ? "Errors only" : "Warnings only"}
                            </span>
                            <button type="button" onClick={() => setTableFilter("all")}
                              className="text-[11px] underline transition-colors"
                              style={{ color: c.muted, background: "transparent", border: "none", cursor: "pointer" }}
                              onMouseEnter={e => (e.currentTarget.style.color = c.text)}
                              onMouseLeave={e => (e.currentTarget.style.color = c.muted)}>
                              Show all
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Editable table — fixed-layout grid, scrollable y. The id on the scroll
                      container lets the jump-to-error buttons query it for the last-jumped index. */}

                  <div id="bulk-table-scroll" className="rounded-xl overflow-auto mb-4" style={{ border:`1px solid ${c.border}`, maxHeight: 420 }}>
                    <table className="text-[12px]" style={{ fontFamily:FONT, borderCollapse:"separate", borderSpacing:0, tableLayout:"fixed", width:"100%", minWidth: columns.reduce((a, c) => a + c.width, 24) }}>
                      <thead style={{ position:"sticky", top:0, zIndex:1, background:isDark?"#1E2240":"#F9FAFB" }}>
                        <tr>
                          {columns.map(col => (
                            <th key={col.key} className="text-left px-2.5 py-2 text-[11px] font-semibold" style={{ width: col.width, color:c.muted, borderBottom:`1px solid ${c.border}` }}>
                              {col.label}{col.required && <span style={{ color:"#A614C3", marginLeft:2 }}>*</span>}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {/* Filter applies the active chip's category — preserve the ORIGINAL row
                            index `i` so updateRow, the row id (`bulk-row-${i}`), and the row-number
                            messaging all stay anchored to the spreadsheet row, not the visible position. */}
                        {parsedUsers
                          .map((u, i) => ({ u, i }))
                          .filter(({ i }) => {
                            if (tableFilter === "errors")   return errorRowIdx.has(i);
                            if (tableFilter === "warnings") return warnRowIdx.has(i);
                            return true;
                          })
                          .map(({ u, i }) => {
                          const rowIssues = issuesByRow.get(i) ?? [];
                          const rowHasError = rowIssues.some(iss => iss.severity === "error");
                          const rowHasWarn  = rowIssues.some(iss => iss.severity === "warning");
                          // Per-field issue map → message string for the cell tooltip.
                          const issueByCol = new Map<ColKey, ImportIssue>();
                          rowIssues.forEach(iss => {
                            const col = issueFieldToCol(iss.field);
                            // Errors take precedence over warnings on the same cell.
                            const existing = issueByCol.get(col);
                            if (!existing || (existing.severity === "warning" && iss.severity === "error")) {
                              issueByCol.set(col, iss);
                            }
                          });
                          const rowBg = rowHasError ? (isDark ? "rgba(239,68,68,0.06)" : "#FEF7F7") : rowHasWarn ? (isDark ? "rgba(245,158,11,0.06)" : "#FFFBF0") : "transparent";
                          return (
                            <tr key={i} id={`bulk-row-${i}`} style={{ background: rowBg }}>
                              {columns.map(col => {
                                const cellIssue = issueByCol.get(col.key);
                                const cellHasError = cellIssue?.severity === "error";
                                const cellHasWarn  = cellIssue?.severity === "warning";
                                const cellBorderColor = cellHasError ? "#FCA5A5" : cellHasWarn ? "#FDE68A" : c.border;
                                const cellBg = cellHasError ? (isDark ? "rgba(239,68,68,0.05)" : "#FFF5F5") : cellHasWarn ? (isDark ? "rgba(245,158,11,0.05)" : "#FFFBEB") : (isDark ? "rgba(255,255,255,0.03)" : "#fff");
                                const cellTitle = cellIssue?.message;
                                const value = u[col.key];
                                return (
                                  <td key={col.key} className="px-1.5 py-1" style={{ width: col.width, borderBottom:`1px solid ${c.border}` }}>
                                    {col.kind === "select" ? (
                                      // Custom-styled dropdown trigger — fully replaces native <select>
                                      // because the browser puts the caret flush against the right edge
                                      // and shows its own un-styleable dropdown menu. The actual options
                                      // list is rendered ONCE outside the table (as a fixed-position
                                      // overlay) so it floats above the table's overflow-clipped area.
                                      <button type="button" title={cellTitle}
                                        onClick={e => {
                                          e.stopPropagation();
                                          const rect = e.currentTarget.getBoundingClientRect();
                                          setCellSelect({
                                            rowIdx: i,
                                            field: col.key as "admin" | "jobTitle",
                                            options: col.options as string[],
                                            triggerRect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
                                          });
                                        }}
                                        className="w-full pl-2 pr-7 py-1.5 rounded-md text-[12px] outline-none text-left relative truncate"
                                        style={{ fontFamily:FONT, color: value ? c.text : c.muted, background: cellBg, border:`1px solid ${cellBorderColor}`, cursor: "pointer" }}>
                                        {value || "—"}
                                        <ChevronDown className="absolute w-3 h-3 pointer-events-none" style={{ right: 6, top: "50%", transform: "translateY(-50%)", color: c.muted }} />
                                      </button>
                                    ) : (
                                      <input value={value} onChange={e => updateRow(i, col.key, e.target.value)} title={cellTitle}
                                        placeholder={col.required ? "" : "—"}
                                        className="w-full px-2 py-1.5 rounded-md text-[12px] outline-none"
                                        style={{ fontFamily:FONT, color:c.text, background: cellBg, border:`1px solid ${cellBorderColor}` }} />
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Custom cell-select overlay — backdrop (full-viewport invisible div that
                      catches outside clicks) + panel (fixed-positioned over the trigger).
                      The backdrop is the click-outside dismissal — clicks on options bubble
                      up but are caught by the option's onClick first (with stopPropagation),
                      so option clicks register without also closing the panel. Styling matches
                      the existing DropList component used elsewhere in this file. */}
                  {cellSelect && (() => {
                    const { triggerRect, options, rowIdx, field } = cellSelect;
                    // Estimate panel height for drop-up detection. Each row is ~38px + chrome.
                    const panelEstHeight = Math.min(options.length * 38 + 8, 240);
                    const spaceBelow = window.innerHeight - (triggerRect.top + triggerRect.height);
                    const openUp = spaceBelow < panelEstHeight + 16;
                    const top = openUp
                      ? triggerRect.top - panelEstHeight - 4
                      : triggerRect.top + triggerRect.height + 4;
                    const currentValue = parsedUsers[rowIdx]?.[field] ?? "";
                    return (
                      <>
                        {/* Invisible backdrop — catches any click outside the panel and closes */}
                        <div className="fixed inset-0" style={{ zIndex: 9998 }}
                          onClick={() => setCellSelect(null)} />
                        <div className="fixed rounded-xl overflow-y-auto"
                          style={{
                            top, left: triggerRect.left, width: Math.max(triggerRect.width, 180),
                            maxHeight: 240,
                            background: c.cardBg,
                            border: `1px solid ${c.border}`,
                            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                            zIndex: 9999,
                          }}
                          onClick={e => e.stopPropagation()}>
                          {options.map(opt => {
                            const selected = opt === currentValue;
                            // Brand-purple tinted background for selected so it's distinct from
                            // hover (light gray). Selected state should always be visually obvious
                            // even when the user mouses to another row.
                            const selectedBg = isDark ? "rgba(166,20,195,0.18)" : "rgba(166,20,195,0.08)";
                            const hoverBg    = isDark ? "rgba(255,255,255,0.06)" : "#F9FAFB";
                            return (
                              <button key={opt} type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                  updateRow(rowIdx, field, opt);
                                  setCellSelect(null);
                                }}
                                className="w-full text-left px-4 py-2.5 text-[13px] transition-colors"
                                style={{
                                  fontFamily: FONT,
                                  color: selected ? "#A614C3" : c.text,
                                  fontWeight: selected ? 600 : 400,
                                  background: selected ? selectedBg : "transparent",
                                  cursor: "pointer",
                                }}
                                onMouseEnter={e => (e.currentTarget.style.background = selected ? selectedBg : hoverBg)}
                                onMouseLeave={e => (e.currentTarget.style.background = selected ? selectedBg : "transparent")}>
                                <div className="flex items-center justify-between gap-2">
                                  <span>{opt}</span>
                                  {selected && <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#A614C3" }} />}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    );
                  })()}

                  {/* Footer — Cancel / Send. Send is disabled when no row is sendable. */}
                  <div className="flex items-center justify-between gap-2">
                    <button onClick={closeImportModal}
                      className="px-5 py-2.5 rounded-lg text-[13px] font-semibold transition-colors"
                      style={{ fontFamily:FONT, color:c.text, border:`1px solid ${c.border}`, background:isDark?"rgba(255,255,255,0.04)":"#fff" }}
                      onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)}
                      onMouseLeave={e=>(e.currentTarget.style.background=isDark?"rgba(255,255,255,0.04)":"#fff")}>
                      Cancel
                    </button>
                    <div className="text-[11.5px] text-center" style={{ fontFamily:FONT, color:c.muted, maxWidth:340 }}>
                      {errorCount > 0 ? (
                        <>Rows with errors will be skipped on send. Use the arrow buttons above to jump between them.</>
                      ) : (
                        <>Every row is valid. Ready to send.</>
                      )}
                    </div>
                    <button onClick={() => setSendConfirmOpen(true)} disabled={validCount === 0}
                      className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all"
                      style={{ fontFamily:FONT, background: validCount === 0 ? "#9CA3AF" : btnGrad, cursor: validCount === 0 ? "not-allowed" : "pointer", boxShadow: validCount === 0 ? "none" : "0 2px 10px rgba(166,20,195,0.25)" }}
                      onMouseEnter={e=>{ if (validCount > 0) e.currentTarget.style.filter = "brightness(1.08)"; }}
                      onMouseLeave={e=>(e.currentTarget.style.filter="none")}>
                      <Send className="w-3.5 h-3.5"/>Send {validCount} {validCount === 1 ? "invite" : "invites"}
                    </button>
                  </div>

                  {/* Send-confirm overlay — sits ON TOP of the editable table when sendConfirmOpen.
                      Centered card, dim backdrop. Recaps how many are sending and how many are
                      being skipped (with explicit row numbers) so the user can back out if they
                      didn't realise. */}
                  {sendConfirmOpen && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl" style={{ background:"rgba(15,23,42,0.55)" }}
                      onClick={() => setSendConfirmOpen(false)}>
                      <div className="rounded-xl p-6 w-[440px] max-w-[90%]" style={{ background:isDark?"#1E2240":"#fff", boxShadow:"0 16px 40px rgba(0,0,0,0.35)" }}
                        onClick={e => e.stopPropagation()}>
                        <p className="text-[16px] font-bold mb-1.5" style={{ fontFamily:FONT, color:c.text }}>Ready to send?</p>
                        <p className="text-[13px] mb-5" style={{ fontFamily:FONT, color:c.muted, lineHeight:"19px" }}>
                          We&apos;ll email <span style={{ fontWeight:600, color:c.text }}>{validCount}</span> {validCount === 1 ? "user" : "users"} a secure registration link.
                          {errorCount > 0 && (
                            <> <span style={{ fontWeight:600, color:"#B91C1C" }}>{errorCount}</span>{" "}
                              {errorCount === 1 ? "row" : "rows"} with errors will be skipped — you can fix and re-upload them later.
                            </>
                          )}
                        </p>
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setSendConfirmOpen(false)}
                            className="px-4 py-2 rounded-lg text-[12.5px] font-semibold transition-colors"
                            style={{ fontFamily:FONT, color:c.text, border:`1px solid ${c.border}`, background:isDark?"rgba(255,255,255,0.04)":"#fff" }}
                            onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)}
                            onMouseLeave={e=>(e.currentTarget.style.background=isDark?"rgba(255,255,255,0.04)":"#fff")}>
                            Go back and fix
                          </button>
                          <button onClick={() => { setSendConfirmOpen(false); executeSend(); }}
                            className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-[12.5px] font-semibold text-white transition-all"
                            style={{ fontFamily:FONT, background:btnGrad, boxShadow:"0 2px 10px rgba(166,20,195,0.25)" }}
                            onMouseEnter={e=>(e.currentTarget.style.filter="brightness(1.08)")}
                            onMouseLeave={e=>(e.currentTarget.style.filter="none")}>
                            <Send className="w-3.5 h-3.5"/>Send {validCount} {validCount === 1 ? "invite" : "invites"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                );
              })()}

              {importPhase === "sent" && (
                <div className="flex flex-col items-center text-center py-8">
                  <div className="flex items-center justify-center mb-4"
                    style={{ width:56, height:56, borderRadius:9999, background:btnGrad }}>
                    <Check className="w-7 h-7 text-white" strokeWidth={3}/>
                  </div>
                  <p className="text-[18px] font-bold mb-2" style={{ fontFamily:FONT, color:c.text }}>
                    Invitations sent
                  </p>
                  {/* Status line + body merged into one paragraph — numbers appear once each,
                      semantically colored (green = sent, red = skipped). Drops the floating
                      chips below the body since they were just restating these same numbers. */}
                  <p className="text-[13.5px] mb-6 max-w-[460px]" style={{ fontFamily:FONT, color:c.muted, lineHeight:"20px" }}>
                    {sentSummary && sentSummary.skipped.length > 0 ? (
                      <>
                        <span style={{ fontWeight:600, color:"#73C9B7" }}>{sentSummary.sent}</span> {sentSummary.sent === 1 ? "user" : "users"} invited
                        {" · "}
                        <span style={{ fontWeight:600, color:"#B91C1C" }}>{sentSummary.skipped.length}</span> {sentSummary.skipped.length === 1 ? "row" : "rows"} skipped.
                        <br/>
                        Download the skipped rows below to fix and re-upload.
                      </>
                    ) : (
                      <>Each user will receive an email with a secure link to register and activate their Norbielink account.</>
                    )}
                  </p>
                  <div className="flex items-center gap-2">
                    {sentSummary && sentSummary.skipped.length > 0 && (
                      <button onClick={() => { void downloadSkippedRows(); }}
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-[13px] font-semibold transition-colors"
                        style={{ fontFamily:FONT, color:c.text, border:`1px solid ${c.border}`, background:isDark?"rgba(255,255,255,0.04)":"#fff" }}
                        onMouseEnter={e=>(e.currentTarget.style.background=c.hoverBg)}
                        onMouseLeave={e=>(e.currentTarget.style.background=isDark?"rgba(255,255,255,0.04)":"#fff")}>
                        <Download className="w-3.5 h-3.5"/>Download skipped rows
                      </button>
                    )}
                    <button onClick={() => {
                        setImportPhase("empty");
                        setImportFileName(null);
                        setImportUserCount(0);
                        setParsedUsers([]);
                        setImportIssues([]);
                        setRawParsed(null);
                        setHeaderMapping([]);
                        setSentSummary(null);
                      }}
                      className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-[13px] font-semibold text-white transition-all"
                      style={{ fontFamily:FONT, background:btnGrad, boxShadow:"0 2px 10px rgba(166,20,195,0.25)" }}
                      onMouseEnter={e=>(e.currentTarget.style.filter="brightness(1.08)")}
                      onMouseLeave={e=>(e.currentTarget.style.filter="none")}>
                      <Upload className="w-3.5 h-3.5"/>Upload More
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Add New Agency Form ────────────────────────────────────────────────── */
const AFFILIATIONS = [
  "AAA/ACG (AC364)","Acceptance","Acrisure","Affordable American Insurance",
  "American Family (AM102)","ASNOA (AL335)",
  "EPIC Insurance Brokers & Consultants","Farmers","Fiesta Insurance (FI062)",
  "First Choice Agents Alliance","First Connect Insurance Services (FI475)","Foundation Risk Partners",
  "Horizon Agency Systems (RC021)","HUB International Limited",
  "Insurance Alliance Network","IronPeak","ISU",
  "Join the Brokers","LTA Marketing Group (LT006)","New Age Underwriters Agency Inc",
  "NowCerts (NO147)","Pacific Crest (PA004)","PIIB",
  "Premier Group (PR196)","Renaissance Alliance","SIAA",
  "Smart Choice","The Agency Collective","TWFG (TW037)","United Agencies",
  "United Valley","Victor",
];
const WORKERS_COMP = [
  "AIG","AmTrust","Clear Spring","CNA","CNA2.0","Cornerstone","Employers","Great American",
  "GUARD","ICW Group","LIBERTYMUTUAL","Pie","Travelers","Zenith",
];
const AGENCY_BADGES = [
  "Strategic Partner","VIP","Rising Star",
];

export type AgencyDraft = {
  agencyName: string; agencyCode: string; agencyType: "Retail"|"Wholesale";
  country: string; street: string; city: string; stateVal: string; zip: string;
  sameAddress: boolean;
  mCountry: string; mStreet: string; mCity: string; mState: string; mZip: string;
  status: string; apptDate: string;
  contact: string; email: string;
  bizType: string; taxId: string; website: string;
  phone: string; tollFree: string;
  npn: string;
  licenseNo: string; licenseExp: string;
  eoPolicyNo: string; eoExp: string;
  agencyBill: boolean; directBill: boolean; premiumFin: boolean;
  affiliations: string[]; workersComp: string[];
  badges: string[];
};

function AddAgencyForm({ isDark, onSaveForLater, onDiscard, initialDraft, c, btnGrad, FONT }: {
  isDark: boolean; onSaveForLater: (d: AgencyDraft) => void; onDiscard: () => void;
  initialDraft: AgencyDraft | null;
  c: Record<string, string>; btnGrad: string; FONT: string;
}) {
  const [agencyName, setAgencyName]   = useState(initialDraft?.agencyName ?? "");
  const [agencyCode, setAgencyCode]   = useState(initialDraft?.agencyCode ?? "");
  const [agencyType, setAgencyType]   = useState<"Retail"|"Wholesale">(initialDraft?.agencyType ?? "Retail");
  const [country, setCountry]         = useState(initialDraft?.country ?? "United States of America");
  const [street, setStreet]           = useState(initialDraft?.street ?? "");
  const [city, setCity]               = useState(initialDraft?.city ?? "");
  const [stateVal, setStateVal]       = useState(initialDraft?.stateVal ?? "");
  const [zip, setZip]                 = useState(initialDraft?.zip ?? "");
  const [sameAddress, setSameAddress] = useState(initialDraft?.sameAddress ?? true);
  const [mCountry, setMCountry]       = useState(initialDraft?.mCountry ?? "United States of America");
  const [mStreet, setMStreet]         = useState(initialDraft?.mStreet ?? "");
  const [mCity, setMCity]             = useState(initialDraft?.mCity ?? "");
  const [mState, setMState]           = useState(initialDraft?.mState ?? "");
  const [mZip, setMZip]               = useState(initialDraft?.mZip ?? "");
  const [status, setStatus]           = useState(initialDraft?.status ?? "Appointed");
  const [apptDate, setApptDate]       = useState(initialDraft?.apptDate ?? "03/24/2026");
  const [contact, setContact]         = useState(initialDraft?.contact ?? "");
  const [email, setEmail]             = useState(initialDraft?.email ?? "");
  const [bizType, setBizType]         = useState(initialDraft?.bizType ?? "");
  const [taxId, setTaxId]             = useState(initialDraft?.taxId ?? "");
  const [website, setWebsite]         = useState(initialDraft?.website ?? "");
  const [phone, setPhone]             = useState(initialDraft?.phone ?? "");
  const [tollFree, setTollFree]       = useState(initialDraft?.tollFree ?? "");
  const [npn] = useState(initialDraft?.npn ?? "");
  const [licenseNo, setLicenseNo]     = useState(initialDraft?.licenseNo ?? "");
  const [licenseExp, setLicenseExp]   = useState(initialDraft?.licenseExp ?? "03/24/2026");
  const [eoPolicyNo, setEoPolicyNo]   = useState(initialDraft?.eoPolicyNo ?? "");
  const [eoExp, setEoExp]             = useState(initialDraft?.eoExp ?? "03/24/2026");
  // NIPR verification (phase 1 Add Agency flow) removed on 2026-11-02.
  // Fields License # / Expiration Date / NPN are back to plain manual
  // entry. Re-add verify + state machine when the Phase 1 NIPR
  // integration ships.
  const [affiliations, setAffiliations] = useState<Set<string>>(new Set(initialDraft?.affiliations ?? ["AAA/ACG (AC364)"]));
  const [workersComp, setWorkersComp]   = useState<Set<string>>(new Set(initialDraft?.workersComp ?? ["AIG"]));
  const [badges, setBadges]             = useState<Set<string>>(new Set(initialDraft?.badges ?? []));

  const [discardConfirmOpen, setDiscardConfirmOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [bizTypeOpen, setBizTypeOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonOpen, setReasonOpen] = useState(false);
  const REASON_OPTIONS = ["Closed", "Sold", "Credit Hold", "Missing Info", "Suspended", "Terminated"];
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  // Save for Later: when the user clicks the button with missing required fields,
  // we flip draftAttempted so inline hints render, and pop a toast.
  const [draftAttempted, setDraftAttempted] = useState(false);
  const [missingDraftToast, setMissingDraftToast] = useState(false);
  // Shown when user clicks Submit but the form is incomplete — offers Save as Draft.
  const [submitIncompleteOpen, setSubmitIncompleteOpen] = useState(false);

  const validators: Record<string, (v: string) => string | null> = {
    email: v => !v ? null : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : "Enter a valid email",
    phone: v => !v ? null : v.replace(/\D/g, "").length === 10 ? null : "Enter a 10-digit phone",
    zip: v => !v ? null : /^\d{5}(-\d{4})?$/.test(v) ? null : "Enter a valid ZIP (5 digits)",
    website: v => !v ? null : /^(https?:\/\/)?([\w-]+\.)+[\w-]+.*$/.test(v) ? null : "Enter a valid URL",
    number: v => !v ? null : /^\d+$/.test(v.replace(/[,\s-]/g, "")) ? null : "Digits only",
  };

  const requiredKeys = new Set([
    "agencyName", "agencyCode",
    "street", "city", "stateVal", "zip",
    "contact", "email",
    "bizType", "taxId", "phone",
    "licenseNo", "eoPolicyNo",
  ]);

  const fieldFormat: Record<string, keyof typeof validators> = {
    email: "email",
    phone: "phone",
    tollFree: "phone",
    zip: "zip",
    mZip: "zip",
    website: "website",
    taxId: "number",
  };

  const getFieldVal = (k: string): string => {
    switch (k) {
      case "agencyName": return agencyName;
      case "agencyCode": return agencyCode;
      case "street": return street;
      case "city": return city;
      case "stateVal": return stateVal;
      case "zip": return zip;
      case "mStreet": return sameAddress ? street : mStreet;
      case "mCity": return sameAddress ? city : mCity;
      case "mState": return sameAddress ? stateVal : mState;
      case "mZip": return sameAddress ? zip : mZip;
      case "contact": return contact;
      case "email": return email;
      case "bizType": return bizType;
      case "taxId": return taxId;
      case "website": return website;
      case "phone": return phone;
      case "tollFree": return tollFree;
      case "licenseNo": return licenseNo;
      case "eoPolicyNo": return eoPolicyNo;
      default: return "";
    }
  };

  const validateKey = (k: string, val?: string): string | null => {
    const v = val !== undefined ? val : getFieldVal(k);
    if (requiredKeys.has(k) && !v.trim()) return "Required";
    const f = fieldFormat[k];
    if (f) return validators[f](v);
    return null;
  };

  const runValidate = (k: string, val: string) => {
    const hasFormat = !!fieldFormat[k];
    if (submitted || errors[k] || (hasFormat && val)) {
      const err = validateKey(k, val);
      setErrors(e => {
        const n = { ...e };
        if (err && (err !== "Required" || submitted)) n[k] = err;
        else delete n[k];
        return n;
      });
    }
  };

  const errorStyleFor = (k: string): React.CSSProperties =>
    errors[k]
      ? { border: `1px solid #EF4444`, background: isDark ? "rgba(239,68,68,0.06)" : "#FEF2F2" }
      : {};

  const handleSubmit = () => {
    const keys = [...requiredKeys, ...Object.keys(fieldFormat)];
    const newErrors: Record<string, string> = {};
    for (const k of keys) {
      const err = validateKey(k);
      if (err) newErrors[k] = err;
    }
    setErrors(newErrors);
    setSubmitted(true);
    if (Object.keys(newErrors).length === 0) {
      // form submission would happen here
    } else {
      // Friendly prompt — invite the user to save as a draft instead.
      setSubmitIncompleteOpen(true);
    }
  };

  const ErrMsg = ({ k, value }: { k: string; value?: string }) => {
    // If a DraftHint will render in place of this error (draft-required field is empty after
    // a Save-for-Later attempt), suppress this message to avoid the redundant duplicate.
    if (value !== undefined && draftAttempted && value.trim().length === 0) return null;
    return errors[k] ? <p className="text-[11px] mt-1" style={{ color: "#EF4444", fontFamily: FONT }}>{errors[k]}</p> : null;
  };

  // Inline hint shown below required fields when the user clicks "Save for Later" without filling them.
  // Hidden once the user starts typing in that field.
  const DraftHint = ({ value }: { value: string }) =>
    draftAttempted && value.trim().length === 0
      ? <p className="text-[11px] mt-1 flex items-center gap-1" style={{ color: "#A614C3", fontFamily: FONT }}>
          <AlertCircle className="w-3 h-3 flex-shrink-0" />Required to save as draft
        </p>
      : null;

  const formatPhone = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 10);
    if (digits.length === 0) return "";
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const collectDraft = (): AgencyDraft => ({
    agencyName, agencyCode, agencyType,
    country, street, city, stateVal, zip,
    sameAddress, mCountry, mStreet, mCity, mState, mZip,
    status, apptDate, contact, email,
    bizType, taxId, website, phone, tollFree,
    npn, licenseNo, licenseExp, eoPolicyNo, eoExp,
    agencyBill: true, directBill: true, premiumFin: true,
    affiliations: Array.from(affiliations), workersComp: Array.from(workersComp),
    badges: Array.from(badges),
  });

  const font = { fontFamily: FONT };

  const inputStyle: React.CSSProperties = {
    fontFamily: FONT, color: c.text, background: c.cardBg,
    border: `1px solid ${c.borderStrong}`, borderRadius: 10,
    padding: "9px 12px", fontSize: 13, outline: "none", width: "100%",
    height: 40, boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: FONT, fontSize: 13, fontWeight: 600, color: c.text, marginBottom: 6, display: "block",
  };
  const selectStyle: React.CSSProperties = {
    ...inputStyle, appearance: "none", cursor: "pointer",
    // Right padding gives text room; chevron sits 12px from the border so it
    // doesn't hug the stroke.
    paddingRight: 32,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
  };

  const Radio = ({ checked, onClick }: { checked: boolean; onClick: () => void }) => (
    <button onClick={onClick} className="flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 transition-all"
      style={{ border: `2px solid ${checked ? "#8B3DD4" : "#D1D5DB"}`, background: "transparent" }}>
      {checked && <div className="w-2.5 h-2.5 rounded-full" style={{ background: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)" }} />}
    </button>
  );

  const Checkbox = ({ checked, onClick }: { checked: boolean; onClick: () => void; color?: string }) => (
    <button onClick={onClick} className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0 transition-all"
      style={{
        border: checked ? "none" : `1.5px solid ${c.borderStrong}`,
        background: checked ? "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)" : c.cardBg,
      }}>
      {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </button>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="mt-8 mb-4 pb-2" style={{ borderBottom: `1px solid ${c.border}` }}>
      <h3 className="text-[15px] font-bold" style={{ ...font, color: c.text }}>{title}</h3>
    </div>
  );

  const AddressBlock = ({ prefix, vals, setters }: {
    prefix: string;
    vals: { country: string; street: string; city: string; state: string; zip: string };
    setters: { country: (v:string)=>void; street: (v:string)=>void; city: (v:string)=>void; state: (v:string)=>void; zip: (v:string)=>void };
  }) => {
    const disabled = prefix === "m" && sameAddress;
    const streetKey = prefix === "m" ? "mStreet" : "street";
    const cityKey = prefix === "m" ? "mCity" : "city";
    const stateKey = prefix === "m" ? "mState" : "stateVal";
    const zipKey = prefix === "m" ? "mZip" : "zip";
    return (
    <div className="space-y-3">
      {/* Row 1: Country | Street */}
      <div className="grid grid-cols-3 gap-6">
        <select value={vals.country} onChange={e => setters.country(e.target.value)}
          autoComplete="country-name"
          style={{ ...selectStyle, opacity: disabled ? 0.5 : 1 }}
          disabled={disabled}>
          <option>United States of America</option><option>Canada</option><option>Mexico</option>
        </select>
        <div>
          <AddressAutocomplete
            value={vals.street}
            onChange={v => { setters.street(v); runValidate(streetKey, v); }}
            onSelect={a => {
              setters.street(a.street);
              if (a.city) setters.city(a.city);
              if (a.state) setters.state(a.state);
              if (a.zip) setters.zip(a.zip);
              if (a.country) setters.country(a.country);
              runValidate(streetKey, a.street);
            }}
            placeholder="Street address"
            containerStyle={{ width: "100%", opacity: disabled ? 0.5 : 1 }}
            inputStyle={{ ...inputStyle, width: "100%", ...errorStyleFor(streetKey) }}
            disabled={disabled}
            dropdownBg={c.cardBg} dropdownText={c.text} dropdownBorder={c.border}
          />
          <ErrMsg k={streetKey} />
        </div>
        <div />
      </div>
      {/* Row 2: City | State + ZIP | (empty) */}
      <div className="grid grid-cols-3 gap-6">
        <div>
          <input value={vals.city}
            onChange={e => { setters.city(e.target.value); runValidate(cityKey, e.target.value); }}
            placeholder="City"
            autoComplete="address-level2"
            style={{ ...inputStyle, opacity: disabled ? 0.5 : 1, ...errorStyleFor(cityKey) }}
            disabled={disabled} />
          <ErrMsg k={cityKey} />
        </div>
        <div>
          <div className="flex gap-4">
            <div style={{ flex: 1 }}>
              <select value={vals.state}
                onChange={e => { setters.state(e.target.value); runValidate(stateKey, e.target.value); }}
                autoComplete="address-level1"
                style={{ ...selectStyle, width: "100%", opacity: disabled ? 0.5 : 1, ...errorStyleFor(stateKey) }}
                disabled={disabled}>
                {["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"].map(s => <option key={s}>{s}</option>)}
              </select>
              <ErrMsg k={stateKey} />
            </div>
            <div style={{ flex: 1 }}>
              <input value={vals.zip}
                onChange={e => { setters.zip(e.target.value); runValidate(zipKey, e.target.value); }}
                onBlur={e => runValidate(zipKey, e.target.value)}
                placeholder="ZIP"
                autoComplete="postal-code"
                style={{ ...inputStyle, width: "100%", opacity: disabled ? 0.5 : 1, ...errorStyleFor(zipKey) }}
                disabled={disabled} />
              <ErrMsg k={zipKey} />
            </div>
          </div>
        </div>
        <div />
      </div>
    </div>
    );
  };

  const mailingVals = sameAddress
    ? { country, street, city, state: stateVal, zip }
    : { country: mCountry, street: mStreet, city: mCity, state: mState, zip: mZip };

  return (
    <div className="flex flex-col flex-1 min-h-0" style={{ fontFamily: FONT }}
      onClick={() => { setStatusOpen(false); setBizTypeOpen(false); setReasonOpen(false); }}>
      {/* Form card + breadcrumb scroll together */}
      <div className="flex-1 overflow-y-auto pr-1">
        {/* Breadcrumb */}
        <div className="pb-2 mb-3 flex items-center gap-2" style={{ marginLeft: -48, marginRight: -48, paddingLeft: 48, paddingRight: 48 }}>
          <button onClick={() => onSaveForLater(collectDraft())} className="flex items-center gap-1.5 transition-all" style={{ color: c.muted }}
            onMouseEnter={e => (e.currentTarget.style.color = c.text)}
            onMouseLeave={e => (e.currentTarget.style.color = c.muted)}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => onSaveForLater(collectDraft())}
            className="text-[13px] transition-colors"
            style={{ color: c.muted, background: "transparent", border: "none", cursor: "pointer" }}
            onMouseEnter={e => (e.currentTarget.style.color = c.text)}
            onMouseLeave={e => (e.currentTarget.style.color = c.muted)}>Back to Admin</button>
          <span style={{ color: c.muted }}>/</span>
          <span className="text-[13px] font-semibold" style={{ color: c.text }}>Add New</span>
        </div>
        <form autoComplete="on" onSubmit={e => e.preventDefault()}>
        <div className="rounded-2xl p-6 mb-6" style={{ background: c.cardBg, border: `1px solid ${c.border}`, maxWidth: 1590 }}>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[18px] font-bold" style={{ ...font, color: c.text }}>Add New Agency Information</h2>
            <button
              onClick={() => {
                // Save for Later requires Name, Code, Contact, and Email. Phone is optional for drafts.
                const missing =
                  agencyName.trim().length === 0 ||
                  agencyCode.trim().length === 0 ||
                  contact.trim().length === 0 ||
                  email.trim().length === 0;
                if (missing) {
                  setDraftAttempted(true);
                  setMissingDraftToast(true);
                  setTimeout(() => setMissingDraftToast(false), 4000);
                  return;
                }
                setDraftAttempted(false);
                onSaveForLater(collectDraft());
              }}
              title="Save this draft for later"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
              style={{ ...font, border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "#E5E7EB"}`, color: c.text }}
              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <Bookmark className="w-3.5 h-3.5" />Save for Later
            </button>
          </div>

          {/* Row 1: Name | Code | Type */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label style={labelStyle}>Agency Name:</label>
              <input value={agencyName}
                onChange={e => { setAgencyName(e.target.value); runValidate("agencyName", e.target.value); }}
                placeholder="Agency name" style={{ ...inputStyle, ...errorStyleFor("agencyName") }} />
              <ErrMsg k="agencyName" value={agencyName} />
              <DraftHint value={agencyName} />
            </div>
            <div>
              <label style={labelStyle}>Agency Code:</label>
              <div className="flex gap-2">
                <input value={agencyCode}
                  onChange={e => { setAgencyCode(e.target.value); runValidate("agencyCode", e.target.value); }}
                  placeholder="Code" style={{ ...inputStyle, flex: 1, ...errorStyleFor("agencyCode") }} />
                <button type="button" onClick={() => setAgencyCode(generateAgencyCode())}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold whitespace-nowrap transition-all"
                  style={{ ...font, border: `1px solid #A855F7`, background: "transparent" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(168,85,247,0.08)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <RefreshCw className="w-3 h-3" style={{ color: "#7C3AED" }} />
                  <span style={isDark ? { color: "#FFFFFF" } : { backgroundImage: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Create Code</span>
                </button>
              </div>
              <ErrMsg k="agencyCode" value={agencyCode} />
              <DraftHint value={agencyCode} />
            </div>
            <div>
              <label style={labelStyle}>Agency Type:</label>
              <div className="flex" style={{ gap: 10 }}>
                {(["Retail","Wholesale"] as const).map(t => {
                  const active = agencyType === t;
                  return (
                    <button key={t} onClick={() => setAgencyType(t)}
                      className="flex items-center gap-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap justify-center transition-all"
                      style={{ ...font, width: 120, height: 40, boxSizing: "border-box",
                        border: active ? "1px solid transparent" : `1px solid ${c.border}`,
                        backgroundColor: active ? undefined : c.cardBg,
                        backgroundImage: active
                          ? `linear-gradient(88.54deg, rgba(92,46,212,0.06) 0.1%, rgba(166,20,195,0.06) 63.88%), linear-gradient(${c.cardBg}, ${c.cardBg}), linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)`
                          : undefined,
                        backgroundOrigin: active ? "padding-box, padding-box, border-box" : undefined,
                        backgroundClip: active ? "padding-box, padding-box, border-box" : undefined,
                      }}>
                      <Radio checked={active} onClick={() => setAgencyType(t)} />
                      {active
                        ? <span style={isDark ? { color: "#FFFFFF" } : { backgroundImage: "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t}</span>
                        : <span style={{ color: c.muted }}>{t}</span>
                      }
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Agency Contact + Email + Phone — placed early so the most-important contact info sits near the top */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label style={labelStyle}>Agency Contact:</label>
              <input value={contact}
                onChange={e => { setContact(e.target.value); runValidate("contact", e.target.value); }}
                placeholder="Contact name" style={{ ...inputStyle, ...errorStyleFor("contact") }} />
              <ErrMsg k="contact" value={contact} />
              <DraftHint value={contact} />
            </div>
            <div>
              <label style={labelStyle}>Email Address:</label>
              <input value={email}
                onChange={e => { setEmail(e.target.value); runValidate("email", e.target.value); }}
                onBlur={e => runValidate("email", e.target.value)}
                placeholder="Email" style={{ ...inputStyle, ...errorStyleFor("email") }} type="email" />
              <ErrMsg k="email" value={email} />
              <DraftHint value={email} />
            </div>
            <div>
              <label style={labelStyle}>Phone Number:</label>
              <input value={phone}
                onChange={e => { const v = formatPhone(e.target.value); setPhone(v); runValidate("phone", v); }}
                onBlur={e => runValidate("phone", e.target.value)}
                placeholder="(000) 000-0000" style={{ ...inputStyle, ...errorStyleFor("phone") }} inputMode="tel" />
              <ErrMsg k="phone" />
            </div>
          </div>

          {/* Mailing Address (primary — the address ITC uses for
              statements / 1099s. Agency Address below can mirror it.) */}
          <div className="mb-4">
            <label style={{ ...labelStyle, marginBottom: 12 }}>Mailing Address:</label>
            <AddressBlock prefix="a" vals={{ country, street, city, state: stateVal, zip }}
              setters={{ country: setCountry, street: setStreet, city: setCity, state: setStateVal, zip: setZip }} />
          </div>

          {/* Agency Address */}
          <div className="mb-6">
            <label style={{ ...labelStyle, marginBottom: 8 }}>Agency Address:</label>
            <div className="flex items-center gap-2 mb-3">
              <Checkbox checked={sameAddress} onClick={() => setSameAddress(p => !p)} />
              <span className="text-[13px] font-semibold" style={{ ...font, color: c.text }}>Same as Mailing Address</span>
            </div>
            <AddressBlock prefix="m" vals={sameAddress ? { country, street, city, state: stateVal, zip } : { country: mCountry, street: mStreet, city: mCity, state: mState, zip: mZip }}
              setters={{ country: setMCountry, street: setMStreet, city: setMCity, state: setMState, zip: setMZip }} />
          </div>

          {/* Status + Appt Date */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label style={labelStyle}>Status:</label>
              <div className="relative" onClick={e => e.stopPropagation()}>
                <button type="button" onClick={() => { setStatusOpen(o => !o); setBizTypeOpen(false); }}
                  className="w-full flex items-center justify-between outline-none"
                  style={{ ...inputStyle, cursor: "pointer" }}>
                  <span style={{ color: status ? c.text : c.muted }}>{status || "Select status"}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${statusOpen ? "rotate-180" : ""}`} style={{ color: c.muted }} />
                </button>
                {statusOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-lg overflow-hidden"
                    style={{ background: c.cardBg, border: `1px solid ${c.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                    {["Appointed", "Unappointed"].map(opt => {
                      const active = status === opt;
                      return (
                      <button key={opt} type="button" onClick={() => { setStatus(opt); setStatusOpen(false); }}
                        className="w-full text-left px-3 py-2 text-[13px] flex items-center justify-between transition-colors"
                        style={{ ...font, color: active ? "#A614C3" : c.text, background: active ? "rgba(168,85,247,0.08)" : "transparent" }}
                        onMouseEnter={e => { if (!active) e.currentTarget.style.background = c.hoverBg; }}
                        onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                        <span>{opt}</span>
                        {active && <svg width="10" height="8" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            {status === "Unappointed" ? (
              <div>
                <label style={labelStyle}>Reason:</label>
                <div className="relative" onClick={e => e.stopPropagation()}>
                  <button type="button" onClick={() => { setReasonOpen(o => !o); setStatusOpen(false); setBizTypeOpen(false); }}
                    className="w-full flex items-center justify-between outline-none"
                    style={{ ...inputStyle, cursor: "pointer" }}>
                    <span style={{ color: reason ? c.text : c.muted }}>{reason || "Select reason"}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${reasonOpen ? "rotate-180" : ""}`} style={{ color: c.muted }} />
                  </button>
                  {reasonOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-lg overflow-hidden"
                      style={{ background: c.cardBg, border: `1px solid ${c.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                      {REASON_OPTIONS.map(opt => {
                        const active = reason === opt;
                        return (
                          <button key={opt} type="button" onClick={() => { setReason(opt); setReasonOpen(false); }}
                            className="w-full text-left px-3 py-2 text-[13px] flex items-center justify-between transition-colors"
                            style={{ ...font, color: active ? "#A614C3" : c.text, background: active ? "rgba(168,85,247,0.08)" : "transparent" }}
                            onMouseEnter={e => { if (!active) e.currentTarget.style.background = c.hoverBg; }}
                            onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                            <span>{opt}</span>
                            {active && <svg width="10" height="8" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <label style={labelStyle}>Appt. Date</label>
                <DatePicker value={apptDate} onChange={setApptDate} inputStyle={inputStyle} c={c as any} btnGrad={btnGrad} font={font} />
              </div>
            )}
            <div />
          </div>

          {/* Business Type | Tax ID */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label style={labelStyle}>Type of Business:</label>
              <div className="relative" onClick={e => e.stopPropagation()}>
                <button type="button" onClick={() => { setBizTypeOpen(o => !o); setStatusOpen(false); }}
                  className="w-full flex items-center justify-between outline-none"
                  style={{ ...inputStyle, cursor: "pointer", ...errorStyleFor("bizType") }}>
                  <span style={{ color: bizType ? c.text : c.muted }}>{bizType || "-Business Type"}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${bizTypeOpen ? "rotate-180" : ""}`} style={{ color: c.muted }} />
                </button>
                {bizTypeOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-lg overflow-hidden"
                    style={{ background: c.cardBg, border: `1px solid ${c.border}`, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
                    {["LLC", "Corporation", "Sole Proprietor", "Partnership"].map(opt => {
                      const active = bizType === opt;
                      return (
                      <button key={opt} type="button" onClick={() => { setBizType(opt); setBizTypeOpen(false); runValidate("bizType", opt); }}
                        className="w-full text-left px-3 py-2 text-[13px] flex items-center justify-between transition-colors"
                        style={{ ...font, color: active ? "#A614C3" : c.text, background: active ? "rgba(168,85,247,0.08)" : "transparent" }}
                        onMouseEnter={e => { if (!active) e.currentTarget.style.background = c.hoverBg; }}
                        onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                        <span>{opt}</span>
                        {active && <svg width="10" height="8" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <ErrMsg k="bizType" />
            </div>
            <div>
              <label style={labelStyle}>Tax ID:</label>
              <input value={taxId}
                onChange={e => { setTaxId(e.target.value); runValidate("taxId", e.target.value); }}
                placeholder="Tax ID" style={{ ...inputStyle, ...errorStyleFor("taxId") }} inputMode="numeric" />
              <ErrMsg k="taxId" />
            </div>
            <div />
          </div>

          {/* License + Expiry + NPN. NIPR verify flow pulled on 2026-11-02 —
              fields are back to plain manual entry; re-add verify + lock
              treatment when the Phase 1 NIPR integration ships. */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label style={labelStyle}>License Number:</label>
              <input value={licenseNo}
                onChange={e => { setLicenseNo(e.target.value); runValidate("licenseNo", e.target.value); }}
                style={{ ...inputStyle, ...errorStyleFor("licenseNo") }} />
              <ErrMsg k="licenseNo" />
            </div>
            <div>
              <label style={labelStyle}>Expiration Date:</label>
              <DatePicker value={licenseExp} onChange={setLicenseExp} inputStyle={inputStyle} c={c as any} btnGrad={btnGrad} font={font} />
            </div>
            <div>
              <label style={labelStyle}>NPN:</label>
              {/* Locked — NPN is never user-typed. Shown read-only here
                  (populated by a backend / NIPR source when wired up). */}
              <div className="relative">
                <input value={npn || "—"} readOnly aria-readonly="true" title="NPN populated by backend / NIPR"
                  style={{ ...inputStyle, paddingRight: 34, background: isDark ? "rgba(255,255,255,0.04)" : "#F9FAFB", color: c.muted, cursor: "not-allowed" }} />
                <Lock className="w-3.5 h-3.5 absolute pointer-events-none" style={{ right: 10, top: "50%", transform: "translateY(-50%)", color: c.muted }} />
              </div>
            </div>
          </div>

          {/* E&O Policy + Expiry */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label style={labelStyle}>E&O Policy #:</label>
              <input value={eoPolicyNo}
                onChange={e => { setEoPolicyNo(e.target.value); runValidate("eoPolicyNo", e.target.value); }}
                style={{ ...inputStyle, ...errorStyleFor("eoPolicyNo") }} />
              <ErrMsg k="eoPolicyNo" />
            </div>
            <div>
              <label style={labelStyle}>Expiration Date:</label>
              <DatePicker value={eoExp} onChange={setEoExp} inputStyle={inputStyle} c={c as any} btnGrad={btnGrad} font={font} />
            </div>
            <div />
          </div>

          {/* Toll Free Number + Website Url */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <label style={labelStyle}>Toll Free Number:</label>
              <input value={tollFree}
                onChange={e => { const v = formatPhone(e.target.value); setTollFree(v); runValidate("tollFree", v); }}
                onBlur={e => runValidate("tollFree", e.target.value)}
                placeholder="(000) 000-0000" style={{ ...inputStyle, ...errorStyleFor("tollFree") }} inputMode="tel" />
              <ErrMsg k="tollFree" />
            </div>
            <div>
              <label style={labelStyle}>Website Url:</label>
              <input value={website}
                onChange={e => { setWebsite(e.target.value); runValidate("website", e.target.value); }}
                onBlur={e => runValidate("website", e.target.value)}
                placeholder="https://" style={{ ...inputStyle, ...errorStyleFor("website") }} />
              <ErrMsg k="website" />
            </div>
            <div />
          </div>

          {/* Affiliations */}
          <SectionHeader title="Affiliations" />
          <div className="grid grid-cols-4 gap-x-6 gap-y-3">
            {AFFILIATIONS.map(aff => (
              <label key={aff} className="flex items-center gap-2.5 cursor-pointer select-none">
                <div className="flex-shrink-0">
                  <Checkbox checked={affiliations.has(aff)} onClick={() => setAffiliations(prev => { const s = new Set(prev); s.has(aff) ? s.delete(aff) : s.add(aff); return s; })} color="#73C9B7" />
                </div>
                <span className="text-[12px]" style={{ ...font, color: c.text }}>{aff}</span>
              </label>
            ))}
          </div>

          {/* Direct Appointments */}
          <SectionHeader title="Direct Appointments" />
          <p className="text-[12px] mb-3" style={{ ...font, color: c.muted }}>Workers Compensation</p>
          <div className="grid grid-cols-4 gap-x-6 gap-y-3 mb-4">
            {WORKERS_COMP.map(w => (
              <label key={w} className="flex items-center gap-2.5 cursor-pointer select-none">
                <Checkbox checked={workersComp.has(w)} onClick={() => setWorkersComp(prev => { const s = new Set(prev); s.has(w) ? s.delete(w) : s.add(w); return s; })} color="#73C9B7" />
                <span className="text-[12px]" style={{ ...font, color: c.text }}>{w}</span>
              </label>
            ))}
          </div>

          {/* Tags */}
          <SectionHeader title="Tags" />
          <p className="text-[12px] mb-3" style={{ ...font, color: c.muted }}>Shown on the Agency Status card. Pick any that apply.</p>
          <div className="grid grid-cols-4 gap-x-6 gap-y-3 mb-4">
            {AGENCY_BADGES.map(b => {
              const checked = badges.has(b);
              return (
                <label key={b} className="flex items-center gap-2.5 cursor-pointer select-none">
                  <Checkbox checked={checked} onClick={() => setBadges(prev => { const s = new Set(prev); s.has(b) ? s.delete(b) : s.add(b); return s; })} color="#73C9B7" />
                  <span className="inline-flex items-center justify-center rounded-full whitespace-nowrap"
                    style={{ background: checked ? (isDark ? "rgba(168,85,247,0.22)" : "rgba(168,85,247,0.10)") : (isDark ? "rgba(255,255,255,0.04)" : "#F3F4F6"), padding: "3px 10px" }}>
                    {checked ? (
                      <span style={{ backgroundImage: isDark ? "linear-gradient(88.54deg, #A855F7 0.1%, #D946EF 63.88%)" : "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)", backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: 11, fontWeight: 600, lineHeight: "16px" }}>{b}</span>
                    ) : (
                      <span style={{ color: c.muted, fontSize: 11, fontWeight: 600, lineHeight: "16px" }}>{b}</span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Footer buttons — inside the card so they share width and don't float to the screen edges */}
          <div className="flex items-center justify-between" style={{ marginTop: 36, paddingTop: 28, paddingBottom: 8, borderTop: `1px solid ${c.border}` }}>
            <button onClick={() => setDiscardConfirmOpen(true)}
              className="px-6 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
              style={{ ...font, border: `1px solid ${c.borderStrong}`, color: c.text, background: "transparent" }}
              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              Discard
            </button>
            <button
              onClick={() => handleSubmit()}
              className="text-[13px] font-semibold text-white transition-all"
              style={{
                ...font,
                background: btnGrad,
                padding: "10px 24px",
                borderRadius: "5.58px",
                cursor: "pointer",
              }}
              onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.10)")}
              onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
              Submit
            </button>
          </div>

        </div>
        </form>
      </div>
      {missingDraftToast && (
        <div className="fixed top-[68px] right-6 z-50 flex items-start gap-3"
          style={{ background: c.cardBg, border: `1px solid ${c.border}`, borderRadius: 12, padding: "12px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.10)", minWidth: 320, maxWidth: 400, fontFamily: FONT }}>
          <span className="flex items-center justify-center flex-shrink-0"
            style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(166,20,195,0.08)", marginTop: 1 }}>
            <AlertCircle className="w-4 h-4" style={{ color: "#A614C3" }} />
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold" style={{ color: c.text }}>Can&apos;t save draft yet</div>
            <div className="text-[12px] mt-0.5" style={{ color: c.muted, lineHeight: "16px" }}>
              Fill in Agency Name, Code, Contact, and Email first.
            </div>
          </div>
          <button onClick={() => setMissingDraftToast(false)}
            className="flex-shrink-0 transition-colors"
            style={{ background: "transparent", border: "none", color: c.muted, cursor: "pointer", padding: 2 }}
            aria-label="Dismiss">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      {submitIncompleteOpen && (() => {
        // Per-field status — Phone Number is NOT required for save-as-draft.
        const fields: { label: string; value: string }[] = [
          { label: "Agency Name", value: agencyName },
          { label: "Agency Code", value: agencyCode },
          { label: "Agency Contact", value: contact },
          { label: "Email Address", value: email },
        ];
        const canSaveDraft = fields.every(f => f.value.trim().length > 0);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
            onClick={() => setSubmitIncompleteOpen(false)}
            style={{ background: "rgba(0,0,0,0.45)" }}>
            <div className="w-[440px] rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}
              style={{ background: c.cardBg, border: `1px solid ${c.border}`, fontFamily: FONT }}>
              {/* Header */}
              <div className="flex items-start justify-between px-6 pt-5 pb-3"
                style={{ borderBottom: `1px solid ${c.border}` }}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex items-center justify-center flex-shrink-0"
                    style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(166,20,195,0.08)" }}>
                    <AlertCircle className="w-[18px] h-[18px]" style={{ color: "#A614C3" }} strokeWidth={1.75} />
                  </span>
                  <h3 className="text-[16px] font-bold" style={{ color: c.text }}>Form not yet complete</h3>
                </div>
                <button onClick={() => setSubmitIncompleteOpen(false)}
                  className="flex-shrink-0 transition-colors"
                  style={{ background: "transparent", border: "none", color: c.muted, cursor: "pointer", padding: 2, marginLeft: 12 }}
                  aria-label="Close">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 pt-4 pb-5">
                <p className="text-[13px]" style={{ color: c.muted, lineHeight: "18px" }}>
                  Some required fields are still empty.
                  {canSaveDraft
                    ? " You can save this as a draft and finish later."
                    : <> To save as a draft, fill in <span style={{ color: c.text, fontWeight: 600 }}>Agency Name</span>, <span style={{ color: c.text, fontWeight: 600 }}>Code</span>, <span style={{ color: c.text, fontWeight: 600 }}>Contact</span>, and <span style={{ color: c.text, fontWeight: 600 }}>Email</span>.</>}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 px-6 pb-5 pt-2">
                <button onClick={() => setSubmitIncompleteOpen(false)}
                  className="px-4 py-2 rounded-lg text-[12px] font-medium transition-colors"
                  style={{ ...font, border: `1px solid ${c.border}`, color: c.text, background: "transparent", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  Continue Editing
                </button>
                {canSaveDraft && (
                  <button onClick={() => { setSubmitIncompleteOpen(false); onSaveForLater(collectDraft()); }}
                    className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-all"
                    style={{ ...font, background: btnGrad, border: "none", cursor: "pointer" }}>
                    Save as Draft
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}
      {discardConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={() => setDiscardConfirmOpen(false)}
          style={{ background: "rgba(0,0,0,0.45)" }}>
          <div className="w-[420px] rounded-2xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}
            style={{ background: c.cardBg, border: `1px solid ${c.border}`, fontFamily: FONT }}>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(239,68,68,0.10)" }}>
                <X className="w-6 h-6" style={{ color: "#EF4444" }} />
              </div>
              <div>
                <h3 className="text-[16px] font-bold mb-1" style={{ color: c.text }}>Discard this draft?</h3>
                <p className="text-[12px] leading-relaxed" style={{ color: c.muted }}>
                  Your progress will be lost and can&apos;t be recovered.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDiscardConfirmOpen(false)}
                className="px-4 py-2 rounded-lg text-[12px] font-medium transition-all"
                style={{ border: `1px solid ${c.borderStrong}`, color: c.text, background: "transparent" }}
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                Keep editing
              </button>
              <button onClick={() => { setDiscardConfirmOpen(false); onDiscard(); }}
                className="px-4 py-2 rounded-lg text-[12px] font-semibold text-white transition-colors"
                style={{ background: "#EF4444" }}>
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function Agencies({ isDark, clientMode = false, initialTab, pageTitleOverride, spotlightUsers = false, onSpotlightConsumed, spotlightActive = false, onSpotlightDismiss, teamSetupPending = false, onOpenTeamSetup, onCompleteTeamSetup, onStartImpersonation }: { isDark: boolean; clientMode?: boolean; initialTab?: DetailTab; pageTitleOverride?: string; spotlightUsers?: boolean; onSpotlightConsumed?: () => void; spotlightActive?: boolean; onSpotlightDismiss?: () => void; teamSetupPending?: boolean; onOpenTeamSetup?: () => void; onCompleteTeamSetup?: () => void; onStartImpersonation?: (payload: { userName: string; userEmail: string; agencyName: string; agencyCode: string }) => void }) {
  const [search, setSearch]           = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("All");
  // Per-tab card-selection state — used to visually pin the active stat card
  // on the Users / Affiliations tabs. Not yet wired to actual table filtering
  // (no matching filter state in the mock); click just toggles the visual.
  const [usersStatKey, setUsersStatKey] = useState<"All" | "Active" | "Inactive" | "Admins">("All");
  const [affStatKey,   setAffStatKey]   = useState<"All" | "New" | "Appointed" | "Unappointed">("All");
  const [sortKey, setSortKey]         = useState<SortKey>(null);
  const [sortDir, setSortDir]         = useState<SortDir>("asc");
  const [page, setPage]               = useState(1);
  const [addOpen, setAddOpen]         = useState(false);
  const [perPage, setPerPage]         = useState(10);
  const [perPageOpen, setPerPageOpen] = useState(false);
  const [tab, setTab]                 = useState<TabKey>("agencies");
  const [selectedAgency, setSelectedAgency] = useState<AgencyDetail | null>(null);
  const [selectedAgencyTab, setSelectedAgencyTab] = useState<DetailTab | undefined>(undefined);
  // ITC records lifted here so edits from the Accounting tab persist across
  // detail-view navigation within this Agencies module instance.
  const [itcRecords, setItcRecords] = useState<Record<string, ITCRecord | null>>(INITIAL_ITC_RECORDS);
  const [stars, setStars]             = useState<Set<string>>(
    new Set(mockAgencies.filter(a => a.isStarred).map(a => a.id))
  );
  const [starLimitToast, setStarLimitToast] = useState(false);
  type DraftEntry = { id: string; draft: AgencyDraft; savedAt: number };
  const [agencyDrafts, setAgencyDrafts] = useState<DraftEntry[]>([]);
  // When set, the AddAgencyForm is editing this specific draft — Save replaces it instead of inserting a new entry.
  const [resumingDraftId, setResumingDraftId] = useState<string | null>(null);
  const [resumeDraftOpen, setResumeDraftOpen] = useState(false);
  const [saveForLaterToast, setSaveForLaterToast] = useState(false);
  const [resumeFromDraft, setResumeFromDraft] = useState(false);
  const [selectedAff, setSelectedAff] = useState<string | null>(null);
  const [allUsersJobFilter, setAllUsersJobFilter] = useState<Set<string>>(new Set());
  const [allUsersJobOpen, setAllUsersJobOpen] = useState(false);
  const [allUsersJobSearch, setAllUsersJobSearch] = useState("");
  const [viewOpen, setViewOpen] = useState(false);
  const [usersHiddenCols, setUsersHiddenCols] = useState<Set<string>>(new Set());
  const [agenciesHiddenCols, setAgenciesHiddenCols] = useState<Set<string>>(new Set());
  const USERS_COLS: Array<{ key: string; label: string }> = [
    { key: "admin",    label: "Admin"     },
    { key: "jobTitle", label: "Job title" },
    { key: "email",    label: "Email"     },
    { key: "phone",    label: "Phone"     },
    { key: "ext",      label: "Ext"       },
    { key: "agency",   label: "Agency"    },
    { key: "status",   label: "Status"    },
  ];
  const AGENCIES_COLS: Array<{ key: string; label: string }> = [
    { key: "code",       label: "Agency Code"   },
    { key: "location",   label: "Location"      },
    { key: "aff1",       label: "Affiliation 1" },
    { key: "aff2",       label: "Affiliation 2" },
    { key: "aff3",       label: "Affiliation 3" },
    { key: "totalUsers", label: "Total User"    },
    { key: "lastLogin",  label: "Last Login"    },
    { key: "status",     label: "Status"        },
  ];
  // Affiliations tab uses a *visible* set instead of *hidden* — the table has a small default set
  // of columns plus optional extras the user can add (e.g. Phone, Email, Contact Name).
  const AFFILIATIONS_COLS: Array<{ key: string; label: string }> = [
    { key: "code",       label: "Agency Code"   },
    { key: "location",   label: "Location"      },
    { key: "status",     label: "Status"        },
    { key: "lastLogin",  label: "Last Login"    },
    { key: "contact",    label: "Contact Name"  },
    { key: "phone",      label: "Phone"         },
    { key: "email",      label: "Email"         },
    { key: "totalUsers", label: "Total User"    },
  ];
  const AFF_DEFAULT_VISIBLE = ["code", "location", "status", "lastLogin"];
  const [affVisibleCols, setAffVisibleCols] = useState<Set<string>>(new Set(AFF_DEFAULT_VISIBLE));
  const [affListFilter, setAffListFilter] = useState<Set<string>>(new Set());
  const [affListFilterOpen, setAffListFilterOpen] = useState(false);
  const [affListFilterSearch, setAffListFilterSearch] = useState("");
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "xlsx">("csv");
  const [exportFormatMenuOpen, setExportFormatMenuOpen] = useState(false);
  // Export-dialog-only state. Lazily initialized when the dialog is first opened.
  const AGENCIES_EXPORT_COLS_BASIC = ["code", "name", "city", "state", "aff1", "aff2", "aff3", "totalUsers", "lastLogin", "status"];
  const AGENCIES_EXPORT_COLS_CONTACTS = ["code", "name", "contact", "address", "city", "state", "zip", "phone", "email", "aff1", "aff2", "aff3", "totalUsers", "lastLogin", "status"];
  const [exportSelectedCols, setExportSelectedCols] = useState<Set<string>>(new Set(AGENCIES_EXPORT_COLS_CONTACTS));
  const [exportAffs, setExportAffs] = useState<Set<string>>(new Set());
  const [exportAffSearch, setExportAffSearch] = useState("");
  type ExportScope = "all" | "master" | "excludeMaster" | "withAffs";
  const [exportScope, setExportScope] = useState<ExportScope>("all");
  const [locationFilter, setLocationFilter] = useState<Set<string>>(new Set());
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [affiliationFilter, setAffiliationFilter] = useState<Set<string>>(new Set());
  const [affiliationOpen, setAffiliationOpen] = useState<number | null>(null);
  const [affiliationSearch, setAffiliationSearch] = useState("");
  const [agencyNameFilter, setAgencyNameFilter] = useState<Set<string>>(new Set());
  type ActivityFilter = "all" | "new" | "active" | "dormant";
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>("all");
  const [activityFilterOpen, setActivityFilterOpen] = useState(false);
  const [agencyNameOpen, setAgencyNameOpen] = useState(false);
  const [agencyNameSearch, setAgencyNameSearch] = useState("");
  const [allUsersSortDir, setAllUsersSortDir] = useState<"asc"|"desc">("asc");
  const ALL_JOB_TITLES = ["Principal", "Producer", "CSR", "Accounting", "Account Manager"];
  // Lifted from AgencyDetailView so deactivations propagate to the All Users tab in the main view.
  const [inactiveUserIds, setInactiveUserIds] = useState<Set<string>>(new Set());
  const [statusInactiveUserIds, setStatusInactiveUserIds] = useState<Set<string>>(new Set());
  const [removedUserIds,  setRemovedUserIds]  = useState<Set<string>>(new Set());
  const [allUsersShowInactive, setAllUsersShowInactive] = useState(false);
  // Book Roll state: maps source agency id to the target agency code + effective date.
  // Used to flip the source agency's display to Unappointed (reason: Sold, soldTo: <code>).
  const [bookRolled, setBookRolled] = useState<Map<string, { targetCode: string; date: string }>>(new Map());

  // Whenever the search query changes, collapse the "Show inactive" toggle so each new search
  // starts from the default Active-only view. Users must explicitly click "Show inactive" again.
  useEffect(() => {
    setAllUsersShowInactive(false);
  }, [search]);

  // Auto-switch tab when the search box has a query that matches in a different tab.
  // Stays on the current tab if it has any match; otherwise jumps to the first tab that does.
  useEffect(() => {
    const q = search.trim().toLowerCase();
    if (!q) return;
    const agencyById = new Map(allAgencies.map(a => [a.id, a]));
    const agenciesMatches = allAgencies.some(a =>
      a.name.toLowerCase().includes(q)
      || a.code.toLowerCase().includes(q)
      || a.city.toLowerCase().includes(q)
      || a.state.toLowerCase().includes(q)
    );
    const usersMatches = mockAgencyUsers.some(u =>
      u.name.toLowerCase().includes(q)
      || u.email.toLowerCase().includes(q)
      || u.jobTitle.toLowerCase().includes(q)
      || (agencyById.get(u.agencyId)?.name.toLowerCase().includes(q) ?? false)
    );
    const affMatches = Array.from(new Set(allAgencies.flatMap(a => a.affiliations))).some(n =>
      n.toLowerCase().includes(q)
    );
    const currentHasMatches = tab === "agencies" ? agenciesMatches : tab === "users" ? usersMatches : affMatches;
    if (currentHasMatches) return;
    if (agenciesMatches) setTab("agencies");
    else if (usersMatches) setTab("users");
    else if (affMatches) setTab("affiliations");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  /* colours */
  const c = {
    text:        isDark ? "#F9FAFB" : "#1F2937",
    muted:       isDark ? "#8B8FA8" : "#6B7280",
    border:      isDark ? "rgba(255,255,255,0.12)" : "#E5E7EB",
    borderStrong:isDark ? "rgba(255,255,255,0.18)" : "#D1D5DB",
    cardBg:      isDark ? "#1E2240" : "#ffffff",
    hoverBg:     isDark ? "rgba(255,255,255,0.04)" : "#F9FAFB",
    bg:          isDark ? "#0F1120" : "#ffffff",
    teal:        "#73C9B7",
  };
  const font = { fontFamily: FONT };
  const btnGrad = isDark
    ? "radial-gradient(171.32% 99.33% at 33.13% -9%, #282550 0%, #191735 55.82%, rgba(0,0,0,0.3) 74%, rgba(0,0,0,0) 100%), linear-gradient(88.34deg, #5C2ED4 0.11%, #A614C3 63.8%)"
    : "linear-gradient(90deg,#5C2ED4 0%,#A614C3 65%)";

  /* filtered + sorted list */
  const allAgencies = mockAgencies.map(a => ({ ...a, isStarred: stars.has(a.id) }));
  const filtered = allAgencies.filter(a => {
    if (filterStatus === "Starred")     return a.isStarred;
    if (filterStatus === "Appointed")   return a.status === "Appointed";
    if (filterStatus === "Unappointed") return a.status === "Unappointed";
    if (filterStatus === "NeedsAction") return countPendingItcUpdates(getDetail(a), itcRecords[a.code] ?? null) > 0;
    return true;
  }).filter(a => {
    if (locationFilter.size === 0) return true;
    return locationFilter.has(a.state);
  }).filter(a => {
    if (affiliationFilter.size === 0) return true;
    return a.affiliations.some(aff => affiliationFilter.has(aff));
  }).filter(a => {
    if (agencyNameFilter.size === 0) return true;
    return agencyNameFilter.has(a.name);
  }).filter(a => {
    if (activityFilter === "all") return true;
    const s = getAgencyTimeStatus(getDetail(a).apptDate, a.lastLogin);
    if (activityFilter === "new")     return s === "new";
    if (activityFilter === "dormant") return s === "dormant";
    /* active */                       return s === null;
  }).filter(a => {
    if (!search) return true;
    return (
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.code.toLowerCase().includes(search.toLowerCase()) ||
      a.city.toLowerCase().includes(search.toLowerCase()) ||
      a.state.toLowerCase().includes(search.toLowerCase())
    );
  }).sort((a, b) => {
    if (!sortKey) return 0;
    let av = "", bv = "";
    if (sortKey === "name")       { av = a.name;      bv = b.name; }
    if (sortKey === "code")       { av = a.code;      bv = b.code; }
    if (sortKey === "location")   { av = a.city;      bv = b.city; }
    if (sortKey === "status")     { av = a.status;    bv = b.status; }
    if (sortKey === "totalUsers") { return sortDir === "asc" ? a.totalUsers - b.totalUsers : b.totalUsers - a.totalUsers; }
    if (sortKey === "lastLogin")  {
      const ta = new Date(a.lastLogin).getTime();
      const tb = new Date(b.lastLogin).getTime();
      return sortDir === "asc" ? ta - tb : tb - ta;
    }
    return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
  });

  // Filtered user count for All Users tab pagination
  const filteredUsersCount = (() => {
    if (tab !== "users") return 0;
    const q = search.trim().toLowerCase();
    const agencyById = new Map(allAgencies.map(a => [a.id, a]));
    return mockAgencyUsers
      .filter(u => !q
        || u.name.toLowerCase().includes(q)
        || u.email.toLowerCase().includes(q)
        || u.jobTitle.toLowerCase().includes(q)
        || (agencyById.get(u.agencyId)?.name.toLowerCase().includes(q) ?? false))
      .filter(u => allUsersJobFilter.size === 0 || allUsersJobFilter.has(u.jobTitle))
      .length;
  })();
  const totalPagesAgencies = Math.max(1, Math.ceil(filtered.length / perPage));
  const totalPagesUsers = Math.max(1, Math.ceil(filteredUsersCount / perPage));
  const totalPages = tab === "users" ? totalPagesUsers : totalPagesAgencies;
  const paginated  = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleStar = (id: string) => {
    setStars(prev => {
      const s = new Set(prev);
      if (s.has(id)) { s.delete(id); } else if (s.size < 6) { s.add(id); } else { setStarLimitToast(true); setTimeout(() => setStarLimitToast(false), 3000); }
      return s;
    });
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const escapeCsv = (v: string | number | undefined): string => {
    const s = (v ?? "").toString();
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const downloadCsv = (filename: string, headers: string[], rows: string[]) => {
    const csv = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  // Compute export data (headers + 2D row values) for the current tab. Used by both the export
  // dialog preview and the download flow.
  const getExportData = (): { headers: string[]; rows: string[][]; filename: string } | null => {
    const stamp = new Date().toISOString().slice(0, 10);
    const safe = (s: string) => s.replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^_+|_+$/g, "");
    if (tab === "affiliations") {
      const affMap = new Map<string, Agency[]>();
      for (const a of allAgencies) for (const aff of a.affiliations) {
        if (!affMap.has(aff)) affMap.set(aff, []);
        affMap.get(aff)!.push(a);
      }
      const q = search.trim().toLowerCase();
      const allRows = Array.from(affMap.entries())
        .map(([name, ags]) => ({ name, agencies: ags }))
        .filter(r => !q || r.name.toLowerCase().includes(q) || r.agencies.some(a => a.name.toLowerCase().includes(q)))
        .sort((a, b) => a.name.localeCompare(b.name));
      const affRows = affListFilter.size === 0 ? allRows : allRows.filter(r => affListFilter.has(r.name));
      const multiMode = affListFilter.size >= 2;
      let target: { name: string; agencies: Agency[] } | null;
      if (multiMode) {
        const deduped = Array.from(new Map(affRows.flatMap(r => r.agencies).map(a => [a.id, a])).values())
          .sort((a, b) => a.name.localeCompare(b.name));
        target = { name: Array.from(affListFilter).sort().join(" + "), agencies: deduped };
      } else {
        const activeAff = selectedAff && affRows.find(r => r.name === selectedAff)
          ? selectedAff
          : (affRows[0]?.name ?? null);
        target = activeAff ? affRows.find(r => r.name === activeAff)! : null;
      }
      if (!target) return null;
      const exportScope = multiMode ? affListFilter : new Set([target.name]);
      const otherAffs = (a: Agency) => a.affiliations.filter(x => !exportScope.has(x));
      const allCols: Array<{ key: string; label: string; get: (a: Agency) => string }> = [
        { key: "code",       label: "Agency Code",         get: a => a.code },
        { key: "name",       label: "Name",                get: a => a.name },
        { key: "otherAff1",  label: "Other Affiliation 1", get: a => otherAffs(a)[0] || "" },
        { key: "otherAff2",  label: "Other Affiliation 2", get: a => otherAffs(a)[1] || "" },
        { key: "contact",    label: "Contact Name",        get: a => getDetail(a).contact || "" },
        { key: "address",    label: "Address",             get: a => getDetail(a).street || "" },
        { key: "city",       label: "City",                get: a => a.city },
        { key: "state",      label: "State",               get: a => a.state },
        { key: "zip",        label: "ZIP Code",            get: a => getDetail(a).zip || "" },
        { key: "phone",      label: "Phone",               get: a => getDetail(a).phone || "" },
        { key: "email",      label: "Email",               get: a => getDetail(a).contactEmail || "" },
        { key: "totalUsers", label: "Total User",          get: a => String(a.totalUsers) },
        { key: "lastLogin",  label: "Last Login",          get: a => a.lastLogin },
        { key: "status",     label: "Status",              get: a => a.status },
        { key: "location",   label: "Location",            get: a => `${a.city || ""}${a.state ? `, ${a.state}` : ""}` },
      ];
      // Map each export column to a "parent" toggleable table column (or "always" for
      // primary identifier columns that should never be dropped). Hiding "location" in the
      // table also hides its derived breakouts (address/city/state/zip) in the export.
      const exportToParent: Record<string, string> = {
        name: "always", otherAff1: "always", otherAff2: "always",
        code: "code",
        contact: "contact",
        address: "location", city: "location", state: "location", zip: "location",
        location: "location",
        phone: "phone",
        email: "email",
        totalUsers: "totalUsers",
        lastLogin: "lastLogin",
        status: "status",
      };
      const isExportVisible = (key: string) => {
        const parent = exportToParent[key];
        if (!parent) return false;
        if (parent === "always") return true;
        return affVisibleCols.has(parent);
      };
      const visible = allCols.filter(col => isExportVisible(col.key));
      return {
        headers: visible.map(c => c.label),
        rows: target.agencies.map(a => visible.map(c => c.get(a))),
        filename: `affiliation-${safe(target.name)}-${stamp}`,
      };
    }
    if (tab === "users") {
      const q = search.trim().toLowerCase();
      const agencyById = new Map(allAgencies.map(a => [a.id, a]));
      const userRows = mockAgencyUsers
        .filter(u => !q
          || u.name.toLowerCase().includes(q)
          || u.email.toLowerCase().includes(q)
          || u.jobTitle.toLowerCase().includes(q)
          || (agencyById.get(u.agencyId)?.name.toLowerCase().includes(q) ?? false))
        .filter(u => allUsersJobFilter.size === 0 || allUsersJobFilter.has(u.jobTitle))
        .sort((a, b) => allUsersSortDir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
      const allCols: Array<{ key: string; label: string; get: (u: typeof mockAgencyUsers[number]) => string }> = [
        { key: "name",     label: "Name",      get: u => u.name },
        { key: "admin",    label: "Admin",     get: u => u.isAdmin ? "Yes" : "No" },
        { key: "jobTitle", label: "Job title", get: u => u.jobTitle },
        { key: "email",    label: "Email",     get: u => u.email },
        { key: "phone",    label: "Phone",     get: u => u.phone },
        { key: "ext",      label: "Ext",       get: u => u.ext || "" },
        { key: "agency",   label: "Agency",    get: u => agencyById.get(u.agencyId)?.name ?? "" },
        { key: "status",   label: "Status",    get: u => (inactiveUserIds.has(u.id) || statusInactiveUserIds.has(u.id)) ? "Inactive" : "Active" },
      ];
      const visible = allCols.filter(col => !usersHiddenCols.has(col.key));
      return {
        headers: visible.map(c => c.label),
        rows: userRows.map(u => visible.map(c => c.get(u))),
        filename: `users-${stamp}`,
      };
    }
    // agencies tab
    const allCols: Array<{ key: string; label: string; get: (a: Agency) => string }> = [
      { key: "code",       label: "Agency Code",   get: a => a.code },
      { key: "name",       label: "Name",          get: a => a.name },
      { key: "contact",    label: "Contact Name",  get: a => getDetail(a).contact || "" },
      { key: "address",    label: "Address",       get: a => getDetail(a).street || "" },
      { key: "city",       label: "City",          get: a => a.city },
      { key: "state",      label: "State",         get: a => a.state },
      { key: "zip",        label: "ZIP Code",      get: a => getDetail(a).zip || "" },
      { key: "phone",      label: "Phone",         get: a => getDetail(a).phone || "" },
      { key: "email",      label: "Email",         get: a => getDetail(a).contactEmail || "" },
      { key: "aff1",       label: "Affiliation 1", get: a => a.affiliations[0] || "" },
      { key: "aff2",       label: "Affiliation 2", get: a => a.affiliations[1] || "" },
      { key: "aff3",       label: "Affiliation 3", get: a => a.affiliations[2] || "" },
      { key: "totalUsers", label: "Total User",    get: a => String(a.totalUsers) },
      { key: "lastLogin",  label: "Last Login",    get: a => a.lastLogin },
      { key: "status",     label: "Status",        get: a => a.status },
    ];
    // The export dialog drives column selection + scope + affiliation row filter.
    // `filtered` already reflects table-level filters (search, status, affiliations, etc).
    // Master Agencies: we use `isStarred` as the master/strategic-partner proxy in this mock data.
    const visible = allCols.filter(col => exportSelectedCols.has(col.key));
    const scopeFiltered = filtered.filter(a => {
      if (exportScope === "master") return a.isStarred;
      if (exportScope === "excludeMaster") return !a.isStarred;
      if (exportScope === "withAffs") return a.affiliations.length > 0;
      return true;
    });
    const filteredByAff = exportAffs.size === 0
      ? scopeFiltered
      : scopeFiltered.filter(a => a.affiliations.some(aff => exportAffs.has(aff)));
    return {
      headers: visible.map(c => c.label),
      rows: filteredByAff.map(a => visible.map(c => c.get(a))),
      filename: `agencies-${stamp}`,
    };
  };
  const downloadXlsx = (filename: string, headers: string[], rows: string[][]) => {
    // Minimal XLSX-like download via TSV (Excel opens it cleanly)
    const tsv = [headers.join("\t"), ...rows.map(r => r.map(v => v.replace(/\t/g, " ")).join("\t"))].join("\n");
    const blob = new Blob(["\uFEFF" + tsv], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const runExport = () => {
    const data = getExportData();
    if (!data) return;
    if (exportFormat === "xlsx") {
      downloadXlsx(`${data.filename}.xls`, data.headers, data.rows);
    } else {
      const csvRows = data.rows.map(r => r.map(escapeCsv).join(","));
      downloadCsv(`${data.filename}.csv`, data.headers, csvRows);
    }
    setExportDialogOpen(false);
  };
  const exportAgencies = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    const safe = (s: string) => s.replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^_+|_+$/g, "");
    if (tab === "affiliations") {
      // Export agencies in the currently selected affiliation, or the union when 2+ are filter-selected.
      const affMap = new Map<string, Agency[]>();
      for (const a of allAgencies) for (const aff of a.affiliations) {
        if (!affMap.has(aff)) affMap.set(aff, []);
        affMap.get(aff)!.push(a);
      }
      const q = search.trim().toLowerCase();
      const allRows = Array.from(affMap.entries())
        .map(([name, ags]) => ({ name, agencies: ags }))
        .filter(r => !q || r.name.toLowerCase().includes(q) || r.agencies.some(a => a.name.toLowerCase().includes(q)))
        .sort((a, b) => a.name.localeCompare(b.name));
      const affRows = affListFilter.size === 0 ? allRows : allRows.filter(r => affListFilter.has(r.name));
      const multiMode = affListFilter.size >= 2;
      let target: { name: string; agencies: Agency[] } | null;
      if (multiMode) {
        const deduped = Array.from(new Map(affRows.flatMap(r => r.agencies).map(a => [a.id, a])).values())
          .sort((a, b) => a.name.localeCompare(b.name));
        target = { name: Array.from(affListFilter).sort().join(" + "), agencies: deduped };
      } else {
        const activeAff = selectedAff && affRows.find(r => r.name === selectedAff)
          ? selectedAff
          : (affRows[0]?.name ?? null);
        target = activeAff ? affRows.find(r => r.name === activeAff)! : null;
      }
      if (!target) return;
      // Always export the underlying contact details (Address, City, State, ZIP, Contact Name, Phone, Email).
      // The View dropdown only toggles which agency-summary columns appear.
      // "Other" means the agency's affiliations that aren't part of the current export scope.
      const exportScope = multiMode ? affListFilter : new Set([target.name]);
      const otherAffs = (a: Agency) => a.affiliations.filter(x => !exportScope.has(x));
      const allCols: Array<{ key: string; label: string; get: (a: Agency) => string }> = [
        { key: "code",       label: "Agency Code",         get: a => a.code },
        { key: "name",       label: "Name",                get: a => a.name },
        { key: "otherAff1",  label: "Other Affiliation 1", get: a => otherAffs(a)[0] || "" },
        { key: "otherAff2",  label: "Other Affiliation 2", get: a => otherAffs(a)[1] || "" },
        { key: "contact",    label: "Contact Name", get: a => getDetail(a).contact || "" },
        { key: "address",    label: "Address",      get: a => getDetail(a).street || "" },
        { key: "city",       label: "City",         get: a => a.city },
        { key: "state",      label: "State",        get: a => a.state },
        { key: "zip",        label: "ZIP Code",     get: a => getDetail(a).zip || "" },
        { key: "phone",      label: "Phone",        get: a => getDetail(a).phone || "" },
        { key: "email",      label: "Email",        get: a => getDetail(a).contactEmail || "" },
        { key: "totalUsers", label: "Total User",   get: a => String(a.totalUsers) },
        { key: "lastLogin",  label: "Last Login",   get: a => a.lastLogin },
        { key: "status",     label: "Status",       get: a => a.status },
        { key: "location",   label: "Location",     get: a => `${a.city || ""}${a.state ? `, ${a.state}` : ""}` },
      ];
      // Mirror the preview's visibility map so the downloaded CSV matches what the user sees.
      const exportToParent: Record<string, string> = {
        name: "always", otherAff1: "always", otherAff2: "always",
        code: "code", contact: "contact",
        address: "location", city: "location", state: "location", zip: "location", location: "location",
        phone: "phone", email: "email",
        totalUsers: "totalUsers", lastLogin: "lastLogin", status: "status",
      };
      const isExportVisible = (key: string) => {
        const parent = exportToParent[key];
        if (!parent) return false;
        if (parent === "always") return true;
        return affVisibleCols.has(parent);
      };
      const visibleCols = allCols.filter(col => isExportVisible(col.key));
      const headers = visibleCols.map(c => c.label);
      const rows = target.agencies.map(a => visibleCols.map(c => c.get(a)).map(escapeCsv).join(","));
      downloadCsv(`affiliation-${safe(target.name)}-${stamp}.csv`, headers, rows);
      return;
    }
    if (tab === "users") {
      // Export currently filtered users (search + job-title filter), respecting hidden columns
      const q = search.trim().toLowerCase();
      const agencyById = new Map(allAgencies.map(a => [a.id, a]));
      const userRows = mockAgencyUsers
        .filter(u => !q
          || u.name.toLowerCase().includes(q)
          || u.email.toLowerCase().includes(q)
          || u.jobTitle.toLowerCase().includes(q)
          || (agencyById.get(u.agencyId)?.name.toLowerCase().includes(q) ?? false))
        .filter(u => allUsersJobFilter.size === 0 || allUsersJobFilter.has(u.jobTitle))
        .sort((a, b) => allUsersSortDir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
      const allCols: Array<{ key: string; label: string; get: (u: typeof mockAgencyUsers[number]) => string }> = [
        { key: "name",     label: "Name",      get: u => u.name },
        { key: "admin",    label: "Admin",     get: u => u.isAdmin ? "Yes" : "No" },
        { key: "jobTitle", label: "Job title", get: u => u.jobTitle },
        { key: "email",    label: "Email",     get: u => u.email },
        { key: "phone",    label: "Phone",     get: u => u.phone },
        { key: "ext",      label: "Ext",       get: u => u.ext || "" },
        { key: "agency",   label: "Agency",    get: u => agencyById.get(u.agencyId)?.name ?? "" },
      ];
      const visibleCols = allCols.filter(col => !usersHiddenCols.has(col.key));
      const headers = visibleCols.map(c => c.label);
      const rows = userRows.map(u => visibleCols.map(c => c.get(u)).map(escapeCsv).join(","));
      downloadCsv(`users-${stamp}.csv`, headers, rows);
      return;
    }
    // Always export the underlying contact details (Contact Name, Address, City, State, ZIP, Phone, Email).
    // The visible-column toggle only hides table columns: Code, Location, Affiliation 1/2/3, Total User, Last Login, Status.
    const allCols: Array<{ key: string; label: string; get: (a: Agency) => string }> = [
      { key: "code",       label: "Agency Code",   get: a => a.code },
      { key: "name",       label: "Name",          get: a => a.name },
      { key: "contact",    label: "Contact Name",  get: a => getDetail(a).contact || "" },
      { key: "address",    label: "Address",       get: a => getDetail(a).street || "" },
      { key: "city",       label: "City",          get: a => a.city },
      { key: "state",      label: "State",         get: a => a.state },
      { key: "zip",        label: "ZIP Code",      get: a => getDetail(a).zip || "" },
      { key: "phone",      label: "Phone",         get: a => getDetail(a).phone || "" },
      { key: "email",      label: "Email",         get: a => getDetail(a).contactEmail || "" },
      { key: "aff1",       label: "Affiliation 1", get: a => a.affiliations[0] || "" },
      { key: "aff2",       label: "Affiliation 2", get: a => a.affiliations[1] || "" },
      { key: "aff3",       label: "Affiliation 3", get: a => a.affiliations[2] || "" },
      { key: "totalUsers", label: "Total User",    get: a => String(a.totalUsers) },
      { key: "lastLogin",  label: "Last Login",    get: a => a.lastLogin },
      { key: "status",     label: "Status",        get: a => a.status },
    ];
    // Skip only columns that are togglable from the View dropdown AND currently hidden.
    // Contact details (name/contact/address/city/state/zip/phone/email) are always exported.
    const togglable = new Set(AGENCIES_COLS.map(col => col.key));
    const visibleCols = allCols.filter(col => !(togglable.has(col.key) && agenciesHiddenCols.has(col.key)));
    const headers = visibleCols.map(c => c.label);
    const rows = filtered.map(a => visibleCols.map(c => c.get(a)).map(escapeCsv).join(","));
    downloadCsv(`agencies-${stamp}.csv`, headers, rows);
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    const active = sortKey === col;
    const sub = isDark ? "#6B7280" : "#9CA3AF";
    const upColor   = active && sortDir === "asc"  ? c.text : sub;
    const downColor = active && sortDir === "desc" ? c.text : sub;
    return (
      <span className="inline-flex items-center ml-1 flex-shrink-0" style={{ verticalAlign: "middle", gap: 1 }}>
        <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
          <path d="M3.5 9V2M3.5 2L1.5 4M3.5 2L5.5 4" stroke={upColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
          <path d="M3.5 1V8M3.5 8L1.5 6M3.5 8L5.5 6" stroke={downColor} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    );
  };

  const StatusBadge = ({ status }: { status: Agency["status"] }) => (
    status === "Appointed"
      ? <span className="inline-flex items-center justify-center w-fit"
          style={{ fontFamily: FONT, background: isDark
            ? "linear-gradient(88.54deg, rgba(92,46,212,0.20) 0.1%, rgba(166,20,195,0.20) 63.88%)"
            : "linear-gradient(88.54deg, rgba(92,46,212,0.05) 0.1%, rgba(166,20,195,0.05) 63.88%)", borderRadius: 9999, padding: "3px 10px" }}>
          <span style={{ backgroundImage: isDark
              ? "linear-gradient(88.54deg, #A855F7 0.1%, #D946EF 63.88%)"
              : "linear-gradient(88.54deg, #5C2ED4 0.1%, #A614C3 63.88%)",
            backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent", fontSize: 11, fontWeight: 600, lineHeight: "16px", whiteSpace: "nowrap" }}>
            Appointed
          </span>
        </span>
      : <span className="inline-flex items-center px-[10px] py-[3px] rounded-full w-fit whitespace-nowrap"
          style={{ fontFamily: FONT, color: "#73C9B7", background: isDark ? "rgba(115,201,183,0.22)" : "rgba(115,201,183,0.10)", fontSize: 11, fontWeight: 600, lineHeight: "16px" }}>
          Unappointed
        </span>
  );


  /* Section title — same full-width divider style as Clients */
  const sectionTitle = (
    <div className="flex flex-col justify-center flex-shrink-0 mb-12"
      style={{ height: 71, borderBottom: `0.87px solid ${isDark ? "rgba(255,255,255,0.08)" : "#E5E7EB"}`, marginLeft: -48, marginRight: -48, paddingLeft: 28, paddingRight: 28 }}>
      <h1 className="text-[22px] font-normal" style={{ ...font, color: c.text }}>Agencies</h1>
    </div>
  );

  if (addOpen) {
    return (
      <div className="flex flex-col flex-1 min-h-0">
        {sectionTitle}
        <AddAgencyForm
          isDark={isDark}
          initialDraft={resumingDraftId ? (agencyDrafts.find(e => e.id === resumingDraftId)?.draft ?? null) : null}
          onSaveForLater={(d) => {
            const now = Date.now();
            if (resumingDraftId) {
              setAgencyDrafts(prev => prev.map(e => e.id === resumingDraftId ? { ...e, draft: d, savedAt: now } : e));
            } else {
              const id = `draft-${now}-${Math.random().toString(36).slice(2, 7)}`;
              setAgencyDrafts(prev => [...prev, { id, draft: d, savedAt: now }]);
            }
            setAddOpen(false);
            setResumingDraftId(null);
            setResumeFromDraft(false);
            setSaveForLaterToast(true);
            setTimeout(() => setSaveForLaterToast(false), 2400);
          }}
          onDiscard={() => {
            setAddOpen(false);
            // Discard removes the draft being resumed (if any). Fresh entries are not in the list yet, so nothing to clean up.
            if (resumingDraftId) {
              setAgencyDrafts(prev => prev.filter(e => e.id !== resumingDraftId));
            }
            setResumingDraftId(null);
            setResumeFromDraft(false);
          }}
          c={c} btnGrad={btnGrad} FONT={FONT}
        />
      </div>
    );
  }

  // Admin segment renders this Agencies module with clientMode=true: skip the
  // list/picker entirely and drop straight into a single, read-only AgencyDetailView
  // pinned to mockAgencies[0] (the current user's own agency in the demo).
  if (clientMode) {
    return (
      <AgencyDetailView
        agency={getDetail(mockAgencies[0])}
        isDark={isDark}
        viewMode="client"
        initialTab={initialTab}
        pageTitleOverride={pageTitleOverride}
        onBack={() => { /* no list to go back to */ }}
        c={c}
        btnGrad={btnGrad}
        stars={stars}
        onToggleStar={toggleStar}
        inactiveUserIds={inactiveUserIds}
        setInactiveUserIds={setInactiveUserIds}
        statusInactiveUserIds={statusInactiveUserIds}
        setStatusInactiveUserIds={setStatusInactiveUserIds}
        removedUserIds={removedUserIds}
        setRemovedUserIds={setRemovedUserIds}
        bookRolled={bookRolled}
        setBookRolled={setBookRolled}
        allAgencies={allAgencies}
        itcRecords={itcRecords}
        setItcRecords={setItcRecords}
        spotlightUsers={spotlightUsers}
        onSpotlightConsumed={onSpotlightConsumed}
        spotlightActive={spotlightActive}
        onSpotlightDismiss={onSpotlightDismiss}
        teamSetupPending={teamSetupPending}
        onOpenTeamSetup={onOpenTeamSetup}
        onCompleteTeamSetup={onCompleteTeamSetup}
      />
    );
  }

  if (selectedAgency) {
    return (
      <AgencyDetailView
        agency={selectedAgency}
        isDark={isDark}
        initialTab={selectedAgencyTab}
        itcRecords={itcRecords}
        setItcRecords={setItcRecords}
        onBack={() => { setSelectedAgency(null); setSelectedAgencyTab(undefined); }}
        c={c}
        btnGrad={btnGrad}
        stars={stars}
        onToggleStar={toggleStar}
        inactiveUserIds={inactiveUserIds}
        setInactiveUserIds={setInactiveUserIds}
        statusInactiveUserIds={statusInactiveUserIds}
        setStatusInactiveUserIds={setStatusInactiveUserIds}
        removedUserIds={removedUserIds}
        setRemovedUserIds={setRemovedUserIds}
        bookRolled={bookRolled}
        setBookRolled={setBookRolled}
        allAgencies={allAgencies}
        onNavigateToAgency={(targetCode, tab) => {
          const target = allAgencies.find(a => a.code === targetCode);
          if (!target) return;
          setSelectedAgency(getDetail(target));
          setSelectedAgencyTab(tab);
        }}
        onStartImpersonation={onStartImpersonation}
      />
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0" style={{ fontFamily: FONT }} onClick={() => { setPerPageOpen(false); setViewOpen(false); setAffListFilterOpen(false); setAgencyNameOpen(false); setLocationOpen(false); setAffiliationOpen(null); }}>
      {exportDialogOpen && (() => {
        const data = getExportData();
        const previewRows = data ? data.rows.slice(0, 3) : [];
        const totalRows = data ? data.rows.length : 0;
        const isAgenciesTab = tab === "agencies";
        // All available columns shown in the column-picker for the agencies tab.
        const ALL_AGENCY_COLS: Array<{ key: string; label: string }> = [
          { key: "code",       label: "Agency Code"   },
          { key: "name",       label: "Name"          },
          { key: "contact",    label: "Contact Name"  },
          { key: "address",    label: "Address"       },
          { key: "city",       label: "City"          },
          { key: "state",      label: "State"         },
          { key: "zip",        label: "ZIP Code"      },
          { key: "phone",      label: "Phone"         },
          { key: "email",      label: "Email"         },
          { key: "aff1",       label: "Affiliation 1" },
          { key: "aff2",       label: "Affiliation 2" },
          { key: "aff3",       label: "Affiliation 3" },
          { key: "totalUsers", label: "Total User"    },
          { key: "lastLogin",  label: "Last Login"    },
          { key: "status",     label: "Status"        },
        ];
        const allAffNames = Array.from(new Set(allAgencies.flatMap(a => a.affiliations))).sort();
        const filteredAffNames = allAffNames.filter(n => !exportAffSearch || n.toLowerCase().includes(exportAffSearch.toLowerCase()));
        // Compute which preset is currently active (if any) — used to highlight the preset button.
        const colsKey = Array.from(exportSelectedCols).sort().join(",");
        const basicKey = [...AGENCIES_EXPORT_COLS_BASIC].sort().join(",");
        const contactsKey = [...AGENCIES_EXPORT_COLS_CONTACTS].sort().join(",");
        const activePreset = colsKey === basicKey ? "basic" : colsKey === contactsKey ? "contacts" : null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: "rgba(0,0,0,0.45)" }}
            onClick={() => setExportDialogOpen(false)}>
            <div className="rounded-2xl overflow-hidden flex flex-col"
              style={{ background: c.cardBg, border: `1px solid ${c.border}`, width: "min(960px, 94vw)", maxHeight: "88vh", boxShadow: "0 20px 50px rgba(0,0,0,0.20)" }}
              onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="px-6 py-4 flex items-center justify-between flex-shrink-0" style={{ borderBottom: `1px solid ${c.border}` }}>
                <div>
                  <h2 className="text-[16px] font-bold" style={{ fontFamily: FONT, color: c.text }}>Export {tab === "users" ? "Users" : tab === "affiliations" ? "Affiliation Agencies" : "Agencies"}</h2>
                  <p className="text-[12px] mt-0.5" style={{ fontFamily: FONT, color: c.muted }}>{data ? `${totalRows} ${totalRows === 1 ? "row" : "rows"} · ${data.headers.length} columns · respects your current filters` : "No data to export"}</p>
                </div>
                <button onClick={() => setExportDialogOpen(false)}
                  className="p-1.5 rounded-md transition-colors"
                  onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <X className="w-4 h-4" style={{ color: c.muted }} />
                </button>
              </div>
              {/* Body — for agencies tab show full options; for other tabs simpler */}
              {isAgenciesTab ? (
                <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
                  {/* Scope */}
                  <div className="px-5 pt-4 pb-3 flex-shrink-0">
                    <div className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ fontFamily: FONT, color: c.muted, letterSpacing: "0.06em" }}>Scope</div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {([
                        ["all",            "All Agencies"           ],
                        ["withAffs",       "Agencies with Affiliations"],
                      ] as const).map(([key, label]) => {
                        const active = exportScope === key;
                        return (
                          <label key={key} className="flex items-center gap-1.5 cursor-pointer"
                            onClick={() => setExportScope(key)}>
                            <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full flex-shrink-0"
                              style={{ border: `1.5px solid ${active ? "#A614C3" : c.borderStrong}`, background: c.cardBg }}>
                              {active && <span style={{ width: 7, height: 7, borderRadius: 999, background: "#A614C3" }} />}
                            </span>
                            <span className="text-[12px]" style={{ fontFamily: FONT, color: active ? "#A614C3" : c.text, fontWeight: active ? 600 : 400 }}>{label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <div className="mx-5" style={{ borderBottom: `1px solid ${c.border}` }} />
                  {/* Quick Preset + Columns — combined into one section */}
                  <div className="px-5 pt-4 pb-4 flex-shrink-0">
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-x-6 gap-y-2">
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ fontFamily: FONT, color: c.muted, letterSpacing: "0.06em" }}>Quick Preset</div>
                        {([["basic", "Agencies Only", AGENCIES_EXPORT_COLS_BASIC], ["contacts", "Agencies with Contacts", AGENCIES_EXPORT_COLS_CONTACTS]] as const).map(([key, label, cols]) => {
                          const active = activePreset === key;
                          return (
                            <label key={key} className="flex items-center gap-1.5 cursor-pointer"
                              onClick={() => setExportSelectedCols(new Set(cols))}>
                              <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full flex-shrink-0"
                                style={{ border: `1.5px solid ${active ? "#A614C3" : c.borderStrong}`, background: c.cardBg }}>
                                {active && <span style={{ width: 7, height: 7, borderRadius: 999, background: "#A614C3" }} />}
                              </span>
                              <span className="text-[12px]" style={{ fontFamily: FONT, color: active ? "#A614C3" : c.text, fontWeight: active ? 600 : 400 }}>{label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ fontFamily: FONT, color: c.muted, letterSpacing: "0.06em" }}>Columns ({exportSelectedCols.size}/{ALL_AGENCY_COLS.length})</div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setExportSelectedCols(new Set(ALL_AGENCY_COLS.map(c => c.key)))}
                          className="text-[11px] font-semibold transition-colors"
                          style={{ fontFamily: FONT, color: "#A614C3" }}>All</button>
                        <span className="text-[11px]" style={{ color: c.muted }}>·</span>
                        <button onClick={() => setExportSelectedCols(new Set())}
                          className="text-[11px] font-semibold transition-colors"
                          style={{ fontFamily: FONT, color: "#A614C3" }}>None</button>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-y-1 gap-x-3">
                      {ALL_AGENCY_COLS.map(col => {
                        const checked = exportSelectedCols.has(col.key);
                        return (
                          <label key={col.key} className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors"
                            onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                            onClick={() => setExportSelectedCols(prev => { const s = new Set(prev); s.has(col.key) ? s.delete(col.key) : s.add(col.key); return s; })}>
                            <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0"
                              style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>
                              {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                            </div>
                            <span className="text-[12px] truncate" style={{ fontFamily: FONT, color: c.text }}>{col.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  {/* Affiliation filter — only shown when scope is "Agencies with Affiliations" — moved BELOW Columns */}
                  {exportScope === "withAffs" && (
                    <>
                    <div className="mx-5" style={{ borderBottom: `1px solid ${c.border}` }} />
                    <div className="px-5 pt-4 pb-4 flex-shrink-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ fontFamily: FONT, color: c.muted, letterSpacing: "0.06em" }}>Filter by Affiliation {exportAffs.size > 0 ? `(${exportAffs.size})` : "(All)"}</div>
                        {exportAffs.size > 0 && (
                          <button onClick={() => { setExportAffs(new Set()); setExportAffSearch(""); }}
                            className="text-[11px] font-semibold" style={{ fontFamily: FONT, color: "#A614C3" }}>Clear</button>
                        )}
                      </div>
                      <div className="grid grid-cols-4 gap-y-1 gap-x-3" style={{ maxHeight: 180, overflowY: "auto" }}>
                        {allAffNames.map(name => {
                          const checked = exportAffs.has(name);
                          return (
                            <label key={name} className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors"
                              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                              onClick={() => setExportAffs(prev => { const s = new Set(prev); s.has(name) ? s.delete(name) : s.add(name); return s; })}>
                              <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0"
                                style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>
                                {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                              </div>
                              <span className="text-[12px] truncate" style={{ fontFamily: FONT, color: c.text }} title={name}>{name}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                    </>
                  )}
                </div>
              ) : (() => {
                // Inline column picker for Affiliations and Users — same pattern as the
                // Agencies branch above. Restores the per-modal column selection users had
                // before (the redirect-to-toolbar hint was a step down in UX). The picker
                // mutates the tab's existing visibility state (affVisibleCols for affiliations,
                // usersHiddenCols for users) so the toolbar's "Show / hide columns" stays in sync.
                const cols = tab === "affiliations" ? AFFILIATIONS_COLS : USERS_COLS;
                const isVisible = (key: string): boolean =>
                  tab === "affiliations" ? affVisibleCols.has(key) : !usersHiddenCols.has(key);
                const setVisibleSet = (keys: string[]) => {
                  if (tab === "affiliations") {
                    setAffVisibleCols(new Set(keys));
                  } else {
                    // usersHiddenCols stores HIDDEN keys, so visible = all minus the visible set
                    const hidden = USERS_COLS.map(c => c.key).filter(k => !keys.includes(k));
                    setUsersHiddenCols(new Set(hidden));
                  }
                };
                const toggle = (key: string) => {
                  if (tab === "affiliations") {
                    setAffVisibleCols(prev => { const s = new Set(prev); s.has(key) ? s.delete(key) : s.add(key); return s; });
                  } else {
                    setUsersHiddenCols(prev => { const s = new Set(prev); s.has(key) ? s.delete(key) : s.add(key); return s; });
                  }
                };
                const visibleCount = cols.filter(col => isVisible(col.key)).length;
                return (
                  <div className="px-5 pt-4 pb-4 flex-shrink-0" style={{ borderBottom: `1px solid ${c.border}` }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ fontFamily: FONT, color: c.muted, letterSpacing: "0.06em" }}>
                        Columns ({visibleCount}/{cols.length})
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setVisibleSet(cols.map(col => col.key))}
                          className="text-[11px] font-semibold transition-colors"
                          style={{ fontFamily: FONT, color: "#A614C3" }}>All</button>
                        <span className="text-[11px]" style={{ color: c.muted }}>·</span>
                        <button onClick={() => setVisibleSet([])}
                          className="text-[11px] font-semibold transition-colors"
                          style={{ fontFamily: FONT, color: "#A614C3" }}>None</button>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-y-1 gap-x-3">
                      {cols.map(col => {
                        const checked = isVisible(col.key);
                        return (
                          <label key={col.key} className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors"
                            onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                            onClick={() => toggle(col.key)}>
                            <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0"
                              style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>
                              {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                            </div>
                            <span className="text-[12px] truncate" style={{ fontFamily: FONT, color: c.text }}>{col.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
              {/* Preview */}
              <div className="mx-5" style={{ borderTop: `1px solid ${c.border}` }} />
              <div className="px-6 py-3 flex-shrink-0">
                <div className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ fontFamily: FONT, color: c.muted, letterSpacing: "0.06em" }}>
                  Preview {totalRows > 3 ? `(first 3 of ${totalRows})` : ""}
                </div>
                {!data || previewRows.length === 0 ? (
                  <div className="py-8 text-center text-[13px] rounded-xl"
                    style={{ fontFamily: FONT, color: c.muted, border: `1px dashed ${c.border}`, background: c.hoverBg }}>
                    No rows match your current filters.
                  </div>
                ) : data.headers.length === 0 ? (
                  <div className="py-8 text-center text-[13px] rounded-xl"
                    style={{ fontFamily: FONT, color: c.muted, border: `1px dashed ${c.border}`, background: c.hoverBg }}>
                    No columns selected.
                  </div>
                ) : (
                  <div className="overflow-auto rounded-xl" style={{ border: `1px solid ${c.border}`, maxHeight: 200 }}>
                    <table className="text-left border-collapse" style={{ minWidth: "100%" }}>
                      <thead className="sticky top-0" style={{ background: c.hoverBg, zIndex: 1 }}>
                        <tr style={{ borderBottom: `1px solid ${c.border}` }}>
                          {data.headers.map(h => (
                            <th key={h} className="text-[11px] font-bold uppercase tracking-wider py-2.5 px-4 whitespace-nowrap"
                              style={{ fontFamily: FONT, color: c.muted }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewRows.map((row, i) => (
                          <tr key={i} style={{ borderBottom: i !== previewRows.length - 1 ? `1px solid ${c.border}` : "none" }}>
                            {row.map((v, j) => (
                              <td key={j} className="py-2.5 px-4 whitespace-nowrap text-[12px]"
                                style={{ fontFamily: FONT, color: c.text }}>{v || <span style={{ color: c.muted }}>—</span>}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              {/* Footer */}
              <div className="px-6 py-3 flex items-center justify-between gap-2 flex-shrink-0" style={{ borderTop: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.02)" : "#FAFAFA" }}>
                {isAgenciesTab ? (
                  <button onClick={() => { setExportSelectedCols(new Set(AGENCIES_EXPORT_COLS_CONTACTS)); setExportAffs(new Set()); setExportAffSearch(""); setExportFormat("csv"); setExportScope("all"); }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold transition-colors"
                    style={{ fontFamily: FONT, color: "#A614C3" }}
                    onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <RefreshCw className="w-3.5 h-3.5" />Reset
                  </button>
                ) : <div />}
                <div className="flex items-center gap-2">
                  <button onClick={() => setExportDialogOpen(false)}
                    className="px-4 py-2 rounded-lg text-[13px] transition-colors"
                    style={{ fontFamily: FONT, color: c.text, border: `1px solid ${c.border}`, background: c.cardBg }}
                    onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                    onMouseLeave={e => (e.currentTarget.style.background = c.cardBg)}>
                    Cancel
                  </button>
                  {/* Split button: shared gradient on the wrapper so both halves read as one continuous fill. */}
                  <div className="relative inline-flex transition-all"
                    onClick={e => e.stopPropagation()}
                    onMouseEnter={e => { if (data && totalRows > 0 && data.headers.length > 0) e.currentTarget.style.filter = "brightness(1.12)"; }}
                    onMouseLeave={e => (e.currentTarget.style.filter = "none")}
                    style={{ background: btnGrad, borderRadius: 10, boxShadow: "0 4px 14px rgba(166,20,195,0.25)", opacity: !data || totalRows === 0 || data.headers.length === 0 ? 0.5 : 1 }}>
                    <button onClick={runExport}
                      disabled={!data || totalRows === 0 || data.headers.length === 0}
                      className="flex items-center gap-2 pl-4 pr-3 py-2 text-[13px] font-semibold text-white"
                      style={{ fontFamily: FONT, background: "transparent", borderRadius: "10px 0 0 10px", cursor: !data || totalRows === 0 || data.headers.length === 0 ? "not-allowed" : "pointer" }}>
                      <Download className="w-4 h-4" />Download {exportFormat === "csv" ? "CSV" : "Excel"}
                    </button>
                    <button onClick={() => setExportFormatMenuOpen(o => !o)}
                      disabled={!data || totalRows === 0 || data.headers.length === 0}
                      className="flex items-center justify-center px-2 py-2 text-white"
                      style={{ fontFamily: FONT, background: "transparent", borderRadius: "0 10px 10px 0", borderLeft: "1px solid rgba(255,255,255,0.25)", cursor: !data || totalRows === 0 || data.headers.length === 0 ? "not-allowed" : "pointer" }}>
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {exportFormatMenuOpen && (
                      <div className="absolute right-0 bottom-full mb-1 z-30 w-[160px] rounded-lg shadow-xl overflow-hidden"
                        style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                        {([["csv", "CSV"], ["xlsx", "Excel"]] as const).map(([key, label]) => {
                          const active = exportFormat === key;
                          return (
                            <button key={key} onClick={() => { setExportFormat(key); setExportFormatMenuOpen(false); }}
                              className="w-full flex items-center justify-between px-3 py-2 text-[12px] transition-colors"
                              style={{ fontFamily: FONT, color: active ? "#A614C3" : c.text, background: active ? "rgba(168,85,247,0.08)" : "transparent", fontWeight: active ? 600 : 400 }}
                              onMouseEnter={e => (e.currentTarget.style.background = active ? "rgba(168,85,247,0.12)" : c.hoverBg)}
                              onMouseLeave={e => (e.currentTarget.style.background = active ? "rgba(168,85,247,0.08)" : "transparent")}>
                              <span>{label}</span>
                              {active && <svg width="9" height="7" viewBox="0 0 9 7" fill="none" className="flex-shrink-0"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
      {starLimitToast && (
        <div className="fixed top-[68px] right-6 z-50 flex items-center gap-4"
          style={{ background: isDark ? "#1E2240" : "#fff", border: `1px solid ${c.border}`, borderRadius: 12, padding: "12px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.10)", minWidth: 320, maxWidth: 420, fontFamily: FONT }}>
          <Star className="w-4 h-4 flex-shrink-0" style={{ color: "#F59E0B", fill: "#F59E0B" }} />
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold" style={{ color: c.text }}>Pin limit reached</div>
            <div className="text-[12px] mt-0.5" style={{ color: c.muted }}>You can only pin up to 6 agencies.</div>
          </div>
        </div>
      )}
      {saveForLaterToast && (
        <div className="fixed top-[68px] right-6 z-50 flex items-center gap-4"
          style={{ background: isDark ? "#1E2240" : "#fff", border: `1px solid ${c.border}`, borderRadius: 12, padding: "12px 14px", boxShadow: "0 4px 16px rgba(0,0,0,0.10)", minWidth: 320, maxWidth: 420, fontFamily: FONT }}>
          <Bookmark className="w-4 h-4 flex-shrink-0" style={{ color: "#A855F7" }} />
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold" style={{ color: c.text }}>Draft saved</div>
            <div className="text-[12px] mt-0.5" style={{ color: c.muted }}>Pick up where you left off any time.</div>
          </div>
        </div>
      )}
      {resumeDraftOpen && (() => {
        // Show newest drafts first.
        const drafts = [...agencyDrafts].sort((a, b) => b.savedAt - a.savedAt);
        const formatRelative = (ts: number | null) => {
          if (!ts) return "Saved recently";
          const diffMs = Date.now() - ts;
          const min = Math.floor(diffMs / 60000);
          if (min < 1) return "Saved just now";
          if (min < 60) return `Saved ${min} min ago`;
          const h = Math.floor(min / 60);
          if (h < 24) return `Saved ${h} hr ago`;
          const d = Math.floor(h / 24);
          return `Saved ${d} day${d === 1 ? "" : "s"} ago`;
        };
        return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={() => setResumeDraftOpen(false)}
          style={{ background: "rgba(0,0,0,0.45)" }}>
          <div className="rounded-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}
            style={{ background: c.cardBg, border: `1px solid ${c.border}`, fontFamily: FONT, width: "min(560px,94vw)", maxHeight: "82vh" }}>
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between flex-shrink-0" style={{ borderBottom: `1px solid ${c.border}` }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(245,158,11,0.12)" }}>
                  <Bookmark className="w-4 h-4" style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold" style={{ color: c.text }}>Drafts</h3>
                  <p className="text-[11px]" style={{ color: c.muted }}>{drafts.length} unfinished {drafts.length === 1 ? "agency" : "agencies"}</p>
                </div>
              </div>
              <button onClick={() => setResumeDraftOpen(false)}
                className="p-1.5 rounded-md transition-colors"
                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <X className="w-4 h-4" style={{ color: c.muted }} />
              </button>
            </div>
            {/* List */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {drafts.length === 0 ? (
                <p className="text-[12px] py-10 text-center" style={{ color: c.muted }}>No drafts. Save an agency for later from the &ldquo;Add New Agency&rdquo; form.</p>
              ) : (
                <div className="space-y-2">
                  {drafts.map(entry => {
                    const d = entry.draft;
                    const displayName = d.agencyName?.trim() || "Untitled draft";
                    const subtitle = [d.agencyCode, d.city && d.stateVal ? `${d.city}, ${d.stateVal}` : null].filter(Boolean).join(" · ");
                    return (
                      <div key={entry.id} className="rounded-xl px-4 py-3 transition-colors"
                        style={{ border: `1px solid ${c.border}`, background: "transparent" }}>
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[13px] font-semibold truncate" style={{ color: c.text }}>{displayName}</span>
                              {d.agencyType && (
                                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                                  style={{ background: "rgba(168,85,247,0.10)", color: "#A855F7", letterSpacing: "0.04em" }}>{d.agencyType}</span>
                              )}
                            </div>
                            {subtitle && <div className="text-[11px] mt-0.5 truncate" style={{ color: c.muted }}>{subtitle}</div>}
                            <div className="text-[11px] mt-1 flex items-center gap-1.5" style={{ color: c.muted }}>
                              <Calendar className="w-3 h-3" />{formatRelative(entry.savedAt)}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button onClick={() => setAgencyDrafts(prev => prev.filter(e => e.id !== entry.id))}
                              title="Discard draft"
                              className="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors"
                              style={{ border: `1px solid ${c.borderStrong}`, color: c.muted, background: "transparent" }}
                              onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.color = "#EF4444"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.30)"; }}
                              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = c.muted; e.currentTarget.style.borderColor = c.borderStrong; }}>
                              Discard
                            </button>
                            <button onClick={() => { setResumingDraftId(entry.id); setResumeFromDraft(true); setResumeDraftOpen(false); setAddOpen(true); }}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-[11px] font-semibold text-white transition-opacity"
                              style={{ background: btnGrad }}
                              onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.1)")}
                              onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
                              <FilePen className="w-3 h-3" />Resume
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        );
      })()}

      {/* Section title */}
      {sectionTitle}

      {/* Toolbar row — search on the left, Drafts + Add Agency on the right.
          The inline "Search" button was dropped: the input already live-filters
          the table, so the extra click was purely decorative. */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex flex-1 max-w-[420px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: c.muted }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by agency, code, or user..."
            className="flex-1 outline-none w-full"
            style={{
              fontFamily: FONT,
              background: c.cardBg,
              border: `1px solid ${c.border}`,
              borderRadius: 10,
              color: c.text,
              padding: "9px 14px 9px 36px",
              fontSize: 13,
            }}
            onFocus={e => (e.currentTarget.style.borderColor = "#A614C3")}
            onBlur={e => (e.currentTarget.style.borderColor = c.border)} />
        </div>
        <div className="flex-1" />
        {/* Drafts entry — visible whenever saved drafts exist; lets users hop back into in-progress agencies */}
        {(() => {
          const hasDrafts = agencyDrafts.length > 0;
          return (
            <button onClick={() => hasDrafts && setResumeDraftOpen(true)}
              disabled={!hasDrafts}
              title={hasDrafts ? `${agencyDrafts.length} saved draft${agencyDrafts.length === 1 ? "" : "s"}` : "No saved drafts"}
              className="relative flex items-center gap-1.5 text-[13px] font-semibold transition-colors flex-shrink-0"
              style={{ fontFamily: FONT,
                padding: "9px 14px",
                borderRadius: 10,
                border: `1px solid ${c.border}`,
                background: c.cardBg,
                color: hasDrafts ? c.text : c.muted,
                cursor: hasDrafts ? "pointer" : "not-allowed",
                opacity: hasDrafts ? 1 : 0.6 }}
              onMouseEnter={e => { if (hasDrafts) e.currentTarget.style.background = c.hoverBg; }}
              onMouseLeave={e => { if (hasDrafts) e.currentTarget.style.background = c.cardBg; }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill={hasDrafts ? "url(#draftsBookmarkGrad)" : "none"} stroke={hasDrafts ? "url(#draftsBookmarkGrad)" : c.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <defs>
                  <linearGradient id="draftsBookmarkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#5C2ED4" />
                    <stop offset="100%" stopColor="#A614C3" />
                  </linearGradient>
                </defs>
                <path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z" />
              </svg>
              Drafts
              {hasDrafts && (
                <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: "rgba(166,20,195,0.10)" }}>
                  <span style={{
                    backgroundImage: "linear-gradient(88.54deg, #5C2ED4 0%, #A614C3 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>{agencyDrafts.length}</span>
                </span>
              )}
            </button>
          );
        })()}
        <button onClick={() => { setResumeFromDraft(false); setAddOpen(true); }}
          className="flex items-center gap-1.5 text-[13px] font-semibold text-white transition-all flex-shrink-0"
          style={{ fontFamily: FONT, background: btnGrad, padding:"9px 16px", borderRadius: 10 }}
          onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.10)")}
          onMouseLeave={e => (e.currentTarget.style.filter = "none")}>
          <Plus className="w-4 h-4" />Add Agency
        </button>
      </div>

      {/* Stat cards — replaces the old All / Appointed / Unappointed pill row.
          Content swaps by tab: agencies/affiliations show agency counts +
          "Total" clears the status filter; users tab shows Total Users / Active
          / Inactive / Admins as display-only summaries. "New" and the user-tab
          cards aren't wired to filters (no matching filter state in the mock).
          Onboarded-at falls back to lastLogin as a proxy. */}
      {(() => {
        const totalCount = allAgencies.length;
        const now = new Date();
        const cutoff = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        const parseLast = (s: string) => {
          const [m, d, y] = s.split("/").map(Number);
          return new Date(y, (m ?? 1) - 1, d ?? 1);
        };
        const newCount = allAgencies.filter(a => parseLast(a.lastLogin) >= cutoff).length;
        const appointedCount   = allAgencies.filter(a => a.status === "Appointed").length;
        const unappointedCount = allAgencies.filter(a => a.status === "Unappointed").length;
        // User-tab metrics — active / inactive derived from the same
        // `showInactive` bookkeeping used to gate rows in the users table.
        const totalUsersAll = mockAgencyUsers.length;
        const inactiveUsersAll = mockAgencyUsers.filter(u => inactiveUserIds.has(u.id)).length;
        const activeUsersAll = totalUsersAll - inactiveUsersAll;
        const adminUsersAll  = mockAgencyUsers.filter(u => u.isAdmin && !inactiveUserIds.has(u.id)).length;
        // Affiliation-tab metrics — distinct carrier group names across all
        // agencies; new / appointed / unappointed are the count of DISTINCT
        // affiliations that appear in at least one agency of that class.
        const allAffiliationNames = Array.from(new Set(allAgencies.flatMap(a => a.affiliations)));
        const totalAffiliations = allAffiliationNames.length;
        const newAffiliations = Array.from(new Set(
          allAgencies.filter(a => parseLast(a.lastLogin) >= cutoff).flatMap(a => a.affiliations)
        )).length;
        const appointedAffiliations = Array.from(new Set(
          allAgencies.filter(a => a.status === "Appointed").flatMap(a => a.affiliations)
        )).length;
        const unappointedAffiliations = Array.from(new Set(
          allAgencies.filter(a => a.status === "Unappointed").flatMap(a => a.affiliations)
        )).length;
        const cards: { key: FilterStatus | "New" | "Active" | "Inactive" | "Admins"; label: string; value: number; hint: string }[] = tab === "users"
          ? [
              { key: "All",      label: "Total Users", value: totalUsersAll,    hint: "Across all agencies" },
              { key: "Active",   label: "Active",      value: activeUsersAll,   hint: "Currently active" },
              { key: "Inactive", label: "Inactive",    value: inactiveUsersAll, hint: "Disabled or removed" },
              { key: "Admins",   label: "Admins",      value: adminUsersAll,    hint: "Agency administrators" },
            ]
          : tab === "affiliations"
          ? [
              { key: "All",         label: "Total Affiliations", value: totalAffiliations,       hint: "Distinct carrier groups" },
              { key: "New",         label: "New",                value: newAffiliations,         hint: "Onboarded in last 12 months" },
              { key: "Appointed",   label: "Appointed",          value: appointedAffiliations,   hint: "Members appointed today" },
              { key: "Unappointed", label: "Unappointed",        value: unappointedAffiliations, hint: "Members not yet appointed" },
            ]
          : (() => {
              // Base 4 stat cards, plus a razz-tinted "Needs Action" card
              // that appears only when at least one agency has pending
              // ITC updates (internal + super-admin only). Grid grows to
              // 5 columns for that state so the new card fits inline.
              const base: { key: FilterStatus | "New" | "Active" | "Inactive" | "Admins"; label: string; value: number; hint: string }[] = [
                { key: "All",         label: "Total Agencies", value: totalCount,       hint: "All in book" },
                { key: "New",         label: "New",            value: newCount,         hint: "Onboarded in last 12 months" },
                { key: "Appointed",   label: "Appointed",      value: appointedCount,   hint: "Currently appointed" },
                { key: "Unappointed", label: "Unappointed",    value: unappointedCount, hint: "Not yet appointed" },
              ];
              if (!clientMode) {
                const needsActionCount = allAgencies.reduce(
                  (n, a) => n + (countPendingItcUpdates(getDetail(a), itcRecords[a.code] ?? null) > 0 ? 1 : 0),
                  0,
                );
                // Slot right after Total Agencies so the action-required
                // signal is the first thing next to the top-line total.
                base.splice(1, 0, { key: "NeedsAction", label: "Needs Action", value: needsActionCount, hint: "Pending ITC updates" });
              }
              return base;
            })();
        const cardCount = cards.length;
        return (
          <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: `repeat(${cardCount}, minmax(0, 1fr))` }}>
            {cards.map(card => {
              // All three tabs are clickable now. `activeKey` reads whichever
              // per-tab state is holding the current selection, and the click
              // handler writes to that same state.
              const activeKey = tab === "users" ? usersStatKey
                               : tab === "affiliations" ? affStatKey
                               : filterStatus;
              // "New" is intentionally disabled on the Users / Agencies tabs (no filter
              // logic wired), but under Affiliations it's a functional filter (agencies
              // active in the last 12 months), so let it click through there.
              const clickable = card.key !== "New" || tab === "affiliations";
              // "All" acts as a neutral "reset" — clickable, but never shows
              // the active gradient border regardless of which tab.
              const active = clickable && card.key !== "All" && activeKey === card.key;
              // Needs Action stays visible even when idle — filled razz
              // tint when there's work, outlined-only (border stroke, no
              // fill) with a small stroke-only pill in the top-right when
              // everything is synced.
              const isNeedsAction = card.key === "NeedsAction";
              const needsActionEmpty = isNeedsAction && card.value === 0;
              const needsActionFilled = isNeedsAction && card.value > 0;
              return (
                <button
                  key={card.label}
                  onClick={() => {
                    if (!clickable) return;
                    if (tab === "users")             setUsersStatKey(card.key as typeof usersStatKey);
                    else if (tab === "affiliations") setAffStatKey(card.key as typeof affStatKey);
                    else                             setFilterStatus(card.key as FilterStatus);
                    setPage(1);
                  }}
                  disabled={!clickable}
                  className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-left transition-all"
                  style={active ? {
                    // Gradient border via double-background trick — set only one
                    // background property to avoid the shorthand-vs-longhand
                    // warning React throws when we toggle back to a plain color.
                    background: `linear-gradient(${c.cardBg}, ${c.cardBg}) padding-box, linear-gradient(to right, #5C2ED4 0%, #A614C3 65%) border-box`,
                    border: "1px solid transparent",
                    boxShadow: "none",
                    cursor: "pointer",
                    fontFamily: FONT,
                  } : isNeedsAction ? {
                    // Non-active state matches the other cards: plain
                    // neutral card + standard border stroke. Attention
                    // comes from the small razz dot in the top-right
                    // (populated) or an outlined "0" bubble (empty).
                    background: c.cardBg,
                    border: `1px solid ${c.border}`,
                    boxShadow: "none",
                    cursor: "pointer",
                    fontFamily: FONT,
                    position: "relative",
                  } : {
                    background: c.cardBg,
                    border: `1px solid ${c.border}`,
                    boxShadow: "none",
                    cursor: clickable ? "pointer" : "default",
                    fontFamily: FONT,
                  }}
                  onMouseEnter={e => {
                    if (clickable && !active) e.currentTarget.style.background = c.hoverBg;
                  }}
                  onMouseLeave={e => {
                    if (clickable && !active) e.currentTarget.style.background = c.cardBg;
                  }}
                >
                  <div className="min-w-0">
                    <div className="text-[13px] font-semibold" style={{ color: c.text }}>{card.label}</div>
                    <div className="text-[11px] mt-0.5 truncate" style={{ color: c.muted }}>{card.hint}</div>
                  </div>
                  {needsActionFilled && !active && (
                    <span
                      aria-hidden
                      className="absolute rounded-full"
                      style={{ top: -4, right: -4, width: 10, height: 10, background: "#A614C3", border: `2px solid ${c.cardBg}`, boxSizing: "content-box" }}
                    />
                  )}
                  {needsActionEmpty ? (
                    <span
                      className="absolute inline-flex items-center justify-center text-[10.5px] font-bold rounded-full"
                      style={{ top: -9, right: -9, minWidth: 18, height: 18, padding: "0 6px", background: c.cardBg, border: "1px solid rgba(166,20,195,0.55)", color: "#A614C3" }}
                    >
                      0
                    </span>
                  ) : (
                    <span className="text-[24px] font-bold leading-none flex-shrink-0" style={{ color: isNeedsAction ? "#A614C3" : c.text }}>
                      {card.value}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        );
      })()}

      {/* Tabs — segmented-control style. Grey track wraps all three pills;
          active pill lifts up on a white bg with a subtle shadow (iOS-style
          segmented control). */}
      <div className="flex items-center gap-2 mb-0 flex-shrink-0">
        <div
          className="flex items-center gap-1 p-1 rounded-lg"
          style={{
            background: isDark ? "rgba(255,255,255,0.05)" : "#F3F4F6",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#E5E7EB"}`,
          }}
        >
          {([["agencies", "Agencies", Building2], ["users", "All Users", Users], ["affiliations", "Affiliations", Network]] as [TabKey, string, React.ComponentType<{className?:string;style?:React.CSSProperties}>][]).map(([key, label, Icon]) => {
            const active = tab === key;
            return (
              <button key={key} onClick={() => setTab(key)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md text-[12.5px] font-medium transition-all"
                style={{
                  fontFamily: FONT,
                  color: active ? (isDark ? "#F9FAFB" : "#1F2937") : c.muted,
                  background: active
                    ? (isDark ? "rgba(255,255,255,0.10)" : "#FFFFFF")
                    : "transparent",
                  boxShadow: active
                    ? (isDark ? "0 1px 2px rgba(0,0,0,0.24)" : "0 1px 2px rgba(15,23,42,0.08), 0 0 0 1px rgba(15,23,42,0.04)")
                    : "none",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = c.text; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = c.muted; }}>
                <Icon className="w-[14px] h-[14px]" style={{ color: active ? "#A614C3" : undefined }} />
                {label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button title="Reset filters & columns"
            onClick={() => {
              setSearch("");
              setFilterStatus("All");
              setSortKey(null);
              setSortDir("asc");
              setPage(1);
              setLocationFilter(new Set()); setLocationSearch(""); setLocationOpen(false);
              setAffiliationFilter(new Set()); setAffiliationSearch(""); setAffiliationOpen(null);
              setAgencyNameFilter(new Set()); setAgencyNameSearch(""); setAgencyNameOpen(false);
              setAllUsersJobFilter(new Set()); setAllUsersJobSearch(""); setAllUsersJobOpen(false);
              setAllUsersSortDir("asc");
              setActivityFilter("all"); setActivityFilterOpen(false);
              // Reset column visibility for all three tabs.
              setAgenciesHiddenCols(new Set());
              setUsersHiddenCols(new Set());
              setAffVisibleCols(new Set(AFF_DEFAULT_VISIBLE));
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
            style={{ fontFamily: FONT, color: c.text, border: `1px solid ${c.border}`, background: c.cardBg }}
            onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
            onMouseLeave={e => (e.currentTarget.style.background = c.cardBg)}>
            <RefreshCw className="w-3.5 h-3.5" style={{ color: c.muted }} />
            Reset
          </button>
          <div className="relative" onClick={e => e.stopPropagation()}>
            <button title="View columns" onClick={() => setViewOpen(o => !o)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
              style={{ fontFamily: FONT, color: c.text, border: `1px solid ${c.border}`, background: viewOpen ? c.hoverBg : c.cardBg }}
              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
              onMouseLeave={e => (e.currentTarget.style.background = viewOpen ? c.hoverBg : c.cardBg)}>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke={c.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="2" y="2" rx="1"/><rect width="5" height="5" x="9.5" y="2" rx="1"/><rect width="5" height="5" x="17" y="2" rx="1"/><rect width="5" height="5" x="2" y="9.5" rx="1"/><rect width="5" height="5" x="9.5" y="9.5" rx="1"/><rect width="5" height="5" x="17" y="9.5" rx="1"/><rect width="5" height="5" x="2" y="17" rx="1"/><rect width="5" height="5" x="9.5" y="17" rx="1"/><rect width="5" height="5" x="17" y="17" rx="1"/></svg>
              View
            </button>
            {viewOpen && (() => {
              // Unified column-visibility picker. Each tab tracks visibility differently:
              // - users/agencies use a "hidden" set (default = all visible)
              // - affiliations uses a "visible" set (default = base columns; user can also add extras)
              const cols = tab === "users" ? USERS_COLS : tab === "agencies" ? AGENCIES_COLS : AFFILIATIONS_COLS;
              const isVisible = (k: string) =>
                tab === "affiliations" ? affVisibleCols.has(k)
                  : tab === "users" ? !usersHiddenCols.has(k)
                  : !agenciesHiddenCols.has(k);
              const toggle = (k: string) => {
                if (tab === "affiliations") setAffVisibleCols(prev => { const s = new Set(prev); s.has(k) ? s.delete(k) : s.add(k); return s; });
                else if (tab === "users")   setUsersHiddenCols(prev => { const s = new Set(prev); s.has(k) ? s.delete(k) : s.add(k); return s; });
                else                        setAgenciesHiddenCols(prev => { const s = new Set(prev); s.has(k) ? s.delete(k) : s.add(k); return s; });
              };
              const reset = () => {
                if (tab === "affiliations") setAffVisibleCols(new Set(AFF_DEFAULT_VISIBLE));
                else if (tab === "users")   setUsersHiddenCols(new Set());
                else                        setAgenciesHiddenCols(new Set());
              };
              return (
                <div className="absolute right-0 top-full mt-1 z-30 w-[220px] rounded-xl shadow-xl overflow-hidden"
                  style={{ background: c.cardBg, border: `1px solid ${c.border}` }}>
                  <div className="px-4 py-2.5 text-[11px] uppercase tracking-wider font-semibold"
                    style={{ fontFamily: FONT, color: c.muted, borderBottom: `1px solid ${c.border}`, letterSpacing: "0.06em" }}>
                    Show Columns
                  </div>
                  <div className="py-1.5 max-h-[280px] overflow-y-auto">
                    {cols.map(col => {
                      const visible = isVisible(col.key);
                      return (
                        <label key={col.key} className="flex items-center gap-2.5 px-4 py-2 cursor-pointer transition-colors"
                          onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                          onClick={() => toggle(col.key)}>
                          <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0"
                            style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>
                            {visible && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                          </div>
                          <span className="text-[12px]" style={{ fontFamily: FONT, color: c.text }}>{col.label}</span>
                        </label>
                      );
                    })}
                  </div>
                  <button onClick={reset}
                    className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors"
                    style={{ fontFamily: FONT, color: "#A614C3", borderTop: `1px solid ${c.border}` }}
                    onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <RefreshCw className="w-3.5 h-3.5" />Reset
                  </button>
                </div>
              );
            })()}
          </div>
          <button onClick={() => {
              // When opening export from the agencies tab, mirror the table's current column visibility
              // so the preview matches what the user is actually looking at. Hidden columns map to their
              // underlying export keys (e.g. table "location" → "city" + "state" + "zip").
              if (tab === "agencies") {
                const map: Record<string, string[]> = {
                  code: ["code"],
                  location: ["city", "state", "zip"],
                  aff1: ["aff1"], aff2: ["aff2"], aff3: ["aff3"],
                  totalUsers: ["totalUsers"],
                  lastLogin: ["lastLogin"],
                  status: ["status"],
                };
                const ALL_EXPORT_KEYS = ["code","name","contact","address","city","state","zip","phone","email","aff1","aff2","aff3","totalUsers","lastLogin","status"];
                const hidden = new Set<string>();
                agenciesHiddenCols.forEach(k => (map[k] ?? []).forEach(ek => hidden.add(ek)));
                setExportSelectedCols(new Set(ALL_EXPORT_KEYS.filter(k => !hidden.has(k))));
              }
              setExportDialogOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors"
            style={{ fontFamily: FONT, color: c.text, border: `1px solid ${c.border}`, background: c.cardBg }}
            title={tab === "affiliations" ? "Preview & export agencies in this affiliation" : tab === "users" ? "Preview & export users (filtered)" : "Preview & export agencies (filtered)"}
            onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
            onMouseLeave={e => (e.currentTarget.style.background = c.cardBg)}>
            <Download className="w-3.5 h-3.5" style={{ color: c.muted }} />
            Export
          </button>
        </div>
      </div>

      {/* Card wrapper — table + in-card pagination, matches Clients / Quotes /
          Policies. `mt-4` gives breathing room between the tabs row and the
          card so the toolbar doesn't feel crammed. */}
      <div className="flex-1 flex flex-col rounded-2xl overflow-hidden mt-4"
        style={{
          background: c.cardBg,
          border: `1px solid ${c.border}`,
          boxShadow: isDark ? "none" : "0 1px 3px rgba(15,23,42,0.06)",
        }}>

      {/* Table */}
      {tab === "agencies" && (
      <div className="flex-1 overflow-x-hidden overflow-y-auto mt-0" onClick={() => { setLocationOpen(false); setAffiliationOpen(null); setAgencyNameOpen(false); setActivityFilterOpen(false); setViewOpen(false); }}>
        <table className="w-full text-left border-collapse" style={{ tableLayout: "fixed" }}>
          <thead className="sticky top-0 z-10" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#FAFAFB" }}>
            <tr style={{ borderBottom: `1px solid ${c.border}` }}>
              {([
                ["name",       "Agency Name", "15%",  true ],
                ["code",       "Agency Code", "11%",  true ],
                ["location",   "Location",    "12%",  false],
                [null,         "Affiliation 1","10%", false],
                [null,         "Affiliation 2","10%", false],
                [null,         "Affiliation 3","10%", false],
                ["totalUsers", "Total User",  "8%",   true ],
                ["lastLogin",  "Last Login",  "12%",  true ],
                ["status",     "Status",      "12%",  true ],
              ] as [SortKey, string, string, boolean][]).map(([key, label, w, sortable], idx) => {
                const affMatch = label?.match(/^Affiliation (\d)$/);
                const affIdx = affMatch ? parseInt(affMatch[1]) : null;
                const colKey = affIdx !== null ? `aff${affIdx}` : key;
                if (colKey && colKey !== "name" && agenciesHiddenCols.has(colKey)) return null;
                return (
                <th key={`${key}-${idx}`} onClick={() => sortable && key && key !== "lastLogin" && handleSort(key)}
                  className={`text-[11px] font-bold uppercase tracking-wider py-3 pr-6 select-none whitespace-nowrap ${sortable && key !== "lastLogin" ? "cursor-pointer" : ""} ${(key === "location" || key === "lastLogin" || affIdx !== null) ? "relative" : ""}`}
                  style={{ fontFamily: FONT, color: (key === "name" && sortKey === "name") || (key === "location" && locationFilter.size > 0) || (key === "lastLogin" && activityFilter !== "all") || (affIdx !== null && affiliationFilter.size > 0) ? "#A614C3" : c.muted, width: w,
                    paddingLeft: idx === 0 ? 20
                      : key === "location" ? 36
                      : affIdx === 1 ? 26
                      : (label?.startsWith("Affiliation")) ? 36
                      : key === "totalUsers" ? 45
                      : key === "lastLogin" ? 96
                      : key === "status" ? 45
                      : undefined,
                    textAlign: (key === "code" || key === "totalUsers" || key === "status") ? "center" : undefined }}>
                  {key === "name" ? (
                    <div className="flex items-center gap-9">
                      {/* Star toggle — filters the table to only starred agencies.
                          Filled when the filter is active, outlined otherwise.
                          Uses filterStatus === "Starred" for the toggle. */}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setFilterStatus(filterStatus === "Starred" ? "All" : "Starred");
                          setPage(1);
                        }}
                        title={filterStatus === "Starred" ? "Show all agencies" : "Show starred agencies"}
                        className="flex-shrink-0 transition-transform cursor-pointer"
                        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.15)")}
                        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                      >
                        <Star className="w-4 h-4" style={{ color: "#F59E0B", fill: filterStatus === "Starred" ? "#F59E0B" : "none" }} />
                      </button>
                      <span className="inline-flex items-center">
                        {label}
                        <SortIcon col="name" />
                      </span>
                    </div>
                  ) : key === "location" ? (
                    <>
                      <button onClick={e => { e.stopPropagation(); setLocationOpen(o => !o); }}
                        className="flex items-center gap-1 select-none cursor-pointer text-[11px] font-bold uppercase tracking-wider"
                        style={{ fontFamily: FONT, color: locationFilter.size > 0 ? "#A614C3" : c.muted }}>
                        Location<ChevronDown className="w-3 h-3 ml-0.5" />
                      </button>
                      {locationOpen && (() => {
                        const states = Array.from(new Set(allAgencies.map(a => a.state).filter(Boolean))).sort();
                        const toggleState = (s: string) => setLocationFilter(prev => { const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n; });
                        return (
                          <div className="absolute left-0 top-8 z-30 w-[240px] rounded-xl shadow-xl overflow-hidden normal-case tracking-normal"
                            style={{ background: c.cardBg, border: `1px solid ${c.border}`, fontWeight: 400, letterSpacing: "normal" }}
                            onClick={e => e.stopPropagation()}>
                            <div className="p-3" style={{ borderBottom: `1px solid ${c.border}` }}>
                              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ border: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB" }}>
                                <Search className="w-3.5 h-3.5" style={{ color: c.muted }} />
                                <input placeholder="Search State" value={locationSearch} onChange={e => setLocationSearch(e.target.value)}
                                  className="flex-1 outline-none text-[12px] bg-transparent normal-case tracking-normal" style={{ fontFamily: FONT, color: c.text }} />
                              </div>
                            </div>
                            <div className="py-1.5 max-h-[260px] overflow-y-auto">
                              {states.filter(s => !locationSearch || s.toLowerCase().includes(locationSearch.toLowerCase())).map(s => {
                                const checked = locationFilter.has(s);
                                return (
                                  <label key={s} className="flex items-center gap-2.5 px-4 py-2 cursor-pointer transition-colors normal-case tracking-normal"
                                    onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                    onClick={() => toggleState(s)}>
                                    <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0"
                                      style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>
                                      {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                    </div>
                                    <span className="text-[12px] font-normal" style={{ fontFamily: FONT, color: c.text }}>{s}</span>
                                  </label>
                                );
                              })}
                            </div>
                            <button onClick={() => { setLocationFilter(new Set()); setLocationSearch(""); }}
                              className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors normal-case tracking-normal"
                              style={{ fontFamily: FONT, color: "#A614C3", borderTop: `1px solid ${c.border}` }}
                              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                              <RefreshCw className="w-3.5 h-3.5" />Reset Filter
                            </button>
                          </div>
                        );
                      })()}
                    </>
                  ) : affIdx !== null ? (
                    <>
                      <button onClick={e => { e.stopPropagation(); setAffiliationOpen(o => o === affIdx ? null : affIdx); setLocationOpen(false); }}
                        className="flex items-center gap-1 select-none cursor-pointer text-[11px] font-bold uppercase tracking-wider"
                        style={{ fontFamily: FONT, color: affiliationFilter.size > 0 ? "#A614C3" : c.muted }}>
                        {label}<ChevronDown className="w-3 h-3 ml-0.5" />
                      </button>
                      {affiliationOpen === affIdx && (() => {
                        const allAffs = Array.from(new Set(allAgencies.flatMap(a => a.affiliations))).sort();
                        const toggleAff = (a: string) => setAffiliationFilter(prev => { const n = new Set(prev); n.has(a) ? n.delete(a) : n.add(a); return n; });
                        return (
                          <div className="absolute left-0 top-8 z-30 w-[260px] rounded-xl shadow-xl overflow-hidden normal-case tracking-normal"
                            style={{ background: c.cardBg, border: `1px solid ${c.border}`, fontWeight: 400, letterSpacing: "normal" }}
                            onClick={e => e.stopPropagation()}>
                            <div className="p-3" style={{ borderBottom: `1px solid ${c.border}` }}>
                              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ border: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB" }}>
                                <Search className="w-3.5 h-3.5" style={{ color: c.muted }} />
                                <input placeholder="Search Affiliation" value={affiliationSearch} onChange={e => setAffiliationSearch(e.target.value)}
                                  className="flex-1 outline-none text-[12px] bg-transparent normal-case tracking-normal" style={{ fontFamily: FONT, color: c.text }} />
                              </div>
                            </div>
                            <div className="py-1.5 max-h-[260px] overflow-y-auto">
                              {allAffs.filter(a => !affiliationSearch || a.toLowerCase().includes(affiliationSearch.toLowerCase())).map(a => {
                                const checked = affiliationFilter.has(a);
                                return (
                                  <label key={a} className="flex items-center gap-2.5 px-4 py-2 cursor-pointer transition-colors normal-case tracking-normal"
                                    onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                    onClick={() => toggleAff(a)}>
                                    <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0"
                                      style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>
                                      {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                    </div>
                                    <span className="text-[12px] font-normal truncate" style={{ fontFamily: FONT, color: c.text }} title={a}>{a}</span>
                                  </label>
                                );
                              })}
                            </div>
                            <button onClick={() => { setAffiliationFilter(new Set()); setAffiliationSearch(""); }}
                              className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors normal-case tracking-normal"
                              style={{ fontFamily: FONT, color: "#A614C3", borderTop: `1px solid ${c.border}` }}
                              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                              <RefreshCw className="w-3.5 h-3.5" />Reset Filter
                            </button>
                          </div>
                        );
                      })()}
                    </>
                  ) : key === "lastLogin" ? (
                    <>
                      <button onClick={e => { e.stopPropagation(); setActivityFilterOpen(o => !o); setLocationOpen(false); setAffiliationOpen(null); setAgencyNameOpen(false); }}
                        className="inline-flex items-center gap-1 select-none cursor-pointer text-[11px] font-bold uppercase tracking-wider"
                        style={{ fontFamily: FONT, color: activityFilter !== "all" || sortKey === "lastLogin" ? "#A614C3" : c.muted }}>
                        {label}
                        <ChevronDown className="w-3 h-3 ml-0.5" />
                      </button>
                      {activityFilterOpen && (() => {
                        const sortItem = (lab: string, dir: "asc" | "desc") => {
                          const active = sortKey === "lastLogin" && sortDir === dir;
                          return (
                            <button onClick={() => { setSortKey("lastLogin"); setSortDir(dir); setActivityFilterOpen(false); }}
                              className="w-full flex items-center gap-2.5 px-4 py-2 cursor-pointer transition-colors text-left normal-case tracking-normal"
                              style={{ fontFamily: FONT, color: active ? "#A614C3" : c.text, fontWeight: active ? 600 : 400 }}
                              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                              {dir === "asc"
                                ? <ChevronUp className="w-3.5 h-3.5 flex-shrink-0" />
                                : <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" />}
                              <span className="text-[12px] flex-1">{lab}</span>
                              {active && <svg width="9" height="7" viewBox="0 0 9 7" fill="none" className="flex-shrink-0"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                            </button>
                          );
                        };
                        const filterItem = (val: ActivityFilter, lab: string, hint: string) => {
                          const active = activityFilter === val;
                          return (
                            <button key={val} onClick={() => { setActivityFilter(val); setActivityFilterOpen(false); }}
                              className="w-full flex items-center gap-2.5 px-4 py-2 cursor-pointer transition-colors text-left normal-case tracking-normal"
                              style={{ fontFamily: FONT, background: active ? "rgba(168,85,247,0.06)" : "transparent" }}
                              onMouseEnter={e => { if (!active) e.currentTarget.style.background = c.hoverBg; }}
                              onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}>
                              <div className="flex items-center justify-center w-3.5 h-3.5 rounded-full flex-shrink-0"
                                style={{ border: `1.5px solid ${active ? "#A614C3" : c.borderStrong}`, background: c.cardBg }}>
                                {active && <div className="w-2 h-2 rounded-full" style={{ background: "#A614C3" }} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[12px] font-medium" style={{ fontFamily: FONT, color: active ? "#A614C3" : c.text }}>{lab}</div>
                                <div className="text-[11px]" style={{ fontFamily: FONT, color: c.muted }}>{hint}</div>
                              </div>
                            </button>
                          );
                        };
                        return (
                          <div className="absolute right-0 top-8 z-30 w-[260px] rounded-xl shadow-xl overflow-hidden normal-case tracking-normal"
                            style={{ background: c.cardBg, border: `1px solid ${c.border}`, fontWeight: 400, letterSpacing: "normal" }}
                            onClick={e => e.stopPropagation()}>
                            <div className="py-1.5">
                              {sortItem("Newest first", "desc")}
                              {sortItem("Oldest first", "asc")}
                            </div>
                            <div className="py-1.5" style={{ borderTop: `1px solid ${c.border}` }}>
                              <p className="text-[10px] font-semibold uppercase tracking-wider px-4 pt-1.5 pb-1" style={{ fontFamily: FONT, color: c.muted, letterSpacing: "0.06em" }}>Activity</p>
                              {filterItem("all",     "All agencies",  "No activity filter")}
                              {filterItem("new",     "New",           "Onboarded < 12 months ago")}
                              {filterItem("active",  "Active",        "Logged in within 12 months")}
                              {filterItem("dormant", "Dormant",       "No login for > 12 months")}
                            </div>
                            {activityFilter !== "all" && (
                              <button onClick={() => { setActivityFilter("all"); setActivityFilterOpen(false); }}
                                className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors normal-case tracking-normal"
                                style={{ fontFamily: FONT, color: "#A614C3", borderTop: `1px solid ${c.border}` }}
                                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                                <RefreshCw className="w-3.5 h-3.5" />Reset Filter
                              </button>
                            )}
                          </div>
                        );
                      })()}
                    </>
                  ) : (
                    <>{label}{sortable && key && <SortIcon col={key} />}</>
                  )}
                </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paginated.map((a, i) => (
              <tr key={a.id} className="cursor-pointer transition-colors"
                style={{ borderBottom: `1px solid ${c.border}` }}
                onClick={() => setSelectedAgency(getDetail(a))}
                onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                {/* Agency Name */}
                <td className="py-3 pr-6" style={{ paddingLeft: 20 }}>
                  <div className="flex items-center gap-9">
                    <button onClick={e => { e.stopPropagation(); toggleStar(a.id); setSelectedAgency(null); }}
                      className="flex-shrink-0 transition-all"
                      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.15)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
                      <Star className="w-4 h-4" style={{ color: "#F59E0B", fill: stars.has(a.id) ? "#F59E0B" : "none" }} />
                    </button>
                    <span className="text-[13px] font-semibold whitespace-nowrap" style={{ fontFamily: FONT, color: c.text }}>{a.name}</span>
                  </div>
                </td>
                {/* Agency Code */}
                {!agenciesHiddenCols.has("code") && (
                <td className="py-3 pr-6 text-center">
                  <span className="text-[12px] font-semibold" style={{ fontFamily: FONT, color: isDark ? "#74C3B7" : "#A614C3" }}>{a.code}</span>
                </td>
                )}
                {/* Location */}
                {!agenciesHiddenCols.has("location") && (
                <td className="py-3 pr-6 whitespace-nowrap" style={{ paddingLeft: 36 }}>
                  <span className="text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>{a.city}, {a.state}</span>
                </td>
                )}
                {/* Affiliation 1 / 2 / 3 */}
                {[0, 1, 2].filter(i => !agenciesHiddenCols.has(`aff${i + 1}`)).map(i => (
                  <td key={`aff-${i}`} className="py-3 pr-6" style={{ paddingLeft: i === 0 ? 26 : 36 }}>
                    <span className="text-[13px] truncate block" style={{ fontFamily: FONT, color: a.affiliations[i] ? c.text : c.muted }}
                      title={a.affiliations[i] || ""}>
                      {a.affiliations[i] || "—"}
                    </span>
                  </td>
                ))}
                {/* Total User — click to jump straight to the agency's Users tab */}
                {!agenciesHiddenCols.has("totalUsers") && (
                <td className="py-3 pr-6 whitespace-nowrap text-center" style={{ paddingLeft: 45 }}>
                  <button onClick={e => { e.stopPropagation(); setSelectedAgencyTab("users"); setSelectedAgency(getDetail(a)); }}
                    title={`View ${a.totalUsers} ${a.totalUsers === 1 ? "user" : "users"}`}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors"
                    onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <Users className="w-3.5 h-3.5 flex-shrink-0" style={{ color: c.muted }} />
                    <span className="text-[13px] font-medium underline-offset-2 hover:underline" style={{ fontFamily: FONT, color: "#A614C3" }}>{a.totalUsers}</span>
                  </button>
                </td>
                )}
                {/* Last Login */}
                {!agenciesHiddenCols.has("lastLogin") && (
                <td className="py-3 pr-6 whitespace-nowrap" style={{ paddingLeft: 96 }}>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px]" style={{ fontFamily: FONT, color: c.muted, fontVariantNumeric: "tabular-nums", display: "inline-block", minWidth: 78 }}>{a.lastLogin}</span>
                    <TimeStatusBadge status={getAgencyTimeStatus(getDetail(a).apptDate, a.lastLogin)} isDark={isDark} />
                  </div>
                </td>
                )}
                {/* Status */}
                {!agenciesHiddenCols.has("status") && (
                <td className="py-3 pr-6 text-center" style={{ paddingLeft: 45 }}><StatusBadge status={a.status} /></td>
                )}
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={9 - agenciesHiddenCols.size} className="py-16 text-center text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>
                  No agencies found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      )}

      {/* Affiliations tab content — master/detail layout */}
      {tab === "affiliations" && (() => {
        // KPI-card status filter — `affStatKey` is set when the user taps one of the
        // Total / New / Appointed / Unappointed cards. Reused here to narrow the
        // agencies inside each affiliation row (and drop rows that empty out).
        // `cutoff` / `parseLast` are redeclared locally because the KPI IIFE that
        // originally defined them isn't in scope from this block.
        const now = new Date();
        const cutoff = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        const parseLast = (s: string) => { const d = new Date(s); return isNaN(d.getTime()) ? new Date(0) : d; };
        const statusMatches = (a: Agency) => {
          if (affStatKey === "All")         return true;
          if (affStatKey === "New")         return parseLast(a.lastLogin) >= cutoff;
          if (affStatKey === "Appointed")   return a.status === "Appointed";
          if (affStatKey === "Unappointed") return a.status === "Unappointed";
          return true;
        };
        const affMap = new Map<string, Agency[]>();
        for (const a of allAgencies) {
          for (const aff of a.affiliations) {
            if (!affMap.has(aff)) affMap.set(aff, []);
            affMap.get(aff)!.push(a);
          }
        }
        const q = search.trim().toLowerCase();
        const allAffRows = Array.from(affMap.entries())
          .map(([name, ags]) => {
            const kept = ags.filter(statusMatches);
            return { name, agencies: kept, count: kept.length };
          })
          .filter(r => r.count > 0) // drop affiliations that emptied out under the KPI filter
          .filter(r => !q || r.name.toLowerCase().includes(q) || r.agencies.some(a => a.name.toLowerCase().includes(q)))
          .sort((a, b) => a.name.localeCompare(b.name));
        // When user has multi-selected via the filter, narrow the list and (for 2+) show a combined view on the right.
        const affRows = affListFilter.size === 0 ? allAffRows : allAffRows.filter(r => affListFilter.has(r.name));
        const multiMode = affListFilter.size >= 2;
        const activeAff = !multiMode && selectedAff && affRows.find(r => r.name === selectedAff)
          ? selectedAff
          : (!multiMode ? (affRows[0]?.name ?? null) : null);
        const activeRow = activeAff ? affRows.find(r => r.name === activeAff) : null;
        const combinedAgencies = multiMode
          ? Array.from(new Map(affRows.flatMap(r => r.agencies).map(a => [a.id, a])).values())
              .sort((a, b) => a.name.localeCompare(b.name))
          : [];
        return (
          <div className="flex-1 flex min-h-0 mt-0 overflow-hidden">
            {/* LEFT: affiliation list */}
            <div className="flex flex-col flex-shrink-0" style={{ width: 280, borderRight: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.02)" : "#FAFAFA" }}>
              <div className="px-4 py-2.5 flex items-center justify-between flex-shrink-0 relative" style={{ borderBottom: `1px solid ${c.border}` }} onClick={e => e.stopPropagation()}>
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ fontFamily: FONT, color: c.muted }}>Affiliations</span>
                <button onClick={() => setAffListFilterOpen(o => !o)}
                  title="Filter affiliations"
                  className="p-1 rounded transition-colors"
                  style={{ color: affListFilter.size > 0 ? "#A614C3" : c.muted }}
                  onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <Filter className="w-3.5 h-3.5" />
                </button>
                {affListFilterOpen && (
                  <div className="absolute right-2 top-9 z-30 w-[260px] rounded-xl shadow-xl overflow-hidden normal-case tracking-normal"
                    style={{ background: c.cardBg, border: `1px solid ${c.border}` }}
                    onClick={e => e.stopPropagation()}>
                    <div className="p-3" style={{ borderBottom: `1px solid ${c.border}` }}>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ border: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB" }}>
                        <Search className="w-3.5 h-3.5" style={{ color: c.muted }} />
                        <input placeholder="Search Affiliation" value={affListFilterSearch} onChange={e => setAffListFilterSearch(e.target.value)}
                          className="flex-1 outline-none text-[12px] bg-transparent normal-case tracking-normal" style={{ fontFamily: FONT, color: c.text }} />
                      </div>
                    </div>
                    <div className="py-1.5 max-h-[260px] overflow-y-auto">
                      {allAffRows
                        .filter(r => !affListFilterSearch || r.name.toLowerCase().includes(affListFilterSearch.toLowerCase()))
                        .map(r => {
                          const checked = affListFilter.has(r.name);
                          return (
                            <label key={r.name} className="flex items-center gap-2.5 px-4 py-2 cursor-pointer transition-colors normal-case tracking-normal"
                              onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                              onClick={() => setAffListFilter(prev => { const s = new Set(prev); s.has(r.name) ? s.delete(r.name) : s.add(r.name); return s; })}>
                              <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0"
                                style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>
                                {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                              </div>
                              <span className="text-[12px] font-normal truncate" style={{ fontFamily: FONT, color: c.text }} title={r.name}>{r.name}</span>
                              <span className="text-[10px] flex-shrink-0 ml-auto px-1.5 py-0.5 rounded-full"
                                style={{ background: isDark ? "rgba(255,255,255,0.06)" : "#E5E7EB", color: c.muted }}>{r.count}</span>
                            </label>
                          );
                        })}
                    </div>
                    <button onClick={() => { setAffListFilter(new Set()); setAffListFilterSearch(""); }}
                      className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors normal-case tracking-normal"
                      style={{ fontFamily: FONT, color: "#A614C3", borderTop: `1px solid ${c.border}` }}
                      onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <RefreshCw className="w-3.5 h-3.5" />Reset Filter
                    </button>
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-y-auto">
                {affRows.length === 0 && (
                  <p className="px-4 py-8 text-center text-[12px]" style={{ fontFamily: FONT, color: c.muted }}>No matches</p>
                )}
                {affRows.map(r => {
                  const on = r.name === activeAff;
                  return (
                    <button key={r.name} onClick={() => setSelectedAff(r.name)}
                      className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-left transition-colors"
                      style={{ fontFamily: FONT,
                        background: on ? (isDark ? "rgba(168,85,247,0.10)" : "#fff") : "transparent",
                        borderLeft: on ? "3px solid #A855F7" : "3px solid transparent",
                        paddingLeft: on ? 13 : 16 }}
                      onMouseEnter={e => { if (!on) e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.04)" : "#F3F4F6"; }}
                      onMouseLeave={e => { if (!on) e.currentTarget.style.background = "transparent"; }}>
                      <span className="text-[13px] font-medium truncate"
                        style={{ color: on ? (isDark ? "#fff" : "#A614C3") : c.text }}>{r.name}</span>
                      <span className="text-[11px] font-semibold flex-shrink-0 px-1.5 py-0.5 rounded-full"
                        style={{ background: on ? "rgba(168,85,247,0.18)" : (isDark ? "rgba(255,255,255,0.06)" : "#E5E7EB"),
                          color: on ? "#A855F7" : c.muted }}>{r.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* RIGHT: agencies in selected affiliation (single) OR union of selected affiliations (multi) */}
            <div className="flex-1 flex flex-col min-w-0">
              {!activeRow && !multiMode ? (
                <div className="flex-1 flex items-center justify-center text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>
                  Select an affiliation to see its agencies.
                </div>
              ) : (() => {
                const headerName = multiMode
                  ? Array.from(affListFilter).sort().join(" + ")
                  : activeRow!.name;
                const rowsToRender = multiMode ? combinedAgencies : activeRow!.agencies;
                const count = rowsToRender.length;
                return (
                <>
                  <div className="px-6 py-3 flex items-center justify-between flex-shrink-0" style={{ borderBottom: `1px solid ${c.border}`, background: c.cardBg }}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Network className="w-4 h-4 flex-shrink-0" style={{ color: "#A855F7" }} />
                      <h3 className="text-[14px] font-bold truncate" style={{ fontFamily: FONT, color: c.text }} title={headerName}>{headerName}</h3>
                      <span className="text-[12px] flex-shrink-0" style={{ fontFamily: FONT, color: c.muted }}>· {count} {count === 1 ? "agency" : "agencies"}{multiMode ? ` across ${affListFilter.size} affiliations` : ""}</span>
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto" style={{ scrollbarGutter: "stable" }}>
                    <table className="text-left border-collapse" style={{ minWidth: "100%" }}>
                      <thead className="sticky top-0 z-10" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#FAFAFB" }}>
                        <tr style={{ borderBottom: `1px solid ${c.border}` }}>
                          <th className="text-[11px] font-bold uppercase tracking-wider py-3 pr-6 whitespace-nowrap"
                            style={{ fontFamily: FONT, color: c.muted, paddingLeft: 24 }}>Agency Name</th>
                          {AFFILIATIONS_COLS.filter(col => affVisibleCols.has(col.key)).map(col => (
                            <th key={col.key} className="text-[11px] font-bold uppercase tracking-wider py-3 pr-6 whitespace-nowrap"
                              style={{ fontFamily: FONT, color: c.muted, textAlign: col.key === "totalUsers" ? "center" : undefined }}>{col.label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rowsToRender.map(a => {
                          const d = getDetail(a);
                          const renderCell = (key: string) => {
                            switch (key) {
                              case "code":       return <span className="text-[12px] font-semibold" style={{ fontFamily: FONT, color: isDark ? "#74C3B7" : "#A614C3" }}>{a.code}</span>;
                              case "location":   return <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: c.muted }} /><span className="text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>{a.city || "—"}{a.state ? `, ${a.state}` : ""}</span></div>;
                              case "status":     return <StatusBadge status={a.status} />;
                              case "lastLogin":  return <span className="text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>{a.lastLogin}</span>;
                              case "contact":    return <span className="text-[13px]" style={{ fontFamily: FONT, color: c.text }}>{d.contact || "—"}</span>;
                              case "phone":      return <span className="text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>{d.phone || "—"}</span>;
                              case "email":      return <span className="text-[13px] truncate block" style={{ fontFamily: FONT, color: c.muted }} title={d.contactEmail || ""}>{d.contactEmail || "—"}</span>;
                              case "totalUsers": return <div className="inline-flex items-center gap-1.5"><Users className="w-3.5 h-3.5 flex-shrink-0" style={{ color: c.muted }} /><span className="text-[13px] font-medium" style={{ fontFamily: FONT, color: c.text }}>{a.totalUsers}</span></div>;
                              default: return null;
                            }
                          };
                          return (
                            <tr key={a.id} className="cursor-pointer transition-colors"
                              style={{ borderBottom: `1px solid ${c.border}` }}
                              onClick={() => setSelectedAgency(getDetail(a))}
                              onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB")}
                              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                              <td className="py-3 pr-6" style={{ paddingLeft: 24 }}>
                                <span className="text-[13px] font-semibold whitespace-nowrap" style={{ fontFamily: FONT, color: c.text }}>{a.name}</span>
                              </td>
                              {AFFILIATIONS_COLS.filter(col => affVisibleCols.has(col.key)).map(col => (
                                <td key={col.key} className="py-3 pr-6 whitespace-nowrap" style={{ textAlign: col.key === "totalUsers" ? "center" : undefined }}>{renderCell(col.key)}</td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
                );
              })()}
            </div>
          </div>
        );
      })()}

      {/* All Users tab content */}
      {tab === "users" && (() => {
        const teal = isDark ? "#A78BFA" : "#73C9B7";
        const q = search.trim().toLowerCase();
        const agencyById = new Map(allAgencies.map(a => [a.id, a]));
        const matchesQuery = (u: typeof mockAgencyUsers[number]) => !q
          || u.name.toLowerCase().includes(q)
          || u.email.toLowerCase().includes(q)
          || u.jobTitle.toLowerCase().includes(q)
          || (agencyById.get(u.agencyId)?.name.toLowerCase().includes(q) ?? false);
        const matchesJobFilter = (u: typeof mockAgencyUsers[number]) =>
          allUsersJobFilter.size === 0 || allUsersJobFilter.has(u.jobTitle);
        // Hide removed users entirely. Hide inactive users by default unless allUsersShowInactive is true.
        const userRowsAll = mockAgencyUsers
          .filter(u => !removedUserIds.has(u.id))
          .filter(u => allUsersShowInactive || !inactiveUserIds.has(u.id))
          .filter(matchesQuery)
          .filter(matchesJobFilter)
          .sort((a, b) => allUsersSortDir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
        const userRows = userRowsAll.slice((page - 1) * perPage, page * perPage);
        // Count how many inactive users would match the same query/filters — used for both the
        // empty-state banner (orange, when 0 active) and the inline hint (subtle gray, when ≥1 active).
        const inactiveMatchCount = !allUsersShowInactive && q
          ? mockAgencyUsers.filter(u => !removedUserIds.has(u.id) && inactiveUserIds.has(u.id) && matchesQuery(u) && matchesJobFilter(u)).length
          : 0;
        const toggleJob = (t: string) => {
          setAllUsersJobFilter(prev => { const s = new Set(prev); s.has(t) ? s.delete(t) : s.add(t); return s; });
        };
        const sub = isDark ? "#6B7280" : "#9CA3AF";
        return (
          <div className="flex-1 overflow-x-hidden overflow-y-auto mt-0" onClick={() => { setAllUsersJobOpen(false); setViewOpen(false); }}>
            {/* Inline hint — shown only when active list has matches AND inactive also has matches.
                Empty-state (0 active) keeps the orange banner inside the table body. */}
            {inactiveMatchCount > 0 && userRowsAll.length > 0 && (
              <div className="px-[52px] py-2.5 flex items-center gap-2 text-[12px]"
                style={{ fontFamily: FONT, color: c.text, background: c.cardBg, borderBottom: `1px solid ${c.border}` }}>
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#A614C3" }} />
                <span>Showing <button onClick={() => setAllUsersShowInactive(true)}
                  className="font-semibold transition-colors underline underline-offset-2"
                  style={{ color: "#A614C3" }}>{inactiveMatchCount} {inactiveMatchCount === 1 ? "user" : "users"} matching in archive</button>.</span>
              </div>
            )}
            <table className="w-full text-left border-collapse" style={{ tableLayout: "fixed" }}>
              <thead className="sticky top-0 z-10" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "#FAFAFB" }}>
                <tr style={{ borderBottom: `1px solid ${c.border}` }}>
                  {/* NAME (sortable) */}
                  <th className="text-[11px] font-bold uppercase tracking-wider py-3 pr-6 cursor-pointer select-none whitespace-nowrap"
                    style={{ fontFamily: FONT, color: c.muted, width: "16%", paddingLeft: 52 }}
                    onClick={() => setAllUsersSortDir(d => d === "asc" ? "desc" : "asc")}>
                    Name
                    <span className="inline-flex items-center ml-1 flex-shrink-0" style={{ verticalAlign: "middle", gap: 1 }}>
                      <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
                        <path d="M3.5 9V2M3.5 2L1.5 4M3.5 2L5.5 4" stroke={allUsersSortDir === "asc" ? c.text : sub} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
                        <path d="M3.5 1V8M3.5 8L1.5 6M3.5 8L5.5 6" stroke={allUsersSortDir === "desc" ? c.text : sub} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </th>
                  {!usersHiddenCols.has("admin") && (
                  <th className="text-[11px] font-bold uppercase tracking-wider py-3 pr-6 select-none whitespace-nowrap text-center"
                    style={{ fontFamily: FONT, color: c.muted, width: "10%", paddingRight: 50 }}>Admin</th>
                  )}
                  {/* JOB TITLE filter */}
                  {!usersHiddenCols.has("jobTitle") && (
                  <th className="text-[11px] font-bold uppercase tracking-wider py-3 pr-6 select-none whitespace-nowrap relative"
                    style={{ fontFamily: FONT, color: allUsersJobFilter.size > 0 ? "#A614C3" : c.muted, width: "14%", paddingLeft: 25 }}>
                    <button onClick={e => { e.stopPropagation(); setAllUsersJobOpen(o => !o); }}
                      className="flex items-center gap-1 select-none cursor-pointer text-[11px] font-bold uppercase tracking-wider"
                      style={{ fontFamily: FONT, color: allUsersJobFilter.size > 0 ? "#A614C3" : c.muted }}>
                      Job title<ChevronDown className="w-3 h-3 ml-0.5" />
                    </button>
                    {allUsersJobOpen && (
                      <div className="absolute left-0 top-8 z-30 w-[240px] rounded-xl shadow-xl overflow-hidden normal-case tracking-normal"
                        style={{ background: c.cardBg, border: `1px solid ${c.border}`, fontWeight: 400, letterSpacing: "normal" }}
                        onClick={e => e.stopPropagation()}>
                        <div className="p-3" style={{ borderBottom: `1px solid ${c.border}` }}>
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ border: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB" }}>
                            <Search className="w-3.5 h-3.5" style={{ color: c.muted }} />
                            <input placeholder="Search Title" value={allUsersJobSearch} onChange={e => setAllUsersJobSearch(e.target.value)}
                              className="flex-1 outline-none text-[12px] bg-transparent normal-case tracking-normal" style={{ fontFamily: FONT, color: c.text }} />
                          </div>
                        </div>
                        <div className="py-1.5 max-h-[260px] overflow-y-auto">
                          {ALL_JOB_TITLES.filter(t => !allUsersJobSearch || t.toLowerCase().includes(allUsersJobSearch.toLowerCase())).map(t => {
                            const checked = allUsersJobFilter.has(t);
                            return (
                              <label key={t} className="flex items-center gap-2.5 px-4 py-2 cursor-pointer transition-colors normal-case tracking-normal"
                                onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                                onClick={() => toggleJob(t)}>
                                <div className="flex items-center justify-center w-4 h-4 rounded flex-shrink-0"
                                  style={{ border: `1.5px solid ${c.borderStrong}`, background: c.cardBg }}>
                                  {checked && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#A614C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                </div>
                                <span className="text-[12px] font-normal" style={{ fontFamily: FONT, color: c.text }}>{t}</span>
                              </label>
                            );
                          })}
                        </div>
                        <button onClick={() => { setAllUsersJobFilter(new Set()); setAllUsersJobSearch(""); }}
                          className="w-full flex items-center justify-center gap-2 py-3 text-[12px] font-semibold transition-colors normal-case tracking-normal"
                          style={{ fontFamily: FONT, color: "#A614C3", borderTop: `1px solid ${c.border}` }}
                          onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                          <RefreshCw className="w-3.5 h-3.5" />Reset Filter
                        </button>
                      </div>
                    )}
                  </th>
                  )}
                  {!usersHiddenCols.has("email") && (
                  <th className="text-[11px] font-bold uppercase tracking-wider py-3 pr-6 select-none whitespace-nowrap"
                    style={{ fontFamily: FONT, color: c.muted, width: "24%", paddingLeft: 42 }}>Email</th>
                  )}
                  {!usersHiddenCols.has("phone") && (
                  <th className="text-[11px] font-bold uppercase tracking-wider py-3 pr-6 select-none whitespace-nowrap"
                    style={{ fontFamily: FONT, color: c.muted, width: "14%" }}>
                    <span style={{ display: "inline-block", marginLeft: -20 }}>Phone</span>
                  </th>
                  )}
                  {!usersHiddenCols.has("ext") && (
                  <th className="text-[11px] font-bold uppercase tracking-wider py-3 pr-6 select-none whitespace-nowrap text-center"
                    style={{ fontFamily: FONT, color: c.muted, width: "10%", paddingLeft: 0, paddingRight: 120 }}>Ext</th>
                  )}
                  {!usersHiddenCols.has("agency") && (
                  <th className="text-[11px] font-bold uppercase tracking-wider py-3 pr-6 select-none whitespace-nowrap text-left"
                    style={{ fontFamily: FONT, color: c.muted, width: "12%" }}>Agency</th>
                  )}
                  {!usersHiddenCols.has("status") && (
                  <th className="text-[11px] font-bold uppercase tracking-wider py-3 pr-6 select-none whitespace-nowrap text-center"
                    style={{ fontFamily: FONT, color: c.muted, width: "10%" }}>Status</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {userRows.length === 0 ? (
                  <tr>
                    <td colSpan={8 - usersHiddenCols.size} className="py-16 text-center" style={{ fontFamily: FONT }}>
                      <div className="flex flex-col items-center justify-center gap-3">
                        <span className="text-[13px]" style={{ color: c.muted }}>No users found</span>
                      </div>
                    </td>
                  </tr>
                ) : userRows.map(u => {
                  const ag = agencyById.get(u.agencyId);
                  const isPrincipal = u.jobTitle === "Principal";
                  const isInactive = inactiveUserIds.has(u.id);
                  return (
                    <tr key={u.id} className="cursor-pointer transition-colors"
                      style={{ borderBottom: `1px solid ${c.border}`, opacity: isInactive ? 0.5 : 1 }}
                      onClick={() => ag && setSelectedAgency(getDetail(ag))}
                      onMouseEnter={e => (e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.03)" : "#F9FAFB")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <td className="py-3 pr-6 relative" style={{ paddingLeft: 52 }}>
                        {isPrincipal && (
                          <div className="absolute" style={{ left: 0, top: 0, bottom: 0, width: 3, background: "#A614C3" }} />
                        )}
                        <span className="text-[13px] font-semibold whitespace-nowrap" style={{ fontFamily: FONT, color: c.text }}>{u.name}</span>
                      </td>
                      {!usersHiddenCols.has("admin") && (
                      <td className="py-3 text-center" style={{ paddingRight: 50 }}>
                        {u.isAdmin ? (
                          <GradientUserCog size={16} />
                        ) : (
                          <span className="text-[12px]" style={{ fontFamily: FONT, color: c.muted }}>—</span>
                        )}
                      </td>
                      )}
                      {!usersHiddenCols.has("jobTitle") && (
                      <td className="py-3 pr-6 whitespace-nowrap" style={{ paddingLeft: 25 }}>
                        <span className="text-[13px]" style={{ fontFamily: FONT, color: c.text }}>{u.jobTitle}</span>
                      </td>
                      )}
                      {!usersHiddenCols.has("email") && (
                      <td className="py-3 pr-6 truncate" style={{ paddingLeft: 42 }}>
                        <span className="text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>{u.email}</span>
                      </td>
                      )}
                      {!usersHiddenCols.has("phone") && (
                      <td className="py-3 pr-6 whitespace-nowrap">
                        <span className="text-[13px] inline-block" style={{ fontFamily: FONT, color: c.text, marginLeft: -20 }}>{u.phone}</span>
                      </td>
                      )}
                      {!usersHiddenCols.has("ext") && (
                      <td className="py-3 whitespace-nowrap text-center" style={{ paddingLeft: 0, paddingRight: 120 }}>
                        <span className="text-[13px]" style={{ fontFamily: FONT, color: c.muted }}>{u.ext || "—"}</span>
                      </td>
                      )}
                      {!usersHiddenCols.has("agency") && (
                      <td className="py-3 pr-6 truncate text-left">
                        <span className="text-[12px] font-semibold" style={{ fontFamily: FONT, color: isDark ? "#74C3B7" : "#A614C3" }}>{ag?.name ?? "—"}</span>
                      </td>
                      )}
                      {!usersHiddenCols.has("status") && (() => {
                        const showInactive = isInactive || statusInactiveUserIds.has(u.id);
                        const bg = showInactive ? (isDark ? "rgba(255,255,255,0.08)" : "#F3F4F6") : "rgba(115,201,183,0.15)";
                        const fg = showInactive ? c.muted : "#73C9B7";
                        return (
                          <td className="py-3 pr-6 text-center">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded inline-block"
                              style={{ fontFamily: FONT, background: bg, color: fg, letterSpacing: "0.04em" }}>
                              {showInactive ? "Inactive" : "Active"}
                            </span>
                          </td>
                        );
                      })()}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      })()}

      {/* Pagination — Agencies & All Users tabs. Matches the Clients / Quotes
          / Policies pattern: left-hand "X – Y of N …" count, right-hand page-
          size popover + Previous / Next buttons. No grey band, no page-number
          chips — leaner, and consistent across the app. */}
      {(tab === "agencies" || tab === "users") && (() => {
        const totalCount = tab === "users" ? filteredUsersCount : filtered.length;
        const rangeStart = totalCount === 0 ? 0 : (page - 1) * perPage + 1;
        const rangeEnd   = Math.min(page * perPage, totalCount);
        const noun       = tab === "users" ? (totalCount === 1 ? "user" : "users")
                                            : (totalCount === 1 ? "agency" : "agencies");
        const atFirst = page === 1;
        const atLast  = page >= totalPages || totalCount === 0;
        return (
          <div className="flex-shrink-0 flex items-center justify-between gap-3 px-5 py-3 flex-wrap mt-auto"
            style={{ borderTop: `1px solid ${c.border}`, fontFamily: FONT }}>
            <span className="text-[11.5px]" style={{ color: c.muted }}>
              {rangeStart} – {rangeEnd} of {totalCount} {noun}
            </span>
            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
              {/* Page-size selector — custom popover matching Clients / Quotes. */}
              <div className="relative">
                <button
                  onClick={() => setPerPageOpen(o => !o)}
                  className="flex items-center gap-1.5 pl-2.5 pr-2 py-1.5 rounded-lg cursor-pointer transition-colors text-[11.5px] font-medium"
                  style={{ background: c.cardBg, border: `1px solid ${c.border}`, color: c.text }}
                  onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = c.cardBg)}>
                  1 – {perPage}
                  <ChevronDown className="w-3 h-3 transition-transform duration-200" style={{ opacity: 0.6, transform: perPageOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                </button>
                {perPageOpen && (
                  <div
                    className="absolute right-0 z-30 rounded-lg overflow-hidden py-1 min-w-[110px]"
                    style={{
                      bottom: "calc(100% + 6px)",
                      background: c.cardBg,
                      border: `1px solid ${c.border}`,
                      boxShadow: "0 12px 28px rgba(15,23,42,0.10), 0 4px 8px rgba(15,23,42,0.04)",
                    }}>
                    {[10, 20, 50].map(n => {
                      const active = perPage === n;
                      return (
                        <button
                          key={n}
                          onClick={() => { setPerPage(n); setPage(1); setPerPageOpen(false); }}
                          className="w-full px-2.5 py-1.5 text-left text-[11.5px] flex items-center gap-2 cursor-pointer transition-colors"
                          style={{ color: active ? "#A614C3" : c.text, fontWeight: active ? 600 : 500, background: "transparent" }}
                          onMouseEnter={e => (e.currentTarget.style.background = c.hoverBg)}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                          <Check className="w-3 h-3 flex-shrink-0" style={{ opacity: active ? 1 : 0, color: "#A614C3" }} />
                          <span className="whitespace-nowrap">1 – {n}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={atFirst}
                className="text-[11.5px] font-medium px-3 py-1.5 rounded-lg transition-colors"
                style={{ border: `1px solid ${c.border}`, color: c.text, background: c.cardBg, opacity: atFirst ? 0.5 : 1, cursor: atFirst ? "not-allowed" : "pointer" }}
                onMouseEnter={e => { if (!atFirst) e.currentTarget.style.background = c.hoverBg; }}
                onMouseLeave={e => (e.currentTarget.style.background = c.cardBg)}>
                Previous
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={atLast}
                className="text-[11.5px] font-medium px-3 py-1.5 rounded-lg transition-colors"
                style={{ border: `1px solid ${c.border}`, color: c.text, background: c.cardBg, opacity: atLast ? 0.5 : 1, cursor: atLast ? "not-allowed" : "pointer" }}
                onMouseEnter={e => { if (!atLast) e.currentTarget.style.background = c.hoverBg; }}
                onMouseLeave={e => (e.currentTarget.style.background = c.cardBg)}>
                Next
              </button>
            </div>
          </div>
        );
      })()}

      </div>
    </div>
  );
}
