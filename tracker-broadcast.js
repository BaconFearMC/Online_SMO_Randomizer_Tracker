/*  Stream Mirror - broadcaster (runs on the NOTES page)
 *  <script src="tracker-broadcast.js"></script>   right before </body>
 *
 *  It does NOT copy the page. It sends a tiny "scene": kingdom columns, zone names + icons,
 *  what you're hovering, your clicks and mouse dot, and whether a + menu is open
 *  (the viewers then only see "Marking <zone>").
 *  Optional attributes: data-room="x"  data-ws="ws://localhost:8787"
 */
(function () {
  'use strict';
  if (window.__trackerMirror) return;
  window.__trackerMirror = true;

  var SELF = document.currentScript;
  var ds = (SELF && SELF.dataset) || {};
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }
  var ROOM = ds.room || store('tm_room') || 'tracker';
  var WS = ds.ws || store('tm_ws') || '';
  var live = store('tm_live') !== '0';
  var chipOn = store('tm_pill') !== '0';
  var channel = new BroadcastChannel('tracker-mirror:' + ROOM);

  /* ---------- transport ---------- */
  var ws = null, wsOpen = false;
  function connectWS() {
    if (!WS) return;
    try { var u = new URL(WS); u.searchParams.set('room', ROOM); ws = new WebSocket(u.href); } catch (e) { return; }
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
  function clean(s, n) { s = (s || '').replace(/\s+/g, ' ').trim(); return s.length > (n || 40) ? s.slice(0, (n || 40) - 1) + '\u2026' : s; }
  function r4(n) { return Math.round(n * 10000) / 10000; }
  function inUI(el) { return el && el.closest && el.closest('[data-bc-ui]'); }

  var lastPlus = { z: '', k: '' };       // which row's + button was pressed last
  function zoneName(row) {
    var n = row && (row.querySelector('.zone-name-main') || row.querySelector('.zone-name'));
    return n ? clean(n.textContent) : '';
  }
  function colTitle(col) {
    var t = col && (col.querySelector('.col-title') || col.querySelector('.kingdom-col-header'));
    return t ? clean(t.textContent) : '';
  }

  /* ---------- the scene ---------- */
  var lastScene = '';
  function buildScene() {
    var vw = window.innerWidth, vh = window.innerHeight, cols = [];
    document.querySelectorAll('.kingdom-col').forEach(function (col) {
      var cr = col.getBoundingClientRect();
      if (cr.width < 8 || cr.height < 8 || cr.right < 0 || cr.left > vw || cr.bottom < 0 || cr.top > vh) return;
      var tEl = col.querySelector('.col-title') || col.querySelector('.kingdom-col-header');
      var rows = [];
      col.querySelectorAll('.zone-row').forEach(function (row) {
        var rr = row.getBoundingClientRect();
        var top = Math.max(rr.top, cr.top, 0), bot = Math.min(rr.bottom, cr.bottom, vh);
        if (bot - top < 3 || rr.width < 8) return;
        var nm = row.querySelector('.zone-name-main') || row.querySelector('.zone-name');
        var icons = [];
        row.querySelectorAll('.zone-req-icon').forEach(function (im) {
          var s = im.currentSrc || im.src || '';
          if (s && icons.length < 3 && (s.indexOf('data:') !== 0 || s.length < 2000)) icons.push(s);
        });
        rows.push({
          n: zoneName(row), c: nm ? getComputedStyle(nm).color : '',
          r: [r4(Math.max(rr.left, 0) / vw), r4(top / vh), r4(Math.min(rr.width, vw) / vw), r4((bot - top) / vh)],
          i: icons, d: row.classList.contains('paint-has-dest') ? 1 : 0
        });
      });
      cols.push({
        k: col.dataset.kingdom || colTitle(col), n: colTitle(col),
        c: tEl ? getComputedStyle(tEl).color : '',
        r: [r4(Math.max(cr.left, 0) / vw), r4(Math.max(cr.top, 0) / vh), r4(Math.min(cr.width, vw) / vw), r4(Math.min(cr.height, vh) / vh)],
        rows: rows
      });
    });
    var ov = document.querySelector('.req-picker-overlay');
    return {
      t: 'scene', vw: vw, vh: vh, cols: cols,
      mark: ov ? { z: lastPlus.z, k: lastPlus.k, p: ov.closest('.paint-find-area') ? 1 : 0 } : null
    };
  }
  var timer = 0, lastAt = 0, forced = false;
  function snap(force) {
    if (!live || !document.body) return;
    lastAt = Date.now();
    var sc = buildScene(), sig = JSON.stringify(sc);
    if (!force && sig === lastScene) return;
    lastScene = sig;
    send(sc);
  }
  function schedule(force) {
    forced = forced || !!force;
    if (timer) return;
    timer = setTimeout(function () { timer = 0; var f = forced; forced = false; snap(f); }, Math.max(0, 90 - (Date.now() - lastAt)));
  }
  new MutationObserver(function () { schedule(); }).observe(document.documentElement, { subtree: true, childList: true, attributes: true, characterData: true });
  ['input', 'change', 'transitionend', 'animationend'].forEach(function (ev) { document.addEventListener(ev, function () { schedule(); }, true); });
  window.addEventListener('resize', function () { schedule(true); });

  /* ---------- mouse, hover, clicks ---------- */
  var mx = -1, my = -1, down = false, raf = 0, hoverKey = '~';

  function controlLabel(t) {
    var c = t.closest && t.closest('button, [role=button], img, a, input, select, textarea, label');
    if (!c) return '';
    if (c.classList.contains('zone-req-add')) return 'the + button';
    return clean(c.getAttribute('aria-label') || c.getAttribute('title') || c.getAttribute('alt') || (c.tagName === 'INPUT' || c.tagName === 'TEXTAREA' ? 'a text box' : c.textContent), 32);
  }
  function describe(t) {
    var row = t.closest && t.closest('.zone-row'), col = t.closest && t.closest('.kingdom-col');
    return { k: col ? (col.dataset.kingdom || colTitle(col)) : '', z: row ? zoneName(row) : '', l: controlLabel(t) };
  }
  function setHover(el) {
    var d = el && !inUI(el) ? describe(el) : { k: '', z: '', l: '' };
    var key = d.k + '|' + d.z + '|' + d.l;
    if (key === hoverKey) return;
    hoverKey = key;
    send({ t: 'h', k: d.k, z: d.z, l: d.l });
  }
  function sendMouse(out) { raf = 0; send({ t: 'm', x: mx, y: my, d: down ? 1 : 0, out: out ? 1 : 0, vw: window.innerWidth, vh: window.innerHeight }); }

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY; setHover(e.target);
    if (!raf) raf = requestAnimationFrame(function () { sendMouse(false); });
  }, true);
  document.addEventListener('mousedown', function (e) {
    if (inUI(e.target)) return;
    mx = e.clientX; my = e.clientY; down = true;
    var add = e.target.closest && e.target.closest('.zone-req-add');
    if (add) { var d = describe(add); lastPlus = { z: d.z, k: d.k }; }
    var d2 = describe(e.target);
    send({ t: 'c', x: mx, y: my, b: e.button, k: d2.k, z: d2.z, l: d2.l });
    sendMouse(false); schedule();
  }, true);
  document.addEventListener('mouseup', function (e) { down = false; mx = e.clientX; my = e.clientY; sendMouse(false); schedule(); }, true);
  document.documentElement.addEventListener('mouseleave', function () { sendMouse(true); hoverKey = '~'; setHover(null); });
  document.addEventListener('scroll', function () { schedule(); }, true);

  setInterval(function () { send({ t: 'hb', vw: window.innerWidth, vh: window.innerHeight }); }, 2000);

  /* ---------- tiny status chip (optional, hidden from viewers; toggle lives in Settings > Notes) ---------- */
  var chip;
  function paintChip() {
    if (!chip) return;
    chip.style.display = chipOn ? '' : 'none';
    chip.className = live ? 'on' : '';
    chip.lastChild.textContent = live ? 'Mirroring' : 'Mirror paused';
  }
  function buildChip() {
    var css = document.createElement('style');
    css.textContent = '#tm-chip{position:fixed;left:12px;bottom:12px;z-index:2147483647;display:flex;align-items:center;gap:7px;padding:6px 12px;' +
      'border-radius:999px;background:rgba(16,16,22,.8);border:1px solid rgba(255,255,255,.14);color:#e9e9f2;font:700 11px/1 system-ui,sans-serif;opacity:.55;pointer-events:none}' +
      '#tm-chip i{width:8px;height:8px;border-radius:50%;background:#666}#tm-chip.on i{background:#3ddc84;box-shadow:0 0 8px #3ddc84}';
    chip = document.createElement('div');
    chip.id = 'tm-chip'; chip.setAttribute('data-bc-ui', '');
    chip.innerHTML = '<i></i><span></span>';
    document.documentElement.appendChild(css); document.documentElement.appendChild(chip);
    paintChip();
  }
  window.addEventListener('storage', function (e) {      // flipped from Settings in the main tracker
    if (e.key === 'tm_pill') { chipOn = e.newValue !== '0'; paintChip(); }
    if (e.key === 'tm_live') { live = e.newValue !== '0'; paintChip(); if (live) snap(true); }
  });

  function start() { buildChip(); connectWS(); snap(true); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  window.addEventListener('load', function () { setTimeout(function () { snap(true); }, 400); });
})();
