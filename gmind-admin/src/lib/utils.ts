/**
 * Salary calculation utilities
 */

export function calcSalary(
  baseRate: number,
  performancePercentage: number,
  bonus: number = 0,
  deduction: number = 0,
  formula: "rate_x_percentage" | "fixed_rate" | "manual" = "rate_x_percentage",
  manualAmount?: number
): { calculatedSalary: number; finalSalary: number } {
  let calculatedSalary = 0;

  if (formula === "rate_x_percentage") {
    calculatedSalary = baseRate * (performancePercentage / 100);
  } else if (formula === "fixed_rate") {
    calculatedSalary = baseRate;
  } else if (formula === "manual") {
    calculatedSalary = manualAmount ?? baseRate;
  }

  const finalSalary = Math.max(0, calculatedSalary + bonus - deduction);
  return { calculatedSalary, finalSalary };
}

/**
 * Evaluation score utilities
 */
export function calcEvaluationTotals(scores: {
  punctualityCommitment: number;
  taskFocusResponsibility: number;
  kidsHandling: number;
  energyEngagement: number;
  explanationAnimatorSkill: number;
  vrArGameHandling: number;
  teamwork: number;
  problemSolvingPressure: number;
  professionalism: number;
  leadershipPotential: number;
  scoreMax?: number;
}): { totalScore: number; performancePercentage: number } {
  const totalScore =
    scores.punctualityCommitment +
    scores.taskFocusResponsibility +
    scores.kidsHandling +
    scores.energyEngagement +
    scores.explanationAnimatorSkill +
    scores.vrArGameHandling +
    scores.teamwork +
    scores.problemSolvingPressure +
    scores.professionalism +
    scores.leadershipPotential;

  const scoreMax = scores.scoreMax ?? 25;
  const performancePercentage = scoreMax > 0 ? Math.round((totalScore / scoreMax) * 100) : 0;

  return { totalScore, performancePercentage };
}

/**
 * Promotion readiness logic
 */
export function isReadyForAnimator(stats: {
  avgPerformance: number;
  avgKidsHandling: number;
  avgAnimatorSkill: number;
  hasAttendanceRisk: boolean;
  totalEvents: number;
}): boolean {
  return (
    stats.avgPerformance >= 85 &&
    stats.avgKidsHandling >= 3 &&
    stats.avgAnimatorSkill >= 2.5 &&
    !stats.hasAttendanceRisk &&
    stats.totalEvents >= 3
  );
}

export function isReadyForCoordinator(stats: {
  avgPerformance: number;
  avgLeadership: number;
  avgProblemSolving: number;
  avgTeamwork: number;
  hasAttendanceRisk: boolean;
  totalEvents: number;
}): boolean {
  return (
    stats.avgPerformance >= 88 &&
    stats.avgLeadership >= 0.8 &&
    stats.avgProblemSolving >= 1.5 &&
    stats.avgTeamwork >= 1.5 &&
    !stats.hasAttendanceRisk &&
    stats.totalEvents >= 5
  );
}

/**
 * Attendance risk logic
 */
export function hasAttendanceRisk(recentAttendances: Array<{ attendanceStatus: string }>): boolean {
  const absences = recentAttendances.filter((a) => a.attendanceStatus === "absent").length;
  const lates = recentAttendances.filter((a) => a.attendanceStatus === "late").length;
  return absences >= 2 || lates >= 2;
}

/**
 * Format helpers
 */
export function formatCurrency(amount: number): string {
  return `EGP ${amount.toLocaleString("en-EG", { minimumFractionDigits: 0, maximumFractionDigits: 1 })}`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function labelRole(role: string): string {
  const map: Record<string, string> = {
    facilitator: "Facilitator",
    animator: "Animator",
    coordinator: "Coordinator",
    vr_support: "VR Support",
    ar_support: "AR Support",
    setup: "Setup",
    media_support: "Media Support",
    trainee: "Trainee",
    event_manager_candidate: "EM Candidate",
  };
  return map[role] ?? role;
}

export function labelEventType(type: string): string {
  const map: Record<string, string> = {
    nursery: "Nursery",
    school: "School",
    public_event: "Public Event",
    competition: "Competition",
    training: "Training",
    online: "Online",
    custom: "Custom",
  };
  return map[type] ?? type;
}

export function labelStatus(status: string): string {
  const map: Record<string, string> = {
    active: "Active",
    inactive: "Inactive",
    trainee: "Trainee",
    rejected: "Rejected",
    on_hold: "On Hold",
    planned: "Planned",
    confirmed: "Confirmed",
    completed: "Completed",
    canceled: "Canceled",
    pending: "Pending",
    sent: "Sent",
    draft: "Draft",
    ready_for_payment: "Ready",
    partially_paid: "Partial",
    paid: "Paid",
    attended: "Attended",
    absent: "Absent",
    late: "Late",
    left_early: "Left Early",
    excused: "Excused",
    open: "Open",
    resolved: "Resolved",
    ignored: "Ignored",
  };
  return map[status] ?? status;
}
