import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { emptyOnDbError } from "@/lib/db-safe";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  const [activeMembers, newcomers, eventsThisMonth, pendingAttendance, pendingEvaluations, pendingSalaries, salaryTotal, topMembers] =
    await Promise.all([
      prisma.teamMember.count({ where: { status: "active" } }),
      prisma.teamMember.count({ where: { teamType: "newcomer" } }),
      prisma.event.count({ where: { eventDate: { gte: start } } }),
      prisma.event.count({ where: { status: { in: ["completed", "confirmed"] }, attendances: { none: {} } } }),
      prisma.event.count({ where: { attendances: { some: {} }, evaluations: { none: {} } } }),
      prisma.salaryRecord.count({ where: { paymentStatus: "pending" } }),
      prisma.salaryRecord.aggregate({ where: { createdAt: { gte: start } }, _sum: { finalSalary: true } }),
      prisma.teamMember.findMany({
        take: 5,
        orderBy: { evaluations: { _count: "desc" } },
        include: { evaluations: { select: { performancePercentage: true } }, _count: { select: { attendances: true } } },
      }),
    ]).catch(emptyOnDbError([0, 0, 0, 0, 0, 0, { _sum: { finalSalary: 0 } }, []] as const));

  const kpis = [
    ["Active team", activeMembers, "Current usable team pool"],
    ["Newcomers", newcomers, "People in testing/training"],
    ["Events this month", eventsThisMonth, "Planned or completed"],
    ["Pending attendance", pendingAttendance, "Completed/confirmed without attendance"],
    ["Pending evaluations", pendingEvaluations, "Attendance done, scoring missing"],
    ["Pending salaries", pendingSalaries, "Not sent yet"],
    ["Monthly salary", formatCurrency(salaryTotal._sum.finalSalary || 0), "Current month cost"],
  ];

  return (
    <>
      <div className="kpi-grid">
        {kpis.map(([label, value, sub]) => (
          <div className="kpi-card" key={label}>
            <div className="kpi-label">{label}</div>
            <div className="kpi-value">{value}</div>
            <div className="kpi-sub">{sub}</div>
          </div>
        ))}
      </div>
      <div className="grid-2">
        <section className="card">
          <div className="card-header"><div className="card-header-left"><h2>Action queue</h2><p>Smallest next moves.</p></div></div>
          <div className="task-list">
            <Link className="task-card" href="/events"><span className="task-dot purple" /><div><strong>Create or complete events</strong><span>Assign team, then mark attendance and scores.</span></div></Link>
            <Link className="task-card" href="/salaries"><span className="task-dot amber" /><div><strong>Generate salaries</strong><span>Only attended and evaluated members are paid.</span></div></Link>
            <Link className="task-card" href="/feedback"><span className="task-dot" /><div><strong>Write feedback</strong><span>Feedback history stays attached to profiles.</span></div></Link>
          </div>
        </section>
        <section className="card">
          <div className="card-header"><div className="card-header-left"><h2>Most evaluated members</h2><p>Quick pulse on active performers.</p></div></div>
          <div className="table-wrap"><table><tbody>
            {topMembers.map((m) => {
              const avg = m.evaluations.length ? Math.round(m.evaluations.reduce((sum, e) => sum + e.performancePercentage, 0) / m.evaluations.length) : 0;
              return <tr key={m.id}><td>{m.fullName}</td><td>{m._count.attendances} events</td><td>{avg}% avg</td></tr>;
            })}
          </tbody></table></div>
        </section>
      </div>
    </>
  );
}
