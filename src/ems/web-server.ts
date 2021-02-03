import express from 'express';
import http from 'http';
import Device from './device';

export default class WebServer {
  private static instance: WebServer;

  private app: express.Application;

  private port = 80;

  private server!: http.Server;

  private device!: Device;

  constructor() {
    this.app = express();
  }

  public static getInstance() {
    if (!WebServer.instance) {
      WebServer.instance = new WebServer();
    }
    return WebServer.instance;
  }

  public getServer() {
    return this.server;
  }

  public getDevice() {
    return this.device;
  }

  public start(serial: string) {
    // Create new device
    if (this.server) {
      this.device = new Device(serial);
      return;
    }

    // Start listening
    this.server = this.app.listen(this.port, () => {
      console.info(`Express server is listening on port: ${this.port}`);
      this.device = new Device(serial);
    });

    this.app.get('/', WebServer.status);
    this.app.get('/status', WebServer.status);
  }

  public static status(req: any, res: any) {
    const response = WebServer.getInstance().getDevice().toJSON();
    res.status(200).send(response);
  }
}
