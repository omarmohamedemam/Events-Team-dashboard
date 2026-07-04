"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { calcEvaluationTotals, calcSalary } from "@/lib/utils";

function currentUserId() {
  return undefined;
}

function text(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function money(form: FormData, key: string, fallback = 0) {
  const value = Number(form.get(key));
  return Number.isFinite(value) ? value : fallback;
}

export async function assignMember(form: FormData) {
  currentUserId();
  const eventId = text(form, "eventId")!;
  await prisma.eventAssignment.upsert({
    where: { eventId_teamMemberId: { eventId, teamMemberId: text(form, "teamMemberId")! } },
    update: {
      assignedRole: text(form, "assignedRole") as never,
      plannedRate: money(form, "plannedRate"),
      assignmentStatus: "assigned",
    },
    create: {
      eventId,
      teamMemberId: text(form, "teamMemberId")!,
      assignedRole: (text(form, "assignedRole") || "facilitator") as never,
      plannedRate: money(form, "plannedRate"),
    },
  });
  revalidatePath("/events");
}

export async function saveAttendance(form: FormData) {
  const userId = currentUserId();
  const eventId = text(form, "eventId")!;
  const teamMemberId = text(form, "teamMemberId")!;
  await prisma.attendance.upsert({
    where: { eventId_teamMemberId: { eventId, teamMemberId } },
    update: {
      attendanceStatus: text(form, "attendanceStatus") as never,
      arrivalTime: text(form, "arrivalTime"),
      leavingTime: text(form, "leavingTime"),
      attendanceNote: text(form, "attendanceNote"),
      markedByUserId: userId,
    },
    create: {
      eventId,
      teamMemberId,
      attendanceStatus: (text(form, "attendanceStatus") || "attended") as never,
      arrivalTime: text(form, "arrivalTime"),
      leavingTime: text(form, "leavingTime"),
      attendanceNote: text(form, "attendanceNote"),
      markedByUserId: userId,
    },
  });
  revalidatePath("/attendance");
}

export async function saveEvaluation(form: FormData) {
  const userId = currentUserId();
  const eventId = text(form, "eventId")!;
  const teamMemberId = text(form, "teamMemberId")!;
  const scores = {
    punctualityCommitment: Math.min(money(form, "punctualityCommitment"), 3),
    taskFocusResponsibility: Math.min(money(form, "taskFocusResponsibility"), 3),
    kidsHandling: Math.min(money(form, "kidsHandling"), 4),
    energyEngagement: Math.min(money(form, "energyEngagement"), 3),
    explanationAnimatorSkill: Math.min(money(form, "explanationAnimatorSkill"), 3),
    vrArGameHandling: Math.min(money(form, "vrArGameHandling"), 3),
    teamwork: Math.min(money(form, "teamwork"), 2),
    problemSolvingPressure: Math.min(money(form, "problemSolvingPressure"), 2),
    professionalism: Math.min(money(form, "professionalism"), 1),
    leadershipPotential: Math.min(money(form, "leadershipPotential"), 1),
    scoreMax: 25,
  };
  const totals = calcEvaluationTotals(scores);
  await prisma.evaluation.upsert({
    where: { eventId_teamMemberId: { eventId, teamMemberId } },
    update: { ...scores, ...totals, generalNotes: text(form, "generalNotes"), evaluatorUserId: userId },
    create: { eventId, teamMemberId, ...scores, ...totals, generalNotes: text(form, "generalNotes"), evaluatorUserId: userId },
  });
  revalidatePath("/evaluations");
}

export async function generateSalaries(form: FormData) {
  currentUserId();
  const eventId = text(form, "eventId")!;
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { assignments: true, attendances: true, evaluations: true },
  });
  if (!event) return;

  for (const assignment of event.assignments) {
    const attended = event.attendances.find(
      (a) => a.teamMemberId === assignment.teamMemberId && a.attendanceStatus === "attended"
    );
    const evaluation = event.evaluations.find((e) => e.teamMemberId === assignment.teamMemberId);
    if (!attended || !evaluation) continue;

    const rate = assignment.plannedRate ?? 0;
    const salary = calcSalary(rate, evaluation.performancePercentage);
    await prisma.salaryRecord.upsert({
      where: { eventId_teamMemberId: { eventId, teamMemberId: assignment.teamMemberId } },
      update: { role: assignment.assignedRole, eventType: event.eventType, baseRate: rate, performancePercentage: evaluation.performancePercentage, ...salary },
      create: { eventId, teamMemberId: assignment.teamMemberId, role: assignment.assignedRole, eventType: event.eventType, baseRate: rate, performancePercentage: evaluation.performancePercentage, ...salary },
    });
  }
  await prisma.event.update({ where: { id: eventId }, data: { status: "completed" } });
  revalidatePath("/salaries");
}

