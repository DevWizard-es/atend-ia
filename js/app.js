// ===== ATEND IA — APP JS =====

// ── Authentication & Fetching Data ──────────────────────────────────────
const token = localStorage.getItem('atend_token');
if (!token && window.location.pathname.includes('app.html')) {
  window.location.href = 'login.html';
}

async function fetchBizData() {
  try {
    const res = await fetch(API_URL + '/config', { headers: { 'Authorization': 'Bearer ' + token }});
    const d = await res.json();
    if (d.biz) {
      document.querySelector('.user-name').textContent = d.biz.name;
      if (d.userEmail) document.querySelector('.user-email').textContent = d.userEmail;

      const kpis = document.querySelectorAll('.kpi-value');
      if (kpis.length >= 3 && d.kpis) {
        kpis[0].textContent = d.kpis.messages;
        kpis[1].textContent = d.kpis.orders;
        kpis[2].textContent = d.kpis.reservations;
      }

      const inputs = document.querySelectorAll('#section-agent .form-input');
      if (inputs.length >= 5) {
        inputs[0].value = d.biz.name || '';
        inputs[1].value = d.biz.type || '🍽️ Restaurante';
        inputs[2].value = d.biz.address || '';
        inputs[3].value = d.biz.schedule || '';
        inputs[4].value = d.biz.phone || '';
      }
    }
    if (d.agentConfig) {
      const inputs = document.querySelectorAll('#section-agent .form-input');
      if (inputs.length >= 6) inputs[5].value = d.agentConfig.agent_name || 'Asistente';
      const ta = document.querySelector('textarea.form-input');
      if (ta) ta.value = d.agentConfig.instructions || '';
      
      const toneBtns = document.querySelectorAll('.tone-option');
      toneBtns.forEach(b => {
        if (b.textContent.includes(d.agentConfig.tone)) {
          toneBtns.forEach(o => o.classList.remove('selected'));
          b.classList.add('selected');
        }
      });

      const switches = document.querySelectorAll('.agent-toggle-section .switch');
      if (switches.length >= 3) {
        switches[0].classList.toggle('active', !!d.agentConfig.active);
        switches[1].classList.toggle('active', !!d.agentConfig.take_orders);
        switches[2].classList.toggle('active', !!d.agentConfig.manage_reservations);
      }
    }
  } catch(e) { console.error('Fetch Config Error', e); }
}

async function fetchMenuData() {
  try {
    const res = await fetch(API_URL + '/menu', { headers: { 'Authorization': 'Bearer ' + token }});
    const d = await res.json();
    if (!Array.isArray(d)) return;
    const catContainer = document.getElementById('menuCategories');
    if (!catContainer) return;

    if (d.length > 0) {
      catContainer.innerHTML = ''; // Clear default mock menu
      const grouped = {};
      d.forEach(i => {
        grouped[i.category] = grouped[i.category] || [];
        grouped[i.category].push(i);
      });
      for (const catName in grouped) {
        addCategoryDetailed(catName, grouped[catName]);
      }
    }
  } catch(e) { console.error('Menu Fetch Error', e); }
}

async function fetchBiolinkData() {
  try {
    const res = await fetch(API_URL + '/biolink', { headers: { 'Authorization': 'Bearer ' + token }});
    const d = await res.json();
    if (!d || d.error) return;

    document.querySelector('.url-slug').value = d.slug || '';
    const bioInputs = document.querySelectorAll('.biolink-editor .form-input');
    if (bioInputs.length >= 2) {
      bioInputs[0].value = d.display_name || '';
      bioInputs[1].value = d.description || '';
    }

    // Set colors
    const cOpts = document.querySelectorAll('.color-opt');
    let matched = false;
    cOpts.forEach(o => {
      o.classList.remove('selected');
      // Normalize hex for comparison or just raw check
      if (d.color && o.style.background.replace(/\s/g,'').includes(d.color.replace(/\s/g,''))) {
        o.classList.add('selected');
        matched = true;
      }
    });
    if (!matched && cOpts.length > 0) cOpts[0].classList.add('selected'); // default
    
    // Set map to preview
    const chosenColor = document.querySelector('.color-opt.selected')?.style.background;
    const previewPrimary = document.querySelector('.preview-btn.primary');
    if (previewPrimary) previewPrimary.style.background = chosenColor || '';

    // Set preview texts
    document.querySelector('.preview-name').textContent = d.display_name || 'Mi Negocio';
    document.querySelector('.preview-desc').textContent = d.description || '';

    // Set buttons
    const bSwitches = document.querySelectorAll('.button-toggles .switch');
    if (bSwitches.length >= 5) {
      bSwitches[0].classList.toggle('active', !!d.btn_chat);
      bSwitches[1].classList.toggle('active', !!d.btn_menu);
      bSwitches[2].classList.toggle('active', !!d.btn_res);
      bSwitches[3].classList.toggle('active', !!d.btn_map);
      bSwitches[4].classList.toggle('active', !!d.btn_shop);
    }
  } catch(e) { console.error('Biolink Fetch Error', e); }
}

