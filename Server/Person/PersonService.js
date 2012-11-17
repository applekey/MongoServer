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

    this.ValidateLoginInformation(loginInformation, function(error) {
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
    var that = this;

    this.ValidateLoginInformation(loginInformation, function(error) {
        if (error) {
            callback(error);
            return;
        }

       
        var findArgs = {UserName:loginInformation.UserName};

        thatDbProvider.find(collectionId, findArgs, function(error, InternalAccount) {
            if (error) {
                callback(error);
            }
            else {
                if (InternalAccount.Password !== loginInformation.Password) {
                    callback('invalid username or password');
                }
                
                thatLinkService.ConstructDocumentLinks(InternalAccount, function(error, linkurls) {

                    if (error) {
                        callback(error);
                    }
                    else {
                        that.ConstructClientResponse(InternalAccount,linkurls,function(error,response){
                            
                            if(error){callback(error);return;}
                            else {callback(null,response);}
                            });
                    }
                });
            }
            });
    });
}
// PRIVATE METHODS

PersonService.prototype.ConstructClientResponse = function(InternalAccount, DocLinks,callback) {
    if (!InternalAccount) {
        callback('internal account is null');
        return;
    }
    if (!DocLinks) {
        callback('links is null');
        return;
    }
    
    var abrigedLinks = [];
    for(var i in DocLinks)
    {
        var linkObj = {LowResLink:DocLinks[i].LowResImageLink,HighResLink:DocLinks[i].HighResImageLink};
        abrigedLinks.push(linkObj);
    }
    
    
    var response = {UserName:InternalAccount.UserName,Links:abrigedLinks};
    callback(null,response);
}

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