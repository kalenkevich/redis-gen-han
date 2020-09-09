const { v4: uuidv4 } = require('uuid');
const SystemRoutine = require('./routine/SystemRoutine');

const generateSystemRoutineAfter = (routineParams, timeoutInMS = 0) => {
  return new Promise(resolve => {
    const extendedRoutineParams = {
      ...routineParams,
      name: generateRoutineName(),
    };
    const newRoutine = new SystemRoutine(extendedRoutineParams);

    setTimeout(() => resolve(newRoutine), timeoutInMS)
  });
};

const generateSystemRoutineWithScheduledStart = (routineParams, timeoutInMS = 0, onStart = () => {}) => {
  const extendedRoutineParams = {
    ...routineParams,
    name: generateRoutineName(),
  };
  const newRoutine = new SystemRoutine(extendedRoutineParams);

  setTimeout(() => {
    newRoutine.start();

    onStart(newRoutine);
  }, timeoutInMS);

  return newRoutine;
};

const stopRoutineAfter = (routine, timeoutInMS, onStop = () => {}) => {
  setTimeout(() => {
    routine.stop();

    onStop(routine);
  }, timeoutInMS);
};

const generateRoutineName = () => uuidv4();

module.exports = {
  generateRoutineName,
  generateSystemRoutineAfter,
  generateSystemRoutineWithScheduledStart,
  stopRoutineAfter,
};
