import { Channels } from '../definitions/channels';
import { channelMap } from './channel-map';

export default function getDefaultConfig() {
  const channels: Channels = {};

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 10; i++) {
    channels[i] = {} as any;
    channels[i].id = i;
    channels[i].name = channelMap[i];
    channels[i].value = 0;
  }
  return channels;
}
