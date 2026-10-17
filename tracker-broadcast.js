/*  Tracker Mirror - broadcaster
 *  Add ONE line at the end of your tracker page (right after the last </script>):
 *      <script src="tracker-broadcast.js"></script>
 *  Optional attributes:  data-room="myroom"  data-ws="ws://localhost:8787"  data-ui="0"
 *
 *  It sends: a clean copy of the page (no scripts, no storage), the window size,
 *  the mouse position, hover target, clicks and scroll positions.
 */
(function () {
  'use strict';
  if (window.__trackerMirror) return;
  window.__trackerMirror = true;

  var SELF = document.currentScript;
  var ds = (SELF && SELF.dataset) || {};
  var store = function (k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; };
  var ROOM = ds.room || store('tm_room') || 'tracker';
  var WS = ds.ws || store('tm_ws') || '';
  var live = store('tm_live') !== '0';
  var channel = new BroadcastChannel('tracker-mirror:' + ROOM);

  /* ---------- transport ---------- */
  var ws = null, wsOpen = false;
  function connectWS() {
    if (!WS) return;
    try {
      var u = new URL(WS); u.searchParams.set('room', ROOM);
      ws = new WebSocket(u.href);
    } catch (e) { return; }
    ws.onopen = function () { wsOpen = true; snap(true); };
    ws.onmessage = function (e) { try { onMessage(JSON.parse(e.data)); } catch (x) {} };
    ws.onclose = function () { wsOpen = false; setTimeout(connectWS, 2000); };
    ws.onerror = function () { try { ws.close(); } catch (e) {} };
  }
  function send(msg) {
    if (!live) return;
    channel.postMessage(msg);
    if (wsOpen) ws.send(JSON.stringify(msg));
  }
  function onMessage(m) { if (m && m.t === 'hello') snap(true); }
  channel.onmessage = function (e) { onMessage(e.data); };

  /* ---------- helpers ---------- */
  function pathOf(el) {          // child-index path from <body> to el
    var p = [];
    while (el && el !== document.body) {
      var par = el.parentElement;
      if (!par) return null;
      p.push(Array.prototype.indexOf.call(par.children, el));
      el = par;
    }
    return el === document.body ? p.reverse() : null;
  }
  function attrsOf(el) {
    var o = {};
    for (var i = 0; i < el.attributes.length; i++) o[el.attributes[i].name] = el.attributes[i].value;
    return o;
  }

  /* ---------- page snapshot ---------- */
  var lastBody = '', lastHead = '', timer = 0, lastAt = 0, forced = false;

  function collectHead() {
    var out = [];
    var nodes = document.head.querySelectorAll('style, link[rel~="stylesheet"]');
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (n.tagName === 'STYLE') out.push({ css: n.textContent });
      else if (n.href) out.push({ href: n.href });
    }
    return out;
  }

  function cloneBody() {
    var body = document.body;
    var clone = body.cloneNode(true);
    var a = body.querySelectorAll('*'), b = clone.querySelectorAll('*');
    for (var i = 0; i < a.length; i++) {
      var s = a[i], c = b[i], tag = s.tagName;
      if (tag === 'SCRIPT') { c.textContent = ''; c.removeAttribute('src'); continue; }
      if (tag === 'TEXTAREA') c.textContent = s.value;
      else if (tag === 'INPUT') {
        if (s.type === 'checkbox' || s.type === 'radio') { if (s.checked) c.setAttribute('checked', ''); else c.removeAttribute('checked'); }
        else c.setAttribute('value', s.value);
      } else if (tag === 'SELECT') {
        for (var j = 0; j < s.options.length; j++) {
          if (s.options[j].selected) c.options[j].setAttribute('selected', ''); else c.options[j].removeAttribute('selected');
        }
      }
      if (s.scrollTop || s.scrollLeft) c.setAttribute('data-bc-s', s.scrollTop + ',' + s.scrollLeft);
    }
    return clone;
  }

  function snap(force) {
    if (!live || !document.body) return;
    lastAt = Date.now();
    var clone = cloneBody();
    var bodyHTML = clone.innerHTML;
    var headItems = collectHead();
    var headSig = JSON.stringify(headItems);
    var headChanged = force || headSig !== lastHead;
    if (!force && !headChanged && bodyHTML === lastBody) return;
    lastBody = bodyHTML; lastHead = headSig;
    var cs = getComputedStyle(document.body);
    send({
      t: 'snap',
      vw: window.innerWidth, vh: window.innerHeight,
      base: document.baseURI,
      htmlAttrs: attrsOf(document.documentElement),
      bodyAttrs: attrsOf(document.body),
      bg: cs.backgroundColor,
      head: headChanged ? headItems : null,
      body: bodyHTML,
      ds: [window.scrollX, window.scrollY]
    });
    refreshHover();
  }
  function schedule(force) {
    forced = forced || !!force;
    if (timer) return;
    timer = setTimeout(function () { timer = 0; var f = forced; forced = false; snap(f); }, Math.max(0, 100 - (Date.now() - lastAt)));
  }

  var mo = new MutationObserver(function () { schedule(); });
  function startObserving() {
    mo.observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true });
    mo.observe(document.head, { subtree: true, childList: true, characterData: true, attributes: true });
    mo.observe(document.documentElement, { attributes: true });
  }
  ['input', 'change', 'transitionend', 'animationend'].forEach(function (ev) {
    document.addEventListener(ev, function () { schedule(); }, true);
  });
  window.addEventListener('resize', function () { schedule(true); });

  /* ---------- mouse, hover, clicks, scroll ---------- */
  var mx = -1, my = -1, down = false, raf = 0, hoverKey = '~';

  function sendMouse(out) {
    raf = 0;
    send({ t: 'm', x: mx, y: my, d: down ? 1 : 0, out: out ? 1 : 0 });
  }
  function setHover(el) {
    var p = el && el.closest && !el.closest('[data-bc-ui]') ? pathOf(el) : null;
    var key = p ? p.join(',') : '';
    if (key === hoverKey) return;
    hoverKey = key;
    send({ t: 'h', p: p });
  }
  function refreshHover() {
    if (mx < 0) return;
    setHover(document.elementFromPoint(mx, my));
  }
  function inUI(e) { return e.target && e.target.closest && e.target.closest('[data-bc-ui]'); }

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    setHover(e.target);
    if (!raf) raf = requestAnimationFrame(function () { sendMouse(false); });
  }, true);
  document.addEventListener('mousedown', function (e) {
    if (inUI(e)) return;
    mx = e.clientX; my = e.clientY; down = true;
    send({ t: 'c', x: mx, y: my, b: e.button });
    sendMouse(false);
  }, true);
  document.addEventListener('mouseup', function (e) {
    down = false; mx = e.clientX; my = e.clientY; sendMouse(false);
    schedule();
  }, true);
  document.documentElement.addEventListener('mouseleave', function () { sendMouse(true); hoverKey = '~'; });

  var scrollTimer = 0;
  document.addEventListener('scroll', function (e) {
    var tgt = e.target, p;
    if (tgt === document) send({ t: 's', p: null, top: window.scrollY, left: window.scrollX });
    else if ((p = pathOf(tgt)) !== null) send({ t: 's', p: p, top: tgt.scrollTop, left: tgt.scrollLeft });
    clearTimeout(scrollTimer); scrollTimer = setTimeout(refreshHover, 60);
  }, true);

  /* heartbeat so the viewer knows the tracker is alive */
  setInterval(function () { send({ t: 'hb', vw: window.innerWidth, vh: window.innerHeight }); }, 2000);

  /* ---------- tiny control pill (outside <body>, never mirrored) ---------- */
  function buildUI() {
    if (ds.ui === '0') return;
    var css = document.createElement('style');
    css.textContent =
      '#tm-pill{position:fixed;left:12px;bottom:12px;z-index:2147483647;display:flex;align-items:center;gap:6px;' +
      'padding:5px 6px 5px 10px;border-radius:999px;background:rgba(16,16,22,.82);backdrop-filter:blur(8px);' +
      'border:1px solid rgba(255,255,255,.14);color:#e9e9f2;font:600 12px/1 system-ui,Segoe UI,sans-serif;' +
      'opacity:.5;transition:opacity .2s;box-shadow:0 4px 18px rgba(0,0,0,.4)}' +
      '#tm-pill:hover{opacity:1}' +
      '#tm-pill .tm-dot{width:8px;height:8px;border-radius:50%;background:#555;transition:background .2s,box-shadow .2s}' +
      '#tm-pill.on .tm-dot{background:#3ddc84;box-shadow:0 0 8px #3ddc84}' +
      '#tm-pill button{all:unset;cursor:pointer;padding:5px 9px;border-radius:999px;background:rgba(255,255,255,.1);font:600 11px/1 system-ui,sans-serif;color:#e9e9f2}' +
      '#tm-pill button:hover{background:rgba(255,255,255,.2)}';
    var pill = document.createElement('div');
    pill.id = 'tm-pill'; pill.setAttribute('data-bc-ui', '');
    pill.innerHTML = '<span class="tm-dot"></span><span class="tm-label"></span>' +
      '<button data-a="toggle"></button><button data-a="pop">Pop-out</button><button data-a="copy">Copy OBS link</button>';
    var label = pill.querySelector('.tm-label'), tog = pill.querySelector('[data-a=toggle]');
    function paint() {
      pill.classList.toggle('on', live);
      label.textContent = live ? 'Mirroring' : 'Paused';
      tog.textContent = live ? 'Pause' : 'Start';
    }
    function viewerURL() {
      var u = new URL('obs-viewer.html', SELF && SELF.src ? SELF.src : location.href);
      u.searchParams.set('room', ROOM);
      if (WS) u.searchParams.set('ws', WS);
      return u.href;
    }
    pill.addEventListener('click', function (e) {
      var a = e.target.getAttribute && e.target.getAttribute('data-a');
      if (a === 'toggle') { live = !live; store('tm_live', live ? '1' : '0'); paint(); if (live) snap(true); }
      if (a === 'pop') window.open(viewerURL(), 'tracker-mirror', 'popup,width=960,height=540');
      if (a === 'copy') {
        var url = viewerURL();
        (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(function () {
          e.target.textContent = 'Copied!'; setTimeout(function () { e.target.textContent = 'Copy OBS link'; }, 1200);
        }, function () { prompt('OBS browser source URL:', url); });
      }
    });
    paint();
    document.documentElement.appendChild(css);
    document.documentElement.appendChild(pill);
  }

  function start() {
    buildUI(); startObserving(); connectWS(); snap(true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  /* the tracker builds its content with JS: send again once it has settled */
  window.addEventListener('load', function () { setTimeout(function () { snap(true); }, 400); });
})();
