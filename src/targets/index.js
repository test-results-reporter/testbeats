const teams = require('./teams');
const slack = require('./slack');
const chat = require('./chat');
const github = require('./github');
const { CustomTarget } = require('./custom.target');
const { DelayTarget } = require('./delay.target');
const { HttpTarget } = require('./http.target');
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
      return new CustomTarget({ target });
    case TARGET.DELAY:
      return new DelayTarget({ target });
    case TARGET.INFLUX:
      return influx;
    case TARGET.HTTP:
      return new HttpTarget({ target });
    default:
      return require(target.name);
  }
}

async function run(target, result) {
  const target_runner = getTargetRunner(target);
  // const target_options = Object.assign({}, target_runner.default_options, target);
  const condition = target.condition ||  target_runner.default_options?.condition || target_runner.condition;
  if (await checkCondition({ condition, result, target })) {
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