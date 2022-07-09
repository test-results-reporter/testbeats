import { User, Schedule } from 'rosters';

export type ExtensionName = 'report-portal-analysis' | 'hyperlinks' | 'mentions' | 'report-portal-history' | 'quick-chart-test-summary';
export type Hook = 'start' | 'end';
export type Condition = 'pass' | 'fail' | 'passOrFail';
export type TargetName = 'slack' | 'teams' | 'chat' | 'custom';
export type PublishReportType = 'test-summary' | 'test-summary-slim' | 'failure-details';

export interface ExtensionInputs {
  title?: string;
  title_link?: string;
  separator?: boolean;
}

export interface ReportPortalAnalysisInputs extends ExtensionInputs {
  url: string;
  api_key: string;
  project: string;
  launch_id: string;
  launch_name: string;
}

export interface ReportPortalHistoryInputs extends ExtensionInputs {
  url: string;
  api_key: string;
  project: string;
  launch_id: string;
  launch_name: string;
  history_depth: number;
}

export interface QuickChartTestSummaryInputs {
  url: string;
}

export interface HyperlinkInputs extends ExtensionInputs {
  links: Link[];
}

export interface MentionInputs extends ExtensionInputs {
  users?: User[];
  schedule?: Schedule;
}

export interface Extension {
  name: ExtensionName;
  condition?: Condition;
  hook?: Hook;
  inputs?: ReportPortalAnalysisInputs | ReportPortalHistoryInputs | HyperlinkInputs | MentionInputs | QuickChartTestSummaryInputs | PercyAnalysisInputs;
}

export interface PercyAnalysisInputs extends ExtensionInputs {
  url?: string;
  token?: string;
  retries?: number;
  build_id?: string;
  project_id?: string;
  project_name?: string;
  organization_uid?: string;
  title_link_to_build: boolean;
}

export interface PercyAnalysisOutputs {
  build?: object;
  project?: object;
}

export interface PercyAnalysisExtension extends Extension {
  inputs?: PercyAnalysisInputs;
  outputs?: PercyAnalysisOutputs;
}

export interface Link {
  text: string;
  url: string;
  condition?: Condition;
}

export interface TargetInputs {
  url: string;
  title?: string;
  title_suffix?: string;
  title_link?: string;
  duration?: string;
  publish?: PublishReportType;
  only_failures?: boolean;
}

export interface SlackInputs extends TargetInputs {}

export interface TeamsInputs extends TargetInputs {
  width?: string;
}

export interface ChatInputs extends TargetInputs {}

export interface Target {
  name: TargetName;
  condition: Condition;
  inputs: SlackInputs | TeamsInputs | ChatInputs;
  extensions?: Extension[];
}

export interface PublishResult {
  type: string;
  files: string[];
}

export interface PublishReport {
  targets: Target[];
  results: PublishResult[];
}

export interface PublishConfig {
  reports: PublishReport[];
}

export interface PublishOptions {
  config: string | PublishConfig;
}

export function publish(options: PublishOptions): Promise<any>