const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const tokenValue = token.split(' ')[1];
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // Handle token expiration here
      const refreshToken = req.headers.refreshtoken;

      if (!refreshToken) {
        return res.status(401).json({ message: 'Token expired and no refresh token provided' });
      }

      try {
        const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const newToken = jwt.sign({ userId: decodedRefreshToken.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.set('Authorization', `Bearer ${newToken}`);
        req.userId = decodedRefreshToken.userId; 
        next();
      } catch (refreshError) {
        console.error('Failed to verify refresh token:', refreshError);
        return res.status(403).json({ message: 'Invalid refresh token' });
      }
    } else {
      console.error('Failed to authenticate token:', error);
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }
  }
};

module.exports = { verifyToken };
