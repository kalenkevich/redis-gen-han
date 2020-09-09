const BaseLogger = require('./BaseLogger');

class ConsoleLogger extends BaseLogger {
  trace(...args) {
    console.trace(...args);
  }

  debug(...args) {
    console.debug(...args);
  }

  info(...args) {
    console.info(...args);
  }

  warn(...args) {
    console.warn(...args);
  }

  error(...args) {
    console.error(...args);
  }
}

module.exports = ConsoleLogger;
