import MDNS, { Advertisement } from 'mdns';

export default class MdnsService {
  public static instance: MdnsService;

  private advertisement: Advertisement;

  private started = false;

  constructor() {
    this.advertisement = MDNS.createAdvertisement(MDNS.tcp('http'), 80, {
      name: 'EMS_Device',
    });
  }

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

    if (this.advertisement) {
      this.advertisement.start();
      this.started = true;
    }
  }

}
