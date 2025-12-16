// server.js
// Main server file for your REST API
// 
// ⚠️ IMPORTANT: This uses ES Modules (ESM)
// - Use import/export (not require/module.exports)
// - File extensions (.js) are REQUIRED in imports
// - Must have "type": "module" in package.json

// TODO: Import required packages
// Note: File extension .js is REQUIRED for local imports in ESM!
import express from 'express';
import booksRoutes from './routes/booksRoutes.js';

// TODO: Create Express app
const app = express();

// TODO: Set port number
const PORT = 3000;

// Middleware to parse JSON request bodies
// ✅ This is built into Express 4.16+ (no need for body-parser package!)
app.use(express.json());

// ============================================
// ROUTES
// ============================================

/**
 * GET / - Welcome route
 * Tests that the server is running
 */
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to my Project 4 REST API!',
    version: '1.0.0',
    endpoints: {
      allBooks: 'GET /api/books',
      singleBook: 'GET /api/books/:id',
      createBook: 'POST /api/books',
      updateBook: 'PUT /api/books/:id',
      deleteBook: 'DELETE /api/books/:id'
    }
  });
});

// ============================================
// CRUD OPERATIONS
// Replace 'resource' with your chosen resource name!
// ============================================

// ✅ Modularized routes (rubric requirement): all /api/books CRUD lives in routes/booksRoutes.js
app.use('/api/books', booksRoutes);

// ============================================
// 404 HANDLER - Catch all unmatched routes
// ============================================
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    requestedUrl: req.originalUrl
  });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Test your API with Postman!`);
  console.log(`📊 Database file: db.json (created after first write)`);
});

/*
 * ====================================
 * ESM QUICK REFERENCE
 * ====================================
 * 
 * ❌ CommonJS (OLD - don't use):
 *   const express = require('express');
 *   module.exports = router;
 * 
 * ✅ ESM (CURRENT - use this):
 *   import express from 'express';
 *   export default router;
 * 
 * ⚠️ LOCAL IMPORTS NEED .js EXTENSION:
 *   import db from './database.js';  // ✅ Correct
 *   import db from './database';     // ❌ Will fail!
 * 
 * ====================================
 * EXPRESS QUICK REFERENCE
 * ====================================
 * 
 * req.params  → URL parameters (/api/games/:id → req.params.id)
 * req.body    → POST/PUT request body (parsed by express.json())
 * req.query   → Query string (/api/games?genre=rpg → req.query.genre)
 * 
 * res.status(200).json({}) → Send JSON response with status
 * res.json({})             → Send JSON (default 200)
 * 
 * Status codes:
 *   200 - OK (GET, PUT, DELETE success)
 *   201 - Created (POST success)
 *   400 - Bad Request (validation error)
 *   404 - Not Found (resource doesn't exist)
 *   500 - Server Error (something broke)
 */
