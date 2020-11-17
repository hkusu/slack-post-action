const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

const SLACK_APP_TOKEN = process.env['SLACK_APP_TOKEN'];

async function run() {
  try { 
    const channel = core.getInput('channel');
    const message = core.getInput('message');
    const userName = core.getInput('user_name');
    const userIcon = core.getInput('user_icon');
    const color = core.getInput('color');
    const authorName = core.getInput('author_name');
    const authorLink = core.getInput('author_link');
    const authorIcon = core.getInput('author_icon');
    const title = core.getInput('title');
    const titleLink = core.getInput('title_link');
    const body = core.getInput('body');
    let fields = core.getInput('fields');
    const image = core.getInput('image');
    const thumbnail = core.getInput('thumbnail');
    let footer = core.getInput('footer');
    const footerIcon = core.getInput('footer_icon');
    let actions = core.getInput('actions');

    if (fields != '') {
      fields = JSON.parse(fields);
    }

    if (footer == '') {
      footer = `<${github.context.payload.repository.html_url}|${github.context.payload.repository.full_name}>`;
    }

    if (actions != '') {
      actions = JSON.parse(actions);
    }

    let attachments;
    if (authorName == '' && title == '' && body == '' && fields == '' && image == '' && thumbnail == '' && actions == '') {
      attachments = {};
    } else {
      attachments = {
        "color": color,
        "author_name": authorName,
        "author_link": authorLink,
        "author_icon": authorIcon,
        "title": title,
        "title_link": titleLink,
        "text": body,
        "fields": fields,
        "image_url": image,
        "thumb_url": thumbnail,
        "footer": footer,
        "footer_icon": footerIcon,
        "ts": Math.floor(new Date().getTime() / 1000),
        "actions": actions,
      };
    }

    data = {
      "channel": channel,
      "username": userName,
      "icon_url": userIcon,
      "text": message,
      "attachments": [attachments]
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
