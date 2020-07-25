export interface IScoreRounds {
  user: string;
  status: string;
  totalMutantsKilled: number;
  totalMutants: number;
  score: number;
}

export interface IRanking {
  arena: {
    name: string;
  };
  rounds: IScoreRounds[];
}
