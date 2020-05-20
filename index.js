const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

const SLACK_APP_TOKEN = process.env['SLACK_APP_TOKEN'];

async function run() {
  try { 
    const channel = core.getInput('channel');
    const text = core.getInput('text');
    const color = core.getInput('color');
    const authorName = core.getInput('author_name');
    const authorLink = core.getInput('author_link');
    const authorIcon = core.getInput('author_icon');
    const title = core.getInput('title');
    const titleLink = core.getInput('title_link');
    const fields = core.getInput('fields');
    const actions = core.getInput('actions');

    data = {
      "channel": channel,
      "username": "GitHub Actions",
      "icon_url": "https://github.com/actions.png?size=48",
      "text": text,
      "attachments": [
        {
          "color": color,
          "author_name": authorName,
          "author_link": authorLink,
          "author_icon": authorIcon,
          "title": title,
          "title_link": titleLink,
          "fields": JSON.stringify(fields),
          "footer": `<${github.context.payload.repository.html_url}|${github.context.payload.repository.full_name}>`,
          "ts": Math.floor(new Date().getTime() / 1000),
          "actions": JSON.stringify(actions),
        }
      ]
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
      throw new Error(res.data.error);
    }

    core.setOutput("result", 'success');
  }
  catch (error) {
    core.setOutput("result", 'failure');
    core.setFailed(error.message);
  }
}

run()
