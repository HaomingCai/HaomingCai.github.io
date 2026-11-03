// "移动光源"交互图（从主页旧的代表作交互图搬过来）。
// 一张雪碧图存着全部状态（光从正面一路移到右边，每格都是 Shadow Director 的真实输出），切换只是改 background-position。
// 没人碰的时候自己来回播；鼠标/手指一上去就交出控制权；方向键走一格，Home/End 到两端。
document.querySelectorAll('[data-scrub]').forEach(fig => {
  const base = fig.dataset.atlas;
  const fade = +fig.dataset.fade || 0;
  const [la, lb] = fig.querySelectorAll('.scrub__l');
  const dot = fig.querySelector('[data-dot]');
  const end0 = fig.querySelector('[data-end0]');
  const end1 = fig.querySelector('[data-end1]');

  fig.tabIndex = 0;
  fig.setAttribute('role', 'slider');
  fig.setAttribute('aria-label', 'Light direction across the portrait');

  fetch(base + '.json').then(r => r.json()).then(m => {
    const { cols, rows } = m;
    if (end0 && m.colLabels) end0.textContent = m.colLabels[0];
    if (end1 && m.colLabels) end1.textContent = m.colLabels[m.colLabels.length - 1];
    for (const l of [la, lb]) {
      l.style.backgroundImage = `url(${base}.jpg)`;
      l.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
    }
    // 底层永远不透明，只有顶层淡入，淡完再交接给底层 —— 两层各自淡入淡出会闪白
    la.style.opacity = 1; lb.style.opacity = 0; lb.style.transition = 'none';
    const posOf = c => `${cols > 1 ? (c / (cols - 1)) * 100 : 0}% 0%`;

    let cc = -1, settle = 0;
    function put(c) {
      if (c === cc) return;
      cc = c;
      const pos = posOf(c);
      if (!fade) {
        la.style.backgroundPosition = pos;
      } else {
        clearTimeout(settle);
        if (lb.style.opacity === '1') la.style.backgroundPosition = lb.style.backgroundPosition;
        lb.style.transition = 'none'; lb.style.opacity = 0; lb.style.backgroundPosition = pos;
        void lb.offsetWidth;
        lb.style.transition = `opacity ${fade}ms ease`; lb.style.opacity = 1;
        settle = setTimeout(() => { la.style.backgroundPosition = pos; lb.style.transition = 'none'; lb.style.opacity = 0; }, fade + 30);
      }
      if (dot) dot.style.left = (cols > 1 ? (c / (cols - 1)) * 100 : 50) + '%';
      fig.setAttribute('aria-valuenow', c);
      if (m.colLabels) fig.setAttribute('aria-valuetext',
        c === 0 ? m.colLabels[0] : c === cols - 1 ? m.colLabels[m.colLabels.length - 1] : `${c + 1} of ${cols}`);
    }
    fig.setAttribute('aria-valuemin', 0);
    fig.setAttribute('aria-valuemax', cols - 1);

    // 自动播放：来回扫，两端放慢（余弦缓动）
    const GAP = +fig.dataset.gap || 40, CYCLE = +fig.dataset.cycle || 1600;
    const SPEED = 2 / (CYCLE / GAP);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let t = 0, auto = !reduce, timer = 0, resume = 0;
    const tri = x => 1 - Math.abs(((x % 2) + 2) % 2 - 1);
    const shape = u => .5 - .5 * Math.cos(Math.PI * u);
    const step = () => {
      if (!auto) return;
      t += SPEED;
      put(Math.round(shape(tri(t)) * (cols - 1)));
      timer = setTimeout(() => requestAnimationFrame(step), GAP);
    };
    const takeover = () => { auto = false; clearTimeout(timer); clearTimeout(resume); fig.classList.add('is-live'); };
    const release = () => {
      fig.classList.remove('is-live'); clearTimeout(resume);
      if (!reduce) resume = setTimeout(() => { auto = true; step(); }, 1200);
    };
    const grabOn = el => e => {
      takeover();
      const b = el.getBoundingClientRect();
      put(Math.round(Math.min(1, Math.max(0, (e.clientX - b.left) / b.width)) * (cols - 1)));
    };
    const view = fig.querySelector('.scrub__view'), track = fig.querySelector('.scrub__track');
    view.addEventListener('pointermove', grabOn(view));
    view.addEventListener('pointerdown', grabOn(view));
    if (track) {
      const hud = fig.querySelector('[data-hud]');
      hud.addEventListener('pointermove', grabOn(track));
      hud.addEventListener('pointerdown', grabOn(track));
    }
    fig.addEventListener('pointerleave', release);
    fig.addEventListener('pointercancel', release);
    fig.addEventListener('keydown', e => {
      const s = { ArrowLeft: -1, ArrowRight: 1, ArrowDown: -1, ArrowUp: 1 }[e.key];
      let next = null;
      if (s) next = Math.min(cols - 1, Math.max(0, (cc < 0 ? 0 : cc) + s));
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = cols - 1;
      if (next === null) return;
      e.preventDefault(); takeover(); put(next);
    });
    fig.addEventListener('blur', release);

    put(2);
    // 进入视野才开始播
    new IntersectionObserver((es, o) => {
      es.forEach(e => { if (e.isIntersecting) { step(); o.unobserve(fig); } });
    }, { rootMargin: '120px' }).observe(fig);
  }).catch(() => fig.closest('.demo')?.remove());
});

// 导航高亮（和 Vid2Bokeh 页同一段）
(function () {
  const links = [...document.querySelectorAll('.nav a[href^="#"]')];
  const map = {};
  links.forEach(a => { const el = document.getElementById(a.getAttribute('href').slice(1)); if (el) map[el.id] = a; });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.remove('active'));
      if (map[e.target.id]) map[e.target.id].classList.add('active');
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  Object.keys(map).forEach(id => obs.observe(document.getElementById(id)));
})();
