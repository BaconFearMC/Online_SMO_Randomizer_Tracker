/*  Stream Mirror - Settings > Notes > "Stream Mirror" menu  (markup lives in index.html)
 *  Needs, in index.html after app.js:   <script src="mirror-settings.js"></script>
 */
(function () {
  'use strict';
  function get(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  var $ = function (id) { return document.getElementById(id); };
  var ROOM = get('tm_room', 'tracker');

  function viewerURL(preview) {
    var u = new URL('obs-viewer.html', location.href);
    u.searchParams.set('room', ROOM);
    var ws = get('tm_ws', ''); if (ws) u.searchParams.set('ws', ws);
    if (preview) u.searchParams.set('preview', '1');
    return u.href;
  }

  function bind() {
    var menu = $('subsection-stream-mirror');
    if (!menu) return false;
    if (menu.dataset.bound) return true;
    menu.dataset.bound = '1';

    var tog = $('toggle-stream-mirror'), status = $('mirror-status'), relay = $('input-mirror-relay');
    var prev = $('mirror-preview'), frame = null;

    tog.checked = get('tm_live', '1') !== '0';
    tog.addEventListener('change', function () { set('tm_live', tog.checked ? '1' : '0'); paint(); });

    relay.value = get('tm_ws', '');
    relay.addEventListener('change', function () { set('tm_ws', relay.value.trim()); if (frame) frame.src = viewerURL(true); });

    $('btn-mirror-popout').addEventListener('click', function () { window.open(viewerURL(false), 'tracker-mirror', 'popup,width=720,height=720'); });
    var copy = $('btn-mirror-copy');
    copy.addEventListener('click', function () {
      var u = viewerURL(false);
      (navigator.clipboard ? navigator.clipboard.writeText(u) : Promise.reject()).then(function () {
        copy.textContent = 'Copied! Use a square source'; setTimeout(function () { copy.textContent = 'Copy Link'; }, 2500);
      }, function () { prompt('OBS browser source URL:', u); });
    });

    // Status: the Notes page sends a heartbeat every 2s while it is open and mirroring.
    var seen = 0;
    try { var ch = new BroadcastChannel('tracker-mirror:' + ROOM); ch.onmessage = function () { seen = Date.now(); }; } catch (e) {}
    function paint() {
      var on = tog.checked, alive = Date.now() - seen < 5000;
      status.textContent = !on ? 'Paused' : alive ? 'Live \u2013 Notes page connected' : 'Notes page not open';
      status.style.color = !on ? '' : alive ? '#3ddc84' : '';
    }
    setInterval(paint, 1500); paint();

    // Preview only exists while the menu is open (nothing runs when it's closed).
    function syncPreview() {
      if (menu.open && !frame) {
        frame = document.createElement('iframe');
        frame.title = 'Viewer preview'; frame.src = viewerURL(true);
        frame.style.cssText = 'width:100%;height:100%;border:0;display:block';
        prev.appendChild(frame);
      } else if (!menu.open && frame) { frame.remove(); frame = null; }
    }
    menu.addEventListener('toggle', syncPreview); syncPreview();
    return true;
  }
  function start() { if (!bind()) setTimeout(start, 400); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
