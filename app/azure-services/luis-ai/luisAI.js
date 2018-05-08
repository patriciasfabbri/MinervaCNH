"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require('request');
var config = require('./../config');
class LUISAI {
    call(subsPos, sentence) {
        return new Promise((resolve, reject) => {
            var subscription = config.luisApi.subscriptionKey;
            request({
                url: config.luisApi.urlBase
                    + config.luisApi.path
                    + config.luisApi.appId,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': subscription
                },
                body: '"' + sentence + '"'
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
exports.LUISAI = LUISAI;

//# sourceMappingURL=luisAI.js.map
