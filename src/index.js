const { getConfig } = require('./config');
const PinoLogger = require('./logger/PinoLogger');
const RedisStore = require('./store/RedisStoreWithPubSub');
const MemoryStore = require('./store/MemoryStoreWithPubSub');
const SystemRoutine = require('./routine/SystemRoutine');

const start = () => {
  const config = getConfig();
  const logger = new PinoLogger({ config });
  const redisStore = new RedisStore({ config, logger });
  const routine = new SystemRoutine({
    config,
    logger,
    store: redisStore,
    pubSub: redisStore,
  });

  routine.start();

  process.on('exit', (code) => {
    routine.stop();

    logger.info('Process exit event with code: ', code);
  });
};

const testStart = () => {
  const config = getConfig();
  const logger = new PinoLogger({ config });
  const memoryStore = new MemoryStore({ config, logger });

  const routine1 = new SystemRoutine({
    config,
    logger,
    store: memoryStore,
    pubSub: memoryStore,
  });

  setTimeout(() => {
    const routine2 = new SystemRoutine({
      config,
      logger,
      store: memoryStore,
      pubSub: memoryStore,
    });

    routine2.start();
  }, 200);

  routine1.start();

  process.on('exit', (code) => {
    routine1.stop();
    routine2.stop();

    logger.info('Process exit event with code: ', code);
  });
};

// start();

testStart();
