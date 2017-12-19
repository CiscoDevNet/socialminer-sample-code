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

const Botly = require("botly");
const _ = require("lodash");
const util = require("util");
const xml2js = require("xml2js");
const logger = require("../util/logger");
const utils = require("../util/utils");
const sessionManager = require("../session/session_manager");
const socialminer = require("../util/socialminer_rest_util");
const MESSAGES = require("../resources/messages");
const STATES = require("../resources/states");

/**
 * Interval (in ms) for polling chat events from SocialMiner
 *
 * In general, SocialMiner APIs recommend chat clients to poll
 * at least once every 5 seconds
 */
const EVENT_POLLING_INTERVAL_MS = 4000;

// the botly module (https://github.com/miki2826/botly)
// provides easy and powerful abstractions over Facebook Messenger APIs
const fbmBot = new Botly({
    accessToken: _.trim(process.env.FB_PAGE_ACCESS_TOKEN),
    verifyToken: _.trim(process.env.FB_VERIFICATION_TOKEN),
});

// --
// -- private functions
// --

/**
 * Upon encountering an error that does now permit
 * the session to continue, this function is invoked.
 *
 * @param {String} senderId
 * @param {*} err
 */
const _abortSessionOnError = (senderId, err) => {
    utils.logErrorWithStackTrace(err);
    // inform the customer that something went wrong
    fbmBot.sendText({ id: senderId, text: MESSAGES.CHAT_FAILURE_TRY_LATER });
    // cleanup the session, it is no longer needed
    sessionManager.destroySession(senderId);
};

/**
 * "Promisified" wrapper function to get user profile
 * by ID from facebook
 *
 * @param {String} userId
 */
const _getUserProfile = userId => new Promise((resolve, reject) => {
    fbmBot.getUserProfile(userId, (err, data) => {
        if (!err) resolve(data);
        else reject(err);
    });
});

/**
 * Sends a message to the user on FBM to wait
 * while the contact is being injected, queued
 * and an agent accepts and joins the chat session
 *
 * @param {String} senderId
 */
const _askUserToWait = (senderId) => {
    fbmBot.sendText({ id: senderId, text: MESSAGES.PLEASE_WAIT_FOR_AGENT });
    // change state to WAITING, because we are waiting for agent to join
    sessionManager.setState(senderId, STATES.WAITING);
};

const _handleAgentJoined = (senderId) => {
    const thisSession = sessionManager.getSession(senderId);
    // the session is now in TALKING state
    if (thisSession.state === STATES.WAITING) {
        // move state to TALKING
        sessionManager.setState(senderId, STATES.TALKING);
        // start flushing from the head of the buffer stack
        _.each(thisSession.customerMessagesBuffer, message => socialminer.putChatMessage(senderId, message));
    }
};

const _handleAgentLeft = (senderId) => {
    // inform the customer that agent has ended the chat
    // TODO - the "quick reply" option here is just used for
    //        illustration purposes only. When the FB user actually
    //        makes a selection, we will have to handle it here
    //        (and possibly keep the session alive until then)
    fbmBot.sendText({
        id: senderId,
        text: MESSAGES.CHAT_ENDED,
        quick_replies: [
            fbmBot.createQuickReply(MESSAGES.SURVEY_HIGH, "high"),
            fbmBot.createQuickReply(MESSAGES.SURVEY_MEDIUM, "medium"),
            fbmBot.createQuickReply(MESSAGES.SURVEY_LOW, "low"),
        ],
    });
    // end the session
    sessionManager.destroySession(senderId);
    logger.info("Session [ID=%s] is ended.", senderId);
};

/**
 * Handles `PresenceEvent` from SocialMiner
 *
 * @param {String} senderId
 * @param {*} PresenceEvent
 */
const _processPresenceFromSocialMiner = (senderId, PresenceEvent) => {
    switch (PresenceEvent.status) {
    case "joined":
        logger.info(
            "Session [ID=%s] - Agent [%s] has joined the chat",
            senderId, PresenceEvent.from
        );
        _handleAgentJoined(senderId);
        break;

    case "left":
        logger.info(
            "Session [ID=%s] - Agent [%s] has left the chat",
            senderId, PresenceEvent.from
        );
        _handleAgentLeft(senderId);
        break;

    default:
        logger.error("Unknown presence event [%s]. IGNORING.", PresenceEvent.status);
    }
};

