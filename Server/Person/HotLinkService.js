

HotlinkService = function(DocumentService) {
    this.documentService = DocumentService;
    this.dbDocumentLinksObject =[];
}

HotlinkService.prototype.ConstructDocumentLinks = function(Person, callback) {
    if (Person === null) {
        callback('person is null');
        return;
    }
    this.ReturnHotLinkUrl(this.dbDocumentLinksObject, function(error, linkurls) {
        if (error) {
            callback(error);
        }
        else {
            callback(null, linkurls);
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
    var dummyLinks = ['ab','cd','ef','fg'];
    callback(null,dummyLinks);
    
}



exports.HotlinkService = HotlinkService;