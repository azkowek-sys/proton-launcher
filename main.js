'use strict';

// ── Data ────────────────────────────────────────────────────────────────────
let instances = JSON.parse(localStorage.getItem('pl-instances') || 'null') || [
  { id: 1, name: '1.21.4 Vanilla',  ver: '1.21.4', loader: 'vanilla',  icon: '🌿', color: '#2d4a2d', fav: false },
  { id: 2, name: 'Create Modpack',  ver: '1.20.1', loader: 'forge',    icon: '⚙️',  color: '#2a3a5a', fav: true  },
  { id: 3, name: 'Performance',     ver: '1.21.4', loader: 'fabric',   icon: '⚡',  color: '#4a3a1a', fav: false },
  { id: 4, name: 'Bliss Shaders',   ver: '1.21.1', loader: 'fabric',   icon: '✨',  color: '#3a2a5a', fav: false },
  { id: 5, name: 'ATM9',            ver: '1.20.1', loader: 'neoforge', icon: '🔥', color: '#4a2a2a', fav: true  },
  { id: 6, name: 'Quilt Test',      ver: '1.21.4', loader: 'quilt',    icon: '🧵', color: '#3a2a4a', fav: false },
];

const NEWS = [
  { color: '#4caf7d', title: 'Minecraft Java Edition 1.21.4 — "The Garden Awakens"', desc: 'The pale garden biome, creaking heart, and eyeblossom flower arrive in the latest release.', date: 'Dec 3' },
  { color: '#7c6aee', title: 'Fabric 0.16.9 released', desc: 'Compatibility updates for 1.21.4, performance improvements to loader internals.', date: 'Dec 1' },
  { color: '#e09d4a', title: 'NeoForge 21.4.0-beta.1 available', desc: 'Early beta for 1.21.4 support. Not recommended for stable modpacks yet.', date: 'Nov 28' },
  { color: '#4a9de0', title: 'Modrinth adds marketplace features', desc: 'Creators can now sell cosmetic content packs directly on the platform.', date: 'Nov 25' },
];

const LOADER_LABELS = { vanilla: 'Vanilla', fabric: 'Fabric', forge: 'Forge', quilt: 'Quilt', neoforge: 'NeoForge' };
const MC_VERSIONS   = ['1.21.4','1.21.1','1.21','1.20.6','1.20.4','1.20.1','1.19.4','1.18.2','1.16.5','1.12.2','1.8.9'];
const ICONS         = ['🌿','⚙️','⚡','✨','🔥','🧵','🗡️','🏠','🌍','🌊','❄️','🎮','🛡️','🪄','💎','🦊'];
const COLORS        = ['#2d4a2d','#2a3a5a','#4a3a1a','#3a2a5a','#4a2a2a','#3a2a4a','#1a3a4a','#4a3a2a'];

let selectedId   = null;
let currentFilter = 'all';
let searchQuery  = '';
let gridView     = true;
let nextId       = Math.max(...instances.map(i => i.id), 0) + 1;
let newInstData  = { name: 'New Instance', ver: '1.21.4', loader: 'vanilla', icon: '🌿', color: '#2d4a2d' };

function saveInstances() { localStorage.setItem('pl-instances', JSON.stringify(instances)); }

// ── Render ────────────────────────────────────────────────────────────────────
function filteredInstances() {
  let list = [...instances];
  if (currentFilter === 'recent') list = list.slice().reverse().slice(0, 4);
  else if (currentFilter === 'fav') list = list.filter(i => i.fav);
  else if (currentFilter === 'vanilla') list = list.filter(i => i.loader === 'vanilla');
  else if (currentFilter === 'modded') list = list.filter(i => i.loader !== 'vanilla');
  if (searchQuery) list = list.filter(i => i.name.toLowerCase().includes(searchQuery) || i.ver.includes(searchQuery));
  return list;
}

