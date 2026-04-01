// ===== ATEND IA — CONFIGURACIÓN =====
// ⚠️ MODO TEST: Estos son enlaces de prueba de Stripe.
// Para cobrar de verdad: verifica tu empresa en dashboard.stripe.com y
// cambia estos links por los de la cuenta activa (sin "test_" en la URL).
const STRIPE_LINKS = {
  starter_monthly:  'https://buy.stripe.com/test_aFaeVd2sX0Pte7R2ndbII00',   // €19/mes
  starter_annual:   'https://buy.stripe.com/test_cNibJ17NhgOre7Rd1RbII02',   // €180/año (€15×12)
  pro_monthly:      'https://buy.stripe.com/test_aFa6oH0kP2XB9RB7HxbII01',   // €49/mes
  pro_annual:       'https://buy.stripe.com/test_dRm4gz1oT69NfbV1j9bII03',   // €490/año (€39×12) — confirmado en Stripe
  business_monthly: 'mailto:hola@atend-ia.com?subject=Plan Business',
  business_annual:  'mailto:hola@atend-ia.com?subject=Plan Business Anual',
};

// Datos de la empresa
const BRAND = {
  name: 'AtendIA',
  email: 'hola@atend-ia.com',
  url: 'https://atend-ia.netlify.app',
  instagram: '@atendia_app',
};
