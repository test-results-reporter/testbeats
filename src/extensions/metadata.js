const { HOOK, STATUS } = require('../helpers/constants');
const { addChatExtension, addSlackExtension, addTeamsExtension } = require('../helpers/extension.helper');
const { getTeamsMetaDataText, getSlackMetaDataText, getChatMetaDataText } = require('../helpers/metadata.helper');

/**
 * @param {object} param0
 * @param {import('..').Target} param0.target
 * @param {import('..').MetadataExtension} param0.extension
 */
async function run({ target, extension, result, payload, root_payload }) {
  if (target.name === 'teams') {
    extension.inputs = Object.assign({}, default_inputs_teams, extension.inputs);
    await attachForTeams({ target, extension, payload, result });
  } else if (target.name === 'slack') {
    extension.inputs = Object.assign({}, default_inputs_slack, extension.inputs);
    await attachForSlack({ target, extension, payload, result });
  } else if (target.name === 'chat') {
    extension.inputs = Object.assign({}, default_inputs_chat, extension.inputs);
    await attachForChat({ target, extension, payload, result });
  }
}

/**
 * @param {object} param0
 * @param {import('..').MetadataExtension} param0.extension
 */
async function attachForTeams({ target, extension, payload, result }) {
  const text = await getTeamsMetaDataText({
    elements: extension.inputs.data,
    target,
    extension,
    result,
    default_condition: default_options.condition
  });
  if (text) {
    addTeamsExtension({ payload, extension, text });
  }
}

async function attachForSlack({ target, extension, payload, result }) {
  const text = await getSlackMetaDataText({
    elements: extension.inputs.data,
    target,
    extension,
    result,
    default_condition: default_options.condition
  });
  if (text) {
    addSlackExtension({ payload, extension, text });
  }
}

async function attachForChat({ target, extension, payload, result }) {
  const text = await getChatMetaDataText({
    elements: extension.inputs.data,
    target,
    extension,
    result,
    default_condition: default_options.condition
  });
  if (text) {
    addChatExtension({ payload, extension, text });
  }
}

const default_options = {
  hook: HOOK.END,
  condition: STATUS.PASS_OR_FAIL
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