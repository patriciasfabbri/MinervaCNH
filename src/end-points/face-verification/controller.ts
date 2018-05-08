import { FaceAPI } from "../../azure-services/face-api/faceAPI";
import { FaceVerificationModel } from "./model";
// var serviceFaceVerify = require('../../azure-services/face-api/verify');
var isJson = require('../../util/json');

export class FaceVerificationController {
	faceVerification(customerId: string, faceId1: any, faceId2: any) {
		return new Promise((resolve, reject) => {

			var faceAPI = new FaceAPI();
			faceAPI.verify(faceId1, faceId2).then((response: any) => {
				var faceVerificationModel = new FaceVerificationModel();

				if (isJson(response) && !response.error) {
					var jsonResponse = JSON.parse(response);

					if (customerId) {
						faceVerificationModel.customerId = customerId
					}
					faceVerificationModel.recommendation.status = jsonResponse.isIdentical;
					faceVerificationModel.properties.confidence = jsonResponse.confidence;
					faceVerificationModel.properties.isIdentical = jsonResponse.isIdentical;
				}

				resolve(faceVerificationModel);

			}).catch((error: any) => {
				reject(error);
			});

		});
	}

}
