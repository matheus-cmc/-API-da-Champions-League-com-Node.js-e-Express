const API = "/api";

/** @typedef {{ id: number; name: string; club: string; nationality: string; position: string; statistics: Stats }} Player */
/** @typedef {{ overall: number; pace: number; shooting: number; passing: number; dribbling: number; defending: number; physical: number }} Stats */
/** @typedef {{ id: number; name: string }} Club */

/** @type {Player[]} */
let players = [];
/** @type {Club[]} */
let clubs = [];
/** @type {Player | null} */
let selectedPlayer = null;

const els = {
  grid: document.getElementById("players-grid"),
  empty: document.getElementById("players-empty"),
  strip: document.getElementById("stats-strip"),
  search: document.getElementById("search"),
  filterPos: document.getElementById("filter-position"),
  filterClub: document.getElementById("filter-club"),
  clubsTrack: document.getElementById("clubs-track"),
  drawer: document.getElementById("drawer"),
  drawerContent: document.getElementById("drawer-content"),
  createModal: document.getElementById("create-modal"),
  createForm: document.getElementById("create-form"),
  createClub: document.getElementById("create-club"),
  openCreate: document.getElementById("open-create"),
  toast: document.getElementById("toast"),
};

async function api(path, options) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options,
  });

  if (res.status === 204) return null;

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const msg = data?.message || (typeof data === "string" ? data : "Erro na requisição");
    throw new Error(msg);
  }

  return data;
}

function toast(message, type = "success") {
  els.toast.textContent = message;
  els.toast.className = `toast show ${type}`;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    els.toast.classList.remove("show");
  }, 2800);
}

function statColor(value) {
  if (value >= 90) return "#e8c872";
  if (value >= 80) return "#c5cdd8";
  return "#8b97a8";
}

function filteredPlayers() {
  const q = els.search.value.trim().toLowerCase();
  const pos = els.filterPos.value;
  const club = els.filterClub.value;

  return players.filter((p) => {
    const matchQ =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.club.toLowerCase().includes(q) ||
      p.nationality.toLowerCase().includes(q);
    const matchPos = !pos || p.position === pos;
    const matchClub = !club || p.club === club;
    return matchQ && matchPos && matchClub;
  });
}

function renderStrip(list) {
  const avg =
    list.length === 0
      ? 0
      : Math.round(list.reduce((s, p) => s + p.statistics.overall, 0) / list.length);
  const top = list.reduce((best, p) => (p.statistics.overall > (best?.statistics.overall ?? 0) ? p : best), null);
  const clubsCount = new Set(list.map((p) => p.club)).size;

  els.strip.innerHTML = `
    <div class="stat-chip" style="animation-delay:0s">
      <span class="label">Jogadores</span>
      <span class="value" data-count="${list.length}">0</span>
    </div>
    <div class="stat-chip" style="animation-delay:0.08s">
      <span class="label">Overall médio</span>
      <span class="value" data-count="${avg}">0</span>
    </div>
    <div class="stat-chip" style="animation-delay:0.16s">
      <span class="label">Clubes no elenco</span>
      <span class="value" data-count="${clubsCount}">0</span>
    </div>
    <div class="stat-chip" style="animation-delay:0.24s">
      <span class="label">Destaque</span>
      <span class="value" style="font-size:1.15rem;letter-spacing:0.02em">${top ? top.name.split(" ").slice(-1)[0] : "—"}</span>
    </div>
  `;

  els.strip.querySelectorAll("[data-count]").forEach((el) => {
    animateCount(el, Number(el.dataset.count));
  });
}

