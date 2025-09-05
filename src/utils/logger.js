export class Logger {
  static levels = { error: 0, warn: 1, info: 2, log: 3 };
  static level = "info";

  static setLevel(level) {
    if (level in Logger.levels) Logger.level = level;
  }
  static #should(method) {
    return Logger.levels[method] <= Logger.levels[Logger.level];
  }
  static info(...args) {
    if (Logger.#should("info")) console.info(...args);
  }
  static warn(...args) {
    if (Logger.#should("warn")) console.warn(...args);
  }
  static error(...args) {
    if (Logger.#should("error")) console.error(...args);
  }
  static log(...args) {
    if (Logger.#should("log")) console.log(...args);
  }
}
