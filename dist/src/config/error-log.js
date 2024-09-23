const winston = require("winston");
const { format } = winston;
const { combine, label, json } = format;
// const winstonRemoteTransport = require('winston-remote').Transport;
import { CONFIG } from "./index";
import { getFromStore } from "../util";
export const UDALogLevel = 0;
const UDA_LOG_URL = "udantest.nistapp.ai";
export const UDAConsoleLogger = {
    info: function (mes, level = 1) {
        if (UDALogLevel >= level) {
            console.log(mes);
        }
    },
};
export const UDAErrorLogger = {
    error: function (message, exception = { message: "Error" }) {
        var _a;
        try {
            const UDAUserAuthData = getFromStore(CONFIG.USER_AUTH_DATA_KEY, false);
            message =
                "UserID: " + ((_a = UDAUserAuthData === null || UDAUserAuthData === void 0 ? void 0 : UDAUserAuthData.authdata) === null || _a === void 0 ? void 0 : _a.id) + " Error: " + message;
        }
        catch (e) { }
        let logger = winston.createLogger({
            transports: [
                new winston.transports.Http({
                    // ssl: true,
                    host: UDA_LOG_URL,
                    port: 443,
                    path: "logging/error",
                }),
            ],
        });
        logger.log("error", message);
    },
};
//# sourceMappingURL=error-log.js.map