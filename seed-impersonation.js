import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

/**
 * Inserts sample rows into IMPERSONATION_SESSION using existing ADMIN and CUSTOMER.
 * Run: node seed-impersonation.js
 * Does not delete any other data.
 */
async function main() {
  const admin = await prisma.ADMIN.findFirst();
  const customer = await prisma.CUSTOMER.findFirst();

  if (!admin || !customer) {
    console.log('No ADMIN or CUSTOMER found. Run the full demo first: node index.js');
    process.exit(1);
  }

  await prisma.IMPERSONATION_SESSION.createMany({
    data: [
      {
        admin_id: admin.admin_id,
        customer_id: customer.customer_id,
        ip_address: '192.168.1.10',
        reason: 'Customer requested help with delivery preference',
        is_active: 0,
        ended_at: new Date(),
      },
      {
        admin_id: admin.admin_id,
        customer_id: customer.customer_id,
        ip_address: '10.0.0.5',
        reason: 'Support ticket #4421',
        is_active: 1,
      },
      {
        admin_id: admin.admin_id,
        customer_id: customer.customer_id,
        ip_address: '172.16.0.1',
        reason: null,
        is_active: 1,
      },
    ],
  });

  const count = await prisma.IMPERSONATION_SESSION.count();
  console.log('IMPERSONATION_SESSION seeded. Row count:', count);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
