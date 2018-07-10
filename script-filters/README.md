# Cisco SocialMiner - Groovy Script Filter Samples
_Sample Groovy Script Filters for SocialMiner_

## Overview
- **[translate.groovy](translate.groovy)**: An example script filter that uses Google APIs. This script will use [Google Translate API](https://cloud.google.com/translate/v2/getting_started) to translate the socialcontact title and description.

## Pre-requisites
- An installed SocialMiner server
    - Create a Feed
    - Create a Campaign and add the created feed (above) in this campaign

- Find out if you need to set a proxy for internet access and what it is.

- For **[translate.groovy](translate.groovy)**, Get your Google API KEY [here](https://cloud.google.com/translate).

## Configuring the samples
### Translate
- Edit [translate.groovy](translate.groovy) and update the following:
    - replace the text `"PROXY_HOST"` with a HTTP proxy Host/IP Address, if/as required.
    - replace the text `"YOUR_GOOGLE_API_KEY"` with your Google API Key.
    - replace the text `"YOUR_TARGET_LANGUAGE"` with your designed target language code. See [language codes](https://cloud.google.com/translate/v2/using_rest#language-params).

## Using the Script Filters
- Create a new script filter and upload the chosen groovy script file.
![image](https://user-images.githubusercontent.com/990210/33845777-8e7646ea-deca-11e7-9654-35a2e7ae4fb4.png)

- Edit the campaign (created earlier) and add the Filter created above to this campaign.
![image](https://user-images.githubusercontent.com/990210/33845941-0f3b550e-decb-11e7-8cca-a03d5a4ec05e.png)

- Based on your choice of script filter applied to the campaign, the filter will act on all social contacts in the campaign and you will see the changes to the social contact accordingly.

## Disclaimer
The Groovy Script Filter samples are intended to provide guidance to the developer on best practices and usage of the SocialMiner Script Filter interface.

This is only a sample and is NOT intended to be a production quality application and will not be supported as such. It is NOT guaranteed to be bug free. It is merely provided as a guide for 3rd-party developers on best practices and usage of the SocialMiner Script Filter interface and is not intended for production use "as is".

Cisco's responsibility and liability on this code is limited ONLY to the correctness and accuracy on the usage of the script filter interface and the quality of the script filter interface itself. Any omissions from this example are not to be considered capabilities that are supported or not supported by the product.

For specific capabilities refer to the documentation that accompanies the latest Cisco SocialMiner release and/or request help from [DevNet](http://developer.cisco.com) or the Cisco Technical Assistance Center (TAC).

## Support Notice
DevNet provides sample support on a “best effort” basis. Like any custom deployment, it is the responsibility of the partner and/or customer to ensure that the customization works correctly. Cisco reserves the right to make changes to APIs and any other published interfaces as part of the normal Cisco SocialMiner release cycle.

https://developer.cisco.com/site/socialminer/overview/
