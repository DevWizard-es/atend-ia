import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { createSession } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';
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

    // Add email_verified + verification_token columns (safe migration)
    try { await db.exec(`ALTER TABLE users ADD COLUMN email_verified INTEGER DEFAULT 0`); } catch (_) {}
    try { await db.exec(`ALTER TABLE users ADD COLUMN verification_token TEXT DEFAULT ''`); } catch (_) {}
    try { await db.exec(`ALTER TABLE users ADD COLUMN token_expires_at TEXT DEFAULT ''`); } catch (_) {}

    // Hash password and create user with verification token
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const verificationToken = uuidv4().replace(/-/g, '');
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24h

    await db.run(
      'INSERT INTO users (id, org_id, email, password, role, email_verified, verification_token, token_expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, orgId, email.toLowerCase(), hashedPassword, 'owner', 0, verificationToken, tokenExpiry]
    );

    // Send verification email (non-blocking — don't fail signup if email fails)
    const baseUrl = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://guarapoia.app';
    let emailError: string | null = null;
    try {
      const emailResult = await sendVerificationEmail({
        to: email.toLowerCase(),
        businessName,
        token: verificationToken,
        baseUrl,
      });
      console.log('[signup] Email result:', JSON.stringify(emailResult));
    } catch (err: any) {
      emailError = err?.message || String(err);
      console.error('[signup] Email send failed:', emailError, err);
    }

    // Create session (user can use the app immediately, verification just unlocks full features)
    const token = await createSession({ 
      userId: userId as string, 
      orgId: orgId as string, 
      email: (email as string).toLowerCase() 
    });

    const response = NextResponse.json({ 
      success: true, 
      orgId, 
      slug,
      emailSent: !emailError,
      emailError: emailError || null,
    });
    response.cookies.set('guarapoia_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
