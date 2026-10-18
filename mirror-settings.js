/*  Stream Mirror - Settings > Notes tab
 *  Add to the MAIN tracker page (index.html), right after app.js:
 *      <script src="mirror-settings.js"></script>
 *  It hides the old Notes Sync block and puts the Stream Mirror controls + live preview there.
 */
(function () {
  'use strict';
  function get(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  var CSS = '#tm-set{margin:14px 0;padding:14px;border-radius:14px;background:rgba(77,150,255,.08);border:1px solid rgba(77,150,255,.35);font-family:inherit}' +
    '#tm-set h3{margin:0 0 4px;font-size:15px}#tm-set p{margin:0 0 12px;font-size:12px;opacity:.7;line-height:1.45}' +
    '#tm-set .tm-r{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 0;border-top:1px solid rgba(255,255,255,.08);font-size:13px}' +
    '#tm-set .tm-r small{display:block;opacity:.6;font-size:11px;margin-top:2px}' +
    '#tm-set .sw{position:relative;width:44px;height:24px;flex:none}#tm-set .sw input{opacity:0;position:absolute;inset:0;margin:0;cursor:pointer;z-index:2}' +
    '#tm-set .sw i{position:absolute;inset:0;border-radius:99px;background:#555a6e;transition:.2s}' +
    '#tm-set .sw i::after{content:"";position:absolute;left:3px;top:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:.2s}' +
    '#tm-set .sw input:checked+i{background:#3ddc84}#tm-set .sw input:checked+i::after{transform:translateX(20px)}' +
    '#tm-set .tm-b{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}' +
    '#tm-set button{cursor:pointer;border:0;border-radius:10px;padding:8px 12px;font:600 12px inherit;background:#4d96ff;color:#fff}' +
    '#tm-set button.alt{background:rgba(255,255,255,.12)}' +
    '#tm-set input[type=text]{width:100%;padding:7px 9px;border-radius:8px;border:1px solid rgba(255,255,255,.2);background:rgba(0,0,0,.25);color:inherit;font-size:12px}' +
    '#tm-prev{margin:6px auto 0;width:100%;max-width:340px;aspect-ratio:1/1;border-radius:14px;overflow:hidden;border:2px solid rgba(255,255,255,.18);background:#0f2250}' +
    '#tm-prev iframe{width:100%;height:100%;border:0;display:block}#tm-set .cap{text-align:center;font-size:11px;opacity:.6;margin-top:6px}';

  function viewerURL(preview) {
    var u = new URL('obs-viewer.html', location.href);
    u.searchParams.set('room', get('tm_room', 'tracker'));
    var ws = get('tm_ws', ''); if (ws) u.searchParams.set('ws', ws);
    if (preview) u.searchParams.set('preview', '1');
    return u.href;
  }
  function row(label, sub, control) {
    var r = document.createElement('div'); r.className = 'tm-r';
    var l = document.createElement('div'); l.innerHTML = label + (sub ? '<small>' + sub + '</small>' : '');
    r.appendChild(l); r.appendChild(control); return r;
  }
  function sw(key, def, onChange) {
    var w = document.createElement('label'); w.className = 'sw';
    var i = document.createElement('input'); i.type = 'checkbox'; i.checked = get(key, def) !== '0';
    i.addEventListener('change', function () { set(key, i.checked ? '1' : '0'); if (onChange) onChange(i.checked); });
    w.appendChild(i); w.appendChild(document.createElement('i')); w._input = i; return w;
  }

  function build() {
    var modal = document.getElementById('settings-modal');
    if (!modal) return false;
    if (document.getElementById('tm-set')) return true;
    var host = modal.querySelector('.settings-panel[data-panel="notes"]');
    if (!host) return false;

    /* ---- retire the old Notes Sync block (hidden, not deleted, so app.js keeps working) ---- */
    var ids = ['toggle-sync-enabled', 'input-sync-username', 'input-sync-password', 'input-sync-usercolor', 'row-sync-password', 'row-sync-usercolor'];
    var first = null;
    ids.forEach(function (id) {
      var e = document.getElementById(id); if (!e || !host.contains(e)) return;
      var r = e.closest('.settings-row, .settings-group, .settings-item') || e.parentElement;
      if (r === host) r = e;
      r.style.display = 'none'; r.setAttribute('data-tm-old', '1');
      if (!first || (first.compareDocumentPosition(r) & Node.DOCUMENT_POSITION_PRECEDING)) first = r;
    });
    Array.prototype.forEach.call(host.querySelectorAll('h1,h2,h3,h4,h5,.settings-section-title,.settings-heading,.section-title,.settings-subtitle'), function (h) {
      if (/\bsync\b/i.test(h.textContent) && h.textContent.length < 40 && !h.querySelector('input')) { h.style.display = 'none'; if (!first || (first.compareDocumentPosition(h) & Node.DOCUMENT_POSITION_PRECEDING)) first = h; }
    });
    // description lines directly under the old heading mentioning sync
    Array.prototype.forEach.call(host.querySelectorAll('p,.settings-desc,.settings-note,.settings-hint'), function (p) {
      if (/\bsync/i.test(p.textContent) && !p.closest('#tm-set') && !p.querySelector('input,button')) p.style.display = 'none';
    });

    /* ---- Stream Mirror section ---- */
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    var box = document.createElement('div'); box.id = 'tm-set';
    box.innerHTML = '<h3>\ud83d\udce1 Stream Mirror</h3><p>Shows your viewers a simplified, cartoony live view of what you\'re hovering and clicking. Your Notes page is never copied.</p>';

    box.appendChild(row('Mirroring', 'Send your cursor, hovers and clicks to the viewer', sw('tm_live', '1')));
    var shown = sw('tm_pill', '1', function (on) { lab.textContent = on ? 'Shown' : 'Hidden'; });
    var lab = document.createElement('b'); lab.textContent = shown._input.checked ? 'Shown' : 'Hidden'; lab.style.cssText = 'font-size:12px;margin-right:8px';
    var ctl = document.createElement('div'); ctl.style.cssText = 'display:flex;align-items:center'; ctl.appendChild(lab); ctl.appendChild(shown);
    box.appendChild(row('Mirror status on Notes page', 'Small "Mirroring" chip \u2013 Shown / Hidden (viewers never see it)', ctl));

    var relay = document.createElement('input'); relay.type = 'text'; relay.placeholder = 'ws://localhost:8787  (optional)'; relay.value = get('tm_ws', '');
    var relayWrap = document.createElement('div'); relayWrap.style.cssText = 'width:55%'; relayWrap.appendChild(relay);
    relay.addEventListener('change', function () { set('tm_ws', relay.value.trim()); frame.src = viewerURL(true); });
    box.appendChild(row('Relay (OBS Browser Source)', 'Only needed if you use an OBS Browser Source instead of a window capture', relayWrap));

    var bar = document.createElement('div'); bar.className = 'tm-b';
    var pop = document.createElement('button'); pop.textContent = 'Pop out viewer';
    pop.addEventListener('click', function () { window.open(viewerURL(false), 'tracker-mirror', 'popup,width=720,height=720'); });
    var copy = document.createElement('button'); copy.className = 'alt'; copy.textContent = 'Copy OBS link';
    copy.addEventListener('click', function () {
      var u = viewerURL(false);
      (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(function () {
        copy.textContent = 'Copied \u00b7 use a square source, e.g. 1080\u00d71080'; setTimeout(function () { copy.textContent = 'Copy OBS link'; }, 3500);
      }, function () { prompt('OBS browser source URL:', u); });
    });
    bar.appendChild(pop); bar.appendChild(copy); box.appendChild(bar);

    var prev = document.createElement('div'); prev.id = 'tm-prev';
    var frame = document.createElement('iframe'); frame.title = 'Viewer preview'; frame.src = viewerURL(true);
    prev.appendChild(frame); box.appendChild(prev);
    var cap = document.createElement('div'); cap.className = 'cap'; cap.textContent = 'Live preview \u2013 this is exactly what your viewers see (needs the Notes page open)';
    box.appendChild(cap);

    if (first && first.parentNode) first.parentNode.insertBefore(box, first); else host.insertBefore(box, host.firstChild);
    return true;
  }
  function start() { if (!build()) setTimeout(start, 500); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
