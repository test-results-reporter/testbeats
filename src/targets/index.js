const teams = require('./teams');
const slack = require('./slack');
const chat = require('./chat');
const github = require('./github');
const custom = require('./custom');
const delay = require('./delay');
const influx = require('./influx');
const { TARGET } = require('../helpers/constants');
const { checkCondition } = require('../helpers/helper');

function getTargetRunner(target) {
  switch (target.name) {
    case TARGET.TEAMS:
      return teams;
    case TARGET.SLACK:
      return slack;
    case TARGET.CHAT:
      return chat;
    case TARGET.GITHUB:
      return github;
    case TARGET.CUSTOM:
      return custom;
    case TARGET.DELAY:
      return delay;
    case TARGET.INFLUX:
      return influx;
    default:
      return require(target.name);
  }
}

async function run(target, result) {
  const target_runner = getTargetRunner(target);
  const target_options = Object.assign({}, target_runner.default_options, target);
  if (await checkCondition({ condition: target_options.condition, result, target })) {
    await target_runner.run({result, target});
  }
}

async function handleErrors({ target, errors }) {
  const target_runner = getTargetRunner(target);
  if (target_runner.handleErrors) {
    await target_runner.handleErrors({ target, errors });
  }
}

module.exports = {
  run,
  handleErrors
}