/**
 * Decodes the URLencoded message text from SocialMiner
 * and sends it to FBM.
 *
 * Also increments the latest event ID in the session to
 * the latest ID of the message that was just sent
 *
 * @param {String} senderId
 * @param {String} text
 * @param {String | Number} eventId
 */
const _decodeAndSendMessageFromSocialMiner = (senderId, text, eventId) => {
    fbmBot.sendText({ id: senderId, text: utils.decodeString(text) });
    // update the latest event ID
    sessionManager.setLatestEventId(senderId, parseInt(eventId, 10));
};

/**
 * Sends a "Sender Action" to FBM using the SEND API
 * for typing events
 *
 * @param {String} senderId
 * @param {String} typingStatus (from SocialMiner)
 */
const _sendTypingSenderAction = (senderId, typingStatus) => {
    const thisAction = typingStatus === "composing" ?
        Botly.CONST.ACTION_TYPES.TYPING_ON : Botly.CONST.ACTION_TYPES.TYPING_OFF;

    fbmBot.sendAction({ id: senderId, action: thisAction }, (err, data) => logger.debug("Typing action sent to FBM", err, data));
};

/**
 * Handles `MessageEvent` from SocialMiner
 *
 * @param {String} senderId
 * @param {*} messages
 */
const _processMessagesFromSocialMiner = (senderId, messages) => {
    if (_.isArray(messages)) {
        _.each(messages, message => _decodeAndSendMessageFromSocialMiner(senderId, message.body, message.id));
    } else {
        _decodeAndSendMessageFromSocialMiner(senderId, messages.body, messages.id);
    }
};

/**
 * Handles `TypingEvent` from SocialMiner
 *
 * @param {String} senderId
 * @param {*} typingEvents
 */
const _processTypingFromSocialMiner = (senderId, typingEvents) => {
    if (_.isArray(typingEvents)) {
        // send the last (latest) typing event to FBM
        // since that is all that matters
        // I'm not sorting the array by ascending order of
        // event IDs, because I've seen it always appears sorted
        // by default. Not 100% sure, though.
        _sendTypingSenderAction(senderId, _.last(typingEvents).status);
        // update the latest event ID
        sessionManager.setLatestEventId(senderId, parseInt(_.last(typingEvents).id, 10));
    } else {
        // send this typing event to FBM since this is
        // the only typing event
        _sendTypingSenderAction(senderId, typingEvents.status);
        // update the latest event ID
        sessionManager.setLatestEventId(senderId, parseInt(typingEvents.id, 10));
    }
};

/**
 * Dispatches `ChatEvents` depending on what kind they are
 * (`PresenceEvent`, `MessageEvent`)
 *
 * @param {String} senderId
 * @param {*} chatEvents
 */
const _processChatEventsFromSocialMiner = (senderId, chatEvents) => {
    if (chatEvents.PresenceEvent) {
        _processPresenceFromSocialMiner(senderId, chatEvents.PresenceEvent);
    }
    if (chatEvents.MessageEvent) {
        _processMessagesFromSocialMiner(senderId, chatEvents.MessageEvent);
    }
    if (chatEvents.TypingEvent) {
        _processTypingFromSocialMiner(senderId, chatEvents.TypingEvent);
    }
};

/**
 * Gets latest chat events from SocialMiner for this session.
 * Upon receiving events, processes them.
 *
 * @param {String} senderId
 */
const _getLatestChatEvents = (senderId) => {
    socialminer.getLatestChatEvents(senderId)
        .then((response) => {
            // parse the XML response
            xml2js.parseString(response, { explicitArray: false }, (err, result) => {
                logger.debug("Received chat events", result);
                // if any error in GETting events, just log it and try again
                if (err) {
                    utils.logErrorWithStackTrace(err);
                    return;
                }
                _processChatEventsFromSocialMiner(senderId, result.chatEvents);
            });
        })
        .catch(err => _abortSessionOnError(senderId, err));
};

