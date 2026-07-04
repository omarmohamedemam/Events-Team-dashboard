import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const warning = await prisma.warningNote.create({
    data: {
      teamMemberId: body.teamMemberId,
      eventId: body.eventId || null,
      noteType: body.noteType || "warning",
      title: body.title || "Warning",
      description: body.description || "-",
      actionRequired: body.actionRequired || null,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
    },
  });
  return NextResponse.json(warning, { status: 201 });
}
