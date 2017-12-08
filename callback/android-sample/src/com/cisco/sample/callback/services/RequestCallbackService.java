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

import java.io.IOException;
import java.util.LinkedList;
import java.util.List;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;


import android.app.IntentService;
import android.content.Intent;
import android.os.Bundle;
import android.os.IBinder;
import android.os.Message;
import android.os.Messenger;
import android.os.RemoteException;
import android.util.Log;

/**
 * The Class RequestCallbackService.
 * This service is responsible for initialing callback request
 * and informing the generated contact URL to calling activity 
 */
public class RequestCallbackService  extends IntentService{
	
	/** The callback url format. */
	private final String CALLBACK_URL_FORMAT = "http://%s/ccp/callback/feed/%s?%s";

	/**
	 * Instantiates a new request callback service.
	 */
	public RequestCallbackService() {
		super("RequestCallback");
	}

	/* (non-Javadoc)
	 * @see android.app.IntentService#onBind(android.content.Intent)
	 */
	@Override
	public IBinder onBind(Intent arg0) {
		return null;
	}
	
	/* (non-Javadoc)
	 * @see android.app.IntentService#onCreate()
	 */
	@Override
    public void onCreate() {
          super.onCreate();
    }
   
    /* (non-Javadoc)
     * @see android.app.IntentService#onDestroy()
     */
    @Override
    public void onDestroy() {
          super.onDestroy();
    }

	/* (non-Javadoc)
	 * @see android.app.IntentService#onHandleIntent(android.content.Intent)
	 */
	@Override
	protected void onHandleIntent(Intent intent) {
		Log.d("CallMe","Request Callback Service Starting");
		String hostname =intent.getExtras().getString("hostname");

		String name =intent.getExtras().getString("name");
		String phone =intent.getExtras().getString("phone");
		String feedId =intent.getExtras().getString("feedId");
		
		List<NameValuePair> params = new LinkedList<NameValuePair>();
		params.add(new BasicNameValuePair("title", "callback to "  + phone));
		params.add(new BasicNameValuePair("name", name));
		params.add(new BasicNameValuePair("mediaAddress", phone));

		String paramString = URLEncodedUtils.format(params, "utf-8");


        String callbackUrl = String.format(CALLBACK_URL_FORMAT,hostname ,feedId,paramString);
		HttpClient httpclient = new DefaultHttpClient();

		HttpGet httpget = new HttpGet(callbackUrl);
		Log.d("CallMe","executing request" + httpget.getRequestLine());
		String contactUrl=null;
		 try {
			HttpResponse response = httpclient.execute(httpget);
			if(response.getStatusLine().getStatusCode()==201)
			 contactUrl= response.getFirstHeader("Location").getValue();
	           
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}	
		 
		Messenger messenger = (Messenger) intent.getExtras().get("MESSENGER");
		Message message = Message.obtain();
		Bundle bundle =new Bundle();
		bundle.putString("msgType", MessageType.NEW_CONTACT.toString());
		bundle.putString("msgContent", contactUrl);
		message.setData(bundle);
		try {
			messenger.send(message);
		} catch (RemoteException e) {
			e.printStackTrace();
		}
		
	}
}
