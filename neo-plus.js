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

    // Auto Scroll Idle Peek (Instagram feed style preview)
    // 4 detik idle pertama, lalu setiap 5 detik idle berikutnya
    var idleTimeout = null;
    var idleInterval = null;
    var isPeeking = false;
    var currentTween = null;

    function doPeek() {
        if (sw.animating || isPeeking) return;
        var modalOpen = document.querySelector('.modal-overlay.open');
        if (modalOpen) return;
        if (sw.activeIndex >= sw.slides.length - 1) return;

        var currentTranslate = sw.translate;
        var slideHeight = sw.height || window.innerHeight;
        var peekTranslate = currentTranslate - (slideHeight * 0.25);
        isPeeking = true;

        if (window.gsap) {
            var obj = { val: currentTranslate };
            currentTween = gsap.to(obj, {
                val: peekTranslate,
                duration: 0.35,
                ease: 'power2.out',
                onUpdate: function () {
                    sw.setTranslate(obj.val);
                },
                onComplete: function () {
                    currentTween = gsap.to(obj, {
                        val: currentTranslate,
                        duration: 0.4,
                        ease: 'power2.inOut',
                        onUpdate: function () {
                            sw.setTranslate(obj.val);
                        },
                        onComplete: function () {
                            sw.setTranslate(currentTranslate);
                            isPeeking = false;
                            currentTween = null;
                        }
                    });
                }
            });
        } else {
            isPeeking = false;
        }
    }

    function resetIdle() {
        if (idleTimeout) {
            clearTimeout(idleTimeout);
            idleTimeout = null;
        }
        if (idleInterval) {
            clearInterval(idleInterval);
            idleInterval = null;
        }

        if (isPeeking) {
            if (currentTween) {
                currentTween.kill();
                currentTween = null;
            }
            if (sw) {
                sw.setTranslate(-sw.activeIndex * (sw.height || window.innerHeight));
            }
            isPeeking = false;
        }

        idleTimeout = setTimeout(function () {
            doPeek();
            idleInterval = setInterval(function () {
                doPeek();
            }, 5000);
        }, 4000);
    }

    var activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'touchmove', 'wheel', 'scroll', 'click'];
    activityEvents.forEach(function (ev) {
        window.addEventListener(ev, resetIdle, { passive: true });
    });

    resetIdle();
})();
