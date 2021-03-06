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


PersonService.prototype.FormResponse = function(loginInformation, callback) {

    var thatLinkService = this.HotlinkService;
    var that = this;

    this.LoginWithCredentials(loginInformation, function(error, InternalAccount) {
        
        if(error) callback(error);

        thatLinkService.ConstructDocumentLinks(InternalAccount, function(error, linkurls) {

            if (error) {
                callback(error);
            }
            else {
                that.ConstructClientResponse(InternalAccount, linkurls, function(error, response) {

                    if (error) {
                        callback(error);
                        return;
                    }
                    else {
                        callback(null, response);
                    }
                });
            }
        });
    });
}


    

PersonService.prototype.LoginWithCredentials = function(loginInformation, callback)
{
    var thatDbProvider= this.DataProvider;
  
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
                else
                {
                    callback(null,InternalAccount);
                }
            }
        });
    });
}       


PersonService.prototype.UploadNewDocuments = function(loginInformation, doc, callback) {
    var thatDocumentService = this.DocumentService;
    this.LoginWithCredentials(loginInformation, function(error, InternalAccount) {

        if (error) {
            callback(error);
            return;
        }
        doc.UserId = InternalAccount._id;

        thatDocumentService.CreateDocument(doc, function(error) {
            if (error) {
                callback(error);
                return;
            }
            else {
                callback(null);
                return;
            }
        });
    });
}

PersonService.prototype.UpvoteDocument = function(votePackage, callback) {

    var docService = this.DocumentService;
    if (!votePackage) {
        callback('vote package is emtyp');
        return;
    }

    var logingCred = votePackage.LoginCred;
    var documentId = votePackage.DocId;
    var voteDirection = votePackage.VoteDirection;

    if (typeof logingCred === 'undefined') {
        callback('logingCred is empty');
        return;
    }
    
    if(typeof documentId === 'undefinied')
    {
        callback('documentid is empty');
        return;
    }
    
    if(typeof voteDirection === 'undefinied')
    {
        callback('vote is undefined in package');
        return;
    }

    this.LoginWithCredentials(logingCred, function(error, InternalAccount) {
        if (error) {
            callback(error);
            return;
        }
        
        var vote = { Voter: InternalAccount._id, Direction: voteDirection}
        
        docService.UpdateVoteCount(documentId, vote, function(error) {
            if (error) {
                callback(error);
                return;
            }
            else {
                callback(null);
                return;
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
        var voteCount = calculateVotes(DocLinks[i].Votes);
        
        var linkObj = {
            Id:DocLinks[i]._id,
            Votes:voteCount,
            LowResImageLink: DocLinks[i].LowResImageLink,
            HighResImageLink: DocLinks[i].HighResImageLink
        };
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

function calculateVotes(votes)
{
    var voteCount = 0;
    if(!votes)
        return 0;
    
    for(var i in votes)
    {
        var direction = votes[i].Direction;
        if(typeof direction !=='undefined')
            voteCount +=votes[i].Direction;
    }
    return voteCount;
}

exports.PersonService = PersonService;