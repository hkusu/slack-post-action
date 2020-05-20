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
  uses: hkusu/slack-post-action@v0.1.0
  env:
    SLACK_APP_TOKEN: ${{ secrets.SLACK_APP_TOKEN }} # your slack app token
  with:
    channel: 'hello-channel'
    text: 'Hello World!'
    color: 'good' # option
    author_name: 'hkusu' # option
    author_link: 'https://github.com/hkusu' # option
    author_icon: 'https://github.com/hkusu.png' # option
    title: 'This is my action' # option
    title_link: 'https://github.com/hkusu/slack-post-action' # option
    footer: 'my action' # option (default: repository name)
    footer_icon: 'https://github.com/hkusu.png' # option
    fields: '[{ "title": "App", "value": "my app", "short": true }]' # option
    actions: '[{ "type": "button", "text": "Show action", "url": "https://github.com/hkusu/slack-post-action" }]' # option
- name: Show result
  run: echo '${{ steps.slack.outputs.result }}'
```

![image](./doc/image.png)

## License

MIT
