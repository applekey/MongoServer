/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path');
var app = express();
var DataProvider = require('./MongoProvider').DataProvider;
var PersonService = require('./Person/PersonService').PersonService;
var DocumentService = require('./Document/DocumentService').DocumentService;

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
    app.use(express.errorHandler());
});

var dataProvider = new DataProvider('alex.mongohq.com', 10041);
var personService = new PersonService();
var documentService = new DocumentService();

var collectionId = String('vcTest');

var doc = {
    ImageId: 'ab',
    ImageLink: 'http://i.imgur.com/YmeSA.jpg'
};

app.get('/save', function(req, res) {
    dataProvider.save(collectionId, doc, function(a) {
        if (a) res.send('bad');
        else res.send('good');
    })
});

app.get('/getall', function(req, res) {
    var item = req.body;
    dataProvider.findAll(collectionId, function(error, result) {
        if (!error) res.send(result);
        else res.send('error');
    });
});

app.get('/deleteall', function(req, res) {
    dataProvider.deleteall(collectionId, function(error, response) {
        if (error) res.send('delete all failed');
        else res.send(response);
    });
});


app.post('/echo', function(request, res) {
    var requestObject = request.body;
    var contact = eval(requestObject);
    dataProvider.save(collectionId, contact, function(a) {
        if (a) res.send('bad');
        else res.send('good');
    })
});

///////////////////////////////////////////////////// Create User 

app.get('/AddUser', function(req, res) {
    //var requestObject = req.body;
    //var contact = eval(requestObject);

    var loginInformation = {
        UserName: 'Username',
        Password: 'Password',
        Links: 'links'
    }


    personService.CreateLogin(loginInformation, function(a) {
        if (a) res.send('bad');
        else res.send('good');
    })
});

app.get('/GetUser', function(req, res) {
    //var requestObject = req.body;
    //var contact = eval(requestObject);

    var loginInformation = {
        UserName: 'Username',
        Password: 'Password'
    }

    personService.Login(loginInformation, function(a, user) {
        if (a) res.send('bad');
        else res.send(user);
    })
});




/////////////////////////////////////CreateDocument

app.get('/DeleteAllDocuments', function(req, res) {
    dataProvider.deleteall('Mongo_Documents', function(error, response) {
        if (error) res.send('delete all failed');
        else res.send(response);
    });
});

app.get('/SaveDocument', function(req, res) {
    //var requestObject = req.body;
    //var contact = eval(requestObject);

    var DummyDocument = {
        Id: 123,
        LowResImageLink: 'LowResImageLink',
        HighResImageLink: 'HighResImageLink',
        DateInserted: new Date()
    };


    documentService.CreateDocument(DummyDocument, function(error) {
        if (error) res.send(error);
        else res.send('succesfully created document');
    })
});

app.get('/GetDocument', function(req, res) {
    //var requestObject = req.body;
    //var contact = eval(requestObject);

    var documentId = 123;


    documentService.RetrieveDocument(documentId, function(error, document) {
        if (error) res.send(error);
        else res.send(document);
    })
});



/////////////////////////////////////////////////////////////

http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});
