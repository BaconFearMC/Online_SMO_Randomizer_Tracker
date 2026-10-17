/*  Mirror - Settings toggle
 *  Add to the MAIN tracker page (index.html), after app.js:
 *      <script src="mirror-settings.js"></script>
 *  Adds a "Mirroring controls" checkbox to the Settings window. It shows/hides the
 *  Mirroring pill on the Notes page (works for the side panel and the popped-out window).
 */
(function () {
  'use strict';
  var KEY = 'tm_pill';
  function get() { try { return localStorage.getItem(KEY) !== '0'; } catch (e) { return true; } }
  function set(v) { try { localStorage.setItem(KEY, v ? '1' : '0'); } catch (e) {} }

  function build() {
    var modal = document.getElementById('settings-modal');
    if (!modal || document.getElementById('tm-settings-row')) return !!document.getElementById('tm-settings-row');
    var panels = modal.querySelectorAll('.settings-panel');
    var host = null;
    panels.forEach(function (p) { if (/note/i.test(p.dataset.panel || '')) host = p; });   // prefer the Notes tab
    host = host || modal.querySelector('.settings-panel.active') || panels[panels.length - 1] || modal.querySelector('.settings-body');
    if (!host) return false;

    var row = document.createElement('div');
    row.className = 'settings-row'; row.id = 'tm-settings-row';
    var label = document.createElement('label');
    label.htmlFor = 'tm-settings-toggle';
    label.textContent = 'Mirroring controls (OBS viewer)';
    label.style.cursor = 'pointer';
    var box = document.createElement('input');
    box.type = 'checkbox'; box.id = 'tm-settings-toggle'; box.checked = get();
    box.addEventListener('change', function () { set(box.checked); });
    row.appendChild(label); row.appendChild(box);
    host.appendChild(row);

    // keep the checkbox in sync each time Settings opens
    new MutationObserver(function () { box.checked = get(); }).observe(modal, { attributes: true, attributeFilter: ['class'] });
    return true;
  }
  function start() { if (!build()) setTimeout(start, 500); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
