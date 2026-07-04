import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const feedback = await prisma.feedback.create({
    data: {
      teamMemberId: body.teamMemberId,
      eventId: body.eventId || null,
      periodLabel: body.periodLabel || null,
      feedbackType: body.feedbackType || "event_feedback",
      strengths: body.strengths || "-",
      gaps: body.gaps || null,
      recommendations: body.recommendations || "-",
      trainingNeeded: !!body.trainingNeeded,
      promotionReady: !!body.promotionReady,
    },
  });
  return NextResponse.json(feedback, { status: 201 });
}
