const Metric = require("performance-results-parser/src/models/Metric");
const { checkCondition } = require("./helper");
const pretty_ms = require('pretty-ms');

/**
 * @param {object} param0 
 * @param {Metric[]} param0.metrics 
 * @param {object} param0.result
 * @param {object} param0.target  
 */
async function getValidMetrics({ metrics, result, target }) {
  if (target.inputs.metrics && target.inputs.metrics.length > 0) {
    const valid_metrics = [];
    for (let i = 0; i < metrics.length; i++) {
      const metric = metrics[i];
      for (let j = 0; j < target.inputs.metrics.length; j++) {
        const metric_config = target.inputs.metrics[j];
        if (metric.name === metric_config.name) {
          const include = await checkCondition({ condition: metric_config.condition || 'always', result, target });
          if (include) valid_metrics.push(metric);
        }
      }
    }
    return valid_metrics;
  }
  return metrics;
}

/**
 * @param {Metric} metric 
 * @param {string[]} fields 
 */
function getCounterMetricFieldValue(metric, fields) {
  let value = '';
  if (fields.includes('sum')) {
    const sum_failure = metric.failures.find(_failure => _failure.field === 'sum');
    if (sum_failure) {
      const emoji = getEmoji(sum_failure.difference);
      value = `${emoji} ${metric['sum']} (${getDifferenceSymbol(sum_failure.difference)}${sum_failure.difference}) `
    } else {
      value = `${metric['sum']} `;
    }
  }
  if (fields.includes('rate')) {
    let metric_unit = metric.unit.startsWith('/') ? metric.unit : ` ${metric.unit}`;
    const rate_failure = metric.failures.find(_failure => _failure.field === 'rate');
    if (rate_failure) {
      const emoji = getEmoji(rate_failure.difference);
      value += `${emoji} ${metric['rate']}${metric_unit} (${getDifferenceSymbol(rate_failure.difference)}${rate_failure.difference})`
    } else {
      value += `${metric['rate']}${metric_unit}`;
    }
  }
  return value;
}

/**
 * @param {Metric} metric 
 */
function getTrendMetricFieldValue(metric, field) {
  const failure = metric.failures.find(_failure => _failure.field === field);
  if (failure) {
    const emoji = getEmoji(failure.difference);
    return `${emoji} ${field}=${pretty_ms(metric[field])} (${getDifferenceSymbol(failure.difference)}${pretty_ms(failure.difference)})`
  }
  return `${field}=${pretty_ms(metric[field])}`;
}

/**
 * @param {Metric} metric 
 */
function getRateMetricFieldValue(metric) {
  const failure = metric.failures.find(_failure => _failure.field === 'rate');
  if (failure) {
    const emoji = getEmoji(failure.difference);
    return `${emoji} ${metric['rate']} ${metric.unit} (${getDifferenceSymbol(failure.difference)}${failure.difference})`;
  }
  return `${metric['rate']} ${metric.unit}`;
}

function getEmoji(value) {
  return value > 0 ? '🔺' : '🔻';
}

function getDifferenceSymbol(value) {
  return value > 0 ? `+` : '';
}

/**
 * 
 * @param {object} param0 
 * @param {Metric} param0.metric 
 */
function getDisplayFields({ metric, target }) {
  let fields = [];
  if (target.inputs.metrics) {
    const metric_config = target.inputs.metrics.find(_metric => _metric.name === metric.name);
    if (metric_config) {
      fields = metric_config.fields;
    }
  }
  if (fields && fields.length > 0) {
    return fields;
  } else {
    switch (metric.type) {
      case 'COUNTER':
        return ['sum', 'rate'];
      case 'RATE':
        return ['rate'];
      case 'TREND':
        return ['avg', 'min', 'med', 'max', 'p90', 'p95', 'p99'];
      default:
        return ['sum', 'min', 'max'];
    }
  }
}

/**
 * @param {object} param0 
 * @param {Metric} param0.metric 
 */
function getMetricValuesText({ metric, target }) {
  const fields = getDisplayFields({ metric, target });
  const values = [];
  if (metric.type === 'COUNTER') {
    values.push(getCounterMetricFieldValue(metric, fields));
  } else if (metric.type === 'TREND') {
    for (let i = 0; i < fields.length; i++) {
      const field_metric = fields[i];
      values.push(getTrendMetricFieldValue(metric, field_metric));
    }
  } else if (metric.type === 'RATE') {
    values.push(getRateMetricFieldValue(metric));
  }
  return values.join(' ｜ ');
}

module.exports = {
  getValidMetrics,
  getMetricValuesText
}