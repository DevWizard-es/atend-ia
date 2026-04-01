// ===== ATEND IA — CONFIGURACIÓN =====
// Pega aquí tus enlaces de Stripe (los creas en dashboard.stripe.com > Payment Links)
const STRIPE_LINKS = {
  starter_monthly:  'https://buy.stripe.com/XXXXXXXX',   // €19/mes
  starter_annual:   'https://buy.stripe.com/XXXXXXXX',   // €15/mes × 12
  pro_monthly:      'https://buy.stripe.com/XXXXXXXX',   // €49/mes
  pro_annual:       'https://buy.stripe.com/XXXXXXXX',   // €39/mes × 12
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
