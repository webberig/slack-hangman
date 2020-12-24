import {ActionType} from "./actions";
import {Observable} from "rxjs";
import {distinctUntilChanged, map, scan, startWith, takeWhile} from "rxjs/internal/operators";
import {reducer} from "./reducer";

export function createGame (guesses$: Observable<string>, word: string) {
  return guesses$.pipe(
    map(guess => ({ type: ActionType.GUESS, guess })),
    startWith({ type: ActionType.START, word }),
    scan(reducer, undefined),
    distinctUntilChanged(),
    takeWhile(state => state.status === "Busy", true)
  )
}
