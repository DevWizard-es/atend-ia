// ===== ATEND IA — SIGNUP JS =====

let selectedPlan = 'pro';
let billingCycle = 'monthly';

const planData = {
  starter: { name: 'Starter', monthly: 19, annual: 15, feat: '1 canal · Menú QR · 200 conversaciones/mes' },
  pro:     { name: 'Pro',     monthly: 49, annual: 39, feat: 'Todos los canales · Reservas · Ilimitado' },
  business:{ name: 'Business',monthly: 99, annual: 79, feat: '5 locales · API · Manager dedicado' },
};

function selectPlan(plan) {
  selectedPlan = plan;
  // Reset checks
  ['starter','pro','business'].forEach(p => {
    document.getElementById('check-'+p)?.classList.remove('checked');
    document.getElementById('plan-'+p)?.classList.remove('selected');
  });
  document.getElementById('check-'+plan)?.classList.add('checked');
  document.getElementById('plan-'+plan)?.classList.add('selected');
  updateOrderSummary();
}

function toggleBilling() {
  billingCycle = billingCycle === 'monthly' ? 'annual' : 'monthly';
  const toggle = document.getElementById('toggleSm');
  const s1m = document.getElementById('s1Monthly');
  const s1a = document.getElementById('s1Annual');
  toggle.classList.toggle('annual', billingCycle === 'annual');
  s1m.classList.toggle('active', billingCycle === 'monthly');
  s1a.classList.toggle('active', billingCycle === 'annual');

  // Update prices in plan cards
  document.querySelectorAll('.p-monthly').forEach(el => el.style.display = billingCycle === 'annual' ? 'none' : 'inline');
  document.querySelectorAll('.p-annual').forEach(el => el.style.display = billingCycle === 'annual' ? 'inline' : 'none');
  updateOrderSummary();
}

function updateOrderSummary() {
  const box = document.getElementById('orderSummary');
  if (!box) return;
  const plan = planData[selectedPlan];
  const price = billingCycle === 'annual' ? plan.annual : plan.monthly;
  const cycleLabel = billingCycle === 'annual' ? 'Anual (× 12)' : 'Mensual';
  const total = billingCycle === 'annual' ? plan.annual * 12 : plan.monthly;
  const savedLabel = billingCycle === 'annual' ? `Ahorro: €${(plan.monthly - plan.annual) * 12}/año` : '';

  box.innerHTML = `
    <div class="order-row"><span class="order-label">Plan</span><span class="order-plan-name">${plan.name}</span></div>
    <div class="order-row"><span class="order-label">Incluye</span><span style="font-size:0.8rem;color:var(--text-muted);text-align:right;max-width:200px">${plan.feat}</span></div>
    <div class="order-row"><span class="order-label">Facturación</span><span class="order-price">${cycleLabel}</span></div>
    <div class="order-row"><span class="order-label">Hoy pagas</span><span class="order-free">€0 (14 días gratis)</span></div>
    ${savedLabel ? `<div class="order-row"><span class="order-label" style="color:var(--green)">${savedLabel}</span><span></span></div>` : ''}
    <div class="order-row"><span class="order-label">Después del período</span><span class="order-price">€${price}/mes</span></div>
  `;
}

function goStep(stepNum) {
  // Validate step 2
  if (stepNum === 3) {
    const email = document.getElementById('userEmail')?.value.trim();
    const pass = document.getElementById('userPass')?.value.trim();
    const bizName = document.getElementById('bizName')?.value.trim();
    const terms = document.getElementById('terms')?.checked;
    if (!bizName) { showFieldError('bizName', 'Introduce el nombre de tu negocio'); return; }
    if (!email || !email.includes('@')) { showFieldError('userEmail', 'Email no válido'); return; }
    if (!pass || pass.length < 8) { showFieldError('userPass', 'Mínimo 8 caracteres'); return; }
    if (!terms) { alert('Debes aceptar los Términos de servicio para continuar.'); return; }
  }

  document.querySelectorAll('.signup-step').forEach(s => s.classList.remove('active'));
  document.getElementById('step'+stepNum)?.classList.add('active');

  if (stepNum === 3) updateOrderSummary();

  // Scroll to top of right panel
  document.querySelector('.signup-right')?.scrollTo({ top: 0, behavior: 'smooth' });
}

