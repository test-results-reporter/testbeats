const { getPercentage } = require('../helpers/helper');

function getUrl(result) {
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
        text: (val) => val + '%',
      },
    }
  }
  return `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chart))}`;
}

function attachForTeams({ result, payload }) {
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
        "url": getUrl(result),
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

function attachForSlack({ result, payload }) {
  payload.blocks[0]["accessory"] = {
    "type": "image",
    "alt_text": "overall-results-summary",
    "image_url": getUrl(result)
  }
}

function run(params) {
  const { target } = params;
  if (target.name === 'teams') {
    attachForTeams(params);
  } else {
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