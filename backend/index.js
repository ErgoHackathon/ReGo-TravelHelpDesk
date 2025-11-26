const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

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

// Helper: load/write travel related files
const TRAVEL_REQ_FILE = path.join(DATA_DIR, 'travel_requests.json');
const APPROVALS_FILE = path.join(DATA_DIR, 'approvals.json');
const DOCUMENTS_FILE = path.join(DATA_DIR, 'documents.json');

function readJSON(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content);
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function readSafe(filePath) {
  return readJSON(filePath) || [];
}

function saveJSON(filePath, data) {
  writeJSON(filePath, data);
}

// Build approval chain based on rules
function buildApprovalChain(request) {
  // simple rule: international OR estimated_cost > 50000 -> 4 levels else 2 levels
  const users = readSafe(USERS_FILE);
  const manager = users.find(u => u.role === 'agent') || users[0]; // use agent as manager in seed
  const avp = users.find(u => u.role === 'admin') || users[0];
  const svp = users[0];
  const chro = users[0];

  const chain = [];
  // level 1 - manager
  chain.push({ approval_id: uuidv4(), request_id: request.id, approver_id: manager.id, approval_level: 1, status: 'PENDING', comments: null, created_at: new Date().toISOString() });

  // decide further levels
  const cost = Number(request.estimated_cost || 0);
  if (request.travel_type === 'international' || cost > 50000) {
    chain.push({ approval_id: uuidv4(), request_id: request.id, approver_id: avp.id, approval_level: 2, status: 'PENDING', created_at: new Date().toISOString() });
    chain.push({ approval_id: uuidv4(), request_id: request.id, approver_id: svp.id, approval_level: 3, status: 'PENDING', created_at: new Date().toISOString() });
    chain.push({ approval_id: uuidv4(), request_id: request.id, approver_id: chro.id, approval_level: 4, status: 'PENDING', created_at: new Date().toISOString() });
  } else {
    chain.push({ approval_id: uuidv4(), request_id: request.id, approver_id: avp.id, approval_level: 2, status: 'PENDING', created_at: new Date().toISOString() });
  }

  return chain;
}

