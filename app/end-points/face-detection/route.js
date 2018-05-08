"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fileValidation_1 = require("./../util/fileValidation");
const controller_1 = require("./controller");
const roulette_1 = require("./../../util/roulette");
var errs = require('restify-errors');
class FaceDetectionRoute {
    faceDetection(server) {
        server.post('/faceDetection', function middlewareFaceDetection(req, res, next) {
            var roulette = new roulette_1.Roulette();
            roulette.computVisionSubs(req, function () {
                roulette.faceRecogSubs(req, function () {
                    return next();
                });
            });
        }, function (req, res, next) {
            var controller = new controller_1.FaceDetectionController();
            var fileValidation = new fileValidation_1.FileValidation();
            if (fileValidation.requestValidation(req) !== 'no-errors') {
                return next(fileValidation.requestValidation(req));
            }
            var bitmap = new Buffer(req.body.picture.split(',')[1], 'base64');
            controller.faceDetection(req.computVisionSub, req.faceRecogSub, req.body.customerId, bitmap).then((transformedObject) => {
                res.send(transformedObject);
                return next();
            }).catch((error) => {
                return next();
            });
        });
    }
}
exports.FaceDetectionRoute = FaceDetectionRoute;

//# sourceMappingURL=route.js.map
