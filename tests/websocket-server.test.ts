import WebSocket from 'ws';
import { expect } from 'chai';
import WebsocketServer from '../src/ems/websocket-server';
import WebServer from '../src/ems/web-server';

describe('WebSocket Server', () => {
  let webServer: WebServer;
  let websocketServer: WebsocketServer;
  let client: WebSocket;
  let port = 80;
  const fakeIpcSocket = {
    send: (event: string, payload?: any) => {
    },
  };
  let connected = false;

  before(() => {
    webServer = WebServer.getInstance();
    webServer.start('1234');
    websocketServer = WebsocketServer.getInstance();
    websocketServer.start(fakeIpcSocket as any, port);
  });

  beforeEach('should start websocket and wait for connections', (done) => {
    client = new WebSocket(`ws://localhost:${port}/ws`);
    client.on('open', () => {
      connected = true;
      done();
    });
  });

  afterEach(() => {
    client.close();
  });

  it('should be able to connect', () => {
    expect(connected).to.be.equal(true);
  });

  it('should dismiss invalid message', () => {
    let lastResponse = '';
    client.send('1 1 1');
    client.send('wertyuioihgfdfghjk');
    client.on('message', (message: string) => {
      lastResponse = message;
    });
    setTimeout(() => {
      expect(lastResponse).to.be.equal('1 1 1');
    }, 10);
  });
});
