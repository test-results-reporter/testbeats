# test-results-reporter

Publish test results to Microsoft Teams and Slack

## Getting Started

```sh
npx test-results-reporter publish -c path/to/config.json
```

## Config

Configuration file holds the different configurations files for our reporting needs. We can specify the type of test results to be consumed and type of reports to be published.

### Sample Config File

```json
{
  "reports": [
    {
      "targets": [
        {
          "name": "teams",
          "url": "<teams-incoming-webhook-url>",
          "publish": "test-summary",
          "links": [{ "text": "Build Logs", "url": "<url>" }]
        }
      ],
      "results": [
        {
          "type": "testng",
          "files": ["path/to/testng-results.xml"]
        }
      ]
    }
  ]
}
```

### Environment Variables

To use environment variables in the config file, wrap the environment variable name inside `{}`.

#### Example

```json
{
  "links": [{ "text": "Build Logs", "url": "{BUILD_URL}" }]
}
```

### Sample Reports

![teams-summary-report](https://github.com/test-results-reporter/reporter/raw/main/assets/teams/test-summary-single-suite.png)

![teams-summary-report](https://github.com/test-results-reporter/reporter/raw/main/assets/slack/test-summary-single-suite.png)

### Config File Properties

#### reports

| Property | Description                        | Attribute |
|----------|------------------------------------|-----------|
| targets  | list of targets to publish reports | Required  |
| results  | list of results to parse           | Required  |
| options  | common options for all targets     | Optional  |

## Supports

### Results

| Result Type | Support |
|-------------|---------|
| TestNG      | ✅       |
| JUnit       | ✅       |
| xUnit       | ✅       |

### Targets

| Targets         | Support |
|-----------------|---------|
| Microsoft Teams | ✅       |
| Slack           | ✅       |
| Custom          | ✅       |

#### Teams

| Property               | Description                    | Attribute |
|------------------------|--------------------------------|-----------|
| name                   | name of the target             | Optional  |
| url                    | url of the target              | Required  |
| publish                | type of report to publish      | Optional  |
| links                  | links to be part of the report | Optional  |
| title                  | title of the report            | Optional  |
| title_suffix           | suffix to add to title         | Optional  |
| report_portal_analysis | report portal analysis options | Optional  |

##### Supported Report Types to Publish

- test-summary
- failure-summary
- test-summary-slim
- failure-summary-slim
- failure-details
- failure-details-slim

##### Report Portal Analysis Options

```json
{
  "url": "<report-portal-base-url>",
  "api_key": "<api-key>",
  "project": "<project-id>",
  "launch_id": "<launch-id>"
}
```

#### Slack

| Property               | Description                    | Attribute |
|------------------------|--------------------------------|-----------|
| name                   | name of the target             | Optional  |
| url                    | url of the target              | Required  |
| publish                | type of report to publish      | Optional  |
| links                  | links to be part of the report | Optional  |
| title                  | title of the report            | Optional  |
| title_suffix           | suffix to add to title         | Optional  |

##### Supported Report Types to Publish

- test-summary
- failure-summary
- test-summary-slim
- failure-summary-slim
- failure-details
- failure-details-slim

#### Custom

| Property | Description            | Attribute |
|----------|------------------------|-----------|
| name     | name of the target     | Required  |
| path     | path to custom js file | Required  |

> Under Active Development

## Examples

### Defaults

1. Identifies the target *(slack or teams)* based on the url.
2. Defaults publish to `test-summary` report.

```json
{
  "reports": [
    {
      "targets": [
        {
          "url": "<slack-incoming-webhook-url>"
        }
      ],
      "results": [
        {
          "type": "testng",
          "files": ["path/to/testng-results.xml"]
        }
      ]
    }
  ]
}
```

### Custom

```json
{
  "reports": [
    {
      "targets": [
        {
          "name": "custom",
          "path": "/relative/path/to/custom.js"
        }
      ],
      "results": [
        {
          "type": "junit",
          "files": ["path/to/junit-results.xml"]
        }
      ]
    }
  ]
}
```