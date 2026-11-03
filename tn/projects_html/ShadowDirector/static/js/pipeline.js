/* Shadow Director v5 — the method as three hand-coded SVG chapters.
 *
 *   1. Training               one frozen UNet, two readout heads trained separately: the SD Estimator (L1 against the
 *                             shadow / depth pair) and the ID Estimator (triplet loss). Sec. 3.1, Fig. 4 / Sec. 3.2,
 *                             App. Fig. 12, App. S2.1, App. S3.2
 *   2. User input             a text prompt, a light direction, a shadow strength → a portrait. Sec. 3.1, App. S3.3, App. S6;
 *                             the dial and wedge are the homepage Selected-work card widgets (static/js/widgets.js);
 *                             the faces are real outputs (paper Fig. 1 and Fig. 5)
 *   3. Inference · guidance   normal denoising → a detour at one selected step (targets set once, then a loop of
 *                             frozen forward pass → loss → Adam step on z_t, as many laps as the strength asks) → back to
 *                             the same step → normal denoising. Sec. 3.1 "Enable Shadow Control", Fig. 2, Fig. 3b,
 *                             Sec. 4.5, App. S3.3. The identity colour drift and the ŝ → s* blend are schematic.
 *
 * Pictures are the paper's own images. Fig. 2's visual language is kept: green latent, peach UNet, purple SD Estimator,
 * yellow ID Estimator, a snowflake on frozen parts and a flame on what is being trained or updated.
 *
 * STAGES is the timeline. render(t) is a pure function of t; play / pause / step / scrub all go through it.
 * Two layouts: wide (≥ 640 px) and tall (phones). prefers-reduced-motion: no autoplay, no moving dots, and
 * stepping shows each stage's finished state.
 */
