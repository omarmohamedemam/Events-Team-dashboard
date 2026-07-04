import { prisma } from "@/lib/prisma";
import { emptyOnDbError } from "@/lib/db-safe";
import { saveEvaluation } from "../actions";

export const dynamic = "force-dynamic";

const criteria = [
  ["punctualityCommitment", "Punctuality", 3],
  ["taskFocusResponsibility", "Task focus", 3],
  ["kidsHandling", "Kids handling", 4],
  ["energyEngagement", "Energy", 3],
  ["explanationAnimatorSkill", "Explanation / animator", 3],
  ["vrArGameHandling", "VR/AR/game", 3],
  ["teamwork", "Teamwork", 2],
  ["problemSolvingPressure", "Problem solving", 2],
  ["professionalism", "Professionalism", 1],
  ["leadershipPotential", "Leadership", 1],
] as const;

export default async function EvaluationsPage() {
  const attendance = await prisma.attendance.findMany({
    where: { attendanceStatus: "attended" },
    include: { event: true, teamMember: true },
    orderBy: { event: { eventDate: "desc" } },
  }).catch(emptyOnDbError([]));

  return (
    <section className="card">
      <div className="card-header"><div className="card-header-left"><h2>Evaluations</h2><p>Scores are capped at each criterion max and total 25.</p></div></div>
      <div className="task-list">{attendance.map((a) => (
        <form action={saveEvaluation} className="card" key={a.id}>
          <div className="card-header"><div className="card-header-left"><h2>{a.teamMember.fullName}</h2><p>{a.event.eventName}</p></div><button className="btn btn-primary">Save score</button></div>
          <input type="hidden" name="eventId" value={a.eventId} /><input type="hidden" name="teamMemberId" value={a.teamMemberId} />
          <div className="score-list">
            {criteria.map(([name, label, max]) => (
              <div className="score-row" key={name}><strong>{label}<span>Max {max}</span></strong><input type="number" name={name} min="0" max={max} step="0.5" defaultValue="0" /><span className="score-value">/{max}</span></div>
            ))}
            <textarea name="generalNotes" placeholder="General notes" />
          </div>
        </form>
      ))}</div>
    </section>
  );
}
