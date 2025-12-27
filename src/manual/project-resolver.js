class ProjectResolver {
  /**
   * @param {import('../beats/beats.api').BeatsApi} beatsApi
   */
  constructor(beatsApi) {
    this.beatsApi = beatsApi;
  }

  /**
   * Resolve project name to project ID
   * @param {string} projectName - Project name to resolve
   * @returns {Promise<string>} Project ID
   * @throws {Error} If project is not found
   */
  async resolveProject(projectName) {
    const projectsResponse = await this.beatsApi.searchProjects(projectName);

    if (!projectsResponse || !projectsResponse.values) {
      throw new Error(`Project ${projectName} not found`);
    }

    const project = projectsResponse.values.find(p => p.name === projectName);

    if (!project) {
      throw new Error(`Project ${projectName} not found`);
    }

    return project.id;
  }
}

module.exports = { ProjectResolver };

