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
  btn.textContent = 'Creando cuenta...';
  btn.disabled = true;

  const email = document.getElementById('userEmail')?.value;
  const pass = document.getElementById('userPass')?.value;
  const bizName = document.getElementById('bizName')?.value;
  const bizType = document.getElementById('bizType')?.value;

  try {
    const res = await fetch(API_URL + '/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass, bizName, bizType })
    });
    const data = await res.json();
    if (!data.success) {
      alert('Error: ' + data.error);
      btn.textContent = 'Procesar pago seguro';
      btn.disabled = false;
      return;
    }
    localStorage.setItem('atend_token', data.token);
  } catch(e) {
    console.error(e);
    alert('Aviso: Servidor backend en mantenimiento. Ingresando en modo local.');
  }

  btn.textContent = 'Redirigiendo a pago seguro...';

  // Get the right Stripe link
  const linkKey = `${selectedPlan}_${billingCycle}`;
  let stripeUrl = '';

  try {
    stripeUrl = STRIPE_LINKS[linkKey];
  } catch(e) {
    stripeUrl = '';
  }

  // Si no hay Stripe, entra al panel directo (útil para pruebas)
  if (!stripeUrl || stripeUrl.includes('XXXX')) {
    setTimeout(() => {
      window.location.href = 'app.html';
    }, 1200);
    return;
  }

  // Build Stripe URL with prefilled email
  const finalUrl = email ? `${stripeUrl}?prefilled_email=${encodeURIComponent(email)}` : stripeUrl;

  setTimeout(() => {
    window.location.href = finalUrl;
  }, 800);
}

// Init
selectPlan('pro');
updateOrderSummary();
