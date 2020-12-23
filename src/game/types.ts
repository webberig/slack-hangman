export type GameStatus = "Busy" | "Won" | "Lost";
export const MAX_FAILED_GUESSES = 6;

export interface GameState {
  status: GameStatus;
  word: string;
  guessedCharacters: string[];
  wrongGuesses: number;
}
