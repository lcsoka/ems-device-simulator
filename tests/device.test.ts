import { expect } from 'chai';
import Device from '../src/ems/device';

describe('EMS Device', () => {
  let device: Device;

  beforeEach(() => {
    device = new Device('1234');
  });

  it('should get created', () => {
    expect(device).to.be.a('object');
  });

  it('should have correct initial values', () => {
    const json = device.toJSON();
    expect(json.serial).to.be.equal('1234');
    expect(json.battery).to.be.equal(100);
    expect(json.connected).to.be.equal(false);
    expect(json.elapsed).to.be.equal(0);
    expect(json.version).to.be.equal('1.0');
  });

  it('should set connected status after connect', () => {
    device.connect();
    expect(device.toJSON().connected).to.be.equal(true);
  });

  it('should set channel value correctly', () => {
    device.setChannelValue(0, 55);
    device.setChannelValue(1, -55);
    device.setChannelValue(2, 200);
    device.setChannelValue(999, -100);
    const values = device.getValues();
    expect(values.channels[0].value).to.be.equal(55);
    expect(values.channels[1].value).to.be.equal(0);
    expect(values.channels[2].value).to.be.equal(100);
    expect(values.channels[999]).not.to.be.a('object');
  });

  it('should set connected status after disconnect', () => {
    device.disconnect();
    expect(device.toJSON().connected).to.be.equal(false);
  });
});
