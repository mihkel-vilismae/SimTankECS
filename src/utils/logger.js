/**
 * Minimal Logger wrapper — never call console directly in app code.
 * Usage: Logger.log(...), Logger.info(...), Logger.warn(...), Logger.error(...)
 */
export class Logger {
  static level = 0; // 0:log,1:info,2:warn,3:error
  static setLevel(lvl){ Logger.level = Math.max(0, Math.min(3, lvl|0)); }

  static log(...args){ if (Logger.level <= 0) console.log(...args); }
  static info(...args){ if (Logger.level <= 1) console.info(...args); }
  static warn(...args){ if (Logger.level <= 2) console.warn(...args); }
  static error(...args){ if (Logger.level <= 3) console.error(...args); }
}
