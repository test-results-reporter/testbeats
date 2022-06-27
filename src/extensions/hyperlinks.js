const { STATUS, HOOK } = require("../helpers/constants");
const { addExtension } = require('../helpers/teams');
const { addContextTextBlock } = require('../helpers/slack');
const { addTextSection } = require('../helpers/chat');

async function run({ target, extension, payload, result }) {
  if (target.name === 'teams') {
    extension.inputs = Object.assign({}, default_inputs_teams, extension.inputs);
    attachLinksToTeams({ extension, payload, result });
  } else if (target.name === 'slack') {
    extension.inputs = Object.assign({}, default_inputs_slack, extension.inputs);
    attachLinksToSLack({ extension, payload, result });
  } else if (target.name === 'chat') {
    extension.inputs = Object.assign({}, default_inputs_chat, extension.inputs);
    attachLinksToChat({ extension, payload, result });
  }
}

function attachLinksToTeams({ extension, payload, result }) {
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

function attachLinksToSLack({ extension, payload, result }) {
  const links = [];
  for (const link of extension.inputs.links) {
    link["condition"] = link.condition || default_options.condition;
    if (link.condition.toLowerCase().includes(result.status.toLowerCase())) {
      links.push(`<${link.url}|${link.text}>`);
    }
  }
  if (links.length) {
    addContextTextBlock({ payload, extension, text: links.join(' ｜ ') });
  }
}

function attachLinksToChat({ extension, payload, result }) {
  const links = [];
  for (const link of extension.inputs.links) {
    link["condition"] = link.condition || default_options.condition;
    if (link.condition.toLowerCase().includes(result.status.toLowerCase())) {
      links.push(`<a href="${link.url}">${link.text}</a>`);
    }
  }
  if (links.length) {
    addTextSection({ payload, extension, text: links.join(' ｜ ') });
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

const default_inputs_chat = {
  title: '',
  separator: true
}

module.exports = {
  run,
  default_options
}