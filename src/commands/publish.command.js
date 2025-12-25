const trp = require('test-results-parser');
const prp = require('performance-results-parser');

const beats = require('../beats');
const target_manager = require('../targets');
const logger = require('../utils/logger');
const { processData } = require('../helpers/helper');
const { ExtensionsSetup } = require('../setups/extensions.setup');
const { sortExtensionsByOrder } = require('../helpers/extension.helper');
const { BaseCommand } = require('./base.command');

class PublishCommand extends BaseCommand {

  /**
   * @param {import('../index').CommandLineOptions} opts
   */
  constructor(opts) {
    super(opts);
    this.errors = [];
  }

  async publish() {
    this.printBanner();
    this.validateEnvDetails();
    this.buildConfig();
    this.#validateOptions();
    this.#processConfig();
    this.#validateConfig();
    this.#processResults();
    await this.#setupExtensions();
    await this.#publishResults();
    await this.#publishErrors();
  }

  #validateOptions() {
    if (!this.opts) {
      throw new Error('Missing publish options');
    }
    if (!this.opts.config) {
      throw new Error('Missing publish config');
    }
  }

  #processConfig() {
    const processed_config = processData(this.opts.config);
    /**@type {import('../index').PublishConfig[]} */
    this.configs = [];
    if (processed_config.reports) {
      for (const report of processed_config.reports) {
        this.configs.push(report);
      }
    } else {
      this.configs.push(processed_config);
    }
  }

  #validateConfig() {
    logger.info("🚓 Validating configuration...")
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
      if (target.enable === false || target.enable === 'false') {
        continue;
      }
      if (!target.name) {
        throw new Error(`'config.targets[*].name' is missing`);
      }
      if (target.name === 'slack' || target.name === 'teams' || target.name === 'chat') {
        if (!target.inputs) {
          throw new Error(`missing inputs in ${target.name} target`);
        }
      }
      if (target.inputs) {
        this.#validateURL(target);
      }
    }
    logger.debug("Validating targets - Successful!")
  }

  #validateURL(target) {
    const inputs = target.inputs;
    if (target.name === 'slack' || target.name === 'teams' || target.name === 'chat') {
      if (inputs.token) {
        if (!Array.isArray(inputs.channels)) {
          throw new Error(`channels in ${target.name} target inputs must be an array`);
        }
        if (!inputs.channels.length) {
          throw new Error(`at least one channel must be defined in ${target.name} target inputs`);
        }
        for (const channel of inputs.channels) {
          if (typeof channel !== 'string') {
            throw new Error(`channel in ${target.name} target inputs must be a string`);
          }
        }
        return;
      }

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
          const { result, errors } = trp.parseV2(result_options);
          if (result) {
            this.results.push(result);
          }
          if (errors) {
            this.errors = this.errors.concat(errors);
          }
        }
      }
    }
  }

  async #setupExtensions() {
    logger.info('⚙️ Setting up extensions...');
    try {
      for (const config of this.configs) {
        const extensions = config.extensions || [];
        const setup = new ExtensionsSetup(extensions, this.results ? this.results[0] : null);
        await setup.run();
      }
    } catch (error) {
      logger.error(`❌ Error setting up extensions: ${error.message}`);
    }
  }

  async #publishResults() {
    if (!this.results.length) {
      logger.warn('⚠️ No results to publish');
      return;
    }

    for (const config of this.configs) {
      for (let i = 0; i < this.results.length; i++) {
        const result = this.results[i];
        if (config.api_key) {
          result.name = config.run || result.name || 'demo-run';
        }
        config.extensions = config.extensions || [];
        await beats.run(config, result);
        if (config.targets) {
          for (const target of config.targets) {
            if (target.enable === false || target.enable === 'false') {
              continue;
            }
            target.extensions = target.extensions || [];
            target.extensions = config.extensions.concat(target.extensions);
            target.extensions = sortExtensionsByOrder(target.extensions);
            await target_manager.run(target, result);
          }
        } else {
          logger.warn('⚠️ No targets defined, skipping sending results to targets');
        }
      }
    }
    logger.info('✅ Results published successfully!');
  }

  async #publishErrors() {
    if (!this.errors.length) {
      logger.debug('⚠️ No errors to publish');
      return;
    }
    logger.info('🛑 Publishing errors...');
    for (const config of this.configs) {
      if (config.targets) {
        for (const target of config.targets) {
          await target_manager.handleErrors({ target, errors: this.errors });
        }
      }
    }
    throw new Error(this.errors.join('\n'));
  }

}

module.exports = { PublishCommand }
