const { PublishCommand } = require('./commands/publish.command');

function publish(options) {
  const publish_command = new PublishCommand(options);
  return publish_command.publish();
}

function defineConfig(config) {
  return config
}

module.exports = {
  publish,
  defineConfig
}