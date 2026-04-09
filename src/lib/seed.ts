import { getDb } from './db';
import { v4 as uuidv4 } from 'uuid';

export async function seedDemoData() {
  const db = await getDb();

  // Clean old data to ensure clean single-user demo state
  await db.run('DELETE FROM products');
  await db.run('DELETE FROM reviews');
  await db.run('DELETE FROM conversations');
  await db.run('DELETE FROM contacts');
  await db.run('DELETE FROM organizations');

  // 1. Create a single master test user
  const masterOrg = { id: 'pizzeria-id-demo', name: 'Pizzería Roma', slug: 'pizzeria-roma', type: 'restaurant' };

  await db.run(
    'INSERT OR IGNORE INTO organizations (id, name, slug, whatsapp_phone, google_maps_url) VALUES (?, ?, ?, ?, ?)',
    [masterOrg.id, masterOrg.name, masterOrg.slug, '+34600000000', 'https://goo.gl/maps/example']
  );

  // 2. Pre-fill catalog products for the bio-link
  const sampleProducts = [
    { name: 'Pizza Barbacoa', price: 14.50, description: 'Salsa barbacoa, carne picada, bacon y extra de mozzarella.', icon: '🍕' },
    { name: 'Hamburguesa Trufada', price: 12.90, description: 'Carne 100% vacuno, salsa tartufata, queso brie y setas.', icon: '🍔' },
    { name: 'Bebidas Auténticas', price: 3.50, description: 'Refrescos helados, cervezas artesanales y cócteles.', icon: '🍹' }
  ];

  for (const prod of sampleProducts) {
    await db.run(
      'INSERT OR IGNORE INTO products (id, org_id, name, description, price, icon) VALUES (?, ?, ?, ?, ?, ?)',
      [uuidv4(), masterOrg.id, prod.name, prod.description, prod.price, prod.icon]
    );
  }

  // 3. Pre-fill some contacts and leads
  const contactId = uuidv4();
  await db.run(
    'INSERT OR IGNORE INTO contacts (id, org_id, name, phone) VALUES (?, ?, ?, ?)',
    [contactId, masterOrg.id, 'Inversor Demo', '+34 699 999 999']
  );

  // 4. Initial conversation
  const convId = uuidv4();
  await db.run(
    'INSERT OR IGNORE INTO conversations (id, org_id, contact_id, last_message) VALUES (?, ?, ?, ?)',
    [convId, masterOrg.id, contactId, 'Hola, esto es una demo comercial generada automáticamente.']
  );

  // 5. Initial Review
  await db.run(
    'INSERT OR IGNORE INTO reviews (id, org_id, rating, comment, author_name) VALUES (?, ?, ?, ?, ?)',
    [uuidv4(), masterOrg.id, 5, 'Acabamos de ver la web y nos encanta el menú.', 'Influencer Local']
  );

  console.log('✅ Master Demo Profile & Catalog Seeded.');
}
