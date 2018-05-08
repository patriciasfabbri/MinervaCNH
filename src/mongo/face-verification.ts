var config = require('./config');
var MongoClient = require('mongodb').MongoClient;
import { FaceVerificationModel } from '../end-points/face-verification/model';

module.exports = function (modelClass: any, start: any, finish: any) {
    let document = {};

    if (!(modelClass instanceof FaceVerificationModel)) {
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
    };

    MongoClient.connect(config.url, function (err: any, db: any) {
        db.collection('faceVerification')
            .insertOne(document, function (err: any, response: any) {
                if (err) {
                    db.close();
                }
                db.close();
            });
    });
}
