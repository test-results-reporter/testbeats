# test-results-reporter

Publishes test results to Microsoft Teams and Slack

## Getting Started

```sh
npx test-results-reporter publish -c path/to/config.json
```

## Config

```json
{
  "reports": [
    {
      "targets": [
        {
          "name": "teams",
          "incoming-webhook-url": "<url>"
        }
      ],
      "results": [
        {
          "type": "testng",
          "files": [
            "test/data/testng/default.xml"
          ]
        }
      ],
      "options": {
        "publish": "test-summary",
        "links": [
          {
            "text": "Pipeline",
            "url": "<url>"
          }
        ]
      }
    }
  ]
}
```
