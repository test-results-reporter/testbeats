const TestResult = require('test-results-parser/src/models/TestResult');
const logger = require('../utils/logger');
const { addChatExtension, addSlackExtension, addTeamsExtension } = require('../helpers/extension.helper');

class BaseExtension {

  /**
   *
   * @param {import('..').ITarget} target
   * @param {import('..').IExtension} extension
   * @param {TestResult} result
   * @param {any} payload
   * @param {any} root_payload
   */
  constructor(target, extension, result, payload, root_payload) {
    this.target = target;
    this.extension = extension;

    /** @type {TestResult} */
    this.result = result;
    this.payload = payload;
    this.root_payload = root_payload;

    this.text = '';

    /**
     * @type {import('..').ExtensionInputs}
     */
    this.default_inputs = {};

    /**
     * @type {import('..').IExtensionDefaultOptions}
     */
    this.default_options = {};
  }

  updateExtensionInputs() {
    this.extension.inputs = Object.assign({}, this.default_inputs, this.extension.inputs);
    switch (this.target.name) {
      case 'teams':
        this.extension.inputs = Object.assign({}, { separator: true }, this.extension.inputs);
        break;
      case 'slack':
        this.extension.inputs = Object.assign({}, { separator: false }, this.extension.inputs);
        break;
      case 'chat':
        this.extension.inputs = Object.assign({}, { separator: true }, this.extension.inputs);
        break;
      default:
        break;
    }
  }

  attach() {
    if (!this.text) {
      logger.debug(`⚠️ Extension '${this.extension.name}' has no text. Skipping.`);
      return;
    }

    switch (this.target.name) {
      case 'teams':
        addTeamsExtension({ payload: this.payload, extension: this.extension, text: this.text });
        break;
      case 'slack':
        addSlackExtension({ payload: this.payload, extension: this.extension, text: this.text });
        break;
      case 'chat':
        addChatExtension({ payload: this.payload, extension: this.extension, text: this.text });
        break;
      default:
        break;
    }
  }

  /**
   * @param {string[]} texts
   */
  mergeTexts(texts) {
    const _texts = texts.filter(text => !!text);
    switch (this.target.name) {
      case 'teams':
        return _texts.join('\n\n');
      case 'slack':
        return _texts.join('\n');
      case 'chat':
        return _texts.join('<br>');
      default:
        break;
    }
  }

  /**
   * @param {string|number} text
   */
  bold(text) {
    switch (this.target.name) {
      case 'teams':
        return `**${text}**`;
      case 'slack':
        return `*${text}*`;
      case 'chat':
        return `<b>${text}</b>`;
      default:
        break;
    }
  }

}

module.exports = { BaseExtension }