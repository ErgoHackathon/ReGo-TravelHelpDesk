const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);

const users = [
  { id: 'u-admin-1', name: 'Admin User', email: 'admin@rego.com', password: 'admin123', role: 'admin', avatar: '/static/admin.png', createdAt: new Date().toISOString() },
  { id: 'u-agent-1', name: 'Agent Alice', email: 'agent@rego.com', password: 'agent123', role: 'agent', avatar: '/static/agent.png', createdAt: new Date().toISOString() },
  { id: 'u-user-1', name: 'John Traveler', email: 'user@rego.com', password: 'user123', role: 'user', avatar: '/static/user.png', createdAt: new Date().toISOString() }
];

const tickets = [
  { id: 't-1', title: 'Flight delay compensation', description: 'My flight was delayed 6 hours and I need assistance', category: 'Compensation', status: 'open', userId: 'u-user-1', createdAt: new Date().toISOString(), updates: [{ by: 'u-agent-1', message: 'We are looking into it', ts: new Date().toISOString() }] },
  { id: 't-2', title: 'Lost baggage assistance', description: 'My baggage did not arrive', category: 'Baggage', status: 'in-progress', userId: 'u-user-1', createdAt: new Date().toISOString(), updates: [{ by: 'u-agent-1', message: 'Please provide baggage tag', ts: new Date().toISOString() }] }
];

const faqs = [
  { id: 'f-1', q: 'How to claim compensation?', a: 'Submit your ticket with flight details and we will assist.' },
  { id: 'f-2', q: 'How to change bookings?', a: 'Contact support with your PNR and we will guide you.' }
];

const notifications = [
  { id: 'n-1', message: 'Your ticket t-1 has a new update', userId: 'u-user-1', createdAt: new Date().toISOString() },
  { id: 'n-2', message: 'System maintenance on 30 Nov', createdAt: new Date().toISOString() }
];

const travelInfo = [
  { id: 'tr-1', country: 'France', advisory: 'Check visa requirements before travel' },
  { id: 'tr-2', country: 'India', advisory: 'Carry valid ID and health documents' }
];

fs.writeFileSync(path.join(DATA_DIR, 'users.json'), JSON.stringify(users, null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'tickets.json'), JSON.stringify(tickets, null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'faqs.json'), JSON.stringify(faqs, null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'notifications.json'), JSON.stringify(notifications, null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'travelInfo.json'), JSON.stringify(travelInfo, null, 2));

// Copy static images
const staticDir = path.join(__dirname, 'static');
if (!fs.existsSync(staticDir)) fs.mkdirSync(staticDir);
fs.writeFileSync(path.join(staticDir, 'admin.png'), '');
fs.writeFileSync(path.join(staticDir, 'agent.png'), '');
fs.writeFileSync(path.join(staticDir, 'user.png'), '');

console.log('Seeded mock data into backend/data');

module.exports = function seed() {
  // re-run the seed
  fs.writeFileSync(path.join(DATA_DIR, 'users.json'), JSON.stringify(users, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'tickets.json'), JSON.stringify(tickets, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'faqs.json'), JSON.stringify(faqs, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'notifications.json'), JSON.stringify(notifications, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'travelInfo.json'), JSON.stringify(travelInfo, null, 2));
  console.log('Seeded mock data (re-run)');
};
