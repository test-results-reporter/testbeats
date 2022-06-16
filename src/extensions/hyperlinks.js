const { STATUS, HOOK } = require("../helpers/constants");
const { addExtension } = require('../helpers/teams');

async function run({ target, extension, payload, result }) {
  extension.inputs = Object.assign({}, default_inputs, extension.inputs);
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
    addExtension({ payload, extension, text: links.join(' ｜ ') });
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
  hook: HOOK.END,
  condition: STATUS.PASS_OR_FAIL,
}

const default_inputs = {
  title: '',
  separator: true
}

module.exports = {
  run,
  default_options
}