function showFieldError(fieldId, msg) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.style.borderColor = 'var(--red)';
  field.focus();
  // Remove error on input
  field.addEventListener('input', () => { field.style.borderColor = ''; }, { once: true });
  // Show message
  let err = field.parentNode.querySelector('.field-err');
  if (!err) {
    err = document.createElement('span');
    err.className = 'field-err';
    err.style.cssText = 'font-size:0.75rem;color:var(--red);margin-top:4px';
    field.parentNode.appendChild(err);
  }
  err.textContent = msg;
  setTimeout(() => err.remove(), 3000);
}

async function handlePayment() {
  const btn = document.getElementById('payBtn');
  const email = document.getElementById('userEmail')?.value.trim();
  const pass = document.getElementById('userPass')?.value.trim();
  const bizName = document.getElementById('bizName')?.value.trim();
  const bizType = document.getElementById('bizType')?.value;

  btn.textContent = 'Creando cuenta...';
  btn.disabled = true;

  try {
    const res = await fetch(API_URL + '/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass, bizName, bizType })
    });
    const data = await res.json();
    if (!data.success) {
      // Show the error clearly in the UI
      const errP = document.createElement('p');
      errP.style.cssText = 'color:#ef4444;text-align:center;font-size:0.85rem;margin-top:10px;';
      errP.textContent = '❌ ' + (data.error || 'Error al crear la cuenta');
      btn.parentNode.insertBefore(errP, btn.nextSibling);
      setTimeout(() => errP.remove(), 5000);
      btn.textContent = 'Empezar mi prueba gratis →';
      btn.disabled = false;
      return;
    }
    // Store token
    localStorage.setItem('atend_token', data.token);
  } catch(e) {
    console.error(e);
    // Can't reach server — show error, don't bypass
    const errP = document.createElement('p');
    errP.style.cssText = 'color:#ef4444;text-align:center;font-size:0.85rem;margin-top:10px;';
    errP.textContent = '❌ No se puede conectar con el servidor. Verifica tu conexión.';
    btn.parentNode.insertBefore(errP, btn.nextSibling);
    btn.textContent = 'Empezar mi prueba gratis →';
    btn.disabled = false;
    return;
  }

  // Get the right Stripe link
  const linkKey = `${selectedPlan}_${billingCycle}`;
  const stripeUrl = STRIPE_LINKS[linkKey] || '';

  // Only skip Stripe if there truly is no link or it's a mailto
  if (!stripeUrl || stripeUrl.includes('mailto:')) {
    btn.textContent = 'Account created. Contacting sales...';
    setTimeout(() => { 
      window.location.href = stripeUrl; 
      // Do NOT force redirect to app.html to avoid the bypass the user complained about
      const succ = document.createElement('p');
      succ.style.cssText = 'color:var(--green);text-align:center;font-size:0.85rem;margin-top:10px;';
      succ.textContent = '✓ Registro completado. Por favor, envía el correo de contacto para activar tu plan Business.';
      btn.parentNode.insertBefore(succ, btn.nextSibling);
    }, 800);
    return;
  }

  // Go to Stripe (including test links - user will see the Stripe checkout)
  btn.textContent = 'Redirigiendo a Stripe...';
  const finalUrl = `${stripeUrl}?prefilled_email=${encodeURIComponent(email || '')}`;
  setTimeout(() => { window.location.href = finalUrl; }, 800);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const p = params.get('plan');
  if (['starter', 'pro', 'business'].includes(p)) {
    selectPlan(p);
  } else {
    selectPlan('pro');
  }
  updateOrderSummary();
});
