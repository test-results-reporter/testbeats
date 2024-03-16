/**
 * Add Slack Extension function.
 *
 * @param {object} param0 - the payload object
 * @param {object} param0.payload - the payload object
 * @param {import("..").Extension} param0.extension - the extension to add
 * @param {string} param0.text - the text to include
 * @return {void} 
 */
function addSlackExtension({ payload, extension, text }) {
  if (extension.inputs.separator) {
    payload.blocks.push({
      "type": "divider"
    });
  }
  let updated_text = text;
  if (extension.inputs.title) {
    const title = extension.inputs.title_link ? `<${extension.inputs.title_link}|${extension.inputs.title}>` : extension.inputs.title;
    updated_text = `*${title}*\n\n${text}`;
  }
  if (extension.inputs.block_type === 'context') {
    payload.blocks.push({
      "type": "context",
      "elements": [
        {
          "type": "mrkdwn",
          "text": updated_text
        }
      ]
    });
  } else {
    payload.blocks.push({
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": updated_text
      }
    });
  }
}

/**
 * Add Teams Extension function.
 *
 * @param {object} param0 - the payload object
 * @param {object} param0.payload - the payload object
 * @param {import("..").Extension} param0.extension - the extension to add
 * @param {string} param0.text - the text to include
 * @return {void} 
 */
function addTeamsExtension({ payload, extension, text }) {
  if (extension.inputs.title) {
    const title = extension.inputs.title_link ? `[${extension.inputs.title}](${extension.inputs.title_link})` : extension.inputs.title
    payload.body.push({
      "type": "TextBlock",
      "text": title,
      "isSubtle": true,
      "weight": "bolder",
      "separator": extension.inputs.separator,
      "wrap": true
    });
    payload.body.push({
      "type": "TextBlock",
      "text": text,
      "wrap": true
    });
  } else {
    payload.body.push({
      "type": "TextBlock",
      "text": text,
      "wrap": true,
      "separator": extension.inputs.separator
    });
  }
}

/**
 * Add Chat Extension function.
 *
 * @param {object} param0 - the payload object
 * @param {object} param0.payload - the payload object
 * @param {import("..").Extension} param0.extension - the extension to add
 * @param {string} param0.text - the text to include
 * @return {void} 
 */
function addChatExtension({ payload, extension, text }) {
  let updated_text = text;
  if (extension.inputs.title) {
    const title = extension.inputs.title_link ? `<a href="${extension.inputs.title_link}">${extension.inputs.title}</a>` : extension.inputs.title;
    updated_text = `<b>${title}</b><br><br>${text}`;
  }
  payload.sections.push({
    "widgets": [
      {
        "textParagraph": {
          "text": updated_text
        }
      }
    ]
  });
}

module.exports = {
  addSlackExtension,
  addTeamsExtension,
  addChatExtension
}