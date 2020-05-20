# slack post action

This is the action to post to slack.

## Inputs

See `action.ym.`.

## Outputs

See `action.ym.`.

## Usage

```yaml
- name: Post to Slack
  id: slack
  uses: hkusu/slack-post-action@v0.1.0
  with:
    channel: 'hello-channel'
    text:  'Hello World!'
    color: 'good' # option
    author_name: '' # option
    author_link:  '' # option
    author_icon:  '' # option
    title:  '' # option
    title_link:  '' # option
- name: Show result
  run: echo '${{ steps.slack.outputs.result }}'
```

## License

MIT
