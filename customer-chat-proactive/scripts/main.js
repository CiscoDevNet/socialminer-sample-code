/**
 * Cisco SocialMiner Pop-up Chat Example
 *
 * Copyright (c) 2016 by Cisco Systems, Inc.
 * All rights reserved.
 *
 * The code included in this example is intended to provide guidance to the
 * developer on best practices and usage of the SocialMiner Chat RESTful
 * APIs and is not intended for production use “as is”.
 *
 * Cisco's responsibility and liability on this code is limited ONLY to the
 * correctness and accuracy on the usage of the Chat RESTful API interface and
 * the quality of the Chat RESTful API interface itself. Any omissions from this
 * example are not to be considered capabilities that are supported or not
 * supported by the product.
 *
 * For specific capabilities refer to the documentation that accompanies the latest
 * Cisco SocialMiner release and/or request help from the Cisco Developer Network
 * (http://developer.cisco.com) or the Cisco Technical Assistance Center
 */

// globals
var config;
var session = {};

/**
 * Executes on page load
 */
$(document).ready(function () {
        loadConfig();

        // auto-initiate a chat to SocialMiner after a fixed duration
        setTimeout(initiateChatToSocialMiner, config.popup.initdelay);
    }
);

/**
 * Loads configs from config/config.json
 */
function loadConfig () {
    console.log('Loading config...');
    $.get({
        url     : 'config/config.json',
        async   : false,
        success : function(configJson) {
                    console.log('Loaded config: ' + JSON.stringify(configJson));
                    config = configJson;
                  },
        error   : function(err) {
                    console.error('Failed to load config. Error = ' + err);
                  }
        });
}

/**
 * Initiates (POST) a chat request to SocialMiner
 */
function initiateChatToSocialMiner () {
    console.log("Initiating chat request to SocialMiner " + config.socialminer.host);
    restUtil.postChatRequest().done(function (data, textStatus, jqXHR) {
        // update session
        session.scRefURL = jqXHR.getResponseHeader(constants.locationHeader);
        session.latestEventID = 0;
        session.launched = false;
        console.log("Injection of chat successful. SC RefURL = " + session.scRefURL);

        // start polling for chat events from SocialMiner
        session.pollerID = setInterval(pollForChatEvents, config.chat.pollingInterval);
    })
        .fail(function (jqXHR, textStatus) {
            console.error('Failed to initiate chat request! Response status = ' + jqXHR.status);
        });
}

/**
 * Does one poll for chat events from SocialMiner, parses the set of events
 * received and updates the chat accordingly
 */
function pollForChatEvents () {
    console.log('Starting to poll for chat events every ' + config.chat.pollingInterval + ' milliseconds...');
    restUtil.getChatEvents(session.latestEventID).done(function (data, textStatus, jqXHR) {
        // parse the XML response
        var chatEvents = $.xml2json(data);
        console.log('Received chat events: ' + JSON.stringify(chatEvents));

        // process message events
        if (chatEvents && chatEvents.MessageEvent) {
            if (!session.launched) {
                chatbox_ui.launch();
                session.launched = true;
            }
            processIncomingMessages(chatEvents.MessageEvent);
        }
    });
}

/**
 * Processes incoming MessageEvents
 *
 * @param messages
 */
function processIncomingMessages(messages) {
    if ($.isArray(messages)) {
        for (var i = 0; i < messages.length; i++) {
            chatbox_ui.showMessage(decodeString(messages[i].from), decodeString(messages[i].body));
            session.latestEventID = parseInt(messages[i].id);
        }
    } else {
        chatbox_ui.showMessage(decodeString(messages.from), decodeString(messages.body));
        session.latestEventID = parseInt(messages.id);
    }
}

/**
 * Decode a string carried in a MessageEvent body field.
 *
 * @param str the string to be decoded
 * @returns the decoded string
 */
function decodeString (str)
{
    str = decodeURIComponent(str.replace(/\+/g,  " "));
    str = str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;').replace(/\'/g,'&#x27;').replace(/\//g,'&#x2f;');

    return str;
}
