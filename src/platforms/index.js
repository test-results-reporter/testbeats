const { TARGET } = require("../helpers/constants");
const { SlackPlatform } = require('./slack.platform');
const { TeamsPlatform } = require('./teams.platform');
const { ChatPlatform } = require('./chat.platform');
const { GitHubPlatform } = require('./github.platform');
const { BasePlatform } = require('./base.platform');

/**
 *
 * @param {string} name
 */
function getPlatform(name) {
  switch (name) {
    case TARGET.SLACK:
      return new SlackPlatform();
    case TARGET.TEAMS:
      return new TeamsPlatform();
    case TARGET.CHAT:
      return new ChatPlatform();
    case TARGET.GITHUB:
      return new GitHubPlatform();
    default:
      return new BasePlatform();
  }
}

module.exports = {
  getPlatform
}