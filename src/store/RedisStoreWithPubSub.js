const IORedis = require('ioredis');
const BaseStoreWithPubSub = require('./BaseStoreWithPubSub');

class RedisStoreWithPubSub extends BaseStoreWithPubSub {
  constructor({ config, logger }) {
    super({ config, logger });

    this.redis = new IORedis(config.REDIS_CONNECTION_STRING);
  }

  async get(key) {
    const stringValue = await this.redis.get(key);

    return this.safeParseJSON(stringValue);
  }

  set(key, value, ...rest) {
    const stringifiedValue = JSON.stringify(value);

    return this.redis.set(key, stringifiedValue, ...rest);
  }

  increment(...args) {
    return this.redis.incr(...args);
  }

  publish(channel, value) {
    const stringifiedValue = JSON.stringify(value);

    return this.redis.publish(channel, stringifiedValue);
  }

  onMessage(handler) {
    const internalMessageHandler = (channel, dataAsString) => {
      const eventData = this.safeParseJSON(dataAsString);

      return handler(channel, eventData);
    };

    return this.redis.on("message", internalMessageHandler);
  }

  safeParseJSON(stringValue) {
    if (stringValue === '') {
      return null;
    }

    if (typeof stringValue !== 'undefined') {
      return JSON.parse(stringValue);
    }

    return null;
  }
}

module.exports = RedisStoreWithPubSub;
