const { EventTypes } = require('../event/Event');
const BaseRoutine = require('./BaseRoutine');
const EventListener = require('../event/EventListener');
const NumberGenerator = require('../generator/NumberGenerator');
const NumberHandler = require('../handler/NumberHandler');
const GeneratorMonitor = require('../monitor/GeneratorMonitor');

class SystemRoutine extends BaseRoutine {
  constructor({ config, logger, store, pubSub, name }) {
    super({ name });

    this.config = config;
    this.logger = logger;
    this.store = store;
    this.pubSub = pubSub;
    this.routine = null;
    this.makeGeneratorAsRoutine = this.makeGeneratorAsRoutine.bind(this);

    const eventListener = new EventListener({ config, logger, pubSub });

    this.numberGenerator = new NumberGenerator({
      name: `${name} NumberGenerator`,
      config,
      logger,
      store,
      eventListener,
    });
    this.numberHandler = new NumberHandler({
      name: `${name} NumberHandler`,
      config,
      logger,
      store,
      eventListener,
    });
    this.generatorMonitor = new GeneratorMonitor({
      name: `${name} GeneratorMonitor`,
      config,
      logger,
      eventListener,
      onMaxPeriodLimitReached: this.makeGeneratorAsRoutine,
    });
  }

  start() {
    this.routine = this.numberHandler;
    this.routine.start();
    this.generatorMonitor.start();
  }

  stop() {
    this.routine.stop();
    this.generatorMonitor.stop();
  }

  async makeGeneratorAsRoutine() {
    const result = await this.store.get(EventTypes.ACTIVE_NUMBER_GENERATOR);

    if (result && result.status === 'ACTIVE') {
      this.logger.info(`routine: ${this.name} - skip promoting number generator as a routine as generator already exit`);

      return;
    }

    this.routine.stop();
    this.routine = this.numberGenerator;
    this.routine.start();

    this.logger.info(`routine: ${this.name} - promoting current routine as number generator`);
  }

  doRoutine() {}
}

module.exports = SystemRoutine;