function animateCount(el, target) {
  const duration = 700;
  const start = performance.now();
  const from = 0;

  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = String(Math.round(from + (target - from) * eased));
    if (t < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

function renderPlayers() {
  const list = filteredPlayers();
  renderStrip(list);

  if (list.length === 0) {
    els.grid.innerHTML = "";
    els.empty.classList.remove("hidden");
    return;
  }

  els.empty.classList.add("hidden");
  els.grid.innerHTML = list
    .map(
      (p, i) => `
    <article class="player-card" data-id="${p.id}" style="animation-delay:${Math.min(i, 12) * 0.04}s" tabindex="0" role="button">
      <div class="card-top">
        <span class="ovr">${p.statistics.overall}</span>
        <span class="pos-badge">${p.position}</span>
      </div>
      <h3>${escapeHtml(p.name)}</h3>
      <p class="player-meta">${escapeHtml(p.club)} · ${escapeHtml(p.nationality)}</p>
      <div class="mini-stats">
        <div class="mini-stat"><span>PAC</span><strong style="color:${statColor(p.statistics.pace)}">${p.statistics.pace}</strong></div>
        <div class="mini-stat"><span>SHO</span><strong style="color:${statColor(p.statistics.shooting)}">${p.statistics.shooting}</strong></div>
        <div class="mini-stat"><span>PAS</span><strong style="color:${statColor(p.statistics.passing)}">${p.statistics.passing}</strong></div>
        <div class="mini-stat"><span>DRI</span><strong style="color:${statColor(p.statistics.dribbling)}">${p.statistics.dribbling}</strong></div>
        <div class="mini-stat"><span>DEF</span><strong style="color:${statColor(p.statistics.defending)}">${p.statistics.defending}</strong></div>
        <div class="mini-stat"><span>PHY</span><strong style="color:${statColor(p.statistics.physical)}">${p.statistics.physical}</strong></div>
      </div>
    </article>
  `
    )
    .join("");
}

function renderClubs() {
  els.clubsTrack.innerHTML = clubs
    .map(
      (c, i) => `
    <div class="club-item" style="animation-delay:${Math.min(i, 20) * 0.03}s">
      <span class="club-index">${String(c.id).padStart(2, "0")}</span>
      <span>${escapeHtml(c.name)}</span>
    </div>
  `
    )
    .join("");
}

function fillClubSelects() {
  const clubNames = [...new Set([...clubs.map((c) => c.name), ...players.map((p) => p.club)])].sort();

  els.filterClub.innerHTML =
    `<option value="">Todos clubes</option>` +
    clubNames.map((n) => `<option value="${escapeAttr(n)}">${escapeHtml(n)}</option>`).join("");

  els.createClub.innerHTML = clubNames
    .map((n) => `<option value="${escapeAttr(n)}">${escapeHtml(n)}</option>`)
    .join("");
}

function radarSvg(stats) {
  const keys = [
    ["PAC", stats.pace],
    ["SHO", stats.shooting],
    ["PAS", stats.passing],
    ["DRI", stats.dribbling],
    ["DEF", stats.defending],
    ["PHY", stats.physical],
  ];
  const cx = 140;
  const cy = 140;
  const maxR = 100;
  const n = keys.length;

  const points = keys.map(([, v], i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const r = (v / 99) * maxR;
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];
  });

  const grid = [0.33, 0.66, 1]
    .map((scale) => {
      const pts = Array.from({ length: n }, (_, i) => {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
        return `${cx + Math.cos(angle) * maxR * scale},${cy + Math.sin(angle) * maxR * scale}`;
      }).join(" ");
      return `<polygon points="${pts}" fill="none" stroke="rgba(197,205,216,0.12)" stroke-width="1"/>`;
    })
    .join("");

  const axes = keys
    .map((_, i) => {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      const x = cx + Math.cos(angle) * maxR;
      const y = cy + Math.sin(angle) * maxR;
      return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="rgba(197,205,216,0.1)" stroke-width="1"/>`;
    })
    .join("");

  const labels = keys
    .map(([label], i) => {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      const x = cx + Math.cos(angle) * (maxR + 22);
      const y = cy + Math.sin(angle) * (maxR + 22);
      return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" fill="#8b97a8" font-size="11" font-family="Sora,sans-serif" font-weight="600">${label}</text>`;
    })
    .join("");

  const poly = points.map(([x, y]) => `${x},${y}`).join(" ");

  return `
    <svg viewBox="0 0 280 280" role="img" aria-label="Radar de atributos">
      ${grid}${axes}
      <polygon points="${poly}" fill="rgba(201,162,39,0.22)" stroke="#e8c872" stroke-width="2"/>
      ${points.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#e8c872"/>`).join("")}
      ${labels}
    </svg>
  `;
}

function openDrawer(player) {
  selectedPlayer = player;
  const s = player.statistics;

  els.drawerContent.innerHTML = `
    <div class="drawer-player-head">
      <div class="drawer-ovr">${s.overall}</div>
      <div>
        <h2 id="drawer-title">${escapeHtml(player.name)}</h2>
        <p>${escapeHtml(player.position)} · ${escapeHtml(player.club)} · ${escapeHtml(player.nationality)}</p>
      </div>
    </div>
    <div class="radar-wrap">${radarSvg(s)}</div>
    <div class="stat-bars">
      ${statBar("PAC", s.pace)}
      ${statBar("SHO", s.shooting)}
      ${statBar("PAS", s.passing)}
      ${statBar("DRI", s.dribbling)}
      ${statBar("DEF", s.defending)}
      ${statBar("PHY", s.physical)}
    </div>
    <div class="drawer-actions">
      <button type="button" class="btn btn-ghost" id="btn-edit-stats">Editar stats</button>
      <button type="button" class="btn btn-danger" id="btn-delete">Remover</button>
    </div>
    <form class="edit-stats form" id="edit-form">
      <div class="stats-inputs">
        <label>OVR<input type="number" name="overall" min="1" max="99" value="${s.overall}" required /></label>
        <label>PAC<input type="number" name="pace" min="1" max="99" value="${s.pace}" required /></label>
        <label>SHO<input type="number" name="shooting" min="1" max="99" value="${s.shooting}" required /></label>
        <label>PAS<input type="number" name="passing" min="1" max="99" value="${s.passing}" required /></label>
        <label>DRI<input type="number" name="dribbling" min="1" max="99" value="${s.dribbling}" required /></label>
        <label>DEF<input type="number" name="defending" min="1" max="99" value="${s.defending}" required /></label>
        <label>PHY<input type="number" name="physical" min="1" max="99" value="${s.physical}" required /></label>
      </div>
      <button type="submit" class="btn btn-primary btn-full" style="margin-top:1rem">Salvar estatísticas</button>
    </form>
  `;

  els.drawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  requestAnimationFrame(() => {
    els.drawerContent.querySelectorAll(".bar-fill").forEach((bar) => {
      bar.style.width = bar.dataset.width;
    });
  });

  document.getElementById("btn-edit-stats")?.addEventListener("click", () => {
    document.getElementById("edit-form")?.classList.toggle("open");
  });

  document.getElementById("btn-delete")?.addEventListener("click", () => deletePlayer(player.id));
  document.getElementById("edit-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    updateStats(player.id, new FormData(e.target));
  });
}

function statBar(label, value) {
  return `
    <div class="stat-bar-row">
      <span>${label}</span>
      <div class="bar-track"><div class="bar-fill" data-width="${value}%"></div></div>
      <strong style="color:${statColor(value)}">${value}</strong>
    </div>
  `;
}

function closeDrawer() {
  els.drawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  selectedPlayer = null;
}

function openModal() {
  els.createModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  els.createModal.setAttribute("aria-hidden", "true");
  if (els.drawer.getAttribute("aria-hidden") === "true") {
    document.body.style.overflow = "";
  }
}

async function loadData() {
  try {
    const [playersData, clubsData] = await Promise.all([
      api("/players"),
      api("/clubs"),
    ]);
    players = Array.isArray(playersData) ? playersData : [];
    clubs = Array.isArray(clubsData) ? clubsData : [];
    fillClubSelects();
    renderPlayers();
    renderClubs();
  } catch (err) {
    toast(err.message || "Falha ao carregar dados", "error");
    els.grid.innerHTML = "";
    els.empty.textContent = "Não foi possível conectar à API. Verifique se o servidor está rodando.";
    els.empty.classList.remove("hidden");
  }
}

async function createPlayer(formData) {
  const nextId = players.reduce((max, p) => Math.max(max, p.id), 0) + 1;
  const body = {
    id: nextId,
    name: String(formData.get("name")).trim(),
    club: String(formData.get("club")),
    nationality: String(formData.get("nationality")).trim(),
    position: String(formData.get("position")),
    statistics: {
      overall: Number(formData.get("overall")),
      pace: Number(formData.get("pace")),
      shooting: Number(formData.get("shooting")),
      passing: Number(formData.get("passing")),
      dribbling: Number(formData.get("dribbling")),
      defending: Number(formData.get("defending")),
      physical: Number(formData.get("physical")),
    },
  };

  await api("/players", { method: "POST", body: JSON.stringify(body) });
  toast("Jogador adicionado ao elenco");
  els.createForm.reset();
  closeModal();
  await loadData();
}

async function updateStats(id, formData) {
  const statistics = {
    overall: Number(formData.get("overall")),
    pace: Number(formData.get("pace")),
    shooting: Number(formData.get("shooting")),
    passing: Number(formData.get("passing")),
    dribbling: Number(formData.get("dribbling")),
    defending: Number(formData.get("defending")),
    physical: Number(formData.get("physical")),
  };

  try {
    const updated = await api(`/players/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ statistics }),
    });

    if (updated && updated.id) {
      players = players.map((p) => (p.id === id ? updated : p));
      toast("Estatísticas atualizadas");
      renderPlayers();
      openDrawer(updated);
    } else {
      // API pode retornar sucesso sem body completo — recarrega
      toast("Estatísticas atualizadas");
      closeDrawer();
      await loadData();
    }
  } catch (err) {
    toast(err.message, "error");
  }
}

