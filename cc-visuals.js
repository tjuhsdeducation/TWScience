/* =====================================================================
   BIOLOGY LAB VISUALS (no need to edit)
   visual  : a labeled diagram.  { t:"visual", v:"name", title, cap }
             Names: loop, glucose, temp, posneg, forelimbs, tree, pyramid,
             ppcycle, symb, rbc, punnett, carbs, eutro, selection, lactase
   embryos : interactive embryo comparison (fish, chicken, pig, human) at
             3 stages. Tap a stage; tap a feature to highlight it.
   Labels include Spanish (in gray) to support English learners.
   Drawings are simplified diagrams, not to scale.
   ===================================================================== */
(window.CC_EXTS = window.CC_EXTS || []).push(function (BT, H) {
  const { $, $$ } = H;
  if (!document.getElementById("vis-css")) {
    const css = document.createElement("style"); css.id = "vis-css";
    css.textContent = `
    .vis{border:3px solid var(--line);border-radius:22px;padding:12px 14px;background:var(--surface)}
    .vis h4{margin:0 0 6px}.vis .cap{font-size:.86rem;color:var(--muted);margin:6px 0 0}
    .vis svg{width:100%;height:auto;display:block;background:#fff;border-radius:14px;border:2px solid var(--line)}
    .emb-bar{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}.emb-bar button{border:2px solid var(--line);border-radius:999px;background:var(--surface);font:inherit;font-weight:800;padding:5px 12px;cursor:pointer}
    .emb-bar button.on{border-color:var(--lc);background:color-mix(in srgb,var(--lc) 15%,var(--surface))}
    .emb-bar span{font-weight:800;font-size:.85rem;align-self:center;color:var(--muted)}`;
    document.head.appendChild(css);
  }
  const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.fs || 13}" text-anchor="${o.a || "middle"}" font-weight="${o.b ? 700 : 400}" fill="${o.c || "#222"}"${o.it ? ' font-style="italic"' : ""}>${s}</text>`;
  const ES = (x, y, s, o = {}) => T(x, y, s, Object.assign({ fs: 11, c: "#777", it: 1 }, o));
  const AR = (x1, y1, x2, y2, c = "#333", w = 3) => { const a = Math.atan2(y2 - y1, x2 - x1), h = 11; return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}"/><polygon points="${x2},${y2} ${x2 - h * Math.cos(a - .45)},${y2 - h * Math.sin(a - .45)} ${x2 - h * Math.cos(a + .45)},${y2 - h * Math.sin(a + .45)}" fill="${c}"/>`; };
  const BOX = (x, y, w, h, f, s, r = 12) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}" stroke="${s}" stroke-width="2.5"/>`;
  const SV = (w, h, g, alt) => `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${alt}">${g}</svg>`;
  const RED = "#d0453a", ORA = "#e08a00", PUR = "#8a54e0", BLU = "#2b7de9", GRN = "#1aa36f", YEL = "#f2b705";
  const V = {};

  /* ---------- HOMEOSTASIS ---------- */
  V.loop = () => { const P = [[260, 46, "1. Stimulus", "estímulo", "A change happens", RED], [440, 120, "2. Sensor", "sensor", "Detects the change", ORA], [380, 250, "3. Control center", "centro de control", "Compares to set point", PUR], [140, 250, "4. Effector", "efector", "Carries out a response", BLU], [80, 120, "5. Response", "respuesta", "Change is reversed", GRN]];
    let g = `<circle cx="260" cy="160" r="58" fill="#f6f6fa" stroke="#bbb" stroke-dasharray="6 5"/>` + T(260, 155, "SET POINT", { b: 1, fs: 14 }) + ES(260, 172, "punto de referencia") + T(260, 190, "e.g. 37 °C or 90 mg/dL", { fs: 10, c: "#555" });
    const C = [[338, 56, 420, 92], [440, 150, 400, 222], [302, 252, 220, 252], [110, 224, 80, 152], [120, 94, 182, 56]];
    C.forEach(a => g += AR(...a, "#555", 3));
    P.forEach(([x, y, n, es, d, c]) => g += BOX(x - 78, y - 26, 156, 56, "#fff", c) + T(x, y - 6, n, { b: 1, c }) + ES(x, y + 8, es) + T(x, y + 22, d, { fs: 10, c: "#444" }));
    return SV(520, 300, g, "Diagram of the five parts of a negative feedback loop arranged in a circle around the set point"); };
  V.glucose = () => { let g = T(260, 22, "Blood glucose is kept near the set point (≈ 90 mg/dL)", { b: 1, fs: 14 });
    g += BOX(195, 135, 130, 60, "#fff7d6", YEL) + T(260, 158, "PANCREAS", { b: 1 }) + ES(260, 172, "páncreas") + T(260, 186, "senses glucose", { fs: 10 });
    g += BOX(20, 45, 180, 70, "#ffe9e6", RED) + T(110, 70, "Glucose TOO HIGH", { b: 1, c: RED }) + ES(110, 84, "glucosa alta") + T(110, 102, "after eating a meal", { fs: 10 });
    g += BOX(320, 45, 180, 70, "#e6f0ff", BLU) + T(410, 70, "Glucose TOO LOW", { b: 1, c: BLU }) + ES(410, 84, "glucosa baja") + T(410, 102, "exercise, skipped meal", { fs: 10 });
    g += AR(140, 118, 200, 140, RED) + AR(380, 118, 320, 140, BLU);
    g += BOX(20, 225, 200, 82, "#fff", BLU) + T(120, 248, "INSULIN released", { b: 1, c: BLU }) + ES(120, 262, "insulina") + T(120, 280, "Cells take in glucose; liver", { fs: 10 }) + T(120, 294, "stores it as glycogen", { fs: 10 });
    g += BOX(300, 225, 200, 82, "#fff", ORA) + T(400, 248, "GLUCAGON released", { b: 1, c: ORA }) + ES(400, 262, "glucagón") + T(400, 280, "Liver breaks down glycogen", { fs: 10 }) + T(400, 294, "and releases glucose", { fs: 10 });
    g += AR(215, 196, 160, 222, BLU) + AR(305, 196, 360, 222, ORA);
    g += BOX(150, 336, 220, 48, "#e8f7ef", GRN) + T(260, 356, "Back near the set point ✓", { b: 1, c: GRN }) + ES(260, 372, "de vuelta al punto de referencia (≈ 90 mg/dL)", { fs: 10 });
    g += AR(120, 310, 185, 334, GRN) + T(118, 328, "glucose goes DOWN ↓", { fs: 10, a: "end", c: GRN, b: 1 }) + AR(400, 310, 335, 334, GRN) + T(402, 328, "glucose goes UP ↑", { fs: 10, a: "start", c: GRN, b: 1 });
    return SV(520, 392, g, "Diagram: when glucose is too high the pancreas releases insulin and glucose goes down; when glucose is too low it releases glucagon and glucose goes up"); };
  V.temp = () => { const person = (x, hot) => { let p = `<circle cx="${x}" cy="90" r="24" fill="${hot ? "#ffb3a6" : "#cfe2ff"}" stroke="#333" stroke-width="2"/><rect x="${x - 26}" y="118" width="52" height="86" rx="20" fill="${hot ? "#ffb3a6" : "#cfe2ff"}" stroke="#333" stroke-width="2"/>`;
      p += `<line x1="${x - 26}" y1="135" x2="${x - 52}" y2="190" stroke="#333" stroke-width="7" stroke-linecap="round"/><line x1="${x + 26}" y1="135" x2="${x + 52}" y2="190" stroke="#333" stroke-width="7" stroke-linecap="round"/><line x1="${x - 12}" y1="204" x2="${x - 16}" y2="262" stroke="#333" stroke-width="8" stroke-linecap="round"/><line x1="${x + 12}" y1="204" x2="${x + 16}" y2="262" stroke="#333" stroke-width="8" stroke-linecap="round"/>`;
      if (hot) [[-18, 70], [22, 76], [-34, 140], [36, 150], [0, 160]].forEach(([dx, y]) => p += `<path d="M${x + dx} ${y} q-5 9 0 13 q5 -4 0 -13z" fill="${BLU}"/>`);
      else { [[-62, 160], [62, 160], [-44, 110], [44, 110]].forEach(([dx, y]) => p += `<path d="M${x + dx - 6} ${y} l4 -6 l4 6 l4 -6" fill="none" stroke="${BLU}" stroke-width="2"/>`); for (let i = 0; i < 9; i++) p += `<circle cx="${x - 20 + (i % 3) * 20}" cy="${140 + Math.floor(i / 3) * 18}" r="2.2" fill="#555"/>`; }
      return p; };
    let g = T(130, 24, "TOO HOT → cool down", { b: 1, c: RED, fs: 15 }) + ES(130, 40, "demasiado calor") + T(390, 24, "TOO COLD → warm up", { b: 1, c: BLU, fs: 15 }) + ES(390, 40, "demasiado frío") + person(130, true) + person(390, false);
    g += `<ellipse cx="260" cy="70" rx="34" ry="24" fill="#f3d5e6" stroke="${PUR}" stroke-width="2"/>` + T(260, 74, "brain", { fs: 11, b: 1 }) + T(260, 108, "Hypothalamus", { fs: 11, b: 1, c: PUR }) + ES(260, 121, "hipotálamo") + T(260, 135, "(control center)", { fs: 10 });
    g += AR(225, 78, 165, 90, PUR, 2) + AR(295, 78, 355, 90, PUR, 2);
    [["💧 sweat (sudor)", 286], ["vessels widen", 302], ["→ heat leaves", 318]].forEach(([s, y]) => g += T(130, y, s, { fs: 11 }));
    [["shivering (temblar)", 286], ["vessels narrow", 302], ["goosebumps", 318]].forEach(([s, y]) => g += T(390, y, s, { fs: 11 }));
    return SV(520, 330, g, "Two people: when too hot the body sweats and widens blood vessels; when too cold it shivers, narrows vessels, and gets goosebumps; the hypothalamus controls both"); };
  V.posneg = () => { const ax = (x0, t, es) => `<line x1="${x0}" y1="40" x2="${x0}" y2="210" stroke="#555"/><line x1="${x0}" y1="210" x2="${x0 + 220}" y2="210" stroke="#555"/>` + T(x0 + 110, 26, t, { b: 1 }) + ES(x0 + 110, 40, es) + T(x0 + 110, 228, "time →", { fs: 10 });
    let g = ax(20, "Negative feedback", "retroalimentación negativa") + `<line x1="20" y1="125" x2="240" y2="125" stroke="#888" stroke-dasharray="5 4"/>` + T(26, 140, "set point", { fs: 10, a: "start", c: "#666" });
    let d = ""; for (let i = 0; i <= 100; i++) { const x = 20 + i * 2.2, y = 125 - 40 * Math.sin(i / 7) * Math.exp(-i / 70); d += (i ? "L" : "M") + x + " " + y; } g += `<path d="${d}" fill="none" stroke="${BLU}" stroke-width="3"/>` + T(130, 248, "Change is REVERSED, so it stays near the set point", { fs: 10, c: BLU, b: 1 });
    g += ax(280, "Positive feedback", "retroalimentación positiva"); d = ""; for (let i = 0; i <= 80; i++) { const x = 280 + i * 2.2, y = 200 - 150 * Math.pow(i / 80, 3); d += (i ? "L" : "M") + x + " " + y; } g += `<path d="${d}" fill="none" stroke="${ORA}" stroke-width="3"/><line x1="456" y1="48" x2="500" y2="200" stroke="${ORA}" stroke-width="3" stroke-dasharray="4 4"/>` + T(450, 64, "baby born", { fs: 10, a: "end", b: 1 }) + T(450, 78, "→ loop stops", { fs: 10, a: "end" });
    g += T(390, 248, "Change gets BIGGER until an event finishes", { fs: 10, c: ORA, b: 1 });
    return SV(520, 260, g, "Two graphs: negative feedback wiggles back to the set point; positive feedback rises faster and faster until an event like birth ends it"); };

  /* ---------- EVOLUTION ---------- */
  V.forelimbs = () => { const C = { h: RED, r: BLU, u: GRN, c: YEL, p: PUR };
    const limb = (x, o) => { let g = "", y = 40; const hw = o.hw || 12;
      g += `<rect x="${x - hw / 2}" y="${y}" width="${hw}" height="${o.H}" rx="5" fill="${C.h}"/>`; y += o.H + 4;
      g += `<rect x="${x - 10}" y="${y}" width="7" height="${o.R}" rx="3" fill="${C.r}"/><rect x="${x + 3}" y="${y}" width="7" height="${o.R}" rx="3" fill="${C.u}"/>`; y += o.R + 4;
      for (let i = 0; i < 5; i++) g += `<circle cx="${x - 10 + i * 5}" cy="${y + 4}" r="4" fill="${C.c}" stroke="#a07c00" stroke-width=".8"/>`; y += 10;
      const n = 5; for (let i = 0; i < n; i++) { const ang = (o.spread || 0.12) * (i - 2), len = o.P * (o.thumb && i === 0 ? 0.55 : 1); const x1 = x - 10 + i * 5, y1 = y, x2 = x1 + Math.sin(ang) * len, y2 = y1 + Math.cos(ang) * len; g += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C.p}" stroke-width="4" stroke-linecap="round"/>`; o.ends = o.ends || []; o.ends.push([x2, y2]); }
      if (o.wing) g = `<path d="M${x - 8} ${40 + o.H} L ${o.ends[0][0]} ${o.ends[0][1]} L ${o.ends[1][0]} ${o.ends[1][1]} L ${o.ends[2][0]} ${o.ends[2][1]} L ${o.ends[3][0]} ${o.ends[3][1]} L ${o.ends[4][0]} ${o.ends[4][1]} L ${x + 40} ${y - 30} Z" fill="#e8e0f5" stroke="#a99bc7"/>` + g;
      if (o.flip) g = `<path d="M${x - 22} ${y - 8} Q ${x - 30} ${y + o.P * 0.7} ${x} ${y + o.P + 14} Q ${x + 30} ${y + o.P * 0.7} ${x + 22} ${y - 8} Z" fill="#dde6ee" stroke="#9fb2c4"/>` + g;
      return g + T(x, 290, o.name, { b: 1 }) + ES(x, 304, o.es) + T(x, 318, o.job, { fs: 10, c: "#444" }); };
    let g = T(260, 22, "Same bones, different jobs: homologous forelimbs", { b: 1, fs: 14 });
    g += limb(70, { name: "Human", es: "humano", job: "grab", H: 80, R: 66, P: 44, thumb: 1, spread: 0.14 }) + limb(195, { name: "Cat", es: "gato", job: "walk", H: 70, R: 64, P: 22, spread: 0.08 }) + limb(320, { name: "Whale", es: "ballena", job: "swim", H: 34, R: 26, P: 80, hw: 18, spread: 0.1, flip: 1 }) + limb(440, { name: "Bat", es: "murciélago", job: "fly", H: 56, R: 70, P: 96, spread: 0.32, wing: 1 });
    [["humerus (upper arm)", C.h], ["radius", C.r], ["ulna", C.u], ["carpals (wrist)", C.c], ["phalanges (fingers)", C.p]].forEach(([n, c], i) => { const x = 40 + (i % 3) * 160, y = 334 + Math.floor(i / 3) * 22; g += `<rect x="${x}" y="${y}" width="14" height="14" rx="3" fill="${c}"/>` + T(x + 20, y + 12, n, { fs: 11, a: "start" }); });
    return SV(520, 378, g, "Forelimbs of a human, cat, whale, and bat with the same bones colored the same: humerus red, radius blue, ulna green, wrist yellow, fingers purple"); };
  V.tree = () => { const sp = [["Yeast", 12], ["Tuna", 8], ["Chicken", 5], ["Dog", 3], ["Monkey", 1], ["Chimp", 0], ["Human", 0]];
    let g = T(260, 22, "Family tree from the protein data (diff. = differences from human)", { b: 1, fs: 12 }), x0 = 40, y0 = 290;
    sp.forEach((s, i) => { const x = 70 + i * 66; g += `<line x1="${x}" y1="60" x2="${x}" y2="${y0 - i * 30}" stroke="${i >= 5 ? RED : "#555"}" stroke-width="3"/>` + T(x, 54, s[0], { fs: 11, b: 1 }) + (i < 6 ? T(x, 40, s[1] + " diff.", { fs: 10, c: i >= 5 ? RED : "#666" }) : T(x, 40, "reference", { fs: 10, c: RED })); });
    let d = `M70 ${y0}`; for (let i = 1; i < sp.length; i++) { const x = 70 + i * 66, y = y0 - i * 30; d += ` L ${x} ${y}`; } g += `<path d="${d}" fill="none" stroke="#555" stroke-width="3"/>`;
    for (let i = 1; i < sp.length; i++) { const x = 70 + i * 66, y = y0 - i * 30; g += `<circle cx="${x}" cy="${y}" r="5" fill="${ORA}"/>`; }
    g += T(260, 318, "● = common ancestor. Species that branch off later are more closely related.", { fs: 11, c: "#444" }) + ES(260, 334, "ancestro común");
    return SV(520, 345, g, "A family tree: yeast branches off first, then tuna, chicken, dog, rhesus monkey, and chimpanzee closest to human"); };

  /* ---------- ECOLOGY ---------- */
  V.pyramid = () => { const L = [["Lynx (secondary consumers)", "lince", "1,000 kcal", "#d9c6f5", PUR, 160], ["Hares (primary consumers)", "liebre", "10,000 kcal", "#ffe3b8", ORA, 300], ["Plants (producers)", "plantas", "100,000 kcal", "#cdeccf", GRN, 440]];
    let g = T(260, 22, "Energy pyramid: about 10% moves up each level", { b: 1, fs: 14 }) + ES(260, 38, "pirámide de energía");
    L.forEach(([n, es, k, f, s, w], i) => { const y = 54 + i * 78; g += `<polygon points="${260 - w / 2},${y + 70} ${260 + w / 2},${y + 70} ${260 + w / 2 - 60},${y} ${260 - w / 2 + 60},${y}" fill="${f}" stroke="${s}" stroke-width="2.5"/>` + T(260, y + 30, n, { b: 1, fs: 12 }) + ES(260, y + 44, es) + T(260, y + 60, k, { b: 1, c: s }); });
    g += T(478, 120, "↑ 10%", { b: 1, c: RED }) + T(478, 198, "↑ 10%", { b: 1, c: RED }) + T(40, 150, "90% lost", { fs: 10, c: RED, b: 1 }) + T(40, 164, "as heat 🔥", { fs: 10, c: RED }) + T(40, 228, "90% lost", { fs: 10, c: RED, b: 1 }) + T(40, 242, "as heat 🔥", { fs: 10, c: RED });
    return SV(520, 300, g, "Energy pyramid: plants 100,000 kcal, hares 10,000 kcal, lynx 1,000 kcal; about 90 percent is lost as heat at each step"); };
  V.ppcycle = () => { const S = [[260, 60, "Lots of hares", "muchas liebres", ORA], [430, 160, "Lynx have more food → lynx increase", "más linces", PUR], [260, 260, "Lynx eat many hares → hares crash", "menos liebres", ORA], [90, 160, "Lynx starve → lynx decrease", "menos linces", PUR]];
    let g = `<circle cx="260" cy="160" r="70" fill="#fff8ec" stroke="#e7d3b0"/>` + T(260, 156, "The cycle", { b: 1 }) + T(260, 172, "repeats about", { fs: 11 }) + T(260, 186, "every 10 years", { fs: 11, b: 1 });
    S.forEach(([x, y, t, es, c]) => g += BOX(x - 85, y - 26, 170, 52, "#fff", c) + T(x, y - 4, t.length > 22 ? t.split(" → ")[0] : t, { fs: 11, b: 1, c }) + (t.includes("→") ? T(x, y + 10, "→ " + t.split(" → ")[1], { fs: 11 }) : "") + ES(x, t.includes("→") ? y + 22 : y + 12, es));
    g += AR(345, 70, 420, 128, "#555") + AR(420, 192, 345, 248, "#555") + AR(175, 250, 100, 192, "#555") + AR(100, 128, 175, 70, "#555");
    return SV(520, 300, g, "Predator prey cycle: lots of hares, then lynx increase, then hares crash, then lynx decrease, and it repeats"); };
  V.symb = () => { const P = [["Mutualism", "mutualismo", "+", "+", GRN, "🐝 bee", "🌸 almond flower"], ["Commensalism", "comensalismo", "+", "0", BLU, "🐦 cattle egret", "🐄 cow"], ["Parasitism", "parasitismo", "+", "−", RED, "🪱 tick", "🦌 deer"]];
    let g = ""; P.forEach(([n, es, a, b, c, s1, s2], i) => { const x = 90 + i * 170;
      g += BOX(x - 78, 20, 156, 210, "#fff", c) + T(x, 46, n, { b: 1, c, fs: 14 }) + ES(x, 60, es);
      g += `<circle cx="${x - 36}" cy="118" r="30" fill="${c}22" stroke="${c}" stroke-width="2"/><circle cx="${x + 36}" cy="118" r="30" fill="${c}22" stroke="${c}" stroke-width="2"/>` + T(x - 36, 128, a, { fs: 30, b: 1, c }) + T(x + 36, 128, b, { fs: 30, b: 1, c });
      g += T(x - 36, 170, s1.split(" ")[0], { fs: 22 }) + T(x + 36, 170, s2.split(" ")[0], { fs: 22 }) + T(x - 36, 192, s1.split(" ").slice(1).join(" "), { fs: 10 }) + T(x + 36, 192, s2.split(" ").slice(1).join(" "), { fs: 10 });
      g += T(x, 218, a === "+" && b === "+" ? "both benefit" : b === "0" ? "one benefits, one unaffected" : "one benefits, one harmed", { fs: 10, b: 1 }); });
    return SV(520, 240, g, "Three types of symbiosis: mutualism plus plus, commensalism plus zero, parasitism plus minus, with examples"); };

  /* ---------- MINI LABS ---------- */
  V.rbc = () => { let g = T(130, 22, "Normal red blood cells", { b: 1, c: RED }) + ES(130, 36, "glóbulos rojos normales") + T(390, 22, "Sickle red blood cells", { b: 1, c: "#8a1f12" }) + ES(390, 36, "células falciformes");
    [[70, 80], [130, 70], [190, 86], [96, 132], [164, 136]].forEach(([x, y]) => g += `<ellipse cx="${x}" cy="${y}" rx="26" ry="20" fill="#e5524a" stroke="#a52c25" stroke-width="2"/><ellipse cx="${x}" cy="${y}" rx="11" ry="8" fill="#c7372f"/>`);
    [[330, 80], [400, 72], [455, 105], [350, 132], [425, 138]].forEach(([x, y], i) => g += `<path d="M${x - 28} ${y} Q ${x} ${y - 34} ${x + 28} ${y} Q ${x} ${y - 14} ${x - 28} ${y} Z" fill="#c23a2f" stroke="#7a1d15" stroke-width="2" transform="rotate(${i * 25 - 30} ${x} ${y})"/>`);
    g += T(130, 172, "round and flexible → flow easily", { fs: 11 }) + T(390, 186, "stiff and curved → can block vessels", { fs: 11 });
    const bead = (x, y, lab, c) => `<circle cx="${x}" cy="${y}" r="12" fill="${c}" stroke="#333" stroke-width="1.5"/>` + T(x, y + 3, lab, { fs: 8, b: 1, c: "#fff" });
    g += T(260, 214, "Hemoglobin protein (first amino acids)", { b: 1, fs: 12 });
    ["Val", "His", "Leu", "Thr", "Pro", "Glu", "Glu"].forEach((a, i) => g += bead(46 + i * 28, 242, a, i === 5 ? GRN : "#7d8590"));
    ["Val", "His", "Leu", "Thr", "Pro", "Val", "Glu"].forEach((a, i) => g += bead(306 + i * 28, 242, a, i === 5 ? RED : "#7d8590"));
    g += T(130, 274, "mRNA codon 6: GAG → Glu", { fs: 11, c: GRN, b: 1 }) + T(390, 274, "mRNA codon 6: GUG → Val", { fs: 11, c: RED, b: 1 }) + T(260, 294, "One base change (A → U) swaps one amino acid.", { fs: 11 });
    return SV(520, 304, g, "Normal round red blood cells next to curved sickle cells, and the hemoglobin chain where glutamic acid at position 6 is replaced by valine"); };
  V.punnett = () => { let g = T(260, 22, "Two carrier parents: AS × AS", { b: 1, fs: 14 }) + ES(260, 36, "dos padres portadores");
    const x0 = 180, y0 = 70, s = 80, cells = [["AA", "#cfe8ff", "no disease"], ["AS", "#ffe9b8", "carrier"], ["AS", "#ffe9b8", "carrier"], ["SS", "#ffd0cb", "sickle cell"]];
    g += T(x0 + s / 2, y0 - 8, "A", { b: 1, fs: 18 }) + T(x0 + s * 1.5, y0 - 8, "S", { b: 1, fs: 18, c: RED }) + T(x0 - 16, y0 + s / 2 + 6, "A", { b: 1, fs: 18 }) + T(x0 - 16, y0 + s * 1.5 + 6, "S", { b: 1, fs: 18, c: RED });
    cells.forEach(([gt, f, lab], i) => { const x = x0 + (i % 2) * s, y = y0 + Math.floor(i / 2) * s; g += `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${f}" stroke="#333" stroke-width="2"/>` + T(x + s / 2, y + s / 2, gt, { b: 1, fs: 20 }) + T(x + s / 2, y + s / 2 + 18, lab, { fs: 10 }); });
    g += T(420, 110, "25% AA", { b: 1, fs: 13, a: "start" }) + T(420, 140, "50% AS", { b: 1, fs: 13, a: "start", c: ORA }) + T(420, 170, "25% SS", { b: 1, fs: 13, a: "start", c: RED });
    return SV(520, 250, g, "Punnett square for AS times AS: one AA, two AS, one SS"); };
  V.carbs = () => { const hex = (x, y, c, lab) => { let p = ""; for (let i = 0; i < 6; i++) { const a = Math.PI / 3 * i + Math.PI / 6; p += `${x + 15 * Math.cos(a)},${y + 15 * Math.sin(a)} `; } return `<polygon points="${p}" fill="${c}" stroke="#333" stroke-width="1.5"/>` + (lab ? T(x, y + 4, lab, { fs: 8, b: 1 }) : ""); };
    let g = T(260, 20, "Carbohydrates in the yeast lab", { b: 1, fs: 14 });
    const rows = [["Glucose", "glucosa", "1 sugar ✓|yeast can use it", [[0, "#ffd166", "G"]], GRN], ["Sucrose", "sacarosa", "2 sugars ✓|yeast has an enzyme to split it", [[0, "#ffd166", "G"], [1, "#ff9f6b", "F"]], GRN], ["Lactose", "lactosa", "2 sugars ✗|yeast has no enzyme for it", [[0, "#ffd166", "G"], [1, "#b8d8ff", "Ga"]], RED], ["Starch", "almidón", "100s of sugars ✗|yeast can barely break it", Array.from({ length: 5 }, (_, i) => [i, "#ffd166", ""]), RED]];
    rows.forEach(([n, es, d, H, c], r) => { const y = 58 + r * 54; g += T(20, y + 4, n, { b: 1, a: "start" }) + ES(20, y + 18, es, { a: "start" }); H.forEach(([i, col, lab]) => { g += hex(120 + i * 32, y, col, lab); if (i) g += `<line x1="${120 + i * 32 - 17}" y1="${y}" x2="${120 + i * 32 - 15}" y2="${y}" stroke="#333" stroke-width="3"/>`; }); if (n === "Starch") g += T(282, y + 5, "… … …", { b: 1, fs: 14, a: "start" }); const [d1, d2] = d.split("|"); g += T(330, y - 1, d1, { fs: 12, c, b: 1, a: "start" }) + T(330, y + 14, d2, { fs: 11, c: "#333", a: "start" }); });
    g += T(20, 268, "G = glucose, F = fructose, Ga = galactose. Only single sugars go into cellular respiration.", { fs: 11, a: "start" });
    return SV(520, 280, g, "Glucose is one sugar ring, sucrose and lactose are two rings, starch is a long chain of rings"); };
  V.eutro = () => { const P = [["1. Fertilizer|runoff", "escorrentía", (x) => `<rect x="${x + 6}" y="70" width="98" height="60" fill="#9ccbe8"/><path d="M${x + 6} 70 l30 -30 l40 0 l0 30z" fill="#8bbf5a"/>` + [0, 1, 2].map(i => `<circle cx="${x + 40 + i * 10}" cy="${60 + i * 6}" r="4" fill="#7a4a1d"/>`).join("")],
      ["2. Algae|bloom", "floración de algas", (x) => `<rect x="${x + 6}" y="50" width="98" height="80" fill="#9ccbe8"/><rect x="${x + 6}" y="50" width="98" height="18" fill="#3fa34d"/>` + [0, 1, 2, 3, 4].map(i => `<circle cx="${x + 16 + i * 20}" cy="58" r="6" fill="#2f8a3c"/>`).join("")],
      ["3. Algae die|", "las algas mueren", (x) => `<rect x="${x + 6}" y="50" width="98" height="80" fill="#a6b9a0"/>` + [0, 1, 2, 3].map(i => `<path d="M${x + 14 + i * 24} 122 q8 -8 16 0" fill="none" stroke="#6b5a32" stroke-width="3"/>`).join("")],
      ["4. Decomposers|use up O₂", "descomponedores", (x) => `<rect x="${x + 6}" y="50" width="98" height="80" fill="#a6b9a0"/>` + [0, 1, 2, 3, 4, 5].map(i => `<ellipse cx="${x + 16 + i * 16}" cy="${110 - (i % 2) * 10}" rx="5" ry="3" fill="#7a4a8a"/>`).join("") + T(x + 55, 80, "O₂ ↓", { b: 1, c: RED, fs: 16 })],
      ["5. Fish die|(dead zone)", "zona muerta", (x) => `<rect x="${x + 6}" y="50" width="98" height="80" fill="#9aa89a"/>` + [0, 1].map(i => `<g transform="translate(${x + 30 + i * 40} ${62 + i * 6}) rotate(180)"><ellipse rx="12" ry="6" fill="#9aa"/><path d="M10 0 l8 -6 l0 12z" fill="#9aa"/></g>`).join("")]];
    let g = ""; P.forEach(([t, es, draw], i) => { const x = 2 + i * 104; const [t1, t2] = t.split("|"); g += `<rect x="${x + 2}" y="22" width="104" height="160" rx="10" fill="#fff" stroke="#ccc"/>` + draw(x) + T(x + 54, 146, t1, { fs: 11, b: 1 }) + T(x + 54, 159, t2, { fs: 11, b: 1 }) + ES(x + 54, 174, es, { fs: 9 }); });
    for (let i = 0; i < 4; i++) { const bx = 108 + i * 104; g += `<circle cx="${bx}" cy="100" r="11" fill="#fff" stroke="#555" stroke-width="1.5"/>` + AR(bx - 6, 100, bx + 7, 100, "#333", 2.5); }
    return SV(524, 186, g, "Five-panel comic: fertilizer runoff, algae bloom, algae die, decomposers use oxygen, fish die in a dead zone"); };
  V.selection = () => { const dish = (x, lab, es, blue, red) => { let g = `<circle cx="${x}" cy="110" r="66" fill="#fbf6e6" stroke="#999" stroke-width="3"/>`; let k = 0;
      const pts = []; for (let r = 10; r < 60; r += 12) for (let a = 0; a < Math.PI * 2; a += 0.9 - r / 120) pts.push([x + r * Math.cos(a + r), 110 + r * Math.sin(a + r)]);
      pts.forEach((p, i) => { const isRed = i < red, isBlue = !isRed && i < red + blue; if (isRed || isBlue) g += `<ellipse cx="${p[0]}" cy="${p[1]}" rx="5" ry="3" fill="${isRed ? RED : BLU}"/>`; });
      return g + T(x, 196, lab, { b: 1, fs: 12 }) + ES(x, 210, es); };
    let g = T(260, 22, "Natural selection in a dish", { b: 1, fs: 14 }) + dish(90, "1. Before antibiotic", "antes", 40, 3) + dish(260, "2. After antibiotic", "después", 0, 3) + dish(430, "3. Survivors divide", "se dividen", 0, 40);
    g += AR(160, 110, 190, 110, "#555") + AR(330, 110, 360, 110, "#555") + `<ellipse cx="40" cy="234" rx="6" ry="4" fill="${BLU}"/>` + T(52, 238, "sensitive (killed)", { fs: 11, a: "start" }) + `<ellipse cx="200" cy="234" rx="6" ry="4" fill="${RED}"/>` + T(212, 238, "resistant (has a mutation) / resistente", { fs: 11, a: "start" });
    return SV(520, 250, g, "Three petri dishes: before the antibiotic most bacteria are sensitive and a few are resistant; after, only resistant ones survive; then they divide and fill the dish"); };
  V.lactase = () => { const enz = (x, y, broken) => broken ? `<path d="M${x - 40} ${y - 30} q20 -20 50 -5 q30 20 10 45 q-30 25 -55 5 q-25 -20 -5 -45z" fill="#c9b6ef" stroke="${PUR}" stroke-width="2.5"/>` : `<path d="M${x - 40} ${y - 32} h80 v64 h-80 v-22 h28 v-20 h-28 z" fill="#c9b6ef" stroke="${PUR}" stroke-width="2.5"/>`;
    const sug = (x, y, c, l) => `<rect x="${x}" y="${y}" width="24" height="20" rx="5" fill="${c}" stroke="#333" stroke-width="1.5"/>` + T(x + 12, y + 14, l, { fs: 9, b: 1 });
    let g = T(260, 22, "Lactase works like a lock and key", { b: 1, fs: 14 }) + ES(260, 36, "llave y cerradura");
    g += sug(20, 80, "#ffd166", "Glu") + sug(44, 80, "#b8d8ff", "Gal") + T(46, 120, "lactose", { fs: 11, b: 1 }) + ES(46, 134, "lactosa");
    g += AR(78, 90, 120, 90, "#555", 2) + enz(170, 90) + T(170, 140, "lactase (enzyme)", { fs: 11, b: 1, c: PUR }) + ES(170, 154, "lactasa") + sug(132, 80, "#ffd166", "Glu") + sug(156, 80, "#b8d8ff", "Gal");
    g += AR(220, 90, 262, 90, "#555", 2) + sug(272, 70, "#ffd166", "Glu") + sug(272, 100, "#b8d8ff", "Gal") + T(300, 140, "glucose + galactose", { fs: 11, b: 1, a: "start" }) + T(300, 154, "(absorbed by the body)", { fs: 10, a: "start" });
    g += `<line x1="20" y1="180" x2="500" y2="180" stroke="#ddd"/>` + enz(110, 228, true) + T(110, 284, "Boiled or acid: shape changes", { fs: 11, b: 1, c: RED }) + ES(110, 298, "desnaturalizada") + sug(190, 218, "#ffd166", "Glu") + sug(214, 218, "#b8d8ff", "Gal") + T(260, 232, "✗ lactose doesn’t fit", { fs: 11, a: "start", c: RED, b: 1 }) + T(260, 250, "→ no glucose made", { fs: 11, a: "start" });
    return SV(520, 305, g, "Lactose fits into the active site of lactase and is split into glucose and galactose; a boiled enzyme changes shape so lactose no longer fits"); };

  BT.visual = { html: b => `<div class="vis">${b.title ? `<h4>${b.title}</h4>` : ""}${V[b.v] ? V[b.v]() : ""}${b.cap ? `<p class="cap">${b.cap}</p>` : ""}</div>` };

  /* ---------- interactive embryo comparison ---------- */
  const ORG = [["Fish", "pez", "#4aa3c7"], ["Chicken", "pollo", "#e0a846"], ["Pig", "cerdo", "#e58fa6"], ["Human", "humano", "#d9a07a"]];
  function embryo(cx, cy, org, stage, hl) {
    const col = ORG[org][2], s = 1; let g = "";
    const hiT = hl === "tail", hiP = hl === "pouch", hiE = hl === "eye", hiL = hl === "limb";
    if (stage === 0) { // early: all nearly the same, curled C with tail and pouches
      g += `<path d="M${cx + 30} ${cy - 40} C ${cx - 40} ${cy - 60}, ${cx - 55} ${cy + 30}, ${cx} ${cy + 40} C ${cx + 25} ${cy + 46}, ${cx + 38} ${cy + 30}, ${cx + 22} ${cy + 22}" fill="none" stroke="${col}" stroke-width="26" stroke-linecap="round"/>`;
      g += `<path d="M${cx + 22} ${cy + 22} q -10 -8 -2 -20" fill="none" stroke="${hiT ? RED : col}" stroke-width="${hiT ? 12 : 10}" stroke-linecap="round"/>`;
      [0, 1, 2].forEach(i => g += `<path d="M${cx - 6 + i * 8} ${cy - 30 + i * 4} q4 6 0 12" fill="none" stroke="${hiP ? RED : "#6b4a3a"}" stroke-width="${hiP ? 4 : 2.5}"/>`);
      g += `<circle cx="${cx + 22}" cy="${cy - 40}" r="${hiE ? 7 : 5}" fill="${hiE ? RED : "#333"}"/>`;
      if (hiL) g += T(cx, cy + 72, "(no limb buds yet)", { fs: 10, c: RED });
    } else if (stage === 1) { // middle: limb buds appear, still tail & pouches
      g += `<path d="M${cx + 34} ${cy - 44} C ${cx - 46} ${cy - 66}, ${cx - 60} ${cy + 34}, ${cx} ${cy + 44} C ${cx + 26} ${cy + 50}, ${cx + 40} ${cy + 36}, ${cx + 26} ${cy + 26}" fill="none" stroke="${col}" stroke-width="30" stroke-linecap="round"/>`;
      g += `<path d="M${cx + 26} ${cy + 26} q -14 -10 -4 -26" fill="none" stroke="${hiT ? RED : col}" stroke-width="${hiT ? 12 : 10}" stroke-linecap="round"/>`;
      [0, 1, 2].forEach(i => g += `<path d="M${cx - 4 + i * 8} ${cy - 34 + i * 4} q4 6 0 12" fill="none" stroke="${hiP ? RED : "#6b4a3a"}" stroke-width="${hiP ? 4 : 2.5}"/>`);
      g += `<circle cx="${cx + 26}" cy="${cy - 44}" r="${hiE ? 8 : 6}" fill="${hiE ? RED : "#333"}"/>`;
      const lb = org === 0 ? [[cx - 30, cy + 2, 12, 6]] : [[cx - 36, cy - 2, 9, 12], [cx - 22, cy + 30, 9, 12]];
      lb.forEach(([x, y, rx, ry]) => g += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${hiL ? RED : col}" stroke="#6b4a3a" stroke-width="1.5"/>`);
    } else { // later: distinct
      if (org === 0) { g += `<ellipse cx="${cx}" cy="${cy}" rx="56" ry="20" fill="${col}"/><path d="M${cx + 52} ${cy} l24 -18 l0 36z" fill="${hiT ? RED : col}"/><circle cx="${cx - 38}" cy="${cy - 4}" r="${hiE ? 7 : 5}" fill="${hiE ? RED : "#333"}"/>`;
        [0, 1, 2].forEach(i => g += `<path d="M${cx - 24 + i * 5} ${cy - 10} q5 10 0 20" fill="none" stroke="${hiP ? RED : "#2f5f73"}" stroke-width="${hiP ? 4 : 2.5}"/>`); g += `<path d="M${cx - 6} ${cy + 16} l-10 14 l14 -4z" fill="${hiL ? RED : col}"/>`; if (hiP) g += T(cx, cy + 50, "pouches → gills", { fs: 10, c: RED, b: 1 }); }
      else if (org === 1) { g += `<circle cx="${cx - 8}" cy="${cy + 6}" r="34" fill="${col}"/><circle cx="${cx + 22}" cy="${cy - 30}" r="18" fill="${col}"/><path d="M${cx + 38} ${cy - 30} l14 4 l-14 4z" fill="#d98b2b"/><circle cx="${cx + 28}" cy="${cy - 34}" r="${hiE ? 8 : 6}" fill="${hiE ? RED : "#333"}"/>`;
        g += `<path d="M${cx - 30} ${cy - 6} q-24 10 -10 30" fill="none" stroke="${hiL ? RED : "#b7832e"}" stroke-width="7" stroke-linecap="round"/><line x1="${cx - 2}" y1="${cy + 38}" x2="${cx - 6}" y2="${cy + 58}" stroke="${hiL ? RED : "#b7832e"}" stroke-width="5"/>`; if (hiT) g += T(cx, cy + 74, "tail mostly gone", { fs: 10, c: RED }); if (hiP) g += T(cx, cy + 74, "pouches → throat parts", { fs: 10, c: RED }); }
      else if (org === 2) { g += `<ellipse cx="${cx - 4}" cy="${cy + 4}" rx="44" ry="28" fill="${col}"/><circle cx="${cx + 38}" cy="${cy - 10}" r="20" fill="${col}"/><ellipse cx="${cx + 56}" cy="${cy - 4}" rx="8" ry="6" fill="#d06d88"/><circle cx="${cx + 40}" cy="${cy - 16}" r="${hiE ? 7 : 5}" fill="${hiE ? RED : "#333"}"/>`;
        [[cx - 30, cy + 28], [cx - 12, cy + 30], [cx + 12, cy + 30], [cx + 26, cy + 28]].forEach(([x, y]) => g += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 22}" stroke="${hiL ? RED : "#c46a85"}" stroke-width="7" stroke-linecap="round"/>`); g += `<path d="M${cx - 48} ${cy} q-14 -6 -8 -16" fill="none" stroke="${hiT ? RED : col}" stroke-width="5"/>`; if (hiP) g += T(cx, cy + 74, "pouches → ear & throat", { fs: 10, c: RED }); }
      else { g += `<circle cx="${cx + 8}" cy="${cy - 26}" r="30" fill="${col}"/><path d="M${cx - 18} ${cy - 2} C ${cx - 44} ${cy + 30}, ${cx - 10} ${cy + 60}, ${cx + 20} ${cy + 44} C ${cx + 40} ${cy + 30}, ${cx + 30} ${cy}, ${cx + 14} ${cy - 2} Z" fill="${col}"/><circle cx="${cx + 20}" cy="${cy - 30}" r="${hiE ? 7 : 5}" fill="${hiE ? RED : "#333"}"/>`;
        g += `<path d="M${cx + 20} ${cy + 6} q16 10 6 24" fill="none" stroke="${hiL ? RED : "#b9805d"}" stroke-width="7" stroke-linecap="round"/><path d="M${cx - 6} ${cy + 44} q-4 18 12 22" fill="none" stroke="${hiL ? RED : "#b9805d"}" stroke-width="7" stroke-linecap="round"/>`; if (hiT) g += T(cx, cy + 82, "tail → tailbone", { fs: 10, c: RED }); if (hiP) g += T(cx, cy + 82, "pouches → jaw, ear, throat", { fs: 10, c: RED }); }
    }
    return g;
  }
  BT.embryos = {
    html(b, st) {
      const stg = st.stage ?? 0, hl = st.hl || "";
      const SN = [["Early", "temprano"], ["Middle", "intermedio"], ["Later", "tardío"]];
      let g = ORG.map((o, i) => { const cx = 70 + i * 125; return embryo(cx, 120, i, stg, hl) + T(cx, 230, o[0], { b: 1 }) + ES(cx, 244, o[1]); }).join("");
      g += T(260, 22, `${SN[stg][0]} stage`, { b: 1, fs: 15 }) + ES(260, 38, SN[stg][1]);
      return `<div class="vis"><h4>${b.title || "Compare the embryos"}</h4><p class="mu small">${b.how || "Tap a stage to watch the embryos develop. Tap a feature to highlight it in red on every embryo."}</p>
        <div class="emb-bar"><span>Stage:</span>${SN.map((s, i) => `<button class="${stg === i ? "on" : ""}" data-emst="${i}">${s[0]}</button>`).join("")}</div>
        <div class="emb-bar"><span>Highlight:</span>${[["tail", "Tail (cola)"], ["pouch", "Pharyngeal pouches (bolsas faríngeas)"], ["eye", "Eye (ojo)"], ["limb", "Limb buds / limbs (extremidades)"]].map(([k, l]) => `<button class="${hl === k ? "on" : ""}" data-emhl="${k}">${l}</button>`).join("")}</div>
        <svg viewBox="0 0 520 256" role="img" aria-label="${SN[stg][0]} stage embryos of a fish, chicken, pig, and human">${g}</svg>
        <p class="cap">${["Early: all four look almost the same: a curled body, a tail, and pharyngeal pouches.", "Middle: limb buds (fins in the fish) appear. They still have a tail and pouches.", "Later: they look very different. Fish keep the pouches as gills; in humans they become parts of the jaw, ear, and throat, and the tail becomes the tailbone."][stg]} (Simplified drawings, not to scale.)</p></div>`;
    },
    wire(root, b, st, save, redraw) {
      $$("[data-emst]", root).forEach(x => x.onclick = () => { st.stage = +x.dataset.emst; (st.seen = st.seen || {})[st.stage] = 1; save(); redraw(); });
      $$("[data-emhl]", root).forEach(x => x.onclick = () => { st.hl = st.hl === x.dataset.emhl ? "" : x.dataset.emhl; save(); redraw(); });
    }
  };
});
