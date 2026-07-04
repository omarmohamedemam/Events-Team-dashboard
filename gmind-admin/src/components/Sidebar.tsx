"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "01" },
  { href: "/team", label: "Team Database", icon: "02" },
  { href: "/events", label: "Events", icon: "03" },
  { href: "/attendance", label: "Attendance", icon: "04" },
  { href: "/evaluations", label: "Evaluations", icon: "05" },
  { href: "/feedback", label: "Feedback", icon: "06" },
  { href: "/salaries", label: "Salaries", icon: "07" },
  { href: "/training", label: "Training", icon: "08" },
  { href: "/warnings", label: "Warnings", icon: "09" },
  { href: "/settings", label: "Settings", icon: "10" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        <div className="sidebar-brand">
          <div className="brand-logo-text">G</div>
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

        <div className="sidebar-footer" />
      </div>
    </aside>
  );
}
