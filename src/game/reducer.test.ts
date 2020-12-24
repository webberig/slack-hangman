import {reducer} from "./reducer";
import {ActionType} from "./actions";
import {GameState} from "./types";

describe("game/reducer", () => {
  it("should return same state when action is dispatched and game has ended", () => {
    const state = reducer({
        word: "hangman",
        wrongGuesses: 0,
        guessedCharacters: [],
        status: "Won",
      },
      {
        type: ActionType.GUESS,
        guess: "h",
      });
    expect(state).toEqual<GameState>({
      word: "hangman",
      wrongGuesses: 0,
      guessedCharacters: [],
      status: "Won",
    });

  });

  describe("start", () => {
    it("should have a proper initial state", () => {
      const state = reducer(undefined, {
        type: ActionType.START,
        word: "hangman"
      });
      expect(state).toEqual<GameState>({
        status: "Busy",
        word: "hangman",
        wrongGuesses: 0,
        guessedCharacters: []
      });
    });
  });
  describe("guess", () => {
    it("should add a first guessed character", () => {
      const state = reducer({
          word: "hangman",
          wrongGuesses: 0,
          guessedCharacters: [],
          status: "Busy",
        },
        {
          type: ActionType.GUESS,
          guess: "h",
        });
      expect(state).toEqual<GameState>({
        word: "hangman",
        wrongGuesses: 0,
        guessedCharacters: ["h"],
        status: "Busy",
      });
    });
    it("should add a wrong guess", () => {
      const state = reducer({
          word: "hangman",
          guessedCharacters: ["h"],
          status: "Busy",
          wrongGuesses: 0,
        },
        {
          type: ActionType.GUESS,
          guess: "x",
        });
      expect(state).toEqual<GameState>({
        word: "hangman",
        wrongGuesses: 1,
        guessedCharacters: ["h"],
        status: "Busy",
      });
    });
    it("should not add an already guessed character", () => {
      const state = reducer({
          word: "hangman",
          guessedCharacters: ["h"],
          status: "Busy",
          wrongGuesses: 0,
        },
        {
          type: ActionType.GUESS,
          guess: "h",
        });
      expect(state).toEqual<GameState>({
        word: "hangman",
        wrongGuesses: 0,
        guessedCharacters: ["h"],
        status: "Busy",
      });
    });
    it("should win the game when last character is guessed", () => {
      const state = reducer({
          word: "hangman",
          guessedCharacters: ["h", "a", "n", "g"],
          status: "Busy",
          wrongGuesses: 2,
        },
        {
          type: ActionType.GUESS,
          guess: "m",
        });
      expect(state).toEqual<GameState>({
        word: "hangman",
        wrongGuesses: 2,
        guessedCharacters: ["h", "a", "n", "g", "m"],
        status: "Won",
      });
    });
    it("should lose the game when failed attempts reaches maximum", () => {
      const state = reducer({
          word: "hangman",
          guessedCharacters: ["h", "a", "n", "g"],
          status: "Busy",
          wrongGuesses: 5,
        },
        {
          type: ActionType.GUESS,
          guess: "y",
        });
      expect(state).toEqual<GameState>({
        word: "hangman",
        wrongGuesses: 6,
        guessedCharacters: ["h", "a", "n", "g"],
        status: "Lost",
      });
    });
    it("should win the game when the word is guessed entirely", () => {
      const state = reducer({
          word: "hangman",
          guessedCharacters: ["h", "a"],
          status: "Busy",
          wrongGuesses: 5,
        },
        {
          type: ActionType.GUESS,
          guess: "hangman",
        });
      expect(state).toEqual<GameState>({
        word: "hangman",
        wrongGuesses: 5,
        guessedCharacters: ["h", "a"],
        status: "Won",
      });
    });
  });
});
