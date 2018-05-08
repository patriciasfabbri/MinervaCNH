var config = require('./config');
var MongoClient = require('mongodb').MongoClient;
var OcrClass = require('../end-points/ocr/model');
var SantanderCortanaFaceDetection = require('../end-points/face-detection/model');
module.exports = function (modelClass, start, finish) {
    let document = {};
    if (!modelClass) {
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
        db.collection('ocr')
            .insertOne(document, function (err, response) {
            if (err) {
                console.log('mongo err:' + err);
                db.close();
            }
            db.close();
        });
    });
};

//# sourceMappingURL=ocr.js.map
