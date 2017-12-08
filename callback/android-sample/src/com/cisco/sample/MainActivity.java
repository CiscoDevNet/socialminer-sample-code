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

package com.cisco.sample;

import com.cisco.sample.R;
import com.cisco.sample.callback.CallbackFormActivity;

import android.app.TabActivity;
import android.content.Intent;
import android.os.Bundle;
import android.widget.TabHost;
import android.widget.TabHost.TabSpec;

/**
 * The Class MainActivity.
 * This launches two activities in two tabs
 */
@SuppressWarnings("deprecation")
public class MainActivity extends TabActivity{

    /* (non-Javadoc)
     * @see android.app.ActivityGroup#onCreate(android.os.Bundle)
     */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

		TabHost tabHost = getTabHost(); 
		// Callform tab
		Intent intentForm = new Intent().setClass(this, CallbackFormActivity.class);
		
		TabSpec tabSpecForm = tabHost
		  .newTabSpec("Form")
		  .setIndicator("Form")
		  .setContent(intentForm);
		
		// Settings tab
		Intent intentSettings = new Intent().setClass(this, SettingsActivity.class);
		TabSpec tabSpecSettings = tabHost
			  .newTabSpec("Settings")
			   .setIndicator("Settings")
			  .setContent(intentSettings);
		
		tabHost.addTab(tabSpecForm);
		tabHost.addTab(tabSpecSettings);

		tabHost.setCurrentTab(0);
    }
   
}