export async function createBatch(form: FormData) {
  const userId = currentUserId();
  const ids = form.getAll("salaryRecordId").map(String);
  const total = await prisma.salaryRecord.aggregate({ where: { id: { in: ids } }, _sum: { finalSalary: true } });
  const batch = await prisma.paymentBatch.create({
    data: {
      batchName: text(form, "batchName") || "Salary batch",
      periodStart: new Date(text(form, "periodStart") || new Date()),
      periodEnd: new Date(text(form, "periodEnd") || new Date()),
      totalAmount: total._sum.finalSalary || 0,
      status: "ready_for_payment",
      preparedByUserId: userId,
      notes: text(form, "notes"),
    },
  });
  await prisma.salaryRecord.updateMany({ where: { id: { in: ids } }, data: { paymentBatchId: batch.id } });
  revalidatePath("/salaries");
}

export async function markBatchPaid(form: FormData) {
  const userId = currentUserId();
  const id = text(form, "batchId")!;
  await prisma.paymentBatch.update({ where: { id }, data: { status: "paid", sentByUserId: userId, sentAt: new Date() } });
  await prisma.salaryRecord.updateMany({ where: { paymentBatchId: id }, data: { paymentStatus: "sent" } });
  revalidatePath("/salaries");
}

export async function saveFeedback(form: FormData) {
  const userId = currentUserId();
  await prisma.feedback.create({
    data: {
      teamMemberId: text(form, "teamMemberId")!,
      eventId: text(form, "eventId"),
      periodLabel: text(form, "periodLabel"),
      feedbackType: (text(form, "feedbackType") || "event_feedback") as never,
      strengths: text(form, "strengths") || "-",
      gaps: text(form, "gaps"),
      recommendations: text(form, "recommendations") || "-",
      trainingNeeded: form.get("trainingNeeded") === "on",
      promotionReady: form.get("promotionReady") === "on",
      recommendedRole: text(form, "recommendedRole") as never,
      preparedByUserId: userId,
    },
  });
  revalidatePath("/feedback");
}

export async function saveWarning(form: FormData) {
  const userId = currentUserId();
  await prisma.warningNote.create({
    data: {
      teamMemberId: text(form, "teamMemberId")!,
      eventId: text(form, "eventId"),
      noteType: (text(form, "noteType") || "warning") as never,
      title: text(form, "title") || "Warning",
      description: text(form, "description") || "-",
      actionRequired: text(form, "actionRequired"),
      dueDate: text(form, "dueDate") ? new Date(text(form, "dueDate")!) : undefined,
      createdByUserId: userId,
    },
  });
  revalidatePath("/warnings");
}

export async function saveRate(form: FormData) {
  currentUserId();
  await prisma.rateSetting.upsert({
    where: {
      eventType_role_isActive: {
        eventType: (text(form, "eventType") || "school") as never,
        role: (text(form, "role") || "facilitator") as never,
        isActive: true,
      },
    },
    update: { baseRate: money(form, "baseRate"), salaryFormulaType: (text(form, "salaryFormulaType") || "rate_x_percentage") as never },
    create: {
      eventType: (text(form, "eventType") || "school") as never,
      role: (text(form, "role") || "facilitator") as never,
      baseRate: money(form, "baseRate"),
      salaryFormulaType: (text(form, "salaryFormulaType") || "rate_x_percentage") as never,
    },
  });
  revalidatePath("/settings");
}
