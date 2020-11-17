# slack post action

This is the action to post to slack.

## Usage

```yaml
- name: Post to Slack
  id: slack
  uses: hkusu/slack-post-action@v0.3.0
  env:
    SLACK_APP_TOKEN: ${{ secrets.SLACK_APP_TOKEN }} # your slack app token
  with:
    channel: 'greeting-channel' # require (other parameters are optional)
    message: 'Hello World!'
    user_name: 'GitHub Actions'
    user_icon: 'https://github.com/actions.png?size=48'
    color: 'good'
    author_name: 'hkusu'
    author_link: 'https://github.com/hkusu'
    author_icon: 'https://github.com/hkusu.png'
    title: 'This is title'
    title_link: 'https://github.com/hkusu/slack-post-action'
    body: 'This is body'
    fields: '[{ "title": "Action1", "value": "my action1", "short": true }, { "title": "Action2", "value": "my action2", "short": true }]'
    footer: 'my action' # default: repository name
    footer_icon: 'https://github.com/hkusu.png'
    actions: '[{ "type": "button", "text": "Show action", "url": "https://github.com/hkusu/slack-post-action" }]'
- name: Show result
  run: echo '${{ steps.slack.outputs.result }}' # success or failure
```

![image](./doc/image.png)

You can also use `image` or `thumbnail` for input.
See also https://api.slack.com/reference/messaging/attachments .

## License

MIT
