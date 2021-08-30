class TestCase {

  constructor() {
    this.id = '';
    this.name = '';
    this.total = 0;
    this.passed = 0;
    this.failed = 0;
    this.errors = 0;
    this.skipped = 0;
    this.duration = -1;
    this.status = 'NA';
    this.failure = '';
    this.steps = [];
  }

}

module.exports = TestCase;