/* =====================================================================
   PUNNETT SQUARE LAB BLOCKS (no need to edit)
   punnett : read a word problem → tap the clues → set up → parent
             genotypes → place the gametes → fill the 4 boxes → ratios.
   breed   : virtual offspring breeder. Breed 1, 10, or 100 offspring and
             compare observed vs. expected ratios on a bar graph.
   Resets use a two-tap confirm (tap once, then tap again).
   ===================================================================== */
(window.CC_EXTS = window.CC_EXTS || []).push(function (BT, H) {
  const { $, $$, esc } = H;
  const say = t => { try { const u = new SpeechSynthesisUtterance(t); u.rate = .9; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) {} };

  if (!document.getElementById("pq-css")) {
    const css = document.createElement("style"); css.id = "pq-css";
    css.textContent = `
    .pq{border:3px solid var(--line);border-radius:22px;padding:14px 16px;background:var(--surface)}
    .pq h4{margin:0 0 6px}
    .pq-step{border:2px solid var(--line);border-radius:16px;padding:10px 12px;margin-top:10px;background:var(--surface)}
    .pq-step.lock{opacity:.45;pointer-events:none}
    .pq-step.done{border-color:#1aa36f;background:color-mix(in srgb,#1aa36f 6%,var(--surface))}
    .pq-step h5{margin:0 0 6px;font:700 1.02rem var(--display);display:flex;align-items:center;gap:8px}
    .pq-step h5 i{font-style:normal;color:#fff;font-weight:900;font-size:.78rem;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:var(--lc);flex:none}
    .pq-step.done h5 i{background:#1aa36f}
    .pq-pass{font-size:1.04rem;line-height:1.75;background:#fffbea;border:2px solid #f0dc9a;border-radius:14px;padding:10px 14px}
    .pq-k{border-radius:6px;padding:1px 3px;cursor:pointer;border-bottom:2px dotted #b49a3c}
    .pq-k:hover{background:#fff0b3}
    .pq-k.ok{background:#bff0cf;border-bottom-color:#1aa36f}
    .pq-k.no{background:#ffd5d0;animation:pqshake .4s}
    @keyframes pqshake{25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}
    .pq-opts{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
    .pq-opt{border:2px solid var(--line);border-radius:12px;background:var(--surface);font:inherit;font-weight:700;padding:6px 12px;cursor:pointer;text-align:left}
    .pq-opt:hover{border-color:var(--lc)}
    .pq-opt.no{border-color:#d0453a;background:#fde8e6}
    .pq-opt.ok{border-color:#1aa36f;background:#e4f6ea}
    .pq-par{display:flex;flex-wrap:wrap;gap:12px;margin-top:6px}
    .pq-par label{display:grid;gap:4px;font-weight:800;font-size:.9rem}
    .pq-par select{font:700 1rem var(--display);padding:6px 10px;border-radius:10px;border:2px solid var(--line);background:var(--surface);color:var(--fg)}
    .pq-sq{display:grid;grid-template-columns:70px repeat(2,minmax(70px,96px));grid-template-rows:62px repeat(2,minmax(62px,80px));gap:6px;margin:8px 0;justify-content:start}
    .pq-sq .hd{border:3px dashed var(--line);border-radius:12px;display:grid;place-items:center;font:800 1.3rem var(--display);background:var(--soft);cursor:pointer}
    .pq-sq .hd.on{border-color:var(--lc);background:color-mix(in srgb,var(--lc) 14%,var(--surface))}
    .pq-sq .hd.top{background:#eaf2ff}.pq-sq .hd.side{background:#ffeaf4}
    .pq-sq .hd.fill{border-style:solid}
    .pq-sq .corner{display:grid;place-items:center;font-size:.72rem;font-weight:800;color:var(--muted);text-align:center;line-height:1.2}
    .pq-sq .bx{border:3px solid var(--line);border-radius:12px;display:grid;place-items:center;align-content:center;font:800 1.2rem var(--display);background:var(--surface);cursor:pointer;text-align:center;padding:2px}
    .pq-sq .bx small{display:block;font:700 .68rem var(--body);color:var(--muted)}
    .pq-sq .bx.on{border-color:var(--lc);box-shadow:0 0 0 3px color-mix(in srgb,var(--lc) 25%,transparent)}
    .pq-sq .bx.ok{border-color:#1aa36f}.pq-sq .bx.no{border-color:#d0453a;background:#fde8e6}
    .pq-pal{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:4px 0}
    .pq-pal button{min-width:46px;border:2px solid var(--line);border-radius:10px;background:var(--surface);font:800 1.05rem var(--display);padding:4px 10px;cursor:pointer;color:var(--fg)}
    .pq-pal button.on{border-color:var(--lc);background:color-mix(in srgb,var(--lc) 16%,var(--surface))}
    .pq-msg{min-height:1.3em;font-weight:800;margin:6px 0 0}
    .pq-msg.ok{color:#1d7a45}.pq-msg.no{color:#b0302a}
    .pq-hint{border-left:5px solid #e08a00;background:#fff6e8;border-radius:0 10px 10px 0;padding:6px 10px;margin-top:6px;font-size:.92rem}
    .pq-sum{border:3px solid #1aa36f;border-radius:14px;padding:10px 12px;margin-top:10px;background:#f1fbf5}
    .pq-row{display:flex;flex-wrap:wrap;gap:14px;align-items:flex-start}
    .br-par{display:flex;flex-wrap:wrap;gap:10px;align-items:center;font:800 1.05rem var(--display)}
    .br-par span.g{background:var(--soft);border-radius:10px;padding:4px 10px}
    .br-dots{display:grid;grid-template-columns:repeat(20,1fr);gap:3px;max-width:420px;margin:8px 0}
    .br-dots span{aspect-ratio:1;border-radius:50%;border:1px solid rgba(0,0,0,.25);animation:brpop .3s both}
    @keyframes brpop{from{transform:scale(0)}to{transform:scale(1)}}
    .br-tbl{border-collapse:collapse;font-size:.92rem;margin:6px 0}
    .br-tbl th,.br-tbl td{border:1px solid var(--line);padding:4px 8px;text-align:center}.br-tbl th{background:var(--soft)}
    .br-sw{display:inline-block;width:14px;height:14px;border-radius:50%;vertical-align:middle;border:1px solid rgba(0,0,0,.3);margin-right:4px}
    @media (max-width:560px){.pq-sq{grid-template-columns:56px repeat(2,minmax(60px,1fr));grid-template-rows:56px repeat(2,68px)}.br-dots{grid-template-columns:repeat(10,1fr)}}`;
    document.head.appendChild(css);
  }

  /* split a genotype string like "XᴴY" or "CᴿCᵂ" into its alleles (longest match first) */
  const splitG = (g, al) => { const out = [], A = [...al].sort((a, b) => b.length - a.length); let s = g;
    while (s.length) { const a = A.find(x => s.startsWith(x)); if (!a) return null; out.push(a); s = s.slice(a.length); } return out; };
  const canon = (x, y, al) => [x, y].sort((a, b) => al.indexOf(a) - al.indexOf(b)).join("");
  const sameSet = (u, v) => [...u].sort().join("|") === [...v].sort().join("|");
  const STEPS = ["Read and find the clues", "Set up the cross", "Write the parent genotypes", "Place the gametes (alleles)", "Fill in the four boxes", "Find the ratios"];

  /* passage: [[clue]] must be tapped, {{detail}} is a distractor */
  function passage(b, st) {
    let i = 0; const tap = st.tap || {}, bad = st.bad || {};
    return b.passage.replace(/\[\[(.+?)\]\]|\{\{(.+?)\}\}/g, (m, c, d) => { const k = i++; const ok = tap[k], no = bad[k];
      return `<span class="pq-k ${ok ? "ok" : ""} ${no ? "no" : ""}" data-k="${k}" data-c="${c ? 1 : 0}" role="button" tabindex="0">${c || d}</span>`; });
  }
  const nClues = b => (b.passage.match(/\[\[/g) || []).length;

  BT.punnett = {
    html(b, st) {
      const step = st.step || 0, al = b.alleles, hd = st.hd || {}, bx = st.bx || [], miss = st.miss || {};
      const P = st.pg || [];
      const top = [hd.t0, hd.t1], side = [hd.s0, hd.s1];
      const stepBox = (n, inner) => `<div class="pq-step ${step < n ? "lock" : ""} ${step > n ? "done" : ""}"><h5><i>${step > n ? "✓" : n + 1}</i>${STEPS[n]}</h5>${inner}</div>`;
      const hint = (n, txt) => (miss[n] || 0) >= 2 && step === n ? `<div class="pq-hint">💡 <b>Hint:</b> ${txt}</div>` : "";
      const msg = n => step === n && st.msg ? `<p class="pq-msg ${st.mok ? "ok" : "no"}">${st.msg}</p>` : "";
      let h = `<div class="pq"><h4>${b.title}</h4>`;
      /* 1 clues */
      const found = Object.keys(st.tap || {}).length, need = nClues(b);
      h += stepBox(0, `<div class="pq-pass">${passage(b, st)}</div><p class="mu small">Tap every word or phrase that you NEED to set up the Punnett square (the trait, which allele is dominant, and what each parent is). Found <b>${found} of ${need}</b>.</p>${msg(0)}${hint(0, b.clueHint || "Look for the trait, the words dominant or recessive, and words that describe each parent.")}`);
      /* 2 setup questions */
      const sq = st.sq || 0, SQ = b.setup || [];
      h += stepBox(1, step === 1 && sq < SQ.length ? `<p><b>Question ${sq + 1} of ${SQ.length}:</b> ${SQ[sq].q}</p><div class="pq-opts">${SQ[sq].opts.map((o, j) => `<button class="pq-opt ${(st.sx || []).includes(j) ? "no" : ""}" data-sq="${j}">${o}</button>`).join("")}</div>${msg(1)}${(st.sx || []).length && SQ[sq].hint ? `<div class="pq-hint">💡 ${SQ[sq].hint}</div>` : ""}`
        : step > 1 ? `<p class="mu">${SQ.map(q => `✅ ${q.q} <b>${q.opts[q.a]}</b>`).join("<br>")}</p>` : `<p class="mu">Answer a few setup questions.</p>`);
      /* 3 parent genotypes */
      h += stepBox(2, `<div class="pq-par">${b.parents.map((p, i) => `<label>${p.label}<select data-pg="${i}" ${step !== 2 ? "disabled" : ""}><option value="">Choose…</option>${p.opts.map(o => `<option ${P[i] === o ? "selected" : ""}>${o}</option>`).join("")}</select></label>`).join("")}</div>
        ${step === 2 ? `<div class="btnrow" style="margin-top:6px"><button class="btn" data-pgchk>Check genotypes</button></div>` : ""}${msg(2)}${hint(2, b.parentHint || "Translate each description: two of the same allele = homozygous (purebred); one of each = heterozygous (hybrid or carrier).")}`);
      /* 4 gametes */
      const pal = st.pal;
      h += stepBox(3, `<p class="mu small">Parent 1’s two alleles go across the <b style="color:#2b7de9">top</b>. Parent 2’s two alleles go down the <b style="color:#e8368f">side</b>. Tap an allele below, then tap a dashed box.</p>
        <div class="pq-pal">${al.map(a => `<button data-al="${a}" class="${pal === a ? "on" : ""}">${a}</button>`).join("")}</div>`);
      /* square (shown from step 3 on) */
      const sqHTML = () => { const cells = []; const chk = step > 4;
        cells.push(`<div class="corner">P1 ↓ top<br>P2 → side</div>`);
        top.forEach((a, c) => cells.push(`<div class="hd top ${a ? "fill" : ""}" data-hd="t${c}">${a || "?"}</div>`));
        side.forEach((a, r) => { cells.push(`<div class="hd side ${a ? "fill" : ""}" data-hd="s${r}">${a || "?"}</div>`);
          [0, 1].forEach(c => { const k = r * 2 + c, g = bx[k], ok = top[c] && side[r] && g === canon(top[c], side[r], al);
            cells.push(`<div class="bx ${st.bsel === k ? "on" : ""} ${st.bchk && g ? (ok ? "ok" : "no") : ""} ${chk ? "ok" : ""}" data-bx="${k}">${g || "<span class='mu'>·</span>"}${g && (chk || (st.bchk && ok)) && b.pheno[g] ? `<small>${b.pheno[g]}</small>` : ""}</div>`); }); });
        return `<div class="pq-sq">${cells.join("")}</div>`; };
      const s4 = step === 4 ? `<p class="mu small">Tap a box, then tap its genotype. Each box gets <b>one allele from the top of its column</b> and <b>one from the side of its row</b>. ${b.order || "Write the dominant (capital) allele first."}</p><div class="pq-pal">${BT.punnett.combos(al).map(g => `<button data-gt="${g}">${g}</button>`).join("")}</div><div class="btnrow"><button class="btn" data-bxchk>Check the boxes</button></div>${msg(4)}${hint(4, "Look straight up to the top allele and straight left to the side allele. Put them together.")}`
        : step > 4 ? `<p class="mu small">All four boxes are filled. The phenotype is written under each genotype.</p>` : `<p class="mu small">After the gametes are placed, fill each box.</p>`;
      if (step >= 3) h += `<div class="pq-row" style="margin-top:8px">${sqHTML()}<div style="flex:1;min-width:220px">${step === 3 ? `${msg(3)}${hint(3, `Parent 1 is <b>${b.parents[0].a}</b>, so its two alleles are ${splitG(b.parents[0].a, al).join(" and ")}.`)}` : ""}${stepBox(4, s4)}</div></div>`;
      else h += stepBox(4, s4);
      /* 5 ratios */
      const rq = st.rq || 0, RQ = b.ratios || [];
      h += stepBox(5, step === 5 && rq < RQ.length ? `<p><b>Question ${rq + 1} of ${RQ.length}:</b> ${RQ[rq].q}</p><div class="pq-opts">${RQ[rq].opts.map((o, j) => `<button class="pq-opt ${(st.rx || []).includes(j) ? "no" : ""}" data-rq="${j}">${o}</button>`).join("")}</div>${msg(5)}${(st.rx || []).length && RQ[rq].hint ? `<div class="pq-hint">💡 ${RQ[rq].hint}</div>` : ""}`
        : step > 5 ? `<p class="mu">${RQ.map(q => `✅ ${q.q} <b>${q.opts[q.a]}</b>`).join("<br>")}</p>` : `<p class="mu">Use your finished square to find the ratios.</p>`);
      if (step > 5) h += `<div class="pq-sum">🎉 <b>Cross complete!</b> ${b.why || ""}<br><span class="mu small">Mistakes along the way: ${Object.values(miss).reduce((a, x) => a + x, 0)} (that’s how we learn).</span></div>`;
      h += `<div class="btnrow" style="margin-top:8px"><button class="btn ghost" data-pqreset>↺ Start this square over</button></div>`;
      return h + "</div>";
    },
    combos(al) { const out = []; al.forEach((x, i) => al.forEach((y, j) => { if (j < i) return; const g = canon(x, y, al); if (!out.includes(g) && !(x === "Y" && y === "Y")) out.push(g); })); return out; },
    wire(root, b, st, save, redraw) {
      const al = b.alleles, miss = st.miss = st.miss || {};
      const bad = n => { miss[n] = (miss[n] || 0) + 1; };
      const setMsg = (t, ok) => { st.msg = t; st.mok = ok; };
      const next = () => { st.step = (st.step || 0) + 1; st.msg = ""; save(); redraw(); };
      /* 1 clue taps */
      $$(".pq-k", root).forEach(k => { const go = () => { if ((st.step || 0) !== 0) return; const i = k.dataset.k;
        if (k.dataset.c === "1") { (st.tap = st.tap || {})[i] = 1; delete (st.bad || {})[i];
          if (Object.keys(st.tap).length >= nClues(b)) { setMsg("✅ You found every clue! Now set up the cross.", true); st.step = 1; save(); redraw(); return; }
          setMsg("✅ Good clue.", true); }
        else { (st.bad = st.bad || {})[i] = 1; bad(0); setMsg("❌ That detail is in the story, but you don’t need it for the Punnett square.", false); }
        save(); redraw(); };
        k.onclick = go; k.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } }; });
      /* 2 setup */
      $$("[data-sq]", root).forEach(o => o.onclick = () => { const q = b.setup[st.sq || 0], j = +o.dataset.sq;
        if (j === q.a) { st.sq = (st.sq || 0) + 1; st.sx = []; setMsg("✅ Correct!", true); if (st.sq >= b.setup.length) { next(); return; } }
        else { st.sx = [...(st.sx || []), j]; bad(1); setMsg("❌ Not quite. Reread the clues you found.", false); }
        save(); redraw(); });
      /* 3 parents */
      $$("[data-pg]", root).forEach(s => s.onchange = () => { (st.pg = st.pg || [])[+s.dataset.pg] = s.value; save(); });
      const pc = $("[data-pgchk]", root); if (pc) pc.onclick = () => { const P = st.pg || [];
        if (b.parents.some((p, i) => !P[i])) { setMsg("Choose a genotype for each parent.", false); save(); redraw(); return; }
        const wrong = b.parents.map((p, i) => P[i] === p.a ? null : p).filter(Boolean);
        if (!wrong.length) { setMsg("✅ Both genotypes are right.", true); next(); return; }
        bad(2); setMsg(`❌ Check ${wrong.map(p => p.label).join(" and ")}. ${wrong[0].hint || ""}`, false); save(); redraw(); };
      /* 4 gametes */
      $$("[data-al]", root).forEach(x => x.onclick = () => { if (st.step !== 3) return; st.pal = x.dataset.al; save(); redraw(); });
      $$("[data-hd]", root).forEach(x => x.onclick = () => { if (st.step !== 3) return; if (!st.pal) { setMsg("Tap an allele button first.", false); save(); redraw(); return; }
        (st.hd = st.hd || {})[x.dataset.hd] = st.pal; const hd = st.hd;
        if (hd.t0 && hd.t1 && hd.s0 && hd.s1) {
          const p1 = splitG(b.parents[0].a, al), p2 = splitG(b.parents[1].a, al);
          const okT = sameSet([hd.t0, hd.t1], p1), okS = sameSet([hd.s0, hd.s1], p2);
          if (okT && okS) { st.pal = null; setMsg("✅ Gametes placed! Each parent gives ONE allele to each offspring.", true); next(); return; }
          bad(3); setMsg(`❌ ${!okT ? "The top should be Parent 1’s two alleles. " : ""}${!okS ? "The side should be Parent 2’s two alleles." : ""}`, false);
        } else setMsg("", true);
        save(); redraw(); });
      /* 5 boxes */
      $$("[data-bx]", root).forEach(x => x.onclick = () => { if (st.step !== 4) return; st.bsel = +x.dataset.bx; st.bchk = false; save(); redraw(); });
      $$("[data-gt]", root).forEach(x => x.onclick = () => { if (st.step !== 4) return; if (st.bsel == null) { setMsg("Tap a box first.", false); save(); redraw(); return; }
        (st.bx = st.bx || [])[st.bsel] = x.dataset.gt; st.bchk = false; const nx = [0, 1, 2, 3].find(k => !(st.bx || [])[k]); st.bsel = nx == null ? st.bsel : nx; save(); redraw(); });
      const bc = $("[data-bxchk]", root); if (bc) bc.onclick = () => { const hd = st.hd, bx = st.bx || [];
        if ([0, 1, 2, 3].some(k => !bx[k])) { setMsg("Fill all four boxes first.", false); save(); redraw(); return; }
        const wrong = [0, 1, 2, 3].filter(k => bx[k] !== canon([hd.t0, hd.t1][k % 2], [hd.s0, hd.s1][k >> 1], al)).length;
        st.bchk = true;
        if (!wrong) { st.bsel = null; setMsg("✅ All four boxes are correct!", true); next(); return; }
        bad(4); setMsg(`❌ ${wrong} box${wrong > 1 ? "es are" : " is"} not right (red). Fix ${wrong > 1 ? "them" : "it"} and check again.`, false); save(); redraw(); };
      /* 6 ratios */
      $$("[data-rq]", root).forEach(o => o.onclick = () => { const q = b.ratios[st.rq || 0], j = +o.dataset.rq;
        if (j === q.a) { st.rq = (st.rq || 0) + 1; st.rx = []; setMsg(`✅ ${q.why || "Correct!"}`, true); if (st.rq >= b.ratios.length) { next(); say("Cross complete!"); return; } }
        else { st.rx = [...(st.rx || []), j]; bad(5); setMsg("❌ Not quite. Count the boxes in your square.", false); }
        save(); redraw(); });
      /* two-tap reset */
      const rs = $("[data-pqreset]", root); if (rs) rs.onclick = () => {
        if (!rs.dataset.sure) { rs.dataset.sure = "1"; rs.textContent = "⚠️ Tap again to start over"; setTimeout(() => { if (rs.isConnected) { delete rs.dataset.sure; rs.textContent = "↺ Start this square over"; } }, 4000); return; }
        Object.keys(st).forEach(k => delete st[k]); save(); redraw(); };
    },
    score(b, st) { const max = b.max || 6; return { max, pts: Math.round(max * Math.min(6, st.step || 0) / 6), label: b.label || "Punnett square" }; },
    text(b, st) { const hd = st.hd || {}; return `step ${st.step || 0}/6; parents ${(st.pg || []).join(" x ")}; square ${(st.bx || []).join(",")}; mistakes ${Object.values(st.miss || {}).reduce((a, x) => a + x, 0)}`; }
  };

  /* ---------------- virtual offspring breeder ---------------- */
  BT.breed = {
    html(b, st) {
      const kids = st.kids || [], n = kids.length, P = Object.keys(b.colors);
      const cnt = P.map(p => kids.filter(k => b.pheno[k] === p).length);
      const W = 360, Hh = 170, bw = 30, gx = (W - 50) / P.length;
      let svg = `<svg viewBox="0 0 ${W} ${Hh + 40}" style="width:100%;max-width:${W}px;background:var(--soft);border-radius:12px" role="img" aria-label="Bar graph of expected and observed percents">`;
      [0, 25, 50, 75, 100].forEach(v => { const y = 10 + Hh - v / 100 * Hh; svg += `<line x1="40" x2="${W - 6}" y1="${y}" y2="${y}" stroke="var(--line)"/><text x="34" y="${y + 4}" font-size="10" text-anchor="end" fill="var(--muted)">${v}%</text>`; });
      P.forEach((p, i) => { const x = 50 + i * gx, e = b.expect[p], o = n ? cnt[i] / n * 100 : 0;
        svg += `<rect x="${x}" y="${10 + Hh - e / 100 * Hh}" width="${bw}" height="${e / 100 * Hh}" fill="${b.colors[p]}" opacity=".35" stroke="${b.stroke || "#555"}" stroke-dasharray="4 3"/><rect x="${x + bw + 4}" y="${10 + Hh - o / 100 * Hh}" width="${bw}" height="${o / 100 * Hh}" fill="${b.colors[p]}" stroke="#333"/>
          <text x="${x + bw + 2}" y="${Hh + 26}" font-size="11" font-weight="700" text-anchor="middle" fill="var(--fg)">${p}</text>`; });
      svg += `<rect x="${W - 150}" y="12" width="10" height="10" fill="#bbb" opacity=".5" stroke="#555" stroke-dasharray="3 2"/><text x="${W - 136}" y="21" font-size="10" fill="var(--fg)">expected</text><rect x="${W - 82}" y="12" width="10" height="10" fill="#888" stroke="#333"/><text x="${W - 68}" y="21" font-size="10" fill="var(--fg)">observed</text></svg>`;
      return `<div class="pq"><h4>${b.title}</h4><p class="mu">${b.how || ""}</p>
        <div class="br-par"><span>Parent 1: <span class="g">${b.p1}</span></span><span>×</span><span>Parent 2: <span class="g">${b.p2}</span></span></div>
        <div class="btnrow" style="margin-top:8px"><button class="btn" data-br="1">Breed 1</button><button class="btn" data-br="10">Breed 10</button><button class="btn" data-br="100">Breed 100</button><span class="mu small">Total offspring: <b>${n}</b></span></div>
        <div class="pq-row"><div style="flex:1;min-width:0;max-width:100%"><div class="br-dots">${kids.slice(-100).map(k => `<span title="${k}: ${b.pheno[k]}" style="background:${b.colors[b.pheno[k]]}"></span>`).join("")}</div>
          <div style="overflow-x:auto;max-width:100%"><table class="br-tbl"><tr><th>Phenotype</th><th>Observed count</th><th>Observed %</th><th>Expected %</th></tr>${P.map((p, i) => `<tr><td><span class="br-sw" style="background:${b.colors[p]}"></span>${p}</td><td>${cnt[i]}</td><td>${n ? (cnt[i] / n * 100).toFixed(1) : "–"}%</td><td>${b.expect[p]}%</td></tr>`).join("")}</table></div></div>
        <div style="flex:1;min-width:min(240px,100%)">${svg}</div></div>
        <p class="mu small">${n >= 100 ? "✅ You have a big sample. Compare the observed bars with the expected (dashed) bars." : "Breed at least 100 offspring for a fair comparison."}</p>
        ${n ? `<div class="btnrow"><button class="btn ghost" data-brreset>↺ Reset the offspring</button></div>` : ""}</div>`;
    },
    wire(root, b, st, save, redraw) {
      const al = b.alleles, p1 = splitG(b.p1, al), p2 = splitG(b.p2, al);
      $$("[data-br]", root).forEach(x => x.onclick = () => { const k = st.kids = st.kids || [];
        for (let i = 0; i < +x.dataset.br; i++) k.push(canon(p1[Math.random() < .5 ? 0 : 1], p2[Math.random() < .5 ? 0 : 1], al));
        if (k.length > 2000) k.splice(0, k.length - 2000); save(); redraw(); });
      const rs = $("[data-brreset]", root); if (rs) rs.onclick = () => {
        if (!rs.dataset.sure) { rs.dataset.sure = "1"; rs.textContent = "⚠️ Tap again to reset"; setTimeout(() => { if (rs.isConnected) { delete rs.dataset.sure; rs.textContent = "↺ Reset the offspring"; } }, 4000); return; }
        st.kids = []; save(); redraw(); };
    },
    score(b, st) { const n = (st.kids || []).length, max = b.max || 2; return { max, pts: n >= 100 ? max : n >= 10 ? Math.floor(max / 2) : 0, label: b.label || "offspring data" }; },
    text(b, st) { const kids = st.kids || []; return `${kids.length} offspring: ` + Object.keys(b.colors).map(p => `${p} ${kids.filter(k => b.pheno[k] === p).length}`).join(", "); }
  };
});
