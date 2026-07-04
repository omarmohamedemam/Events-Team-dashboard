import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const attendance = await prisma.attendance.upsert({
    where: { eventId_teamMemberId: { eventId: body.eventId, teamMemberId: body.teamMemberId } },
    update: { attendanceStatus: body.attendanceStatus || "attended", arrivalTime: body.arrivalTime || null, leavingTime: body.leavingTime || null, attendanceNote: body.attendanceNote || null },
    create: { eventId: body.eventId, teamMemberId: body.teamMemberId, attendanceStatus: body.attendanceStatus || "attended", arrivalTime: body.arrivalTime || null, leavingTime: body.leavingTime || null, attendanceNote: body.attendanceNote || null },
  });
  return NextResponse.json(attendance);
}
