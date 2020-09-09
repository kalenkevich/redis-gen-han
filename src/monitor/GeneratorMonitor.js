const { EventTypes } = require('../event/Event');
const BaseMonitor = require('./BaseMonitor');

class GeneratorMonitor extends BaseMonitor {
  get eventTypeToMonitor() {
    return EventTypes.GENERATE_INTEGER;
  }

  get getEventToMonitorMaxLimitInMS() {
    return this.config.MAX_PERIOD_BETWEEN_GENERATIONS_IN_MS;
  }
}

module.exports = GeneratorMonitor;

