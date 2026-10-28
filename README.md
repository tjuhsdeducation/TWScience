# TW Mustang Science: Biology Labs

A website just for Tulare Western science, with all 15 interactive Biology labs (10 full labs and 5 mini labs). Every lab grades itself, and each score goes to the student's teacher in Google Sheets.

**Teachers on the sign-in list:** Kelsi Easley, Kurt Airoso, Alyssa Avina, Taylor Custodio, and Joshua Gomes.

---

## Part 1: Put the website online (GitHub Pages, about 5 minutes)

1. Go to github.com and sign in. Click **+** (top right), then **New repository**.
2. Name it something like `tw-science`, make it **Public**, and click **Create repository**.
3. Click **uploading an existing file**. Drag in **every file in this folder** (not the folder itself). Click **Commit changes**.
4. Go to **Settings → Pages**. Under "Branch," choose **main** and **/ (root)**, then **Save**.
5. After about a minute, the page shows your site address, like `https://yourname.github.io/tw-science/`. That's the link for students.

The labs work right away in **preview mode**: they are scored, but scores are only saved on the student's device until you finish Part 2.

## Part 2: Connect Google Sheets (about 10 minutes)

The person who does this owns the score sheets. Each teacher gets their own copy, shared with them automatically.

1. Go to sheets.google.com and open a **Blank spreadsheet**. Name it "TW Science Score Tracker."
2. Click **Extensions → Apps Script**. Delete what's there, paste in all of **Code.gs** from this folder, and click 💾 **Save**.
3. In the toolbar, choose **setup**, then click ▶ **Run**. Approve the permissions: your account → **Advanced** → **Go to (project name) (unsafe)** → **Allow**.
   - This makes a **TW Science Lab Scores** folder in your Drive that holds the master sheet.
4. Choose **createAllTeacherSheets** and click ▶ **Run**. Each teacher gets a sheet named "Bio Lab Scores - (name)", shared with their school email.
5. Click **Deploy → New deployment**, then click ⚙ and choose **Web app**.
   - **Execute as:** Me
   - **Who has access:** Anyone
   - Click **Deploy** and copy the **Web app URL** (it ends in `/exec`).
6. On GitHub, open **hub-config.js** and click ✏️. Paste the URL between the quotes on the `scriptUrl:` line, then **Commit changes**.

Done! Every lab a student turns in now appears in their teacher's sheet:

- **⭐ All Labs** tab: one row per student (period, name, ID), every lab score, and an overall %.
- **One tab per lab**: every period sorted by last name, with station-by-station points and color-coded percents. To the right of each period is an **Aeries list** (Student Name, Student ID, Score, Percent) and a **⬇ Download for Aeries** link that makes a CSV of Student ID + Score.

## Adding or changing teachers

Change the names in **both** places, spelled exactly the same:

- **hub-config.js** (the sign-in list on the website)
- the `SCHOOLS` and `TEACHER_EMAILS` lists at the top of **Code.gs**

After changing Code.gs, click **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**. Then run **createAllTeacherSheets** again so the new teacher gets a sheet.

## Teacher preview mode

At the bottom of the home page (🍎 Teachers), type the passcode **mustangs** to click through any lab without signing in. Nothing is sent in preview mode.

This passcode is only a convenience, not real security. You can change it on the `TEACHER_PASSCODE` line in index.html.

## Files

| File | What it is |
|---|---|
| `index.html` | Home page with the lab cards and the unit filter |
| `lab-*.html`, `mini-*.html` | The 15 labs |
| `cc-*.js`, `cc-lesson.css` | The lab engine and simulations (no need to edit) |
| `tw-theme.css`, `tw-theme.js` | Red, white, and navy Mustang look (no need to edit) |
| `hub-config.js` | Teacher list and Google Sheets address |
| `Code.gs` | The Google Sheets score tracker (it goes in Apps Script, not GitHub, but it's fine to keep a copy here) |
