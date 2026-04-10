const { createClient } = require('@libsql/client');
const { v4: uuidv4 } = require('uuid');

const dbUrl = "libsql://atendia-devwizard-es.aws-eu-west-1.turso.io";
const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzU4MTI2MDEsImlkIjoiMDE5ZDc2NzQtNDgwMS03YjhiLWI0ZDctZmU2N2ZlOTNlOWQxIiwicmlkIjoiYzVjNjE1NTktYjJmYy00MmNhLWJmNDAtZjY0MWI0YmRkNjQ0In0.kVwEw5RoZWyUJTsRmKdDKeSgBkb02jRNavrqpF6as3IMa3TFWz4orIM_7HGvVBgNHfzi71w_xs892wUzpPh2AQ";

async function seed() {
  const client = createClient({
    url: dbUrl,
    authToken: authToken,
  });

  console.log('Connecting to Turso...');

  const statements = [
    `CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      whatsapp_phone TEXT DEFAULT '',
      google_maps_url TEXT DEFAULT '',
      agent_tone TEXT DEFAULT 'Pro',
      agent_instructions TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'owner',
      FOREIGN KEY (org_id) REFERENCES organizations (id)
    )`,
    `CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL,
      name TEXT,
      phone TEXT NOT NULL,
      last_interaction DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (org_id) REFERENCES organizations (id)
    )`,
    `CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL,
      contact_id TEXT NOT NULL,
      status TEXT DEFAULT 'open',
      last_message TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (org_id) REFERENCES organizations (id),
      FOREIGN KEY (contact_id) REFERENCES contacts (id)
    )`,
    `CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conv_id TEXT NOT NULL,
      direction TEXT NOT NULL,
      content TEXT NOT NULL,
      sender_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conv_id) REFERENCES conversations (id)
    )`,
    `CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      author_name TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (org_id) REFERENCES organizations (id)
    )`,
    `CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      icon TEXT DEFAULT '🛒',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (org_id) REFERENCES organizations (id)
    )`
  ];

  for (const sql of statements) {
    console.log(`Executing: ${sql.substring(0, 50)}...`);
    await client.execute(sql);
  }

  console.log('Tables ensured.');

  // 1. Clean old data (using try/catch in case tables are empty or have constraints)
  const tables = ['products', 'reviews', 'messages', 'conversations', 'contacts', 'users', 'organizations'];
  for (const table of tables) {
    try {
      console.log(`Cleaning table: ${table}`);
      await client.execute(`DELETE FROM ${table}`);
    } catch (e) {
      console.warn(`Warning cleaning ${table}: ${e.message}`);
    }
  }

  console.log('Old data cleared.');

  // 1. Create a single master test user
  const masterOrg = { id: 'pizzeria-id-demo', name: 'Pizzería Roma', slug: 'pizzeria-roma' };

  await client.execute({
    sql: 'INSERT INTO organizations (id, name, slug, whatsapp_phone, google_maps_url) VALUES (?, ?, ?, ?, ?)',
    args: [masterOrg.id, masterOrg.name, masterOrg.slug, '+34600000000', 'https://goo.gl/maps/example']
  });

  // 2. Pre-fill catalog products
  const sampleProducts = [
    { name: 'Pizza Barbacoa', price: 14.50, description: 'Salsa barbacoa, carne picada, bacon y extra de mozzarella.', icon: '🍕' },
    { name: 'Hamburguesa Trufada', price: 12.90, description: 'Carne 100% vacuno, salsa tartufata, queso brie y setas.', icon: '🍔' },
    { name: 'Bebidas Auténticas', price: 3.50, description: 'Refrescos helados, cervezas artesanales y cócteles.', icon: '🍹' }
  ];

  for (const prod of sampleProducts) {
    await client.execute({
      sql: 'INSERT INTO products (id, org_id, name, description, price, icon) VALUES (?, ?, ?, ?, ?, ?)',
      args: [uuidv4(), masterOrg.id, prod.name, prod.description, prod.price, prod.icon]
    });
  }

  // 3. Pre-fill some contacts and leads
  const contactId = uuidv4();
  await client.execute({
    sql: 'INSERT INTO contacts (id, org_id, name, phone) VALUES (?, ?, ?, ?)',
    args: [contactId, masterOrg.id, 'Inversor Demo', '+34 699 999 999']
  });

  // 4. Initial conversation
  const convId = uuidv4();
  await client.execute({
    sql: 'INSERT INTO conversations (id, org_id, contact_id, last_message) VALUES (?, ?, ?, ?)',
    args: [convId, masterOrg.id, contactId, 'Hola, esto es una demo comercial generada automáticamente.']
  });

  // 5. Initial Review
  await client.execute({
    sql: 'INSERT INTO reviews (id, org_id, rating, comment, author_name) VALUES (?, ?, ?, ?, ?)',
    args: [uuidv4(), masterOrg.id, 5, 'Acabamos de ver la web y nos encanta el menú.', 'Influencer Local']
  });

  console.log('✅ Turso Database Seeded successfully!');
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
