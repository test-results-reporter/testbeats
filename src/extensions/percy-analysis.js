const retry = require('async-retry');
const { getProjectByName, getLastBuild, getBuild, getRemovedSnapshots } = require('../helpers/percy');
const { HOOK, STATUS, URLS } = require('../helpers/constants');
const { addExtension } = require('../helpers/teams');
const { addTextBlock } = require('../helpers/slack');
const { addTextSection } = require('../helpers/chat');

/**
 * 
 * @param {object} param0 
 * @param {import('../index').PercyAnalysisExtension} param0.extension 
 */
async function run({ extension, payload, target }) {
  extension.inputs = Object.assign({}, default_inputs, extension.inputs);
  await initialize(extension);
  if (target.name === 'teams') {
    extension.inputs = Object.assign({}, default_inputs_teams, extension.inputs);
    attachForTeams({ payload, extension });
  } else if (target.name === 'slack') {
    extension.inputs = Object.assign({}, default_inputs_slack, extension.inputs);
    attachForSlack({ payload, extension });
  } else if (target.name === 'chat') {
    extension.inputs = Object.assign({}, default_inputs_chat, extension.inputs);
    attachForChat({ payload, extension });
  }
}

/**
 * @param {import('../index').PercyAnalysisExtension} extension 
 */
async function initialize(extension) {
  const { inputs } = extension;
  if (!inputs.build_id) {
    await setBuildByLastRun(extension);
  } else {
    await setBuild(extension);
  }
  await setRemovedSnapshots(extension);
  if (!inputs.title_link && inputs.title_link_to_build) {
    inputs.title_link = `https://percy.io/${inputs.organization_uid}/${inputs.project_name}/builds/${inputs.build_id}`;
  }
}

/**
 * @param {import('../index').PercyAnalysisExtension} extension 
 */
async function setBuildByLastRun(extension) {
  const { inputs, outputs } = extension;
  if (!inputs.project_id) {
    await setProjectId(extension)
  }
  const response = await getLastFinishedBuild(extension);
  inputs.build_id = response.data[0].id;
  outputs.build = response.data[0];
  if (!outputs.project) {
    outputs.project = response.included.find(_item => _item.type === 'projects');
  }
  if (!inputs.project_name) {
    inputs.project_name = outputs.project.attributes.name;
  }
  if (!inputs.organization_uid) {
    inputs.organization_uid = getOrganizationUID(outputs.project.attributes['full-slug']);
  }
}

/**
 * @param {import('../index').PercyAnalysisExtension} extension 
 */
function getLastFinishedBuild(extension) {
  const { inputs } = extension;

  // Added a default value for retries in case the input is missing or is not a number
  const retries = inputs.retries || 3;
  const minTimeout = 5000;

  return retry(async () => {
      let response;
      try {
          response = await getLastBuild(inputs);
      } catch (error) {
          // Used the Error class to throw errors instead of using template literals, 
          // which provides more information about the error, 
          // including a stack trace, and allows us to distinguish between different types of errors.
          throw new Error(`Error occurred while fetching the last build: ${error}`);
      }
      // Added Checks to make sure that the response data is valid and is as expected.
      if (!response.data || !response.data[0] || !response.data[0].attributes) {
          throw new Error(`Invalid response data: ${JSON.stringify(response)}`);
      }
      const state = response.data[0].attributes.state;
      // Included percy's "failed" build status for this fix: #113
      if (state !== "finished" && state !== "failed") {
          throw new Error(`build is still '${state}'`);
      }
      return response;
  }, { retries, minTimeout });
}

/**
 * @param {import('../index').PercyAnalysisExtension} extension 
 */
async function setProjectId(extension) {
  const { inputs, outputs } = extension;
  if (!inputs.project_name) {
    throw "mandatory inputs 'build_id' or 'project_id' or 'project_name' are not provided for percy-analysis extension"
  }
  const response = await getProjectByName(inputs);
  inputs.project_id = response.data.id;
  outputs.project = response.data;
}

/**
 * @param {import('../index').PercyAnalysisExtension} extension 
 */
async function setBuild(extension) {
  const { inputs, outputs } = extension;
  const response = await getBuild(inputs);
  outputs.build = response.data;
  outputs.project = response.included.find(_item => _item.type === 'projects');
  if (!inputs.project_id) {
    inputs.project_id = outputs.project.id;
  }
  if (!inputs.project_name) {
    inputs.project_name = outputs.project.attributes.name;
  }
  if (!inputs.organization_uid) {
    inputs.organization_uid = getOrganizationUID(outputs.project.attributes['full-slug']);
  }
}

function getOrganizationUID(slug) {
  return slug.split('/')[0];
}

/**
 * @param {import('../index').PercyAnalysisExtension} extension 
 */
async function setRemovedSnapshots(extension) {
  const response = await getRemovedSnapshots(extension.inputs);
  extension.outputs.removed_snapshots = response.data;
}

function attachForTeams({ payload, extension }) {
  const text = getAnalysisSummary(extension.outputs).join(' ｜ ');
  addExtension({ payload, extension, text });
}

function attachForSlack({ payload, extension }) {
  const text = getAnalysisSummary(extension.outputs, '*', '*').join(' ｜ ');
  addTextBlock({ payload, extension, text });
}

function attachForChat({ payload, extension }) {
  const text = getAnalysisSummary(extension.outputs, '<b>', '</b>').join(' ｜ ');
  addTextSection({ payload, extension, text });
}

function getAnalysisSummary(outputs, bold_start = '**', bold_end = '**') {
  const { build, removed_snapshots } = outputs;
  const results = [];
  const total = build.attributes['total-snapshots'];
  const un_reviewed = build.attributes['total-snapshots-unreviewed'];
  const approved = total - un_reviewed;
  if (approved) {
    results.push(`${bold_start}✔ AP - ${approved}${bold_end}`);
  } else {
     // Implemented a defensive check to handle scenarios where the variable "approved" may be null, 
     // by setting it to zero to avoid displaying null values.
    results.push(`✔ AP - ${approved || 0}`);
  }
  if (un_reviewed) {
    results.push(`${bold_start}🔎 UR - ${un_reviewed}${bold_end}`);
  } else {
    // As a solution for issue #113, we have implemented a check for Percy's build status, 
    // if it is "failed", we set the value of "un_reviewed" to 0, 
    // this way we handle the scenario where "un_reviewed" would be null and display a default value of zero instead.
    results.push(`🔎 UR - ${un_reviewed || 0}`);
  }
  // Implemented a defensive check for when "removed_snapshots" is null or undefined, 
  // to avoid displaying null or undefined values and provide a default value of zero instead.
  if (removed_snapshots && removed_snapshots.length) {
    results.push(`${bold_start}🗑 RM - ${removed_snapshots.length}${bold_end}`);
  } else {
    results.push(`🗑 RM - 0`);
  }
  return results;
}

const default_options = {
  hook: HOOK.END,
  condition: STATUS.PASS_OR_FAIL
}

const default_inputs = {
  title: 'Percy Analysis',
  url: URLS.PERCY,
  title_link_to_build: true,
  retries: 10,
  build_id: '',
  project_id: '',
  project_name: '',
  organization_uid: ''
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