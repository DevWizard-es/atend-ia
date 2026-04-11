import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { createSession } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ownerName, businessName, email, password } = body;

    if (!ownerName || !businessName || !email || !password) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios.' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 8 caracteres.' }, { status: 400 });
    }

    const db = await getDb();

    // Check if email already exists
    const existing = await db.get('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing) {
      return NextResponse.json({ error: 'Este email ya está registrado. ¿Quieres iniciar sesión?' }, { status: 409 });
    }

    // Generate unique slug from business name
    const baseSlug = businessName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 40);

    let slug = baseSlug;
    let counter = 0;
    while (true) {
      const slugExists = await db.get('SELECT id FROM organizations WHERE slug = ?', [slug]);
      if (!slugExists) break;
      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    // Create organization
    const orgId = uuidv4();
    await db.run(
      'INSERT INTO organizations (id, name, slug, whatsapp_phone, google_maps_url, agent_tone, agent_instructions) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [orgId, businessName, slug, '', '', 'Amable y profesional', '']
    );

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    await db.run(
      'INSERT INTO users (id, org_id, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [userId, orgId, email.toLowerCase(), hashedPassword, 'owner']
    );

    // Create session
    const token = await createSession({ userId, orgId, email: email.toLowerCase() });

    const response = NextResponse.json({ success: true, orgId, slug });
    response.cookies.set('atendia_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
