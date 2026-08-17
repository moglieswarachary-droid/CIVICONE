// server/middleware/authMiddleware.js - Role-Based Access Control (RBAC) & JWT Middleware

import { verifyToken } from '../auth.js';

/**
 * Express middleware to authenticate JWT token from Authorization header or Query param
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = (authHeader && authHeader.startsWith('Bearer ')) 
    ? authHeader.split(' ')[1] 
    : req.query.token;

  if (!token) {
    // Graceful demo mode fallback if token is missing
    req.user = {
      role: 'CITIZEN',
      citizenId: 'CIV-DEMO-10001',
      isDemo: true
    };
    return next();
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ 
      error: "Unauthorized: Invalid or expired security token.", 
      code: "INVALID_TOKEN" 
    });
  }

  req.user = decoded;
  next();
}

/**
 * Middleware guard to restrict access to specific roles
 * @param {Array<string>} allowedRoles e.g. ['CITIZEN', 'ORG', 'OFFICER', 'ADMIN']
 */
export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: Session identity not found." });
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden: Insufficient privileges for role '${req.user.role}'. Required: ${allowedRoles.join(', ')}`,
        code: "ROLE_FORBIDDEN"
      });
    }

    next();
  };
}
