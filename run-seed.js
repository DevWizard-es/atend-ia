import { seedDemoData } from './src/lib/seed';

seedDemoData()
  .then(() => {
    console.log('🏁 Seeding finished.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  });
