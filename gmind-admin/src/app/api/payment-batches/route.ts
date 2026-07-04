import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const ids = Array.isArray(body.salaryRecordIds) ? body.salaryRecordIds : [];
  const total = await prisma.salaryRecord.aggregate({ where: { id: { in: ids } }, _sum: { finalSalary: true } });
  const batch = await prisma.paymentBatch.create({
    data: {
      batchName: body.batchName || "Salary batch",
      periodStart: new Date(body.periodStart),
      periodEnd: new Date(body.periodEnd),
      totalAmount: total._sum.finalSalary || 0,
      status: "ready_for_payment",
      notes: body.notes || null,
    },
  });
  await prisma.salaryRecord.updateMany({ where: { id: { in: ids } }, data: { paymentBatchId: batch.id } });
  return NextResponse.json(batch, { status: 201 });
}
