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
    'Coin_Grind_Capture',
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

  // ── Kingdom Boss Refights (Notes Tab: Kingdom tab, "Refights" side) ────
  // Each refight is paired with the Capture/Ability needed to beat it again;
  // that pairing is what shows in parentheses after the refight's name and
  // as a second icon riding alongside the refight's own icon.
  // Images live at assets/refight/<filename>.png (new folder).
  const REFIGHT_ENTRIES = [
    { key: 'Knucklotec_Refight',    name: 'Knucklotec Refight',   src: 'assets/refight/refightknucklotec.png',        pair: { kind: 'captures',  key: 'Knucklotec_Fist_Capture' }, colors: ['#7FB9D1', '#D6B65E'] },
    { key: 'Torkdrift_Refight',     name: 'Torkdrift Refight',    src: 'assets/refight/refighttorkdrift.png',         pair: { kind: 'captures',  key: 'Uproot_Capture' },           colors: ['#DAD6CA', '#7981B2'] },
    { key: 'Mechawiggler_Refight',  name: 'Mechawiggler Refight', src: 'assets/refight/refightmechawiggler.png',      pair: { kind: 'captures',  key: 'Sherm_Capture' },            colors: ['#2E3B3C', '#E8893F'] },
    { key: 'Mollesque_Refight',     name: 'Mollesque Refight',    src: 'assets/refight/refightmollusquelanceur.png',  pair: { kind: 'captures',  key: 'Gushen_Capture' },           colors: ['#526DAF', '#DEAF38'] },
    { key: 'Cookatiel_Refight',     name: 'Cookatiel Refight',    src: 'assets/refight/refightcookatiel.png',    pair: { kind: 'captures',  key: 'Lava_Bubble_Capture' },          colors: ['#AB8AC1', '#DF3770'] },
    { key: 'Dragon_Refight',        name: 'Dragon Refight',       src: 'assets/refight/refightdragon.png',       pair: { kind: 'abilities', key: 'Ground_Pound' },                 colors: ['#2C3B4D', '#765C83'] },
  ];

  // ── Kingdoms (Notes Tab: Kingdom tab, "Reaching Kingdoms" side) ─────────
  // Reuses the same icon files already used for the loading-zone kingdom
  // headers (assets/<icon>.png) - nothing new needed on disk for these.
  const KINGDOM_ENTRIES = [
    { key: 'Cap',        name: 'Cap',         src: 'assets/Cap.png',      color: '#fff500' },
    { key: 'Cascade',    name: 'Cascade',     src: 'assets/Cascade.png',  color: '#ff9900' },
    { key: 'Sand',       name: 'Sand',        src: 'assets/Sand.png',     color: '#8bf12c' },
    { key: 'Lake',       name: 'Lake',        src: 'assets/Lake.png',     color: '#e46cab' },
    { key: 'Wooded',     name: 'Wooded',      src: 'assets/Wooded.png',   color: '#1e65e7' },
    { key: 'Cloud',      name: 'Cloud',       src: 'assets/Cloud.png',    color: '#65ceff' },
    { key: 'Lost',       name: 'Lost',        src: 'assets/Lost.png',     color: '#e71edd' },
    { key: 'Metro',      name: 'Metro',       src: 'assets/Metro.png',    color: '#de7d5e' },
    { key: 'Snow',       name: 'Snow',        src: 'assets/Snow.png',     color: '#e7930a' },
    { key: 'Seaside',    name: 'Seaside',     src: 'assets/Seaside.png',  color: '#b36fe9' },
    { key: 'Luncheon',   name: 'Luncheon',    src: 'assets/Luncheon.png', color: '#3fddbb' },
    { key: 'Ruined',     name: 'Ruined',      src: 'assets/Ruin.png',     color: '#ffd7e2' },
    { key: "Bowser's",   name: "Bowser's",    src: 'assets/Bowser.png',   color: '#d3304c' },
    { key: 'Moon',       name: 'Moon',        src: 'assets/MoonK.png',    color: '#b5c1cb' },
    { key: 'Mushroom',   name: 'Mushroom',    src: 'assets/Star.png',     color: '#fff672' },
    { key: 'Darkside',   name: 'Dark Side',   src: 'assets/Dark.png',     color: '#fff2c6' },
    { key: 'Darkerside', name: 'Darker Side', src: 'assets/Dark.png',     color: '#fff2c6' },
    { key: 'Deep Woods', name: 'Deep Woods',  src: 'assets/Wooded.png',   color: '#1e65e7' },
  ];

  const REFIGHTS = REFIGHT_ENTRIES.map((r, i) => Object.assign({}, r, { order: i }));
  const KINGDOMS = KINGDOM_ENTRIES.map((k, i) => Object.assign({}, k, { order: i }));

  // Only needed where the auto-generated label would be wrong.
  const NAME_OVERRIDES = {
    'Spark_pylon_Capture': 'Spark Pylon',
    'RC_Car_Capture': 'RC Car',
    'Chargin_Chuck_Capture': "Chargin' Chuck",
    'Knucklotec_Fist_Capture': "Knucklotec's Fist",
    'Rocket_Capture': 'Mini Rocket',
  };

  // Captures whose image file doesn't follow the assets/capture/<key>.png
  // convention (e.g. reusing an existing icon under a different filename).
  const SRC_OVERRIDES = {
    'Coin_Grind_Capture': 'assets/capture/Coin.png',
  };

  function labelFor(key) {
    if (NAME_OVERRIDES[key]) return NAME_OVERRIDES[key];
    return key.replace(/_Capture$/, '').replace(/_/g, ' ');
  }

  const CAPTURES = CAPTURE_KEYS.map((key, i) => ({
    key, order: i, name: labelFor(key), src: SRC_OVERRIDES[key] || `assets/capture/${key}.png`,
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

  // Look up a single {key, name, src, ...} entry by kind + key. Used by the
  // Loading Zone Notes requirement picker (notes.html / app.js) so it can
  // reuse this same Captures/Abilities/Refights/Kingdoms list instead of
  // keeping its own copy.
  function findItem(kind, key) {
    const list = kind === 'captures'  ? CAPTURES
      :          kind === 'abilities' ? ABILITIES
      :          kind === 'refights'  ? REFIGHTS
      :          kind === 'kingdoms'  ? KINGDOMS
      :          null;
    return list ? (list.find((item) => item.key === key) || null) : null;
  }

  // Every pickable item across all four groups, tagged with its `kind` and
  // sorted longest-name-first (so e.g. "Knucklotec's Fist" is matched before
  // any shorter overlapping name would be). Built once at load.
  const ALL_ITEMS = [
    ...CAPTURES.map((i) => Object.assign({ kind: 'captures' }, i)),
    ...ABILITIES.map((i) => Object.assign({ kind: 'abilities' }, i)),
    ...REFIGHTS.map((i) => Object.assign({ kind: 'refights' }, i)),
    ...KINGDOMS.map((i) => Object.assign({ kind: 'kingdoms' }, i)),
  ].sort((a, b) => b.name.length - a.name.length);

  // Scans free-form note text and returns every Capture/Ability/Refight/
  // Kingdom whose name appears in it as a standalone token (case-insensitive,
  // not glued onto a longer word - same boundary rule the picker's own
  // remove-text logic uses). Powers the Notes Tab's "auto icon while typing"
  // behavior: it's re-run on every keystroke and its results are rendered
  // as icon chips even when nothing was explicitly picked from a grid.
  function detectItemsInText(text) {
    if (!text) return [];
    const found = [];
    const seen = new Set();
    for (const item of ALL_ITEMS) {
      const escaped = item.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp('(^|[^A-Za-z0-9])(' + escaped + ')($|[^A-Za-z0-9])', 'i');
      if (re.test(text)) {
        const id = item.kind + ':' + item.key;
        if (!seen.has(id)) { seen.add(id); found.push(item); }
      }
    }
    // Drop a shorter match whose name is wholly contained in a longer match
    // already found (e.g. "Cheep Cheep" inside "Cheep Cheep (Snow)") - it's
    // almost certainly the same mention, not two separate ones.
    return found.filter((item) => !found.some((other) =>
      other !== item && other.name.length > item.name.length &&
      other.name.toLowerCase().includes(item.name.toLowerCase())
    ));
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

  console.log('SMO tracker apc-data.js v3');

  global.APC = {
    CAPTURES, ABILITIES, REFIGHTS, KINGDOMS,
    NOTES_CAPTURES, NOTES_ABILITIES,
    CAPTURE_LINKS, ABILITY_LINKS,
    linkedTrackerKey, findItem, detectItemsInText,
    ensure, isUnlocked, setUnlocked, countUnlocked,
    makeChannel,
  };
})(window);