const EventTypes = {
  GENERATE_INTEGER: 'GENERATE_INTEGER',
  IS_ACTIVE_NUMBER_GENERATOR: 'IS_ACTIVE_NUMBER_GENERATOR',
  ACTIVE_NUMBER_GENERATOR: 'ACTIVE_NUMBER_GENERATOR',
};

class SystemEvent {
  constructor({ type, data }) {
    this.type = type;
    this.data = data;
  }
}

module.exports = {
  EventTypes
};

module.exports.default = SystemEvent;
