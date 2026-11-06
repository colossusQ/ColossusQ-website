/* Colossus Q prototype interactions. Scroll animations are specified for the Lovable build (Stage 6, prompt 8). */
(function () {
  var hdr = document.querySelector('.hdr');
  var hero = document.querySelector('.hero, .contact');
  var sticky = document.querySelector('.sticky');
  var fab = document.querySelector('.wa-fab');
  var lastY = 0;
  function onScroll() {
    var y = window.scrollY;
    var heroH = hero ? hero.offsetHeight : 0;
    if (hdr && !hdr.classList.contains('light')) hdr.classList.toggle('solid', y > heroH - 80);
    if (hdr) hdr.classList.toggle('hide', y > lastY && y > 240 && !document.querySelector('.mmenu.open'));
    var past = y > Math.max(heroH - 200, 300);
    if (sticky) sticky.classList.toggle('show', past);
    if (fab) fab.classList.toggle('show', past);
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Autoplay hero background video
  var heroVid = document.querySelector('.hero-video');
  if (heroVid) {
    heroVid.muted = true;
    heroVid.play().catch(function () {});
  }

  // Mobile menu
  var menu = document.querySelector('.mmenu');
  var openBtn = document.querySelector('.menu-btn');
  var closeBtn = document.querySelector('.mmenu-close');
  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (openBtn) openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open && closeBtn) closeBtn.focus(); else if (openBtn) openBtn.focus();
  }
  if (openBtn) openBtn.addEventListener('click', function () { setMenu(true); });
  if (closeBtn) closeBtn.addEventListener('click', function () { setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu && menu.classList.contains('open')) setMenu(false); });

  // Homepage services index with interactive side image & ambient backdrop blur
  var list = document.querySelector('.sidx-list');
  if (list) {
    var rows = list.querySelectorAll('.sidx-row[data-img]');
    var sideImg = document.getElementById('sidxMediaImg');
    var bgImg = document.getElementById('sidxBackdropImg');
    var sideNum = document.getElementById('sidxMediaNum');
    var sideCaption = document.getElementById('sidxMediaCaption');

    // Preload service images for instantaneous switching
    rows.forEach(function (r) {
      if (r.dataset.img) {
        var pre = new Image();
        pre.src = r.dataset.img;
      }
    });

    function activate(row) {
      if (!row) return;
      rows.forEach(function (r) { r.classList.toggle('on', r === row); });
      list.classList.add('has-on');

      var imgSrc = row.dataset.img;
      var num = row.dataset.num;
      var title = row.dataset.title;

      if (sideNum && num) sideNum.textContent = num;
      if (sideCaption && title) sideCaption.textContent = title;

      if (imgSrc) {
        if (sideImg && sideImg.getAttribute('src') !== imgSrc) {
          sideImg.classList.add('switching');
          var tempImg = new Image();
          tempImg.onload = function () {
            sideImg.src = imgSrc;
            sideImg.alt = title || '';
            sideImg.classList.remove('switching');
          };
          tempImg.src = imgSrc;
        }

        if (bgImg && bgImg.getAttribute('src') !== imgSrc) {
          bgImg.classList.add('switching');
          var tempBg = new Image();
          tempBg.onload = function () {
            bgImg.src = imgSrc;
            bgImg.classList.remove('switching');
          };
          tempBg.src = imgSrc;
        }
      }
    }

    rows.forEach(function (r) {
      r.addEventListener('mouseenter', function () { activate(r); });
      r.addEventListener('focus', function () { activate(r); });
      r.addEventListener('click', function (e) {
        if (e.target.closest('.sidx-nav-link')) {
          return; // Allow direct navigation if explicitly clicking 'Explore service →'
        }
        e.preventDefault();
        activate(r);
      });
    });

    // Ensure row 0 is properly active and background initialized on load
    if (rows.length) {
      activate(rows[0]);
    }
  }

  // Generic chip groups that swap a placeholder label (formats picker)
  document.querySelectorAll('[data-swap]').forEach(function (group) {
    var target = document.querySelector(group.dataset.swap);
    group.querySelectorAll('.chip').forEach(function (c) {
      c.addEventListener('click', function () {
        group.querySelectorAll('.chip').forEach(function (o) { o.setAttribute('aria-pressed', o === c ? 'true' : 'false'); });
        if (target) target.textContent = 'Placeholder: ' + c.dataset.label;
      });
    });
  });

  // Format Cards Rail Controller: Auto-Swipe 1-by-1 Whole Card Loop (2-second timeframe)
  document.querySelectorAll('.format-cards-track').forEach(function (track) {
    var parentSection = track.closest('.format-split-section') || track.parentElement;
    var scrollPrevBtn = (parentSection && parentSection.querySelector('#formatScrollPrev, .format-arrow.prev')) || document.getElementById('formatScrollPrev');
    var scrollNextBtn = (parentSection && parentSection.querySelector('#formatScrollNext, .format-arrow.next')) || document.getElementById('formatScrollNext');

    var originalCards = Array.prototype.slice.call(track.querySelectorAll('.format-rail-card:not(.is-clone)'));
    var originalCount = originalCards.length;
    if (originalCount <= 1) return;

    // Clone cards once to allow infinite seamless looping forward and backward
    originalCards.forEach(function (card) {
      var clone = card.cloneNode(true);
      clone.classList.add('is-clone');
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('[id]').forEach(function (el) { el.removeAttribute('id'); });
      if (clone.id) clone.removeAttribute('id');
      clone.querySelectorAll('a, button, input').forEach(function (el) { el.setAttribute('tabindex', '-1'); });
      track.appendChild(clone);
    });

    function getCardScrollPos(idx) {
      var allCards = track.querySelectorAll('.format-rail-card');
      if (!allCards[idx] || !allCards[0]) return 0;
      return allCards[idx].offsetLeft - allCards[0].offsetLeft;
    }

    function getCurrentCardIndex() {
      var allCards = track.querySelectorAll('.format-rail-card');
      var currentScroll = track.scrollLeft;
      var bestIdx = 0;
      var minDiff = Infinity;
      for (var i = 0; i < allCards.length; i++) {
        var target = allCards[i].offsetLeft - allCards[0].offsetLeft;
        var diff = Math.abs(target - currentScroll);
        if (diff < minDiff) {
          minDiff = diff;
          bestIdx = i;
        }
      }
      return bestIdx;
    }

    function silentJumpTo(pos) {
      var prevBehavior = track.style.scrollBehavior;
      var prevSnap = track.style.scrollSnapType;
      track.style.scrollBehavior = 'auto';
      track.style.scrollSnapType = 'none';
      track.scrollLeft = pos;
      void track.offsetWidth; // Force synchronous layout reflow
      track.style.scrollBehavior = prevBehavior;
      track.style.scrollSnapType = prevSnap;
    }

    function swipeNextCard() {
      var curIdx = getCurrentCardIndex();

      // Seamless wrap: if at or past clone of card 0 (originalCount), jump silently to original card
      if (curIdx >= originalCount) {
        var equivalentOriginalIdx = curIdx - originalCount;
        silentJumpTo(getCardScrollPos(equivalentOriginalIdx));
        curIdx = equivalentOriginalIdx;
        requestAnimationFrame(function () {
          var nextIdx = curIdx + 1;
          var targetPos = getCardScrollPos(nextIdx);
          track.scrollTo({
            left: targetPos,
            behavior: 'smooth'
          });
        });
        return;
      }

      var nextIdx = curIdx + 1;
      var targetPos = getCardScrollPos(nextIdx);

      track.scrollTo({
        left: targetPos,
        behavior: 'smooth'
      });
    }

    function swipePrevCard() {
      var curIdx = getCurrentCardIndex();

      // Seamless wrap: if at beginning (card 0), jump silently to cloned set then scroll back
      if (curIdx <= 0) {
        silentJumpTo(getCardScrollPos(originalCount));
        curIdx = originalCount;
        requestAnimationFrame(function () {
          var prevIdx = curIdx - 1;
          var targetPos = getCardScrollPos(prevIdx);
          track.scrollTo({
            left: targetPos,
            behavior: 'smooth'
          });
        });
        return;
      }

      var prevIdx = curIdx - 1;
      var targetPos = getCardScrollPos(prevIdx);

      track.scrollTo({
        left: targetPos,
        behavior: 'smooth'
      });
    }

    // Auto-swipe timer (2 seconds / 2000ms timeframe)
    var INTERVAL_MS = 2000;
    var autoTimer = null;
    var isHovered = false;
    var isUserInteracting = false;
    var isVisible = true;

    function startAutoSwipe() {
      stopAutoSwipe();
      if (isHovered || isUserInteracting || !isVisible) return;
      autoTimer = setInterval(function () {
        swipeNextCard();
      }, INTERVAL_MS);
    }

    function stopAutoSwipe() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    function resetAutoSwipeTimer() {
      stopAutoSwipe();
      startAutoSwipe();
    }

    // Arrow navigation buttons
    if (scrollPrevBtn) {
      scrollPrevBtn.addEventListener('click', function () {
        swipePrevCard();
        resetAutoSwipeTimer();
      });
      scrollPrevBtn.addEventListener('mouseenter', function () { isHovered = true; stopAutoSwipe(); });
      scrollPrevBtn.addEventListener('mouseleave', function () { isHovered = false; startAutoSwipe(); });
    }

    if (scrollNextBtn) {
      scrollNextBtn.addEventListener('click', function () {
        swipeNextCard();
        resetAutoSwipeTimer();
      });
      scrollNextBtn.addEventListener('mouseenter', function () { isHovered = true; stopAutoSwipe(); });
      scrollNextBtn.addEventListener('mouseleave', function () { isHovered = false; startAutoSwipe(); });
    }

    // Pause on track hover & focus
    track.addEventListener('mouseenter', function () {
      isHovered = true;
      stopAutoSwipe();
    });

    track.addEventListener('mouseleave', function () {
      isHovered = false;
      if (!isDown && !isUserInteracting) startAutoSwipe();
    });

    track.addEventListener('focusin', function () {
      isHovered = true;
      stopAutoSwipe();
    });

    track.addEventListener('focusout', function () {
      isHovered = false;
      startAutoSwipe();
    });

    // Touch handling for mobile devices
    track.addEventListener('touchstart', function () {
      isUserInteracting = true;
      stopAutoSwipe();
    }, { passive: true });

    track.addEventListener('touchend', function () {
      isUserInteracting = false;
      setTimeout(function () {
        if (!isUserInteracting && !isHovered) startAutoSwipe();
      }, 1500);
    }, { passive: true });

    // Desktop mouse drag-to-scroll support
    var isDown = false;
    var startX = 0;
    var startScrollLeft = 0;

    track.addEventListener('mousedown', function (e) {
      isDown = true;
      isUserInteracting = true;
      stopAutoSwipe();
      track.style.cursor = 'grabbing';
      track.style.userSelect = 'none';
      startX = e.pageX - track.offsetLeft;
      startScrollLeft = track.scrollLeft;
    });

    window.addEventListener('mouseup', function () {
      if (!isDown) return;
      isDown = false;
      isUserInteracting = false;
      track.style.cursor = 'default';
      track.style.removeProperty('user-select');
      setTimeout(function () {
        if (!isHovered && !isUserInteracting) startAutoSwipe();
      }, 1500);
    });

    track.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - track.offsetLeft;
      var walk = (x - startX) * 1.4;
      track.scrollLeft = startScrollLeft - walk;
    });

    // Pause when browser tab is inactive
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stopAutoSwipe();
      } else {
        startAutoSwipe();
      }
    });

    // IntersectionObserver: run auto-swipe only when section is visible
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            startAutoSwipe();
          } else {
            stopAutoSwipe();
          }
        });
      }, { threshold: 0.15 });
      observer.observe(track);
    } else {
      startAutoSwipe();
    }
  });

  // Before / after comparison
  document.querySelectorAll('.compare-wrap, .compare-stage-section, .compare-split-wrap').forEach(function (w) {
    var cmp = w.querySelector('.compare');
    if (!cmp) return;
    var range = w.querySelector('input[type=range]');
    if (range) {
      range.addEventListener('input', function () {
        cmp.style.setProperty('--pos', range.value + '%');
      });
    }
    var toggles = w.querySelectorAll('.compare-toggle .chip, .compare-toggle-pills .compare-pill-btn');
    toggles.forEach(function (c) {
      c.addEventListener('click', function () {
        toggles.forEach(function (o) {
          o.setAttribute('aria-pressed', o === c ? 'true' : 'false');
          o.classList.toggle('is-active', o === c);
        });
        if (range && c.dataset.pos !== undefined) {
          range.value = c.dataset.pos;
        }
        if (c.dataset.pos !== undefined) {
          cmp.style.setProperty('--pos', c.dataset.pos + '%');
        }
      });
    });
  });

  // Visual toggles (event management)
  document.querySelectorAll('.tgl').forEach(function (t) {
    t.addEventListener('click', function () { t.setAttribute('aria-pressed', t.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); });
  });

  // Sound toggle (concerts), visual only in the prototype
  document.querySelectorAll('[data-sound]').forEach(function (b) {
    b.addEventListener('click', function () {
      var on = b.getAttribute('aria-pressed') !== 'true';
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.textContent = on ? 'Turn sound off' : 'Turn sound on';
    });
  });

  // Enquiry form
  var form = document.querySelector('#enquiry');
  if (form) {
    var s1 = form.querySelector('[data-step="1"]');
    var s2 = form.querySelector('[data-step="2"]');
    var bars = form.querySelectorAll('.steps i');
    var typeInput = form.querySelector('input[name=project_type]');
    var budgetInput = form.querySelector('input[name=budget]');
    var params = new URLSearchParams(location.search);
    var preset = params.get('type');
    form.querySelectorAll('.tile').forEach(function (t) {
      if (preset && t.dataset.value === preset) { t.setAttribute('aria-pressed', 'true'); typeInput.value = t.dataset.value; }
      t.addEventListener('click', function () {
        form.querySelectorAll('.tile').forEach(function (o) { o.setAttribute('aria-pressed', o === t ? 'true' : 'false'); });
        typeInput.value = t.dataset.value;
        t.closest('.field').classList.remove('err');
      });
    });
    if (params.get('partner') === '1') { var ag = form.querySelector('input[name=is_partner]'); if (ag) ag.checked = true; }
    form.querySelectorAll('.budget .chip').forEach(function (c) {
      c.addEventListener('click', function () {
        form.querySelectorAll('.budget .chip').forEach(function (o) { o.setAttribute('aria-pressed', o === c ? 'true' : 'false'); });
        budgetInput.value = c.textContent;
      });
    });
    var nf = form.querySelector('input[name=not_fixed]');
    var month = form.querySelector('input[name=event_month]');
    if (nf) nf.addEventListener('change', function () { month.disabled = nf.checked; });
    var ta = form.querySelector('textarea');
    var cnt = form.querySelector('.count');
    if (ta && cnt) ta.addEventListener('input', function () { cnt.textContent = ta.value.length + ' / 500'; });

    function fail(el, bad) { var f = el.closest('.field') || form.querySelector('.tiles').closest('.field'); f.classList.toggle('err', bad); return !bad; }
    var stepTag = document.getElementById('stepIndicatorTag');
    var stepTitle = document.getElementById('stepNameTitle');
    function goStep(n) {
      s1.hidden = n !== 1; s2.hidden = n !== 2;
      bars[1].classList.toggle('on', n === 2);
      if (stepTag) stepTag.textContent = 'STEP ' + n + ' OF 2';
      if (stepTitle) stepTitle.textContent = n === 1 ? 'Event Scope & Format' : 'Representative & Budget';
      var heading = (n === 1 ? s1 : s2).querySelector('h2');
      if (heading) heading.focus();
    }
    form.querySelector('[data-next]').addEventListener('click', function () {
      if (fail(typeInput, !typeInput.value)) goStep(2);
    });
    form.querySelector('[data-back]').addEventListener('click', function () { goStep(1); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      var name = form.querySelector('input[name=full_name]');
      var phone = form.querySelector('input[name=phone]');
      var email = form.querySelector('input[name=email]');
      var consent = form.querySelector('input[name=consent]');
      ok = fail(name, name.value.trim().length < 2) && ok;
      ok = fail(phone, !/^[6-9]\d{9}$/.test(phone.value.replace(/\s/g, ''))) && ok;
      ok = fail(email, !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) && ok;
      ok = fail(consent, !consent.checked) && ok;
      if (!ok) { var first = form.querySelector('.field.err input, .field.err textarea'); if (first) first.focus(); return; }

      // Honeypot spam check
      var hp = form.querySelector('input[name=website]');
      if (hp && hp.value) return;

      var submitBtn = form.querySelector('button[type=submit]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Connecting to WhatsApp...';
      }

      // 1. Gather all brief details
      var companyInput = form.querySelector('input[name=company]');
      var cityInput = form.querySelector('input[name=event_city]');
      var monthInput = form.querySelector('input[name=event_month]');
      var notFixedCheck = form.querySelector('input[name=not_fixed]');
      var partnerCheck = form.querySelector('input[name=is_partner]');
      var selectedTile = form.querySelector('.tile[aria-pressed="true"] .tile-text');

      var clientName = (name.value || '').trim();
      var clientPhone = (phone.value || '').trim();
      var clientEmail = (email.value || '').trim();
      var clientCompany = companyInput && companyInput.value ? companyInput.value.trim() : '';
      var projectType = selectedTile ? selectedTile.textContent.trim() : (typeInput.value || 'General Event');
      var city = cityInput && cityInput.value ? cityInput.value.trim() : 'Not specified';
      var eventDate = (notFixedCheck && notFixedCheck.checked) ? 'Dates not fixed yet' : (monthInput && monthInput.value ? monthInput.value : 'Flexible');
      var budget = (budgetInput.value || 'Not finalised').replace(/\s+/g, ' ').trim();
      var requirements = ta && ta.value ? ta.value.trim() : 'None provided';
      var isPartner = partnerCheck && partnerCheck.checked;

      // Construct structured WhatsApp message
      var companyLine = clientCompany ? ('\n• *Company:* ' + clientCompany) : '';
      var waText = 'Hello Colossus Q Team,\n\n' +
        'I would like to discuss an event project. Here is my event brief:\n\n' +
        '*PROJECT BRIEF — COLOSSUS Q*\n' +
        '• *Name:* ' + clientName + companyLine + '\n' +
        '• *Phone:* +91 ' + clientPhone + '\n' +
        '• *Email:* ' + clientEmail + '\n' +
        '• *Project Type:* ' + projectType + '\n' +
        '• *Location:* ' + city + '\n' +
        '• *Event Date:* ' + eventDate + '\n' +
        '• *Estimated Budget:* ' + budget + '\n' +
        '• *Agency Partner:* ' + (isPartner ? 'Yes' : 'No') + '\n\n' +
        '*REQUIREMENTS / SCOPE:*\n' +
        requirements + '\n\n' +
        'Please review and connect with concepts and technical feasibility.';

      var waUrl = 'https://wa.me/919100189023?text=' + encodeURIComponent(waText);

      // TRIGGER WHATSAPP DIRECTLY
      var isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = waUrl;
      } else {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }

      // 5. Update page UI to success card
      var successBox = document.getElementById('enquirySuccessState');
      var namePlaceholder = document.getElementById('successLeadName');
      var waBtn = document.getElementById('successWaBtn');
      if (namePlaceholder) namePlaceholder.textContent = clientName.split(' ')[0] || clientName;
      if (waBtn) waBtn.href = waUrl;

      setTimeout(function () {
        form.hidden = true;
        if (successBox) {
          successBox.hidden = false;
          successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 350);
    });
  }

  // Featured Work (Rangtaali) Image Slideshow Transition
  var slider = document.getElementById('featuredSlider');
  if (slider) {
    var slides = slider.querySelectorAll('.featured-slide');
    var dots = slider.querySelectorAll('.slider-dot');
    var prevBtn = document.getElementById('sliderPrev');
    var nextBtn = document.getElementById('sliderNext');
    var currentSlide = 0;
    var slideTimer = null;
    var slideInterval = 3800;

    function showSlide(index) {
      if (!slides.length) return;
      if (index >= slides.length) index = 0;
      if (index < 0) index = slides.length - 1;
      currentSlide = index;

      slides.forEach(function (s, i) {
        s.classList.toggle('active', i === currentSlide);
      });
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === currentSlide);
      });
    }

    function nextSlide() {
      showSlide(currentSlide + 1);
    }

    function prevSlide() {
      showSlide(currentSlide - 1);
    }

    function startTimer() {
      stopTimer();
      slideTimer = setInterval(nextSlide, slideInterval);
    }

    function stopTimer() {
      if (slideTimer) {
        clearInterval(slideTimer);
        slideTimer = null;
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        nextSlide();
        startTimer();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        prevSlide();
        startTimer();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var idx = parseInt(dot.dataset.slide, 10);
        if (!isNaN(idx)) {
          showSlide(idx);
          startTimer();
        }
      });
    });

    slider.addEventListener('mouseenter', stopTimer);
    slider.addEventListener('mouseleave', startTimer);

    // Start auto-transition
    startTimer();
  }

  // Upgrade Services navigation dropdown into luxury floating card
  var dd = document.querySelector('.nav .dd');
  if (dd) {
    var panel = dd.querySelector('.dd-panel');
    var existingGrid = panel ? panel.querySelector('.dd-grid') : null;
    if (existingGrid && !panel.querySelector('.dd-card')) {
      var links = Array.from(existingGrid.querySelectorAll('a'));
      var allServicesLink = existingGrid.querySelector('.dd-all');
      var regularLinks = links.filter(function(a) { return !a.classList.contains('dd-all'); });
      
      var col1Html = '';
      var col2Html = '';
      
      regularLinks.forEach(function(a, idx) {
        var itemHtml = '<a class="dd-item" href="' + a.getAttribute('href') + '"><span>' + a.textContent.trim() + '</span><span class="dd-item-arr" aria-hidden="true">&rarr;</span></a>';
        if (idx < 4) {
          col1Html += itemHtml;
        } else {
          col2Html += itemHtml;
        }
      });
      
      if (allServicesLink) {
        col2Html += '<a class="dd-item dd-all" href="' + allServicesLink.getAttribute('href') + '"><span>' + allServicesLink.textContent.trim() + '</span><span class="dd-item-arr" aria-hidden="true">&rarr;</span></a>';
      }
      
      var watermarkSvg = 
        '<div class="dd-brand-watermark" aria-hidden="true">' +
          '<svg viewBox="0 0 60.52 71.07" role="img" aria-label="Colossus Q">' +
            '<path fill="currentColor" d="M46.92,63.97c4.12,0,5.44,7.28-3.98,7.09-.03,0-.05,0-.08,0-8.01.06-13.29-5.05-19.04-11.5-8.88-1.07-17.63-8.36-20.98-15.84C-2.56,31.7-.48,16.08,11.02,7.03c.47-.37,1.12-.31,1.52.13,1.53,1.69-2.59,2.25-4.79,11.73-3.13,13.54,1.92,31.29,14.37,37.45,4.13,2.04,5.48,1.39,6.19,2.4,2.53,3.61,7.94,7.92,13.38,9.62,1.38-1.45,2.07-4.39,5.21-4.39h0ZM53.12,49.47c-.48.55-1.33.54-1.8-.02,0-.01-.02-.02-.03-.04-.28-.33-.35-.8-.19-1.2,2.02-4.97,2.58-10.45,2.65-14.61.09-2.15-.01-4.33-.29-6.48-.02-.16-.03-.24-.03-.24h0c-1.64-11.93-8.92-22.98-21.93-24.54-1.41-.17-1.3-2.33.12-2.34,26.55-.23,37.37,31.16,21.51,49.47Z" />' +
          '</svg>' +
        '</div>';

      var cardHtml = 
        '<div class="dd-card">' +
          '<div class="dd-intro">' +
            '<p class="dd-eyebrow">OUR SERVICES</p>' +
            '<h2 class="dd-title">We create<br>unforgettable<br>experiences</h2>' +
            '<span class="dd-accent-bar" aria-hidden="true"></span>' +
          '</div>' +
          '<div class="dd-services-cols">' +
            watermarkSvg +
            '<div class="dd-col">' + col1Html + '</div>' +
            '<div class="dd-col">' + col2Html + '</div>' +
          '</div>' +
        '</div>';
        
      panel.innerHTML = cardHtml;
    }
  }

  // Ensure footer pattern tiles stretch completely to the right edge of the screen on all displays
  function fillFooterPatterns() {
    var patterns = document.querySelectorAll('.pattern');
    if (!patterns.length) return;

    var screenW = Math.max(
      window.innerWidth || 0,
      document.documentElement.clientWidth || 0,
      (window.screen && window.screen.width) || 0,
      3840 // Default to cover at least 4K monitors
    );

    patterns.forEach(function (pattern) {
      var svgs = Array.prototype.slice.call(pattern.querySelectorAll('svg:not(.is-clone)'));
      if (!svgs.length) return;

      var tileWidth = window.innerWidth < 768 ? 48 : 56;
      var neededCount = Math.ceil((screenW + tileWidth * 6) / tileWidth);
      var currentCount = pattern.querySelectorAll('svg').length;

      while (currentCount < neededCount) {
        for (var i = 0; i < svgs.length && currentCount < neededCount; i++) {
          var clone = svgs[i].cloneNode(true);
          clone.classList.add('is-clone');
          clone.setAttribute('aria-hidden', 'true');
          pattern.appendChild(clone);
          currentCount++;
        }
      }
    });
  }
  fillFooterPatterns();
  window.addEventListener('resize', fillFooterPatterns);
  window.addEventListener('load', fillFooterPatterns);
  document.addEventListener('DOMContentLoaded', fillFooterPatterns);
})();

