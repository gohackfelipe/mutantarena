export interface IMutant {
  id: string;
  location: ICodeLocation;
  mutatedLines: string;
  mutatorName: string;
  originalLines: string;
  range: number[];
  replacement: string;
  sourceFilePath: string;
  status: number;
  testsRan: any[];
}

export interface ICodeLocation {
  end: { column: number; line: number };
  start: { column: number; line: number };
}
