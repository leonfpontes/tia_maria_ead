(function (global) {
  function initEventsCarousel(containerId, data, options) {
    var opts = Object.assign({ autoplay: true, interval: 15000 }, options || {});
    var container = document.getElementById(containerId);
    if (!container || !Array.isArray(data) || !data.length) return;

    // Reset container
    container.innerHTML = '';

    // Shell wrapper to match existing styles
    var wrapper = document.createElement('div');
    wrapper.className = 'antd-carousel-wrapper';
    wrapper.setAttribute('role', 'region');
    wrapper.setAttribute('aria-roledescription', 'carrossel');
    wrapper.tabIndex = 0;

    // Slides
    var slidesEls = [];
    data.forEach(function (item, idx) {
      var slide = document.createElement('div');
      slide.className = 'antd-carousel-slide';
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-label', (idx + 1) + ' de ' + data.length);
      var img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt || '';
      img.loading = 'lazy';
      img.decoding = 'async';
      slide.appendChild(img);
      slidesEls.push(slide);
    });

    // Controls
    var prevBtn = document.createElement('button');
    prevBtn.className = 'slick-arrow slick-prev';
    prevBtn.type = 'button';
    prevBtn.setAttribute('aria-label', 'Anterior');

    var nextBtn = document.createElement('button');
    nextBtn.className = 'slick-arrow slick-next';
    nextBtn.type = 'button';
    nextBtn.setAttribute('aria-label', 'Próximo');

    var dots = document.createElement('ul');
    dots.className = 'slick-dots';
    var dotButtons = [];

    slidesEls.forEach(function (_, i) {
      var li = document.createElement('li');
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Ir para slide ' + (i + 1));
      li.appendChild(b);
      dots.appendChild(li);
      dotButtons.push({ li: li, btn: b });
    });

    wrapper.appendChild(prevBtn);
    slidesEls.forEach(function (el) { wrapper.appendChild(el); });
    wrapper.appendChild(nextBtn);
    wrapper.appendChild(dots);
    container.appendChild(wrapper);

    var current = 0;
    var timer = null;

    function update() {
      slidesEls.forEach(function (el, i) {
        el.style.display = (i === current) ? 'flex' : 'none';
        el.setAttribute('aria-hidden', i === current ? 'false' : 'true');
      });
      dotButtons.forEach(function (d, i) {
        if (i === current) {
          d.li.classList.add('slick-active');
        } else {
          d.li.classList.remove('slick-active');
        }
      });
    }

    function goTo(i) {
      var n = slidesEls.length;
      current = ((i % n) + n) % n;
      update();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);

    dotButtons.forEach(function (d, i) {
      d.btn.addEventListener('click', function () { goTo(i); });
    });

    // Keyboard support
    wrapper.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    });

    // Autoplay
    function start() {
      if (!opts.autoplay) return;
      stop();
      timer = setInterval(next, opts.interval);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    wrapper.addEventListener('mouseenter', stop);
    wrapper.addEventListener('mouseleave', start);

    goTo(0);
    start();
  }

  global.initEventsCarousel = initEventsCarousel;
})(window);
