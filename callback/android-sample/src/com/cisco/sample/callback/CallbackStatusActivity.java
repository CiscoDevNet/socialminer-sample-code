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

package com.cisco.sample.callback;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Messenger;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.TextView;

import com.cisco.sample.R;
import com.cisco.sample.callback.services.ContactStatusService;
import com.cisco.sample.callback.services.HandleMessage;
import com.cisco.sample.callback.services.MessageType;
import com.cisco.sample.callback.services.ServiceMessageHandler;

/**
 * The Class CallbackStatusActivity.
 * Activity to show callback request status
 */
public class CallbackStatusActivity extends Activity implements HandleMessage{

	/** The handler. */
	private ServiceMessageHandler handler;

	/**
	 * Instantiates a new callback status activity.
	 */
	public CallbackStatusActivity(){
		handler = new ServiceMessageHandler(this);
	}
	
	
	/* (non-Javadoc)
	 * @see android.app.Activity#onCreate(android.os.Bundle)
	 */
	@Override
	public void onCreate(Bundle savedInstanceState) {
	        super.onCreate(savedInstanceState);

	        setContentView(R.layout.activity_callback_task);
	        Button cmdDone = (Button)findViewById(R.id.buttonDone);
	        // Get contact URL from bundle
	        Bundle bundle = getIntent().getExtras();
			String contactUrl =bundle.getString("contactUrl");

			// Start background service to poll for contact status
	        Intent intent =  new Intent(CallbackStatusActivity.this,ContactStatusService.class);
	        intent.putExtra("contactUrl", contactUrl);
	        // Put the handler where service will send message
	        Messenger messenger = new Messenger(handler);
	        intent.putExtra("MESSENGER", messenger);       
	        startService(intent);
	        
	        
	        cmdDone.setOnClickListener(new OnClickListener() {		
				@Override
				public void onClick(View v) {
					// stop polling service and finish the activity
					stopService(new Intent(CallbackStatusActivity.this,ContactStatusService.class));
					finish();
				}
			});
	}
	
	/* (non-Javadoc)
	 * @see com.cisco.sample.HandleMessage#handleMessage(com.cisco.sample.MessageType, java.lang.String)
	 */
	@Override
	public void handleMessage(MessageType type, String message) {
		if(type != MessageType.CONTACT_STATUS)
			return;//do not process any other message
		// Show status on UI
 		TextView lblStatus = (TextView) findViewById(R.id.lblStatus);
 		if(lblStatus!=null)
 			lblStatus.setText(message);
	}

}
