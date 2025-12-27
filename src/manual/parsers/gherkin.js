const { BaseParser } = require('./base');

/**
 * Simple and extendable Gherkin parser for Cucumber feature files
 * Parses .feature files and returns structured test suite objects
 */
class GherkinParser extends BaseParser {
  constructor(fs) {
    super(fs);
    /** @type {string[]} Supported step keywords */
    this.stepKeywords = ['Given', 'When', 'Then', 'And', 'But'];
  }

  /**
   * @param {string} file_path
   * @returns {Object} Parsed test suite structure
   */
  parse(file_path) {
    try {
      const content = this.fs.readFileSync(file_path, 'utf8');
      const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);

      return this.parseLines(lines);
    } catch (error) {
      throw new Error(`Failed to parse Gherkin file: ${error.message}`);
    }
  }

    /**
   * Parse lines and build the test suite structure
   * @param {string[]} lines
   * @returns {Object}
   */
  parseLines(lines) {
    /**
     * @type {import('../../types').IManualTestSuite}
     */
    const testSuite = {
      name: '',
      type: 'feature',
      tags: [],
      before_each: [],
      test_cases: []
    };

    let currentFeature = null;
    let currentBackground = null;
    let currentScenario = null;
    let pendingFeatureTags = [];
    let pendingScenarioTags = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('@')) {
        // Handle tags - accumulate from consecutive @ lines
        const tags = this.parseTags(line);

        // Look ahead to see if tags belong to Feature or Scenario
        if (i + 1 < lines.length && lines[i + 1].startsWith('Feature:')) {
          // Tags belong to Feature - accumulate instead of replace
          pendingFeatureTags.push(...tags);
        } else if (i + 1 < lines.length && lines[i + 1].startsWith('Scenario:')) {
          // Tags belong to Scenario - accumulate instead of replace
          pendingScenarioTags.push(...tags);
        } else if (i + 1 < lines.length && lines[i + 1].startsWith('@')) {
          // Next line is also a tag line - determine which pending array to use
          // Look further ahead to find Feature or Scenario
          let j = i + 1;
          while (j < lines.length && lines[j].startsWith('@')) {
            j++;
          }
          if (j < lines.length && lines[j].startsWith('Feature:')) {
            pendingFeatureTags.push(...tags);
          } else if (j < lines.length && lines[j].startsWith('Scenario:')) {
            pendingScenarioTags.push(...tags);
          }
        }
      } else if (line.startsWith('Feature:')) {
        // Parse Feature
        const descriptionResult = this.parseMultiLineDescription(lines, i + 1);
        currentFeature = this.parseFeature(line, descriptionResult.description);
        testSuite.name = currentFeature.name;
        testSuite.tags = pendingFeatureTags.map(tag => tag.name);
        pendingFeatureTags = [];
        i += descriptionResult.linesConsumed; // Skip only actual description lines
      } else if (line.startsWith('Background:')) {
        // Parse Background
        currentBackground = this.parseBackground();
        testSuite.before_each.push(currentBackground);
      } else if (line.startsWith('Scenario:')) {
        // Parse Scenario
        currentScenario = this.parseScenario(line);
        currentScenario.tags = pendingScenarioTags.map(tag => tag.name);
        testSuite.test_cases.push(currentScenario);
        pendingScenarioTags = [];
        currentBackground = null; // Reset Background context when Scenario starts
      } else if (this.isStep(line)) {
        // Parse Step
        const step = this.parseStep(line);

        // Determine where to add the step based on current context
        if (currentBackground && currentBackground.steps) {
          // Add step to Background
          currentBackground.steps.push(step);
        } else if (currentScenario && currentScenario.steps) {
          // Add step to Scenario
          currentScenario.steps.push(step);
        }
      }
    }

    return testSuite;
  }

  /**
   * Parse tags from a line
   * @param {string} line
   * @returns {Array}
   */
  parseTags(line) {
    const tagMatches = line.match(/@\w+/g);
    return tagMatches ? tagMatches.map(tag => ({ name: tag })) : [];
  }

  /**
   * Parse multi-line description starting from a given line index
   * @param {string[]} lines
   * @param {number} startIndex
   * @returns {{description: string, linesConsumed: number}}
   */
  parseMultiLineDescription(lines, startIndex) {
    const descriptionLines = [];
    let linesConsumed = 0;

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];

      // Stop if we hit a keyword or step
      if (line.startsWith('Background:') ||
          line.startsWith('Scenario:') ||
          line.startsWith('@') ||
          this.isStep(line)) {
        break;
      }

      linesConsumed++;

      // Add non-empty lines to description
      if (line.trim().length > 0) {
        descriptionLines.push(line.trim());
      }
    }

    return {
      description: descriptionLines.join('\n'),
      linesConsumed: linesConsumed
    };
  }

  /**
   * Parse Feature line
   * @param {string} line
   * @param {string} description
   * @returns {Object}
   */
  parseFeature(line, description) {
    const name = line.replace('Feature:', '').trim();
    return {
      type: 'Feature',
      tags: [],
      keyword: 'Feature',
      name: name,
      description: description.trim(),
      children: []
    };
  }

  /**
   * Parse Background line
   * @returns {Object}
   */
  parseBackground() {
    return {
      name: '',
      type: 'background',
      steps: []
    };
  }

  /**
   * Parse Scenario line
   * @param {string} line
   * @returns {import('../../types').IManualTestCase}
   */
  parseScenario(line) {
    const name = line.replace('Scenario:', '').trim();
    return {
      name: name,
      type: 'scenario',
      tags: [],
      steps: []
    };
  }

  /**
   * Check if a line is a step
   * @param {string} line
   * @returns {boolean}
   */
  isStep(line) {
    return this.stepKeywords.some(keyword =>
      line.startsWith(keyword + ' ') ||
      line.startsWith('And ') ||
      line.startsWith('But ')
    );
  }

  /**
   * Parse a step line
   * @param {string} line
   * @returns {Object}
   */
  parseStep(line) {
    return {
      name: line.trim()
    };
  }

  /**
   * Parse from string content instead of file
   * @param {string} content
   * @returns {Object} Parsed test suite structure
   */
  parseString(content) {
    try {
      const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      return this.parseLines(lines);
    } catch (error) {
      throw new Error(`Failed to parse Gherkin content: ${error.message}`);
    }
  }

  /**
   * Validate if the parsed document has required structure
   * @param {Object} document
   * @returns {boolean}
   */
  validate(document) {
    return document &&
           document.name &&
           document.type === 'feature' &&
           Array.isArray(document.tags) &&
           Array.isArray(document.before_each) &&
           Array.isArray(document.test_cases);
  }
}

module.exports = { GherkinParser };