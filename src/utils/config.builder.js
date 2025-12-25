const path = require('path');
const logger = require('./logger');

const DEFAULT_PROJECT = 'demo-project';

class ConfigBuilder {

  /**
   * @param {import('../index').CommandLineOptions} opts
   * @param {import('../helpers/ci').ICIInfo} ci
   * @param {Record<string, string | undefined>} env
   */
  constructor(opts, ci, env = process.env) {
    this.opts = opts;
    this.ci = ci;
    this.env = env;
    /** @type {import('../index').PublishConfig}  */
    this.config = {};
  }

  build() {
    if (!this.opts) {
      return;
    }
    logger.info('🏗 Building config...')
    switch (typeof this.opts.config) {
      case 'object':
        this.#buildFromConfigFile();
        break;
      case 'string':
        this.#buildFromConfigFilePath();
        break;
      default:
        this.#buildFromCommandLineOptions();
        break;
    }
    console.log(`🛠️ Generated Config: \n${JSON.stringify(this.config, null, 2)}`);
  }

  #buildFromConfigFile() {
    this.config = this.opts.config;
    this.#buildBeats();
  }

  #buildFromConfigFilePath() {
    const cwd = process.cwd();
    const file_path = path.join(cwd, this.opts.config);
    try {
      const config_json = require(file_path);
      this.opts.config = config_json;
      this.#buildFromConfigFile();
    } catch (error) {
      throw new Error(`Failed to read config file: '${file_path}' with error: '${error.message}'`);
    }
  }



  #buildFromCommandLineOptions() {
    this.opts.config = {};
    this.config = this.opts.config;
    this.#buildBeats();
    this.#buildResults();
    this.#buildTargets();
    this.#buildExtensions();
  }

  #buildBeats() {
    this.#setProject();
    this.#setRun();
    this.#setApiKey();
  }

  #setProject() {
    if (this.opts.project) {
      this.config.project = this.opts.project;
      return;
    }
    if (this.env.TEST_BEATS_PROJECT || this.env.TESTBEATS_PROJECT) {
      this.config.project = this.env.TEST_BEATS_PROJECT || this.env.TESTBEATS_PROJECT;
      return;
    }
    if (this.config.project) {
      return;
    }
    if (this.ci && this.ci.repository_name) {
      this.config.project = this.ci.repository_name;
      return;
    }

    this.config.project = DEFAULT_PROJECT;
  }

  #setRun() {
    if (this.opts.run) {
      this.config.run = this.opts.run;
      return;
    }
    if (this.env.TEST_BEATS_RUN || this.env.TESTBEATS_RUN) {
      this.config.run = this.env.TEST_BEATS_RUN || this.env.TESTBEATS_RUN;
      return;
    }
    if (this.config.run) {
      return;
    }
    if (this.ci && this.ci.build_name) {
      this.config.run = this.ci.build_name;
      return;
    }
  }

  #setApiKey() {
    if (this.opts['api-key']) {
      this.config.api_key = this.opts['api-key'];
      return;
    }
    if (this.env.TEST_BEATS_API_KEY || this.env.TESTBEATS_API_KEY) {
      this.config.api_key = this.env.TEST_BEATS_API_KEY || this.env.TESTBEATS_API_KEY;
      return;
    }
  }

  #buildResults() {
    if (this.opts.junit) {
      this.#addResults('junit', this.opts.junit);
    }
    if (this.opts.testng) {
      this.#addResults('testng', this.opts.testng);
    }
    if (this.opts.cucumber) {
      this.#addResults('cucumber', this.opts.cucumber);
    }
    if (this.opts.mocha) {
      this.#addResults('mocha', this.opts.mocha);
    }
    if (this.opts.nunit) {
      this.#addResults('nunit', this.opts.nunit);
    }
    if (this.opts.xunit) {
      this.#addResults('xunit', this.opts.xunit);
    }
    if (this.opts.mstest) {
      this.#addResults('mstest', this.opts.mstest);
    }
  }

  /**
   * @param {string} type
   * @param {string} file
   */
  #addResults(type, file) {
    this.config.results = [
      {
        type,
        files: [path.join(file)]
      }
    ]
  }

  #buildTargets() {
    if (this.opts.slack) {
      this.#addTarget('slack', this.opts.slack);
    }
    if (this.opts.teams) {
      this.#addTarget('teams', this.opts.teams);
    }
    if (this.opts.chat) {
      this.#addTarget('chat', this.opts.chat);
    }
    if (this.opts.github) {
      this.#addTarget('github', this.opts.github);
    }
  }

  #addTarget(name, url) {
    this.config.targets = this.config.targets || [];
    if (name === 'github') {
      this.config.targets.push({ name, inputs: { token: this.opts.github, title: this.opts.title || '', only_failures: true } })
    } else {
      this.config.targets.push({ name, inputs: { url, title: this.opts.title || '', only_failures: true } })
    }
  }

  #buildExtensions() {
    if (this.opts['ci-info']) {
      this.#addExtension('ci-info');
    }
    if (this.opts['chart-test-summary']) {
      this.#addExtension('quick-chart-test-summary');
    }
  }

  #addExtension(name) {
    this.config.extensions = this.config.extensions || [];
    this.config.extensions.push({ name });
  }

}

module.exports = { ConfigBuilder };