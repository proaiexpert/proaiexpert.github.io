(function () {
  const stage = document.getElementById('aiHeroPreviewStage');
  if (!stage) return;

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  function prepPath(id) {
    const el = document.getElementById(id);
    if (!el || typeof el.getTotalLength !== 'function') return;
    const len = el.getTotalLength();
    el.style.setProperty('--len', len + 'px');
    el.style.strokeDasharray = len;
    el.style.strokeDashoffset = len;
  }

  [
    'aiHeroSpineMain',
    'aiHeroSpineGlow',
    'aiHeroConnInquiry',
    'aiHeroConnForm',
    'aiHeroConnRoute',
    'aiHeroConnHuman',
    'aiHeroConnResponse'
  ].forEach(prepPath);

  function draw(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('is-drawn');
  }

  function reveal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('is-visible');
  }

  async function runSequence() {
    await delay(220);
    reveal('aiHeroPreviewCopy');

    await delay(180);
    draw('aiHeroSpineMain');
    draw('aiHeroSpineGlow');

    await delay(240);
    reveal('aiHeroNode1');
    reveal('aiHeroLabel1');

    await delay(180);
    draw('aiHeroConnInquiry');
    reveal('aiHeroCardInquiry');

    await delay(260);
    reveal('aiHeroNode2');
    reveal('aiHeroLabel2');

    await delay(160);
    draw('aiHeroConnRoute');
    reveal('aiHeroCardRouting');

    await delay(220);
    draw('aiHeroConnForm');
    reveal('aiHeroCardForm');

    await delay(260);
    reveal('aiHeroDiamond1');

    await delay(160);
    draw('aiHeroConnHuman');
    reveal('aiHeroCardHuman');
    reveal('aiHeroNode3');
    reveal('aiHeroLabel3');

    await delay(260);
    draw('aiHeroConnResponse');
    reveal('aiHeroCardResponse');

    await delay(220);
    reveal('aiHeroNode4');
    reveal('aiHeroLabel4');

    startParticles();
  }

  function animateParticle(el, points, startDelay, baseOpacity) {
    let t = 0;
    const segFrames = 54;
    const total = (points.length - 1) * segFrames;
    const lerp = (a, b, n) => a + (b - a) * n;

    function frame() {
      if (t >= total) {
        el.style.opacity = 0;
        setTimeout(() => {
          t = 0;
          requestAnimationFrame(frame);
        }, 900 + Math.random() * 1800);
        return;
      }

      const seg = Math.floor(t / segFrames);
      const local = (t % segFrames) / segFrames;
      const from = points[seg];
      const to = points[Math.min(seg + 1, points.length - 1)];
      const x = lerp(from.x, to.x, local);
      const y = lerp(from.y, to.y, local);

      el.setAttribute('cx', x);
      el.setAttribute('cy', y);

      if (t < 10) el.style.opacity = (t / 10) * baseOpacity;
      else if (t > total - 12) el.style.opacity = ((total - t) / 12) * baseOpacity;
      else el.style.opacity = baseOpacity;

      t++;
      requestAnimationFrame(frame);
    }

    setTimeout(() => requestAnimationFrame(frame), startDelay);
  }

  function startParticles() {
    const p1 = document.getElementById('aiHeroParticle1');
    const p2 = document.getElementById('aiHeroParticle2');
    if (!p1 || !p2) return;

    const mainFlow = [
      { x: 820, y: 122 },
      { x: 820, y: 222 },
      { x: 820, y: 468 },
      { x: 820, y: 734 }
    ];

    const reviewFlow = [
      { x: 820, y: 468 },
      { x: 885, y: 465 },
      { x: 960, y: 454 },
      { x: 1042, y: 446 }
    ];

    animateParticle(p1, mainFlow, 0, 0.72);
    animateParticle(p2, reviewFlow, 1200, 0.62);
  }

  runSequence();
}());
