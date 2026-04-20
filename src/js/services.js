// IntersectionObserver triggers the subtle entrance animations when the section enters the viewport.
      (function () {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const el = document.getElementById('fmPower');
        if (!el) return;

        const io = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in-view');
              obs.unobserve(entry.target);
            }
          });
        }, { threshold: 0.18 });

        io.observe(el);
      })();