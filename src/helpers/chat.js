function addTextSection({ payload, extension, text }) {
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
  addTextSection
}