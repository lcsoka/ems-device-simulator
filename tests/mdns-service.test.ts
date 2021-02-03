import MDNS from 'mdns';
import MdnsService from '../src/ems/mdns-service';

describe('MDNS Service', () => {
  let mdnService: MdnsService;

  before(() => {
    mdnService = MdnsService.getInstance();
    mdnService.start();
  });

  it('should be visible on the network', (done) => {
    const browser = MDNS.createBrowser(MDNS.tcp('http'));
    let found = false;
    browser.on('serviceUp', (service) => {
      const { name } = service;
      if (!found && name !== undefined && name.indexOf('EMS_Device') > -1) {
        found = true;
        done();
      }
    });
    browser.start();
  });
});
