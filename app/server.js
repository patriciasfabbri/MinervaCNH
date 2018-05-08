"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_1 = require("./end-points/face-detection/route");
const route_2 = require("./end-points/face-verification/route");
const route_3 = require("./end-points/ocr/route");
var restify = require('restify');
var configPort = process.env.PORT || 8080;
var server = restify.createServer();
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
var faceDetectionRoute = new route_1.FaceDetectionRoute();
faceDetectionRoute.faceDetection(server);
var faceVerificationRoute = new route_2.FaceVerificationRoute();
faceVerificationRoute.faceVerification(server);
var ocrRoute = new route_3.OCRRoute();
ocrRoute.ocr(server);
server.on('InternalServer', function (req, res, err, callback) {
    res.send(400, err.body);
});
server.listen(configPort, function () {
    console.log('%s listening at %s', server.name, server.url);
});

//# sourceMappingURL=server.js.map
