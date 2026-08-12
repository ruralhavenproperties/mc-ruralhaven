#!/usr/bin/env python3
"""Rebrand Mission Control pages to Rural Haven Properties brand.

Applies Claude's branding prompt to every .html file under public/:
  - inject favicon + brand.css links in <head>
  - prepend a .brand-header (logo) above the page's existing header/content
  - append a .brand-footer
  - add a palette override <style> that remaps dark theme colors to the
    cream/navy palette defined in brand.css (styling-only, no JS/behavior change)
"""
import os, re, glob

ROOT = "public"
LOGO = "/assets/logo-240.png"
FAVICON = "/assets/favicon-32.png"
CSS = "/assets/brand.css"

HEAD_INJECT = (
    f'<link rel="icon" type="image/png" href="{FAVICON}">\n'
    f'<link rel="stylesheet" href="{CSS}">\n'
)

BRAND_HEADER = (
    '<header class="brand-header">\n'
    f'<img class="brand-logo" src="{LOGO}" alt="Rural Haven Properties">\n'
    f'</header>\n'
)

BRAND_FOOTER = (
    '<footer class="brand-footer">\n'
    '&copy; Rural Haven Properties &mdash; Mission Control\n'
    '</footer>\n'
)

# Palette override injected into each page so inline dark themes read as the brand.
OVERRIDE_CSS = """
<style>
  :root {
    --brand-navy: #0b1f33;
    --brand-navy-700: #16314f;
    --brand-red: #8c1c1c;
    --brand-olive: #52551f;
    --brand-olive-600: #6b6f29;
    --brand-cream: #f8f8e8;
    --brand-cream-line: #e4e2d0;
    --brand-ink: #1c2420;
    --brand-muted: #5c6259;
  }
  body.branded, .branded body {
    background: var(--brand-cream) !important;
    color: var(--brand-ink) !important;
  }
  /* Neutralize the dark gradient/near-black backgrounds used by dashboard pages */
  body {
    background: var(--brand-cream) !important;
  }
  .container, .content, main, .card, .panel, .dashboard {
    background: transparent;
  }
</style>
"""

def process(path):
    with open(path, "r", encoding="utf-8") as f:
        html = f.read()
    orig = html

    # 1. Inject head links (favicon + brand.css) right before </head>
    if CSS not in html:
        html = html.replace("</head>", HEAD_INJECT + OVERRIDE_CSS + "</head>", 1)

    # 2. Prepend brand header right after <body ...>
    body_tag = re.search(r"<body[^>]*>", html)
    if body_tag and '<header class="brand-header">' not in html:
        html = html.replace(body_tag.group(0), body_tag.group(0) + "\n" + BRAND_HEADER, 1)
        html = html.replace("<body", '<body class="branded"', 1)

    # 3. Append brand footer right before </body>
    if '<footer class="brand-footer">' not in html:
        html = html.replace("</body>", BRAND_FOOTER + "</body>", 1)

    if html != orig:
        with open(path, "w", encoding="utf-8") as f:
            f.write(html)
        return True
    return False

changed = 0
for path in glob.glob(os.path.join(ROOT, "**", "*.html"), recursive=True):
    if process(path):
        print("branded:", path)
        changed += 1
print(f"\nDone. Branded {changed} file(s).")
