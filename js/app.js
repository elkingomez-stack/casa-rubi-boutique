// Casa Rubí — catálogo, filtros, vista rápida, movimiento y pedidos por WhatsApp.

const CONFIG = {
  // Número de WhatsApp de la tienda con indicativo de Colombia, sin "+" ni espacios.
  whatsapp: '573147788670',
  pageSize: 12,
  // Fila "Elegidas de la casa" (ids de products.js)
  elegidas: [6, 8, 12, 9, 1, 3, 21, 14],
};

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

const price = new Intl.NumberFormat('es-CO', {
  style: 'currency', currency: 'COP', maximumFractionDigits: 0,
});

const waLink = (text) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

const productMessage = (p) =>
  `Hola Casa Rubí, me interesa: ${p.name}${p.detail ? ` (${p.detail})` : ''} de ${price.format(p.price)}. ¿Está disponible?`;

const normalize = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const byId = (id) => PRODUCTS.find((p) => p.id === id);

/* ───── Aparición al hacer scroll (una sola vez por elemento) ───── */
const revealer = 'IntersectionObserver' in window && !reduceMotion.matches
  ? new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      revealer.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })
  : null;

function reveal(el) {
  if (revealer) revealer.observe(el);
  else el.classList.add('is-in');
}
document.querySelectorAll('[data-reveal]').forEach(reveal);

/* ───── Tarjeta de prenda ───── */
function card(p, i, getList) {
  const li = document.createElement('li');
  li.className = 'card';
  li.innerHTML = `
    <button class="card-hit" type="button" aria-label="Ver ${p.name}">
      <img src="${p.thumb}" srcset="${p.thumb} 480w, ${p.img} 1024w"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
        alt="" loading="lazy" decoding="async" data-loading>
      <span class="card-peek">Vista rápida</span>
    </button>
    <div class="card-body">
      <h3 class="card-name">${p.name}</h3>
      ${p.detail ? `<p class="card-detail">${p.detail}</p>` : ''}
      <p class="card-price">${price.format(p.price)}</p>
    </div>`;

  const img = li.querySelector('img');
  const loaded = () => img.removeAttribute('data-loading');
  if (img.complete) loaded();
  else { img.addEventListener('load', loaded, { once: true }); img.addEventListener('error', loaded, { once: true }); }

  li.querySelector('.card-hit').addEventListener('click', (e) => openQV(getList(), p.id, e.currentTarget));
  return li;
}

/* ───── Elegidas de la casa: fila deslizable ───── */
const railEl = document.getElementById('elegidas');
const railList = CONFIG.elegidas.map(byId).filter(Boolean);
railList.forEach((p, i) => railEl.append(card(p, i, () => railList)));

const railBtns = document.querySelectorAll('[data-rail]');
function updateRailBtns() {
  const max = railEl.scrollWidth - railEl.clientWidth - 2;
  railBtns[0].disabled = railEl.scrollLeft <= 2;
  railBtns[1].disabled = railEl.scrollLeft >= max;
}
railBtns.forEach((b) => b.addEventListener('click', () => {
  const step = railEl.querySelector('.card').offsetWidth + 24;
  railEl.scrollBy({ left: Number(b.dataset.rail) * step * 2, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
}));
railEl.addEventListener('scroll', updateRailBtns, { passive: true });

// Arrastrar con el mouse; los dedos y el trackpad ya deslizan solos.
(() => {
  let startX = 0, startScroll = 0, dragging = false, moved = false;
  railEl.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    dragging = true; moved = false;
    startX = e.clientX; startScroll = railEl.scrollLeft;
  });
  addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) { moved = true; railEl.classList.add('is-dragging'); }
    if (moved) railEl.scrollLeft = startScroll - dx;
  });
  addEventListener('pointerup', () => {
    if (!dragging) return;
    dragging = false;
    // al soltar, el scroll-snap vuelve y acomoda la tarjeta más cercana
    requestAnimationFrame(() => railEl.classList.remove('is-dragging'));
  });
  railEl.addEventListener('click', (e) => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
})();

/* ───── Catálogo ───── */
const state = { cat: 'todo', q: '', limit: CONFIG.pageSize };

const filtersEl = document.querySelector('.filters');
const inkEl = document.querySelector('.filter-ink');
const gridEl = document.getElementById('catalog-grid');
const countEl = document.getElementById('count');
const emptyEl = document.getElementById('empty');
const moreEl = document.getElementById('more');
const searchEl = document.getElementById('q');

