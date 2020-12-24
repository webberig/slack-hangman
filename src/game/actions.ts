export enum ActionType {
  GUESS= "Guess",
  START="START",
}

export interface GuessAction {
  type: ActionType.GUESS;
  guess: string;
}

export interface GameStartAction {
  type: ActionType.START;
  word: string;
}
