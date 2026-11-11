# Selected Work Foreground Preview Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development or superpowers:executing-plans for implementation. Steps use checkboxes for tracking.

**Goal:** Make each project screenshot a sharp, visible exhibit inside the existing pinned Selected Work sequence.

**Architecture:** Keep the current sticky screen, scroll-to-project mapping, and Lenis navigation. Replace the full-bleed image layer with an in-flow preview figure inside each scene; the surrounding stage is a fixed dark surface. The current static card list stays in place on mobile, on short viewports, and with reduced motion.

**Tech stack:** React, TypeScript, local CSS, existing Motion and Lenis. No new dependencies or images.

**Design brief:** Preserve the user's existing four projects, titles, descriptions, stack labels, links, project index, progress bar, and scroll order. Make the image the largest thing on the stage, with its edges and colors intact.

## Reference decisions

- [Jonas Arleth’s Sticky Project Teaser](https://webflow.com/made-in-webflow/website/sticky-project-teaser-image-scroll-animation) separates text from a pinned image that changes with the scroll position. Borrow the separation, and keep the portfolio's current per-project scroll steps.
- [Blackpepper’s Sage East case study](https://www.theblackpepperstudio.com/projects/sage-east) documents the use of a neutral dark surface to give the work itself visual priority. Borrow the quiet stage and skip the current screenshot scrims.
- [Victor Blanco’s Sujin Kim portfolio case study](https://victorblancoweb.com/work/sujin-kim) documents full-screen chapters with a separate position rail. Keep the project index and progress outside the artwork.

A vertically stacked scene with its image above all the details would give the image more width, but it would put the longest project copy under pressure at 672px high. Use a split scene so the screenshot and details have independent vertical space.

```text
Wide desktop, at least 1280px wide
Selected Work                                      Scroll to explore
01 ERP Platform      ┌──────────────────────┐      Project title
02 Workforce         │                      │      Description
03 OrderEase         │   Full screenshot    │      Built with
04 BusBuddy          └──────────────────────┘      Project link
                            01 ━━━━━━━ 04

Compact desktop: keep the image beside the details, and move the project
index into a horizontal footer row above or beside the progress bar.
```

## Implementation

**Files:** Modify `src/components/ui/project-showcase.tsx` and `src/components/ui/project-showcase.css`. Keep `src/components/SelectedWork.tsx` and its project data as the source of truth.

- [x] Record the failing browser behavior: the active project image is inside an aria-hidden, absolutely positioned backdrop. Assert that the active scene instead has a bounded foreground image whose box does not intersect the title, description, or controls.
- [x] Put the preview in the active scene's content grid. Reuse the existing `ProjectPreview({ src, title })` load-failure behavior and descriptive alt text. Reserve a roughly 2.2:1 frame, use `object-fit: contain`, and preserve the native screenshot edges. Remove the full-bleed image, blur, and scrim. Keep the viewport background independent of the active project.
- [x] Group title, description, technologies, and the existing project link in the right column. At 1280px and up, keep the vertical index to the left; below that breakpoint, put the same buttons in the footer so the image keeps the larger column. Preserve the 1024 × 672 minimum for the pinned experience and the normal card list below it. Keep the header and footer clear of the project content.
- [x] Apply the current forward/backward transition to the foreground frame with a short fade and small directional translation. Preserve the title reveal and avoid motion at rest. Keep the stage and navigation steady; leave the scroll handler, active state, progress, keyboard buttons, and inactive-scene `inert` handling intact.

## Verification

- [x] In Chrome, inspect all four projects at **1536 × 729** and **1024 × 672**. Check that previews are sharp, contained, and larger than their details column; check the longest title (OrderEase) and longest stack label (Google Maps API). Confirm no overlap with the header, index, or progress.
- [x] Scroll forward and backward and jump to a project with keyboard Enter. Verify that the preview, title, technologies, progress, and active index stay in sync and that inactive links cannot receive focus. Confirm a missing preview shows its fallback without resizing the scene.
- [x] At **390px** wide, on a short viewport, at **200% zoom**, and with reduced motion, confirm the normal cards are usable, in order, with working links. Check that forced colors retains the foreground image and visible keyboard focus. Run `npm run build` and `npm run lint`.

Verification used headless Chrome at 1536 × 729, 1280 × 672, and 1024 × 672. Zoom reflow was emulated with a half-width CSS viewport at 2× pixel density. The project link destinations were preserved. Build and lint passed.
