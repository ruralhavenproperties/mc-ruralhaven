/* contrast.js — Mission Control site rule:
   Text on colored backgrounds must be WHITE; on light colored backgrounds BLACK.
   Neutral backgrounds (white/gray/black) are left to the page design.
   Semantic accent colors (green/red/amber text) are kept as-is.
   Applied to every element with a solid colored background; re-applied on DOM changes. */
(function () {
  'use strict';

  function parse(str) {
    if (!str) return null;
    str = str.trim();
    if (str === 'transparent' || str === 'rgba(0, 0, 0, 0)') return { r: 0, g: 0, b: 0, a: 0 };
    var m = str.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    var p = m[1].split(',').map(function (s) { return parseFloat(s); });
    if (p.length < 3) return null;
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  }

  function blend(fg, bg) {
    var a = fg.a + bg.a * (1 - fg.a);
    if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
    return {
      r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a,
      g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a,
      b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a,
      a: a
    };
  }

  function lum(c) {
    function f(v) { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  }

  function chroma(c) {
    var mx = Math.max(c.r, c.g, c.b), mn = Math.min(c.r, c.g, c.b);
    return (mx - mn) / 255;
  }

  // Composite element background up the DOM until opaque; null if never solid
  // (e.g. gradient page backgrounds cannot be resolved -> leave to CSS).
  function effectiveBg(el) {
    var cur = el, acc = null;
    while (cur && cur.nodeType === 1) {
      var c = parse(getComputedStyle(cur).backgroundColor);
      if (c && c.a > 0.01) {
        acc = acc ? blend(c, acc) : c;
        if (acc.a >= 0.99) break;
      }
      if (cur === document.body) break;
      cur = cur.parentElement;
    }
    if (!acc || acc.a < 0.9) return null;
    return acc;
  }

  function apply() {
    var all = document.querySelectorAll('body *');
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      var tag = el.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'LINK' || tag === 'META' || tag === 'NOSCRIPT') continue;
      if (el.getAttribute('data-contrast') === 'skip') continue;

      var cs = getComputedStyle(el);

      // Gradient-clipped text: keep as designed.
      var tfc = cs.webkitTextFillColor || cs.textFillColor;
      var tfcP = parse(tfc);
      if (tfcP && tfcP.a < 0.5) continue;

      // Current text color.
      var tc = parse(cs.color);
      if (!tc) continue;
      // Saturated accent text (green/red/amber data colors) is intentional.
      if (chroma(tc) > 0.25) continue;

      var bg = effectiveBg(el);
      if (!bg) continue;
      // Neutral backgrounds (white / light gray / black) -> page design decides.
      if (chroma(bg) < 0.045) continue;

      var L = lum(bg);
      var wantWhite = L < 0.55;
      var tL = lum(tc);
      var ok = wantWhite ? tL >= 0.72 : tL <= 0.35;
      if (!ok) {
        el.style.setProperty('color', wantWhite ? '#ffffff' : '#000000', 'important');
      }
    }
  }

  function boot() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', apply);
    } else {
      apply();
    }
    var timer = null;
    new MutationObserver(function () {
      clearTimeout(timer);
      timer = setTimeout(apply, 120);
    }).observe(document.documentElement, {
      childList: true, subtree: true,
      attributes: true, attributeFilter: ['class', 'style']
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
