const fs = require('fs');
const path = require('path');
const FormData = require('form-data-lite');
const TestResult = require('test-results-parser/src/models/TestResult');
const { BeatsApi } = require('./beats.api');
const logger = require('../utils/logger');
const TestAttachment = require('test-results-parser/src/models/TestAttachment');

const MAX_ATTACHMENTS_PER_REQUEST = 5;
const MAX_ATTACHMENTS_PER_RUN = 20;
const MAX_ATTACHMENT_SIZE = 2 * 1024 * 1024;

class BeatsAttachments {

  /**
   * @param {import('../index').PublishReport} config
   * @param {TestResult} result
   */
  constructor(config, result, test_run_id) {
    this.config = config;
    this.result = result;
    this.api = new BeatsApi(config);
    this.test_run_id = test_run_id;
    this.failed_test_cases = [];
    this.attachments = [];
  }

  async upload() {
    this.#setAllFailedTestCases();
    this.#setAttachments();
    await this.#uploadAttachments();
  }

  #setAllFailedTestCases() {
    for (const suite of this.result.suites) {
      for (const test of suite.cases) {
        if (test.status === 'FAIL') {
          this.failed_test_cases.push(test);
        }
      }
    }
  }

  #setAttachments() {
    for (const test_case of this.failed_test_cases) {
      for (const attachment of test_case.attachments) {
        this.attachments.push(attachment);
      }
    }
  }

  async #uploadAttachments() {
    if (this.attachments.length === 0) {
      return;
    }
    logger.info(`⏳ Uploading ${this.attachments.length} attachments...`);
    try {
      let count = 0;
      const size = MAX_ATTACHMENTS_PER_REQUEST;
      for (let i = 0; i < this.attachments.length; i += size) {
        if (count >= MAX_ATTACHMENTS_PER_RUN) {
          logger.warn('⚠️ Maximum number of attachments per run reached. Skipping remaining attachments.');
          break;
        }
        const attachments_subset = this.attachments.slice(i, i + size);
        const form = new FormData();
        form.append('test_run_id', this.test_run_id);
        const file_images = []
        for (const attachment of attachments_subset) {
          const attachment_path = this.#getAttachmentFilePath(attachment);
          if (!attachment_path) {
            logger.warn(`⚠️ Unable to find attachment ${attachment.path}`);
            continue;
          }
          const stats = fs.statSync(attachment_path);
          if (stats.size > MAX_ATTACHMENT_SIZE) {
            logger.warn(`⚠️ Attachment ${attachment.path} is too big (${stats.size} bytes). Allowed size is ${MAX_ATTACHMENT_SIZE} bytes.`);
            continue;
          }
          form.append('images', fs.readFileSync(attachment_path), { filename: path.basename(attachment_path), filepath: attachment_path });
          file_images.push({
            file_name: attachment.name,
            file_path: attachment.path,
          });
          count += 1;
        }
        if (file_images.length === 0) {
          return;
        }
        form.append('file_images', JSON.stringify(file_images));
        await this.api.uploadAttachments(form.getHeaders(), form.getBuffer());
        logger.info(`🏞️  Uploaded ${count} attachments`);
      }
    } catch (error) {
      logger.error(`❌ Unable to upload attachments: ${error.message}`, error);
    }
  }

  /**
   *
   * @param {TestAttachment} attachment
   */
  #getAttachmentFilePath(attachment) {
    const result_file = this.config.results[0].files[0];
    const result_file_dir = path.dirname(result_file);
    const relative_attachment_path = path.join(result_file_dir, attachment.path);
    const raw_attachment_path = attachment.path;

    try {
      fs.statSync(relative_attachment_path);
      return relative_attachment_path;
    } catch {
      // nothing
    }

    try {
      fs.statSync(raw_attachment_path);
      return raw_attachment_path;
    } catch {
      // nothing
    }

    return null;
  }



}

module.exports = { BeatsAttachments }