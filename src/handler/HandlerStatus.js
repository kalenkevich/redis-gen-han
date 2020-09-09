const HandlerStatus = {
  NOT_HANDLED: 'NOT_HANDLED',
  IN_PROGRESS: 'IN_PROGRESS',
  HANDLED: 'HANDLED',
};

const getStatusStamp = (status = HandlerStatus.NOT_HANDLED) => ({
  status,
  timestamp: Date.now(),
});

module.exports = {
  getStatusStamp,
  HandlerStatus,
};
