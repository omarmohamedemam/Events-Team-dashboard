import { prisma } from "@/lib/prisma";
import { emptyOnDbError } from "@/lib/db-safe";
import { saveRate } from "../actions";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const rates = await prisma.rateSetting.findMany({ where: { isActive: true }, orderBy: [{ eventType: "asc" }, { role: "asc" }] }).catch(emptyOnDbError([]));
  return (
    <div className="grid-cols-1-2">
      <section className="card">
        <div className="card-header"><div className="card-header-left"><h2>Event rates</h2><p>Admin-editable rates used by salary generation.</p></div></div>
        <form action={saveRate} className="card-body form-grid form-grid-1">
          <div className="field"><label>Event type</label><select name="eventType"><option value="school">School</option><option value="nursery">Nursery</option><option value="public_event">Public event</option><option value="competition">Competition</option><option value="training">Training</option><option value="online">Online</option><option value="custom">Custom</option></select></div>
          <div className="field"><label>Role</label><select name="role"><option value="facilitator">Facilitator</option><option value="animator">Animator</option><option value="coordinator">Coordinator</option><option value="vr_support">VR support</option><option value="ar_support">AR support</option><option value="trainee">Trainee</option></select></div>
          <div className="field"><label>Base rate</label><input type="number" name="baseRate" min="0" step="0.01" required /></div>
          <div className="field"><label>Formula</label><select name="salaryFormulaType"><option value="rate_x_percentage">Rate x percentage</option><option value="fixed_rate">Fixed rate</option><option value="manual">Manual</option></select></div>
          <button className="btn btn-green">Save rate</button>
        </form>
      </section>
      <section className="card">
        <div className="card-header"><div className="card-header-left"><h2>Current rates</h2></div></div>
        <div className="rate-grid">{rates.map((r) => <div className="rate-card" key={r.id}><strong>{r.eventType} · {r.role}</strong><span>{formatCurrency(r.baseRate)} · {r.salaryFormulaType}</span></div>)}</div>
      </section>
    </div>
  );
}
