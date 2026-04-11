import { createClient, Client } from '@libsql/client';
import path from 'path';

let internalClient: Client | null = null;

// Wrapper que emula los métodos de "sqlite" y "sqlite3"
// para no romper la aplicación entera tras la migración a Turso.
const dbWrapper = {
  get: async (sql: string, args: any = []) => {
    // libSQL espera un array o object para bindings. Si "args" no es un array, lo envolvemos.
    const params = Array.isArray(args) ? args : [args];
    const rs = await internalClient!.execute({ sql, args: params });
    return rs.rows[0]; 
  },
  all: async (sql: string, args: any = []) => {
    const params = Array.isArray(args) ? args : [args];
    const rs = await internalClient!.execute({ sql, args: params });
    return rs.rows;
  },
  run: async (sql: string, args: any = []) => {
    const params = Array.isArray(args) ? args : (args ? [args] : []);
    const rs = await internalClient!.execute({ sql, args: params });
    return { 
      lastID: rs.lastInsertRowid ? rs.lastInsertRowid.toString() : undefined, 
      changes: rs.rowsAffected 
    };
  },
  exec: async (sql: string) => {
    await internalClient!.executeMultiple(sql);
  }
};

export async function getDb() {
  if (internalClient) return dbWrapper;

  const dbUrl = process.env.TURSO_DATABASE_URL || `file:${path.join(process.cwd(), 'atendia_v2_local_turso.db')}`;  
  internalClient = createClient({
    url: dbUrl,
    authToken: process.env.TURSO_DATABASE_TOKEN || "",
  });

  // Ejecutamos siempre la inicialización del esquema.
  await internalClient.executeMultiple(`
    CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      whatsapp_phone TEXT DEFAULT '',
      google_maps_url TEXT DEFAULT '',
      google_review_url TEXT DEFAULT '',
      google_questions_url TEXT DEFAULT '',
      inbox_mode TEXT DEFAULT 'internal',
      agent_tone TEXT DEFAULT 'Pro',
      agent_instructions TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'owner',
      FOREIGN KEY (org_id) REFERENCES organizations (id)
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL,
      name TEXT,
      phone TEXT NOT NULL,
      last_interaction DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (org_id) REFERENCES organizations (id)
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL,
      contact_id TEXT NOT NULL,
      status TEXT DEFAULT 'open',
      last_message TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (org_id) REFERENCES organizations (id),
      FOREIGN KEY (contact_id) REFERENCES contacts (id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conv_id TEXT NOT NULL,
      direction TEXT NOT NULL,
      content TEXT NOT NULL,
      sender_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conv_id) REFERENCES conversations (id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      author_name TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (org_id) REFERENCES organizations (id)
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      icon TEXT DEFAULT '🛒',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (org_id) REFERENCES organizations (id)
    );
  `);

  return dbWrapper;
}
