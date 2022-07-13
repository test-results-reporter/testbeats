const cmd_publish = require('./commands/publish');

function publish(options) {
  return cmd_publish.run(options);
}

function defineConfig(config) {
  return config
}

module.exports = {
  publish,
  defineConfig
}