class BaseStoreWithPubSub {
  constructor({ config, logger }) {
    this.config = config;
    this.logger = logger;
  }

  get() {
    throw new Error('should be overridden');
  }

  set() {
    throw new Error('should be overridden');
  }

  getset() {
    throw new Error('should be overridden');
  }

  increment() {
    throw new Error('should be overridden');
  }

  publish() {
    throw new Error('should be overridden');
  }

  onMessage() {
    throw new Error('should be overridden');
  }
}

module.exports = BaseStoreWithPubSub;
