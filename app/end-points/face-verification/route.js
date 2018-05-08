"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controller_1 = require("./controller");
var errs = require('restify-errors');
var controller = require('./controller');
var mongoLog = require('../../mongo/face-verification');
class FaceVerificationRoute {
    constructor() {
        this.faceVerification = (server) => {
            var instance = this;
            server.post('/faceVerification', function (req, res, next) {
                if (instance.faceVerificationRequestValidation(req) !== 'no-errors') {
                    return next(instance.faceVerificationRequestValidation(req));
                }
                var controller = new controller_1.FaceVerificationController();
                controller.faceVerification(req.body.customerId, req.body.faceId1, req.body.faceId2).then((transformedObject) => {
                    res.send(transformedObject);
                    mongoLog(transformedObject, req.date(), new Date());
                    return next();
                }).catch((error) => {
                    return next(new errs.InternalServerError(error));
                });
            });
        };
    }
    faceVerificationRequestValidation(req) {
        var msg = 'Missing parameter. header { Content-Type: application/json }. body: { faceId1: \'1231231\', faceI2: \'1231231\', customerId: \'2343498274\' }.';
        if (!req.body) {
            return new errs.InternalServerError(msg);
        }
        if (!req.body.faceId1 ||
            !req.body.faceId2 ||
            !req.body.customerId) {
            return new errs.InternalServerError(msg);
        }
        return 'no-errors';
    }
}
exports.FaceVerificationRoute = FaceVerificationRoute;

//# sourceMappingURL=route.js.map
