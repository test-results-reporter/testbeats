const path = require('path');
const trp = require('test-results-parser');
const prp = require('performance-results-parser');

const beats = require('../beats');
const { ConfigBuilder } = require('../utils/config.builder');
const target_manager = require('../targets');
const logger = require('../utils/logger');
const { processData } = require('../helpers/helper');
const pkg = require('../../package.json');
const {checkEnvDetails} = require('../helpers/helper');

class PublishCommand {

  /**
   * @param {import('../index').PublishOptions} opts
   */
  constructor(opts) {
    this.opts = opts;
  }

  async publish() {
    logger.info(`🥁 TestBeats v${pkg.version}`);

    const envDetails = checkEnvDetails();
    // Check OS and NodeJS version
    logger.info(`💻 ${envDetails}`);

    this.#buildConfig();
    this.#validateOptions();
    this.#setConfigFromFile();
    this.#processConfig();
    this.#validateConfig();
    this.#processResults();
    await this.#publishResults();
    logger.info('✅ Results published successfully!');
  }

  #buildConfig() {
    const config_builder = new ConfigBuilder(this.opts);
    config_builder.build();
  }

  #validateOptions() {
    if (!this.opts) {
      throw new Error('Missing publish options');
    }
    if (!this.opts.config) {
      throw new Error('Missing publish config');
    }
  }

  #setConfigFromFile() {
    if (typeof this.opts.config === 'string') {
      const cwd = process.cwd();
      const file_path = path.join(cwd, this.opts.config);
      try {
        const config_json = require(path.join(cwd, this.opts.config));
        this.opts.config = config_json;
      } catch (error) {
        throw new Error(`Failed to read config file: '${file_path}' with error: '${error.message}'`);
      }
    }
  }

  #processConfig() {
    const processed_config = processData(this.opts.config);
    /**@type {import('../index').PublishConfig[]} */
    this.configs = [];
    if (processed_config.reports) {
      for (const report of config.reports) {
        this.configs.push(report);
      }
    } else {
      this.configs.push(processed_config);
    }
  }

  #validateConfig() {
    logger.info("🛠️  Validating configuration...")
    for (const config of this.configs) {
      this.#validateResults(config);
      this.#validateTargets(config);
    }
  }

  /**
 *
 * @param {import('../index').PublishReport} config
 */
  #validateResults(config) {
    logger.debug("Validating results...")
    if (!config.results) {
      throw new Error('Missing results properties in config');
    }
    if (!Array.isArray(config.results)) {
      throw new Error(`'config.results' must be an array`);
    }
    if (!config.results.length) {
      throw new Error('At least one result must be defined');
    }
    for (const result of config.results) {
      if (!result.type) {
        throw new Error('Missing result type');
      }
      if (result.type === 'custom') {
        if (!result.result) {
          throw new Error(`custom 'config.results[*].result' is missing`);
        }
      } else {
        if (!result.files) {
          throw new Error('Missing result files');
        }
        if (!Array.isArray(result.files)) {
          throw new Error('result files must be an array');
        }
        if (!result.files.length) {
          throw new Error('At least one result file must be defined');
        }
      }
    }
    logger.debug("Validating results - Successful!")
  }

  /**
   *
   * @param {import('../index').PublishReport} config
   */
  #validateTargets(config) {
    logger.debug("Validating targets...")
    if (!config.targets) {
      logger.warn('⚠️ Targets are not defined in config');
      return;
    }
    if (!Array.isArray(config.targets)) {
      throw new Error('targets must be an array');
    }
    for (const target of config.targets) {
      if (!target.name) {
        throw new Error(`'config.targets[*].name' is missing`);
      }
      if (target.name === 'slack' || target.name === 'teams' || target.name === 'chat') {
        if (!target.inputs) {
          throw new Error(`missing inputs in ${target.name} target`);
        }
      }
      if (target.inputs) {
        const inputs = target.inputs;
        if (target.name === 'slack' || target.name === 'teams' || target.name === 'chat') {
          if (!inputs.url) {
            throw new Error(`missing url in ${target.name} target inputs`);
          }
          if (typeof inputs.url !== 'string') {
            throw new Error(`url in ${target.name} target inputs must be a string`);
          }
          if (!inputs.url.startsWith('http')) {
            throw new Error(`url in ${target.name} target inputs must start with 'http' or 'https'`);
          }
        }
      }
    }
    logger.debug("Validating targets - Successful!")
  }

  #processResults() {
    logger.info('🧙 Processing results...');
    this.results = [];
    for (const config of this.configs) {
      for (const result_options of config.results) {
        if (result_options.type === 'custom') {
          this.results.push(result_options.result);
        } else if (result_options.type === 'jmeter') {
          this.results.push(prp.parse(result_options));
        } else {
          this.results.push(trp.parse(result_options));
        }
      }
    }
  }

  async #publishResults() {
    for (const config of this.configs) {
      for (let i = 0; i < this.results.length; i++) {
        const result = this.results[i];
        const global_extensions = config.extensions || [];
        await beats.run(config, result);
        if (config.targets) {
          for (const target of config.targets) {
            target.extensions = target.extensions || [];
            target.extensions = global_extensions.concat(target.extensions);
            await target_manager.run(target, result);
          }
        } else {
          logger.warn('⚠️ No targets defined, skipping sending results to targets');
        }
      }
    }
  }

}

module.exports = { PublishCommand }