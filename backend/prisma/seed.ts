import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? 'file:./dev.db',
  }),
});

async function main() {
  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: [
      { id: '1', name: 'Ada Lovelace', email: 'ada@example.com' },
      { id: '2', name: 'Grace Hopper', email: 'grace@example.com' },
      { id: '3', name: 'Linus Torvalds', email: 'linus@example.com' },
    ],
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
