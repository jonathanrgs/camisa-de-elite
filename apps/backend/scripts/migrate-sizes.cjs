// Script para migrar estoque e pedidos antigos de GG/XG para XL, 2XL, 3XL, 4XL
// Execute: node scripts/migrate-sizes.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrateInventory() {
  const inventories = await prisma.inventory.findMany();
  for (const inv of inventories) {
    let changed = false;
    let stock = {};
    try {
      stock = JSON.parse(inv.stock);
    } catch (e) {
      continue;
    }
    // Se tiver GG ou XG, migra para XL, 2XL, 3XL, 4XL (distribui ou soma no XL)
    if (stock.GG || stock.XG) {
      stock.XL = (stock.XL || 0) + (stock.GG || 0) + (stock.XG || 0);
      delete stock.GG;
      delete stock.XG;
      changed = true;
    }
    // Garante todos os tamanhos
    for (const t of ['P','M','G','XL','2XL','3XL','4XL']) {
      if (stock[t] === undefined) stock[t] = 0;
    }
    if (changed) {
      await prisma.inventory.update({
        where: { id: inv.id },
        data: { stock: JSON.stringify(stock) }
      });
      console.log(`Migrado estoque do produto ${inv.productId}`);
    }
  }
}

async function migrateOrderItems() {
  const items = await prisma.orderItem.findMany({ where: { OR: [ { size: 'GG' }, { size: 'XG' } ] } });
  for (const item of items) {
    await prisma.orderItem.update({
      where: { id: item.id },
      data: { size: 'XL' }
    });
    console.log(`Migrado item de pedido ${item.id} para XL`);
  }
}

async function migrateCartReservations() {
  const carts = await prisma.cartReservation.findMany({ where: { OR: [ { size: 'GG' }, { size: 'XG' } ] } });
  for (const cart of carts) {
    await prisma.cartReservation.update({
      where: { id: cart.id },
      data: { size: 'XL' }
    });
    console.log(`Migrado reserva de carrinho ${cart.id} para XL`);
  }
}

async function main() {
  await migrateInventory();
  await migrateOrderItems();
  await migrateCartReservations();
  console.log('Migração concluída!');
  await prisma.$disconnect();
}

main();