// Utility: notify (adds to notifications.json)
function pushNotification(notification) {
  const notifs = readSafe(NOTIF_FILE);
  notifs.unshift({ id: uuidv4(), ...notification, createdAt: new Date().toISOString() });
  saveJSON(NOTIF_FILE, notifs);
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

// Public simple users list (id & name) used by frontend to map ids to names
app.get('/api/v1/users/simple', (req, res) => {
  const users = readSafe(USERS_FILE);
  const simple = users.map(u => ({ id: u.id, name: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() }));
  res.json({ success: true, data: simple });
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

// Travel requests endpoints
app.post('/api/v1/travel-requests', requireAuth, (req, res) => {
  const reqs = readSafe(TRAVEL_REQ_FILE);
  const body = req.body;
  const travelReq = {
    id: uuidv4(),
    userId: req.user.id,
    request_number: `REQ-${Date.now()}`,
    travel_type: body.travel_type || 'domestic',
    purpose: body.purpose || '',
    destination_country: body.destination_country || '',
    destination_city: body.destination_city || '',
    departure_date: body.departure_date || null,
    return_date: body.return_date || null,
    estimated_cost: body.estimated_cost || 0,
    currency: body.currency || 'INR',
    status: 'SUBMITTED',
    current_approver_id: null,
    created_at: new Date().toISOString()
  };

  // create approval chain
  const approvals = readSafe(APPROVALS_FILE);
  const chain = buildApprovalChain(travelReq);
  // set current approver to first
  travelReq.current_approver_id = chain.length ? chain[0].approver_id : null;

  // persist
  reqs.unshift(travelReq);
  approvals.unshift(...chain);
  saveJSON(TRAVEL_REQ_FILE, reqs);
  saveJSON(APPROVALS_FILE, approvals);

  // notify first approver
  if (travelReq.current_approver_id) {
    pushNotification({ message: `New travel request ${travelReq.request_number} requires your approval`, userId: travelReq.current_approver_id });
  }

  return res.status(201).json({ success: true, data: { requestId: travelReq.id } });
});

app.get('/api/v1/travel-requests', requireAuth, (req, res) => {
  const reqs = readSafe(TRAVEL_REQ_FILE);
  if (req.user.role === 'user') {
    return res.json({ success: true, data: reqs.filter(r => r.userId === req.user.id) });
  }
  if (req.user.role === 'agent') {
    // agents see all
    return res.json({ success: true, data: reqs });
  }
  // default: admin see all
  return res.json({ success: true, data: reqs });
});

app.get('/api/v1/travel-requests/:id', requireAuth, (req, res) => {
  const reqs = readSafe(TRAVEL_REQ_FILE);
  const travel = reqs.find(t => t.id === req.params.id);
  if (!travel) return res.status(404).json({ success: false, error: { message: 'Request not found' } });
  // check ownership or role
  if (req.user.role === 'user' && travel.userId !== req.user.id) return res.status(403).json({ success: false, error: { message: 'Forbidden' } });
  // include approvals and documents
  const approvals = readSafe(APPROVALS_FILE).filter(a => a.request_id === travel.id);
  const documents = readSafe(DOCUMENTS_FILE).filter(d => d.request_id === travel.id);
  return res.json({ success: true, data: { ...travel, approvals, documents } });
});

// Upload document metadata (no file storage) and simulate OCR
// Supports multipart/form-data with field 'file' OR JSON body with metadata
app.post('/api/v1/travel-requests/:id/documents', requireAuth, upload.single('file'), (req, res) => {
  const documents = readSafe(DOCUMENTS_FILE);
  const reqs = readSafe(TRAVEL_REQ_FILE);
  const travel = reqs.find(t => t.id === req.params.id);
  if (!travel) return res.status(404).json({ success: false, error: { message: 'Request not found' } });
  if (req.user.id !== travel.userId && req.user.role !== 'agent' && req.user.role !== 'admin') return res.status(403).json({ success: false, error: { message: 'Forbidden' } });

  // accept metadata from either JSON body or form fields
  const body = req.body || {};
  const file = req.file;

  const blobUrl = file ? `/static/uploads/${file.filename}` : '';

  const doc = {
    document_id: uuidv4(),
    request_id: travel.id,
    uploaded_by: req.user.id,
    document_type: body.document_type || 'passport',
    file_name: file ? file.originalname : (body.fileName || 'file.pdf'),
    file_size_bytes: file ? file.size : (Number(body.fileSize) || 0),
    mime_type: file ? file.mimetype : (body.mimeType || 'application/pdf'),
    blob_storage_url: blobUrl,
    ocr_status: 'COMPLETED',
    ocr_extracted_data: { name: 'John Doe' },
    ocr_confidence_score: Math.round(Math.random() * 40) + 60, // 60-100
    ocr_processed_at: new Date().toISOString(),
    verification_status: 'PENDING',
    uploaded_at: new Date().toISOString()
  };

  documents.unshift(doc);
  saveJSON(DOCUMENTS_FILE, documents);

  // if high confidence auto-verify
  if (doc.ocr_confidence_score >= 70) {
    doc.verification_status = 'VERIFIED';
    pushNotification({ message: `Document ${doc.file_name} auto-verified for request ${travel.request_number}`, userId: travel.userId });
  } else {
    pushNotification({ message: `Document ${doc.file_name} requires manual verification`, userId: travel.userId });
  }

  return res.json({ success: true, data: doc });
});

// Approve endpoint
app.post('/api/v1/travel-requests/:id/approve', requireAuth, (req, res) => {
  const approvals = readSafe(APPROVALS_FILE);
  const reqs = readSafe(TRAVEL_REQ_FILE);
  const travel = reqs.find(t => t.id === req.params.id);
  if (!travel) return res.status(404).json({ success: false, error: { message: 'Request not found' } });

  const approverEntries = approvals.filter(a => a.request_id === travel.id).sort((a,b) => a.approval_level - b.approval_level);
  const pending = approverEntries.find(a => a.status === 'PENDING');
  if (!pending) return res.status(400).json({ success: false, error: { message: 'No pending approvals' } });
  // ensure requester is the approver
  if (pending.approver_id !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ success: false, error: { message: 'Forbidden' } });

  const action = req.body.action || 'approve'; // approve or reject
  const comment = req.body.comment || '';
  // update this approval
  const idx = approvals.findIndex(a => a.approval_id === pending.approval_id);
  approvals[idx].status = action === 'approve' ? 'APPROVED' : 'REJECTED';
  approvals[idx].comments = comment;
  approvals[idx].reviewed_at = new Date().toISOString();

  // if rejected -> mark travel rejected
  if (action !== 'approve') {
    travel.status = 'REJECTED';
    travel.updated_at = new Date().toISOString();
    saveJSON(TRAVEL_REQ_FILE, reqs);
    saveJSON(APPROVALS_FILE, approvals);
    pushNotification({ message: `Travel request ${travel.request_number} was rejected`, userId: travel.userId });
    return res.json({ success: true, data: { status: 'REJECTED' } });
  }

  // approved: find next pending
  const next = approverEntries.find(a => a.status === 'PENDING');
  if (next) {
    // set current approver
    travel.current_approver_id = next.approver_id;
    travel.updated_at = new Date().toISOString();
    // notify next
    pushNotification({ message: `Travel request ${travel.request_number} requires your approval`, userId: next.approver_id });
  } else {
    // no more pending -> fully approved
    travel.status = 'APPROVED';
    travel.approved_at = new Date().toISOString();
    travel.current_approver_id = null;
    pushNotification({ message: `Travel request ${travel.request_number} has been approved`, userId: travel.userId });
  }

  saveJSON(TRAVEL_REQ_FILE, reqs);
  saveJSON(APPROVALS_FILE, approvals);

  return res.json({ success: true, data: { status: travel.status } });
});

app.get('/api/v1/approvals', requireAuth, (req, res) => {
  const approvals = readSafe(APPROVALS_FILE);
  if (req.user.role === 'user') {
    // show approvals related to user's requests
    const reqs = readSafe(TRAVEL_REQ_FILE).filter(r => r.userId === req.user.id).map(r => r.id);
    return res.json({ success: true, data: approvals.filter(a => reqs.includes(a.request_id) && a.status === 'PENDING') });
  }
  // for approvers, show pending assigned to them
  return res.json({ success: true, data: approvals.filter(a => a.approver_id === req.user.id && a.status === 'PENDING') });
});

// Mark notification as read
app.post('/api/v1/notifications/:id/read', requireAuth, (req, res) => {
  const notifs = readSafe(NOTIF_FILE);
  const idx = notifs.findIndex(n => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: { message: 'Notification not found' } });
  notifs[idx].is_read = true;
  notifs[idx].read_at = new Date().toISOString();
  saveJSON(NOTIF_FILE, notifs);
  res.json({ success: true });
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
