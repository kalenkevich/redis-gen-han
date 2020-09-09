const { getConfig } = require('./config');
const PinoLogger = require('./logger/PinoLogger');
const RedisStore = require('./store/RedisStoreWithPubSub');
const { generateSystemRoutineWithScheduledStart } = require('./utils');

const start = () => {
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

  process.on('exit', (code) => {
    routine1.stop();
    routine2.stop();
    routine3.stop();
    routine4.stop();
    routine5.stop();

    logger.info('Process exit event with code: ', code);
  });
};

start();
