const { addInteractionHandler } = require('pactum').handler;

addInteractionHandler('get automation builds', () => {
	return {
		strict: false,
		request: {
			method: 'GET',
			path: '/automate/builds.json',
		},
		response: {
			status: 200,
			body: [
				{
					"automation_build": {
						"name": "build-name",
						"hashed_id": "build-hashed-id",
						"duration": 176,
						"status": "done",
						"build_tag": "full",
						"public_url": "https://automate.browserstack.com/dashboard/v2/public-build/build-public-url"
					}
				}
			]
		}
	}
});

addInteractionHandler('get automation build sessions', () => {
	return {
		strict: false,
		request: {
			method: 'GET',
			path: '/automate/builds/build-hashed-id/sessions.json',
		},
		response: {
			status: 200,
			body: [
				{
					"automation_session": {
						"name": "session-name",
						"duration": 176,
						"os": "Windows",
						"os_version": "10",
						"browser_version": "10",
						"browser": "Chrome",
						"device": "iPhone 12 Pro",
						"status": "done",
						"hashed_id": "session-hashed-id",
						"public_url": "https://automate.browserstack.com/dashboard/v2/public-build/build-public-url"
					}
				}
			]
		}
	}
});