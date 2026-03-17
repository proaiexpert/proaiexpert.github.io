(function () {
  'use strict';

  var frame = document.querySelector('.hero-visual-frame');
  if (!frame) return;
  var img = frame.querySelector('img');
  if (!img) return;

  // ── PARALLAX ─────────────────────────────────────────────────────────────
  var MAX_SHIFT = 5;
  var targetX = 0, targetY = 0;
  var curX = 0, curY = 0;

  function lerp(a, b, t) { return a + (b - a) * t; }

  document.addEventListener('mousemove', function (e) {
    var cx = window.innerWidth * 0.5;
    var cy = window.innerHeight * 0.5;
    targetX = ((e.clientX - cx) / cx) * MAX_SHIFT;
    targetY = ((e.clientY - cy) / cy) * MAX_SHIFT;
  });

  // ── CANVAS LAYER ──────────────────────────────────────────────────────────
  var canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = [
    'position:absolute',
    'inset:0',
    'width:100%',
    'height:100%',
    'pointer-events:none',
    'z-index:2'
  ].join(';');
  frame.appendChild(canvas);

  var ctx = canvas.getContext('2d');
  var W = 0, H = 0;

  function resize() {
    W = canvas.width  = frame.offsetWidth;
    H = canvas.height = frame.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ── PARTICLES ─────────────────────────────────────────────────────────────
  // Concentrated in the right 55-100% of the frame where the visual lives
  var N = 32;
  var pts = [];
  for (var i = 0; i < N; i++) {
    pts.push({
      x:          (0.55 + Math.random() * 0.45),   // relative [0–1]
      y:          Math.random(),
      r:          0.7 + Math.random() * 1.1,
      maxOp:      0.10 + Math.random() * 0.18,
      phase:      Math.random() * Math.PI * 2,
      phaseSpeed: 0.0025 + Math.random() * 0.003,
      angle:      Math.random() * Math.PI * 2,
      speed:      0.055 + Math.random() * 0.09,
      drift:      (Math.random() - 0.5) * 0.0012
    });
  }

  // ── SHIMMER NODES ────────────────────────────────────────────────────────
  // Approximate LED-node positions on the hero image (right half)
  var nodes = [
    { rx: 0.76, ry: 0.34, period: 5800 },
    { rx: 0.89, ry: 0.50, period: 7200 },
    { rx: 0.70, ry: 0.62, period: 6400 },
    { rx: 0.83, ry: 0.27, period: 8100 }
  ];

  // ── ANIMATION LOOP ────────────────────────────────────────────────────────
  function tick(t) {
    ctx.clearRect(0, 0, W, H);

    // Particles
    for (var j = 0; j < pts.length; j++) {
      var p = pts[j];
      p.phase += p.phaseSpeed;
      p.angle += p.drift;
      p.x += (Math.cos(p.angle) * p.speed) / W;
      p.y += (Math.sin(p.angle) * p.speed) / H;

      // Soft wrap so particles stay in the right portion
      if (p.x > 1.03)  p.x = 0.54;
      if (p.x < 0.54)  p.x = 1.03;
      if (p.y > 1.03)  p.y = -0.03;
      if (p.y < -0.03) p.y = 1.03;

      var op = (Math.sin(p.phase) * 0.5 + 0.5) * p.maxOp;
      ctx.beginPath();
      ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(195,215,245,' + op.toFixed(3) + ')';
      ctx.fill();
    }

    // Shimmer glow at LED nodes
    for (var k = 0; k < nodes.length; k++) {
      var nd = nodes[k];
      var s  = (Math.sin((t / nd.period) * Math.PI * 2) * 0.5 + 0.5);
      var op2 = s * 0.45;
      var x  = nd.rx * W;
      var y  = nd.ry * H;
      var g  = ctx.createRadialGradient(x, y, 0, x, y, 9);
      g.addColorStop(0,   'rgba(185,215,255,' + op2.toFixed(3) + ')');
      g.addColorStop(0.4, 'rgba(185,215,255,' + (op2 * 0.4).toFixed(3) + ')');
      g.addColorStop(1,   'rgba(185,215,255,0)');
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }

    // Parallax — smooth lerp toward mouse target
    curX = lerp(curX, targetX, 0.035);
    curY = lerp(curY, targetY, 0.035);
    // scale(1.025) hides the tiny gap that would appear at frame edges
    img.style.transform = 'translate(' + curX.toFixed(2) + 'px,' + curY.toFixed(2) + 'px) scale(1.025)';

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();
