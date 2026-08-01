// ── ROACHWATCH SHARED DATA ──────────────────────────
// Creator: Arpit Mishra
// Auto-read by chat.js for RoachBot context
// Update this file → bot automatically knows updated data

const SITE_INFO = {
  name: "RoachWatch",
  creator: "Arpit Mishra",
  creatorAge: 15,
  creatorClass: "Class 10, St. John Vianney School, Lucknow",
  url: "https://roachwatch.vercel.app",
  tagline: "Tracking the rot since 2026",
  description: "RoachWatch tracks broken government promises, exam paper leaks, and governance failures in India since 2014.",
  lastSweep: "August 2026",
  indiaGDPRank: "6th largest (nominal, IMF April 2026) — $4.15 trillion. Slipped from 5th due to rupee depreciation. Still #3 on PPP basis. Fastest growing major economy at 6.5%.",
};

const PROMISES_SUMMARY = {
  broken: 10,
  pending: 4,
  badly: 12,
  kept: 3,
  total: 29,
  period: "2014-2026",
};

const LEAKS_SUMMARY = [
  { title: "NEET UG 2026", date: "May 2026", affected: "22.79 lakh", severity: "high", detail: "Guess paper with ~120/410 questions circulated weeks before exam. Cancelled May 12 after CBI probe. Re-test ordered." },
  { title: "NEET UG 2024", date: "May 2024", affected: "24 lakh", severity: "high", detail: "Papers leaked in Bihar and Rajasthan on Telegram. 67 scored perfect 720. NTA chairperson resigned. CBI arrests." },
  { title: "UGC NET 2024", date: "June 2024", affected: "9 lakh", severity: "high", detail: "Papers on dark web Telegram. Cancelled within 24 hours of completion." },
  { title: "UP Police Constable 2024", date: "Feb 2024", affected: "48 lakh", severity: "high", detail: "Papers online within hours. One of the largest exam cancellations in Indian history." },
  { title: "UPPSC RO/ARO 2024", date: "Feb 2024", affected: "Lakhs", severity: "high", detail: "Paper leaked via WhatsApp the night before exam." },
  { title: "Bihar BPSC 70th 2024", date: "Dec 2024", affected: "Lakhs", severity: "high", detail: "Mass cheating and paper leak claims. Massive student protests in Patna." },
  { title: "REET 2021", date: "Sept 2021", affected: "16 lakh", severity: "high", detail: "Organised cheating rings. 30,000+ FIRs. Exam declared invalid." },
  { title: "SSC CGL 2017", date: "2017", affected: "Lakhs", severity: "high", detail: "Nationwide protests. Cancelled and rescheduled multiple times." },
  { title: "HSSC Group D 2022", date: "2022", affected: "Lakhs", severity: "high", detail: "Haryana Staff Selection Commission. Multiple arrests." },
  { title: "MP TET 2023", date: "2023", affected: "Thousands", severity: "mid", detail: "Vyapam-linked exam. 12 arrested." },
  { title: "CSIR UGC NET 2024", date: "June 2024", affected: "Lakhs", severity: "mid", detail: "Postponed citing integrity concerns during UGC NET leak period." },
  { title: "Bihar SSC Inter-Level 2023", date: "2023", affected: "Lakhs", severity: "mid", detail: "Cancelled. No refund for students who travelled." },
  { title: "Jharkhand JPSC 2023", date: "2023", affected: "Thousands", severity: "mid", detail: "Leaked before exam. Statewide protests." },
  { title: "AIIMS MBBS 2018", date: "2018", affected: "Thousands", severity: "mid", detail: "Paper circulation alleged. Inquiry ordered, no cancellation." },
];

const MINISTRIES = [
  { name: "Ministry of Home Affairs", minister: "Shri Amit Shah", budget: "₹2,55,234 Crore", pct: 4.8 },
  { name: "Ministry of Defence", minister: "Shri Rajnath Singh", budget: "₹7,84,678 Crore", pct: 14.7 },
  { name: "Ministry of Finance", minister: "Smt. Nirmala Sitharaman", budget: "Controls ₹53,47,315 Crore total", pct: 100 },
  { name: "Ministry of Education", minister: "Shri Pralhad Joshi (additional charge since July 25, 2026 — Dharmendra Pradhan resigned over NEET 2026 protests)", budget: "₹1,39,000 Crore", pct: 2.6 },
  { name: "Ministry of Health and Family Welfare", minister: "Shri Jagat Prakash Nadda", budget: "₹1,06,000 Crore", pct: 2.0 },
  { name: "Ministry of Road Transport and Highways", minister: "Shri Nitin Gadkari", budget: "₹3,09,875 Crore", pct: 5.8 },
  { name: "Ministry of Railways", minister: "Shri Ashwini Vaishnaw", budget: "₹2,78,000 Crore", pct: 5.2 },
  { name: "Ministry of External Affairs", minister: "Dr. S. Jaishankar", budget: "₹22,155 Crore", pct: 0.4 },
  { name: "Ministry of Electronics & Information Technology", minister: "Shri Ashwini Vaishnaw", budget: "₹21,633 Crore", pct: 0.4 },
  { name: "Ministry of Environment, Forest and Climate Change", minister: "Shri Bhupender Yadav", budget: "₹4,413 Crore", pct: 0.08 },
];

module.exports = { SITE_INFO, PROMISES_SUMMARY, LEAKS_SUMMARY, MINISTRIES };
