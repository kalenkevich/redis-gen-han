const GeneratorStatus = {
  ACTIVE: 'ACTIVE',
};

const getStatusStamp = (status = GeneratorStatus.ACTIVE) => ({
  status,
  timestamp: Date.now(),
});

module.exports = {
  getStatusStamp,
  GeneratorStatus,
};
