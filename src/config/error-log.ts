import { LogService } from '../services/logger';

export const UDALogLevel = 0;

export const UDAConsoleLogger = {
  info: function (mes: any, level = 1) {
    // if (UDALogLevel === level) {
      LogService.info(mes, { level });
    // }
  },
};

export const UDAErrorLogger = {
  error: function (message: any, exception: any = { message: "Error" }) {
    LogService.error(message, {
      exception,
      stack: exception?.stack,
    });
  },
};
