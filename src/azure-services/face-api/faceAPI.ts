var request = require('request');
var config = require('./../config');

export class FaceAPI {

  detect(subsfaceRecog: number, picture: Buffer) {
    //var localArrfaceRecogSubs = ["35ec086037044a2aa5fd2cd229903f10","2e00d98daeb143f4aafee5d0f56b096d","40da5296644f475d963c2262c6cde6ac","e2cbf19a8aa94f169ae00ed572509405", "7132908b0fb24e559b4fc1fd374c9768", "dc6c41264eae4a0fbd5e9f1caa28912f", "d47ee9933b864aaaaa5e3930dbc3471f", "933acd9606734eb3bec626519cae0032", "9a6dcdcee7064ad28455ab551c0df85f", "5bc21e34e0fa43e9bcd4f5e20b37a687", "0f9dcccf7636427b90c7143c68c45d04", "0952052f509346d594217573483fce79", "005f9801f00c47569a78a03224e901c3", "aa2a2213515843d283675eb289c5a472", "2f35b1d7ae9d47bf9914c2b3de65fd64"];
    var localArrfaceRecogSubs = ["b255f5f7ad2648279632be30a2119c08", "732dd3c6a0444081a9f5f5817c4820a4", "2715dab0e06a4f1785fc9c3709678c53", "c85adc1ae41b450c829f7f7cd058b674", "bbf1922728904e41b2238e74a8d77ffa", "8a79b9e05d0f4b4987f91bcebb247bff", "8edb00318202423e98389fb2d85c732a", "1b8faedf19c64cec9bfa3af5e33e9627", "18e4d636950b4bc0b1043ee31a252e0d", "80c06bc483f245279ab12cc0004dd710", "8c582dbc6fbb476db6afb6ef24791a65", "a4ed7aae224647d3821313c76143397f", "fb06685166504a078a0178fec53f2533", "87c4c78288f6434794c683e9c1cd2492", "418a47e81f584cc69b32c12b0faa72e1"];
    
    // console.log('***FaceAPI***');
    return new Promise((resolve, reject) => {
      var subscription = localArrfaceRecogSubs[subsfaceRecog];
      // console.log("global.arrfaceRecogSubs[subsfaceRecog] ->"  + global.arrfaceRecogSubs[1]);
      // console.log(subsfaceRecog);
      // console.log(global.arrfaceRecogSubs);

      request({
        url: config.faceApi.urlBase + config.faceApi.detect.path,
        qs: config.faceApi.detect.params,
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'Ocp-Apim-Subscription-Key': subscription//config.faceApi.subscriptionKey
        },
        body: picture
      }, function (error: any, response: any, body: any) {
        if (error) {
          reject(error);
        }
        resolve(JSON.parse(body));
      });


    })
  }

  verify(faceId1: any, faceId2: any) {
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
      }, function (error: any, response: any, body: any) {

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

