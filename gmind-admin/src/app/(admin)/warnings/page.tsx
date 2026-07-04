import { prisma } from "@/lib/prisma";
import { emptyOnDbError } from "@/lib/db-safe";
import { saveWarning } from "../actions";

export const dynamic = "force-dynamic";

export default async function WarningsPage() {
  const [members, events, warnings] = await Promise.all([
    prisma.teamMember.findMany({ orderBy: { fullName: "asc" } }),
    prisma.event.findMany({ orderBy: { eventDate: "desc" } }),
    prisma.warningNote.findMany({ include: { teamMember: true, event: true, createdBy: { select: { name: true } } }, orderBy: { createdAt: "desc" } }),
  ]).catch(emptyOnDbError([[], [], []] as const));

  return (
    <div className="grid-cols-1-2">
      <section className="card">
        <div className="card-header"><div className="card-header-left"><h2>Add warning/note</h2><p>Link to an event when useful.</p></div></div>
        <form action={saveWarning} className="card-body form-grid form-grid-1">
          <div className="field"><label>Member</label><select name="teamMemberId">{members.map((m) => <option key={m.id} value={m.id}>{m.fullName}</option>)}</select></div>
          <div className="field"><label>Event</label><select name="eventId"><option value="">No event</option>{events.map((e) => <option key={e.id} value={e.id}>{e.eventName}</option>)}</select></div>
          <div className="field"><label>Type</label><select name="noteType"><option value="warning">Warning</option><option value="serious_warning">Serious warning</option><option value="no_show">No-show</option><option value="attendance_issue">Attendance issue</option><option value="performance_issue">Performance issue</option><option value="improvement_plan">Improvement plan</option></select></div>
          <div className="field"><label>Title</label><input name="title" required /></div>
          <div className="field"><label>Description</label><textarea name="description" required /></div>
          <div className="field"><label>Action required</label><textarea name="actionRequired" /></div>
          <div className="field"><label>Due date</label><input type="date" name="dueDate" /></div>
          <button className="btn btn-green">Save warning</button>
        </form>
      </section>
      <section className="card">
        <div className="card-header"><div className="card-header-left"><h2>Warning history</h2></div></div>
        <div className="table-wrap"><table><thead><tr><th>Member</th><th>Type</th><th>Title</th><th>Status</th><th>Event</th></tr></thead><tbody>
          {warnings.map((w) => <tr key={w.id}><td>{w.teamMember.fullName}</td><td>{w.noteType}</td><td>{w.title}</td><td>{w.status}</td><td>{w.event?.eventName || "-"}</td></tr>)}
        </tbody></table></div>
      </section>
    </div>
  );
}
