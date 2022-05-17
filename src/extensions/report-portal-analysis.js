const { getLaunchDetails, getLastLaunchByName } = require('../helpers/report-portal');

function getReportPortalDefectsSummary(defects, bold = '**') {
  const results = [];
  if (defects.product_bug) {
    results.push(`${bold}🔴 PB - ${defects.product_bug.total}${bold}`);
  } else {
    results.push(`🔴 PB - 0`);
  }
  if (defects.automation_bug) {
    results.push(`${bold}🟡 AB - ${defects.automation_bug.total}${bold}`);
  } else {
    results.push(`🟡 AB - 0`);
  }
  if (defects.system_issue) {
    results.push(`${bold}🔵 SI - ${defects.system_issue.total}${bold}`);
  } else {
    results.push(`🔵 SI - 0`);
  }
  if (defects.no_defect) {
    results.push(`${bold}◯ ND - ${defects.no_defect.total}${bold}`);
  } else {
    results.push(`◯ ND - 0`);
  }
  if (defects.to_investigate) {
    results.push(`${bold}🟠 TI - ${defects.to_investigate.total}${bold}`);
  } else {
    results.push(`🟠 TI - 0`);
  }
  return results;
}

function attachForTeams(payload, analyses) {
  payload.body.push({
    "type": "TextBlock",
    "text": "Report Portal Analysis",
    "isSubtle": true,
    "weight": "bolder",
    "separator": true
  });
  payload.body.push({
    "type": "TextBlock",
    "text": analyses.join(' ｜ ')
  });
}

function attachForSlack(payload, analyses) {
  payload.blocks.push({
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": `*Report Portal Analysis*\n\n${analyses.join(' ｜ ')}`
    }
  });
}

async function _getLaunchDetails(options) {
  if (!options.launch_id && options.launch_name) {
   return getLastLaunchByName(options);
  }
  return getLaunchDetails(options);
}

async function run({ extension, payload, target }) {
  try {
    const { statistics } = await _getLaunchDetails(extension.inputs);
    if (statistics && statistics.defects) {
      if (target.name === 'teams') {
        const analyses = getReportPortalDefectsSummary(statistics.defects);
        attachForTeams(payload, analyses);
      } else {
        const analyses = getReportPortalDefectsSummary(statistics.defects, '*');
        attachForSlack(payload, analyses);
      }
    }
  } catch (error) {
    console.log('Failed to get report portal analysis');
    console.log(error);
  }
}

const default_options = {
  hook: 'end',
  condition: 'fail'
}

module.exports = {
  run,
  default_options
}