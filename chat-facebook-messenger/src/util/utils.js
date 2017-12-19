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

const _ = require("lodash");
const logger = require("../util/logger");

const MANDATORY_ENV_VARS = [
    "PORT",
    "FB_PAGE_ACCESS_TOKEN",
    "FB_VERIFICATION_TOKEN",
    "VIRTUAL_ASSISTANT_NAME",
    "SOCIALMINER_HOST",
    "SOCIALMINER_CHAT_FEED_ID",
    "CCX_QUEUE_ID",
];

module.exports = {
    /**
     * Validates the deployed environment to ensure
     * all required variables are defined. If not, it
     * aborts the entire application.
     */
    validateEnvironment: () => {
        _.each(MANDATORY_ENV_VARS, (variable) => {
            if (_.isUndefined(process.env[variable]) ||
                _.isEmpty(_.trim(process.env[variable]))) {
                throw new ReferenceError(`SEVERE ERROR: MISSING/INVALID environment variable value: ${variable}`);
            }
        });
    },

    /**
     * Logs an error with its stack trace
     *
     * @param {*} err
     * @param {String} msg
     */
    logErrorWithStackTrace: (err, msg) => {
        logger.error("Something went wrong.", err, new Error(msg).stack);
    },

    /**
     * Properly decode a URLEncoded string
     *
     * @param {String} str
     */
    decodeString: (str) => {
        let decodedStr = decodeURIComponent(str.replace(/\+/g, " "));
        decodedStr = decodedStr.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
            .replace(/'/g, "&#x27;")
            .replace(/\//g, "&#x2f;");

        return decodedStr;
    },
};
