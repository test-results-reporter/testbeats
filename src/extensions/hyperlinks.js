const { STATUS } = require("../helpers/constants");

async function run({ target, extension, payload, result }) {
  if (target.name === 'teams') {
    attachTeamLinks({ extension, payload, result });
  } else if (target.name === 'slack') {
    attachSlackLinks({ extension, payload, result });
  }
}

function attachTeamLinks({ extension, payload, result }) {
  const links = [];
  for (const link of extension.inputs.links) {
    link["condition"] = link.condition || default_options.condition;
    if (link.condition.toLowerCase().includes(result.status.toLowerCase())) {
      links.push(`[${link.text}](${link.url})`);
    }
  }
  if (links.length) {
    payload.body.push({
      "type": "TextBlock",
      "text": links.join(' ｜ '),
      "separator": true
    });
  }
}

function attachSlackLinks({ extension, payload, result }) {
  const links = [];
  for (const link of extension.inputs.links) {
    link["condition"] = link.condition || default_options.condition;
    if (link.condition.toLowerCase().includes(result.status.toLowerCase())) {
      links.push(`<${link.url}|${link.text}>`);
    }
  }
  if (links.length) {
    payload.blocks.push({
      "type": "context",
      "elements": [
        {
          "type": "mrkdwn",
          "text": links.join(' ｜ ')
        }
      ]
    });
  }
}

const default_options = {
  hook: 'end',
  condition: STATUS.PASS_OR_FAIL
}

module.exports = {
  run,
  default_options
}