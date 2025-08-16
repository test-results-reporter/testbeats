const fs = require('fs');

/**
 * Simple and extendable Gherkin parser for Cucumber feature files
 * Parses .feature files and returns structured JSON objects
 */
class GherkinParser {
  constructor() {
    /** @type {string[]} Supported step keywords */
    this.stepKeywords = ['Given', 'When', 'Then', 'And', 'But'];
  }

  /**
   * @param {string} file_path
   * @returns {Object} Parsed Gherkin document as JSON
   */
  parse(file_path) {
    try {
      const content = fs.readFileSync(file_path, 'utf8');
      const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);

      return this.parseLines(lines);
    } catch (error) {
      throw new Error(`Failed to parse Gherkin file: ${error.message}`);
    }
  }

    /**
   * Parse lines and build the Gherkin document structure
   * @param {string[]} lines
   * @returns {Object}
   */
  parseLines(lines) {
    const document = {
      type: 'GherkinDocument',
      feature: null
    };

    let currentFeature = null;
    let currentBackground = null;
    let currentScenario = null;
    let currentStepKeyword = null;
    let pendingFeatureTags = [];
    let pendingScenarioTags = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('@')) {
        // Handle tags
        const tags = this.parseTags(line);

        // Look ahead to see if tags belong to Feature or Scenario
        if (i + 1 < lines.length && lines[i + 1].startsWith('Feature:')) {
          // Tags belong to Feature
          pendingFeatureTags = tags;
        } else if (i + 1 < lines.length && lines[i + 1].startsWith('Scenario:')) {
          // Tags belong to Scenario
          pendingScenarioTags = tags;
        }
      } else if (line.startsWith('Feature:')) {
        // Parse Feature
        currentFeature = this.parseFeature(line, i + 1 < lines.length ? lines[i + 1] : '');
        currentFeature.tags = pendingFeatureTags;
        document.feature = currentFeature;
        pendingFeatureTags = [];
        i++; // Skip description line
      } else if (line.startsWith('Background:')) {
        // Parse Background
        currentBackground = this.parseBackground();
        if (currentFeature && currentFeature.children) {
          currentFeature.children.push(currentBackground);
        }
        currentStepKeyword = null;
      } else if (line.startsWith('Scenario:')) {
        // Parse Scenario
        currentScenario = this.parseScenario(line);
        currentScenario.tags = pendingScenarioTags;
        if (currentFeature && currentFeature.children) {
          currentFeature.children.push(currentScenario);
        }
        pendingScenarioTags = [];
        currentStepKeyword = null;
      } else if (this.isStep(line)) {
        // Parse Step
        const step = this.parseStep(line, currentStepKeyword);

        // Determine where to add the step based on current context
        if (currentBackground && currentBackground.steps) {
          // Add step to Background
          currentBackground.steps.push(step);
        } else if (currentScenario && currentScenario.steps) {
          // Add step to Scenario
          currentScenario.steps.push(step);
        }

        // Update current step keyword for 'And' steps
        if (step.keyword !== 'And' && step.keyword !== 'But') {
          currentStepKeyword = step.keyword;
        }
      }
    }

    return document;
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
      type: 'Background',
      keyword: 'Background',
      steps: []
    };
  }

  /**
   * Parse Scenario line
   * @param {string} line
   * @returns {Object}
   */
  parseScenario(line) {
    const name = line.replace('Scenario:', '').trim();
    return {
      type: 'Scenario',
      tags: [],
      name: name,
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
   * @param {string} previousKeyword
   * @returns {Object}
   */
  parseStep(line, previousKeyword) {
    let keyword = 'Given'; // Default
    let text = line;

    // Handle 'And' and 'But' steps
    if (line.startsWith('And ')) {
      keyword = previousKeyword || 'Given';
      text = line.replace('And ', '');
    } else if (line.startsWith('But ')) {
      keyword = previousKeyword || 'Given';
      text = line.replace('But ', '');
    } else {
      // Extract keyword from step
      for (const stepKeyword of this.stepKeywords) {
        if (line.startsWith(stepKeyword + ' ')) {
          keyword = stepKeyword;
          text = line.replace(stepKeyword + ' ', '');
          break;
        }
      }
    }

    return {
      keyword: keyword,
      text: text.trim()
    };
  }

  /**
   * Parse from string content instead of file
   * @param {string} content
   * @returns {Object}
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
           document.type === 'GherkinDocument' &&
           document.feature &&
           document.feature.type === 'Feature' &&
           document.feature.name &&
           Array.isArray(document.feature.children);
  }
}

module.exports = { GherkinParser };