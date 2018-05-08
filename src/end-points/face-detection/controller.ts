import { FaceDetectionModel } from "./model";
import { ComputerVisionAPI } from "./../../azure-services/computer-vision-api/computerVisionAPI";
import { FaceAPI } from "../../azure-services/face-api/faceAPI";

var imgRotation = require('./../../util/imgRotation');

export class FaceDetectionController {
  faceDetection(subsPosComputVision: number, subsfaceRecog: number, customerId: string, picture: Buffer) {
    return new Promise((resolve, reject) => {
      // console.log('***controller***');

      var returnModel = new FaceDetectionModel();
      returnModel.customerId = customerId;

      var computerVisionAPI = new ComputerVisionAPI();
      var faceAPI = new FaceAPI();
      var finalJSONResponse: any;

      computerVisionAPI.visionAnalize(subsPosComputVision, picture)
        .then((jsonNResponse: any) => {
          //  console.log('computerVisionAPI.visionAnalize(bitmap)');
          // console.log('jsonNResponse - ' + jsonNResponse);
          // console.log(JSON.stringify(jsonNResponse.faces));
          // console.log('jsonNResponse');

          finalJSONResponse = jsonNResponse;
          if (!jsonNResponse.faces || jsonNResponse.faces.length === 0) {
            //  console.log('Antes do rotation');
            picture = imgRotation(picture, 270);

            return computerVisionAPI.visionAnalize(subsPosComputVision, picture).then((jsonNResponse: any) => {
              //  console.log('computerVisionAPI.visionAnalize(rotatedBuffer)');
              if (jsonNResponse.faces && jsonNResponse.faces.length != 0) {
                return jsonNResponse;
              } else {
                return finalJSONResponse;
              }
            }).catch((error: any) => {
              reject(error);
            });
          } else {
            return finalJSONResponse;
          }
        }).then((json: any) => {

          // console.log('}).then((json:  any)  => {');
          // console.log('json - ' + JSON.stringify(json));

          //finalJSONResponse

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

            // console.log('returnModel antes - ' + returnModel)
            //detect(req).then((detectResponse: any) => {
            faceAPI.detect(subsfaceRecog, picture).then((detectResponse: any) => {

              // console.log('detect(req).then((detectResponse: any)');
              // console.log('detectResponse = ');
              // console.log(detectResponse);
              // console.log('detectResponse');

              if (detectResponse.length > 0) {
                // console.log('detectResponse[0].faceId - ' + detectResponse[0].faceId);
                // console.log('detectResponse.length > 0  - ' + (detectResponse.length > 0));
                //returnModel

                returnModel.properties.faceDetection.faceId = detectResponse.length > 0 ? detectResponse[0].faceId : '';

                // console.log('returnModel.properties.faceDetection.faceId - ' + returnModel.properties.faceDetection.faceId);

                returnModel.properties.glasses.glassesType = detectResponse.length > 0 ? detectResponse[0].faceAttributes.glasses : '';
                if (detectResponse[0].faceAttributes.glasses !== 'NoGlasses') {
                  returnModel.properties.glasses.value = detectResponse[0].faceAttributes.accessories.find(function (element: any) {
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
              // console.log('Dentro - ' + returnModel);
              // console.log('Dentro');

              resolve(returnModel);

            }).catch((error: any) => {
              reject(error);
            });
          }
        }).catch((error: any) => {
          console.log("*********************************************")
          console.log(error);
          throw error;
        });
    }).catch((error: any) => {
      console.log(error);
      throw error;
    });
  }
}



