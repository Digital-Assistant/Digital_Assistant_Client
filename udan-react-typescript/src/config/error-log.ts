import log4js from 'log4js';
import { CONFIG } from './index';

export const UDALog4jsLogger = log4js.getLogger();
UDALog4jsLogger.level = 'debug'; //log4js.Level.OFF; // do not change this loglevel for performance reasons
// let UDAAjaxAppender = new log4js.AjaxAppender(CONFIG.UDA_DOMAIN+'/logging/error');
// UDAAjaxAppender.setLayout(new Log4js.JSONLayout());
// UDALog4jsLogger.addAppender(UDAAjaxAppender);

export const UDAUserAuthData:any = { id: null, email: null, restrict_add_delete: false, role: 'default', permissions: null };

export const UDALogLevel = 0;

export const UDAConsoleLogger = {
    info: function(mes:any, level = 1) {
        if(UDALogLevel === level) {
            console.log(mes);
        }
    }
};

export const UDAErrorLogger = {
    error: function (message:any, exception:any){
        message = 'UserID: '+ UDAUserAuthData.id+' Error: '+message;
        UDALog4jsLogger.error(message, exception);
    }
};