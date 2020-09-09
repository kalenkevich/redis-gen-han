const { getConfig } = require('./config');
const PinoLogger = require('./logger/PinoLogger');
const RedisStore = require('./store/RedisStoreWithPubSub');
const { generateSystemRoutineWithScheduledStart, stopRoutineAfter } = require('./utils');

/**
 * This method start and after some time stop series of routines (processes).
 * As a store here is used Redis.
 * For testing/debug purpose I recommend to use MemoryStore. (see test.js)
 **/
const demo = () => {
  const config = getConfig();
  const logger = new PinoLogger({ config });
  const redisStore = new RedisStore({ config, logger });
  const routineParams = {
    config,
    logger,
    store: redisStore,
    pubSub: redisStore,
  };

  const routine1 = generateSystemRoutineWithScheduledStart(routineParams);
  const routine2 = generateSystemRoutineWithScheduledStart(routineParams, 200);
  const routine3 = generateSystemRoutineWithScheduledStart(routineParams, 400);
  const routine4 = generateSystemRoutineWithScheduledStart(routineParams, 500);
  const routine5 = generateSystemRoutineWithScheduledStart(routineParams, 600);

  stopRoutineAfter(routine1, 20000);
  stopRoutineAfter(routine2, 35000);
  stopRoutineAfter(routine3, 45000);
  stopRoutineAfter(routine4, 52000);
  stopRoutineAfter(routine5, 54000, () => {
    process.exit();
  });
};

demo();
