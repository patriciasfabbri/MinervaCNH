var request = require('request');
var config = require('./../config');

export class CustomVisionAPI {

    predictionModelOne(picture: Buffer) {
        return new Promise((resolve, reject) => {

            request({
                url: config.customVisionModelOne.urlBase
                + config.customVisionModelOne.prediction.path
                + config.customVisionModelOne.prediction.projectId
                + config.customVisionModelOne.prediction.postPath,
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Prediction-Key': config.customVisionModelOne.prediction.predictionKey
                },
                body: picture

            }, function (error: any, response: any, body: any) {
                if (error) {
                    reject(error);
                }
                resolve(JSON.parse(body));
            });

        });
    }

    predictionNewModel(picture: Buffer) {
        return new Promise((resolve, reject) => {

            request({
                url: config.customVisionNewModel.urlBase
                + config.customVisionNewModel.prediction.path
                + config.customVisionNewModel.prediction.projectId
                + config.customVisionNewModel.prediction.postPath,
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Prediction-Key': config.customVisionNewModel.prediction.predictionKey
                },
                body: picture

            }, function (error: any, response: any, body: any) {
                if (error) {
                    reject(error);
                }
                resolve(JSON.parse(body));
            });

        });
    }

}

