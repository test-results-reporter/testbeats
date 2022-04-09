export type CommunicationExtensionName = 'report-portal-analysis';
export type Hook = 'start' | 'post-main' | 'end';
export type Condition = 'pass' | 'fail' | 'passOrFail';

export interface ReportPortalAnalysisOptions {
  url: string;
  api_key: string;
  project: string;
  launch_id: string;
}

export interface CommunicationExtension {
  name: CommunicationExtensionName;
  hook?: Hook;
  condition?: Condition;
  options?: ReportPortalAnalysisOptions;
}

export interface CommunicationLink {
  text: string;
  url: string;
}

export type PublishTarget = 'slack' | 'teams' | 'custom';
export type PublishReportType = 'test-summary' | 'failure-summary' | 'test-summary-slim' | 'failure-summary-slim' | 'failure-details' | 'failure-details-slim';

export interface CommunicationTarget {
  name: PublishTarget;
  "incoming-webhook-url": string;
  publish: PublishReportType;
  extensions?: CommunicationExtension[];
  links?: CommunicationLink[];
}

export interface PublishResult {
  type: string;
  files: string[];
}

export interface PublishReport {
  targets: CommunicationTarget[];
  results: PublishResult[];
}

export interface PublishConfig {
  reports: PublishReport[];
}

export interface PublishOptions {
  config: string | PublishConfig;
}

export function publish(options: PublishOptions): Promise<any>