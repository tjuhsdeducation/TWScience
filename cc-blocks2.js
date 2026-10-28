/* =====================================================================
   EXTRA LESSON BLOCKS (no need to edit). Loaded before cc-lesson.js.
   curve, formats, annotate, cornell, lecture, correct, plan, order,
   drive, rename, hotspot, calibrate, scholarships, checklist
   ===================================================================== */
window.CC_EXT = function (BT, H) {
  const { $, $$, esc, strip, words, LS, evalWrite } = H;
  const COL = { y: "#ffe86b", g: "#a8ecb8", p: "#ffbfdc", b: "#b6dcff" };

  /* ---------- forgetting curve ---------- */
  const retention = (reviews, day) => { let S = 1.2, last = 0; [...reviews].sort((a, b) => a - b).forEach(r => { if (r <= day) { S *= 2.2; last = r; } }); return Math.exp(-(day - last) / S); };
  BT.curve = {
    html(b, st) {
      const rv = st.r || [], T = b.test || 21, W = 600, Hh = 260, P = 40, sx = d => P + d * (W - P - 10) / T, sy = v => Hh - 30 - v * (Hh - 50);
      let d1 = "", d0 = ""; for (let i = 0; i <= T * 10; i++) { const d = i / 10; d1 += `${i ? "L" : "M"}${sx(d).toFixed(1)} ${sy(retention(rv, d)).toFixed(1)}`; d0 += `${i ? "L" : "M"}${sx(d).toFixed(1)} ${sy(retention([], d)).toFixed(1)}`; }
      const r = retention(rv, T), pct = Math.round(r * 100);
      return `<div class="curve"><h4>📉 ${b.title}</h4><p class="mu">${b.how}</p>
        <svg viewBox="0 0 ${W} ${Hh}" class="cchart" role="img" aria-label="Memory curve. With your review days, you remember about ${pct} percent on test day.">
          ${[0, .25, .5, .75, 1].map(v => `<line x1="${P}" x2="${W - 10}" y1="${sy(v)}" y2="${sy(v)}" stroke="var(--line)"/><text x="${P - 6}" y="${sy(v) + 4}" text-anchor="end" class="cl">${v * 100}%</text>`).join("")}
          <path d="${d0}" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="6 5"/><path d="${d1}" fill="none" stroke="var(--lc)" stroke-width="3.5"/>
          ${rv.map(d => `<circle cx="${sx(d)}" cy="${sy(1)}" r="5" fill="var(--lc)"/>`).join("")}
          <line x1="${sx(T)}" x2="${sx(T)}" y1="${sy(1)}" y2="${sy(0)}" stroke="var(--fg)" stroke-dasharray="3 3"/><text x="${sx(T) - 4}" y="${sy(1) - 6}" text-anchor="end" class="cv">Test day</text>
          ${[0, 5, 10, 15, 20].filter(d => d <= T).map(d => `<text x="${sx(d)}" y="${Hh - 10}" text-anchor="middle" class="cl">Day ${d}</text>`).join("")}</svg>
        <div class="days">${Array.from({ length: T - 1 }, (_, i) => i + 1).map(d => `<button class="day${rv.includes(d) ? " on" : ""}" data-d="${d}">${d}</button>`).join("")}</div>
        <p class="bigstat ${pct >= 75 ? "ok" : "bad"}">On test day you remember about <b>${pct}%</b> ${rv.length ? `with ${rv.length} review${rv.length > 1 ? "s" : ""}` : "with no reviews (dashed line)"}.</p>
        <p class="src">${b.source || "Simplified model of Hermann Ebbinghaus’s forgetting curve (1885). Real memory varies, but the pattern holds: each review makes memories last longer."}</p></div>`;
    },
    wire(root, b, st, save, redraw) { $$(".day", root).forEach(x => x.onclick = () => { const d = +x.dataset.d; st.r = st.r || []; const i = st.r.indexOf(d); if (i >= 0) st.r.splice(i, 1); else st.r.push(d); save(); redraw(); }); },
    score: (b, st) => ({ max: 1, pts: retention(st.r || [], b.test || 21) >= 0.75 ? 1 : 0, label: "review plan" }),
    text: (b, st) => `Reviews on days ${(st.r || []).sort((a, c) => a - c).join(",")} → ${Math.round(retention(st.r || [], b.test || 21) * 100)}%`
  };

  /* ---------- note formats gallery ---------- */
  BT.formats = {
    html(b, st) {
      const cur = st.c || 0, f = b.formats[cur], seen = st.seen || {};
      return `<div class="formats"><h4>🗂️ ${b.title}</h4><div class="ftabs">${b.formats.map((x, i) => `<button class="${i === cur ? "on" : ""} ${seen[i] ? "seen" : ""}" data-i="${i}">${x.emoji} ${x.name}${seen[i] ? " ✓" : ""}</button>`).join("")}</div>
        <div class="fbody"><div class="fsvg">${f.svg}</div><div class="finfo"><h4>${f.emoji} ${f.name}</h4><p>${f.what}</p><p><b>Best for:</b> ${f.best}</p><p><b>🎓 College lecture tip:</b> ${f.college}</p><p><b>📚 When you study:</b> ${f.study}</p></div></div>
        <p class="mu small">Looked at <b>${Object.keys(seen).length}</b> of ${b.formats.length} formats.</p></div>`;
    },
    wire(root, b, st, save, redraw) { (st.seen = st.seen || {})[st.c || 0] = 1; save(); $$(".ftabs button", root).forEach(x => x.onclick = () => { st.c = +x.dataset.i; st.seen[st.c] = 1; save(); redraw(); }); },
    score: (b, st) => ({ max: 1, pts: Object.keys(st.seen || {}).length >= b.formats.length ? 1 : 0, label: "formats explored" })
  };

  /* ---------- annotate a text (tap words/phrases) ---------- */
  BT.annotate = {
    html(b, st) {
      const tool = st.tool || b.tasks[0].color, m = st.m || {};
      const done = t => { const sel = Object.entries(m).filter(([, c]) => c === t.color).map(([i]) => +i); return (t.key ? sel.filter(i => t.key.includes(i)).length : sel.length) >= t.need; };
      return `<div class="annot"><h4>🖍️ ${b.title}</h4><p class="mu">${b.how || "Pick a marker, then tap words or phrases in the notes. Tap again to erase."}</p>
        <div class="tasks">${b.tasks.map(t => `<button class="task${tool === t.color ? " on" : ""}${done(t) ? " done" : ""}" data-c="${t.color}"><span class="sw" style="background:${COL[t.color]}"></span>${t.label} ${done(t) ? "✓" : `(${Object.values(m).filter(c => c === t.color).length}/${t.need})`}</button>`).join("")}</div>
        <div class="paper ${b.style || ""}">${b.parts.map((p, i) => typeof p === "string" ? `<span class="seg${m[i] ? " m" : ""}" data-i="${i}" style="${m[i] ? `background:${COL[m[i]]}` : ""}">${p}</span>` : p.br ? "<br>" : p.h ? `<div class="ph">${p.h}</div>` : `<span>${p.t}</span>`).join(" ")}</div>
        ${b.feedback && b.tasks.every(done) ? `<p class="fb ok">✅ ${b.feedback}</p>` : ""}</div>`;
    },
    wire(root, b, st, save, redraw) {
      $$(".task", root).forEach(t => t.onclick = () => { st.tool = t.dataset.c; save(); redraw(); });
      $$(".seg", root).forEach(s => s.onclick = () => { const i = s.dataset.i, tool = st.tool || b.tasks[0].color; st.m = st.m || {}; if (st.m[i] === tool) delete st.m[i]; else st.m[i] = tool; save(); redraw(); });
    },
    score(b, st) { const m = st.m || {}; const n = b.tasks.filter(t => { const sel = Object.entries(m).filter(([, c]) => c === t.color).map(([i]) => +i); return (t.key ? sel.filter(i => t.key.includes(i)).length : sel.length) >= t.need; }).length; return { max: b.tasks.length, pts: n, label: "annotations" }; },
    text: (b, st) => Object.entries(st.m || {}).map(([i, c]) => `${c}:${strip(b.parts[i]).slice(0, 30)}`).join(" | ")
  };

  /* ---------- Cornell / focused notes: add questions + summary ---------- */
  BT.cornell = {
    html(b, st) {
      const q = st.q || {}, ev = st.checked ? BT.cornell.ev(b, st) : null;
      return `<div class="cornell"><h4>📝 ${b.title}</h4><p class="mu">${b.how}</p>
        <div class="cn-top"><b>Topic:</b> ${b.topic} <span class="mu">· ${b.cls}</span></div>
        <div class="cn-grid"><div class="cn-h">Questions / key terms (you write)</div><div class="cn-h">Notes</div>
        ${b.rows.map((r, i) => `<div class="cn-q"><textarea rows="3" data-q="${i}" placeholder="${esc(r.ph || "Write a question this answers…")}">${esc(q[i] || "")}</textarea></div><div class="cn-n">${r.n}</div>`).join("")}
        <div class="cn-sum"><b>Summary</b> (3–4 sentences: what are the big ideas, and why do they matter?)<textarea rows="4" data-sum placeholder="These notes explain… The most important idea is… This connects to…">${esc(st.s || "")}</textarea></div></div>
        <div class="btnrow"><button class="btn" data-check>Check my processing</button></div>
        ${ev ? `<ul class="rub">${ev.res.map(r => `<li class="${r.ok ? "ok" : "bad"}">${r.ok ? "✓" : "✗"} ${r.label}</li>`).join("")}</ul>` : ""}</div>`;
    },
    ev(b, st) {
      const qs = b.rows.map((_, i) => (st.q || {})[i] || ""), good = qs.filter(x => words(x) >= 3 && /\?\s*$/.test(x.trim())).length;
      const sw = evalWrite({ min: b.sumMin || 35, checks: b.sumChecks || [] }, st.s || "");
      const res = [{ label: `Questions in the left column (${good} of ${b.rows.length} are real questions ending in “?”)`, ok: good >= b.rows.length - 1 }].concat(sw.res.map(r => ({ label: "Summary: " + r.label, ok: r.ok })));
      return { res, pts: res.every(r => r.ok) ? 2 : res.filter(r => r.ok).length >= Math.ceil(res.length / 2) ? 1 : 0 };
    },
    wire(root, b, st, save, redraw) {
      $$("[data-q]", root).forEach(t => t.oninput = () => { (st.q = st.q || {})[t.dataset.q] = t.value; save(); });
      $("[data-sum]", root).oninput = e => { st.s = e.target.value; save(); };
      $("[data-check]", root).onclick = () => { st.checked = true; save(); redraw(); };
    },
    score: (b, st) => ({ max: 2, pts: st.checked ? BT.cornell.ev(b, st).pts : 0, label: "processed notes" }),
    text: (b, st) => "Qs: " + Object.values(st.q || {}).join(" / ") + " | Summary: " + (st.s || "")
  };

  /* ---------- mini lecture (read aloud) + two-column notes ---------- */
  BT.lecture = {
    html(b, st) {
      const ev = st.checked ? evalWrite({ min: b.min || 40, checks: b.checks }, (st.l || "") + " " + (st.r || "")) : null;
      return `<div class="lecture"><h4>🎧 ${b.title}</h4><p class="mu">${b.how}</p>
        <div class="lbtns"><button class="btn" data-sp="play">▶ Play lecture</button><button class="btn ghost" data-sp="pause">⏸ Pause</button><button class="btn ghost" data-sp="stop">⏮ Start over</button>
        <label class="mu">Speed <select data-rate><option value="0.85">Slower</option><option value="1" selected>Normal</option><option value="1.15">Faster</option></select></label><span class="lstat mu"></span></div>
        <div class="cn-grid two"><div class="cn-h">Questions & key terms</div><div class="cn-h">Notes (paraphrase, abbreviate, use symbols)</div>
          <div class="cn-q"><textarea rows="9" data-l placeholder="What is…? Why does…?">${esc(st.l || "")}</textarea></div><div class="cn-n"><textarea rows="9" data-r placeholder="• main idea → example&#10;• ...">${esc(st.r || "")}</textarea></div></div>
        <div class="btnrow"><button class="btn" data-check>Check my notes</button></div>
        ${ev ? `<ul class="rub">${ev.res.map(r => `<li class="${r.ok ? "ok" : "bad"}">${r.ok ? "✓" : "✗"} ${r.label}</li>`).join("")}</ul>` : ""}
        <details class="transcript"><summary>Show the transcript (after you take notes)</summary>${b.text.map(t => `<p>${t}</p>`).join("")}</details></div>`;
    },
    wire(root, b, st, save, redraw) {
      $("[data-l]", root).oninput = e => { st.l = e.target.value; save(); }; $("[data-r]", root).oninput = e => { st.r = e.target.value; save(); };
      $("[data-check]", root).onclick = () => { st.checked = true; save(); redraw(); };
      const stat = $(".lstat", root);
      $$("[data-sp]", root).forEach(x => x.onclick = () => {
        const s = window.speechSynthesis; if (!s) { stat.textContent = "Your browser can’t read aloud. Open the transcript or have your teacher read it."; return; }
        const a = x.dataset.sp; if (a === "pause") { if (s.speaking && !s.paused) { s.pause(); stat.textContent = "Paused"; } else { s.resume(); stat.textContent = "Playing…"; } return; }
        if (a === "play" && s.paused) { s.resume(); return; }
        s.cancel(); const rate = +$("[data-rate]", root).value; const vs = s.getVoices().filter(v => /^en(-|_)US/i.test(v.lang)); const voice = vs.find(v => /natural|google|samantha|aria|jenny/i.test(v.name)) || vs[0];
        const parts = b.text.join(" ").match(/[^.!?]+[.!?]+["”’]?\s*/g) || b.text; parts.forEach((t, i) => { const u = new SpeechSynthesisUtterance(t.trim()); u.rate = rate; if (voice) u.voice = voice; if (i === parts.length - 1) u.onend = () => stat.textContent = "Lecture finished."; s.speak(u); }); stat.textContent = "Playing…";
      });
    },
    score: (b, st) => ({ max: 2, pts: st.checked ? evalWrite({ min: b.min || 40, checks: b.checks }, (st.l || "") + " " + (st.r || "")).pts : 0, label: "lecture notes" }),
    text: (b, st) => `L: ${st.l || ""} | R: ${st.r || ""}`
  };

  /* ---------- quiz corrections ---------- */
  const ERR = ["I didn’t know the concept", "Careless mistake", "Misread the question", "Ran out of time / guessed"];
  BT.correct = {
    html(b, st) {
      const a = st.a || {};
      return `<div class="correct"><h4>🔁 ${b.title}</h4><p class="mu">${b.how}</p><div class="quizpaper"><div class="qhd">${b.header}</div>
        ${b.items.map((it, k) => { const s = a[k] || {}; const right = s.c === it.a;
          return `<div class="cq"><p><b>${k + 1}.</b> ${it.q}</p><p class="wrongans">✗ Student answered: <b>${it.opts[it.was]}</b></p>
          <label>Why was it missed? <select data-k="${k}" data-f="e"><option value="">Choose…</option>${ERR.map((e, i) => `<option value="${i}" ${s.e == i ? "selected" : ""}>${e}</option>`).join("")}</select></label>
          <div class="opts">${it.opts.map((o, j) => `<button class="opt${s.c === j ? " sel" : ""}${s.c != null && j === it.a && right ? " right" : ""}${s.c === j && !right ? " wrong" : ""}" data-k="${k}" data-j="${j}"><span class="lt">${String.fromCharCode(65 + j)}</span><span>${o}</span></button>`).join("")}</div>
          ${s.c != null ? `<div class="fb ${right ? "ok" : "bad"}">${right ? "✅ That’s the correct answer. " + it.why : "Not yet. Check your notes and try another answer."}</div>` : ""}
          <label class="note">Explain the correct answer in your own words (this becomes a study note):<textarea rows="2" data-k="${k}" data-f="w">${esc(s.w || "")}</textarea></label></div>`; }).join("")}</div></div>`;
    },
    wire(root, b, st, save, redraw) {
      $$(".opt[data-k]", root).forEach(o => o.onclick = () => { const k = o.dataset.k; st.a = st.a || {}; st.a[k] = Object.assign({}, st.a[k], { c: +o.dataset.j }); save(); redraw(); });
      $$("select[data-f]", root).forEach(s => s.onchange = () => { const k = s.dataset.k; st.a = st.a || {}; st.a[k] = Object.assign({}, st.a[k], { e: s.value }); save(); });
      $$("textarea[data-f]", root).forEach(t => t.oninput = () => { const k = t.dataset.k; st.a = st.a || {}; st.a[k] = Object.assign({}, st.a[k], { w: t.value }); save(); });
    },
    score(b, st) { const a = st.a || {}, n = b.items.filter((it, k) => a[k] && a[k].c === it.a && a[k].e !== undefined && a[k].e !== "" && words(a[k].w) >= 8).length; return { max: 2, pts: n === b.items.length ? 2 : n >= b.items.length / 2 ? 1 : 0, label: "quiz corrections" }; },
    text: (b, st) => b.items.map((it, k) => { const s = (st.a || {})[k] || {}; return `Q${k + 1} ${s.e !== undefined && s.e !== "" ? ERR[s.e] : "-"}: ${s.w || ""}`; }).join(" | ")
  };

  /* ---------- spaced study planner ---------- */
  BT.plan = {
    html(b, st) {
      const on = st.on || {}, res = BT.plan.rules(b, st);
      return `<div class="plan"><h4>🗓️ ${b.title}</h4><p class="mu">${b.how}</p><div class="cal">${b.days.map((d, i) => `<button class="cday${on[i] ? " on" : ""}${i === b.days.length - 1 ? " test" : ""}" data-i="${i}" ${i === b.days.length - 1 ? "disabled" : ""}><small>${d[0]}</small><b>${d[1]}</b>${i === b.days.length - 1 ? "<span>📝 TEST</span>" : on[i] ? `<span>${on[i]}</span>` : ""}</button>`).join("")}</div>
        <p class="mu small">Tap a day to add a study session; tap again to change it, a third time to remove it.</p>
        <ul class="rub">${res.map(r => `<li class="${r.ok ? "ok" : "bad"}">${r.ok ? "✓" : "✗"} ${r.label}</li>`).join("")}</ul></div>`;
    },
    rules(b, st) { const on = st.on || {}, n = b.days.length - 1, idx = Object.keys(on).map(Number), acts = Object.values(on);
      return [{ label: "At least 3 study sessions", ok: idx.length >= 3 }, { label: "Start at least 5 days before the test", ok: idx.some(i => n - i >= 5) }, { label: "Not all sessions crammed into the last 2 days", ok: idx.some(i => n - i > 2) },
        { label: "Use at least 2 kinds of studying (revisit notes, self-quiz, fix old quizzes…)", ok: new Set(acts).size >= 2 }]; },
    wire(root, b, st, save, redraw) { $$(".cday", root).forEach(c => c.onclick = () => { const i = c.dataset.i, A = b.acts; st.on = st.on || {}; const cur = st.on[i]; const k = cur ? A.indexOf(cur) + 1 : 0; if (k >= A.length) delete st.on[i]; else st.on[i] = A[k]; save(); redraw(); }); },
    score(b, st) { const r = BT.plan.rules(b, st), k = r.filter(x => x.ok).length; return { max: 2, pts: k === r.length ? 2 : k >= 2 ? 1 : 0, label: "study plan" }; },
    text: (b, st) => "Plan: " + Object.entries(st.on || {}).map(([i, a]) => `${b.days[i][0]} ${b.days[i][1]}=${a}`).join(", ")
  };

  /* ---------- put in order ---------- */
  BT.order = {
    html(b, st) {
      if (!st.v) { st.v = b.items.map((_, i) => i); for (let i = st.v.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [st.v[i], st.v[j]] = [st.v[j], st.v[i]]; } if (st.v.every((x, i) => x === i)) st.v.reverse(); }
      const done = !!st.checked;
      return `<div class="order"><h4>🔢 ${b.title}</h4><p class="mu">${b.how || "Use the arrows to put these in the best order."}</p><ol class="olist">${st.v.map((si, p) => `<li class="${done ? (si === p ? "ok" : "bad") : ""}"><span>${b.items[si]}</span>${done ? "" : `<span class="mv"><button data-p="${p}" data-d="-1" ${p ? "" : "disabled"} aria-label="Move up">↑</button><button data-p="${p}" data-d="1" ${p < st.v.length - 1 ? "" : "disabled"} aria-label="Move down">↓</button></span>`}</li>`).join("")}</ol>
        ${done ? `<p class="score">${st.v.filter((x, i) => x === i).length} of ${b.items.length} in the right spot.${b.why ? " " + b.why : ""}</p>` : `<div class="btnrow"><button class="btn" data-check>Check my order</button></div>`}</div>`;
    },
    wire(root, b, st, save, redraw) {
      $$(".mv button", root).forEach(x => x.onclick = () => { const p = +x.dataset.p, q = p + +x.dataset.d; [st.v[p], st.v[q]] = [st.v[q], st.v[p]]; save(); redraw(); });
      const c = $("[data-check]", root); if (c) c.onclick = () => { st.checked = true; save(); redraw(); };
      save();
    },
    score(b, st) { if (!st.checked) return { max: 2, pts: 0, label: "order" }; const r = st.v.filter((x, i) => x === i).length; return { max: 2, pts: r === b.items.length ? 2 : r >= b.items.length / 2 ? 1 : 0, label: "order" }; }
  };

  /* ---------- Google Drive simulator ---------- */
  const ICON = { doc: ["📄", "#4285f4"], slide: ["📙", "#f4b400"], sheet: ["📗", "#0f9d58"], pdf: ["📕", "#db4437"], img: ["🖼️", "#a142f4"], vid: ["🎬", "#db4437"], form: ["📋", "#7248b9"] };
  BT.drive = {
    html(b, st) {
      const P = st.p || {}, sel = st.sel, done = !!st.checked;
      const file = (f, i) => `<button class="dfile${sel === i ? " on" : ""}${done ? (P[i] === f.f ? " right" : " wrong") : ""}" data-f="${i}" ${done ? "disabled" : ""}><span class="fi" style="color:${ICON[f.t][1]}">${ICON[f.t][0]}</span><span>${f.n}</span></button>`;
      return `<div class="drive"><h4>🗄️ ${b.title}</h4><p class="mu">${b.how}</p><div class="dwin"><div class="dside"><div class="dnew">＋ New</div><div class="dnav on">🏠 My Drive</div><div class="dnav">👥 Shared with me</div><div class="dnav">🕘 Recent</div><div class="dnav">⭐ Starred</div><div class="dnav">🗑️ Trash</div></div>
        <div class="dmain"><div class="dbar">My Drive ▸ <b>${b.root || "School 2026–27"}</b></div><div class="dlabel">Folders (tap a file, then tap a folder)</div>
        <div class="dfolders">${b.folders.map((f, fi) => `<div class="dfolder" data-k="${fi}" style="--fc:${f.c}"><div class="dfh">📁 ${f.n} <small>${b.files.filter((x, i) => P[i] === fi).length}</small></div>${b.files.map((x, i) => P[i] === fi ? file(x, i) : "").join("")}</div>`).join("")}</div>
        <div class="dlabel">Files not in a folder yet</div><div class="dloose">${b.files.map((x, i) => P[i] == null ? file(x, i) : "").join("") || '<span class="mu">🎉 Everything has a place!</span>'}</div></div></div>
        ${done ? `<p class="score">${b.files.filter((x, i) => P[i] === x.f).length} of ${b.files.length} files in the right folder.</p>` : `<div class="btnrow"><button class="btn" data-check>Check my Drive</button><span class="msg"></span></div>`}</div>`;
    },
    wire(root, b, st, save, redraw) {
      $$(".dfile", root).forEach(f => f.onclick = e => { e.stopPropagation(); const i = +f.dataset.f, fold = f.closest(".dfolder");
        if (fold && st.sel != null && st.sel !== i) { (st.p = st.p || {})[st.sel] = +fold.dataset.k; st.sel = null; } else st.sel = st.sel === i ? null : i; save(); redraw(); });
      $$(".dfolder", root).forEach(f => f.onclick = () => { if (st.sel == null) return; (st.p = st.p || {})[st.sel] = +f.dataset.k; st.sel = null; save(); redraw(); });
      const c = $("[data-check]", root); if (c) c.onclick = () => { if (b.files.some((_, i) => (st.p || {})[i] == null)) { $(".msg", root).textContent = "Move every file into a folder first."; return; } st.checked = true; save(); redraw(); };
    },
    score: (b, st) => ({ max: 2, pts: st.checked ? Math.round(2 * b.files.filter((x, i) => (st.p || {})[i] === x.f).length / b.files.length) : 0, label: "Drive folders" })
  };

  /* ---------- rename files ---------- */
  BT.rename = {
    html(b, st) {
      const v = st.v || {}, done = !!st.checked;
      return `<div class="rename"><h4>✏️ ${b.title}</h4><p class="mu">${b.how}</p><div class="rnrule">${b.rule}</div>
        ${b.items.map((it, i) => { const ok = it.re.test((v[i] || "").trim()); return `<div class="rnrow"><div class="rnold"><span>${ICON[it.t][0]}</span> <s>${it.old}</s><small>${it.about}</small></div><input data-i="${i}" value="${esc(v[i] || "")}" placeholder="New name" class="${done ? (ok ? "ok" : "bad") : ""}">${done && !ok ? `<small class="bad">Example: ${it.ex}</small>` : ""}</div>`; }).join("")}
        <div class="btnrow"><button class="btn" data-check>Check my file names</button></div>${done ? `<p class="score">${b.items.filter((it, i) => it.re.test((v[i] || "").trim())).length} of ${b.items.length} follow the naming rule.</p>` : ""}</div>`;
    },
    wire(root, b, st, save, redraw) { $$("input[data-i]", root).forEach(x => x.oninput = () => { (st.v = st.v || {})[x.dataset.i] = x.value; save(); }); $("[data-check]", root).onclick = () => { st.checked = true; save(); redraw(); }; },
    score: (b, st) => ({ max: 2, pts: st.checked ? Math.round(2 * b.items.filter((it, i) => it.re.test(((st.v || {})[i] || "").trim())).length / b.items.length) : 0, label: "file names" }),
    text: (b, st) => Object.values(st.v || {}).join(" / ")
  };

  /* ---------- find-the-button (mock app screen) ---------- */
  BT.hotspot = {
    html(b, st) {
      const k = st.k || 0, t = b.tasks[Math.min(k, b.tasks.length - 1)], fin = k >= b.tasks.length;
      return `<div class="hotspot"><h4>🖱️ ${b.title}</h4><div class="htask">${fin ? `🎉 You found everything! First-try finds: <b>${st.first || 0} of ${b.tasks.length}</b>` : `<span class="hnum">${k + 1}/${b.tasks.length}</span> ${t.q}`}</div>
        <div class="mock">${b.ui}</div><div class="hfb" aria-live="polite">${st.fb || ""}</div></div>`;
    },
    wire(root, b, st, save, redraw) {
      $$("[data-hot]", root).forEach(h => h.onclick = e => { e.preventDefault(); e.stopPropagation(); const k = st.k || 0; if (k >= b.tasks.length) return; const t = b.tasks[k];
        if (h.dataset.hot === t.hot) { if (!st.tried) st.first = (st.first || 0) + 1; st.tried = false; st.k = k + 1; st.fb = `<span class="ok">✅ Yes! ${t.why}</span>`; }
        else { st.tried = true; st.miss = (st.miss || 0) + 1; st.fb = `<span class="bad">Not that one. Hint: ${t.hint}</span>`; }
        save(); redraw(); });
      $$(".mock *", root).forEach(x => { if (!x.closest("[data-hot]")) x.onclick = e => { e.preventDefault(); }; });
    },
    score: (b, st) => ({ max: b.tasks.length, pts: Math.min(st.k || 0, b.tasks.length), label: "found it" }),
    text: (b, st) => `Found ${st.k || 0}/${b.tasks.length}, first try ${st.first || 0}`
  };

  /* ---------- grade it like a teacher (calibration) ---------- */
  BT.calibrate = {
    html(b, st) {
      const s = st.s || {}, shown = !!st.shown, tot = b.rubric.reduce((a, r) => a + r.max, 0), mine = b.rubric.reduce((a, r, i) => a + (+s[i] || 0), 0), teach = b.rubric.reduce((a, r) => a + r.t, 0);
      const diff = b.rubric.reduce((a, r, i) => a + Math.abs((+s[i] || 0) - r.t), 0);
      return `<div class="calib"><div class="cbhead"><h4>🧑‍🏫 ${b.title}</h4><span class="cbtag">${b.tag}</span></div>
        <div class="cbgrid"><div class="artifact">${b.artifact}</div>
        <div class="rubricbox"><h4>Your grading</h4>${b.rubric.map((r, i) => `<div class="rrow"><div class="rc"><b>${r.c}</b><small>${r.d}</small></div>
          <div class="rpts">${Array.from({ length: r.max + 1 }, (_, p) => `<button class="${+s[i] === p && s[i] !== undefined ? "on" : ""}${shown && p === r.t ? " tch" : ""}" data-i="${i}" data-p="${p}" ${shown ? "disabled" : ""}>${p}</button>`).join("")}</div>
          ${shown ? `<div class="tcm ${(+s[i] || 0) === r.t ? "ok" : Math.abs((+s[i] || 0) - r.t) === 1 ? "part" : "bad"}">Teacher: <b>${r.t}/${r.max}</b>. ${r.why}</div>` : ""}</div>`).join("")}
          <div class="cbtot">Your score: <b>${mine} / ${tot}</b>${shown ? ` · Teacher: <b>${teach} / ${tot}</b>` : ""}</div>
          ${shown ? `<p class="bigstat ${diff <= 1 ? "ok" : diff <= 3 ? "part" : "bad"}">${diff <= 1 ? "🎯 You graded like a teacher!" : diff <= 3 ? "👍 Close. Read the teacher comments to see the difference." : "🔍 Big difference. Reread the rubric and the teacher comments."} (off by ${diff} point${diff === 1 ? "" : "s"} total)</p>${b.lesson ? `<p class="tip">💡 ${b.lesson}</p>` : ""}`
            : `<div class="btnrow"><button class="btn" data-show>Compare with the teacher</button><span class="msg"></span></div>`}</div></div></div>`;
    },
    wire(root, b, st, save, redraw) {
      $$(".rpts button", root).forEach(x => x.onclick = () => { (st.s = st.s || {})[x.dataset.i] = +x.dataset.p; save(); redraw(); });
      const c = $("[data-show]", root); if (c) c.onclick = () => { if (b.rubric.some((_, i) => (st.s || {})[i] === undefined)) { $(".msg", root).textContent = "Score every row first."; return; } st.shown = true; save(); redraw(); };
    },
    score(b, st) { if (!st.shown) return { max: 2, pts: 0, label: "calibration" }; const d = b.rubric.reduce((a, r, i) => a + Math.abs((+(st.s || {})[i] || 0) - r.t), 0); return { max: 2, pts: d <= 1 ? 2 : d <= 3 ? 1 : 0, label: "calibration" }; },
    text: (b, st) => `${b.tag}: mine ${b.rubric.map((r, i) => (st.s || {})[i] ?? "-").join("-")} vs teacher ${b.rubric.map(r => r.t).join("-")}`
  };

  /* ---------- scholarship directory ---------- */
  BT.scholarships = {
    html(b, st) {
      const f = st.f || "All", add = st.add || {}, list = b.list.filter(x => f === "All" || x.scope === f);
      return `<div class="schol"><h4>🏆 ${b.title}</h4><p class="mu">${b.how}</p><div class="ftabs">${["All", "Local", "California", "National"].map(x => `<button class="${f === x ? "on" : ""}" data-f="${x}">${x}</button>`).join("")}</div>
        <div class="scards">${list.map(x => { const i = b.list.indexOf(x); return `<div class="scard"><div class="sch"><span class="scope s-${x.scope}">${x.scope}</span><span class="when">🗓️ ${x.when}</span></div><h4>${x.name}</h4><p class="amt">${x.amt}</p><p><b>Who:</b> ${x.who}</p><p><b>How:</b> ${x.how}</p>
          <div class="btnrow">${x.url ? `<a class="btn ghost" href="${x.url}" target="_blank" rel="noopener">Learn more ↗</a>` : ""}<button class="btn${add[i] ? " added" : ""}" data-a="${i}">${add[i] ? "✓ In my tracker" : "＋ Add to my tracker"}</button></div></div>`; }).join("")}</div>
        <p class="src">${b.source}</p></div>`;
    },
    wire(root, b, st, save, redraw) {
      $$(".ftabs button", root).forEach(x => x.onclick = () => { st.f = x.dataset.f; save(); redraw(); });
      $$("[data-a]", root).forEach(x => x.onclick = () => { const i = x.dataset.a; st.add = st.add || {}; if (st.add[i]) return; st.add[i] = 1; const s = b.list[i];
        try { const rows = JSON.parse(localStorage.getItem("schol-tracker") || "[]"); rows.push({ n: s.name, amt: s.num || "", due: "", req: s.how.replace(/<[^>]+>/g, "").slice(0, 120), status: "Researching" }); localStorage.setItem("schol-tracker", JSON.stringify(rows)); } catch (e) {}
        save(); redraw(); });
    },
    score: (b, st) => ({ max: 1, pts: Object.keys(st.add || {}).length >= 3 ? 1 : 0, label: "scholarships saved" }),
    text: (b, st) => "Saved: " + Object.keys(st.add || {}).map(i => b.list[i].name).join(", ")
  };

  /* ---------- checklist (+ optional links to real work) ---------- */
  BT.checklist = {
    html(b, st) {
      const c = st.c || {}, l = st.l || {};
      return `<div class="checklist"><h4>✅ ${b.title}</h4><p class="mu">${b.how || ""}</p>${b.items.map((x, i) => `<label class="ck"><input type="checkbox" data-i="${i}" ${c[i] ? "checked" : ""}> <span>${x}</span></label>`).join("")}
        ${(b.links || []).map((x, i) => { const v = l[i] || "", ok = x.re.test(v); return `<label class="note">${x.label}<input class="lnkin ${v ? (ok ? "ok" : "bad") : ""}" data-l="${i}" value="${esc(v)}" placeholder="${esc(x.ph)}">${v && !ok ? `<small class="bad">That doesn’t look like a ${x.kind} link. Copy it from the Share button.</small>` : ""}</label>`; }).join("")}</div>`;
    },
    wire(root, b, st, save, redraw) {
      $$("input[type=checkbox]", root).forEach(x => x.onchange = () => { (st.c = st.c || {})[x.dataset.i] = x.checked; save(); });
      $$("input[data-l]", root).forEach(x => { x.oninput = () => { (st.l = st.l || {})[x.dataset.l] = x.value.trim(); save(); }; x.onchange = () => redraw(); });
    },
    score(b, st) { const all = b.items.every((_, i) => (st.c || {})[i]); const lk = (b.links || []).every((x, i) => x.re.test((st.l || {})[i] || "")); return { max: b.links && b.links.length ? 2 : 1, pts: (all ? 1 : 0) + (b.links && b.links.length && lk ? 1 : 0), label: "checklist" }; },
    text: (b, st) => "Links: " + Object.values(st.l || {}).join(" ")
  };
};
