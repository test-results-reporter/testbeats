const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const { BaseTarget } = require('./base.target');
const context = require('../utils/context.utils');

const DEFAULT_INPUTS = {
  output_file: process.env.GITHUB_OUTPUT, // Path to output file, defaults to GITHUB_OUTPUT env var
  key: 'testbeats' // Key name for the output
};

const default_options = {
  condition: 'passOrFail'
};

class GitHubOutputTarget extends BaseTarget {
  constructor({ target }) {
    super({ target });
  }

  async run({ result, target }) {
    this.result = result;
    this.setTargetInputs(target);

    logger.info(`🔔 Writing results to GitHub Actions outputs...`);
    return await this.writeToGitHubOutput({ target, result });
  }

  setTargetInputs(target) {
    target.inputs = Object.assign({}, DEFAULT_INPUTS, target.inputs);
  }

  async writeToGitHubOutput({ target, result }) {
    const outputFile = target.inputs.output_file || process.env.GITHUB_OUTPUT;

    if (!outputFile) {
      throw new Error('GitHub output file path is required. Set GITHUB_OUTPUT environment variable or provide output_file in target inputs.');
    }

    // Ensure the directory exists
    const outputDir = path.dirname(outputFile);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const lines = []
    lines.push(`${target.inputs.key}_results=${JSON.stringify(result)}`)
    lines.push(`${target.inputs.key}_stores=${JSON.stringify(context.stores)}`)
    const outputContent = lines.join('\n');

    fs.appendFileSync(outputFile, outputContent);

    logger.info(`✅ Successfully wrote results to ${outputFile}`);
    return { success: true, key: target.inputs.key };
  }

  async handleErrors({ target, errors }) {
    logger.error('GitHub Output target errors:', errors);
  }
}

module.exports = {
  GitHubOutputTarget
};
