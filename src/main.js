const core = require('@actions/core');
const axios = require('axios');

const NODE_ENV = process.env['NODE_ENV'];

// If you want to run it locally, set the environment variables like `$ export SLACK_APP_TOKEN=<your token>`
const SLACK_APP_TOKEN = process.env['SLACK_APP_TOKEN'];

let input;
if (NODE_ENV != 'local') {
  input = {
    channel: core.getInput('channel', { required: true }),
    message: core.getInput('message'),
    userName: core.getInput('user_name'),
    userIcon: core.getInput('user_icon'),
    color: core.getInput('color'),
    authorName: core.getInput('author_name'),
    authorLink: core.getInput('author_link'),
    authorIcon: core.getInput('author_icon'),
    title: core.getInput('title'),
    titleLink: core.getInput('title_link'),
    body: core.getInput('body'),
    fields: core.getInput('fields'),
    image: core.getInput('image'),
    thumbnail: core.getInput('thumbnail'),
    footer: core.getInput('footer'),
    footerIcon: core.getInput('footer_icon'),
    actions: core.getInput('actions'),
    sha: core.getInput('sha'),
    showLogButton: core.getInput('show_log_button'),
    event: core.getInput('event'),
    runId: core.getInput('run_id'),
  };
} else {
  const event = {
    repository: {
      full_name: 'hkusu/slack-post-action',
      html_url: 'https://github.com/hkusu/slack-post-action',
      owner: {
        login: 'hkusu',
      },
    },
  };
  input = {
    channel: 'CCU1QA6HL',
    message: 'Hello World!',
    userName: 'GitHub Actions',
    userIcon: 'https://github.com/actions.png?size=48',
    color: 'good',
    authorName: 'hkusu',
    authorLink: 'https://github.com/hkusu',
    authorIcon: 'https://github.com/hkusu.png',
    title: 'This is title',
    titleLink: 'https://github.com/hkusu/slack-post-action',
    body: 'This is body',
    fields: '[{ "title": "Action1", "value": "my action1", "short": true }, { "title": "Action2", "value": "my action2", "short": true }]',
    image: '',
    thumbnail: '',
    footer: '',
    footerIcon: '',
    actions: '[{ "type": "button", "text": "Show action", "url": "https://github.com/hkusu/slack-post-action" }]',
    sha: '',
    showLogButton: 'true',
    event: JSON.stringify(event),
    runId: '452397272',
  };
}

async function run(input) {

  try {
    input.event = JSON.parse(input.event);
  } catch (e) {
    throw new Error('JSON parse error. "event" input is invalid.');
  }

  if (!input.event.repository) {
    throw new Error('"event" input is invalid.');
  }

  try {
    input.fields = JSON.parse(input.fields);
  } catch (e) {
    throw new Error('JSON parse error. "fields" input is invalid.');
  }

  try {
    input.actions = JSON.parse(input.actions);
  } catch (e) {
    throw new Error('JSON parse error. "actions" input is invalid.');
  }

  if (input.showLogButton == 'true') {
    input.actions.push(
      {
        "type": "button",
        "text": "View log",
        "url": `https://github.com/${input.event.repository.full_name}/actions/runs/${input.runId}`,
      }
    );
  }

  let attachment;
  if (input.authorName == '' && input.title == '' && input.body == '' && input.fields == '' && input.image == '' && input.thumbnail == '' && input.actions == '') {
    attachment = {};
  } else {
    attachment = {
      "color": input.color,
      "author_name": input.authorName,
      "author_link": input.authorLink,
      "author_icon": input.authorIcon,
      "title": input.title,
      "title_link": input.titleLink,
      "text": input.body,
      "fields": input.fields,
      "image_url": input.image,
      "thumb_url": input.thumbnail,
      "footer": input.footer,
      "footer_icon": input.footerIcon,
      "ts": Math.floor(new Date().getTime() / 1000),
      "actions": input.actions,
    };
  }

  const data = {
    "channel": input.channel,
    "username": input.userName,
    "icon_url": input.userIcon,
    "text": input.message,
    "attachments": [attachment]
  };

  const res = await axios({
    method: 'post',
    url: 'https://slack.com/api/chat.postMessage',
    data: data,
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': `Bearer ${SLACK_APP_TOKEN}`,
    },
  });

  if (!res.data.ok) {
    throw new Error(`Slack API error (message: ${res.data.error}).`);
  }
}

run(input)
  .then(result => {
    core.setOutput('result', 'success');
  })
  .catch(error => {
    core.setOutput('result', 'failure');
    core.setFailed(error.message);
  });
