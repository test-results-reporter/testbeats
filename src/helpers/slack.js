function addSectionText({ payload, extension, text }) {
  if (extension.inputs.separator) {
    payload.blocks.push({
      "type": "divider"
    });
  }
  let updated_text = text;
  if (extension.inputs.title) {
    updated_text = `*${extension.inputs.title}*\n\n${text}`;
  }
  payload.blocks.push({
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": updated_text
    }
  });
}

function addContextText({ payload, extension, text }) {
  if (extension.inputs.separator) {
    payload.blocks.push({
      "type": "divider"
    });
  }
  let updated_text = text;
  if (extension.inputs.title) {
    updated_text = `*${extension.inputs.title}*\n\n${text}`;
  }
  payload.blocks.push({
    "type": "context",
    "elements": [
      {
        "type": "mrkdwn",
        "text": updated_text
      }
    ]
  });
}

module.exports = {
  addSectionText,
  addContextText
}