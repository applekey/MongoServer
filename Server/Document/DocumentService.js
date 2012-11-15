var DataProvider = require('../MongoProvider').DataProvider;
var MinSchemaValidator = require('../MinimumSchemaValidator').MinimumSchemaValidator;

var MinDocumentSchema = {
    Id: 123,
    LowResImageLink: 'LowResImageLink',
    HighResImageLink: 'HighResImageLink',
    DateInserted: new Date()
};

var collectionId = 'Mongo_Documents';

DocumentService = function() {
    this.DataProvider = new DataProvider('alex.mongohq.com', 10041);
};
DocumentService.prototype.CreateDocument = function(documentInformation, callback) {
    var thatDbProvider = this.DataProvider;
    ValidateDocumentInformation(documentInformation, function(error) {
        if (error) {
            callback(error);
            return;
        }
        thatDbProvider.save(collectionId, documentInformation, function(error) {
            if (error) {
                callback(error);
            }
            else {
                callback(null);
            }
        });
    });
}

DocumentService.prototype.RetrieveDocument = function(documentId, callback) {
    var thatDbProvider = this.DataProvider;

    if (typeof documentId !== 'number') {
        callback('error, document id is not of type number');
        return;
    }
    
    var findArgs = {Id: documentId};

    thatDbProvider.find(collectionId, findArgs, function(error, document) {
        if (error) {
            callback(error);
        }
        else {
            callback(null, document);
        }
    });
}



// PRIVATE METHODS
var ValidateDocumentInformation = function(documentInformation, callback) {
    var SchemaValidator = new MinSchemaValidator(MinDocumentSchema);
    SchemaValidator.Validate(documentInformation, function(error) {
        if (error) {
            callback(error);
            return;
        }
        
        if (typeof documentInformation.Id != 'number') {
            callback('id is not of number');
            return;

        }
        
          if (!documentInformation.DateInserted instanceof Date) {
            callback('Date is not of number');
            return;
        }
        
        if (isEmpty(documentInformation.LowResImageLink)) {
            callback('LowResImageLink is null or empty');
            return;
        }
        if (isEmpty(documentInformation.HighResImageLink)) {
            callback('HighResImageLink is null or empty');
            return;
        }
        callback(null);
    });
}

    function isEmpty(str) {
        return (!str || 0 === str.length);
    }
    
    
exports.DocumentService = DocumentService;