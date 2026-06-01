const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '..', 'logs', 'app.log');

const log = (type, message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${type}] ${message}\n`;
  
  try {
    fs.appendFileSync(LOG_FILE, logMessage, 'utf8');
  } catch (err) {
    console.error('Error writing to log file:', err);
  }
};

module.exports = {
  info: (message) => log('INFO', message),
  error: (message) => log('ERROR', message)
};
