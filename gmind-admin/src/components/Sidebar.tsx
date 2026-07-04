"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "DB" },
  { href: "/team", label: "Team Database", icon: "TM" },
  { href: "/events", label: "Events", icon: "EV" },
  { href: "/attendance", label: "Attendance", icon: "AT" },
  { href: "/evaluations", label: "Evaluations", icon: "SC" },
  { href: "/feedback", label: "Feedback", icon: "FB" },
  { href: "/salaries", label: "Salaries", icon: "EG" },
  { href: "/training", label: "Training", icon: "TR" },
  { href: "/warnings", label: "Warnings", icon: "WN" },
  { href: "/settings", label: "Settings", icon: "ST" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        <div className="sidebar-brand">
          <div className="brand-logo">
            <img src="/logo.png" alt="GMind logo" />
          </div>
          <div className="brand-text">
            <strong>Events Admin</strong>
            <span>GMind internal system</span>
          </div>
        </div>

        <div className="nav-section-label">Workspace</div>

        <nav>
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link${isActive ? " active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <Link href="/settings" className="nav-link">
            <span className="nav-icon">⚙</span>
            Settings
          </Link>
        </div>
      </div>
    </aside>
  );
}
