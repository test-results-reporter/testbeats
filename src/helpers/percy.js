const request = require('phin-retry');

/**
 * @param {import('../index').PercyAnalysisInputs} inputs 
 */
async function getProjectByName(inputs) {
  return request.get({
    url: `${inputs.url}/api/v1/projects`,
    headers: {
      'Authorization': `Token ${inputs.token}`
    },
    form: {
      'project_slug': inputs.project_name
    }
  });
}

/**
 * @param {import('../index').PercyAnalysisInputs} inputs 
 */
async function getLastBuild(inputs) {
  return request.get({
    url: `${inputs.url}/api/v1/builds?project_id=${inputs.project_id}&page[limit]=1`,
    headers: {
      'Authorization': `Token ${inputs.token}`
    }
  });
}

/**
 * @param {import('../index').PercyAnalysisInputs} inputs 
 */
 async function getBuild(inputs) {
  return request.get({
    url: `${inputs.url}/api/v1/builds/${inputs.build_id}`,
    headers: {
      'Authorization': `Token ${inputs.token}`
    }
  });
}

/**
 * @param {import('../index').PercyAnalysisInputs} inputs 
 */
 async function getRemovedSnapshots(inputs) {
  return request.get({
    url: `${inputs.url}/api/v1/builds/${inputs.build_id}/removed-snapshots`,
    headers: {
      'Authorization': `Token ${inputs.token}`
    }
  });
}


module.exports = {
  getProjectByName,
  getLastBuild,
  getBuild,
  getRemovedSnapshots
}