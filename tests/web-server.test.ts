import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import WebServer from '../src/ems/web-server';

chai.use(chaiHttp);

describe('Web Server', () => {
  let server: WebServer;

  before(() => {
    server = WebServer.getInstance();
    server.start('1234');
  });

  it('should be running', () => {
    chai.request(server.getServer())
      .get('/')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(200);
      });
  });

  it('should get device status', () => {
    chai.request(server.getServer())
      .get('/status')
      .set('Content-Type', 'application/json')
      .end((err, res) => {
        expect(res.body).to.be.a('object');
        expect(res.body.serial).to.equal('1234');
      });
  });
});
