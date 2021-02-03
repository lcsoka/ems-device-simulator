import { DeviceValues } from '../definitions/device-values';
import getDefaultConfig from '../utils/default-config';

export default class Device {
  private battery = 100;

  private connected = false;

  private elapsedTime = 0;

  private ticker!: NodeJS.Timeout;

  private version = '1.0';

  private deviceValues: DeviceValues;

  private hasImpulse = false;

  constructor(private serial: string) {
    this.deviceValues = {
      master: 0,
      time: 0,
      pause: 0,
      channels: getDefaultConfig(),
      battery: this.battery,
    };
    this.hasImpulse = false;
    this.start();
  }

  public start() {
    this.elapsedTime = 0;
    this.ticker = setInterval(() => {
      this.elapsedTime += 10;
    }, 10);

    setInterval(() => {
      if (this.battery > 0) {
        this.battery -= 1;
      }
    }, 120000);
  }

  public connect() {
    this.connected = true;
  }

  public disconnect() {
    this.connected = false;
  }

  public toJSON() {
    return {
      serial: this.serial,
      battery: this.battery,
      connected: this.connected,
      elapsed: this.elapsedTime,
      version: this.version,
    };
  }

  public getBattery() {
    return this.battery;
  }

  public getValues() {
    return this.deviceValues;
  }

  public setMaster(value: number) {
    this.deviceValues.master = value;
  }

  public setChannelValue(channel: number, value: number) {
    if (channel in this.deviceValues.channels) {
      // Don't let to set invalid values (only between 0 and 100)
      const correctedValue = Math.min(Math.max(0, value), 100);
      this.deviceValues.channels[channel].value = correctedValue;
    }
  }

  public setTime(value: number) {
    this.deviceValues.time = value;
  }

  public setPause(value: number) {
    this.deviceValues.pause = value;
  }

  public onIon() {
    this.hasImpulse = true;
  }

  public onIoff() {
    this.hasImpulse = false;
  }
}
