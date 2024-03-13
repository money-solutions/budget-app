// This middleware checks if the user is authenticated
function authenticateSession(req, res, next) {
  if (req.session && req.session.user) {
    // User is authenticated, proceed to the next middleware or route handler
    next();
  } else {
    // User is not authenticated, redirect to login page or send an error response
    res.status(401).json({ error: 'Unauthorized' });
  }
}
module.exports = authenticateSession;