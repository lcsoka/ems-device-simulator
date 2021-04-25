import MDNS, { Advertisement } from 'mdns';

export default class MdnsService {
  public static instance: MdnsService;

  private advertisement!: Advertisement;

  private started = false;

  public static getInstance() {
    if (!MdnsService.instance) {
      MdnsService.instance = new MdnsService();
    }
    return MdnsService.instance;
  }

  public start() {
    if (this.started) {
      return;
    }
    this.advertisement = MDNS.createAdvertisement(MDNS.tcp('http'), 80, {
      name: 'EMS_Device',
    });
    this.advertisement.start();
    this.started = true;
  }

  public stop() {
    this.advertisement.stop();
    this.started = false;
  }

}
