import { IFirstMutant } from "./first-mutant";

export interface IArena {
  _id?: string;
  name: string;
  description: string;
  sourceToMutate?: string;
  __v?: number;
  status?: boolean;
  dateCreated?: Date;
  mutants?: { data: IFirstMutant[]; status: string };
}
