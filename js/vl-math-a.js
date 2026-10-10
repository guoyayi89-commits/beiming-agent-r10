// 各章数学细线（上）：一 · 梯度下降　二 · 笛卡尔坐标系
(function () {
  'use strict';
  if (!window.VL || !window.BM) return;
  var S = VL.svg, T = VL.text;

  // ---------- 一 · 梯度下降：等高线的极小值正好落在两指之间 ----------
  (function () {
    var stage = document.querySelector('.adam-stage'), pair = document.getElementById('adamPair');
    var scrolly = document.querySelector('#creation .scrolly');
    if (!stage || !pair || !scrolly) return;
    var sv = S('svg', { 'class': 'math math-gd', 'aria-hidden': 'true' });
    stage.appendChild(sv);

    var LU = 1, LV = 6, ETA = 0.3, ROT = -16, STEPS = 18;
    var pts = [[-3.3, 1.05]];
    for (var s = 0; s < STEPS; s++) {
      var q = pts[pts.length - 1];
      pts.push([q[0] - ETA * LU * q[0], q[1] - ETA * LV * q[1]]);
    }
    var px = [], poly, marks = [], built = false;

    function build() {
      while (sv.firstChild) sv.removeChild(sv.firstChild);
      var W = stage.clientWidth, H = stage.clientHeight, sr = stage.getBoundingClientRect(), pr = pair.getBoundingClientRect();
      if (!W || !pr.width) return;
      sv.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      var cx = pr.left - sr.left + pr.width * 0.5, cy = pr.top - sr.top + pr.height * 0.47;
      var unit = Math.min(W, H) * 0.12, a = ROT * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
      function to(p) { return [cx + (p[0] * ca - p[1] * sa) * unit, cy + (p[0] * sa + p[1] * ca) * unit]; }
      var g = S('g', { 'class': 'm-draw' }, sv);

      [0.06, 0.2, 0.5, 1, 1.8, 3, 4.6, 6.6].forEach(function (c, i) {
        var rx = Math.sqrt(2 * c / LU) * unit, ry = Math.sqrt(2 * c / LV) * unit;
        S('ellipse', { cx: cx, cy: cy, rx: rx, ry: ry, transform: 'rotate(' + ROT + ' ' + cx + ' ' + cy + ')', 'class': i > 5 ? 'm-d' : 'm-f' }, g);
      });
      var e1 = to([-4.4, 0]), e2 = to([4.4, 0]), e3 = to([0, -1.9]), e4 = to([0, 1.9]);
      S('line', { x1: e1[0], y1: e1[1], x2: e2[0], y2: e2[1], 'class': 'm-d' }, g);
      S('line', { x1: e3[0], y1: e3[1], x2: e4[0], y2: e4[1], 'class': 'm-d' }, g);

      px = pts.map(to);
      poly = S('polyline', { 'class': 'm-c', points: '' }, g);
      marks = px.map(function (p, i) {
        var m = S('g', { 'class': 'gd-step' }, g);
        S('rect', { x: p[0] - 2.5, y: p[1] - 2.5, width: 5, height: 5, 'class': i ? 'm-sq' : 'm-l' }, m);
        return m;
      });
      // 起点处的负梯度方向
      var p0 = pts[0], gx = -LU * p0[0], gy = -LV * p0[1], gl = Math.hypot(gx, gy);
      var a0 = px[0], a1 = to([p0[0] + gx / gl * 0.55, p0[1] + gy / gl * 0.55]);
      S('line', { x1: a0[0], y1: a0[1], x2: a1[0], y2: a1[1], 'class': 'm-l', 'marker-end': 'url(#gdArrow)' }, g);
      var mk = S('marker', { id: 'gdArrow', viewBox: '0 0 8 8', refX: 7, refY: 4, markerWidth: 7, markerHeight: 7, orient: 'auto' }, S('defs', {}, sv));
      S('path', { d: 'M0 0L8 4L0 8', 'class': 'm-l' }, mk);
      built = true;
      VL.reveal(sv, 0.1);
      update();
    }

    function update() {
      if (!built || !BM.inView(scrolly)) return;
      var k = Math.round(BM.clamp(BM.stageProgress(scrolly) / 0.86, 0, 1) * STEPS);
      poly.setAttribute('points', px.slice(0, k + 1).map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '));
      marks.forEach(function (m, i) { m.style.opacity = i <= k ? 1 : 0; });
    }

    build();
    BM.onScroll(update);
    window.addEventListener('resize', VL.debounce(build, 200));
    window.addEventListener('load', build);
  })();

  // ---------- 二 · 笛卡尔坐标系：画像上的坐标轴与叶形线 ----------
  (function () {
    var fig = document.querySelector('.descartes');
    if (!fig) return;
    var W = 817, H = 1000, O = [408, 330], U = 70;
    var sv = S('svg', { 'class': 'math math-xy', viewBox: '0 0 ' + W + ' ' + H, 'aria-hidden': 'true' });
    fig.appendChild(sv);
    function to(x, y) { return [O[0] + x * U, O[1] - y * U]; }
    var g = S('g', { 'class': 'm-draw' }, sv);
    var defs = S('defs', {}, sv), mk = S('marker', { id: 'xyArrow', viewBox: '0 0 8 8', refX: 7, refY: 4, markerWidth: 7, markerHeight: 7, orient: 'auto' }, defs);
    S('path', { d: 'M0 0L8 4L0 8', 'class': 'm-l' }, mk);

    for (var i = -5; i <= 5; i++) {
      var x = O[0] + i * U;
      if (i) S('line', { x1: x, y1: 0, x2: x, y2: H, 'class': 'm-g' }, g);
      S('line', { x1: x, y1: O[1] - 4, x2: x, y2: O[1] + 4, 'class': 'm-l' }, g);
      if (i) T(g, x, O[1] + 18, String(i), 'm-t', 'middle');
    }
    for (var j = -9; j <= 4; j++) {
      var y = O[1] - j * U;
      if (j) S('line', { x1: 0, y1: y, x2: W, y2: y, 'class': 'm-g' }, g);
      S('line', { x1: O[0] - 4, y1: y, x2: O[0] + 4, y2: y, 'class': 'm-l' }, g);
      if (j) T(g, O[0] - 10, y + 3, String(j), 'm-t', 'end');
    }
    S('line', { x1: -50, y1: O[1], x2: W + 60, y2: O[1], 'class': 'm-l', 'marker-end': 'url(#xyArrow)' }, g);
    S('line', { x1: O[0], y1: H + 30, x2: O[0], y2: -46, 'class': 'm-l', 'marker-end': 'url(#xyArrow)' }, g);
    T(g, W + 64, O[1] + 18, 'x', 'm-t m-tk m-big');
    T(g, O[0] + 12, -40, 'y', 'm-t m-tk m-big');
    T(g, O[0] + 8, O[1] + 18, 'O', 'm-t m-tk');

    // 叶形线 x³ + y³ = 3axy
    var A = 1.6;
    function leaf(t0, t1, n) {
      var d = '';
      for (var k = 0; k <= n; k++) {
        var t = t0 + (t1 - t0) * k / n, den = 1 + t * t * t, p = to(3 * A * t / den, 3 * A * t * t / den);
        d += (k ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1);
      }
      return d;
    }
    S('path', { d: leaf(-0.6, 0, 60) + leaf(0, 40, 400).replace(/^M/, 'L') + leaf(-7, -1.28, 160), 'class': 'm-c' }, g);
    var a1 = to(-6, 6 - A), a2 = to(4, -4 - A);
    S('line', { x1: a1[0], y1: a1[1], x2: a2[0], y2: a2[1], 'class': 'm-d' }, g);
    T(g, a2[0] - 6, a2[1] - 8, 'x + y + a = 0', 'm-t', 'end');

    var P = to(1.5 * A, 1.5 * A);
    S('line', { x1: P[0], y1: P[1], x2: P[0], y2: O[1], 'class': 'm-d' }, g);
    S('line', { x1: P[0], y1: P[1], x2: O[0], y2: P[1], 'class': 'm-d' }, g);
    S('rect', { x: P[0] - 3.5, y: P[1] - 3.5, width: 7, height: 7, 'class': 'm-sq' }, g);
    T(g, P[0] + 10, P[1] - 8, 'P (3a/2, 3a/2)', 'm-t m-tk');
    T(g, P[0] + 10, P[1] + 8, '我在 = (x, y) ?', 'm-t');
    T(g, 16, H - 34, 'x³ + y³ = 3axy　a = ' + A, 'm-t m-tk m-big');
    T(g, 16, H - 16, '笛卡尔叶形线 · 1638 · 把"在哪里"写成一对数', 'm-t');
    VL.reveal(sv, 0.2);
  })();
})();
