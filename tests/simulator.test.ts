import { expect } from 'chai';
import sinon from 'sinon';
import Simulator from '../src/ems/simulator';

describe('Simulator', () => {
  let simulator: Simulator;
  let clock: sinon.SinonFakeTimers;

  beforeEach(() => {
    simulator = new Simulator();
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  it('should save log in correct format', () => {
    simulator.print('TEST', (content) => {
      expect(content).to.be.equal('01:00:00 - TEST\n');
    });
  });
});
