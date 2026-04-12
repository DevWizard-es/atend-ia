import nodemailer from "nodemailer";

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error(`Gmail SMTP not configured. GMAIL_USER=${user ? "set" : "missing"}, GMAIL_APP_PASSWORD=${pass ? "set" : "missing"}`);
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

export async function sendVerificationEmail({
  to,
  businessName,
  token,
  baseUrl,
}: {
  to: string;
  businessName: string;
  token: string;
  baseUrl: string;
}) {
  const verifyUrl = `${baseUrl}/api/auth/verify?token=${token}`;
  const transporter = getTransporter();
  const fromEmail = process.env.GMAIL_USER;

  const result = await transporter.sendMail({
    from: `"GuarapoIA" <${fromEmail}>`,
    to,
    subject: "✅ Verifica tu cuenta en GuarapoIA",
    html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);border:1px solid #e2e8f0;">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#10b981 0%,#0d9488 100%);padding:40px 40px 32px;text-align:center;">
      <div style="font-size:32px;font-weight:900;color:#ffffff;letter-spacing:-1px;margin-bottom:6px;">Guarapo<span style="color:#6ee7b7;">IA</span></div>
      <div style="color:rgba(255,255,255,0.7);font-size:13px;font-weight:600;">Plataforma para Negocios Locales</div>
    </div>
    
    <!-- Body -->
    <div style="padding:40px;">
      <div style="font-size:28px;text-align:center;margin-bottom:16px;">📬</div>
      <h1 style="font-size:22px;font-weight:900;color:#0f172a;text-align:center;margin:0 0 12px;letter-spacing:-0.5px;">¡Verifica tu correo!</h1>
      <p style="color:#475569;font-size:15px;line-height:1.7;text-align:center;margin:0 0 32px;">
        Hola, <strong>${businessName}</strong>. Para completar el registro de tu cuenta en GuarapoIA y empezar a captar leads, necesitamos verificar que este correo te pertenece.
      </p>

      <!-- CTA Button -->
      <div style="text-align:center;margin-bottom:32px;">
        <a href="${verifyUrl}" style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#10b981,#0d9488);color:#ffffff;font-size:16px;font-weight:800;text-decoration:none;border-radius:14px;letter-spacing:-0.3px;box-shadow:0 8px 20px rgba(16,185,129,0.35);">
          ✅ Verificar mi cuenta
        </a>
      </div>

      <!-- Security note -->
      <div style="background:#f1f5f9;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
        <p style="margin:0;font-size:12px;color:#64748b;line-height:1.6;">
          <strong>🔒 Seguridad:</strong> Este enlace caduca en <strong>24 horas</strong>. Si no creaste esta cuenta, puedes ignorar este email.
        </p>
      </div>

      <!-- Manual link -->
      <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">
        Si el botón no funciona, copia este enlace:<br/>
        <span style="color:#10b981;word-break:break-all;">${verifyUrl}</span>
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;">
      <p style="margin:0;font-size:11px;color:#94a3b8;">
        ⚡ <strong>GuarapoIA</strong> · Plataforma 100% gratuita para negocios locales<br/>
        Creado por <a href="mailto:yordandearmas@gmail.com" style="color:#10b981;">Yordan de Armas</a>
      </p>
    </div>
  </div>
</body>
</html>`.trim(),
  });

  console.log("[email] Gmail SMTP result:", result.messageId, result.response);
  return result;
}

export async function sendPasswordResetEmail({
  to,
  token,
  baseUrl,
}: {
  to: string;
  token: string;
  baseUrl: string;
}) {
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;
  const transporter = getTransporter();
  const fromEmail = process.env.GMAIL_USER;

  const result = await transporter.sendMail({
    from: `"GuarapoIA" <${fromEmail}>`,
    to,
    subject: "🔑 Recupera tu contraseña en GuarapoIA",
    html: `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);border:1px solid #e2e8f0;">
    <div style="background:linear-gradient(135deg,#10b981 0%,#0d9488 100%);padding:40px 40px 32px;text-align:center;">
      <div style="font-size:32px;font-weight:900;color:#ffffff;letter-spacing:-1px;margin-bottom:6px;">Guarapo<span style="color:#6ee7b7;">IA</span></div>
      <div style="color:rgba(255,255,255,0.7);font-size:13px;font-weight:600;">Recuperación de contraseña</div>
    </div>
    <div style="padding:40px;">
      <div style="font-size:28px;text-align:center;margin-bottom:16px;">🔑</div>
      <h1 style="font-size:22px;font-weight:900;color:#0f172a;text-align:center;margin:0 0 12px;">Restablecer contraseña</h1>
      <p style="color:#475569;font-size:15px;line-height:1.7;text-align:center;margin:0 0 32px;">
        Recibimos una solicitud para cambiar la contraseña de tu cuenta. Haz clic en el botón para crear una nueva.
      </p>
      <div style="text-align:center;margin-bottom:32px;">
        <a href="${resetUrl}" style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#10b981,#0d9488);color:#ffffff;font-size:16px;font-weight:800;text-decoration:none;border-radius:14px;box-shadow:0 8px 20px rgba(16,185,129,0.35);">
          🔑 Cambiar contraseña
        </a>
      </div>
      <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
        <p style="margin:0;font-size:12px;color:#92400e;line-height:1.6;">
          <strong>⚠️ Importante:</strong> Este enlace caduca en <strong>1 hora</strong>. Si no solicitaste este cambio, ignora este email — tu contraseña actual sigue siendo la misma.
        </p>
      </div>
      <p style="color:#94a3b8;font-size:12px;text-align:center;margin:0;">
        Si el botón no funciona, copia este enlace:<br/>
        <span style="color:#10b981;word-break:break-all;">${resetUrl}</span>
      </p>
    </div>
    <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;">
      <p style="margin:0;font-size:11px;color:#94a3b8;">
        ⚡ <strong>GuarapoIA</strong> · Plataforma 100% gratuita para negocios locales<br/>
        Creado por <a href="mailto:yordandearmas@gmail.com" style="color:#2563eb;">Yordan de Armas</a>
      </p>
    </div>
  </div>
</body>
</html>`.trim(),
  });

  console.log("[email] Password reset sent:", result.messageId);
  return result;
}
