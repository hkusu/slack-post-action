# slack post action

This is the action to post to slack.

## Inputs

See Usage.

## Outputs

See Usage.

## Usage

```yaml
- name: Post to Slack
  id: slack
  uses: hkusu/slack-post-action@v0.2.0
  env:
    SLACK_APP_TOKEN: ${{ secrets.SLACK_APP_TOKEN }} # your slack app token
  with:
    channel: 'greeting-channel' # require (other parameters are optional)
    text: 'Hello World!'
    username: 'GitHub Actions'
    icon_url: 'https://github.com/actions.png?size=48'
    color: 'good'
    author_name: 'hkusu'
    author_link: 'https://github.com/hkusu'
    author_icon: 'https://github.com/hkusu.png'
    title: 'This is title'
    title_link: 'https://github.com/hkusu/slack-post-action'
    body: 'This is body'
    footer: 'my action' # option (default: repository name)
    footer_icon: 'https://github.com/hkusu.png'
    fields: '[{ "title": "Action1", "value": "my action1", "short": true }, { "title": "Action2", "value": "my action2", "short": true }]'
    actions: '[{ "type": "button", "text": "Show action", "url": "https://github.com/hkusu/slack-post-action" }]'
- name: Show result
  run: echo '${{ steps.slack.outputs.result }}' # success or failure
```

![image](./doc/image.png)

## License

MIT
