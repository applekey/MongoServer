var Server = require('mongodb').Server;
var Db = require('mongodb').Db;


MongoConnector = function(){}

MongoConnector.GetConnection = function(serverAddress,port){
    
    return new Db('applekeyTest', new Server(serverAddress, port, {
        auto_reconnect: true
    }), {});
};

exports.MongoConnector = MongoConnector;