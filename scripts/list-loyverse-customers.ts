import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const LOYVERSE_API_URL = 'https://api.loyverse.com/v1.0';

async function main() {
  const config = await prisma.loyverseConfig.findUnique({ where: { id: 'singleton' } });
  if (config === null) {
    console.log('Pas de config');
    return;
  }

  const headers = {
    'Authorization': 'Bearer ' + config.accessToken,
    'Content-Type': 'application/json',
  };

  console.log('Liste des clients dans Loyverse:\n');

  const response = await fetch(LOYVERSE_API_URL + '/customers?limit=100', { headers });
  const data = await response.json();

  if (data.customers) {
    data.customers.forEach((c: { name: string; id: string; email?: string; customer_code?: string; total_points: number }, i: number) => {
      console.log((i+1) + '. ' + c.name);
      console.log('   ID: ' + c.id);
      console.log('   Email: ' + (c.email || 'N/A'));
      console.log('   Code client: ' + (c.customer_code || 'AUCUN'));
      console.log('   Points: ' + c.total_points);
      console.log('');
    });
    console.log('Total: ' + data.customers.length + ' clients');
  } else {
    console.log('Reponse:', JSON.stringify(data, null, 2));
  }

  await prisma.$disconnect();
}

main();
