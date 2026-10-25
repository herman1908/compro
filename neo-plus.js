/* NEO PLUS — progress bar, warna aksen live, keyboard (aman saat modal terbuka) */
(function () {
    'use strict';
    var sw = window.swiper;
    var bar = document.getElementById('neoProgress');
    if (!sw || !bar) return;
    var root = document.documentElement;
    var total = sw.slides.length || 1;

    function accentOf(idx) {
        var s = sw.slides[idx];
        if (!s) return;
        var c = getComputedStyle(s).getPropertyValue('--accent').trim();
        if (c) root.style.setProperty('--live-accent', c);
    }
    function setProgress(p) {
        var v = (1 + Math.max(0, Math.min(1, p)) * (total - 1)) / total;
        bar.style.setProperty('--p', v.toFixed(4));
    }
    setProgress(sw.progress || 0);
    accentOf(sw.activeIndex);
    sw.on('progress', function (s, p) { setProgress(p); });
    sw.on('slideChange', function () { accentOf(sw.activeIndex); });

    // Keyboard: nonaktif saat modal terbuka supaya panah/PageDown scroll isi modal, bukan ganti slide
    function syncKeyboard() {
        if (!sw.keyboard) return;
        var open = document.querySelector('.modal-overlay.open');
        if (open) sw.keyboard.disable(); else sw.keyboard.enable();
    }
    var mo = new MutationObserver(syncKeyboard);
    document.querySelectorAll('.modal-overlay').forEach(function (m) { mo.observe(m, { attributes: true, attributeFilter: ['class'] }); });
})();
