import { prisma } from "@/lib/prisma";
import { emptyOnDbError } from "@/lib/db-safe";
import { saveFeedback } from "../actions";

export const dynamic = "force-dynamic";

export default async function FeedbackPage() {
  const [members, events, feedbacks] = await Promise.all([
    prisma.teamMember.findMany({ orderBy: { fullName: "asc" } }),
    prisma.event.findMany({ orderBy: { eventDate: "desc" } }),
    prisma.feedback.findMany({ include: { teamMember: true, event: true, preparedBy: { select: { name: true } } }, orderBy: { createdAt: "desc" } }),
  ]).catch(emptyOnDbError([[], [], []] as const));
  const hasMembers = members.length > 0;

  return (
    <div className="grid-cols-1-2">
      <section className="card">
        <div className="card-header"><div className="card-header-left"><h2>Add feedback</h2><p>Clean printable feedback, no design dependency.</p></div></div>
        <form action={saveFeedback} className="card-body form-grid form-grid-1">
          <div className="field"><label>Member</label><select name="teamMemberId" required disabled={!hasMembers}>{members.map((m) => <option key={m.id} value={m.id}>{m.fullName}</option>)}</select></div>
          <div className="field"><label>Event</label><select name="eventId"><option value="">Period feedback</option>{events.map((e) => <option key={e.id} value={e.id}>{e.eventName}</option>)}</select></div>
          <div className="field"><label>Period</label><input name="periodLabel" placeholder="Summer 2026" /></div>
          <div className="field"><label>Type</label><select name="feedbackType"><option value="event_feedback">Event feedback</option><option value="period_feedback">Period feedback</option><option value="warning_feedback">Warning feedback</option><option value="promotion_feedback">Promotion feedback</option></select></div>
          <div className="field"><label>Strengths</label><textarea name="strengths" required /></div>
          <div className="field"><label>Gaps</label><textarea name="gaps" /></div>
          <div className="field"><label>Recommendations</label><textarea name="recommendations" required /></div>
          <label className="checkbox-field"><input type="checkbox" name="trainingNeeded" /> Training needed</label>
          <label className="checkbox-field"><input type="checkbox" name="promotionReady" /> Promotion ready</label>
          <button className="btn btn-green" disabled={!hasMembers}>{hasMembers ? "Save feedback" : "Add a member first"}</button>
        </form>
      </section>
      <section className="card">
        <div className="card-header"><div className="card-header-left"><h2>Feedback history</h2><p>Use the browser print command to save as PDF.</p></div></div>
        <div className="task-list">{feedbacks.length ? feedbacks.map((f) => (
          <article className="task-card" key={f.id}>
            <span className="task-dot purple" />
            <div>
              <strong>{f.teamMember.fullName} · {f.feedbackType}</strong>
              <span>{f.event?.eventName || f.periodLabel || "General"} · by {f.preparedBy?.name || "Admin"}</span>
              <p className="mt-2 text-sm"><b>Strengths:</b> {f.strengths}</p>
              {f.gaps && <p className="text-sm"><b>Gaps:</b> {f.gaps}</p>}
              <p className="text-sm"><b>Recommendations:</b> {f.recommendations}</p>
            </div>
          </article>
        )) : <article className="task-card"><span className="task-dot" /><div><strong>No feedback yet</strong><span>Feedback will appear here after saving.</span></div></article>}</div>
      </section>
    </div>
  );
}
