import {readFileSync} from "fs";
import {resolve} from "path";
import {Subject} from "rxjs";
import {createGame} from "../game/createGame";
import {getGuessedWordParts} from "../game/utils";
const prompts = require('prompts');

const words = readFileSync(resolve(__dirname, "words.txt")).toString().split("\n");
const word = words[Math.floor(Math.random() * words.length)];
const guesses$ = new Subject<string>();
const game$ = createGame(guesses$.asObservable(), word);

game$.subscribe(state => {
  const wordParts = getGuessedWordParts(state.word, state.guessedCharacters)
    .map(char => char || "_");

  console.log("=========================");
  console.log(wordParts.join(" "));
  console.log("=========================");
  switch (state.status) {
    case "Won":
      console.log(`Wrong answers: ${state.wrongGuesses}/6`);
      console.log("You have WON the game 🎉");
      process.exit(0);
      break;
    case "Lost":
      console.log(`You have lost, the word was ${state.word}`);
      process.exit(0);
      break;
  }
  console.log(`Wrong answers: ${state.wrongGuesses}/6`);
});

(async function askGuess () {
  const response = await prompts({
    type: 'text',
    name: 'guess',
    message: 'Take a guess?',
  });
  guesses$.next(response.guess);
  askGuess();
})();
