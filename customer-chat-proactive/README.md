# Cisco SocialMiner - Proactive / Live Chat Client Sample
_Sample web application illustrating a proactive customer-side pop-up live chat with Cisco Unified CCX web chat via Cisco SocialMiner_

## Overview
This sample does the following:
- Provides a basic example web page with a built-in logic to inject a web chat request into Cisco SocialMiner based on a simple time delay.

- Implements a **pop-up live chat chat bubble** which serves as a customer chat client to send and receive chat messages from CCX chat agents.

- Thereby illustrates usage of SocialMiner chat feed APIs, and abilities to customize and extend Unified CCX web chat capabilities.

## Pre-requisites
- Your favorite static web server ([Apache](https://httpd.apache.org), [nginx](https://nginx.org/), [IIS](https://www.iis.net/))

- Cisco SocialMiner 11.5 SU (and future releases)

- Cisco Unified CCX 11.5 (and future releases) with all web chat configurations (Please refer [Unified CCX Administration Guide](https://www.cisco.com/c/en/us/support/customer-collaboration/unified-contact-center-express/products-installation-and-configuration-guides-list.html))

## Setup / Configuration
The [config.json](config/config.json) allows you to customize important details required to run this sample.  
Modify it with details such as:
- Cisco SocialMiner IP / Fully Qualified Hostname
- Chat feed ID, CCX Chat Contact Service Queue ID
- misc. configurations

## Running
- Modify [config.json](config/config.json) (see above section)

- Host the entire code in this project (`index.html`, `config/`, `scripts/` and `styles/` directories) to be served from your favorite static web server.

- Login chat agents into the Finesse desktop, and move them to **READY** state for Chat and Email.

- Access [index.html](index.html) via web server, and a chat will be injected into the CCX system (via SocialMiner) and routed to the right available chat agent, who can then accept, join and start the chat conversation.  
This will pop-up the chat bubble on the customer web page.

## Disclaimer
The Proactive customer-side pop-up live chat sample is intended to serve as an example of using SocialMiner REST APIs (specifically, the chat APIs) using a simple static web application which can be hosted and served from any web server.

This sample should act as a guide for a programmer to understand how to initiate and manage the customer-side of a chat session. Please refer [SocialMiner Developer's Guide](https://developer.cisco.com/site/socialminer/documentation/) for further details about the chat APIs. Please see the _"Web Chat"_ section of [Unified CCX Configuration Guides](https://developer.cisco.com/site/contact-center-express/docs/) for instructions on deploying Unified CCX Web Chat Feature using SocialMiner Chat APIs.

This is only a sample and is NOT intended to be a production quality application and will not be supported as such. It is NOT guaranteed to be bug free. It is merely provided as a guide for 3rd-party developers on best practices and usage of the SocialMiner RESTful APIs and is not intended for production use "as is".

Cisco's responsibility and liability on this code is limited ONLY to the correctness and accuracy on the usage of the RESTful API interface and the quality of the RESTful API interface itself. Any omissions from this example are not to be considered capabilities that are supported or not supported by the product.

For specific capabilities refer to the documentation that accompanies the latest Cisco SocialMiner release and/or request help from [DevNet](http://developer.cisco.com) or the Cisco Technical Assistance Center (TAC).

## Support Notice
DevNet provides sample support on a “best effort” basis. Like any custom deployment, it is the responsibility of the partner and/or customer to ensure that the customization works correctly. Cisco reserves the right to make changes to APIs and any other published interfaces as part of the normal Cisco SocialMiner release cycle.

https://developer.cisco.com/site/socialminer/overview/