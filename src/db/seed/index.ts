import { seedProperties } from "./properties.seed";

async function main() {
  await seedProperties();
  console.log("🌱 Seeding completed!");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
