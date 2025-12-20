export type IManualTestCase = {
  name: string;
  type: string;
  tags: string[];
  steps: string[];
  path: string;
  hash: string;
}

export type IManualTestSuite = {
  name: string;
  type: string;
  tags: string[];
  before_each: string[];
  test_cases: IManualTestCase[];
  hash: string;
}

export type IManualTestFolder = {
  name: string;
  path: string;
  test_suites: IManualTestSuite[];
  folders: IManualTestFolder[];
  hash: string;
}

export type IManualSyncComparePayload = {
  project_id: string;
  folders: IManualSyncCompareFolder[];
}

export type IManualSyncCompareFolder = {
  name: string;
  hash: string;
  test_suites: IManualSyncCompareTestSuite[];
  folders: IManualSyncCompareFolder[];
}

export type IManualSyncCompareTestSuite = {
  name: string;
  hash: string;
}

export type IManualSyncCompareTestCase = {
  name: string;
  hash: string;
}

export type IManualSyncCompareResponse = {
  folders: IManualSyncCompareResponseFolder[];
}

export type SyncOperationType = 'create' | 'update' | 'delete' | 'no_change';

export type IManualSyncCompareResponseFolder = {
  type: SyncOperationType;
  id?: string;
  name: string;
  hash: string;
  test_suites: IManualSyncCompareResponseTestSuite[];
  folders: IManualSyncCompareResponseFolder[];
}

export type IManualSyncCompareResponseTestSuite = {
  type: SyncOperationType;
  id?: string;
  name: string;
  hash: string;
}

export type IManualSyncFoldersPayload = {
  project_id: string;
  folders: IManualSyncFoldersFolder[];
}

export type IManualSyncFoldersFolder = {
  type: SyncOperationType;
  name: string;
  path: string;
  hash: string;
  id?: string;
}

export type ISyncManualSuitesPayload = {
  project_id: string;
  suites: ISyncManualSuitesSuite[];
}

export type ISyncManualSuitesSuite = {
  type: SyncOperationType;
  name: string;
  folder_id: string;
  hash: string;
  tags?: string[];
  before_each?: string[];
  test_cases?: ISyncManualSuitesTestCase[];
}

export type ISyncManualSuitesTestCase = {
  name: string;
  hash: string;
  tags?: string[];
  steps: string[];
}