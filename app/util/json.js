module.exports = function (json) {
    let isJson;
    try {
        JSON.parse(json);
        isJson = true;
    }
    catch (ex) {
        isJson = false;
    }
    return isJson;
};

//# sourceMappingURL=json.js.map
