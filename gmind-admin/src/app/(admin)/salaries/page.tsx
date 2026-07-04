import { prisma } from "@/lib/prisma";
import { emptyOnDbError } from "@/lib/db-safe";
import { createBatch, generateSalaries, markBatchPaid } from "../actions";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SalariesPage() {
  const [events, records, batches] = await Promise.all([
    prisma.event.findMany({ orderBy: { eventDate: "desc" } }),
    prisma.salaryRecord.findMany({ include: { event: true, teamMember: true, paymentBatch: true }, orderBy: { createdAt: "desc" } }),
    prisma.paymentBatch.findMany({ orderBy: { createdAt: "desc" } }),
  ]).catch(emptyOnDbError([[], [], []] as const));

  return (
    <div className="grid-cols-2-1">
      <section className="card">
        <div className="card-header"><div className="card-header-left"><h2>Salary records</h2><p>Generated from attended and evaluated assignments.</p></div></div>
        <form action={createBatch}>
          <div className="filters-bar">
            <input name="batchName" placeholder="Batch name" />
            <input type="date" name="periodStart" required />
            <input type="date" name="periodEnd" required />
            <button className="btn btn-green">Create batch from selected</button>
          </div>
          <div className="table-wrap"><table>
            <thead><tr><th></th><th>Event</th><th>Member</th><th>Role</th><th>Performance</th><th>Final</th><th>Status</th></tr></thead>
            <tbody>{records.map((r) => (
              <tr key={r.id}><td><input type="checkbox" name="salaryRecordId" value={r.id} disabled={!!r.paymentBatchId} /></td><td>{r.event.eventName}</td><td>{r.teamMember.fullName}</td><td>{r.role}</td><td>{r.performancePercentage}%</td><td>{formatCurrency(r.finalSalary)}</td><td>{r.paymentStatus}</td></tr>
            ))}</tbody>
          </table></div>
        </form>
      </section>
      <section className="card">
        <div className="card-header"><div className="card-header-left"><h2>Generate</h2><p>Requires attendance and evaluation.</p></div></div>
        <form action={generateSalaries} className="card-body form-grid form-grid-1">
          <div className="field"><label>Event</label><select name="eventId">{events.map((e) => <option key={e.id} value={e.id}>{e.eventName}</option>)}</select></div>
          <button className="btn btn-primary">Generate salaries</button>
        </form>
        <div className="card-header"><div className="card-header-left"><h2>Payment batches</h2></div></div>
        <div className="task-list">{batches.map((b) => (
          <div className="task-card" key={b.id}><span className="task-dot" /><div><strong>{b.batchName}</strong><span>{formatCurrency(b.totalAmount)} · {b.status}</span><form action={markBatchPaid} className="mt-2 flex gap-2"><input type="hidden" name="batchId" value={b.id} /><a className="btn btn-sm" href={`/api/exports/salary-batch?id=${b.id}`}>Export Excel</a><button className="btn btn-sm btn-green">Mark paid</button></form></div></div>
        ))}</div>
      </section>
    </div>
  );
}
