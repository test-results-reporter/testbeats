const { BasePlatform } = require("./base.platform");

class ChatPlatform extends BasePlatform {

  /**
   * @param {string|number} text
   */
  bold(text) {
    return `<b>${text}</b>`;
  }

  break() {
    return '<br>';
  }

  /**
   * @param {string[]} items - Array of strings to convert to bullet points
   * @returns {string} - Formatted bullet points as a string
   */
  bullets(items) {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return '';
    }
    return this.merge(items.map(item => `• ${item}`));
  }

}

module.exports = { ChatPlatform }