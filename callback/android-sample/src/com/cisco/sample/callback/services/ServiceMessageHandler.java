/*
 *                           Cisco Systems, Inc.
 *                           Copyright (c) 2014
 *                           All rights reserved.
 *                         Cisco SocialMiner 10.5(1)
 *-------------------------------------------------------------------------
 * The code included in this module is intended to provide guidance to the
 * developer on best practices and usage of the SocialMiner Callback
 * interface and is not intended for production  use “as is”.
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

package com.cisco.sample.callback.services;


import android.os.Bundle;
import android.os.Handler;
import android.os.Message;

/**
 * The Class ServiceMessageHandler.
 * This class is used to pass messages between activity and services
 */
public class ServiceMessageHandler extends Handler{

	/** The msg handler. */
	HandleMessage msgHandler;
	
	/**
	 * Instantiates a new service message handler.
	 * 
	 * @param msgHandler
	 *            the msg handler
	 */
	public ServiceMessageHandler(HandleMessage msgHandler) {
		this.msgHandler=msgHandler;
	}
	
	/* (non-Javadoc)
	 * @see android.os.Handler#handleMessage(android.os.Message)
	 */
	@Override
	public void handleMessage(Message msg) {
		Bundle bundle = msg.getData();
		String type = bundle.getString("msgType");
		String msgContent = bundle.getString("msgContent");
		msgHandler.handleMessage(MessageType.valueOf(type), msgContent);
	}
}
