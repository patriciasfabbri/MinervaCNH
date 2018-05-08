var config = require('./config');
var MongoClient = require('mongodb').MongoClient;
import { FaceDetectionModel } from "../end-points/face-detection/model";

module.exports = function (modelClass: any, start: any, finish: any) {
    let document = {};

    // console.log('Mongo');

    if (!(modelClass instanceof FaceDetectionModel)) {
        document = { error: 'log call without model object' }
    }
    else {
        document = {
            customerId: modelClass.customerId ? modelClass.customerId : '',
            dateTimeStart: start,
            dateTiemEnd: finish,
            duration: finish - start,
            return: modelClass
        }

        // console.log('Mongo Doc-------------------');
        // console.log(document);
        // console.log('----------------------------');
    };

    MongoClient.connect(config.url, function (err: any, db: any) {
        db.collection('faceDetection')
            .insertOne(document, function (err: any, response: any) {
                if (err) {
                    db.close();
                }
                db.close();
            });
    });
}
