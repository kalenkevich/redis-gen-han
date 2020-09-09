const parseEnvArgs = require('minimist');

const DefaultConfig = {
  SYSTEM_CHANNEL_NAME: 'SYSTEM_CHANNEL',
  REDIS_CONNECTION_STRING: 'redis://127.0.0.1:6379/0',
  GENERATION_PERIOD_IN_MS: 8000,
  MAX_PERIOD_BETWEEN_GENERATIONS_IN_MS: 10000,
  MAX_INTEGER_TO_GENERATE: 10,
  STORE_ERROR_RECORD_NAME: 'STORE_ERROR_RECORD_NAME',
  STORE_SUCCESS_RECORD_NAME: 'STORE_SUCCESS_RECORD_NAME',
};

const getConfig = () => {
  const envParams = parseEnvArgs(process.argv.slice(2));

  return {
    ...DefaultConfig,
    ...envParams,
  };
};

module.exports = {
  DefaultConfig,
  getConfig,
};
