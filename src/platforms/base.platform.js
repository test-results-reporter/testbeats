const { getPercentage, getPrettyDuration } = require('../helpers/helper')

class BasePlatform {

  /**
   * @param {string|number} text
   */
  bold(text) {
    if (text) {
      return `**${text}**`;
    }
    return text;
  }

  break() {
    return '\n';
  }

  /**
   * @param {string[]} values
   */
  merge(values) {
    return this.getValidTexts(values).join(this.break());
  }

  /**
   * @param {string[]} items - Array of strings to convert to bullet points
   * @returns {string} - Formatted bullet points as a string
   */
  bullets(items) {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return '';
    }
    return this.merge(items.map(item => `- ${item}`));
  }

  /**
   * @param {string} text
   * @returns {string}
   */
  code(text) {
    return text;
  }

  /**
   * @param {string} text
   * @param {string} url
   * @returns {string}
   */
  link(text, url) {
    if (url) {
      if (!text) {
        text = url;
      }
      return `[${text}](${url})`;
    }
    return url;
  }

  /**
   * @param {string[]} texts
   * @returns {string[]}
   */
  getValidTexts(texts) {
    return texts.filter(text => !!text);
  }
}

module.exports = { BasePlatform }