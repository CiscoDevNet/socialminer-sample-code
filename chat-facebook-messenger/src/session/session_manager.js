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

const Session = require("./session");
const STATES = require("../resources/states");
const logger = require("../util/logger");

/**
 * `Map <sender ID, session>`
 *
 * holds all sessions that are ongoing
 */
const sessionMap = new Map();

/**
 * Exposes an interface for the rest of the
 * application to create, update and destroy sessions
 */
const SessionManager = {
    isSessionOngoing: id => sessionMap.has(id) &&
            sessionMap.get(id).state !== STATES.STARTED &&
            sessionMap.get(id).state !== STATES.ENDED,

    createSession: (user) => {
        logger.info("Creating new session for user", user);
        sessionMap.set(user.id, Session(user));
    },

    getSession: (id) => {
        return sessionMap.get(id);
    },

    setState: (id, state) => {
        sessionMap.get(id).state = state;
    },

    setSCRefURL: (id, url) => {
        sessionMap.get(id).socialminer.scRefURL = url;
    },

    setLatestEventId: (id, eventId) => {
        sessionMap.get(id).socialminer.latestEventID = eventId;
    },

    setEventPoller: (id, poller) => {
        sessionMap.get(id).socialminer.eventPoller = poller;
    },

    addToCustomerMessageBuffer: (id, text) => {
        sessionMap.get(id).customerMessagesBuffer.push(text);
    },

    destroySession: (id) => {
        // clear interval if it exists
        if (sessionMap.get(id) && sessionMap.get(id).socialminer.eventPoller) {
            clearInterval(sessionMap.get(id).socialminer.eventPoller);
        }
        // then, remove the session from sessionMap
        sessionMap.delete(id);
    },
};

module.exports = SessionManager;
