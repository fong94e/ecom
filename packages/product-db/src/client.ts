import { log } from "node:console";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config({
    path: "../../packages/product-db/.env",
});

console.log("DB URL:", process.env.DATABASE_URL);

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient;
};

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter,
    });

if (process.env.NODE_ENV !== "production")
    globalForPrisma.prisma = prisma;
