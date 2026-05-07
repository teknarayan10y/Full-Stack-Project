const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map();
    this.setupConnectionHandling();
  }

  setupConnectionHandling() {
    this.wss.on('connection', (ws, req) => {
      // Extract token from URL query parameters
      const token = new URLSearchParams(req.url.split('?')[1]).get('token');
      
      if (!token) {
        return ws.close(1008, 'Authentication required');
      }

      try {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
        // Store the WebSocket connection with the user ID
        this.clients.set(userId, ws);
        
        // Handle disconnection
        ws.on('close', () => {
          this.clients.delete(userId);
        });

        // Handle errors
        ws.on('error', (error) => {
          console.error('WebSocket error:', error);
          this.clients.delete(userId);
        });

      } catch (error) {
        console.error('WebSocket authentication error:', error);
        ws.close(1008, 'Invalid token');
      }
    });
  }

  // Broadcast event to all connected clients
  broadcastEvent(event) {
    // Format the event data for the notification
    const eventData = {
      id: event._id || event.id,
      title: event.title,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      eventType: event.eventType,
      createdBy: event.createdBy,
      createdAt: event.createdAt
    };

    const message = JSON.stringify({
      type: 'NEW_EVENT',
      data: eventData
    });

    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

module.exports = WebSocketServer;
