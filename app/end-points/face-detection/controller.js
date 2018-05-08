"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_1 = require("./model");
const computerVisionAPI_1 = require("./../../azure-services/computer-vision-api/computerVisionAPI");
const faceAPI_1 = require("../../azure-services/face-api/faceAPI");
var imgRotation = require('./../../util/imgRotation');
class FaceDetectionController {
    faceDetection(subsPosComputVision, subsfaceRecog, customerId, picture) {
        return new Promise((resolve, reject) => {
            var returnModel = new model_1.FaceDetectionModel();
            returnModel.customerId = customerId;
            var computerVisionAPI = new computerVisionAPI_1.ComputerVisionAPI();
            var faceAPI = new faceAPI_1.FaceAPI();
            var finalJSONResponse;
            computerVisionAPI.visionAnalize(subsPosComputVision, picture)
                .then((jsonNResponse) => {
                finalJSONResponse = jsonNResponse;
                if (!jsonNResponse.faces || jsonNResponse.faces.length === 0) {
                    picture = imgRotation(picture, 270);
                    return computerVisionAPI.visionAnalize(subsPosComputVision, picture).then((jsonNResponse) => {
                        if (jsonNResponse.faces && jsonNResponse.faces.length != 0) {
                            return jsonNResponse;
                        }
                        else {
                            return finalJSONResponse;
                        }
                    }).catch((error) => {
                        reject(error);
                    });
                }
                else {
                    return finalJSONResponse;
                }
            }).then((json) => {
                if (json) {
                    returnModel.properties.explicitContent.adultScore = json.adult.adultScore;
                    returnModel.properties.explicitContent.racyScore = json.adult.racyScore;
                    if (json.adult.adultScore > 0.5 || json.adult.racyScore > 0.5) {
                        returnModel.recommendation.status = false;
                        returnModel.recommendation.reasons.push('explicitContent');
                        resolve(returnModel);
                    }
                    returnModel.properties.faceDetection.faceLength = json.faces.length;
                    if (json.faces.length !== 1) {
                        returnModel.recommendation.status = false;
                        returnModel.recommendation.reasons.push('faceDetection');
                        resolve(returnModel);
                    }
                    faceAPI.detect(subsfaceRecog, picture).then((detectResponse) => {
                        if (detectResponse.length > 0) {
                            returnModel.properties.faceDetection.faceId = detectResponse.length > 0 ? detectResponse[0].faceId : '';
                            returnModel.properties.glasses.glassesType = detectResponse.length > 0 ? detectResponse[0].faceAttributes.glasses : '';
                            if (detectResponse[0].faceAttributes.glasses !== 'NoGlasses') {
                                returnModel.properties.glasses.value = detectResponse[0].faceAttributes.accessories.find(function (element) {
                                    return element.type === 'glasses';
                                }).confidence;
                            }
                            else {
                                returnModel.properties.glasses.value = 0;
                            }
                            if (detectResponse[0].faceAttributes.glasses === 'Sunglasses'
                                || detectResponse[0].faceAttributes.glasses === 'SwimmingGoggles') {
                                returnModel.recommendation.status = false;
                                returnModel.recommendation.reasons.push('glasses');
                                resolve(returnModel);
                            }
                            returnModel.properties.faceQuality.blur = detectResponse.length > 0 ? detectResponse[0].faceAttributes.blur.blurLevel : '';
                            returnModel.properties.faceQuality.blurValue = detectResponse.length > 0 ? detectResponse[0].faceAttributes.blur.value : -1;
                            returnModel.properties.faceQuality.exposure = detectResponse.length > 0 ? detectResponse[0].faceAttributes.exposure.exposureLevel : '';
                            returnModel.properties.faceQuality.exposureValue = detectResponse.length > 0 ? detectResponse[0].faceAttributes.exposure.value : -1;
                            returnModel.properties.faceQuality.noise = detectResponse.length > 0 ? detectResponse[0].faceAttributes.noise.noiseLevel : '';
                            returnModel.properties.faceQuality.noiseValue = detectResponse.length > 0 ? detectResponse[0].faceAttributes.noise.value : -1;
                            if ((detectResponse[0].faceAttributes.exposure.value <= 0.25
                                || detectResponse[0].faceAttributes.exposure.value >= 0.9) ||
                                (detectResponse[0].faceAttributes.blur.blurLevel === 'high'
                                    && detectResponse[0].faceAttributes.noise.noiseLevel === 'high')) {
                                returnModel.recommendation.status = false;
                                returnModel.recommendation.reasons.push('faceQuality');
                                resolve(returnModel);
                            }
                        }
                        resolve(returnModel);
                    }).catch((error) => {
                        reject(error);
                    });
                }
            }).catch((error) => {
                console.log("*********************************************");
                console.log(error);
                throw error;
            });
        }).catch((error) => {
            console.log(error);
            throw error;
        });
    }
}
exports.FaceDetectionController = FaceDetectionController;

//# sourceMappingURL=controller.js.map
