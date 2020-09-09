const BaseRoutine = require('../routine/BaseRoutine');

class BaseHandler extends BaseRoutine {
  constructor({ name, config, eventListener, logger, store }) {
    super({ name });

    this.config = config;
    this.logger = logger;
    this.store = store;
    this.eventListener = eventListener;

    this.isLockedState = false;

    this.handle = this.handle.bind(this);
  }

  lock() {
    this.isLockedState = true;
  }

  unlock() {
    this.isLockedState = false;
  }

  isLocked() {
    return this.isLockedState;
  }

  get eventToHandle() {
    throw new Error('should be overridden')
  }

  doRoutine() {}

  start() {
    this.subscribeOnEvents();
  }

  stop() {
    this.unsubscribeFromEvents();
  }

  subscribeOnEvents() {
    this.eventListener.subscribe(this.eventToHandle, this.handle);
  }

  unsubscribeFromEvents() {
    this.eventListener.unsubscribe(this.handle);
  }

  handle() {
    throw new Error('should be overridden')
  }
}

module.exports = BaseHandler;
