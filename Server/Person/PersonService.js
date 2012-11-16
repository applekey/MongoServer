var DataProvider = require('../MongoProvider').DataProvider;
var MinSchemaValidator = require('../MinimumSchemaValidator').MinimumSchemaValidator;
var HotLinkService = require('./HotLinkService').HotlinkService;
var DocumentService = require('../Document/DocumentService').DocumentService;

var MinLoginInformation = {
    UserName: 'Username',
    Password: 'Password'
};

var collectionId = 'Mongo_Users';

PersonService = function() {
    this.DataProvider = new DataProvider('alex.mongohq.com', 10041);
    this.SchemaValidator = new MinSchemaValidator(MinLoginInformation);
    this.DocumentService = new DocumentService();
    this.HotlinkService = new HotLinkService(this.DocumentService);
}   

PersonService.prototype.CreateLogin = function(loginInformation, callback) {

    var thatDbProvider = this.DataProvider;

    ValidateLoginInformation(loginInformation, function(error) {
        if (error) {
            callback(error);
            return;
        }
        thatDbProvider.save(collectionId, loginInformation, function(error) {

            if (error) {
                callback(error);
            }
            else {
                callback(null);
            }
        });
    });
}


PersonService.prototype.Login = function(loginInformation, callback) {
    var thatDbProvider= this.DataProvider;
    var thatLinkService = this.HotlinkService;

    this.ValidateLoginInformation(loginInformation, function(error) {
        if (error) {
            callback(error);
            return;
        }

       
        var findArgs = {UserName:loginInformation.UserName};

        thatDbProvider.find(collectionId, findArgs, function(error, account) {
            if (error) {
                callback(error);
            }
            else {
                thatLinkService.ConstructDocumentLinks(account, function(error, linkurls) {

                    if (error) {
                        callback(error);
                    }
                    else {
                        var fullAccount=[account,linkurls];
                        
                        callback(null, fullAccount);
                    }
                });
            }
            });
    });
}
// PRIVATE METHODS

PersonService.prototype.ValidateLoginInformation = function(loginInformation,callback)
{
    this.SchemaValidator.Validate(loginInformation, function(error) {
        if (error) {
            callback(error);
            return;
        }

        if (isEmpty(loginInformation.UserName)) {
            callback('login information is null or empty');
            return;
        }
        
        if (isEmpty(loginInformation.Password)) {
            callback('password information is null or empty');
            return;
        }
        callback(null);
    });

}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

exports.PersonService = PersonService;