class BaseLogger {
  constructor({ config }) {
    this.config = config;
  }

  trace(...args) {
    throw new Error('should be overridden');
  }

  debug(...args) {
    throw new Error('should be overridden');
  }

  info(...args) {
    throw new Error('should be overridden');
  }

  warn(...args) {
    throw new Error('should be overridden');
  }

  error(...args) {
    throw new Error('should be overridden');
  }
}

module.exports = BaseLogger;
