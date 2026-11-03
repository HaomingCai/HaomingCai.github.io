/* ConVRT 项目页 v7 · Insight：一段连续、像视频一样的动画（自动播放、循环、一条拖动条），每个场景只有一行字压在画面左上角。
   站主 11/03：只讲核心 —— 时间特征变少 → 表示只能慢慢变 → 抖动没了。
   场景（秒）：
     0  0.0–6.0   y–t 切片从哪来：原始输入视频播放（去掉了对比视频自己的蓝色切片线，机翼一带的 KLT 轨迹压暗），取样行每帧往下叠成切片。【真实帧】
     1  6.0–11.0  湍流 = 时间上的快抖动：切片挪到中间，只高亮一条边（真实量出来的位置），最后叠上一条平滑的线："low-pass over time"。
     2 11.0–19.5  我们的低通：时间轴旁边一列小方块 = 时间特征，一开始每帧一个，边的路径跟着每一下抖动；
                  方块合并到 5 个，路径只能缓缓弯，抖动没了。唯一的标签："temporal capacity ↓ (T_res = …)"。
                  路径 = 用这么多个时间特征去拟合这条真实的边（最小二乘、特征之间线性插值）—— 示意，不是 ConVRT 的输出。
     3 19.5–28.0  结果：真实的 Input | ConVRT 切片并排，带 v4 的标注，停住。
   论文依据：§3.2（第 5 页）时间特征图 N 只有 T_res 个特征（T_res ≪ T），相邻帧共用一个；§4.1（第 6 页）T_res = 5；表 3（第 8 页）15 / 8 / 5。 */
