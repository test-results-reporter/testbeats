const { HOOK, STATUS } = require('../helpers/constants');
const { addExtension } = require('../helpers/teams');
const { addTextBlock } = require('../helpers/slack');
const { addTextSection } = require('../helpers/chat');
const { checkCondition } = require('../helpers/helper');

/**
 * @param {object} param0
 * @param {import('..').Target} param0.target
 * @param {import('..').MetadataExtension} param0.extension
 */
async function run({ target, extension, result, payload, root_payload }) {
  if (target.name === 'teams') {
    extension.inputs = Object.assign({}, default_inputs_teams, extension.inputs);
    await attachForTeams({ extension, payload, result });
  } else if (target.name === 'slack') {
    extension.inputs = Object.assign({}, default_inputs_slack, extension.inputs);
    await attachForSlack({ extension, payload, result });
  } else if (target.name === 'chat') {
    extension.inputs = Object.assign({}, default_inputs_chat, extension.inputs);
    await attachForChat({ extension, payload, result });
  }
}

/**
 * @param {object} param0
 * @param {import('..').MetadataExtension} param0.extension
 */
async function attachForTeams({ extension, payload, result }) {
  const valid_data = await getValidData({ extension, result });
  if (valid_data.length > 0) {
    const data = [];
    for (const current of valid_data) {
      if (current.type === 'hyperlink') {
        data.push(`[${current.key}](${current.value})`);
      } else if (current.key) {
        data.push(`**${current.key}:** ${current.value}`);
      } else {
        data.push(current.value);
      }
    }
    addExtension({ payload, extension, text: data.join(' ｜ ') });
  }
}

async function attachForSlack({ extension, payload, result }) {
  const valid_data = await getValidData({ extension, result });
  if (valid_data.length > 0) {
    const data = [];
    for (const current of valid_data) {
      if (current.type === 'hyperlink') {
        data.push(`<${current.value}|${current.key}>`);
      } else if (current.key) {
        data.push(`*${current.key}:* ${current.value}`);
      } else {
        data.push(current.value);
      }
    }
    addTextBlock({ payload, extension, text: data.join(' ｜ ') });
  }
}

async function attachForChat({ extension, payload, result }) {
  const valid_data = await getValidData({ extension, result });
  if (valid_data.length > 0) {
    const data = [];
    for (const current of valid_data) {
      if (current.type === 'hyperlink') {
        data.push(`<a href="${current.value}">${current.key}</a>`);
      } else if (current.key) {
        data.push(`<b>${current.key}:</b> ${current.value}`);
      } else {
        data.push(current.value);
      }
    }
    addTextSection({ payload, extension, text: data.join(' ｜ ') });
  }
}

/**
 * @param {object} param0
 * @param {import('..').MetadataExtension} param0.extension
 */
async function getValidData({ extension, result }) {
  const valid_data = [];
  for (const current of extension.inputs.data) {
    const condition = current.condition || default_options.condition;
    if (await checkCondition({ condition, result })) {
      valid_data.push(current);
    }
  }
  return valid_data;
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