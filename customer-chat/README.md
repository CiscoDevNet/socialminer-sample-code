# Cisco SocialMiner - Customer-side Chat Client Sample
_Sample javascript (Node.js) based chat client application to illustrate the use of SocialMiner Chat APIs_

## Overview
The Customer-side Chat Client Sample is intended to serve as an example of using SocialMiner Chat REST APIs from a server-side javascript (Node.js) application.

This sample illustrates the use of the following REST APIs:
- `POST` to initiate chat sessions
- `GET` to poll for chat events
- `PUT` to send chat messages
- `DELETE` to end the chat session
- `GET` to download chat transcripts

This sample also includes a node-based HTTP proxy. This proxy serves up the callback html page and proxies the callback API to work around Cross Origin Resource Sharing (CORS) issues that would otherwise prevent the user from experimenting with the chat HTML page. (**NOTE:** The proxy is needed only for SocialMiner versions 11.5 and older. Starting SocialMiner 11.6, CORS support is fully implemented for chat APIs)

## Pre-requisites
- SocialMiner server integrated with Unified CCX cluster with the approprtiate licenses. Multi-session web chat feature should be configured on Unified CCX Administration. (Please refer [Unified CCX Administration Guide](https://www.cisco.com/c/en/us/support/customer-collaboration/unified-contact-center-express/products-installation-and-configuration-guides-list.html))

- The reference URL of the chat feed configured to process chat requests. The ID can be obtained using the following SocialMiner REST API:
    ```
    http://<socialMiner>/ccp-webapp/ccp/feed
    ```
    
    This REST API will list XML for each feed configured on SocialMiner. Feeds with type `8` are chat feeds. The name given when the feed was configured is also listed. This is the easiest way to find the XML for the chat feed. Here is some sample output from the feed API:
    ```xml
    <feeds>
    <Feed>
        <changeStamp>3</changeStamp>
        <chatInactivityTimeout>300</chatInactivityTimeout>
        <chatJoinTimeout>60</chatJoinTimeout>
        <description>
            Created by CCX application as part of CCX chat configuration.
        </description>
        <name>CCX Chat Feed</name>
        <pollingInterval>0</pollingInterval>
        <pushFeedURL>
            http://socialminer/ccp-webapp/ccp/chatfeed/100053
        </pushFeedURL>
        <refURL>
            http://socialminer/ccp-webapp/ccp/feed/100053
        </refURL>
        <replyTemplateRefURL>
            http://socialminer/ccp-webapp/ccp/template/reply/303
        </replyTemplateRefURL>
        <status>1</status>
        <tags>
            <tag>ccx_chat_req</tag>
        </tags>
        <type>8</type>
    </Feed>
    ...
    </feeds>
    ```
     The reference URL of the feed is the value inside the refURL tags. In this example, the refURL is `http://socialminer/ccp-webapp/ccp/feed/100053`

- Install [Node.js](https://nodejs.org/)

### Configuring Node.js
Run these steps to ensure node.js has the necessary dependencies to run the HTTP server.
- Change directory to `<zipDirectory>/customer-chat/`.  
    `<zipDirectory>` is the directory in which the sample was extracted.

- Run the following command to install dependencies:
    ```
    npm install
    ```

## Running
### Configuration
- Using a REST API client, invoke the following SocialMiner API:
    ```
    GET https://<socialMiner>/ccp-webapp/ccp/feed
    ```
    You will have to provide basic authorization credentials (SocialMiner administrator username and password) and set the header `Accept: application/xml` in your request.

- The response payload contains an XML listing all feeds configured in this SocialMiner. Look for the specfic `CCX Chat Feed`, and note its `refURL` value.
    ```xml
    <feeds>
        <Feed>
        ...
            <name>CCX Chat Feed</name>
            <type>8</type>
            <refURL>
                http://socialminer/ccp-webapp/ccp/feed/100053
            </refURL>
        ...
        </Feed>
    </feeds>
    ```

- Edit [public/chat.html](public/chat.html), and replace `<chatFeedRefUrl>` with the `refURL` value of the chat feed collected in the previous step.

- In CCX Administration, go to **_Subsystems --> Chat and Email --> Chat Widget List_** and open the specific chat widget HTML code of your configured web chat widget form.

- In this HTML code, find `extensionField_ccxqueuetag` and copy the options (under the `<select>` tag). In [public/chat.html](public/chat.html), find the placeholder string `<!-- options -->` and replace it with the copied options.

- Ensure all changes are saved.

### Launch
- Open a terminal and change directory to `<zipDirectory>/customer-chat/`

- Run the following command:
    ```
    node app.js --socialminer <socialMinerHostOrIp>
    ```
    where `<socialMinerHostOrIp>` is the hostname or IP address of SocialMiner.

- Open the following URL in a browser: **http://localhost:8080/chat.html**

- Enter the details in the form and submit it.

The UI will transition to a waiting screen and then to a chat screen when the agent accepts the chat. When the chat completes, the customer has the option to download a transcript if the customer and the agent exchanged messages.

## Disclaimer
This sample should act as a guide for a programmer to understand how to initiate and manage the customer-side of a chat session. Please refer [SocialMiner Developer's Guide](https://developer.cisco.com/site/socialminer/documentation/) for further details about the chat APIs. Please see the _"Web Chat"_ section of [Unified CCX Configuration Guides](https://developer.cisco.com/site/contact-center-express/docs/) for instructions on deploying Unified CCX Web Chat Feature using SocialMiner Chat APIs.

This is only a sample and is NOT intended to be a production quality application and will not be supported as such. It is NOT guaranteed to be bug free. It is merely provided as a guide for 3rd-party developers on best practices and usage of the SocialMiner RESTful APIs and is not intended for production use "as is".

Cisco's responsibility and liability on this code is limited ONLY to the correctness and accuracy on the usage of the RESTful API interface and the quality of the RESTful API interface itself. Any omissions from this example are not to be considered capabilities that are supported or not supported by the product.

For specific capabilities refer to the documentation that accompanies the latest Cisco SocialMiner release and/or request help from [DevNet](http://developer.cisco.com) or the Cisco Technical Assistance Center (TAC).

## Support Notice
DevNet provides sample support on a “best effort” basis. Like any custom deployment, it is the responsibility of the partner and/or customer to ensure that the customization works correctly. Cisco reserves the right to make changes to APIs and any other published interfaces as part of the normal Cisco SocialMiner release cycle.

https://developer.cisco.com/site/socialminer/overview/