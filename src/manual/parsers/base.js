/**
 * Base class for manual test parsers
 * Provides common functionality for parsing test files
 */
class BaseParser {
  /**
   * @param {import('fs')} fs
   */
  constructor(fs) {
    /**
     * @type {import('fs')}
     */
    this.fs = fs;
  }
}

module.exports = { BaseParser };