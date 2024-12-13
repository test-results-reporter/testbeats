export type ICIInfo = {
  ci: string
  git: string
  repository_url: string
  repository_name: string
  repository_ref: string
  repository_commit_sha: string
  branch_url: string
  branch_name: string
  pull_request: IPRInfo | boolean
  build_url: string
  build_number: string
  build_name: string
  user: string
}

export type IPRInfo = {
  name: string
  url: string
}