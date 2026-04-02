// ===== ATEND IA — APP JS =====

// ── Authentication & Fetching Data ──────────────────────────────────────
const token = localStorage.getItem('atend_token');
if (!token && window.location.pathname.includes('app.html')) {
  window.location.href = 'login.html';
}

async function fetchBizData() {
  try {
    const res = await fetch(API_URL + '/config', { headers: { 'Authorization': 'Bearer ' + token }});
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('atend_token');
        window.location.href = 'login.html';
        return;
      }
    }
    const d = await res.json();
    if (d.biz) {
      const nameEl = document.querySelector('.user-name');
      if (nameEl) nameEl.textContent = d.biz.name;
      const emailEl = document.querySelector('.user-email');
      if (d.userEmail && emailEl) emailEl.textContent = d.userEmail;

      // Dashboard welcome message
      const welcomeP = document.querySelector('#section-dashboard .section-header p');
      if (welcomeP) welcomeP.innerHTML = `Bienvenido, <strong>${d.biz.name}</strong>. Tu agente está activo y listo.`;

      // KPIs with real data
      const msgs = d.kpis?.messages ?? 0;
      const orders = d.kpis?.orders ?? 0;
      const resv = d.kpis?.reservations ?? 0;
      
      const kpiMsg = document.getElementById('kpi-messages');
      const kpiOrd = document.getElementById('kpi-orders');
      const kpiRes = document.getElementById('kpi-reservations');
      const kpiRsp = document.getElementById('kpi-response');
      
      if (kpiMsg) kpiMsg.textContent = msgs;
      if (kpiOrd) kpiOrd.textContent = orders;
      if (kpiRes) kpiRes.textContent = resv;
      if (kpiRsp) kpiRsp.textContent = '<1s';
      
      const kpiMsgT = document.getElementById('kpi-messages-trend');
      const kpiOrdT = document.getElementById('kpi-orders-trend');
      const kpiResT = document.getElementById('kpi-res-trend');
      if (kpiMsgT) kpiMsgT.textContent = msgs > 0 ? `⬆️ ${msgs} total` : 'Aún sin mensajes';
      if (kpiOrdT) kpiOrdT.textContent = orders > 0 ? `⬆️ ${orders} total` : 'Aún sin pedidos';
      if (kpiResT) kpiResT.textContent = resv > 0 ? `⬆️ ${resv} total` : 'Aún sin reservas';

      // Analytics section
      const aMsg = document.getElementById('analytic-msg');
      const aUsr = document.getElementById('analytic-usr');
      const aRes = document.getElementById('analytic-res');
      if (aMsg) aMsg.textContent = msgs;
      if (aUsr) aUsr.textContent = 0; // TODO: unique users
      if (aRes) aRes.textContent = resv;

      // Populate agent section fields
      if (document.getElementById('bizNameInput')) document.getElementById('bizNameInput').value = d.biz.name || '';
      if (document.getElementById('bizTypeInput')) document.getElementById('bizTypeInput').value = d.biz.type || '';
      if (document.getElementById('bizAddressInput')) document.getElementById('bizAddressInput').value = d.biz.address || '';
      if (document.getElementById('bizScheduleInput')) document.getElementById('bizScheduleInput').value = d.biz.schedule || '';
      if (document.getElementById('bizPhoneInput')) document.getElementById('bizPhoneInput').value = d.biz.phone || '';
    }
    if (d.agentConfig) {
      if (document.getElementById('agentNameInput')) document.getElementById('agentNameInput').value = d.agentConfig.agent_name || '';
      if (document.getElementById('agentInstructions')) document.getElementById('agentInstructions').value = d.agentConfig.instructions || '';
      
      const toneBtns = document.querySelectorAll('.tone-option');
      toneBtns.forEach(b => {
        b.classList.remove('selected');
        if (d.agentConfig.tone && b.textContent.includes(d.agentConfig.tone)) {
          b.classList.add('selected');
        }
      });

      const switches = document.querySelectorAll('.agent-toggle-section .switch');
      if (switches.length >= 1) switches[0].classList.toggle('active', !!d.agentConfig.active);
      if (switches.length >= 2) switches[1].classList.toggle('active', !!d.agentConfig.take_orders);
      if (switches.length >= 3) switches[2].classList.toggle('active', !!d.agentConfig.manage_reservations);
    }
  } catch(e) { console.error('Fetch Config Error', e); }
}

