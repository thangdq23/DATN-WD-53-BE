import dotenv from "dotenv";
import z from "zod";

dotenv.config({});

const envVarsSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z.coerce.number().default(8000),
  HOST: z.string().min(1).default("127.0.0.1"),
  DB_URI: z.string().min(1).describe("Local Mongo DB"),
  JWT_ACCESS_SECRET: z.string().min(1).default("change_this_secret"),
  JWT_ACCESS_EXPIRED: z.string().default("7d"),
  PAYOS_CLIENT_ID: z.string(),
  PAYOS_API_KEY: z.string(),
  PAYOS_CHECKSUM_KEY: z.string(),
  EMAIL_USER: z.string(),
  EMAIL_PASSWORD: z.string(),
});
const result = envVarsSchema.safeParse(process.env);
if (!result.success) {
  result.error.issues.forEach((issue) => {
    console.error(`❌ Field "${issue.path.join(".")}" - ${issue.message}`);
  });
  console.error(
    "⛔ Stopping application due to missing environment variables.",
  );
  process.exit(1);
}
const envVars = result.data;

export const {
  NODE_ENV,
  PORT,
  HOST,
  DB_URI,
  JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRED,
  PAYOS_CLIENT_ID,
  PAYOS_API_KEY,
  PAYOS_CHECKSUM_KEY,
  EMAIL_USER,
  EMAIL_PASSWORD,
} = envVars;
