import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const LOYVERSE_API_URL = 'https://api.loyverse.com/v1.0';

async function main() {
  const config = await prisma.loyverseConfig.findUnique({ where: { id: 'singleton' } });
  if (config === null) {
    console.log('Pas de config Loyverse');
    return;
  }

  const headers = {
    'Authorization': 'Bearer ' + config.accessToken,
    'Content-Type': 'application/json',
  };

  // 1. Corriger Famille OUASMI - mauvais ID
  console.log('1. Correction Famille OUASMI...');
  const familleCard = await prisma.memberCard.findFirst({
    where: { cardNumber: 'KW-W1BDXZ' }
  });

  if (familleCard) {
    await prisma.memberCard.update({
      where: { id: familleCard.id },
      data: {
        loyverseCustomerId: '562980f3-f1cc-4976-b8fe-e0b0ae370ac5',
        lastSyncAt: new Date()
      }
    });
    console.log('   ✅ ID corrigé: 562980f3-f1cc-4976-b8fe-e0b0ae370ac5\n');
  }

  // 2. Créer Nouhaila Elrhomri dans Loyverse
  console.log('2. Création Nouhaila Elrhomri dans Loyverse...');
  const nouhailaCard = await prisma.memberCard.findFirst({
    where: { cardNumber: 'KW-BGQ1UY' },
    include: { user: true }
  });

  if (nouhailaCard) {
    const response = await fetch(LOYVERSE_API_URL + '/customers', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: nouhailaCard.user.name,
        email: nouhailaCard.user.email,
        customer_code: nouhailaCard.cardNumber,
        total_points: 0,
      }),
    });

    if (response.ok) {
      const customer = await response.json();
      console.log('   ✅ Client créé: ' + customer.id);

      // Mettre à jour en base
      await prisma.memberCard.update({
        where: { id: nouhailaCard.id },
        data: {
          loyverseCustomerId: customer.id,
          lastSyncAt: new Date()
        }
      });
      console.log('   ✅ ID sauvegardé en base\n');
    } else {
      const error = await response.text();
      console.log('   ❌ Erreur: ' + error + '\n');
    }
  }

  // 3. Vérification finale
  console.log('3. Vérification finale...\n');
  const allCards = await prisma.memberCard.findMany({
    include: { user: { select: { name: true } } }
  });

  for (const card of allCards) {
    const status = card.loyverseCustomerId ? '✅' : '❌';
    console.log(status + ' ' + card.user.name + ' (' + card.cardNumber + ')');
    console.log('   Loyverse ID: ' + (card.loyverseCustomerId || 'AUCUN'));
  }

  console.log('\n🎉 Synchronisation terminée!');
  await prisma.$disconnect();
}

main();