function renderInstances() {
  const grid = document.getElementById('instance-grid');
  const list = filteredInstances();
  document.getElementById('instances-count').textContent = list.length + ' instances';
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = gridView
    ? 'repeat(auto-fill, minmax(118px, 1fr))'
    : '1fr';

  list.forEach(inst => {
    const card = document.createElement('div');
    card.className = 'instance-card' + (selectedId === inst.id ? ' selected' : '');
    if (!gridView) {
      card.style.cssText = 'flex-direction:row;padding:10px 14px;gap:12px;';
    }
    card.innerHTML = `
      <div class="instance-icon" style="background:${inst.color}33;border:1px solid ${inst.color}55;${!gridView?'width:36px;height:36px;font-size:18px;flex-shrink:0;':''}">${inst.icon}</div>
      <div style="${!gridView?'flex:1;min-width:0;text-align:left;':'text-align:center;width:100%;'}">
        <div class="instance-name" style="${!gridView?'text-align:left;':''}">${inst.name}</div>
        <div class="instance-ver" style="${!gridView?'text-align:left;':''}">${inst.ver} · ${LOADER_LABELS[inst.loader]}</div>
      </div>
      <span class="loader-badge badge-${inst.loader}">${LOADER_LABELS[inst.loader]}</span>
      ${inst.fav ? '<span style="position:absolute;top:7px;left:7px;font-size:11px;">⭐</span>' : ''}
    `;
    card.addEventListener('click', () => selectInstance(inst.id));
    card.addEventListener('dblclick', () => launchInstance(inst));
    card.addEventListener('contextmenu', e => { e.preventDefault(); showCtx(e.clientX, e.clientY, inst.id); });
    grid.appendChild(card);
  });

  const addCard = document.createElement('button');
  addCard.className = 'add-card';
  addCard.innerHTML = '<i class="ti ti-plus"></i><span>Add Instance</span>';
  addCard.addEventListener('click', openNewInstanceModal);
  grid.appendChild(addCard);
}

function renderNews() {
  const list = document.getElementById('news-list');
  list.innerHTML = NEWS.map(n => `
    <div class="news-item">
      <div class="news-dot" style="background:${n.color}"></div>
      <div class="news-content">
        <div class="news-title">${n.title}</div>
        <div class="news-desc">${n.desc}</div>
      </div>
      <div class="news-date">${n.date}</div>
    </div>
  `).join('');
}

// ── Selection ─────────────────────────────────────────────────────────────────
function selectInstance(id) {
  selectedId = id;
  renderInstances();
  ['btn-launch','btn-edit','btn-kill','btn-folder'].forEach(b => {
    const el = document.getElementById(b);
    el.dataset.disabled = 'false';
  });
}

function deselectAll() {
  selectedId = null;
  renderInstances();
  ['btn-launch','btn-edit','btn-kill','btn-folder'].forEach(b => {
    document.getElementById(b).dataset.disabled = 'true';
  });
}

function launchInstance(inst) {
  if (!inst) return;
  alert(`Launching ${inst.name} (${inst.ver})…\n\nMicrosoft login integration coming soon!`);
}

// ── Pages ─────────────────────────────────────────────────────────────────────
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + pageId).classList.add('active');
}

// ── Nav ───────────────────────────────────────────────────────────────────────
document.querySelectorAll('.nav-item').forEach(el => {
  el.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    el.classList.add('active');

    const filter = el.dataset.filter;
    const page   = el.dataset.page;

    if (filter) {
      currentFilter = filter;
      showPage('instances');
      const titles = { all:'All Instances', recent:'Recent', fav:'Favourites', vanilla:'Vanilla', modded:'Modded' };
      document.getElementById('instances-title').textContent = titles[filter] || 'Instances';
      renderInstances();
    } else if (page) {
      showPage(page);
    }
  });
});

// ── Search ───────────────────────────────────────────────────────────────────
document.getElementById('search-box').addEventListener('input', e => {
  searchQuery = e.target.value.toLowerCase();
  renderInstances();
});

