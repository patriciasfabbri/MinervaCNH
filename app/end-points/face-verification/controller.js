"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faceAPI_1 = require("../../azure-services/face-api/faceAPI");
const model_1 = require("./model");
var isJson = require('../../util/json');
class FaceVerificationController {
    faceVerification(customerId, faceId1, faceId2) {
        return new Promise((resolve, reject) => {
            var faceAPI = new faceAPI_1.FaceAPI();
            faceAPI.verify(faceId1, faceId2).then((response) => {
                var faceVerificationModel = new model_1.FaceVerificationModel();
                if (isJson(response) && !response.error) {
                    var jsonResponse = JSON.parse(response);
                    if (customerId) {
                        faceVerificationModel.customerId = customerId;
                    }
                    faceVerificationModel.recommendation.status = jsonResponse.isIdentical;
                    faceVerificationModel.properties.confidence = jsonResponse.confidence;
                    faceVerificationModel.properties.isIdentical = jsonResponse.isIdentical;
                }
                resolve(faceVerificationModel);
            }).catch((error) => {
                reject(error);
            });
        });
    }
}
exports.FaceVerificationController = FaceVerificationController;

//# sourceMappingURL=controller.js.map
