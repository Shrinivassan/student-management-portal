import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }
      req.user = user;
      next();
    });
  } catch (err) {
    res.status(403).json({ error: 'Authentication failed' });
  }
};

export const authorizeFaculty = (req, res, next) => {
  if (req.user && req.user.userType === 'faculty') {
    next();
  } else {
    res.status(403).json({ error: 'Faculty access only' });
  }
};

export const authorizeStudent = (req, res, next) => {
  if (req.user && req.user.userType === 'student') {
    next();
  } else {
    res.status(403).json({ error: 'Student access only' });
  }
};
