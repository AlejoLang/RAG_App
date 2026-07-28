import { lt } from "drizzle-orm";
import { db } from "../src/db";
import { documents } from "../src/db/schema";

const RETENTION_HOURS = 24;

async function cleanup() {
  const cutoff = new Date(Date.now() - RETENTION_HOURS);
  const result = await db
    .delete(documents)
    .where(lt(documents.uploadedAt, cutoff));
  console.log(`Deleted ${result.length} expired documents`);
}

cleanup()
  .then(process.exit(0))
  .catch((error) => {
    console.log("Cleanup failed: ", error);
    process.exit(1);
  });
