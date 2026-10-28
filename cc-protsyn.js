/* =====================================================================
   PROTEIN SYNTHESIS LAB BLOCKS (no need to edit)
   protsyn : pick a gene → transcribe it in the NUCLEUS → drag the mRNA
             through a NUCLEAR PORE to a RIBOSOME in the CYTOPLASM →
             translate it with a codon chart → see the protein and trait
   cerg    : general CER builder (claim cards, evidence cards, reasoning
             with a tap-to-add word bank and sentence starters)
   ===================================================================== */
(window.CC_EXTS = window.CC_EXTS || []).push(function (BT, H) {
  const { $, $$, esc } = H;

  /* ---------- the genetic code ---------- */
  const CODE = {}, B4 = "UCAG";
  const AA = { Phe: "Phenylalanine", Leu: "Leucine", Ile: "Isoleucine", Met: "Methionine (START)", Val: "Valine", Ser: "Serine", Pro: "Proline", Thr: "Threonine", Ala: "Alanine", Tyr: "Tyrosine", Stop: "STOP", His: "Histidine", Gln: "Glutamine", Asn: "Asparagine", Lys: "Lysine", Asp: "Aspartic acid", Glu: "Glutamic acid", Cys: "Cysteine", Trp: "Tryptophan", Arg: "Arginine", Gly: "Glycine" };
  ("Phe Phe Leu Leu Ser Ser Ser Ser Tyr Tyr Stop Stop Cys Cys Stop Trp " +
   "Leu Leu Leu Leu Pro Pro Pro Pro His His Gln Gln Arg Arg Arg Arg " +
   "Ile Ile Ile Met Thr Thr Thr Thr Asn Asn Lys Lys Ser Ser Arg Arg " +
   "Val Val Val Val Ala Ala Ala Ala Asp Asp Glu Glu Gly Gly Gly Gly").split(" ")
    .forEach((aa, i) => { const f = B4[Math.floor(i / 16)], s = B4[Math.floor(i / 4) % 4], t = B4[i % 4]; CODE[f + s + t] = aa; });
  const AACOL = { Met: "#1aa36f", Stop: "#d0453a" };
  const aaColor = a => AACOL[a] || ["#2b7de9", "#8a54e0", "#e08a00", "#e8368f", "#0e9aa7", "#5b5fe0", "#c98a00"][Object.keys(AA).indexOf(a) % 7];

  /* ---------- genes (real first codons of each gene; a stop codon was added to keep it short) ---------- */
  const GENES = {
    hbb: { name: "Hemoglobin gene (HBB)", short: "Hemoglobin", icon: "🩸", where: "red blood cells", dna: "ATGGTGCATCTGACTCCTGAGTAA",
      protein: "beta-globin, part of hemoglobin", trait: "Round, flexible red blood cells that carry oxygen through your body",
      art: `<svg viewBox="0 0 220 110" width="220" aria-label="Round red blood cells">${[[45, 55], [110, 40], [175, 62], [80, 88], [150, 92]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="30" ry="22" fill="#d0453a" stroke="#7a1f18" stroke-width="3"/><ellipse cx="${x}" cy="${y}" rx="13" ry="9" fill="#b2352c"/>`).join("")}</svg>` },
    sickle: { name: "Hemoglobin gene (HBB) with ONE base changed", short: "Sickle cell", icon: "🌙", where: "red blood cells", dna: "ATGGTGCATCTGACTCCTGTGTAA",
      protein: "a changed beta-globin (sickle hemoglobin)", trait: "Stiff, sickle-shaped red blood cells that can get stuck in blood vessels (sickle cell disease)",
      art: `<svg viewBox="0 0 220 110" width="220" aria-label="Sickle-shaped red blood cells">${[[50, 50, -20], [120, 40, 15], [180, 70, -10], [90, 88, 30]].map(([x, y, r]) => `<path transform="translate(${x} ${y}) rotate(${r})" d="M-34 4 Q0 -36 34 4 Q0 -14 -34 4z" fill="#d0453a" stroke="#7a1f18" stroke-width="3" stroke-linejoin="round"/>`).join("")}<ellipse cx="170" cy="25" rx="22" ry="16" fill="#d0453a" stroke="#7a1f18" stroke-width="3"/></svg>` },
    gfp: { name: "Green fluorescent protein gene (GFP)", short: "Glowing jellyfish", icon: "🪼", where: "a jellyfish (Aequorea victoria)", dna: "ATGAGTAAAGGAGAAGAACTTTAA",
      protein: "green fluorescent protein (GFP)", trait: "The jellyfish glows green under blue light",
      art: `<svg viewBox="0 0 220 120" width="220" aria-label="Glowing green jellyfish"><defs><radialGradient id="gfpg"><stop offset="0" stop-color="#b8ffb0"/><stop offset="1" stop-color="#b8ffb0" stop-opacity="0"/></radialGradient></defs><rect width="220" height="120" rx="14" fill="#14213d"/><circle cx="110" cy="50" r="58" fill="url(#gfpg)"/><path d="M70 55 Q110 0 150 55z" fill="#7dff8a" stroke="#2bd14a" stroke-width="3"/>${[80, 95, 110, 125, 140].map(x => `<path d="M${x} 55 q-6 18 0 30 q6 12 0 26" stroke="#7dff8a" stroke-width="3" fill="none"/>`).join("")}</svg>` },
    ins: { name: "Insulin gene (INS)", short: "Insulin", icon: "🍬", where: "pancreas cells", dna: "ATGGCCCTGTGGATGCGCCTCTAA",
      protein: "preproinsulin, which is made into insulin", trait: "Insulin helps your cells take in sugar, so your blood sugar stays healthy",
      art: `<svg viewBox="0 0 220 110" width="220" aria-label="Insulin unlocking a cell to let in glucose"><circle cx="150" cy="58" r="44" fill="#ffe8b0" stroke="#c98a00" stroke-width="3"/><text x="150" y="64" text-anchor="middle" font-size="15" font-weight="800">cell</text><rect x="98" y="48" width="14" height="22" rx="3" fill="#8a54e0"/><text x="38" y="40" font-size="30">🔑</text><text x="12" y="62" font-size="12" font-weight="800">insulin</text><text x="30" y="96" font-size="22">🍬🍬</text><path d="M78 88 L104 66" stroke="#555" stroke-width="3" marker-end="url(#ia)"/><defs><marker id="ia" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#555"/></marker></defs></svg>` }
  };
  window.PS_GENES = GENES; window.PS_CODE = CODE;
  const PAIR = { A: "U", T: "A", C: "G", G: "C" }, DPAIR = { A: "T", T: "A", C: "G", G: "C" }, RPAIR = { A: "U", U: "A", C: "G", G: "C" };
  const mrnaOf = g => g.dna.replace(/T/g, "U");
  const templateOf = g => g.dna.split("").map(b => DPAIR[b]).join("");
  const codons = s => s.match(/.{3}/g);
  const BASECOL = { A: "#e8368f", T: "#e08a00", U: "#e08a00", C: "#2b7de9", G: "#1aa36f" };
  const tile = (b, cls) => `<span class="ps-b ${cls || ""}" style="--bc:${BASECOL[b] || "#bbb"}">${b || "&nbsp;"}</span>`;
  const say = t => { try { const u = new SpeechSynthesisUtterance(t); u.rate = .9; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) {} };

  if (!document.getElementById("ps-css")) {
    const css = document.createElement("style"); css.id = "ps-css";
    css.textContent = `
    .ps{border:3px solid var(--line);border-radius:22px;padding:14px 16px;background:var(--surface)}
    .ps h4{margin:0 0 6px}
    .ps-steps{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 10px}
    .ps-steps span{border:2px solid var(--line);border-radius:999px;padding:4px 12px;font-weight:800;font-size:.85rem;background:var(--soft)}
    .ps-steps span.on{border-color:var(--lc);background:color-mix(in srgb,var(--lc) 15%,var(--surface))} .ps-steps span.done{border-color:var(--ok);color:var(--ok)}
    .ps-map{position:relative;border-radius:18px;overflow:hidden;border:2px solid #e3c9a8;touch-action:none;user-select:none}
    .ps-map svg{display:block;width:100%;height:auto}
    .ps-genes{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}
    .ps-gene{border:3px solid var(--line);border-radius:18px;padding:12px;text-align:left;background:var(--surface);font:inherit;cursor:pointer}
    .ps-gene:hover{border-color:var(--lc)} .ps-gene .ic{font-size:2.2rem;display:block}
    .ps-gene b{display:block;font:700 1.05rem var(--display)} .ps-gene small{color:var(--muted);font-weight:700}
    .ps-bench{margin-top:12px;border:2px dashed var(--line);border-radius:16px;padding:12px;background:var(--soft)}
    .ps-bench h5{margin:0 0 6px;font:700 1.1rem var(--display)}
    .ps-row{display:flex;align-items:center;gap:8px;margin:4px 0;flex-wrap:nowrap;overflow-x:auto;padding-bottom:4px}
    .ps-row .lab{flex:none;width:118px;font-weight:800;font-size:.82rem;text-align:right;color:var(--muted)}
    .ps-strand{display:flex;gap:2px}
    .ps-b{display:inline-grid;place-items:center;width:28px;height:30px;border-radius:7px;background:var(--bc);color:#fff;font:800 1rem var(--display);flex:none;transition:transform .5s}
    .ps-b.empty{background:#fff;border:2px dashed #bbb;color:#bbb}
    .ps-b.cur{outline:3px solid var(--lc);outline-offset:2px;background:#fff;color:var(--lc);border:2px solid var(--lc)}
    .ps-b.gap{margin-right:8px}
    .ps-unzip .ps-top .ps-b{transform:translateY(-6px)} .ps-unzip .ps-bot .ps-b{transform:translateY(6px)}
    .ps-keys{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;align-items:center}
    .ps-key{width:64px;height:64px;border-radius:16px;border:0;color:#fff;font:700 1.8rem var(--display);cursor:pointer;box-shadow:0 5px 0 rgba(0,0,0,.25)}
    .ps-key:active{transform:translateY(3px);box-shadow:0 2px 0 rgba(0,0,0,.25)}
    .ps-msg{min-height:1.5em;font-weight:800;margin:8px 0 0}
    .ps-msg.bad{color:var(--bad)} .ps-msg.ok{color:var(--ok)}
    .ps-rule{display:flex;gap:8px;flex-wrap:wrap;font-weight:800;font-size:.9rem}
    .ps-rule span{background:var(--surface);border:2px solid var(--line);border-radius:10px;padding:3px 8px}
    .ps-tl{display:grid;grid-template-columns:1fr 1.05fr;gap:14px}
    .ps-codons{display:flex;gap:6px;flex-wrap:wrap}
    .ps-cod{border:3px solid var(--line);border-radius:12px;padding:4px;display:flex;gap:2px;background:#fff}
    .ps-cod.cur{border-color:var(--lc);box-shadow:0 0 0 4px color-mix(in srgb,var(--lc) 25%,transparent);position:relative;margin-top:22px}.ps-cod.cur::before{content:'🟣 ribosome reading';position:absolute;top:-22px;left:50%;transform:translateX(-50%);white-space:nowrap;font-size:.72rem;font-weight:800;color:#5b2a86}.ps-codons{align-items:flex-end} .ps-cod.done{border-color:var(--ok);opacity:.75}
    .ps-cod .ps-b{width:24px;height:26px;font-size:.9rem}
    .ps-chain{display:flex;flex-wrap:wrap;gap:4px;align-items:center;min-height:56px;margin-top:8px}
    .ps-aa{display:inline-grid;place-items:center;min-width:52px;height:46px;border-radius:999px;background:var(--ac);color:#fff;font:700 .95rem var(--display);padding:0 6px;border:3px solid rgba(0,0,0,.2)}.ps-aa.new{animation:psdrop .45s}
    .ps-aa + .ps-aa{margin-left:-2px}
    .ps-link{width:10px;height:4px;background:#555;border-radius:2px}
    @keyframes psdrop{from{transform:translateY(-30px) scale(.6);opacity:0}to{transform:none;opacity:1}}
    .ps-chart{border-collapse:collapse;font-size:.76rem;width:100%}
    .ps-chart th{background:var(--soft);padding:3px;border:1px solid var(--line)}
    .ps-chart td{border:1px solid var(--line);padding:2px;vertical-align:top}
    .ps-chart button{display:block;width:100%;border:0;background:transparent;font:inherit;font-weight:700;text-align:left;padding:2px 4px;border-radius:6px;cursor:pointer;white-space:nowrap}
    .ps-chart button:hover{background:color-mix(in srgb,var(--lc) 15%,transparent)}
    .ps-chart button.hint{background:color-mix(in srgb,var(--gold, #ffc53d) 45%,transparent)}
    .ps-chart button b{display:inline-block;min-width:30px}
    .ps-trna{display:flex;align-items:center;gap:10px;margin-top:8px;font-weight:800}
    .ps-trna .t{display:inline-flex;flex-direction:column;align-items:center;border:3px solid #8a54e0;border-radius:12px 12px 4px 4px;padding:4px 8px;background:#f3ecff}
    .ps-done{display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:center;margin-top:12px;border:3px solid var(--ok);border-radius:18px;padding:12px;background:color-mix(in srgb,var(--ok) 8%,var(--surface))}
    .ps-done h5{margin:0 0 4px;font:700 1.2rem var(--display)}
    .ps-move{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}
    .ps-drag{cursor:grab} .ps-drag:active{cursor:grabbing}
    @keyframes pspulse{50%{opacity:.35}} .ps-target{animation:pspulse 1.2s infinite}
    .cg-opts{display:grid;gap:8px}
    .cg-opt{display:flex;gap:10px;align-items:center;text-align:left;border:2.5px solid var(--line);border-radius:14px;padding:8px 12px;background:var(--surface);font:inherit;font-weight:700;cursor:pointer}
    .cg-opt.on{border-color:var(--cc);box-shadow:0 0 0 3px color-mix(in srgb,var(--cc) 25%,transparent)}
    @media (max-width:820px){.ps-tl{grid-template-columns:1fr}.ps-done{grid-template-columns:1fr}}`;
    document.head.appendChild(css);
  }

  /* ---------- the cell map (SVG) ---------- */
  const PORES = [[331, 115], [337, 244], [186, 47]];
  const RIBOS = [[640, 120], [760, 210], [600, 285]];
  function cellMap(st, phase) {
    const pos = st.pos || "nucleus", here = { nucleus: [210, 185], pore: PORES[st.pore || 0], ribosome: RIBOS[st.ribo || 0] }[pos] || [210, 185];
    const lab = (x, y, t, s) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="${s || 15}" font-weight="800" fill="#3b2a1a">${t}</text>`;
    const ribo = ([x, y], i) => `<g class="${phase === "move" && pos === "pore" ? "ps-target" : ""}" data-ribo="${i}"><ellipse cx="${x}" cy="${y - 9}" rx="22" ry="14" fill="#b07ad6" stroke="#4b2a6b" stroke-width="3"/><ellipse cx="${x}" cy="${y + 10}" rx="28" ry="16" fill="#8a54e0" stroke="#4b2a6b" stroke-width="3"/></g>`;
    const mr = phase === "move" || st.mrnaMade ? `<g class="ps-drag" data-mrna transform="translate(${here[0]} ${here[1]})"><path d="M-46 0 q8 -12 16 0 t16 0 t16 0 t16 0 t16 0 t16 0" stroke="#e08a00" stroke-width="7" fill="none" stroke-linecap="round"/><text x="0" y="-14" text-anchor="middle" font-size="13" font-weight="900" fill="#7a3c00">mRNA</text></g>` : "";
    return `<svg viewBox="0 0 900 360" role="img" aria-label="Cell map. The mRNA is in the ${pos}.">
      <rect width="900" height="360" fill="#fff4e3"/>
      <rect x="6" y="6" width="888" height="348" rx="60" fill="#ffe9cc" stroke="#d6a76c" stroke-width="5"/>
      ${lab(720, 40, "CYTOPLASM", 16)}
      ${[[480, 70], [520, 300], [840, 300], [430, 210]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="34" ry="16" fill="#ffd2a0" stroke="#d68a3c" stroke-width="3"/><path d="M${x - 24} ${y} q8 -8 16 0 t16 0 t16 0" stroke="#d68a3c" stroke-width="2" fill="none"/>`).join("")}
      <text x="480" y="98" text-anchor="middle" font-size="11" fill="#9a5a1a">mitochondrion</text>
      <circle cx="210" cy="185" r="140" fill="#e6dcff" stroke="#6b4bb0" stroke-width="7"/>
      ${PORES.map(([x, y], i) => `<g data-pore="${i}" class="${phase === "move" && pos === "nucleus" ? "ps-target" : ""}"><circle cx="${x}" cy="${y}" r="13" fill="#fff4e3" stroke="#6b4bb0" stroke-width="3"/></g>`).join("")}
      ${lab(220, 100, "NUCLEUS")}
      <circle cx="120" cy="235" r="24" fill="#cbb8f5"/>${lab(120, 274, "nucleolus", 11)}
      <path d="M120 140 q10 -16 20 0 t20 0 t20 0 t20 0 t20 0 t20 0" stroke="#2b7de9" stroke-width="5" fill="none"/><path d="M120 150 q10 16 20 0 t20 0 t20 0 t20 0 t20 0 t20 0" stroke="#1aa36f" stroke-width="5" fill="none"/>${lab(180, 125, "DNA", 12)}
      ${lab(392, 110, "nuclear pore", 12)}
      ${RIBOS.map(ribo).join("")}${lab(700, 150, "ribosome", 12)}
      ${[[560, 180], [820, 120], [660, 330]].map(([x, y]) => `<text x="${x}" y="${y}" font-size="20">🟣</text>`).join("")}
      ${mr}
      <g transform="translate(${here[0]} ${here[1] + 40})"><path d="M0 -12 l-10 -18 h20z" fill="#ffc53d" stroke="#121015" stroke-width="2"/><text y="12" text-anchor="middle" font-size="12" font-weight="900" fill="#121015">YOU ARE HERE</text></g>
    </svg>`;
  }

  /* ---------- codon chart (tap the codon) ---------- */
  function chart(hint) {
    let h = `<table class="ps-chart"><thead><tr><th>1st ↓ / 2nd →</th>${[..."UCAG"].map(s => `<th>${s}</th>`).join("")}</tr></thead><tbody>`;
    [..."UCAG"].forEach(f => { h += `<tr><th>${f}</th>${[..."UCAG"].map(s => `<td>${[..."UCAG"].map(t => { const c = f + s + t; return `<button data-cod="${c}" class="${hint === c ? "hint" : ""}" title="${AA[CODE[c]]}"><b>${c}</b> ${CODE[c]}</button>`; }).join("")}</td>`).join("")}</tr>`; });
    return h + "</tbody></table>";
  }

  BT.protsyn = {
    html(b, st) {
      if (b.gene && !st.gene) { st.gene = b.gene; st.phase = "tx"; }
      const g = st.gene ? GENES[st.gene] : null, phase = st.phase || "pick";
      if (g && b.prefill) {
        if (phase === "tx" && (st.m || "").length < b.prefill * 3) st.m = mrnaOf(g).slice(0, b.prefill * 3);
        if (phase === "tl" && (st.aa || []).length < b.prefill) st.aa = codons(mrnaOf(g)).slice(0, b.prefill).map(c => CODE[c]);
      }
      const steps = [["pick", "1 · Pick a gene"], ["tx", "2 · Transcription (nucleus)"], ["move", "3 · Move the mRNA"], ["tl", "4 · Translation (ribosome)"], ["done", "5 · Protein → trait"]];
      const idx = steps.findIndex(s => s[0] === phase);
      let h = `<div class="ps"><h4>${b.title || "Protein Synthesis Lab"}</h4><div class="ps-steps">${steps.filter(s => !(b.gene && s[0] === "pick")).map((s, i) => `<span class="${s[0] === phase ? "on" : steps.findIndex(x => x[0] === s[0]) < idx ? "done" : ""}">${s[1]}</span>`).join("")}</div>
        <div class="ps-map">${cellMap(st, phase)}</div>`;
      if (phase === "pick") {
        h += `<div class="ps-bench"><h5>Choose a gene to express</h5><p class="mu small">Each gene card shows the real first codons of that gene. Real genes are hundreds to thousands of bases long, so we added a stop codon to keep it short.</p>
          <div class="ps-genes">${(b.choices || ["hbb", "gfp", "ins"]).map(k => { const G = GENES[k]; return `<button class="ps-gene" data-gene="${k}"><span class="ic">${G.icon}</span><b>${G.short}</b><small>${G.name}<br>Found in: ${G.where}</small></button>`; }).join("")}</div></div>`;
      }
      if (g && phase === "tx") {
        const dna = g.dna, tmp = templateOf(g), m = st.m || "", pre = (b.prefill || 0) * 3, n = dna.length;
        const cur = Math.max(m.length, 0);
        h += `<div class="ps-bench"><h5>In the NUCLEUS: Transcription (DNA → mRNA)</h5>
          <p>${g.icon} <b>${g.name}</b>. RNA polymerase unzips the DNA and reads the <b>template strand</b>. Build the matching <b>mRNA</b>: tap the base that pairs with each template base.</p>
          <div class="ps-rule"><span>DNA A → mRNA <b style="color:${BASECOL.U}">U</b></span><span>DNA T → mRNA <b style="color:${BASECOL.A}">A</b></span><span>DNA C → mRNA <b style="color:${BASECOL.G}">G</b></span><span>DNA G → mRNA <b style="color:${BASECOL.C}">C</b></span><span>⚠️ RNA has <b>U</b> instead of T</span></div>
          <div class="ps-unzip" style="margin-top:10px">
          <div class="ps-row ps-top"><span class="lab">DNA coding strand</span><span class="ps-strand">${[...dna].map((x, i) => tile(x, i % 3 === 2 ? "gap" : "")).join("")}</span></div>
          <div class="ps-row ps-bot"><span class="lab">DNA template strand<br><small>(read this one)</small></span><span class="ps-strand">${[...tmp].map((x, i) => tile(x, (i % 3 === 2 ? "gap " : "") + (i === cur ? "cur" : ""))).join("")}</span></div>
          <div class="ps-row"><span class="lab">mRNA (you build it)</span><span class="ps-strand">${[...dna].map((x, i) => i < m.length ? tile(m[i], i % 3 === 2 ? "gap" : "") : `<span class="ps-b empty ${i % 3 === 2 ? "gap" : ""} ${i === cur ? "cur" : ""}">?</span>`).join("")}</span></div></div>
          <div class="ps-keys">${[..."AUCG"].map(k => `<button class="ps-key" data-k="${k}" style="background:${BASECOL[k]}" aria-label="${k}">${k}</button>`).join("")}<span class="mu small">or type A, U, C, G · Base ${Math.min(cur + 1, n)} of ${n}</span></div>
          <p class="ps-msg" aria-live="polite">${st.msg || ""}</p></div>`;
      }
      if (g && phase === "move") {
        const pos = st.pos || "nucleus";
        h += `<div class="ps-bench"><h5>Move the mRNA</h5><p><b>${pos === "nucleus" ? "Drag the orange mRNA to a nuclear pore (a white circle on the edge of the nucleus)." : "Now drag the mRNA through the cytoplasm to a ribosome (purple)."}</b> The DNA stays safe inside the nucleus. Only the mRNA copy leaves.</p>
          <div class="ps-move"><button class="btn ghost" data-mv="pore" ${pos !== "nucleus" ? "disabled" : ""}>➡️ Move to a nuclear pore</button><button class="btn ghost" data-mv="ribosome" ${pos !== "pore" ? "disabled" : ""}>➡️ Move to a ribosome</button><span class="mu small">(drag on the map, or use these buttons)</span></div>
          <p class="ps-msg" aria-live="polite">${st.msg || ""}</p></div>`;
      }
      if (g && phase === "tl") {
        const cods = codons(mrnaOf(g)), done = st.aa || [], ci = done.length, cur = cods[ci], pre = b.prefill || 0;
        const last = done.length && cods[done.length - 1];
        h += `<div class="ps-bench"><h5>At the RIBOSOME in the cytoplasm: Translation (mRNA → protein)</h5>
          <p>The ribosome reads the mRNA <b>3 bases at a time</b> (a <b>codon</b>). Find the highlighted codon in the codon chart and tap it. A <b>tRNA</b> brings that amino acid.</p>
          <div class="ps-tl"><div><div class="ps-codons">${cods.map((c, i) => `<span class="ps-cod ${i === ci ? "cur" : i < ci ? "done" : ""}">${[...c].map(x => tile(x)).join("")}</span>`).join("")}</div>
            ${last ? `<div class="ps-trna"><span class="t"><small>tRNA</small><span>${[...last].map(x => RPAIR[x]).join("")}</span><small>anticodon</small></span><span>carried <b>${CODE[last]}</b> (${AA[CODE[last]]})</span></div>` : ""}
            <p style="margin:10px 0 0;font-weight:800">🔗 Your protein (amino acid chain):</p><div class="ps-chain">${done.filter(a => a !== "Stop").map((a, i, arr) => `<span class="ps-aa ${i === arr.length - 1 ? "new" : ""}" style="--ac:${aaColor(a)}" title="${AA[a]}">${a}</span>`).join('<span class="ps-link"></span>') || '<span class="mu">Start with the first codon.</span>'}</div>
            <p class="ps-msg" aria-live="polite">${st.msg || ""}</p></div>
          <div><b>Codon chart</b> <span class="mu small">(1st base = row, 2nd base = column, 3rd base = line in the box)</span>${chart((st.miss || 0) >= 2 ? cur : null)}</div></div></div>`;
      }
      if (g && phase === "done") {
        const prot = codons(mrnaOf(g)).map(c => CODE[c]).filter(a => a !== "Stop");
        h += `<div class="ps-done"><div>${g.art}</div><div><h5>You made ${g.protein}!</h5>
          <div class="ps-chain">${prot.map(a => `<span class="ps-aa" style="--ac:${aaColor(a)}" title="${AA[a]}">${a}</span>`).join('<span class="ps-link"></span>')}</div>
          <p><b>Trait:</b> ${g.trait}.</p>
          <p class="mu small">Gene (DNA) → mRNA → protein (amino acids) → trait. The order of the amino acids decides the protein’s shape, and the shape decides its job.</p>
          ${b.gene ? "" : `<button class="btn ghost" data-again>🔁 Express another gene</button>`}</div></div>`;
        if (st.done && Object.keys(st.done).length) h += `<p class="mu small">Genes completed: ${Object.keys(st.done).map(k => GENES[k].icon + " " + GENES[k].short).join(" · ")}</p>`;
      }
      return h + "</div>";
    },
    wire(root, b, st, save, redraw) {
      const g = st.gene ? GENES[st.gene] : null;
      const setMsg = (t, cls) => { st.msg = `<span class="${cls || ""}">${t}</span>`; };
      $$("[data-gene]", root).forEach(x => x.onclick = () => { st.gene = x.dataset.gene; st.phase = "tx"; st.m = ""; st.aa = []; st.pos = "nucleus"; st.mrnaMade = false; st.msg = ""; st.txMiss = 0; st.tlMiss = 0; st.seenMove = 0; save(); redraw(); say("Transcription. Read the template strand and build the matching mRNA."); });
      if (st.phase === "tx" || (b.gene && !st.phase)) {
        st.phase = "tx";
        const press = k => {
          const tmp = templateOf(g), m = st.m || "", want = PAIR[tmp[m.length]];
          if (m.length >= tmp.length) return;
          if (k === want) { st.m = m + k; st.miss = 0; setMsg("✅ " + tmp[m.length] + " pairs with " + k + "!", "ok"); if (st.m.length === tmp.length) { st.phase = "move"; st.mrnaMade = true; st.pos = "nucleus"; setMsg("🎉 mRNA finished! Now it must leave the nucleus.", "ok"); say("Your m R N A is finished. Now move it out of the nucleus."); } }
          else { st.txMiss = (st.txMiss || 0) + 1; st.miss = (st.miss || 0) + 1; setMsg(`❌ Not quite. The template base is <b>${tmp[m.length]}</b>. ${tmp[m.length] === "A" ? "In RNA, A pairs with <b>U</b> (not T)." : tmp[m.length] === "T" ? "T pairs with <b>A</b>." : tmp[m.length] === "C" ? "C pairs with <b>G</b>." : "G pairs with <b>C</b>."}`, "bad"); }
          save(); redraw();
        };
        $$("[data-k]", root).forEach(x => x.onclick = () => press(x.dataset.k));
        const kh = e => { if (!root.isConnected) { document.removeEventListener("keydown", kh); return; } if (/INPUT|TEXTAREA|SELECT/.test((e.target || {}).tagName)) return; const k = (e.key || "").toUpperCase(); if ("AUCG".includes(k) && k.length === 1) { e.preventDefault(); document.removeEventListener("keydown", kh); press(k); } };
        document.addEventListener("keydown", kh);
      }
      if (st.phase === "move") {
        if (!st.seenMove) { st.seenMove = 1; save(); const mp = $(".ps-map", root); if (mp && mp.scrollIntoView) setTimeout(() => mp.scrollIntoView({ behavior: "smooth", block: "start" }), 60); }
        const go = (where, i) => {
          if (where === "pore" && (st.pos || "nucleus") === "nucleus") { st.pos = "pore"; st.pore = i || 0; setMsg("✅ Through the nuclear pore! Now find a ribosome in the cytoplasm.", "ok"); }
          else if (where === "ribosome" && st.pos === "pore") { st.pos = "ribosome"; st.ribo = i || 0; st.phase = "tl"; st.aa = st.aa || []; st.miss = 0; setMsg("✅ The ribosome grabbed the mRNA. Time to translate!", "ok"); say("The ribosome has the m R N A. Translate each codon."); }
          else if (where === "ribosome") { st.moveMiss = (st.moveMiss || 0) + 1; setMsg("❌ The mRNA has to leave the nucleus through a nuclear pore first.", "bad"); }
          else { st.moveMiss = (st.moveMiss || 0) + 1; setMsg("❌ That’s not the right place. " + ((st.pos || "nucleus") === "nucleus" ? "Find a nuclear pore on the edge of the nucleus." : "Find a purple ribosome in the cytoplasm."), "bad"); }
          save(); redraw();
        };
        $$("[data-mv]", root).forEach(x => x.onclick = () => go(x.dataset.mv, 0));
        const svg = $(".ps-map svg", root), mr = $("[data-mrna]", root);
        if (svg && mr) {
          const pt = e => { const r = svg.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 900, (e.clientY - r.top) / r.height * 360]; };
          let drag = false;
          mr.addEventListener("pointerdown", e => { drag = true; mr.setPointerCapture(e.pointerId); e.preventDefault(); });
          mr.addEventListener("pointermove", e => { if (!drag) return; const [x, y] = pt(e); mr.setAttribute("transform", `translate(${x} ${y})`); });
          mr.addEventListener("pointerup", e => { if (!drag) return; drag = false; const [x, y] = pt(e);
            const near = (list) => list.findIndex(([px, py]) => Math.hypot(px - x, py - y) < 48);
            const p = near(PORES), r = near(RIBOS);
            if (p >= 0) go("pore", p); else if (r >= 0) go("ribosome", r);
            else { const inNuc = Math.hypot(x - 210, y - 185) < 140; if (inNuc && (st.pos || "nucleus") === "nucleus") { redraw(); } else go("wrong"); } });
        }
      }
      if (st.phase === "tl") {
        $$("[data-cod]", root).forEach(x => x.onclick = () => {
          const cods = codons(mrnaOf(g)), i = (st.aa || []).length, want = cods[i];
          if (x.dataset.cod === want) { st.aa = (st.aa || []).concat(CODE[want]); st.miss = 0;
            if (CODE[want] === "Stop") { st.phase = "done"; (st.done = st.done || {})[st.gene] = { tx: st.txMiss || 0, tl: st.tlMiss || 0 }; setMsg("", ""); say("Stop codon! The protein is released. " + g.trait); }
            else setMsg(`✅ ${want} = <b>${CODE[want]}</b> (${AA[CODE[want]]})${i === 0 ? ". AUG is the START codon!" : ""}`, "ok"); }
          else { st.tlMiss = (st.tlMiss || 0) + 1; st.miss = (st.miss || 0) + 1; setMsg(`❌ That codon is ${x.dataset.cod}. Look for <b>${want}</b>: row <b>${want[0]}</b>, column <b>${want[1]}</b>, line <b>${want[2]}</b>.${st.miss >= 2 ? " (It’s highlighted now.)" : ""}`, "bad"); }
          save(); redraw();
        });
      }
      const ag = $("[data-again]", root); if (ag) ag.onclick = () => { st.seenMove = 0; st.phase = "pick"; st.gene = null; st.pos = "nucleus"; st.mrnaMade = false; st.msg = ""; save(); redraw(); };
    },
    score(b, st) {
      const d = st.done || {}, keys = Object.keys(d);
      if (!keys.length) { const p = st.phase === "tl" ? 2 : st.phase === "move" ? 1 : 0; return { max: 6, pts: p, label: "protein synthesis" }; }
      const best = Math.max(...keys.map(k => { const r = d[k]; return 2 + (r.tx <= 2 ? 2 : r.tx <= 6 ? 1 : 0) + (r.tl <= 1 ? 2 : r.tl <= 4 ? 1 : 0); }));
      return { max: 6, pts: best, label: "protein synthesis" };
    },
    text(b, st) { const d = st.done || {}; return "Genes expressed: " + (Object.keys(d).map(k => `${GENES[k].short} (transcription misses ${d[k].tx}, translation misses ${d[k].tl})`).join("; ") || "none yet"); }
  };

  /* ---------- general CER builder ---------- */
  BT.cerg = {
    html(b, st) {
      const ev = st.ev || [], chk = !!st.checked;
      const box = (cc, title, inner) => `<div class="cer-box" style="--cc:${cc}"><h5>${title}</h5>${inner}</div>`;
      let h = `<div class="bb"><h4>${b.title}</h4><p class="mu">${b.q}</p><div class="cer">` +
        box("#2b7de9", "C · Claim: choose your answer", `<div class="cg-opts">${b.claims.map((c, i) => `<button class="cg-opt ${st.claim === i ? "on" : ""}" style="--cc:#2b7de9" data-cl="${i}"><span>${c}</span></button>`).join("")}</div>`) +
        box("#1aa36f", `E · Evidence: choose the ${b.need || 2} BEST pieces of evidence`, `<div class="cg-opts">${b.evidence.map((c, i) => `<button class="cg-opt ${ev.includes(i) ? "on" : ""}" style="--cc:#1aa36f" data-ev="${i}"><span>${c[0]}</span></button>`).join("")}</div>`) +
        box("#e08a00", "R · Reasoning: explain WHY", `<div class="wbank"><b>Word bank (tap to add)</b>${b.words.map(w => `<button class="wchip" data-w="${w}">${w}</button>`).join("")}</div>
          <div class="wbank"><b>Sentence starters (tap to add)</b>${b.frames.map(f => `<button class="wchip" data-w="${f}">${f}</button>`).join("")}</div>
          <textarea class="cer-ta" data-rs placeholder="${esc(b.frames[0] || "")}">${esc(st.r || "")}</textarea><div class="mu small"><span data-rc>${(String(st.r || "").match(/\S+/g) || []).length}</span> words · aim for 25+</div>`) + "</div>";
      if (chk) { const sc = BT.cerg.parts(b, st);
        h += `<ul class="rub">${sc.list.map(r => `<li class="${r[1] ? "ok" : "bad"}">${r[1] ? "✓" : "✗"} ${r[0]}</li>`).join("")}</ul>
          <div class="cer-final"><b>📄 My CER</b><p><b style="color:#2b7de9">Claim:</b> ${st.claim != null ? b.claims[st.claim].replace(/<[^>]+>/g, "") : "___"}</p><p><b style="color:#1aa36f">Evidence:</b> ${ev.map(i => b.evidence[i][0].replace(/<[^>]+>/g, "")).join(" ") || "___"}</p><p><b style="color:#e08a00">Reasoning:</b> ${esc(st.r || "___")}</p></div>
          <p class="score">CER score: <b>${sc.pts} / 4</b>${sc.pts < 4 ? " · Fix the ✗ parts and check again." : " · Excellent scientist!"}</p>`; }
      return h + `<div class="btnrow"><button class="btn" data-cercheck>${chk ? "Check again" : "Check my CER"}</button><span class="msg"></span></div></div>`;
    },
    parts(b, st) {
      const ev = st.ev || [], r = String(st.r || ""), good = ev.filter(i => b.evidence[i][1]).length, bad = ev.filter(i => !b.evidence[i][1]).length;
      const list = [["Claim answers the question correctly", st.claim === b.claimA], [`Evidence: ${b.need || 2} strong pieces chosen`, good >= (b.need || 2) && bad === 0],
        ["Reasoning uses key science words", (b.must || []).every(re => new RegExp(re, "i").test(r))], ["Reasoning is 20+ words", (r.match(/\S+/g) || []).length >= 20]];
      return { list, pts: list.filter(x => x[1]).length };
    },
    wire(root, b, st, save, redraw) {
      $$("[data-cl]", root).forEach(x => x.onclick = () => { st.claim = +x.dataset.cl; save(); redraw(); });
      $$("[data-ev]", root).forEach(x => x.onclick = () => { const i = +x.dataset.ev; st.ev = st.ev || []; const k = st.ev.indexOf(i); if (k >= 0) st.ev.splice(k, 1); else st.ev.push(i); save(); redraw(); });
      const ta = $("[data-rs]", root);
      ta.oninput = () => { st.r = ta.value; $("[data-rc]", root).textContent = (ta.value.match(/\S+/g) || []).length; save(); };
      $$("[data-w]", root).forEach(x => x.onclick = () => { const v = ta.value; ta.value = v + (v && !/\s$/.test(v) ? " " : "") + x.dataset.w + " "; ta.oninput(); ta.focus(); });
      $("[data-cercheck]", root).onclick = () => { if (st.claim == null || !(st.ev || []).length) { $(".msg", root).textContent = "Choose a claim and your evidence first."; return; } st.checked = true; save(); redraw(); };
    },
    score(b, st) { return { max: 4, pts: st.checked ? BT.cerg.parts(b, st).pts : 0, label: "CER" }; },
    text(b, st) { return `Claim: ${st.claim != null ? b.claims[st.claim].replace(/<[^>]+>/g, "") : ""} | Evidence: ${(st.ev || []).map(i => b.evidence[i][0].replace(/<[^>]+>/g, "")).join(" ")} | Reasoning: ${st.r || ""}`; }
  };

  /* ---------- MUTATION LAB: change the GFP glow center ---------- */
  if (!document.getElementById("ml-css")) {
    const css = document.createElement("style"); css.id = "ml-css";
    css.textContent = `
    .ml-top{display:grid;grid-template-columns:minmax(0,1fr) 200px;gap:14px;align-items:start}.ml-top>div{min-width:0}
    .ml-tools{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0}
    .ml-tool{border:3px solid var(--line);background:var(--surface);border-radius:14px;padding:8px 12px;font:inherit;font-weight:800;cursor:pointer}
    .ml-tool.on{border-color:var(--lc);background:color-mix(in srgb,var(--lc) 14%,var(--surface))}
    .ml-dna .ps-b{cursor:pointer} .ml-dna .ps-b.sel{outline:4px solid #121015;outline-offset:2px}
    .ml-dna .ps-b.chg{box-shadow:0 0 0 3px #ffc53d}
    .ml-aa{display:flex;gap:2px;flex:none}
    .ml-aa span{display:inline-grid;place-items:center;width:88px;height:30px;border-radius:999px;color:#fff;font:700 .85rem var(--display);margin-right:8px}
    .ml-aa span.diff{outline:3px solid #d0453a;outline-offset:1px}
    .ml-aa span.stop{background:#d0453a!important}
    .ml-aa span.gone{background:#ccc!important;color:#666}
    .ml-res{border:3px solid var(--rc,#1aa36f);border-radius:16px;padding:10px 12px;background:color-mix(in srgb,var(--rc,#1aa36f) 8%,var(--surface));margin-top:8px}
    .ml-res b.t{display:block;font:700 1.15rem var(--display);color:var(--rc,#1aa36f)}
    .ml-jelly{text-align:center} .ml-jelly svg{width:100%;max-width:220px}
    .ml-miss{display:grid;gap:6px;margin-top:10px}
    .ml-m{display:flex;gap:10px;align-items:flex-start;border:2px solid var(--line);border-radius:12px;padding:8px 10px;background:var(--surface)}
    .ml-m.ok{border-color:var(--ok);background:color-mix(in srgb,var(--ok) 10%,var(--surface))}
    .ml-m .ck{font-size:1.3rem} .ml-m details{font-size:.88rem;color:var(--muted)}
    @media (max-width:820px){.ml-top{grid-template-columns:1fr}}`;
    document.head.appendChild(css);
  }
  const ML_ORIG = "ACTTTCTCTTATGGTGTTCAA";   // real GFP coding sequence for amino acids 63-69 (Thr-Phe-Ser-Tyr-Gly-Val-Gln); Ser65-Tyr66-Gly67 form the chromophore
  const transl = dna => { const m = dna.replace(/T/g, "U"), out = []; for (let i = 0; i + 3 <= m.length; i += 3) { const a = CODE[m.slice(i, i + 3)]; out.push(a); if (a === "Stop") break; } return out; };
  const P0 = transl(ML_ORIG);
  function classify(dna) {
    if (dna === ML_ORIG) return { k: "none" };
    const P = transl(dna), d = dna.length - ML_ORIG.length, stopAt = P.indexOf("Stop");
    if (d % 3 !== 0) return { k: "frameshift", P };
    if (stopAt >= 0 && stopAt < P0.length) return { k: "nonsense", P };
    if (d !== 0) return { k: "inframe", P };
    if (P.join() === P0.join()) return { k: "silent", P };
    const diff = P.map((a, i) => a !== P0[i] ? i : -1).filter(i => i >= 0);
    if (diff.length === 1 && diff[0] === 3 && P[3] === "His") return { k: "blue", P };
    if (diff.length === 1 && diff[0] === 3 && P[3] === "Trp") return { k: "cyan", P };
    return { k: "missense", P, diff };
  }
  const RES = {
    none: ["#8a54e0", "No mutation yet", "This is the normal gene. The protein glows <b>green</b>.", "#7dff8a"],
    silent: ["#1aa36f", "🤫 Silent mutation", "The DNA changed, but the new codon codes for the <b>same amino acid</b>. The protein is the same, so it still glows <b>green</b>.", "#7dff8a"],
    missense: ["#e08a00", "🔄 Missense mutation", "One amino acid changed. That can change the protein’s <b>shape</b>, so the glow might get weaker or stop.", "#b7d9a0"],
    blue: ["#2b7de9", "🔵 Missense mutation: BLUE glow!", "Tyr changed to <b>His</b> in the glowing center. Scientists made this real change to create <b>blue fluorescent protein</b>.", "#7db8ff"],
    cyan: ["#0e9aa7", "🩵 Missense mutation: CYAN glow!", "Tyr changed to <b>Trp</b> in the glowing center. Scientists made this real change to create <b>cyan fluorescent protein</b>.", "#7df0ff"],
    nonsense: ["#d0453a", "🛑 Nonsense mutation", "A codon changed into a <b>STOP</b> codon. The ribosome stops early, so the protein is <b>too short</b> and cannot glow.", "#555"],
    frameshift: ["#d0453a", "↔️ Frameshift mutation", "Adding or removing a base <b>shifts the reading frame</b>. Every codon after it is read wrong, so the amino acids are scrambled and the protein cannot glow.", "#555"],
    inframe: ["#e08a00", "➕ In-frame insertion/deletion", "You added or removed exactly 3 bases, so one amino acid was added or lost. The rest is read correctly, but the shape may change.", "#b7d9a0"]
  };
  const jelly = col => `<svg viewBox="0 0 220 140" aria-label="Jellyfish glow preview"><defs><radialGradient id="mlg"><stop offset="0" stop-color="${col}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient></defs><rect width="220" height="140" rx="16" fill="#14213d"/>${col !== "#555" ? `<circle cx="110" cy="58" r="62" fill="url(#mlg)"/>` : ""}<path d="M66 64 Q110 4 154 64z" fill="${col}" stroke="${col === "#555" ? "#888" : "#fff"}" stroke-opacity=".6" stroke-width="3"/>${[78, 94, 110, 126, 142].map(x => `<path d="M${x} 64 q-7 20 0 34 q7 14 0 30" stroke="${col}" stroke-width="3" fill="none"/>`).join("")}</svg>`;
  const MISSIONS = [
    ["silent", "🤫 Make a SILENT mutation", "Change one DNA base so the protein stays exactly the same.", "Look at codon 3 (TCT = Ser). TCT, TCC, TCA, and TCG all code for Ser. Try changing its last base."],
    ["nonsense", "🛑 Make a NONSENSE mutation", "Change one base to create a STOP codon early.", "STOP codons in mRNA are UAA, UAG, UGA, so in DNA: TAA, TAG, TGA. Codon 4 is TAT. Change one base to make TAA or TAG."],
    ["frameshift", "↔️ Make a FRAMESHIFT mutation", "Insert or delete ONE base and watch every codon after it change.", "Choose ➕ Insert or ➖ Delete, then tap a base near the start."],
    ["blue", "🔵 Make the jellyfish glow BLUE", "Change ONE base so the 4th amino acid (Tyr) becomes His.", "Tyr is TAT in DNA. His is CAT or CAC. Which single base would you change?"]
  ];
  BT.mutlab = {
    html(b, st) {
      const dna = st.dna || ML_ORIG, tool = st.tool || "sub", c = classify(dna), P = transl(dna), R = RES[c.k], done = st.done || {};
      const chgIdx = new Set(); if (dna.length === ML_ORIG.length) [...dna].forEach((x, i) => { if (x !== ML_ORIG[i]) chgIdx.add(i); });
      const dnaTiles = [...dna].map((x, i) => `<span class="ps-b ${i % 3 === 2 ? "gap" : ""} ${st.sel === i ? "sel" : ""} ${chgIdx.has(i) ? "chg" : ""}" data-ml="${i}" style="--bc:${BASECOL[x]}" role="button" tabindex="0" aria-label="Base ${i + 1}: ${x}">${x}</span>`).join("");
      const mr = dna.replace(/T/g, "U");
      const aaRow = list => `<span class="ml-aa">${list.map((a, i) => `<span class="${a === "Stop" ? "stop" : ""} ${list !== P0 && a !== P0[i] ? "diff" : ""}" style="background:${aaColor(a)}">${a === "Stop" ? "STOP" : a}</span>`).join("")}${list.length < P0.length && list[list.length - 1] === "Stop" ? P0.slice(list.length).map(() => `<span class="gone">—</span>`).join("") : ""}</span>`;
      return `<div class="ps"><h4>${b.title || "Mutation Lab"}</h4>
        <p>This is a short section from the middle of the <b>GFP gene</b> (amino acids 63–69). Ser, Tyr, and Gly (amino acids 65–67) fold into the protein’s <b>glowing center</b>. Change the DNA and watch what happens to the mRNA, the protein, and the glow.</p>
        <div class="ml-top"><div>
          <div class="ml-tools"><b>Tool:</b>
            <button class="ml-tool ${tool === "sub" ? "on" : ""}" data-tool="sub">🔁 Swap a base</button>
            <button class="ml-tool ${tool === "ins" ? "on" : ""}" data-tool="ins">➕ Insert a base</button>
            <button class="ml-tool ${tool === "del" ? "on" : ""}" data-tool="del">➖ Delete a base</button>
            <button class="ml-tool" data-reset>↺ Reset to normal</button></div>
          <p class="mu small">${tool === "del" ? "Tap a DNA base to delete it." : tool === "ins" ? "Tap a DNA base. Then choose the new base to put in front of it." : "Tap a DNA base. Then choose the new base."}</p>
          <div class="ps-row ml-dna"><span class="lab">DNA (coding strand)</span><span class="ps-strand">${dnaTiles}</span></div>
          ${tool !== "del" && st.sel != null ? `<div class="ps-keys">${[..."ATCG"].map(k => `<button class="ps-key" data-mb="${k}" style="background:${BASECOL[k]}">${k}</button>`).join("")}<span class="mu small">${tool === "ins" ? "Insert before base " + (st.sel + 1) : "Change base " + (st.sel + 1) + " (" + dna[st.sel] + ") to…"}</span></div>` : ""}
          <div class="ps-row"><span class="lab">mRNA</span><span class="ps-strand">${[...mr].map((x, i) => tile(x, i % 3 === 2 ? "gap" : "")).join("")}</span></div>
          <div class="ps-row"><span class="lab">Normal protein</span>${aaRow(P0)}</div>
          <div class="ps-row"><span class="lab">Your protein</span>${aaRow(P)}</div>
          <div class="ml-res" style="--rc:${R[0]}"><b class="t">${R[1]}</b>${R[2]}</div>
        </div><div class="ml-jelly">${jelly(R[3])}<p class="mu small">${c.k === "nonsense" || c.k === "frameshift" ? "No glow" : c.k === "blue" ? "Blue glow" : c.k === "cyan" ? "Cyan glow" : c.k === "missense" || c.k === "inframe" ? "Glow may be weaker" : "Green glow"}</p></div></div>
        <div class="ml-miss"><b>🎯 Missions (complete all 4):</b>${MISSIONS.map(([k, t, d, h]) => `<div class="ml-m ${done[k] ? "ok" : ""}"><span class="ck">${done[k] ? "✅" : "⬜"}</span><div><b>${t}</b><br>${d}${done[k] ? ` <b style="color:var(--ok)">Done! You changed ${esc(done[k])}.</b>` : `<details><summary>Need a hint?</summary>${h}</details>`}</div></div>`).join("")}</div>
        <p class="ps-msg" aria-live="polite">${st.msg || ""}</p></div>`;
    },
    wire(root, b, st, save, redraw) {
      const upd = (before) => {
        const c = classify(st.dna), done = st.done = st.done || {};
        const desc = () => { const m = before.replace(/T/g, "U"), n = st.dna.replace(/T/g, "U"); return st.dna.length === ML_ORIG.length ? (() => { const i = [...st.dna].findIndex((x, j) => x !== before[j]); if (i < 0) return "nothing"; const ci = Math.floor(i / 3) * 3; return `codon ${ci / 3 + 1} from ${m.slice(ci, ci + 3)} to ${n.slice(ci, ci + 3)}`; })() : (st.dna.length > before.length ? "the reading frame by adding a base" : "the reading frame by removing a base"); };
        const k = c.k === "cyan" ? "missense" : c.k;
        if (["silent", "nonsense", "frameshift", "blue"].includes(k) && !done[k]) { done[k] = desc(); st.msg = `<span class="ok">🎉 Mission complete: ${MISSIONS.find(m => m[0] === k)[1]}! Press ↺ Reset to try the next one.</span>`; say(RES[c.k][1].replace(/[^\w\s:]/g, "") + ". Mission complete!"); }
        else st.msg = "";
      };
      $$("[data-tool]", root).forEach(x => x.onclick = () => { st.tool = x.dataset.tool; st.sel = null; save(); redraw(); });
      const rs = $("[data-reset]", root); if (rs) rs.onclick = () => { st.dna = ML_ORIG; st.sel = null; st.msg = ""; save(); redraw(); };
      $$("[data-ml]", root).forEach(x => { const act = () => { const i = +x.dataset.ml, dna = st.dna || ML_ORIG;
        if ((st.tool || "sub") === "del") { if (dna.length <= 6) return; st.dna = dna.slice(0, i) + dna.slice(i + 1); st.sel = null; upd(dna); }
        else st.sel = i; save(); redraw(); };
        x.onclick = act; x.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); act(); } }; });
      $$("[data-mb]", root).forEach(x => x.onclick = () => { const dna = st.dna || ML_ORIG, i = st.sel, k = x.dataset.mb; if (i == null) return;
        if ((st.tool || "sub") === "ins") { if (dna.length >= 30) return; st.dna = dna.slice(0, i) + k + dna.slice(i); }
        else { if (dna[i] === k) return; st.dna = dna.slice(0, i) + k + dna.slice(i + 1); }
        st.sel = null; upd(dna); save(); redraw(); });
    },
    score(b, st) { const d = st.done || {}; return { max: 4, pts: ["silent", "nonsense", "frameshift", "blue"].filter(k => d[k]).length, label: "mutation missions" }; },
    text(b, st) { const d = st.done || {}; return "Missions: " + MISSIONS.map(m => `${m[0]}: ${d[m[0]] || "not done"}`).join("; "); }
  };
});
