const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TICKETS_FILE = path.join(DATA_DIR, 'tickets.json');
const FAQ_FILE = path.join(DATA_DIR, 'faqs.json');
const NOTIF_FILE = path.join(DATA_DIR, 'notifications.json');
const TRAVEL_FILE = path.join(DATA_DIR, 'travelInfo.json');

function readJSON(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content);
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Utility: Simple "JWT-like" token (not secure) - store userId
function createToken(user) {
  return Buffer.from(JSON.stringify({ id: user.id, role: user.role, ts: Date.now() })).toString('base64');
}

function verifyToken(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    const users = readJSON(USERS_FILE) || [];
    return users.find((u) => u.id === payload.id) || null;
  } catch (e) {
    return null;
  }
}

// Auth routes
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  const users = readJSON(USERS_FILE) || [];
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, error: { message: 'Invalid credentials' } });
  }
  const token = createToken(user);
  const refreshToken = createToken(user) + '.r';
  return res.json({ success: true, data: { user: { ...user, password: undefined }, token, refreshToken } });
});

app.post('/api/v1/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  const users = readJSON(USERS_FILE) || [];
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ success: false, error: { message: 'Email already exists' } });
  }
  const user = { id: uuidv4(), name, email, password, role: 'user', avatar: '/avatar.png', createdAt: new Date().toISOString() };
  users.push(user);
  writeJSON(USERS_FILE, users);
  const token = createToken(user);
  const refreshToken = createToken(user) + '.r';
  return res.json({ success: true, data: { user: { ...user, password: undefined }, token, refreshToken } });
});

app.post('/api/v1/auth/logout', (req, res) => {
  // no-op for mock
  res.json({ success: true });
});

app.post('/api/v1/auth/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ success: false, error: { message: 'No refresh token' } });
  const tokenPart = refreshToken.replace('.r', '');
  const user = verifyToken(tokenPart);
  if (!user) return res.status(401).json({ success: false, error: { message: 'Invalid refresh token' } });
  const token = createToken(user);
  return res.json({ success: true, data: { token } });
});

// Middleware: require auth
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  const user = verifyToken(token);
  if (!user) return res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
  req.user = user;
  next();
}

// Tickets endpoints
app.get('/api/v1/tickets', requireAuth, (req, res) => {
  const tickets = readJSON(TICKETS_FILE) || [];
  // If user role is user, filter only their tickets
  if (req.user.role === 'user') {
    return res.json({ success: true, data: tickets.filter((t) => t.userId === req.user.id) });
  }
  return res.json({ success: true, data: tickets });
});

app.get('/api/v1/tickets/:id', requireAuth, (req, res) => {
  const tickets = readJSON(TICKETS_FILE) || [];
  const ticket = tickets.find((t) => t.id === req.params.id);
  if (!ticket) return res.status(404).json({ success: false, error: { message: 'Ticket not found' } });
  if (req.user.role === 'user' && ticket.userId !== req.user.id) return res.status(403).json({ success: false, error: { message: 'Forbidden' } });
  return res.json({ success: true, data: ticket });
});

app.post('/api/v1/tickets', requireAuth, (req, res) => {
  const tickets = readJSON(TICKETS_FILE) || [];
  const { title, description, category } = req.body;
  const ticket = { id: uuidv4(), title, description, category, status: 'open', userId: req.user.id, createdAt: new Date().toISOString(), updates: [] };
  tickets.unshift(ticket);
  writeJSON(TICKETS_FILE, tickets);
  return res.json({ success: true, data: ticket });
});

app.put('/api/v1/tickets/:id', requireAuth, (req, res) => {
  const tickets = readJSON(TICKETS_FILE) || [];
  const idx = tickets.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: { message: 'Ticket not found' } });
  const ticket = tickets[idx];
  // Only admins or the owner can update
  if (req.user.role === 'user' && ticket.userId !== req.user.id) return res.status(403).json({ success: false, error: { message: 'Forbidden' } });
  const updated = { ...ticket, ...req.body, updatedAt: new Date().toISOString() };
  tickets[idx] = updated;
  writeJSON(TICKETS_FILE, tickets);
  return res.json({ success: true, data: updated });
});

// FAQs and notifications
app.get('/api/v1/faqs', (req, res) => {
  const faqs = readJSON(FAQ_FILE) || [];
  res.json({ success: true, data: faqs });
});

app.get('/api/v1/notifications', requireAuth, (req, res) => {
  const notifs = readJSON(NOTIF_FILE) || [];
  // return all notifications for now
  res.json({ success: true, data: notifs });
});

// Travel info
app.get('/api/v1/travel-info', (req, res) => {
  const info = readJSON(TRAVEL_FILE) || [];
  res.json({ success: true, data: info });
});

// Users (admin)
app.get('/api/v1/users', requireAuth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ success: false, error: { message: 'Forbidden' } });
  const users = readJSON(USERS_FILE) || [];
  res.json({ success: true, data: users.map((u) => ({ ...u, password: undefined })) });
});

// Profile
app.get('/api/v1/auth/profile', requireAuth, (req, res) => {
  const user = req.user;
  res.json({ success: true, data: { ...user, password: undefined } });
});

app.put('/api/v1/auth/profile', requireAuth, (req, res) => {
  const users = readJSON(USERS_FILE) || [];
  const idx = users.findIndex((u) => u.id === req.user.id);
  if (idx === -1) return res.status(404).json({ success: false, error: { message: 'User not found' } });
  users[idx] = { ...users[idx], ...req.body };
  writeJSON(USERS_FILE, users);
  res.json({ success: true, data: { ...users[idx], password: undefined } });
});

// Seed endpoint (dev only)
app.get('/api/v1/dev/reset', (req, res) => {
  // re-run seed
  const seed = require('./seed');
  seed();
  res.json({ success: true });
});

// Serve static assets for avatars
app.use('/static', express.static(path.join(__dirname, 'static')));

app.listen(PORT, () => {
  console.log(`Mock backend listening on http://localhost:${PORT}`);
});
