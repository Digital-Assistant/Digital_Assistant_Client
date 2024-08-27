var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
/***
 * Functionality for removing unwanted attributes from the node properties
 */
import { FrameWorkAttributesConfig } from "../config/FrameWorkAttributesConfig";
/**
 * Remove properties from the original node
 * @param node
 */
export const removeFrameWorkAttributes = (node) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c, _d, e_2, _e, _f, _g, e_3, _h, _j, _k, e_4, _l, _m, _o, e_5, _p, _q;
    console.log({ node });
    // cloning the node deeply to process it without effecting the original dom
    let copiedNode = node.cloneNode(true);
    try {
        // let copiedNode = node;
        for (var _r = true, FrameWorkAttributesConfig_1 = __asyncValues(FrameWorkAttributesConfig), FrameWorkAttributesConfig_1_1; FrameWorkAttributesConfig_1_1 = yield FrameWorkAttributesConfig_1.next(), _a = FrameWorkAttributesConfig_1_1.done, !_a;) {
            _c = FrameWorkAttributesConfig_1_1.value;
            _r = false;
            try {
                let frameWorkConfig = _c;
                try {
                    // deleting dom node properties
                    for (var _s = true, _t = (e_2 = void 0, __asyncValues(frameWorkConfig.list.domProperties)), _u; _u = yield _t.next(), _d = _u.done, !_d;) {
                        _f = _u.value;
                        _s = false;
                        try {
                            let ignoreProperty = _f;
                            if (copiedNode.hasOwnProperty(ignoreProperty)) {
                                delete copiedNode[ignoreProperty];
                            }
                        }
                        finally {
                            _s = true;
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (!_s && !_d && (_e = _t.return)) yield _e.call(_t);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                try {
                    // deleting dom node properties that start with specified property name
                    for (var _v = true, _w = (e_3 = void 0, __asyncValues(frameWorkConfig.list.domPropertiesStartsWith)), _x; _x = yield _w.next(), _g = _x.done, !_g;) {
                        _j = _x.value;
                        _v = false;
                        try {
                            let ignoreAttributeText = _j;
                            for (let key in copiedNode) {
                                if (key.indexOf(ignoreAttributeText) !== -1) {
                                    delete copiedNode[key];
                                }
                            }
                        }
                        finally {
                            _v = true;
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (!_v && !_g && (_h = _w.return)) yield _h.call(_w);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                // deleting attributes that are defined from element and from child elements
                // Get all the attributes on the element.
                const attributes = copiedNode.attributes;
                try {
                    for (var _y = true, attributes_1 = (e_4 = void 0, __asyncValues(attributes)), attributes_1_1; attributes_1_1 = yield attributes_1.next(), _k = attributes_1_1.done, !_k;) {
                        _m = attributes_1_1.value;
                        _y = false;
                        try {
                            let attribute = _m;
                            if (frameWorkConfig.list.attributes.indexOf(attribute) !== -1) {
                                copiedNode.removeAttribute(attribute);
                            }
                        }
                        finally {
                            _y = true;
                        }
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (!_y && !_k && (_l = attributes_1.return)) yield _l.call(attributes_1);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                try {
                    for (var _z = true, _0 = (e_5 = void 0, __asyncValues(frameWorkConfig.list.attributes)), _1; _1 = yield _0.next(), _o = _1.done, !_o;) {
                        _q = _1.value;
                        _z = false;
                        try {
                            let removeAttrib = _q;
                            copiedNode.querySelectorAll('[' + removeAttrib + ']').forEach((element) => {
                                element.removeAttribute(removeAttrib);
                            });
                        }
                        finally {
                            _z = true;
                        }
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (!_z && !_o && (_p = _0.return)) yield _p.call(_0);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
            }
            finally {
                _r = true;
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_r && !_a && (_b = FrameWorkAttributesConfig_1.return)) yield _b.call(FrameWorkAttributesConfig_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    console.log({ copiedNode });
    return copiedNode;
});
//# sourceMappingURL=removeFrameWorkAttributes.js.map