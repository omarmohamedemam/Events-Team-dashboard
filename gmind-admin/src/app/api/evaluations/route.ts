import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calcEvaluationTotals } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const scores = {
    punctualityCommitment: Math.min(Number(body.punctualityCommitment || 0), 3),
    taskFocusResponsibility: Math.min(Number(body.taskFocusResponsibility || 0), 3),
    kidsHandling: Math.min(Number(body.kidsHandling || 0), 4),
    energyEngagement: Math.min(Number(body.energyEngagement || 0), 3),
    explanationAnimatorSkill: Math.min(Number(body.explanationAnimatorSkill || 0), 3),
    vrArGameHandling: Math.min(Number(body.vrArGameHandling || 0), 3),
    teamwork: Math.min(Number(body.teamwork || 0), 2),
    problemSolvingPressure: Math.min(Number(body.problemSolvingPressure || 0), 2),
    professionalism: Math.min(Number(body.professionalism || 0), 1),
    leadershipPotential: Math.min(Number(body.leadershipPotential || 0), 1),
  };
  const totals = calcEvaluationTotals(scores);
  const evaluation = await prisma.evaluation.upsert({
    where: { eventId_teamMemberId: { eventId: body.eventId, teamMemberId: body.teamMemberId } },
    update: { ...scores, ...totals, generalNotes: body.generalNotes || null },
    create: { eventId: body.eventId, teamMemberId: body.teamMemberId, ...scores, ...totals, generalNotes: body.generalNotes || null },
  });
  return NextResponse.json(evaluation);
}
