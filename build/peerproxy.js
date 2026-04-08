const { WebSocketServer } = require('ws');

function peerProxy(httpServer, db) {
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on('upgrade', (request, socket, head) => {
    if (request.url === '/ws') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

    const rooms = {};
    wss.on('connection', (ws) => {
        wss = peerProxy(httpService, db);

        ws.on('message', async (message) => {
            const data = JSON.parse(message.toString());

            if (data.type === 'join') {
            const { notebookId, userName } = data; 

            if (!rooms[notebookId]) rooms[notebookId] = new Set();
            rooms[notebookId].add(ws);
            ws.notebookId = notebookId;
            ws.userName = userName;

            console.log(`${userName} joined notebook ${notebookId}`);

            if (ws.db) {
                const existingNotes = await ws.db.collection('notes')
                .find({ notebookId })
                .toArray();
                ws.send(JSON.stringify({ type: 'initial', notebookId, notes: existingNotes }));
            }

            const room = rooms[notebookId];
            room.forEach(client => {
                if (client !== ws && client.readyState === 1) {
                client.send(JSON.stringify({
                    type: 'user-joined',
                    notebookId,
                    userName
                }));
                }
            });
            }

            if (data.type === 'update') {
            const room = rooms[ws.notebookId];
            if (room) {
                room.forEach(client => {
                if (client !== ws && client.readyState === 1) {
                    client.send(JSON.stringify(data));
                }
                });
            }
            }
        });

  ws.on('close', () => {
    const room = rooms[ws.notebookId];
    if (room) room.delete(ws);
    console.log('WebSocket disconnected');
  });
});

  return wss;
}

module.exports = { peerProxy };