/* =====================================================================
   NATURAL SELECTION LAB BLOCKS (no need to edit)
   natsel  : a population of 30 island lizards. Each is BORN with a toepad
             size (1–9). Send hurricanes (or calm years), watch who survives,
             let survivors reproduce (offspring inherit toepad size, with small
             random variation), and record the data each generation.
             Options: { env:"hurricane"|"calm", gens:5, compare:"hurricane", max }
   nsgraph : students build a line graph of the average toepad size per
             generation by tapping points, choose axis labels, and check it.
             Options: { src:"hurricane", title }
   Fast test hook: window.NS_FAST = 1 (skips the animation time).
   ===================================================================== */
(window.CC_EXTS = window.CC_EXTS || []).push(function (BT, H) {
  const { $, $$ } = H;
  const N = 30, MIN = 1, MAX = 9;

  if (!document.getElementById("ns-css")) {
    const css = document.createElement("style"); css.id = "ns-css";
    css.textContent = `
    .ns{box-sizing:border-box;max-width:100%;overflow-x:auto;border:3px solid var(--line);border-radius:22px;padding:14px 16px;background:var(--surface)}
    .ns h4{margin:0 0 6px}
    .ns-scene{width:100%;max-width:760px;margin:0 auto;height:auto;display:block;border-radius:16px;background:linear-gradient(#bfe6ff,#e8f7ff 70%,#f3e9c8)}
    .ns-scene.calm{background:linear-gradient(#ffe9a8,#fff6d8 70%,#f3e9c8)}
    .ns-liz{transition:transform 1.1s ease-in,opacity 1.1s ease-in;transform-box:fill-box;transform-origin:center}
    .ns-liz.gone{transform:translate(320px,-60px) rotate(200deg);opacity:0}
    .ns-liz.safe circle.ring{stroke:#f2b705;stroke-width:3;fill:none}
    .ns-liz.born{animation:nsborn .6s ease-out both}
    @keyframes nsborn{from{opacity:0;transform:scale(.3)}to{opacity:1;transform:scale(1)}}
    .ns-wind line{stroke:#fff;stroke-width:3;stroke-linecap:round;opacity:.9;animation:nswind .5s linear infinite}
    @keyframes nswind{from{transform:translateX(-80px)}to{transform:translateX(80px)}}
    .ns-grid{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:14px;align-items:start;margin-top:10px}
    @media (max-width:860px){.ns-grid{grid-template-columns:1fr}}
    .ns-stats{border:2px solid var(--line);border-radius:14px;padding:10px 12px;background:var(--soft);font-weight:700;display:grid;gap:4px}
    .ns-stats b.big{font:700 1.3rem var(--display)}
    .ns-stats .hl{color:#1d7a45}
    .ns-tbl{width:100%;border-collapse:collapse;font-size:.88rem;table-layout:fixed}
    .ns-tbl th{word-break:break-word}
    .ns-tbl th,.ns-tbl td{border:1px solid var(--line);padding:5px;text-align:center}
    .ns-tbl th{background:var(--soft)}
    .ns-tbl input{width:70px;max-width:100%;font:inherit;font-weight:700;text-align:center;border:2px solid var(--line);border-radius:8px;padding:3px}
    .ns-tbl td.ok{background:color-mix(in srgb,var(--ok) 16%,transparent)} .ns-tbl td.no{background:color-mix(in srgb,var(--bad) 14%,transparent)}
    .ns-tbl tr.now td{outline:2px solid var(--lc);outline-offset:-2px}
    .ns-cmp{max-width:560px;margin:0 auto}
    .ns-hist,.ns-cmp,.ns-plot{width:100%;height:auto;display:block;background:var(--surface);border:2px solid var(--line);border-radius:14px}
    .ns-plot{cursor:crosshair;touch-action:manipulation}
    .ns-cap{font-size:.85rem;color:var(--muted);margin:4px 0 0}
    .ns-key{display:flex;flex-wrap:wrap;gap:10px;font-size:.82rem;font-weight:700;margin-top:6px}
    .ns-key span{display:inline-flex;align-items:center;gap:4px}
    .ns-key i{width:14px;height:14px;border-radius:4px;display:inline-block}
    .ns-ax{display:flex;flex-wrap:wrap;gap:10px;margin:8px 0}
    .ns-ax label{display:grid;gap:3px;font-weight:800;font-size:.85rem}
    .ns-ax select{font:inherit;font-weight:700;padding:5px 8px;border-radius:10px;border:2px solid var(--line);background:var(--surface);color:var(--fg)}
    .ns-gens{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}
    .ns-gens button{border:2px solid var(--line);border-radius:999px;background:var(--surface);font:inherit;font-weight:800;font-size:.85rem;padding:4px 10px;cursor:pointer}
    .ns-gens button.on{border-color:var(--lc);background:color-mix(in srgb,var(--lc) 15%,var(--surface))}
    .ns-gens button.set{border-color:#1d7a45}
    .fl-txt{min-width:0}.fl-txt select{max-width:100%;white-space:normal}
    .ns-msg{min-height:1.3em;font-weight:800;margin:8px 0 0}`;
    document.head.appendChild(css);
  }

  /* ---------- small seeded random number generator ---------- */
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const avg = a => a.reduce((s, x) => s + x, 0) / (a.length || 1);
  const r1 = x => Math.round(x * 10) / 10;
  const f1 = x => r1(x).toFixed(1);
  /* starting population: same spread for every student (mean ≈ 4.4) */
  const START = [1, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 8];
  function startPop(seed) { const R = rng(seed), p = START.slice(); for (let i = p.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; } return p; }

  /* one generation: who survives, then survivors' offspring become the next 30 lizards */
  function step(pop, env, seed) {
    for (let tryN = 0; tryN < 60; tryN++) {
      const R = rng(seed * 31 + tryN * 7919 + 17);
      const surv = pop.map(t => R() < (env === "hurricane" ? 0.12 + 0.08 * (t - 1) : 0.45) ? 1 : 0);
      const sp = pop.filter((t, i) => surv[i]);
      if (sp.length < 6 || sp.length > 24) continue;
      const diff = avg(sp) - avg(pop);
      if (env === "hurricane" && diff < 0.3) continue;
      if (env !== "hurricane" && Math.abs(diff) > 0.3) continue;
      const kids = [];
      for (let k = 0; k < N; k++) { const par = sp[Math.floor(R() * sp.length)], d = [-1, 0, 0, 0, 0, 1][Math.floor(R() * 6)]; kids.push(Math.max(MIN, Math.min(MAX, par + d))); }
      if (Math.abs(avg(kids) - avg(sp)) > 0.3) continue;   /* offspring resemble their parents */
      if (env !== "hurricane" && (Math.abs(avg(kids) - avg(pop)) > 0.3 || Math.abs(avg(kids) - avg(START)) > 0.35)) continue;
      if (env === "hurricane" && avg(kids) - avg(pop) < 0.15) continue;
      return { surv, kids };
    }
    /* fallback (practically never used) */
    const order = pop.map((t, i) => [t, i]).sort((a, b) => b[0] - a[0]), surv = pop.map(() => 0);
    order.slice(0, 12).forEach(([, i]) => surv[i] = 1);
    return { surv, kids: pop.map(t => env === "hurricane" ? Math.min(MAX, t + 1) : t) };
  }

  /* ---------- drawing ---------- */
  const POS = (i) => { const row = Math.floor(i / 10), col = i % 10; return [52 + col * 61 + (row % 2 ? 18 : 0), 78 + row * 82]; };
  const colOf = t => `hsl(${95 + t * 4},${45 + t * 3}%,${74 - t * 5}%)`;
  function lizard(t, i, cls) {
    const [x, y] = POS(i), r = 1.3 + 0.42 * t;
    return `<g class="ns-liz ${cls || ""}" data-i="${i}"><g transform="translate(${x} ${y})">
      <path d="M-12 0 Q-28 2 -34 9" stroke="${colOf(t)}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <line x1="8" y1="0" x2="12" y2="-8" stroke="#3d5a2a" stroke-width="2"/><line x1="8" y1="0" x2="12" y2="8" stroke="#3d5a2a" stroke-width="2"/>
      <line x1="-8" y1="0" x2="-12" y2="-8" stroke="#3d5a2a" stroke-width="2"/><line x1="-8" y1="0" x2="-12" y2="8" stroke="#3d5a2a" stroke-width="2"/>
      <circle cx="12" cy="-8" r="${r}" fill="#7a4b2a"/><circle cx="12" cy="8" r="${r}" fill="#7a4b2a"/><circle cx="-12" cy="-8" r="${r}" fill="#7a4b2a"/><circle cx="-12" cy="8" r="${r}" fill="#7a4b2a"/>
      <ellipse cx="0" cy="0" rx="13" ry="5" fill="${colOf(t)}" stroke="#3d5a2a" stroke-width="1.2"/>
      <ellipse cx="16" cy="0" rx="6" ry="4" fill="${colOf(t)}" stroke="#3d5a2a" stroke-width="1.2"/><circle cx="18" cy="-1.5" r="1" fill="#222"/>
      <circle class="ring" cx="0" cy="0" r="22" fill="none"/>
      <text x="0" y="26" text-anchor="middle" font-size="11" font-weight="800" fill="#333">${t}</text></g></g>`;
  }
  function scene(pop, env, extra, cls) {
    const br = [0, 1, 2].map(r => `<rect x="20" y="${78 + r * 82 - 3}" width="640" height="7" rx="3" fill="#8a6a43"/>`).join("");
    return `<svg class="ns-scene ${env === "calm" ? "calm" : ""}" viewBox="0 0 680 270" role="img" aria-label="Thirty lizards on three branches. Each number is that lizard's toepad size, from 1 (small) to 9 (large).">
      <rect x="0" y="0" width="16" height="270" fill="#7a5a33"/>${br}${pop.map((t, i) => lizard(t, i, cls ? cls(i) : "")).join("")}${extra || ""}</svg>`;
  }
  function hist(a, b, la, lb) {
    const W = 340, Hh = 170, cnt = p => { const c = Array(9).fill(0); p.forEach(t => c[t - 1]++); return c; }, A = cnt(a), B = b ? cnt(b) : null;
    const m = Math.max(4, ...A, ...(B || [])), bw = (W - 50) / 9, sy = v => Hh - 30 - v / m * (Hh - 50);
    let g = `<line x1="36" y1="${Hh - 30}" x2="${W - 8}" y2="${Hh - 30}" stroke="#666"/><line x1="36" y1="14" x2="36" y2="${Hh - 30}" stroke="#666"/>`;
    for (let v = 0; v <= m; v += Math.ceil(m / 4)) g += `<text x="30" y="${sy(v) + 4}" font-size="10" text-anchor="end" fill="#666">${v}</text><line x1="36" x2="${W - 8}" y1="${sy(v)}" y2="${sy(v)}" stroke="#ddd"/>`;
    for (let k = 0; k < 9; k++) { const x = 40 + k * bw;
      g += `<rect x="${x + 2}" y="${sy(A[k])}" width="${B ? bw / 2 - 3 : bw - 6}" height="${Hh - 30 - sy(A[k])}" fill="#9ab8d8"/>`;
      if (B) g += `<rect x="${x + bw / 2}" y="${sy(B[k])}" width="${bw / 2 - 3}" height="${Hh - 30 - sy(B[k])}" fill="#1aa36f"/>`;
      g += `<text x="${x + bw / 2}" y="${Hh - 16}" font-size="11" text-anchor="middle" fill="#333">${k + 1}</text>`; }
    g += `<text x="${(W + 36) / 2}" y="${Hh - 2}" font-size="11" text-anchor="middle" fill="#333" font-weight="700">Toepad size</text><text transform="translate(11 ${Hh / 2 - 10}) rotate(-90)" font-size="11" text-anchor="middle" fill="#333" font-weight="700">Number of lizards</text>`;
    return `<svg class="ns-hist" viewBox="0 0 ${W} ${Hh}" role="img" aria-label="Histogram of toepad sizes">${g}</svg><div class="ns-key"><span><i style="background:#9ab8d8"></i>${la}</span>${B ? `<span><i style="background:#1aa36f"></i>${lb}</span>` : ""}</div>`;
  }
  function lines(series, gens) {
    const W = 360, Hh = 220, sx = g => 46 + g * (W - 66) / gens, sy = v => Hh - 34 - (v - 1) / 8 * (Hh - 54);
    let g = "";
    for (let v = 1; v <= 9; v++) g += `<line x1="46" x2="${W - 16}" y1="${sy(v)}" y2="${sy(v)}" stroke="#e3e3e3"/><text x="40" y="${sy(v) + 4}" font-size="10" text-anchor="end" fill="#555">${v}</text>`;
    for (let k = 0; k <= gens; k++) g += `<text x="${sx(k)}" y="${Hh - 18}" font-size="10" text-anchor="middle" fill="#555">${k}</text>`;
    g += `<line x1="46" y1="${Hh - 34}" x2="${W - 16}" y2="${Hh - 34}" stroke="#555"/><line x1="46" y1="14" x2="46" y2="${Hh - 34}" stroke="#555"/>
      <text x="${(W + 30) / 2}" y="${Hh - 3}" font-size="11" text-anchor="middle" font-weight="700" fill="#333">Generation</text><text transform="translate(12 ${Hh / 2 - 12}) rotate(-90)" font-size="11" text-anchor="middle" font-weight="700" fill="#333">Average toepad size</text>`;
    series.forEach(s => { if (!s.v.length) return; g += `<polyline fill="none" stroke="${s.c}" stroke-width="3" points="${s.v.map((v, k) => `${sx(k)},${sy(v)}`).join(" ")}"/>` + s.v.map((v, k) => `<circle cx="${sx(k)}" cy="${sy(v)}" r="4.5" fill="${s.c}"/>`).join(""); });
    return `<svg class="ns-cmp" viewBox="0 0 ${W} ${Hh}" role="img" aria-label="Line graph of average toepad size by generation">${g}</svg><div class="ns-key">${series.map(s => `<span><i style="background:${s.c}"></i>${s.l}</span>`).join("")}</div>`;
  }

  /* find another natsel block's state (for comparisons and graphing) */
  function findLab(ctx, env) {
    let out = null;
    ctx.L.stations.forEach((s, i) => s.blocks.forEach((b, j) => { if (b.t === "natsel" && (b.env || "hurricane") === env) out = { b, st: ctx.S.b[i + "-" + j] || {} }; }));
    return out;
  }
  const ensure = (st, b) => { if (!st.seed) st.seed = 1 + Math.floor(Math.random() * 1e9); if (!st.gens || !st.gens.length) st.gens = [{ pop: startPop(st.seed) }]; st.rec = st.rec || { a: {}, s: {} }; };
  const avgs = st => (st.gens || []).map(g => r1(avg(g.pop)));

  BT.natsel = {
    html(b, st, ctx) {
      ensure(st, b);
      const env = b.env || "hurricane", G = b.gens || 5, g = st.gens.length - 1, cur = st.gens[g], done = g >= G, chk = !!st.checked, rec = st.rec;
      const prev = g > 0 ? st.gens[g - 1] : null, sp = prev ? prev.pop.filter((t, i) => prev.surv[i]) : null;
      const act = env === "hurricane" ? "🌀 Send a hurricane" : "☀️ Run a calm year (no hurricane)";
      let h = `<div class="ns"><h4>${env === "hurricane" ? "🌀" : "☀️"} ${b.title}</h4>${b.how ? `<p class="mu">${b.how}</p>` : ""}
        <div class="ns-scenebox">${scene(cur.pop, env)}</div>
        <p class="ns-cap">Each lizard was <b>born</b> with its toepad size (the number under it, 1 = small, 9 = large). Bigger brown circles = bigger toepads.</p>
        <div class="ns-grid"><div>
          <div class="ns-stats"><span>Generation <b class="big">${g}</b> of ${G} · 30 lizards</span>
            <span>Average toepad size of this generation: <b class="big hl">${f1(avg(cur.pop))}</b></span>
            ${prev ? `<span>Last ${env === "hurricane" ? "hurricane" : "year"}: <b>${sp.length} of 30</b> survived. Survivors’ average toepad size: <b>${f1(avg(sp))}</b> (the whole generation’s was ${f1(avg(prev.pop))}).</span>` : `<span>No ${env === "hurricane" ? "hurricanes" : "years"} yet. Look at the variation: the lizards were born different.</span>`}
          </div>
          <div class="btnrow" style="margin-top:8px"><button class="btn" data-nsgo ${done ? "disabled" : ""}>${done ? `✅ All ${G} generations done` : act}</button>
            <button class="btn ghost" data-nsreset>↺ Reset the lab</button></div>
          <p class="ns-msg" aria-live="polite">${st.msg || (done ? "Done! Check your data table." : "First record the average for this generation in the table, then continue.")}</p>
        </div><div>${hist(st.gens[0].pop, g ? cur.pop : null, "Generation 0 (start)", `Generation ${g} (now)`)}</div></div>
        <table class="ns-tbl"><thead><tr><th>Generation</th><th>Average toepad size<br><small>(type it from the panel)</small></th><th>Survived the ${env === "hurricane" ? "hurricane" : "year"} that followed<br><small>(out of 30)</small></th></tr></thead><tbody>`;
      for (let k = 0; k <= G; k++) {
        const have = k <= g, A = have ? r1(avg(st.gens[k].pop)) : null, Sv = k < g ? st.gens[k].surv.reduce((s, x) => s + x, 0) : null;
        const va = rec.a[k] ?? "", vs = rec.s[k] ?? "", okA = have && Math.abs(parseFloat(va) - A) <= 0.11, okS = Sv != null && +vs === Sv;
        h += `<tr class="${k === g && !done ? "now" : ""}"><td><b>${k}</b>${k === 0 ? " (start)" : ""}</td>
          <td class="${chk ? (okA ? "ok" : "no") : ""}">${have ? `<input data-ra="${k}" inputmode="decimal" value="${va}" ${chk ? "disabled" : ""} aria-label="Average toepad size, generation ${k}">` : "·"}</td>
          <td class="${chk && k < G ? (okS ? "ok" : "no") : ""}">${k === G ? "—" : k < g ? `<input data-rs="${k}" inputmode="numeric" value="${vs}" ${chk ? "disabled" : ""} aria-label="Survivors after generation ${k}">` : "·"}</td></tr>`;
      }
      h += `</tbody></table>`;
      if (done) h += chk ? `<p class="score">Data recorded correctly: <b>${BT.natsel.right(b, st)} / ${BT.natsel.total(b)}</b>. Green = matches the lab.</p>${BT.natsel.right(b, st) < BT.natsel.total(b) ? `<div class="btnrow"><button class="btn ghost" data-nsfix>✏️ Fix my red boxes</button></div>` : ""}`
        : `<div class="btnrow"><button class="btn" data-nscheck>Check my data table</button><span class="msg"></span></div>`;
      if (b.compare && done) { const o = findLab(ctx, b.compare);
        const ov = o && o.st.gens ? avgs(o.st) : [];
        h += `<h4 style="margin-top:14px">Compare the two environments</h4>${lines([{ v: ov, c: "#2b7de9", l: "With hurricanes (your Station 4 lab)" }, { v: avgs(st), c: "#e08a00", l: "No hurricanes (this lab)" }], G)}${ov.length < 2 ? `<p class="ns-cap">Finish the hurricane lab to see its line here.</p>` : ""}`; }
      return h + `</div>`;
    },
    total(b) { const G = b.gens || 5; return (G + 1) + G; },
    right(b, st) { let n = 0; const G = b.gens || 5; (st.gens || []).forEach((gn, k) => { if (Math.abs(parseFloat((st.rec.a || {})[k]) - r1(avg(gn.pop))) <= 0.11) n++; if (k < G && gn.surv && +((st.rec.s || {})[k]) === gn.surv.reduce((s, x) => s + x, 0) && (st.rec.s || {})[k] !== "") n++; }); return n; },
    wire(root, b, st, save, redraw) {
      ensure(st, b);
      const env = b.env || "hurricane", G = b.gens || 5;
      const gate = () => { const g = st.gens.length - 1, go = $("[data-nsgo]", root); if (!go || g >= G) return true;
        const need = (st.rec.a[g] ?? "") !== "" && (g === 0 || (st.rec.s[g - 1] ?? "") !== "");
        go.disabled = !need || !!window.__nsRunning; const m = $(".ns-msg", root);
        if (m && !window.__nsRunning) m.textContent = need ? (env === "hurricane" ? "Ready! Send the next hurricane." : "Ready! Run the next year.") : g === 0 ? "First type the average toepad size for Generation 0 in the table." : `Record Generation ${g}’s average AND how many survived the last ${env === "hurricane" ? "hurricane" : "year"} before continuing.`;
        return need; };
      $$("[data-ra]", root).forEach(x => x.oninput = () => { st.rec.a[x.dataset.ra] = x.value.trim(); save(); gate(); });
      $$("[data-rs]", root).forEach(x => x.oninput = () => { st.rec.s[x.dataset.rs] = x.value.trim(); save(); gate(); });
      gate(); window.__nsGate = gate;
      const go = $("[data-nsgo]", root);
      if (go) go.onclick = () => {
        const g = st.gens.length - 1; if (g >= G || !gate()) return;
        const cur = st.gens[g], res = step(cur.pop, env, st.seed + g * 101);
        cur.surv = res.surv; st.gens.push({ pop: res.kids }); st.msg = ""; save();   /* the result is saved first, so leaving mid-animation never locks the lab */
        window.__nsRunning = true; go.disabled = true;
        const T = window.NS_FAST ? 30 : 1;
        const svg = $(".ns-scene", root);
        if (env === "hurricane") svg.insertAdjacentHTML("beforeend", `<g class="ns-wind">${[40, 95, 150, 205, 250].map((y, k) => `<line x1="${60 + k * 90}" y1="${y}" x2="${130 + k * 90}" y2="${y}" style="animation-delay:${k * .1}s"/>`).join("")}</g>`);
        const m = $(".ns-msg", root); if (m) m.textContent = env === "hurricane" ? "🌀 Hurricane winds! Can each lizard hold on?" : "☀️ A normal year: some lizards die from other causes (old age, predators, bad luck).";
        setTimeout(() => {
          $$(".ns-liz", root).forEach(el => el.classList.add(res.surv[+el.dataset.i] ? "safe" : "gone"));
          setTimeout(() => {
            const n = res.surv.reduce((s, x) => s + x, 0); if (m) m.textContent = `${n} survived. Now the survivors reproduce: their babies inherit toepad sizes like their parents’.`;
            setTimeout(() => { window.__nsRunning = false; if (root.isConnected) redraw(); else if (window.__nsGate) window.__nsGate(); }, 1100 / T);
          }, 1300 / T);
        }, 700 / T);
      };
      const rs = $("[data-nsreset]", root);
      if (rs) rs.onclick = () => {
        if (!rs.dataset.sure) { rs.dataset.sure = "1"; rs.textContent = "⚠️ Tap again to reset"; setTimeout(() => { if (rs.isConnected) { delete rs.dataset.sure; rs.textContent = "↺ Reset the lab"; } }, 4000); return; }
        window.__nsRunning = false; st.seed = 1 + Math.floor(Math.random() * 1e9); st.gens = [{ pop: startPop(st.seed) }]; st.rec = { a: {}, s: {} }; st.checked = false; st.msg = "Lab reset. A new population was born. Record Generation 0 to start."; save(); redraw(); };
      const c = $("[data-nscheck]", root);
      if (c) c.onclick = () => { const miss = st.gens.some((gn, k) => (st.rec.a[k] ?? "") === "" || (k < G && (st.rec.s[k] ?? "") === "")); if (miss) { $(".msg", root).textContent = "Fill in every box first."; return; } st.checked = true; save(); redraw(); };
      const fx = $("[data-nsfix]", root); if (fx) fx.onclick = () => { st.checked = false; save(); redraw(); };
    },
    score(b, st) { const G = b.gens || 5, max = b.max || 6, done = st.gens && st.gens.length - 1 >= G; if (!done) return { max, pts: 0, label: b.label || "lab data" };
      return { max, pts: 2 + (st.checked ? Math.round((max - 2) * BT.natsel.right(b, st) / BT.natsel.total(b)) : 0), label: b.label || "lab data" }; },
    text(b, st) { return "Averages by generation: " + avgs(st).join(", ") + " | recorded: " + Object.values((st.rec || {}).a || {}).join(", "); }
  };

  /* ---------- build-a-graph ---------- */
  const XL = ["Generation", "Toepad size", "Number of lizards", "Hurricane wind speed"], YL = ["Average toepad size", "Generation", "Number of hurricanes", "Lizard color"];
  BT.nsgraph = {
    html(b, st, ctx) {
      const o = findLab(ctx, b.src || "hurricane"), G = o ? (o.b.gens || 5) : 5, A = o && o.st.gens ? avgs(o.st) : [];
      if (A.length < G + 1) return `<div class="ns"><h4>${b.title}</h4><p class="callout">Finish all ${G} generations of the Hurricane Lab (the station before this one) first. Then your data will appear here.</p></div>`;
      const pts = st.pts || {}, chk = !!st.checked, sel = st.sel ?? Math.min(G, Object.keys(pts).length);
      const W = 420, Hh = 290, sx = g => 56 + g * (W - 80) / G, sy = v => Hh - 44 - (v - 1) / 8 * (Hh - 64);
      let g = `<rect x="0" y="0" width="${W}" height="${Hh}" fill="transparent"/>`;
      for (let v = 1; v <= 9; v += 0.5) g += `<line x1="56" x2="${W - 24}" y1="${sy(v)}" y2="${sy(v)}" stroke="${v % 1 ? "#f0f0f0" : "#dcdcdc"}"/>` + (v % 1 ? "" : `<text x="50" y="${sy(v) + 4}" font-size="11" text-anchor="end" fill="#555">${v}</text>`);
      for (let k = 0; k <= G; k++) g += `<line x1="${sx(k)}" x2="${sx(k)}" y1="14" y2="${Hh - 44}" stroke="${k === sel && !chk ? "#8a54e0" : "#ececec"}" stroke-width="${k === sel && !chk ? 2 : 1}"/><text x="${sx(k)}" y="${Hh - 28}" font-size="11" text-anchor="middle" fill="#555">${k}</text>`;
      g += `<line x1="56" y1="${Hh - 44}" x2="${W - 24}" y2="${Hh - 44}" stroke="#333" stroke-width="2"/><line x1="56" y1="14" x2="56" y2="${Hh - 44}" stroke="#333" stroke-width="2"/>`;
      g += `<text x="${(W + 32) / 2}" y="${Hh - 8}" font-size="12" text-anchor="middle" font-weight="800" fill="#333">${st.xl != null ? XL[st.xl] : "x-axis: ?"}</text><text transform="translate(14 ${Hh / 2 - 14}) rotate(-90)" font-size="12" text-anchor="middle" font-weight="800" fill="#333">${st.yl != null ? YL[st.yl] : "y-axis: ?"}</text>`;
      const ks = Object.keys(pts).map(Number).sort((a, b) => a - b);
      if (ks.length > 1) g += `<polyline fill="none" stroke="#2b7de9" stroke-width="3" points="${ks.map(k => `${sx(k)},${sy(pts[k])}`).join(" ")}"/>`;
      ks.forEach(k => { const ok = Math.abs(pts[k] - A[k]) <= 0.31; g += `<circle cx="${sx(k)}" cy="${sy(pts[k])}" r="6" fill="${chk ? (ok ? "#1d7a45" : "#d0453a") : "#2b7de9"}" stroke="#fff" stroke-width="2"/>`; });
      if (chk) g += `<polyline fill="none" stroke="#999" stroke-dasharray="5 4" stroke-width="2" points="${A.map((v, k) => `${sx(k)},${sy(v)}`).join(" ")}"/>`;
      const rec = (o.st.rec || {}).a || {};
      return `<div class="ns"><h4>${b.title}</h4><p class="mu">${b.how || ""}</p>
        <div class="ns-grid"><div><svg class="ns-plot" viewBox="0 0 ${W} ${Hh}" data-plot role="img" aria-label="Your line graph. Tap to place the point for the selected generation.">${g}</svg>
          ${chk ? `<p class="ns-cap">Gray dashed line = the lab’s exact averages.</p>` : ""}</div>
        <div><table class="ns-tbl"><thead><tr><th>Generation</th><th>Average toepad size (your data)</th></tr></thead><tbody>${A.map((v, k) => `<tr><td>${k}</td><td>${rec[k] ?? f1(v)}</td></tr>`).join("")}</tbody></table>
          <div class="ns-ax"><label>x-axis label<select data-ax="x" ${chk ? "disabled" : ""}><option value="">Choose…</option>${XL.map((l, i) => `<option value="${i}" ${st.xl === i ? "selected" : ""}>${l}</option>`).join("")}</select></label>
          <label>y-axis label<select data-ax="y" ${chk ? "disabled" : ""}><option value="">Choose…</option>${YL.map((l, i) => `<option value="${i}" ${st.yl === i ? "selected" : ""}>${l}</option>`).join("")}</select></label></div>
          <p class="small mu" style="margin:4px 0">Plot generation: (tap a number, then tap the graph at the right height)</p>
          <div class="ns-gens">${A.map((v, k) => `<button data-gsel="${k}" class="${k === sel ? "on" : ""} ${pts[k] != null ? "set" : ""}" ${chk ? "disabled" : ""}>${k}${pts[k] != null ? " ✓" : ""}</button>`).join("")}</div>
          <p class="ns-msg">${st.msg || ""}</p></div></div>
        ${chk ? `<p class="score">Points within 0.3 of the data: <b>${BT.nsgraph.ok(b, st, A)} / ${A.length}</b> · Axis labels: <b>${st.xl === 0 && st.yl === 0 ? "✅ correct" : "❌ check them"}</b></p><div class="btnrow"><button class="btn ghost" data-gfix>✏️ Fix my graph</button></div>`
          : `<div class="btnrow"><button class="btn" data-gcheck>Check my graph</button><button class="btn ghost" data-gclear>Clear points</button><span class="msg"></span></div>`}</div>`;
    },
    ok(b, st, A) { const p = st.pts || {}; return A.filter((v, k) => p[k] != null && Math.abs(p[k] - v) <= 0.31).length; },
    wire(root, b, st, save, redraw, ctx) {
      const o = findLab(ctx, b.src || "hurricane"); if (!o || !o.st.gens) return; const G = o.b.gens || 5, A = avgs(o.st); if (A.length < G + 1) return;
      const svg = $("[data-plot]", root);
      $$("[data-gsel]", root).forEach(x => x.onclick = () => { st.sel = +x.dataset.gsel; st.msg = ""; save(); redraw(); });
      $$("[data-ax]", root).forEach(x => x.onchange = () => { st[x.dataset.ax === "x" ? "xl" : "yl"] = x.value === "" ? null : +x.value; save(); redraw(); });
      if (svg && !st.checked) svg.addEventListener("click", e => {
        const r = svg.getBoundingClientRect(), W = 420, Hh = 290, py = (e.clientY - r.top) / r.height * Hh, px = (e.clientX - r.left) / r.width * W;
        const v = Math.round((1 + (Hh - 44 - py) / (Hh - 64) * 8) * 10) / 10; if (v < 0.5 || v > 9.5) return;
        let k = st.sel ?? 0; const near = Math.round((px - 56) / ((W - 80) / G)); if (near >= 0 && near <= G && Math.abs(px - (56 + near * (W - 80) / G)) < 14) k = near;
        st.pts = st.pts || {}; st.pts[k] = Math.max(1, Math.min(9, v)); st.msg = `Generation ${k}: plotted at ${st.pts[k].toFixed(1)}.`;
        const nxt = A.findIndex((_, i) => st.pts[i] == null); st.sel = nxt >= 0 ? nxt : k; save(); redraw(); });
      const c = $("[data-gcheck]", root);
      if (c) c.onclick = () => { if (A.some((_, k) => (st.pts || {})[k] == null) || st.xl == null || st.yl == null) { $(".msg", root).textContent = "Plot every generation and choose both axis labels first."; return; } st.checked = true; save(); redraw(); };
      const cl = $("[data-gclear]", root); if (cl) cl.onclick = () => { st.pts = {}; st.sel = 0; st.msg = ""; save(); redraw(); };
      const fx = $("[data-gfix]", root); if (fx) fx.onclick = () => { st.checked = false; save(); redraw(); };
    },
    score(b, st, ctx) { const o = findLab(ctx, b.src || "hurricane"); const A = o && o.st.gens ? avgs(o.st) : []; if (!st.checked || A.length < 2) return { max: 4, pts: 0, label: "graph" };
      return { max: 4, pts: Math.round(3 * BT.nsgraph.ok(b, st, A) / A.length) + (st.xl === 0 && st.yl === 0 ? 1 : 0), label: "graph" }; },
    text(b, st) { return "Plotted: " + JSON.stringify(st.pts || {}) + ` axes x=${XL[st.xl] || "?"} y=${YL[st.yl] || "?"}`; }
  };
});
