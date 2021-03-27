import WebSocket from 'ws';
import { Socket } from 'electron-ipc-socket';
import * as http from 'http';
import WebServer from './web-server';
import { DeviceMessage } from '../definitions/device-message';

export default class WebsocketServer {
  private static instance: WebsocketServer;

  private ws!: WebSocket.Server;

  private ipc!: Socket;

  public static getInstance() {
    if (!WebsocketServer.instance) {
      WebsocketServer.instance = new WebsocketServer();
    }
    return WebsocketServer.instance;
  }

  public start(ipcSocket: Socket, port?: number) {
    if (this.ws) {
      return;
    }

    // Store ipc socket to be able to send messages with it later
    this.ipc = ipcSocket;

    let config = {
      server: WebServer.getInstance()
        .getServer(),
      path: '/ws',
    };

    if (port) {
      config = Object.assign(config, { port });
    }

    // Create Websocket server and attach it to our Web Server
    this.ws = new WebSocket.Server(config);
    this.ws.on('connection', (ws: WebSocket, socket: WebSocket, request: http.IncomingMessage) => {
      this.addLog('Client connected. ✅');
      WebServer.getInstance()
        .getDevice()
        .connect();
      this.ipc.send('websocket-connect', WebServer.getInstance()
        .getDevice()
        .getValues());

      ws.on('message', (message: string) => {
        const components = message.split(' ');

        const device = WebServer.getInstance()
          .getDevice();

        const messageFormat = /(\d |\d)+/;

        if (!messageFormat.test(message)) {
          this.addLog(`Invalid message. (${message})`);
          return;
        }

        const messageType = parseInt(components[0], 10);
        // eslint-disable-next-line default-case
        switch (messageType as DeviceMessage) {
          case DeviceMessage.SetMasterValue:
            // eslint-disable-next-line no-case-declarations
            const masterValue = parseInt(components[1], 10);
            device.setMaster(masterValue);
            this.addLog(`Setting master value: ${masterValue} 💪`);
            break;
          case DeviceMessage.SetChannelValue:
            // eslint-disable-next-line no-case-declarations
            const channel = parseInt(components[1], 10);
            // eslint-disable-next-line no-case-declarations
            const channelValue = parseInt(components[2], 10);
            device.setChannelValue(channel, channelValue);
            this.addLog(`Setting channel ${channel} value: ${channelValue}`);
            break;
          case DeviceMessage.SetChannelFreq:
            // eslint-disable-next-line no-case-declarations
            const ch = parseInt(components[1], 10);
            // eslint-disable-next-line no-case-declarations
            const freq = parseInt(components[2], 10);
            device.setChannelFreq(ch, freq);
            this.addLog(`Setting channel ${ch} freq: ${freq}`);
            break;
          case DeviceMessage.ImpulseOn:
            device.onIon();
            this.addLog('Turn ON impulse ⚡️');
            break;
          case DeviceMessage.ImpulseOff:
            device.onIoff();
            this.addLog('Turn OFF impulse ⚡');
            break;
          case DeviceMessage.SetImpulseTime:
            // eslint-disable-next-line no-case-declarations
            const time = parseInt(components[1], 10);
            device.setTime(time);
            this.addLog(`Set impulse time to ${time} seconds. ▶️`);
            break;
          case DeviceMessage.SetImpulsePause:
            // eslint-disable-next-line no-case-declarations
            const pause = parseInt(components[1], 10);
            device.setPause(pause);
            this.addLog(`Set impulse pause to ${pause} seconds. ⏸️`);
            break;
          case DeviceMessage.GetBattery:
            // eslint-disable-next-line no-case-declarations
            const battery = device.getBattery();
            this.addLog(`Getting battery percentage. (${battery}%)`);
            ws.send(`${DeviceMessage.GetBattery} ${battery}`);
            // Send device values to the UI
            this.ipc.send('device-values', device.getValues());
            return;
        }

        // Reply with same message
        ws.send(message);

        // Send device values to the UI
        this.ipc.send('device-values', device.getValues());
      });

      ws.on('close', () => {
        this.addLog('Client disconnected. ❌');
        WebServer.getInstance()
          .getDevice()
          .disconnect();
        this.ipc.send('websocket-disconnect');
      });
    });
  }

  public stop() {
    if(this.ws.clients.size == 0) {
      this.ipc.send('websocket-disconnect');
    }

    for (const client of this.ws.clients) {
      client.close();
    }
  }

  private addLog(message: string) {
    this.ipc.send('websocket-message', message);
  }
}
