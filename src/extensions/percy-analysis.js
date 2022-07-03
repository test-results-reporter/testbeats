const retry = require('async-retry');
const { getProjectByName, getLastBuild, getBuild } = require('../helpers/percy');
const { HOOK, STATUS, URLS } = require('../helpers/constants');
const { addExtension } = require('../helpers/teams');
const { addTextBlock } = require('../helpers/slack');
const { addTextSection } = require('../helpers/chat');

async function run({ extension, payload, target }) {
  extension.inputs = Object.assign({}, default_inputs, extension.inputs);
  await initialize(extension.inputs);
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
 * @param {import('../index').PercyAnalysisInputs} inputs 
 */
async function initialize(inputs) {
  if (!inputs.build_id) {
    await setBuildByLastRun(inputs);
  } else {
    await setBuild(inputs);
  }
  if (!inputs.title_link && inputs.title_link_to_build) {
    inputs.title_link = `https://percy.io/${inputs.organization_uid}/${inputs.project_name}/builds/${inputs.build_id}`;
  }
}

/**
 * @param {import('../index').PercyAnalysisInputs} inputs 
 */
async function setBuildByLastRun(inputs) {
  if (!inputs.project_id) {
    await setProjectId(inputs)
  }
  const response = await getLastFinishedBuild(inputs);
  inputs.build_id = response.data[0].id;
  inputs._build = response.data[0];
  if (!inputs._project) {
    inputs._project = response.included.find(_item => _item.type === 'projects');
  }
  if (!inputs.project_name) {
    inputs.project_name = inputs._project.attributes.name;
  }
  if (!inputs.organization_uid) {
    inputs.organization_uid = getOrganizationUID(inputs._project.attributes['full-slug']);
  }
}

/**
 * @param {import('../index').PercyAnalysisInputs} inputs 
 */
function getLastFinishedBuild(inputs) {
  return retry(async () => {
    const response = await getLastBuild(inputs);
    if (response.data[0].attributes.state !== "finished") {
      throw `build is still '${response.data[0].attributes.state}'`;
    }
    return response;
  }, { retries: 10, minTimeout: 5000 });
}

/**
 * @param {import('../index').PercyAnalysisInputs} inputs 
 */
async function setProjectId(inputs) {
  if (!inputs.project_name) {
    throw "mandatory inputs 'build_id' or 'project_id' or 'project_name' are not provided"
  }
  const response = await getProjectByName(inputs);
  inputs.project_id = response.data.id;
  inputs._project = response.data;
}

/**
 * @param {import('../index').PercyAnalysisInputs} inputs 
 */
async function setBuild(inputs) {
  const response = await getBuild(inputs);
  inputs._build = response.data;
  inputs._project = response.included.find(_item => _item.type === 'projects');
  if (!inputs.project_id) {
    inputs.project_id = inputs._project.id;
  }
  if (!inputs.project_name) {
    inputs.project_name = inputs._project.attributes.name;
  }
  if (!inputs.organization_uid) {
    inputs.organization_uid = getOrganizationUID(inputs._project.attributes['full-slug']);
  }
}

function getOrganizationUID(slug) {
  return slug.split('/')[0];
}

function attachForTeams({ payload, extension }) {
  const text = getResults(extension.inputs._build).join(' ｜ ');
  addExtension({ payload, extension, text });
}

function attachForSlack({ payload, extension }) {
  const text = getResults(extension.inputs._build).join(' ｜ ');
  addTextBlock({ payload, extension, text });
}

function attachForChat({ payload, extension }) {
  const text = getResults(extension.inputs._build).join(' ｜ ');
  addTextSection({ payload, extension, text });
}

function getResults(build) {
  const results = [];
  const total = build.attributes['total-snapshots'];
  const un_reviewed = build.attributes['total-snapshots-unreviewed'];
  const approved = total - un_reviewed;
  results.push(`✅ AP - ${approved}`);
  if (un_reviewed > 0) {
    results.push(`🔎 UR - ${un_reviewed}`)
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