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
import java.util.concurrent.atomic.AtomicBoolean;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;


import android.app.IntentService;
import android.content.Intent;
import android.os.Bundle;
import android.os.IBinder;
import android.os.Message;
import android.os.Messenger;
import android.os.RemoteException;
import android.util.Log;

/**
 * The Class ContactStatusService.
 * This service polls contact status and inform activity about the status 
 */
public class ContactStatusService extends IntentService{

	/** The poll status. */
	private AtomicBoolean pollStatus=new AtomicBoolean(true);
	/** Timeout between polls */
	private final long TIMEOUT=1000;//1 sec
	/**
	 * Instantiates a new contact status service.
	 */
	public ContactStatusService() {
		super("ContactStatusService");
		
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
          this.pollStatus.getAndSet(false);
    }

	/* (non-Javadoc)
	 * @see android.app.IntentService#onHandleIntent(android.content.Intent)
	 */
	@Override
	protected void onHandleIntent(Intent intent) {
		String contactUrl =intent.getExtras().getString("contactUrl");
		Log.d("CallMe","Status Service starting poll for contactUrl :" + contactUrl);
		Messenger messenger = (Messenger) intent.getExtras().get("MESSENGER");
        this.pollStatus.getAndSet(true);

		while(this.pollStatus.get()){
			String status =getStatus(contactUrl);
			
			// inform activity about the status
			Message message = Message.obtain();
			Bundle bundle =new Bundle();
			bundle.putString("msgType", MessageType.CONTACT_STATUS.toString());
			bundle.putString("msgContent", status);
			message.setData(bundle);
			try {
				messenger.send(message);
			} catch (RemoteException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			// sleep for given timeout
			try {
				Thread.sleep(TIMEOUT);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
	}
	
	
    /**
	 * Gets the status.
	 * 
	 * @param contactUrl
	 *            the contact url
	 * @return the status
	 */
    private String getStatus(String contactUrl){
		HttpClient httpclient = new DefaultHttpClient();
    	 HttpGet httpget = new HttpGet(contactUrl);
		 Log.d("CallMe","executing request" + httpget.getRequestLine());
		
			try {
				HttpResponse response = httpclient.execute(httpget);
				HttpEntity entity = response.getEntity();
				// get the status from XML response
	            if (entity != null) {
	                Log.d("CallMe","Response content length: " + entity.getContentLength());
	                byte[] b = new byte [(int) entity.getContentLength()];
	                entity.getContent().read(b);
	                String xml = new String(b);
	                int start = xml.indexOf("<status>") + "<status>".length();
	                int end =  xml.indexOf("</status>");
	                return xml.substring(start, end);
	            }
			} catch (ClientProtocolException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
			return "unknown";
    }
}