async function deletePlayer(id) {
  if (!confirm("Remover este jogador do elenco?")) return;
  try {
    await api(`/players/${id}`, { method: "DELETE" });
    toast("Jogador removido");
    closeDrawer();
    await loadData();
  } catch (err) {
    toast(err.message, "error");
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/'/g, "&#39;");
}

/* Events */
els.grid.addEventListener("click", (e) => {
  const card = e.target.closest(".player-card");
  if (!card) return;
  const player = players.find((p) => p.id === Number(card.dataset.id));
  if (player) openDrawer(player);
});

els.grid.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const card = e.target.closest(".player-card");
  if (!card) return;
  e.preventDefault();
  const player = players.find((p) => p.id === Number(card.dataset.id));
  if (player) openDrawer(player);
});

els.search.addEventListener("input", renderPlayers);
els.filterPos.addEventListener("change", renderPlayers);
els.filterClub.addEventListener("change", renderPlayers);

els.openCreate.addEventListener("click", openModal);

els.drawer.querySelectorAll("[data-close]").forEach((el) => {
  el.addEventListener("click", closeDrawer);
});

els.createModal.querySelectorAll("[data-close-modal]").forEach((el) => {
  el.addEventListener("click", closeModal);
});

els.createForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    await createPlayer(new FormData(els.createForm));
  } catch (err) {
    toast(err.message, "error");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeDrawer();
    closeModal();
  }
});

/* Reveal on scroll */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("in-view");
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".section").forEach((section) => observer.observe(section));

loadData();
