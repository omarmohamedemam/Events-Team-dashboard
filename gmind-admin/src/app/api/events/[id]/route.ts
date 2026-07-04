import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      assignments: {
        include: { teamMember: true },
        orderBy: { assignedRole: "asc" },
      },
      attendances: {
        include: { teamMember: true, markedBy: { select: { name: true } } },
      },
      evaluations: {
        include: { teamMember: true, evaluator: { select: { name: true } } },
      },
      salaryRecords: {
        include: { teamMember: true, paymentBatch: true },
      },
    },
  });

  if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(event);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const event = await prisma.event.update({
    where: { id },
    data: {
      ...body,
      eventDate: body.eventDate ? new Date(body.eventDate) : undefined,
      updatedAt: new Date(),
    },
  });

  return NextResponse.json(event);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await prisma.event.update({ where: { id }, data: { status: "canceled" } });
  return NextResponse.json({ success: true });
}
