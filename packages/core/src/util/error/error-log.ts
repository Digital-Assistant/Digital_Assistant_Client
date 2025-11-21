import {CONFIG} from "../../config";
import {StorageUtil} from "../storage";
import * as winston from "winston";

const { format } = winston;
const { combine, label, json } = format;
const winstonRemoteTransport = require('winston-remote').Transport;


export const UDALogLevel = 3;

const UDA_LOG_URL = process.env.tokenUrl;

export const UDAConsoleLogger = {
  info: function (mes: any, level = 1) {
    if (UDALogLevel === level) {
      console.log(mes);
    }
  },
};

export const UDAErrorLogger = {
  error: async function (message: any, exception: any = { message: "Error" }) {
    try {
      const UDAUserAuthData: any = await StorageUtil.get(CONFIG.USER_AUTH_DATA_KEY, false);
      message =
        "UserID: " + UDAUserAuthData?.authdata?.id + " Error: " + message;
    } catch (e) {
      message = "Error: " + message;
    }
    let logger = winston.createLogger({
      transports: [
        new winston.transports.Http({
          // ssl: true,
          host: UDA_LOG_URL, // Remote server ip
          port: 443, // Remote server port
          path: "logging/error",
        }),
      ],
    });

    logger.log("error", message);
  },
};
