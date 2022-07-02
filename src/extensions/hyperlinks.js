const { STATUS, HOOK } = require("../helpers/constants");
const { addExtension } = require('../helpers/teams');
const { addContextTextBlock } = require('../helpers/slack');
const { addTextSection } = require('../helpers/chat');
const { checkCondition } = require('../helpers/helper');

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
  for (const link of getValidLinks(extension.inputs.links, result)) {
    links.push(`[${link.text}](${link.url})`);
  }
  if (links.length) {
    addExtension({ payload, extension, text: links.join(' ｜ ') });
  }
}

function attachLinksToSLack({ extension, payload, result }) {
  const links = [];
  for (const link of getValidLinks(extension.inputs.links, result)) {
    links.push(`<${link.url}|${link.text}>`);
  }
  if (links.length) {
    addContextTextBlock({ payload, extension, text: links.join(' ｜ ') });
  }
}

function attachLinksToChat({ extension, payload, result }) {
  const links = [];
  for (const link of getValidLinks(extension.inputs.links, result)) {
    links.push(`<a href="${link.url}">${link.text}</a>`);
  }
  if (links.length) {
    addTextSection({ payload, extension, text: links.join(' ｜ ') });
  }
}

function getValidLinks(links, result) {
  const valid_links = [];
  for (const link of links) {
    const condition = link.condition || default_options.condition;
    if (checkCondition({ condition, result })) {
      valid_links.push(link);
    }
  }
  return valid_links;
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