function addExtension({ payload, extension, text }) {
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

module.exports = {
  addExtension
}