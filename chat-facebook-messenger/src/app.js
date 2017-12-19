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

const express = require("express");
const health = require("express-ping");
const bodyParser = require("body-parser");
const httpLogger = require("morgan");
const logger = require("./util/logger");
const utils = require("./util/utils");
const indexRoute = require("./routes/index");
const fbWebhookRoute = require("./routes/fb_webhook");

logger.info("**** STARTUP ****");
logger.debug("Environment = ", process.env);

// Check if the environment is proper
utils.validateEnvironment();

// Setup the web service
const app = express();
app.use(bodyParser.json());
app.use(httpLogger("short"));
app.use(health.ping());

// setup routes
app.use("/", indexRoute);
app.use("/webhook", fbWebhookRoute);

// Start the web service
app.listen(process.env.PORT, () => {
    logger.info("Service listening on port %d ...", process.env.PORT);
});
