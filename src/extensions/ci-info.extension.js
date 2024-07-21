const { BaseExtension } = require("./base.extension");
const { getCIInformation } = require('../helpers/ci');
const { getMetaDataText } = require("../helpers/metadata.helper");
const { STATUS, HOOK } = require("../helpers/constants");

const COMMON_BRANCH_NAMES = ['main', 'master', 'dev', 'develop', 'qa', 'test'];

class CIInfoExtension extends BaseExtension {

  constructor(target, extension, result, payload, root_payload) {
    super(target, extension, result, payload, root_payload);
    this.#setDefaultOptions();
    this.#setDefaultInputs();
    this.updateExtensionInputs();

    this.ci = null;
    this.repository_elements = [];
    this.build_elements = [];
  }

  #setDefaultOptions() {
    this.default_options.hook = HOOK.AFTER_SUMMARY,
      this.default_options.condition = STATUS.PASS_OR_FAIL;
  }

  #setDefaultInputs() {
    this.default_inputs.title = '';
    this.default_inputs.title_link = '';
    this.default_inputs.show_repository_non_common = true;
    this.default_inputs.show_repository = false;
    this.default_inputs.show_repository_branch = false;
    this.default_inputs.show_build = true;
  }

  async run() {
    this.ci = getCIInformation();

    this.#setRepositoryElements();
    this.#setBuildElements();

    const repository_text = await getMetaDataText({ elements: this.repository_elements, target: this.target, extension: this.extension, result: this.result, default_condition: this.default_options.condition });
    const build_text = await getMetaDataText({ elements: this.build_elements, target: this.target, extension: this.extension, result: this.result, default_condition: this.default_options.condition });
    this.text = this.mergeTexts([repository_text, build_text]);
    this.attach();
  }

  #setRepositoryElements() {
    if (!this.ci) {
      return;
    }
    if (!this.ci.repository_url || !this.ci.repository_name || !this.ci.repository_ref) {
      return;
    }

    if (this.extension.inputs.show_repository) {
      this.#setRepositoryElement();
    }
    if (this.extension.inputs.show_repository_branch) {
      if (this.ci.repository_ref.includes('refs/pull')) {
        this.#setPullRequestElement();
      } else {
        this.#setRepositoryBranchElement();
      }
    }
    if (!this.extension.inputs.show_repository && !this.extension.inputs.show_repository_branch && this.extension.inputs.show_repository_non_common) {
      if (this.ci.repository_ref.includes('refs/pull')) {
        this.#setRepositoryElement();
        this.#setPullRequestElement();
      } else {
        const branch_name = this.ci.repository_ref.replace('refs/heads/', '');
        if (!COMMON_BRANCH_NAMES.includes(branch_name.toLowerCase())) {
          this.#setRepositoryElement();
          this.#setRepositoryBranchElement();
        }
      }
    }
  }

  #setRepositoryElement() {
    this.repository_elements.push({ label: 'Repository', key: this.ci.repository_name, value: this.ci.repository_url, type: 'hyperlink' });
  }

  #setPullRequestElement() {
    const pr_url = this.ci.repository_url + this.ci.repository_ref.replace('refs/pull/', '/pull/');
    const pr_name = this.ci.repository_ref.replace('refs/pull/', '').replace('/merge', '');
    this.repository_elements.push({ label: 'Pull Request', key: pr_name, value: pr_url, type: 'hyperlink' });
  }

  #setRepositoryBranchElement() {
    const branch_url = this.ci.repository_url + this.ci.repository_ref.replace('refs/heads/', '/tree/');
    const branch_name = this.ci.repository_ref.replace('refs/heads/', '');
    this.repository_elements.push({ label: 'Branch', key: branch_name, value: branch_url, type: 'hyperlink' });
  }

  #setBuildElements() {
    if (!this.ci) {
      return;
    }

    if (this.extension.inputs.show_build && this.ci.build_url) {
      const name = (this.ci.build_name || 'Build') + (this.ci.build_number ? ` #${this.ci.build_number}` : '');
      this.build_elements.push({ label: 'Build', key: name, value: this.ci.build_url, type: 'hyperlink' });
    }
    if (this.extension.inputs.data) {
      this.build_elements = this.build_elements.concat(this.extension.inputs.data);
    }
  }

}

module.exports = { CIInfoExtension };