-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('event_manager', 'events_hr', 'ceo', 'financial_manager');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "SchoolType" AS ENUM ('school', 'faculty', 'other', 'unknown');

-- CreateEnum
CREATE TYPE "TeamType" AS ENUM ('internal', 'newcomer', 'external', 'coordinator');

-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('facilitator', 'animator', 'coordinator', 'event_manager_candidate', 'trainee');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('active', 'inactive', 'trainee', 'rejected', 'on_hold');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('nursery', 'school', 'public_event', 'competition', 'training', 'online', 'custom');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('planned', 'confirmed', 'completed', 'canceled');

-- CreateEnum
CREATE TYPE "AssignedRole" AS ENUM ('facilitator', 'animator', 'coordinator', 'vr_support', 'ar_support', 'setup', 'media_support', 'trainee');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('assigned', 'confirmed', 'replaced', 'canceled');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('attended', 'absent', 'late', 'left_early', 'excused');

-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('event_feedback', 'period_feedback', 'warning_feedback', 'promotion_feedback');

-- CreateEnum
CREATE TYPE "NoteType" AS ENUM ('feedback', 'warning', 'serious_warning', 'no_show', 'behavior_issue', 'attendance_issue', 'performance_issue', 'improvement_plan');

-- CreateEnum
CREATE TYPE "NoteStatus" AS ENUM ('open', 'resolved', 'ignored');

-- CreateEnum
CREATE TYPE "SalaryFormula" AS ENUM ('rate_x_percentage', 'fixed_rate', 'manual');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'sent', 'canceled');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('cash', 'instapay', 'bank_transfer', 'wallet', 'other');

-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('draft', 'ready_for_payment', 'partially_paid', 'paid', 'canceled');

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('online', 'offline', 'mixed');

