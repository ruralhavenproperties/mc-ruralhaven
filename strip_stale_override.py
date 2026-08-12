#!/usr/bin/env python3
"""Remove the stale inline brand override <style> blocks from MC pages.

The rebrand script injected a raw <style> block (with OLD palette --brand-navy:
#0b1f33 etc.) right before </head>. brand.css now carries the corrected,
logo-matched palette as a linked stylesheet (which loads after inline styles),
so these stale blocks only cause confusion/conflicts. Strip them.
"""
import glob, re

PATTERN = re.compile(
    r"<style>\s*:root\s*\{\s*--brand-navy[^<]*?</style>",
    re.DOTALL,
)

files = sorted(
    glob.glob("public/*.html")
    + glob.glob("public/*/index.html")
    + glob.glob("public/commodities/*.html")
)

removed = 0
for path in files:
    with open(path, encoding="utf-8") as f:
        html = f.read()
    new, n = PATTERN.subn("", html)
    if n:
        with open(path, "w", encoding="utf-8") as f:
            f.write(new)
        removed += n
        print(f"stripped {n} block(s): {path}")

print(f"\nDone. Removed {removed} stale override block(s) across {len(files)} files.")
