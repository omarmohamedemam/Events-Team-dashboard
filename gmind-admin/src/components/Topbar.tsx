"use client";

import { signOut } from "next-auth/react";
import { getInitials } from "@/lib/utils";

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

interface TopbarProps {
  user?: { name?: string | null; email?: string | null };
}

export default function Topbar({ user }: TopbarProps) {
  // Get pathname client-side
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/dashboard";
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

        <div className="user-chip" onClick={() => signOut({ callbackUrl: "/login" })}>
          <span className="avatar avatar-sm">
            {user?.name ? getInitials(user.name) : "AD"}
          </span>
          <span className="truncate" style={{ maxWidth: 120 }}>
            {user?.name ?? "Admin"}
          </span>
          <span className="text-muted text-xs">↗</span>
        </div>
      </div>
    </header>
  );
}
