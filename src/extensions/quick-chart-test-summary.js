const { getPercentage } = require('../helpers/helper');
const constants = require('../lib/constants');

function getUrl(extension, result) {
  const percentage = getPercentage(result.passed, result.total);
  const chart = {
    type: 'radialGauge',
    data: {
      datasets: [{
        data: [percentage],
        backgroundColor: 'green',
      }]
    },
    options: {
      trackColor: '#FF0000',
      roundedCorners: false,
      centerPercentage: 80,
      centerArea: {
        fontSize: 80,
        text: `${percentage}%`,
      },
    }
  }
  return `${extension.inputs.url}/chart?c=${encodeURIComponent(JSON.stringify(chart))}`;
}

function attachForTeams({ extension, result, payload }) {
  const main_column = {
    "type": "Column",
    "items": [payload.body[0], payload.body[1]],
    "width": "stretch"
  }
  const image_column = {
    "type": "Column",
    "items": [
      {
        "type": "Image",
        "url": getUrl(extension, result),
        "altText": "overall-results-summary",
        "size": "large"
      }
    ],
    "width": "auto"
  }
  const column_set = {
    "type": "ColumnSet",
    "columns": [
      main_column,
      image_column
    ]
  }
  payload.body = [column_set];
}

function attachForSlack({ extension, result, payload }) {
  payload.blocks[0]["accessory"] = {
    "type": "image",
    "alt_text": "overall-results-summary",
    "image_url": getUrl(extension, result)
  }
}

function run(params) {
  const { extension, target } = params;  
  params.extension.inputs = extension.inputs || {};
  params.extension.inputs["url"] = (extension.inputs.url && extension.inputs.url.trim()) || constants.QUICK_CHART_URL;
  if (target.name === 'teams') {
    attachForTeams(params);
  } else if (target.name === 'slack') {
    attachForSlack(params);
  }
}

const default_options = {
  hook: 'post-main',
  condition: 'passOrFail'
}

module.exports = {
  run,
  default_options
}