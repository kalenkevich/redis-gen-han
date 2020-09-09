const { getConfig } = require('./config');
const PinoLogger = require('./logger/PinoLogger');
const RedisStore = require('./store/RedisStoreWithPubSub');
const { generateSystemRoutineWithScheduledStart } = require('./utils');

/**
 * This method init and start one routine.
 **/
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

  process.on('exit', (code) => {
    routine1.stop();
    logger.info('Process exit event with code: ', code);
  });
};

start();
