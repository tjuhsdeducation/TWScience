/* =====================================================================
   TW MUSTANG SCIENCE: lab theme (no need to edit)
   Loaded on every lab page right before cc-lesson.js. It gives the labs
   the Tulare Western red, white, and navy look, points the "home" link
   back to this site, and picks the only school on the sign-in screen.
   ===================================================================== */
(function () {
  var dark = false;
  try { dark = matchMedia("(prefers-color-scheme: dark)").matches && document.documentElement.getAttribute("data-theme") !== "light"; } catch (e) {}
  if (window.CC) {
    CC.brand = { name: "TW Mustang Science", home: "labs", mark: "🐎" };
    CC.color = dark ? "#8fb0ff" : "#1d3a6e";          /* navy accents (lighter navy in dark mode so text stays readable) */
    CC.kind = CC.kind || "Virtual Lab";
  }
  /* One school on this site: choose it for the student so they only pick period + teacher */
  function pickSchool() {
    var s = document.getElementById("g-sch");
    if (!s || s.value || s.options.length !== 2) return;
    s.value = s.options[1].value;
    s.dispatchEvent(new Event("change", { bubbles: true }));
  }
  var mo = new MutationObserver(pickSchool);
  document.addEventListener("DOMContentLoaded", function () { mo.observe(document.body, { childList: true, subtree: true }); pickSchool(); });
})();
