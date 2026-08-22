// ─────────────────────────────────────────────────────────────────────────────
// Abilities & Captures (APC) shared data
// ─────────────────────────────────────────────────────────────────────────────
// Loaded by BOTH index.html (the main tracker) and apc.html (the side panel).
// Keep it free of DOM code so either page can use it.
//
// Image paths:
//   captures  -> assets/capture/<key>.png
//   abilities -> assets/ability/<key>.png
// Every file is a .png. The "locked" look is produced with a CSS filter
// (.apc-item.locked img) rather than a second set of files - see style.css.
//
// To add a new capture/ability later: drop the .png in the right folder and add
// its key to the list below. Add a `name` override only when the auto-generated
// label (underscores -> spaces, "_Capture" stripped) isn't what you want.
// ─────────────────────────────────────────────────────────────────────────────

(function (global) {
  'use strict';

  // Order here = "Game Order" in the panel's sort control.
  const CAPTURE_KEYS = [
    'Banzai_Bill_Capture',
    'Big_Chain_Chomp_Capture',
    'Binoculars_Capture',
    'Bowser_Capture',
    'Bowser_Statue_Capture',
    'Bullet_Bill_Capture',
    'Cactus_Capture',
    'Chain_Chomp_Capture',
    'Chargin_Chuck_Capture',
    'Cheep_Cheep_(Snow)_Capture',
    'Cheep_Cheep_Capture',
    'Coin_Coffer_Capture',
    'Fire_Bro_Capture',
    'Fire_Piranha_Plant_Capture',
    'Frog_Capture',
    'Glydon_Capture',
    'Gold_Chain_Chomp_Capture',
    'Goomba_Capture',
    'Gushen_Capture',
    'Hammer_Bro_Capture',
    'Jizo_Capture',
    'Knucklotec_Fist_Capture',
    'Lakitu_Capture',
    'Lava_Bubble_Capture',
    'Letter_Capture',
    'Manhole_Capture',
    'Meat_Capture',
    'Moe-Eye_Capture',
    'Parabones_Capture',
    'Paragoomba_Capture',
    'Picture_Match_Part_(Goomba)_Capture',
    'Picture_Match_Part_(Mario)_Capture',
    'Poison_Piranha_Plant_Capture',
    'Pokio_Capture',
    'Pole_Capture',
    'Puzzle_Part_(Lake)_Capture',
    'Puzzle_Part_(Metro)_Capture',
    'RC_Car_Capture',
    'Rock_Capture',
    'Rocket_Capture',
    'Sherm_Capture',
    'Shiverian_Racer_Capture',
    'Spark_pylon_Capture',
    'Taxi_Capture',
    'Tree_Capture',
    'T-Rex_Capture',
    'Tropical_Wiggler_Capture',
    'Ty-foo_Capture',
    'Uproot_Capture',
    'Volbonan_Capture',
    'Yoshi_Capture',
    'Zipper_Capture',
  ];

  // Fixed display order for Abilities everywhere they're listed (the Notes
  // Tab requirement picker and, since NOTES_ABILITIES === ABILITIES, the
  // apc.html progress panel too). 'Jump' has been removed entirely - it's
  // not a distinct pickable ability (the main tracker's "High Jump" button
  // is linked to Long_Jump - see ABILITY_LINKS below).
  const ABILITY_KEYS = [
    'Neutral_Throw',
    'Up_Throw',
    'Down_Throw',
    'Spin_Throw',
    'Vault',
    'Crouch',
    'Backflip',
    'Long_Jump',
    'Roll',
    'Roll_Boost',
    'Ground_Pound',
    'Ground_Pound_Jump',
    'Dive',
    'Double_Jump',
    'Triple_Jump',
    'Side_Flip',
    'Spin',
    'Wall_Jump',
    'Ledge_Grab',
    'Climb',
    'Swing',
  ];

  // Only needed where the auto-generated label would be wrong.
  const NAME_OVERRIDES = {
    'Spark_pylon_Capture': 'Spark Pylon',
    'RC_Car_Capture': 'RC Car',
    'Chargin_Chuck_Capture': "Chargin' Chuck",
    'Knucklotec_Fist_Capture': "Knucklotec's Fist",
    'Rocket_Capture': 'Mini Rocket',
  };

  function labelFor(key) {
    if (NAME_OVERRIDES[key]) return NAME_OVERRIDES[key];
    return key.replace(/_Capture$/, '').replace(/_/g, ' ');
  }

  const CAPTURES = CAPTURE_KEYS.map((key, i) => ({
    key, order: i, name: labelFor(key), src: `assets/capture/${key}.png`,
  }));

  const ABILITIES = ABILITY_KEYS.map((key, i) => ({
    key, order: i, name: labelFor(key), src: `assets/ability/${key}.png`,
  }));

  // ── Loading Zone Notes requirement picker: fixed, trimmed capture list ────
  // The full CAPTURES list above (52 entries) stays intact everywhere else
  // (main tracker, apc.html progress panel, save files). The Notes Tab
  // requirement picker only needs the captures that actually gate a specific
  // location, in a fixed order chosen for that picker - so it gets its own
  // shorter, explicitly-ordered list here instead of reusing CAPTURE_KEYS.
  // Anything left out can still appear as a requirement icon if it was picked
  // before being trimmed (APC.findItem still looks it up in the full list);
  // it just won't be selectable from the picker going forward.
  const NOTES_CAPTURE_KEYS = [
    'Frog_Capture',
    'Spark_pylon_Capture',
    'Paragoomba_Capture',
    'Chain_Chomp_Capture',
    'T-Rex_Capture',
    'Bullet_Bill_Capture',
    'Goomba_Capture',
    'Knucklotec_Fist_Capture',
    'Rocket_Capture',
    'Glydon_Capture',
    'Zipper_Capture',
    'Cheep_Cheep_Capture',
    'Uproot_Capture',
    'Fire_Bro_Capture',
    'Sherm_Capture',
    'Picture_Match_Part_(Goomba)_Capture',
    'Taxi_Capture',
    'Ty-foo_Capture',
    'Shiverian_Racer_Capture',
    'Gushen_Capture',
    'Lava_Bubble_Capture',
    'Volbonan_Capture',
    'Hammer_Bro_Capture',
    'Pokio_Capture',
    'Jizo_Capture',
    'Parabones_Capture',
    'Banzai_Bill_Capture',
    'Picture_Match_Part_(Mario)_Capture',
    'Yoshi_Capture',
  ];

  const NOTES_CAPTURES = NOTES_CAPTURE_KEYS
    .map((key, i) => {
      const master = CAPTURES.find((c) => c.key === key);
      return master ? Object.assign({}, master, { order: i }) : null;
    })
    .filter(Boolean);

  // Abilities aren't trimmed, but are exposed under the same name so the
  // Notes Tab picker code can treat both groups identically.
  const NOTES_ABILITIES = ABILITIES;

  // ── Links to the main tracker's icon row ───────────────────────────────────
  // The main tracker keeps its own 4 captures / 3 abilities in state.captures
  // and state.abilities. Those stay the source of truth for the linked entries
  // so nothing can drift; the panel reads/writes through them. Toggling either
  // side updates the other (and therefore OBS, since it all rides on the same
  // saved state).
  const CAPTURE_LINKS = {
    // main tracker key -> panel key
    parabones: 'Parabones_Capture',
    banzai:    'Banzai_Bill_Capture',
    wire:      'Spark_pylon_Capture',
    bowser:    'Bowser_Capture',
    golden:    'Gold_Chain_Chomp_Capture',
  };
  const ABILITY_LINKS = {
    jump: 'Long_Jump',  // "High Jump" on the main tracker uses the Long Jump art
    cap:  'Vault',      // "Cap Bounce"
    wall: 'Wall_Jump',
  };

  // Reverse lookups: panel key -> main tracker key
  const CAPTURE_LINKS_REV = {};
  for (const [k, v] of Object.entries(CAPTURE_LINKS)) CAPTURE_LINKS_REV[v] = k;
  const ABILITY_LINKS_REV = {};
  for (const [k, v] of Object.entries(ABILITY_LINKS)) ABILITY_LINKS_REV[v] = k;

  function linkedTrackerKey(kind, key) {
    return kind === 'captures' ? CAPTURE_LINKS_REV[key] : ABILITY_LINKS_REV[key];
  }

  // Look up a single {key, name, src} entry by kind + key. Used by the
  // Loading Zone Notes requirement picker (notes.html / app.js) so it can
  // reuse this same Captures/Abilities list instead of keeping its own copy.
  function findItem(kind, key) {
    const list = kind === 'captures' ? CAPTURES : ABILITIES;
    return list.find((item) => item.key === key) || null;
  }

  // ── Read / write against a tracker state object ────────────────────────────
  // `kind` is 'captures' or 'abilities'. Linked entries live in state.captures /
  // state.abilities; everything else lives in state.apc.<kind>.
  function ensure(state) {
    if (!state.apc) state.apc = { captures: {}, abilities: {} };
    if (!state.apc.captures) state.apc.captures = {};
    if (!state.apc.abilities) state.apc.abilities = {};
    return state;
  }

  function isUnlocked(state, kind, key) {
    const tk = linkedTrackerKey(kind, key);
    if (tk) return !!(state[kind] && state[kind][tk]);
    return !!(state.apc && state.apc[kind] && state.apc[kind][key]);
  }

  function setUnlocked(state, kind, key, value) {
    ensure(state);
    value = !!value;
    const tk = linkedTrackerKey(kind, key);
    if (tk) {
      if (!state[kind]) state[kind] = {};
      state[kind][tk] = value;
    }
    // Mirror it into apc.* too, so a save file always carries the full picture
    // even for the linked entries.
    state.apc[kind][key] = value;
    return value;
  }

  function countUnlocked(state, kind) {
    const list = kind === 'captures' ? CAPTURES : ABILITIES;
    let n = 0;
    for (const item of list) if (isUnlocked(state, kind, item.key)) n++;
    return n;
  }


  const CHANNEL_NAME = 'smo_tracker_apc';
  const SENDER_ID = Math.random().toString(36).slice(2);

  function makeChannel(onMessage) {
    let ch = null;

    function deliver(data) {
      if (data && data.sender === SENDER_ID) return;
      onMessage(data || { type: 'apc-changed' });
    }

    try {
      ch = new BroadcastChannel(CHANNEL_NAME);
      ch.onmessage = (e) => deliver(e.data);
    } catch (err) { /* not available - the other two routes still apply */ }

    window.addEventListener('message', (e) => {
      if (e.data && e.data.__apc) deliver(e.data);
    });

    window.addEventListener('storage', (e) => {
      if (e.key === 'tracker_state') deliver({ type: 'apc-changed' });
    });

    // Every window that could be holding the other copy: our parent, our own
    // iframes, and a popped-out window (or the opener we were popped out of).
    function peers() {
      const out = [];
      try { if (window.parent && window.parent !== window) out.push(window.parent); } catch (e) {}
      try { if (window.opener) out.push(window.opener); } catch (e) {}
      try {
        document.querySelectorAll('iframe').forEach(f => {
          if (f.contentWindow) out.push(f.contentWindow);
        });
      } catch (e) {}
      return out;
    }

    return {
      post(msg) {
        const payload = Object.assign({ __apc: true, sender: SENDER_ID }, msg || {});
        if (ch) { try { ch.postMessage(payload); } catch (e) {} }
        peers().forEach(w => { try { w.postMessage(payload, '*'); } catch (e) {} });
      },
    };
  }

  console.log('SMO tracker apc-data.js v2');

  global.APC = {
    CAPTURES, ABILITIES,
    NOTES_CAPTURES, NOTES_ABILITIES,
    CAPTURE_LINKS, ABILITY_LINKS,
    linkedTrackerKey, findItem,
    ensure, isUnlocked, setUnlocked, countUnlocked,
    makeChannel,
  };
})(window);