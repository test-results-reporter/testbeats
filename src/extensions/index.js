const hyperlinks = require('./hyperlinks');
const rp_analysis = require('./report-portal-analysis');

async function run(options) {
  const { target, result, hook } = options;
  const extensions = target.extensions || [];
  for (let i = 0; i < extensions.length; i++) {
    const extension = extensions[i];
    const extension_runner = getExtensionRunner(extension);
    const extension_options = Object.assign({}, extension_runner.default_options, extension);
    if (extension_options.hook === hook) {
      if (extension_options.condition.toLowerCase().includes(result.status.toLowerCase())) {
        options.extension = extension;
        await extension_runner.run(options);
      }
    }
  }
}

function getExtensionRunner(extension) {
  switch (extension.name) {
    case 'hyperlinks':
      return hyperlinks;
    case 'report-portal-analysis':
      return rp_analysis;
    default:
      return require(extension.name);
  }
}

module.exports = {
  run
}