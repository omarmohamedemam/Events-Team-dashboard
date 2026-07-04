import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const name = process.env.ADMIN_NAME || "GMind Admin";
const email = process.env.ADMIN_EMAIL || "admin@gmind.com";
const password = process.env.ADMIN_PASSWORD || "gmind12345";
const passwordHash = await bcrypt.hash(password, 10);

await prisma.user.upsert({
  where: { email },
  update: {
    name,
    passwordHash,
    role: "event_manager",
    status: "active",
  },
  create: {
    name,
    email,
    passwordHash,
    role: "event_manager",
    status: "active",
  },
});

console.log(`Reset admin user: ${email}`);
await prisma.$disconnect();
