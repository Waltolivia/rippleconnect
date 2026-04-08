const { WebSocketServer } = require('ws');

function peerProxy(httpServer) {
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
    console.log('WebSocket connected');

    ws.on('message', (message) => {
        const data = JSON.parse(message.toString());

        if (data.type === 'join') {
        const { notebookId } = data;

        if (!rooms[notebookId]) {
            rooms[notebookId] = new Set();
        }

        rooms[notebookId].add(ws);
        ws.notebookId = notebookId;

        console.log(`User joined notebook ${notebookId}`);
        }

        if (data.type === 'update') {
        const room = rooms[ws.notebookId]; // same notebook updates

        if (room) {
            room.forEach((client) => {
            if (client !== ws && client.readyState === 1) {
                client.send(JSON.stringify(data));
            }
            });
        }
        }
    });

    ws.on('close', () => {
        const room = rooms[ws.notebookId];
        if (room) {
        room.delete(ws);
        }
        console.log('WebSocket disconnected');
    });
    });

  return wss;
}

module.exports = { peerProxy };