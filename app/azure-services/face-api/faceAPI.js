"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require('request');
var config = require('./../config');
class FaceAPI {
    detect(subsfaceRecog, picture) {
        var localArrfaceRecogSubs = ["b255f5f7ad2648279632be30a2119c08", "732dd3c6a0444081a9f5f5817c4820a4", "2715dab0e06a4f1785fc9c3709678c53", "c85adc1ae41b450c829f7f7cd058b674", "bbf1922728904e41b2238e74a8d77ffa", "8a79b9e05d0f4b4987f91bcebb247bff", "8edb00318202423e98389fb2d85c732a", "1b8faedf19c64cec9bfa3af5e33e9627", "18e4d636950b4bc0b1043ee31a252e0d", "80c06bc483f245279ab12cc0004dd710", "8c582dbc6fbb476db6afb6ef24791a65", "a4ed7aae224647d3821313c76143397f", "fb06685166504a078a0178fec53f2533", "87c4c78288f6434794c683e9c1cd2492", "418a47e81f584cc69b32c12b0faa72e1"];
        return new Promise((resolve, reject) => {
            var subscription = localArrfaceRecogSubs[subsfaceRecog];
            request({
                url: config.faceApi.urlBase + config.faceApi.detect.path,
                qs: config.faceApi.detect.params,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Ocp-Apim-Subscription-Key': subscription
                },
                body: picture
            }, function (error, response, body) {
                if (error) {
                    reject(error);
                }
                resolve(JSON.parse(body));
            });
        });
    }
    verify(faceId1, faceId2) {
        return new Promise((resolve, reject) => {
            request({
                url: config.faceApi.urlBase + config.faceApi.verify.path,
                qs: [],
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': config.faceApi.subscriptionKey
                },
                body: '{ "faceId1": "' + faceId1 + '", "faceId2": "' + faceId2 + '"}'
            }, function (error, response, body) {
                if (error) {
                    reject(error);
                }
                let JSONBody = JSON.parse(body);
                if (JSONBody.error) {
                    reject(JSONBody.error);
                }
                resolve(body);
            });
        });
    }
}
exports.FaceAPI = FaceAPI;

//# sourceMappingURL=faceAPI.js.map