(function () {
  var root = document.getElementById('lp');
  if (!root || !window.V6DATA) return;
  var D = window.V6DATA, TV = D.T;

  var DUR = 28;
  var SCENES = [[0, 6.0, 'A y–t slice: one row per frame, stacked in time'],
                [6.0, 11.0, 'Turbulence = fast jitter over time'],
                [11.0, 19.5, 'Fewer temporal features → only slow change'],
                [19.5, DUR, 'Result: jitter gone, slow drift kept']];
  var STATIC_T = [5.8, 10.8, 19.3, 27.5];
  var PLAN = [[TV, 1.0], [60, 0.35], [30, 0.35], [15, 0.8], [8, 0.8], [5, 99]], SW0 = 12.2, MOVE = 0.6;
  var BOXES = [[158, 22, 58, 64], [143, 122, 56, 64]];

  var C = { ink: '#14161c', soft: '#4a5060', faint: '#8b93a5', row: '#ff8a1f', motion: '#2f7fd4', fit: '#e07b1f',
            jitter: '#d6453d', ok: '#1a8a56', okLine: '#3ddc84', bgEmpty: '#eef0f4' };
  var FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';

  var sprite = new Image(), sIn = new Image(), sOurs = new Image();
  sprite.src = './static/images/input_frames.jpg';
  sIn.src = './static/images/slice_input.png';
  sOurs.src = './static/images/slice_ours.png';
  function ready(im) { return im.complete && im.naturalWidth > 0; }
  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function ease(x) { x = clamp(x); return x * x * (3 - 2 * x); }
  function lerp(a, b, f) { return a + (b - a) * f; }
  function lerpR(a, b, f) { return { x: lerp(a.x, b.x, f), y: lerp(a.y, b.y, f), w: lerp(a.w, b.w, f), h: lerp(a.h, b.h, f) }; }

  // —— 用 R 个时间特征拟合这条真实的边（最小二乘；特征之间线性插值；R = 帧数时就是原样） ——
  var E = D.edgeIn;
  function fit(R) {
    if (R >= TV) return E.slice();
    var h = (TV - 1) / (R - 1), A = [], t, k, q;
    for (t = 0; t < TV; t++) { var w = new Array(R).fill(0), p = t / h, kk = Math.min(R - 2, Math.floor(p)), a = p - kk; w[kk] = 1 - a; w[kk + 1] = a; A.push(w); }
    var M = [], b = [];
    for (k = 0; k < R; k++) { M.push(new Array(R).fill(0)); b.push(0); for (t = 0; t < TV; t++) { if (!A[t][k]) continue; b[k] += A[t][k] * E[t]; for (q = Math.max(0, k - 1); q <= Math.min(R - 1, k + 1); q++) M[k][q] += A[t][k] * A[t][q]; } }
    for (k = 0; k < R; k++) for (q = k + 1; q < Math.min(R, k + 2); q++) { var f = M[q][k] / M[k][k]; for (var cc = k; cc < R; cc++) M[q][cc] -= f * M[k][cc]; b[q] -= f * b[k]; }
    var wv = new Array(R);
    for (k = R - 1; k >= 0; k--) { var s = b[k]; for (q = k + 1; q < R; q++) s -= M[k][q] * wv[q]; wv[k] = s / M[k][k]; }
    var y = []; for (t = 0; t < TV; t++) { var v = 0; for (k = 0; k < R; k++) v += A[t][k] * wv[k]; y.push(v); }
    return y;
  }
  var FITS = {}; PLAN.forEach(function (p) { FITS[p[0]] = fit(p[0]); });
  var STOPS = (function () { var out = [], t = SW0; PLAN.forEach(function (p, i) { out.push({ R: p[0], t0: t, t1: t + p[1] }); t += p[1] + (i < PLAN.length - 1 ? MOVE : 0); }); return out; })();
  function capAt(t) {
    if (t < SW0) return { a: TV, b: TV, f: 0 };
    for (var i = 0; i < STOPS.length; i++) {
      var s = STOPS[i]; if (t < s.t1) return { a: s.R, b: s.R, f: 0 };
      var n = STOPS[i + 1]; if (n && t < n.t0) return { a: s.R, b: n.R, f: ease((t - s.t1) / MOVE) };
    }
    return { a: 5, b: 5, f: 0 };
  }

  // —— 布局 ——
  function geom(W, H) {
    var small = W < 600, top = small ? 64 : 70, g = { W: W, H: H, small: small };   // 上面留给场景标题
    if (!small) {
      var gap = Math.max(30, W * 0.05), pw = Math.min((W - gap - 40) / 2, (H - top - 14) * 320 / 304), sh = pw * 304 / 320;
      var x0 = (W - (2 * pw + gap)) / 2 + 12;
      g.V = { x: x0, y: top, w: pw, h: pw * 0.75 };
      g.L = { x: x0, y: top, w: pw, h: sh };
      g.Rt = { x: x0 + pw + gap, y: top, w: pw, h: sh };
      g.Cn = { x: (W - pw) / 2 - 40, y: top, w: pw, h: sh };
    } else {
      var w2 = W - 36, sh2 = w2 * 304 / 320;
      g.V = { x: 24, y: top, w: w2, h: w2 * 0.75 };
      g.Rt0 = { x: 24, y: top + g.V.h + 30, w: w2, h: sh2 };
      // 场景 1、2：一张切片放大、上下居中（下面留一行给标签）
      var cw = w2 - 10, chh = cw * 304 / 320;
      g.Cn = { x: 34, y: top + Math.max(10, (H - top - chh - 50) / 2), w: cw, h: chh };
      // 场景 3：两张切片上下叠（手机上并排太小）
      var hh = Math.min(sh2, (H - top - 30 - 30 - 6) / 2), ww = hh * 320 / 304, xx = 24 + (w2 - ww) / 2;
      g.L = { x: xx, y: top + 22, w: ww, h: hh };
      g.Rt = { x: xx, y: top + 22 + hh + 30, w: ww, h: hh };
    }
    if (!g.Rt0) g.Rt0 = g.Rt;
    return g;
  }

  function text(c, s, x, y, size, color, weight, align) {
    c.font = (weight || 600) + ' ' + size + 'px ' + FONT; c.fillStyle = color; c.textAlign = align || 'left'; c.textBaseline = 'alphabetic';
    c.fillText(s, x, y); return c.measureText(s).width;
  }
  function sub(c, a, b, x, y, size, color, rest) {
    var w = text(c, a, x, y, size, color, 700);
    w += text(c, b, x + w + 0.5, y + size * 0.28, size * 0.66, color, 700) + 2;
    if (rest) w += text(c, rest, x + w, y, size, color, 700);
    return w;
  }
  function rrect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function pill(c, s, x, y, size, bg, fg) {
    c.font = '700 ' + size + 'px ' + FONT; var w = c.measureText(s).width;
    c.fillStyle = bg; rrect(c, x, y - size - 3, w + 14, size + 9, 5); c.fill();
    text(c, s, x + 7, y + 1, size, fg, 700); return w + 14;
  }
  function arrow(c, x0, y0, x1, y1, color, w) {
    c.strokeStyle = color; c.fillStyle = color; c.lineWidth = w || 1.5;
    c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
    var a = Math.atan2(y1 - y0, x1 - x0), s = 6.5;
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x1 - s * Math.cos(a - 0.45), y1 - s * Math.sin(a - 0.45)); c.lineTo(x1 - s * Math.cos(a + 0.45), y1 - s * Math.sin(a + 0.45)); c.closePath(); c.fill();
  }
  function tAxis(c, x, y0, y1, fs) {
    c.strokeStyle = C.faint; c.lineWidth = 1.2;
    c.beginPath(); c.moveTo(x, y0 + 2); c.lineTo(x, y1 - 4); c.stroke();
    c.beginPath(); c.moveTo(x - 4, y1 - 10); c.lineTo(x, y1 - 3); c.lineTo(x + 4, y1 - 10); c.stroke();
    text(c, 't', x, y0 - 4, fs, C.soft, 650, 'center');
  }
  function slice(c, R, im, frac, alpha) {
    c.save(); c.globalAlpha *= (alpha == null ? 1 : alpha);
    c.fillStyle = C.bgEmpty; c.fillRect(R.x, R.y, R.w, R.h);
    if (ready(im)) { c.beginPath(); c.rect(R.x, R.y, R.w, R.h * frac); c.clip(); c.drawImage(im, R.x, R.y, R.w, R.h); }
    c.restore();
  }
  function path(c, R, arr, n, color, w, outline) {
    var X = function (v) { return R.x + v / (D.c1 - D.c0) * R.w; }, Y = function (r) { return R.y + (r + 0.5) / TV * R.h; };
    var go = function () { c.beginPath(); for (var r = 0; r < n; r++) { if (r) c.lineTo(X(arr[r]), Y(r)); else c.moveTo(X(arr[r]), Y(r)); } c.stroke(); };
    c.lineJoin = 'round';
    if (outline) { c.strokeStyle = 'rgba(15,18,26,.55)'; c.lineWidth = w + 3; go(); }
    c.strokeStyle = color; c.lineWidth = w; go();
  }
  function sp(R, x, y) { return [R.x + x / 320 * R.w, R.y + y / 304 * R.h]; }
  function boxes(c, R, kind, a, a2, g) {
    BOXES.forEach(function (b, i) {
      var al = i ? a2 : a; if (al <= 0) return;
      var p = sp(R, b[0], b[1]), q = sp(R, b[0] + b[2], b[1] + b[3]), r = g.small && R.w < 200 ? 7 : 10;
      c.save(); c.globalAlpha *= al;
      c.lineWidth = 2.4; c.strokeStyle = kind === 'j' ? '#ff4d42' : C.okLine; if (kind === 'j') c.setLineDash([6, 4]);
      rrect(c, p[0], p[1], q[0] - p[0], q[1] - p[1], 6); c.stroke(); c.setLineDash([]);
      c.fillStyle = kind === 'j' ? C.jitter : C.ok; c.strokeStyle = '#fff'; c.lineWidth = 1.4;
      c.beginPath(); c.arc(q[0], p[1], r, 0, 7); c.fill(); c.stroke();
      text(c, String(i + 1), q[0], p[1] + r * 0.42, r * 1.15, '#fff', 700, 'center');
      c.restore();
    });
  }
  // 小小的"视频网络"图标：三层节点
  function netIcon(c, x, y, s, color) {
    var pts = [[-0.5, 0.5], [-1, 0, 1], [0]];   // 2 → 3 → 1 个节点
    c.strokeStyle = color; c.fillStyle = '#fff'; c.lineWidth = 1;
    var P = pts.map(function (col, i) { return col.map(function (v) { return [x + i * s, y + v * s * 0.7]; }); });
    for (var i = 0; i < P.length - 1; i++) P[i].forEach(function (a) { P[i + 1].forEach(function (b) { c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }); });
    P.forEach(function (col) { col.forEach(function (p) { c.beginPath(); c.arc(p[0], p[1], s * 0.22, 0, 7); c.fill(); c.stroke(); }); });
  }

  function draw(c, g, t) {
    c.clearRect(0, 0, g.W, g.H);
    var fs = g.small ? 11 : 13, lab = g.small ? 10.5 : 12;

    // —— 主切片的位置：场景 0 在右（手机在下）→ 场景 1、2 在中间 → 场景 3 在右 ——
    var toC = ease((t - 6.0) / 0.8), toR = ease((t - 19.5) / 0.9);
    var S = lerpR(lerpR(g.Rt0, g.Cn, toC), g.Rt, toR);
    var fi = Math.round(clamp((t - 0.2) / 5.4) * (TV - 1));
    var m = ease((t - 19.6) / 0.9);                                // 场景 3：右边换成 ConVRT 的真实切片
    slice(c, S, sIn, t < 6 ? (fi + 1) / TV : 1, 1 - m);
    if (m > 0) slice(c, S, sOurs, 1, m);
    tAxis(c, S.x - (g.small ? 10 : 14), S.y, S.y + S.h, fs);

    // —— 场景 0：原始视频，取样行 ——
    if (t < 6.8) {
      var va = 1 - ease((t - 6.0) / 0.5), V = g.V;
      c.save(); c.globalAlpha *= va;
      var sf = Math.min(Math.floor(fi / D.step), Math.ceil(TV / D.step) - 1);
      if (ready(sprite)) c.drawImage(sprite, (sf % D.cols) * D.tw, Math.floor(sf / D.cols) * D.th, D.tw, D.th, V.x, V.y, V.w, V.h);
      var cw = D.crop[2] - D.crop[0], chh = D.crop[3] - D.crop[1];
      var yDim = V.y + (200 - D.crop[1]) / chh * V.h, grd = c.createLinearGradient(0, yDim, 0, yDim + 20);
      grd.addColorStop(0, 'rgba(120,124,132,0)'); grd.addColorStop(1, 'rgba(120,124,132,.72)');
      c.fillStyle = grd; c.fillRect(V.x, yDim, V.w, V.y + V.h - yDim);
      var ry = V.y + (D.row - D.crop[1]) / chh * V.h, rx0 = V.x + (D.c0 - D.crop[0]) / cw * V.w, rx1 = V.x + (D.c1 - D.crop[0]) / cw * V.w;
      c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 6; c.beginPath(); c.moveTo(rx0, ry); c.lineTo(rx1, ry); c.stroke();
      c.strokeStyle = C.row; c.lineWidth = 3; c.beginPath(); c.moveTo(rx0, ry); c.lineTo(rx1, ry); c.stroke();
      text(c, 'input video', V.x, V.y - (g.small ? 8 : 11), fs, C.ink, 650);
      var rowY = S.y + S.h * (fi + 1) / TV;
      if (t < 6 && fi < TV - 1) {
        c.strokeStyle = C.row; c.lineWidth = 2; c.beginPath(); c.moveTo(S.x - 3, rowY); c.lineTo(S.x + S.w + 3, rowY); c.stroke();
        c.save(); c.setLineDash([5, 4]);
        if (!g.small) arrow(c, rx1 + 6, ry, S.x - 24, rowY, C.row, 1.6);
        else arrow(c, (rx0 + rx1) / 2, V.y + V.h + 4, S.x + S.w * 0.55, rowY - 6, C.row, 1.6);
        c.restore();
      }
      c.restore();
      if (t < 6) text(c, 'y–t slice', S.x, S.y - (g.small ? 8 : 11), fs, C.ink, 650);
    }

    // —— 场景 1：一条边 + 时间低通 ——
    var cap = capAt(t);
    if (t >= 6.6 && t < 20.2) {
      var fade = 1 - ease((t - 19.5) / 0.6);
      c.save(); c.globalAlpha *= fade;
      var edgeIn = clamp((t - 7.0) / 1.4), lpIn = clamp((t - 9.0) / 1.0), inS2 = ease((t - 11.0) / 0.6);
      if (t < 11.6) {
        c.save(); c.globalAlpha *= 1 - inS2;
        path(c, S, E, Math.floor(edgeIn * TV), '#ffffff', g.small ? 1.6 : 2, true);
        if (lpIn > 0) {
          path(c, S, D.edgeLP, Math.floor(lpIn * TV), C.motion, g.small ? 2.6 : 3.4, false);
          var q = sp(S, 228, 150); c.save(); c.globalAlpha *= ease((t - 9.8) / 0.4);
          pill(c, 'low-pass over time', Math.min(q[0], S.x + S.w - (g.small ? 118 : 142)), q[1], lab, C.motion, '#fff'); c.restore();
        }
        if (edgeIn > 0.6) { var j = sp(S, 214, 46); c.save(); c.globalAlpha *= ease((t - 8.1) / 0.4) * (1 - ease((t - 9.6) / 0.4));
          pill(c, 'jitter', Math.min(j[0], S.x + S.w - 60), j[1], lab, C.jitter, '#fff'); c.restore(); }
        c.restore();
      }
      // —— 场景 2：时间特征（方块）变少 → 路径只能慢慢变 ——
      if (inS2 > 0) {
        c.save(); c.globalAlpha *= inS2;
        c.fillStyle = 'rgba(251,251,253,.28)'; c.fillRect(S.x, S.y, S.w, S.h);        // 切片稍微压淡，让路径突出
        var ya = FITS[cap.a], yb = FITS[cap.b], cur = ya.map(function (v, r) { return lerp(v, yb[r], cap.f); });
        path(c, S, cur, TV, C.fit, g.small ? 2.4 : 3.2, true);
        // 时间轴旁的一列方块：每个 = 一个时间特征，覆盖它那一段帧
        var col = function (R, a) {
          if (a <= 0.01) return;
          var bx = S.x - (g.small ? 26 : 34), bw = g.small ? 9 : 12, hh = S.h / R;
          c.save(); c.globalAlpha *= a;
          for (var k = 0; k < R; k++) { c.fillStyle = k % 2 ? '#f3b77c' : '#e9963f'; c.fillRect(bx, S.y + k * hh + (R > 40 ? 0.15 : 1), bw, Math.max(0.6, hh - (R > 40 ? 0.3 : 2))); }
          c.restore();
        };
        col(cap.a, 1 - cap.f); if (cap.f > 0) col(cap.b, cap.f);
        // 唯一的标签：temporal capacity ↓ (T_res = …)，前面一个很小的网络图标
        var Rnow = cap.f < 0.5 ? cap.a : cap.b;
        var lx, ly;
        if (!g.small) { lx = S.x + S.w + 26; ly = S.y + S.h * 0.48; }
        else { lx = S.x; ly = S.y + S.h + 30; }
        netIcon(c, lx + 2, ly - 4, g.small ? 8 : 10, C.fit);
        var x2 = lx + (g.small ? 26 : 32);
        x2 += text(c, 'temporal capacity ' + (t >= SW0 ? '↓ ' : ''), x2, ly, g.small ? 12 : 14, C.fit, 700);
        sub(c, '(T', 'res', x2, ly, g.small ? 12 : 14, C.fit, ' = ' + (Rnow >= TV ? 'T' : Rnow) + ')');
        c.restore();
      }
      c.restore();
    }

    // —— 场景 3：真实的 Input | ConVRT 并排，标注 ——
    if (t >= 19.5) {
      var la = ease((t - 20.0) / 0.7), L = g.L;
      slice(c, L, sIn, 1, la);
      c.save(); c.globalAlpha *= la;
      tAxis(c, L.x - (g.small ? 10 : 14), L.y, L.y + L.h, fs);
      text(c, 'Input', L.x, L.y - (g.small ? 8 : 11), fs, C.ink, 700);
      boxes(c, L, 'j', ease((t - 21.0) / 0.5), ease((t - 21.3) / 0.5), g);
      c.restore();
      var ra = ease((t - 20.2) / 0.6);
      c.save(); c.globalAlpha *= ra;
      var w0 = text(c, 'ConVRT', S.x, S.y - (g.small ? 8 : 11), fs, C.ink, 700);
      sub(c, ' · T', 'res', S.x + w0, S.y - (g.small ? 8 : 11), g.small ? 10 : 12, C.fit, ' = 5');
      c.restore();
      boxes(c, S, 's', ease((t - 21.9) / 0.5), ease((t - 22.2) / 0.5), g);
      var a1 = ease((t - 21.0) / 0.5), a2 = ease((t - 21.9) / 0.5), small2 = g.small && L.w < 200, ps = small2 ? 9.5 : lab;
      if (a1 > 0) { c.save(); c.globalAlpha *= a1; var p1 = sp(L, 150, 98); pill(c, 'jitter', p1[0], p1[1], ps, C.jitter, '#fff'); c.restore(); }
      if (a2 > 0) { c.save(); c.globalAlpha *= a2; var p2 = sp(S, 140, 98); pill(c, 'smooth', p2[0], p2[1], ps, C.ok, '#fff'); c.restore(); }
      var dr = ease((t - 22.8) / 0.6);
      if (dr > 0) {
        c.save(); c.globalAlpha *= dr;
        var P = function (x, y) { return sp(S, x, y); }, s0 = P(242, 8), c1 = P(236, 70), c2 = P(222, 140), s1 = P(214, 198);
        c.strokeStyle = C.motion; c.lineWidth = small2 ? 2.2 : 3; c.beginPath(); c.moveTo(s0[0], s0[1]); c.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], s1[0], s1[1]); c.stroke();
        arrow(c, P(218, 168)[0], P(218, 168)[1], s1[0], s1[1] + 4, C.motion, small2 ? 2.2 : 3);
        var dl = P(232, 252);
        c.font = '700 ' + ps + 'px ' + FONT; var dw = c.measureText('slow drift kept').width + 14;
        pill(c, 'slow drift kept', Math.min(dl[0] - dw / 2, S.x + S.w - dw - 2), dl[1], ps, C.motion, '#fff');
        c.restore();
      }
    }

    // —— 场景标题（每个场景一行） ——
    var s = 0; for (var i = 0; i < SCENES.length; i++) if (t >= SCENES[i][0]) s = i;
    var ta = Math.min(1, ease((t - SCENES[s][0]) / 0.35)) * (s === SCENES.length - 1 ? 1 : Math.min(1, ease((SCENES[s][1] - t) / 0.25) + 0.0001));
    c.save(); c.globalAlpha = Math.max(0.0001, ta);
    pill(c, SCENES[s][2], g.small ? 8 : 14, g.small ? 22 : 26, g.small ? 12 : 14.5, 'rgba(20,22,28,.88)', '#fff');
    c.restore();
  }

  // ———————————————————————— 播放：自动、循环、一条拖动条 ————————————————————————
  var live = root.querySelector('.lp-live'), canvas = root.querySelector('canvas.lp-canvas');
  var btn = root.querySelector('.lp-play'), range = root.querySelector('.lp-range');
  var ctx = canvas.getContext('2d'), g = null, t = 0, playing = true, visible = false;
  function size(cv) {
    var W = cv.clientWidth, small = W < 600;
    var H = small ? Math.round(64 + (W - 36) * 0.75 + 30 + (W - 36) * 304 / 320 + 10) : Math.round(Math.min(520, Math.max(430, W * 0.52)));
    var dpr = window.devicePixelRatio || 1;
    cv.style.height = H + 'px'; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    cv.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    return geom(W, H);
  }
  function render() {
    if (!g) return;
    draw(ctx, g, t);
    range.value = Math.round(t / DUR * 1000);
    root.setAttribute('data-time', t.toFixed(2));
    var s = 0; for (var i = 0; i < SCENES.length; i++) if (t >= SCENES[i][0]) s = i;
    root.setAttribute('data-scene', s);
    var cp = capAt(t); root.setAttribute('data-tres', cp.f < 0.5 ? cp.a : cp.b);
  }
  function setPlaying(p) { playing = p; btn.setAttribute('aria-label', p ? 'Pause animation' : 'Play animation'); btn.classList.toggle('is-paused', !p); }

  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    live.hidden = true;
    var box = root.querySelector('.lp-static'); box.hidden = false;
    var cvs = STATIC_T.map(function (tt, i) {
      var fig = document.createElement('figure'), cv = document.createElement('canvas'), fc = document.createElement('figcaption');
      cv.className = 'lp-canvas'; cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', SCENES[i][2]);
      fc.textContent = (i + 1) + '. ' + SCENES[i][2];
      fig.appendChild(cv); fig.appendChild(fc); box.appendChild(fig); return cv;
    });
    var drawStatic = function () { cvs.forEach(function (cv, i) { draw(cv.getContext('2d'), size(cv), STATIC_T[i]); }); };
    [sprite, sIn, sOurs].forEach(function (im) { im.addEventListener('load', drawStatic); });
    addEventListener('resize', drawStatic); drawStatic();
    return;
  }
  g = size(canvas); setPlaying(true); render();
  [sprite, sIn, sOurs].forEach(function (im) { im.addEventListener('load', render); });
  if ('ResizeObserver' in window) new ResizeObserver(function () { g = size(canvas); render(); }).observe(canvas);
  btn.addEventListener('click', function () { setPlaying(!playing); });
  range.addEventListener('input', function () { setPlaying(false); t = range.value / 1000 * DUR; render(); });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: 0.3 }).observe(canvas);
  else visible = true;
  var last = null;
  function frame(ts) { var dt = last == null ? 0 : Math.min(0.1, (ts - last) / 1000); last = ts; if (playing && visible) { t += dt; if (t >= DUR) t -= DUR; render(); } requestAnimationFrame(frame); }
  requestAnimationFrame(frame);
})();
