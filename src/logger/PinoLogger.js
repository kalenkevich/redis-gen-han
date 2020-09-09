const pino = require('pino');
const BaseLogger = require('./BaseLogger');

class PinoLogger extends BaseLogger {
  constructor({ config }) {
    super({ config });

    this.logger = pino();
  }

  trace(...args) {
    this.logger.trace(...args);
  }

  debug(...args) {
    this.logger.debug(...args);
  }

  info(...args) {
    this.logger.info(...args);
  }

  warn(...args) {
    this.logger.warn(...args);
  }

  error(...args) {
    this.logger.error(...args);
  }
}

module.exports = PinoLogger;
