const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

async function seedDemoData() {
  const dbPath = path.join(__dirname, 'guarapoia_v2.sqlite');
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL,
      name TEXT,
      phone TEXT NOT NULL,
      last_interaction DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL,
      contact_id TEXT NOT NULL,
      status TEXT DEFAULT 'open',
      last_message TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conv_id TEXT NOT NULL,
      direction TEXT NOT NULL,
      content TEXT NOT NULL,
      sender_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      author_name TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const verticals = [
    { id: 'pizzeria-id-demo', name: 'Pizzeria Roma', slug: 'pizzeria-roma', type: 'restaurant' },
    { id: uuidv4(), name: 'Clinica Dental Sonrisas', slug: 'dental-sonrisas', type: 'health' },
    { id: uuidv4(), name: 'Auto Taller Mecanico', slug: 'auto-taller', type: 'automotive' }
  ];

  // Fixed IDs so we can re-seed consistently
  const contact1 = 'contact-maria-001';
  const contact2 = 'contact-juan-002';
  const contact3 = 'contact-elena-003';
  const conv1 = 'conv-maria-001';
  const conv2 = 'conv-juan-002';
  const conv3 = 'conv-elena-003';

  for (let i = 0; i < verticals.length; i++) {
    const v = verticals[i];
    await db.run(
      'INSERT OR IGNORE INTO organizations (id, name, slug) VALUES (?, ?, ?)',
      [v.id, v.name, v.slug]
    );

    if (i === 0) {
      // Pizzeria Roma - full realistic demo data
      await db.run('INSERT OR IGNORE INTO contacts (id, org_id, name, phone) VALUES (?, ?, ?, ?)',
        [contact1, v.id, 'Maria Garcia', '+34 612 345 678']);
      await db.run('INSERT OR IGNORE INTO contacts (id, org_id, name, phone) VALUES (?, ?, ?, ?)',
        [contact2, v.id, 'Juan Perez', '+34 623 456 789']);
      await db.run('INSERT OR IGNORE INTO contacts (id, org_id, name, phone) VALUES (?, ?, ?, ?)',
        [contact3, v.id, 'Elena Rodriguez', '+34 634 567 890']);

      await db.run('INSERT OR IGNORE INTO conversations (id, org_id, contact_id, last_message, status) VALUES (?, ?, ?, ?, ?)',
        [conv1, v.id, contact1, 'Perfecto Maria, le esperamos esta noche!', 'open']);
      await db.run('INSERT OR IGNORE INTO conversations (id, org_id, contact_id, last_message, status) VALUES (?, ?, ?, ?, ?)',
        [conv2, v.id, contact2, 'Si por favor, seria genial', 'open']);
      await db.run('INSERT OR IGNORE INTO conversations (id, org_id, contact_id, last_message, status) VALUES (?, ?, ?, ?, ?)',
        [conv3, v.id, contact3, 'El servicio fue impecable. Volveremos pronto!', 'open']);

      // Messages for conv1 (Maria - Reserva)
      const msgs1 = [
        { id: uuidv4(), conv: conv1, dir: 'inbound',  content: 'Hola! Quisiera reservar una mesa para 4 personas hoy a las 20:30.', sender: null },
        { id: uuidv4(), conv: conv1, dir: 'outbound', content: 'Buenas! Claro que si, confirmamos su reserva para 4 personas a las 20:30. Nombre para la reserva?', sender: 'Admin' },
        { id: uuidv4(), conv: conv1, dir: 'inbound',  content: 'A nombre de Maria Garcia. Muchas gracias!', sender: null },
        { id: uuidv4(), conv: conv1, dir: 'outbound', content: 'Perfecto Maria, le esperamos esta noche! Disfrute la velada.', sender: 'Admin' },
      ];

      // Messages for conv2 (Juan - Sin gluten)
      const msgs2 = [
        { id: uuidv4(), conv: conv2, dir: 'inbound',  content: 'Teneis opciones sin gluten en el menu?', sender: null },
        { id: uuidv4(), conv: conv2, dir: 'outbound', content: 'Hola Juan! Si, tenemos pizza sin gluten y pasta especial. Te enviamos el menu completo?', sender: 'Admin' },
        { id: uuidv4(), conv: conv2, dir: 'inbound',  content: 'Si por favor, seria genial', sender: null },
      ];

      // Messages for conv3 (Elena - Resena)
      const msgs3 = [
        { id: uuidv4(), conv: conv3, dir: 'inbound',  content: 'Buenas noches! Acabo de cenar en vuestro restaurante y queria dejaros una resena.', sender: null },
        { id: uuidv4(), conv: conv3, dir: 'outbound', content: 'Hola Elena! Muchas gracias por visitarnos. Como fue tu experiencia?', sender: 'Admin' },
        { id: uuidv4(), conv: conv3, dir: 'inbound',  content: 'El servicio fue impecable. Volveremos pronto! 5 estrellas sin duda.', sender: null },
        { id: uuidv4(), conv: conv3, dir: 'outbound', content: 'Nos alegra muchisimo Elena! Gracias por tu confianza. Te esperamos pronto!', sender: 'Admin' },
      ];

      for (const msg of [...msgs1, ...msgs2, ...msgs3]) {
        await db.run(
          'INSERT OR IGNORE INTO messages (id, conv_id, direction, content, sender_name) VALUES (?, ?, ?, ?, ?)',
          [msg.id, msg.conv, msg.dir, msg.content, msg.sender]
        );
      }

      // Reviews
      await db.run('INSERT OR IGNORE INTO reviews (id, org_id, rating, comment, author_name) VALUES (?, ?, ?, ?, ?)',
        [uuidv4(), v.id, 5, 'El servicio fue excelente y la comida deliciosa. Muy recomendado.', 'Maria L.']);
      await db.run('INSERT OR IGNORE INTO reviews (id, org_id, rating, comment, author_name) VALUES (?, ?, ?, ?, ?)',
        [uuidv4(), v.id, 4, 'Buen ambiente, aunque tardaron un poco en traer la cuenta.', 'Pedro S.']);
      await db.run('INSERT OR IGNORE INTO reviews (id, org_id, rating, comment, author_name) VALUES (?, ?, ?, ?, ?)',
        [uuidv4(), v.id, 5, 'Increible experiencia, volveremos seguro.', 'Ana R.']);

    } else {
      const contactId = uuidv4();
      await db.run('INSERT OR IGNORE INTO contacts (id, org_id, name, phone) VALUES (?, ?, ?, ?)',
        [contactId, v.id, 'Cliente de Prueba', '+34 600 000 000']);
      const convId = uuidv4();
      await db.run('INSERT OR IGNORE INTO conversations (id, org_id, contact_id, last_message) VALUES (?, ?, ?, ?)',
        [convId, v.id, contactId, 'Hola, me gustaria informacion sobre vuestros servicios.']);
      await db.run('INSERT OR IGNORE INTO reviews (id, org_id, rating, comment, author_name) VALUES (?, ?, ?, ?, ?)',
        [uuidv4(), v.id, 5, 'Excelente servicio, muy profesionales.', 'Usuario Anonimo']);
    }
  }

  console.log('Demo Data Seeded OK - Pizzeria Roma con conversaciones y mensajes para GuarapoIA.');
  await db.close();
}

seedDemoData().catch(console.error);
