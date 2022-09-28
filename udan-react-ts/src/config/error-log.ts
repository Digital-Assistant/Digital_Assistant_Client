const winston = require("winston");
const { format } = winston;
const { combine, label, json } = format;
// const winstonRemoteTransport = require('winston-remote').Transport;
import { CONFIG } from "./index";
import { getFromStore } from "../util";

export const UDALogLevel = 0;

/*winston.loggers.add('error', {
  format: combine(
    label({ label: 'error log' }),
    json()
  ),
  transports: [
    new winston.transports.Http({ host: 'http://localhost', port: 3000})
  ]
});



winston.loggers.add('info', {
  format: combine(
    label({ label: 'info log' }),
    json()
  ),
  transports: [
    // new winston.transports.Http({ host: CONFIG.UDA_DOMAIN+'/logging/info'})
    new winston.transports.Http({ host: 'http://localhost', port: 3000})
  ]
});*/

export const UDAConsoleLogger = {
  info: function (mes: any, level = 1) {
    if (UDALogLevel === level) {
      console.log(mes);
    }
  },
};

export const UDAErrorLogger = {
  error: function (message: any, exception: any = { message: "Error" }) {
    const UDAUserAuthData = getFromStore(CONFIG.USER_AUTH_DATA_KEY, false);

    message = "UserID: " + UDAUserAuthData?.authdata?.id + " Error: " + message;
    let logger = winston.createLogger({
      transports: [
        new winston.transports.Http({
          ssl: true,
          host: "localhost", // Remote server ip
          port: 3000, // Remote server port
        }),
      ],
    });

    logger.log("error", message);
  },
};
