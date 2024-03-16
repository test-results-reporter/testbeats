const { STATUS, HOOK } = require("../helpers/constants");
const { getLinks } = require('../helpers/helper');
const { addChatExtension, addSlackExtension, addTeamsExtension } = require('../helpers/extension.helper');

async function run({ target, extension, payload, result }) {
  const raw_links = await getLinks({ target, extension, result, links: extension.inputs.links, default_options })
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
    addTeamsExtension({ payload, extension, text: links.join(' ｜ ') });
  }
}

function attachLinksToSLack({ extension, payload, raw_links }) {
  const links = [];
  for (const link of raw_links) {
    links.push(`<${link.url}|${link.text}>`);
  }
  if (links.length) {
    extension.inputs.block_type = 'context';
    addSlackExtension({ payload, extension, text: links.join(' ｜ ') });
  }
}

function attachLinksToChat({ extension, payload, raw_links }) {
  const links = [];
  for (const link of raw_links) {
    links.push(`<a href="${link.url}">${link.text}</a>`);
  }
  if (links.length) {
    addChatExtension({ payload, extension, text: links.join(' ｜ ') });
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