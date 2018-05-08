"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require('request');
var config = require('./../config');
class ComputerVisionAPI {
    visionAnalize(subsPos, picture) {
        return new Promise((resolve, reject) => {
            var subscription = config.computerVisionApi.subscriptionKey;
            request({
                url: config.computerVisionApi.urlBase + config.computerVisionApi.visionAnalize.path,
                qs: config.computerVisionApi.visionAnalize.params,
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Ocp-Apim-Subscription-Key': subscription
                },
                formData: { myfile: picture }
            }, function (error, response, body) {
                if (error) {
                    reject(error);
                }
                resolve(JSON.parse(body));
            });
        });
    }
    ocr(picture) {
        return new Promise((resolve, reject) => {
            var subscription = config.computerVisionApi.ocr.subscriptionKey;
            request({
                url: config.computerVisionApi.ocr.urlBase + config.computerVisionApi.ocr.path,
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Ocp-Apim-Subscription-Key': subscription
                },
                formData: { myfile: picture }
            }, function (error, response, body) {
                if (error) {
                    console.log('error:', error);
                    reject(error);
                }
                resolve(JSON.parse(body));
            });
        });
    }
}
exports.ComputerVisionAPI = ComputerVisionAPI;

//# sourceMappingURL=computerVisionAPI.js.map
