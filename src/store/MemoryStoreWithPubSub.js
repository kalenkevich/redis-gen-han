const BaseStoreWithPubSub = require('./BaseStoreWithPubSub');

class MemoryStoreWithPubSub extends BaseStoreWithPubSub {
  constructor(...args) {
    super(...args);

    this.store = {};
    this.subscribes = [];
  }

  get(key) {
    return new Promise(resolve => {
      const value = this.store[key];

      resolve(value || null);
    });
  }

  getset(key, value, expireFlag, expireTime) {
    return new Promise(resolve => {
      if (expireFlag === 'PX') {
        setTimeout(() => {
          this.store[key] = null;

          this.debugStore();
        }, expireTime);
      }

      const value = this.store[key];
      this.store[key] = value;

      this.debugStore();

      resolve(value || null);
    });
  }

  set(key, value, expireFlag, expireTime) {
    if (expireFlag === 'PX') {
      setTimeout(() => {
        this.store[key] = null;

        this.debugStore();
      }, expireTime);
    }

    return new Promise(resolve => {
      this.store[key] = value;

      this.debugStore();

      resolve('OK');
    });
  }

  increment(key) {
    return new Promise(resolve => {
      if (typeof this.store[key] === 'number') {
        const newValue = this.store[key]++;

        this.debugStore();

        resolve(newValue);
      }

      // TODO: check, not sure
      resolve(null);
    });
  }

  publish(channel, data) {
    this.subscribes.forEach(subscriber => subscriber(channel, data));
  }

  onMessage(subscriber) {
    this.subscribes.push(subscriber);
  }

  debugStore() {
    this.logger.debug(this.store);
  }
}

module.exports = MemoryStoreWithPubSub;
