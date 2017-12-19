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
const STATES = require("../resources/states");

module.exports = user => ({
    // details of facebook user who has initiated chat
    // we can also keep additional fields like profile pic URL,
    // email ID, etc. based on use cases
    user: {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
    },

    // a buffer that holds messages sent by the facebook user
    // until an agent can join this chat
    customerMessagesBuffer: [],

    state: STATES.STARTED,

    socialminer: {
        scRefURL: null,
        latestEventID: 0,
        eventPoller: null,
        cookieJar: request.jar(), // IMPORTANT! Maintains chat client HTTP session
    },
});
