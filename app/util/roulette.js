"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Roulette {
    computVisionSubs(req, callBack) {
        if (!global.computVisionCalls || global.computVisionCalls == null) {
            global.computVisionCalls = 0;
        }
        if (global.computVisionCalls >= 74) {
            global.computVisionCalls = 0;
        }
        global.computVisionCalls += 1;
        req.computVisionSub = Math.floor(global.computVisionCalls / 5);
        callBack();
    }
    computVsnOCRsubs(req, callBack) {
        if (!global.computVsnOCRCalls || global.computVsnOCRCalls == null) {
            global.computVsnOCRCalls = 0;
        }
        if (global.computVsnOCRCalls >= 19) {
            global.computVsnOCRCalls = 0;
        }
        global.computVsnOCRCalls += 1;
        req.computVsnOCRSub = Math.floor(global.computVsnOCRCalls / 10);
        callBack();
    }
    luisOCRSubs(req, callBack) {
        if (!global.luisOCRCalls || global.luisOCRCalls == null) {
            global.luisOCRCalls = 0;
        }
        global.luisOCRCalls += 1;
        if (global.luisOCRCalls >= 10) {
            global.luisOCRCalls = 0;
        }
        req.luisOCRsub = global.luisOCRCalls;
        callBack();
    }
    faceRecogSubs(req, callBack) {
        if (!global.faceRecogCalls || global.faceRecogCalls == null) {
            global.faceRecogCalls = 0;
        }
        if (global.faceRecogCalls >= 149) {
            global.faceRecogCalls = 0;
        }
        global.faceRecogCalls += 1;
        req.faceRecogSub = Math.floor(global.faceRecogCalls / 10);
        callBack();
    }
}
exports.Roulette = Roulette;

//# sourceMappingURL=roulette.js.map
