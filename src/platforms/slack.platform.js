const { BasePlatform } = require("./base.platform");

class SlackPlatform extends BasePlatform {

  /**
   * @param {string|number} text
   */
  bold(text) {
    return `*${text}*`;
  }

  break() {
    return '\n';
  }
}

module.exports = { SlackPlatform }