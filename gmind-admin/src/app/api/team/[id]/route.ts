import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const member = await prisma.teamMember.findUnique({
    where: { id },
    include: {
      assignments: {
        include: { event: true },
        orderBy: { event: { eventDate: "desc" } },
      },
      attendances: {
        include: { event: true },
        orderBy: { event: { eventDate: "desc" } },
      },
      evaluations: {
        include: { event: true },
        orderBy: { event: { eventDate: "desc" } },
      },
      feedbacks: {
        include: { event: true, preparedBy: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
      salaryRecords: {
        include: { event: true, paymentBatch: true },
        orderBy: { event: { eventDate: "desc" } },
      },
      trainingAttendances: {
        include: { trainingSession: true },
        orderBy: { trainingSession: { sessionDate: "desc" } },
      },
      warningNotes: {
        include: { event: true, createdBy: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(member);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  if (body.gmindId) {
    const existing = await prisma.teamMember.findFirst({
      where: { gmindId: body.gmindId, NOT: { id } },
    });
    if (existing) return NextResponse.json({ error: "GMind ID already exists" }, { status: 409 });
  }

  const member = await prisma.teamMember.update({
    where: { id },
    data: {
      ...body,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(member);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await prisma.teamMember.update({ where: { id }, data: { status: "inactive" } });
  return NextResponse.json({ success: true });
}
