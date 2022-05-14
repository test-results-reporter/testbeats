const teams = require('./teams');
const slack = require('./slack');
const custom = require('./custom');
const delay = require('./delay');

function identifyTarget(target) {
  if (target.name) {
    return target.name;
  }
  const url = target.url || target.webhook || target['incoming-webhook-url'];
  if (url) {
    if (url.includes('hooks.slack.com')) {
      return 'slack';
    } else if (url.includes('webhook.office.com')) {
      return 'team';
    }
  }
  return '';
}

async function send(options, results) {
  const name = identifyTarget(options);
  switch (name) {
    case 'teams':
      await teams.send(options, results)
      break;
    case 'slack':
      await slack.send(options, results)
      break;
    case 'custom':
      await custom.send(options, results)
      break;
    default:
      console.log(`UnSupported Target Type - ${name}`);
      break;
  }
}

function getTargetRunner(target) {
  switch (target.name) {
    case 'teams':
      return teams;
    case 'slack':
      return slack;
    case 'custom':
      return custom;
    case 'delay':
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
  send,
  run
}