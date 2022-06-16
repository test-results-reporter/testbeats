function addExtension({payload, extension, text }) {
  if (extension.inputs.title) {
    payload.body.push({
      "type": "TextBlock",
      "text": extension.inputs.title,
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