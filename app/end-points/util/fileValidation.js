"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errs = require('restify-errors');
class FileValidation {
    requestValidation(req) {
        var msg = 'Missing parameter. header { Content-Type: application/json }. body: { picture: \'data:image/png;base64,/9j/4AAQSkZJRgABAgEASABIAAD/2wBDAAgG...\', customerId: \'2343498274\' }. Valid file type. jpg / jpeg / png ';
        if (!req.body) {
            return new errs.InternalServerError(msg);
        }
        if (!req.body.customerId || !req.body.picture || !(req.body.picture.split(',').length > 1)) {
            return new errs.InternalServerError(msg);
        }
        if (req.body.picture.split(',').length > 1) {
            var picData = req.body.picture.split(',');
            if (picData[0].toLowerCase().indexOf('image/jpg') == -1 && picData[0].toLowerCase().indexOf('image/jpeg') == -1 && picData[0].toLowerCase().indexOf('image/png') == -1) {
                return new errs.InternalServerError('Invalid file type. jpg / jpeg / png ');
            }
        }
        return 'no-errors';
    }
}
exports.FileValidation = FileValidation;

//# sourceMappingURL=fileValidation.js.map
