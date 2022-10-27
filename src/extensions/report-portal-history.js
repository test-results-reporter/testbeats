const { getSuiteHistory, getLastLaunchByName, getLaunchDetails } = require('../helpers/report-portal');
const { addExtension } = require('../helpers/teams');
const { addTextBlock } = require('../helpers/slack');
const { addTextSection } = require('../helpers/chat');
const { HOOK, STATUS } = require('../helpers/constants');

async function getLaunchHistory(extension) {
  const { inputs, outputs } = extension;
  if (!inputs.launch_id && inputs.launch_name) {
    const launch = await getLastLaunchByName(inputs);
    outputs.launch = launch;
    inputs.launch_id = launch.id;
  }
  if (typeof inputs.launch_id === 'string') {
    const launch = await getLaunchDetails(inputs);
    outputs.launch = launch;
    inputs.launch_id = launch.id;
  }
  const response = await getSuiteHistory(inputs);
  if (response.content.length > 0) {
    outputs.history = response.content[0].resources;
    return response.content[0].resources;
  }
  return [];
}

function getSymbols({ target, extension, launches }) {
  const symbols = [];
  for (let i = 0; i < launches.length; i++) {
    const launch = launches[i];
    const launch_url = `${extension.inputs.url}/ui/#${extension.inputs.project}/launches/all/${extension.inputs.link_history_via}`;
    let current_symbol = '⚠️';
    if (launch.status === 'PASSED') {
      current_symbol = '✅'; 
    } else if (launch.status === 'FAILED') {
      current_symbol = '❌'; 
    }
    if (target.name === 'teams') {
      symbols.push(`[${current_symbol}](${launch_url})`);
    } else if (target.name === 'slack') {
      symbols.push(`<${launch_url}|${current_symbol}>`);
    } else if (target.name === 'chat') {
      symbols.push(`<a href="${launch_url}">${current_symbol}</a>`);
    } else {
      symbols.push(current_symbol);
    }
  }
  return symbols;
}

function attachForTeams({ payload, symbols, extension }) {
  setTitle(extension, symbols);
  addExtension({ payload, extension, text: symbols.join(' ') });
}

function attachForSlack({ payload, symbols, extension }) {
  setTitle(extension, symbols);
  addTextBlock({ payload, extension, text: symbols.join(' ') });
}

function attachForChat({ payload, symbols, extension }) {
  setTitle(extension, symbols);
  addTextSection({ payload, extension, text: symbols.join(' ') });
}

function setTitle(extension, symbols) {
  if (extension.inputs.title === 'Last Runs') {
    extension.inputs.title = `Last ${symbols.length} Runs`
  }
}

async function run({ extension, target, payload }) {
  try {
    extension.inputs = Object.assign({}, default_inputs, extension.inputs);
    const launches = await getLaunchHistory(extension);
    const symbols = getSymbols({ target, extension, launches });
    if (symbols.length > 0) {
      if (target.name === 'teams') {
        extension.inputs = Object.assign({}, default_inputs_teams, extension.inputs);
        attachForTeams({ payload, symbols, extension });
      } else if (target.name === 'slack') {
        extension.inputs = Object.assign({}, default_inputs_slack, extension.inputs);
        attachForSlack({ payload, symbols, extension });
      } else if (target.name === 'chat') {
        extension.inputs = Object.assign({}, default_inputs_chat, extension.inputs);
        attachForChat({ payload, symbols, extension });
      }
    }
  } catch (error) {
    console.log('Failed to get report portal history');
    console.log(error);
  }
}

const default_inputs = {
  history_depth: 5,
  title: 'Last Runs',
  link_history_via: 'uuid'
}

const default_inputs_teams = {
  separator: true
}

const default_inputs_chat = {
  separator: true
}

const default_inputs_slack = {
  separator: false
}

const default_options = {
  hook: HOOK.END,
  condition: STATUS.FAIL
}

module.exports = {
  run,
  default_options
}
