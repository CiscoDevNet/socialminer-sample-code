# Cisco SocialMiner - Callback (Agent Request API) Sample Android App
_Sample Android application to illustrate use of SocialMiner Agent Request (Callback) APIs_

## Overview
The Android Callback sample is intended to serve as an example of using the SocialMiner Callback API inside of an Android application.

## Pre-requisites
- SocialMiner and PCCE/UCCE installed and the Agent Request Feature configured (Follow the directions in the _"Agent Request"_ section of [CCE Optional Features Guide](https://developer.cisco.com/site/packaged-contact-center/documentation/)).

- A registered, online customer phone that is reachable from a CCE agent.

- The ID of the callback feed configured to process callback requests. The ID can be obtained using the following SocialMiner REST API:
    ```
    http://<socialMiner>/ccp-webapp/ccp/feed
    ```
    This REST API will list XML for each feed configured on SocialMiner. Feeds with type `10` are callback feeds. The name given when the feed was configured is also listed. This is the easiest way to find the XML for`the callback feed. Here is some sample output from the feed API:
    ```xml
    <feeds>
    <Feed>
        <changeStamp>0</changeStamp>
        <name>Callback</name>
        <pushFeedURL>http://<socialMiner>/ccp/callback/feed/101212</pushFeedURL>
        <refURL>http://<socialMiner>/ccp-webapp/ccp/feed/101212</refURL>
        <status>1</status>
        <tags>
        <tag>callback</tag>
        </tags>
        <type>10</type>
    </Feed>
    ...
    </feeds>
    ```
    The ID of the feed is the number at the end of the `refURL` field. In this
    example, the ID is `101212`.

- Necessary development environment for building Android apps ([Eclipse IDE](https://www.eclipse.org/downloads/packages/) with android development plugins)

## Loading and Running the Sample
- Launch Eclipse.
- Select **_File -> Import_** to bring up the Import dialog.
- Select **_Android_** and select _"Existing Android Code into Workspace"_.
- Click **_Browse_** and select the `<zipDirectory>/callback-android-sample` directory. `<zipDirectory>` is the directory in which the sample was extracted.
- The first row of the Project table should be populated. Click **_Finish_**.
- Once the project imports, right click on the project and select **_Run As -> Android Application_**.
- The first time you do this you will be prompted to select an **Android Virtual Device**. Setup an Android Virtual Device that emulates a smartphone.
- Once the virtual device is up, right-click on the project and select **_Run As -> Android Application_**. The callback example should appear on the virtual device.
- Inside the app, click **_Settings_** and then click the **_Server_** field to display the Server dialog. Enter the IP address or fully qualified hostname of your SocialMiner server.
- Click **_Form_** to go back to the callback form. Enter the name and phone number.
- Enter the ID of the callback feed that is configured to process callback contacts. This ID can be obtained using SocialMiner's Feed API. Please see the [Pre-requisites](#pre-requisites) section of this document for further details on retrieving the feed ID.
- Click **_Call me back_**. If everything is configured properly, you will see the app UI display the status of your request. If all goes well, you should see the request transition from queued to handled.

## Understanding the Code
The following classes use the Callback API to manage the callback request:
- `com.cisco.sample.callback.services.RequestCallbackService`: This class is used to initiate the callback request. The callback request is initiated using HTTP `GET`.

- `com.cisco.sample.callback.services.ContactStatusService`: This class polls for the status of the callback request.

The following classes are responsible for the Callback application UI:
- `com.cisco.sample.MainActivity`: This is the main entry point into the application. It initializes the callback form and the settings form.

- `com.cisco.sample.callback.CallbackFormActivity`: This form is responsible for collecting the callback information and generating a message to `RequestCallbackService` to initiate the callback request.

- `com.cisco.sample.callback.CallbackStatusActivity`: Displays the status of the callback request.

## Disclaimer
This callback sample is made available to Cisco partners and customers. _It is merely provided as a guide for a programmer to see how to initiate and manage a callback request._ Please refer [SocialMiner Developer's Guide](https://developer.cisco.com/site/socialminer/documentation/) for further details about the callback API. Please see the _"Agent Request"_ section of [CCE Optional Features Guide](https://developer.cisco.com/site/packaged-contact-center/documentation/) for UCCE and PCCE for instructions on deploying CCE Agent Request Feature using SocialMiner Callback API.

This is only a sample and is NOT intended to be a production quality application and will not be supported as such. It is NOT guaranteed to be bug free. It is merely provided as a guide for 3rd-party developers on best practices and usage of the SocialMiner RESTful APIs and is not intended for production use "as is".

Cisco's responsibility and liability on this code is limited ONLY to the correctness and accuracy on the usage of the RESTful API interface and the quality of the RESTful API interface itself. Any omissions from this example are not to be considered capabilities that are supported or not supported by the product.

For specific capabilities refer to the documentation that accompanies the latest Cisco SocialMiner release and/or request help from [DevNet](http://developer.cisco.com) or the Cisco Technical Assistance Center (TAC).

## Support Notice
DevNet provides sample support on a “best effort” basis. Like any custom deployment, it is the responsibility of the partner and/or customer to ensure that the customization works correctly. Cisco reserves the right to make changes to APIs and any other published interfaces as part of the normal Cisco SocialMiner release cycle.

https://developer.cisco.com/site/socialminer/overview/