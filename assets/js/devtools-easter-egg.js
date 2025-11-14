(function(){
  'use strict';

  var MESSAGES_URL = 'assets/messages/console-easter-eggs.json';
  var lastShownAt = 0;
  var cooldownMs = 1500; // evita spam em toggles muito rápidos
  var devtoolsOpen = false;
  var pollingTimer = null;
  var messagesCache = null;
  

  function isDevToolsOpen() {
    // Heurística simples baseada na diferença de outer/inner.
    // Cobre painéis laterais e inferiores.
    var widthThreshold = 160;
    var heightThreshold = 160;
    var wDiff = Math.abs(window.outerWidth - window.innerWidth);
    var hDiff = Math.abs(window.outerHeight - window.innerHeight);
    return (wDiff > widthThreshold) || (hDiff > heightThreshold);
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function styleLog(title, message) {
    try {
      // Cores claras para melhor contraste em DevTools com tema escuro
      var titleCss = [
        'color:#f8fafc',          // quase branco
        'background:#166534',     // verde oxóssi (fundo para contraste)
        'padding:3px 8px',
        'border-radius:8px',
        'font-size:18px',
        'font-weight:800',
        'font-family:Inter,system-ui,Segoe UI,Roboto,Arial'
      ].join(';');
      var msgCss   = [
        'color:#e5e7eb',          // cinza claro
        'font-size:13px',
        'font-weight:600',
        'font-family:Inter,system-ui,Segoe UI,Roboto,Arial'
      ].join(';');
      console.log('%c' + title + '%c\n' + message, titleCss, msgCss);
    } catch (_) {
      console.log(title + '\n' + message);
    }
  }

  function showMessage() {
    var now = Date.now();
    if (now - lastShownAt < cooldownMs) return;
    lastShownAt = now;

    var render = function(list){
      if (!Array.isArray(list) || list.length === 0) return;
      var msg = pickRandom(list);
      styleLog('👋 Olá, dev curioso(a)!', msg);
    };

    if (messagesCache) {
      render(messagesCache);
      return;
    }

    fetch(MESSAGES_URL, { cache: 'no-store' })
      .then(function(r){ return r.ok ? r.json() : Promise.reject(); })
      .then(function(list){ messagesCache = list; render(list); })
      .catch(function(){ /* usar exclusivamente o JSON: sem fallback */ });
  }

  function onStateChange(isOpen) {
    if (isOpen && !devtoolsOpen) {
      devtoolsOpen = true;
      showMessage();
    } else if (!isOpen && devtoolsOpen) {
      devtoolsOpen = false;
    }
  }

  function checkOnce() {
    onStateChange(isDevToolsOpen());
  }

  function startPolling() {
    if (pollingTimer) return;
    pollingTimer = setInterval(checkOnce, 700);
  }

  function stopPolling() {
    if (pollingTimer) {
      clearInterval(pollingTimer);
      pollingTimer = null;
    }
  }

  // Inicia listeners leves
  window.addEventListener('resize', checkOnce, { passive: true });
  window.addEventListener('keydown', function(e){
    // Muitos abrem com F12 (123) ou Ctrl+Shift+I
    if (e && (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')))) {
      // aguarda pequena janela para o painel abrir
      setTimeout(checkOnce, 300);
    }
  }, true);

  document.addEventListener('visibilitychange', function(){
    if (document.visibilityState === 'visible') {
      startPolling();
      checkOnce();
    } else {
      stopPolling();
    }
  });

  

  // Arranque inicial
  startPolling();
  // Checa imediatamente — como script defer, roda antes do DOMContentLoaded
  checkOnce();
  if (document.readyState === 'complete') {
    checkOnce();
  } else {
    window.addEventListener('load', checkOnce, { once: true });
  }
})();
