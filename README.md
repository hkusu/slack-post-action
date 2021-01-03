# Slack Post Action

This is a GitHub Action to post to Slack.

## Usage

```yaml
- uses: hkusu/slack-post-action@v1
  env:
    SLACK_APP_TOKEN: ${{ secrets.SLACK_APP_TOKEN }} # your slack app token
  with:
    channel: 'my-greeting-channel'
    message: 'Hello!'
```

All inputs except `channel` are **optional**, so use only the inputs you want to use:

```yaml
- uses: hkusu/slack-post-action@v1
  env:
    SLACK_APP_TOKEN: ${{ secrets.SLACK_APP_TOKEN }}
  with:
    channel: 'my-greeting-channel'
    message: 'Hello!'
    user-name: 'GitHub Actions'
    user-icon: 'https://github.com/actions.png?size=48'
    color: 'good' # good or warning or danger or hex color code like #ffaabb
    author-name: 'hkusu'
    author-link: 'https://github.com/hkusu'
    author-icon: 'https://github.com/hkusu.png'
    title: 'This is title'
    title-link: 'https://github.com/hkusu/slack-post-action'
    body: 'This is body'
    fields: |
      [
        { 
          "title": "Action1",
          "value": "my action1",
          "short": true
        },
        {
          "title": "Action2",
          "value": "my action2",
          "short": true
        }
      ]
    footer: 'my action' # default: repository name
    footer-icon: 'https://github.com/hkusu.png' # default: repository owner image
    actions: |
      [
        { 
          "type": "button",
          "text": "Show action",
          "url": "https://github.com/hkusu/slack-post-action"
        }
      ]
```

![image](./doc/image.png)

You can also use `image` or `thumbnail` for input. See also https://api.slack.com/reference/messaging/attachments .

### Result of action

Use `result` outputs.

```yaml
- uses: hkusu/slack-post-action@v1
  id: slack # specify id
  env:
    SLACK_APP_TOKEN: ${{ secrets.SLACK_APP_TOKEN }}
  with:
    channel: 'my-greeting-channel'
    message: 'Hello!'
- name: Show result
  if: always()
  run: echo '${{ steps.slack.outputs.result }}' # success or failure
```

## License

MIT
