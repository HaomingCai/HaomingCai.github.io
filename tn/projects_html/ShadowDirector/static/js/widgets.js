/* Shadow Director input widgets (2026-11-03): the light-direction dial and the strength wedge, drawn exactly like
 * the Selected-work card v6c (HomepageTeasers-src/shadowdirector/src/sd_card_v6.py, branch 'c', on the grid of
 * common/card_band.py). Units below are the card's 816-px stage pixels, so stroke widths and proportions match:
 *   dial   arc R 52 from 195° to 345° (clockwise from 3 o'clock, y down), 4 px rim at alpha 235, the dome under the
 *          arc filled at alpha 70; an outlined head (r 0.30 R, 3 px rim, fill 70) at the arc centre; the sun at
 *          270° + side·58° (side −1 … +1 = light from the left … right): glow r 0.30 R at alpha 60, core r 0.17 R
 *   wedge  104 × 8…64 px, flat bottom, top edge rising left → right, 4 px rim at 235, faint base fill 30, and a fill
 *          at alpha 110 growing from the left with strength
 *   track  (optional, as card_band.slider) 216 px line, 8 px thick: 80 unfilled / 235 filled, end dots r 6, knob r 17
 * Plain JS, no libraries. Colours come from CSS variables (widgets.css); dimming is the house 28 % rule.
 *
 *   const dial = LightDial(el, { value: 0.5, label: 'direction', track: true });
 *   dial.set(0.2); await dial.animateTo(1, 1500); dial.setActive(false);
 *   const wedge = StrengthWedge(el, { value: 0, label: 'strength' });
 */
(function (root) {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const R = 52;
  const reduced = () => !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const clamp = v => Math.min(1, Math.max(0, +v || 0));
  const ease = t => t * t * (3 - 2 * t);                 // the card's ease (smoothstep)

  function svg(viewBox, cls) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', viewBox);
    s.setAttribute('class', cls);
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('focusable', 'false');
    return s;
  }
  function node(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  const pt = (deg, r) => [r * Math.cos(deg * Math.PI / 180), r * Math.sin(deg * Math.PI / 180)];

  // Shared shell: wrapper, optional track, optional label, set / animateTo / setActive.
  function shell(el, opts, cls, drawIcon, update, aria) {
    const wrap = document.createElement('div');
    wrap.className = 'sdw ' + cls + (opts.track ? ' sdw--track' : '') + (opts.theme === 'light' ? ' sdw--light' : '');
    wrap.setAttribute('role', 'img');
    const icon = drawIcon();
    wrap.appendChild(icon.svg);
    let track = null;
    if (opts.track) {
      const t = svg('-20 -20 256 40', 'sdw__track');
      node('line', { x1: 0, y1: 0, x2: 216, y2: 0, class: 'sdw-track-bg' }, t);
      const fg = node('line', { x1: 0, y1: 0, x2: 0, y2: 0, class: 'sdw-track-fg' }, t);
      node('circle', { cx: 0, cy: 0, r: 6, class: 'sdw-track-end' }, t);
      node('circle', { cx: 216, cy: 0, r: 6, class: 'sdw-track-end' }, t);
      const knob = node('circle', { cx: 0, cy: 0, r: 17, class: 'sdw-knob' }, t);
      track = { fg, knob };
      wrap.appendChild(t);
    }
    if (opts.label) {
      const l = document.createElement('span');
      l.className = 'sdw__label';
      l.textContent = opts.label;
      wrap.appendChild(l);
    }
    el.appendChild(wrap);

    let value = clamp(opts.value), raf = 0, done = null;
    function paint(v) {
      update(icon, v);
      if (track) {
        const x = 216 * v;
        track.fg.setAttribute('x2', x.toFixed(2));
        track.knob.setAttribute('cx', x.toFixed(2));
      }
      wrap.setAttribute('aria-label', aria(v));
      wrap.dataset.value = v.toFixed(3);
    }
    paint(value);
    const api = {
      el: wrap,
      get value() { return value; },
      set(v) { cancelAnimationFrame(raf); if (done) { done(); done = null; } value = clamp(v); paint(value); return api; },
      animateTo(v, ms = 900) {
        const to = clamp(v), from = value;
        cancelAnimationFrame(raf);
        if (done) { done(); done = null; }
        if (reduced() || ms <= 0 || to === from) { value = to; paint(value); return Promise.resolve(api); }
        return new Promise(res => {
          done = () => res(api);
          const t0 = performance.now();
          const step = now => {
            const k = Math.min(1, (now - t0) / ms);
            value = from + (to - from) * ease(k);
            paint(value);
            if (k < 1) raf = requestAnimationFrame(step);
            else { const d = done; done = null; if (d) d(); }
          };
          raf = requestAnimationFrame(step);
        });
      },
      setActive(on) { wrap.classList.toggle('sdw--dim', !on); return api; },
    };
    if (opts.active === false) api.setActive(false);
    return api;
  }

  // Light-direction dial. value 0 = light from the left, 0.5 = front, 1 = from the right.
  function LightDial(el, opts = {}) {
    return shell(el, opts, 'sdw-dial', () => {
      const s = svg('-64 -72 128 92', 'sdw__icon');
      const [ax, ay] = pt(195, R), [bx, by] = pt(345, R);
      const arcD = `M ${ax.toFixed(2)} ${ay.toFixed(2)} A ${R} ${R} 0 0 1 ${bx.toFixed(2)} ${by.toFixed(2)}`;
      node('path', { d: arcD + ' Z', class: 'sdw-fill' }, s);                      // the dome under the arc
      node('path', { d: arcD, class: 'sdw-rim' }, s);
      node('circle', { cx: 0, cy: 0, r: 0.30 * R, class: 'sdw-head' }, s);          // the little head
      const glow = node('circle', { r: 0.30 * R, class: 'sdw-sun-glow' }, s);
      const core = node('circle', { r: 0.17 * R, class: 'sdw-sun' }, s);
      return { svg: s, glow, core };
    }, (icon, v) => {
      const [x, y] = pt(270 + (2 * v - 1) * 58, R);
      for (const c of [icon.glow, icon.core]) { c.setAttribute('cx', x.toFixed(2)); c.setAttribute('cy', y.toFixed(2)); }
    }, v => `Light direction: ${v < 0.34 ? 'from the left' : v > 0.66 ? 'from the right' : 'from the front'}`);
  }

  // Strength wedge. value 0 = weak (empty), 1 = strong (full).
  function StrengthWedge(el, opts = {}) {
    const W = 104, H0 = 8, H1 = 64;
    const top = x => H1 - (H0 + (H1 - H0) * x / W);                                // base at y = 64
    const poly = x => `0,${H1} ${x.toFixed(2)},${H1} ${x.toFixed(2)},${top(x).toFixed(2)} 0,${top(0)}`;
    return shell(el, opts, 'sdw-wedge', () => {
      const s = svg('-3 -3 110 70', 'sdw__icon');
      node('polygon', { points: poly(W), class: 'sdw-base' }, s);
      const fill = node('polygon', { points: poly(0), class: 'sdw-level' }, s);
      node('polygon', { points: poly(W), class: 'sdw-rim' }, s);
      return { svg: s, fill };
    }, (icon, v) => {
      icon.fill.setAttribute('points', poly(W * v));
      icon.fill.style.display = v > 0.005 ? '' : 'none';
    }, v => `Shadow strength: ${Math.round(v * 100)} %`);
  }

  root.LightDial = LightDial;
  root.StrengthWedge = StrengthWedge;
})(window);
