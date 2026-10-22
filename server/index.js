import * as dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import config from '../config.js';
import jwt from 'jsonwebtoken';

export const loadEnv = (options) => {
  if (existsSync('.env.local')) {
    dotenv.config({ path: `.env.local`, ...options });
  }

  dotenv.config(options);
};

loadEnv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { auth, server } = config || {};

const {
  SERVER_AUDIENCE: audience = server?.audience ??
    auth?.audience ??
    auth?.authorizationParams?.audience ??
    'api://default',
  SERVER_AUTH_PERMISSIONS: AUTH_PERMISSIONS = server?.permissions || [
    'AuthRocks',
  ],
} = process.env;

const permissions = Array.isArray(AUTH_PERMISSIONS)
  ? AUTH_PERMISSIONS
  : AUTH_PERMISSIONS.split(' ');

const app = express();

app.use(cors({ origin: '*' }));
app.use(morgan('dev'));
app.use(helmet());
app.use(express.static(join(__dirname, 'public')));

// Simple token extraction middleware
const extractToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'No token provided',
    });
  }
  req.token = authHeader.split(' ')[1];
  next();
};

// Simple permissions check middleware
const checkPermissions = (req, res, next) => {
  try {
    const decoded = jwt.decode(req.token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    const userPermissions = decoded.permissions || [];
    const hasRequiredPermissions = permissions.every((permission) =>
      userPermissions.includes(permission)
    );

    if (!hasRequiredPermissions) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed',
    });
  }
};

// app.get('/api/public', (req, res) => {
//   res.json({
//     success: true,
//     message:
//       'This is the Public API. Anyone can request this response. Hooray!',
//   });
// });

// app.get(
//   '/api/private',
//   extractToken,
//   (req, res) =>
//     res.json({
//       success: true,
//       message:
//         'This is the private API. Only special folk, indicated by the `audience` configuration, can access it. Awesome!',
//     })
// );

app.get('/api/scoped', extractToken, checkPermissions, (req, res) =>
  res.json({
    success: true,
    message:
      'This is the API response. Your access token has valid permissions!',
  })
);

export const handler = app;
