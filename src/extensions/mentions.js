const { getOnCallPerson } = require('rosters');

function run({ target, extension, payload }) {
  if (target.name === 'teams') {
    attachForTeam({ extension, payload });
  } else if (target.name === 'slack') {
    attachForSlack({ extension, payload });
  }
}

function attachForTeam({ extension, payload }) {
  const users = getUsers(extension);
  if (users.length > 0) {
    setPayloadWithMSTeamsEntities(payload);
    const users_ats = users.map(user => `<at>${user.name}</at>`);
    payload.body.push({
      "type": "TextBlock",
      "text": users_ats.join(' ｜ '),
      "separator": true
    });
    for (const user of users) {
      payload.msteams.entities.push({
        "type": "mention",
        "text": `<at>${user.name}</at>`,
        "mentioned": {
          "id": user.teams_upn,
          "name": user.name
        }
      });
    }
  }
}

function attachForSlack({ extension, payload }) {
  const users = getUsers(extension);
  const user_ids = users.map(user => `<@${user.slack_uid}>`);
  if (users.length > 0) {
    payload.blocks.push({
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": user_ids.join(' ｜ ')
      }
    });
  }
}

function getUsers(extension) {
  const users = [];
  if (extension.inputs.users) {
    users.push(...extension.inputs.users);
  }
  if (extension.inputs.schedule) {
    const user = getOnCallPerson(extension.inputs.schedule);
    if (user) {
      users.push(user);
    } else {
      // TODO: warn message for no on-call person
    }
  }
  return users;
}

function setPayloadWithMSTeamsEntities(payload) {
  if (!payload.msteams) {
    payload.msteams = {};
  }
  if (!payload.msteams.entities) {
    payload.msteams.entities = [];
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