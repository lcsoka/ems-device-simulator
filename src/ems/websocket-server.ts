import WebSocket from 'ws';
import { Socket } from 'electron-ipc-socket';
import WebServer from '@/ems/web-server';
import * as http from 'http';

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

  public start(ipcSocket: Socket) {
    if (this.ws) {
      return;
    }

    // Store ipc socket to be able to send messages with it later
    this.ipc = ipcSocket;

    // Create Websocket server and attach it to our Web Server
    this.ws = new WebSocket.Server({
      server: WebServer.getInstance().getServer(),
      path: '/ws',
    });

    this.ws.on('connection', (ws: WebSocket, socket: WebSocket, request: http.IncomingMessage) => {
      this.addLog('Client connected. ✅');
      WebServer.getInstance().getDevice().connect();
      this.ipc.send('websocket-connect');

      ws.on('message', (message: string) => {
        this.addLog(message);
      });

      ws.on('close', () => {
        this.addLog('Client disconnected. ❌');
        WebServer.getInstance().getDevice().disconnect();
        this.ipc.send('websocket-disconnect');
      });
    });
  }

  private addLog(message: string) {
    this.ipc.send('websocket-message', message);
  }
}
