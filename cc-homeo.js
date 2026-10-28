/* =====================================================================
   HOMEOSTASIS LAB BLOCK (no need to edit)
   glucosim : a blood-sugar simulator. Students pick a scenario, run 4 hours,
              watch glucose, insulin, and glucagon change on a live graph,
              read the glucose meter at 0, 1, 2, and 3 hours, record data,
              and identify the hormone and whether the body returned to range.
              Options: { title, max }
   Scenarios are simplified math models (made up for practice) that show the
   real pattern: in a healthy body, negative feedback brings glucose back
   toward about 90 mg/dL; without insulin (type 1 diabetes), it stays high.
   Fast test hook: window.GS_FAST = 1 (skips the animation time).
   ===================================================================== */
(window.CC_EXTS = window.CC_EXTS || []).push(function (BT, H) {
  const { $, $$ } = H;
  if (!document.getElementById("gs-css")) {
    const css = document.createElement("style"); css.id = "gs-css";
    css.textContent = `
    .gs{box-sizing:border-box;max-width:100%;border:3px solid var(--line);border-radius:22px;padding:14px 16px;background:var(--surface)}
    .gs h4{margin:0 0 6px}
    .gs-sc{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:8px;margin:8px 0}
    .gs-sc button{all:unset;cursor:pointer;border:3px solid var(--line);border-radius:16px;padding:8px 10px;background:var(--surface);display:grid;gap:2px;font-size:.86rem;line-height:1.3}
    .gs-sc button b{font-size:.95rem}.gs-sc button.on{border-color:var(--lc);background:color-mix(in srgb,var(--lc) 12%,var(--surface))}
    .gs-sc button.done::after{content:"✓ run";font-weight:800;color:#1d7a45;font-size:.78rem}
    .gs-main{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:12px;align-items:start}
    @media (max-width:860px){.gs-main{grid-template-columns:1fr}}
    .gs-plot{width:100%;height:auto;display:block;background:#fff;border:2px solid var(--line);border-radius:14px}
    .gs-body{display:grid;gap:8px}
    .gs-meter{border:3px solid #333;border-radius:16px;padding:8px 12px;background:#1f2a1f;color:#b6ffb0;font:700 1.6rem ui-monospace,monospace;text-align:center}
    .gs-meter small{display:block;font:700 .75rem var(--body);color:#d9ffd5}
    .gs-hb{display:grid;grid-template-columns:90px 1fr;gap:6px;align-items:center;font-weight:800;font-size:.85rem}
    .gs-hb div{height:14px;border-radius:999px;background:var(--soft);overflow:hidden}.gs-hb i{display:block;height:100%;border-radius:999px}
    .gs-times{display:flex;flex-wrap:wrap;gap:6px}.gs-times button{border:2px solid var(--line);border-radius:999px;background:var(--surface);font:inherit;font-weight:800;padding:4px 10px;cursor:pointer}
    .gs-times button.on{border-color:var(--lc);background:color-mix(in srgb,var(--lc) 15%,var(--surface))}
    .gs-msg{font-weight:800;min-height:1.2em}
    .gs-tw{overflow-x:auto;margin-top:10px}
    .gs-tbl{width:100%;border-collapse:collapse;font-size:.86rem;min-width:620px}
    .gs-tbl th,.gs-tbl td{border:1px solid var(--line);padding:5px;text-align:center;vertical-align:middle}.gs-tbl th{background:var(--soft)}
    .gs-tbl input{width:62px;font:inherit;font-weight:700;text-align:center;border:2px solid var(--line);border-radius:8px;padding:3px}
    .gs-tbl select{font:inherit;font-size:.82rem;max-width:150px;border:2px solid var(--line);border-radius:8px;padding:3px;background:var(--surface);color:var(--fg)}
    .gs-tbl td.ok{background:color-mix(in srgb,var(--ok) 16%,transparent)}.gs-tbl td.no{background:color-mix(in srgb,var(--bad) 14%,transparent)}`;
    document.head.appendChild(css);
  }
  const E = Math.E, pk = (t, T) => (t / T) * Math.exp(1 - t / T);
  /* scenario models: g(t) in mg/dL, t in hours; insulin/glucagon are relative levels 0–100 */
  const SC = [
    { k: "meal", name: "Healthy body: eats a big meal", short: "Healthy + meal", desc: "Eats a plate of rice, tortillas, and juice at time 0.", g: t => 90 + 60 * pk(t, 0.75), hormone: "Insulin", back: "Yes" },
    { k: "exer", name: "Healthy body: runs for 45 minutes", short: "Healthy + exercise", desc: "Skips a snack and runs at time 0. Muscles use glucose fast.", g: t => 90 - 22 * pk(t, 0.6), hormone: "Glucagon", back: "Yes" },
    { k: "t1", name: "Type 1 diabetes: eats a big meal, no insulin", short: "Type 1, no insulin", desc: "The pancreas cannot make insulin. Same meal at time 0.", g: t => 95 + 165 * (1 - Math.exp(-t / 1.2)), hormone: "Neither (no insulin made)", back: "No", noIns: true },
    { k: "t1i", name: "Type 1 diabetes: meal + insulin shot", short: "Type 1 + insulin shot", desc: "Same meal, but the person injects insulin with the meal.", g: t => 95 + 85 * pk(t, 0.9), hormone: "Insulin (injected)", back: "Yes", shot: true }
  ];
  const HORM = ["Insulin", "Glucagon", "Insulin (injected)", "Neither (no insulin made)"];
  const TIMES = [0, 1, 2, 3], TMAX = 4;
  const read = (s, t) => Math.round(s.g(t));
  const ins = (s, t) => s.noIns ? 2 : Math.max(3, Math.min(100, 6 + 1.4 * (s.g(t) - 90)));
  const glu = (s, t) => Math.max(3, Math.min(100, 6 + 3.2 * (90 - s.g(t))));
  function plot(s, tt) {
    const W = 460, Hh = 280, P = { l: 46, r: 12, t: 16, b: 36 }, X = t => P.l + t / TMAX * (W - P.l - P.r), Y = g => Hh - P.b - (g - 40) / (280 - 40) * (Hh - P.t - P.b);
    let g = `<rect x="${P.l}" y="${Y(140)}" width="${W - P.l - P.r}" height="${Y(70) - Y(140)}" fill="#1aa36f22"/><text x="${W - P.r - 4}" y="${Y(140) - 4}" font-size="10" text-anchor="end" fill="#1d7a45" font-weight="700">healthy range (70–140)</text>`;
    for (let v = 40; v <= 280; v += 40) g += `<line x1="${P.l}" x2="${W - P.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="#eee"/><text x="${P.l - 6}" y="${Y(v) + 4}" font-size="10" text-anchor="end" fill="#555">${v}</text>`;
    for (let t = 0; t <= TMAX; t++) g += `<text x="${X(t)}" y="${Hh - P.b + 14}" font-size="10" text-anchor="middle" fill="#555">${t} h</text>`;
    g += `<line x1="${P.l}" x2="${W - P.r}" y1="${Hh - P.b}" y2="${Hh - P.b}" stroke="#555"/><line x1="${P.l}" x2="${P.l}" y1="${P.t}" y2="${Hh - P.b}" stroke="#555"/>`;
    g += `<line x1="${P.l}" x2="${W - P.r}" y1="${Y(90)}" y2="${Y(90)}" stroke="#888" stroke-dasharray="4 4"/><text x="${P.l + 4}" y="${Y(90) - 4}" font-size="10" fill="#666">set point ≈ 90</text>`;
    g += `<text x="${(P.l + W - P.r) / 2}" y="${Hh - 6}" font-size="11" text-anchor="middle" fill="#333" font-weight="700">Time (hours)</text><text transform="translate(12 ${(P.t + Hh - P.b) / 2}) rotate(-90)" font-size="11" text-anchor="middle" fill="#333" font-weight="700">Blood glucose (mg/dL)</text>`;
    if (s && tt > 0) { let d = ""; const n = Math.max(2, Math.round(80 * tt / TMAX)); for (let i = 0; i <= n; i++) { const t = tt * i / n; d += (i ? "L" : "M") + X(t).toFixed(1) + " " + Y(s.g(t)).toFixed(1); }
      g += `<path d="${d}" fill="none" stroke="#d0453a" stroke-width="3.5"/><circle cx="${X(tt)}" cy="${Y(s.g(tt))}" r="5" fill="#d0453a"/>`;
      if (s.shot) g += `<text x="${X(0) + 4}" y="${P.t + 12}" font-size="10" fill="#2b7de9" font-weight="700">💉 insulin shot at 0 h</text>`; }
    return `<svg class="gs-plot" viewBox="0 0 ${W} ${Hh}" role="img" aria-label="Graph of blood glucose over 4 hours">${g}</svg>`;
  }
  /* blood-vessel view: one dot ≈ 10 mg/dL of glucose */
  function vessel(gl) { const n = Math.max(0, Math.round(gl / 10)); let d = "";
    for (let i = 0; i < n; i++) { const x = 16 + (i * 53) % 228, y = 22 + (i * 29) % 34; d += `<polygon points="${x},${y - 5} ${x + 5},${y - 2} ${x + 5},${y + 3} ${x},${y + 6} ${x - 5},${y + 3} ${x - 5},${y - 2}" fill="#f2b705" stroke="#a07c00" stroke-width="1"/>`; }
    for (let i = 0; i < 5; i++) d += `<ellipse cx="${30 + i * 50}" cy="${40 + (i % 2) * 8}" rx="9" ry="6" fill="#d0453a" opacity=".55"/>`;
    return `<svg viewBox="0 0 260 78" style="width:100%;height:auto;display:block;background:#fff;border:2px solid var(--line);border-radius:12px" role="img" aria-label="Blood vessel with ${n} glucose molecules"><rect x="4" y="10" width="252" height="52" rx="26" fill="#fde3e0" stroke="#d0453a" stroke-width="2"/>${d}<text x="130" y="74" font-size="9" text-anchor="middle" fill="#333" font-weight="700">⬢ = glucose (glucosa), about 10 mg/dL each</text></svg>`; }
  function twoTap(btn, fn) { btn.onclick = () => { if (!btn.dataset.sure) { btn.dataset.sure = "1"; const t = btn.textContent; btn.textContent = "⚠️ Tap again to reset"; setTimeout(() => { if (btn.isConnected) { delete btn.dataset.sure; btn.textContent = t; } }, 4000); return; } fn(); }; }

  BT.glucosim = {
    html(b, st) {
      if (st.going && !window.__gsRunning) st.going = false;
      const s = SC.find(x => x.k === st.on), ran = st.ran || {}, tt = s ? (ran[s.k] ? TMAX : (st.tt || 0)) : 0, at = st.at ?? 0;
      const meter = s && ran[s.k] ? read(s, at) : null;
      let h = `<div class="gs"><h4>${b.title || "Blood Sugar Simulator"}</h4><p class="mu small">${b.how || "Choose a scenario, run 4 hours, then tap a time to read the glucose meter. Run all four scenarios."}</p>
        <div class="gs-sc">${SC.map(x => `<button class="${st.on === x.k ? "on" : ""} ${ran[x.k] ? "done" : ""}" data-gsc="${x.k}" ${st.going ? "disabled" : ""}><b>${x.name}</b><span class="mu">${x.desc}</span></button>`).join("")}</div>
        <div class="gs-main"><div>${plot(s, tt)}</div><div class="gs-body">
          ${s ? `<button class="btn" data-gsrun ${ran[s.k] || st.going ? "disabled" : ""}>${ran[s.k] ? "✅ 4 hours complete" : st.going ? "Running…" : "▶ Run 4 hours"}</button>` : `<p class="mu">👆 Choose a scenario to start.</p>`}
          <div data-gsv>${vessel(s ? (ran[s.k] ? read(s, at) : s.g(tt)) : 90)}</div>
          <div class="gs-meter"><small>GLUCOSE METER${s && ran[s.k] ? ` · at ${at} h` : ""}</small><span data-gsm>${meter == null ? "--- " : meter} mg/dL</span></div>
          ${s && ran[s.k] ? `<div class="gs-times"><span class="mu small" style="width:100%">Read the meter at:</span>${TIMES.map(t => `<button class="${at === t ? "on" : ""}" data-gst="${t}">${t} h</button>`).join("")}</div>` : ""}
          <div class="gs-hb"><span>🟦 Insulin</span><div><i data-gsi style="width:${s && tt ? ins(s, Math.min(tt, ran[s.k] ? at : tt)) : 3}%;background:#2b7de9"></i></div><span>🟧 Glucagon</span><div><i data-gsg style="width:${s && tt ? glu(s, Math.min(tt, ran[s.k] ? at : tt)) : 3}%;background:#e08a00"></i></div></div>
          <p class="mu small">The bars show how much of each hormone the pancreas is releasing${s && ran[s.k] ? ` at ${at} h` : ""}.</p>
        </div></div>`;
      const r = st.r || {}, chk = !!st.checked, allRan = SC.every(x => ran[x.k]);
      const cell = (ok, inner) => `<td class="${chk ? (ok ? "ok" : "no") : ""}">${inner}</td>`;
      h += `<div class="gs-tw"><table class="gs-tbl"><thead><tr><th>Scenario</th>${TIMES.map(t => `<th>${t} h</th>`).join("")}<th>Hormone released</th><th>Back in range by 3 h?</th></tr></thead><tbody>` +
        SC.map(x => { const v = r[x.k] || {};
          return `<tr><td style="text-align:left"><b>${x.short}</b></td>${TIMES.map(t => cell(Math.abs(+v["t" + t] - read(x, t)) <= 3 && v["t" + t] !== "" && v["t" + t] != null, `<input inputmode="numeric" data-gsf="${x.k}|t${t}" value="${v["t" + t] ?? ""}" ${chk ? "disabled" : ""} aria-label="${x.short} at ${t} hours">`)).join("")}
            ${cell(v.h === x.hormone, `<select data-gsf="${x.k}|h" ${chk ? "disabled" : ""}><option value="">Choose…</option>${HORM.map(o => `<option ${v.h === o ? "selected" : ""}>${o}</option>`).join("")}</select>`)}
            ${cell(v.b === x.back, `<select data-gsf="${x.k}|b" ${chk ? "disabled" : ""}><option value="">…</option>${["Yes", "No"].map(o => `<option ${v.b === o ? "selected" : ""}>${o}</option>`).join("")}</select>`)}</tr>`; }).join("") + `</tbody></table></div>`;
      h += chk ? `<p class="score">Data recorded correctly: <b>${BT.glucosim.right(st)} / ${SC.length * 6}</b>. Green = correct. Readings within 3 mg/dL count.</p><div class="btnrow"><button class="btn ghost" data-gsfix>✏️ Fix my red boxes</button><button class="btn ghost" data-gsreset>↺ Reset the lab</button></div>`
        : `<div class="btnrow"><button class="btn" data-gscheck>Check my data table</button><button class="btn ghost" data-gsreset>↺ Reset the lab</button><span class="msg">${allRan ? "" : "Run all four scenarios and record your readings."}</span></div>`;
      return h + `</div>`;
    },
    right(st) { const r = st.r || {}; let n = 0; SC.forEach(x => { const v = r[x.k] || {}; TIMES.forEach(t => { if (v["t" + t] !== "" && v["t" + t] != null && Math.abs(+v["t" + t] - read(x, t)) <= 3) n++; }); if (v.h === x.hormone) n++; if (v.b === x.back) n++; }); return n; },
    wire(root, b, st, save, redraw) {
      $$("[data-gsc]", root).forEach(x => x.onclick = () => { if (st.going) return; st.on = x.dataset.gsc; st.tt = 0; st.at = 0; save(); redraw(); });
      $$("[data-gst]", root).forEach(x => x.onclick = () => { st.at = +x.dataset.gst; save(); redraw(); });
      $$("[data-gsf]", root).forEach(x => { const ev = x.tagName === "SELECT" ? "change" : "input"; x.addEventListener(ev, () => { const [k, f] = x.dataset.gsf.split("|"); st.r = st.r || {}; (st.r[k] = st.r[k] || {})[f] = x.value.trim(); save(); }); });
      const go = $("[data-gsrun]", root);
      if (go) go.onclick = () => {
        const s = SC.find(x => x.k === st.on); if (!s) return;
        st.going = true; window.__gsRunning = true; go.disabled = true; go.textContent = "Running…";
        const t0 = performance.now(), dur = window.GS_FAST ? 200 : 6000;
        const step = now => {
          if (!root.isConnected) { window.__gsRunning = false; st.going = false; return; }
          const tt = Math.min(TMAX, (now - t0) / dur * TMAX);
          const pl = $(".gs-plot", root); if (pl) pl.outerHTML = plot(s, tt);
          const m = $("[data-gsm]", root); if (m) m.textContent = Math.round(s.g(tt)) + " mg/dL";
          const bi = $("[data-gsi]", root); if (bi) bi.style.width = ins(s, tt) + "%";
          const bg = $("[data-gsg]", root); if (bg) bg.style.width = glu(s, tt) + "%";
          const vv = $("[data-gsv]", root); if (vv) vv.innerHTML = vessel(s.g(tt));
          if (tt < TMAX) requestAnimationFrame(step); else { (st.ran = st.ran || {})[s.k] = true; st.going = false; window.__gsRunning = false; st.at = 0; save(); redraw(); }
        };
        requestAnimationFrame(step);
      };
      const fx = $("[data-gsfix]", root); if (fx) fx.onclick = () => { st.checked = false; save(); redraw(); };
      const rs = $("[data-gsreset]", root); if (rs) twoTap(rs, () => { st.ran = {}; st.r = {}; st.on = null; st.tt = 0; st.at = 0; st.checked = false; st.going = false; window.__gsRunning = false; save(); redraw(); });
      const c = $("[data-gscheck]", root);
      if (c) c.onclick = () => { const r = st.r || {}; if (!SC.every(x => (st.ran || {})[x.k])) { $(".msg", root).textContent = "Run all four scenarios first."; return; }
        if (SC.some(x => { const v = r[x.k] || {}; return TIMES.some(t => v["t" + t] == null || v["t" + t] === "") || !v.h || !v.b; })) { $(".msg", root).textContent = "Fill in every box first."; return; }
        st.checked = true; save(); redraw(); };
    },
    score(b, st) { return { max: b.max || 6, pts: st.checked ? Math.round((b.max || 6) * BT.glucosim.right(st) / (SC.length * 6)) : 0, label: b.label || "blood sugar data" }; },
    text(b, st) { const r = st.r || {}; return SC.map(x => { const v = r[x.k] || {}; return `${x.short}: ${TIMES.map(t => v["t" + t] || "-").join("/")} ${v.h || "-"} ${v.b || "-"}`; }).join(" | "); }
  };
  window.GS_DATA = SC.map(x => ({ k: x.k, vals: TIMES.map(t => read(x, t)), hormone: x.hormone, back: x.back }));
});
