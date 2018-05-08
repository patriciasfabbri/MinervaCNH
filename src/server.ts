import { FaceDetectionRoute } from "./end-points/face-detection/route";
import { FaceVerificationRoute } from "./end-points/face-verification/route";
import { OCRRoute } from './end-points/ocr/route';

var restify = require('restify');
var configPort = process.env.PORT || 8080;

var server = restify.createServer();
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

//Delclaration of the global variable - undefined

//require('./end-points/face-detection/route')(server);
var faceDetectionRoute = new FaceDetectionRoute();
faceDetectionRoute.faceDetection(server);

// require('./end-points/face-verification/route')(server);
var faceVerificationRoute = new FaceVerificationRoute();
faceVerificationRoute.faceVerification(server);

// require('./end-points/ocr/route')(server);
var ocrRoute = new OCRRoute();
ocrRoute.ocr(server);

server.on('InternalServer', function (req: any, res: any, err: any, callback: any) {
  // console.log(err);
  res.send(400, err.body);
});

server.listen(configPort, function () { 
  console.log('%s listening at %s', server.name, server.url);
});

