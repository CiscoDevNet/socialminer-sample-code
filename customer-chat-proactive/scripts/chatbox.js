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

// Based on an open-source jQuery-UI based chatbox plugin
// See https://github.com/dexterpu/jquery.ui.chatbox

var chatbox_ui = {
    /**
     * Options for the popup chat widget
     */
    options : {
                id: 'popup_chat_div',
                title: 'How may I help you?',
                hidden: false,
                width: 250,
                offset: 20,
                messageSent: function (id, user, msg) {
                    chatbox_ui.showMessage(config.popup.myself, msg);
                    // push the chat message to SocialMiner to be shown to agent
                    restUtil.putChatMessage(msg);
                },
                boxClosed: function (id) {
                    // stop polling for chat events
                    clearInterval(session.pollerID);
                    // delete chat session with SocialMiner
                    restUtil.deleteChat().done(new function () {
                        console.log('Chat session terminated successfully.');
                    });
                }
    },

    /**
     * Launch the chat widget using options specified above
     */
    launch : function () {
        console.log('Displaying chat widget...');
        $('#' + config.popup.elementid).chatbox(chatbox_ui.options);
    },

    /**
     * Display a message
     *
     * @param from - The sender of the message
     * @param message - The content of the message
     */
    showMessage : function (from, message) {
        $('#' + config.popup.elementid).chatbox('option', 'boxManager').addMsg(from, message);
    }
};


