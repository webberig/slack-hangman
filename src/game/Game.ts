import {Action, ActionType} from "./actions";
import {Observable} from "rxjs";
import {distinctUntilChanged, scan, startWith, takeWhile} from "rxjs/internal/operators";
import {reducer} from "./reducer";

export function createGame (actions$: Observable<Action>, word: string) {
  return actions$.pipe(
    startWith({ type: ActionType.START, word }),
    scan(reducer, undefined),
    distinctUntilChanged(),
    takeWhile(state => state.status === "Busy", true)
  )
}
