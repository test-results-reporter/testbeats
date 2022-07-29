const { STATUS, HOOK } = require("../helpers/constants");
const { addExtension } = require('../helpers/teams');
const { addContextTextBlock } = require('../helpers/slack');
const { addTextSection } = require('../helpers/chat');
const { checkCondition } = require('../helpers/helper');

async function run({ target, extension, payload, result }) {
  const raw_links = await getLinks({ target, extension, result })
  if (target.name === 'teams') {
    extension.inputs = Object.assign({}, default_inputs_teams, extension.inputs);
    attachLinksToTeams({ extension, payload, raw_links });
  } else if (target.name === 'slack') {
    extension.inputs = Object.assign({}, default_inputs_slack, extension.inputs);
    attachLinksToSLack({ extension, payload, raw_links });
  } else if (target.name === 'chat') {
    extension.inputs = Object.assign({}, default_inputs_chat, extension.inputs);
    attachLinksToChat({ extension, payload, raw_links });
  }
}

function attachLinksToTeams({ extension, payload, raw_links }) {
  const links = [];
  for (const link of raw_links) {
    links.push(`[${link.text}](${link.url})`);
  }
  if (links.length) {
    addExtension({ payload, extension, text: links.join(' ｜ ') });
  }
}

function attachLinksToSLack({ extension, payload, raw_links }) {
  const links = [];
  for (const link of raw_links) {
    links.push(`<${link.url}|${link.text}>`);
  }
  if (links.length) {
    addContextTextBlock({ payload, extension, text: links.join(' ｜ ') });
  }
}

function attachLinksToChat({ extension, payload, raw_links }) {
  const links = [];
  for (const link of raw_links) {
    links.push(`<a href="${link.url}">${link.text}</a>`);
  }
  if (links.length) {
    addTextSection({ payload, extension, text: links.join(' ｜ ') });
  }
}

async function getLinks({ target, result, extension }) {
  const raw_links = extension.inputs.links;
  const raw_valid_links = await getValidLinks(raw_links, result);
  for (let i = 0; i < raw_valid_links.length; i++) {
    const url_function = raw_valid_links[i].url;
    if (typeof url_function === 'function') {
      raw_valid_links[i].url = await raw_valid_links[i].url({target, extension, result});
    }
  }
  return raw_valid_links;
}

async function getValidLinks(links, result) {
  const valid_links = [];
  for (const link of links) {
    const condition = link.condition || default_options.condition;
    if (await checkCondition({ condition, result })) {
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