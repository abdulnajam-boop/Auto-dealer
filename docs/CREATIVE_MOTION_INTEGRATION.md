# Auto Dealer interactive motion

## Source inspiration
https://github.com/yihui-dev/awesome-opus5-5-videos (MIT licensed prompt collection; prompts are inspiration, not a drop-in runtime).

## Scope
Add a progressively enhanced vehicle detail animation using existing listing images (not fabricated 3D car models); animated lease/finance breakdown, motion-safe transitions, mobile fallback and accessibility. Ensure finance figures use existing calculator logic, never animation-derived values.

## Engineering rules
- Keep the existing app operational; implement as an optional feature flag.
- Use TypeScript where the application is TypeScript; follow existing patterns otherwise.
- Respect prefers-reduced-motion, keyboard accessibility, responsive layouts, and performance budgets.
- No copyrighted media reuse without rights verification.
- Add tests and a screenshot/video preview before merge.
- Never deploy or merge without review.

## Implementation checklist
- [ ] Inspect existing UI, dependencies, routing, and test setup.
- [ ] Select animation technology appropriate to the app (SVG/CSS/Canvas/GSAP/Three.js).
- [ ] Implement the smallest demonstrable component with mock data.
- [ ] Add feature flag, fallback, accessibility, and tests.
- [ ] Run lint/build/tests and document demo instructions.
- [ ] Open PR for review.
