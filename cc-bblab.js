/* =====================================================================
   BROMOTHYMOL BLUE VIRTUAL LAB BLOCKS (no need to edit)
   bblab  : 8 test tubes (Elodea, snails, both, none) in light and dark.
            mode "predict" = choose predicted colors
            mode "run"     = run 24 hours (animated), then record the data
   iogrid : sort inputs and outputs of photosynthesis and cellular respiration
   ===================================================================== */
(window.CC_EXTS = window.CC_EXTS || []).push(function (BT, H) {
  const { $, $$, esc } = H;
  /* Tube results are based on the classic BTB lab: BTB turns YELLOW when CO2 rises (more carbonic acid)
     and BLUE when CO2 is used up. All tubes start GREEN (a little CO2 was bubbled in). */
  const TUBES = [
    { n: 1, who: "BTB only", e: 0, s: 0, light: true, end: 0, ans: ["Green"], co2: "Same" },
    { n: 2, who: "Elodea", e: 1, s: 0, light: true, end: -1, ans: ["Blue"], co2: "Less" },
    { n: 3, who: "Snail", e: 0, s: 1, light: true, end: 1, ans: ["Yellow"], co2: "More" },
    { n: 4, who: "Elodea + Snail", e: 1, s: 1, light: true, end: -0.25, ans: ["Green", "Blue"], co2: "Same" },
    { n: 5, who: "BTB only", e: 0, s: 0, light: false, end: 0, ans: ["Green"], co2: "Same" },
    { n: 6, who: "Elodea", e: 1, s: 0, light: false, end: 0.8, ans: ["Yellow"], co2: "More" },
    { n: 7, who: "Snail", e: 0, s: 1, light: false, end: 1, ans: ["Yellow"], co2: "More" },
    { n: 8, who: "Elodea + Snail", e: 1, s: 1, light: false, end: 1, ans: ["Yellow"], co2: "More" }
  ];
  window.BB_TUBES = TUBES;
  const COLORS = ["Blue", "Green", "Yellow"];
  const mix = (a, b, t) => a.map((x, i) => Math.round(x + (b[i] - x) * t));
  const BLUE = [38, 98, 214], GREEN = [52, 160, 90], YELLOW = [232, 196, 38];
  const rgb = v => { const c = v < 0 ? mix(GREEN, BLUE, -v) : mix(GREEN, YELLOW, v); return `rgb(${c.join(",")})`; };

  if (!document.getElementById("bb-css")) {
    const css = document.createElement("style"); css.id = "bb-css";
    css.textContent = `
    .bb{border:3px solid var(--line);border-radius:22px;padding:14px 16px;background:var(--surface)}
    .bb h4{margin:0 0 6px}
    .bb-legend{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-weight:800;font-size:.9rem;margin:6px 0 12px}
    .bb-scale{flex:1;min-width:220px;height:18px;border-radius:999px;background:linear-gradient(90deg,${rgb(-1)},${rgb(0)},${rgb(1)});border:2px solid rgba(0,0,0,.15)}
    .bb-bench{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .bb-side{border-radius:18px;padding:10px 8px 8px;position:relative;overflow:hidden}
    .bb-side.light{background:linear-gradient(#fff7cf,#fffbe8);border:2px solid #f0d96a}
    .bb-side.dark{background:linear-gradient(#1d1a2b,#2b2740);border:2px solid #3b3552;color:#e9e4ff}
    .bb-side h5{margin:0 0 4px;font:700 1rem var(--display);text-align:center}
    .bb-rack{display:flex;justify-content:space-around;align-items:flex-start}
    .bb-tube{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:.8rem;font-weight:800;text-align:center;width:24%}
    .bb-tube svg{width:min(84px,100%);height:auto}.bb-tube>span{min-height:2.6em;display:flex;align-items:flex-start;justify-content:center}
    .bb-tube select{font:inherit;font-size:.82rem;padding:3px 4px;border-radius:8px;border:2px solid var(--line);background:#fff;color:#1f2430;max-width:100%}
    .bb-ctrl{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:12px 0 4px}
    .bb-clock{font:700 1.2rem var(--display);background:var(--soft);border-radius:999px;padding:6px 14px}
    .bb-table{width:100%;border-collapse:collapse;margin-top:10px;font-size:.92rem}
    .bb-table th,.bb-table td{border:1px solid var(--line);padding:5px 6px;text-align:center}
    .bb-table th{background:var(--soft)}
    .bb-table td.ok{background:color-mix(in srgb,var(--ok) 16%,transparent)} .bb-table td.no{background:color-mix(in srgb,var(--bad) 14%,transparent)}
    .bb-table select{font:inherit;padding:3px;border-radius:8px;border:2px solid var(--line)}
    .bb-sw{display:inline-block;width:14px;height:14px;border-radius:4px;vertical-align:middle;margin-right:4px;border:1px solid rgba(0,0,0,.2)}
    .io-bank{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 12px}
    .io-chip{border:2px solid var(--line);background:var(--surface);border-radius:999px;padding:6px 12px;font-weight:800;cursor:pointer}
    .io-chip.on{border-color:var(--lc);box-shadow:0 0 0 3px color-mix(in srgb,var(--lc) 30%,transparent)}
    .io-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .io-proc{border:3px solid var(--line);border-radius:18px;padding:10px}
    .io-proc h5{margin:0 0 6px;font:700 1.05rem var(--display)}
    .io-proc small{color:var(--muted);font-weight:700}
    .io-cells{display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .io-cell{min-height:92px;border:2px dashed var(--line);border-radius:14px;padding:6px;cursor:pointer;background:var(--soft)}
    .io-cell b{display:block;font-size:.82rem;text-transform:uppercase;letter-spacing:.04em;color:var(--muted)}
    .io-cell .io-chip{font-size:.85rem;padding:3px 9px;margin:3px 3px 0 0;display:inline-block}
    .io-cell.ok{border-color:var(--ok);border-style:solid} .io-cell.no{border-color:var(--bad);border-style:solid}
    @media (max-width:720px){.bb-bench,.io-grid{grid-template-columns:1fr}}`;
    document.head.appendChild(css);
  }

  /* clear, outlined Elodea sprig and snail drawn on top of the liquid */
  function elodea(x, top, bottom, w) { w = w || 9;
    let g = `<path d="M${x} ${bottom} C ${x - 4} ${bottom - 40}, ${x + 5} ${bottom - 80}, ${x} ${top}" stroke="#14532d" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M${x} ${bottom} C ${x - 4} ${bottom - 40}, ${x + 5} ${bottom - 80}, ${x} ${top}" stroke="#3fb24f" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    for (let y = top + 6; y < bottom - 6; y += 13) {
      [-1, 1].forEach((d, i) => { const lx = x + d * w, ly = y + (i ? 3 : 0), rot = d * (25 + (y % 3) * 5);
        g += `<ellipse cx="${lx}" cy="${ly}" rx="${w}" ry="3.6" fill="#4cc35c" stroke="#14532d" stroke-width="1.4" transform="rotate(${rot} ${lx} ${ly})"/>`; });
      g += `<ellipse cx="${x}" cy="${y - 4}" rx="3.2" ry="6.5" fill="#4cc35c" stroke="#14532d" stroke-width="1.3"/>`;
    }
    return g;
  }
  function snail(x, y) {
    return `<g transform="translate(${x} ${y}) scale(.88)">
      <path d="M-2 14 Q14 18 34 14 Q38 13 37 9 Q30 8 26 6 L4 6 Q-4 6 -2 14z" fill="#e7c39a" stroke="#5b3a1e" stroke-width="2"/>
      <path d="M31 8 L36 -4 M35 8 L42 -2" stroke="#5b3a1e" stroke-width="2.2" stroke-linecap="round"/><circle cx="36" cy="-5" r="2.4" fill="#2b1a0e"/><circle cx="42.5" cy="-3" r="2.4" fill="#2b1a0e"/>
      <circle cx="15" cy="2" r="12" fill="#d08a3c" stroke="#5b3a1e" stroke-width="2.2"/>
      <path d="M15 2 m0 -7.5 a7.5 7.5 0 1 1 -7.2 9.2 a5 5 0 1 1 6.6 -5.2 a2.6 2.6 0 1 1 -2.2 3.6" fill="none" stroke="#5b3a1e" stroke-width="1.8" stroke-linecap="round"/></g>`;
  }
  function tubeSVG(t, v, tt, k) {
    const liquid = rgb(v), lit = t.light, edge = lit ? "#4a4f5e" : "#d9d2f5";
    let life = "";
    if (t.e) {
      const ex = t.s ? 50 : 45;
      life += elodea(ex, 52, 188, t.s ? 7.5 : 9);
      if (lit && tt > 0 && tt < 1) for (let i = 0; i < 6; i++) { const y = 175 - ((k * 45 + i * 24) % 125); life += `<circle cx="${ex + (i % 2 ? 7 : -6)}" cy="${y}" r="3" fill="#fff" stroke="#9fb7c9" stroke-width="1"/>`; }
    }
    if (t.s) { const sy = 184 - Math.min(1, tt) * 40; life += snail(26, sy); }
    return `<svg viewBox="0 0 90 228" role="img" aria-label="Tube ${t.n}: ${t.who}, ${t.light ? "light" : "dark"}">
      <rect x="22" y="2" width="46" height="16" rx="4" fill="#9a8f7a" stroke="#5d5545" stroke-width="2"/>
      <path d="M24 18 V188 a21 21 0 0 0 42 0 V18" fill="#fff" fill-opacity=".9" stroke="none"/>
      <path d="M24 44 V188 a21 21 0 0 0 42 0 V44 Z" fill="${liquid}" fill-opacity=".55"/>
      ${life}
      <path d="M24 18 V188 a21 21 0 0 0 42 0 V18" fill="none" stroke="${edge}" stroke-width="3"/>
      <path d="M30 30 V180" stroke="#fff" stroke-opacity=".55" stroke-width="3.5" stroke-linecap="round"/>
      <text x="45" y="224" text-anchor="middle" font-size="15" font-weight="800" fill="${lit ? "#1f2430" : "#fff"}">#${t.n}</text></svg>`;
  }
  const whoIcons = t => (t.e ? "🌿" : "") + (t.s ? "🐌" : "") || "🧪";

  function predState(ctx) {
    const L = ctx.L, S = ctx.S;
    for (let i = 0; i < L.stations.length; i++) for (let j = 0; j < L.stations[i].blocks.length; j++) { const b = L.stations[i].blocks[j]; if (b.t === "bblab" && b.mode === "predict") return S.b[i + "-" + j] || {}; }
    return {};
  }

  BT.bblab = {
    html(b, st, ctx) {
      if (st.going && !window.__bbRunning) st.going = false; /* a run that was interrupted (page change or reload) must not lock the lab */
      const run = b.mode === "run", tt = st.done ? 1 : (st.tt || 0), hours = Math.round(tt * 24);
      const cur = t => run ? t.end * tt : 0;
      const pred = run ? (predState(ctx).p || {}) : (st.p || {});
      const side = light => `<div class="bb-side ${light ? "light" : "dark"}"><h5>${light ? "☀️ Under the grow light" : "🌑 Inside a dark cabinet"}</h5><div class="bb-rack">${TUBES.filter(t => t.light === light).map(t => `<div class="bb-tube">${tubeSVG(t, cur(t), run ? tt : 0, 0)}<span>${whoIcons(t)} ${t.who}</span>${run ? "" : `<select data-p="${t.n}" aria-label="Prediction for tube ${t.n}"><option value="">Predict…</option>${COLORS.map(c => `<option ${pred[t.n] === c ? "selected" : ""}>${c}</option>`).join("")}</select>`}</div>`).join("")}</div></div>`;
      let h = `<div class="bb"><h4>${b.title || "Bromothymol Blue Lab"}</h4>
        <div class="bb-legend"><span>BTB color key:</span><span>Blue = LESS CO₂</span><span class="bb-scale" aria-hidden="true"></span><span>Yellow = MORE CO₂</span></div>
        <p class="mu small">All 8 tubes start <b style="color:${rgb(0)}">GREEN</b> (a little CO₂ was bubbled in) and are sealed with a stopper.</p>
        <div class="bb-bench">${side(true)}${side(false)}</div>`;
      if (!run) {
        const n = Object.values(pred).filter(Boolean).length;
        h += `<p class="mu small" style="margin-top:10px">Predictions made: <b>${n} of 8</b>. ${n === 8 ? "✅ All set! Explain your thinking below." : "Use the drop-down under each tube."}</p>`;
      } else {
        h += `<div class="bb-ctrl"><button class="btn" data-bbrun ${st.done || st.going ? "disabled" : ""}>${st.done ? "✅ 24 hours complete" : "▶ Start the 24-hour lab"}</button><span class="bb-clock">⏱ ${hours} h</span>${st.done && !st.going ? `<button class="btn ghost" data-bbreset title="Clear the results and run the 24-hour lab again">↺ Reset the lab</button>` : ""}<span class="mu small">${st.done ? "Now record the color of every tube." : "Watch the tubes. Elodea in light gives off tiny bubbles."}</span></div>`;
        if (st.done) {
          const rec = st.r || {}, co = st.c || {}, chk = !!st.checked;
          h += `<table class="bb-table"><thead><tr><th>Tube</th><th>Contents</th><th>Light?</th><th>My prediction</th><th>Start</th><th>End color (observed)</th><th>CO₂ compared to start</th></tr></thead><tbody>` +
            TUBES.map(t => { const ok1 = t.ans.includes(rec[t.n]), ok2 = co[t.n] === t.co2;
              return `<tr><td><b>#${t.n}</b></td><td>${t.who}</td><td>${t.light ? "☀️ Light" : "🌑 Dark"}</td><td>${pred[t.n] ? `<span class="bb-sw" style="background:${rgb({ Blue: -1, Green: 0, Yellow: 1 }[pred[t.n]])}"></span>${pred[t.n]}` : "<span class='mu'>none</span>"}</td><td><span class="bb-sw" style="background:${rgb(0)}"></span>Green</td>
                <td class="${chk ? (ok1 ? "ok" : "no") : ""}"><select data-r="${t.n}" ${chk ? "disabled" : ""}><option value="">Choose…</option>${COLORS.map(c => `<option ${rec[t.n] === c ? "selected" : ""}>${c}</option>`).join("")}</select></td>
                <td class="${chk ? (ok2 ? "ok" : "no") : ""}"><select data-c="${t.n}" ${chk ? "disabled" : ""}><option value="">Choose…</option>${["More", "Less", "Same"].map(c => `<option ${co[t.n] === c ? "selected" : ""}>${c}</option>`).join("")}</select></td></tr>`; }).join("") + `</tbody></table>`;
          h += chk ? `<p class="score">Data recorded correctly: <b>${BT.bblab.score(b, st).pts} / ${BT.bblab.score(b, st).max}</b>. Green cells match the lab. Look closely at any red cells, then use these results in the next stations.</p>`
            : `<div class="btnrow"><button class="btn" data-bbcheck>Check my data table</button><span class="msg"></span></div>`;
          h += `<div class="btnrow" style="margin-top:6px"><button class="btn ghost" data-bbreset>↺ Reset the lab and run it again</button><span class="mu small">Clears the tubes and this data table. Your predictions are kept.</span></div>`;
        }
      }
      return h + "</div>";
    },
    wire(root, b, st, save, redraw, ctx) {
      $$("[data-p]", root).forEach(s => s.onchange = () => { (st.p = st.p || {})[s.dataset.p] = s.value; save(); redraw(); });
      $$("[data-r]", root).forEach(s => s.onchange = () => { (st.r = st.r || {})[s.dataset.r] = s.value; save(); });
      $$("[data-c]", root).forEach(s => s.onchange = () => { (st.c = st.c || {})[s.dataset.c] = s.value; save(); });
      const go = $("[data-bbrun]", root);
      if (go) go.onclick = () => {
        st.going = true; window.__bbRunning = true; const t0 = performance.now(), dur = window.BB_FAST ? 300 : 9000;
        const tubes = $$(".bb-tube svg", root), lightList = TUBES.filter(t => t.light).concat(TUBES.filter(t => !t.light));
        const step = now => {
          if (!root.isConnected) { window.__bbRunning = false; st.going = false; return; }
          const tt = Math.min(1, (now - t0) / dur), k = (now - t0) / 1000;
          tubes.forEach((svg, i) => { const t = lightList[i]; svg.outerHTML = tubeSVG(t, t.end * tt, tt, k); });
          const c = $(".bb-clock", root); if (c) c.textContent = `⏱ ${Math.round(tt * 24)} h`;
          if (tt < 1) { requestAnimationFrame(step); $$(".bb-tube svg", root).forEach((s, i) => tubes[i] = s); }
          else { st.done = true; st.going = false; window.__bbRunning = false; save(); redraw(); }
        };
        go.disabled = true; requestAnimationFrame(step);
      };
      $$("[data-bbreset]", root).forEach(rs => rs.onclick = () => {
        if (!rs.dataset.sure) { rs.dataset.sure = "1"; const t = rs.textContent; rs.textContent = "⚠️ Tap again to reset"; setTimeout(() => { if (rs.isConnected) { delete rs.dataset.sure; rs.textContent = t; } }, 4000); return; }
        st.done = false; st.going = false; st.tt = 0; st.r = {}; st.c = {}; st.checked = false; save(); redraw();
        const g = $("[data-bbrun]", root); if (g) g.scrollIntoView({ block: "center", behavior: "smooth" }); });
      const c = $("[data-bbcheck]", root);
      if (c) c.onclick = () => { const r = st.r || {}, co = st.c || {}; if (TUBES.some(t => !r[t.n] || !co[t.n])) { $(".msg", root).textContent = "Fill in every box first."; return; } st.checked = true; save(); redraw(); };
    },
    score(b, st) {
      if (b.mode === "predict") { const n = Object.values(st.p || {}).filter(Boolean).length; return { max: 2, pts: n === 8 ? 2 : n >= 4 ? 1 : 0, label: "predictions" }; }
      const r = st.r || {}, co = st.c || {}, right = TUBES.filter(t => t.ans.includes(r[t.n])).length + TUBES.filter(t => co[t.n] === t.co2).length;
      return { max: 4, pts: st.checked ? Math.round(4 * right / 16) : 0, label: "lab data" };
    },
    text(b, st) {
      if (b.mode === "predict") return "Predictions: " + TUBES.map(t => `#${t.n}=${(st.p || {})[t.n] || "-"}`).join(" ");
      return "Observed: " + TUBES.map(t => `#${t.n}=${(st.r || {})[t.n] || "-"}/${(st.c || {})[t.n] || "-"}`).join(" ");
    }
  };

  /* ---------- inputs and outputs grid ---------- */
  BT.iogrid = {
    html(b, st) {
      const pl = st.pl || {}, sel = st.sel, chk = !!st.checked;
      const cells = [["ps-in", "Inputs (reactants)"], ["ps-out", "Outputs (products)"], ["cr-in", "Inputs (reactants)"], ["cr-out", "Outputs (products)"]];
      const cell = ([id, lab]) => { const items = pl[id] || [], key = b.key[id], ok = chk && items.length === key.length && key.every(x => items.includes(x));
        return `<div class="io-cell ${chk ? (ok ? "ok" : "no") : ""}" data-cell="${id}"><b>${lab}</b>${items.map(x => `<span class="io-chip" data-rm="${id}|${x}">${x} ✕</span>`).join("")}${chk && !ok ? `<div class="mu small">Answer: ${key.join(", ")}</div>` : ""}</div>`; };
      return `<div class="bb"><h4>${b.title}</h4><p class="mu">${b.how}</p>
        <div class="io-bank">${b.terms.map(x => `<button class="io-chip ${sel === x ? "on" : ""}" data-term="${x}" ${chk ? "disabled" : ""}>${x}</button>`).join("")}</div>
        <div class="io-grid"><div class="io-proc"><h5>Photosynthesis</h5><small>happens in the chloroplast</small><div class="io-cells">${cell(cells[0])}${cell(cells[1])}</div></div>
        <div class="io-proc"><h5>Cellular respiration</h5><small>happens in the mitochondria (glycolysis starts in the cytoplasm)</small><div class="io-cells">${cell(cells[2])}${cell(cells[3])}</div></div></div>
        ${chk ? `<p class="score">Boxes correct: <b>${BT.iogrid.score(b, st).pts} / 4</b> · Notice that the outputs of one process are the inputs of the other!</p>` : `<div class="btnrow"><button class="btn" data-iocheck>Check my boxes</button><span class="msg"></span></div>`}</div>`;
    },
    wire(root, b, st, save, redraw) {
      $$("[data-term]", root).forEach(x => x.onclick = () => { st.sel = st.sel === x.dataset.term ? null : x.dataset.term; save(); redraw(); });
      $$("[data-cell]", root).forEach(c => c.onclick = e => {
        if (st.checked) return; const rm = e.target.closest("[data-rm]");
        if (!st.sel && rm) { const [id, t] = rm.dataset.rm.split("|"); st.pl[id] = (st.pl[id] || []).filter(x => x !== t); save(); redraw(); return; }
        if (!st.sel) return; const id = c.dataset.cell; st.pl = st.pl || {}; st.pl[id] = st.pl[id] || []; if (!st.pl[id].includes(st.sel)) st.pl[id].push(st.sel); st.sel = null; save(); redraw();
      });
      const k = $("[data-iocheck]", root); if (k) k.onclick = () => { if (Object.keys(b.key).some(id => !(st.pl || {})[id] || !st.pl[id].length)) { $(".msg", root).textContent = "Put at least one term in every box."; return; } st.checked = true; save(); redraw(); };
    },
    score(b, st) { const pl = st.pl || {}; return { max: 4, pts: st.checked ? Object.keys(b.key).filter(id => { const it = pl[id] || [], key = b.key[id]; return it.length === key.length && key.every(x => it.includes(x)); }).length : 0, label: "inputs & outputs" }; },
    text(b, st) { const pl = st.pl || {}; return Object.keys(b.key).map(id => `${id}: ${(pl[id] || []).join("+")}`).join(" | "); }
  };

  /* ---------- extra EL-friendly styles ---------- */
  if (!document.getElementById("bb-css2")) {
    const css = document.createElement("style"); css.id = "bb-css2";
    css.textContent = `
    .vb-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
    .vb-card{border:3px solid var(--line);border-radius:18px;padding:10px;text-align:center;background:var(--surface);cursor:pointer;font:inherit}
    .vb-card:hover{border-color:var(--lc)} .vb-ic{font-size:2.2rem;display:block;line-height:1.1}
    .vb-en{display:block;font:700 1.05rem var(--display)} .vb-es{display:block;color:var(--lc);font-weight:800;font-size:.9rem}
    .vb-def{display:block;font-size:.82rem;color:var(--muted);margin-top:2px}
    .fl-item{display:flex;gap:14px;align-items:center;border:2px solid var(--line);border-radius:16px;padding:10px 12px;margin:10px 0;background:var(--surface)}
    .fl-pic{flex:none;text-align:center;font-size:2rem;min-width:60px} .fl-pic svg{width:46px;height:auto}
    .fl-txt{font-size:1.08rem;line-height:2.1;min-width:0}.fl-txt select{max-width:100%}
    .fl-txt select{font:inherit;font-weight:800;padding:2px 6px;border-radius:10px;border:2.5px solid var(--lc);background:color-mix(in srgb,var(--lc) 8%,#fff);color:#1f2430}
    .fl-txt select.ok{border-color:var(--ok);background:color-mix(in srgb,var(--ok) 15%,#fff)} .fl-txt select.no{border-color:var(--bad);background:color-mix(in srgb,var(--bad) 12%,#fff)}
    .fl-fix{font-size:.85rem;color:var(--ok);font-weight:800;margin-left:4px}
    .wbank{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 10px;padding:8px 10px;border:2px dashed var(--line);border-radius:14px;background:var(--soft)}
    .wbank b{width:100%;font-size:.8rem;text-transform:uppercase;letter-spacing:.05em;color:var(--muted)}
    .wchip{border:2px solid var(--line);background:var(--surface);border-radius:999px;padding:4px 11px;font-weight:800;font-size:.92rem;cursor:pointer}
    .wchip:hover{border-color:var(--lc)}
    .cer{display:grid;gap:12px}
    .cer-box{border:3px solid var(--cc);border-radius:18px;padding:12px 14px;background:color-mix(in srgb,var(--cc) 6%,var(--surface))}
    .cer-box h5{margin:0 0 6px;font:700 1.15rem var(--display);color:var(--cc)}
    .cer-opts{display:grid;gap:8px}
    .cer-opt{display:flex;gap:10px;align-items:center;text-align:left;border:2.5px solid var(--line);border-radius:14px;padding:8px 12px;background:var(--surface);font:inherit;font-weight:700;cursor:pointer}
    .cer-opt.on{border-color:var(--cc);box-shadow:0 0 0 3px color-mix(in srgb,var(--cc) 25%,transparent)}
    .cer-tubes{display:grid;grid-template-columns:repeat(8,1fr);gap:6px}
    .cer-tube{border:2.5px solid var(--line);border-radius:12px;padding:4px 2px;background:var(--surface);cursor:pointer;font:inherit;font-size:.72rem;font-weight:800;text-align:center}
    .cer-tube svg{width:100%;max-width:44px;height:auto;display:block;margin:0 auto}
    .cer-tube.on{border-color:var(--cc);box-shadow:0 0 0 3px color-mix(in srgb,var(--cc) 25%,transparent)}
    .cer-ev{margin:8px 0 0;padding-left:0;list-style:none}
    .cer-ev li{margin:6px 0;line-height:2}
    .cer-ta{width:100%;font:inherit;font-size:1.02rem;padding:10px;border:2.5px solid var(--line);border-radius:12px;min-height:110px}
    .cer-final{background:var(--soft);border-radius:14px;padding:12px 14px;line-height:1.6}
    .cer-final p{margin:.3em 0}
    @media (max-width:720px){.cer-tubes{grid-template-columns:repeat(4,1fr)}}`;
    document.head.appendChild(css);
  }
  const say = t => { try { const u = new SpeechSynthesisUtterance(String(t).replace(/<[^>]+>/g, "")); u.rate = .9; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) {} };
  const miniTube = t => tubeSVG(t, t.end, 1, 0);
  window.BB = { TUBES, rgb, tubeSVG, miniTube };

  /* ---------- visual word bank (tap a card to hear it) ---------- */
  /* ---------- warm-up review: study-guide style reading + vocabulary table (not scored) ----------
     { t:"warmup", title, read:["paragraph html", ...], vocab:[["term","Spanish cognate","meaning"]], table:{cap, head:[..], rows:[[..]]}, note:"html" } */
  if (!document.getElementById("wu-css")) {
    const c = document.createElement("style"); c.id = "wu-css";
    c.textContent = `.wu{border:2px solid var(--line);border-radius:18px;background:var(--surface);padding:16px 18px;box-shadow:var(--shadow)}
    .wu-kick{font:800 .74rem var(--body);letter-spacing:.06em;text-transform:uppercase;color:var(--lc);margin:0 0 4px}
    .wu h4{margin:0 0 10px;font-size:1.2rem}
    .wu-p{display:grid;grid-template-columns:26px 1fr;gap:10px;margin:0 0 10px;line-height:1.6}
    .wu-p .n{width:24px;height:24px;border-radius:50%;background:color-mix(in srgb,var(--lc) 14%,var(--surface));color:var(--lc);font:800 .8rem var(--body);display:grid;place-items:center;margin-top:3px}
    .wu-tw{overflow-x:auto;margin:12px 0 4px}
    .wu table{border-collapse:collapse;width:100%;font-size:.94rem;min-width:420px}
    .wu th,.wu td{border:1px solid var(--line);padding:7px 10px;text-align:left;vertical-align:top}
    .wu th{background:var(--soft);font-weight:800}
    .wu td.wu-term{font-weight:800}.wu td.wu-es{color:var(--muted);font-style:italic;white-space:nowrap}
    .wu .wu-say{display:inline-block;width:auto;min-height:0;height:auto;border:1.5px solid var(--line);background:var(--surface);color:var(--muted);border-radius:999px;font:700 .72rem var(--body);padding:1px 8px;margin-left:6px;cursor:pointer;vertical-align:middle}
    .wu-cap{font:800 .9rem var(--body);margin:14px 0 6px}
    .wu-note{margin:12px 0 0;padding:10px 12px;border-left:4px solid var(--lc);background:var(--soft);border-radius:0 10px 10px 0;line-height:1.55}`;
    document.head.appendChild(c);
  }
  BT.warmup = {
    html(b) {
      let h = `<div class="wu"><p class="wu-kick">Review before the lab</p>${b.title ? `<h4>${b.title}</h4>` : ""}`;
      h += (b.read || []).map((p, i) => `<div class="wu-p"><span class="n">${i + 1}</span><div>${p}</div></div>`).join("");
      if (b.vocab) h += `<p class="wu-cap">Key vocabulary</p><div class="wu-tw"><table><thead><tr><th>Term</th><th>Spanish cognate</th><th>What it means</th></tr></thead><tbody>${b.vocab.map((v, i) => `<tr><td class="wu-term">${v[0]}<button class="wu-say" data-say="${i}" aria-label="Read ${v[0]} aloud">Listen</button></td><td class="wu-es">${v[1] || ""}</td><td>${v[2]}</td></tr>`).join("")}</tbody></table></div>`;
      if (b.table) h += `<p class="wu-cap">${b.table.cap || ""}</p><div class="wu-tw"><table>${b.table.head ? `<thead><tr>${b.table.head.map(x => `<th>${x}</th>`).join("")}</tr></thead>` : ""}<tbody>${b.table.rows.map(r => `<tr>${r.map((c, j) => j === 0 ? `<td class="wu-term">${c}</td>` : `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
      if (b.note) h += `<div class="wu-note">${b.note}</div>`;
      return h + "</div>";
    },
    wire(root, b) {
      $$("[data-say]", root).forEach(x => x.onclick = () => { const v = b.vocab[+x.dataset.say], d = document.createElement("div"); d.innerHTML = v[0] + ". " + v[2];
        try { const u = new SpeechSynthesisUtterance(d.textContent); u.rate = .9; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) {} });
    }
  };

  BT.vbank = {
    html(b) { return `<div class="bb"><h4>${b.title || "Word bank"}</h4><p class="mu small">${b.how || "Tap a card to hear the word. Spanish cognates are in purple."}</p><div class="vb-grid">${b.words.map((w, i) => `<button class="vb-card" data-vb="${i}"><span class="vb-ic">${w.ic}</span><span class="vb-en">${w.en}</span>${w.es ? `<span class="vb-es">${w.es}</span>` : ""}<span class="vb-def">${w.def || ""}</span></button>`).join("")}</div></div>`; },
    wire(root, b) { $$("[data-vb]", root).forEach(c => c.onclick = () => { const w = b.words[+c.dataset.vb]; say(`${w.en}. ${w.def || ""}`); }); }
  };

  /* ---------- sentence frames with drop-down blanks ---------- */
  BT.fill = {
    html(b, st) {
      const a = st.a || {}, chk = !!st.checked; let n = 0;
      const items = b.items.map((it, k) => `<div class="fl-item">${it.pic && (it.pic === "tube" || /</.test(it.pic)) ? `<div class="fl-pic">${it.pic === "tube" ? miniTube(TUBES[it.tube - 1]) : it.pic}</div>` : ""}<div class="fl-txt">${it.parts.map(p => {
        if (typeof p === "string") return p; const id = n++, v = a[id], ok = v != null && +v === p.a;
        return `<select data-fl="${id}" ${chk ? "disabled" : ""} class="${chk ? (ok ? "ok" : "no") : ""}"><option value="">______</option>${p.o.map((o, j) => `<option value="${j}" ${+v === j && v !== "" && v != null ? "selected" : ""}>${o}</option>`).join("")}</select>${chk && !ok ? `<span class="fl-fix">✓ ${p.o[p.a]}</span>` : ""}`; }).join("")}</div></div>`).join("");
      return `<div class="bb"><h4>${b.icon || "🧩"} ${b.title}</h4>${b.how ? `<p class="mu">${b.how}</p>` : ""}${b.bank ? `<div class="wbank"><b>Word bank</b>${b.bank.map(w => `<span class="wchip">${w}</span>`).join("")}</div>` : ""}${b.top || ""}${items}
        ${chk ? `<p class="score">Correct: <b>${BT.fill.count(b, st)} / ${BT.fill.blanks(b)}</b>${b.why ? ` · ${b.why}` : ""}</p>` : `<div class="btnrow"><button class="btn" data-flcheck>Check my sentences</button><span class="msg"></span></div>`}</div>`;
    },
    blanks: b => b.items.reduce((t, it) => t + it.parts.filter(p => typeof p !== "string").length, 0),
    count(b, st) { let n = 0, ok = 0; b.items.forEach(it => it.parts.forEach(p => { if (typeof p === "string") return; const v = (st.a || {})[n++]; if (v !== "" && v != null && +v === p.a) ok++; })); return ok; },
    wire(root, b, st, save, redraw) {
      $$("[data-fl]", root).forEach(s => s.onchange = () => { (st.a = st.a || {})[s.dataset.fl] = s.value; save(); });
      const c = $("[data-flcheck]", root); if (c) c.onclick = () => { const a = st.a || {}; if (Array.from({ length: BT.fill.blanks(b) }, (_, i) => a[i]).some(v => v === "" || v == null)) { $(".msg", root).textContent = "Fill in every blank first."; return; } st.checked = true; save(); redraw(); };
    },
    score(b, st) { const tot = BT.fill.blanks(b), max = b.max || Math.min(tot, 4); return { max, pts: st.checked ? Math.round(max * BT.fill.count(b, st) / tot) : 0, label: b.label || "sentence frames" }; },
    text(b, st) { let n = 0; return b.items.map(it => it.parts.map(p => typeof p === "string" ? p.replace(/<[^>]+>/g, "") : (p.o[(st.a || {})[n++]] || "___")).join("")).join(" ").slice(0, 900); }
  };

  /* ---------- CER builder: claim cards, tube evidence, reasoning with word bank ---------- */
  BT.cerbuild = {
    html(b, st) {
      const sel = st.tubes || [], ev = st.ev || {}, chk = !!st.checked;
      const tubeBtns = TUBES.map(t => `<button class="cer-tube ${sel.includes(t.n) ? "on" : ""}" data-ct="${t.n}" aria-pressed="${sel.includes(t.n)}">${miniTube(t)}${whoIcons(t)}<br>${t.light ? "☀️" : "🌑"}</button>`).join("");
      const evList = sel.map(n => { const t = TUBES[n - 1], v = ev[n] || {};
        const s1 = `<select data-ev="${n}|c"><option value="">color</option>${COLORS.map(c => `<option value="${c.toLowerCase()}" ${v.c === c.toLowerCase() ? "selected" : ""}>${c.toLowerCase()}</option>`).join("")}</select>`;
        const s2 = `<select data-ev="${n}|g"><option value="">CO₂</option>${["increased", "decreased", "stayed the same"].map(c => `<option ${v.g === c ? "selected" : ""}>${c}</option>`).join("")}</select>`;
        return `<li>In <b>tube #${n}</b> (${whoIcons(t)} ${t.who}, ${t.light ? "☀️ light" : "🌑 dark"}), the BTB changed from green to ${s1}, so the CO₂ ${s2}.</li>`; }).join("");
      const box = (cc, title, inner) => `<div class="cer-box" style="--cc:${cc}"><h5>${title}</h5>${inner}</div>`;
      let h = `<div class="bb"><h4>${b.title}</h4><p class="mu">${b.q}</p><div class="cer">` +
        box("#2b7de9", "C · Claim: choose your answer", `<div class="cer-opts">${b.claims.map((c, i) => `<button class="cer-opt ${st.claim === i ? "on" : ""}" data-cl="${i}"><span>${c}</span></button>`).join("")}</div>`) +
        box("#1aa36f", "E · Evidence: tap 2 or more tubes, then finish each sentence", `<div class="cer-tubes">${tubeBtns}</div>${sel.length ? `<ul class="cer-ev">${evList}</ul>` : `<p class="mu small">Tip: compare an Elodea tube in the light with an Elodea tube in the dark.</p>`}`) +
        box("#e08a00", "R · Reasoning: explain WHY", `<div class="wbank"><b>Word bank (tap to add)</b>${b.words.map(w => `<button class="wchip" data-w="${w}">${w}</button>`).join("")}</div>
          <div class="wbank"><b>Sentence starters (tap to add)</b>${b.frames.map(f => `<button class="wchip" data-w="${f}">${f}</button>`).join("")}</div>
          <textarea class="cer-ta" data-rs placeholder="BTB turns yellow when… In the light, … In the dark, …">${esc(st.r || "")}</textarea><div class="mu small"><span data-rc>${(String(st.r || "").match(/\S+/g) || []).length}</span> words · aim for 25+</div>`) + "</div>";
      if (chk) { const sc = BT.cerbuild.parts(b, st);
        h += `<ul class="rub">${sc.list.map(r => `<li class="${r[1] ? "ok" : "bad"}">${r[1] ? "✓" : "✗"} ${r[0]}</li>`).join("")}</ul>
          <div class="cer-final"><b>📄 My CER</b>${BT.cerbuild.paragraph(b, st)}</div><p class="score">CER score: <b>${sc.pts} / 4</b>${sc.pts < 4 ? " · Fix the ✗ parts and check again." : " · Excellent scientist!"}</p>`; }
      return h + `<div class="btnrow"><button class="btn" data-cercheck>${chk ? "Check again" : "Check my CER"}</button><span class="msg"></span></div></div>`;
    },
    paragraph(b, st) {
      const ev = st.ev || {};
      const evs = (st.tubes || []).map(n => { const t = TUBES[n - 1], v = ev[n] || {}; return `In tube #${n} (${t.who}, ${t.light ? "light" : "dark"}), the BTB changed from green to ${(v.c || "___").toLowerCase()}, so the CO₂ ${v.g || "___"}.`; }).join(" ");
      return `<p><b style="color:#2b7de9">Claim:</b> ${st.claim != null ? b.claims[st.claim].replace(/<[^>]+>/g, "") : "___"}</p><p><b style="color:#1aa36f">Evidence:</b> ${evs || "___"}</p><p><b style="color:#e08a00">Reasoning:</b> ${esc(st.r || "___")}</p>`;
    },
    parts(b, st) {
      const ev = st.ev || {}, sel = st.tubes || [], r = String(st.r || "");
      const evOk = sel.length >= 2 && sel.every(n => { const t = TUBES[n - 1], v = ev[n] || {}; return v.c && t.ans.map(x => x.toLowerCase()).includes(v.c.toLowerCase()) && v.g === { More: "increased", Less: "decreased", Same: "stayed the same" }[t.co2]; });
      const hasLD = sel.some(n => TUBES[n - 1].e && TUBES[n - 1].light) && sel.some(n => TUBES[n - 1].e && !TUBES[n - 1].light);
      const words = (r.match(/\S+/g) || []).length;
      const rOk = /carbon dioxide|co2|co₂/i.test(r) && /photosynth/i.test(r) && /respirat/i.test(r) && words >= 20;
      const list = [["Claim: plants do BOTH processes", st.claim === b.claimA], ["Evidence: 2+ tubes with correct colors and CO₂ changes", evOk], ["Evidence: compares Elodea in light AND in dark", hasLD], ["Reasoning: 20+ words using CO₂, photosynthesis, and respiration", rOk]];
      return { list, pts: list.filter(x => x[1]).length };
    },
    wire(root, b, st, save, redraw) {
      $$("[data-cl]", root).forEach(x => x.onclick = () => { st.claim = +x.dataset.cl; save(); redraw(); });
      $$("[data-ct]", root).forEach(x => x.onclick = () => { const n = +x.dataset.ct; st.tubes = st.tubes || []; const i = st.tubes.indexOf(n); if (i >= 0) st.tubes.splice(i, 1); else st.tubes.push(n); st.tubes.sort((a, c) => a - c); save(); redraw(); });
      $$("[data-ev]", root).forEach(x => x.onchange = () => { const [n, k] = x.dataset.ev.split("|"); st.ev = st.ev || {}; st.ev[n] = st.ev[n] || {}; st.ev[n][k] = x.value; save(); });
      const ta = $("[data-rs]", root);
      ta.oninput = () => { st.r = ta.value; $("[data-rc]", root).textContent = (ta.value.match(/\S+/g) || []).length; save(); };
      $$("[data-w]", root).forEach(x => x.onclick = () => { const w = x.dataset.w, v = ta.value; ta.value = v + (v && !/\s$/.test(v) ? " " : "") + w + (/[.…]$/.test(w) ? " " : " "); ta.oninput(); ta.focus(); });
      $("[data-cercheck]", root).onclick = () => { if (st.claim == null || !(st.tubes || []).length) { $(".msg", root).textContent = "Choose a claim and at least 2 tubes first."; return; } st.checked = true; save(); redraw(); };
    },
    score(b, st) { return { max: 4, pts: st.checked ? BT.cerbuild.parts(b, st).pts : 0, label: "CER" }; },
    text(b, st) { return BT.cerbuild.paragraph(b, st).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(); }
  };
});
