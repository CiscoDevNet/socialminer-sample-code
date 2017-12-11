# Cisco SocialMiner - Task API Sample
_Sample web-based (javascript) application to illustrate SocialMiner Task APIs_

## Overview
### About Task Routing
Task Routing constitutes the ability to route tasks of any nature to human experts in a Customer Care center or even bots and programs. Tasks are actionable events which require the attention of human experts or other intelligent agents. Task Routing APIs bring the power of Cisco Contact Center Enterprise (CCE) to third-party multichannel applications. It enables these applications to send task requests to experts based on business rules, regardless of the media.

Task Routing APIs provide a standard way to request, queue, route, and handle third-party multichannel tasks in the CCE environment. Contact Center customers or partners can use the Task Routing APIs to develop specialized applications that was not built by Cisco as part of the platform.

For more details, check out the [Task Routing Portal](https://developer.cisco.com/site/task-routing) on Cisco DevNet.

### SocialMiner Task APIs
SocialMiner provides the ability to submit multichannel tasks to Contact Center Enterprise and poll the status of individual tasks via a set of powerful, flexible RESTful APIs called **Task APIs**.

This sample is a web application (built using javascript) that illustrates the following task APIs:

- `GET` and `POST` APIs to initiate tasks
- `GET` to poll for Task status (including estimated wait time)
- `DELETE` to cancel tasks

This sample also includes a node.js-based HTTP proxy. This proxy serves up the Task html page and proxies the Task API to work around cross-site scripting issues that would otherwise prevent the user from experimenting with the Task HTML page. (**NOTE:** The proxy is needed only for SocialMiner versions 11.5 and older. Starting SocialMiner 11.6, CORS support is fully implemented for task APIs)

## Pre-requisites
- SocialMiner integrated with Packaged CCE or Unified CCE and Finesse. The Task Routing feature should be configured on SocialMiner (via CCE administration), CCE, and Finesse. For more information, refer [Task Routing Setup and Configuration](https://developer.cisco.com/site/task-routing/docs/#task-routing-setup-and-configuration) section in Cisco DevNet portal.

- The ID of the Task feed configured to process Task requests. The ID can be obtained using the following SocialMiner REST API:
    ```
    http://<socialMiner>/ccp-webapp/ccp/feed
    ```
    This REST API lists XML for each feed configured on SocialMiner. Feeds with type `12` are task feeds. The name given when the feed was configured is also listed. This is the easiest way to find the XML for the Task feed. Here is some sample output from the feed API:
    ```xml
    <feeds>
    <Feed>
        <changeStamp>0</changeStamp>
        <name>Task</name>
        <pushFeedURL>http://<socialMiner>/ccp/task/feed/101212</pushFeedURL>
        <refURL>http://<socialMiner>/ccp-webapp/ccp/feed/101212</refURL>
        <status>1</status>
        <tags>
            <tag>task</tag>
        </tags>
        <type>12</type>
    </Feed>
    ...
    </feeds>
    ```
    The ID of the feed is the number at the end of the `refURL` field. In this example, the ID is `101212`.

- Install [Node.js](https://nodejs.org/)

### Configuring Node.js
Run these steps to ensure node.js has the necessary dependencies to run the proxy.
- Change directory to `<zipDirectory>/node`.  
`<zipDirectory>` is the directory in which the sample was extracted.

- Run the following command to install dependencies:
    ```
    npm install
    ```

- At this point, `node` has the dependencies it needs to serve up the Task html page as well as proxy the SocialMiner Task API.

## Running
- Open a terminal and change directory to <zipDirectory>/node

- Run the following command:
    ```
    node TaskProxy.js --host <socialMinerHost>
    ```
    `<socialMinerHost>` is the hostname or IP address of SocialMiner

- Open the following URL in your browser: http://localhost:8080/task.html  
_Port 8080 is the default setting for `API_PROXY_LISTEN_PORT` in TaskProxy.js._  
_If you changed `API_PROXY_LISTEN_PORT`, use the new setting in the URL._

- Enter a Title, Name and a Script Selector identifier that is configured for the Media Routing Domain to which you want to route the task.

    **_How to find the Script Selector?_**
    - **Unified CCE:** Open _CCE Configuration Manager_. Expand _List Tools_ and select _Dialed Number/Script Selector List_. Click _Retrieve_, and then find the Script Selector option that corresponds to the correct Media Routing Domain. The Script Selector identifier is the text in the _Dialed Number / Script Selector_ field.

    - **Packaged CCE:** In Unified CCE Administration, navigate to _Manage_ > _Dialed Numbers_.  Find the Dialed Number that corresponds to the correct Media Routing Domain. The Script Selector identifier is the text in the _Dialed Number_ field.

- Enter the ID of the Task feed that is configured to process task contacts. This ID can be obtained using SocialMiner's Feed API. Please see [Pre-requisites](#pre-requisites) (above) for further details on retrieving the feed ID.

- Optionally enter call variables, and ECC variables. By default, this sample uses the `user.test.task` ECC variable. The sample can be modified to use an ECC variable configured in your deployment.

- Submit the task from the UI.

- If everything is configured properly, the UI will display the message _"Finding the right agent for your request."_

- The UI displays the estimated wait time, if configured.

- When an agent is found, the UI displays the message _"Agent found for your request."_

## Modifying
The sample uses GET to initiate task requests. This can be changed by modifying [task.html](html/task.html). Search for the string `'var useGet'`. You see that the variable `useGet` is set to `true`. Changing this setting to `false` makes the application use `POST` to initiate Task requests.

The `taskUsingHTTPGet()` function illustrates how to use `GET` to initiate a task. The `taskUsingHTTPPost()` illustrates how to use `POST` to initiate a task.

To change the Task ECC variable, search for `'user_user.test.task'`. If you are using `GET` to initiate tasks, change the `'user_user.test.task'` string in the `'if ( useGet )'` block to match the ECC variable configured in your deployment. For example, a deployment with the variable `user.accountNumber` would change `'user_user.test.task'` to `'user_user.accountNumber'`.

If you are using `POST` to initiate tasks, modify the else portion of the `'if ( useGet )'` block.

## Disclaimer
This task sample application is made available to Cisco partners and customers _as a convenience to help minimize the cost of Cisco SocialMiner customizations._ Please refer [SocialMiner Developer's Guide](https://developer.cisco.com/site/socialminer/documentation/) for further details about the task API. Please visit and check resources available in the [Task Routing DevNet Portal](https://developer.cisco.com/site/task-routing/) for instructions on deploying CCE Task Routing Feature using SocialMiner Task API and Cisco Finesse APIs.

This is only a sample and is NOT intended to be a production quality application and will not be supported as such. It is NOT guaranteed to be bug free. It is merely provided as a guide for 3rd-party developers on best practices and usage of the SocialMiner RESTful APIs and is not intended for production use "as is".

Cisco's responsibility and liability on this code is limited ONLY to the correctness and accuracy on the usage of the RESTful API interface and the quality of the RESTful API interface itself. Any omissions from this example are not to be considered capabilities that are supported or not supported by the product.

For specific capabilities refer to the documentation that accompanies the latest Cisco SocialMiner release and/or request help from [DevNet](http://developer.cisco.com) or the Cisco Technical Assistance Center (TAC).

## Support Notice
DevNet provides sample support on a “best effort” basis. Like any custom deployment, it is the responsibility of the partner and/or customer to ensure that the customization works correctly. Cisco reserves the right to make changes to APIs and any other published interfaces as part of the normal Cisco SocialMiner release cycle.

https://developer.cisco.com/site/socialminer/overview/