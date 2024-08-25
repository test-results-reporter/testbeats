const { TARGET } = require("../helpers/constants");
const { SlackPlatform } = require('./slack.platform');
const { TeamsPlatform } = require('./teams.platform');
const { ChatPlatform } = require('./chat.platform');

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
    default:
      throw new Error('Invalid Platform');
  }
}

module.exports = {
  getPlatform
}