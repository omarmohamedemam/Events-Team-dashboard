import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const assignment = await prisma.eventAssignment.upsert({
    where: { eventId_teamMemberId: { eventId: body.eventId, teamMemberId: body.teamMemberId } },
    update: { assignedRole: body.assignedRole || "facilitator", plannedRate: Number(body.plannedRate || 0) },
    create: { eventId: body.eventId, teamMemberId: body.teamMemberId, assignedRole: body.assignedRole || "facilitator", plannedRate: Number(body.plannedRate || 0) },
  });
  return NextResponse.json(assignment);
}
