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

    //github.context.payload

    data = {
      "channel": channel,
      "username": "GitHub Actions",
      "icon_url": "https://github.com/actions.png?size=48",
      "text": text,
      "attachments": [
        {
          "color": color,
          "author_name": author_name,
          "author_link": author_link,
          "author_icon": author_icon,
          "title": title,
          "title_link": titleLink,
          "footer": "<${{ github.event.repository.html_url }}|${{ github.repository }}>",
          "ts": Math.floor(new Date().getTime() / 1000),
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

    console.log(res.data);

    core.setOutput("debug", JSON.stringify(github));

    core.setOutput("result", 'success');
  }
  catch (error) {
    core.setOutput("result", 'failure');
    core.setFailed(error.message);
  }
}

run()
