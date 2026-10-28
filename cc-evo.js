/* =====================================================================
   EVIDENCE OF EVOLUTION LAB BLOCKS (no need to edit)
   fossildig  : a cliff of 5 rock layers. Students dig each layer, read the
                fossil card (age from radiometric dating, legs, nostrils,
                habitat), then fill a table: age order (law of superposition)
                and each feature. Based on the real whale fossil record.
                Options: { title, max }
   seqcompare : compare a simplified 20-amino-acid section of a protein
                (cytochrome c) between humans and 6 other species. Students
                tap the positions that differ, record the number of
                differences, and use it as evidence of relatedness.
                Options: { title, max }
   The sequences are SIMPLIFIED for practice; real cytochrome c is about 104
   amino acids long, but it shows the same pattern (closer relatives have
   fewer differences).
   ===================================================================== */
(window.CC_EXTS = window.CC_EXTS || []).push(function (BT, H) {
  const { $, $$ } = H;
  if (!document.getElementById("evo-css")) {
    const css = document.createElement("style"); css.id = "evo-css";
    css.textContent = `
    .ev{box-sizing:border-box;max-width:100%;border:3px solid var(--line);border-radius:22px;padding:14px 16px;background:var(--surface)}
    .ev h4{margin:0 0 6px}
    .ev-dig{display:grid;grid-template-columns:1fr;gap:12px;align-items:start}
    .ev-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px}.ev-cards .ev-card{margin:0}
    .ev-cliff{display:grid;gap:0;border-radius:16px;overflow:hidden;border:3px solid #6b5232}
    .ev-layer{display:flex;align-items:center;gap:10px;padding:8px 10px;min-height:54px;color:#2b1d0e;font-weight:800;font-size:.85rem}
    .ev-layer button{margin-left:auto}
    .ev-card{border:2px solid var(--line);border-radius:14px;padding:8px 10px;background:var(--soft);margin-bottom:8px}
    .ev-card b{display:block}.ev-card .mu{font-size:.82rem}
    .ev-card svg{width:100%;max-width:240px;height:auto;display:block;background:#fff;border-radius:10px;margin:4px 0}
    .ev-tw{overflow-x:auto;margin-top:10px}
    .ev-tbl{width:100%;border-collapse:collapse;font-size:.85rem;min-width:620px}
    .ev-tbl th,.ev-tbl td{border:1px solid var(--line);padding:5px;text-align:center;vertical-align:middle}.ev-tbl th{background:var(--soft)}
    .ev-tbl select,.ev-tbl input{font:inherit;font-size:.82rem;max-width:170px;border:2px solid var(--line);border-radius:8px;padding:3px;background:var(--surface);color:var(--fg)}
    .ev-tbl input{width:60px;text-align:center;font-weight:700}
    .ev-tbl td.ok{background:color-mix(in srgb,var(--ok) 16%,transparent)}.ev-tbl td.no{background:color-mix(in srgb,var(--bad) 14%,transparent)}
    .ev-sp{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}
    .ev-sp button{border:2px solid var(--line);border-radius:999px;background:var(--surface);font:inherit;font-weight:800;padding:4px 12px;cursor:pointer}
    .ev-sp button.on{border-color:var(--lc);background:color-mix(in srgb,var(--lc) 15%,var(--surface))}.ev-sp button.done{border-color:#1d7a45}
    .ev-seq{overflow-x:auto;padding:4px 0}
    .ev-row{display:flex;gap:3px;align-items:center;margin:3px 0;white-space:nowrap}
    .ev-row .lbl{min-width:96px;font-weight:800;font-size:.82rem}
    .ev-aa{width:26px;height:30px;border:2px solid var(--line);border-radius:6px;display:grid;place-items:center;font:700 .9rem ui-monospace,monospace;background:var(--surface);color:var(--fg);flex:0 0 auto}
    button.ev-aa{cursor:pointer;padding:0}button.ev-aa.mk{background:#ffd9d4;border-color:#d0453a;color:#8a1f12}
    .ev-num{font-size:.7rem;color:var(--muted);width:26px;text-align:center;flex:0 0 auto}`;
    document.head.appendChild(css);
  }
  function twoTap(btn, fn) { btn.onclick = () => { if (!btn.dataset.sure) { btn.dataset.sure = "1"; const t = btn.textContent; btn.textContent = "⚠️ Tap again to reset"; setTimeout(() => { if (btn.isConnected) { delete btn.dataset.sure; btn.textContent = t; } }, 4000); return; } fn(); }; }

  /* ---------- fossil data (real whale fossil record, ages approximate) ---------- */
  const LEGS = ["Long legs for walking", "Big webbed back feet", "Short back legs", "Tiny back legs (not for walking)", "No back legs (small hip bones only)"];
  const NOSE = ["Tip of the snout", "Partway back", "Top of the head (blowhole)"];
  const HAB = ["Land", "Land and water", "Mostly water", "Water only"];
  const FOS = [ // listed bottom (oldest) to top (youngest)
    { k: "pak", name: "Pakicetus", age: "about 50 million years", rank: 1, legs: 0, nose: 0, hab: 0, note: "Wolf-sized. Its ear bones have a shape found only in whales.", body: 70, leg: 26, tail: 0, nx: 0 },
    { k: "amb", name: "Ambulocetus", age: "about 49 million years", rank: 2, legs: 1, nose: 0, hab: 1, note: "“Walking whale.” Hunted at the water’s edge, like a crocodile.", body: 90, leg: 18, tail: 0, nx: 0 },
    { k: "rod", name: "Rodhocetus", age: "about 47 million years", rank: 3, legs: 2, nose: 1, hab: 2, note: "Hips were weakly attached. Probably swam by moving its hips and tail.", body: 100, leg: 10, tail: 1, nx: 0.35 },
    { k: "dor", name: "Dorudon", age: "about 40 million years", rank: 4, legs: 3, nose: 1, hab: 3, note: "Fully aquatic with front flippers. Its tiny back legs could not hold up its body.", body: 120, leg: 4, tail: 2, nx: 0.45 },
    { k: "mod", name: "Humpback whale (living today)", age: "living today (0 years)", rank: 5, legs: 4, nose: 2, hab: 3, note: "Has small hip bones inside its body that are not attached to any legs (a vestigial structure).", body: 140, leg: 0, tail: 2, nx: 0.8 }
  ];
  const ORDER = ["dor", "pak", "mod", "amb", "rod"]; /* table order (mixed up on purpose) */
  const LAYER_COL = ["#e9d8b4", "#d8bd8a", "#c9a26b", "#b5895a", "#9c7249"];
  function animal(f) {
    const cx = 120, cy = 60, L = f.body, x0 = cx - L / 2;
    let g = `<ellipse cx="${cx}" cy="${cy}" rx="${L / 2}" ry="${14 + (f.tail ? 4 : 0)}" fill="#cfd6de" stroke="#333" stroke-width="2"/>`;
    g += `<circle cx="${x0 + 10}" cy="${cy - 6}" r="3" fill="#333"/>`;
    const nx = x0 + 4 + f.nx * 40, ny = cy - (f.nx > 0.6 ? 16 : 6);
    g += `<circle cx="${nx}" cy="${ny}" r="4.5" fill="#d0453a"/>`;
    if (f.leg) { [x0 + 20, x0 + L - 22].forEach((x, i) => g += `<line x1="${x}" y1="${cy + 10}" x2="${x}" y2="${cy + 10 + (i ? f.leg : (f.tail >= 2 ? 6 : f.leg))}" stroke="#333" stroke-width="4" stroke-linecap="round"/>`); if (f.k === "amb") g += `<ellipse cx="${x0 + L - 22}" cy="${cy + 10 + f.leg}" rx="9" ry="3" fill="#333"/>`; }
    else g += `<path d="M${x0 + 18} ${cy + 8} q -8 14 4 16" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round"/>`;
    if (f.tail) g += `<path d="M${x0 + L} ${cy} l 18 -${f.tail * 7} l 0 ${f.tail * 14} z" fill="#cfd6de" stroke="#333" stroke-width="2"/>`;
    else g += `<line x1="${x0 + L}" y1="${cy}" x2="${x0 + L + 22}" y2="${cy + 8}" stroke="#333" stroke-width="3"/>`;
    g += `<text x="6" y="${112}" font-size="10" fill="#d0453a" font-weight="700">● nostril</text>`;
    return `<svg viewBox="0 0 240 120" role="img" aria-label="Drawing of ${f.name}">${g}</svg>`;
  }

  BT.fossildig = {
    html(b, st) {
      const dug = st.dug || {}, r = st.r || {}, chk = !!st.checked, top = [...FOS].reverse();
      let h = `<div class="ev"><h4>${b.title || "Dig Site: The Whale Cliff"}</h4><p class="mu small">${b.how || "Dig every layer. Rock layers form on top of each other, so the deepest layer is the oldest. Ages come from radiometric dating of volcanic ash near each fossil."}</p>
        <div class="ev-dig"><div class="ev-cliff">${top.map((f, i) => `<div class="ev-layer" style="background:${LAYER_COL[i]}"><span>${i === 0 ? "🌊 Top layer (sea floor / beach)" : i === top.length - 1 ? "⬇️ Deepest layer" : `Layer ${top.length - i}`}</span>${dug[f.k] ? `<span>🦴 ${f.name}</span>` : `<button class="btn sm" data-dig="${f.k}">⛏️ Dig</button>`}</div>`).join("")}</div>
        <div class="ev-cards">${FOS.filter(f => dug[f.k]).length ? top.filter(f => dug[f.k]).map(f => `<div class="ev-card"><b>${f.name}</b><span class="mu">Age: ${f.age}</span>${animal(f)}<span class="mu">${f.note}</span><br><span class="mu">Back legs: ${LEGS[f.legs]} · Nostrils: ${NOSE[f.nose]} · Lived: ${HAB[f.hab]}</span></div>`).join("") : `<p class="mu">👈 Tap ⛏️ Dig on any layer to uncover its fossil.</p>`}</div></div>`;
      const cell = (ok, inner) => `<td class="${chk ? (ok ? "ok" : "no") : ""}">${inner}</td>`;
      const sel = (k, f, list) => `<select data-evf="${k}|${f}" ${chk ? "disabled" : ""}><option value="">Choose…</option>${list.map((o, j) => `<option value="${j}" ${String(r[k] && r[k][f]) === String(j) ? "selected" : ""}>${o}</option>`).join("")}</select>`;
      h += `<div class="ev-tw"><table class="ev-tbl"><thead><tr><th>Fossil</th><th>Age order<br><span class="mu">1 = oldest</span></th><th>Back legs</th><th>Nostril position</th><th>Where it lived</th></tr></thead><tbody>` +
        ORDER.map(k => { const f = FOS.find(x => x.k === k), v = r[k] || {};
          return `<tr><td><b>${f.name}</b></td>${cell(+v.rank === f.rank, `<input inputmode="numeric" data-evf="${k}|rank" value="${v.rank ?? ""}" ${chk ? "disabled" : ""} aria-label="Age order of ${f.name}">`)}${cell(+v.legs === f.legs && v.legs !== "", sel(k, "legs", LEGS))}${cell(+v.nose === f.nose && v.nose !== "", sel(k, "nose", NOSE))}${cell(+v.hab === f.hab && v.hab !== "", sel(k, "hab", HAB))}</tr>`; }).join("") + `</tbody></table></div>`;
      h += chk ? `<p class="score">Correct: <b>${BT.fossildig.right(st)} / 20</b>. Green = correct.</p><div class="btnrow"><button class="btn ghost" data-evfix>✏️ Fix my red boxes</button><button class="btn ghost" data-evreset>↺ Reset the dig</button></div>`
        : `<div class="btnrow"><button class="btn" data-evcheck>Check my fossil table</button><span class="msg"></span></div>`;
      return h + `</div>`;
    },
    right(st) { const r = st.r || {}; let n = 0; FOS.forEach(f => { const v = r[f.k] || {}; if (+v.rank === f.rank) n++; ["legs", "nose", "hab"].forEach(x => { if (v[x] !== "" && v[x] != null && +v[x] === f[x]) n++; }); }); return n; },
    wire(root, b, st, save, redraw) {
      $$("[data-dig]", root).forEach(x => x.onclick = () => { (st.dug = st.dug || {})[x.dataset.dig] = true; save(); redraw(); });
      $$("[data-evf]", root).forEach(x => { const ev = x.tagName === "SELECT" ? "change" : "input"; x.addEventListener(ev, () => { const [k, f] = x.dataset.evf.split("|"); st.r = st.r || {}; (st.r[k] = st.r[k] || {})[f] = x.value.trim(); save(); }); });
      const fx = $("[data-evfix]", root); if (fx) fx.onclick = () => { st.checked = false; save(); redraw(); };
      const rs = $("[data-evreset]", root); if (rs) twoTap(rs, () => { st.dug = {}; st.r = {}; st.checked = false; save(); redraw(); });
      const c = $("[data-evcheck]", root);
      if (c) c.onclick = () => { if (FOS.some(f => !(st.dug || {})[f.k])) { $(".msg", root).textContent = "Dig every layer first."; return; }
        const r = st.r || {}; if (FOS.some(f => { const v = r[f.k] || {}; return ["rank", "legs", "nose", "hab"].some(x => v[x] == null || v[x] === ""); })) { $(".msg", root).textContent = "Fill in every box first."; return; }
        st.checked = true; save(); redraw(); };
    },
    score(b, st) { return { max: b.max || 5, pts: st.checked ? Math.round((b.max || 5) * BT.fossildig.right(st) / 20) : 0, label: b.label || "fossil table" }; },
    text(b, st) { const r = st.r || {}; return FOS.map(f => { const v = r[f.k] || {}; return `${f.name}: #${v.rank || "-"} ${LEGS[v.legs] || "-"}; ${NOSE[v.nose] || "-"}; ${HAB[v.hab] || "-"}`; }).join(" | "); }
  };
  window.EV_FOS = FOS.map(f => ({ k: f.k, rank: f.rank, legs: f.legs, nose: f.nose, hab: f.hab }));

  /* ---------- seqcompare ---------- */
  const REF = "GDVEKGKKIFVQKCAQCHTV".split("");
  const SWAP = { G: "A", D: "N", V: "I", E: "D", K: "R", I: "L", F: "Y", Q: "M", C: "S", A: "S", H: "N", T: "S" };
  const SP = [
    { k: "chimp", name: "Chimpanzee", d: [] },
    { k: "monkey", name: "Rhesus monkey", d: [11] },
    { k: "dog", name: "Dog", d: [2, 11, 14] },
    { k: "chicken", name: "Chicken", d: [2, 3, 11, 14, 19] },
    { k: "tuna", name: "Tuna", d: [1, 2, 3, 8, 11, 14, 17, 19] },
    { k: "yeast", name: "Baker’s yeast", d: [0, 1, 2, 3, 5, 8, 9, 11, 12, 14, 17, 19] }
  ].map(s => Object.assign(s, { seq: REF.map((a, i) => s.d.includes(i) ? SWAP[a] : a) }));
  BT.seqcompare = {
    html(b, st) {
      const on = SP.find(s => s.k === st.on), mk = (st.mk || {})[st.on] || [], r = st.r || {}, chk = !!st.checked;
      let h = `<div class="ev"><h4>${b.title || "Protein Detective: Cytochrome c"}</h4><p class="mu small">${b.how || "Choose a species. Compare its amino acids to the human sequence one position at a time. Tap every amino acid in the second row that is DIFFERENT, then record the number of differences."}</p>
        <div class="ev-sp">${SP.map(s => `<button class="${st.on === s.k ? "on" : ""} ${r[s.k] !== undefined && r[s.k] !== "" ? "done" : ""}" data-sp="${s.k}">${s.name}</button>`).join("")}</div>`;
      if (on) h += `<div class="ev-seq"><div class="ev-row"><span class="lbl"></span>${REF.map((_, i) => `<span class="ev-num">${i + 1}</span>`).join("")}</div>
          <div class="ev-row"><span class="lbl">Human</span>${REF.map(a => `<span class="ev-aa">${a}</span>`).join("")}</div>
          <div class="ev-row"><span class="lbl">${on.name}</span>${on.seq.map((a, i) => `<button class="ev-aa ${mk.includes(i) ? "mk" : ""}" data-aa="${i}" aria-pressed="${mk.includes(i)}" aria-label="Position ${i + 1}: ${a}">${a}</button>`).join("")}</div></div>
          <p class="mu small">Positions you marked as different: <b>${mk.length}</b>. Each letter stands for one amino acid.</p>`;
      else h += `<p class="mu">👆 Choose a species to compare.</p>`;
      const cell = (ok, inner) => `<td class="${chk ? (ok ? "ok" : "no") : ""}">${inner}</td>`;
      h += `<div class="ev-tw"><table class="ev-tbl" style="min-width:0"><thead><tr><th>Species</th><th>Differences from human<br><span class="mu">(out of 20)</span></th></tr></thead><tbody>${SP.map(s => `<tr><td><b>${s.name}</b></td>${cell(r[s.k] !== "" && r[s.k] != null && +r[s.k] === s.d.length, `<input inputmode="numeric" data-sqf="${s.k}" value="${r[s.k] ?? ""}" ${chk ? "disabled" : ""} aria-label="Differences for ${s.name}">`)}</tr>`).join("")}</tbody></table></div>`;
      h += chk ? `<p class="score">Correct: <b>${BT.seqcompare.right(st)} / ${SP.length}</b>.</p><div class="btnrow"><button class="btn ghost" data-sqfix>✏️ Fix my red boxes</button></div>` : `<div class="btnrow"><button class="btn" data-sqcheck>Check my counts</button><span class="msg"></span></div>`;
      return h + `</div>`;
    },
    right(st) { const r = st.r || {}; return SP.filter(s => r[s.k] !== "" && r[s.k] != null && +r[s.k] === s.d.length).length; },
    wire(root, b, st, save, redraw) {
      $$("[data-sp]", root).forEach(x => x.onclick = () => { st.on = x.dataset.sp; save(); redraw(); });
      $$("[data-aa]", root).forEach(x => x.onclick = () => { const i = +x.dataset.aa; st.mk = st.mk || {}; const m = st.mk[st.on] = st.mk[st.on] || []; const j = m.indexOf(i); if (j >= 0) m.splice(j, 1); else m.push(i); save(); redraw(); });
      $$("[data-sqf]", root).forEach(x => x.addEventListener("input", () => { (st.r = st.r || {})[x.dataset.sqf] = x.value.trim(); save(); }));
      const fx = $("[data-sqfix]", root); if (fx) fx.onclick = () => { st.checked = false; save(); redraw(); };
      const c = $("[data-sqcheck]", root); if (c) c.onclick = () => { const r = st.r || {}; if (SP.some(s => r[s.k] == null || r[s.k] === "")) { $(".msg", root).textContent = "Compare every species and fill in every box."; return; } st.checked = true; save(); redraw(); };
    },
    score(b, st) { return { max: b.max || 3, pts: st.checked ? Math.round((b.max || 3) * BT.seqcompare.right(st) / SP.length) : 0, label: b.label || "protein comparison" }; },
    text(b, st) { const r = st.r || {}; return SP.map(s => `${s.name}=${r[s.k] ?? "-"}`).join(", "); }
  };
  window.EV_SEQ = SP.map(s => ({ k: s.k, n: s.d.length }));
});
