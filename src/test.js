const { getConfig } = require('./config');
const ConsoleLogger = require('./logger/ConsoleLogger');
const MemoryStoreWithPubSub = require('./store/MemoryStoreWithPubSub');
const { generateSystemRoutineWithScheduledStart, stopRoutineAfter } = require('./utils');

/**
 * This method init and start series of routines.
 * As a store here is used MemoryStore for testing/debug purpose.
 **/
const test = () => {
  const config = getConfig();
  const logger = new ConsoleLogger({ config });
  const memoryStore = new MemoryStoreWithPubSub({ config, logger });
  const routineParams = {
    config,
    logger,
    store: memoryStore,
    pubSub: memoryStore,
  };

  const routine1 = generateSystemRoutineWithScheduledStart(routineParams);
  const routine2 = generateSystemRoutineWithScheduledStart(routineParams, 200);
  const routine3 = generateSystemRoutineWithScheduledStart(routineParams, 400);
  const routine4 = generateSystemRoutineWithScheduledStart(routineParams, 500);
  const routine5 = generateSystemRoutineWithScheduledStart(routineParams, 600);

  stopRoutineAfter(routine1, 20000);
  stopRoutineAfter(routine2, 35000);
  stopRoutineAfter(routine4, 48000);
  stopRoutineAfter(routine5, 48000);

  process.on('exit', (code) => {
    routine1.stop();
    routine2.stop();
    routine3.stop();
    routine4.stop();
    routine5.stop();

    logger.info('Process exit event with code: ', code);
  });
};

test();
