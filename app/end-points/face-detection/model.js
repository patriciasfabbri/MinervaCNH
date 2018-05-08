"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FaceDetectionModel {
    constructor() {
        this.customerId = '';
        this.recommendation = {
            status: true,
            reasons: []
        };
        this.properties = {
            explicitContent: {
                adultScore: -1,
                racyScore: -1
            },
            faceDetection: {
                faceId: '',
                faceLength: -1
            },
            glasses: {
                glassesType: '',
                value: -1
            },
            faceQuality: {
                blur: '',
                blurValue: -1,
                exposure: '',
                exposureValue: -1,
                noise: '',
                noiseValue: -1
            }
        };
    }
}
exports.FaceDetectionModel = FaceDetectionModel;

//# sourceMappingURL=model.js.map
