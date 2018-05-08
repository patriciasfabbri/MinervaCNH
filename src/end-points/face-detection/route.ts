import { FileValidation } from "./../util/fileValidation";
import { FaceDetectionController } from "./controller";

import { Roulette } from "./../../util/roulette";

var errs = require('restify-errors');
// var mongoLog = require('../../mongo/face-detection');

export class FaceDetectionRoute {
  faceDetection(server: any) {
    server.post('/faceDetection',

      function middlewareFaceDetection(req: any, res: any, next: any) {
        var roulette = new Roulette();

        roulette.computVisionSubs(req, function () {
          roulette.faceRecogSubs(req, function () {
            return next();
          })
        });

      },

      function (req: any, res: any, next: any) {

        // console.log('***route***');
        var controller = new FaceDetectionController();
        var fileValidation = new FileValidation();

        if (fileValidation.requestValidation(req) !== 'no-errors') {
          return next(fileValidation.requestValidation(req));
        }

        var bitmap = new Buffer(req.body.picture.split(',')[1], 'base64');

        controller.faceDetection(req.computVisionSub, req.faceRecogSub, req.body.customerId, bitmap).then((transformedObject: any) => {
          res.send(transformedObject);
          // mongoLog(transformedObject, req.date(), new Date());
          return next();
        }).catch((error: any) => {
          // console.log('Mongo Error: ' + error)
          //return next(new errs.InternalServerError(error));
          return next();
        });

      });
  }
}

