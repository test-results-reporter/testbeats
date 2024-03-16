const { getLaunchDetails, getLastLaunchByName } = require('../helpers/report-portal');
const { addChatExtension, addSlackExtension, addTeamsExtension } = require('../helpers/extension.helper');
const { HOOK, STATUS } = require('../helpers/constants');

function getReportPortalDefectsSummary(defects, bold_start = '**', bold_end = '**') {
  const results = [];
  if (defects.product_bug) {
    results.push(`${bold_start}🔴 PB - ${defects.product_bug.total}${bold_end}`);
  } else {
    results.push(`🔴 PB - 0`);
  }
  if (defects.automation_bug) {
    results.push(`${bold_start}🟡 AB - ${defects.automation_bug.total}${bold_end}`);
  } else {
    results.push(`🟡 AB - 0`);
  }
  if (defects.system_issue) {
    results.push(`${bold_start}🔵 SI - ${defects.system_issue.total}${bold_end}`);
  } else {
    results.push(`🔵 SI - 0`);
  }
  if (defects.no_defect) {
    results.push(`${bold_start}◯ ND - ${defects.no_defect.total}${bold_end}`);
  } else {
    results.push(`◯ ND - 0`);
  }
  if (defects.to_investigate) {
    results.push(`${bold_start}🟠 TI - ${defects.to_investigate.total}${bold_end}`);
  } else {
    results.push(`🟠 TI - 0`);
  }
  return results;
}

async function _getLaunchDetails(options) {
  if (!options.launch_id && options.launch_name) {
    return getLastLaunchByName(options);
  }
  return getLaunchDetails(options);
}

async function initialize(extension) {
  extension.inputs = Object.assign({}, default_inputs, extension.inputs);
  extension.outputs.launch = await _getLaunchDetails(extension.inputs);
  if (!extension.inputs.title_link && extension.inputs.title_link_to_launch) {
    extension.inputs.title_link = `${extension.inputs.url}/ui/#${extension.inputs.project}/launches/all/${extension.outputs.launch.uuid}`;
  }
}

async function run({ extension, payload, target }) {
  await initialize(extension);
  const { statistics } = extension.outputs.launch;
  if (statistics && statistics.defects) {
    if (target.name === 'teams') {
      extension.inputs = Object.assign({}, default_inputs_teams, extension.inputs);
      const analyses = getReportPortalDefectsSummary(statistics.defects);
      addTeamsExtension({ payload, extension, text: analyses.join(' ｜ ') });
    } else if (target.name === 'slack') {
      extension.inputs = Object.assign({}, default_inputs_slack, extension.inputs);
      const analyses = getReportPortalDefectsSummary(statistics.defects, '*', '*');
      addSlackExtension({ payload, extension, text: analyses.join(' ｜ ') });
    } else if (target.name === 'chat') {
      extension.inputs = Object.assign({}, default_inputs_chat, extension.inputs);
      const analyses = getReportPortalDefectsSummary(statistics.defects, '<b>', '</b>');
      addChatExtension({ payload, extension, text: analyses.join(' ｜ ') });
    }
  }
}

const default_options = {
  hook: HOOK.END,
  condition: STATUS.FAIL
}

const default_inputs = {
  title: 'Report Portal Analysis',
  title_link_to_launch: true,
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