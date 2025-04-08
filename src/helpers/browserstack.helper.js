const request = require('phin-retry');
const { URLS } = require('./constants');


/**
 *
 * @param {import('../index').BrowserstackInputs} inputs
 */
function getBaseUrl(inputs) {
	return inputs.url || URLS.BROWSERSTACK;
}

/**
 *
 * @param {import('../index').BrowserstackInputs} inputs
 */
async function getAutomationBuilds(inputs) {
	return request.get({
    url: `${getBaseUrl(inputs)}/automate/builds.json?limit=100`,
		auth: {
			username: inputs.username,
			password: inputs.password
		},
  });
}

/**
 *
 * @param {import('../index').BrowserstackInputs} inputs
 * @param {string} build_id
 */
async function getAutomationBuildSessions(inputs, build_id) {
	return request.get({
    url: `${getBaseUrl(inputs)}/automate/builds/${build_id}/sessions.json`,
		auth: {
			username: inputs.username,
			password: inputs.password
		},
  });
}

module.exports = {
	getAutomationBuilds,
	getAutomationBuildSessions
}
