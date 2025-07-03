import { PrismaClient, AuthProvider } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Organization Plans
  const freePlan = await prisma.organizationPlan.upsert({
    where: { id: 'free-plan' },
    update: {},
    create: {
      id: 'free-plan',
      name: 'Free',
      description: 'Basic plan for individual creators',
      price: 0,
      features: {
        maxUsers: 1,
        maxPlatforms: 1,
        maxPostsPerMonth: 10,
        analytics: false,
        customWorkflows: false,
      },
    },
  });

  const paidPlan = await prisma.organizationPlan.upsert({
    where: { id: 'paid-plan' },
    update: {},
    create: {
      id: 'paid-plan',
      name: 'Paid',
      description: 'Professional plan for teams',
      price: 29.99,
      features: {
        maxUsers: 10,
        maxPlatforms: 5,
        maxPostsPerMonth: 1000,
        analytics: true,
        customWorkflows: true,
      },
    },
  });

  // Create System Organization with Admin
  const systemOrg = await prisma.organization.upsert({
    where: { id: 'system-org' },
    update: {},
    create: {
      id: 'system-org',
      name: 'System Organization',
      planId: paidPlan.id,
      members: {
        create: {
          user: {
            create: {
              email: 'admin@system.com',
              name: 'System Admin',
              authProvider: AuthProvider.EMAIL_PASSWORD,
              password: '$2b$10$YP9VdWcVHoj.TwIpHGV7h.lU4jl4Tthkt7cx2FUV0bXnO8kEAvw.q', // "admin123"
            },
          },
          role: 'ADMIN',
        },
      },
    },
  });

  // Create Client Organization with Regular User
  const clientOrg = await prisma.organization.upsert({
    where: { id: 'client-org' },
    update: {},
    create: {
      id: 'client-org',
      name: 'Client Organization',
      planId: freePlan.id,
      members: {
        create: {
          user: {
            create: {
              email: 'user@client.com',
              name: 'Client User',
              authProvider: AuthProvider.EMAIL_PASSWORD,
              password: '$2b$10$YP9VdWcVHoj.TwIpHGV7h.lU4jl4Tthkt7cx2FUV0bXnO8kEAvw.q', // "admin123"
            },
          },
          role: 'MEMBER',
        },
      },
    },
  });

  // Create Paying Clients Organization
  const payingClientOrg = await prisma.organization.upsert({
    where: { id: 'paying-client-org' },
    update: {},
    create: {
      id: 'paying-client-org',
      name: 'Paying Clients Org',
      planId: paidPlan.id,
      members: {
        create: {
          user: {
            create: {
              email: 'user@payingclient.com',
              name: 'Paying Client User',
              authProvider: AuthProvider.EMAIL_PASSWORD,
              password: '$2b$10$YP9VdWcVHoj.TwIpHGV7h.lU4jl4Tthkt7cx2FUV0bXnO8kEAvw.q', // "admin123"
            },
          },
          role: 'MEMBER',
        },
      },
    },
  });

  console.log({
    freePlan,
    paidPlan,
    systemOrg,
    clientOrg,
    payingClientOrg,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 