// ── View toggle ───────────────────────────────────────────────────────────────
document.getElementById('btn-toggle-view').addEventListener('click', () => {
  gridView = !gridView;
  document.querySelector('#btn-toggle-view i').className = gridView ? 'ti ti-layout-grid' : 'ti ti-layout-list';
  renderInstances();
});

// ── Toolbar buttons ───────────────────────────────────────────────────────────
document.getElementById('btn-add-instance').addEventListener('click', openNewInstanceModal);
document.getElementById('btn-launch').addEventListener('click', () => {
  const inst = instances.find(i => i.id === selectedId);
  if (inst) launchInstance(inst);
});
document.getElementById('btn-edit').addEventListener('click', () => {
  if (selectedId) openEditModal(selectedId);
});
document.getElementById('btn-folder').addEventListener('click', () => {
  alert('This would open the instance folder in Explorer.');
});
document.getElementById('btn-kill').addEventListener('click', () => {
  alert('Game process killed.');
});

// ── Context Menu ──────────────────────────────────────────────────────────────
const ctxMenu = document.getElementById('ctx-menu');
let ctxTargetId = null;

function showCtx(x, y, id) {
  ctxTargetId = id;
  selectInstance(id);
  ctxMenu.style.left = Math.min(x, window.innerWidth - 160) + 'px';
  ctxMenu.style.top  = Math.min(y, window.innerHeight - 220) + 'px';
  ctxMenu.classList.add('visible');
}

ctxMenu.querySelectorAll('.ctx-item').forEach(item => {
  item.addEventListener('click', () => {
    const action = item.dataset.action;
    const inst = instances.find(i => i.id === ctxTargetId);
    if (!inst) return;
    if (action === 'launch')  launchInstance(inst);
    if (action === 'edit')    openEditModal(ctxTargetId);
    if (action === 'folder')  alert('Opens instance folder in Explorer.');
    if (action === 'copy')    duplicateInstance(ctxTargetId);
    if (action === 'fav')     { inst.fav = !inst.fav; saveInstances(); renderInstances(); }
    if (action === 'delete')  deleteInstance(ctxTargetId);
    ctxMenu.classList.remove('visible');
  });
});

document.addEventListener('click', () => ctxMenu.classList.remove('visible'));

// ── Instance actions ──────────────────────────────────────────────────────────
function duplicateInstance(id) {
  const orig = instances.find(i => i.id === id);
  if (!orig) return;
  const copy = { ...orig, id: nextId++, name: orig.name + ' (copy)' };
  instances.push(copy);
  saveInstances();
  renderInstances();
}

function deleteInstance(id) {
  if (!confirm('Delete this instance? This cannot be undone.')) return;
  instances = instances.filter(i => i.id !== id);
  if (selectedId === id) deselectAll();
  saveInstances();
  renderInstances();
}

// ── New Instance Modal ────────────────────────────────────────────────────────
function openNewInstanceModal() {
  newInstData = { name: 'New Instance', ver: '1.21.4', loader: 'vanilla', icon: '🌿', color: COLORS[0] };
  document.getElementById('modal-title').textContent = 'Add Instance';
  document.getElementById('modal-ok').textContent = 'Create';
  document.getElementById('modal-body').innerHTML = buildInstanceForm(newInstData);
  attachFormListeners('new');
  document.getElementById('modal-backdrop').classList.remove('hidden');
}

function openEditModal(id) {
  const inst = instances.find(i => i.id === id);
  if (!inst) return;
  newInstData = { ...inst };
  document.getElementById('modal-title').textContent = 'Edit Instance';
  document.getElementById('modal-ok').textContent = 'Save';
  document.getElementById('modal-body').innerHTML = buildInstanceForm(newInstData);
  attachFormListeners('edit');
  document.getElementById('modal-backdrop').classList.remove('hidden');
}

