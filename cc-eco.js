/* =====================================================================
   ECOLOGY LAB BLOCK (no need to edit)
   ppsim : a predator–prey simulator (snowshoe hares and Canada lynx).
           Students pick a scenario, run 30 years, watch the populations on a
           live graph and in the forest, survey any year, and record data.
           Scenarios: natural forest · remove all lynx · trappers catch lynx.
           Options: { title, max }
   The model is the classic Lotka–Volterra predator–prey model (with a food
   limit for hares when lynx are removed). It is simplified, but it shows the
   real pattern in the Hudson’s Bay Company fur records: hare numbers rise
   and fall in cycles of about 10 years, and lynx follow a year or two later.
   Fast test hook: window.PP_FAST = 1 (skips the animation time).
   ===================================================================== */
(window.CC_EXTS = window.CC_EXTS || []).push(function (BT, H) {
  const { $, $$ } = H;
  if (!document.getElementById("pp-css")) {
    const css = document.createElement("style"); css.id = "pp-css";
    css.textContent = `
    .pp{box-sizing:border-box;max-width:100%;border:3px solid var(--line);border-radius:22px;padding:14px 16px;background:var(--surface)}
    .pp h4{margin:0 0 6px}
    .pp-sc{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:8px;margin:8px 0}
    .pp-sc button{all:unset;cursor:pointer;border:3px solid var(--line);border-radius:16px;padding:8px 10px;background:var(--surface);display:grid;gap:2px;font-size:.86rem;line-height:1.3}
    .pp-sc button.on{border-color:var(--lc);background:color-mix(in srgb,var(--lc) 12%,var(--surface))}.pp-sc button.done::after{content:"✓ run";font-weight:800;color:#1d7a45;font-size:.78rem}
    .pp-sc button:hover{border-color:var(--lc)}
    .pp-step{margin:6px 0 0;font-size:.92rem}
    .pp-run{width:100%;font-size:1.05rem;padding:12px 16px;margin-bottom:8px}.pp-run.go{animation:pppulse 1.6s ease-in-out infinite}
    @keyframes pppulse{0%,100%{box-shadow:0 0 0 0 color-mix(in srgb,var(--lc) 45%,transparent)}50%{box-shadow:0 0 0 8px transparent}}
    .pp-main{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:12px;align-items:start}
    @media (max-width:860px){.pp-main{grid-template-columns:1fr}}
    .pp-plot{width:100%;height:auto;display:block;background:#fff;border:2px solid var(--line);border-radius:14px}
    .pp-forest{border-radius:14px;background:linear-gradient(#dff3ff,#eaf8e6 55%,#cfe8c4);border:2px solid var(--line);padding:8px;min-height:120px;line-height:1.5;font-size:1.05rem;word-break:break-all}
    .pp-forest .row{min-height:1.5em}
    .pp-forest .lab{display:block;font:800 .78rem var(--body);color:#2b3b2b;margin-top:4px;word-break:normal}
    .pp-cnt{border:2px solid var(--line);border-radius:14px;padding:8px 10px;background:var(--soft);font-weight:800;display:grid;gap:3px;margin-top:8px}
    .pp-cnt input[type=range]{width:100%}
    .pp-tw{overflow-x:auto;margin-top:10px}
    .pp-tbl{width:100%;border-collapse:collapse;font-size:.86rem;min-width:560px}
    .pp-tbl th,.pp-tbl td{border:1px solid var(--line);padding:5px;text-align:center}.pp-tbl th{background:var(--soft)}
    .pp-tbl input{width:58px;font:inherit;font-weight:700;text-align:center;border:2px solid var(--line);border-radius:8px;padding:3px}
    .pp-tbl td.ok{background:color-mix(in srgb,var(--ok) 16%,transparent)}.pp-tbl td.no{background:color-mix(in srgb,var(--bad) 14%,transparent)}`;
    document.head.appendChild(css);
  }
  const Y = 30, YRS = [0, 3, 6, 9, 12];
  function sim(o) { let h = 80, l = o.L0; const out = [[h, l]], f = (h, l) => [1.0 * h * (1 - h / o.K) - 0.11 * h * l, 0.011 * h * l - o.g * l], dt = 0.02;
    for (let y = 1; y <= Y; y++) { for (let s = 0; s < 50; s++) { const k1 = f(h, l), k2 = f(h + dt / 2 * k1[0], l + dt / 2 * k1[1]), k3 = f(h + dt / 2 * k2[0], l + dt / 2 * k2[1]), k4 = f(h + dt * k3[0], l + dt * k3[1]); h += dt / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); l += dt / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]); } out.push([h, l]); }
    return out.map(p => [Math.round(p[0]), Math.round(p[1])]); }
  const SC = [
    { k: "nat", name: "Natural forest", desc: "Hares eat plants. Lynx eat hares. Start: 80 thousand hares, 3 hundred lynx.", data: sim({ K: 1e12, g: 0.6, L0: 3 }) },
    { k: "none", name: "Remove all lynx", desc: "Every lynx is removed at year 0. Hares are limited only by their food supply.", data: sim({ K: 400, g: 0.6, L0: 0 }) },
    { k: "trap", name: "Trappers catch lynx", desc: "Fur trappers catch lynx every year, so more lynx die each year than in the natural forest.", data: sim({ K: 1e12, g: 1.0, L0: 3 }) }
  ];
  function plot(s, yy) {
    const HM = s && s.k === "none" ? 420 : 220, HS = HM > 300 ? 100 : 50, W = 500, Hh = 290, P = { l: 50, r: 48, t: 22, b: 36 }, X = y => P.l + y / Y * (W - P.l - P.r), YH = v => Hh - P.b - v / HM * (Hh - P.t - P.b), YL = v => Hh - P.b - v / 25 * (Hh - P.t - P.b);
    let g = "";
    for (let v = 0; v <= HM - 20; v += HS) g += `<line x1="${P.l}" x2="${W - P.r}" y1="${YH(v)}" y2="${YH(v)}" stroke="#eee"/><text x="${P.l - 6}" y="${YH(v) + 4}" font-size="10" text-anchor="end" fill="#8a5a00">${v}</text>`;
    for (let v = 0; v <= 25; v += 5) g += `<text x="${W - P.r + 6}" y="${YL(v) + 4}" font-size="10" fill="#6a3fb5">${v}</text>`;
    for (let y = 0; y <= Y; y += 5) g += `<text x="${X(y)}" y="${Hh - P.b + 14}" font-size="10" text-anchor="middle" fill="#555">${y}</text>`;
    g += `<line x1="${P.l}" x2="${W - P.r}" y1="${Hh - P.b}" y2="${Hh - P.b}" stroke="#555"/><line x1="${P.l}" x2="${P.l}" y1="${P.t}" y2="${Hh - P.b}" stroke="#555"/><line x1="${W - P.r}" x2="${W - P.r}" y1="${P.t}" y2="${Hh - P.b}" stroke="#555"/>`;
    g += `<text x="${(P.l + W - P.r) / 2}" y="${Hh - 6}" font-size="11" text-anchor="middle" font-weight="700" fill="#333">Year</text><text transform="translate(13 ${(P.t + Hh - P.b) / 2}) rotate(-90)" font-size="11" text-anchor="middle" font-weight="700" fill="#8a5a00">Hares (thousands)</text><text transform="translate(${W - 10} ${(P.t + Hh - P.b) / 2}) rotate(90)" font-size="11" text-anchor="middle" font-weight="700" fill="#6a3fb5">Lynx (hundreds)</text>`;
    g += `<rect x="${P.l + 6}" y="4" width="12" height="4" fill="#e08a00"/><text x="${P.l + 22}" y="10" font-size="10" font-weight="700" fill="#8a5a00">hares</text><rect x="${P.l + 66}" y="4" width="12" height="4" fill="#8a54e0"/><text x="${P.l + 82}" y="10" font-size="10" font-weight="700" fill="#6a3fb5">lynx</text>`;
    if (s && yy > 0) { const n = Math.floor(yy); let dh = "", dl = "";
      for (let y = 0; y <= n; y++) { dh += (y ? "L" : "M") + X(y) + " " + YH(s.data[y][0]); dl += (y ? "L" : "M") + X(y) + " " + YL(s.data[y][1]); }
      g += `<path d="${dh}" fill="none" stroke="#e08a00" stroke-width="3"/><path d="${dl}" fill="none" stroke="#8a54e0" stroke-width="3" stroke-dasharray="${s.k === "none" ? "0" : "0"}"/>`; }
    return `<svg class="pp-plot" viewBox="0 0 ${W} ${Hh}" role="img" aria-label="Graph of hare and lynx populations over 30 years">${g}</svg>`;
  }
  const forest = (h, l) => `<div class="pp-forest"><div class="row">${"🐇".repeat(Math.max(0, Math.round(h / 12))) || "&nbsp;"}</div><span class="lab">🐇 = about 12 thousand hares</span><div class="row">${"🐈".repeat(Math.max(0, Math.round(l / 1.5))) || "&nbsp;"}</div><span class="lab">🐈 = about 150 lynx</span></div>`;
  function twoTap(btn, fn) { btn.onclick = () => { if (!btn.dataset.sure) { btn.dataset.sure = "1"; const t = btn.textContent; btn.textContent = "⚠️ Tap again to reset"; setTimeout(() => { if (btn.isConnected) { delete btn.dataset.sure; btn.textContent = t; } }, 4000); return; } fn(); }; }
  const NEED = [["nat", "h"], ["nat", "l"], ["none", "h"]];
  BT.ppsim = {
    html(b, st) {
      if (st.going && !window.__ppRunning) st.going = false;
      if (!st.on) st.on = SC[0].k;                              /* start with the natural forest picked, so the Run button shows */
      const s = SC.find(x => x.k === st.on), ran = st.ran || {}, yy = s ? (ran[s.k] ? Y : 0) : 0, sv = st.sv ?? 0, cur = s && ran[s.k] ? s.data[sv] : s ? s.data[0] : [0, 0];
      let h = `<div class="pp"><h4>${b.title || "Forest Simulator: Hares and Lynx"}</h4><p class="mu small">${b.how || "Choose a scenario and run 30 years. Then slide the survey year to count the animals in any year."}</p>
        <p class="pp-step"><b>Step 1:</b> Tap a scenario. <b>Step 2:</b> Press ▶ Run 30 years.</p><div class="pp-sc">${SC.map(x => `<button type="button" class="${st.on === x.k ? "on" : ""} ${ran[x.k] ? "done" : ""}" data-ppc="${x.k}" ${st.going ? "disabled" : ""}><b>${st.on === x.k ? "✔ " : ""}${x.name}</b><span class="mu">${x.desc}</span></button>`).join("")}</div>
        <div class="pp-main"><div>${plot(s, yy)}</div><div>
          ${s ? `<button type="button" class="btn pp-run ${ran[s.k] ? "" : "go"}" data-pprun ${ran[s.k] || st.going ? "disabled" : ""}>${ran[s.k] ? "✅ 30 years complete" : "▶ Run 30 years: " + s.name}</button>` : `<p class="mu">👆 Choose a scenario to start.</p>`}
          <div data-ppf>${forest(cur[0], cur[1])}</div>
          <div class="pp-cnt">${s && ran[s.k] ? `<label>Survey year: <b data-ppy>${sv}</b><input type="range" min="0" max="${Y}" step="1" value="${sv}" data-ppsv aria-label="Survey year"></label>` : `<span>Survey year: <b data-ppy>${s ? (st.going ? "running" : 0) : "-"}</b></span>`}
            <span>🐇 Hares: <b data-pph>${s ? cur[0] : "-"}</b> thousand</span><span>🐈 Lynx: <b data-ppl>${s ? cur[1] : "-"}</b> hundred</span></div>
        </div></div>`;
      const r = st.r || {}, chk = !!st.checked;
      const cell = (k, f, i, ans) => { const v = ((r[k] || {})[f] || [])[i]; const ok = v !== "" && v != null && Math.abs(+v - ans) <= 1;
        return `<td class="${chk ? (ok ? "ok" : "no") : ""}"><input inputmode="numeric" data-ppd="${k}|${f}|${i}" value="${v ?? ""}" ${chk ? "disabled" : ""} aria-label="${k} ${f} year ${YRS[i]}"></td>`; };
      h += `<div class="pp-tw"><table class="pp-tbl"><thead><tr><th>Survey year</th>${YRS.map(y => `<th>${y}</th>`).join("")}</tr></thead><tbody>
        <tr><td style="text-align:left"><b>Natural forest:</b> hares (thousands)</td>${YRS.map((y, i) => cell("nat", "h", i, SC[0].data[y][0])).join("")}</tr>
        <tr><td style="text-align:left"><b>Natural forest:</b> lynx (hundreds)</td>${YRS.map((y, i) => cell("nat", "l", i, SC[0].data[y][1])).join("")}</tr>
        <tr><td style="text-align:left"><b>No lynx:</b> hares (thousands)</td>${YRS.map((y, i) => cell("none", "h", i, SC[1].data[y][0])).join("")}</tr></tbody></table></div>`;
      h += chk ? `<p class="score">Data recorded correctly: <b>${BT.ppsim.right(st)} / 15</b>. Green = correct.</p><div class="btnrow"><button class="btn ghost" data-ppfix>✏️ Fix my red boxes</button><button class="btn ghost" data-ppreset>↺ Reset the simulator</button></div>`
        : `<div class="btnrow"><button class="btn" data-ppcheck>Check my data table</button><button class="btn ghost" data-ppreset>↺ Reset the simulator</button><span class="msg">${ran.nat && ran.none ? "" : "Run the natural forest and the no-lynx scenario to fill in the table."}</span></div>`;
      return h + `</div>`;
    },
    right(st) { const r = st.r || {}; let n = 0; NEED.forEach(([k, f]) => YRS.forEach((y, i) => { const v = ((r[k] || {})[f] || [])[i], ans = SC.find(x => x.k === k).data[y][f === "h" ? 0 : 1]; if (v !== "" && v != null && Math.abs(+v - ans) <= 1) n++; })); return n; },
    wire(root, b, st, save, redraw) {
      $$("[data-ppc]", root).forEach(x => x.onclick = () => { if (st.going) return; st.on = x.dataset.ppc; st.sv = 0; save(); redraw(); });
      const sl = $("[data-ppsv]", root);
      if (sl) sl.oninput = () => { st.sv = +sl.value; const s = SC.find(x => x.k === st.on), d = s.data[st.sv]; $("[data-ppy]", root).textContent = st.sv; $("[data-pph]", root).textContent = d[0]; $("[data-ppl]", root).textContent = d[1]; $("[data-ppf]", root).innerHTML = forest(d[0], d[1]); save(); };
      $$("[data-ppd]", root).forEach(x => x.addEventListener("input", () => { const [k, f, i] = x.dataset.ppd.split("|"); st.r = st.r || {}; st.r[k] = st.r[k] || {}; (st.r[k][f] = st.r[k][f] || [])[+i] = x.value.trim(); save(); }));
      const go = $("[data-pprun]", root);
      if (go) go.onclick = () => {
        const s = SC.find(x => x.k === st.on); if (!s) return;
        st.going = true; window.__ppRunning = true; go.disabled = true; go.classList.remove("go"); go.textContent = "Running… watch the forest and the graph";
        const t0 = performance.now(), dur = window.PP_FAST ? 200 : 7500;
        const step = now => {
          if (!root.isConnected) { window.__ppRunning = false; st.going = false; return; }
          const yy = Math.min(Y, (now - t0) / dur * Y), y = Math.floor(yy), d = s.data[y];
          const pl = $(".pp-plot", root); if (pl) pl.outerHTML = plot(s, yy);
          $("[data-ppy]", root).textContent = y; $("[data-pph]", root).textContent = d[0]; $("[data-ppl]", root).textContent = d[1]; $("[data-ppf]", root).innerHTML = forest(d[0], d[1]);
          if (yy < Y) requestAnimationFrame(step); else { (st.ran = st.ran || {})[s.k] = true; st.going = false; window.__ppRunning = false; st.sv = 0; save(); redraw(); }
        };
        requestAnimationFrame(step);
      };
      const fx = $("[data-ppfix]", root); if (fx) fx.onclick = () => { st.checked = false; save(); redraw(); };
      const rs = $("[data-ppreset]", root); if (rs) twoTap(rs, () => { st.ran = {}; st.r = {}; st.on = null; st.sv = 0; st.checked = false; st.going = false; window.__ppRunning = false; save(); redraw(); });
      const c = $("[data-ppcheck]", root);
      if (c) c.onclick = () => { const ran = st.ran || {}; if (!ran.nat || !ran.none) { $(".msg", root).textContent = "Run the natural forest and the no-lynx scenario first."; return; }
        const r = st.r || {}; if (NEED.some(([k, f]) => YRS.some((y, i) => { const v = ((r[k] || {})[f] || [])[i]; return v == null || v === ""; }))) { $(".msg", root).textContent = "Fill in every box first."; return; }
        st.checked = true; save(); redraw(); };
    },
    score(b, st) { return { max: b.max || 6, pts: st.checked ? Math.round((b.max || 6) * BT.ppsim.right(st) / 15) : 0, label: b.label || "population data" }; },
    text(b, st) { const r = st.r || {}; return NEED.map(([k, f]) => `${k}-${f}: ${((r[k] || {})[f] || []).join("/")}`).join(" | "); }
  };
  window.PP_DATA = { nat: YRS.map(y => SC[0].data[y]), none: YRS.map(y => SC[1].data[y]), yrs: YRS, all: SC.map(s => ({ k: s.k, d: s.data })) };
});
