
import { neon } from "@neondatabase/serverless";

const connectionString =
  process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL environment variable bulunamadı."
  );
}

const sql = neon(connectionString);

export default sql;
