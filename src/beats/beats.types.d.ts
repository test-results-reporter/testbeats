export type IBeatExecutionMetric = {
  id: string
  created_at: string
  updated_at: string
  newly_failed: number
  always_failing: number
  recovered: number
  added: number
  removed: number
  flaky: number
  failure_summary: any
  failure_summary_provider: any
  failure_summary_model: any
  status: string
  status_message: any
  test_run_id: string
  org_id: string
}
