/* =====================================================================
   ✏️ TW MUSTANG SCIENCE SETTINGS: teachers and the Google Sheets address.

   1) scriptUrl: after you deploy Code.gs as a Web app (see README.md),
      paste the Web app URL between the quotes, like:
          scriptUrl: "https://script.google.com/macros/s/AKfy.../exec",
      While it is empty, the site runs in PREVIEW MODE: labs work and are
      scored, but scores are only saved on that computer.
   2) schools: the teacher dropdown on the sign-in screen. Keep these names
      exactly the same as the SCHOOLS list at the top of Code.gs.
   ===================================================================== */
window.HUB_CONFIG = {
  scriptUrl: "",
  schools: {
    "Tulare Western": ["Kelsi Easley", "Kurt Airoso", "Alyssa Avina", "Taylor Custodio", "Joshua Gomes"]
  },
  periods: ["1", "2", "3", "4", "5", "6", "7", "8"]
};
window.HUB_CONFIG.teachers = Object.values(window.HUB_CONFIG.schools).flat();
