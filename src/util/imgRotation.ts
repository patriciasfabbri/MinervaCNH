module.exports = function (buffer: any, degress = 0) {
    // console.log('jimp');
    var retBuffer;

    if (degress == 0) {
        return buffer;
    }

    var Jimp = require('jimp');

    // Jimp.read(buffer, function (err: any, image: any) {
    //     if (err) throw err;
    //     image.rotate(degress)
    //         .quality(60)
    //         .write("C:/Projetos/SantanderCort/santandercortanaapi/testinterno.jpg");
    // });

    Jimp.read(buffer, function (err: any, image: any) {
        if (err) throw err;
        return image.rotate(degress, function (err: any, image: any) {
            if (err) throw err;
            image.quality(60, function (err: any, abuffer: any) {
                if (err) throw err;
                image.getBuffer(image.getMIME(), function (err: any, abuffer: any) {
                    if (err) throw err;
                    retBuffer = abuffer;
                });
            });
        })
    });

    return retBuffer;
}

