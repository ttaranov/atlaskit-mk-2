//@flow

export default class DelayedFunction {
  delay: number;
  timeoutId: ?TimeoutID = null;
  fn: ?Function;

  constructor(delay: number) {
    this.delay = delay;
  }

  start(fn: Function) {
    this.stop();
    this.timeoutId = setTimeout(fn, this.delay);
  }

  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
