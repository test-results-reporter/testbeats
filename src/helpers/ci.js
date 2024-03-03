function getCIInformation() {
  if (process.env.GITHUB_ACTIONS) {
    return getGitHubActionsInformation();
  }
}

function getGitHubActionsInformation() {
  return {
    ci: 'GITHUB_ACTIONS',
    repository_url: process.env.GITHUB_SERVER_URL + '/' + process.env.GITHUB_REPOSITORY,
    repository_name: process.env.GITHUB_REPOSITORY,
    repository_ref: process.env.GITHUB_REF,
    build_url: process.env.GITHUB_SERVER_URL + '/' + process.env.GITHUB_REPOSITORY + '/commit/' + process.env.GITHUB_SHA + '/checks/' + process.env.GITHUB_RUN_ID,
    build_number: process.env.GITHUB_RUN_NUMBER,
    build_name: process.env.GITHUB_WORKFLOW,
  }
}

console.log(getCIInformation())

module.exports = {
  getCIInformation
}