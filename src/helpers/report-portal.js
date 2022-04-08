const request = require('phin-retry');

async function getLaunchDetails(options) {
  return request.get({
    url: `${options.url}/api/v1/${options.project}/launch/${options.launch_id}`,
    headers: {
      'Authorization': `Bearer ${options.api_key}`
    }
  });
}

module.exports = {
  getLaunchDetails
}