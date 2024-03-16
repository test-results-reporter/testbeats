const { STATUS, HOOK } = require("../helpers/constants");
const { addChatExtension, addSlackExtension, addTeamsExtension } = require('../helpers/extension.helper');
const { getTeamsMetaDataText, getSlackMetaDataText, getChatMetaDataText } = require("../helpers/metadata.helper");

async function run({ target, extension, payload, result }) {
  const elements = get_elements(extension.inputs.links);
  if (target.name === 'teams') {
    extension.inputs = Object.assign({}, default_inputs_teams, extension.inputs);
    const text = await getTeamsMetaDataText({ elements, target, extension, result, default_condition: default_options.condition });
    if (text) {
      addTeamsExtension({ payload, extension, text });
    }
  } else if (target.name === 'slack') {
    extension.inputs = Object.assign({}, default_inputs_slack, extension.inputs);
    extension.inputs.block_type = 'context';
    const text = await getSlackMetaDataText({ elements, target, extension, result, default_condition: default_options.condition });
    if (text) {
      addSlackExtension({ payload, extension, text });
    }
  } else if (target.name === 'chat') {
    extension.inputs = Object.assign({}, default_inputs_chat, extension.inputs);
    const text = await getChatMetaDataText({ elements, target, extension, result, default_condition: default_options.condition });
    if (text) {
      addChatExtension({ payload, extension, text });
    }
  }
}

/**
 * 
 * @param {import("..").Link[]} links 
 */
function get_elements(links) {
  return links.map(_ => { return { key: _.text, value: _.url, type: 'hyperlink', condition: _.condition } });
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