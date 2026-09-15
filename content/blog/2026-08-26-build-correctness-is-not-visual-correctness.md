---
title: "A passing build is not a finished interface"
slug: "build-correctness-is-not-visual-correctness"
date: "2026-08-26"
status: "published"
category: "frontend-quality"
excerpt: "Why frontend work needs a rendered check after the code passes: layout, hierarchy, wrapping, and containment only exist in the browser."
coverImage: "https://picsum.photos/seed/visual-interface-verification/1600/900.jpg"
coverAlt: "Decorative stock photograph; not evidence of interface verification."
---
A successful build answers one question: can the project compile? It cannot tell me whether the interface has the right hierarchy, holds together at the requested widths, or matches the approved design.

Small changes make this easy to miss. A component can type-check while its heading wraps one line too early. A grid can render every item while the visual order is wrong. A section can have the right classes while a long label escapes its container on mobile.

## Start with the requested boundary

Before changing CSS or component structure, I write down what the screen is supposed to contain. I check the DOM boundary, the content order, and which wrapper owns width and spacing.

I avoid a common shortcut: moving an element visually to fix a screenshot while leaving the hierarchy wrong. A transform may improve one viewport, but it can break reading order, keyboard navigation, or the next breakpoint.

The fix should match the responsibility. If the data order is wrong, change the data or render order. If the wrapper is too narrow, adjust the wrapper token. If a decorative layer is covering content, fix containment and stacking instead of hiding the symptom.

## Check the browser as well as the source

A rendered check catches problems that static inspection misses. I look at the desktop composition first, then at a narrow viewport where wrapping and overflow expose weak points.

The useful questions are concrete:

- Does the visual order match the intended reading order?
- Are headings, metadata, and actions grouped as designed?
- Does text wrap without pushing cards or controls outside their container?
- Are decorative effects quiet enough to preserve contrast and focus?
- Does the spacing still hold together when the viewport changes?

A screenshot records the current output; it does not prove every viewport is correct. I use it to compare structure and proportion, then inspect the relevant styles and components to find the cause.

## Keep fixes in the existing system

Most visual corrections should reuse the project's tokens, wrappers, and component patterns. A one-off margin can make a screenshot pass while creating a second spacing language.

I prefer the nearest established spacing variable, the existing wrapper class, and the component's current layout model. If a value really carries structural intent—such as an image width, a minimum width, or a text measure—it can stay local. The important part is knowing why it is local.

This also keeps content changes separate from layout changes. When content comes from a source file, update that source first and regenerate its mirrors. Do not patch generated output just because it is the file visible in the browser.

## Verify the failure mode you changed

After a fix, I check the original failure again instead of stopping at a green command. If the issue was mobile overflow, inspect the narrow view. If it was reversed technology ordering, inspect the rendered sequence. If it was cramped copy, compare line length and section rhythm at both target widths.

I am checking more than one acceptable screenshot. I want the implementation to express the intended structure and stay predictable when the content or viewport changes.

## Finished means rendered and explainable

Builds, lint, and type checks are useful guardrails. I still need to see the interface.

A finished frontend change has two kinds of evidence: the code passes its checks, and the browser shows the right boundary, hierarchy, wrapping, and containment. The browser check is usually faster than explaining why a technically correct page still feels wrong.
