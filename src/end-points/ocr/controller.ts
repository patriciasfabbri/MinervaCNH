import { CustomVisionAPI } from "./../../azure-services/custom-vision-api/customVisionAPI";
import { ComputerVisionAPI } from "./../../azure-services/computer-vision-api/computerVisionAPI";
import { LUISAI } from "./../../azure-services/luis-ai/luisAI";
import { OcrModel } from "./model";

export class OCRController {
  ocr(subsCVSNPos: number, subsLUISPos: number, customerId: string, picture: Buffer) {
    var instance = this;

    var customVisionAPI = new CustomVisionAPI();
    var computerVisionAPI = new ComputerVisionAPI();
    var ocrModel = new OcrModel();

    return new Promise((resolve, reject) => {

      ocrModel.customerId = customerId;

      customVisionAPI.predictionModelOne(picture).then((predictionResponse: any) => {
        console.log('predictionResponse-----------------------');
        console.log(predictionResponse);
        console.log('-----------------------');
        ocrModel.properties.classification.documentType = predictionResponse.Predictions[0].Tag;
        ocrModel.properties.classification.documentTypeValue = predictionResponse.Predictions[0].Probability;

        if (ocrModel.properties.classification.documentType === 'RG VERSO' && ocrModel.properties.classification.documentTypeValue > 0.5) {
          console.log('RG VERSO');
          computerVisionAPI.ocr(picture).then((ocrResponse: any) => {
            console.log('ocr(req).then((ocrResponse: any) => {');
            let sentences = instance.createSentences(ocrResponse.regions);

            if (sentences.length > 0) {
              instance.luisSentencesAnalize(subsLUISPos, sentences).then((luisResponse: any[]) => {

                let luisResponseWithoutIgnoredNodes = instance.removeIgnoredNode(luisResponse);

                ocrModel.properties.content.length = instance.contentLength(ocrResponse.regions);
                ocrModel.properties.content.score = instance.contentScore(instance.contentLength(ocrResponse.regions), luisResponseWithoutIgnoredNodes);

                ocrModel.recommendation.status = instance.getRecommendationStatus(ocrModel.properties.content.score).status;
                ocrModel.recommendation.reasons = instance.getRecommendationStatus(ocrModel.properties.content.score).reasons;

                ocrModel.properties.entities.name = instance.getPersonNames(sentences, luisResponseWithoutIgnoredNodes);
                ocrModel.properties.entities.date = instance.getDates(sentences, luisResponseWithoutIgnoredNodes);
                ocrModel.properties.entities.document = {
                  DocType: instance.getDocument(luisResponseWithoutIgnoredNodes)[0] ? instance.getDocument(luisResponseWithoutIgnoredNodes)[0].type : '',
                  DocNumber: instance.getDocument(luisResponseWithoutIgnoredNodes)[0] ? instance.getDocument(luisResponseWithoutIgnoredNodes)[0].number : ''
                };

                resolve(ocrModel);
              }).catch((error: any) => {
                reject(error);
              });

            } else {
              ocrModel.properties.content.length = 0;

              ocrModel.recommendation.status = false;
              ocrModel.recommendation.reasons = ['content'];

              resolve(ocrModel);
            }

          }).catch((error: any) => {
            reject(error);
          });
        } else if ((ocrModel.properties.classification.documentType === 'RG FRENTE' && ocrModel.properties.classification.documentTypeValue > 0.5)
          || (ocrModel.properties.classification.documentType === 'CNH VERSO' && ocrModel.properties.classification.documentTypeValue > 0.5)) {
          console.log('RG FRENTE');
          ocrModel.recommendation.status = true;

          resolve(ocrModel);
        } else if (ocrModel.properties.classification.documentType === 'CNH FRENTE' && ocrModel.properties.classification.documentTypeValue > 0.5) {
          console.log('CNH FRENTE');
          computerVisionAPI.ocr( picture).then((ocrResponse:any) => {
            console.log('OCR RESPONSE');
            console.log(ocrResponse);
            console.log('-------------');
            let sentences = instance.createSentences(ocrResponse.regions);
            if (sentences.length > 0) {
              instance.luisSentencesAnalize(subsLUISPos, sentences).then((luisResponse:any[]) => {
                console.log('LUIS RESPONSE');
                console.log(luisResponse);
                console.log('------------------');
                let luisResponseWithoutIgnoredNodes = instance.removeIgnoredNode(luisResponse);
                ocrModel.properties.content.length = instance.contentLength(ocrResponse.regions);
                ocrModel.properties.content.score = instance.contentScore(instance.contentLength(ocrResponse.regions), luisResponseWithoutIgnoredNodes);
                ocrModel.recommendation.status = instance.getRecommendationStatus(ocrModel.properties.content.score).status;
                ocrModel.recommendation.reasons = instance.getRecommendationStatus(ocrModel.properties.content.score).reasons;
                ocrModel.properties.entities.name = instance.getPersonNames(sentences, luisResponseWithoutIgnoredNodes);
                ocrModel.properties.entities.date = instance.getDates(sentences, luisResponseWithoutIgnoredNodes);
                ocrModel.properties.entities.document = {
                  DocType: instance.getDocument(luisResponseWithoutIgnoredNodes)[0] ? instance.getDocument(luisResponseWithoutIgnoredNodes)[0].type : '',
                  DocNumber: instance.getDocument(luisResponseWithoutIgnoredNodes)[0] ? instance.getDocument(luisResponseWithoutIgnoredNodes)[0].number : ''
                };
                ocrModel.properties.entities.RGCNH = {
                  DocType: instance.getRGCNH(luisResponseWithoutIgnoredNodes)[0] ? instance.getRGCNH(luisResponseWithoutIgnoredNodes)[0].type : '',
                  DocNumber: instance.getRGCNH(luisResponseWithoutIgnoredNodes)[0] ? instance.getRGCNH(luisResponseWithoutIgnoredNodes)[0].number : ''
                };
                // ocrModel.properties.entities.CPF = {
                //     DocType: instance.getCPF(luisResponse)[0] ? instance.getCPF(luisResponse)[0].type : '',
                //     DocNumber: instance.getCPF(luisResponse)[0] ? instance.getCPF(luisResponse)[0].number : ''
                // };
                resolve(ocrModel);
                console.log('OCR MODEL');
                console.log(ocrModel);
                console.log('----------------');
              }).catch((error) => {
                reject(error);
              });
            }
            else {
              ocrModel.properties.content.length = 0;
              ocrModel.recommendation.status = false;
              ocrModel.recommendation.reasons = ['content'];
              resolve(ocrModel);
            }
          }).catch((error) => {
            reject(error);
          });

        } else {
          console.log('OTHER');

          ocrModel.recommendation.status = false;
          ocrModel.recommendation.reasons = ['content']

          ocrModel.properties.classification.documentType = 'OTHER';
          ocrModel.properties.classification.documentTypeValue = 0;

          computerVisionAPI.ocr(picture).then((ocrResponse: any) => {
            let length = instance.contentLength(ocrResponse.regions);

            if (instance.contentLengthValidationOther(length)) {
              ocrModel.recommendation.status = true;
              ocrModel.recommendation.reasons = [];
            }

            ocrModel.properties.content.length = length;
            ocrModel.properties.content.score = 0;

            resolve(ocrModel);
          }).catch((error: any) => {
            reject(error);
          });
        }
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  private getRecommendationStatus(score: number): any {
    let recommendation: object = {};
    if (score >= 0.77) {
      recommendation = { status: true, reasons: [] }
    } else {
      recommendation = { status: false, reasons: ['content'] }
    }
    return recommendation;
  }


  private documentType(predictions: Array<any>) {
    if (predictions[0].Tag === 'RG VERSO OK') {
      predictions[0].Tag = 'RG VERSO';
    }
    if (predictions[0].Tag === 'RG FRENTE OK') {
      predictions[0].Tag = 'RG FRENTE';
    }

    if (predictions[0].Tag === 'RG VERSO' ||
      predictions[0].Tag === 'RG FRENTE' ||
      predictions[0].Tag === 'CNH' ||
      predictions[0].Tag === 'CNH VERSO') {
      return predictions[0];
    }

    return { Tag: '', Probability: 0 };
  };


  private createSentences(value: any) {
    let sentences: Array<string> = [];

    value.forEach((currentValue: any) => {
      return currentValue.lines.forEach((currentValue: any) => {
        var sentence: string = '';
        currentValue.words.forEach((currentValue: any) => {
          sentence = sentence.concat(' ', currentValue.text);
        });
        sentence = sentence.slice(1);

        sentences.push(sentence);
      });
    });

    return sentences;
  }


  private luisSentencesAnalize(subsLUISPos: number, sentences: Array<string>) {

    var luisAI = new LUISAI();

    return new Promise((resolve, reject) => {
      let luisResponsesArray: Array<any> = [];

      sentences.forEach((element) => {
        luisAI.call(subsLUISPos, element).then((luisResponse: any) => {
          luisResponsesArray.push(luisResponse);
          if (luisResponsesArray.length === sentences.length) {
            resolve(luisResponsesArray);
          }
        }).catch((error: any) => {
          reject(error);
        });
      });

    });
  }


  private contentLength(value: Array<any>) {
    let accumulator: number = 0;

    value.forEach((currentValue: any) => {
      return currentValue.lines
        .forEach((currentValue: any) => {
          accumulator += 1;
          return currentValue.words
            .forEach((currentValue: any) => {
              accumulator += currentValue.text.length + 1;
            });

        });
    });

    return accumulator;
  }


  private contentScore(value: number, luisResponse: any) {
    let cls = this.contentLengthScoreRG(value);
    let kws = this.keyWordScore(luisResponse);
    let pds = this.personDataScore(luisResponse);
    let result = (cls + kws + pds) / 100;
    return result;
  }


  private contentLengthScoreRG(value: number): number {
    if (value <= 120) {
      return 0;
    }
    if (value >= 121 && value <= 130) {
      return 5;
    }
    if (value >= 131 && value <= 280) {
      return 22;
    }
    if (value >= 281) {
      return 29;
    }
    return -1;
  }

  private contentLengthValidationCNH(value: number): boolean {
    if (value < 180) {
      return false;
    }
    else {
      return true;
    }
  }

  private contentLengthValidationOther(value: number): boolean {
    if (value < 50) {
      return false;
    }
    else {
      return true;
    }
  }

  private keyWordScore(luisResponse: any): number {
    let score = 0;
    luisResponse.find((element: any) => {
      score += element.query.search(/TERRIT.RIO/) > -1 ? 1 : 0;
      score += element.query.search(/NOME/) > -1 ? 1 : 0;
      score += element.query.search(/FILIA..O/) > -1 ? 1 : 0;
      score += element.query.search(/NATURA.IDADE/) > -1 ? 1 : 0;
      score += element.query.search(/DATA/) > -1 ? 1 : 0;
    });
    return score;
  }


  private removeIgnoredNode(value: any) {
    //console.log('------------------------------------------------');
    let validNodes: any[] = [];

    value.find((element: any, valueIndex: any): any => {
      let validElement: boolean = false;

      element.entities.find((entityElement: any): any => {
        if (entityElement.type !== 'Ignore') {
          validElement = true;
        } else {
          //console.log('invalidElement:', element.query);
        }
      });

      if (validElement) {
        //console.log('validElement:', element.query);
        validNodes.push(element);
      }
    });
    //console.log('------------------------------------------------');
    return validNodes;
  }


  private personDataScore(luisResponse: any): number {
    let score = 0;
    let rgCount = 0;
    let dataCount = 0;
    let nomeCount = 0;

    luisResponse.find((element: any, valueIndex: any, array: Array<any>) => {
      element.entities.find((element: any) => {
        if (element.score >= 0.7) {
          if (element.type === 'RG') { rgCount += 1; }
          if (element.type === 'Data') { dataCount += 1; }
          if (element.type === 'Nome') { nomeCount += 1; }
        }
      });
    });


    if (rgCount >= 1) { score += 11; }

    if (dataCount >= 1 && dataCount <= 2) {
      score += 11 * dataCount;
    } else if (dataCount > 2) {
      score += 11 * 2;
    }

    if (nomeCount >= 1 && nomeCount <= 3) {
      score += 11 * nomeCount;
    } else if (nomeCount > 3) {
      score += 11 * 3;
    }

    return score;
  }


  private getPersonNames(sentences: Array<string>, luisResponse: any): Array<any> {
    let namesList: Array<any> = [];

    luisResponse.find((element: any) => {
      element.entities.find((entity: any) => {
        if (entity.type === 'Nome') {
          sentences.find((sentence: string, index: number): any => {
            if (sentence === element.query) {
              namesList.push({ index: index, sentence: sentence });
            }
          });
        }
      });
    });

    namesList.sort((a: any, b: any) => {
      return a.index - b.index;
    });

    return [
      namesList[0] ? namesList[0].sentence : '',
      namesList[1] ? namesList[1].sentence : '',
      namesList[2] ? namesList[2].sentence : ''
    ];
  }


  private getDates(sentences: Array<string>, luisResponse: any): Array<string> {
    let dateList: Array<any> = [];

    luisResponse.find((element: any) => {
      element.entities.find((entity: any) => {
        if (entity.type === 'Data' && entity.score >= 0.5) {
          sentences.find((sentence: string, index: number): any => {
            if (element.query === sentence) {
              dateList.push({ index: index, entity: entity.entity });
            }
          });
        }
      });
    });

    dateList.sort((a: any, b: any) => {
      return a.index - b.index;
    });

    return [
      dateList[0] ? dateList[0].entity : '',
      dateList[1] ? dateList[1].entity : ''
    ];
  }


  private getDocument(luisResponse: any) {
    let document: Array<any> = [];

    luisResponse.find((element: any) => {
      element.entities.find((entity: any) => {
        if (entity.type === 'RG') {
          document.push({ number: entity.entity, type: entity.type });
        }else if(entity.type ==='CNH'){
          document.push({ number: entity.entity, type: entity.type });
        }
      });
    });
    return document;
  }
  private getRGCNH(luisResponse: any) {
    let RGCNH: Array<any> = [];

    luisResponse.find((element: any) => {
      element.entities.find((entity: any) => {
        if (entity.type === 'RGCNH8') {
          RGCNH.push({ number: entity.entity, type: entity.type });
        }else if(entity.type ==='RGCNH9'){
          RGCNH.push({ number: entity.entity, type: entity.type });
        }
      });
    });
    return RGCNH;
  }
}

// function getRecommendationStatus(score: number): any {
//   let recommendation: object = {};
//   if (score >= 0.77) {
//     recommendation = { status: true, reasons: '' }
//   } else {
//     recommendation = { status: false, reasons: 'content' }
//   }
//   return recommendation;
// }


// function documentType(predictions: Array<any>) {
//   if (predictions[0].Tag === 'RG VERSO OK') {
//     predictions[0].Tag = 'RG VERSO';
//   }
//   if (predictions[0].Tag === 'RG FRENTE OK') {
//     predictions[0].Tag = 'RG FRENTE';
//   }

//   if (predictions[0].Tag === 'RG VERSO' ||
//     predictions[0].Tag === 'RG FRENTE' ||
//     predictions[0].Tag === 'CNH' ||
//     predictions[0].Tag === 'CNH VERSO') {
//     return predictions[0];
//   }

//   return { Tag: '', Probability: 0 };
// };


// function createSentences(value: any) {
//   let sentences: Array<string> = [];

//   value.forEach((currentValue: any) => {
//     return currentValue.lines.forEach((currentValue: any) => {
//       var sentence: string = '';
//       currentValue.words.forEach((currentValue: any) => {
//         sentence = sentence.concat(' ', currentValue.text);
//       });
//       sentence = sentence.slice(1);

//       sentences.push(sentence);
//     });
//   });

//   return sentences;
// }


// function luisSentencesAnalize(sentences: Array<string>) {

//   var luisAI = new LUISAI();

//   return new Promise((resolve, reject) => {
//     let luisResponsesArray: Array<any> = [];

//     sentences.forEach((element) => {
//       luisAI.call(element).then((luisResponse: any) => {
//         luisResponsesArray.push(luisResponse);
//         if (luisResponsesArray.length === sentences.length) {
//           resolve(luisResponsesArray);
//         }
//       }).catch((error: any) => {
//         reject(error);
//       });
//     });

//   });
// }


// function contentLength(value: Array<any>) {
//   let accumulator: number = 0;

//   value.forEach((currentValue: any) => {
//     return currentValue.lines
//       .forEach((currentValue: any) => {
//         accumulator += 1;
//         return currentValue.words
//           .forEach((currentValue: any) => {
//             accumulator += currentValue.text.length + 1;
//           });

//       });
//   });

//   return accumulator;
// }


// function contentScore(value: number, luisResponse: any) {
//   let cls = contentLengthScoreRG(value);
//   let kws = keyWordScore(luisResponse);
//   let pds = personDataScore(luisResponse);
//   let result = (cls + kws + pds) / 100;
//   return result;
// }


// function contentLengthScoreRG(value: number): number {
//   if (value <= 120) {
//     return 0;
//   }
//   if (value >= 121 && value <= 130) {
//     return 5;
//   }
//   if (value >= 131 && value <= 280) {
//     return 22;
//   }
//   if (value >= 281) {
//     return 29;
//   }
//   return -1;
// }

// function contentLengthValidationCNH(value: number): boolean {
//   if (value < 180) {
//     return false;
//   }
//   else {
//     return true;
//   }
// }

// function contentLengthValidationOther(value: number): boolean {
//   if (value < 50) {
//     return false;
//   }
//   else {
//     return true;
//   }
// }

// function keyWordScore(luisResponse: any): number {
//   let score = 0;
//   luisResponse.find((element: any) => {
//     score += element.query.search(/TERRIT.RIO/) > -1 ? 1 : 0;
//     score += element.query.search(/NOME/) > -1 ? 1 : 0;
//     score += element.query.search(/FILIA..O/) > -1 ? 1 : 0;
//     score += element.query.search(/NATURA.IDADE/) > -1 ? 1 : 0;
//     score += element.query.search(/DATA/) > -1 ? 1 : 0;
//   });
//   return score;
// }


// function removeIgnoredNode(value: any) {
//   //console.log('------------------------------------------------');
//   let validNodes: any[] = [];

//   value.find((element: any, valueIndex: any): any => {
//     let validElement: boolean = false;

//     element.entities.find((entityElement: any): any => {
//       if (entityElement.type !== 'Ignore') {
//         validElement = true;
//       } else {
//         //console.log('invalidElement:', element.query);
//       }
//     });

//     if (validElement) {
//       //console.log('validElement:', element.query);
//       validNodes.push(element);
//     }
//   });
//   //console.log('------------------------------------------------');
//   return validNodes;
// }


// function personDataScore(luisResponse: any): number {
//   let score = 0;
//   let rgCount = 0;
//   let dataCount = 0;
//   let nomeCount = 0;

//   luisResponse.find((element: any, valueIndex: any, array: Array<any>) => {
//     element.entities.find((element: any) => {
//       if (element.score >= 0.5) {
//         if (element.type === 'RG') { rgCount += 1; }
//         if (element.type === 'Data') { dataCount += 1; }
//         if (element.type === 'Nome') { nomeCount += 1; }
//       }
//     });
//   });


//   if (rgCount >= 1) { score += 11; }

//   if (dataCount >= 1 && dataCount <= 2) {
//     score += 11 * dataCount;
//   } else if (dataCount > 2) {
//     score += 11 * 2;
//   }

//   if (nomeCount >= 1 && nomeCount <= 3) {
//     score += 11 * nomeCount;
//   } else if (nomeCount > 3) {
//     score += 11 * 3;
//   }

//   return score;
// }


// function getPersonNames(sentences: Array<string>, luisResponse: any): Array<any> {
//   let namesList: Array<any> = [];

//   luisResponse.find((element: any) => {
//     element.entities.find((entity: any) => {
//       if (entity.type === 'Nome') {
//         sentences.find((sentence: string, index: number): any => {
//           if (sentence === element.query) {
//             namesList.push({ index: index, sentence: sentence });
//           }
//         });
//       }
//     });
//   });

//   namesList.sort((a: any, b: any) => {
//     return a.index - b.index;
//   });

//   return [
//     namesList[0] ? namesList[0].sentence : '',
//     namesList[1] ? namesList[1].sentence : '',
//     namesList[2] ? namesList[2].sentence : ''
//   ];
// }


// function getDates(sentences: Array<string>, luisResponse: any): Array<string> {
//   let dateList: Array<any> = [];

//   luisResponse.find((element: any) => {
//     element.entities.find((entity: any) => {
//       if (entity.type === 'Data' && entity.score >= 0.5) {
//         sentences.find((sentence: string, index: number): any => {
//           if (element.query === sentence) {
//             dateList.push({ index: index, entity: entity.entity });
//           }
//         });
//       }
//     });
//   });

//   dateList.sort((a: any, b: any) => {
//     return a.index - b.index;
//   });

//   return [
//     dateList[0] ? dateList[0].entity : '',
//     dateList[1] ? dateList[1].entity : ''
//   ];
// }


// function getDocument(luisResponse: any) {
//   let document: Array<any> = [];

//   luisResponse.find((element: any) => {
//     element.entities.find((entity: any) => {
//       if (entity.type === 'RG') {
//         document.push({ number: entity.entity, type: entity.type });
//       }
//     });
//   });
//   return document;
// }