const tabs = [['todo', 'Todo'], ...Object.entries(CATEGORIES)].map(([key, label]) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'filter';
  b.setAttribute('role', 'tab');
  b.dataset.cat = key;
  b.textContent = label;
  b.addEventListener('click', () => setCategory(key));
  filtersEl.append(b);
  return b;
});

function moveInk() {
  const active = tabs.find((t) => t.dataset.cat === state.cat);
  if (!active) return;
  inkEl.style.width = `${active.offsetWidth}px`;
  inkEl.style.transform = `translateX(${active.offsetLeft}px)`;
}

function filtered() {
  const q = normalize(state.q.trim());
  return PRODUCTS.filter((p) =>
    (state.cat === 'todo' || p.cat === state.cat) &&
    (!q || normalize(`${p.name} ${p.detail} ${CATEGORIES[p.cat]}`).includes(q)));
}

function render({ append = false } = {}) {
  const list = filtered();
  const shown = list.slice(0, state.limit);

  tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.cat === state.cat)));
  moveInk();

  const start = append ? gridEl.children.length : 0;
  if (!append) gridEl.replaceChildren();
  shown.slice(start).forEach((p, i) => {
    const li = card(p, i, filtered);
    li.dataset.reveal = 'up';
    li.style.setProperty('--d', `${(i % 4) * 60 + Math.floor(i / 4) * 40}ms`);
    gridEl.append(li);
    reveal(li);
  });

  countEl.textContent = list.length === 1 ? '1 prenda' : `${list.length} prendas`;
  emptyEl.hidden = list.length > 0;
  moreEl.hidden = shown.length >= list.length;
}

// Cambio de filtro: la rejilla se desenfoca un instante y la nueva entra en cascada.
function swapGrid(update) {
  if (reduceMotion.matches || !gridEl.children.length) { update(); render(); return; }
  update();
  const out = gridEl.animate(
    [{ opacity: 1, filter: 'blur(0)' }, { opacity: 0, filter: 'blur(2px)' }],
    { duration: 140, easing: 'ease-out', fill: 'forwards' });
  out.onfinish = () => { render(); out.cancel(); };
}

function setCategory(cat) {
  if (cat === state.cat && !state.q) return;
  swapGrid(() => { state.cat = cat; state.limit = CONFIG.pageSize; });
}

moreEl.addEventListener('click', () => {
  state.limit += CONFIG.pageSize;
  render({ append: true });
});

let searchTimer;
searchEl.addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    swapGrid(() => { state.q = searchEl.value; state.limit = CONFIG.pageSize; });
  }, 160);
});

document.querySelectorAll('[data-filter-link]').forEach((a) =>
  a.addEventListener('click', () => {
    if (state.q) { state.q = ''; searchEl.value = ''; }
    setCategory(a.dataset.filterLink);
    closeMenu();
  }));

document.querySelectorAll('[data-search-open]').forEach((b) =>
  b.addEventListener('click', () => {
    document.getElementById('catalogo').scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    searchEl.focus({ preventScroll: true });
  }));

/* ───── Vista rápida ───── */
const qv = document.getElementById('qv');
const qvPanel = qv.querySelector('.qv-panel');
const qvImg = document.getElementById('qv-img');
const qvName = document.getElementById('qv-name');
const qvDetail = document.getElementById('qv-detail');
const qvPrice = document.getElementById('qv-price');
const qvWa = document.getElementById('qv-wa');
const qvPos = document.getElementById('qv-pos');
[qvImg, qvName, qvDetail, qvPrice].forEach((el) => el.classList.add('qv-swap'));

const qvState = { list: [], index: 0, opener: null };

function fillQV() {
  const p = qvState.list[qvState.index];
  qvImg.src = p.thumb;               // aparece al instante con la versión liviana…
  qvImg.alt = `${p.name}${p.detail ? `, ${p.detail}` : ''}`;
  const full = new Image();          // …y se reemplaza por la foto completa al cargar
  full.onload = () => { if (qvState.list[qvState.index] === p) qvImg.src = p.img; };
  full.src = p.img;
  qvName.textContent = p.name;
  qvDetail.textContent = p.detail || CATEGORIES[p.cat];
  qvPrice.textContent = price.format(p.price);
  qvWa.href = waLink(productMessage(p));
  qvPos.textContent = `${qvState.index + 1} / ${qvState.list.length}`;
}

