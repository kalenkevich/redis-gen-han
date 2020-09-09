class BaseRoutine {
  start() {
    throw new Error('should be overridden');
  }

  doRoutine() {
    throw new Error('should be overridden');
  }

  stop() {
    throw new Error('should be overridden');
  }
}

module.exports = BaseRoutine;
