import {Observable, Subject} from "rxjs";
import {MessageEvent} from "@slack/bolt";
import {filter, map, mergeMap} from "rxjs/internal/operators";
import {WebAPICallResult, WebClient} from "@slack/web-api";
import {render} from "./messageBlocks";
import {createGame} from "../game/createGame";
import {GameState} from "../game/types";

export interface GameContext {
  client: WebClient;
  channel: string;
  username: string;
  word: string;
  hint?: string;
}

async function initializeGame (context: GameContext): Promise<string> {
  // Send a message in the given channel
  const response: WebAPICallResult = await context.client.chat.postMessage({
    blocks: render(context),
    channel: context.channel,
    text: "Loading, please wait",
  });
  return response.ts as string;
}

export class GameEngine {
  private messages$ = new Subject<MessageEvent>();

  private games$ = new Subject<GameContext>();

  start () {
    this.games$
      .pipe(
        mergeMap(context => initializeGame(context).then(ts => ({context, ts}))),
        mergeMap(({context, ts}) => this.createGame$(context, ts).pipe(
          map(state => ({context, ts, state}))
        ))
      )
      .subscribe(async ({context, ts, state}) => {
        const {client, username, hint, channel} = context;
        client.chat.update({
          channel,
          ts,
          text: "",
          blocks: render(context, state),
        });
      });

  }

  startGame (context: GameContext) {
    this.games$.next(context);
  }

  onMessage (message: MessageEvent) {
    this.messages$.next(message);
  }

  private createGame$ ({channel, word}: GameContext, ts: string): Observable<GameState> {
    const guesses$ = this.messages$.asObservable().pipe(
      filter((event: MessageEvent) => event.channel === channel && event.thread_ts === ts),
      map(event => event.text),
    );
    return createGame(guesses$, word);
  }
}
