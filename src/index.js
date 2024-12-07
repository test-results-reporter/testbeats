const { PublishCommand } = require('./commands/publish.command');
const { GenerateConfigCommand } = require('./commands/generate-config.command');

function publish(options) {
  const publish_command = new PublishCommand(options);
  return publish_command.publish();
}

function generateConfig() {
  const generate_command = new GenerateConfigCommand();
  return generate_command.execute();
}

function defineConfig(config) {
  return config;
}

module.exports = {
  publish,
  generateConfig,
  defineConfig
}