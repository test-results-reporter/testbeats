const influx_v1 = require('influxdb-v1');
const Metric = require('performance-results-parser/src/models/Metric');
const PerformanceTestResult = require('performance-results-parser/src/models/PerformanceTestResult');
const Transaction = require('performance-results-parser/src/models/Transaction');


const { STATUS } = require('../helpers/constants');

/**
 * 
 * @param {object} param0 
 * @param {PerformanceTestResult | TestResult} param0.result
 */
async function run({ result, target }) {
  target.inputs = Object.assign({}, default_inputs, target.inputs);
  const metrics = getMetrics({ result, target });
  await influx_v1.write(
    {
      url: target.inputs.url,
      db: target.inputs.db,
      username: target.inputs.username,
      password: target.inputs.password,
    },
    metrics
  );
}

function getMetrics({ result, target }) {
  const influx_metrics = [];
  if (result instanceof PerformanceTestResult) {
    const tags = Object.assign({}, target.inputs.tags);
    tags.Name = result.name;
    tags.Status = result.status;

    const fields = {};
    fields.status = result.status === 'PASS' ? 0 : 1;
    fields.transactions = result.transactions.length;
    fields.transactions_passed = result.transactions.filter(_transaction => _transaction.status === "PASS").length;
    fields.transactions_failed = result.transactions.filter(_transaction => _transaction.status === "FAIL").length;

    for (const metric of result.metrics) {
      setPerfMetrics(metric, fields);
    }

    influx_metrics.push({
      measurement: target.inputs.measurement_perf_run,
      tags,
      fields
    });

    for (const transaction of result.transactions) {
      influx_metrics.push(getTransactionInfluxMetric(transaction, target));
    }

  }
  return influx_metrics;
}

/**
 * 
 * @param {Metric} metric 
 */
function setPerfMetrics(metric, fields) {
  let name = metric.name;
  name = name.toLowerCase();
  name = name.replace(' ', '_');
  if (metric.type === "COUNTER" || metric.type === "RATE") {
    fields[`${name}_sum`] = metric.sum;
    fields[`${name}_rate`] = metric.rate;
  } else if (metric.type === "TREND") {
    fields[`${name}_avg`] = metric.avg;
    fields[`${name}_med`] = metric.med;
    fields[`${name}_max`] = metric.max;
    fields[`${name}_min`] = metric.min;
    fields[`${name}_p90`] = metric.p90;
    fields[`${name}_p95`] = metric.p95;
    fields[`${name}_p99`] = metric.p99;
  }
}

/**
 * 
 * @param {Transaction} transaction 
 */
function getTransactionInfluxMetric(transaction, target) {
  const tags = Object.assign({}, target.inputs.tags);
  tags.Name = transaction.name;
  tags.Status = transaction.status;

  const fields = {};
  fields.status = transaction.status === 'PASS' ? 0 : 1;

  for (const metric of transaction.metrics) {
    setPerfMetrics(metric, fields);
  }

  return {
    measurement: target.inputs.measurement_perf_transaction,
    tags,
    fields
  }
}


const default_inputs = {
  url: '',
  db: '',
  username: '',
  password: '',
  measurement_perf_run: 'PerfRun',
  measurement_perf_transaction: 'PerfTransaction',
  tags: {}
}

const default_options = {
  condition: STATUS.PASS_OR_FAIL
}

module.exports = {
  run,
  default_options
}