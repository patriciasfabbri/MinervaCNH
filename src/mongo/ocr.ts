var config = require('./config');
var MongoClient = require('mongodb').MongoClient;
var OcrClass = require('../end-points/ocr/model');
var SantanderCortanaFaceDetection = require('../end-points/face-detection/model');

module.exports = function (modelClass: any, start: any, finish: any) {
    //console.log('mongo - Entrou');
    let document = {};

    if (!modelClass) {//(!(modelClass instanceof OcrClass)) { //TODO: Arrumar este if para pegar a classe correta
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
        db.collection('ocr')
            .insertOne(document, function (err: any, response: any) {
                if (err) {
                    console.log('mongo err:' + err)
                    db.close();
                }
                db.close();
            });
    });

    //console.log('mongo - saiu');
}
