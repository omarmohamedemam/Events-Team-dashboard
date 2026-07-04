import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  await prisma.event.update({ where: { id }, data: { status: "canceled" } });
  return NextResponse.json({ success: true });
}
