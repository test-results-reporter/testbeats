const rp_analysis = require('./report-portal-analysis');

async function run(extension, params) {
  switch (extension.name) {
    case 'report-portal-analysis':
      await rp_analysis.run(extension, params);
      break;
    default:
      break;
  }
}

function setDefaults(extension) {
  let defaults = {};
  switch (extension.name) {
    case 'report-portal-analysis':
      defaults = rp_analysis.defaults;
      break;
    default:
      break;
  }
  extension.hook = extension.hook ? extension.hook : defaults.hook ? defaults.hook : 'end';
  extension.condition = extension.condition ? extension.condition : defaults.condition ? defaults.condition : 'pass';
}

module.exports = {
  run,
  setDefaults
}