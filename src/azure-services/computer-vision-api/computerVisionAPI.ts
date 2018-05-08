var request = require('request');
var config = require('./../config');

export class ComputerVisionAPI {

  visionAnalize(subsPos: number, picture: Buffer) {
    //var localArrComputVisionSubs = ["3d78c693fcd74566a74422dc1e54cbbb","93cadad3497940898ab9ee150150796f","371d7407acda4a81a05c88f967c1fc11", "3fa32ef63dd34c5e8114d51ddd0c8f1f", "c0471d0c391d4f1080fdf9acd0024e36", "c9b130a13ebc4781af99727bc5cd1b08", "38be5bb022b746c9b1c5b1ce62b38fda", "920c0db1f9ce4f0f9a3cbaa979c64094", "5736e588a4784e668f752a10e6db89a6", "568374962f8e4c05a016ac4f851158dc", "031b220301dd491cadc02ba436fa5c6e", "55724ec58c2b4e8babdae8dea9194761", "b384fbbd931f41cd9a6f4286dc79c85d", "372ab55e2ad04b67bf5654f4a22aacd8", "39b7e8290064444191442269f221d120"];
    // var localArrComputVisionSubs = ["d25618b850ff43669e8b83004c7de3c1","7ba66009b4534caa938f78576b4bee99","bbaa00c442ce481a88edfe5acc25c131","ff7b1240776947ad98d71e994307d517","cc5674a26f7846ffa8d8bef21894999e","47012c0bb0da4736ab08aa9c29988d8f","a034701db9534d9b82e0796fbbc7cc35","a39f7b0758914ac7a6a14adc810c552c","bf20c706b8164400b5a53fb5f03ca4b6","5113b3829fd440bba4290c728fddad48","76bd49fa4d124611a958b477684f2b93","ad744fe46faa45a996b7b1a6518478af","5cf5f211e2024d59a0b136314000418f","117ceea0d2cd4527ab590815ce3fc749","76d601148d9e444b923dfd300219fa42"];
    // console.log('***ComputerVisionAPI***');
    return new Promise((resolve, reject) => {
      var subscription = config.computerVisionApi.subscriptionKey;

      //console.log("subscription--> " + subscription + " subsPos--> " + subsPos.toString())

      // console.log("global.arrComputVisionSubs[subsPos] ->" + global.arrComputVisionSubs[1]);
      // console.log(subsPos);
      // console.log(global.arrComputVisionSubs);

      request({
        url: config.computerVisionApi.urlBase + config.computerVisionApi.visionAnalize.path,
        qs: config.computerVisionApi.visionAnalize.params,
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Ocp-Apim-Subscription-Key': subscription
        },
        formData: { myfile: picture }
      }, function (error: any, response: any, body: any) {
        if (error) {
          // console.log('ComputerVisionAPI - ERROR!!!!!!!!!');
          reject(error);
        }
        // console.log(body);
        // console.log('ComputerVisionAPI - JSON.parse(body)');
        // console.log(JSON.parse(body));
        resolve(JSON.parse(body));
      });
    })
  }

  ocr(picture: Buffer) {
    // var localArrComputVisionSubs = ["7ba66009b4534caa938f78576b4bee99","5113b3829fd440bba4290c728fddad48"];
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

      }, function (error: any, response: any, body: any) {
        if (error) {
          console.log('error:', error);
          reject(error);
        }
        resolve(JSON.parse(body));
      });

    });
  }

}

