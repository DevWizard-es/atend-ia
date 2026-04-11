const { createClient } = require('@libsql/client');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const dbUrl = "libsql://atendia-devwizard-es.aws-eu-west-1.turso.io";
const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzU4MTI2MDEsImlkIjoiMDE5ZDc2NzQtNDgwMS03YjhiLWI0ZDctZmU2N2ZlOTNlOWQxIiwicmlkIjoiYzVjNjE1NTktYjJmYy00MmNhLWJmNDAtZjY0MWI0YmRkNjQ0In0.kVwEw5RoZWyUJTsRmKdDKeSgBkb02jRNavrqpF6as3IMa3TFWz4orIM_7HGvVBgNHfzi71w_xs892wUzpPh2AQ";

async function seed() {
  const client = createClient({
    url: dbUrl,
    authToken: authToken,
  });

  console.log('🚀 Iniciando seeding remoto en Turso...');

  try {
    // 1. Limpiar todo
    const tables = ['products', 'reviews', 'messages', 'conversations', 'contacts', 'users', 'organizations'];
    for (const table of tables) {
      console.log(`Borrando tabla: ${table}`);
      await client.execute(`DELETE FROM ${table}`);
    }

    console.log('✅ Base de datos remota limpiada.');

    // 2. Crear cuenta DEMO oficial
    const demoOrgId = uuidv4();
    const demoUserId = uuidv4();
    const demoSlug = 'atendia-demo';
    const demoEmail = 'demo@atendia.com';
    const demoPassword = await bcrypt.hash('atendia2026', 10);

    await client.execute({
      sql: 'INSERT INTO organizations (id, name, slug, whatsapp_phone, google_maps_url, agent_tone) VALUES (?, ?, ?, ?, ?, ?)',
      args: [demoOrgId, 'AtendIA Demo Business', demoSlug, '+34600000000', 'https://maps.google.com', 'Profesional y cercano']
    });

    await client.execute({
      sql: 'INSERT INTO users (id, org_id, email, password, role) VALUES (?, ?, ?, ?, ?)',
      args: [demoUserId, demoOrgId, demoEmail, demoPassword, 'owner']
    });

    console.log(`✅ Cuenta demo creada en Turso: ${demoEmail} / atendia2026`);

    // 3. Añadir productos de ejemplo
    const sampleProducts = [
      { name: 'Consultoría IA Básica', price: 49.99, description: 'Sesión de 30 min para optimizar tu negocio.', icon: '🤖' },
      { name: 'Plan Premium Mensual', price: 99.00, description: 'Acceso total a todas las herramientas de AtendIA.', icon: '💎' },
      { name: 'Soporte Prioritario', price: 25.00, description: 'Atención en menos de 1 hora 24/7.', icon: '⚡' }
    ];

    for (const p of sampleProducts) {
      await client.execute({
        sql: 'INSERT INTO products (id, org_id, name, description, price, icon) VALUES (?, ?, ?, ?, ?, ?)',
        args: [uuidv4(), demoOrgId, p.name, p.description, p.price, p.icon]
      });
    }

    console.log('✅ Datos de producción sembrados en Turso.');
    console.log('✨ Proceso completado.');

  } catch (error) {
    console.error('❌ Error en seeding remoto:', error);
  }
}

seed();