(function () {
  const root = document.getElementById('pipe');
  if (!root) return;
  const NS = 'http://www.w3.org/2000/svg';
  const IMG = './static/images/pipe/';
  const ATLAS = './static/images/shadow_atlas.jpg';   // 7 real outputs, light from front to right (420 px tiles)
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const svg = root.querySelector('.pipe-svg');
  const capEl = root.querySelector('.pipe-cap');
  const eqEl = root.querySelector('.pipe-eq');
  const countEl = root.querySelector('.pipe-count');
  const playBtn = root.querySelector('[data-play]');
  const range = root.querySelector('.pipe-range');
  const tabs = [...root.querySelectorAll('[data-tab]')];
  const stepsEl = root.querySelector('.pipe-steps');

  const CHAPTERS = { train: 'Training', you: 'User input', in: 'Inference · guidance' };
  const EQ_SD = 'L<sub>SD</sub> = L<sub>1</sub>(S<sub>pred</sub>, S<sub>gt</sub>) + L<sub>1</sub>(D<sub>pred</sub>, D<sub>gt</sub>)';
  const EQ_STEP = 'z<sub>t</sub> ← Adam step using ∇<sub>z<sub>t</sub></sub>L<sub>total</sub> &nbsp;(no network weights change)';
  const EQ_TOTAL = 'L<sub>total</sub> = λ<sub>shadow</sub>·L<sub>1</sub>(S<sub>current</sub>, S<sub>target</sub>) + λ<sub>identity</sub>·L<sub>sim</sub>(I<sub>current</sub>, I<sub>ref</sub>)';

  // ---------------------------------------------------------------- timeline
  const STAGES = [
    // 1 · Training: one frozen UNet, two readout heads, trained separately
    //     (Sec. 3.1 "Training of Shadow Director", Fig. 4 / Sec. 3.2, App. Fig. 12, App. S2.1, App. S3.2)
    { scene: 'train', key: 'data', name: 'Cheap data', dur: 4600,
      cap: 'Training data is cheap synthetic relighting: a relit image paired with its shadow and depth maps, and identity triplets.',
      on: ['pair', 'pairring', 'tri'], flow: [] },
    { scene: 'train', key: 'unet', name: 'Frozen UNet', dur: 4000,
      cap: 'Each relit image (and each triplet image) is noised and run through the same frozen UNet, and its intermediate features are fetched. The shadow and depth maps are not inputs; they are the ground truth.',
      on: ['pair', 'tri', 'e_noise', 'latent', 'e_lu', 'unet', 'fetch', 'feat'], flow: ['e_noise', 'e_lu', 'fetch'] },
    { scene: 'train', key: 'sd', name: 'Head 1 · SD', dur: 4600,
      cap: 'Readout head 1, the SD Estimator, predicts shadow and depth from those features. L1 losses against the pair train it.',
      eq: EQ_SD, on: ['pair', 'pairring', 'unet', 'feat', 'e_fs', 'sd', 'e_sp', 'pred', 'gtc', 'l1'], flow: ['e_fs', 'e_sp'] },
    { scene: 'train', key: 'id', name: 'Head 2 · ID', dur: 5000,
      cap: 'Readout head 2, the ID Estimator, embeds the triplet. A triplet loss pulls person B’s two lightings together and pushes the random other person away.',
      on: ['tri', 'unet', 'feat', 'e_fi', 'id', 'e_ip', 'space', 'dots', 'pull', 'push'], flow: ['e_fi', 'e_ip'] },
    { scene: 'train', key: 'both', name: 'Same features', dur: 4600,
      cap: 'Both heads read the same frozen features and are trained separately. The UNet itself never changes.',
      on: ['pair', 'pairring', 'tri', 'e_noise', 'latent', 'e_lu', 'unet', 'fetch', 'feat', 'e_fs', 'e_fi', 'sd', 'id', 'e_sp', 'e_ip', 'pred', 'gtc', 'l1', 'space', 'dots', 'pull', 'push'],
      flow: ['e_fs', 'e_fi'] },
    // 2 · User input (Sec. 3.1 "Enable Shadow Control", App. S3.3 user controls, App. S6 prompt template)
    { scene: 'you', key: 'in', name: 'Your inputs', dur: 4600,
      cap: 'You give three things: a text prompt, a light direction and a shadow strength. There is no input photo.',
      on: ['prompt', 'light', 'strength', 'nophoto', 'e_in', 'box', 'e_out', 'out'], flow: ['e_in', 'e_out'] },
    { scene: 'you', key: 'dir', name: 'Light direction', dur: 5600,
      cap: 'Swing the light from left to right: the shadow follows and the person stays the same (real outputs, paper Fig. 1).',
      on: ['prompt', 'light', 'strength', 'nophoto', 'e_in', 'box', 'e_out', 'out'], flow: ['e_in', 'e_out'] },
    { scene: 'you', key: 'str', name: 'Strength', dur: 5200,
      cap: 'Turn up the strength and the shadow deepens (real outputs for another prompt, paper Fig. 1).',
      on: ['prompt', 'light', 'strength', 'nophoto', 'e_in', 'box', 'e_out', 'out'], flow: ['e_in', 'e_out'] },
    // 3 · Inference · guidance (Sec. 3.1 "Enable Shadow Control", Fig. 2, Fig. 3b, Sec. 4.5, App. S3.3)
    //     normal denoising → detour at one step (targets once, then the loop; strength = number of Adam iterations) → back → normal denoising
    { scene: 'in', key: 'tl', name: 'Denoise to the step', dur: 4400,
      cap: 'Normal denoising runs from noise T to one selected early-to-middle step. There it branches off into a guided-optimization loop.',
      on: ['steps', 'prompt', 'e_pu', 'latent', 'e_lu', 'unet'], flow: ['e_pu', 'e_lu'] },
    { scene: 'in', key: 'once', name: 'Targets, once', dur: 5600,
      cap: 'Once, at that step: the SD Estimator’s depth d̂ plus your light direction gives the target shadow s* (ray casting), and the ID Estimator stores a reference identity.',
      on: ['steps', 'latent', 'unet', 'fetch', 'feat', 'e_fs', 'e_fi', 'sd', 'id', 'e_sd', 'depth', 'rc', 'target', 'e_iref', 'ref'],
      flow: ['fetch', 'e_fs', 'e_fi', 'e_sd', 'e_iref'] },
    { scene: 'in', key: 'fwd', name: 'Read ŝ', dur: 4400, loop: true,
      cap: 'Loop, forward: z_t goes through the frozen UNet. The SD Estimator reads the current shadow ŝ, and the ID Estimator the current identity (still identical to the reference).',
      on: ['steps', 'latent', 'e_lu', 'unet', 'fetch', 'feat', 'e_fs', 'e_fi', 'sd', 'id', 'e_ss', 'shadow', 'target', 'e_icur', 'cur', 'ref', 'grad'],
      flow: ['e_lu', 'fetch', 'e_fs', 'e_fi', 'e_ss', 'e_icur'] },
    { scene: 'in', key: 'loss', name: 'Loss', dur: 4200, loop: true,
      cap: 'The loss compares ŝ with s* (L1) and the current identity with the reference (cosine similarity).',
      eq: EQ_TOTAL, on: ['steps', 'latent', 'grad', 'shadow', 'target', 'l1', 'cur', 'ref', 'cos', 'lossbox', 'e_l1', 'e_cos'], flow: ['e_l1', 'e_cos'] },
    { scene: 'in', key: 'back', name: 'Adam step on z_t', dur: 5600, loop: true,
      cap: 'Loop, update: one Adam step on the loss changes only z_t (🔥); every network stays frozen (❄). Moving the shadow nudges the identity off the reference (schematic colour).',
      eq: EQ_STEP, on: ['steps', 'lossbox', 'grad', 'latent', 'unet', 'feat', 'sd', 'id', 'cur', 'ref', 'notes'], flow: ['grad'] },
    { scene: 'in', key: 'iter', name: 'Repeat', dur: 8000, loop: true,
      cap: 'Repeat the loop. ŝ moves toward s*, and the identity term pulls the drifting identity back to the reference. Your strength sets the number of Adam iterations.',
      on: ['steps', 'latent', 'e_lu', 'unet', 'fetch', 'feat', 'e_fs', 'e_fi', 'sd', 'id', 'e_ss', 'shadow', 'target', 'l1',
           'e_icur', 'cur', 'ref', 'cos', 'lossbox', 'e_l1', 'e_cos', 'grad', 'strength'],
      flowFn: (n, p) => { const ph = (p * ITERS) % 1; return n === 'grad' ? ph >= .55 : ph < .55; } },
    { scene: 'in', key: 'out', name: 'Back, then to 0', dur: 4800,
      cap: 'The loop returns to the same step, and normal denoising continues from the updated z_t to 0: the portrait clears step by step and ends with your shadow (noise shown for illustration).',
      on: ['steps', 'prompt', 'e_pu', 'latent', 'e_lu', 'unet', 'e_out', 'out'], flow: ['e_lu', 'e_out'] },
  ];
  const N = STAGES.length;
  const ITERS = 5;   // updates drawn in 'Repeat' (schematic; the paper sets the count from the strength)
  const starts = [];
  let TOTAL = 0;
  for (const s of STAGES) { starts.push(TOTAL); TOTAL += s.dur; }
  const firstOf = sc => STAGES.findIndex(s => s.scene === sc);

  const clamp = x => Math.max(0, Math.min(1, x));
  const ramp = (p, a, b) => clamp((p - a) / (b - a));
  const ease = x => .5 - .5 * Math.cos(Math.PI * clamp(x));
  const lerp = (a, b, q) => a + (b - a) * q;

  // ---------------------------------------------------------------- SVG helpers
  let uid = 0, defs, AR, ARR, ARG, ARO, NOISE, BLUR, IMN;
  function el(tag, a, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in a) e.setAttribute(k, a[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function txt(parent, s, x, y, cls = 'lbl', anchor = 'middle') {
    const e = el('text', { x, y, class: cls, 'text-anchor': anchor }, parent);
    e.textContent = s;
    return e;
  }
  function txtSub(parent, base, sub, x, y, cls = 'lbl', anchor = 'middle', after = '') {
    const e = el('text', { x, y, class: cls, 'text-anchor': anchor }, parent);
    e.appendChild(document.createTextNode(base));
    const t = el('tspan', { 'baseline-shift': 'sub', 'font-size': '75%' }, e); t.textContent = sub;
    if (after) { const a = el('tspan', { 'baseline-shift': 'baseline' }, e); a.textContent = after; }
    return e;
  }
  function pic(parent, file, x, y, s, frameCls = 'frame') {
    const g = el('g', { transform: `translate(${x} ${y})` }, parent);
    const id = 'pc' + (++uid);
    el('rect', { x: 0, y: 0, width: s, height: s, rx: 4 }, el('clipPath', { id }, defs));
    g.img = el('image', { href: file.startsWith('.') ? file : IMG + file, x: 0, y: 0, width: s, height: s,
                          preserveAspectRatio: 'xMidYMid slice', 'clip-path': `url(#${id})` }, g);
    el('rect', { x: .5, y: .5, width: s - 1, height: s - 1, rx: 4, class: frameCls }, g);
    return g;
  }
  // one tile of the 7-frame atlas, cross-faded between neighbours
  function atlas(parent, x, y, s) {
    const g = el('g', {}, parent);
    const id = 'pc' + (++uid);
    el('rect', { x, y, width: s, height: s, rx: 6 }, el('clipPath', { id }, defs));
    const clip = el('g', { 'clip-path': `url(#${id})` }, g);
    const layers = [0, 1].map(() => {
      const v = el('svg', { x, y, width: s, height: s, viewBox: '0 0 420 420' }, clip);
      el('image', { href: ATLAS, x: 0, y: 0, width: 2940, height: 420 }, v);
      return v;
    });
    el('rect', { x: x + .5, y: y + .5, width: s - 1, height: s - 1, rx: 6, class: 'frame' }, g);
    g.set = fv => {
      const i0 = Math.min(5, Math.floor(fv)), a = clamp(fv - i0);
      layers[0].setAttribute('viewBox', `${i0 * 420} 0 420 420`);
      layers[1].setAttribute('viewBox', `${(i0 + 1) * 420} 0 420 420`);
      layers[1].setAttribute('opacity', a.toFixed(3));
    };
    return g;
  }
  function edge(parent, d, cls = 'edge', arrow = true, start = false) {
    const a = { d, class: cls };
    const m = cls.includes('loss') || cls.includes('push') ? ARR : cls.includes('pull') ? ARG : AR;
    if (arrow) a['marker-end'] = `url(#${m})`;
    if (start) a['marker-start'] = `url(#${m})`;
    return el('path', a, parent);
  }
  function unet(parent, x, y, w, h, bw) {
    const gap = (w - 5 * bw) / 4, tops = [];
    [1, .78, .5, .78, 1].forEach((f, i) => {
      const bh = h * f, bx = x + i * (bw + gap), by = y + (h - bh) / 2;
      el('rect', { x: bx, y: by, width: bw, height: bh, rx: Math.min(7, bw / 2.6), class: 'unet-bar' }, parent);
      tops.push([bx + bw / 2, by, by + bh]);
    });
    return tops;
  }
  function sdEst(parent, x, y, bw, gap, h) {
    el('rect', { x, y, width: bw, height: h, rx: 4, class: 'sd-bar' }, parent);
    el('rect', { x: x + bw + gap, y, width: bw, height: h, rx: 4, class: 'sd-bar' }, parent);
    el('rect', { x: x + 2 * (bw + gap), y, width: bw, height: h * .44, rx: 4, class: 'sd-bar' }, parent);
    el('rect', { x: x + 2 * (bw + gap), y: y + h * .56, width: bw, height: h * .44, rx: 4, class: 'sd-bar' }, parent);
  }
  function idEst(parent, x, y, bw, gap, h) {
    for (let i = 0; i < 3; i++) el('rect', { x: x + i * (bw + gap), y, width: bw, height: h, rx: 4, class: 'id-bar' }, parent);
  }
  function feats(parent, x, y, s, off) {
    ['#f28b82', '#f6d86a', '#9cc3f2', '#a9e4dc'].forEach((c, i) => {
      const gx = x + (3 - i) * off, gy = y + i * off;
      el('rect', { x: gx, y: gy, width: s, height: s, rx: 2, fill: c, class: 'fmap' }, parent);
      for (const f of [1 / 3, 2 / 3]) {
        el('line', { x1: gx + s * f, y1: gy, x2: gx + s * f, y2: gy + s, class: 'fgrid' }, parent);
        el('line', { x1: gx, y1: gy + s * f, x2: gx + s, y2: gy + s * f, class: 'fgrid' }, parent);
      }
    });
  }
  function emb(parent, x, y, s, fill) {
    const c = s / 3;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++)
      el('rect', { x: x + i * c, y: y + j * c, width: c, height: c, fill, class: 'emb' }, parent);
  }
  function snow(parent, cx, cy, r) {
    const g = el('g', { class: 'snow' }, parent);
    for (const a of [0, 60, 120]) {
      const dx = r * Math.cos(a * Math.PI / 180), dy = r * Math.sin(a * Math.PI / 180);
      el('line', { x1: cx - dx, y1: cy - dy, x2: cx + dx, y2: cy + dy }, g);
    }
    return g;
  }
  function flame(parent, cx, cy, s, visible = false) {
    const g = el('g', { class: 'flame', opacity: visible ? 1 : 0 }, parent);
    const inner = el('g', {}, g);
    el('path', { d: 'M0,-1 C.5,-.45 .75,.05 .52,.5 C.36,.86 -.36,.86 -.52,.5 C-.74,.04 -.24,-.28 0,-1 Z', fill: '#f0642c' }, inner);
    el('path', { d: 'M0,-.35 C.25,-.05 .36,.22 .24,.48 C.14,.66 -.14,.66 -.24,.48 C-.34,.24 -.12,.02 0,-.35 Z', fill: '#ffd23f' }, inner);
    g.base = `translate(${cx} ${cy}) scale(${s / 2})`;
    inner.setAttribute('transform', g.base);
    g.inner = inner;
    return g;
  }
  function pulse(f, t, on, beat) {
    f.setAttribute('opacity', on ? 1 : 0);
    f.inner.setAttribute('transform', f.base + (on && beat && !reduce ? ` scale(${1 + .12 * Math.sin(t / 150)})` : ''));
  }
  function star(cx, cy, r) {
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r;
      pts.push((cx + rr * Math.cos(a)).toFixed(1) + ',' + (cy + rr * Math.sin(a)).toFixed(1));
    }
    return pts.join(' ');
  }
  function lightGlyph(parent, x, y, s) {            // Fig. 2 / 3b "Position of Directional Light": a dome and a sun
    el('rect', { x: x + .5, y: y + .5, width: s - 1, height: s - 1, rx: 4, class: 'chip' }, parent);
    el('path', { d: `M${x + s * .2},${y + s * .72} A${s * .3},${s * .3} 0 0 1 ${x + s * .8},${y + s * .72}`, class: 'glyph' }, parent);
    el('ellipse', { cx: x + s * .5, cy: y + s * .72, rx: s * .3, ry: s * .08, class: 'glyph' }, parent);
    el('line', { x1: x + s * .3, y1: y + s * .32, x2: x + s * .48, y2: y + s * .58, class: 'glyph' }, parent);
    el('circle', { cx: x + s * .25, cy: y + s * .25, r: s * .11, fill: '#ffd23f', stroke: '#d9a400' }, parent);
  }
  // black box: the light position on the face plane (front = centre, right = right edge, at face level)
  function lightPad(parent, x, y, s) {
    el('rect', { x: x + .5, y: y + .5, width: s - 1, height: s - 1, rx: 8, class: 'chip' }, parent);
    el('ellipse', { cx: x + s / 2, cy: y + s / 2, rx: s * .2, ry: s * .26, class: 'glyph faint' }, parent);
    el('line', { x1: x + s * .08, y1: y + s / 2, x2: x + s * .92, y2: y + s / 2, class: 'glyph faint' }, parent);
    txt(parent, 'front', x + s / 2, y + 11, 'lbl-xs');
    txt(parent, 'right', x + s - 5, y + s - 6, 'lbl-xs', 'end');
    const sun = el('g', {}, parent);
    el('circle', { cx: 0, cy: 0, r: s * .085, fill: '#ffd23f', stroke: '#d9a400', 'stroke-width': 1.5 }, sun);
    return { sun, set: u => sun.setAttribute('transform', `translate(${(x + s / 2 + u * s * .4).toFixed(1)} ${(y + s / 2).toFixed(1)})`) };
  }

  let scenes = {};
  function newScene(name) {
    const g = el('g', { class: 'scene' }, svg);
    return (scenes[name] = { name, g, parts: {}, flows: [], edges: {} });
  }
  function part(S, name, kind) {
    const g = el('g', { class: 'pp', 'data-kind': kind }, S.g);
    S.parts[name] = g;
    return g;
  }
  function flow(S, name, path, red) {
    const g = el('g', { class: 'flow' + (red ? ' red' : '') }, path.parentNode);
    const dots = [0, 1, 2].map(() => el('circle', { r: 3.2, class: 'dot', opacity: 0 }, g));
    S.flows.push({ name, path, dots, len: path.getTotalLength() });
    return path;
  }
  const flowEdge = (S, g, name, d, cls) => flow(S, name, edge(g, d, cls), cls && cls.includes('loss'));

  // ================================================================ 1 · Training (one frozen UNet, two readout heads)
  function buildTrain(W) {
    const S = newScene('train');
    const skel = ['pair', 'tri', 'e_noise', 'latent', 'e_lu', 'unet', 'fetch', 'feat', 'e_fs', 'e_fi', 'sd', 'id', 'e_ip', 'space'];
    const P = n => part(S, n, skel.includes(n) ? 'skel' : 'content');
    let g;

    // training pair (Fig. 4): relit image + its shadow + its depth
    g = P('pair');
    const ps = W ? 50 : 44, px = W ? [16, 72, 128] : [16, 64, 112], py = W ? 42 : 22;
    txt(g, 'Training pair', 16, W ? 20 : 14, 'lbl', 'start');
    if (W) txt(g, 'low-quality relit image + its shadow + its depth', 16, 34, 'lbl-xs', 'start');
    ['pair2_relit.jpg', 'pair2_shadow.jpg', 'pair2_depth.jpg'].forEach((f, i) => pic(g, f, px[i], py, ps));
    ['relit', 'shadow', 'depth'].forEach((h, i) => txt(g, h, px[i] + ps / 2, py + ps + 13, 'lbl-xs'));
    g = P('pairring');   // the pair's shadow + depth are only the L1 ground truth (orange, like "from the pair")
    el('rect', { x: px[1] - 5, y: py - 4, width: px[2] + ps - px[1] + 10, height: ps + 8, rx: 8, class: 'ring' }, g);
    if (W) txt(g, '= ground truth for L1', px[1] + (px[2] + ps - px[1]) / 2, py + ps + 28, 'lbl-xs pair-t');

    // identity triplet (Sec. 3.1, App. Fig. 12): B in its original lighting, B relit, a random other identity
    g = P('tri');
    const ts = W ? 50 : 46, tx = W ? [16, 72, 128] : [190, 242, 294], ty = W ? 258 : 22;
    txt(g, 'Identity triplet', tx[0], W ? 250 : 14, 'lbl', 'start');
    [['tri_anchor.jpg', 'anchor', 'ink'], ['tri_positive.jpg', 'positive', 'pos'], ['tri_negative.jpg', 'negative', 'neg']].forEach(([f, r, c], i) => {
      pic(g, f, tx[i], ty, ts, 'frame thick ' + c);
      txt(g, r, tx[i] + ts / 2, ty + ts + 13, 'lbl-xs ' + c + '-t');
    });
    if (W) txt(g, 'B in its original light · B relit · a random other person', 16, 340, 'lbl-xs', 'start');

    // every image: + noise → noisy latent
    g = P('e_noise');
    if (W) {
      flowEdge(S, g, 'e_noise', 'M41,111 C41,150 190,146 212,162');
      flowEdge(S, g, 'e_noise', 'M180,283 C200,283 200,220 212,220');
      txt(g, '+ noise', 196, 194, 'lbl-s', 'end');
    } else {
      edge(g, 'M38,84 V96 M265,88 V96 M265,96 H26', 'edge', false);
      flowEdge(S, g, 'e_noise', 'M26,96 V120');
      txt(g, '+ noise', 31, 107, 'lbl-s', 'start');
    }
    g = P('latent');
    const L = W ? [214, 140, 24, 100] : [16, 122, 20, 80];
    el('rect', { x: L[0], y: L[1], width: L[2], height: L[3], rx: 5, class: 'latent' }, g);
    S.noise = el('rect', { x: L[0] + 2, y: L[1] + 2, width: L[2] - 4, height: L[3] - 4, filter: `url(#${NOISE})`, opacity: 0 }, g);
    txt(g, W ? 'noisy latent' : 'latent', L[0] + L[2] / 2, W ? L[1] - 8 : L[1] + L[3] + 16, 'lbl-s');
    g = P('e_lu');
    flowEdge(S, g, 'e_lu', W ? 'M240,190 H258' : 'M36,162 H46');

    // the frozen UNet and its multi-scale feature fetch (App. S2.1)
    g = P('unet');
    const U = W ? [260, 110, 150, 150, 20] : [48, 112, 150, 100, 18];
    const tops = unet(g, ...U);
    snow(g, U[0] + U[2] + 10, U[1] + 5, W ? 9 : 8);
    txt(g, 'UNet', W ? 335 : 208, W ? 280 : 190, 'lbl', W ? 'middle' : 'start');
    g = P('fetch');
    const busY = W ? 96 : 104, fx = W ? 462 : 264, fTop = W ? 142 : 142;
    for (const i of [1, 2, 3]) edge(g, `M${tops[i][0]},${tops[i][1]} V${busY}`, 'edge', false);
    flowEdge(S, g, 'fetch', `M${tops[1][0]},${busY} H${fx} V${fTop - 2}`);
    if (W) txt(g, 'features', (tops[3][0] + fx) / 2, busY - 7, 'lbl-s');
    g = P('feat');
    if (W) feats(g, 440, 142, 30, 6); else { feats(g, 242, 142, 26, 5); txt(g, 'features', 290, 136, 'lbl-s', 'start'); }

    // head 1: SD Estimator → shadow + depth, L1 against the pair
    g = P('e_fs');
    flowEdge(S, g, 'e_fs', W ? 'M490,156 C506,156 506,96 522,96' : 'M262,186 C262,226 52,214 52,244');
    g = P('sd');
    if (W) sdEst(g, 524, 60, 12, 7, 74); else sdEst(g, 30, 246, 11, 5, 56);
    txt(g, 'SD Estimator', W ? 549 : 52, W ? 152 : 318, 'lbl');
    S.sdFlame = flame(g, W ? 549 : 20, W ? 46 : 252, W ? 18 : 13, true);
    g = P('e_sp');
    (W ? ['M576,76 C590,76 590,67 602,67', 'M576,118 C590,118 590,121 602,121'] : ['M75,258 C84,258 84,260 94,260', 'M75,290 C84,290 84,306 94,306'])
      .forEach(d => flowEdge(S, g, 'e_sp', d));
    g = P('pred');
    const pp = W ? [604, 42, 96, 50] : [96, 240, 286, 40];
    S.pred = [pic(g, 'pair2_shadow.jpg', pp[0], pp[1], pp[3]), pic(g, 'pair2_depth.jpg', pp[0], pp[2], pp[3])];
    S.pred.forEach(q => q.img.setAttribute('filter', `url(#${BLUR})`));
    txt(g, 'predicted', pp[0] + pp[3] / 2, W ? 162 : 340, 'lbl-s');
    g = P('gtc');
    const gp = W ? [730, 42, 96, 50] : [190, 240, 286, 40];
    pic(g, 'pair2_shadow.jpg', gp[0], gp[1], gp[3], 'frame pairframe'); pic(g, 'pair2_depth.jpg', gp[0], gp[2], gp[3], 'frame pairframe');
    txt(g, 'from the pair', gp[0] + gp[3] / 2, W ? 162 : 340, 'lbl-s pair-t');   // = the pair's shadow and depth
    g = P('l1');
    S.l1 = (W ? ['M656,67 H728', 'M656,121 H728'] : ['M138,260 H188', 'M138,306 H188']).map(d => edge(g, d, 'edge loss', false));
    txt(g, 'L1', W ? 692 : 163, W ? 98 : 288, 'lbl loss-t');

    // head 2: ID Estimator → identity embeddings, triplet loss
    g = P('e_fi');
    flowEdge(S, g, 'e_fi', W ? 'M490,176 C506,176 506,300 522,300' : 'M285,170 C330,170 330,226 292,244');
    g = P('id');
    if (W) idEst(g, 524, 262, 12, 7, 64); else idEst(g, 270, 246, 11, 5, 56);
    txt(g, 'ID Estimator', W ? 549 : 292, W ? 344 : 318, 'lbl');
    S.idFlame = flame(g, W ? 549 : 324, W ? 248 : 252, W ? 18 : 13, true);
    g = P('e_ip');
    flowEdge(S, g, 'e_ip', W ? 'M576,294 H600' : 'M292,328 V352');
    g = P('space');
    const SP = W ? [602, 196, 340, 220] : [16, 354, 328, 160];
    el('rect', { x: SP[0], y: SP[1], width: SP[2], height: SP[3], rx: 12, class: 'plotbg' }, g);
    txt(g, 'ID embeddings', SP[0] + 12, SP[1] + 20, 'lbl', 'start');
    S.lossT = txt(g, 'triplet loss', SP[0] + 12, SP[1] + SP[3] - 10, 'lbl loss-t', 'start');
    const D = W ? { A: [710, 318], Pp: [790, 262], Nn: [880, 372], ts: 34 } : { A: [118, 446], Pp: [190, 404], Nn: [292, 486], ts: 28 };
    g = P('dots');
    const thumb = (f, [x, y], dx, dy, c) => pic(g, f, x + dx, y + dy, D.ts, 'frame thick ' + c);
    thumb('tri_anchor.jpg', D.A, -D.ts - 12, -D.ts / 2, 'ink');
    thumb('tri_positive.jpg', D.Pp, 12, -D.ts - 6, 'pos');
    thumb('tri_negative.jpg', D.Nn, 12, -D.ts / 2, 'neg');
    for (const [pt, c] of [[D.A, 'ink'], [D.Pp, 'pos'], [D.Nn, 'neg']]) el('circle', { cx: pt[0], cy: pt[1], r: 7, class: 'pt ' + c }, g);
    const towards = (a, b, gap) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); return [b[0] - dx / l * gap, b[1] - dy / l * gap]; };
    g = P('pull');
    const mid = [(D.A[0] + D.Pp[0]) / 2, (D.A[1] + D.Pp[1]) / 2];
    for (const end of [D.A, D.Pp]) {
      const s0 = towards(mid, end, 11), s1 = towards(end, mid, 5);
      edge(g, `M${s0[0].toFixed(1)},${s0[1].toFixed(1)} L${s1[0].toFixed(1)},${s1[1].toFixed(1)}`, 'pull');
    }
    txt(g, 'pull together', mid[0] - (W ? 34 : 12), mid[1] - (W ? 14 : 16), 'lbl-s pos-t');
    g = P('push');
    const a0 = towards(D.Nn, D.A, 12), b0 = towards(D.A, D.Nn, 12);
    edge(g, `M${a0[0].toFixed(1)},${a0[1].toFixed(1)} L${b0[0].toFixed(1)},${b0[1].toFixed(1)}`, 'push', true, true);
    const mN = [(D.A[0] + D.Nn[0]) / 2, (D.A[1] + D.Nn[1]) / 2];
    txt(g, 'push apart', mN[0] - (W ? 40 : 30), mN[1] + (W ? 22 : 12), 'lbl-s neg-t');

    S.update = (key, p, t) => {
      S.parts.pair.setAttribute('opacity', key === 'data' ? ramp(p, 0, .3) : 1);
      S.parts.tri.setAttribute('opacity', key === 'data' ? ramp(p, .3, .6) : 1);
      S.noise.setAttribute('opacity', key === 'data' ? 0 : key === 'unet' ? .9 * ramp(p, .05, .4) : .9);
      S.pred.forEach(q => q.setAttribute('opacity', key === 'sd' ? ramp(p, .3, .6) : 1));
      const blur = key === 'sd' ? 3.2 - 2.8 * ease(ramp(p, .45, .95)) : .4;   // schematic: the readout sharpens as head 1 learns
      document.getElementById(BLUR).firstChild.setAttribute('stdDeviation', blur.toFixed(2));
      pulse(S.sdFlame, t, true, key === 'sd');
      pulse(S.idFlame, t, true, key === 'id');
      S.l1.forEach(e => { e.style.strokeDashoffset = key === 'sd' && !reduce ? String(-(t / 40) % 18) : '0'; });
      S.parts.dots.setAttribute('opacity', key === 'id' ? ramp(p, .2, .45) : 1);
      S.parts.pull.setAttribute('opacity', key === 'id' ? ramp(p, .45, .65) : 1);
      S.parts.push.setAttribute('opacity', key === 'id' ? ramp(p, .6, .8) : 1);
      S.lossT.setAttribute('opacity', key === 'id' ? ramp(p, .75, .9) : key === 'both' ? 1 : 0);
    };
    return S;
  }

  // ================================================================ 2 · User input
  // The two controls are the homepage Selected-work card widgets (static/js/widgets.js, card v6c grammar: outline icon,
  // track with knob, label), drawn at card weights by scaling the card's own units by k. Their <svg> nodes are moved
  // into this SVG as nested <svg>, so .set() keeps working and nothing relies on foreignObject.
  // Fallback (widgets.js missing): simple drawn shapes.
  function dialWidget(parent, cx, cy, r) {
    const g = el('g', { class: 'dial' }, parent);
    el('path', { d: `M${cx - r},${cy} A${r},${r} 0 0 1 ${cx + r},${cy}`, class: 'dial-arc' }, g);
    el('circle', { cx, cy, r: r * .2, class: 'dial-face' }, g);
    const sun = el('circle', { cx, cy: cy - r, r: r * .17, class: 'dial-sun' }, g);
    return { set: u => { const th = Math.PI - u * Math.PI; sun.setAttribute('cx', (cx + r * Math.cos(th)).toFixed(1)); sun.setAttribute('cy', (cy - r * Math.sin(th)).toFixed(1)); } };
  }
  function wedgeWidget(parent, x, y, w, h) {
    const g = el('g', { class: 'wedge' }, parent);
    const id = 'wd' + (++uid);
    el('polygon', { points: `${x},${y + h} ${x + w},${y + h} ${x + w},${y}` }, el('clipPath', { id }, defs));
    el('polygon', { points: `${x},${y + h} ${x + w},${y + h} ${x + w},${y}`, class: 'wedge-bg' }, g);
    const fill = el('rect', { x, y, width: 0, height: h, class: 'wedge-fill', 'clip-path': `url(#${id})` }, g);
    el('polygon', { points: `${x},${y + h} ${x + w},${y + h} ${x + w},${y}`, class: 'wedge-line' }, g);
    return { set: v => fill.setAttribute('width', (w * clamp(v)).toFixed(1)) };
  }
  // icon at (ix, iy), track at (tx, ty), both scaled by k; returns { set } and the track's line ends (for end labels)
  function cardControl(parent, kind, ix, iy, tx, ty, k) {
    const make = kind === 'dial' ? window.LightDial : window.StrengthWedge;
    const ends = [tx + 20 * k, tx + 236 * k], lineY = ty + 20 * k;
    if (!make) {
      const w = kind === 'dial' ? dialWidget(parent, ix + 64 * k, iy + 72 * k, 52 * k) : wedgeWidget(parent, ix, iy, 104 * k, 64 * k);
      return { set: w.set, ends, lineY };
    }
    const g = el('g', { class: 'sdw sdw--light ctl' }, parent);
    const api = make(document.createElement('div'), { theme: 'light', track: true, value: kind === 'dial' ? 0 : .5 });
    const [icon, track] = api.el.querySelectorAll('svg');
    for (const [s, x, y] of [[icon, ix, iy], [track, tx, ty]]) {
      const vb = s.getAttribute('viewBox').trim().split(/\s+/).map(Number);
      s.removeAttribute('class');
      s.setAttribute('x', x); s.setAttribute('y', y);
      s.setAttribute('width', (vb[2] * k).toFixed(1)); s.setAttribute('height', (vb[3] * k).toFixed(1));
      s.setAttribute('overflow', 'visible');
      g.appendChild(s);
    }
    return { set: v => api.set(v), ends, lineY };
  }

  function buildYou(W) {
    const S = newScene('you');
    const P = n => part(S, n, 'skel');
    let g;
    g = P('prompt');   // the paper's prompt template (App. S6.1)
    const PC = W ? [20, 20, 330, 100] : [16, 8, 328, 80];
    el('rect', { x: PC[0], y: PC[1], width: PC[2], height: PC[3], rx: 10, class: 'card' }, g);
    txt(g, 'text prompt', PC[0] + 14, PC[1] + (W ? 22 : 20), 'lbl', 'start');
    ['A [style] close-up portrait of a [age] [gender]', 'with [ethnicity] and [face shape] features.', 'Wearing [simple clothing].']
      .forEach((l, i) => txt(g, l, PC[0] + 14, PC[1] + (W ? 44 : 38) + i * (W ? 16 : 14), 'tpl', 'start'));

    // light direction: dial icon + track (0 = from the left, 1 = from the right)
    g = P('light');
    const LC = W ? [20, 130, 330, 124] : [16, 96, 160, 126];
    el('rect', { x: LC[0], y: LC[1], width: LC[2], height: LC[3], rx: 10, class: 'card' }, g);
    txt(g, 'light direction', LC[0] + 14, LC[1] + 22, 'lbl', 'start');
    S.dial = W ? cardControl(g, 'dial', 40, 168, 118, 183, .5) : cardControl(g, 'dial', 28, 126, 24, 176, .42);
    txt(g, 'direction', W ? 258 : 92, W ? 198 : 152, W ? 'lbl' : 'lbl-s', 'start');
    txt(g, 'left', S.dial.ends[0], S.dial.lineY + (W ? 26 : 20), 'lbl-xs'); txt(g, 'right', S.dial.ends[1], S.dial.lineY + (W ? 26 : 20), 'lbl-xs');
    if (W) txt(g, 'where the light comes from (a 3D light position)', 40, 244, 'lbl-xs', 'start');

    // shadow strength: wedge icon + track (0 = weak, 1 = strong)
    g = P('strength');
    const SC = W ? [20, 262, 330, 112] : [184, 96, 160, 126];
    el('rect', { x: SC[0], y: SC[1], width: SC[2], height: SC[3], rx: 10, class: 'card' }, g);
    txt(g, 'shadow strength', SC[0] + 14, SC[1] + 22, 'lbl', 'start');
    S.wedge = W ? cardControl(g, 'wedge', 44, 302, 118, 309, .5) : cardControl(g, 'wedge', 198, 132, 192, 176, .42);
    txt(g, 'strength', W ? 258 : 252, W ? 324 : 152, W ? 'lbl' : 'lbl-s', 'start');
    txt(g, 'weak', S.wedge.ends[0], S.wedge.lineY + (W ? 26 : 20), 'lbl-xs'); txt(g, 'strong', S.wedge.ends[1], S.wedge.lineY + (W ? 26 : 20), 'lbl-xs');
    if (W) txt(g, 'how strong the shadow is', 40, 366, 'lbl-xs', 'start');

    g = P('nophoto');
    const NP = W ? [20, 386, 150, 26] : [16, 306, 100, 20];
    el('rect', { x: NP[0], y: NP[1], width: NP[2], height: NP[3], rx: NP[3] / 2, class: 'chip dashed' }, g);
    txt(g, 'no input photo', NP[0] + NP[2] / 2, NP[1] + NP[3] / 2 + 4, 'lbl-s');

    g = P('e_in');
    (W ? ['M352,70 C384,70 374,180 398,180', 'M352,192 C376,192 376,210 398,210', 'M352,318 C384,318 374,240 398,240']
       : ['M180,88 V232', 'M96,222 C96,230 130,226 130,232', 'M264,222 C264,230 230,226 230,232'])
      .forEach(d => flowEdge(S, g, 'e_in', d));

    // the model, opened up a little: frozen Stable Diffusion UNet + the two small Shadow Director estimators
    g = P('box');
    const BX = W ? [400, 150, 190, 120] : [70, 232, 220, 68];
    el('rect', { x: BX[0], y: BX[1], width: BX[2], height: BX[3], rx: 12, class: 'sdbox' }, g);
    txt(g, 'Stable Diffusion (frozen)', BX[0] + BX[2] / 2, BX[1] + (W ? 20 : 15), 'lbl-s', 'middle');
    txt(g, '+ Shadow Director', BX[0] + BX[2] / 2, BX[1] + (W ? 35 : 28), 'lbl-s', 'middle');
    if (W) {
      unet(g, 414, 198, 66, 48, 10); snow(g, 488, 200, 6);
      sdEst(g, 510, 202, 7, 4, 40); idEst(g, 550, 202, 7, 4, 40);
      txt(g, 'UNet', 447, 262, 'lbl-xs'); txt(g, 'SD', 524, 258, 'lbl-xs'); txt(g, 'ID', 564, 258, 'lbl-xs');
    } else {
      unet(g, 96, 266, 54, 28, 8); snow(g, 158, 268, 5);
      sdEst(g, 176, 268, 6, 3, 24); idEst(g, 214, 268, 6, 3, 24);
    }
    g = P('e_out');
    flowEdge(S, g, 'e_out', W ? 'M592,210 H620' : 'M180,300 V330');

    // output: ONE image that crossfades in sync with the control, as in the homepage teaser (real outputs, paper Fig. 1)
    g = P('out');
    const OP = W ? [624, 34, 296] : [105, 334, 150];
    const F = './static/images/faces/';
    S.dirFaces = ['longhair_left', 'longhair_right'].map(f => pic(g, F + f + '.jpg', ...OP));
    S.strFaces = ['strength_weak', 'strength_strong'].map(f => pic(g, F + f + '.jpg', ...OP));
    S.state = txt(g, '', OP[0] + OP[2] / 2, W ? OP[1] + OP[2] + 20 : 498, W ? 'lbl-s' : 'lbl-xs');
    txt(g, 'your generated portrait with the desired lighting', W ? OP[0] + OP[2] / 2 : 180, W ? OP[1] + OP[2] + 40 : 512, W ? 'lbl' : 'lbl-s');
    S.outSub = W ? txt(g, '', OP[0] + OP[2] / 2, OP[1] + OP[2] + 56, 'lbl-xs') : null;

    S.update = (key, p) => {
      const fin = (a, b) => (key === 'in' ? ramp(p, a, b) : 1);
      for (const [n, a, b] of [['prompt', 0, .2], ['light', .15, .35], ['strength', .3, .5], ['nophoto', .45, .6]])
        S.parts[n].setAttribute('opacity', fin(a, b));
      S.parts.out.setAttribute('opacity', key === 'in' ? ramp(p, .65, .85) : 1);
      const strMode = key === 'str';
      const u = key === 'dir' ? ease(ramp(p, .15, .7)) : strMode ? 1 : 0;       // left → right, and it stays right
      const v = strMode ? .15 + .85 * ease(ramp(p, .15, .7)) : .5;               // weak → strong
      S.dial.set(u); S.wedge.set(v);
      const sv = strMode ? ease(ramp(p, .15, .7)) : 0;                            // 0 = weak … 1 = strong
      S.dirFaces[0].setAttribute('opacity', strMode ? 0 : 1);
      S.dirFaces[1].setAttribute('opacity', strMode ? 0 : u.toFixed(3));
      S.strFaces[0].setAttribute('opacity', strMode ? 1 : 0);
      S.strFaces[1].setAttribute('opacity', strMode ? sv.toFixed(3) : 0);
      S.state.textContent = strMode ? (sv > .5 ? 'strong shadow' : 'weak shadow') : (u > .5 ? 'light from the right' : 'light from the left');
      if (S.outSub) S.outSub.textContent = strMode ? 'real outputs for another prompt · paper Fig. 1' : 'real outputs · paper Fig. 1';
    };
    return S;
  }

  // ================================================================ 3 · Inference · guidance
  function buildIn(W) {
    const S = newScene('in');
    const skel = ['steps', 'latent', 'e_lu', 'unet', 'fetch', 'feat', 'e_fs', 'e_fi', 'sd', 'id'];
    const P = n => part(S, n, skel.includes(n) ? 'skel' : 'content');
    let g;

    // (a) the denoising run T → 0 with the detour: at the guided step the playhead leaves the track for a side loop
    //     (one lap = one Adam step on z_t; the strength sets how many, App. S3.3) and rejoins the track at the same step.
    g = P('steps');
    const sx0 = W ? 170 : 16, sx1 = W ? 940 : 344, sy = W ? 46 : 44, sh = W ? 8 : 6, span = sx1 - sx0;
    const sel = 10 / 24, mx = sx0 + sel * span, ty = sy + sh / 2, RX = W ? 30 : 22, RY = W ? 16 : 12, cyL = ty - RY;
    el('rect', { x: sx0, y: sy, width: span, height: sh, rx: sh / 2, class: 'track' }, g);
    S.prog = el('rect', { x: sx0, y: sy, width: 0, height: sh, rx: sh / 2, class: 'prog' }, g);
    const a0 = (90 - 20) * Math.PI / 180, a1 = (90 + 20) * Math.PI / 180;
    S.loop = el('path', { d: `M${(mx + RX * Math.cos(a0)).toFixed(1)},${(cyL + RY * Math.sin(a0)).toFixed(1)} A${RX},${RY} 0 1 0 ${(mx + RX * Math.cos(a1)).toFixed(1)},${(cyL + RY * Math.sin(a1)).toFixed(1)}`,
                          class: 'loopring', 'marker-end': `url(#${ARO})` }, g);
    S.lap = txt(g, '', mx, cyL + 4, W ? 'lbl-s sel-t' : 'lbl-xs sel-t');
    txt(g, 'guided step', mx - RX - 8, cyL + 4, W ? 'lbl-s sel-t' : 'lbl-xs sel-t', 'end');
    txt(g, W ? 'guided loop · N Adam steps (N set by strength)' : 'guided loop · N Adam steps', mx + RX + 8, cyL + 4, W ? 'lbl-s sel-t' : 'lbl-xs sel-t', 'start');
    if (W) { txt(g, 'T · noise', sx0 - 12, sy + 8, 'lbl-s', 'end'); txt(g, '0 · image', sx1, sy - 8, 'lbl-s', 'end'); }
    else { txt(g, 'T', sx0, sy - 6, 'lbl-xs', 'start'); txt(g, '0', sx1, sy - 6, 'lbl-xs', 'end'); }
    S.head = el('circle', { cx: sx0, cy: ty, r: W ? 6 : 5, class: 'head' }, g);
    S.steps = { sx0, span, sel, mx, ty, RX, RY, cyL };

    // latent z_t (Fig. 2: green, with the fire symbol while it is optimized)
    g = P('latent');
    const L = W ? [40, 150, 28, 110] : [16, 78, 22, 88];
    el('rect', { x: L[0], y: L[1], width: L[2], height: L[3], rx: 5, class: 'latent' }, g);
    S.noise = el('rect', { x: L[0] + 2, y: L[1] + 2, width: L[2] - 4, height: L[3] - 4, filter: `url(#${NOISE})`, opacity: .9 }, g);
    S.latRing = el('rect', { x: L[0] - 4, y: L[1] - 4, width: L[2] + 8, height: L[3] + 8, rx: 8, class: 'ring red', opacity: 0 }, g);
    txtSub(g, 'z', 't', L[0] + L[2] / 2, L[1] + L[3] + 18, 'lbl');
    S.fire = flame(g, L[0] + L[2] / 2, L[1] - 16, W ? 20 : 15);

    g = P('e_lu');
    flowEdge(S, g, 'e_lu', W ? 'M68,205 H104' : 'M38,122 H50');

    // frozen UNet with the multi-scale feature fetch (App. S2.1)
    g = P('unet');
    const U = W ? [106, 120, 170, 150, 22] : [52, 62, 150, 112, 20];
    const tops = unet(g, ...U);
    snow(g, U[0] + U[2] + 10, U[1] + 5, W ? 9 : 7);
    txt(g, 'UNet', W ? 191 : 206, W ? 292 : 150, 'lbl', W ? 'middle' : 'start');

    if (W) {
      g = P('prompt');
      el('rect', { x: 20, y: 302, width: 110, height: 26, rx: 13, class: 'chip' }, g);
      txt(g, 'text prompt', 75, 319, 'lbl-s');
      g = P('e_pu');
      flowEdge(S, g, 'e_pu', 'M130,315 C154,315 154,292 154,258');
    }

    g = P('fetch');
    const busY = W ? 96 : 54, fx = W ? 318 : 270, fTop = W ? 130 : 92;
    for (const i of [1, 2, 3]) edge(g, `M${tops[i][0]},${tops[i][1]} V${busY}`, 'edge', false);
    S.edges.fetch = [flowEdge(S, g, 'fetch', `M${tops[1][0]},${busY} H${fx} V${fTop - 2}`)];
    if (W) txt(g, 'features', (tops[3][0] + fx) / 2, busY - 7, 'lbl-s');

    g = P('feat');
    if (W) feats(g, 290, 130, 34, 7); else { feats(g, 246, 92, 28, 6); txt(g, 'features', 298, 102, 'lbl-s', 'start'); }

    g = P('e_fs');
    S.edges.e_fs = [flowEdge(S, g, 'e_fs', W ? 'M347,150 C366,150 368,128 388,128' : 'M270,140 V214')];
    g = P('e_fi');
    S.edges.e_fi = [flowEdge(S, g, 'e_fi', W ? 'M347,172 C368,172 368,300 388,300' : 'M294,112 H340 V356 H296')];

    g = P('sd');
    if (W) sdEst(g, 390, 92, 13, 8, 74); else sdEst(g, 248, 216, 11, 5, 56);
    txt(g, 'SD Estimator', W ? 418 : 270, W ? 184 : 288, 'lbl');
    snow(g, W ? 453 : 300, W ? 96 : 220, 7);
    g = P('id');
    if (W) idEst(g, 390, 268, 13, 8, 64); else idEst(g, 248, 330, 11, 5, 52);
    txt(g, 'ID Estimator', W ? 418 : 270, W ? 350 : 396, 'lbl');
    snow(g, W ? 453 : 300, W ? 272 : 334, 7);

    // current shadow ŝ from the shadow branch (Fig. 2 "Est. Shadow"); in 'Repeat' it moves toward s* (schematic blend)
    g = P('shadow');
    const SS = W ? [486, 76, 70] : [154, 196, 66];
    S.shBase = pic(g, 'f2_est_shadow.png', ...SS);
    S.shOver = pic(g, 'f2_target.png', ...SS);
    txt(g, 'current ŝ', SS[0] + SS[2] / 2, SS[1] - 8, 'lbl-s');
    g = P('e_ss');
    S.edges.e_ss = [flowEdge(S, g, 'e_ss', W ? 'M447,108 C466,108 466,111 484,111' : 'M248,228 H222')];

    // depth branch, read once (App. S3.3: "we first generate the depth map")
    g = P('depth');
    if (W) {
      S.depthPic = pic(g, 'f2_est_depth.png', 486, 176, 50);
      txt(g, 'depth d̂', 511, 241, 'lbl-s');
    } else S.depthPic = el('g', {}, g);
    g = P('e_sd');
    S.edges.e_sd = [flowEdge(S, g, 'e_sd', W ? 'M447,150 C466,150 466,201 484,201' : 'M248,262 H230 V392 H108 V401')];

    // target shadow s* (Fig. 2 "User-defined Target Shadow" = Fig. 3b's ray-cast result, pixel-identical)
    g = P('target');
    const TS = W ? [600, 76, 70] : [40, 196, 66];
    S.targetPic = pic(g, 'f2_target.png', ...TS);
    txt(g, 'target s*', TS[0] + TS[2] / 2, TS[1] - 8, 'lbl-s');

    // ray casting (Fig. 3b): estimated depth + your light direction → s*
    g = P('rc');
    if (W) {
      el('rect', { x: 595, y: 189, width: 80, height: 24, rx: 12, class: 'chip strong' }, g);
      txt(g, 'ray casting', 635, 205, 'lbl-s');
      edge(g, 'M538,201 H593');
      lightGlyph(g, 690, 181, 40);
      txt(g, 'your light', 710, 236, 'lbl-s');
      edge(g, 'M688,201 H677');
      edge(g, 'M635,189 V150');
    } else {
      lightGlyph(g, 24, 404, 44); txt(g, 'your light', 46, 462, 'lbl-s');
      txt(g, '+', 77, 431, 'lbl');
      pic(g, 'f2_est_depth.png', 86, 404, 44); txt(g, 'depth d̂', 108, 462, 'lbl-s');
      edge(g, 'M132,426 H144');
      el('rect', { x: 146, y: 414, width: 92, height: 24, rx: 12, class: 'chip strong' }, g);
      txt(g, 'ray casting', 192, 430, 'lbl-s');
      edge(g, 'M240,426 H252');
      pic(g, 'f3b_target.png', 254, 402, 48);
    }

    // L1 between ŝ and s*
    g = P('l1');
    edge(g, W ? 'M558,111 H598' : 'M152,229 H108', 'edge loss', false);
    txt(g, 'L1', W ? 578 : 130, W ? 104 : 222, 'lbl loss-t');

    // identity: current embedding vs the reference stored once (Fig. 2; L_sim = cosine similarity)
    g = P('cur');
    const CU = W ? [488, 286, 30] : [176, 342, 28];
    S.curCells = [];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++)
      S.curCells.push(el('rect', { x: CU[0] + i * CU[2] / 3, y: CU[1] + j * CU[2] / 3, width: CU[2] / 3, height: CU[2] / 3, fill: 'hsl(49 86% 75%)', class: 'emb' }, g));
    txt(g, 'ID', CU[0] + CU[2] / 2, W ? CU[1] + CU[2] + 15 : CU[1] - 6, 'lbl-s');
    S.driftLbl = el('g', { opacity: 0 }, g);
    if (W) { txt(S.driftLbl, 'drifts, pulled back', CU[0] - 6, CU[1] + CU[2] + 29, 'lbl-xs', 'start'); txt(S.driftLbl, '(schematic colour)', CU[0] - 6, CU[1] + CU[2] + 41, 'lbl-xs', 'start'); }
    else txt(S.driftLbl, 'drift (schematic)', CU[0] + CU[2] / 2, CU[1] + CU[2] + 13, 'lbl-xs');
    g = P('e_icur');
    flowEdge(S, g, 'e_icur', W ? 'M447,300 H486' : 'M248,356 H206');
    g = P('ref');
    const RF = W ? [600, 286, 30] : [60, 342, 28];
    S.refEmb = el('g', {}, g);
    emb(S.refEmb, ...RF, 'hsl(49 86% 75%)');
    txt(g, 'reference', RF[0] + RF[2] / 2, W ? RF[1] + RF[2] + 15 : RF[1] - 6, 'lbl-s');
    g = P('e_iref');
    flowEdge(S, g, 'e_iref', W ? 'M447,288 C500,262 570,262 612,284' : 'M248,372 C200,372 130,372 90,360', 'edge dash');
    g = P('cos');
    edge(g, W ? 'M520,301 H598' : 'M174,356 H90', 'edge loss', false);
    txt(g, 'cos sim', W ? 559 : 132, W ? 294 : 350, 'lbl-s loss-t');

    // the loss (Sec. 3.1: L_total = λ_shadow·L1(S_current, S_target) + λ_identity·L_sim(I_current, I_ref))
    g = P('lossbox');
    const LB = W ? [730, 76, 200, 82] : [16, 410, 230, 52];
    el('rect', { x: LB[0], y: LB[1], width: LB[2], height: LB[3], rx: 10, class: 'lossbox' }, g);
    txt(g, 'loss', LB[0] + 12, LB[1] + 20, 'lbl loss-t', 'start');
    if (W) txt(g, 'L1(ŝ, s*) + identity term', LB[0] + 12, LB[1] + 40, 'lbl-s', 'start');
    S.counter = txt(g, '', LB[0] + LB[2] - 12, LB[1] + 20, 'lbl-s', 'end');
    const bx = LB[0] + 12, bw = LB[2] - 24, by = LB[1] + LB[3] - 20;
    el('rect', { x: bx, y: by, width: bw, height: 8, rx: 4, class: 'track' }, g);
    S.bar = el('rect', { x: bx, y: by, width: bw, height: 8, rx: 4, class: 'lossfill' }, g);
    S.barW = bw;
    g = P('e_l1');
    flowEdge(S, g, 'e_l1', W ? 'M672,111 H728' : 'M50,262 C30,300 24,340 24,408', 'edge loss');
    g = P('e_cos');
    flowEdge(S, g, 'e_cos', W ? 'M632,301 C700,301 702,166 728,156' : 'M74,370 V408', 'edge loss');

    // the latent is what the loop optimizes: a small label under z_t (the 🔥 above it flickers while the loop runs)
    g = P('grad');
    if (W) txt(g, 'optimized by Adam', L[0] + L[2] / 2, L[1] + L[3] + 34, 'lbl-xs loss-t');   // phones: the 🔥 alone (no room)

    g = P('notes');
    if (W) {
      el('rect', { x: 40, y: 402, width: 200, height: 24, rx: 12, class: 'chip' }, g);
      txt(g, '❄ every network stays frozen', 140, 418, 'lbl-s');
      el('rect', { x: 250, y: 402, width: 230, height: 24, rx: 12, class: 'chip' }, g);
      txt(g, 's* is a loss target, not an input', 365, 418, 'lbl-s');
    } else {
      el('rect', { x: 16, y: 488, width: 328, height: 24, rx: 12, class: 'chip' }, g);
      txt(g, '❄ networks frozen · s* is a target, not an input', 180, 504, 'lbl-s');
    }

    // App. S3.3: strength sets the number of optimization iterations (0 keeps the current shadow)
    g = P('strength');
    const SP = W ? [640, 402, 300, 24] : [16, 488, 328, 24];
    el('rect', { x: SP[0], y: SP[1], width: SP[2], height: SP[3], rx: 12, class: 'chip strong' }, g);
    txt(g, 'your strength → how many updates (0 = none)', SP[0] + SP[2] / 2, SP[1] + 16, 'lbl-s');

    // denoising resumes → output (Fig. 2 "Conditional Output")
    g = P('e_out');
    flowEdge(S, g, 'e_out', W ? 'M287,250 C302,250 302,382 330,382 H936 V286 H910' : 'M127,174 V400');
    g = P('out');   // a clear example output (paper Fig. 1, long-haired man, light from the right; 564² crop, shown smaller)
    const OP = W ? [776, 222, 130] : [82, 404, 90];
    S.outPic = pic(g, './static/images/faces/longhair_right.jpg', ...OP);
    // noise layer over the portrait, clipped to it; its strength follows the denoising progress (illustrative)
    S.outNoise = el('rect', { x: 0, y: 0, width: OP[2], height: OP[2], filter: `url(#${IMN})`,
                              'clip-path': S.outPic.img.getAttribute('clip-path'), opacity: 0 }, S.outPic);
    if (W) {
      txt(g, 'your generated portrait', 841, 194, 'lbl'); txt(g, 'with the desired lighting', 841, 210, 'lbl');
      txt(g, 'example output · paper Fig. 1', 841, 368, 'lbl-xs');
    } else {
      txt(g, 'your generated portrait', 182, 436, 'lbl-s', 'start'); txt(g, 'with the desired lighting', 182, 451, 'lbl-s', 'start');
      txt(g, 'example output · paper Fig. 1', 182, 470, 'lbl-xs', 'start');
    }

    // identity drift (schematic): cell hues leave the reference yellow after an update and are pulled back as the iterations go on
    const REF = [49, 86, 75], DRIFT_H = [112, 140, 166, 96, 150, 124, 172, 104, 136];
    const hsl = (h, s, l) => `hsl(${h.toFixed(0)} ${s.toFixed(0)}% ${l.toFixed(0)}%)`;
    const setDrift = d => S.curCells.forEach((c, i) => c.setAttribute('fill', hsl(lerp(REF[0], DRIFT_H[i], d), lerp(REF[1], 52, d), lerp(REF[2], 74, d))));
    const DRIFT = [0, .9, .68, .46, .28, .14, .05];   // after 0..6 updates
    const TOTAL_UPDATES = ITERS + 1;                   // one in 'Adam step on z_t', ITERS more in 'Repeat'

    S.update = (key, p, t) => {
      const T = S.steps;
      const onLoop = u => { const th = Math.PI / 2 - 2 * Math.PI * u; return [T.mx + T.RX * Math.cos(th), T.cyL + T.RY * Math.sin(th)]; };
      let prog = T.sel, hx = T.mx, hy = T.ty;
      if (key === 'tl') { prog = T.sel * ease(ramp(p, .05, .85)); hx = T.sx0 + prog * T.span; }
      else if (key === 'out') { prog = T.sel + (1 - T.sel) * ease(ramp(p, .2, .9)); hx = T.sx0 + prog * T.span; }
      else if (key !== 'once') {
        const u = key === 'fwd' ? .4 * ramp(p, .05, .95) : key === 'loss' ? .4 + .2 * ramp(p, .05, .95)
                : key === 'back' ? .6 + .4 * ramp(p, .05, .95) : (p * ITERS) % 1;
        [hx, hy] = onLoop(u);
      }
      S.prog.setAttribute('width', (prog * T.span).toFixed(1));
      S.head.setAttribute('cx', hx.toFixed(1)); S.head.setAttribute('cy', hy.toFixed(1));
      const inLoop = ['fwd', 'loss', 'back', 'iter'].includes(key);
      S.loop.classList.toggle('active', inLoop);

      S.noise.setAttribute('opacity', key === 'out' ? .9 * (1 - ramp(p, .25, .85)) : .9);
      // 🔥 on z_t: visible for the whole loop, a gentle flicker (scale and brightness), static under reduced motion
      const loopOn = ['fwd', 'loss', 'back', 'iter'].includes(key);
      S.fire.setAttribute('opacity', loopOn ? (reduce ? 1 : (.78 + .22 * Math.sin(t / 95) * Math.sin(t / 233)).toFixed(3)) : 0);
      S.fire.inner.setAttribute('transform', S.fire.base + (loopOn && !reduce ? ` scale(${(1 + .08 * Math.sin(t / 140)).toFixed(3)})` : ''));
      const rin = (a, b) => (key === 'once' ? ramp(p, a, b) : 1);
      S.depthPic.setAttribute('opacity', rin(.15, .35));
      S.refEmb.setAttribute('opacity', rin(.15, .35));
      S.parts.rc.setAttribute('opacity', key === 'once' ? ramp(p, .35, .55) : 1);
      S.targetPic.setAttribute('opacity', key === 'once' ? ramp(p, .6, .8) : 1);
      for (const k of ['fetch', 'e_fs', 'e_fi', 'e_sd']) S.edges[k].forEach(e => e.classList.toggle('dash', key === 'once'));

      // updates done so far (schematic): ŝ blends toward s*, the loss bar shrinks, the identity drifts and recovers
      const ip = p * ITERS, ph = key === 'iter' ? ip % 1 : key === 'back' ? ramp(p, .55, 1) : 0;
      let done = 0, dr = 0;
      if (key === 'back') { done = ph >= .9 ? 1 : 0; dr = DRIFT[1] * ramp(p, .7, .92); }
      else if (key === 'iter') {
        done = 1 + Math.min(ITERS, Math.floor(ip) + (ph >= .9 ? 1 : 0));
        const k = 1 + Math.floor(ip), within = ramp(ph, .62, .95);
        dr = lerp(DRIFT[Math.min(TOTAL_UPDATES, k)], DRIFT[Math.min(TOTAL_UPDATES, k + 1)], within);
      } else if (key === 'out') { done = TOTAL_UPDATES; dr = DRIFT[TOTAL_UPDATES]; }
      setDrift(dr);
      S.driftLbl.setAttribute('opacity', key === 'back' || key === 'iter' ? 1 : 0);
      const q = done / TOTAL_UPDATES;
      S.shOver.setAttribute('opacity', (key === 'back' || key === 'iter' || key === 'out') ? q.toFixed(3) : 0);
      S.bar.setAttribute('width', (S.barW * (1 - .82 * Math.pow(q, .8))).toFixed(1));
      const lapNo = key === 'back' ? 1 : key === 'iter' ? Math.min(TOTAL_UPDATES, Math.floor(ip) + 2) : 0;
      S.counter.textContent = lapNo ? `Adam iteration ${lapNo}` : '';
      S.lap.textContent = lapNo ? String(lapNo) : '';
      S.latRing.setAttribute('opacity', (key === 'iter' || key === 'back') && ph > .86 ? 1 : 0);
      // output: appears when the playhead leaves the guided step, carrying that step's noise, and clears exactly at 0
      S.outPic.setAttribute('opacity', key === 'out' ? ramp(p, .12, .2) : 0);
      const left = key === 'out' ? clamp((1 - prog) / (1 - T.sel)) : 1;       // 1 at the guided step … 0 at t = 0
      S.outNoise.setAttribute('opacity', reduce ? 0 : (.9 * Math.pow(left, .85)).toFixed(3));
    };
    return S;
  }

  // ---------------------------------------------------------------- build / layout
  let layout = '';
  function build() {
    const W = root.clientWidth >= 640;
    const want = W ? 'w' : 't';
    if (want === layout) return;
    layout = want;
    svg.textContent = '';
    scenes = {};
    svg.setAttribute('viewBox', W ? '0 0 960 430' : '0 0 360 520');
    defs = el('defs', {}, svg);
    AR = 'ar' + (++uid); ARR = 'arr' + uid; ARG = 'arg' + uid; ARO = 'aro' + uid; NOISE = 'nz' + uid; BLUR = 'bl' + uid; IMN = 'imn' + uid;
    for (const [id, c] of [[AR, '#8b93a5'], [ARR, '#c2185b'], [ARG, '#1a8a56'], [ARO, '#e0972a']]) {
      const m = el('marker', { id, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 5, markerHeight: 5, orient: 'auto-start-reverse' }, defs);
      el('path', { d: 'M0,0 L10,5 L0,10 z', fill: c }, m);
    }
    // per-pixel image noise for the output's denoising (fixed seed → the same grain every time); opaque grey, high contrast
    const imf = el('filter', { id: IMN, x: 0, y: 0, width: 1, height: 1, 'color-interpolation-filters': 'sRGB' }, defs);
    el('feTurbulence', { type: 'fractalNoise', baseFrequency: .85, numOctaves: 1, seed: 11, result: 'n' }, imf);
    el('feColorMatrix', { type: 'matrix', values: '.6 .3 .1 0 0  .6 .3 .1 0 0  .6 .3 .1 0 0  0 0 0 0 1' }, imf);
    const ct = el('feComponentTransfer', {}, imf);
    for (const c of ['feFuncR', 'feFuncG', 'feFuncB']) el(c, { type: 'linear', slope: 2.6, intercept: -.8 }, ct);
    const nf = el('filter', { id: NOISE, x: 0, y: 0, width: 1, height: 1 }, defs);
    el('feTurbulence', { type: 'fractalNoise', baseFrequency: .9, numOctaves: 2, seed: 7 }, nf);
    el('feColorMatrix', { type: 'saturate', values: 0 }, nf);
    const bf = el('filter', { id: BLUR, x: '-10%', y: '-10%', width: '120%', height: '120%' }, defs);
    el('feGaussianBlur', { stdDeviation: 3 }, bf);
    buildTrain(W); buildYou(W); buildIn(W);
    lastStage = -1;
    draw();
  }

  // ---------------------------------------------------------------- render
  let t = reduce ? STAGES[0].dur * .999 : 0;
  function locate(time) {
    let i = 0;
    while (i < N - 1 && time >= starts[i + 1]) i++;
    return { i, p: clamp((time - starts[i]) / STAGES[i].dur) };
  }
  let lastStage = -1;
  function draw() {
    const { i, p } = locate(t);
    const st = STAGES[i];
    for (const S of Object.values(scenes)) S.g.style.display = S.name === st.scene ? '' : 'none';
    const S = scenes[st.scene];
    for (const [name, g] of Object.entries(S.parts)) {
      const on = st.on.includes(name), sk = g.dataset.kind === 'skel';
      g.classList.toggle('dim', !on && sk);
      g.classList.toggle('hid', !on && !sk);
    }
    for (const f of S.flows) {
      const act = !reduce && st.on.includes(f.name) && (st.flowFn ? st.flowFn(f.name, p) : st.flow.includes(f.name));
      f.dots.forEach((d, k) => {
        if (!act) { d.setAttribute('opacity', 0); return; }
        const u = ((t / 1500) + k / 3) % 1;
        const pt = f.path.getPointAtLength(u * f.len);
        d.setAttribute('cx', pt.x.toFixed(1));
        d.setAttribute('cy', pt.y.toFixed(1));
        d.setAttribute('opacity', Math.sqrt(Math.sin(Math.PI * u)).toFixed(2));
      });
    }
    S.update(st.key, p, t);
    range.value = String(Math.round(t / TOTAL * 1000));
    if (i !== lastStage) {
      lastStage = i;
      capEl.textContent = st.cap;
      eqEl.innerHTML = st.eq || '';
      eqEl.hidden = !st.eq;
      const f0 = firstOf(st.scene), n = STAGES.filter(s => s.scene === st.scene).length;
      countEl.textContent = `${i - f0 + 1} / ${n}`;
      tabs.forEach(b => b.setAttribute('aria-pressed', String(STAGES[+b.dataset.tab].scene === st.scene)));
      renderSteps(st.scene, i);
    }
  }
  function renderSteps(scene, cur) {
    stepsEl.textContent = '';
    const f0 = firstOf(scene);
    let grp = null;
    STAGES.forEach((s, j) => {
      if (s.scene !== scene) return;
      const b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = `<b>${j - f0 + 1}</b>${s.name}`;
      if (j === cur) b.setAttribute('aria-current', 'step');
      b.addEventListener('click', () => { userPaused = true; pause(); go(j); });
      if (s.loop) {
        if (!grp) {
          const li = document.createElement('li');
          li.className = 'loopgrp';
          const lab = document.createElement('span');
          lab.className = 'loopgrp__lbl';
          lab.textContent = '↻ guided loop, repeated';
          grp = document.createElement('div');
          grp.className = 'loopgrp__steps';
          li.append(lab, grp);
          stepsEl.appendChild(li);
        }
        grp.appendChild(b);
      } else {
        grp = null;
        const li = document.createElement('li');
        li.appendChild(b);
        stepsEl.appendChild(li);
      }
    });
  }

  // ---------------------------------------------------------------- playback
  let playing = false, raf = 0, last = 0, userPaused = false;
  function frame(now) {
    if (!playing) return;
    t = (t + Math.min(64, now - last)) % TOTAL;
    last = now;
    draw();
    raf = requestAnimationFrame(frame);
  }
  const ICON_PLAY = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9.5-5.5z"/></svg>';
  const ICON_PAUSE = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 2.5h3v11h-3zM9.5 2.5h3v11h-3z"/></svg>';
  function setBtn() {
    playBtn.innerHTML = playing ? ICON_PAUSE : ICON_PLAY;
    playBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
  }
  function play() { if (playing) return; playing = true; last = performance.now(); setBtn(); raf = requestAnimationFrame(frame); }
  function pause() { playing = false; cancelAnimationFrame(raf); setBtn(); }
  function go(i) { i = (i + N) % N; t = starts[i] + (playing ? 0 : STAGES[i].dur * .999); lastStage = -1; draw(); }

  playBtn.addEventListener('click', () => { if (playing) { userPaused = true; pause(); } else { userPaused = false; play(); } });
  root.querySelector('[data-prev]').addEventListener('click', () => go(locate(t).i - 1));
  root.querySelector('[data-next]').addEventListener('click', () => go(locate(t).i + 1));
  tabs.forEach(b => b.addEventListener('click', () => go(+b.dataset.tab)));
  range.addEventListener('input', () => { userPaused = true; pause(); t = Math.min(TOTAL - 1, +range.value / 1000 * TOTAL); lastStage = -1; draw(); });

  build();
  setBtn();
  if ('ResizeObserver' in window) new ResizeObserver(build).observe(root);
  if (!reduce && 'IntersectionObserver' in window) {
    new IntersectionObserver(es => {
      for (const e of es) {
        if (e.isIntersecting && e.intersectionRatio > .3) { if (!userPaused) play(); }
        else if (!e.isIntersecting) pause();
      }
    }, { threshold: [0, .3, .6] }).observe(root);
  }
})();
