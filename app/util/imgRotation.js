module.exports = function (buffer, degress = 0) {
    var retBuffer;
    if (degress == 0) {
        return buffer;
    }
    var Jimp = require('jimp');
    Jimp.read(buffer, function (err, image) {
        if (err)
            throw err;
        return image.rotate(degress, function (err, image) {
            if (err)
                throw err;
            image.quality(60, function (err, abuffer) {
                if (err)
                    throw err;
                image.getBuffer(image.getMIME(), function (err, abuffer) {
                    if (err)
                        throw err;
                    retBuffer = abuffer;
                });
            });
        });
    });
    return retBuffer;
};

//# sourceMappingURL=imgRotation.js.map
