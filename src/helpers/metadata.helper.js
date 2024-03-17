const { checkCondition } = require('./helper')

/**
 * Asynchronously generates metadata text for slack.
 *
 * @param {object} param0 - the payload object
 * @param {Object} param0.elements - The elements to generate metadata text from
 * @param {import('..').Target} param0.target - The result object
 * @param {import('..').Extension} param0.extension - The result object
 * @param {Object} param0.result - The result object
 * @param {string} param0.default_condition - The default condition object
 * @return {string} The generated metadata text
 */
async function getSlackMetaDataText({ elements, target, extension, result, default_condition }) {
  const items = [];
  for (const element of elements) {
    if (await is_valid({ element, result, default_condition })) {
      if (element.type === 'hyperlink') {
        const url = await get_url({ url: element.value, target, result, extension });
        if (element.label) {
          items.push(`*${element.label}:* <${url}|${element.key}>`);
        } else {
          items.push(`<${url}|${element.key}>`);
        }
      } else if (element.key) {
        items.push(`*${element.key}:* ${element.value}`);
      } else {
        items.push(element.value);
      }
    }
  }
  return items.join(' ｜ ');
}

/**
 * Asynchronously generates metadata text for teams.
 *
 * @param {object} param0 - the payload object
 * @param {Object} param0.elements - The elements to generate metadata text from
 * @param {import('..').Target} param0.target - The result object
 * @param {import('..').Extension} param0.extension - The result object
 * @param {Object} param0.result - The result object
 * @param {string} param0.default_condition - The default condition object
 * @return {string} The generated metadata text
 */
async function getTeamsMetaDataText({ elements, target, extension, result, default_condition }) {
  const items = [];
  for (const element of elements) {
    if (await is_valid({ element, result, default_condition })) {
      if (element.type === 'hyperlink') {
        const url = await get_url({ url: element.value, target, result, extension });
        if (element.label) {
          items.push(`**${element.label}:** [${element.key}](${url})`);
        } else {
          items.push(`[${element.key}](${url})`);
        }
      } else if (element.key) {
        items.push(`**${element.key}:** ${element.value}`);
      } else {
        items.push(element.value);
      }
    }
  }
  return items.join(' ｜ ');
}

/**
 * Asynchronously generates metadata text for chat.
 *
 * @param {object} param0 - the payload object
 * @param {Object} param0.elements - The elements to generate metadata text from
 * @param {import('..').Target} param0.target - The result object
 * @param {import('..').Extension} param0.extension - The result object
 * @param {Object} param0.result - The result object
 * @param {string} param0.default_condition - The default condition object
 * @return {string} The generated metadata text
 */
async function getChatMetaDataText({ elements, target, extension, result, default_condition }) {
  const items = [];
  for (const element of elements) {
    if (await is_valid({ element, result, default_condition })) {
      if (element.type === 'hyperlink') {
        const url = await get_url({ url: element.value, target, result, extension });
        if (element.label) {
          items.push(`<b>${element.label}:</b> <a href="${url}">${element.key}</a>`);
        } else {
          items.push(`<a href="${url}">${element.key}</a>`);
        }
      } else if (element.key) {
        items.push(`<b>${element.key}:</b> ${element.value}`);
      } else {
        items.push(element.value);
      }
    }
  }
  return items.join(' ｜ ');
}

function is_valid({ element, result, default_condition }) {
  const condition = element.condition || default_condition;
  return checkCondition({ condition, result });
}

function get_url({ url, target, extension, result}) {
  if (typeof url === 'function') {
    return url({target, extension, result});
  }
  return url;
}

module.exports = {
  getSlackMetaDataText,
  getTeamsMetaDataText,
  getChatMetaDataText
}