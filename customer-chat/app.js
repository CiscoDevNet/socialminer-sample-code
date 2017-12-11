var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var routes = require('./routes/index');
var parseArgs = require('minimist');

var argv = parseArgs(process.argv, { string: "socialminer" });
if ( !argv.socialminer )
{
    process.stderr.write("usage: node app.js --socialminer <socialminerIpOrHost>\n");
    process.exit(-1);
}

var socialMiner = "http://" + argv.socialminer;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

app.get("/ccp/chat", function(req, response)
{
    var get = request.get(
        {
            url: socialMiner + "/ccp/chat?eventid=" + req.query.eventid,
            headers: req.headers,
            cookies: req.cookies
        });

    req.pipe(get).pipe(response);
});

app.put("/ccp/chat", function(req, response)
{
    var put = request.put(
        {
            url: socialMiner + "/ccp/chat/",
            headers: req.headers,
            cookies: req.cookies,
            body: req.rawBody
        });

    req.pipe(put).pipe(response);
});

app.put("/ccp/chat/leaveChat", function(req, response)
{
    var put = request.put(
        {
            url: socialMiner + "/ccp/chat/leaveChat",
            headers: req.headers,
            cookies: req.cookies
        });

    req.pipe(put).pipe(response);
});

app.put("/ccp/chat/event", function(req, response)
{
    var put = request.put(
        {
            url: socialMiner + "/ccp/chat/event",
            headers: req.headers,
            cookies: req.cookies
        });

    req.pipe(put).pipe(response);
});

app.post("/ccp/chat", function(req, response)
{
    var post = request.post(
        {
            url: socialMiner + "/ccp/chat/",
            headers: req.headers,
            cookies: req.cookies,
            body: req.rawBody
        });

    req.pipe(post).pipe(response);
});

app.get("/ccp/chat/transcript.pdf", function(req, response)
{
    var url = "/ccp/chat/transcript.pdf" + (req.query.locale ? "?locale=" + req.query.locale : ""),
    get = request.get(
        {
            url: socialMiner + url,
            headers: req.headers,
            cookies: req.cookies
        });

    req.pipe(get).pipe(response);
});

app.use(function(req, res, next)
{
    req.rawBody = '';
    req.setEncoding('utf8');

    req.on('data', function(chunk)
    {
        req.rawBody += chunk;
    });

    req.on('end', function()
    {
        next();
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next)
{
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development')
{
    app.use(function(err, req, res, next)
    {
        res.status(err.status || 500);
        res.render('error',
        {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next)
{
    res.status(err.status || 500);
    res.render('error',
    {
        message: err.message,
        error: {}
    });
});

var server = app.listen(8080, function()
{
    console.log("listening on port " + server.address().port);
});