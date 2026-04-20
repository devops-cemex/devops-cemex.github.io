/* =========================================================================
   services_v2.js
   Progressive-enhancement scripts for the new service pages:
     - generators.html
     - solar_panels.html
     - vehicles.html

   Features:
     1. Reveal-on-scroll for product-card, bundle-card, estate-card, vehicle-card
     2. Category filter for vehicles page (data-category attributes)
     3. Keyboard accessibility for tab buttons
     4. Respects prefers-reduced-motion
   ========================================================================= */

(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------------------------------------------------------------------
       1. Reveal-on-scroll
       --------------------------------------------------------------------- */
    function initRevealOnScroll() {
        const selectors = [
            '.product-card',
            '.bundle-card',
            '.estate-card',
            '.vehicle-card.reveal'
        ];

        const targets = document.querySelectorAll(selectors.join(','));
        if (!targets.length) return;

        if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
            targets.forEach((el) => el.classList.add('visible'));
            return;
        }

        const io = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
        );

        targets.forEach((el, index) => {
            // Stagger within a grid, reset roughly every 4 items
            el.style.transitionDelay = ((index % 4) * 0.08) + 's';
            io.observe(el);
        });
    }

    /* ---------------------------------------------------------------------
       2. Vehicle category filter
       --------------------------------------------------------------------- */
    function initCategoryFilter() {
        const tabsContainer = document.querySelector('[data-cat-tabs]');
        const grid = document.querySelector('[data-cat-grid]');
        if (!tabsContainer || !grid) return;

        const tabs = tabsContainer.querySelectorAll('.cat-tab');
        const cards = grid.querySelectorAll('[data-category]');

        function applyFilter(filter) {
            cards.forEach((card) => {
                const cats = (card.dataset.category || '').split(/\s+/);
                const match = filter === 'all' || cats.includes(filter);
                card.classList.toggle('is-hidden', !match);
            });
        }

        function activate(tab) {
            tabs.forEach((t) => {
                const active = t === tab;
                t.classList.toggle('is-active', active);
                t.setAttribute('aria-selected', active ? 'true' : 'false');
                t.setAttribute('tabindex', active ? '0' : '-1');
            });
            applyFilter(tab.dataset.filter || 'all');
        }

        tabs.forEach((tab, idx) => {
            tab.addEventListener('click', () => activate(tab));
            tab.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const dir = e.key === 'ArrowRight' ? 1 : -1;
                    const next = tabs[(idx + dir + tabs.length) % tabs.length];
                    next.focus();
                    activate(next);
                }
            });
        });

        // Initial state
        const initiallyActive = tabsContainer.querySelector('.cat-tab.is-active') || tabs[0];
        if (initiallyActive) activate(initiallyActive);
    }

    /* ---------------------------------------------------------------------
       3. fm-power in-view trigger (fallback — matches services.js pattern)
       This guarantees the intro section animates even if services.js is
       not loaded on a given page.
       --------------------------------------------------------------------- */
    function initFmPowerInView() {
        if (prefersReducedMotion) return;
        const el = document.getElementById('fmPower');
        if (!el || el.classList.contains('in-view')) return;

        const io = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.18 }
        );

        io.observe(el);
    }

    /* ---------------------------------------------------------------------
       Boot
       --------------------------------------------------------------------- */
    function boot() {
        initRevealOnScroll();
        initCategoryFilter();
        initFmPowerInView();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
