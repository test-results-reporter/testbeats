const { getSuiteHistory, getLastLaunchByName, getLaunchDetails } = require('../helpers/report-portal');
const { addExtension } = require('../helpers/teams');
const { addSectionText } = require('../helpers/slack');

async function getLaunchHistory(inputs) {
  if (!inputs.launch_id && inputs.launch_name) {
    const launch = await getLastLaunchByName(inputs);
    inputs.launch_id = launch.id;
  }
  if (typeof inputs.launch_id === 'string') {
    const launch = await getLaunchDetails(inputs);
    inputs.launch_id = launch.id;
  }
  const response = await getSuiteHistory(inputs);
  if (response.content.length > 0) {
    return response.content[0].resources;
  }
  return [];
}

function getSymbols(launches) {
  const symbols = [];
  for (let i = 0; i < launches.length; i++) {
    const launch = launches[i];
    if (launch.status === 'PASSED') {
      symbols.push('✅');
    } else if (launch.status === 'FAILED') {
      symbols.push('❌');
    } else {
      symbols.push('⚠️');
    }
  }
  return symbols;
}

function attachForTeams({ payload, symbols, extension }) {
  if (extension.inputs.title === 'Last Runs') {
    extension.inputs.title = `Last ${symbols.length} Runs`
  }
  addExtension({ payload, extension, text: symbols.join(' ') });
}

function attachForSlack({ payload, symbols, extension }) {
  if (extension.inputs.title === 'Last Runs') {
    extension.inputs.title = `Last ${symbols.length} Runs`
  }
  addSectionText({ payload, extension, text: symbols.join(' ') });
}

async function run({ extension, target, payload }) {
  try {
    extension.inputs = Object.assign({}, default_inputs, extension.inputs);
    const launches = await getLaunchHistory(extension.inputs);
    const symbols = getSymbols(launches);
    if (symbols.length > 0) {
      if (target.name === 'teams') {
        extension.inputs = Object.assign({}, default_inputs_teams, extension.inputs);
        attachForTeams({ payload, symbols, extension });
      } else {
        extension.inputs = Object.assign({}, default_inputs_slack, extension.inputs);
        attachForSlack({ payload, symbols, extension });
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
}

const default_inputs_teams = {
  separator: true
}

const default_inputs_slack = {
  separator: false
}

const default_options = {
  hook: 'end',
  condition: 'fail'
}

module.exports = {
  run,
  default_options
}