import { FaceVerificationController } from "./controller";

var errs = require('restify-errors');
var controller = require('./controller');
var mongoLog = require('../../mongo/face-verification');

export class FaceVerificationRoute {
  
  public faceVerification = (server: any) => {
    var instance = this;
    server.post('/faceVerification', function (req: any, res: any, next: any) {

      if (instance.faceVerificationRequestValidation(req) !== 'no-errors') {
        return next(instance.faceVerificationRequestValidation(req));
      }

      var controller = new FaceVerificationController();

      controller.faceVerification(req.body.customerId, req.body.faceId1, req.body.faceId2).then((transformedObject: any) => {
        res.send(transformedObject);
        mongoLog(transformedObject, req.date(), new Date());
        return next();
      }).catch((error: any) => {
        return next(new errs.InternalServerError(error));
      });

    });
  }

  private faceVerificationRequestValidation(req: any) {
    var msg = 'Missing parameter. header { Content-Type: application/json }. body: { faceId1: \'1231231\', faceI2: \'1231231\', customerId: \'2343498274\' }.';

    if (!req.body) {
      return new errs.InternalServerError(msg);
    }

    if (
      !req.body.faceId1 ||
      !req.body.faceId2 ||
      !req.body.customerId
    ) {
      return new errs.InternalServerError(msg);
    }

    return 'no-errors';
  }

}

