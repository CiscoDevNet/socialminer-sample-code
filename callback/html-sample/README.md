# Cisco SocialMiner - Callback (Agent Request API) Sample
_Sample web-based (javascript) application to illustrate SocialMiner Agent Request (Callback) APIs_

## Overview
The HTML Callback sample is intended to serve as an example of using the SocialMiner Callback API from Javascript.
   
This sample illustrates using both GET and POST methods to initiate callbacks, using GET to poll for callback status (including estimated wait time), and using DELETE to cancel callbacks.

This sample also includes a node-based HTTP proxy. This proxy serves up the callback html page and proxies the callback API to work around Cross Origin Resource Sharing (CORS) issues that would otherwise prevent the user from experimenting with the callback HTML page. (**NOTE:** The proxy is needed only for SocialMiner versions 11.5 and older. Starting SocialMiner 11.6, CORS support is fully implemented for callback APIs)

## Pre-requisites
- SocialMiner and PCCE/UCCE installed and the Agent Request Feature configured (Follow the directions in the _"Agent Request"_ section of [CCE Optional Features Guide](https://developer.cisco.com/site/packaged-contact-center/documentation/)).

- A registered, online customer phone that is reachable from a CCE agent.

- The ID of the callback feed configured to process callback requests. The ID can be obtained using the following SocialMiner REST API:
    ```
    http://<socialMiner>/ccp-webapp/ccp/feed
    ```
    This REST API will list XML for each feed configured on SocialMiner. Feeds with type `10` are callback feeds. The name given when the feed was configured is also listed. This is the easiest way to find the XML for`the callback feed. Here is some sample output from the feed API:
    ```xml
    <feeds>
    <Feed>
        <changeStamp>0</changeStamp>
        <name>Callback</name>
        <pushFeedURL>http://<socialMiner>/ccp/callback/feed/101212</pushFeedURL>
        <refURL>http://<socialMiner>/ccp-webapp/ccp/feed/101212</refURL>
        <status>1</status>
        <tags>
        <tag>callback</tag>
        </tags>
        <type>10</type>
    </Feed>
    ...
    </feeds>
    ```
    The ID of the feed is the number at the end of the `refURL` field. In this
    example, the ID is `101212`.

- Install [Node.js](https://nodejs.org/)

### Configuring Node.js
Run these steps to ensure node.js has the necessary dependencies to run the proxy.
- Change directory to `<zipDirectory>/callback-html-sample/node`. 

    `<zipDirectory>` is the directory in which the sample was extracted.

- Run the following command to install dependencies:
    ```
    npm install
    ```   
- At this point, `node` has the dependencies it needs to serve up the callback html page as well as proxy the SocialMiner callback API request.

## Running
- Open a terminal and change directory to `<zipDirectory>/callback-html-sample/node`

- Run the following command:
    ```
    node CallbackProxy.js --host <socialMinerHost>
    ```

- Open the following URL in your browser: http://localhost:8080/callback.html
    
    Port **8080** is the default setting for `API_PROXY_LISTEN_PORT` in `CallbackProxy.js`.
    
    If you changed `API_PROXY_LISTEN_PORT`, use the new setting in the URL.

- Enter a Title, Name, and Phone on the form presented in your browser.

- Enter the ID of the callback feed that is configured to process callback contacts. This ID can be obtained using SocialMiner's Feed API. Please see the pre-requisites section of this document for further details on retrieving the feed ID.

- Optionally, enter call variables.

- Optionally enter an ECC variable. By default, this sample uses the `user.test.callback` ECC variable. The sample can be modified to use an ECC variable configured in your deployment.

- Click _**"Call me back"**_

- If everything is configured properly, you will see the UI display the message _**"Finding the right agent for your request."**_

- If estimated wait time is configured, it will be displayed.

- When an agent is found, the UI displays the message _**"Agent found for your request. Expect a phone call shortly."**_

## Modifying / Extending
The sample uses `GET` to initiate callback requests. This can be changed by modifying the callback.html file in the `<extractedSampleDir>/html` directory. Search for the string `var useGet`. You will see that the variable `useGet` is set to `true`. Changing this setting to `false` will make the application use `POST` to initiate callback requests.

The `callbackUsingHTTPGet()` funciton illustrates how to use `GET` to initiate a callback. The `callbackUsingHTTPPost()` illustrates how to use `POST` to initiate a callback.

To change the callback ECC variable, search for `user_user.test.callback`. If you are using `GET` to initiate callbacks, change the `user_user.test.callback` string in the `if ( useGet )` block to match the ECC variable configured in your deployment. For example, a deployment with the variable `user.accountNumber` would change `user_user.test.callback` to `user_user.accountNumber`.

If you are using `POST` to initiate callbacks, modify the else portion of the `if ( useGet )` block.

## Disclaimer
This callback sample is made available to Cisco partners and customers _as a convenience to help minimize the cost of Cisco SocialMiner customizations._ Please refer [SocialMiner Developer's Guide](https://developer.cisco.com/site/socialminer/documentation/) for further details about the callback API. Please see the _"Agent Request"_ section of [CCE Optional Features Guide](https://developer.cisco.com/site/packaged-contact-center/documentation/) for UCCE and PCCE for instructions on deploying CCE Agent Request Feature using SocialMiner Callback API.

This is only a sample and is NOT intended to be a production quality application and will not be supported as such. It is NOT guaranteed to be bug free. It is merely provided as a guide for 3rd-party developers on best practices and usage of the SocialMiner RESTful APIs and is not intended for production use "as is".

Cisco's responsibility and liability on this code is limited ONLY to the correctness and accuracy on the usage of the RESTful API interface and the quality of the RESTful API interface itself. Any omissions from this example are not to be considered capabilities that are supported or not supported by the product.

For specific capabilities refer to the documentation that accompanies the latest Cisco SocialMiner release and/or request help from [DevNet](http://developer.cisco.com) or the Cisco Technical Assistance Center (TAC).

## Support Notice
DevNet provides sample support on a “best effort” basis. Like any custom deployment, it is the responsibility of the partner and/or customer to ensure that the customization works correctly. Cisco reserves the right to make changes to APIs and any other published interfaces as part of the normal Cisco SocialMiner release cycle.

https://developer.cisco.com/site/socialminer/overview/