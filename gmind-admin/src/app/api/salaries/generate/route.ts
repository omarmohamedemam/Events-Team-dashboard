import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calcSalary } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const { eventId } = await req.json();
  const event = await prisma.event.findUnique({ where: { id: eventId }, include: { assignments: true, attendances: true, evaluations: true } });
  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
  let created = 0;
  for (const assignment of event.assignments) {
    const attended = event.attendances.some((a) => a.teamMemberId === assignment.teamMemberId && a.attendanceStatus === "attended");
    const evaluation = event.evaluations.find((e) => e.teamMemberId === assignment.teamMemberId);
    if (!attended || !evaluation) continue;
    const salary = calcSalary(assignment.plannedRate || 0, evaluation.performancePercentage);
    await prisma.salaryRecord.upsert({
      where: { eventId_teamMemberId: { eventId, teamMemberId: assignment.teamMemberId } },
      update: { role: assignment.assignedRole, eventType: event.eventType, baseRate: assignment.plannedRate || 0, performancePercentage: evaluation.performancePercentage, ...salary },
      create: { eventId, teamMemberId: assignment.teamMemberId, role: assignment.assignedRole, eventType: event.eventType, baseRate: assignment.plannedRate || 0, performancePercentage: evaluation.performancePercentage, ...salary },
    });
    created++;
  }
  return NextResponse.json({ created });
}
