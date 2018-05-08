var request = require('request');
var config = require('./../config');

export class LUISAI {

  call(subsPos: number, sentence: string) {
    // console.log('***LUISAI***');
    return new Promise((resolve, reject) => {
      // var localArrLUISSubs = ["923c97c2ae2b47d181b46e1e7c4fad2a", "c8ae81ec8dea40bb99417152db3061a2", "9ada9a0f09254460a206b3d87ba48d82", "5ebf601910e2499f8b25febdda160629", "49cbc248b53a45639bcc79bae909c21f", "7fecb60d025c4d319a9cc7bd056ca672", "8725d0fe19e243d5ade6af2a15406875", "007b3b8ac5684ed194da7a2e06f97164", "056edc87f2f94aa5bde0f3a93da243bc", "3b58c714f12b40f7870871ba49ba4788"];
      var subscription = config.luisApi.subscriptionKey;
      request({
        url: config.luisApi.urlBase
        + config.luisApi.path
        + config.luisApi.appId,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': subscription//config.luisApi.subscriptionKey
        },
        body: '"' + sentence + '"'

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

