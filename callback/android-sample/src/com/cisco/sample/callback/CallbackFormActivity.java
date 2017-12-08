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

import com.cisco.sample.R;
import com.cisco.sample.callback.services.HandleMessage;
import com.cisco.sample.callback.services.MessageType;
import com.cisco.sample.callback.services.RequestCallbackService;
import com.cisco.sample.callback.services.ServiceMessageHandler;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Messenger;
import android.preference.PreferenceManager;
import android.telephony.TelephonyManager;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

/**
 * The Class CallFormActivity.
 * Activity to collect callback request data and then calling service to create callback request
 * 
 */
public class CallbackFormActivity extends Activity implements HandleMessage{
	
	/** The progressDialog. */
	private ProgressDialog progressDialog=null;
	
	/** The handler. */
	private ServiceMessageHandler handler;
	
	/**
	 * Instantiates a new call form activity.
	 */
	public CallbackFormActivity() {
		handler = new ServiceMessageHandler(this);
	}
	
    /* (non-Javadoc)
     * @see android.app.Activity#onCreate(android.os.Bundle)
     */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
		loadInitialFormView();

    	Button button = (Button) findViewById(R.id.formSubmitButton);
    	
    	// add handler to button to submit callback request
    	button.setOnClickListener(new OnClickListener()
    		{
    		public void onClick(View v)
    		{
    			 
    			 EditText phone = (EditText) findViewById(R.id.entryFormPhone);
    			 EditText name = (EditText) findViewById(R.id.entryFormName);
    			 EditText feedId = (EditText) findViewById(R.id.entryFormFeedId);
    			 postCallbackRequest(feedId.getText().toString(), name.getText().toString(), phone.getText().toString());
    			 
    		}
    		});
    }
    
    
    /**
	 * Post callback request.
	 * 
	 * @param feedId
	 *            the feed id
	 * @param name
	 *            the name
	 * @param phone
	 *            the phone
	 */
    private  void postCallbackRequest(String feedId, String name,String phone){
		SharedPreferences sharedPrefs = PreferenceManager.getDefaultSharedPreferences(this);
		String hostname = sharedPrefs.getString("Hostname",null);
		if(hostname==null) {
			Toast.makeText(getApplicationContext(), "Please configure the hostname in settings before submitting callback request", Toast.LENGTH_LONG).show();
			return;
		}
		progressDialog = ProgressDialog.show(CallbackFormActivity.this, "", 
	                    "Submitting your request", true);
		// Collect data from UI and pass to service which initiates callback request
    	Intent intent =  new Intent(CallbackFormActivity.this,RequestCallbackService.class);
        intent.putExtra("hostname", hostname);
    	intent.putExtra("feedId", feedId);
    	intent.putExtra("name", name);
        intent.putExtra("phone", phone);
        // Add handler for messages from service
        Messenger messenger = new Messenger(handler);
        intent.putExtra("MESSENGER", messenger);
        startService(intent);
	}


	
	
	/**
	 * Poll for callback contact status.
	 * 
	 * @param contactUrl
	 *            the contact url
	 */
	private  void pollForCallbackContactStatus(String contactUrl){
		if(contactUrl==null) {
			Toast.makeText(getApplicationContext(), "Cannot request for callback at this time. Try again", Toast.LENGTH_LONG).show();
			return;
		}
		// Call activity which polls for contact status
		Intent intent = new Intent(getBaseContext(), CallbackStatusActivity.class);
		intent.putExtra("contactUrl", contactUrl);
		startActivity(intent);
		
	}
	
	/**
	 * Load initial form view.
	 */
	private void loadInitialFormView(){
		setContentView(R.layout.activity_call_form);
		
        // Set device's phone number in form's phone field
        EditText phoneText = (EditText) findViewById(R.id.entryFormPhone);
        TelephonyManager tMgr =(TelephonyManager)getApplicationContext().getSystemService(Context.TELEPHONY_SERVICE);
        String mPhoneNumber = tMgr.getLine1Number();
        phoneText.setText(mPhoneNumber);
	}
	
	/* (non-Javadoc)
	 * @see com.cisco.sample.HandleMessage#handleMessage(de.ankit.callme.MessageType, java.lang.String)
	 */
	@Override
	public void handleMessage(MessageType type, String msg) {
		if(type != MessageType.NEW_CONTACT)
			return;
		
		// dismiss the progress dialog
		progressDialog.dismiss();
		pollForCallbackContactStatus(msg);
		
	}
 }
