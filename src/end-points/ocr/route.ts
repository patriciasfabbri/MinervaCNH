import { FileValidation } from "./../util/fileValidation";
import { OCRController } from "./controller";

import { Roulette } from "./../../util/roulette";

var errs = require('restify-errors');
// var controller = require('./controller');
var mongoLog = require('../../mongo/ocr');

export class OCRRoute {
  ocr(server: any) {

    server.post('/ocr',

      function middlewareOCR(req: any, res: any, next: any) {
        var roulette = new Roulette();
        roulette.computVsnOCRsubs(req, function () {
          roulette.luisOCRSubs(req, function () {
            return next();
          })
        });
      },

      function (req: any, res: any, next: any) {
        console.log('***route***');
        var fileValidation = new FileValidation();
        
        if (fileValidation.requestValidation(req) !== 'no-errors') {
          return next(fileValidation.requestValidation(req));
        }
        
        var controller = new OCRController();
        console.log('***Controller***');
        var bitmap = new Buffer(req.body.picture.split(',')[1], 'base64');
        
        controller.ocr(req.computVsnOCRSub, req.luisOCRsub, req.body.customerId, bitmap).then((transformedObject: any) => {
          res.send(transformedObject);
          console.log('***log***');
          // mongoLog(transformedObject, req.date(), new Date());
          return next();
        }).catch((error: any) => {
          //return next(new errs.InternalServerError(error));
          return next();
        });

      });


  }
}


