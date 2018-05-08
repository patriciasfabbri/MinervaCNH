"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fileValidation_1 = require("./../util/fileValidation");
const controller_1 = require("./controller");
const roulette_1 = require("./../../util/roulette");
var errs = require('restify-errors');
var mongoLog = require('../../mongo/ocr');
class OCRRoute {
    ocr(server) {
        server.post('/ocr', function middlewareOCR(req, res, next) {
            var roulette = new roulette_1.Roulette();
            roulette.computVsnOCRsubs(req, function () {
                roulette.luisOCRSubs(req, function () {
                    return next();
                });
            });
        }, function (req, res, next) {
            console.log('***route***');
            var fileValidation = new fileValidation_1.FileValidation();
            if (fileValidation.requestValidation(req) !== 'no-errors') {
                return next(fileValidation.requestValidation(req));
            }
            var controller = new controller_1.OCRController();
            console.log('***Controller***');
            var bitmap = new Buffer(req.body.picture.split(',')[1], 'base64');
            controller.ocr(req.computVsnOCRSub, req.luisOCRsub, req.body.customerId, bitmap).then((transformedObject) => {
                res.send(transformedObject);
                console.log('***log***');
                return next();
            }).catch((error) => {
                return next();
            });
        });
    }
}
exports.OCRRoute = OCRRoute;

//# sourceMappingURL=route.js.map
