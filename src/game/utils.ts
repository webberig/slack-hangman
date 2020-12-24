export function getGuessedWordParts (word: string, guesses: string[]) {
  return word
    .split("")
    .map(char => guesses.includes(char) ? char : null);
}

export function isWordGuessed (word: string, guesses: string[]) {
  return !getGuessedWordParts(word, guesses).includes(null);
}
