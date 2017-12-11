/*
 *                           Cisco Systems, Inc.
 *                           Copyright (c) 2016
 *                           All rights reserved.
 *                         Cisco SocialMiner 11.5(1)
 *-------------------------------------------------------------------------
 * The code included in this module is intended to provide guidance to the
 * developer on best practices and usage of the SocialMiner Script Filter
 * interface and is not intended for production  use "as is".
 *
 * Cisco's responsibility and liability on this code is limited ONLY to the
 * correctness and accuracy on the usage of the script filter interface
 * and the quality of the script filter interface itself. Any omissions
 * from this example are not to be considered capabilities that are
 * supported or not supported by the product.
 *
 * For specific capabilites refer to the documentation that accompanies this
 * release and/or request help from the Cisco Developer Network
 * (http://developer.cisco.com) or the Cisco Technical Assistance Center
 */

/*
 * How to call an external API and update SocialContact.
 *
 * To demonstrate, here is an example script filter that uses google apis.
 * This script will use google translate api to translate socialcontact
 * title and description
 * For more information, visit -> https://developers.google.com/translate/v2/getting_started
 *
 * THE TUTORIAL IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND.
 */

//If need be, set the proxy to access the internet using the provided restClient
//restClient.setProxy("PROXY_HOST", 80, null);

def title  = socialContact.title;
def description  = socialContact.description;
def API_KEY = "YOUR_GOOGLE_API_KEY";
def TARGET_LANGUAGE = "YOUR_TARGET_LANGUAGE";
def titleResponse = "";

boolean updated = false;

if (title != null && title != ""){
    log "trying to translate title ${title}"
    titleResponse = restClient.get( uri : "https://www.googleapis.com/", path : "language/translate/v2", query : [key:API_KEY,target:TARGET_LANGUAGE,q:title] );
    def translatedTitle = titleResponse.data.data.translations.translatedText[0];
    socialContact.title = "${translatedTitle} <---> ${title}";
    log "updating social contact with title ${translatedTitle} "
}

def descResponse = "";

if (description != null && description != ""){
    log "trying to translate title ${description}"
    descResponse = restClient.get( uri : "https://www.googleapis.com/", path : "language/translate/v2", query : [key:API_KEY,target:TARGET_LANGUAGE,q:description]); 
    def translatedDescription = descResponse.data.data.translations.translatedText[0];
    log "updating social contact with description ${translatedDescription} "
    socialContact.description = "${translatedDescription} <---> ${description}"
}