async function fetchReservations() {
  try {
    const res = await fetch(API_URL + '/reservations', { headers: { 'Authorization': 'Bearer ' + token }});
    const arr = await res.json();
    if (!Array.isArray(arr)) return;

    const listDiv = document.querySelector('.res-full-list');
    if (!listDiv) return;
    listDiv.innerHTML = ''; // reset

    if (arr.length === 0) {
      listDiv.innerHTML = '<p style="color:var(--text-muted)">Aún no tienes reservas.</p>';
      return;
    }

    arr.forEach(r => {
      const div = document.createElement('div');
      div.className = `res-full-item ${r.status === 'confirmed' ? 'confirmed' : ''}`;
      // Parse basic structure
      div.innerHTML = `
        <div class="res-full-time">${r.res_time || 'Sin hora'}</div>
        <div class="res-full-info">
          <div class="res-full-name">${r.customer_name}</div>
          <div class="res-full-detail">${r.party_size || '-'} · ${r.channel || 'IA Bot'}</div>
        </div>
        <div class="res-actions" data-id="${r.id}">
          ${r.status === 'confirmed' ? '<span class="confirmed-badge">✓ Confirmada</span>' : 
            r.status === 'cancelled' ? '<span style="color:var(--red);font-size:0.8rem">✕ Cancelada</span>' : 
            `<button class="btn-confirm" onclick="updateReservation(${r.id}, 'confirmed', this)">✓ Confirmar</button>
             <button class="btn-cancel-res" onclick="updateReservation(${r.id}, 'cancelled', this)">✕</button>`}
        </div>
      `;
      listDiv.appendChild(div);
    });
  } catch(e) { console.error('Reservations API Error', e); }
}

async function fetchChannels() {
  try {
    const res = await fetch(API_URL + '/channels', { headers: { 'Authorization': 'Bearer ' + token }});
    const ch = await res.json();
    if (!Array.isArray(ch)) return;
    
    // In a full implementation, you'd bind the UI badges based on this array
    // Example: Facebook -> if found, add connected badge
  } catch(e) { console.error(e); }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchBizData();
  fetchMenuData();
  fetchBiolinkData();
  fetchReservations();
  fetchChannels();
});

// ── UI Navigation & Utilities ──────────────────────────────────────────
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
    if (window.innerWidth < 900) sidebar.classList.remove('open');
  });
});

const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
menuToggle?.addEventListener('click', () => sidebar.classList.toggle('open'));

document.querySelectorAll('.switch').forEach(sw => {
  sw.addEventListener('click', () => sw.classList.toggle('active'));
});

document.querySelectorAll('.tone-option').forEach(opt => {
  opt.addEventListener('click', () => {
    opt.closest('.tone-selector').querySelectorAll('.tone-option').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
  });
});

document.querySelectorAll('.chip:not(.add-chip)').forEach(chip => {
  chip.addEventListener('click', () => chip.classList.toggle('active'));
});

