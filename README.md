# Slack Post Action

GitHub Action to post a message to Slack.

## Usage

### Basic usage

```yaml
- uses: hkusu/slack-post-action@v1
  env:
    SLACK_APP_TOKEN: ${{ secrets.SLACK_APP_TOKEN }} # your slack app token
  with:
    channel: 'my-greeting-channel'
    message: 'Hello World!'
```

All inputs except `channel` are **optional**, so use only the inputs you want to use:

```yaml
- uses: hkusu/slack-post-action@v1
  env:
    SLACK_APP_TOKEN: ${{ secrets.SLACK_APP_TOKEN }}
  with:
    channel: 'my-greeting-channel'
    message: 'Hello World!'
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

### Additional features

#### Report commit SHA information

Specify some commit SHA for `report-sha` input. 

```yaml
- uses: hkusu/slack-post-action@v1
  env:
    SLACK_APP_TOKEN: ${{ secrets.SLACK_APP_TOKEN }}
  with:
    channel: 'my-greeting-channel'
    message: 'Hello World!'
    report-sha: ${{ github.sha }} # Specify some commit SHA
```

it is useful in workflow results reports for git push.

#### Report pull result information

Specify some pull request number for `report-pr-number` input. 

```yaml
- uses: hkusu/slack-post-action@v1
  env:
    SLACK_APP_TOKEN: ${{ secrets.SLACK_APP_TOKEN }}
  with:
    channel: 'my-greeting-channel'
    message: 'Hello World!'
    report-pr-number: ${{ github.event.pull_request.number }} # Specify some pull request number
```

It is useful in workflow result reports on pull requests.

#### Show log button

If you specify the name of the button in `log-button` input, the button will be displayed.

```yaml
- uses: hkusu/slack-post-action@v1
  env:
    SLACK_APP_TOKEN: ${{ secrets.SLACK_APP_TOKEN }}
  with:
    channel: 'my-greeting-channel'
    message: 'Hello World!'
    log-button: 'View log' # Specify button name
```

That button links to the result of the workflow, eg `https://github.com/hkusu/slack-post-action/actions/runs/804117290`.
Useful for posting when workflow fails.

### Result of this action

Use `result` outputs. Useful for using the results of this action in subsequent steps.

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
