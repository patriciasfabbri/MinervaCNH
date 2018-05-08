"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customVisionAPI_1 = require("./../../azure-services/custom-vision-api/customVisionAPI");
const computerVisionAPI_1 = require("./../../azure-services/computer-vision-api/computerVisionAPI");
const luisAI_1 = require("./../../azure-services/luis-ai/luisAI");
const model_1 = require("./model");
class OCRController {
    ocr(subsCVSNPos, subsLUISPos, customerId, picture) {
        var instance = this;
        var customVisionAPI = new customVisionAPI_1.CustomVisionAPI();
        var computerVisionAPI = new computerVisionAPI_1.ComputerVisionAPI();
        var ocrModel = new model_1.OcrModel();
        return new Promise((resolve, reject) => {
            ocrModel.customerId = customerId;
            customVisionAPI.predictionModelOne(picture).then((predictionResponse) => {
                console.log('predictionResponse-----------------------');
                console.log(predictionResponse);
                console.log('-----------------------');
                ocrModel.properties.classification.documentType = predictionResponse.Predictions[0].Tag;
                ocrModel.properties.classification.documentTypeValue = predictionResponse.Predictions[0].Probability;
                if (ocrModel.properties.classification.documentType === 'RG VERSO' && ocrModel.properties.classification.documentTypeValue > 0.5) {
                    console.log('RG VERSO');
                    computerVisionAPI.ocr(picture).then((ocrResponse) => {
                        console.log('ocr(req).then((ocrResponse: any) => {');
                        let sentences = instance.createSentences(ocrResponse.regions);
                        if (sentences.length > 0) {
                            instance.luisSentencesAnalize(subsLUISPos, sentences).then((luisResponse) => {
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
                }
                else if ((ocrModel.properties.classification.documentType === 'RG FRENTE' && ocrModel.properties.classification.documentTypeValue > 0.5)
                    || (ocrModel.properties.classification.documentType === 'CNH VERSO' && ocrModel.properties.classification.documentTypeValue > 0.5)) {
                    console.log('RG FRENTE');
                    ocrModel.recommendation.status = true;
                    resolve(ocrModel);
                }
                else if (ocrModel.properties.classification.documentType === 'CNH FRENTE' && ocrModel.properties.classification.documentTypeValue > 0.5) {
                    console.log('CNH FRENTE');
                    computerVisionAPI.ocr(picture).then((ocrResponse) => {
                        console.log('OCR RESPONSE');
                        console.log(ocrResponse);
                        console.log('-------------');
                        let sentences = instance.createSentences(ocrResponse.regions);
                        if (sentences.length > 0) {
                            instance.luisSentencesAnalize(subsLUISPos, sentences).then((luisResponse) => {
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
                }
                else {
                    console.log('OTHER');
                    ocrModel.recommendation.status = false;
                    ocrModel.recommendation.reasons = ['content'];
                    ocrModel.properties.classification.documentType = 'OTHER';
                    ocrModel.properties.classification.documentTypeValue = 0;
                    computerVisionAPI.ocr(picture).then((ocrResponse) => {
                        let length = instance.contentLength(ocrResponse.regions);
                        if (instance.contentLengthValidationOther(length)) {
                            ocrModel.recommendation.status = true;
                            ocrModel.recommendation.reasons = [];
                        }
                        ocrModel.properties.content.length = length;
                        ocrModel.properties.content.score = 0;
                        resolve(ocrModel);
                    }).catch((error) => {
                        reject(error);
                    });
                }
            }).catch((error) => {
                reject(error);
            });
        });
    }
    getRecommendationStatus(score) {
        let recommendation = {};
        if (score >= 0.77) {
            recommendation = { status: true, reasons: [] };
        }
        else {
            recommendation = { status: false, reasons: ['content'] };
        }
        return recommendation;
    }
    documentType(predictions) {
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
    }
    ;
    createSentences(value) {
        let sentences = [];
        value.forEach((currentValue) => {
            return currentValue.lines.forEach((currentValue) => {
                var sentence = '';
                currentValue.words.forEach((currentValue) => {
                    sentence = sentence.concat(' ', currentValue.text);
                });
                sentence = sentence.slice(1);
                sentences.push(sentence);
            });
        });
        return sentences;
    }
    luisSentencesAnalize(subsLUISPos, sentences) {
        var luisAI = new luisAI_1.LUISAI();
        return new Promise((resolve, reject) => {
            let luisResponsesArray = [];
            sentences.forEach((element) => {
                luisAI.call(subsLUISPos, element).then((luisResponse) => {
                    luisResponsesArray.push(luisResponse);
                    if (luisResponsesArray.length === sentences.length) {
                        resolve(luisResponsesArray);
                    }
                }).catch((error) => {
                    reject(error);
                });
            });
        });
    }
    contentLength(value) {
        let accumulator = 0;
        value.forEach((currentValue) => {
            return currentValue.lines
                .forEach((currentValue) => {
                accumulator += 1;
                return currentValue.words
                    .forEach((currentValue) => {
                    accumulator += currentValue.text.length + 1;
                });
            });
        });
        return accumulator;
    }
    contentScore(value, luisResponse) {
        let cls = this.contentLengthScoreRG(value);
        let kws = this.keyWordScore(luisResponse);
        let pds = this.personDataScore(luisResponse);
        let result = (cls + kws + pds) / 100;
        return result;
    }
    contentLengthScoreRG(value) {
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
    contentLengthValidationCNH(value) {
        if (value < 180) {
            return false;
        }
        else {
            return true;
        }
    }
    contentLengthValidationOther(value) {
        if (value < 50) {
            return false;
        }
        else {
            return true;
        }
    }
    keyWordScore(luisResponse) {
        let score = 0;
        luisResponse.find((element) => {
            score += element.query.search(/TERRIT.RIO/) > -1 ? 1 : 0;
            score += element.query.search(/NOME/) > -1 ? 1 : 0;
            score += element.query.search(/FILIA..O/) > -1 ? 1 : 0;
            score += element.query.search(/NATURA.IDADE/) > -1 ? 1 : 0;
            score += element.query.search(/DATA/) > -1 ? 1 : 0;
        });
        return score;
    }
    removeIgnoredNode(value) {
        let validNodes = [];
        value.find((element, valueIndex) => {
            let validElement = false;
            element.entities.find((entityElement) => {
                if (entityElement.type !== 'Ignore') {
                    validElement = true;
                }
                else {
                }
            });
            if (validElement) {
                validNodes.push(element);
            }
        });
        return validNodes;
    }
    personDataScore(luisResponse) {
        let score = 0;
        let rgCount = 0;
        let dataCount = 0;
        let nomeCount = 0;
        luisResponse.find((element, valueIndex, array) => {
            element.entities.find((element) => {
                if (element.score >= 0.7) {
                    if (element.type === 'RG') {
                        rgCount += 1;
                    }
                    if (element.type === 'Data') {
                        dataCount += 1;
                    }
                    if (element.type === 'Nome') {
                        nomeCount += 1;
                    }
                }
            });
        });
        if (rgCount >= 1) {
            score += 11;
        }
        if (dataCount >= 1 && dataCount <= 2) {
            score += 11 * dataCount;
        }
        else if (dataCount > 2) {
            score += 11 * 2;
        }
        if (nomeCount >= 1 && nomeCount <= 3) {
            score += 11 * nomeCount;
        }
        else if (nomeCount > 3) {
            score += 11 * 3;
        }
        return score;
    }
    getPersonNames(sentences, luisResponse) {
        let namesList = [];
        luisResponse.find((element) => {
            element.entities.find((entity) => {
                if (entity.type === 'Nome') {
                    sentences.find((sentence, index) => {
                        if (sentence === element.query) {
                            namesList.push({ index: index, sentence: sentence });
                        }
                    });
                }
            });
        });
        namesList.sort((a, b) => {
            return a.index - b.index;
        });
        return [
            namesList[0] ? namesList[0].sentence : '',
            namesList[1] ? namesList[1].sentence : '',
            namesList[2] ? namesList[2].sentence : ''
        ];
    }
    getDates(sentences, luisResponse) {
        let dateList = [];
        luisResponse.find((element) => {
            element.entities.find((entity) => {
                if (entity.type === 'Data' && entity.score >= 0.5) {
                    sentences.find((sentence, index) => {
                        if (element.query === sentence) {
                            dateList.push({ index: index, entity: entity.entity });
                        }
                    });
                }
            });
        });
        dateList.sort((a, b) => {
            return a.index - b.index;
        });
        return [
            dateList[0] ? dateList[0].entity : '',
            dateList[1] ? dateList[1].entity : ''
        ];
    }
    getDocument(luisResponse) {
        let document = [];
        luisResponse.find((element) => {
            element.entities.find((entity) => {
                if (entity.type === 'RG') {
                    document.push({ number: entity.entity, type: entity.type });
                }
                else if (entity.type === 'CNH') {
                    document.push({ number: entity.entity, type: entity.type });
                }
            });
        });
        return document;
    }
    getRGCNH(luisResponse) {
        let RGCNH = [];
        luisResponse.find((element) => {
            element.entities.find((entity) => {
                if (entity.type === 'RGCNH8') {
                    RGCNH.push({ number: entity.entity, type: entity.type });
                }
                else if (entity.type === 'RGCNH9') {
                    RGCNH.push({ number: entity.entity, type: entity.type });
                }
            });
        });
        return RGCNH;
    }
}
exports.OCRController = OCRController;

//# sourceMappingURL=controller.js.map
