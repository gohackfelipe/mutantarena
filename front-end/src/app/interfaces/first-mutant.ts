export interface IFirstMutant {
  id: string;
  fileName: string;
  mutatorName: string;
  replacement: string;
  scopedTestIds: any[];
  timeSpentScopedTests: number;
}
