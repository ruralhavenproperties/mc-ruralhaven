#!/usr/bin/env python3
"""Replace hardcoded dark-gray/slate/blue clash colors in MC pages with brand tokens.

These raw hex/rgba values come from the original dashboard templates and
conflict with the navy/red/olive/cream logo palette. Mapping (case-insensitive):
  #3b82f6  (blue primary)  -> #0A2463  (navy)
  #1d4ed8  (dark blue)     -> #071A4A  (navy-dark)
  #0f172a  (slate-900)     -> #0A2463  (navy)
  #020617  (near-black)    -> #0A2463  (navy)
  #94a3b8  (slate-400 txt) -> #5C6259  (ink-soft/muted)
  #64748b  (slate-500)     -> #5C6259
  #1e293b  (slate-800)     -> #0A2463
  #334155  (slate-700)     -> #1f3a76 (lighter navy for borders)
  #475569  (slate-600)     -> #1f3a76
  rgba(15,23,42,X)         -> rgba(10,36,99,X)
"""
import glob, re

MAPPING = [
    ("#3b82f6", "#0A2463"),
    ("#1d4ed8", "#071A4A"),
    ("#0f172a", "#0A2463"),
    ("#020617", "#0A2463"),
    ("#94a3b8", "#5C6259"),
    ("#64748b", "#5C6259"),
    ("#1e293b", "#0A2463"),
    ("#334155", "#1F3A76"),
    ("#475569", "#1F3A76"),
]

def repl_hex(m):
    # normalize lower-case
    return m.group(0)[:1].lower() + m.group(0)[1:]

files = sorted(
    glob.glob("/root/.openclaw/workspace/mc-ruralhaven/public/*.html")
    + glob.glob("/root/.openclaw/workspace/mc-ruralhaven/public/*/index.html")
    + glob.glob("/root/.openclaw/workspace/mc-ruralhaven/public/commodities/*.html")
)

total = 0
for path in files:
    s = open(path, encoding="utf-8").read()
    orig = s
    # replace hex colors case-insensitively
    for old, new in MAPPING:
        s = re.sub(re.escape(old), new, s, flags=re.IGNORECASE)
    # replace rgba(15,23,42,alpha)
    s = re.sub(r"rgba\(\s*15\s*,\s*23\s*,\s*42\s*,", "rgba(10, 36, 99,", s, flags=re.IGNORECASE)
    if s != orig:
        open(path, "w", encoding="utf-8").write(s)
        n = sum(len(re.findall(re.escape(o), s, re.I)) for o, _ in MAPPING)
        total += 1
        print("fixed:", path)

print(f"\nDone. Updated {total} file(s).")
