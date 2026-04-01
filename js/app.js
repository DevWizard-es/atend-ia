// ===== ATEND IA — APP JS =====

// Section navigation
const navItems = document.querySelectorAll('.nav-item[data-section]');
const sections = document.querySelectorAll('.section');
const pageTitle = document.getElementById('pageTitle');

const sectionTitles = {
  dashboard: 'Dashboard',
  agent: 'Mi Agente IA',
  menu: 'Menú / Catálogo',
  reservations: 'Reservas',
  channels: 'Canales',
  biolink: 'Bio Link',
  analytics: 'Analytics'
};

navItems.forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    const sectionId = item.dataset.section;
    navItems.forEach(n => n.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));
    item.classList.add('active');
    const target = document.getElementById('section-' + sectionId);
    if (target) target.classList.add('active');
    if (pageTitle) pageTitle.textContent = sectionTitles[sectionId] || '';
    // Close sidebar on mobile
    if (window.innerWidth < 900) sidebar.classList.remove('open');
  });
});

// Mobile sidebar toggle
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
menuToggle?.addEventListener('click', () => sidebar.classList.toggle('open'));

// Toggle switches
document.querySelectorAll('.switch').forEach(sw => {
  sw.addEventListener('click', () => sw.classList.toggle('active'));
});

// Tone selector
document.querySelectorAll('.tone-option').forEach(opt => {
  opt.addEventListener('click', () => {
    opt.closest('.tone-selector').querySelectorAll('.tone-option').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
  });
});

// Lang chips
document.querySelectorAll('.chip:not(.add-chip)').forEach(chip => {
  chip.addEventListener('click', () => chip.classList.toggle('active'));
});

// Color options in biolink
document.querySelectorAll('.color-opt').forEach(opt => {
  opt.addEventListener('click', () => {
    opt.closest('.color-options').querySelectorAll('.color-opt').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    // Update preview button color
    const previewPrimary = document.querySelector('.preview-btn.primary');
    if (previewPrimary) previewPrimary.style.background = opt.style.background;
  });
});

// Calendar day selection
document.querySelectorAll('.cal-day:not(.empty)').forEach(day => {
  day.addEventListener('click', () => {
    document.querySelectorAll('.cal-day').forEach(d => d.classList.remove('selected'));
    day.classList.add('selected');
  });
});

// AI Chat demo in Agent section
const botResponses = [
  'Claro, nuestro horario es de lunes a viernes de 12:00 a 15:30 y de 20:00 a 23:30. Los sábados y domingos abrimos todo el día de 12:00 a 00:00. 🕐',
  '¡Por supuesto! Puedo hacer la reserva ahora mismo. ¿Para cuántas personas y a qué hora? 📅',
  'Tenemos pizza Margarita (8€), 4 Quesos (11€) y Diavola (12€). También ensaladas y postres. ¿Te envío el menú completo? 🍕',
  '¡Perfecto! Tu pedido ha sido registrado. Te confirmamos en breves. 😊',
  'Estamos en Calle Principal 42. Para llegar en metro, la parada más cercana es "Centro". 📍',
  'El menú del día incluye primer plato, segundo y postre por 12€. Cambia cada día. Hoy tenemos paella y merluza. 🍽️',
];
let responseIndex = 0;

function sendTestMessage() {
  const input = document.getElementById('testInput');
  const messages = document.getElementById('testMessages');
  if (!input || !messages) return;
  const text = input.value.trim();
  if (!text) return;

  // Add user message
  const userBubble = document.createElement('div');
  userBubble.className = 'test-bubble user';
  userBubble.textContent = text;
  messages.appendChild(userBubble);
  input.value = '';

  // Typing animation
  const typing = document.createElement('div');
  typing.className = 'test-bubble bot';
  typing.innerHTML = '<em style="color:var(--text-dim)">escribiendo...</em>';
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;

  // Bot response
  setTimeout(() => {
    typing.remove();
    const botBubble = document.createElement('div');
    botBubble.className = 'test-bubble bot';
    botBubble.textContent = botResponses[responseIndex % botResponses.length];
    responseIndex++;
    messages.appendChild(botBubble);
    messages.scrollTop = messages.scrollHeight;
  }, 1000);
}

document.getElementById('testInput')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendTestMessage();
});

// Add product to menu
function addProduct(button) {
  const list = button.closest('.menu-category').querySelector('.products-list');
  const row = document.createElement('div');
  row.className = 'product-row';
  row.innerHTML = `
    <input class="prod-name" placeholder="Nombre" value="">
    <input class="prod-desc" placeholder="Descripción" value="">
    <input class="prod-price" placeholder="€" type="number" value="">
    <div class="prod-available">
      <div class="switch active" onclick="this.classList.toggle('active')"></div>
      <span>Disponible</span>
    </div>
    <button class="prod-delete" onclick="this.closest('.product-row').remove()">✕</button>
  `;
  list.appendChild(row);
  row.querySelector('.prod-name').focus();
}

// Add category to menu
function addCategory() {
  const container = document.getElementById('menuCategories');
  const cat = document.createElement('div');
  cat.className = 'menu-category';
  cat.innerHTML = `
    <div class="cat-header">
      <input class="cat-name" value="Nueva categoría" />
      <button class="cat-add" onclick="addProduct(this)">+ Añadir producto</button>
      <button class="cat-delete" onclick="this.closest('.menu-category').remove()">🗑️</button>
    </div>
    <div class="products-list"></div>
  `;
  container.appendChild(cat);
  cat.querySelector('.cat-name').focus();
  cat.querySelector('.cat-name').select();
}

// Save buttons feedback
document.querySelectorAll('.btn-primary-full').forEach(btn => {
  btn.addEventListener('click', () => {
    const orig = btn.textContent;
    btn.textContent = '✓ Guardado!';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
    }, 2000);
  });
});

// Confirm/cancel reservation
document.querySelectorAll('.btn-confirm').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.res-full-item');
    item.classList.add('confirmed');
    btn.closest('.res-actions').innerHTML = '<span class="confirmed-badge">✓ Confirmada</span>';
  });
});
document.querySelectorAll('.btn-cancel-res').forEach(btn => {
  btn.addEventListener('click', () => btn.closest('.res-full-item').remove());
});

// Copy biolink URL
document.querySelector('.btn-secondary-sm')?.addEventListener('click', function() {
  const slug = document.querySelector('.url-slug')?.value || 'mi-negocio';
  navigator.clipboard.writeText('https://atend-ia.com/' + slug).then(() => {
    this.textContent = '✓ ¡Copiado!';
    setTimeout(() => this.textContent = '🔗 Copiar enlace', 2000);
  });
});
