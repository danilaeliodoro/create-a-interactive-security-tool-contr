// 4un2_create_a_intera.js

// API Specification for Interactive Security Tool Controller

// Import required modules
const express = require('express');
const app = express();
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

// Security Tool Controller Class
class SecurityToolController {
  constructor() {
    this.cameras = [];
    this.sensors = [];
    this.alerts = [];
  }

  // Add camera to the system
  addCamera(camera) {
    this.cameras.push(camera);
  }

  // Add sensor to the system
  addSensor(sensor) {
    this.sensors.push(sensor);
  }

  // Send alert to the system
  sendAlert(alert) {
    this.alerts.push(alert);
    broadcastAlert(alert);
  }
}

// Create a new security tool controller instance
const controller = new SecurityToolController();

// WebSocket broadcast function
function broadcastAlert(alert) {
  wss.clients.forEach(client => {
    client.send(JSON.stringify({ type: 'alert', alert }));
  });
}

// API Endpoints
app.use(express.json());

app.post('/api/cameras', (req, res) => {
  const camera = req.body;
  controller.addCamera(camera);
  res.send(`Camera added: ${camera.name}`);
});

app.post('/api/sensors', (req, res) => {
  const sensor = req.body;
  controller.addSensor(sensor);
  res.send(`Sensor added: ${sensor.name}`);
});

app.post('/api/alerts', (req, res) => {
  const alert = req.body;
  controller.sendAlert(alert);
  res.send(`Alert sent: ${alert.type}`);
});

app.get('/api/alerts', (req, res) => {
  res.json(controller.alerts);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
  console.log('WebSocket server listening on port 8080');
});