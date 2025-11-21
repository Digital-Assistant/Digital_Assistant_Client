import {CONFIG} from "../../config";
import {StorageUtil} from "../storage";
import * as winston from "winston";

// Note: Avoid importing/instantiating custom/remote transports during tests to prevent constructor issues
const { format } = winston;


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
      // Ensure string concatenation semantics match native JS coercion
      const userId = UDAUserAuthData?.authdata?.id;
      if (userId) {
        message = "UserID: " + userId + " Error: " + String(message);
      } else {
        message = "Error: " + String(message);
      }
    } catch (e) {
      message = "Error: " + String(message);
    }
    const isTestEnv = process.env.NODE_ENV === 'test';

    // During tests, avoid constructing Http transport (mocked winston may not provide it)
    const transports: any[] = [];
    if (!isTestEnv && (winston as any).transports && (winston as any).transports.Http) {
      transports.push(
        new (winston as any).transports.Http({
          // ssl: true,
          host: UDA_LOG_URL, // Remote server ip
          port: 443, // Remote server port
          path: "logging/error",
        })
      );
    }

    let logger = winston.createLogger({
      transports,
    });

    logger.log("error", message);
  },
};