/**
 * Starts polling for chat events for this session
 * every `EVENT_POLLING_INTERVAL_MS`
 *
 * @param {String} senderId
 */
const _startPollingForChatEvents = (senderId) => {
    const poller = setInterval(_getLatestChatEvents, EVENT_POLLING_INTERVAL_MS, senderId);
    // update poller ref in session so it can be stopped later
    sessionManager.setEventPoller(senderId, poller);
};

/**
 * Starts a chat session with SocialMiner/CCX,
 * and upon success, starts polling for chat events
 *
 * (Session is destroyed in case of any error/failure)
 *
 * @param {String} senderId
 */
const _startChat = (senderId) => {
    _askUserToWait(senderId);
    socialminer.postChatRequest(senderId)
        .then((response) => {
            logger.info("Chat created successfully. Status = [%d] ", response.statusCode, response.headers);
            _startPollingForChatEvents(senderId);
        })
        .catch(err => _abortSessionOnError(senderId, err));
};

/**
 * Handles incoming message from FBM
 * while session is in any ongoing state
 *
 * @param {String} senderId
 * @param {String} text
 */
const _handleMessageInConversation = (senderId, text) => {
    const thisSession = sessionManager.getSession(senderId);
    switch (thisSession.state) {
    case STATES.INFO:
        // add this msg into customer msg buffer
        sessionManager.addToCustomerMessageBuffer(senderId, text);
        // inject chat request into socialminer
        // and start polling for events
        _startChat(senderId);
        break;

    case STATES.TALKING:
        // just take the msg and send to socialminer
        socialminer.putChatMessage(senderId, text);
        break;

    default:
        // just add this msg into customer msg buffer
        sessionManager.addToCustomerMessageBuffer(senderId, text);
    }
};

/**
 * Sends a welcome/greeting message to the user on FBM
 *
 * Invoked as soon as a session is established.
 * Also moves the session into `INFO` state
 *
 * @param {String} senderId
 */
const _welcomeUser = (senderId) => {
    logger.info("sender ID is ", senderId);
    logger.info("from map: ", sessionManager.getSession(senderId));
    fbmBot.sendText({
        id: senderId,
        text: util.format(
            MESSAGES.GREETING,
            sessionManager.getSession(senderId).user.name,
            process.env.VIRTUAL_ASSISTANT_NAME
        ),
    });
    // change state to INFO, because we are asking for info from sender
    sessionManager.setState(senderId, STATES.INFO);
};

// register to `message` events from facebook messenger
// this will be invoked for every message that is sent
// via Facebook Messenger by any user
fbmBot.on("message", (senderId, message) => {
    logger.debug("Received a message from [ID: %s]: ", senderId, message);

    // are we already in an ongoing session with this sender?
    if (sessionManager.isSessionOngoing(senderId)) {
        _handleMessageInConversation(senderId, message.message.text);
    } else {
        // STEP 0: Get user details from Facebook
        _getUserProfile(senderId).then((sender) => {
            // STEP 1: Create a new session
            sessionManager.createSession(sender);
            // STEP 2: Welcome/greet the user
            _welcomeUser(senderId);
        }).catch(err => utils.logErrorWithStackTrace(err));
    }
});

// register to `postback` events from facebook messenger
// this will be invoked for every postback event that is
// received via Facebook Messenger by any user
fbmBot.on("postback", (senderId, message, postback) => {
    logger.debug("Received a postback from sender", postback);
    switch (postback) {
    // We have enabled the "get_started" property using
    // Messenger Profile API. This means, a "Get Started" button
    // is shown to users the first time they interact with the app
    // (and not thereafter)
    case "get_started":
        // STEP 0: Get user details from Facebook
        _getUserProfile(senderId).then((sender) => {
            // STEP 1: Create a new session
            sessionManager.createSession(sender);
            // STEP 2: Welcome/greet the user
            _welcomeUser(senderId);
        }).catch(err => utils.logErrorWithStackTrace(err));
        break;

    default:
        logger.error("Unknown postback event received", postback, message);
    }
});

module.exports = fbmBot.router();
