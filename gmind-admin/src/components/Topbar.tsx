"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, { title: string; sub: string }> = {
  "/dashboard": { title: "Dashboard", sub: "Live operating view for GMind events team management." },
  "/team": { title: "Team Database", sub: "Profiles, IDs, roles, support abilities, feedback, and readiness." },
  "/events": { title: "Events", sub: "Create events, assign the team, and prepare the operating workflow." },
  "/attendance": { title: "Attendance", sub: "Manual attendance records connected to events and salaries." },
  "/evaluations": { title: "Evaluations", sub: "Score each team member after every event." },
  "/feedback": { title: "Feedback", sub: "Build internal notes and export simple personal feedback PDFs." },
  "/salaries": { title: "Salaries", sub: "Calculate event payments and prepare finance batches." },
  "/training": { title: "Training", sub: "Track onboarding, animator sessions, and retraining needs." },
  "/warnings": { title: "Warnings", sub: "Manage behavior, attendance, and improvement notes." },
  "/settings": { title: "Settings", sub: "Editable rates, formulas, score criteria, and import rules." },
};

export default function Topbar() {
  const pathname = usePathname();
  const matched = Object.entries(pageTitles).find(([key]) => pathname.startsWith(key));
  const page = matched?.[1] ?? { title: "GMind Admin", sub: "" };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1>{page.title}</h1>
        {page.sub && <p>{page.sub}</p>}
      </div>

      <div className="topbar-right">
        <input
          className="search-input"
          type="search"
          placeholder="Search team, events, IDs..."
        />

        <div className="user-chip">
          <span className="avatar avatar-sm">
            GA
          </span>
          <span className="truncate" style={{ maxWidth: 120 }}>
            GMind Admin
          </span>
        </div>
      </div>
    </header>
  );
}
