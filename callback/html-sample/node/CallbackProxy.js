/**
 Cisco SocialMiner - Simple HTTP Proxy to enable testing of the SocialMiner callback HTML
 form.

 Version 10.0(1)
 Cisco Systems, Inc.
 http://www.cisco.com/

 Portions created or assigned to Cisco Systems, Inc. are
 Copyright (c) 2013 Cisco Systems, Inc. or its affiliated entities.  All Rights Reserved.

 This javascript library is made available to Cisco partners and customers as
 a convenience to help minimize the cost of Cisco SocialMiner customizations.
 This library can be used in Cisco SocialMiner deployments.  Cisco does not
 permit the use of this library in customer deployments that do not include
 Cisco SocialMiner.  Support for the javascript library is provided on a
 "best effort" basis via CDN.  Like any custom deployment, it is the
 responsibility of the partner and/or customer to ensure that the
 customization works correctly and this includes ensuring that the Cisco
 SocialMiner JavaScript is properly integrated into 3rd party applications.
 Cisco reserves the right to make changes to the javascript code and
 corresponding API as part of the normal Cisco SocialMiner release cycle.  The
 implication of this is that new versions of the javascript might be
 incompatible with applications built on older SocialMiner integrations.  That
 said, it is Cisco's intention to ensure javascript compatibility across
 versions as much as possible and Cisco will make every effort to clearly
 document any differences in the javascript across versions in the event
 that a backwards compatibility impacting change is made.
**/

var SOCIAL_MINER_PORT           = 80;

var STATIC_CONTENT_LISTEN_PORT  = 8082;
var API_PROXY_LISTEN_PORT  = 8080;

var http = require('http'), httpProxy = require('http-proxy'), static = require('node-static'),
  argv = require('optimist')
    .usage('usage: $0 --host socialMiner')
    .demand(['host'])
    .argv;

var socialMinerHost = argv.host;

console.log('Proxying API requests for ' + socialMinerHost);

var fileServer = new static.Server('../html');

// Create a simple server to serve up the callback.html page.
//
var staticContentServer = http.createServer(function (request, response)
{
    request.addListener('end', function ()
    {
        fileServer.serve(request, response);
    }).resume();

}).listen(STATIC_CONTENT_LISTEN_PORT);

staticContentServer.on('error', function (e) {
  if (e.code == 'EADDRINUSE') {
    console.log('ERROR:  The port: '+ STATIC_CONTENT_LISTEN_PORT +' is currently occupied. Please change STATIC_CONTENT_LISTEN_PORT to free port');
    process.exit();
    
  }
});

staticContentServer.on('listening', function () {
	console.log('Static content server listening on ' + STATIC_CONTENT_LISTEN_PORT);
});

// Create a proxy to proxy requests for the callback.html page as well as API
// requests to SocialMiner.
//
var proxy = new httpProxy.RoutingProxy();

var proxyServer =  http.createServer(function(request, response)
{
  console.log('Request url: ' + request.url);
  targetHost = '127.0.0.1';
  targetPort = STATIC_CONTENT_LISTEN_PORT;
  if ( request.url && (request.url.indexOf('/ccp/') === 0) )
  {
    // Any requests that start with /ccp/ are deemed API requests and are directed to SocialMiner.
    //
    targetHost = socialMinerHost;
    targetPort = SOCIAL_MINER_PORT;
  }

  console.log('Target host: ' + targetHost);
  console.log('Target port: ' + targetPort);
  proxy.proxyRequest(request, response,
  {
    host: targetHost,
    port: targetPort
  });
}).listen(API_PROXY_LISTEN_PORT);

proxyServer.on('error', function (e) {
  if (e.code == 'EADDRINUSE') {
    console.log('ERROR:  The port: '+ API_PROXY_LISTEN_PORT +' is currently occupied. Please change API_PROXY_LISTEN_PORT to free port');
    process.exit();
    
  }
});

proxyServer.on('listening', function () {
	console.log('SocialMiner API proxy listening on ' + API_PROXY_LISTEN_PORT);
});