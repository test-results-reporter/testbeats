const { STATUS, HOOK } = require("../helpers/constants");
const { addExtension } = require('../helpers/teams');
const { addContextText } = require('../helpers/slack');

async function run({ target, extension, payload, result }) {
  if (target.name === 'teams') {
    extension.inputs = Object.assign({}, default_inputs_teams, extension.inputs);
    attachTeamLinks({ extension, payload, result });
  } else if (target.name === 'slack') {
    extension.inputs = Object.assign({}, default_inputs_slack, extension.inputs);
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
    addContextText({ payload, extension, text: links.join(' ｜ ') });
  }
}

const default_options = {
  hook: HOOK.END,
  condition: STATUS.PASS_OR_FAIL,
}

const default_inputs_teams = {
  title: '',
  separator: true
}

const default_inputs_slack = {
  title: '',
  separator: false
}

module.exports = {
  run,
  default_options
}