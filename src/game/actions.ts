export enum ActionType {
  GUESS= "Guess",
  WON="WON",
  LOST="LOST",
  START="START",
}

export interface GuessAction {
  type: ActionType.GUESS;
  guess: string;
}

export interface GameWon {
  type: ActionType.WON
}

export interface GameLost {
  type: ActionType.LOST
}

export interface GameStart {
  type: ActionType.START;
  word: string;
}

export type Action = GuessAction | GameWon | GameLost | GameStart;
