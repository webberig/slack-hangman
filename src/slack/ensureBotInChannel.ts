import { WebClient } from '@slack/web-api';

export const ensureBotInChannel = async (client: WebClient, channel: string) => {
  // check the channel in which the game is starting
  // join public channel if not yet present, or display an error
  try {
    const channelInfoResponse = await client.conversations.info({ channel });
    const channelInfo: any = channelInfoResponse.channel;
    if (!channelInfo.is_member) {
      if (channelInfo.is_channel && !channelInfo.is_private) {
        client.conversations.join({ channel });
      } else {
        throw "Please invite me in the channel first";
      }
    }
    return channelInfo;
  } catch (e) {
    console.error(e);
    throw "One does not simply start a hangman game in direct messages. Use a channel";
  }
}
