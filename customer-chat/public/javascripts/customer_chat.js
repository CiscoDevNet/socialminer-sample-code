/**
 *                           Cisco Systems, Inc.
 *                           Copyright (c) 2014
 *                           All rights reserved.
 *                         Cisco SocialMiner 10.5(1)
 *-------------------------------------------------------------------------
 * The code included in this module is intended to provide guidance to the
 * developer on best practices and usage of the SocialMiner Chat
 * APIs and is not intended for production use “as is”.
 *
 * Cisco's responsibility and liability on this code is limited ONLY to the
 * correctness and accuracy on the usage of the callback interface and the
 * quality of the callback interface itself. Any omissions from this
 * example are not to be considered capabilities that are supported or not
 * supported by the product.
 *
 * For specific capabilites refer to the documentation that accompanies this
 * release and/or request help from the Cisco Developer Network
 * (http://developer.cisco.com) or the Cisco Technical Assistance Center
 */
var socialminer = socialminer || {};

/**
 * This class provides a wrapper around the SocialMiner customer-side chat REST APIs.
 */
socialminer.chat = function()
{
    var chatUrl, feedRefUrl, go = false, pollHandle = null, lastEventId = 0, eventListeners = [],

    /**
     * Process the set of chat events carried in the given eventXmlStr
     *
     * @param eventXmlStr string containing the set of XML chat events
     */
    processEvents = function (eventXmlStr)
    {
        var i, chatEvents, eventId, event, events = [], x2js = new X2JS(), xml = $.parseXML(eventXmlStr);

        chatEvents = $(xml).find("chatEvents").children();

        for ( i = 0 ; i < chatEvents.length ; i++ )
        {
            event = x2js.xml2json(chatEvents[i]);
            event.type = chatEvents[i].nodeName;
            if ( event.body )
            {
                event.body = socialminer.utils.decodeString(event.body);
            }
            events.push(event);

            eventId = parseInt(event.id);
            if (eventId > lastEventId)
            {
                lastEventId = eventId;
            }
        }

        notify(events);
    },

    /**
     * Notify all event listeners of the given set of events.
     *
     * @param events the list of events to notify listeners of.
     */
    notify = function(events)
    {
        var i;
        if (events.length > 0)
        {
            socialminer.utils.log("Events: " + JSON.stringify(events));
            for (i = 0; i < eventListeners.length; i++)
            {
                eventListeners[i](events);
            }
        }
    },

    /**
     * Poll for new events every 5 seconds.
     * This returns you all chat events including typing events having event type as "TypingEvent".
     * Typing Event can have two states "composing" or "paused".
     */
    poll = function ()
    {
        socialminer.utils.log("Poll eventId: " + lastEventId);
        $.ajax(
            {
                type: "GET",
                url: chatUrl + "?eventid=" + lastEventId,
                cache: false,
                contentType: "application/xml",
                dataType: "text",
                success: function(responseText)
                {
                    processEvents(responseText);
                    if (go == true)
                    {
                        pollHandle = setTimeout(function() { poll(); }, 5000);
                        socialminer.utils.log("New eventId: " + lastEventId);
                    }
                },
                error: function(responseText, status)
                {
                    socialminer.utils.log("Error: " + status);
                    notify(
                        [{
                            id: lastEventId + 1,
                            type: "StatusEvent",
                            status: "chat_finished_error",
                            detail: "Server connection temporarily lost. Please try again later."
                        }]);
                }
            });
    };

    return {

        /**
         * Initialize a socialminer.chat object.
         *
         * @param socialMinerBaseUrl the path to SocialMiner
         * @param chatFeedRefUrl the SocialMiner chat feed that captures/supports chats.
         */
        init: function (socialMinerBaseUrl, chatFeedRefUrl)
        {
            chatUrl = socialMinerBaseUrl + "/ccp/chat/";
            feedRefUrl = chatFeedRefUrl;
        },

        /**
         * Listen for chat events.
         *
         * @param callback a callback function that takes an array as a parameter. This array will contain combinations
         * of the following objects:
         *   { type: StatusEvent, id: eventId, status: chat_finished_error|chat_issue|chat_ok, detail: eventDetails }
         *   { type: PresenceEvent, id: eventId, from: user, status: joined|left }
         *   { type: MessageEvent, id: eventId, from: user, body: messageText }
         */
        addEventListener: function (callback)
        {
            eventListeners[eventListeners.length] = callback;
        },

        /**
         * Start polling for events.
         */
        startPolling: function ()
        {
            go = true;
            poll();
        },

        /**
         * Stop polling for events.
         */
        stopPolling: function ()
        {
            go = false;
            if ( pollHandle != null )
            {
                clearTimeout(pollHandle);
                pollHandle = null;
            }
        },
        /**
         * Send Typing Event.
         *
         * @param contact a JSON object with the contact details as well as the typing status of the user ( composing or paused ).
         * @param success success callback function. The function is a jQuery ajax() success callback. The details can
         *                  be found here: http://api.jquery.com/jquery.ajax/
         * @param error error callback function. The function is a jQuery ajax() error callback. The details can
         *                  be found here: http://api.jquery.com/jquery.ajax/
         */
        sendTypingEvent: function (contact, success, error)
        {
            var typingXml;

            typingXml = "<TypingEvent>";
            typingXml += "<from>" + contact.from + "</from>";
            typingXml += "<status>" + contact.status + "</status>";
            typingXml += "</TypingEvent>";

            $.ajax(
                {
                    type: "PUT",
                    url: chatUrl + "event",
                    cache: false,
                    contentType: "application/xml",
                    data: typingXml,
                    success: success,
                    error: error
                }
            );
        },
        /**
         * Send a chat message.
         *
         * @param message the text of the message to send
         * @param success success callback function. The function is a jQuery ajax() success callback. The details can
         *                  be found here: http://api.jquery.com/jquery.ajax/
         * @param error error callback function. The function is a jQuery ajax() error callback. The details can
         *                  be found here: http://api.jquery.com/jquery.ajax/
         */
        send: function (message, success, error)
        {
            var messageXml;

            messageXml = "<Message><body>" + socialminer.utils.stripNonValidXMLCharacters(message) + "</body></Message>";

            $.ajax(
                {
                    type: "PUT",
                    url: chatUrl,
                    cache: false,
                    contentType: "application/xml",
                    dataType: "xml",
                    data: messageXml,
                    success: success,
                    error: error
                });
        },
        /**
         *
         * Return the URL used to download a PDF of the chat conversation.
         * @returns {string} URL to the PDF transcript
         */
        getTranscriptDownloadUrl: function()
        {
            // A locale can be specified with the 'locale' parameter.
            //
            return chatUrl + "transcript.pdf?locale=en_ALL";
        },
        /**
         * Leave the chat room.
         *
         * @param success success callback function. The function is a jQuery ajax() success callback. The details can
         *                  be found here: http://api.jquery.com/jquery.ajax/
         * @param error error callback function. The function is a jQuery ajax() error callback. The details can
         *                  be found here: http://api.jquery.com/jquery.ajax/
         */
        leave: function(success, error)
        {
            $.ajax(
                {
                    type: "PUT",
                    url: chatUrl + "leaveChat",
                    cache: false,
                    success: success,
                    error: error
                }
            )
        },

        /**
         * Initiate a chat session using the chat POST API.
         *
         * @param contact a JSON object with the contact details used to initiate the chat session.
         * @param success success callback function. The function is a jQuery ajax() success callback. The details can
         *                  be found here: http://api.jquery.com/jquery.ajax/
         * @param error error callback function. The function is a jQuery ajax() error callback. The details can
         *                  be found here: http://api.jquery.com/jquery.ajax/
         */
        initiate: function (contact, success, error)
        {
            var i, contactXml;

            contactXml = "<SocialContact>";
            contactXml += "<feedRefURL>" + feedRefUrl + "</feedRefURL>";
            contactXml += "<author>" + contact.author + "</author>";
            contactXml += "<title>" + contact.title + "</title>";
            contactXml += "<extensionFields>";
            for (i = 0; i < contact.extensionFields.length; i++)
            {
                if ((contact.extensionFields[i].value && (contact.extensionFields[i].value.length > 0)))
                {
                    contactXml += "<extensionField><name>" + contact.extensionFields[i].name + "</name><value>" + contact.extensionFields[i].value + "</value></extensionField>";
                }
            }
            contactXml += "</extensionFields>";
            contactXml += "</SocialContact>";

            $.ajax(
                {
                    type: "POST",
                    url: chatUrl,
                    cache: false,
                    contentType: "application/xml",
                    data: contactXml,
                    success: success,
                    error: error
                }
            );
        }
    }
};