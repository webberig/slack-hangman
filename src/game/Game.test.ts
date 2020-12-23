import {Subject} from "rxjs";
import {createGame} from "./Game";
import {Action, ActionType, GuessAction} from "./actions";
import {TestScheduler} from "rxjs/testing";
import {filter, skipWhile, tap} from "rxjs/internal/operators";

const testScheduler = new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected);
});

function mapGuessesToMarbleValues(guesses: string[]): {[key: string]: GuessAction} {
  let charIndex = 97;
  const values: {[key: string]: GuessAction} = {};
  guesses.forEach(guess => {
    values[String.fromCharCode(charIndex++)] = {
      type: ActionType.GUESS,
      guess,
    }
  });
  return values;
}
describe("Game", () => {
  let actions$: Subject<Action>;
  beforeEach(function () {
    actions$ = new Subject<Action>();
  });
  it("should have a proper initial state", done => {
    const game$ = createGame(actions$.asObservable(), "protagonist");
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
    testScheduler.run(({ cold, hot, expectObservable, expectSubscriptions, flush }) => {
      const actions$ = cold("abcdef", mapGuessesToMarbleValues(["h", "a", "m", "n", "x", "g"]));
      const game$ = createGame(actions$, "hangman").pipe(
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
    testScheduler.run(({ cold, hot, expectObservable, expectSubscriptions, flush }) => {
      const actions$ = cold("abcdef", mapGuessesToMarbleValues(["h", "a", "hangman", "protagonist"]));
      const game$ = createGame(actions$, "protagonist").pipe(
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
    testScheduler.run(({ cold, hot, expectObservable, expectSubscriptions, flush }) => {
      const actions$ = cold("abcdef", mapGuessesToMarbleValues(["f", "g", "h", "i", "j", "k"]));
      const game$ = createGame(actions$, "cursedmarbles").pipe(
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

