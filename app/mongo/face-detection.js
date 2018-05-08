"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = require('./config');
var MongoClient = require('mongodb').MongoClient;
const model_1 = require("../end-points/face-detection/model");
module.exports = function (modelClass, start, finish) {
    let document = {};
    if (!(modelClass instanceof model_1.FaceDetectionModel)) {
        document = { error: 'log call without model object' };
    }
    else {
        document = {
            customerId: modelClass.customerId ? modelClass.customerId : '',
            dateTimeStart: start,
            dateTiemEnd: finish,
            duration: finish - start,
            return: modelClass
        };
    }
    ;
    MongoClient.connect(config.url, function (err, db) {
        db.collection('faceDetection')
            .insertOne(document, function (err, response) {
            if (err) {
                db.close();
            }
            db.close();
        });
    });
};

//# sourceMappingURL=face-detection.js.map