// Color options in biolink
document.querySelectorAll('.color-opt').forEach(opt => {
  opt.addEventListener('click', () => {
    opt.closest('.color-options').querySelectorAll('.color-opt').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
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

// ── Live Previews ──────────────────────────────────────────
const bioNameInput = document.querySelectorAll('.biolink-editor .form-input')[0];
const bioDescInput = document.querySelectorAll('.biolink-editor .form-input')[1];
bioNameInput?.addEventListener('input', e => {
  const p = document.querySelector('.preview-name');
  if (p) p.textContent = e.target.value || 'Mi Negocio';
});
bioDescInput?.addEventListener('input', e => {
  const p = document.querySelector('.preview-desc');
  if (p) p.textContent = e.target.value;
});

// ── AI Demo test ───────────────────────────────────────────────────────
const botResponses = [
  'Claro, nuestro horario es de lunes a viernes de 12:00 a 15:30 y de 20:00 a 23:30. 🕐',
  '¡Por supuesto! Puedo hacer la reserva ahora mismo. ¿Para cuántas personas y a qué hora? 📅',
  'Tenemos ofertas especiales de mediodía. ¿Quieres ver el menú completo? 🍕',
  '¡Perfecto! Tu pedido ha sido registrado. Te confirmamos en breves. 😊',
  'Estamos en el centro. Para llegar en metro, la parada más cercana es "Centro". 📍'
];
let responseIndex = 0;

function sendTestMessage() {
  const input = document.getElementById('testInput');
  const messages = document.getElementById('testMessages');
  if (!input || !messages) return;
  const text = input.value.trim();
  if (!text) return;

  const userBubble = document.createElement('div');
  userBubble.className = 'test-bubble user';
  userBubble.textContent = text;
  messages.appendChild(userBubble);
  input.value = '';

  const typing = document.createElement('div');
  typing.className = 'test-bubble bot';
  typing.innerHTML = '<em style="color:var(--text-dim)">escribiendo...</em>';
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;

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

// ── Menu editing functions ─────────────────────────────────────────────
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

function addCategoryDetailed(catName, items) {
  const container = document.getElementById('menuCategories');
  const cat = document.createElement('div');
  cat.className = 'menu-category';
  
  let pRows = '';
  items.forEach(item => {
    pRows += `
      <div class="product-row">
        <input class="prod-name" placeholder="Nombre" value="${item.name}">
        <input class="prod-desc" placeholder="Descripción" value="${item.description || ''}">
        <input class="prod-price" placeholder="€" type="number" step="0.01" value="${item.price || 0}">
        <div class="prod-available">
          <div class="switch ${item.available ? 'active' : ''}" onclick="this.classList.toggle('active')"></div>
          <span>Disponible</span>
        </div>
        <button class="prod-delete" onclick="this.closest('.product-row').remove()">✕</button>
      </div>
    `;
  });

  cat.innerHTML = `
    <div class="cat-header">
      <input class="cat-name" value="${catName}" />
      <button class="cat-add" onclick="addProduct(this)">+ Añadir producto</button>
      <button class="cat-delete" onclick="this.closest('.menu-category').remove()">🗑️</button>
    </div>
    <div class="products-list">${pRows}</div>
  `;
  container.appendChild(cat);
}

// ── Saving State to Backend ──────────────────────────────────────────
async function updateReservation(id, status, btnElement) {
  const item = btnElement.closest('.res-full-item');
  const orgHtml = btnElement.closest('.res-actions').innerHTML;
  btnElement.closest('.res-actions').innerHTML = '<span style="font-size:0.8rem;color:var(--text-muted)">Procesando...</span>';

  try {
    const res = await fetch(`${API_URL}/reservations/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      if (status === 'confirmed') {
        item.classList.add('confirmed');
        item.querySelector('.res-actions').innerHTML = '<span class="confirmed-badge">✓ Confirmada</span>';
      } else {
        item.querySelector('.res-actions').innerHTML = '<span style="color:var(--red);font-size:0.8rem">✕ Cancelada</span>';
      }
    } else {
      item.querySelector('.res-actions').innerHTML = orgHtml;
    }
  } catch(e) {
    console.error(e);
    item.querySelector('.res-actions').innerHTML = orgHtml;
  }
}

document.querySelectorAll('.btn-primary-full').forEach(btn => {
  btn.addEventListener('click', async () => {
    const orig = btn.textContent;
    btn.textContent = 'Guardando...';
    btn.disabled = true;

    const isMenu = orig.toLowerCase().includes('menú') || btn.closest('#section-menu');
    const isAgent = orig.toLowerCase().includes('cambios') && btn.closest('#section-agent');
    const isBiolink = orig.toLowerCase().includes('publicar') || btn.closest('#section-biolink');

    try {
      if (isAgent) {
        const inputs = document.querySelectorAll('#section-agent .form-input');
        const ta = document.querySelector('textarea.form-input');
        const toneEl = document.querySelector('.tone-option.selected');
        const tone = toneEl ? toneEl.textContent.trim().split(' ')[1] : 'Amigable';

        const switches = document.querySelectorAll('.agent-toggle-section .switch');
        const active = switches[0]?.classList.contains('active');
        const takeO = switches[1]?.classList.contains('active');
        const mngR = switches[2]?.classList.contains('active');

        await fetch(API_URL + '/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify({
            bizName: inputs[0]?.value,
            bizType: inputs[1]?.value,
            bizAddress: inputs[2]?.value,
            bizSchedule: inputs[3]?.value,
            bizPhone: inputs[4]?.value,
            agentName: inputs[5]?.value,
            tone: tone,
            instructions: ta?.value,
            active,
            take_orders: takeO,
            manage_reservations: mngR
          })
        });
      }

      if (isMenu) {
        const menuItems = [];
        document.querySelectorAll('.menu-category').forEach(catDiv => {
          const categoryName = catDiv.querySelector('.cat-name').value;
          catDiv.querySelectorAll('.product-row').forEach(pRow => {
            menuItems.push({
              category: categoryName,
              name: pRow.querySelector('.prod-name').value,
              description: pRow.querySelector('.prod-desc')?.value,
              price: parseFloat(pRow.querySelector('.prod-price').value || 0),
              available: pRow.querySelector('.switch').classList.contains('active')
            });
          });
        });
        
        await fetch(API_URL + '/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify({ menu: menuItems })
        });
      }

      if (isBiolink) {
        const slug = document.querySelector('.url-slug').value;
        const bInputs = document.querySelectorAll('.biolink-editor .form-input');
        const color = document.querySelector('.color-opt.selected')?.style.background;
        const bs = document.querySelectorAll('.button-toggles .switch');

        const payload = {
          slug: slug,
          display_name: bInputs[0]?.value,
          description: bInputs[1]?.value,
          color: color,
          btn_chat: bs[0]?.classList.contains('active'),
          btn_menu: bs[1]?.classList.contains('active'),
          btn_res: bs[2]?.classList.contains('active'),
          btn_map: bs[3]?.classList.contains('active'),
          btn_shop: bs[4]?.classList.contains('active')
        };

        const r = await fetch(API_URL + '/biolink', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify(payload)
        });
        const ans = await r.json();
        if (!ans.success) {
          alert('Error: ' + (ans.error || 'No se pudo guardar la bio url'));
          throw new Error('Bio link fail');
        }
      }

    } catch(e) { console.error('Error guardando', e); }

    btn.textContent = '✓ Guardado!';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.disabled = false;
    }, 2000);
  });
});

// Channel Mocks
document.querySelectorAll('.channel-card .btn-primary-sm').forEach(btn => {
  btn.addEventListener('click', async () => {
    btn.textContent = 'Verificando...';
    setTimeout(async () => {
      const card = btn.closest('.channel-card');
      const name = card.querySelector('.ch-card-name').textContent.trim().toLowerCase();
      // Enviar peticion fake channels
      try {
        await fetch(API_URL + '/channels', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify({ platform: name, identifier: '@conexion_usuario', status: 'connected' })
        });
      } catch(e){}

      card.classList.add('connected');
      card.querySelector('.ch-card-status').innerHTML = '● Conectado';
      card.querySelector('.ch-card-status').classList.add('connected-text');
      btn.textContent = 'Gestionar';
      btn.className = 'btn-secondary-sm';
    }, 1200);
  });
});

// Copy biolink URL
document.querySelector('.btn-secondary-sm')?.addEventListener('click', function(e) {
  if (this.textContent.includes('Copiar Enlace') || this.textContent.includes('Copiar enlace')) {
    const slug = document.querySelector('.url-slug')?.value || 'mi-negocio';
    // URL would actually correspond to Netlify domain!
    const publishUrl = window.location.origin + '/biolink.html?b=' + slug;
    navigator.clipboard.writeText(publishUrl).then(() => {
      this.textContent = '✓ ¡Copiado!';
      setTimeout(() => this.textContent = '🔗 Copiar enlace', 2000);
    });
  }
});
