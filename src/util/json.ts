module.exports = function (json: any): boolean {
    let isJson: boolean;

    try {
        JSON.parse(json);
        isJson = true;
    } catch (ex) {
        isJson = false;
    }
    return isJson;

}
