(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const toast = $('#toast');
  let toastTimer;
  let selectedVehicle = 'Car';
  let authMode = 'signin';
  let lastFocused = null;
  const dateInput = $('#dateInput');
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  dateInput.value = new Date(now.getTime() + 30 * 60000).toISOString().slice(0, 16);
  dateInput.min = new Date(now.getTime()).toISOString().slice(0, 16);
  $('#year').textContent = new Date().getFullYear();
  if (window.lucide) window.lucide.createIcons();

  function notify(message) {
    $('#toastMessage').textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  function openAuth(mode) {
    authMode = mode;
    lastFocused = document.activeElement;
    const signup = mode === 'signup';
    $('#modalKicker').textContent = signup ? 'START PARKING SMARTER' : 'WELCOME TO PARKGO';
    $('#modalTitle').textContent = signup ? 'Create your account.' : 'Welcome back.';
    $('#modalSubtitle').textContent = signup ? 'Save your favourite spaces and manage every booking in one place.' : 'Sign in to manage your bookings and saved spaces.';
    $('#authSubmit').innerHTML = `${signup ? 'Create Account' : 'Sign In'} <i data-lucide="arrow-right"></i>`;
    $('#modalSwitch').innerHTML = signup ? 'Already have an account? <button type="button" data-auth="signin">Sign in</button>' : 'New to ParkGo? <button type="button" data-auth="signup">Create an account</button>';
    $('#modalBackdrop').classList.add('open');
    $('#modalBackdrop').setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (window.lucide) window.lucide.createIcons();
    setTimeout(() => $('#emailInput').focus(), 60);
  }
  function closeAuth() {
    $('#modalBackdrop').classList.remove('open');
    $('#modalBackdrop').setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }
  $$('[data-auth]').forEach(button => button.addEventListener('click', event => {
    event.preventDefault();
    openAuth(button.dataset.auth);
  }));
  $('#modalClose').addEventListener('click', closeAuth);
  $('#modalBackdrop').addEventListener('click', event => { if (event.target === $('#modalBackdrop')) closeAuth(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeAuth();
      $('#moreMenu').classList.remove('open');
      $('#mainNav').classList.remove('open');
      $('#mobileMenu').setAttribute('aria-expanded', 'false');
      $('#resultsDrawer').classList.remove('open');
    }
  });
  $('#authForm').addEventListener('submit', event => {
    event.preventDefault();
    const email = $('#emailInput').value.trim();
    const password = $('#passwordInput').value;
    if (!email || password.length < 8) return;
    closeAuth();
    $('#authForm').reset();
    notify(authMode === 'signup' ? 'Account details validated. Connect your authentication service to finish sign-up.' : 'Sign-in details validated. Connect your authentication service to continue.');
  });

  $$('.vehicle-tab').forEach(tab => tab.addEventListener('click', () => {
    selectedVehicle = tab.dataset.vehicle;
    $$('.vehicle-tab').forEach(item => {
      const active = item === tab;
      item.classList.toggle('selected', active);
      item.setAttribute('aria-selected', String(active));
    });
  }));

  const parkingLots = [
    { name: 'Central Plaza Parking', distance: '2 min walk', price: 40, rating: '4.9', features: 'CCTV · Covered · 24/7', icon: 'building-2' },
    { name: 'City Centre Secure Garage', distance: '5 min walk', price: 30, rating: '4.8', features: 'Guarded · Covered · Easy entry', icon: 'shield-check' },
    { name: 'Riverside Open Parking', distance: '8 min walk', price: 25, rating: '4.7', features: 'Open air · Flexible booking', icon: 'parking-square' },
    { name: 'Metro Point Smart Park', distance: '6 min walk', price: 35, rating: '4.8', features: 'QR entry · CCTV · EV-ready', icon: 'zap' }
  ];
  function showResults(location, vehicle, date) {
    const cleanLocation = location || 'your selected area';
    $('#resultsTitle').textContent = `Spaces near ${cleanLocation}`;
    $('#resultsSubtitle').textContent = `${vehicle} parking · ${date ? new Date(date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Flexible timing'}`;
    $('#resultsList').innerHTML = parkingLots.map((lot, index) => `
      <article class="result-card">
        <div class="result-thumb"><i data-lucide="${vehicle === 'EV' ? 'zap' : lot.icon}"></i></div>
        <div class="result-info"><h3>${lot.name}</h3><p>${lot.distance} · ${lot.features}</p><span class="result-rating">★ ${lot.rating} <span style="color:#8b9aab">(verified)</span></span></div>
        <div class="result-price">₹${lot.price}<small>per hour</small></div>
        <button class="result-book" data-book="${lot.name}">Reserve this space <span aria-hidden="true">→</span></button>
      </article>`).join('');
    $('#resultsDrawer').classList.add('open');
    if (window.lucide) window.lucide.createIcons();
    $$('.result-book').forEach(button => button.addEventListener('click', () => {
      notify(`${button.dataset.book} selected. Checkout integration is ready to connect.`);
    }));
  }
  $('#parkingForm').addEventListener('submit', event => {
    event.preventDefault();
    const location = $('#locationSelect').value;
    if (!location) { $('#locationSelect').focus(); notify('Choose a location to find available parking.'); return; }
    if (new Date(dateInput.value) < new Date()) { notify('Choose a future arrival time.'); dateInput.focus(); return; }
    showResults(location, selectedVehicle, dateInput.value);
  });
  $('#resultsClose').addEventListener('click', () => $('#resultsDrawer').classList.remove('open'));
  $$('.category-card').forEach(card => card.addEventListener('click', () => {
    selectedVehicle = card.dataset.category;
    $$('.vehicle-tab').forEach(tab => {
      const active = tab.dataset.vehicle === selectedVehicle;
      tab.classList.toggle('selected', active);
      tab.setAttribute('aria-selected', String(active));
    });
    $('#parking').scrollIntoView({ behavior: 'smooth', block: 'center' });
    notify(`${selectedVehicle} selected. Choose a location to see available spaces.`);
  }));
  $('#carouselPrev').addEventListener('click', () => $('#categoryTrack').scrollBy({ left: -$('#categoryTrack').clientWidth * .75, behavior: 'smooth' }));
  $('#carouselNext').addEventListener('click', () => $('#categoryTrack').scrollBy({ left: $('#categoryTrack').clientWidth * .75, behavior: 'smooth' }));

  $('#moreButton').addEventListener('click', () => $('#moreMenu').classList.toggle('open'));
  document.addEventListener('click', event => {
    if (!event.target.closest('.nav-more') && !event.target.closest('.more-menu')) $('#moreMenu').classList.remove('open');
  });
  $('#mobileMenu').addEventListener('click', () => {
    const nav = $('#mainNav');
    const open = nav.classList.toggle('open');
    $('#mobileMenu').setAttribute('aria-expanded', String(open));
  });
  $$('#mainNav a').forEach(link => link.addEventListener('click', () => {
    $('#mainNav').classList.remove('open');
    $('#mobileMenu').setAttribute('aria-expanded', 'false');
    $('#moreMenu').classList.remove('open');
  }));
  $('#quickSearch').addEventListener('click', () => { $('#parking').scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(() => $('#locationSelect').focus(), 450); });
  $('#languageButton').addEventListener('click', () => notify('Language options will be available here.'));
  $('#premiumButton').addEventListener('click', () => notify('Premium Pass: priority spaces, member pricing and simpler monthly parking.'));
  $('#nearbyButton').addEventListener('click', () => showResults($('#locationSelect').value || 'nearby', selectedVehicle, dateInput.value));
  $$('.nearby-row').forEach(row => row.addEventListener('click', () => {
    const name = row.dataset.lot;
    notify(`${name} selected. Choose Find Parking to view booking options.`);
    $('#locationSelect').value = $('#locationSelect').value || 'Siliguri, West Bengal';
    $('#parking').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }));
  $$('[data-toast]').forEach(button => button.addEventListener('click', () => notify(button.dataset.toast)));
  $('#videoButton').addEventListener('click', () => notify('How it works: search a space, reserve securely, then scan your QR code to enter.'));
  $('#businessButton').addEventListener('click', () => notify('Business solutions: parking management, access control and occupancy insights.'));
  $('#supportButton').addEventListener('click', () => notify('Support: email hello@parkgo.example or visit the Help Centre.'));

  // Reveal elements as they enter the viewport, with a graceful fallback for older browsers.
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    $$('.feature-item,.category-card,.promo-card,.stat-card,.step-card,.business-banner').forEach((element, index) => {
      element.style.transitionDelay = `${Math.min(index % 6, 5) * 35}ms`;
      element.classList.add('will-reveal');
      observer.observe(element);
    });
  }
})();
