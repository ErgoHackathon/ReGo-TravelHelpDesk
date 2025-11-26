# ReGo Mock Backend

This is a simple Express-based mock backend intended for development and demo purposes. It uses JSON files in `backend/data/` as a lightweight data store.

Run:

1. Install dependencies

   npm install

2. Seed data

   npm run seed

3. Start server

   npm start

Default API base: http://localhost:8080/api/v1

Demo accounts (seeded):

- admin@rego.com / admin123
- agent@rego.com / agent123
- user@rego.com / user123

Notes:
- Tokens are simple base64 payloads and are not secure. This is for demo only.
