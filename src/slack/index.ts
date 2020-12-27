import {config} from "./config";
import {AllMiddlewareArgs} from "@slack/bolt";
import {SlackCommandMiddlewareArgs, SlackEventMiddlewareArgs} from "@slack/bolt/dist/types";
import {ensureBotInChannel} from "./ensureBotInChannel";
import {GameContext, GameEngine} from "./GameEngine";

const { App } = require('@slack/bolt');

const engine = new GameEngine();

const app = new App({
  signingSecret: config.slackSigningSecret,
  token: config.slackBotToken,
});

function createGameContext(args : SlackCommandMiddlewareArgs & AllMiddlewareArgs): GameContext {
  const {client, payload} = args;
  const commandParts = payload.text.split(" ");
  const word = commandParts.shift();
  const hint = commandParts.join(" ");
  return {
    channel: payload.channel_id,
    username: payload.user_name,
    word,
    hint,
    client,
  };
}
/* Add functionality here */
app.command("/hangman", async (args : SlackCommandMiddlewareArgs & AllMiddlewareArgs) => {
  const {client, ack} = args;
  const context = createGameContext(args);

  // check the channel in which the game is starting
  // join public channel if not yet present, or display an error
  try {
    await ensureBotInChannel(client, context.channel);
    engine.startGame(context);
    return ack();
  } catch (e) {
    return ack(e);
  }
});

app.message(async ({ message }: SlackEventMiddlewareArgs<'message'>) => {
  engine.onMessage(message);
});

(async () => {
  // Start the app
  engine.start();
  await app.start(process.env.PORT || 3000);
  console.log('⚡ Bolt app is running!');
})();
