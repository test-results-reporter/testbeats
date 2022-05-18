const request = require('phin-retry');

async function getLaunchDetails(options) {
  return request.get({
    url: `${options.url}/api/v1/${options.project}/launch/${options.launch_id}`,
    headers: {
      'Authorization': `Bearer ${options.api_key}`
    }
  });
}

async function getLaunchesByName(options) {
  return request.get({
    url: `${options.url}/api/v1/${options.project}/launch?filter.eq.name=${options.launch_name}&page.size=1&page.sort=startTime%2Cdesc`,
    headers: {
      'Authorization': `Bearer ${options.api_key}`
    }
  });
}

async function getLastLaunchByName(options) {
  const response = await getLaunchesByName(options);
  if (response.content && response.content.length > 0) {
    return response.content[0];
  }
  return null;
}

async function getSuiteHistory(options) {
  return request.get({
    url: `${options.url}/api/v1/${options.project}/item/history`,
    qs: {
      historyDepth: options.history_depth,
      'filter.eq.launchId': options.launch_id,
      'filter.!ex.parentId': 'true'
    },
    headers: {
      'Authorization': `Bearer ${options.api_key}`
    }
  });
}

module.exports = {
  getLaunchDetails,
  getLastLaunchByName,
  getSuiteHistory
}