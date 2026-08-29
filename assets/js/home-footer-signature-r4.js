/* ProAI Expert — Footer Signature R4
   Fine-pointer, per-letter specular response. No touch hover simulation. */
(function () {
  'use strict';

  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)');
  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!finePointer || !finePointer.matches || (reducedMotion && reducedMotion.matches)) return;

  var zones = document.querySelectorAll('[data-home-footer-golden-r3] [data-footer-material-zone]');
  if (!zones.length) return;

  zones.forEach(function (zone) {
    var text = zone.querySelector('.home-footer-golden-r3__signature-text');
    if (!text || text.dataset.r4Ready === 'true') return;

    var source = text.textContent || '';
    var fragment = document.createDocumentFragment();
    var letters = [];

    Array.prototype.forEach.call(source, function (character) {
      if (character === ' ') {
        var space = document.createElement('span');
        space.className = 'home-footer-signature-r4__space';
        space.setAttribute('aria-hidden', 'true');
        fragment.appendChild(space);
        return;
      }

      var letter = document.createElement('span');
      letter.className = 'home-footer-signature-r4__letter';
      letter.textContent = character;
      letter.setAttribute('aria-hidden', 'true');
      letter.setAttribute('data-r4-char', character);
      letter.style.setProperty('--r4-light', '0');
      letter.style.setProperty('--r4-local-x', '50%');
      fragment.appendChild(letter);

      letters.push({
        node: letter,
        rect: null,
        current: 0,
        target: 0,
        localX: 50
      });
    });

    text.textContent = '';
    text.appendChild(fragment);
    text.dataset.r4Ready = 'true';

    var pointerX = 0;
    var active = false;
    var frame = 0;
    var geometryDirty = true;
    var zoneRect = null;

    function measure() {
      zoneRect = zone.getBoundingClientRect();
      letters.forEach(function (item) {
        item.rect = item.node.getBoundingClientRect();
      });
      geometryDirty = false;
    }

    function smoothstep(edge0, edge1, value) {
      var x = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
      return x * x * (3 - 2 * x);
    }

    function retarget() {
      if (geometryDirty || !zoneRect) measure();

      var sigma = Math.max(52, Math.min(92, zoneRect.width * 0.055));

      letters.forEach(function (item) {
        var rect = item.rect;
        if (!rect || !rect.width) {
          item.target = 0;
          return;
        }

        if (!active) {
          item.target = 0;
          return;
        }

        var center = rect.left + (rect.width / 2);
        var distance = Math.abs(pointerX - center);
        var gaussian = Math.exp(-(distance * distance) / (2 * sigma * sigma));

        /* Keep distant glyphs near rest; nearest glyph reaches full local reflection.
           Smoothstep compresses low-level spill and preserves a controlled neighbor falloff. */
        item.target = smoothstep(.08, .92, gaussian);

        var local = ((pointerX - rect.left) / rect.width) * 100;
        item.localX = Math.max(0, Math.min(100, local));
      });
    }

    function render() {
      frame = 0;
      retarget();

      var moving = false;

      letters.forEach(function (item) {
        var delta = item.target - item.current;
        var rate = delta > 0 ? .30 : .065;

        item.current += delta * rate;

        if (Math.abs(delta) < .002 && item.target === 0) {
          item.current = 0;
        }

        item.node.style.setProperty('--r4-light', item.current.toFixed(3));
        item.node.style.setProperty('--r4-local-x', item.localX.toFixed(1) + '%');

        if (Math.abs(item.target - item.current) > .002 || (!active && item.current > .003)) {
          moving = true;
        }
      });

      if (moving) {
        frame = window.requestAnimationFrame(render);
      } else if (!active) {
        zone.removeAttribute('data-r4-active');
      }
    }

    function requestRender() {
      if (!frame) frame = window.requestAnimationFrame(render);
    }

    function updatePointer(event) {
      pointerX = event.clientX;
      requestRender();
    }

    zone.addEventListener('pointerenter', function (event) {
      active = true;
      pointerX = event.clientX;
      zone.setAttribute('data-r4-active', 'true');
      requestRender();
    }, { passive: true });

    zone.addEventListener('pointermove', updatePointer, { passive: true });

    zone.addEventListener('pointerleave', function () {
      active = false;
      letters.forEach(function (item) {
        item.target = 0;
      });
      requestRender();
    }, { passive: true });

    window.addEventListener('resize', function () {
      geometryDirty = true;
      if (active) requestRender();
    }, { passive: true });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        geometryDirty = true;
        if (active) requestRender();
      });
    }
  });
}());
