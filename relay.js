// Optional relay so OBS (a separate browser from Chrome/Firefox) can receive the mirror.
// Setup:  npm i ws   then   node relay.js     (default port 8787)
const { WebSocketServer } = require('ws');
const rooms = new Map();                       // room -> { clients:Set, snap:string|null }
const wss = new WebSocketServer({ port: process.env.PORT || 8787 });
wss.on('connection', (sock, req) => {
  const room = new URL(req.url, 'http://x').searchParams.get('room') || 'tracker';
  if (!rooms.has(room)) rooms.set(room, { clients: new Set(), snap: null });
  const r = rooms.get(room);
  r.clients.add(sock);
  if (r.snap) sock.send(r.snap);               // late joiners get the latest page right away
  sock.on('message', (data) => {
    const s = data.toString();
    if (s.startsWith('{"t":"snap"')) r.snap = s;
    for (const c of r.clients) if (c !== sock && c.readyState === 1) c.send(s);
  });
  sock.on('close', () => r.clients.delete(sock));
});
console.log('Tracker Mirror relay on ws://localhost:' + (process.env.PORT || 8787));
