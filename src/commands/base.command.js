const pkg = require('../../package.json');
const { MIN_NODE_VERSION } = require('../helpers/constants');
const { ConfigBuilder } = require('../utils/config.builder');
const logger = require('../utils/logger');
const os = require('os');
const { getCIInformation } = require('../helpers/ci');

class BaseCommand {
  constructor(opts) {
    /**
     * @type {import('../index').CommandLineOptions}
     */
    this.opts = opts;
  }

  printBanner() {
    const banner = `
     _____             _    ___                  _
    (_   _)           ( )_ (  _'\\               ( )_
      | |   __    ___ | ,_)| (_) )   __     _ _ | ,_)  ___
      | | /'__'\\/',__)| |  |  _ <' /'__'\\ /'_' )| |  /',__)
      | |(  ___/\\__, \\| |_ | (_) )(  ___/( (_| || |_ \\__, \\
      (_)'\\____)(____/'\\__)(____/''\\____)'\\__,_)'\\__)(____/

                         v${pkg.version}
    `;
    console.log(banner);
  }

  validateEnvDetails() {
    try {
      const current_major_version = parseInt(process.version.split('.')[0].replace('v', ''));
      if (current_major_version >= MIN_NODE_VERSION) {
        logger.info(`💻 NodeJS: ${process.version}, OS: ${os.platform()}, Version: ${os.release()}, Arch: ${os.machine()}`);
        return;
      }
    } catch (error) {
      logger.warn(`⚠️ Unable to verify NodeJS version: ${error.message}`);
      return;
    }
    throw new Error(`❌ Supported NodeJS version is >= v${MIN_NODE_VERSION}. Current version is ${process.version}`)
  }

  buildConfig() {
    const config_builder = new ConfigBuilder(this.opts, getCIInformation(), process.env);
    config_builder.build();
  }

}

module.exports = { BaseCommand };