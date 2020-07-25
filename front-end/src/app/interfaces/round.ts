import { IMutant } from "./mutant";

export interface IRound {
  _id?: string;
  testCaseCode: string;
  user: string;
  arena: string;
  status?: string;
  __v?: number;
  report?: string;
  mutants?: IMutant[];
  dateCreated?: Date;
}