-- CreateEnum
CREATE TYPE "TrainingAttStatus" AS ENUM ('attended', 'absent', 'late', 'excused');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'event_manager',
    "status" "Status" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "gmindId" TEXT,
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "schoolOrFaculty" "SchoolType" NOT NULL DEFAULT 'unknown',
    "schoolOrFacultyName" TEXT,
    "nationality" TEXT,
    "governorate" TEXT,
    "address" TEXT,
    "socialMediaLink" TEXT,
    "personalPhotoUrl" TEXT,
    "teamType" "TeamType" NOT NULL DEFAULT 'internal',
    "mainRole" "MemberRole" NOT NULL DEFAULT 'facilitator',
    "status" "MemberStatus" NOT NULL DEFAULT 'active',
    "arSupport" BOOLEAN NOT NULL DEFAULT false,
    "vrSupport" BOOLEAN NOT NULL DEFAULT false,
    "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "startDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "clientName" TEXT,
    "eventType" "EventType" NOT NULL DEFAULT 'school',
    "eventDate" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "expectedKids" INTEGER,
    "actualKids" INTEGER,
    "requiredTeamCount" INTEGER,
    "eventManagerId" TEXT,
    "status" "EventStatus" NOT NULL DEFAULT 'planned',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventAssignment" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "teamMemberId" TEXT NOT NULL,
    "assignedRole" "AssignedRole" NOT NULL DEFAULT 'facilitator',
    "plannedRate" DOUBLE PRECISION,
    "assignmentStatus" "AssignmentStatus" NOT NULL DEFAULT 'assigned',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "teamMemberId" TEXT NOT NULL,
    "attendanceStatus" "AttendanceStatus" NOT NULL DEFAULT 'attended',
    "arrivalTime" TEXT,
    "leavingTime" TEXT,
    "attendanceNote" TEXT,
    "markedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "teamMemberId" TEXT NOT NULL,
    "evaluatorUserId" TEXT,
    "punctualityCommitment" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taskFocusResponsibility" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "kidsHandling" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "energyEngagement" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "explanationAnimatorSkill" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "vrArGameHandling" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "teamwork" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "problemSolvingPressure" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "professionalism" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "leadershipPotential" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "scoreMax" DOUBLE PRECISION NOT NULL DEFAULT 25,
    "performancePercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "generalNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "teamMemberId" TEXT NOT NULL,
    "eventId" TEXT,
    "periodLabel" TEXT,
    "feedbackType" "FeedbackType" NOT NULL DEFAULT 'event_feedback',
    "strengths" TEXT NOT NULL,
    "gaps" TEXT,
    "recommendations" TEXT NOT NULL,
    "trainingNeeded" BOOLEAN NOT NULL DEFAULT false,
    "promotionReady" BOOLEAN NOT NULL DEFAULT false,
    "recommendedRole" "MemberRole",
    "preparedByUserId" TEXT,
    "approvedByUserId" TEXT,
    "exportPdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarningNote" (
    "id" TEXT NOT NULL,
    "teamMemberId" TEXT NOT NULL,
    "eventId" TEXT,
    "noteType" "NoteType" NOT NULL DEFAULT 'feedback',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "actionRequired" TEXT,
    "dueDate" TIMESTAMP(3),
    "status" "NoteStatus" NOT NULL DEFAULT 'open',
    "createdByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WarningNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateSetting" (
    "id" TEXT NOT NULL,
    "eventType" "EventType" NOT NULL,
    "role" "AssignedRole" NOT NULL,
    "baseRate" DOUBLE PRECISION NOT NULL,
    "salaryFormulaType" "SalaryFormula" NOT NULL DEFAULT 'rate_x_percentage',
    "scoreMax" DOUBLE PRECISION NOT NULL DEFAULT 25,
    "activeFrom" TIMESTAMP(3),
    "activeTo" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RateSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalaryRecord" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "teamMemberId" TEXT NOT NULL,
    "role" "AssignedRole" NOT NULL,
    "eventType" "EventType" NOT NULL,
    "baseRate" DOUBLE PRECISION NOT NULL,
    "performancePercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "calculatedSalary" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bonus" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "deduction" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "finalSalary" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'cash',
    "financialNote" TEXT,
    "paymentBatchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalaryRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentBatch" (
    "id" TEXT NOT NULL,
    "batchName" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "BatchStatus" NOT NULL DEFAULT 'draft',
    "preparedByUserId" TEXT,
    "approvedByUserId" TEXT,
    "sentByUserId" TEXT,
    "sentAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingSession" (
    "id" TEXT NOT NULL,
    "sessionName" TEXT NOT NULL,
    "sessionDate" TIMESTAMP(3) NOT NULL,
    "trainerName" TEXT,
    "topic" TEXT,
    "sessionType" "SessionType" NOT NULL DEFAULT 'offline',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingAttendance" (
    "id" TEXT NOT NULL,
    "trainingSessionId" TEXT NOT NULL,
    "teamMemberId" TEXT NOT NULL,
    "attendanceStatus" "TrainingAttStatus" NOT NULL DEFAULT 'attended',
    "activityScore" DOUBLE PRECISION,
    "passed" BOOLEAN,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_gmindId_key" ON "TeamMember"("gmindId");

-- CreateIndex
CREATE UNIQUE INDEX "EventAssignment_eventId_teamMemberId_key" ON "EventAssignment"("eventId", "teamMemberId");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_eventId_teamMemberId_key" ON "Attendance"("eventId", "teamMemberId");

-- CreateIndex
CREATE UNIQUE INDEX "Evaluation_eventId_teamMemberId_key" ON "Evaluation"("eventId", "teamMemberId");

-- CreateIndex
CREATE UNIQUE INDEX "RateSetting_eventType_role_isActive_key" ON "RateSetting"("eventType", "role", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "SalaryRecord_eventId_teamMemberId_key" ON "SalaryRecord"("eventId", "teamMemberId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingAttendance_trainingSessionId_teamMemberId_key" ON "TrainingAttendance"("trainingSessionId", "teamMemberId");

-- AddForeignKey
ALTER TABLE "EventAssignment" ADD CONSTRAINT "EventAssignment_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventAssignment" ADD CONSTRAINT "EventAssignment_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_markedByUserId_fkey" FOREIGN KEY ("markedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_evaluatorUserId_fkey" FOREIGN KEY ("evaluatorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_preparedByUserId_fkey" FOREIGN KEY ("preparedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarningNote" ADD CONSTRAINT "WarningNote_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarningNote" ADD CONSTRAINT "WarningNote_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarningNote" ADD CONSTRAINT "WarningNote_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryRecord" ADD CONSTRAINT "SalaryRecord_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryRecord" ADD CONSTRAINT "SalaryRecord_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryRecord" ADD CONSTRAINT "SalaryRecord_paymentBatchId_fkey" FOREIGN KEY ("paymentBatchId") REFERENCES "PaymentBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentBatch" ADD CONSTRAINT "PaymentBatch_preparedByUserId_fkey" FOREIGN KEY ("preparedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentBatch" ADD CONSTRAINT "PaymentBatch_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentBatch" ADD CONSTRAINT "PaymentBatch_sentByUserId_fkey" FOREIGN KEY ("sentByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingAttendance" ADD CONSTRAINT "TrainingAttendance_trainingSessionId_fkey" FOREIGN KEY ("trainingSessionId") REFERENCES "TrainingSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingAttendance" ADD CONSTRAINT "TrainingAttendance_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
