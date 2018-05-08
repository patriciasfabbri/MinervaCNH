export class Roulette {
    computVisionSubs(req: any, callBack: Function) {
        if (!global.computVisionCalls || global.computVisionCalls == null) {
            global.computVisionCalls = 0;
        }

        if (global.computVisionCalls >= 74) {
            global.computVisionCalls = 0;
        }

        global.computVisionCalls += 1;

        // console.log("global.computVisionCalls==> " + global.computVisionCalls.toString());
        // console.log("IntDiv " + Math.floor(global.computVisionCalls/10).toString());

        req.computVisionSub = Math.floor(global.computVisionCalls / 5);
        // console.log("global.computVisionCalls");
        // console.log(global.computVisionCalls);
        // console.log("typeof(global.computVisionCalls)");
        // console.log(typeof(global.computVisionCalls));
        //req.computVisionSub = global.arrComputVisionSubs[Math.floor(global.computVisionCalls/10)]

        // console.log("Subs " +  req.computVisionSub);

        callBack();
    }

    computVsnOCRsubs(req: any, callBack: Function) {
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

    luisOCRSubs(req: any, callBack: Function) {
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

    faceRecogSubs(req: any, callBack: Function) {
        if (!global.faceRecogCalls || global.faceRecogCalls == null) {
            global.faceRecogCalls = 0;
        }

        if (global.faceRecogCalls >= 149) {
            global.faceRecogCalls = 0;
        }

        global.faceRecogCalls += 1;

        req.faceRecogSub = Math.floor(global.faceRecogCalls / 10);

        // console.log("global.faceRecogSub");
        // console.log(global.faceRecogCalls);
        // console.log("typeof(global.faceRecogCalls)");
        // console.log(typeof(global.faceRecogCalls));

        callBack();
    }
}