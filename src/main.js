const core = require('@actions/core');
const axios = require('axios');

const NODE_ENV = process.env['NODE_ENV'];

// If you want to run it locally, set the environment variables like `$ export SLACK_APP_TOKEN=<your token>`
const SLACK_APP_TOKEN = process.env['SLACK_APP_TOKEN'];
// If you want to run it locally, set the environment variables like `$ export GITHUB_TOKEN=<your token>`
const GITHUB_TOKEN = process.env['GITHUB_TOKEN'];

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
    logButton: core.getInput('log_button'),
    reportSha: core.getInput('sha'),
    reportPrNumber: core.getInput('report-pr-number'),
    threadTimestamp: core.getInput('thread-timestamp'),
    event: core.getInput('event'),
    runId: core.getInput('run-id'),
    githubToken: core.getInput('github-token'),
  };
  // v2までの後方五感
  if (core.getInput('user-name')) {
    input.userName = core.getInput('user-name')
  }
  if (core.getInput('user-icon')) {
    input.userIcon = core.getInput('user-icon')
  }
  if (core.getInput('author-name')) {
    input.authorName = core.getInput('author-name')
  }
  if (core.getInput('author-link')) {
    input.authorLink = core.getInput('author-link')
  }
  if (core.getInput('author-icon')) {
    input.authorIcon = core.getInput('author-icon')
  }
  if (core.getInput('title-link')) {
    input.titleLink = core.getInput('title-link')
  }
  if (core.getInput('footer_icon') != core.getInput('footer-icon')) {
    input.footerIcon = core.getInput('footer-icon')
  }
  if (core.getInput('log-button')) {
    input.logButton = core.getInput('log-button')
  }
  if (core.getInput('report-sha')) {
    input.reportSha = core.getInput('report-sha')
  }
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
    channel: 'github_test',
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
    logButton: 'View log',
    reportSha: '071fe23998cba0da8123ddc6bbf43041218f5b2b',
    reportPrNumber: '3',
    threadTimestamp: '',
    event: JSON.stringify(event),
    runId: '452397272',
    githubToken: GITHUB_TOKEN,
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

  if (input.logButton) {
    input.actions.push(
      {
        "type": "button",
        "text": input.logButton,
        "url": `https://github.com/${input.event.repository.full_name}/actions/runs/${input.runId}`,
      }
    );
  }

  if (input.reportSha) {
    try {
      const res = await axios({
        url: `https://api.github.com/repos/${input.event.repository.full_name}/commits/${input.reportSha}`,
        headers: {
          'Authorization': `token ${input.githubToken}`,
        },
      });
      input.authorName = res.data.author.login;
      input.authorLink = res.data.author.html_url;
      input.authorIcon = res.data.author.avatar_url;
      const messages = res.data.commit.message.split('\n');
      input.title = `${messages[0]} (${res.data.sha.slice(0, 8)})`;
      input.titleLink = res.data.html_url;
      if (messages.length == 1) {
        input.body = '';
      } else {
        messages.splice(0, 1); // delete first line message
        input.body = messages.join('\n');
      }
    } catch (e) {
      if (e.response.status == 404) {
        throw new Error('Commit data not found. "report-sha" input may not be correct.');
      } else {
        throw new Error(`GitHub API error (message: ${e.message}).`);
      }
    }
  } else if (input.reportPrNumber) {
    try {
      const res = await axios({
        url: `https://api.github.com/repos/${input.event.repository.full_name}/pulls/${input.reportPrNumber}`,
        headers: {
          'Authorization': `token ${input.githubToken}`,
        },
      });
      input.authorName = res.data.user.login;
      input.authorLink = res.data.user.html_url;
      input.authorIcon = res.data.user.avatar_url;
      input.title = `#${res.data.number} ${res.data.title}`;
      input.titleLink = res.data.html_url;
    } catch (e) {
      if (e.response.status == 404) {
        throw new Error('Pull request not found. "report-pr-number" input may not be correct.');
      } else {
        throw new Error(`GitHub API error (message: ${e.message}).`);
      }
    }
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
    "attachments": [attachment],
    'thread_ts': input.threadTimestamp,
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
  core.setOutput('timestamp', res.data.ts);
}

run(input)
  .then(result => {
    core.setOutput('result', 'success');
  })
  .catch(error => {
    core.setOutput('result', 'failure');
    core.setFailed(error.message);
  });
