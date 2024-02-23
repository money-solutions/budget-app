function sendResponse200(res, message) {
    res.status(200).json({ message });
  }
  
module.exports = sendResponse200;
  