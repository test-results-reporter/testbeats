const { getAutomationBuilds, getAutomationBuildSessions } = require('../helpers/browserstack.helper');

class ExtensionsSetup {
  constructor(extensions, result) {
    this.extensions = extensions;
    this.result = result;
  }

  async run() {
    for (const extension of this.extensions) {
      if (extension.name === 'browserstack') {
        const browserStackExtensionSetup = new BrowserStackExtensionSetup(extension.inputs, this.result);
        await browserStackExtensionSetup.setup();
      }
    }
  }
}

class BrowserStackExtensionSetup {
  constructor(inputs, result) {
    /** @type {import('../index').BrowserstackInputs} */
    this.inputs = inputs;
    this.result = result;
  }

  async setup() {
    const build_rows = await getAutomationBuilds(this.inputs);
    if (!Array.isArray(build_rows) || build_rows.length === 0) {
      throw new Error('No builds found');
    }
    const automation_build = build_rows.find(_ => _.automation_build.name === this.inputs.automation_build_name);
    if (!automation_build) {
      throw new Error(`Build ${this.inputs.automation_build_name} not found`);
    }
    this.inputs.automation_build = automation_build.automation_build;
    if (this.result) {
      this.result.metadata = this.result.metadata || {};
      this.result.metadata.ext_browserstack_automation_build = automation_build.automation_build;
    }
    this.inputs.automation_sessions = [];
    const session_rows = await getAutomationBuildSessions(this.inputs, automation_build.automation_build.hashed_id);
    if (!Array.isArray(session_rows) || session_rows.length === 0) {
      throw new Error('No sessions found');
    }
    for (const session_row of session_rows) {
      this.inputs.automation_sessions.push(session_row.automation_session);
    }
    if (this.result && this.result.suites && this.result.suites.length > 0) {
      for (const suite of this.result.suites) {
        const automation_session = this.inputs.automation_sessions.filter(_ => { _.name === suite.name })[0];
        if (automation_session) {
          suite.metadata = suite.metadata || {};
          suite.metadata.ext_browserstack_automation_session = automation_session;
        }
      }
    }
  }
}

module.exports = {
  ExtensionsSetup
}