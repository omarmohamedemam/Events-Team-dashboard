import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "";
  const eventType = searchParams.get("eventType") ?? "";
  const search = searchParams.get("search") ?? "";
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (eventType) where.eventType = eventType;
  if (search) {
    where.OR = [
      { eventName: { contains: search, mode: "insensitive" } },
      { clientName: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
    ];
  }
  if (from || to) {
    where.eventDate = {};
    if (from) (where.eventDate as Record<string, unknown>).gte = new Date(from);
    if (to) (where.eventDate as Record<string, unknown>).lte = new Date(to);
  }

  const events = await prisma.event.findMany({
    where,
    orderBy: { eventDate: "desc" },
    include: {
      _count: {
        select: {
          assignments: true,
          attendances: true,
          evaluations: true,
          salaryRecords: true,
        },
      },
    },
  }).catch(() => []);

  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const event = await prisma.event.create({
      data: {
        eventName: body.eventName,
        clientName: body.clientName || null,
        eventType: body.eventType || "school",
        eventDate: new Date(body.eventDate),
        location: body.location || null,
        expectedKids: body.expectedKids ? Number(body.expectedKids) : null,
        actualKids: body.actualKids ? Number(body.actualKids) : null,
        requiredTeamCount: body.requiredTeamCount ? Number(body.requiredTeamCount) : null,
        eventManagerId: body.eventManagerId || null,
        status: body.status || "planned",
        notes: body.notes || null,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Database is unavailable. Start Postgres and run migrations." }, { status: 503 });
  }
}
