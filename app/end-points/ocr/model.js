"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OcrModel {
    constructor() {
        this.customerId = '';
        this.recommendation = {
            status: true,
            reasons: []
        };
        this.properties = {
            classification: {
                documentType: '',
                documentTypeValue: -1
            },
            content: {
                length: -1,
                score: -1
            },
            entities: {
                name: [],
                date: [],
                document: {},
                RGCNH: {}
            }
        };
    }
}
exports.OcrModel = OcrModel;

//# sourceMappingURL=model.js.map
