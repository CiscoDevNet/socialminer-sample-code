/**
 * Sample integration of Facebook Messenger and CCX Web Chat using SocialMiner Chat APIs
 *
 * Copyright (c) 2017 by Cisco Systems, Inc.
 * All rights reserved.
 *
 * This sample should act as a guide for a programmer to understand how to
 * integrate and manage the customer-side of a chat session with
 * custom messaging services on the web. It is also intended to provide guidance
 * to the developer on best practices and usage of the SocialMiner Chat RESTful
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

const request = require("request-promise-native");
const util = require("util");
const logger = require("./logger");
const sessionManager = require("../session/session_manager");

// constants
const CHAT_TITLE = "Chat from Facebook Messenger";
const CCX_QUEUETAG_PREFIX = "Chat_Csq";
const CHAT_FEED_REFURL = "http://%s/ccp-webapp/ccp/feed/%s";
const CHAT_URL = "http://%s/ccp/chat";
const CHAT_EVENTS_QUERY_PARAMS = "?all=false&eventid=";
const MIME_XML = "application/xml";

// private functions

const _constructChatRequestPayload = (sessionId) => {
    const feedRefURL = util.format(
        CHAT_FEED_REFURL,
        process.env.SOCIALMINER_HOST, process.env.SOCIALMINER_CHAT_FEED_ID
    );
    const thisSession = sessionManager.getSession(sessionId);

    return `${"<SocialContact>" +
                "<feedRefURL>"}${feedRefURL}</feedRefURL>` +
                `<author>${thisSession.user.name}</author>` +
                `<title>${CHAT_TITLE}</title>` +
                "<extensionFields>" +
                    "<extensionField>" +
                        "<name>ccxqueuetag</name>" +
                        `<value>${CCX_QUEUETAG_PREFIX}${process.env.CCX_QUEUE_ID}</value>` +
                    "</extensionField>" +
                    "<extensionField>" +
                        "<name>h_Name</name>" +
                        `<value>${thisSession.user.name}</value>` +
                    "</extensionField>" +
                "</extensionFields>" +
            "</SocialContact>";
};

const _constructMessagePayload = text => `${"<Message>" +
                "<body>"}${text}</body>` +
           "</Message>";

const SocialMinerRESTClient = {
    postChatRequest: (sessionId) => {
        logger.info(
            "Posting a chat request to SocialMiner [HOST=%s], [FEEDID=%s]",
            process.env.SOCIALMINER_HOST, process.env.SOCIALMINER_CHAT_FEED_ID
        );

        const options = {
            url: util.format(CHAT_URL, process.env.SOCIALMINER_HOST),
            method: "POST",
            headers: {
                "Content-Type": MIME_XML,
            },
            body: _constructChatRequestPayload(sessionId),
            resolveWithFullResponse: true,
            jar: sessionManager.getSession(sessionId).socialminer.cookieJar,
        };

        logger.debug("POST: new chat request", options);
        return request(options);
    },

    getLatestChatEvents: (sessionId) => {
        const thisSession = sessionManager.getSession(sessionId);
        const latestEventId = thisSession.socialminer.latestEventID;

        const options = {
            url: util.format(CHAT_URL, process.env.SOCIALMINER_HOST) + CHAT_EVENTS_QUERY_PARAMS + latestEventId,
            method: "GET",
            headers: {
                Accept: MIME_XML,
            },
            jar: thisSession.socialminer.cookieJar,
        };

        logger.debug("GET: chat events", options);
        return request(options);
    },

    putChatMessage: (sessionId, text) => {
        const options = {
            url: util.format(CHAT_URL, process.env.SOCIALMINER_HOST),
            method: "PUT",
            headers: {
                "Content-Type": MIME_XML,
            },
            body: _constructMessagePayload(text),
            jar: sessionManager.getSession(sessionId).socialminer.cookieJar,
        };

        logger.debug("PUT: chat message", options);
        return request(options);
    },
};

module.exports = SocialMinerRESTClient;
