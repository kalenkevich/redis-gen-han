const { StoreRecordStatus } = require('../consts/StoreRecordStatus');
const { EventTypes } = require('../event/Event');
const BaseHandler = require('./BaseHandler');

class NumberHandler extends BaseHandler {
  get eventToHandle() {
    return EventTypes.GENERATE_INTEGER;
  }

  async handle(systemEvent) {
    if (this.isLocked()) {
      this.logger.warn(`[NumberHandler.handle] handler is locked`);

      return;
    }

    const generatedDataFromStore = await this.store.get(EventTypes.GENERATE_INTEGER);

    if (!generatedDataFromStore) {
      this.logger.warn(`[NumberHandler.handle] event ${systemEvent.type} record doesn't exist in a store. Record can be expired already`);

      return;
    }

    if (generatedDataFromStore.status !== StoreRecordStatus.NOT_HANDLED) {
      this.logger.warn(`[NumberHandler.handle] event ${systemEvent.type} handling or already handled by other handler`);

      return;
    }

    const generatedInteger = systemEvent.data;

    this.lock();
    await this.store.set(EventTypes.GENERATE_INTEGER, { ...generatedDataFromStore, status: StoreRecordStatus.IN_PROGRESS });

    if (this.isSuccessGeneration(generatedInteger)) {
      this.logger.info(`[NumberHandler.handle] get generated number: ${generatedInteger} <= 8, calling success callback`);

      await this.successHandler(systemEvent);
    } else {
      this.logger.info(`[NumberHandler.handle] get generated number: ${generatedInteger} > 8, calling error callback`);

      await this.errorHandler(systemEvent);
    }

    await this.store.set(EventTypes.GENERATE_INTEGER, { ...generatedDataFromStore, status: StoreRecordStatus.HANDLED });
    this.unlock();
  }

  isSuccessGeneration(generatedInteger) {
    return generatedInteger < 8;
  }

  async successHandler() {
    const value = await this.store.get(this.config.STORE_SUCCESS_RECORD_NAME);

    if (value === null) {
      await this.store.set(this.config.STORE_SUCCESS_RECORD_NAME, 1);

      this.logger.info(`[NumberHandler.successHandler] increment count of successfully handled generations: new value is 1`);
    } else {
      const newValue = await this.store.increment(this.config.STORE_SUCCESS_RECORD_NAME);

      this.logger.info(`[NumberHandler.successHandler] increment count of successfully handled generations: new value is ${newValue}`);
    }
  }

  async errorHandler(event) {
    const errorRecords = await this.store.get(this.config.STORE_ERROR_RECORD_NAME);
    const newErrorRecord = {
      type: event.type,
      data: event.data,
      handlerTimestamp: Date.now(),
      generatorTimestamp: event.timestamp,
    };

    if (errorRecords === null) {
      await this.store.set(this.config.STORE_ERROR_RECORD_NAME, [newErrorRecord]);
    } else {
      errorRecords.push(newErrorRecord);

      await this.store.set(this.config.STORE_ERROR_RECORD_NAME, errorRecords);
    }
  }
}

module.exports = NumberHandler;
