export default class Simulator {
  private static instance: Simulator;

  private log = '';

  public static getInstance(): Simulator {
    if (!Simulator.instance) {
      Simulator.instance = new Simulator();
    }

    return Simulator.instance;
  }

  public print(callback: (content: string) => void) {
    const d = new Date();
    const hr = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours();
    const min = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
    const sec = d.getSeconds() < 10 ? `0${d.getSeconds()}` : d.getSeconds();

    let str = `${hr}:${min}:${sec} - TEST`;

    str += '\n';
    this.log += str;
    callback(this.log);
  }
}
