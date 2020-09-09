const SystemEvent = require('../event/Event');
const BaseRoutine = require('../routine/BaseRoutine');

class BaseGenerator extends BaseRoutine {
  constructor({
    config,
    logger,
    store,
    eventListener,
    onGenerate,
}) {
    super();

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
  }

  stop() {
    this.unsubscribeFromEvents();

    clearInterval(this.intervalId);

    this.intervalId = null;
  }

  doRoutine() {
    const generateResult = this.generate();

    this.setGeneratorActiveState(generateResult);

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

  setGeneratorActiveState(generateResult) {
    this.store.set(this.activeGeneratorEventType, this.getActiveEventData(generateResult), 'PX', this.generationPeriodInMs);
  }

  sendGeneratorActiveStateEvent() {
    this.eventListener.dispatchEvent(new SystemEvent({
      type: this.activeGeneratorEventType,
      data: this.getActiveEventData(),
    }));
  }

  getActiveEventData(generateResult) {
    return {
      routineId: process.getuid(),
      status: 'ACTIVE',
      data: generateResult,
    };
  }
}

module.exports = BaseGenerator;
