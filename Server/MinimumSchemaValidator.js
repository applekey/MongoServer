
var MinimumObject = {
    Imagelink: 'string',
    Id: 123
};

MinimumSchemaValidator = function(MinimumObject){
    this.minObject = MinimumObject;
    }

MinimumSchemaValidator.prototype.Validate = function(JsonObject, callback) {
    if (JsonObject === 'null') {
        callback('JsonObject is null');
        return;
    }

    for (var prop in this.minObject) {
        if (!HasOwnProperty(JsonObject, prop)) {
            callback('function does not have ' + prop);
            return;
        }
    }
    callback(null);
}

function HasOwnProperty(obj, prop){
    var proto = obj.__proto__ || obj.constructor.prototype;
    return (prop in obj) &&
        (!(prop in proto) || proto[prop] !== obj[prop]);
}

//Unit Tests

//var MyJsonObject = {
//    Imagelink: 'ab',
//    Id: 321,
//}
//
//var minValidator = new MinimumSchemaValidator(MinimumObject);
//minValidator.Validate(MyJsonObject, function(error) {
//    if (error) console.log(error);
//    else console.log('good');
//});

exports.MinimumSchemaValidator = MinimumSchemaValidator;