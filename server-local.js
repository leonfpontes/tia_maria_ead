#!/usr/bin/env node

// Load environment variables from .env file
require('dotenv').config();

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Set environment for local dev with fallbacks
process.env.DB_DRIVER = process.env.DB_DRIVER || 'sqlite';
process.env.SQLITE_PATH = process.env.SQLITE_PATH || './local.sqlite';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-local';
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const PORT = process.env.PORT || 3000;

// Simple router for API endpoints
const apiHandlers = {
  'POST /api/admin/login': require('./api/admin/login.js'),
  'GET /api/admin/giras': require('./api/admin/giras/index.js'),
  'POST /api/admin/giras': require('./api/admin/giras/index.js'),
  'GET /api/admin/controles/[giraId]': require('./api/admin/controles/[giraId].js'),
  'PUT /api/admin/controles/[giraId]': require('./api/admin/controles/[giraId].js'),
  'GET /api/admin/giras/[id]': require('./api/admin/giras/[id].js'),
  'PUT /api/admin/giras/[id]': require('./api/admin/giras/[id].js'),
  'GET /api/admin/giras/[id]/senhas': require('./api/admin/giras/[id]/senhas.js'),
  'POST /api/admin/giras/[id]/senhas': require('./api/admin/giras/[id]/senhas.js'),
  'PATCH /api/admin/senhas/[id]/status': require('./api/admin/senhas/[id]/status.js'),
  'PATCH /api/admin/senhas/[id]/checkin': require('./api/admin/senhas/[id]/checkin.js'),
  'POST /api/admin/giras/[giraId]/senhas/walk-in': require('./api/admin/giras/[giraId]/senhas/walk-in.js'),
  'GET /api/public/agenda': require('./api/public/agenda.js'),
  'GET /api/public/giras/cards': require('./api/public/giras/cards.js'),
  'POST /api/public/giras/[id]/senhas': require('./api/public/giras/[id]/senhas.js'),
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Static files
  if (pathname === '/' || pathname === '') {
    const filename = path.join(__dirname, 'index.html');
    if (fs.existsSync(filename)) {
      res.setHeader('Content-Type', 'text/html');
      res.writeHead(200);
      res.end(fs.readFileSync(filename));
      return;
    }
  }

  if (!pathname.startsWith('/api/') && !pathname.startsWith('/assets/') && !pathname.startsWith('/admin/')) {
    const cleanPath = pathname.startsWith('/') ? pathname.slice(1) : pathname;
    const candidates = [];

    if (cleanPath) {
      candidates.push(path.join(__dirname, cleanPath));
      if (!cleanPath.endsWith('.html')) {
        candidates.push(path.join(__dirname, `${cleanPath}.html`));
      }
    }

    for (const candidate of candidates) {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        const ext = path.extname(candidate).toLowerCase();
        const mimeTypes = {
          '.html': 'text/html',
          '.css': 'text/css',
          '.js': 'application/javascript',
          '.json': 'application/json',
          '.xml': 'application/xml',
          '.txt': 'text/plain',
          '.ico': 'image/x-icon',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.gif': 'image/gif',
          '.svg': 'image/svg+xml',
        };
        res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
        res.writeHead(200);
        res.end(fs.readFileSync(candidate));
        return;
      }
    }
  }

  if (pathname.startsWith('/assets/')) {
    const filename = path.join(__dirname, pathname);
    if (fs.existsSync(filename) && fs.statSync(filename).isFile()) {
      const ext = path.extname(filename);
      const mimeTypes = {
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
      };
      res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
      res.writeHead(200);
      res.end(fs.readFileSync(filename));
      return;
    }
  }

  if (pathname === '/admin') {
    const adminIndex = path.join(__dirname, 'admin', 'index.html');
    if (fs.existsSync(adminIndex)) {
      res.setHeader('Content-Type', 'text/html');
      res.writeHead(200);
      res.end(fs.readFileSync(adminIndex));
      return;
    }
  }

  if (pathname.startsWith('/admin/')) {
    const adminFile = path.join(__dirname, pathname + (pathname.endsWith('.html') ? '' : '.html'));
    if (fs.existsSync(adminFile)) {
      res.setHeader('Content-Type', 'text/html');
      res.writeHead(200);
      res.end(fs.readFileSync(adminFile));
      return;
    }
  }

  // API Routes - simplified handler
  const method = req.method;
  const apiPath = pathname;

  // Map dynamic routes
  let handler = null;
  let params = {};

  if (method === 'POST' && apiPath === '/api/admin/login') {
    handler = apiHandlers['POST /api/admin/login'];
  } else if (method === 'GET' && apiPath === '/api/admin/giras') {
    handler = apiHandlers['GET /api/admin/giras'];
  } else if (method === 'POST' && apiPath === '/api/admin/giras') {
    handler = apiHandlers['POST /api/admin/giras'];
  } else if (method === 'GET' && apiPath.match(/^\/api\/admin\/controles\/[^/]+$/)) {
    handler = apiHandlers['GET /api/admin/controles/[giraId]'];
    params.giraId = apiPath.split('/')[4];
  } else if (method === 'PUT' && apiPath.match(/^\/api\/admin\/controles\/[^/]+$/)) {
    handler = apiHandlers['PUT /api/admin/controles/[giraId]'];
    params.giraId = apiPath.split('/')[4];
  } else if (method === 'GET' && apiPath.match(/^\/api\/admin\/giras\/[^/]+$/)) {
    handler = apiHandlers['GET /api/admin/giras/[id]'];
    params.id = apiPath.split('/')[4];
  } else if (method === 'PUT' && apiPath.match(/^\/api\/admin\/giras\/[^/]+$/)) {
    handler = apiHandlers['PUT /api/admin/giras/[id]'];
    params.id = apiPath.split('/')[4];
  } else if (method === 'GET' && apiPath.match(/^\/api\/admin\/giras\/[^/]+\/senhas$/)) {
    handler = apiHandlers['GET /api/admin/giras/[id]/senhas'];
    params.id = apiPath.split('/')[4];
  } else if (method === 'POST' && apiPath.match(/^\/api\/admin\/giras\/[^/]+\/senhas$/)) {
    handler = apiHandlers['POST /api/admin/giras/[id]/senhas'];
    params.id = apiPath.split('/')[4];
  } else if (method === 'PATCH' && apiPath.match(/^\/api\/admin\/senhas\/[^/]+\/status$/)) {
    handler = apiHandlers['PATCH /api/admin/senhas/[id]/status'];
    params.id = apiPath.split('/')[4];
  } else if (method === 'PATCH' && apiPath.match(/^\/api\/admin\/senhas\/[^/]+\/checkin$/)) {
    handler = apiHandlers['PATCH /api/admin/senhas/[id]/checkin'];
    params.id = apiPath.split('/')[4];
  } else if (method === 'POST' && apiPath.match(/^\/api\/admin\/giras\/[^/]+\/senhas\/walk-in$/)) {
    handler = apiHandlers['POST /api/admin/giras/[giraId]/senhas/walk-in'];
    params.giraId = apiPath.split('/')[4];
  } else if (method === 'GET' && apiPath === '/api/public/agenda') {
    handler = apiHandlers['GET /api/public/agenda'];
  } else if (method === 'GET' && apiPath === '/api/public/giras/cards') {
    handler = apiHandlers['GET /api/public/giras/cards'];
  } else if (method === 'POST' && apiPath.match(/^\/api\/public\/giras\/[^/]+\/senhas$/)) {
    handler = apiHandlers['POST /api/public/giras/[id]/senhas'];
    params.id = apiPath.split('/')[4];
  }

  if (handler) {
    // Convert handler to Vercel-like req/res format
    const bodyChunks = [];
    req.on('data', chunk => {
      bodyChunks.push(Buffer.from(chunk));
    });
    req.on('end', async () => {
      try {
        const rawBuffer = bodyChunks.length ? Buffer.concat(bodyChunks) : Buffer.alloc(0);
        const utf8Body = rawBuffer.length ? rawBuffer.toString('utf8') : '';
        let parsedBody;
        if (utf8Body) {
          try {
            parsedBody = JSON.parse(utf8Body);
          } catch {
            parsedBody = utf8Body;
          }

          if (typeof parsedBody === 'object' && parsedBody !== null) {
            const hasReplacementChar = JSON.stringify(parsedBody).includes('\uFFFD');
            if (hasReplacementChar) {
              try {
                const latin1Body = rawBuffer.toString('latin1');
                const repaired = JSON.parse(latin1Body);
                parsedBody = repaired;
              } catch {
                // keep utf8 parsed body
              }
            }
          }
        }

        const request = {
          method,
          headers: req.headers,
          body: parsedBody,
          query: {
            ...parsedUrl.query,
            ...params,
          },
          socket: req.socket,
        };

        const response = {
          _statusCode: 200,
          _headers: { 'Content-Type': 'application/json; charset=utf-8' },
          _ended: false,
          setHeader(name, value) {
            this._headers[name] = value;
            return this;
          },
          status(code) {
            this._statusCode = code;
            return this;
          },
          json(payload) {
            if (this._ended) return this;
            res.writeHead(this._statusCode, this._headers);
            res.end(JSON.stringify(payload));
            this._ended = true;
            return this;
          },
          send(payload = '') {
            if (this._ended) return this;
            if (!this._headers['Content-Type']) {
              this._headers['Content-Type'] = 'text/plain; charset=utf-8';
            }
            res.writeHead(this._statusCode, this._headers);
            res.end(payload);
            this._ended = true;
            return this;
          },
          end(payload = '') {
            if (this._ended) return this;
            res.writeHead(this._statusCode, this._headers);
            res.end(payload);
            this._ended = true;
            return this;
          },
        };

        const result = await handler(request, response);

        if (response._ended) {
          return;
        }

        // Fallback for handlers that return data directly
        if (result && result.statusCode) {
          res.writeHead(result.statusCode, result.headers || { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(result.body || JSON.stringify({}));
        } else {
          response.status(200).json(result ?? {});
        }
      } catch (err) {
        console.error('Error handling request:', err);
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`\n✅ Servidor local rodando em http://localhost:${PORT}`);
  console.log(`📝 Admin: http://localhost:${PORT}/admin`);
  console.log(`🗄️  SQLite: ${process.env.SQLITE_PATH}`);
  console.log(`🔐 Credenciais: admin / admin123\n`);
});
