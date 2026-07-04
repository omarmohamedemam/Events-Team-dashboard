import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function cell(value: unknown) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id") || "";
  const batch = await prisma.paymentBatch.findUnique({
    where: { id },
    include: { salaryRecords: { include: { event: true, teamMember: true } } },
  });
  if (!batch) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const rows = batch.salaryRecords.map((r) => `<tr><td>${cell(r.event.eventName)}</td><td>${cell(r.teamMember.fullName)}</td><td>${cell(r.role)}</td><td>${cell(r.baseRate)}</td><td>${cell(r.performancePercentage)}</td><td>${cell(r.finalSalary)}</td><td>${cell(r.paymentMethod)}</td></tr>`).join("");
  const html = `<table><thead><tr><th>Event</th><th>Member</th><th>Role</th><th>Base rate</th><th>Performance %</th><th>Final salary</th><th>Method</th></tr></thead><tbody>${rows}</tbody></table>`;
  return new NextResponse(html, {
    headers: {
      "Content-Type": "application/vnd.ms-excel; charset=utf-8",
      "Content-Disposition": `attachment; filename="${batch.batchName.replaceAll('"', "")}.xls"`,
    },
  });
}
