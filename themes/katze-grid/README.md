# Katze Grid

A dark Hugo blog theme. Requires Hugo 0.158.0 or later.

## Article sections

`params.mainSections` controls the homepage, archives, home feed, and which pages
receive article metadata, sharing, edit links, and post navigation. It defaults
to `["posts"]`. The homepage's “All posts” link targets the first configured
section. Set `params.allPostsURL` to override it, for example `"/archives/"` when
using multiple article sections. Menu URLs remain configured by the site.

## Page settings

These parameters can be set globally under `params` or overridden in front matter:
`showtoc`, `tocopen`, `hidemeta`, `hideSummary`, `ShowReadingTime`, `ShowWordCount`,
`ShowBreadCrumbs`, `ShowShareButtons`, `shareButtons`, `ShowPostNavLinks`,
`ShowCodeCopyButtons`, and `editPost`. Explicit `false` overrides a global `true`.

Three additional features are enabled by default:

- `ShowHeadingLinks`: adds a permalink beside Markdown headings, keeping the same
  heading IDs used by the table of contents.
- `ShowLastMod`: displays a localized updated date when `lastmod` is on a later
  calendar day than the publication date. It respects `hidemeta`. Set an accurate
  `lastmod` in front matter; the theme does not substitute the build date.
- `ShowCopyLink`: adds copy-link sharing when `ShowShareButtons` is enabled.
  Copying uses the page permalink and the browser clipboard API, with localized
  success/failure feedback. The button appears when JavaScript initializes.

Example front matter:

```yaml
title: Example article
date: 2026-01-01
lastmod: 2026-02-15
showtoc: true
ShowShareButtons: true
cover:
  image: cover.png
  alt: Description of the cover
  hidden: false
  hiddenInSingle: false
```

## Images, feeds, and search

Markdown images, figures, and cover metadata resolve page-bundle and asset
resources as well as static paths and external URLs. Raster resources receive
intrinsic dimensions; Markdown raster images wider than 1200 px are resized.
SVGs are preserved without attempting raster image operations. Covers load eagerly.

`cover.hidden` and `cover.hiddenInSingle` can be configured globally or overridden
per page. `hiddenInList` has no visible effect because grid rows do not show covers.

Home RSS includes article sections; section and term feeds include their own
pages. All respect `hiddenInRss` and `services.rss.limit`. Search excludes drafts,
pages with `searchHidden: true`, and search/archive layouts. Configure JSON home
output to enable search: `outputs.home = ["HTML", "RSS", "JSON"]`.

## Regression checks

From the repository root, run `python tests/test_katze_grid.py --hugo /path/to/hugo`.
The checks build isolated multilingual fixtures and do not alter site content.
