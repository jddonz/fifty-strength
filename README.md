# Fifty Strength

A small, privacy-first reference site for an 8-week strength + CrossFit foundation program.

**Live:** https://jddonz.github.io/fifty-strength/

## What this is

A static, phase-tabbed reference page — goals, rules, and exercises for each phase/day, plus an RPE quick reference and walking progression. Exercise checkboxes let you check items off as you go (stored in `localStorage` on-device only, nothing else).

This is **read-only reference**, not a workout tracker. Actual sets/reps/weight/RPE logging happens in [Hevy](https://www.hevyapp.com/) — this site never sends or stores workout performance data.

## Install as a Home Screen app (iOS)

1. Open the live link above in **Safari**.
2. Tap the Share button → **Add to Home Screen**.
3. Launches full-screen from the icon, no browser chrome.

## Development

Plain HTML/CSS/JS, no build step, no dependencies.

- `index.html`, `styles.css`, `app.js` — the site.
- `manifest.webmanifest`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` — Home Screen install support.

**Workflow:** trunk-based. Branch off `main`, test locally (`python3 -m http.server` and open in a browser — check the console for errors), open a PR into `main`. `.github/workflows/ci.yml` runs on every PR (JS syntax check, manifest JSON validity, asset-reference check) and is a required status check. `main` is protected: PRs required, no force-push, no deletion. GitHub Pages deploys from `main` on every push.

## Security principles

- No secrets or credentials in the repository.
- Minimal GitHub Actions permissions.
- No third-party runtime JavaScript dependencies.
- Local-only checkbox state; no workout data collected or transmitted.
- Accessible, mobile-first UI.
