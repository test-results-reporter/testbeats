const path = require('path');
const logger = require('./logger');

class ConfigBuilder {

  /**
   * @param {import('../index').CommandLineOptions} opts
   */
  constructor(opts) {
    this.opts = opts;
  }

  build() {
    if (!this.opts) {
      return;
    }
    if (this.opts.config && typeof this.opts.config === 'string') {
      return;
    }

    logger.info('🏗 Building config...')
    this.#buildConfig();
    this.#buildBeats();
    this.#buildResults();
    this.#buildTargets();
    this.#buildExtensions();

    logger.info(`🛠️ Generated Config: \n${JSON.stringify(this.config, null, 2)}`);

    this.opts.config = this.config;
  }

  #buildConfig() {
    /** @type {import('../index').PublishConfig}  */
    this.config = {};
  }

  #buildBeats() {
    this.config.project = this.opts.project || this.config.project;
    this.config.run = this.opts.run || this.config.run;
    this.config.api_key = this.opts['api-key'] || this.config.api_key;
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
  }

  #addTarget(name, url) {
    this.config.targets = this.config.targets || [];
    this.config.targets.push({ name, inputs: { url, title: this.opts.title || '', only_failures: true } })
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