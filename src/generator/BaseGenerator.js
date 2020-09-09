const SystemEvent = require('../event/Event');
const { getStatusStamp } = require('./GeneratorStatus');
const BaseRoutine = require('../routine/BaseRoutine');

class BaseGenerator extends BaseRoutine {
  constructor({
    name,
    config,
    logger,
    store,
    eventListener,
    onGenerate,
}) {
    super({ name });

    this.config = config;
    this.logger = logger;
    this.store = store;
    this.eventListener = eventListener;
    this.onGenerate = onGenerate;

    this.generate = this.generate.bind(this);
    this.doRoutine = this.doRoutine.bind(this);
    this.sendGeneratorActiveStateEvent = this.sendGeneratorActiveStateEvent.bind(this);
  }

  get generationPeriodInMs() {
    throw new Error('should be overridden')
  }

  get activeGeneratorEventType() {
    throw new Error('should be overridden')
  }

  get isActiveGeneratorEventType() {
    throw new Error('should be overridden')
  }

  start() {
    this.subscribeOnEvents();

    this.doRoutine();

    this.intervalId = setInterval(this.doRoutine, this.generationPeriodInMs);

    this.logger.info(`[${this.name}]: started`);
  }

  stop() {
    this.unsubscribeFromEvents();

    clearInterval(this.intervalId);

    this.intervalId = null;

    this.logger.info(`[${this.name}]: stopped`);
  }

  doRoutine() {
    const generateResult = this.generate();

    this.setGeneratorActiveState();

    if (typeof this.onGenerate === 'function') {
      this.onGenerate(generateResult);
    }
  }

  generate() {
    throw new Error('should be overridden')
  }

  subscribeOnEvents() {
    this.eventListener.subscribe(this.isActiveGeneratorEventType, this.sendGeneratorActiveStateEvent);
  }

  unsubscribeFromEvents() {
    this.eventListener.unsubscribe(this.sendGeneratorActiveStateEvent);
  }

  setGeneratorActiveState() {
    this.store.set(this.activeGeneratorEventType, this.getActiveEventData(), 'PX', this.generationPeriodInMs);
  }

  sendGeneratorActiveStateEvent() {
    this.eventListener.dispatchEvent(new SystemEvent({
      type: this.activeGeneratorEventType,
      data: this.getActiveEventData(),
    }));
  }

  getActiveEventData() {
    return getStatusStamp();
  }
}

module.exports = BaseGenerator;
