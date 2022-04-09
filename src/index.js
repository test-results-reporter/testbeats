const cmd_publish = require('./commands/publish');

function publish(options) {
  return cmd_publish.run(options);
}

module.exports = {
  publish
}