import { lt } from "drizzle-orm";
import { db } from "../src/db";
import { documents } from "../src/db/schema";

const RETENTION_HOURS = 24 * 60 * 60 * 1000;

async function cleanup() {
  console.log("Starting cleanup");
  const cutoff = new Date(Date.now() - RETENTION_HOURS);
  console.log("Deleting before:", cutoff);
  const result = await db
    .delete(documents)
    .where(lt(documents.uploadedAt, cutoff))
    .returning();
  console.log(`Deleted ${result.length} expired documents`);
}

cleanup()
  .then(() => {process.exit(0)})
  .catch((error) => {
    console.log("Cleanup failed: ", error);
    process.exit(1);
  });
