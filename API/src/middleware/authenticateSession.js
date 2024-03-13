// This middleware checks if the user is authenticated
function authenticateSession(req, res, next) {
  console.log("Starting Authentication")
  const { sessionID } = req.body;
  console.log(sessionID)
  if (!sessionID) {
    return res.status(400).json({ message: 'Missing parameters.' });
  }
  
  req.sessionStore.get(sessionID, (error, sessionData) => {
    console.log(sessionData)
    if (error || !sessionData || !sessionData.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log("User authenticated")

    // Attach the session data and id to the request object for later use
    req.sessionData = sessionData
    req.sessionID = sessionID

    next();
  });
    
}

module.exports = authenticateSession;