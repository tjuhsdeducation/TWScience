/* =====================================================================
   MACROMOLECULE MYSTERY LAB BLOCKS (no need to edit)
   macrolab : test samples with 4 indicators (drag a dropper onto a tube,
              or tap the reagent, then the tube). Benedict's must be heated.
              Students record + / − in an evidence table.
   suspects : compare the stomach sample to each restaurant’s dish and accuse.
   ===================================================================== */
(window.CC_EXTS = window.CC_EXTS || []).push(function (BT, H) {
  const { $, $$, esc } = H;
  /* what each sample contains (simplified, typical classroom results) */
  const SAMPLES = {
    water: { name: "Distilled water", icon: "💧", note: "negative control", has: {} },
    glucose: { name: "Glucose solution", icon: "🍬", note: "positive control: simple sugar", has: { sugar: 1 } },
    starch: { name: "Starch solution", icon: "🥔", note: "positive control: starch", has: { starch: 1 } },
    egg: { name: "Egg white (albumin)", icon: "🥚", note: "positive control: protein", has: { protein: 1 } },
    oil: { name: "Vegetable oil", icon: "🫒", note: "positive control: lipid", has: { lipid: 1 } },
    vomit: { name: "Victor’s stomach sample", icon: "🤢", note: "EVIDENCE #1", has: { sugar: 1, protein: 1 } },
    r1: { name: "Smoothie Shack: Fresh Fruit Smoothie", icon: "🥤", note: "", has: { sugar: 1 } },
    r2: { name: "Fry Guys: Classic French Fries", icon: "🍟", note: "", has: { starch: 1, lipid: 1 } },
    r3: { name: "Steak Corral: Butter-Seared Steak", icon: "🥩", note: "", has: { protein: 1, lipid: 1 } },
    r4: { name: "Sweet Spud Café: Sweet Potato Fries with Honey", icon: "🍠", note: "", has: { sugar: 1, starch: 1, lipid: 1 } },
    r5: { name: "Sunrise Café: Nonfat Yogurt & Berry Parfait", icon: "🍓", note: "", has: { sugar: 1, protein: 1 } }
  };
  const TESTS = [
    { k: "benedict", name: "Benedict’s", for: "sugar", short: "sugar", macro: "simple sugar (glucose)", heat: true, neg: "#3b7ddd", pos: "#d9531e", negTxt: "stays blue", posTxt: "green → orange → brick red" },
    { k: "iodine", name: "Iodine", for: "starch", short: "starch", macro: "starch", neg: "#c8902a", pos: "#1f1640", negTxt: "stays yellow-brown", posTxt: "blue-black" },
    { k: "biuret", name: "Biuret", for: "protein", short: "protein", macro: "protein", neg: "#5a8fe6", pos: "#7b2fd0", negTxt: "stays blue", posTxt: "violet / purple" },
    { k: "sudan", name: "Sudan III", for: "lipid", short: "lipid", macro: "lipid (fat)", neg: "#e98aa0", pos: "#d0263a", negTxt: "evenly pink, no layer", posTxt: "red oil layer on top" }
  ];
  window.ML_SAMPLES = SAMPLES; window.ML_TESTS = TESTS;
  const say = t => { try { const u = new SpeechSynthesisUtterance(t); u.rate = .9; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) {} };

  if (!document.getElementById("mx-css")) {
    const css = document.createElement("style"); css.id = "mx-css";
    css.textContent = `
    .mx{border:3px solid var(--line);border-radius:22px;padding:14px 16px;background:var(--surface)}
    .mx h4{margin:0 0 6px}
    .mx-shelf{display:flex;flex-wrap:wrap;gap:8px;margin:6px 0 10px}
    .mx-s{border:3px solid var(--line);border-radius:14px;padding:6px 10px;background:var(--surface);font:inherit;font-weight:800;cursor:pointer;display:flex;align-items:center;gap:6px;text-align:left;font-size:.9rem}
    .mx-s .i{font-size:1.6rem} .mx-s.on{border-color:var(--lc);box-shadow:0 0 0 3px color-mix(in srgb,var(--lc) 25%,transparent)}
    .mx-s.done{border-color:var(--ok)} .mx-s small{display:block;color:var(--muted);font-weight:700;font-size:.75rem}
    .mx-bench{display:grid;grid-template-columns:150px 1fr;gap:14px;background:linear-gradient(#f4f1ea,#e8e2d4);border:2px solid #cfc6b0;border-radius:18px;padding:12px;touch-action:none;user-select:none}
    .mx-bottles{display:flex;flex-direction:column;gap:8px}
    .mx-btl{display:flex;align-items:center;gap:8px;border:3px solid #8a7f68;border-radius:12px;padding:6px 8px;background:#fff;font:inherit;font-weight:800;font-size:.85rem;cursor:grab;text-align:left}
    .mx-btl.on{border-color:var(--lc);box-shadow:0 0 0 3px color-mix(in srgb,var(--lc) 30%,transparent)}
    .mx-btl svg{flex:none}
    .mx-rack{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;align-items:end}
    .mx-tube{display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center;font-size:.8rem;font-weight:800;border-radius:14px;padding:4px;border:3px dashed transparent}
    .mx-tube.drop{border-color:var(--lc);background:color-mix(in srgb,var(--lc) 10%,transparent)}
    .mx-tube svg{width:min(52px,100%);height:auto}
    .mx-tube .res{min-height:2.4em;color:#3a3342;font-size:.78rem}
    .mx-heat{font-size:.78rem;padding:4px 8px}
    .mx-msg{min-height:1.4em;font-weight:800;margin:8px 0 0}
    .mx-tbl{width:100%;border-collapse:collapse;margin-top:12px;font-size:.88rem}
    .mx-tbl th,.mx-tbl td{border:1px solid var(--line);padding:5px;text-align:center}
    .mx-tbl th{background:var(--soft)} .mx-tbl td:first-child{text-align:left;font-weight:800}
    .mx-tbl button{min-width:44px;border:2px solid var(--line);border-radius:10px;background:#fff;font:700 1.05rem var(--display);padding:2px 8px;cursor:pointer}
    .mx-tbl button:disabled{opacity:.35;cursor:not-allowed} .mx-tbl td.ok button:disabled,.mx-tbl td.no button:disabled{opacity:1;cursor:default} .mx-tbl td.no button{border-color:#d0453a;color:#b0302a}
    .mx-tbl td.ok{background:color-mix(in srgb,var(--ok) 15%,transparent)} .mx-tbl td.no{background:color-mix(in srgb,var(--bad) 13%,transparent)}
    .mx-key{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px;margin:8px 0}
    .mx-key div{border:2px solid var(--line);border-radius:12px;padding:6px 8px;font-size:.82rem;background:var(--surface)}
    .mx-sw{display:inline-block;width:14px;height:14px;border-radius:4px;vertical-align:middle;border:1px solid rgba(0,0,0,.25);margin:0 3px}
    .sp-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}
    .sp-card{border:3px solid var(--line);border-radius:18px;padding:10px 12px;background:var(--surface)}
    .sp-card.x{opacity:.55;border-style:dashed} .sp-card.acc{border-color:#d0453a;box-shadow:0 0 0 4px rgba(208,69,58,.2)}
    .sp-card h5{margin:0;font:700 1.05rem var(--display)} .sp-card .i{font-size:2rem;float:right}
    .sp-chips{display:flex;flex-wrap:wrap;gap:4px;margin:6px 0}
    .sp-chips span{border-radius:999px;padding:2px 8px;font-size:.78rem;font-weight:800;border:2px solid var(--line)}
    .sp-chips .p{background:#e4f6ea;border-color:#1d7a45;color:#1d7a45} .sp-chips .m{background:#f3f1f6;color:#777}
    .sp-chips .bad{outline:2px solid #d0453a}
    .sp-btns{display:flex;gap:6px;flex-wrap:wrap}
    .sp-btns button{border:2px solid var(--line);border-radius:10px;background:#fff;font:inherit;font-weight:800;font-size:.85rem;padding:4px 10px;cursor:pointer}
    .sp-btns button.on{border-color:var(--lc);background:color-mix(in srgb,var(--lc) 14%,#fff)} .sp-btns button.ok.on{border-color:#1d7a45;background:#e4f6ea;color:#1d7a45} .sp-btns button.no.on{border-color:#777;background:#eee;color:#555} .sp-btns button.ac.on{border-color:#d0453a;background:#fde8e6;color:#b0302a}
    .sp-vomit{border:3px solid #7b2fd0;border-radius:16px;padding:8px 12px;margin-bottom:10px;background:#f6f0ff}
    @keyframes mxbub{0%{transform:translateY(0);opacity:.9}100%{transform:translateY(-60px);opacity:0}}
    .mx-b{animation:mxbub 1s linear infinite}
    @media (max-width:760px){.mx-bench{grid-template-columns:1fr}.mx-bottles{flex-direction:row;flex-wrap:wrap}}`;
    document.head.appendChild(css);
  }

  function bottle(t, small) {
    const w = small ? 26 : 30;
    return `<svg width="${w}" height="${w * 1.5}" viewBox="0 0 30 45" aria-hidden="true"><rect x="10" y="2" width="10" height="8" rx="2" fill="#555"/><path d="M6 12 h18 v26 a5 5 0 0 1 -5 5 h-8 a5 5 0 0 1 -5 -5z" fill="${t.k === "iodine" ? "#a86a1a" : t.k === "sudan" ? "#d0263a" : "#3b7ddd"}" stroke="#333" stroke-width="2"/><rect x="8" y="20" width="14" height="10" fill="#fff" opacity=".85"/></svg>`;
  }
  /* tube drawing: state = null (sample only), "added" (reagent, not heated), "done" (final) */
  function tubeSVG(s, t, state, heating) {
    const S = SAMPLES[s], pos = !!S.has[t.for];
    let col = "#f3efe2", layer = "";
    if (state === "added") col = t.k === "benedict" ? t.neg : (pos ? t.pos : t.neg);
    if (state === "done") col = pos ? t.pos : t.neg;
    if (t.k === "sudan" && state) { col = pos ? "#f6e9ec" : t.neg; if (pos) layer = `<rect x="15" y="34" width="30" height="20" fill="${t.pos}" opacity=".95"/>`; }
    const bub = heating ? [0, 1, 2, 3].map(i => `<circle class="mx-b" style="animation-delay:${i * .25}s" cx="${22 + i * 6}" cy="140" r="3" fill="#fff"/>`).join("") : "";
    return `<svg viewBox="0 0 60 170" role="img" aria-label="${t.name} test tube">
      ${heating ? `<rect x="2" y="70" width="56" height="90" rx="8" fill="#ffb4a0" opacity=".6"/><text x="30" y="166" text-anchor="middle" font-size="11">🔥</text>` : ""}
      <path d="M15 8 V140 a15 15 0 0 0 30 0 V8" fill="#fff" stroke="#555" stroke-width="2.5"/>
      <path d="M15 34 V140 a15 15 0 0 0 30 0 V34 Z" fill="${col}" style="transition:fill 1s"/>${layer}${bub}
      <path d="M20 14 V136" stroke="#fff" stroke-opacity=".6" stroke-width="3"/></svg>`;
  }
  const resultText = (s, t) => { const pos = !!SAMPLES[s].has[t.for]; return pos ? `🟢 ${t.posTxt}` : `⚪ ${t.negTxt}`; };

  BT.macrolab = {
    html(b, st) {
      const sel = st.sel || b.samples[0], ran = (st.ran = st.ran || {}), rec = st.rec || {}, chk = !!st.checked, hold = st.hold;
      const r = ran[sel] || {};
      const shelf = b.samples.map(k => { const S = SAMPLES[k], n = Object.keys(ran[k] || {}).filter(x => ran[k][x] === "done").length;
        return `<button class="mx-s ${k === sel ? "on" : ""} ${n === 4 ? "done" : ""}" data-smp="${k}"><span class="i">${S.icon}</span><span>${S.name}${S.note ? `<small>${S.note}</small>` : ""}<small>${n}/4 tests</small></span></button>`; }).join("");
      const tubes = TESTS.map(t => { const state = r[t.k] || null;
        return `<div class="mx-tube" data-tube="${t.k}">${tubeSVG(sel, t, state === "heating" ? "added" : state, state === "heating")}<span>${t.name}</span>
          <span class="res">${state === "done" ? resultText(sel, t) : state === "added" ? `<button class="btn ghost mx-heat" data-heat="${t.k}">🔥 Heat it</button>` : state === "heating" ? "Heating…" : "empty"}</span></div>`; }).join("");
      let h = `<div class="mx"><h4>${b.title}</h4>${b.how ? `<p class="mu">${b.how}</p>` : ""}
        <div class="mx-shelf" role="group" aria-label="Samples">${shelf}</div>
        <div class="mx-bench"><div class="mx-bottles"><b class="small">Indicators</b>${TESTS.map(t => `<button class="mx-btl ${hold === t.k ? "on" : ""}" data-btl="${t.k}" title="Tests for ${t.macro}">${bottle(t)}<span>${t.name}<br><small class="mu">tests for ${t.macro}</small></span></button>`).join("")}</div>
        <div><div class="mu small" style="margin-bottom:4px">Sample: <b>${SAMPLES[sel].icon} ${SAMPLES[sel].name}</b> · Drag an indicator onto a tube (or tap the indicator, then the tube).</div><div class="mx-rack">${tubes}</div></div></div>
        <div class="btnrow" style="margin-top:6px"><p class="mx-msg" aria-live="polite" style="flex:1;margin:0">${st.msg || ""}</p>${Object.keys(ran).length ? `<button class="btn ghost" data-mxreset title="Empty every tube and clear the data table">↺ Reset the lab</button>` : ""}</div>`;
      if (b.key) h += `<div class="mx-key">${TESTS.map(t => `<div><b>${t.name}</b> → ${t.macro}<br>✅ <span class="mx-sw" style="background:${t.pos}"></span>${t.posTxt}<br>❌ <span class="mx-sw" style="background:${t.neg}"></span>${t.negTxt}</div>`).join("")}</div>`;
      if (b.record !== false) {
        h += `<table class="mx-tbl"><thead><tr><th>Sample</th>${TESTS.map(t => `<th>${t.name}<br><small>${t.macro}</small></th>`).join("")}</tr></thead><tbody>${b.samples.map(k => `<tr><td>${SAMPLES[k].icon} ${SAMPLES[k].name}</td>${TESTS.map(t => { const v = (rec[k] || {})[t.k], can = (ran[k] || {})[t.k] === "done", ok = v === (SAMPLES[k].has[t.for] ? "+" : "−");
          return `<td class="${chk && v ? (ok ? "ok" : "no") : ""}"><button data-rec="${k}|${t.k}" ${!can || chk ? "disabled" : ""} aria-label="${SAMPLES[k].name} ${t.name} result">${v || (can ? "?" : "·")}</button></td>`; }).join("")}</tr>`).join("")}</tbody></table>
          <p class="mu small">Tap a box to record <b>+</b> (positive: the macromolecule is there) or <b>−</b> (negative). You can only record a test after you run it.</p>
          ${chk ? `<p class="score">Results recorded correctly: <b>${BT.macrolab.right(b, st)} / ${b.samples.length * 4}</b>. Green = correct. Red = look at that tube again.</p>${BT.macrolab.right(b, st) < b.samples.length * 4 ? `<div class="btnrow"><button class="btn ghost" data-mxfix>✏️ Fix my red boxes</button></div>` : ""}` : `<div class="btnrow"><button class="btn" data-mxcheck>Check my evidence table</button><span class="msg"></span></div>`}`;
      }
      return h + "</div>";
    },
    right(b, st) { const rec = st.rec || {}; let n = 0; b.samples.forEach(k => TESTS.forEach(t => { if ((rec[k] || {})[t.k] === (SAMPLES[k].has[t.for] ? "+" : "−")) n++; })); return n; },
    wire(root, b, st, save, redraw) {
      const sel = st.sel || b.samples[0]; st.ran = st.ran || {};
      const addTo = tk => { const t = TESTS.find(x => x.k === tk), r = st.ran[sel] = st.ran[sel] || {};
        if (r[tk]) { st.msg = `This tube already has ${t.name}.`; save(); redraw(); return; }
        r[tk] = t.heat ? "added" : "done"; st.hold = null;
        st.msg = t.heat ? "💡 Benedict’s only works when it is <b>heated</b>. Press 🔥 Heat it." : `${t.name} added: ${resultText(sel, t).slice(2)}. ${SAMPLES[sel].has[t.for] ? `That means ${t.macro} IS present.` : `That means NO ${t.macro}.`}`;
        save(); redraw(); };
      $$("[data-smp]", root).forEach(x => x.onclick = () => { st.sel = x.dataset.smp; st.msg = ""; save(); redraw(); });
      $$("[data-btl]", root).forEach(x => {
        x.onclick = () => { st.hold = st.hold === x.dataset.btl ? null : x.dataset.btl; st.msg = st.hold ? "Now tap the tube where you want to add it." : ""; save(); redraw(); };
        x.addEventListener("pointerdown", e => {
          const tk = x.dataset.btl, ghost = document.createElement("div"); let moved = false;
          ghost.style.cssText = "position:fixed;pointer-events:none;z-index:999;font-size:30px;transform:translate(-50%,-80%)"; ghost.innerHTML = "🧪";
          const mv = ev => { if (!moved && Math.hypot(ev.clientX - e.clientX, ev.clientY - e.clientY) < 8) return; if (!moved) { moved = true; document.body.appendChild(ghost); }
            ghost.style.left = ev.clientX + "px"; ghost.style.top = ev.clientY + "px"; $$(".mx-tube", root).forEach(tb => { const rr = tb.getBoundingClientRect(); tb.classList.toggle("drop", ev.clientX > rr.left && ev.clientX < rr.right && ev.clientY > rr.top && ev.clientY < rr.bottom); }); };
          const up = ev => { document.removeEventListener("pointermove", mv); document.removeEventListener("pointerup", up); if (!moved) return; ghost.remove();
            const hit = $$(".mx-tube", root).find(tb => { const rr = tb.getBoundingClientRect(); return ev.clientX > rr.left && ev.clientX < rr.right && ev.clientY > rr.top && ev.clientY < rr.bottom; });
            x.onclick = null; setTimeout(() => { x.onclick = () => { st.hold = st.hold === tk ? null : tk; save(); redraw(); }; }, 0);
            if (!hit) { redraw(); return; }
            if (hit.dataset.tube !== tk) { st.msg = `❌ Each tube is labeled. Drop <b>${TESTS.find(t => t.k === tk).name}</b> on its own tube.`; save(); redraw(); return; }
            addTo(tk); };
          document.addEventListener("pointermove", mv); document.addEventListener("pointerup", up);
        });
      });
      $$("[data-tube]", root).forEach(x => x.addEventListener("click", e => { if (e.target.closest("[data-heat]") || !st.hold) return;
        if (x.dataset.tube !== st.hold) { st.msg = `❌ That tube is for ${TESTS.find(t => t.k === x.dataset.tube).name}. Use the matching tube.`; save(); redraw(); return; } addTo(st.hold); }));
      $$("[data-heat]", root).forEach(x => x.onclick = () => { const r = st.ran[sel]; r.benedict = "heating"; save(); redraw();
        setTimeout(() => { if (!r) return; r.benedict = "done"; const t = TESTS[0]; st.msg = `Heated! Benedict’s ${resultText(sel, t).slice(2)}. ${SAMPLES[sel].has.sugar ? "Simple sugar IS present." : "NO simple sugar."}`; save(); redraw(); }, window.MX_FAST ? 50 : 1800); });
      $$("[data-rec]", root).forEach(x => x.onclick = () => { const [k, tk] = x.dataset.rec.split("|"); st.rec = st.rec || {}; st.rec[k] = st.rec[k] || {}; const v = st.rec[k][tk]; st.rec[k][tk] = v === "+" ? "−" : "+"; save(); redraw(); });
      const rs = $("[data-mxreset]", root);
      if (rs) rs.onclick = () => { if (!rs.dataset.sure) { rs.dataset.sure = "1"; rs.textContent = "⚠️ Tap again to reset"; setTimeout(() => { if (rs.isConnected) { delete rs.dataset.sure; rs.textContent = "↺ Reset the lab"; } }, 4000); return; }
        st.ran = {}; st.rec = {}; st.checked = false; st.hold = null; st.msg = "Lab reset. Choose a sample and start testing."; save(); redraw(); };
      const fx = $("[data-mxfix]", root); if (fx) fx.onclick = () => { st.checked = false; save(); redraw(); };
      const c = $("[data-mxcheck]", root); if (c) c.onclick = () => { const rec = st.rec || {}; if (b.samples.some(k => TESTS.some(t => !(rec[k] || {})[t.k]))) { $(".msg", root).textContent = "Run every test and record every box first."; return; } st.checked = true; save(); redraw(); };
    },
    score(b, st) { const tot = b.samples.length * 4, max = b.max || 4; return { max, pts: st.checked ? Math.round(max * BT.macrolab.right(b, st) / tot) : 0, label: b.label || "lab tests" }; },
    text(b, st) { const rec = st.rec || {}; return b.samples.map(k => `${SAMPLES[k].name}: ${TESTS.map(t => `${t.name}${(rec[k] || {})[t.k] || "?"}`).join(" ")}`).join(" | "); }
  };

  /* ---------- suspect board ---------- */
  function recOf(ctx, k) {
    const L = ctx.L, S = ctx.S, out = {};
    L.stations.forEach((s, i) => s.blocks.forEach((b, j) => { if (b.t === "macrolab" && b.samples.includes(k)) Object.assign(out, ((S.b[i + "-" + j] || {}).rec || {})[k] || {}); }));
    return out;
  }
  BT.suspects = {
    html(b, st, ctx) {
      const v = recOf(ctx, "vomit"), m = st.m || {}, acc = st.acc, chk = !!st.checked;
      const chips = (rec, cmp) => TESTS.map(t => { const x = rec[t.k]; const mism = cmp && x && cmp[t.k] && x !== cmp[t.k];
        return `<span class="${x === "+" ? "p" : "m"} ${mism ? "bad" : ""}">${t.short} ${x || "?"}</span>`; }).join("");
      let h = `<div class="mx"><h4>${b.title}</h4><p class="mu">${b.how}</p>
        <div class="sp-vomit"><b>🤢 Stomach sample (from your Crime Lab results):</b><div class="sp-chips">${chips(v)}</div></div>
        <div class="sp-grid">${b.list.map(k => { const S = SAMPLES[k], rr = recOf(ctx, k), [shop, dish] = S.name.split(": ");
          return `<div class="sp-card ${m[k] === "x" ? "x" : ""} ${acc === k ? "acc" : ""}"><span class="i">${S.icon}</span><h5>${shop}</h5><small>${dish}</small><div class="mu small">${b.who[k]}</div>
            <div class="sp-chips">${chips(rr, v)}</div>
            <div class="sp-btns"><button data-m="${k}|ok" class="ok ${m[k] === "ok" ? "on" : ""}" ${chk ? "disabled" : ""}>✅ Matches</button><button data-m="${k}|x" class="no ${m[k] === "x" ? "on" : ""}" ${chk ? "disabled" : ""}>❌ Doesn’t match</button><button data-acc="${k}" class="ac ${acc === k ? "on" : ""}" ${chk ? "disabled" : ""}>👉 Accuse</button></div></div>`; }).join("")}</div>
        <p class="mu small">Red-outlined chips do not match the stomach sample.</p>`;
      if (chk) { const r = BT.suspects.result(b, st); h += `<div class="ml-res" style="--rc:${r.acc ? "#1aa36f" : "#d0453a"};border:3px solid;border-radius:16px;padding:10px 12px;margin-top:8px">${r.acc ? `<b>🎉 Case solved!</b> ${b.solved}` : `<b>❌ Not quite.</b> Compare each dish’s 4 results with the stomach sample. Only one dish matches all four.`}<br>Match marks correct: <b>${r.marks} / ${b.list.length}</b></div>`; }
      return h + `<div class="btnrow"><button class="btn" data-spcheck ${chk && BT.suspects.result(b, st).acc ? "disabled" : ""}>${chk ? "Try again" : "🔍 Check my accusation"}</button><span class="msg"></span></div></div>`;
    },
    result(b, st) { const m = st.m || {}; const marks = b.list.filter(k => m[k] === (k === b.answer ? "ok" : "x")).length; return { acc: st.acc === b.answer, marks }; },
    wire(root, b, st, save, redraw) {
      $$("[data-m]", root).forEach(x => x.onclick = () => { const [k, v] = x.dataset.m.split("|"); st.m = st.m || {}; st.m[k] = v; save(); redraw(); });
      $$("[data-acc]", root).forEach(x => x.onclick = () => { st.acc = x.dataset.acc; save(); redraw(); });
      $("[data-spcheck]", root).onclick = () => { if (st.checked) { st.checked = false; save(); redraw(); return; } if (!st.acc) { $(".msg", root).textContent = "Mark each dish, then accuse one restaurant."; return; } st.checked = true; save(); redraw(); if (st.acc === b.answer) say("Case solved!"); };
    },
    score(b, st) { if (!st.checked) return { max: 4, pts: 0, label: "accusation" }; const r = BT.suspects.result(b, st); return { max: 4, pts: (r.acc ? 2 : 0) + Math.round(2 * r.marks / b.list.length), label: "accusation" }; },
    text(b, st) { return `Accused: ${st.acc ? SAMPLES[st.acc].name : "none"}; marks: ${JSON.stringify(st.m || {})}`; }
  };
});
