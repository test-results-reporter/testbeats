const teams = require('./teams');
const slack = require('./slack');
const custom = require('./custom');
const delay = require('./delay');
const { TARGET } = require('../helpers/constants');

function getTargetRunner(target) {
  switch (target.name) {
    case TARGET.TEAMS:
      return teams;
    case TARGET.SLACK:
      return slack;
    case TARGET.CUSTOM:
      return custom;
    case TARGET.DELAY:
      return delay;
    default:
      return require(target.name);
  }
}

async function run(target, result) {
  const target_runner = getTargetRunner(target);
  const target_options = Object.assign({}, target_runner.default_options, target);
  if (target_options.condition.toLowerCase().includes(result.status.toLowerCase())) {
    await target_runner.run({result, target});
  }
}

module.exports = {
  run
}