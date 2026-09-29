# Keeping Markdown source in charge

- Date: 2026-09-27
- Category: Frontend quality
- Excerpt: How I keep the Markdown document canonical while the editor, rendered preview, local recovery, and PDF export each do a separate job.

A Markdown editor has two views of one document: the text people edit and the formatted result they read. The tricky part is making those views useful without letting them drift into separate versions of the document.

In Another Markdown Viewer, the raw Markdown string stays canonical. The editor changes that string. The preview is derived from it. Recovery stores it. Saving downloads it. Printing formats its rendered form, but does not replace the source.

## Parse for display, not to rewrite the document

I use CodeMirror 6 for source editing and Marked to parse GitHub-Flavored Markdown. If a document starts with valid YAML frontmatter, I parse that metadata for a small table and pass the body to the Markdown renderer. The original frontmatter and body remain in the source string.

That distinction matters when a document contains spacing, metadata, or syntax the preview does not show in the same way. Rendering is a reading aid, not a reason to silently normalize the text a person wrote.

## Treat rendered HTML as untrusted

Markdown can include links, images, and raw HTML. Parsing turns it into HTML, but parsed HTML is not automatically safe to put in the page.

I run the result through DOMPurify and apply a URL policy to link and image destinations. Unsafe schemes become inert. The source stays available in the editor, while the preview only gets the sanitized result.

This creates a clear boundary: the Markdown is editable input; the preview is constrained output. That is easier to reason about than mixing content rendering with application controls or trusting every value that came from a document.

## Connect the preview back to its source

A preview is more useful when I can move from a rendered block back to the text that produced it. During rendering, I match top-level Markdown tokens to their source ranges and attach those offsets to the corresponding HTML blocks. Clicking a supported block in the preview selects its source range in CodeMirror.

The offsets are only a bridge between views. They do not become another document model, and they are recalculated from the current Markdown. Keeping that mapping narrow avoids a second representation that would need its own edits and synchronization rules.

## Keep recovery separate from saving

The app writes the latest working state to browser storage after a short debounce. That protects a draft if the tab closes, but it is not the same as saving a file. Explicit Markdown save still downloads a document the user can keep elsewhere.

That separation is small but important. A recovery record belongs to this browser; a downloaded file belongs to the user. The interface should not imply that one has done the work of the other.

## Let print have its own layout

PDF export uses the browser's print flow with a dedicated print stylesheet. The stylesheet presents the rendered document without the editor toolbar or split-pane layout. It can set page-friendly colors and spacing without changing the Markdown or the on-screen workspace.

There is no need to turn the document into a screenshot. The browser can print the real rendered text, which remains selectable and flows across pages.

## One source, several focused views

The editor, preview, recovery, file actions, and print view are easier to maintain when each has a clear responsibility. The Markdown string is the shared point between them; derived HTML, source offsets, storage data, and print styles each support one part of the workflow.

That is the technical choice I keep coming back to: preserve one editable source, then make every other view explainable as a transformation of it.
