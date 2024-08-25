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

}

module.exports = { ChatPlatform }