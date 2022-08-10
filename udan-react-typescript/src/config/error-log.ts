/*
const log4js: any = require('log4js');
// import { CONFIG } from './index';
import {UDAUserAuthData} from '../modules/authData';

export const UDALog4jsLogger = log4js.getLogger();
UDALog4jsLogger.level = 'debug'; // log4js.Level.OFF; // do not change this loglevel for performance reasons
// let UDAAjaxAppender = new log4js.AjaxAppender(CONFIG.UDA_DOMAIN+'/logging/error');
// UDAAjaxAppender.setLayout(new Log4js.JSONLayout());
// UDALog4jsLogger.addAppender(UDAAjaxAppender);

export const UDALogLevel = 0;

export const UDAConsoleLogger = {
  info: function(mes: any, level = 1) {
    if (UDALogLevel === level) {
      console.log(mes);
    }
  },
};

export const UDAErrorLogger = {
  error: function(message: any, exception: any) {
    message = 'UserID: ' + UDAUserAuthData.id + ' Error: ' + message;
    UDALog4jsLogger.error(message, exception);
  },
};
*/


const winston = require('winston');
const { format } = winston;
const { combine, label, json } = format;
// const winstonRemoteTransport = require('winston-remote').Transport;
import {UDAUserAuthData} from '../modules/authData';
import { CONFIG } from '../config';

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
  info: function(mes: any, level = 1) {
    if (UDALogLevel === level) {
      console.log(mes);
    }
  }
};

export const UDAErrorLogger = {
  error: function (message: any, exception: any = {message:"Error"}) {
    message = 'UserID: ' + UDAUserAuthData.id + ' Error: ' + message;
    //const errorLog = winston.loggers.get('error');
    //errorLog.info(message +"\n"+ exception);
    //winston.log('info', 'Hello distributed log files!');
    // console.log(errorLog)
    let logger = winston.createLogger({
      transports: [
        new winston.transports.Http({
            ssl:false,
            host: 'localhost', // Remote server ip
            port: 3000 // Remote server port
        })
    ]
    });

    logger.log('info', 'Hello distributed log files!');
  }
};