async function fetchMenuData() {
  try {
    const res = await fetch(API_URL + '/menu', { headers: { 'Authorization': 'Bearer ' + token }});
    const d = await res.json();
    const catContainer = document.getElementById('menuCategories');
    if (!catContainer) return;

    if (Array.isArray(d) && d.length > 0) {
      catContainer.innerHTML = ''; // Clear default mock menu only if we have real data
      const grouped = {};
      d.forEach(i => {
        grouped[i.category] = grouped[i.category] || [];
        grouped[i.category].push(i);
      });
      for (const catName in grouped) {
        addCategoryDetailed(catName, grouped[catName]);
      }
    } else {
      // Show empty state - wipe defaults
      catContainer.innerHTML = '<p style="color:var(--text-dim);padding:24px;">Aún no tienes productos en el menú. Empieza añadiendo categorías.</p>';
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
    
    // QR Code Generation
    const txt = document.getElementById('qrPlaceholderText');
    if (d.slug) {
      const url = window.location.origin + '/biolink.html?b=' + d.slug;
      const qrImg = document.getElementById('dashboardQR');
      if (qrImg) {
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;
        qrImg.style.display = 'block';
        if (txt) txt.style.display = 'none';
        
        document.querySelectorAll('.link-online-menu').forEach(link => {
          link.href = url;
          link.innerHTML = '🔗 Ver carta online';
        });
      }
    } else {
      if (txt) txt.innerHTML = 'Guarda tu<br>Bio Link 1º';
    }
  } catch(e) { console.error('Biolink Fetch Error', e); }
}

async function fetchReservations() {
  try {
    const res = await fetch(API_URL + '/reservations', { headers: { 'Authorization': 'Bearer ' + token }});
    const arr = await res.json();
    if (!Array.isArray(arr)) return;

    const listDiv = document.querySelector('.res-full-list');
    const miniDiv = document.getElementById('miniReservations');
    if (listDiv) listDiv.innerHTML = '';
    if (miniDiv) miniDiv.innerHTML = '';

    if (arr.length === 0) {
      if (listDiv) listDiv.innerHTML = '<p style="color:var(--text-muted)">Aún no tienes reservas.</p>';
      if (miniDiv) miniDiv.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-dim)">Sin próximas reservas.</div>';
      return;
    }

    // Llenar vista completa
    if (listDiv) {
      arr.forEach(r => {
        const div = document.createElement('div');
        div.className = `res-full-item ${r.status === 'confirmed' ? 'confirmed' : ''}`;
        div.innerHTML = `
          <div class="res-full-time">${r.res_time ? new Date(r.res_time).toLocaleString() : 'Sin hora'}</div>
          <div class="res-full-info">
            <div class="res-full-name">${r.customer_name}</div>
            <div class="res-full-detail">${r.party_size || '-'} · ${r.channel || 'Externa'}</div>
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
    }

    // Llenar vista dashboard (solo ultimas 3)
    if (miniDiv) {
      const top3 = arr.slice(0, 3);
      top3.forEach(r => {
        const div = document.createElement('div');
        div.className = 'res-mini-item';
        div.innerHTML = `
          <div class="res-time" style="font-size:0.8rem">
            ${r.res_time ? new Date(r.res_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
          </div>
          <div class="res-detail">
            <div class="res-name">${r.customer_name}</div>
            <div class="res-persons">${r.party_size || '?'} pax</div>
          </div>
          <div class="res-status ${r.status === 'confirmed' ? 'confirmed' : 'pending-res'}">
            ${r.status === 'confirmed' ? '✓' : '⏳'}
          </div>
        `;
        miniDiv.appendChild(div);
      });
    }

  } catch(e) { console.error('Reservations API Error', e); }
}

async function fetchChannels() {
  try {
    const res = await fetch(API_URL + '/channels', { headers: { 'Authorization': 'Bearer ' + token }});
    const channels = await res.json();
    
    // Helper emoji map
    const emojiMap = { whatsapp: '💬', instagram: '📷', facebook: '📘', web: '🌐' };
    
    // === Fill dashboard channels widget ===
    const dashDiv = document.getElementById('dashboardChannels');
    if (dashDiv) {
      if (!Array.isArray(channels) || channels.length === 0) {
        dashDiv.innerHTML = '<div style="text-align:center; padding:20px; color:var(--text-dim)">No tienes canales conectados aún.<br><a href="#" onclick="document.querySelector(\"[data-section=channels]\").click()" style="color:var(--purple)">Conectar →</a></div>';
      } else {
        dashDiv.innerHTML = channels.map(ch => `
          <div class="ch-status-item">
            <span class="ch-emoji">${emojiMap[ch.platform] || '💬'}</span>
            <div class="ch-status-info">
              <div class="ch-status-name">${ch.platform}</div>
              <div class="ch-status-num">${ch.identifier || ''}</div>
            </div>
            <div class="ch-status-badge connected">Conectado</div>
          </div>
        `).join('');
      }
    }
    
    // === Update channel cards in Channels section ===
    if (!Array.isArray(channels)) return;
    
    // Reset all cards first
    document.querySelectorAll('.channel-card').forEach(card => {
      card.classList.remove('connected');
      const statusEl = card.querySelector('.ch-card-status');
      if (statusEl) {
        statusEl.textContent = 'No configurado';
        statusEl.className = 'ch-card-status';
      }
      const btn = card.querySelector('button');
      if (btn) { btn.textContent = 'Conectar'; btn.className = 'btn-primary-sm'; }
    });
    
    // Apply connected state where applicable
    channels.forEach(ch => {
      const platLc = ch.platform.toLowerCase();
      let cardId = '';
      if (platLc.includes('whatsapp')) cardId = 'ch-whatsapp';
      else if (platLc.includes('instagram')) cardId = 'ch-instagram';
      else if (platLc.includes('facebook')) cardId = 'ch-facebook';
      else if (platLc.includes('web') || platLc.includes('chat')) cardId = 'ch-webchat';
      
      if (!cardId) return;
      const card = document.getElementById(cardId);
      if (!card) return;
      
      card.classList.add('connected');
      const statusEl = card.querySelector('.ch-card-status');
      if (statusEl) { statusEl.textContent = '● Conectado'; statusEl.className = 'ch-card-status connected-text'; }
      const numEl = card.querySelector('.ch-card-num');
      if (numEl) { numEl.textContent = ch.identifier || ''; numEl.style.color = ''; }
      const btn = card.querySelector('button');
      if (btn) { btn.textContent = 'Gestionar'; btn.className = 'btn-secondary-sm'; }
    });
    
  } catch(e) { console.error('Channels error:', e); }
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
async function sendTestMessage() {
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

  try {
    const res = await fetch(API_URL + '/chat-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    typing.remove();
    const botBubble = document.createElement('div');
    botBubble.className = 'test-bubble bot';
    botBubble.textContent = data.reply || 'Sin respuesta';
    messages.appendChild(botBubble);
    messages.scrollTop = messages.scrollHeight;
  } catch(e) {
    typing.remove();
    const errBubble = document.createElement('div');
    errBubble.className = 'test-bubble bot';
    errBubble.textContent = '❌ Error de red.';
    messages.appendChild(errBubble);
  }
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

    // Detect which section we're in
    const section = btn.closest('.section');
    const sectionId = section?.id || '';

    try {
      if (sectionId === 'section-agent') {
        await fetch(API_URL + '/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify({
            bizName: document.getElementById('bizNameInput')?.value,
            bizType: document.getElementById('bizTypeInput')?.value,
            bizAddress: document.getElementById('bizAddressInput')?.value,
            bizSchedule: document.getElementById('bizScheduleInput')?.value,
            bizPhone: document.getElementById('bizPhoneInput')?.value,
            agentName: document.getElementById('agentNameInput')?.value,
            tone: document.querySelector('.tone-option.selected')?.textContent.trim().replace(/[^a-zA-Zá-úÁ-Ú]/gu, '').trim() || 'Amigable',
            instructions: document.getElementById('agentInstructions')?.value,
            active: document.querySelectorAll('.agent-toggle-section .switch')[0]?.classList.contains('active'),
            take_orders: document.querySelectorAll('.agent-toggle-section .switch')[1]?.classList.contains('active'),
            manage_reservations: document.querySelectorAll('.agent-toggle-section .switch')[2]?.classList.contains('active'),
          })
        });
      }

      if (sectionId === 'section-menu') {
        const menuItems = [];
        document.querySelectorAll('.menu-category').forEach(catDiv => {
          const categoryName = catDiv.querySelector('.cat-name').value;
          catDiv.querySelectorAll('.product-row').forEach(pRow => {
            const nameVal = pRow.querySelector('.prod-name')?.value;
            if (!nameVal) return; // skip empty rows
            menuItems.push({
              category: categoryName,
              name: nameVal,
              description: pRow.querySelector('.prod-desc')?.value || '',
              price: parseFloat(pRow.querySelector('.prod-price')?.value || 0),
              available: pRow.querySelector('.switch')?.classList.contains('active') ?? true
            });
          });
        });
        await fetch(API_URL + '/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify({ menu: menuItems })
        });
        // After saving menu, reload QR/biolink to update carta link
        await fetchBiolinkData();
      }

      if (sectionId === 'section-biolink') {
        const slug = document.querySelector('.url-slug')?.value?.trim();
        if (!slug) { alert('Debes escribir un enlace personalizado.'); throw new Error('no slug'); }
        const bInputs = document.querySelectorAll('.biolink-editor .form-input');
        const color = document.querySelector('.color-opt.selected')?.style.background || '#8b47ff';
        const bs = document.querySelectorAll('.button-toggles .switch');

        const r = await fetch(API_URL + '/biolink', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify({
            slug,
            display_name: bInputs[0]?.value || '',
            description: bInputs[1]?.value || '',
            color,
            btn_chat: bs[0]?.classList.contains('active'),
            btn_menu: bs[1]?.classList.contains('active'),
            btn_res: bs[2]?.classList.contains('active'),
            btn_map: bs[3]?.classList.contains('active'),
            btn_shop: bs[4]?.classList.contains('active')
          })
        });
        const ans = await r.json();
        if (!ans.success) {
          alert('Error: ' + (ans.error || 'No se pudo guardar el bio link'));
          throw new Error('Bio link fail');
        }
        // Refresh QR after slug saved
        await fetchBiolinkData();
      }

    } catch(e) {
      console.error('Error guardando:', e);
      btn.textContent = '❌ Error';
      btn.disabled = false;
      setTimeout(() => { btn.textContent = orig; }, 2000);
      return;
    }

    btn.textContent = '✓ Guardado!';
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.disabled = false;
    }, 2000);
  });
});

// Real Channel Configs
document.querySelectorAll('.channel-card .btn-primary-sm, .channel-card .btn-secondary-sm').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const card = btn.closest('.channel-card');
    const name = card.querySelector('.ch-card-name').textContent.trim();
    
    document.getElementById('cModalTitle').textContent = `Conectar ${name}`;
    document.getElementById('cModalPlatform').value = name.toLowerCase();
    
    const numEl = card.querySelector('.ch-card-num');
    const num = numEl ? numEl.textContent.trim() : '';
    document.getElementById('cModalInput').value = num.includes('Añade el') ? '' : num;
    
    document.getElementById('channelModal').style.display = 'flex';
  });
});

async function saveChannelForm() {
  const platform = document.getElementById('cModalPlatform').value;
  const identifier = document.getElementById('cModalInput').value;
  const btn = document.getElementById('cModalSubmit');
  
  if (!identifier) return alert('Debes introducir un identificador o número válido');
  
  btn.textContent = 'Guardando...';
  try {
    const res = await fetch(API_URL + '/channels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ platform, identifier, status: 'connected' })
    });
    if (res.ok) {
       document.getElementById('channelModal').style.display = 'none';
       window.location.reload(); // Refresh immediately to show connected status
    } else {
       alert('Error al guardar.');
    }
  } catch(e) {
    alert('Error al guardar el canal');
  }
  btn.textContent = 'Conectar';
}

async function downloadQR() {
  const img = document.getElementById('dashboardQR');
  if (!img || !img.src) return alert('El QR no está listo aún');
  try {
    const response = await fetch(img.src);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'atendia-qr.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch(e) {
    window.open(img.src, '_blank');
  }
}

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
