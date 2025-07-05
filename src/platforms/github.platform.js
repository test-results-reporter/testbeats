const { BasePlatform } = require('./base.platform');

class GitHubPlatform extends BasePlatform {

  /**
   * @param {string|number} text
   */
  bold(text) {
    return `**${text}**`;
  }

  break() {
    return '\n';
  }

}

module.exports = { GitHubPlatform };