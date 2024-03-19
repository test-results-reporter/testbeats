const { STATUS, HOOK } = require("../helpers/constants");
const { getCIInformation } = require('../helpers/ci');
const { addTeamsExtension, addSlackExtension, addChatExtension } = require('../helpers/extension.helper');
const { getTeamsMetaDataText, getSlackMetaDataText, getChatMetaDataText } = require('../helpers/metadata.helper');

/**
 * 
 * @param {object} param0 - the payload object
 * @param {import('..').Extension} param0.extension - The result object
 *  
 */
async function run({ target, extension, payload, result }) {
  extension.inputs = Object.assign({}, default_inputs, extension.inputs);
  if (target.name === 'teams') {
    extension.inputs = Object.assign({}, default_inputs_teams, extension.inputs);
    const text = await get_text({ target, extension, result });
    if (text) {
      addTeamsExtension({ payload, extension, text });
    }
  } else if (target.name === 'slack') {
    extension.inputs = Object.assign({}, default_inputs_slack, extension.inputs);
    const text = await get_text({ target, extension, result });
    if (text) {
      addSlackExtension({ payload, extension, text });
    }
  } else if (target.name === 'chat') {
    extension.inputs = Object.assign({}, default_inputs_chat, extension.inputs);
    const text = await get_text({ target, extension, result });
    if (text) {
      addChatExtension({ payload, extension, text });
    }
  }
}

/**
 * 
 * @param {import('..').CIInfoInputs} inputs 
 */
function get_repository_elements(inputs) {
  const elements = [];
  const ci = getCIInformation();
  if (inputs.show_repository && ci && ci.repository_url && ci.repository_name) {
    elements.push({ label: 'Repository', key: ci.repository_name, value: ci.repository_url, type: 'hyperlink' });
  }
  if (inputs.show_repository_branch && ci && ci.repository_ref) {
    if (ci.repository_ref.includes('refs/pull')) {
      const pr_url = ci.repository_url + ci.repository_ref.replace('refs/pull/', '/pull/');
      const pr_name = ci.repository_ref.replace('refs/pull/', '').replace('/merge', '');
      elements.push({ label: 'Pull Request', key: pr_name, value: pr_url, type: 'hyperlink' });
    } else {
      const branch_url = ci.repository_url + ci.repository_ref.replace('refs/heads/', '/tree/');
      const branch_name = ci.repository_ref.replace('refs/heads/', '');
      elements.push({ label: 'Branch', key: branch_name, value: branch_url, type: 'hyperlink' });
    }
  }
  return elements;
}

/**
 * 
 * @param {import('..').CIInfoInputs} inputs 
 */
function get_build_elements(inputs) {
  let elements = [];
  const ci = getCIInformation();
  if (inputs.show_build && ci && ci.build_url) {
    const name = (ci.build_name || 'Build') + (ci.build_number ? ` #${ci.build_number}` : '');
    elements.push({ label: 'Build', key: name, value: ci.build_url, type: 'hyperlink' });
  }
  if (inputs.data) {
    elements = elements.concat(inputs.data);
  }
  return elements;
}

async function get_text({ target, extension, result }) {
  const repository_elements = get_repository_elements(extension.inputs);
  const build_elements = get_build_elements(extension.inputs);
  if (target.name === 'teams') {
    const repository_text = await getTeamsMetaDataText({ elements: repository_elements, target, extension, result, default_condition: default_options.condition });
    const build_text = await getTeamsMetaDataText({ elements: build_elements, target, extension, result, default_condition: default_options.condition });
    if (build_text) {
      return `${repository_text ? `${repository_text}\n\n` : '' }${build_text}`;
    } else {
      return repository_text;
    }
  } else if (target.name === 'slack') {
    const repository_text = await getSlackMetaDataText({ elements: repository_elements, target, extension, result, default_condition: default_options.condition });
    const build_text = await getSlackMetaDataText({ elements: build_elements, target, extension, result, default_condition: default_options.condition });
    if (build_text) {
      return `${repository_text ? `${repository_text}\n` : '' }${build_text}`;
    } else {
      return repository_text;
    }
  } else if (target.name === 'chat') {
    const repository_text = await getChatMetaDataText({ elements: repository_elements, target, extension, result, default_condition: default_options.condition });
    const build_text = await getChatMetaDataText({ elements: build_elements, target, extension, result, default_condition: default_options.condition });
    if (build_text) {
      return `${repository_text ? `${repository_text}<br>` : '' }${build_text}`;
    } else {
      return repository_text;
    }
  }
}

const default_options = {
  hook: HOOK.AFTER_SUMMARY,
  condition: STATUS.PASS_OR_FAIL,
}

const default_inputs = {
  title: '',
  show_repository: true,
  show_repository_branch: true,
  show_build: true,
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