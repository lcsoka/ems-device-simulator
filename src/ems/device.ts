export default class Device {
  private battery = 100;

  private connected = false;

  private elapsedTime = 0;

  private ticker!: NodeJS.Timeout;

  private version = '1.0';

  constructor(private serial: string) {
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
}
