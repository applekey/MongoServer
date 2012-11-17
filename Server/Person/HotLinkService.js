

HotlinkService = function(DocumentService) {
    this.documentService = DocumentService;
}

HotlinkService.prototype.ConstructDocumentLinks = function(Person, callback) {
    var that = this;
    if (Person === null) {
        callback('person is null');
        return;
    }
    //var dbDocumentLinks = Person.DocumentIdLinks;

    //for now find documents
    this.documentService.GetFiveDummyIds(function(error, ids) {
        console.log(ids);
        if (error) callback(error);
        else {
            that.ReturnHotLinkUrl(ids, function(error, linkurls) {
                if (error) {
                    callback(error);
                }
                else {
                    callback(null, linkurls);
                }
            });
        }
    });
}
                
//// PRIVATE METHODS////

HotlinkService.prototype.ReturnHotLinkUrl = function(dbDocumentLinksObject,callback)
{
    if (dbDocumentLinksObject === null) {
        callback('dBDocumentLinkObject is null');
        return;
    }
    var documents =[];
    
    this.ForWaitLoop(0,dbDocumentLinksObject,documents,function(error,resultDoc){
        if(error){callback(error); return;}
        else {callback(null,resultDoc); return;}
        }); 
}
HotlinkService.prototype.ForWaitLoop = function(i,dbDocumentLinks,documents,callback) {
    var thatDocService = this.documentService;
    var thatself = this;

    if (i<dbDocumentLinks.length) {
        thatDocService.RetrieveDocument(dbDocumentLinks[i], function(error, document) {
            if (error) {
                documents.push(error);
            }
            else {
                documents.push(document);
            }
            return thatself.ForWaitLoop(i+1, dbDocumentLinks,documents, callback);
        });
    }
    else {
        callback(null,documents);
    }
}






exports.HotlinkService = HotlinkService;