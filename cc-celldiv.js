/* =====================================================================
   CELL DIVISION LAB BLOCKS (no need to edit)
   divsim     : step a cell with 2 homologous pairs (2n = 4) through
                mitosis or meiosis. Students answer a quick question to
                move to each phase, can cross over (prophase I) and flip
                pairs (metaphase I), and see how many chromosomes each
                cell has. Options: { mode: "mitosis" | "meiosis", title }
   chromtable : fill in missing diploid (2n) / haploid (n) numbers for
                real organisms, then see a bar graph.
   Fast-test hook: window.CD_FAST = 1 turns off the animations.
   ===================================================================== */
(window.CC_EXTS = window.CC_EXTS || []).push(function (BT, H) {
  const { $, $$, esc } = H;
  const COL = { m: "#e8368f", p: "#2b7de9" };
  const LEN = { A: 46, B: 26 };
  const IDS = ["Am", "Ap", "Bm", "Bp"];

  if (!document.getElementById("cd-css")) {
    const css = document.createElement("style"); css.id = "cd-css";
    css.textContent = `
    .cd{border:3px solid var(--line);border-radius:22px;padding:14px 16px;background:var(--surface)}
    .cd h4{margin:0 0 6px}
    .cd-top{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);gap:14px;align-items:start}
    @media (max-width:860px){.cd-top{grid-template-columns:1fr}}
    .cd-svg{width:100%;height:auto;display:block;background:linear-gradient(#f7f3fb,#efe8f7);border:2px solid #d9cdea;border-radius:16px}
    .cd .ctd{transition:transform .9s ease,opacity .6s ease}.cd.nofx .ctd{transition:none}
    .cd .cell{fill:#fff8e6;stroke:#c9a64a;stroke-width:3}.cd .nuc{fill:#f3e9ff;stroke:#a083c9;stroke-width:2;stroke-dasharray:6 4}
    .cd .spin{stroke:#9a8fb0;stroke-width:1.2;opacity:.7}.cd .pole{fill:#6b5a8a}
    .cd .eq{stroke:#e08a00;stroke-width:2;stroke-dasharray:5 5}
    .cd .cd-lbl{font:700 12px var(--body);fill:#3a3342}.cd .lbl2{font:800 13px var(--body);fill:#1d7a45}
    .cd-phase{font:700 1.15rem var(--display);margin:0 0 4px}
    .cd-steps{display:flex;flex-wrap:wrap;gap:4px;margin:6px 0 10px}.cd-steps span{font-size:.72rem;font-weight:800;border-radius:999px;padding:2px 8px;background:var(--soft);color:var(--muted)}
    .cd-steps span.on{background:var(--lc);color:#fff}.cd-steps span.done{background:color-mix(in srgb,var(--ok) 20%,var(--surface));color:var(--fg)}
    .cd-q{border:2px solid var(--line);border-radius:14px;padding:10px 12px;margin-top:8px}
    .cd-q p{margin:0 0 8px;font-weight:700}
    .cd-opts{display:grid;gap:6px}.cd-opts button{text-align:left;border:2px solid var(--line);border-radius:12px;background:var(--surface);font:inherit;font-weight:700;padding:8px 10px;cursor:pointer;color:var(--fg)}
    .cd-opts button:hover{border-color:var(--lc)}.cd-opts button.no{border-color:#d0453a;background:#fde8e6}
    .cd-msg{min-height:1.3em;font-weight:700;margin:8px 0 0}.cd-msg.ok{color:#1d7a45}.cd-msg.no{color:#b0302a}
    .cd-tools{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
    .cd-key{display:flex;flex-wrap:wrap;gap:10px;font-size:.82rem;font-weight:700;margin-top:8px}.cd-key i{display:inline-block;width:12px;height:12px;border-radius:3px;vertical-align:middle;margin-right:4px}
    .cd-sum{border:3px solid #1aa36f;border-radius:16px;padding:10px 12px;margin-top:10px;background:#f1fbf5}
    .cd-sum table{border-collapse:collapse;margin-top:6px;font-size:.88rem}.cd-sum td,.cd-sum th{border:1px solid var(--line);padding:4px 8px;text-align:center}
    .cd-dot{display:inline-block;width:10px;height:18px;border-radius:4px;vertical-align:middle;margin:0 1px}
    .ct-tbl{width:100%;border-collapse:collapse;font-size:.92rem;margin-top:6px}.ct-tbl th,.ct-tbl td{border:1px solid var(--line);padding:6px;text-align:center}
    .ct-tbl th{background:var(--soft)}.ct-tbl td:first-child{text-align:left;font-weight:800}
    .ct-tbl input{width:70px;font:inherit;font-weight:800;text-align:center;border:2px solid var(--line);border-radius:10px;padding:4px}
    .ct-tbl td.ok{background:color-mix(in srgb,var(--ok) 16%,transparent)}.ct-tbl td.no{background:color-mix(in srgb,var(--bad) 14%,transparent)}
    .ct-graph{width:100%;max-width:560px;height:auto;margin:10px auto 0;display:block}`;
    document.head.appendChild(css);
  }

  /* ---------------- phases and questions ---------------- */
  const SEQ = {
    mitosis: [
      { n: "Interphase (G1)", d: "A body cell with 2n = 4: one long and one short chromosome from mom (pink) and from dad (blue). It is doing its normal job.", lab: ["4 chromosomes · 2n"] },
      { n: "Interphase (S): DNA copied", d: "Each chromosome copied itself. Now each one has two identical <b>sister chromatids</b> joined at the centromere. Still 4 chromosomes!", lab: ["4 chromosomes (copied) · 2n"],
        q: "Before a cell divides, what must happen to its DNA?", o: ["It is copied (replicated)", "It is cut in half", "Nothing changes"] },
      { n: "Prophase", d: "Chromosomes coil up tight, the nuclear envelope breaks down, and spindle fibers start to form.", lab: ["4 chromosomes · 2n"],
        q: "Next, the copied chromosomes condense and the nuclear envelope breaks down. What phase is this?", o: ["Prophase", "Anaphase", "Telophase"] },
      { n: "Metaphase", d: "The chromosomes line up <b>single file</b> across the middle. Homologous chromosomes do <b>not</b> pair up in mitosis.", lab: ["4 chromosomes · 2n"],
        q: "How do the chromosomes line up in metaphase of MITOSIS?", o: ["Single file across the middle", "In homologous pairs", "At the two ends (poles)"] },
      { n: "Anaphase", d: "Spindle fibers pull the <b>sister chromatids</b> apart. One copy of every chromosome moves to each side.", lab: ["sister chromatids split: 4 move to each side"],
        q: "In anaphase of mitosis, what gets pulled apart?", o: ["Sister chromatids", "Homologous pairs", "Only the cell membrane"] },
      { n: "Telophase & cytokinesis", d: "Two new nuclei form and the cell splits. Each daughter cell has 4 chromosomes, <b>identical</b> to the parent cell.", lab: ["4 · 2n", "4 · 2n"],
        q: "Predict: what will the two new cells have?", o: ["4 chromosomes each, identical to the parent", "2 chromosomes each", "4 chromosomes each, all different"] }
    ],
    meiosis: [
      { n: "Interphase (G1)", d: "A cell in an ovary or testis with 2n = 4: one long and one short chromosome from mom (pink) and from dad (blue).", lab: ["4 chromosomes · 2n"] },
      { n: "Interphase (S): DNA copied", d: "Each chromosome copied itself into two sister chromatids. Still 4 chromosomes.", lab: ["4 chromosomes (copied) · 2n"],
        q: "Before meiosis starts, what happens to the DNA?", o: ["It is copied (replicated) one time", "It is cut in half", "It is copied twice"] },
      { n: "Prophase I: homologs pair up", d: "Homologous chromosomes (the matching mom and dad versions) pair up side by side. They can trade pieces: <b>crossing over</b>. Try the ✂️ button!", lab: ["4 chromosomes · 2 pairs"],
        q: "In prophase I, what do homologous chromosomes do?", o: ["Pair up side by side", "Stay far apart", "Disappear"] },
      { n: "Metaphase I", d: "The <b>pairs</b> line up in the middle. Which side mom’s or dad’s chromosome faces is random: <b>independent assortment</b>. Try the 🔀 buttons!", lab: ["2 pairs on the middle line"],
        q: "How do chromosomes line up in metaphase I?", o: ["In homologous pairs", "Single file", "They do not line up"] },
      { n: "Anaphase I", d: "The <b>homologous pairs</b> separate. Sister chromatids stay together for now.", lab: ["homologs split: 2 move to each side"],
        q: "In anaphase I, what separates?", o: ["Homologous pairs (sister chromatids stay together)", "Sister chromatids", "Nothing separates"] },
      { n: "Telophase I", d: "Two cells form. Each has only <b>2</b> chromosomes (one long, one short): the number was cut in half. They are still copied.", lab: ["2 (copied) · n", "2 (copied) · n"],
        q: "After meiosis I, how many chromosomes does each new cell have?", o: ["2 (half), still copied", "4 (the same)", "1"] },
      { n: "Metaphase II", d: "No DNA copying this time! In each cell, chromosomes line up <b>single file</b>.", lab: ["2 · n", "2 · n"],
        q: "Does the DNA copy again before meiosis II?", o: ["No. The chromosomes line up single file right away.", "Yes, it copies again first."] },
      { n: "Anaphase II", d: "The <b>sister chromatids</b> are pulled apart in both cells.", lab: ["chromatids split", "chromatids split"],
        q: "In anaphase II, what separates?", o: ["Sister chromatids", "Homologous pairs"] },
      { n: "Telophase II", d: "Four <b>gametes</b> form. Each has 2 chromosomes (n): one long and one short. Compare their colors: they are genetically <b>different</b>.", lab: ["2 · n", "2 · n", "2 · n", "2 · n"],
        q: "Predict the final result of meiosis.", o: ["4 cells with 2 chromosomes each (n), genetically different", "2 cells with 4 chromosomes each", "4 identical cells with 4 chromosomes each"] }
    ]
  };
  /* option order for each step (the correct answer is option 0, shown in a different spot each time) */
  const P3 = [[1, 0, 2], [2, 1, 0], [1, 2, 0], [0, 2, 1], [2, 0, 1], [1, 0, 2], [2, 1, 0], [0, 2, 1], [1, 2, 0]];
  const order = (n, k) => n === 3 ? P3[k % P3.length] : n === 2 ? (k % 2 ? [0, 1] : [1, 0]) : Array.from({ length: n }, (_, i) => i);

  /* ---------------- layout: where every chromatid goes at each step ---------------- */
  function layout(mode, s, st) {
    const P = {}, cells = [], fl = st.flip || {};
    const put = (id, x, y, r, rep) => { if (rep) { P[id + "1"] = [x - 5, y, r, 1]; P[id + "2"] = [x + 5, y, r, 1]; } else { P[id + "1"] = [x, y, r, 1]; P[id + "2"] = [x, y, r, 0]; } };
    const one = (id, x, y, r) => { P[id] = [x, y, r, 1]; };
    const scat = rep => { put("Am", 232, 132, -25, rep); put("Ap", 318, 128, 20, rep); put("Bm", 252, 188, 40, rep); put("Bp", 312, 182, -15, rep); };
    const big = { cx: 280, cy: 150, rx: 170, ry: 128 };
    if (s <= 1) { cells.push({ ...big, nuc: 1 }); scat(s === 1); return { P, cells }; }
    if (mode === "mitosis") {
      if (s === 2) { cells.push({ ...big, nuc: 2, poles: 1 }); put("Am", 240, 125, -10, 1); put("Ap", 310, 120, 15, 1); put("Bm", 255, 190, 25, 1); put("Bp", 315, 185, -10, 1); }
      if (s === 3 || s === 4) { cells.push({ ...big, poles: 1, eq: s === 3, spin: 1 }); const ys = { Am: 68, Ap: 122, Bm: 178, Bp: 224 };
        IDS.forEach(id => { if (s === 3) put(id, 280, ys[id], 0, 1); else { one(id + "1", 190, ys[id], 0); one(id + "2", 370, ys[id], 0); } }); }
      if (s === 5) { const L = { cx: 145, cy: 150, rx: 118, ry: 110, nuc: 1 }, R = { cx: 415, cy: 150, rx: 118, ry: 110, nuc: 1 }; cells.push(L, R);
        const off = { Am: [-32, -28, -20], Ap: [26, -32, 25], Bm: [-22, 34, 30], Bp: [30, 30, -10] };
        IDS.forEach(id => { const o = off[id]; one(id + "1", L.cx + o[0], L.cy + o[1], o[2]); one(id + "2", R.cx + o[0], R.cy + o[1], o[2]); }); }
      return { P, cells };
    }
    /* meiosis */
    const side = (pair, mom) => ((fl[pair] ? 1 : 0) ^ (mom ? 0 : 1)) ? 1 : 0; /* 0 = left, 1 = right */
    if (s === 2) { cells.push({ ...big, nuc: 2, poles: 1 }); put("Am", 250, 115, 0, 1); put("Ap", 272, 115, 0, 1); put("Bm", 250, 192, 0, 1); put("Bp", 272, 192, 0, 1); }
    if (s === 3 || s === 4) { cells.push({ ...big, poles: 1, eq: s === 3, spin: 1 }); const yy = { A: 112, B: 196 };
      IDS.forEach(id => { const pr = id[0], sd = side(pr, id[1] === "m"), x = s === 3 ? (sd ? 300 : 260) : (sd ? 372 : 188); put(id, x, yy[pr], 0, 1); }); }
    const two = [{ cx: 145, cy: 150, rx: 118, ry: 110 }, { cx: 415, cy: 150, rx: 118, ry: 110 }];
    if (s >= 5 && s <= 7) { two.forEach(c => cells.push({ ...c, nuc: s === 5 ? 1 : 0, poles: s > 5, eq: s === 6, spin: s > 5 }));
      IDS.forEach(id => { const pr = id[0], c = two[side(pr, id[1] === "m")];
        if (s === 5) put(id, c.cx + (pr === "A" ? -22 : 24), c.cy + (pr === "A" ? -24 : 30), pr === "A" ? -15 : 20, 1);
        else if (s === 6) put(id, c.cx, c.cy + (pr === "A" ? -36 : 38), 0, 1);
        else { one(id + "1", c.cx - 58, c.cy + (pr === "A" ? -36 : 38), 0); one(id + "2", c.cx + 58, c.cy + (pr === "A" ? -36 : 38), 0); } }); }
    if (s === 8) { const xs = [72, 212, 348, 488]; xs.forEach(x => cells.push({ cx: x, cy: 150, rx: 64, ry: 78, nuc: 1 }));
      IDS.forEach(id => { const pr = id[0], sd = side(pr, id[1] === "m"); [1, 2].forEach(k => { const x = xs[sd * 2 + (k - 1)]; one(id + k, x + (pr === "A" ? -12 : 13), 150 + (pr === "A" ? -12 : 20), pr === "A" ? -8 : 12); }); }); }
    return { P, cells };
  }
  /* colors of each chromatid: top and bottom halves (crossing over swaps the bottom of the two inner chromatids of pair A) */
  function colors(st) {
    const c = {}; IDS.forEach(id => [1, 2].forEach(k => { const col = COL[id[1]]; c[id + k] = [col, col]; }));
    if (st.cross) { c.Am2[1] = COL.p; c.Ap1[1] = COL.m; }
    return c;
  }
  const ctdSVG = (id, len, cl, pos) => `<g class="ctd" data-c="${id}" style="transform:translate(${pos[0]}px,${pos[1]}px) rotate(${pos[2]}deg);opacity:${pos[3]}">
      <rect x="-4.5" y="${-len / 2}" width="9" height="${len / 2 + 3}" rx="4.5" fill="${cl[0]}"/><rect x="-4.5" y="-3" width="9" height="${len / 2 + 3}" rx="4.5" fill="${cl[1]}"/><circle r="3.2" fill="#3a3342"/></g>`;
  function cellLayer(L, mode, s) {
    const lab = SEQ[mode][s].lab || [];
    return L.cells.map((c, i) => {
      let g = `<ellipse class="cell" cx="${c.cx}" cy="${c.cy}" rx="${c.rx}" ry="${c.ry}"/>`;
      if (c.nuc) g += `<ellipse class="nuc" cx="${c.cx}" cy="${c.cy}" rx="${c.rx * .62}" ry="${c.ry * .62}" ${c.nuc === 2 ? 'opacity=".35"' : ""}/>`;
      if (c.poles) g += `<circle class="pole" cx="${c.cx - c.rx + 14}" cy="${c.cy}" r="6"/><circle class="pole" cx="${c.cx + c.rx - 14}" cy="${c.cy}" r="6"/>`;
      if (c.eq) g += `<line class="eq" x1="${c.cx}" x2="${c.cx}" y1="${c.cy - c.ry + 8}" y2="${c.cy + c.ry - 8}"/>`;
      if (c.spin) Object.entries(L.P).forEach(([id, p]) => { if (!p[3] || Math.abs(p[0] - c.cx) > c.rx) return; const px = p[0] < c.cx ? c.cx - c.rx + 14 : c.cx + c.rx - 14; g += `<line class="spin" x1="${px}" y1="${c.cy}" x2="${p[0]}" y2="${p[1]}"/>`; });
      return g + `<text class="cd-lbl" x="${c.cx}" y="${c.cy + c.ry + 16}" text-anchor="middle">${lab[i] || ""}</text>`;
    }).join("");
  }
  /* what each final cell contains (for the summary) */
  function finalCells(mode, st) {
    const L = layout(mode, SEQ[mode].length - 1, st), cl = colors(st);
    return L.cells.map(c => IDS.flatMap(id => [1, 2].map(k => id + k)).filter(cid => L.P[cid] && L.P[cid][3] && Math.abs(L.P[cid][0] - c.cx) < c.rx).sort().map(cid => ({ id: cid, pr: cid[0], col: cl[cid] })));
  }

  BT.divsim = {
    html(b, st) {
      const mode = b.mode === "meiosis" ? "meiosis" : "mitosis", seq = SEQ[mode], s = Math.min(st.s || 0, seq.length - 1);
      return `<div class="cd ${window.CD_FAST ? "nofx" : ""}"><h4>${b.title || (mode === "mitosis" ? "Mitosis Simulator" : "Meiosis Simulator")}</h4>
        ${b.how ? `<p class="mu">${b.how}</p>` : ""}
        <div class="cd-steps">${seq.map((x, i) => `<span class="${i === s ? "on" : i < s ? "done" : ""}">${i + 1}. ${x.n.split(":")[0]}</span>`).join("")}</div>
        <div class="cd-top"><div><svg class="cd-svg" viewBox="0 0 560 300" role="img" aria-label="${mode} simulator showing the cell at the current phase"><g class="cd-cells"></g><g class="cd-ctds"></g></svg>
          <div class="cd-key"><span><i style="background:${COL.m}"></i>from mom (maternal)</span><span><i style="background:${COL.p}"></i>from dad (paternal)</span><span>long = chromosome pair 1 · short = chromosome pair 2</span></div></div>
          <div class="cd-side"></div></div><div class="cd-sumbox"></div></div>`;
    },
    wire(root, b, st, save, redraw) {
      const mode = b.mode === "meiosis" ? "meiosis" : "mitosis", seq = SEQ[mode], last = seq.length - 1;
      st.s = Math.min(st.s || 0, last); st.miss = st.miss || 0; st.first = st.first || 0;
      const svg = $(".cd-svg", root), box = $(".cd", root);
      function paint() {
        const s = st.s, L = layout(mode, s, st), cl = colors(st);
        $(".cd-cells", svg).innerHTML = cellLayer(L, mode, s);
        const g = $(".cd-ctds", svg);
        IDS.forEach(id => [1, 2].forEach(k => { const cid = id + k, pos = L.P[cid] || [280, 150, 0, 0]; let el = g.querySelector(`[data-c="${cid}"]`);
          if (!el) { g.insertAdjacentHTML("beforeend", ctdSVG(cid, LEN[id[0]], cl[cid], pos)); return; }
          el.style.transform = `translate(${pos[0]}px,${pos[1]}px) rotate(${pos[2]}deg)`; el.style.opacity = pos[3];
          const r = el.querySelectorAll("rect"); r[0].setAttribute("fill", cl[cid][0]); r[1].setAttribute("fill", cl[cid][1]); }));
        $$(".cd-steps span", root).forEach((x, i) => x.className = i === s ? "on" : i < s ? "done" : "");
        const nx = seq[s + 1], ph = seq[s];
        let h = `<p class="cd-phase">${ph.n}</p><p style="margin:0">${ph.d}</p>`;
        if (mode === "meiosis" && s === 2) h += `<div class="cd-tools"><button class="btn ghost" data-cross>${st.cross ? "✂️ Undo crossing over" : "✂️ Cross over (trade pieces)"}</button></div>`;
        if (mode === "meiosis" && s === 3) h += `<div class="cd-tools"><button class="btn ghost" data-flip="A">🔀 Flip long pair</button><button class="btn ghost" data-flip="B">🔀 Flip short pair</button></div>`;
        if (nx) { const ord = order(nx.o.length, s);
          h += `<div class="cd-q"><p>❓ ${nx.q}</p><div class="cd-opts">${ord.map(j => `<button data-ans="${j}">${nx.o[j]}</button>`).join("")}</div><p class="cd-msg" aria-live="polite"></p></div>`; }
        else h += `<p class="cd-msg ok">🎉 ${mode === "mitosis" ? "Mitosis" : "Meiosis"} complete!</p>`;
        h += `<div class="cd-tools"><button class="btn ghost" data-cdreset>↺ Start over</button></div>`;
        $(".cd-side", root).innerHTML = h;
        $(".cd-sumbox", root).innerHTML = st.done ? summary() : "";
        wireSide();
      }
      function summary() {
        const F = finalCells(mode, st), tot = st.first + st.miss;
        const dots = c => c.map(x => `<span class="cd-dot" style="background:linear-gradient(${x.col[0]} 50%,${x.col[1]} 50%);height:${x.pr === "A" ? 20 : 12}px"></span>`).join("");
        const sig = F.map(c => c.map(x => x.col.join("")).join("|")), uniq = new Set(sig).size;
        return `<div class="cd-sum"><b>📊 Results</b><table><tr><th>Cell</th>${F.map((_, i) => `<th>${mode === "mitosis" ? "Daughter" : "Gamete"} ${i + 1}</th>`).join("")}</tr>
          <tr><td>Chromosomes</td>${F.map(c => `<td>${dots(c)}</td>`).join("")}</tr><tr><td>Number</td>${F.map(c => `<td><b>${c.length}</b> (${c.length === 4 ? "2n" : "n"})</td>`).join("")}</tr></table>
          <p style="margin:8px 0 0">${mode === "mitosis" ? `Parent cell: 4 chromosomes → <b>2</b> daughter cells with <b>4</b> each. They are <b>${uniq === 1 ? "identical" : "different"}</b> to each other and to the parent.` :
            `Parent cell: 4 chromosomes → <b>4</b> gametes with <b>2</b> each (half). Different color combinations: <b>${uniq} of 4</b>.${st.cross ? " Crossing over made some chromosomes two-colored!" : " Tip: Start over and try crossing over or flipping a pair to make more variety."}`}</p>
          <p class="mu small" style="margin:4px 0 0">Answered on the first try: ${st.first} of ${tot}.</p></div>`;
      }
      function wireSide() {
        $$("[data-ans]", root).forEach(btn => btn.onclick = () => {
          const ok = +btn.dataset.ans === 0, m = $(".cd-msg", root);
          if (!ok) { if (!st.tried) st.miss++; st.tried = 1; btn.classList.add("no"); m.className = "cd-msg no"; m.textContent = "❌ Not quite. Look at the cell and the phase description, then try again."; save(); return; }
          if (!st.tried) st.first++; st.tried = 0; st.s++;
          if (st.s >= last) { st.done = true; const tt = st.first + st.miss; st.best = Math.max(st.best || 0, 2 + (tt && st.first / tt >= .75 ? 1 : 0)); save(); paint(); setTimeout(() => { if (root.isConnected) redraw(); }, window.CD_FAST ? 0 : 950); return; }
          save(); paint(); });
        const cr = $("[data-cross]", root); if (cr) cr.onclick = () => { st.cross = !st.cross; save(); paint(); };
        $$("[data-flip]", root).forEach(f => f.onclick = () => { st.flip = st.flip || {}; st.flip[f.dataset.flip] = !st.flip[f.dataset.flip]; save(); paint(); });
        const rs = $("[data-cdreset]", root); if (rs) rs.onclick = () => {
          if (!rs.dataset.sure) { rs.dataset.sure = "1"; rs.textContent = "⚠️ Tap again to start over"; setTimeout(() => { if (rs.isConnected) { delete rs.dataset.sure; rs.textContent = "↺ Start over"; } }, 4000); return; }
          const best = st.best; Object.keys(st).forEach(k => delete st[k]); st.s = 0; st.miss = 0; st.first = 0; if (best) st.best = best; save(); redraw(); };
      }
      box.classList.add("nofx"); paint(); requestAnimationFrame(() => { if (!window.CD_FAST) box.classList.remove("nofx"); });
    },
    score(b, st) { return { max: 3, pts: st.best || 0, label: (b.mode === "meiosis" ? "meiosis" : "mitosis") + " simulator" }; },
    text(b, st) { return `${b.mode || "mitosis"}: ${st.done ? "complete" : "step " + ((st.s || 0) + 1)}; first-try ${st.first || 0}/${(st.first || 0) + (st.miss || 0)}; crossing over ${st.cross ? "yes" : "no"}`; }
  };

  /* ---------------- count the chromosomes table ---------------- */
  BT.chromtable = {
    html(b, st) {
      const v = st.v || {}, chk = !!st.checked;
      const cell = (r, i, key) => { const ans = key === "d" ? r.d : r.d / 2, given = r.give === key;
        if (given) return `<td>${ans}</td>`; const val = v[i + key], ok = +val === ans;
        return `<td class="${chk ? (ok ? "ok" : "no") : ""}"><input data-ct="${i}${key}" inputmode="numeric" value="${esc(val || "")}" ${chk ? "disabled" : ""} aria-label="${r.org} ${key === "d" ? "body cell" : "gamete"}">${chk && !ok ? ` <small>✓ ${ans}</small>` : ""}</td>`; };
      let h = `<div class="bb"><h4>${b.title}</h4><p class="mu">${b.how}</p><table class="ct-tbl"><thead><tr><th>Organism</th><th>Body (somatic) cell<br><small>diploid, 2n</small></th><th>Gamete (sex cell)<br><small>haploid, n</small></th><th>After fertilization<br><small>zygote</small></th></tr></thead><tbody>` +
        b.rows.map((r, i) => `<tr><td>${r.ic} ${r.org}</td>${cell(r, i, "d")}${cell(r, i, "h")}${chk ? `<td>${r.d}</td>` : `<td class="mu">?</td>`}</tr>`).join("") + `</tbody></table>`;
      if (chk) {
        const W = 560, max = Math.max(...b.rows.map(r => r.d)), bw = W / b.rows.length;
        h += `<svg class="ct-graph" viewBox="0 0 ${W} 210" role="img" aria-label="Bar graph of the diploid chromosome number of each organism">` + b.rows.map((r, i) => { const hh = r.d / max * 150; return `<rect x="${i * bw + 10}" y="${170 - hh}" width="${bw - 20}" height="${hh}" rx="5" fill="#8a54e0"/><text x="${i * bw + bw / 2}" y="${164 - hh}" text-anchor="middle" font-size="12" font-weight="800">${r.d}</text><text x="${i * bw + bw / 2}" y="188" text-anchor="middle" font-size="11">${r.org}</text>`; }).join("") + `<text x="${W / 2}" y="206" text-anchor="middle" font-size="11" fill="#777">Diploid number (2n) in body cells</text></svg>
          <p class="score">Correct: <b>${BT.chromtable.right(b, st)} / ${b.rows.length}</b> · The gamete number is always half of the body-cell number, and fertilization (n + n) brings it back to 2n.</p>`;
      } else h += `<div class="btnrow"><button class="btn" data-ctcheck>Check my table</button><span class="msg"></span></div>`;
      return h + "</div>";
    },
    right(b, st) { const v = st.v || {}; return b.rows.filter((r, i) => { const k = r.give === "d" ? "h" : "d"; return +v[i + k] === (k === "d" ? r.d : r.d / 2); }).length; },
    wire(root, b, st, save, redraw) {
      $$("[data-ct]", root).forEach(x => x.oninput = () => { (st.v = st.v || {})[x.dataset.ct] = x.value.trim(); save(); });
      const c = $("[data-ctcheck]", root); if (c) c.onclick = () => { const v = st.v || {}; if (b.rows.some((r, i) => !v[i + (r.give === "d" ? "h" : "d")])) { $(".msg", root).textContent = "Fill in every box first."; return; } st.checked = true; save(); redraw(); };
    },
    score(b, st) { return { max: 3, pts: st.checked ? Math.round(3 * BT.chromtable.right(b, st) / b.rows.length) : 0, label: "chromosome table" }; },
    text(b, st) { const v = st.v || {}; return b.rows.map((r, i) => `${r.org}: ${v[i + (r.give === "d" ? "h" : "d")] || "-"}`).join(", "); }
  };
});
