# Cisco SocialMiner - Chat Integration with Facebook Messenger
_Sample integration of Facebook Messenger and CCX Web Chat using SocialMiner Chat APIs_

<img src="https://user-images.githubusercontent.com/990210/31052289-36b1dee2-a69e-11e7-985b-0d9266877f50.png" width="425"/>  <img src="https://user-images.githubusercontent.com/990210/31052292-41b8c5d0-a69e-11e7-8ab3-a55d23a33c75.png" width="425"/>

## Overview
This sample illustrates how CCX Web Chat (powered by Cisco SocialMiner) can be integrated with Facebook Messenger (using a bot on [Facebook Messenger Platform](https://developers.facebook.com/docs/messenger-platform)) to provide an end-to-end chat experience between customers (who are facebook users) and CCX web chat agents (on the finesse desktop).

The code is basically for a [Node.js](https://nodejs.org/) based cloud service (called **_Chat Gateway Service_**) hosted on the cloud, chat messages are transformed between SocialMiner (in the DMZ) and Facebook cloud.

This sample conveys several important principles to the third-party developer, including:
- usage of SocialMiner Chat APIs
- chat session management multi-tenancy
- Facebook Messenger Platform and its capabilities

The same principles are also extendable beyond just Facebook Messenger - they can also be used to build custom integrations with any similar messaging solutions ([Apple Business Chat](https://developer.apple.com/business-chat/), [WhatsApp for Business](https://blog.whatsapp.com/10000633/Building-for-People-and-Now-Businesses) etc.).

## High-Level Design
![image](https://user-images.githubusercontent.com/990210/31310965-dfed4cf0-abbf-11e7-90b2-0330d672e73f.png)

## Pre-requisites
### Infrastructure
While this app is ready to be hosted on [Heroku](https://heroku.com) (see [Procfile](Procfile)), it can be hosted on any application/hosting environment or container framework.

The only considerations for the infrastructure are public addressibility and connectivity of this cloud app with
- facebook.com
- your SocialMiner instance

### Deploying SocialMiner and Unified CCX
This sample requires:
- SocialMiner 11.6(1) and above
- Unified CCX 11.6(1) and above

Cisco SocialMiner should ideally be deployed on the DMZ such that it can be addressible and connected from anywhere in the public Internet, as well as have a direct connectivity into the enterprise network where Unified CCX servers and Agents are located.

If your organization has not deployed SocialMiner in the DMZ, you will need to use a forwarding/reverse proxy (such as [ngrok](https://ngrok.com) or [nginx](https://www.nginx.com/resources/admin-guide/reverse-proxy/).

### Setting-up Facebook Messenger Bot
See the [Getting Started](https://developers.facebook.com/docs/messenger-platform/guides/setup) guides by Facebook on how to create a facebook app (bot), acquire required tokens etc.

## Running
The following environment variables are required to be defined (in `process.env`) to launch and run the app.

|Variable|Description|
|--------|-----------|
|__PORT__    |A 16-bit UNIX port number where this app will bind to|
|__FB_PAGE_ACCESS_TOKEN__|The page access token issued by Facebook when you configure messenger for a page|
|__FB_VERIFICATION_TOKEN__|A token that is to be provided by your app when Facebook challenges the validity of your webhook URL|
|__VIRTUAL_ASSISTANT_NAME__|The name of your virtual assistant (E.g. _Siri_, _Alexa_ etc.)|
|__SOCIALMINER_HOST__|A valid fully qualified hostname of your SocialMiner server|
|__SOCIALMINER_CHAT_FEED_ID__|The ID of the chat feed in SocialMiner. Can be obtained by calling the `/feed` API on SocialMiner|
|__CCX_QUEUE_ID__|The ID of the CCX Chat Contact Service Queue. Can be obtained by calling the `/csq/` API on CCX|

## Disclaimer
This sample illustrates how CCX Web Chat (powered by Cisco SocialMiner) can be integrated with Facebook Messenger (using a bot on [Facebook Messenger Platform](https://developers.facebook.com/docs/messenger-platform)) to provide an end-to-end chat experience between customers (who are facebook users) and CCX web chat agents (on the finesse desktop).

This sample should act as a guide for a programmer to understand how to integrate and manage the customer-side of a chat session with custom messaging services on the web. Please refer [SocialMiner Developer's Guide](https://developer.cisco.com/site/socialminer/documentation/) for further details about the chat APIs. Please see the _"Web Chat"_ section of [Unified CCX Configuration Guides](https://developer.cisco.com/site/contact-center-express/docs/) for instructions on deploying Unified CCX Web Chat Feature using SocialMiner Chat APIs.

For more information regarding Facebook Messenger platform, see [here](https://developers.facebook.com/docs/messenger-platform/guides/setup).

This is only a sample and is NOT intended to be a production quality application and will not be supported as such. It is NOT guaranteed to be bug free. It is merely provided as a guide for 3rd-party developers on best practices and usage of the SocialMiner RESTful APIs and is not intended for production use "as is".

Cisco's responsibility and liability on this code is limited ONLY to the correctness and accuracy on the usage of the RESTful API interface and the quality of the RESTful API interface itself. Any omissions from this example are not to be considered capabilities that are supported or not supported by the product.

For specific capabilities refer to the documentation that accompanies the latest Cisco SocialMiner release and/or request help from [DevNet](http://developer.cisco.com) or the Cisco Technical Assistance Center (TAC).

## Support Notice
DevNet provides sample support on a “best effort” basis. Like any custom deployment, it is the responsibility of the partner and/or customer to ensure that the customization works correctly. Cisco reserves the right to make changes to APIs and any other published interfaces as part of the normal Cisco SocialMiner release cycle.

https://developer.cisco.com/site/socialminer/overview/