import { prisma } from "@/lib/prisma";
import { emptyOnDbError } from "@/lib/db-safe";
import { assignMember, saveAttendance } from "../actions";

export const dynamic = "force-dynamic";

export default async function AttendancePage() {
  const [events, members, assignments] = await Promise.all([
    prisma.event.findMany({ orderBy: { eventDate: "desc" } }),
    prisma.teamMember.findMany({ where: { status: { in: ["active", "trainee"] } }, orderBy: { fullName: "asc" } }),
    prisma.eventAssignment.findMany({ include: { event: true, teamMember: true }, orderBy: { event: { eventDate: "desc" } } }),
  ]).catch(emptyOnDbError([[], [], []] as const));

  return (
    <div className="grid-cols-1-2">
      <section className="card">
        <div className="card-header"><div className="card-header-left"><h2>Assign team</h2><p>One row per member per event.</p></div></div>
        <form action={assignMember} className="card-body form-grid form-grid-1">
          <div className="field"><label>Event</label><select name="eventId">{events.map((e) => <option key={e.id} value={e.id}>{e.eventName}</option>)}</select></div>
          <div className="field"><label>Member</label><select name="teamMemberId">{members.map((m) => <option key={m.id} value={m.id}>{m.fullName}</option>)}</select></div>
          <div className="field"><label>Role</label><select name="assignedRole"><option value="facilitator">Facilitator</option><option value="animator">Animator</option><option value="coordinator">Coordinator</option><option value="vr_support">VR support</option><option value="ar_support">AR support</option><option value="setup">Setup</option><option value="trainee">Trainee</option></select></div>
          <div className="field"><label>Planned rate</label><input type="number" name="plannedRate" min="0" step="0.01" /></div>
          <button className="btn btn-green">Assign</button>
        </form>
      </section>
      <section className="card">
        <div className="card-header"><div className="card-header-left"><h2>Attendance</h2><p>Manual marking for assigned members.</p></div></div>
        <div className="table-wrap"><table>
          <thead><tr><th>Event</th><th>Member</th><th>Role</th><th>Status</th><th>Arrival</th><th>Leaving</th><th></th></tr></thead>
          <tbody>{assignments.map((a) => (
            <tr key={a.id}>
              <td>{a.event.eventName}</td><td>{a.teamMember.fullName}</td><td>{a.assignedRole}</td>
              <td colSpan={4}>
                <form action={saveAttendance} className="flex gap-2">
                  <input type="hidden" name="eventId" value={a.eventId} /><input type="hidden" name="teamMemberId" value={a.teamMemberId} />
                  <select className="filter-select" name="attendanceStatus"><option value="attended">Attended</option><option value="absent">Absent</option><option value="late">Late</option><option value="left_early">Left early</option><option value="excused">Excused</option></select>
                  <input type="time" name="arrivalTime" /><input type="time" name="leavingTime" />
                  <button className="btn btn-sm btn-primary">Save</button>
                </form>
              </td>
            </tr>
          ))}</tbody>
        </table></div>
      </section>
    </div>
  );
}
