import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter {
  constructor(
    private start: number = Date.now(),
    private current: number = Date.now(),
    private elapsed: number = 0,
    private delta: number = 16,
    private ticker?: number
  ) {
    super();


    this.tick = this.tick.bind(this);
    this.tick();
  }

  tick() {
    this.ticker = window.requestAnimationFrame(this.tick);

    const current = Date.now();

    this.delta = current - this.current;
    this.elapsed = current - this.start;
    this.current = current;

    if (this.delta > 60) {
      this.delta = 60;
    }

    this.trigger("tick");
  }

  /**
   * Stop
   */
  stop() {
    if (!this.ticker) return;
    window.cancelAnimationFrame(this.ticker);
  }
}
