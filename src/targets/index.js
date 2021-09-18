const teams = require('./teams');

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

async function send(target, results, options) {
  const name = identifyTarget(target);
  switch (name) {
    case 'teams':
      await teams.send(target, results, options)
      break;
    default:
      console.log(`UnSupported Target Type - ${name}`);
      break;
  }
}

module.exports = {
  send
}