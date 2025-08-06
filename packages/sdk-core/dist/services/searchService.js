"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSpecialNodes = exports.fetchRecord = exports.fetchSearchResults = void 0;
var endpoints_1 = require("../config/endpoints");
var _1 = require(".");
var specialNodes_1 = require("../util/specialNodes");
var userService_1 = require("./userService");
var fetchSearchResults = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fetch('/api/search', {
                    method: 'POST',
                    body: JSON.stringify(params),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.json()];
        }
    });
}); };
exports.fetchSearchResults = fetchSearchResults;
var fetchRecord = function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, parameters, url, error_1, errorMessage;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                if (!request) {
                    throw new Error("Request is undefined");
                }
                if (!(request.additionalParams === null)) return [3 /*break*/, 1];
                delete request.additionalParams;
                return [3 /*break*/, 3];
            case 1:
                // If additionalParams is present, add the userSessionId to the request object
                _a = request;
                return [4 /*yield*/, (0, userService_1.getUserId)()];
            case 2:
                // If additionalParams is present, add the userSessionId to the request object
                _a.userSessionId = _b.sent();
                _b.label = 3;
            case 3:
                parameters = void 0;
                url = endpoints_1.ENDPOINT.fetchRecord;
                // Determine which endpoint to use based on whether additionalParams is present
                if (request.additionalParams != null) {
                    url += "/withPermissions";
                }
                // Construct the full URL by appending the id and domain to the endpoint URL
                url += "/" + request.id + "?domain=" + request.domain;
                // If additionalParams is present, append it to the URL
                if (request.additionalParams != null) {
                    url +=
                        "&additionalParams=" +
                            request.additionalParams +
                            "&userSessionId=" +
                            request.userSessionId;
                }
                // Construct the API call parameters
                parameters = {
                    url: url,
                    method: "GET",
                };
                return [4 /*yield*/, _1.REST.apiCal(parameters)];
            case 4:
            // Make the API call and return the result
            return [2 /*return*/, _b.sent()];
            case 5:
                error_1 = _b.sent();
                errorMessage = error_1 instanceof Error ? error_1.message : 'Unknown search error';
                console.error("Error fetching record:", error_1);
                throw new Error("Failed to fetch record: ".concat(errorMessage));
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.fetchRecord = fetchRecord;
var fetchSpecialNodes = function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var parameters, errorMessage;
    return __generator(this, function (_a) {
        try {
            parameters = {
                url: _1.REST.processArgs(endpoints_1.ENDPOINT.SpecialNodes, request),
                method: "GET",
            };
            return [2 /*return*/, specialNodes_1.specialNodes];
        }
        catch (error) {
            errorMessage = error instanceof Error ? error.message : 'Unknown search error';
            console.error("Error fetching special nodes:", error);
            throw new Error("Failed to fetch special nodes: ".concat(errorMessage));
        }
        return [2 /*return*/];
    });
}); };
exports.fetchSpecialNodes = fetchSpecialNodes;
