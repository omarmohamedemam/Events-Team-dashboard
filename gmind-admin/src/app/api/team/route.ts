import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/team — list all team members with filters
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const teamType = searchParams.get("teamType") ?? "";
  const mainRole = searchParams.get("mainRole") ?? "";
  const arSupport = searchParams.get("arSupport");
  const vrSupport = searchParams.get("vrSupport");

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { gmindId: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  if (status) where.status = status;
  if (teamType) where.teamType = teamType;
  if (mainRole) where.mainRole = mainRole;
  if (arSupport === "true") where.arSupport = true;
  if (vrSupport === "true") where.vrSupport = true;

  const members = await prisma.teamMember.findMany({
    where,
    orderBy: { fullName: "asc" },
    include: {
      _count: {
        select: {
          attendances: { where: { attendanceStatus: "attended" } },
          warningNotes: { where: { status: "open" } },
        },
      },
      evaluations: {
        select: { performancePercentage: true },
      },
      assignments: {
        orderBy: { event: { eventDate: "desc" } },
        take: 1,
        select: { event: { select: { eventDate: true, eventName: true } } },
      },
    },
  });

  return NextResponse.json(members);
}

// POST /api/team — create a team member
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // Check duplicate GMind ID
  if (body.gmindId) {
    const existing = await prisma.teamMember.findUnique({ where: { gmindId: body.gmindId } });
    if (existing) {
      return NextResponse.json({ error: "GMind ID already exists" }, { status: 409 });
    }
  }

  const member = await prisma.teamMember.create({
    data: {
      gmindId: body.gmindId || null,
      fullName: body.fullName,
      phone: body.phone || null,
      email: body.email || null,
      dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : null,
      schoolOrFaculty: body.schoolOrFaculty || "unknown",
      schoolOrFacultyName: body.schoolOrFacultyName || null,
      nationality: body.nationality || null,
      governorate: body.governorate || null,
      address: body.address || null,
      socialMediaLink: body.socialMediaLink || null,
      personalPhotoUrl: body.personalPhotoUrl || null,
      teamType: body.teamType || "internal",
      mainRole: body.mainRole || "facilitator",
      status: body.status || "active",
      arSupport: !!body.arSupport,
      vrSupport: !!body.vrSupport,
      languages: body.languages || [],
      startDate: body.startDate ? new Date(body.startDate) : null,
      notes: body.notes || null,
    },
  });

  return NextResponse.json(member, { status: 201 });
}
