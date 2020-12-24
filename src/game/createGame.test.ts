import {Subject} from "rxjs";
import {createGame} from "./createGame";
import {ActionType, GuessAction} from "./actions";
import {TestScheduler} from "rxjs/testing";
import {filter, skipWhile, tap} from "rxjs/internal/operators";
import {ColdObservable} from "rxjs/internal/testing/ColdObservable";

const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected);
});

function createGuesses(guesses: string[]): ColdObservable<string> {
  //testScheduler.createColdObservable()
  let charIndex = 97;
  let marbles = "";
  const values: {[key: string]: string} = {};
  guesses.forEach(guess => {
    const char = String.fromCharCode(charIndex++)
    marbles += char;
    values[char] = guess;
  });
  return testScheduler.createColdObservable(marbles, values);
}
describe("Game", () => {
  let guesses$: Subject<string>;
  beforeEach(function () {
    guesses$ = new Subject<string>();
  });
  it("should have a proper initial state", done => {
    const game$ = createGame(guesses$.asObservable(), "protagonist");
    game$.subscribe(state => {
      expect(state).toEqual({
        status: "Busy",
        guessedCharacters: [],
        wrongGuesses: 0,
        word: "protagonist",
      });
      done();
    })
  });
  it("should win the game when last letter is guessed", () => {
    testScheduler.run(({ expectObservable }) => {
      const guesses$ = createGuesses(["h", "a", "m", "n", "x", "g"]);
      const game$ = createGame(guesses$, "hangman").pipe(
        filter(state => state.status !== "Busy")
      );
      expectObservable(game$).toBe("-----(d|)", {
        d: {
          status: "Won",
          guessedCharacters: ["h", "a", "m", "n", "g"],
          wrongGuesses: 1,
          word: "hangman",
        }
      })
    });
  });
  it("should win the game when word is guessed entirely", () => {
    testScheduler.run(({ expectObservable }) => {
      const guesses$ = createGuesses(["h", "a", "hangman", "protagonist"]);
      const game$ = createGame(guesses$, "protagonist").pipe(
        filter(state => state.status !== "Busy")
      );
      expectObservable(game$).toBe("--------(d|)", {
        d: {
          status: "Won",
          guessedCharacters: ["a"],
          wrongGuesses: 2,
          word: "protagonist",
        }
      })
    });
  });
  it("should lose the game after maximum amount of guesses", () => {
    testScheduler.run(({ expectObservable }) => {
      const guesses$ = createGuesses(["f", "g", "h", "i", "j", "k"]);
      const game$ = createGame(guesses$, "cursedmarbles").pipe(
        filter(state => state.status !== "Busy")
      );
      expectObservable(game$).toBe("-------------(d|)", {
        d: {
          status: "Lost",
          guessedCharacters: [],
          wrongGuesses: 6,
          word: "cursedmarbles",
        }
      })
    });

  });
});