function openQV(list, id, opener) {
  qvState.list = list;
  qvState.index = Math.max(0, list.findIndex((p) => p.id === id));
  qvState.opener = opener;
  fillQV();
  qv.showModal();
  document.documentElement.classList.add('qv-lock');
  requestAnimationFrame(() => requestAnimationFrame(() => qv.classList.add('is-open')));
}

function closeQV() {
  if (!qv.open || !qv.classList.contains('is-open')) return;
  qv.classList.remove('is-open');
  qvPanel.style.transform = '';
  const finish = () => {
    qv.close();
    document.documentElement.classList.remove('qv-lock');
    qvState.opener?.focus({ preventScroll: true });
  };
  if (reduceMotion.matches) finish();
  else setTimeout(finish, 260);
}

// Con botón: transición con desenfoque. Con teclado: cambio instantáneo (se repite mucho).
function stepQV(dir, { animate = true } = {}) {
  const n = qvState.list.length;
  if (n < 2) return;
  const go = () => { qvState.index = (qvState.index + dir + n) % n; fillQV(); };
  if (!animate || reduceMotion.matches) { go(); return; }
  qv.classList.add('is-swapping');
  setTimeout(() => { go(); qv.classList.remove('is-swapping'); }, 180);
}

qv.querySelectorAll('[data-qv-close]').forEach((el) => el.addEventListener('click', closeQV));
qv.querySelectorAll('[data-qv-step]').forEach((b) =>
  b.addEventListener('click', () => stepQV(Number(b.dataset.qvStep))));
qv.addEventListener('cancel', (e) => { e.preventDefault(); closeQV(); });
qv.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') stepQV(1, { animate: false });
  if (e.key === 'ArrowLeft') stepQV(-1, { animate: false });
});

// Celular: deslizar la hoja hacia abajo para cerrarla. Un gesto rápido basta.
(() => {
  const handle = qv.querySelector('.qv-handle');
  let y0 = 0, t0 = 0, dy = 0, active = false;
  handle.addEventListener('pointerdown', (e) => {
    active = true; y0 = e.clientY; t0 = performance.now(); dy = 0;
    handle.setPointerCapture(e.pointerId);
    qvPanel.style.transition = 'none';
  });
  handle.addEventListener('pointermove', (e) => {
    if (!active) return;
    dy = e.clientY - y0;
    // hacia arriba ofrece resistencia en vez de un tope seco
    const offset = dy > 0 ? dy : -Math.sqrt(-dy) * 2;
    qvPanel.style.transform = `translateY(${offset}px)`;
  });
  const end = () => {
    if (!active) return;
    active = false;
    qvPanel.style.transition = '';
    const velocity = Math.abs(dy) / (performance.now() - t0);
    if (dy > 120 || (dy > 10 && velocity > 0.11)) closeQV();
    else qvPanel.style.transform = '';
  };
  handle.addEventListener('pointerup', end);
  handle.addEventListener('pointercancel', end);
})();

/* ───── Destello de la gema al pasar el cursor por el logo ───── */
const gem = document.querySelector('.gem-live');
document.querySelector('.site-header .logo').addEventListener('mouseenter', () => {
  if (reduceMotion.matches || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  gem.classList.remove('is-glinting');
  void gem.getBoundingClientRect();
  gem.classList.add('is-glinting');
});

/* ───── Enlaces generales de WhatsApp ───── */
document.querySelectorAll('[data-wa]').forEach((a) => {
  a.href = waLink('Hola Casa Rubí, quiero hacer un pedido.');
  a.target = '_blank';
  a.rel = 'noopener';
});

/* ───── Franja: el texto se duplica para que el bucle no tenga costura ───── */
const track = document.querySelector('.marquee-track');
track.append(...[...track.children].map((n) => n.cloneNode(true)));

/* ───── Menú móvil ───── */
const menuBtn = document.querySelector('.menu-btn');
const menuEl = document.getElementById('menu');
menuEl.querySelectorAll('a').forEach((a, i) => a.style.setProperty('--i', i));

function closeMenu() {
  if (menuEl.hidden) return;
  menuEl.hidden = true;
  document.body.classList.remove('menu-open');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-label', 'Abrir menú');
}

menuBtn.addEventListener('click', () => {
  if (!menuEl.hidden) return closeMenu();
  menuEl.hidden = false;
  document.body.classList.add('menu-open');
  menuBtn.setAttribute('aria-expanded', 'true');
  menuBtn.setAttribute('aria-label', 'Cerrar menú');
});
menuEl.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

addEventListener('resize', () => { moveInk(); updateRailBtns(); });
document.fonts?.ready.then(moveInk);

render();
updateRailBtns();
