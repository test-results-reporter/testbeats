const request = require('phin-retry');

async function getLaunchDetails(opts) {
  return request.get({
    url: `${opts.url}/api/v1/${opts.project}/launch/${opts.launch_id}`,
    headers: {
      'Authorization': `Bearer ${opts.api_key}`
    }
  });
}

module.exports = {
  getLaunchDetails
}