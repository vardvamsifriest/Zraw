import { PrismaClient } from "../generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import * as dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaNeon({ 
  connectionString: process.env.DATABASE_URL 
});

export const prisma = new PrismaClient({ adapter });
export { PrismaClient } from "../generated/prisma";