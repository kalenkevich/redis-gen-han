class EventListener {
  constructor({ config, logger, pubSub, name }) {
    this.name = name;
    this.config = config;
    this.logger = logger;
    this.pubSub = pubSub;

    this.eventHandlers = [];

    this.handleEventByType = this.handleEventByType.bind(this);
    this.pubSub.onMessage(this.handleEventByType)
  }

  addEventListener(eventType, handler) {
    const isHandlerAlreadyExist = this.eventHandlers.some(eventListener => {
      const isEqualEventType = eventListener.eventType === eventType;
      const isEqualHandler = eventListener.handler === handler;

      return isEqualEventType && isEqualHandler;
    });

    if (isHandlerAlreadyExist) {
      this.logger.warn(`[${this.name}]: event listener with such eventType: ${eventType} and handler already exists`);

      return;
    }

    this.eventHandlers.push({ eventType, handler });

    this.logger.debug(`[${this.name}]: add event listener for eventType: ${eventType}`);
  }

  removeEventListener(handler) {
    const listener = this.eventHandlers.find(eventHandler => eventHandler.handler === handler);

    if (!listener) {
      this.logger.warn(`[${this.name}]: no such handlers to remove`);

      return;
    }

    this.eventHandlers = this.eventHandlers.filter(eventHandler => eventHandler.handler !== handler);

    this.logger.debug(`[${this.name}]: remove event listener for eventType: ${listener.eventType}`);
  }

  notifyListeners(event) {
    this.eventHandlers.forEach(eventListener => {
      if (eventListener.eventType === event.type) {
        eventListener.handler(event);
      }
    });
  }

  handleEventByType(channel, event) {
    if (channel !== this.config.SYSTEM_CHANNEL_NAME) {
      this.logger(`[${this.name}]: non ${this.config.SYSTEM_CHANNEL_NAME} channel`);

      return;
    }

    this.notifyListeners(event);
  }

  dispatchEvent(event) {
    return this.pubSub.publish(this.config.SYSTEM_CHANNEL_NAME, event);
  }

  subscribe(eventType, handler) {
    return this.addEventListener(eventType, handler);
  }

  unsubscribe(handler) {
    return this.removeEventListener(handler);
  }
}

module.exports = EventListener;
