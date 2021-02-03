import { Channels } from './channels';

export interface DeviceValues {
  master: number;
  time: number;
  pause: number;
  channels: Channels;
  battery: number;
}
