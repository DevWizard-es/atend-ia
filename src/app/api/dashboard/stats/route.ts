import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const db = await getDb();
    
    // 1. Conteo de Contactos (Leads)
    const contactsCount = await db.get(
      'SELECT COUNT(*) as count FROM contacts WHERE org_id = ?',
      [session.orgId]
    );

    // 2. Conteo de Conversaciones
    const conversationsCount = await db.get(
      'SELECT COUNT(*) as count FROM conversations WHERE org_id = ?',
      [session.orgId]
    );

    // 3. Calificación Promedio (Reviews)
    const ratingStats = await db.get(
      'SELECT AVG(rating) as average FROM reviews WHERE org_id = ?',
      [session.orgId]
    );

    // 4. Mensajes Recientes (Últimos 3)
    const recentMessages = await db.all(
      `SELECT m.*, c.name as contactName 
       FROM messages m 
       JOIN contacts c ON m.contact_id = c.id 
       WHERE m.org_id = ? 
       ORDER BY m.created_at DESC 
       LIMIT 3`,
      [session.orgId]
    );

    return NextResponse.json({
      leads: contactsCount?.count || 0,
      conversations: conversationsCount?.count || 0,
      rating: ratingStats?.average ? parseFloat(ratingStats.average).toFixed(1) : "0.0",
      recentMessages: recentMessages || []
    });

  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 });
  }
}
