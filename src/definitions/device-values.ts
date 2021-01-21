import { Channels } from '@/definitions/channels';

export interface DeviceValues {
  master: number;
  time: number;
  pause: number;
  channels: Channels;
  battery: number;
}
