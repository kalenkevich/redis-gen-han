const BaseRoutine = require('../routine/BaseRoutine');

class BaseMonitor extends BaseRoutine {
  constructor({ name, config, logger, eventListener, onMaxPeriodLimitReached }) {
    super({ name });

    this.config = config;
    this.logger = logger;
    this.eventListener = eventListener;
    this.onMaxPeriodLimitReached = onMaxPeriodLimitReached;

    this.lastEventTimestamp = Date.now();
    this.timeoutId = null;
    this.maxPeriodLimitReachHandler = this.maxPeriodLimitReachHandler.bind(this);
    this.eventHandler = this.eventHandler.bind(this);
  }

  start() {
    this.eventListener.subscribe(this.eventTypeToMonitor, this.eventHandler);
    this.setupTimeoutToHandleMaxPeriodLimit();
  }

  stop() {
    this.eventListener.unsubscribe(this.eventHandler);
    this.clearTimeoutToHandleMaxPeriodLimit();
  }

  doRoutine(...args) {
    this.monitor(...args);
  }

  get eventTypeToMonitor() {
    throw new Error('should be overridden');
  }

  get getEventToMonitorMaxLimitInMS() {
    throw new Error('should be overridden');
  }

  setupTimeoutToHandleMaxPeriodLimit() {
    this.timeoutId = setTimeout(this.maxPeriodLimitReachHandler, this.getEventToMonitorMaxLimitInMS);
  }

  clearTimeoutToHandleMaxPeriodLimit() {
    clearTimeout(this.timeoutId);

    this.timeoutId = null;
  }

  maxPeriodLimitReachHandler() {
    this.logger.info(`[BaseMonitor.monitor] for eventType: ${this.eventTypeToMonitor} max limit for ${this.getEventToMonitorMaxLimitInMS} was reached`);

    this.onMaxPeriodLimitReached();
    this.setupTimeoutToHandleMaxPeriodLimit();
  }

  eventHandler(event) {
    const currentEventTimestamp = Date.now();
    const lastEventTimestamp = this.lastEventTimestamp;
    this.lastEventTimestamp = currentEventTimestamp;

    this.clearTimeoutToHandleMaxPeriodLimit();
    this.setupTimeoutToHandleMaxPeriodLimit();

    this.doRoutine({
      event,
      startTimestamp: lastEventTimestamp,
      endTimestamp: currentEventTimestamp,
    });
  }

  monitor({ event, startTimestamp, endTimestamp }) {
    this.logger.info(`[BaseMonitor.monitor] next eventType: ${event.type} was publish after ${endTimestamp - startTimestamp} ms`);
  }
}

module.exports = BaseMonitor;
