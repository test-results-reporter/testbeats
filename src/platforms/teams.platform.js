const { BasePlatform } = require("./base.platform");

class TeamsPlatform extends BasePlatform {
  /**
   * @param {string|number} text
   */
  bold(text) {
    return `**${text}**`;
  }

  break() {
    return '\n\n';
  }
}

module.exports = { TeamsPlatform }