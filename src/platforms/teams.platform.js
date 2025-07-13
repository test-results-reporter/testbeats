const { BasePlatform } = require("./base.platform");

class TeamsPlatform extends BasePlatform {

  break() {
    return '\n\n';
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
}

module.exports = { TeamsPlatform }