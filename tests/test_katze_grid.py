"""Build regression fixtures with the site's Hugo version; no Python dependencies."""

import argparse
import base64
from html.parser import HTMLParser
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
import xml.etree.ElementTree as ET

HUGO = "hugo"


class Document(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.elements = []
        self.source = path.read_text(encoding="utf-8")
        self.feed(self.source)

    def handle_starttag(self, tag, attrs):
        self.elements.append((tag, dict(attrs)))

    def find(self, tag=None, **attrs):
        return [a for t, a in self.elements if (tag is None or tag == t)
                and all(a.get(k) == v for k, v in attrs.items())]


class ThemeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory(prefix="katze-grid-tests-")
        cls.addClassCleanup(cls.temp.cleanup)
        root = Path(cls.temp.name)
        cls.output = root / "public"
        themes = Path(__file__).resolve().parents[1] / "themes"
        (root / "hugo.toml").write_text(f'''
baseURL = "https://example.org/blog/"
title = "Fixture"
theme = "katze-grid"
themesDir = "{themes.as_posix()}"
defaultContentLanguage = "en"
[languages.en]
weight = 1
[languages.de]
weight = 2
[params]
mainSections = ["notes", "posts"]
showtoc = true
tocopen = true
ShowShareButtons = true
ShowPostNavLinks = true
ShowBreadCrumbs = true
ShowCodeCopyButtons = true
ShowReadingTime = true
ShowWordCount = true
hideSummary = true
disableScrollToTop = true
[params.cover]
hidden = true
hiddenInSingle = true
[outputs]
home = ["HTML", "RSS", "JSON"]
[services.rss]
limit = 2
[markup.goldmark.parser.attribute]
block = true
title = true
''', encoding="utf-8")

        def content(name, text):
            path = root / "content" / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(text, encoding="utf-8")

        content("notes/visible/index.md", '''---
title: Visible
date: 2026-01-03
lastmod: 2026-02-05
tags: [alpha]
tocopen: false
hideSummary: false
summary: Visible summary
cover:
  image: cover.png
  hidden: false
  hiddenInSingle: false
---
## A heading {#a-heading .custom-heading}
Body.
![Vector](shape.svg)
{{< figure src="shape.svg" alt="Figure vector" >}}
''')
        content("notes/visible/index.de.md", '''---
title: Sichtbar
date: 2026-01-03
lastmod: 2026-02-05
---
## Eine Überschrift
Inhalt.
''')
        content("posts/disabled.md", '''---
title: Disabled
date: 2026-01-02
lastmod: 2026-02-05
tags: [beta]
searchHidden: true
showtoc: false
hidemeta: true
ShowShareButtons: false
ShowPostNavLinks: false
ShowCodeCopyButtons: false
ShowHeadingLinks: false
---
## No link
Body.
''')
        content("posts/hidden/index.md", '''---
title: Hidden cover
date: 2026-01-01
lastmod: 2026-02-05
hiddenInRss: true
ShowLastMod: false
ShowCopyLink: false
cover:
  image: cover.svg
---
Body.
''')
        content("notes/asset.md", '''---
title: Asset
date: 2025-01-01
cover:
  image: covers/asset.svg
  hidden: false
  hiddenInSingle: false
---
Asset cover.
''')
        content("notes/external.md", '''---
title: External
date: 2024-01-01
cover:
  image: https://images.example.org/cover.png
  hidden: false
  hiddenInSingle: false
---
External cover.
''')
        content("notes/static.md", '''---
title: Static
date: 2023-01-01
cover:
  image: /blog/static-cover.svg
  hidden: false
  hiddenInSingle: false
---
Static cover.
''')
        content("search.md", "---\ntitle: Search\nlayout: search\n---\n")
        content("archives.md", "---\ntitle: Archives\nlayout: archives\n---\n")
        svg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20"/></svg>'
        content("notes/visible/shape.svg", svg)
        content("posts/hidden/cover.svg", svg)
        assets = root / "assets/covers"
        assets.mkdir(parents=True)
        (assets / "asset.svg").write_text(svg)
        static = root / "static"
        static.mkdir()
        (static / "static-cover.svg").write_text(svg)
        (root / "content/notes/visible/cover.png").write_bytes(base64.b64decode(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1sAAAAASUVORK5CYII="))
        subprocess.run([HUGO, "--source", str(root), "--panicOnWarning",
                        "--printI18nWarnings", "--ignoreCache", "--minify"], check=True)

    def page(self, path):
        return Document(self.output / path / "index.html")

    def feed_titles(self, path):
        return [item.text for item in ET.parse(self.output / path).findall("./channel/item/title")]

    def test_image_resources_and_visibility(self):
        visible = self.page("notes/visible")
        cover = visible.find("img", alt="Visible")[0]
        self.assertEqual(cover["src"], "https://example.org/blog/notes/visible/cover.png")
        self.assertEqual((cover["width"], cover["height"], cover["loading"]), ("1", "1", "eager"))
        for alt in ("Vector", "Figure vector"):
            image = visible.find("img", alt=alt)[0]
            self.assertEqual(image["src"], "/blog/notes/visible/shape.svg")
            self.assertNotIn("width", image)
        self.assertEqual(visible.find("meta", property="og:image")[0]["content"], cover["src"])
        self.assertEqual(visible.find("meta", name="twitter:image")[0]["content"], cover["src"])
        self.assertFalse(self.page("posts/hidden").find("img", alt="Hidden cover"))
        for slug, expected in (("asset", "https://example.org/blog/covers/asset.svg"),
                               ("external", "https://images.example.org/cover.png"),
                               ("static", "https://example.org/blog/static-cover.svg")):
            self.assertEqual(self.page("notes/" + slug).find("img")[0]["src"], expected)

    def test_feeds_and_search_exclusions(self):
        self.assertEqual(self.feed_titles("index.xml"), ["Visible", "Disabled"])
        self.assertEqual(self.feed_titles("tags/alpha/index.xml"), ["Visible"])
        self.assertEqual(self.feed_titles("tags/beta/index.xml"), ["Disabled"])
        self.assertEqual(self.feed_titles("posts/index.xml"), ["Disabled"])
        self.assertEqual(self.feed_titles("notes/index.xml"), ["Visible", "Asset"])
        titles = {p["title"] for p in json.loads((self.output / "index.json").read_text())}
        self.assertFalse(titles & {"Search", "Archives", "Disabled"})
        self.assertIn("Visible", titles)

    def test_page_overrides_and_article_sections(self):
        disabled = self.page("posts/disabled")
        for name in ("toc", "article-meta", "share-row", "heading-link"):
            self.assertFalse(disabled.find(**{"class": name}))
        self.assertFalse(disabled.find("nav", **{"class": "article-nav panel"}))
        self.assertFalse(disabled.find("script", **{"data-copy-enabled": "true"}))
        visible = self.page("notes/visible")
        self.assertTrue(visible.find(**{"class": "article-meta"}))
        self.assertTrue(visible.find(**{"class": "share-row"}))
        self.assertEqual(visible.find("meta", property="og:type")[0]["content"], "article")
        self.assertNotIn("open", visible.find("details", **{"class": "toc"})[0])
        self.assertIn("Visible summary", self.page("").source)
        self.assertTrue(self.page("").find("a", href="/blog/notes/"))

    def test_heading_links_updates_and_copy_link(self):
        visible = self.page("notes/visible")
        self.assertTrue(visible.find("h2", id="a-heading", **{"class": "custom-heading"}))
        self.assertEqual(visible.find("a", **{"class": "heading-link"})[0]["href"], "#a-heading")
        self.assertTrue(visible.find("time", datetime="2026-02-05"))
        self.assertFalse(self.page("posts/hidden").find("time", datetime="2026-02-05"))
        self.assertFalse(self.page("posts/hidden").find("button", **{"class": "copy-link"}))
        button = visible.find("button", **{"class": "copy-link"})[0]
        self.assertEqual(button["data-url"], "https://example.org/blog/notes/visible/")
        self.assertEqual(button["data-copy-label"], "Copy link")
        self.assertIn("hidden", button)
        german = self.page("de/notes/visible")
        self.assertIn("Aktualisiert", german.source)
        self.assertEqual(german.find("button", **{"class": "copy-link"})[0]["data-copy-label"], "Link kopieren")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--hugo", default="hugo")
    args, remaining = parser.parse_known_args()
    HUGO = args.hugo
    unittest.main(argv=[__file__, *remaining])
