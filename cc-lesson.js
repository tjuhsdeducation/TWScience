/* =====================================================================
   COLLEGE & CAREER LESSON ENGINE (no need to edit)
   Each lesson page sets window.CC = { ...lesson... } and then loads this.
   A lesson is a list of WICOR stations. Each station is a list of blocks:
     text, video, links, quiz, sort, move, tour, write, picker, survey,
     schedule, week, jobs, budget, compare, form, partner, chart
   Points: every interactive block earns points; the station totals are
   sent to the teacher's Google Sheet when the student presses Turn in.
   ===================================================================== */
(function () {
  const L = window.CC; if (!L) return;
  const CFG = window.HUB_CONFIG || {}, SCHOOLS = CFG.schools || {}, PERIODS = CFG.periods || ["1", "2", "3", "4", "5", "6", "7", "8"];
  const HUB_URL = (CFG.scriptUrl || "").trim();
  let TEACH = false; try { TEACH = localStorage.getItem("hubMode") === "teacher"; } catch (e) {}
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const strip = s => String(s ?? "").replace(/<[^>]+>/g, "");
  const words = t => (String(t || "").trim().match(/[A-Za-z0-9'’$%.,-]+/g) || []).length;
  const money = n => "$" + Math.round(n).toLocaleString("en-US");
  const LS = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  const WC = { W: ["Writing", "#2b7de9"], I: ["Inquiry", "#8a54e0"], C: ["Collaboration", "#f05a28"], O: ["Organization", "#0e9f6e"], R: ["Reading", "#e08a00"] };
  document.documentElement.style.setProperty("--lc", L.color || "#e8368f");
  const BR = Object.assign({ name: "College & Career", home: "college", mark: "🎓" }, L.brand || {});
  document.title = `${L.title} | ${BR.name}`;

  /* ---------------- page shell ---------------- */
  document.body.innerHTML = `
  <header class="top"><div class="bar"><a class="brand" href="index.html#${BR.home}"><span class="mark">${BR.mark}</span><span>${esc(BR.name)}</span></a>
    <span class="crumb"><span>›</span><a href="index.html#${BR.home}">${esc(BR.name)}</a><span>›</span><b>${esc(L.short || L.title)}</b></span><span class="spacer"></span>
    <span class="who" id="who"></span></div></header>
  <main class="wrap" id="main"></main>
  <div class="proj" id="proj" hidden></div>`;
  const main = $("#main");

  /* ---------------- sign in ---------------- */
  const tOpts = (school, sel) => `<option value="">${school ? "Choose…" : "Choose a school first"}</option>` + (SCHOOLS[school] || []).map(t => `<option ${sel === t ? "selected" : ""}>${esc(t)}</option>`).join("");
  function banner() {
    return `<section class="banner"><span class="kick">${L.emoji || "🎓"} ${esc(BR.name)} · ${esc(L.kind || "WICOR Lesson")} · ${esc(L.time || "")}</span><h1>${esc(L.title)}</h1><p>${L.intro || ""}</p>
      <div class="eqlt"><div class="eq"><span class="lbl">Essential Question</span><p>${esc(L.eq)}</p></div>
      <div class="lt"><span class="lbl">Learning Targets</span><ul>${Object.entries(L.targets || {}).map(([k, v]) => `<li><b style="color:${WC[k][1]}">${k}</b> ${esc(v)}</li>`).join("")}</ul></div></div></section>`;
  }
  function gate() {
    let prev = LS.get("wicorStudent", null);
    if (prev && !(prev.first && prev.last && prev.school && (SCHOOLS[prev.school] || []).includes(prev.teacher))) prev = null;
    main.innerHTML = banner() + `<div class="gatewrap"><form class="g-form" autocomplete="off" novalidate><h3>✋ Sign in to start</h3>
      <div class="g-row"><label>First name<input id="g-first" placeholder="First name"></label><label>Last name<input id="g-last" placeholder="Last name"></label></div>
      <label>Student ID<input id="g-id" inputmode="numeric" placeholder="Your student ID number"></label>
      <label>School<select id="g-sch"><option value="">Choose…</option>${Object.keys(SCHOOLS).map(s => `<option>${esc(s)}</option>`).join("")}</select></label>
      <div class="g-row"><label>Period<select id="g-per"><option value="">Choose…</option>${PERIODS.map(p => `<option>${p}</option>`).join("")}</select></label><label>Teacher<select id="g-t">${tOpts("", "")}</select></label></div>
      <button class="g-start" type="submit" disabled>Start ▶</button><p class="g-msg" aria-live="polite">Fill in every box to start.</p>
      ${TEACH ? `<button type="button" class="linkbtn" id="g-prev">🍎 Teacher preview of the lesson (nothing is sent)</button>` : ""}</form>
      ${TEACH && L.teacher ? `<details class="tnotes" open><summary>🍎 Teacher notes: pacing, movement, and materials</summary>${L.teacher}</details>` : ""}</div>`;
    const f = $(".g-form"), q = x => f.querySelector(x);
    q("#g-sch").onchange = () => { q("#g-t").innerHTML = tOpts(q("#g-sch").value, ""); };
    if (prev) { q("#g-first").value = prev.first; q("#g-last").value = prev.last; q("#g-id").value = prev.id; q("#g-sch").value = prev.school; q("#g-t").innerHTML = tOpts(prev.school, prev.teacher); q("#g-per").value = prev.period; }
    const read = () => { const first = q("#g-first").value.trim(), last = q("#g-last").value.trim(); return { first, last, name: (first + " " + last).trim(), id: q("#g-id").value.trim(), school: q("#g-sch").value, period: q("#g-per").value, teacher: q("#g-t").value }; };
    const okId = v => /^[A-Za-z0-9-]{3,12}$/.test(v), hasL = v => /[A-Za-z]/.test(v), ok = d => hasL(d.first) && hasL(d.last) && okId(d.id) && d.school && d.period && d.teacher;
    const upd = () => { const d = read(), g = ok(d); q(".g-start").disabled = !g;
      q(".g-msg").textContent = g ? "Looks good! Press Start." : !hasL(d.first) ? "Type your first name." : !hasL(d.last) ? "Type your last name." : !okId(d.id) ? "Type your student ID (numbers only)." : !d.school ? "Choose your school." : !d.period ? "Choose your period." : !d.teacher ? "Choose your teacher." : ""; };
    f.oninput = upd; f.onchange = upd; upd();
    f.onsubmit = e => { e.preventDefault(); const d = read(); if (!ok(d)) return; LS.set("wicorStudent", d); run(d, false); };
    if (q("#g-prev")) q("#g-prev").onclick = () => run({ first: "Teacher", last: "Preview", name: "Teacher Preview", id: "preview", school: "", period: "", teacher: "" }, true);
  }

  /* ---------------- block types ---------------- */
  const evalWrite = (b, text) => {
    const w = words(text), res = [];
    if (b.min) res.push({ label: `At least ${b.min} words (you wrote ${w})`, ok: w >= b.min });
    (b.checks || []).forEach(c => { const re = new RegExp(c.re.source, c.re.flags.replace("g", "") + "g"); const hits = new Set((String(text || "").match(re) || []).map(x => x.toLowerCase())); res.push({ label: c.label, ok: c.not ? hits.size === 0 : hits.size >= (c.min || 1) }); });
    const pass = res.filter(r => r.ok).length; return { res, pts: w < 3 ? 0 : pass === res.length ? 2 : pass >= Math.ceil(res.length / 2) ? 1 : 0 };
  };
  const BT = {};
  BT.text = { html: b => `<div class="txt">${b.html}</div>` };
  BT.chart = { html: b => `<figure class="fig">${barChart(b)}${b.cap ? `<figcaption>${b.cap}</figcaption>` : ""}</figure>` };
  BT.links = { html: b => `<div class="links">${b.title ? `<h4>${b.title}</h4>` : ""}${b.items.map(l => `<a class="lnk" href="${l.url}" target="_blank" rel="noopener"><b>${l.name} ↗</b><span>${l.desc || ""}</span></a>`).join("")}</div>` };
  BT.video = {
    html: (b, st) => `<div class="video"><h4>🎬 ${b.title}</h4><div class="vframe"><iframe src="https://www.youtube-nocookie.com/embed/${b.yt}?rel=0" title="${esc(b.title)}" loading="lazy" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe></div>
      <p class="vsrc">${b.source || ""} <a href="https://www.youtube.com/watch?v=${b.yt}" target="_blank" rel="noopener">Open on YouTube ↗</a> (if the video is blocked on your device, your teacher can play it for the class)</p>
      ${(b.notes || []).map((n, i) => `<label class="note">${n}<textarea rows="2" data-k="n${i}" placeholder="Type your note…">${esc((st.n || {})["n" + i] || "")}</textarea></label>`).join("")}</div>`,
    wire(root, b, st, save) { $$("textarea[data-k]", root).forEach(t => t.oninput = () => { (st.n = st.n || {})[t.dataset.k] = t.value; save(); }); },
    score: (b, st) => b.notes && b.notes.length ? { max: 1, pts: b.notes.every((_, i) => words((st.n || {})["n" + i]) >= 5) ? 1 : 0, label: "video notes" } : null,
    text: (b, st) => (b.notes || []).map((n, i) => `${strip(n)} ${(st.n || {})["n" + i] || ""}`).join(" / ")
  };
  BT.quiz = {
    html(b, st) {
      const done = !!st.checked;
      return `<div class="quiz">${b.title ? `<h4>${b.title}</h4>` : ""}${b.items.map((it, k) => `<div class="qi"><div class="qq"><b>${k + 1}.</b> ${it.q}</div><div class="opts">${it.opts.map((o, j) => {
        let c = "opt"; const sel = (st.a || {})[k] === j; if (sel) c += " sel"; if (done) { if (j === it.a) c += " right"; else if (sel) c += " wrong"; }
        return `<button class="${c}" data-k="${k}" data-j="${j}" ${done ? "disabled" : ""}><span class="lt">${String.fromCharCode(65 + j)}</span><span>${o}</span></button>`; }).join("")}</div>
        ${done && it.why ? `<div class="fb ${(st.a || {})[k] === it.a ? "ok" : "bad"}">${(st.a || {})[k] === it.a ? "✅ Correct." : "❌ Not quite."} ${it.why}</div>` : ""}</div>`).join("")}
        ${done ? `<p class="score">Score: <b>${BT.quiz.score(b, st).pts} / ${b.items.length}</b></p>` : `<div class="btnrow"><button class="btn" data-check>Check my answers</button><span class="msg"></span></div>`}</div>`;
    },
    wire(root, b, st, save, redraw) {
      $$(".opt", root).forEach(o => o.onclick = () => { (st.a = st.a || {})[o.dataset.k] = +o.dataset.j; save(); redraw(); });
      const c = $("[data-check]", root); if (c) c.onclick = () => { if (b.items.some((_, k) => (st.a || {})[k] == null)) { $(".msg", root).textContent = "Answer every question first."; return; } st.checked = true; save(); redraw(); };
    },
    score: (b, st) => ({ max: b.items.length, pts: st.checked ? b.items.filter((it, k) => (st.a || {})[k] === it.a).length : 0, label: b.label || "quiz" }),
    text: (b, st) => "Quiz " + b.items.map((it, k) => (st.a || {})[k] == null ? "-" : String.fromCharCode(65 + st.a[k])).join("")
  };
  BT.sort = {
    html(b, st) {
      const pl = st.p || {}, done = !!st.checked, sel = st.sel;
      const tile = (t, i) => { const ok = done ? (pl[i] === t[1] ? " right" : " wrong") : ""; return `<button class="tile${sel === i ? " on" : ""}${ok}" data-t="${i}" ${done ? "disabled" : ""}>${t[0]}</button>`; };
      return `<div class="sort ${b.look || ""}">${b.title ? `<h4>${b.title}</h4>` : ""}<p class="hint">Tap a card, then tap the box where it belongs. Tap a placed card to move it again.</p>
        <div class="pool">${b.tiles.map((t, i) => pl[i] == null ? tile(t, i) : "").join("") || '<span class="mu">All cards placed!</span>'}</div>
        <div class="zones" style="--n:${b.zones.length}">${b.zones.map((z, zi) => `<div class="zone" data-z="${zi}" style="${b.colors ? `--zc:${b.colors[zi]}` : ""}"><div class="zh">${z}</div>${b.tiles.map((t, i) => pl[i] === zi ? tile(t, i) : "").join("")}</div>`).join("")}</div>
        ${done ? `<p class="score">Correct: <b>${b.tiles.filter((t, i) => pl[i] === t[1]).length} / ${b.tiles.length}</b>${b.why ? ` · ${b.why}` : ""}</p>` : `<div class="btnrow"><button class="btn" data-check>Check my sort</button><span class="msg"></span></div>`}</div>`;
    },
    wire(root, b, st, save, redraw) {
      $$(".tile", root).forEach(t => t.onclick = e => { e.stopPropagation(); const k = +t.dataset.t, z = t.closest(".zone");
        if (z && st.sel != null && st.sel !== k) { (st.p = st.p || {})[st.sel] = +z.dataset.z; st.sel = null; }   // tapped a placed card while holding another: drop it in this box
        else st.sel = st.sel === k ? null : k; save(); redraw(); });
      $$(".zone", root).forEach(z => z.onclick = () => { if (st.sel == null) return; (st.p = st.p || {})[st.sel] = +z.dataset.z; st.sel = null; save(); redraw(); });
      const c = $("[data-check]", root); if (c) c.onclick = () => { if (b.tiles.some((_, i) => (st.p || {})[i] == null)) { $(".msg", root).textContent = "Place every card first."; return; } st.checked = true; save(); redraw(); };
    },
    score: (b, st) => ({ max: 2, pts: st.checked ? Math.round(2 * b.tiles.filter((t, i) => (st.p || {})[i] === t[1]).length / b.tiles.length) : 0, label: b.label || "sort" })
  };
  BT.move = {
    html(b, st) {
      const ic = { corners: "🏃 Four Corners", line: "📏 Human Line-Up", standsit: "🙋 Stand Up / Sit Down", walk: "🚶 Gallery Walk", circle: "🔄 Inside-Outside Circle" }[b.mode] || "🏃 Move";
      return `<div class="move"><div class="mvhead"><span class="mvtag">${ic}</span><span class="mu">${b.time || ""}</span>${TEACH ? `<button class="btn ghost" data-proj>📢 Project for the class</button>` : ""}</div>
        <p class="mvp"><b>${b.prompt}</b></p>${b.how ? `<p class="mu">${b.how}</p>` : ""}
        ${b.options ? `<div class="mvopts">${b.options.map((o, i) => `<button class="mvo${st.c === i ? " on" : ""}" data-o="${i}" style="--oc:${["#2b7de9", "#e8368f", "#0e9f6e", "#e08a00", "#8a54e0"][i % 5]}">${o}</button>`).join("")}</div><p class="mu small">${b.mode === "line" ? "Where did you stand?" : "Where did you go?"} Tap your choice.</p>` : ""}
        <label class="note">${b.reflect || "Why did you choose that? What did you hear from a classmate?"}<textarea rows="3" data-r placeholder="I chose … because … A classmate said …">${esc(st.r || "")}</textarea></label></div>`;
    },
    wire(root, b, st, save, redraw) {
      $$(".mvo", root).forEach(o => o.onclick = () => { st.c = +o.dataset.o; save(); redraw(); });
      const t = $("textarea[data-r]", root); if (t) t.oninput = () => { st.r = t.value; save(); };
      const pj = $("[data-proj]", root); if (pj) pj.onclick = () => project(b);
    },
    score: (b, st) => ({ max: 2, pts: (b.options ? (st.c != null ? 1 : 0) : (words(st.r) >= 4 ? 1 : 0)) + (words(st.r) >= (b.min || 12) ? 1 : 0), label: "movement" }),
    text: (b, st) => `${b.options && st.c != null ? strip(b.options[st.c]) + " — " : ""}${st.r || ""}`
  };
  BT.tour = {
    html(b, st) {
      const seen = st.v || {}, cur = st.cur, n = Object.keys(b.stops).length, k = Object.keys(seen).length;
      return `<div class="tour"><div class="tourmap"><div class="mapbox">${b.map}${Object.entries(b.stops).map(([id, s]) => `<button class="hot${seen[id] ? " seen" : ""}${cur === id ? " cur" : ""}" data-s="${id}" style="left:${s.x}%;top:${s.y}%" aria-label="${esc(s.name)}">${s.emoji}</button>`).join("")}</div>
        <p class="mu small">Tap each building on the map. Visited <b>${k} of ${n}</b> stops.</p></div>
        <div class="stop">${cur ? `<h4>${b.stops[cur].emoji} ${b.stops[cur].name}</h4><p>${b.stops[cur].text}</p>${b.stops[cur].tip ? `<p class="tip">💡 <b>Skill to succeed:</b> ${b.stops[cur].tip}</p>` : ""}` : `<h4>👋 Welcome to campus!</h4><p>${b.welcome || "Tap a building to start your tour."}</p>`}</div></div>`;
    },
    wire(root, b, st, save, redraw) { $$(".hot", root).forEach(h => h.onclick = () => { st.cur = h.dataset.s; (st.v = st.v || {})[h.dataset.s] = 1; save(); redraw(); }); },
    score: (b, st) => { const n = Object.keys(b.stops).length, k = Object.keys(st.v || {}).length; return { max: 2, pts: k >= n ? 2 : k >= n / 2 ? 1 : 0, label: "virtual tour" }; },
    text: (b, st) => `Visited ${Object.keys(st.v || {}).length}/${Object.keys(b.stops).length} stops`
  };
  BT.write = {
    html(b, st) {
      const ev = st.checked ? evalWrite(b, st.t) : null;
      return `<div class="write"><h4>✍️ ${b.title || "Write"}</h4><p class="wp">${b.prompt}</p>${b.frames ? `<p class="frames">${b.frames.map(f => `<span>${f}</span>`).join("")}</p>` : ""}
        <textarea rows="${b.rows || 6}" data-w placeholder="${esc(b.starter || "Type here…")}">${esc(st.t || "")}</textarea><div class="wc"><span data-wc>${words(st.t)}</span> words${b.min ? ` · aim for ${b.min}+` : ""}</div>
        <div class="btnrow"><button class="btn" data-check>${st.checked ? "Check again" : "Check my writing"}</button></div>
        ${ev ? `<ul class="rub">${ev.res.map(r => `<li class="${r.ok ? "ok" : "bad"}">${r.ok ? "✓" : "✗"} ${r.label}</li>`).join("")}</ul><p class="score">Rubric score: <b>${ev.pts} / 2</b>${ev.pts < 2 ? " · Revise and check again." : " · Nice work!"}</p>` : ""}</div>`;
    },
    wire(root, b, st, save, redraw) { const t = $("textarea[data-w]", root); t.oninput = () => { st.t = t.value; $("[data-wc]", root).textContent = words(t.value); save(); }; $("[data-check]", root).onclick = () => { st.checked = true; save(); redraw(); }; },
    score: (b, st) => ({ max: 2, pts: evalWrite(b, st.t).pts, label: b.label || "writing" }),
    text: (b, st) => st.t || ""
  };
  BT.survey = {
    html(b, st) {
      const on = st.on || {}, tally = {}; b.items.forEach((it, i) => { if (on[i]) tally[it[1]] = (tally[it[1]] || 0) + 1; });
      const top = Object.entries(tally).sort((a, c) => c[1] - a[1]).slice(0, 2).map(x => x[0]);
      return `<div class="survey"><h4>${b.title}</h4><p class="mu">${b.how || "Tap every statement that sounds like you."}</p><div class="chips">${b.items.map((it, i) => `<button class="chip${on[i] ? " on" : ""}" data-i="${i}">${on[i] ? "✓ " : ""}${it[0]}</button>`).join("")}</div>
        <div class="result">${top.length ? `Your top interest areas: ${top.map(t => `<span class="code"><b>${b.types[t][0]}</b> ${b.types[t][1]}</span>`).join(" ")}<p class="mu small">${top.map(t => b.types[t][2]).join(" ")}</p>` : "Your results will appear here."}</div></div>`;
    },
    wire(root, b, st, save, redraw) { $$(".chip", root).forEach(c => c.onclick = () => { (st.on = st.on || {})[c.dataset.i] = !st.on[c.dataset.i]; save(); redraw(); }); },
    score: (b, st) => ({ max: 1, pts: Object.values(st.on || {}).filter(Boolean).length >= 3 ? 1 : 0, label: "interest survey" }),
    text: (b, st) => { const t = {}; b.items.forEach((it, i) => { if ((st.on || {})[i]) t[it[1]] = (t[it[1]] || 0) + 1; }); return "Interests " + Object.entries(t).sort((a, c) => c[1] - a[1]).map(x => x[0] + x[1]).join(" "); }
  };
  BT.picker = {
    html(b, st, ctx) {
      const pick = ctx.S.major, m = b.options.find(o => o.id === pick);
      return `<div class="picker"><h4>${b.title}</h4><div class="cards">${b.options.map(o => `<button class="pcard${pick === o.id ? " on" : ""}" data-id="${o.id}"><span class="pe">${o.emoji}</span><b>${o.name}</b><small>${o.tag || ""}</small></button>`).join("")}</div>
        ${m ? `<div class="pdetail"><h4>${m.emoji} ${m.name}</h4><p>${m.desc}</p><div class="pgrid"><div><b>Careers</b><ul>${m.careers.map(c => `<li>${c}</li>`).join("")}</ul></div><div><b>High school classes to take now</b><ul>${m.hs.map(c => `<li>${c}</li>`).join("")}</ul></div><div><b>Interest areas</b><p>${m.riasec}</p><b>Paths</b><p>${m.path}</p></div></div></div>` : `<p class="mu">Choose one major to explore. You can change it any time.</p>`}</div>`;
    },
    wire(root, b, st, save, redraw, ctx) { $$(".pcard", root).forEach(c => c.onclick = () => { ctx.S.major = c.dataset.id; ctx.S.sched = null; save(); redraw(); }); },
    score: (b, st, ctx) => ({ max: 1, pts: ctx.S.major ? 1 : 0, label: "major chosen" }),
    text: (b, st, ctx) => "Major: " + ((b.options.find(o => o.id === ctx.S.major) || {}).name || "-")
  };
  BT.schedule = {
    plan(b, ctx) { const m = (ctx.L.majors || []).find(o => o.id === ctx.S.major); return m; },
    html(b, st, ctx) {
      const m = BT.schedule.plan(b, ctx);
      if (!m) return `<div class="sched"><h4>🗓️ ${b.title}</h4><p class="warn">Pick a major in the station before this one first.</p></div>`;
      const cat = m.courses.concat(b.ge), P = st.p || {}, sel = st.sel, terms = ["Fall", "Spring"];
      const units = t => cat.filter(c => P[c.code] === t).reduce((a, c) => a + c.u, 0);
      const chip = c => `<button class="crs ${c.type}${sel === c.code ? " on" : ""}" data-c="${c.code}"><b>${c.code}</b> ${c.name}<small>${c.u} units · ${({ major: "Major prep", ge: "General Ed", el: "Elective" })[c.type]}${c.pre ? " · after " + c.pre : ""}</small></button>`;
      const res = st.checked ? BT.schedule.rules(b, ctx, st) : null;
      return `<div class="sched"><h4>🗓️ ${b.title}: ${m.emoji} ${m.name}</h4><p class="hint">Tap a course, then tap <b>Fall</b> or <b>Spring</b>. Tap a placed course to move it back. Full-time is 12–16 units each term.</p>
        <div class="legend"><span class="crs major">Major prep</span><span class="crs ge">General Ed</span><span class="crs el">Elective</span></div>
        <div class="catalog">${cat.filter(c => P[c.code] == null).map(chip).join("") || '<span class="mu">Every course is placed.</span>'}</div>
        <div class="terms">${terms.map(t => `<div class="term" data-term="${t}"><div class="th">${t} semester <span class="u ${units(t) >= 12 && units(t) <= 16 ? "ok" : units(t) > 16 ? "bad" : ""}">${units(t)} units</span></div>${cat.filter(c => P[c.code] === t).map(chip).join("")}</div>`).join("")}</div>
        <div class="btnrow"><button class="btn" data-check>Check my schedule</button></div>
        ${res ? `<ul class="rub">${res.map(r => `<li class="${r.ok ? "ok" : "bad"}">${r.ok ? "✓" : "✗"} ${r.label}</li>`).join("")}</ul>` : ""}</div>`;
    },
    rules(b, ctx, st) {
      const m = BT.schedule.plan(b, ctx), cat = m.courses.concat(b.ge), P = st.p || {};
      const units = t => cat.filter(c => P[c.code] === t).reduce((a, c) => a + c.u, 0);
      const inT = (code, t) => P[code] === t, placed = code => P[code] != null;
      const majorN = m.courses.filter(c => c.type === "major" && placed(c.code)).length;
      const preOk = cat.filter(c => c.pre && placed(c.code)).every(c => placed(c.pre) && (P[c.pre] === "Fall" && P[c.code] === "Spring"));
      return [
        { label: "Fall has 12–16 units (full-time)", ok: units("Fall") >= 12 && units("Fall") <= 16 },
        { label: "Spring has 12–16 units (full-time)", ok: units("Spring") >= 12 && units("Spring") <= 16 },
        { label: "English Composition is in your first semester", ok: inT("ENGL 1A", "Fall") },
        { label: "You take a college math course this year", ok: cat.some(c => c.math && placed(c.code)) },
        { label: `At least ${b.minMajor || 3} major-prep courses this year`, ok: majorN >= (b.minMajor || 3) },
        { label: "Courses with a prerequisite come after it (Fall → Spring)", ok: preOk }
      ];
    },
    wire(root, b, st, save, redraw) {
      $$(".crs[data-c]", root).forEach(c => c.onclick = e => { e.stopPropagation(); const code = c.dataset.c, term = c.closest(".term");
        if (term && st.sel && st.sel !== code) { (st.p = st.p || {})[st.sel] = term.dataset.term; st.sel = null; }        // holding a course: drop it in this semester
        else if ((st.p || {})[code] != null) { delete st.p[code]; st.sel = null; } else st.sel = st.sel === code ? null : code; save(); redraw(); });
      $$(".term", root).forEach(t => t.onclick = () => { if (!st.sel) return; (st.p = st.p || {})[st.sel] = t.dataset.term; st.sel = null; save(); redraw(); });
      const c = $("[data-check]", root); if (c) c.onclick = () => { st.checked = true; save(); redraw(); };
    },
    score(b, st, ctx) { if (!BT.schedule.plan(b, ctx) || !st.checked) return { max: 2, pts: 0, label: "schedule" }; const r = BT.schedule.rules(b, ctx, st), k = r.filter(x => x.ok).length; return { max: 2, pts: k === r.length ? 2 : k >= r.length / 2 ? 1 : 0, label: "schedule" }; },
    text: (b, st) => "Schedule " + Object.entries(st.p || {}).map(([c, t]) => `${c}=${t[0]}`).join(" ")
  };
  BT.week = {
    html(b, st) {
      const v = Object.assign({ units: 15, work: 10, sleep: 8, commute: 5, fam: 10, act: 6, fun: 14, study: 20 }, st.v || {});
      const cls = v.units, need = v.units * 2, tot = cls + v.study + v.work + v.sleep * 7 + v.commute + v.fam + v.act + v.fun;
      const rows = [["units", "📚 Units you are taking (≈ hours in class each week)", 6, 20, 1], ["study", "📝 Study hours per week", 0, 50, 1], ["work", "💼 Work hours per week", 0, 40, 1], ["sleep", "😴 Sleep hours per night", 4, 10, 0.5], ["commute", "🚗 Commute hours per week", 0, 15, 1], ["fam", "🏠 Family responsibilities per week", 0, 30, 1], ["act", "⚽ Clubs, sports, or church per week", 0, 20, 1], ["fun", "🎮 Free time / social per week", 0, 40, 1]];
      const seg = [["Class", cls, "#2b7de9"], ["Study", v.study, "#8a54e0"], ["Work", v.work, "#f05a28"], ["Sleep", v.sleep * 7, "#5d6577"], ["Commute", v.commute, "#e08a00"], ["Family", v.fam, "#0e9f6e"], ["Activities", v.act, "#e8368f"], ["Free", v.fun, "#1aa3c6"]];
      const res = BT.week.rules(v);
      return `<div class="week"><h4>⚖️ ${b.title}</h4><p class="mu">${b.how}</p><div class="sliders">${rows.map(r => `<label><span>${r[1]}</span><input type="range" min="${r[2]}" max="${r[3]}" step="${r[4]}" value="${v[r[0]]}" data-v="${r[0]}"><b data-o="${r[0]}">${v[r[0]]}</b></label>`).join("")}</div>
        <div class="stack" aria-label="Your week">${seg.map(s => `<span style="flex:${Math.max(s[1], 0.01)};background:${s[2]}" title="${s[0]}: ${s[1]} h">${s[1] >= 10 ? s[0] : ""}</span>`).join("")}</div>
        <p class="tot">Total: <b>${tot}</b> of 168 hours in a week · Recommended study time for ${v.units} units: <b>${need}+ hours</b></p>
        <ul class="rub">${res.map(r => `<li class="${r.ok ? "ok" : "bad"}">${r.ok ? "✓" : "✗"} ${r.label}</li>`).join("")}</ul></div>`;
    },
    rules: v => [
      { label: "Your week fits in 168 hours", ok: v.units + v.study + v.work + v.sleep * 7 + v.commute + v.fam + v.act + v.fun <= 168 },
      { label: "Full-time (12+ units)", ok: v.units >= 12 },
      { label: "Study about 2 hours for every unit (at least 1.5×)", ok: v.study >= v.units * 1.5 },
      { label: "7+ hours of sleep a night", ok: v.sleep >= 7 },
      { label: "Work 20 hours or less while full-time (research says more can hurt grades)", ok: v.work <= 20 }],
    wire(root, b, st, save, redraw) { $$("input[data-v]", root).forEach(i => { i.oninput = () => { (st.v = st.v || {})[i.dataset.v] = +i.value; $(`[data-o="${i.dataset.v}"]`, root).textContent = i.value; st.touched = true; save(); }; i.onchange = () => redraw(); }); },
    score(b, st) { const v = Object.assign({ units: 15, work: 10, sleep: 8, commute: 5, fam: 10, act: 6, fun: 14, study: 20 }, st.v || {}), r = BT.week.rules(v), k = r.filter(x => x.ok).length; return { max: 2, pts: !st.touched ? 0 : k === r.length ? 2 : k >= 3 ? 1 : 0, label: "balanced week" }; },
    text: (b, st) => "Week " + JSON.stringify(st.v || {})
  };
  BT.jobs = {
    html(b, st, ctx) {
      const f = st.f || "all", sort = st.s || "pay", star = st.star || {}, edu = ["All", ...new Set(b.jobs.map(j => j[2]))];
      const order = ["No formal educational credential", "High school diploma or equivalent", "Postsecondary nondegree award", "Associate's degree", "Bachelor's degree", "Master's degree", "Doctoral or professional degree"];
      let list = b.jobs.map((j, i) => ({ i, name: j[0], pay: j[1], edu: j[2], field: j[3] })).filter(j => f === "all" || j.edu === f);
      list.sort((a, c) => sort === "pay" ? c.pay - a.pay : sort === "edu" ? order.indexOf(a.edu) - order.indexOf(c.edu) : a.name.localeCompare(c.name));
      const n = Object.values(star).filter(Boolean).length;
      return `<div class="jobs"><h4>🔎 ${b.title}</h4><p class="mu">${b.how}</p>
        <div class="jctl"><label>Education <select data-f>${edu.map(e => `<option value="${e === "All" ? "all" : e}" ${f === (e === "All" ? "all" : e) ? "selected" : ""}>${e}</option>`).join("")}</select></label>
        <label>Sort by <select data-s><option value="pay" ${sort === "pay" ? "selected" : ""}>Highest pay</option><option value="edu" ${sort === "edu" ? "selected" : ""}>Education needed</option><option value="name" ${sort === "name" ? "selected" : ""}>A–Z</option></select></label><span class="mu">⭐ Starred: <b>${n}</b> (star at least 3)</span></div>
        <div class="jtable"><table><thead><tr><th>⭐</th><th>Job</th><th>Median pay (2025)</th><th>Typical education to start</th><th>Field</th></tr></thead><tbody>${list.map(j => `<tr class="${star[j.i] ? "on" : ""}"><td><button class="star" data-i="${j.i}" aria-label="Star ${esc(j.name)}">${star[j.i] ? "⭐" : "☆"}</button></td><td><b>${j.name}</b></td><td>${money(j.pay)}<div class="pbar"><span style="width:${Math.min(100, j.pay / 1800)}%"></span></div></td><td>${j.edu}</td><td>${j.field}</td></tr>`).join("")}</tbody></table></div>
        <p class="src">${b.source}</p></div>`;
    },
    wire(root, b, st, save, redraw) {
      $("[data-f]", root).onchange = e => { st.f = e.target.value; save(); redraw(); }; $("[data-s]", root).onchange = e => { st.s = e.target.value; save(); redraw(); };
      $$(".star", root).forEach(s => s.onclick = () => { (st.star = st.star || {})[s.dataset.i] = !st.star[s.dataset.i]; save(); redraw(); });
    },
    score: (b, st) => ({ max: 1, pts: Object.values(st.star || {}).filter(Boolean).length >= 3 ? 1 : 0, label: "jobs starred" }),
    text: (b, st) => "Starred: " + Object.entries(st.star || {}).filter(x => x[1]).map(x => b.jobs[x[0]][0]).join(", ")
  };
  BT.budget = {
    html(b, st) {
      const v = Object.assign({ job: 0, rent: 1100, car: 450, food: 450, phone: 70, util: 150, loan: 0, fun: 200, save: 300 }, st.v || {});
      const j = b.jobs[v.job], gross = j[1] / 12, net = gross * (1 - b.tax), spend = v.rent + v.car + v.food + v.phone + v.util + v.loan + v.fun + v.save, left = net - spend;
      const sl = [["rent", "🏠 Rent (your share)", 0, 2500, 25], ["car", "🚗 Car payment, gas & insurance", 0, 1000, 10], ["food", "🛒 Food", 150, 900, 10], ["phone", "📱 Phone & internet", 0, 200, 5], ["util", "💡 Utilities", 0, 400, 10], ["loan", "🎓 Student loan payment", 0, 800, 10], ["fun", "🎉 Fun & eating out", 0, 800, 10], ["save", "🐷 Savings", 0, 1500, 25]];
      const res = BT.budget.rules(b, v);
      return `<div class="budget"><h4>💵 ${b.title}</h4><p class="mu">${b.how}</p>
        <label class="bj">Choose a job <select data-job>${b.jobs.map((x, i) => `<option value="${i}" ${+v.job === i ? "selected" : ""}>${x[0]} · ${money(x[1])}/year</option>`).join("")}</select></label>
        <div class="bsum"><div><span>Yearly salary</span><b>${money(j[1])}</b></div><div><span>Monthly before taxes</span><b>${money(gross)}</b></div><div><span>Monthly take-home (about ${Math.round((1 - b.tax) * 100)}%)</span><b>${money(net)}</b></div><div class="${left >= 0 ? "ok" : "bad"}"><span>Left over each month</span><b>${money(left)}</b></div></div>
        <div class="sliders">${sl.map(r => `<label><span>${r[1]}</span><input type="range" min="${r[2]}" max="${r[3]}" step="${r[4]}" value="${v[r[0]]}" data-v="${r[0]}"><b data-o="${r[0]}">${money(v[r[0]])}</b></label>`).join("")}</div>
        <ul class="rub">${res.map(r => `<li class="${r.ok ? "ok" : "bad"}">${r.ok ? "✓" : "✗"} ${r.label}</li>`).join("")}</ul><p class="src">${b.source}</p></div>`;
    },
    rules(b, v) { const j = b.jobs[v.job], net = j[1] / 12 * (1 - b.tax), spend = v.rent + v.car + v.food + v.phone + v.util + v.loan + v.fun + v.save;
      return [{ label: "Your spending fits your take-home pay", ok: spend <= net }, { label: "You save at least 10% of take-home pay", ok: v.save >= net * 0.1 }, { label: "Rent is 30% of your gross pay or less", ok: v.rent <= j[1] / 12 * 0.3 }]; },
    wire(root, b, st, save, redraw) {
      $("[data-job]", root).onchange = e => { (st.v = st.v || {}).job = +e.target.value; st.touched = true; save(); redraw(); };
      $$("input[data-v]", root).forEach(i => { i.oninput = () => { (st.v = st.v || {})[i.dataset.v] = +i.value; $(`[data-o="${i.dataset.v}"]`, root).textContent = money(i.value); st.touched = true; save(); }; i.onchange = () => redraw(); });
    },
    score(b, st) { const v = Object.assign({ job: 0, rent: 1100, car: 450, food: 450, phone: 70, util: 150, loan: 0, fun: 200, save: 300 }, st.v || {}), r = BT.budget.rules(b, v), k = r.filter(x => x.ok).length; return { max: 2, pts: !st.touched ? 0 : k === 3 ? 2 : k >= 2 ? 1 : 0, label: "budget" }; },
    text: (b, st) => { const v = st.v || {}; return `Budget: ${(b.jobs[v.job || 0] || [])[0]} rent ${v.rent} save ${v.save}`; }
  };
  BT.compare = {
    html(b, st) {
      const a = st.a ?? "", c = st.b ?? "", A = b.colleges[a], C = b.colleges[c];
      const sel = (k, v) => `<select data-${k}><option value="">Choose a college…</option>${b.colleges.map((x, i) => `<option value="${i}" ${String(v) === String(i) ? "selected" : ""}>${x.name}</option>`).join("")}</select>`;
      const row = (lab, f) => `<tr><th>${lab}</th><td>${A ? f(A) : ""}</td><td>${C ? f(C) : ""}</td></tr>`;
      return `<div class="compare"><h4>🆚 ${b.title}</h4><p class="mu">${b.how}</p><div class="jtable"><table><thead><tr><th></th><th>${sel("a", a)}</th><th>${sel("b", c)}</th></tr></thead><tbody>
        ${row("System", x => x.sys)}${row("Location", x => x.city)}${row("Yearly tuition (CA resident)", x => x.cost)}${row("Degrees", x => x.deg)}${row("Known for", x => x.known)}${row("Tour or visit", x => `<a href="${x.url}" target="_blank" rel="noopener">Official site ↗</a>`)}</tbody></table></div>
        <label class="note">Which one fits you better right now, and why? Use at least two facts from the chart.<textarea rows="3" data-w placeholder="___ fits me better because … Also, …">${esc(st.t || "")}</textarea></label></div>`;
    },
    wire(root, b, st, save, redraw) { $("[data-a]", root).onchange = e => { st.a = e.target.value; save(); redraw(); }; $("[data-b]", root).onchange = e => { st.b = e.target.value; save(); redraw(); }; const t = $("[data-w]", root); t.oninput = () => { st.t = t.value; save(); }; },
    score: (b, st) => ({ max: 2, pts: (st.a !== undefined && st.a !== "" && st.b !== undefined && st.b !== "" && st.a !== st.b ? 1 : 0) + (words(st.t) >= 15 ? 1 : 0), label: "comparison" }),
    text: (b, st) => `${(b.colleges[st.a] || {}).name || "-"} vs ${(b.colleges[st.b] || {}).name || "-"}: ${st.t || ""}`
  };
  BT.form = {
    html(b, st) {
      const v = st.v || {};
      return `<div class="appform"><h4>📝 ${b.title}</h4><p class="mu">${b.how}</p><div class="fgrid">${b.fields.map(f => `<label class="${f.wide ? "wide" : ""}">${f.label}${f.req ? " *" : ""}${f.type === "area" ? `<textarea rows="${f.rows || 3}" data-f="${f.id}" placeholder="${esc(f.ph || "")}">${esc(v[f.id] || "")}</textarea>` : f.type === "select" ? `<select data-f="${f.id}"><option value="">Choose…</option>${f.opts.map(o => `<option ${v[f.id] === o ? "selected" : ""}>${o}</option>`).join("")}</select>` : `<input data-f="${f.id}" value="${esc(v[f.id] || "")}" placeholder="${esc(f.ph || "")}">`}</label>`).join("")}</div>
        <p class="mu small">This is practice, so nothing is sent to an employer. Never put your Social Security number on a practice form.</p></div>`;
    },
    wire(root, b, st, save) { $$("[data-f]", root).forEach(i => { const ev = i.tagName === "SELECT" ? "onchange" : "oninput"; i[ev] = () => { (st.v = st.v || {})[i.dataset.f] = i.value; save(); }; }); },
    score(b, st) { const v = st.v || {}, req = b.fields.filter(f => f.req); const full = req.every(f => String(v[f.id] || "").trim()); const long = b.fields.filter(f => f.min).every(f => words(v[f.id]) >= f.min); return { max: 2, pts: (full ? 1 : 0) + (long ? 1 : 0), label: "application" }; },
    text: (b, st) => b.fields.map(f => `${f.label}: ${(st.v || {})[f.id] || ""}`).join(" | ")
  };
  BT.partner = {
    html(b, st) { const v = st.v || {}; return `<div class="partner"><h4>🤝 ${b.title}</h4><p>${b.how}</p>${b.questions ? `<ol class="pq">${b.questions.map(q => `<li>${q}</li>`).join("")}</ol>` : ""}<div class="fgrid">
      <label>Partner’s first name<input data-f="name" value="${esc(v.name || "")}"></label>
      <label class="wide">${b.got || "Feedback or idea my partner gave me"}<textarea rows="2" data-f="got">${esc(v.got || "")}</textarea></label>
      <label class="wide">${b.change || "One thing I will change or add because of it"}<textarea rows="2" data-f="change">${esc(v.change || "")}</textarea></label></div></div>`; },
    wire: (root, b, st, save) => $$("[data-f]", root).forEach(i => i.oninput = () => { (st.v = st.v || {})[i.dataset.f] = i.value; save(); }),
    score: (b, st) => { const v = st.v || {}; return { max: 2, pts: (String(v.name || "").trim() && words(v.got) >= 6 ? 1 : 0) + (words(v.change) >= 6 ? 1 : 0), label: "partner" }; },
    text: (b, st) => { const v = st.v || {}; return `Partner ${v.name || ""}: ${v.got || ""} → ${v.change || ""}`; }
  };

  /* extra block types (cc-blocks2.js) plug in here */
  const HELP = { $, $$, esc, strip, words, money, LS, evalWrite, project: b => project(b) };
  if (window.CC_EXT) window.CC_EXT(BT, HELP);
  (window.CC_EXTS || []).forEach(f => f(BT, HELP));   /* more block files push their installer into window.CC_EXTS */
  function barChart(o) {
    const w = 560, h = o.h || 300, P = { l: 170, r: 70, t: 30, b: 20 }, n = o.rows.length, bh = (h - P.t - P.b) / n, mx = o.max;
    return `<svg class="cchart" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(o.alt || o.title)}"><text x="${w / 2}" y="18" text-anchor="middle" class="ct">${esc(o.title)}</text>
      ${o.rows.map((r, i) => { const y = P.t + i * bh, bw = (w - P.l - P.r) * r[1] / mx; return `<text x="${P.l - 8}" y="${y + bh / 2 + 4}" text-anchor="end" class="cl">${esc(r[0])}</text><rect x="${P.l}" y="${y + 4}" width="${bw.toFixed(1)}" height="${bh - 8}" rx="5" class="cb${r[2] ? " hi" : ""}"/><text x="${P.l + bw + 6}" y="${y + bh / 2 + 4}" class="cv">${esc(o.fmt ? o.fmt(r[1]) : r[1])}</text>`; }).join("")}</svg>`;
  }

  /* projector view for movement activities */
  function project(b) {
    const pj = $("#proj"); let left = (b.seconds || 90), t = null, idx = 0;
    const draw = () => {
      const opts = b.options || [], col = ["#2b7de9", "#e8368f", "#0e9f6e", "#e08a00", "#8a54e0"];
      pj.innerHTML = `<div class="pjin"><div class="pjtop"><b>${{ corners: "🏃 Four Corners", line: "📏 Human Line-Up", standsit: "🙋 Stand Up / Sit Down", walk: "🚶 Gallery Walk", circle: "🔄 Inside-Outside Circle" }[b.mode] || "Move"}</b><span class="pjt">${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}</span>
        <button data-go>${t ? "⏸ Pause" : "▶ Start timer"}</button><button data-reset>↺</button><button data-x>✕ Close</button></div>
        <h2>${b.mode === "standsit" && b.statements ? b.statements[idx] : b.prompt}</h2>
        ${b.mode === "corners" ? `<div class="pjcorners">${opts.map((o, i) => `<div style="background:${col[i]}"><span>Corner ${i + 1}</span>${o}</div>`).join("")}</div>` : ""}
        ${b.mode === "line" ? `<div class="pjline"><span>${opts[0]}</span><div></div><span>${opts[opts.length - 1]}</span></div>${opts.length > 2 ? `<p class="pjmid">${opts.slice(1, -1).join(" · ")}</p>` : ""}` : ""}
        ${b.mode === "standsit" && b.statements ? `<p class="pjsub">Stand up if this is true for you. ${idx + 1} of ${b.statements.length}</p><div class="pjnav"><button data-prev ${idx ? "" : "disabled"}>← Back</button><button data-next ${idx < b.statements.length - 1 ? "" : "disabled"}>Next →</button></div>` : ""}
        ${b.mode !== "corners" && b.mode !== "line" && b.mode !== "standsit" && opts.length ? `<div class="pjcorners">${opts.map((o, i) => `<div style="background:${col[i % 5]}">${o}</div>`).join("")}</div>` : ""}
        ${b.talk ? `<div class="pjtalk"><b>Talk with the people near you:</b> ${b.talk}</div>` : ""}</div>`;
      $("[data-x]", pj).onclick = () => { clearInterval(t); t = null; pj.hidden = true; document.exitFullscreen && document.fullscreenElement && document.exitFullscreen(); };
      $("[data-go]", pj).onclick = () => { if (t) { clearInterval(t); t = null; } else t = setInterval(() => { left = Math.max(0, left - 1); if (!left) { clearInterval(t); t = null; } draw(); }, 1000); draw(); };
      $("[data-reset]", pj).onclick = () => { left = b.seconds || 90; draw(); };
      const p = $("[data-prev]", pj), n = $("[data-next]", pj); if (p) p.onclick = () => { idx--; draw(); }; if (n) n.onclick = () => { idx++; draw(); };
    };
    pj.hidden = false; draw(); try { pj.requestFullscreen && pj.requestFullscreen(); } catch (e) {}
  }

  /* ---------------- run the lesson ---------------- */
  function run(who, preview) {
    const KEY = `cc:${L.id}:${who.id}`;
    const S = preview ? { b: {}, cur: 0 } : LS.get(KEY, { b: {}, cur: 0 });
    const save = () => { if (!preview) LS.set(KEY, S); };
    const ctx = { S, L };
    $("#who").innerHTML = preview ? `<span class="prevtag">👀 Teacher preview · nothing is sent</span>` : `👤 <b>${esc(who.name)}</b> · ${esc(who.school)} · P${esc(who.period)} · ${esc(who.teacher)} <button class="pill-btn sm" id="sw">Not you?</button>`;
    if ($("#sw")) $("#sw").onclick = () => location.reload();
    const N = L.stations.length;
    const stScore = i => L.stations[i].blocks.reduce((a, b, j) => { const t = BT[b.t]; const sc = t && t.score ? t.score(b, S.b[i + "-" + j] || {}, ctx) : null; if (sc) { a.pts += sc.pts; a.max += sc.max; } return a; }, { pts: 0, max: 0 });
    function draw() {
      const i = S.cur, st = L.stations[i], fin = i >= N;
      main.innerHTML = `${i === 0 ? banner() : ""}
        <nav class="snav">${L.stations.map((s, k) => { const sc = stScore(k); return `<button class="${k === i ? "cur" : ""} ${sc.max && sc.pts === sc.max ? "done" : sc.pts ? "part" : ""}" data-k="${k}"><span class="sl">${s.letters.map(x => `<i style="background:${WC[x][1]}">${x}</i>`).join("")}</span><span class="stt">${k + 1}. ${s.title}</span><small>${s.time || ""}</small></button>`; }).join("")}<button class="${fin ? "cur" : ""}" data-k="${N}"><span class="sl"><i style="background:var(--fg)">✔</i></span><span class="stt">Turn in</span></button></nav>
        ${fin ? finish() : `<section class="station"><div class="shead"><div class="sl big">${st.letters.map(x => `<i style="background:${WC[x][1]}" title="${WC[x][0]}">${x}</i>`).join("")}</div><div><h2>${st.title}</h2><p class="goal">${st.goal || ""}</p></div><span class="stime">⏱ ${st.time || ""}</span></div>
          ${st.blocks.map((b, j) => `<div class="blk" data-b="${j}">${BT[b.t].html(b, S.b[i + "-" + j] = S.b[i + "-" + j] || {}, ctx)}</div>`).join("")}
          <div class="sfoot"><button class="btn ghost" data-prev ${i ? "" : "disabled"}>← Back</button><span class="mu">Station points: <b>${stScore(i).pts} / ${stScore(i).max}</b></span><button class="btn" data-next>${i === N - 1 ? "Finish & turn in →" : "Next station →"}</button></div></section>`}`;
      $$(".snav button").forEach(b => b.onclick = () => { S.cur = +b.dataset.k; save(); draw(); window.scrollTo({ top: 0 }); });
      if (!fin) {
        st.blocks.forEach((b, j) => { const el = $(`.blk[data-b="${j}"]`), t = BT[b.t]; if (t.wire) t.wire(el, b, S.b[i + "-" + j], () => { save(); const sc = stScore(i); $(".sfoot b").textContent = `${sc.pts} / ${sc.max}`; }, () => { const y = window.scrollY; draw(); window.scrollTo({ top: y }); }, ctx); });
        $("[data-prev]").onclick = () => { S.cur = i - 1; save(); draw(); window.scrollTo({ top: 0 }); };
        $("[data-next]").onclick = () => { S.cur = i + 1; save(); draw(); window.scrollTo({ top: 0 }); };
      } else wireFinish();
    }
    function finish() {
      const rows = L.stations.map((s, k) => ({ s, sc: stScore(k) })), tot = rows.reduce((a, r) => a + r.sc.pts, 0), max = rows.reduce((a, r) => a + r.sc.max, 0);
      return `<section class="station fin"><h2>✔ Turn in your lesson</h2><p class="mu">You can go back to any station to finish or improve your work. Turning in again replaces your old score.</p>
        <table class="fint"><thead><tr><th>Station</th><th>WICOR</th><th>Points</th></tr></thead><tbody>${rows.map((r, k) => `<tr><td>${k + 1}. ${r.s.title}</td><td>${r.s.letters.join(" ")}</td><td class="${r.sc.pts === r.sc.max ? "ok" : r.sc.pts ? "part" : "bad"}">${r.sc.pts} / ${r.sc.max}</td></tr>`).join("")}</tbody><tfoot><tr><th colspan="2">Total</th><th>${tot} / ${max}</th></tr></tfoot></table>
        <div class="btnrow"><button class="btn big" id="turnin">📤 Turn in to ${preview ? "(preview)" : esc(who.teacher)}</button><span id="tmsg" class="msg"></span></div></section>`;
    }
    function wireFinish() {
      $("#turnin").onclick = async () => {
        const m = $("#tmsg"); if (preview) { m.textContent = "👀 Teacher preview: nothing was sent."; return; }
        const rows = L.stations.map((s, k) => ({ s, sc: stScore(k) }));
        const answers = L.stations.map((s, k) => `${k + 1}. ${s.title}: ` + s.blocks.map((b, j) => BT[b.t].text ? BT[b.t].text(b, S.b[k + "-" + j] || {}, ctx) : "").filter(Boolean).join(" ; ")).join(" || ").slice(0, 4500);
        const body = { action: "lesson", student: who, lesson: `${L.subject}: ${L.title}`, stationsDone: rows.filter(r => r.sc.max && r.sc.pts === r.sc.max).length, answers,
          qlabels: rows.map((r, k) => `${k + 1} · ${r.s.title} (${r.s.letters.join("")})`).filter((_, k) => rows[k].sc.max), qpoints: rows.filter(r => r.sc.max).map(r => r.sc.pts), qmax: rows.filter(r => r.sc.max).map(r => r.sc.max) };
        m.textContent = "Turning in…";
        try {
          if (!HUB_URL) { const d = LS.get("hubDemo", {}); (d.lessons = d.lessons || []).push(Object.assign({}, body, { time: new Date().toISOString() })); LS.set("hubDemo", d); m.textContent = "👀 Preview mode: saved on this computer only (the website isn’t connected to the Google Sheet yet)."; return; }
          const r = await (await fetch(HUB_URL, { method: "POST", body: JSON.stringify(body) })).json(); if (!r.ok) throw new Error(r.error);
          m.textContent = `✅ Turned in to ${who.teacher}!`;
        } catch (e) { m.textContent = "⚠️ " + (e.message || "Could not turn in. Check your internet and try again."); }
      };
    }
    draw();
  }
  gate();
})();