function buildInstanceForm(data) {
  return `
    <div class="form-row">
      <label class="form-label">Name</label>
      <input class="form-input" id="fi-name" value="${data.name}" placeholder="My Instance">
    </div>
    <div class="form-row">
      <label class="form-label">Minecraft Version</label>
      <select class="form-select" id="fi-ver">
        ${MC_VERSIONS.map(v => `<option ${v===data.ver?'selected':''}>${v}</option>`).join('')}
      </select>
    </div>
    <div class="form-row">
      <label class="form-label">Mod Loader</label>
      <div class="loader-options" id="fi-loader">
        ${['vanilla','fabric','forge','quilt','neoforge'].map(l => `
          <div class="loader-opt ${l===data.loader?'selected':''}" data-loader="${l}">
            ${l==='vanilla'?'🌿':l==='fabric'?'🧶':l==='forge'?'⚒️':l==='quilt'?'🧵':'🔩'}
            ${LOADER_LABELS[l]}
          </div>
        `).join('')}
      </div>
    </div>
    <div class="form-row">
      <label class="form-label">Icon</label>
      <div style="display:flex;flex-wrap:wrap;gap:6px;" id="fi-icon">
        ${ICONS.map(ic => `<button style="font-size:20px;background:${ic===data.icon?'var(--accent-d)':'var(--bg3)'};border:1px solid ${ic===data.icon?'var(--accent)':'var(--border)'};border-radius:6px;padding:4px 7px;cursor:pointer;transition:all 0.1s;" data-icon="${ic}">${ic}</button>`).join('')}
      </div>
    </div>
  `;
}

function attachFormListeners(mode) {
  document.getElementById('fi-name').addEventListener('input', e => { newInstData.name = e.target.value; });
  document.getElementById('fi-ver').addEventListener('change', e => { newInstData.ver = e.target.value; });
  document.getElementById('fi-loader').querySelectorAll('.loader-opt').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.loader-opt').forEach(o => o.classList.remove('selected'));
      el.classList.add('selected');
      newInstData.loader = el.dataset.loader;
    });
  });
  document.getElementById('fi-icon').querySelectorAll('button').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('#fi-icon button').forEach(b => {
        b.style.background = 'var(--bg3)'; b.style.borderColor = 'var(--border)';
      });
      el.style.background = 'var(--accent-d)'; el.style.borderColor = 'var(--accent)';
      newInstData.icon = el.dataset.icon;
    });
  });
}

document.getElementById('modal-ok').addEventListener('click', () => {
  const mode = document.getElementById('modal-ok').textContent === 'Create' ? 'new' : 'edit';
  newInstData.name = document.getElementById('fi-name').value.trim() || 'My Instance';
  if (mode === 'new') {
    newInstData.id = nextId++;
    newInstData.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    newInstData.fav = false;
    instances.push({ ...newInstData });
  } else {
    const idx = instances.findIndex(i => i.id === selectedId);
    if (idx !== -1) instances[idx] = { ...newInstData };
  }
  saveInstances();
  renderInstances();
  closeModal();
});

document.getElementById('modal-cancel').addEventListener('click', closeModal);
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-backdrop').addEventListener('click', e => { if (e.target === document.getElementById('modal-backdrop')) closeModal(); });

function closeModal() {
  document.getElementById('modal-backdrop').classList.add('hidden');
}

// ── Window controls ───────────────────────────────────────────────────────────
if (window.electron) {
  document.getElementById('btn-min').addEventListener('click', () => window.electron.minimize());
  document.getElementById('btn-max').addEventListener('click', () => window.electron.maximize());
  document.getElementById('btn-close').addEventListener('click', () => window.electron.close());
} else {
  // Running in browser preview — hide close/min/max quietly
  ['btn-min','btn-max','btn-close'].forEach(id => {
    document.getElementById(id).addEventListener('click', () => {});
  });
}

// ── Color swatches ─────────────────────────────────────────────────────────────
document.querySelectorAll('.color-swatch').forEach(sw => {
  sw.addEventListener('click', () => {
    document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
    sw.classList.add('active');
    document.documentElement.style.setProperty('--accent', sw.dataset.color);
  });
});

// ── Init ──────────────────────────────────────────────────────────────────────
renderInstances();
renderNews();
