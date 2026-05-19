import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";
import { users, accounts, sessions, verifications, categories } from "./schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

async function seed() {
  console.log("🌱 Starting seed...\n");

  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  const db = drizzle({ client: pool });

  // Create admin user via Better Auth for proper password hashing
  const auth = betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        user: users,
        session: sessions,
        account: accounts,
        verification: verifications,
      },
    }),
    emailAndPassword: { enabled: true },
  });

  console.log("📝 Creating admin user...");
  try {
    const result = await auth.api.signUpEmail({
      body: {
        name: "INFOKOM",
        email: "infokomhimasda@gmail.com",
        password: process.env.ADMIN_PASSWORD || "#SuperGokil99#",
      },
    });
    console.log("✅ Admin user created:", result.user.email);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("already exists") || message.includes("duplicate")) {
      console.log("ℹ️  Admin user already exists, skipping...");
    } else {
      console.error("❌ Error creating admin:", message);
    }
  }

  // Seed categories
  // console.log("\n📂 Creating categories...");
  // const categoryData = [
  //   { name: "Events", slug: "events", description: "Organization events and gatherings" },
  //   { name: "Academic", slug: "academic", description: "Academic programs and activities" },
  //   { name: "Community", slug: "community", description: "Community service and outreach" },
  //   { name: "Achievement", slug: "achievement", description: "Awards and accomplishments" },
  //   { name: "Announcement", slug: "announcement", description: "Official announcements" },
  // ];

  // for (const cat of categoryData) {
  //   try {
  //     await db.insert(categories).values(cat).onConflictDoNothing();
  //     console.log(`  ✅ Category: ${cat.name}`);
  //   } catch {
  //     console.log(`  ℹ️  Category "${cat.name}" already exists`);
  //   }
  // }

  console.log("\n🎉 Seed complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Admin Email:", "infokomhimasda@gmail.com");
  console.log("  Password:    from ADMIN_PASSWORD env or default in seed.ts");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  await pool.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
