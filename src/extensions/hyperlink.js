async function run({ target, extension, payload }) {
  if (target.name === 'teams') {
    attachTeamLinks({ extension, payload });
  } else if (target.name === 'slack') {
    attachSlackLinks({ extension, payload });
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

function attachSlackLinks({ extension, payload }) {
  const links = [];
  for (const link of extension.inputs.links) {
    links.push(`<${link.url}|${link.text}>`);
  }
  payload.blocks.push({
    "type": "context",
    "elements": [
      {
        "type": "mrkdwn",
        "text": links.join(' ｜ ')
      }
    ]
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