const { EventTypes } = require('../event/Event');
const { getStatusStamp } = require('../handler/HandlerStatus');
const BaseGenerator = require('./BaseGenerator');

class NumberGenerator extends BaseGenerator {
  get generationPeriodInMs() {
    return this.config.GENERATION_PERIOD_IN_MS;
  }

  get generationEventType() {
    return EventTypes.GENERATE_INTEGER;
  }

  get activeGeneratorEventType() {
    return EventTypes.ACTIVE_NUMBER_GENERATOR;
  }

  get isActiveGeneratorEventType() {
    return EventTypes.IS_ACTIVE_NUMBER_GENERATOR;
  }

  generate() {
    const generatedNumber = Math.floor(Math.random() * Math.floor(this.config.MAX_INTEGER_TO_GENERATE));

    this.logger.info(`[${this.name}]: generated new number: ${generatedNumber}`);

    const timestamp = Date.now();

    const eventData = {
      type: this.generationEventType,
      data: generatedNumber,
      timestamp,
    };

    this.store.set(this.generationEventType, getStatusStamp(), 'PX', this.generationPeriodInMs).then(() => {
      this.eventListener.dispatchEvent(eventData);
    });

    return {
      status: 'OK',
      data: generatedNumber,
    };
  }
}

module.exports = NumberGenerator;
