const { STATUS, HOOK } = require("../helpers/constants");
const { addChatExtension, addSlackExtension, addTeamsExtension } = require('../helpers/extension.helper');

/**
 * @param {object} param0
 * @param {import('..').Target} param0.target
 * @param {import('..').MetadataExtension} param0.extension
 */
async function run({ target, extension, result, payload, root_payload }) {
  extension.inputs = Object.assign({}, default_inputs, extension.inputs);
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
  const text = extension.inputs.failure_summary
  if (text) {
    addTeamsExtension({ payload, extension, text });
  }
}

async function attachForSlack({ target, extension, payload, result }) {
  const text = extension.inputs.failure_summary
  if (text) {
    addSlackExtension({ payload, extension, text });
  }
}

async function attachForChat({ target, extension, payload, result }) {
  const text = extension.inputs.failure_summary
  if (text) {
    addChatExtension({ payload, extension, text });
  }
}

const default_options = {
  hook: HOOK.AFTER_SUMMARY,
  condition: STATUS.FAIL,
}

const default_inputs = {
  title: 'AI Failure Summary ✨'
}

const default_inputs_teams = {
  separator: true
}

const default_inputs_slack = {
  separator: false
}

const default_inputs_chat = {
  separator: true
}

module.exports = {
  run,
  default_options
}