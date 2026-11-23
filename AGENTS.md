# Psychedelic game — development guide

## Goal and scope

Build a beautiful, playful, responsive game through small, working iterations. Make interaction feel good before adding visual complexity. Assume a browser-based 2D game unless the project or user specifies another platform.

## Working agreement

- Implement one user-visible feature or focused fix at a time. Define its expected behavior and how to check it before coding.
- Keep every iteration playable. Prefer the smallest clear solution and reuse existing code and tools before adding dependencies or architecture.
- Explain choices in plain language suitable for a beginner. Ask only when a decision would substantially change the game or its platform.
- Keep game rules, input, audio, and rendering separate when that helps testing; avoid abstraction for a single use case.
- Keep animations smooth and responsive. Support keyboard and pointer input where relevant, a pause or mute control for sound, and reduced-motion preferences for intense effects.
- Keep flashing, rapid movement, and audio controllable. Do not make essential feedback depend on color or sound alone.

## Iteration workflow

1. Inspect the current game and its scripts. State the single feature, its acceptance criteria, and the smallest implementation.
2. Implement it without unrelated refactors. Use descriptive names and short comments only where intent is otherwise unclear.
3. Test the new behavior at its boundary and run the existing relevant tests. Add or update a meaningful regression test for changed rules or previously broken behavior; avoid tests that merely restate implementation.
4. Run the project's lint, type check, and build when available. Play through the affected path in a browser or equivalent runtime, checking input, visuals, and failure states. If a check cannot run, report that explicitly.
5. Fix failures before moving to another feature. Summarize what changed, what was tested, and any remaining limitation.
6. Use the minimal code approach from ponytail skills.

## Project record

- Update this file whenever a relevant project decision changes: platform, stack, commands, game controls, architecture, asset conventions, accessibility rules, or testing approach.
- Keep this guide short and current. Record the present behavior and decisions rather than accumulating a chronological log.
- Do not claim tests passed unless they actually ran. Preserve existing working features when adding new ones.

## Initial technical direction

- For a browser game needing accounts, saved progress, or other server features, start with SvelteKit as the full-stack framework and Phaser for the 2D game canvas. Keep game state in the browser first; add persistence and a database only when a feature needs them.
- Treat this as a starting recommendation, not an installed stack. Reassess if the intended game is primarily 3D or targets native devices.
- No project scripts or game controls exist yet. Add their exact commands and controls here after the first playable slice is created.
