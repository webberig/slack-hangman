import {GameState, MAX_FAILED_GUESSES} from "./types";
import {ActionType, GameStartAction, GuessAction} from "./actions";
import {isWordGuessed} from "./utils";

function addFailedAttempt (state: GameState): GameState {
  const wrongGuesses = ++state.wrongGuesses;
  return {
    ...state,
    wrongGuesses,
    status: wrongGuesses === MAX_FAILED_GUESSES ? "Lost" : "Busy"
  }
}

export function reducer (state: GameState, action: GuessAction | GameStartAction): GameState {
  if (state && state.status !== "Busy") {
    return state;
  }
  if (action.type === ActionType.START) {
    return {
      status: "Busy",
      word: action.word,
      wrongGuesses: 0,
      guessedCharacters: [],
    };
  }
  const {guess} = action;
  if (guess === state.word) {
    return {
      ...state,
      status: "Won",
    }
  }
  if (guess.length > 1 || !state.word.includes(guess)) {
    return addFailedAttempt(state);
  }
  if (state.guessedCharacters.includes(guess)) {
    return state;
  }
  const guessedCharacters = [...state.guessedCharacters, guess];
  return {
    ...state,
    guessedCharacters,
    status: isWordGuessed(state.word, guessedCharacters) ? "Won" : "Busy"
  }
}
