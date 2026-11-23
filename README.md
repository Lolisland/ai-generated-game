# 🌱 Inkwake

### A little light finds its way.

Inkwake is a small, playable 3D world about growth and transformation. Guide a seed through a quiet field to the standing stone and see what it becomes. The field responds to your movement and changes as the seed blooms and awakens.

## 🎮 How to play

| Action | Controls |
| --- | --- |
| Move the seed | Arrow keys or **WASD**; click or tap the field |
| Toggle petals | **Space** or the **Bloom** button |
| Adjust visual effects | **Effects: full / gentle** button |
| Restart | **Start again** button |

Reach the standing stone to become a light. Gentle effects reduce visual intensity and ambient motion; the game selects this setting automatically when your device requests reduced motion. Inkwake has no audio.

## 🚀 Run locally

You’ll need Node.js and npm installed.

```bash
npm install
npm run dev
```

Open the local address shown in the terminal. On Windows PowerShell, use `npm.cmd` in place of `npm` if script execution is blocked.

## 🛠️ Built with

- [Three.js](https://threejs.org/) for the 3D scene and reactive shader field
- [Vite](https://vite.dev/) for local development and production builds
- [Playwright](https://playwright.dev/) for browser checks

## ✅ Checks and build

```bash
npm test              # Game rule checks
npm run test:browser  # Browser checks; requires installed Google Chrome
npm run build         # Production build
```

Browser test screenshots are saved to `test-results/`. See [DESIGN.md](DESIGN.md) for the visual direction and interaction principles.
