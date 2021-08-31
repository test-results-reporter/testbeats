const request = require('phin-retry');

function send(message, opts) {
  return request.post({
    url: opts['incoming-webhook-url'],
    body: message
  });
}

module.exports = {
  send
}