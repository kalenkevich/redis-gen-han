###### **About**:
This is repo is about routines (processes) which can generate numbers or handle them.
This routines use one shared store. 

###### Run/Test/Debug
To start process run `index.js`.

For debug/test purposes you can run `test.js`. 

To see the demo inside one machine please run `demo.js`.

###### Configuration
You can configure next params:
 - `SYSTEM_CHANNEL_NAME`: name of the common channel between processes. Default is `SYSTEM_CHANNEL`
 - `REDIS_CONNECTION_STRING`: connection string for redis. Default is `redis://127.0.0.1:6379/0`
 - `GENERATION_PERIOD_IN_MS`: time period for number generator. Default is `8000`
 - `MAX_PERIOD_BETWEEN_GENERATIONS_IN_MS`: max period between generations. If this period is reached process will try to switch into generation mode. Default is `10000`
 - `MAX_INTEGER_TO_GENERATE`: max limit of number to generate by generator. Default is `10`. 
 - `STORE_ERROR_RECORD_NAME`: key for store to handle error records. Default is `STORE_ERROR_RECORD_NAME`
 - `STORE_SUCCESS_RECORD_NAME`: key for store to handle success records. Default is `STORE_SUCCESS_RECORD_NAME`,

Example:
`node ./src/index.js --GENERATION_PERIOD_IN_MS 1000`
