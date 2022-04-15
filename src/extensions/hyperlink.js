async function run({ target, extension, payload }) {
  if (target.name === 'teams') {
    attachTeamLinks({ extension, payload })
  } else if (target.name === 'slack') {

  }
}

function attachTeamLinks({ extension, payload }) {
  const links = [];
  for (const link of extension.inputs.links) {
    links.push(`[${link.text}](${link.url})`);
  }
  payload.body.push({
    "type": "TextBlock",
    "text": links.join(' ｜ '),
    "separator": true
  });
}

const default_options = {
  hook: 'end',
  condition: 'passOrFail'
}

module.exports = {
  run,
  default_options
}