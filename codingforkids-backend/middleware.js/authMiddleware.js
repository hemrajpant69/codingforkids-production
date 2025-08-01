// authMiddleware.js
const authMiddleware = (req, res, next) => {
  // Example logic
  if (!req.headers.authorization) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

export default authMiddleware;
