/* =====================================================================
   GUMMY BEAR OSMOSIS LAB BLOCKS (no need to edit)
   osmodel  : particle model of a membrane: water crosses, solute can't
   gummylab : predict (mode "predict") or soak, weigh, and record data
              (mode "run"). Run data can be reset (tap twice).
   osgraph  : build a bar graph of % mass change, then check it
   ===================================================================== */
(window.CC_EXTS = window.CC_EXTS || []).push(function (BT, H) {
  const { $, $$ } = H;
  /* simplified overnight (24 h) classroom-style results; start masses in grams */
  const SOL = [
    { k: "dw", name: "Distilled water", short: "Distilled water", liq: "#dff1ff", start: 2.40, end: 5.76, ton: "Hypotonic", water: "Into the bear" },
    { k: "tw", name: "Tap water", short: "Tap water", liq: "#e6f3f7", start: 2.50, end: 5.75, ton: "Hypotonic", water: "Into the bear" },
    { k: "sw", name: "10% sugar water", short: "10% sugar", liq: "#fff6dc", start: 2.40, end: 3.84, ton: "Hypotonic", water: "Into the bear" },
    { k: "iso", name: "Bear-matched sugar syrup", short: "Matched syrup", liq: "#ffe9b8", start: 2.40, end: 2.42, ton: "Isotonic", water: "No net movement" },
    { k: "salt", name: "Saturated salt water", short: "Salt water", liq: "#eef0f2", start: 2.40, end: 2.16, ton: "Hypertonic", water: "Out of the bear" },
    { k: "cs", name: "Corn syrup", short: "Corn syrup", liq: "#f7d98b", start: 2.50, end: 2.20, ton: "Hypertonic", water: "Out of the bear" }
  ];
  const BEARC = ["#e8473f", "#2fa84f", "#f2a01a", "#e05fa6", "#f4d31f", "#8a54e0"];
  SOL.forEach(s => s.pct = Math.round((s.end - s.start) / s.start * 100));
  window.OS_SOL = SOL;
  const PRED = ["Grow", "Shrink", "Stay about the same"];
  const answerPred = s => s.pct > 5 ? "Grow" : s.pct < -5 ? "Shrink" : "Stay about the same";
  const fmt = n => (n < 0 ? "−" : "") + Math.abs(n).toFixed(2);

  if (!document.getElementById("os-css")) {
    const c = document.createElement("style"); c.id = "os-css";
    c.textContent = `
    .os{border:3px solid var(--line);border-radius:22px;padding:14px 16px;background:var(--surface)}
    .os h4{margin:0 0 6px}
    .os-bench{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:8px;background:linear-gradient(#f4f1ea,#e8e2d4);border:2px solid #cfc6b0;border-radius:18px;padding:12px 10px}
    .os-bk{display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center;font-size:.8rem;font-weight:800;min-width:0}
    .os-bk svg{width:100%;max-width:120px;height:auto}
    .os-bk select{max-width:100%;font:inherit;font-size:.78rem;border:2px solid var(--line);border-radius:8px;padding:3px}
    .os-bk .wbtn{font:inherit;font-size:.75rem;font-weight:800;border:2px solid var(--line);border-radius:10px;background:#fff;padding:3px 8px;cursor:pointer}
    .os-bk .wbtn.on{border-color:var(--lc);background:color-mix(in srgb,var(--lc) 14%,#fff)}
    .os-scale{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin:10px 0 0;padding:10px 14px;border-radius:16px;background:#2d2f36;color:#fff}
    .os-scale .lcd{font:700 1.6rem ui-monospace,Menlo,monospace;background:#a9d39e;color:#17330f;border-radius:8px;padding:4px 14px;min-width:120px;text-align:right}
    .os-ctrl{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:10px 0}
    .os-clock{font:800 1.1rem var(--display)}
    .os-tbl{width:100%;border-collapse:collapse;margin-top:10px;font-size:.86rem}
    .os-tbl th,.os-tbl td{border:1px solid var(--line);padding:5px;text-align:center}
    .os-tbl th{background:var(--soft)} .os-tbl td:first-child{text-align:left;font-weight:800}
    .os-tbl input{max-width:90px}.os-tbl input,.os-tbl select{width:100%;min-width:0;max-width:150px;font:inherit;border:2px solid var(--line);border-radius:8px;padding:3px 5px}
    .os-tbl td.ok{background:color-mix(in srgb,var(--ok) 16%,transparent)} .os-tbl td.no{background:color-mix(in srgb,var(--bad) 14%,transparent)}
    .os-tw{overflow-x:auto}
    .os-mdl{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:14px;align-items:start}
    .os-mdl svg{width:100%;height:auto;background:var(--soft);border-radius:14px}
    .os-out{display:grid;gap:6px;font-size:.95rem}.os-out .big{font:800 1.05rem var(--display);padding:8px 10px;border-radius:12px;background:color-mix(in srgb,var(--lc) 12%,var(--surface))}
    .os-sl{display:grid;gap:2px;font-weight:800}.os-sl input{width:100%;accent-color:var(--lc)}
    .os-g{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:14px;align-items:start}
    .os-g svg{width:100%;height:auto;background:#fff;border:2px solid var(--line);border-radius:14px}
    .os-gs{display:grid;gap:8px}.os-gs label{display:grid;gap:2px;font-weight:800;font-size:.85rem}.os-gs input{width:100%;accent-color:var(--lc)}
    @keyframes osdrip{0%{transform:translateY(0);opacity:.9}100%{transform:translateY(16px);opacity:0}}
    @media (max-width:760px){.os-bench{grid-template-columns:repeat(3,minmax(0,1fr))}.os-mdl,.os-g{grid-template-columns:1fr}}`;
    document.head.appendChild(c);
  }

  /* a cute gummy bear, scaled about its feet */
  function bear(cx, by, s, col, wr) {
    const g = `<g transform="translate(${cx} ${by}) scale(${s.toFixed(3)}) translate(0 -46)">
      <circle cx="-9" cy="-16" r="5" fill="${col}"/><circle cx="9" cy="-16" r="5" fill="${col}"/>
      <ellipse cx="0" cy="-6" rx="12" ry="11" fill="${col}"/><ellipse cx="0" cy="18" rx="14" ry="17" fill="${col}"/>
      <ellipse cx="-15" cy="12" rx="5" ry="8" fill="${col}"/><ellipse cx="15" cy="12" rx="5" ry="8" fill="${col}"/>
      <ellipse cx="-8" cy="36" rx="6" ry="6" fill="${col}"/><ellipse cx="8" cy="36" rx="6" ry="6" fill="${col}"/>
      <circle cx="-4" cy="-8" r="1.6" fill="#2b2230"/><circle cx="4" cy="-8" r="1.6" fill="#2b2230"/><ellipse cx="0" cy="-3" rx="2.4" ry="1.6" fill="#2b2230" opacity=".7"/>
      <ellipse cx="-5" cy="10" rx="3" ry="8" fill="#fff" opacity=".35"/>${wr ? `<g fill="none" stroke="#3b2316" stroke-width="1.6" stroke-linecap="round" opacity="${wr.toFixed(2)}"><path d="M-8 6 q4 -3 8 0 q4 3 8 0"/><path d="M-9 16 q4 -3 9 0 q4 3 9 0"/><path d="M-8 26 q4 -3 8 0 q4 3 8 0"/><path d="M-5 -12 q2.5 -2 5 0 q2.5 2 5 0"/></g>` : ""}</g>`;
    return g;
  }
  /* Size changes with the mass. Shrinking bears scale a bit more strongly so the change is easy to see. */
  function beaker(sol, i, frac) {
    const ratio = 1 + (sol.end / sol.start - 1) * frac, s0 = 0.82;
    const s = ratio >= 1 ? Math.pow(ratio, 0.42) * s0 : Math.pow(ratio, 3) * s0;
    return `<svg viewBox="0 0 100 130" aria-label="${sol.name} beaker"><path d="M14 10 V112 a10 10 0 0 0 10 10 H76 a10 10 0 0 0 10 -10 V10" fill="#fff" stroke="#6b7280" stroke-width="3"/>
      <path d="M17 34 V111 a8 8 0 0 0 8 8 H75 a8 8 0 0 0 8 -8 V34 Z" fill="${sol.liq}"/><line x1="17" y1="34" x2="83" y2="34" stroke="#9aa6b2" stroke-width="2"/>
      ${bear(50, 116, s, BEARC[i])}<text x="50" y="26" text-anchor="middle" font-size="10" font-weight="700" fill="#4b5563">${String.fromCharCode(65 + i)}</text></svg>`;
  }
  function predState(ctx) {
    const L = ctx.L, S = ctx.S;
    for (let i = 0; i < L.stations.length; i++) for (let j = 0; j < L.stations[i].blocks.length; j++) { const b = L.stations[i].blocks[j]; if (b.t === "gummylab" && b.mode === "predict") return S.b[i + "-" + j] || {}; }
    return {};
  }
  /* two-tap reset button (no pop-up, which some browsers block) */
  function twoTap(btn, fn) { btn.onclick = () => { if (!btn.dataset.sure) { btn.dataset.sure = "1"; const t = btn.textContent; btn.textContent = "⚠️ Tap again to reset"; setTimeout(() => { if (btn.isConnected) { delete btn.dataset.sure; btn.textContent = t; } }, 4000); return; } fn(); }; }

  /* ---------------- gummylab ---------------- */
  BT.gummylab = {
    html(b, st, ctx) {
      if (st.going && !window.__osRunning) st.going = false;
      const run = b.mode === "run", tt = run ? (st.done ? 1 : (st.tt || 0)) : 0, hours = Math.round(tt * 24);
      const pred = run ? (predState(ctx).p || {}) : (st.p || {}), w = st.w || {};
      let h = `<div class="os"><h4>${b.title || "Gummy Bear Soak"}</h4>
        <p class="mu small">Six identical gummy bears were weighed and placed in six beakers. ${run ? "Start the soak, then weigh each bear." : "Predict what each bear will do after soaking for 24 hours."}</p>
        <div class="os-bench">${SOL.map((s, i) => `<div class="os-bk">${beaker(s, i, tt)}<span>${s.name}</span><span class="mu" style="font-weight:700">start ${fmt(s.start)} g</span>
          ${run ? (st.done ? `<button class="wbtn ${st.on === s.k ? "on" : ""}" data-weigh="${s.k}">⚖️ ${w[s.k] ? "Weighed" : "Weigh"}</button>` : "")
          : `<select data-p="${s.k}" aria-label="Prediction for ${s.name}"><option value="">Predict…</option>${PRED.map(p => `<option ${pred[s.k] === p ? "selected" : ""}>${p}</option>`).join("")}</select>`}</div>`).join("")}</div>`;
      if (!run) {
        const n = SOL.filter(s => pred[s.k]).length;
        return h + `<p class="mu small" style="margin-top:8px">Predictions made: <b>${n} of 6</b>. ${n === 6 ? "✅ Explain your thinking below." : "Use the drop-down under each beaker."}</p></div>`;
      }
      h += `<div class="os-ctrl"><button class="btn" data-osrun ${st.done || st.going ? "disabled" : ""}>${st.done ? "✅ 24 hours complete" : "▶ Start the 24-hour soak"}</button><span class="os-clock">⏱ ${hours} h</span>
        ${st.done ? `<button class="btn ghost" data-osreset>↺ Reset the lab</button>` : `<span class="mu small">Watch the bears. Water moves, so their size changes.</span>`}</div>`;
      if (st.done) {
        const on = SOL.find(s => s.k === st.on);
        h += `<div class="os-scale"><span>⚖️ Digital scale</span><span class="lcd">${on ? fmt(on.end) + " g" : "0.00 g"}</span><span>${on ? `Bear ${String.fromCharCode(65 + SOL.indexOf(on))} from <b>${on.name}</b> (blotted dry)` : "Tap ⚖️ Weigh under a beaker to put that bear on the scale."}</span></div>`;
        const r = st.r || {}, chk = !!st.checked;
        const cell = (k, f, ok, inner) => `<td class="${chk ? (ok ? "ok" : "no") : ""}">${inner}</td>`;
        h += `<div class="os-tw"><table class="os-tbl"><thead><tr><th>Solution</th><th>My prediction</th><th>Start mass (g)</th><th>End mass (g)</th><th>% change</th><th>Water moved…</th><th>Solution compared to the bear</th></tr></thead><tbody>` +
          SOL.map(s => { const v = r[s.k] || {}, okE = Math.abs(+v.e - s.end) <= 0.011, okP = Math.abs(+v.p - s.pct) <= 1.01, okW = v.w === s.water, okT = v.t === s.ton;
            return `<tr><td>${s.name}</td><td>${pred[s.k] || "<span class='mu'>none</span>"}</td><td>${fmt(s.start)}</td>
              ${cell(s.k, "e", okE, `<input inputmode="decimal" data-f="${s.k}|e" value="${v.e ?? ""}" ${chk ? "disabled" : ""} aria-label="End mass ${s.name}" placeholder="${w[s.k] ? "type it" : "weigh first"}">`)}
              ${cell(s.k, "p", okP, `<input inputmode="decimal" data-f="${s.k}|p" value="${v.p ?? ""}" ${chk ? "disabled" : ""} aria-label="Percent change ${s.name}" placeholder="%">`)}
              ${cell(s.k, "w", okW, `<select data-f="${s.k}|w" ${chk ? "disabled" : ""}><option value="">Choose…</option>${["Into the bear", "Out of the bear", "No net movement"].map(o => `<option ${v.w === o ? "selected" : ""}>${o}</option>`).join("")}</select>`)}
              ${cell(s.k, "t", okT, `<select data-f="${s.k}|t" ${chk ? "disabled" : ""}><option value="">Choose…</option>${["Hypotonic", "Hypertonic", "Isotonic"].map(o => `<option ${v.t === o ? "selected" : ""}>${o}</option>`).join("")}</select>`)}</tr>`; }).join("") + `</tbody></table></div>
          <p class="mu small">% change = (end − start) ÷ start × 100. Round to the nearest whole percent. Use a negative number if the bear lost mass.</p>`;
        h += chk ? `<p class="score">Data recorded correctly: <b>${BT.gummylab.right(st)} / 24</b>. Green = correct. Fix red boxes by looking at the scale and your math again.</p><div class="btnrow"><button class="btn ghost" data-osfix>✏️ Fix my red boxes</button></div>`
          : `<div class="btnrow"><button class="btn" data-oscheck>Check my data table</button><span class="msg"></span></div>`;
      }
      return h + `</div>`;
    },
    right(st) { const r = st.r || {}; let n = 0; SOL.forEach(s => { const v = r[s.k] || {}; if (Math.abs(+v.e - s.end) <= 0.011) n++; if (Math.abs(+v.p - s.pct) <= 1.01) n++; if (v.w === s.water) n++; if (v.t === s.ton) n++; }); return n; },
    wire(root, b, st, save, redraw) {
      $$("[data-p]", root).forEach(x => x.onchange = () => { (st.p = st.p || {})[x.dataset.p] = x.value; save(); redraw(); });
      $$("[data-f]", root).forEach(x => { const ev = x.tagName === "SELECT" ? "change" : "input"; x.addEventListener(ev, () => { const [k, f] = x.dataset.f.split("|"); st.r = st.r || {}; (st.r[k] = st.r[k] || {})[f] = x.value.replace(/−/g, "-").trim(); save(); }); });
      $$("[data-weigh]", root).forEach(x => x.onclick = () => { st.on = x.dataset.weigh; (st.w = st.w || {})[st.on] = true; save(); redraw(); });
      const go = $("[data-osrun]", root);
      if (go) go.onclick = () => {
        st.going = true; window.__osRunning = true; go.disabled = true;
        const t0 = performance.now(), dur = window.OS_FAST ? 300 : 8000;
        const step = now => {
          if (!root.isConnected) { window.__osRunning = false; st.going = false; return; }
          const tt = Math.min(1, (now - t0) / dur);
          $$(".os-bk svg", root).forEach((svg, i) => { svg.outerHTML = beaker(SOL[i], i, tt); });
          const c = $(".os-clock", root); if (c) c.textContent = `⏱ ${Math.round(tt * 24)} h`;
          if (tt < 1) requestAnimationFrame(step); else { st.done = true; st.going = false; window.__osRunning = false; save(); redraw(); }
        };
        requestAnimationFrame(step);
      };
      const rs = $("[data-osreset]", root); if (rs) twoTap(rs, () => { st.done = false; st.going = false; st.tt = 0; st.r = {}; st.w = {}; st.on = null; st.checked = false; save(); redraw(); });
      const fx = $("[data-osfix]", root); if (fx) fx.onclick = () => { st.checked = false; save(); redraw(); };
      const c = $("[data-oscheck]", root);
      if (c) c.onclick = () => { const r = st.r || {}; if (SOL.some(s => { const v = r[s.k] || {}; return v.e == null || v.e === "" || v.p == null || v.p === "" || !v.w || !v.t; })) { $(".msg", root).textContent = "Fill in every box first."; return; } st.checked = true; save(); redraw(); };
    },
    score(b, st) {
      if (b.mode === "predict") { const n = SOL.filter(s => (st.p || {})[s.k]).length; return { max: 2, pts: n === 6 ? 2 : n >= 3 ? 1 : 0, label: "predictions" }; }
      return { max: b.max || 6, pts: st.checked ? Math.round((b.max || 6) * BT.gummylab.right(st) / 24) : 0, label: "lab data" };
    },
    text(b, st) {
      if (b.mode === "predict") return "Predictions: " + SOL.map(s => `${s.short}=${(st.p || {})[s.k] || "-"}`).join("; ");
      const r = st.r || {}; return SOL.map(s => { const v = r[s.k] || {}; return `${s.short}: ${v.e || "-"} g, ${v.p || "-"}%, ${v.w || "-"}, ${v.t || "-"}`; }).join(" | ");
    }
  };

  /* ---------------- osmodel: membrane particle model ---------------- */
  BT.osmodel = {
    html(b, st) {
      const out = st.out ?? 4;
      return `<div class="os"><h4>${b.title || "Zoom In: The Membrane Model"}</h4><p class="mu small">${b.how || "Left: inside the gummy bear. Right: the solution. 🔵 water molecules can pass through the membrane. 🟠 solute particles (sugar or salt) are too big to pass through."}</p>
        <div class="os-mdl"><svg viewBox="0 0 400 230" role="img" aria-label="Particle model with a membrane"><g data-g></g></svg>
        <div class="os-out"><label class="os-sl">Solute particles in the solution (right side): <b data-ov>${out}</b><input type="range" min="0" max="30" step="1" value="${out}" data-out aria-label="Solute particles outside"></label>
          <div data-txt></div><div class="btnrow"><button class="btn" data-mgo>▶ Let osmosis happen</button><button class="btn ghost" data-mreset>↺ Reset model</button></div>
          <p class="mu small" data-tried>Settings tried: ${(st.tried || []).length} (try at least 3: very low, about equal, and high)</p></div></div></div>`;
    },
    wire(root, b, st, save) {
      const IN_S = b.inside ?? 14, TOT = 60; let out = st.out ?? 4, inW, outW, timer = null, dir0 = null, moved = 0;
      const g = $("[data-g]", root), txt = $("[data-txt]", root);
      const rnd = (seed => () => (seed = (seed * 9301 + 49297) % 233280) / 233280)(7);
      let P = [];
      function setup() { inW = TOT / 2; outW = TOT / 2; P = []; dir0 = null; moved = 0; const mk = (side, kind, n) => { for (let i = 0; i < n; i++) P.push({ side, kind, x: rnd(), y: rnd() }); };
        mk("in", "w", inW); mk("out", "w", outW); mk("in", "s", IN_S); mk("out", "s", out); }
      const wc = (w, s) => w / (w + s);
      function draw() {
        const vin = inW + IN_S, vout = outW + out, wall = 20 + 360 * vin / (vin + vout);
        let s = `<rect x="20" y="20" width="${wall - 20}" height="190" fill="#ffe3ec" opacity=".7"/><rect x="${wall}" y="20" width="${380 - wall}" height="190" fill="#e3f1ff" opacity=".7"/>
          <line x1="${wall}" y1="16" x2="${wall}" y2="214" stroke="#6b4bb0" stroke-width="4" stroke-dasharray="8 6"/>
          <text x="${(20 + wall) / 2}" y="14" text-anchor="middle" font-size="11" font-weight="700" fill="#6b4bb0">INSIDE the bear</text><text x="${(wall + 380) / 2}" y="14" text-anchor="middle" font-size="11" font-weight="700" fill="#2b7de9">the SOLUTION</text>
          <text x="${wall + 4}" y="226" font-size="10" fill="#6b4bb0">membrane</text>`;
        P.forEach(p => { const x0 = p.side === "in" ? 26 : wall + 6, x1 = p.side === "in" ? wall - 6 : 374, x = x0 + p.x * (x1 - x0), y = 28 + p.y * 176;
          s += p.kind === "w" ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.6" fill="#2b7de9"/>` : `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6.5" fill="#f08a24" stroke="#b35f10"/>`; });
        g.innerHTML = s;
        const ci = wc(inW, IN_S), co = wc(outW, out), d = co - ci;
        const dir = Math.abs(d) < 0.02 ? "none" : d > 0 ? "in" : "out"; if (dir0 === null) dir0 = dir;
        const msg0 = dir0 === "none" ? "⚖️ The concentrations are about equal (isotonic). No NET water movement." : dir0 === "in" ? "💧 The solution has a HIGHER water concentration (LOWER solute) than the bear. It is hypotonic, so water moves INTO the bear and the bear swells." : "💧 The solution has a LOWER water concentration (HIGHER solute) than the bear. It is hypertonic, so water moves OUT of the bear and the bear shrinks.";
        const done = moved > 0 && dir === "none" ? `<div class="mu small">✅ ${moved} water molecules moved ${dir0 === "in" ? "into" : "out of"} the bear. Now the concentrations are about equal, so the NET movement stopped (water still moves both ways at the same rate).</div>` : "";
        txt.innerHTML = `<div>Inside: <b>${Math.round(ci * 100)}% water</b>, ${Math.round((1 - ci) * 100)}% solute</div><div>Solution: <b>${Math.round(co * 100)}% water</b>, ${Math.round((1 - co) * 100)}% solute</div>
          <div class="big">${msg0}</div>${done}
          <div class="mu small">🟠 Solute particles stay where they are. Only water crosses.</div>`;
        return dir;
      }
      function jiggle() { P.forEach(p => { p.x = Math.min(1, Math.max(0, p.x + (rnd() - .5) * .08)); p.y = Math.min(1, Math.max(0, p.y + (rnd() - .5) * .08)); }); }
      function go() {
        clearInterval(timer); let n = 0;
        timer = setInterval(() => { if (!root.isConnected) return clearInterval(timer);
          jiggle(); const dir = draw();
          if (dir === "none" || n > 40) { clearInterval(timer); return; }
          const from = dir === "in" ? "out" : "in", p = P.find(q => q.kind === "w" && q.side === from && (from === "out" ? q.x < .35 : q.x > .65)) || P.find(q => q.kind === "w" && q.side === from);
          if (p) { p.side = dir === "in" ? "in" : "out"; p.x = dir === "in" ? .9 : .1; if (dir === "in") { inW++; outW--; } else { inW--; outW++; } moved++; }
          n++; }, window.OS_FAST ? 5 : 160);
        st.tried = [...new Set([...(st.tried || []), out])]; save(); $("[data-tried]", root).textContent = `Settings tried: ${st.tried.length} (try at least 3: very low, about equal, and high)`;
      }
      $("[data-out]", root).oninput = e => { out = +e.target.value; st.out = out; $("[data-ov]", root).textContent = out; clearInterval(timer); setup(); draw(); save(); };
      $("[data-mgo]", root).onclick = go;
      $("[data-mreset]", root).onclick = () => { clearInterval(timer); setup(); draw(); };
      setup(); draw();
    },
    score(b, st) { return { max: 1, pts: (st.tried || []).length >= 3 ? 1 : 0, label: "model explored" }; },
    text(b, st) { return "Model settings tried: " + (st.tried || []).join(", "); }
  };

  /* ---------------- osgraph: build the bar graph ---------------- */
  BT.osgraph = {
    html(b, st) {
      const v = st.v || {}, chk = !!st.checked, W = 440, Hh = 290, L = 58, B = 240, T = 34, y0 = -40, y1 = 160, sy = y => B - (y - y0) / (y1 - y0) * (B - T), bw = (W - L - 10) / SOL.length;
      let g = "";
      for (let y = y0; y <= y1; y += 20) g += `<line x1="${L}" x2="${W - 8}" y1="${sy(y)}" y2="${sy(y)}" stroke="${y === 0 ? "#333" : "#e5e7eb"}" stroke-width="${y === 0 ? 2 : 1}"/><text x="${L - 6}" y="${sy(y) + 4}" text-anchor="end" font-size="11" fill="#555">${y}%</text>`;
      SOL.forEach((s, i) => { const val = v[s.k] ?? 0, x = L + i * bw + bw * .18, w = bw * .64, ok = Math.abs(val - s.pct) <= 5;
        g += `<rect x="${x}" y="${Math.min(sy(val), sy(0))}" width="${w}" height="${Math.max(1, Math.abs(sy(val) - sy(0)))}" rx="3" fill="${BEARC[i]}" ${chk ? `stroke="${ok ? "#1d7a45" : "#d0453a"}" stroke-width="3"` : ""}/>
          <text x="${x + w / 2}" y="${val >= 0 ? sy(val) - 5 : sy(val) + 13}" text-anchor="middle" font-size="11" font-weight="700">${val}%</text>
          <text x="${x + w / 2}" y="${B + 16}" text-anchor="middle" font-size="10" font-weight="700">${String.fromCharCode(65 + i)}</text><text x="${x + w / 2}" y="${B + 28}" text-anchor="middle" font-size="8.5" fill="#555">${s.short}</text>`; });
      g += `<text x="13" y="${(T + B) / 2}" transform="rotate(-90 13 ${(T + B) / 2})" text-anchor="middle" font-size="11" font-weight="700">% change in mass</text>`;
      const right = SOL.filter(s => Math.abs((v[s.k] ?? 0) - s.pct) <= 5).length;
      return `<div class="os"><h4>${b.title || "Build the Graph"}</h4><p class="mu small">${b.how || "Use your data table. Drag each slider so the bar shows that bear’s % change in mass. Bars above 0 gained mass; bars below 0 lost mass."}</p>
        <div class="os-g"><svg viewBox="0 0 ${W} ${Hh}" role="img" aria-label="Bar graph of percent change in mass for each solution">${g}</svg>
        <div class="os-gs">${SOL.map((s, i) => `<label>${String.fromCharCode(65 + i)}. ${s.name}: <b data-gv="${s.k}">${v[s.k] ?? 0}%</b><input type="range" min="-40" max="160" step="1" value="${v[s.k] ?? 0}" data-gs="${s.k}" ${chk ? "disabled" : ""}></label>`).join("")}</div></div>
        ${chk ? `<p class="score">Bars within 5% of the lab data: <b>${right} / 6</b>.</p>${right < 6 ? `<div class="btnrow"><button class="btn ghost" data-gfix>✏️ Fix my graph</button></div>` : ""}` : `<div class="btnrow"><button class="btn" data-gcheck>Check my graph</button><span class="msg"></span></div>`}</div>`;
    },
    wire(root, b, st, save, redraw) {
      $$("[data-gs]", root).forEach(x => { x.oninput = () => { (st.v = st.v || {})[x.dataset.gs] = +x.value; $(`[data-gv="${x.dataset.gs}"]`, root).textContent = x.value + "%"; save(); }; x.onchange = () => redraw(); });
      const c = $("[data-gcheck]", root); if (c) c.onclick = () => { if (SOL.filter(s => (st.v || {})[s.k] != null).length < 5) { $(".msg", root).textContent = "Set every bar first (a 0% bar can stay at 0)."; return; } st.checked = true; save(); redraw(); };
      const f = $("[data-gfix]", root); if (f) f.onclick = () => { st.checked = false; save(); redraw(); };
    },
    score(b, st) { const v = st.v || {}, right = SOL.filter(s => Math.abs((v[s.k] ?? 0) - s.pct) <= 5).length; return { max: b.max || 3, pts: st.checked ? Math.round((b.max || 3) * right / 6) : 0, label: "graph" }; },
    text(b, st) { return "Graph: " + SOL.map(s => `${s.short}=${(st.v || {})[s.k] ?? 0}%`).join(", "); }
  };
});
