const teams = require('./teams');
const slack = require('./slack');
const custom = require('./custom');

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

module.exports = {
  send
}