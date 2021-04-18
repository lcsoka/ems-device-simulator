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

  private impulseTicker!: NodeJS.Timeout;

  private impulseHandler: DeviceImpulseHandler;

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
    if (this.impulseTicker) {
      clearTimeout(this.impulseTicker);
    }
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

  public setChannelFreq(channel: number, freq: number) {
    if (channel in this.deviceValues.channels) {
      // Don't let to set invalid values (only between 0 and 100)
      const correctedValue = Math.min(Math.max(0, freq), 100);
      this.deviceValues.channels[channel].freq = correctedValue;
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
    this.startImpulseOn();
  }

  public onIoff() {
    this.hasImpulse = false;
    if (this.impulseTicker) {
      clearTimeout(this.impulseTicker);
    }
  }

  public setImpulseHandler(handler: DeviceImpulseHandler) {
    this.impulseHandler = handler;
  }

  private startImpulseOn() {
    if (this.impulseTicker) {
      clearTimeout(this.impulseTicker);
    }
    if (this.hasImpulse) {
      this.impulseTicker = setTimeout(() => {
        // Send ioff message to the app, start ioff timer
        this.impulseHandler.sendImpulseOff();
        this.startImpulseOff();
      }, this.deviceValues.time * 1000);
    }
  }

  private startImpulseOff() {
    if (this.impulseTicker) {
      clearTimeout(this.impulseTicker);
    }
    if (this.hasImpulse) {
      this.impulseTicker = setTimeout(() => {
        // Send ion message to the app, start ion timer
        this.impulseHandler.sendImpulseOn();
        this.startImpulseOn();
      }, this.deviceValues.pause * 1000);
    }
  }
}
