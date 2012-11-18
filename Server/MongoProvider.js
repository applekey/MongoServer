var mongodb = require('mongodb');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var MongoConnector = require('./MongoConnector').MongoConnector;


// PUBLIC METHODS
DataProvider = function(host, port) {
    this.db = MongoConnector.GetConnection(host, port);
}


DataProvider.prototype.findFive = function(collectionId, callback)
{
    var thatdb = this.db;
    Open(thatdb, function(error) {
        if (error) {
            //thatdb.close();
            callback(error);
            return;
        }
        var collection = new mongodb.Collection(thatdb, collectionId);
        collection.find({}, {
            limit: 5
        }).toArray( function(err, docs){
            if (error) {
                //thatdb.close();
                callback(err);
            }
            else
            {
             //thatdb.close();
             callback(null,docs);
            }
        });
    })
}


DataProvider.prototype.find = function(collectionId, findargs, callback) {

    var thatdb = this.db;
    Open(thatdb, function(error) {
        if (error) {
            //thatdb.close();
            callback(error);
            return;
        }
        var collection = new mongodb.Collection(thatdb, collectionId);
        collection.findOne(findargs,function(err, docs) {
            if (error) {
                //thatdb.close();
                callback(err);
            }
            else
            {
             //thatdb.close();
             callback(null,docs);
            }
        });
    })
}




DataProvider.prototype.findAll = function(collectionId, callback) {

    var thatdb = this.db;
    Open(thatdb, function(error) {
        if (error) {
            //thatdb.close();
            callback(error);
            return;
        }
        var collection = new mongodb.Collection(thatdb, collectionId);
        collection.find({}, {
            limit: 10
        }).toArray(function(err, docs) {
            if (error) {
                //thatdb.close();
                callback(err);
                return;
            }
            console.dir(docs);
            //thatdb.close();
            callback(null, docs);
        });
    });
};

DataProvider.prototype.updateField= function(collectionId,docId,updateField,callback)
{
    var that = this;
    var thatdb = this.db;
    Open(thatdb, function(error) {
        if (error) {
            //thatdb.close();
            callback
            (error);
            return;
        }
        
        var collection = new mongodb.Collection(thatdb, collectionId);
        collection.update(docId, updateField, function(error) {
            if (error) {
                //thatdb.close();
                callback(error);
                return;
            }
            else {
                //thatdb.close();
                callback(null);
            }
        });
    });
    
}


DataProvider.prototype.save = function(collectionId, item, callback) {
    var thatdb = this.db;
    Open(thatdb, function(error) {
        if (error) {
            //thatdb.close();
            callback
            (error);
            return;
        }
        var collection = new mongodb.Collection(thatdb, collectionId);
        collection.insert(item, null, function(error) {
            if (error) {
                //thatdb.close();
                callback(error);
                return;
            }
            else {
                //thatdb.close();
                callback(null);
            }
        });
    });
}

DataProvider.prototype.deleteall = function(collectionId, callback) {
    var thatdb = this.db;
    Open(thatdb, function(error) {
        if (error) {
            //thatdb.close();
            callback(error);
            return;
        }

        var collection = new mongodb.Collection(thatdb, collectionId);
        collection.remove(function(error) {
            if (error) {
                //thatdb.close();
                callback(error);
            }
            else {
                //thatdb.close();
                callback(null, 'removedall')
            };

        });

    });
}





// PRIVATE METHODS
// TODO MAKE THESE ACTUALLY PRIVATE

DataProvider.prototype.ConstructObjecId = function(id)
{
    var m = String(id);
    console.log('id is'+ m);
    var len = m.length;
    
    return mongodb.ObjectID.createFromHexString(m);
}


var Open = function(mdb, callback) {

    if (IsOpen(mdb)) {
        console.log('db is open');
        callback(null);
        return;
    }
    console.log('openingdb');
    
    mdb.open(function(err, client) {
        if (err) {
            callback(err);
            return;
        }

        mdb.authenticate('applekey', 'poppy222', function(err) {
            if (err) callback('couldnt authemticate');
            else callback(null);
        });
    });
}

var IsOpen = function(mdb) {
    if (mdb._state === 'connected') return true;
    else return false;
}

exports.DataProvider = DataProvider;
