import {KnownBlock} from "@slack/types";
import {GameState} from "../game/types";
import {getGuessedWordParts} from "../game/utils";
import {GameContext} from "./GameEngine";
import {hangmanAscii} from "../game/hangmanAscii";

export const gameHeader = (username: string, hint?: string): KnownBlock[] => {
  const headerParts: KnownBlock[] = [{
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": `@${username} has started a game of *hangman*!`
    }
  }];
  if (hint) {
    headerParts.push({
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `Hint: _${hint}_`
      }
    })
  }
  return headerParts;
}
export const wordStatus = (word: string, guessedCharacters: string[]): KnownBlock => {
  const wordParts = getGuessedWordParts(word, guessedCharacters)
    .map(char => char || "_");
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: `\`${wordParts.join(" ")}\``,
    }
  }

}
export const gameStatus = (state?: GameState): KnownBlock => {
  if (!state) {
    return {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `_Please wait while we prepare a hanging..._`
      }
    };
  }
  switch (state.status) {
    case "Won":
      return {
        type: "section",
        text: {
          type: "plain_text",
          text: "You have WON the game 🎉",
        }
      }
    case "Lost":
      return {
        type: "section",
        text: {
          type: "plain_text",
          text: `You have lost, the word was ${state.word}`,
        }
      }
  }

  return {
    type: "section",
    text: {
      type: "plain_text",
      text: `Wrong guesses: ${state.wrongGuesses}/6`,
    }
  }

}

export const gameAscii = (wrongGuesses: number): KnownBlock => ({
  type: "section",
  text: {
    type: "mrkdwn",
    text: `\`\`\`${hangmanAscii[wrongGuesses]}\`\`\``,
  }
});

export const render = (context: GameContext, state?: GameState) => {
  const parts: KnownBlock[] = [
    ...gameHeader(context.username, context.hint),
    wordStatus(context.word, state ? state.guessedCharacters : []),
    gameAscii(state ? state.wrongGuesses : 0),
    gameStatus(state),
  ];
  return parts;
};
