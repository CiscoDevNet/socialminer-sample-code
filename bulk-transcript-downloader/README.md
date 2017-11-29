# Cisco SocialMiner - Bulk Chat Transcript Downloader
_Sample application to export chat transcripts from a SocialMiner server_

## Overview
This sample does the following:
0. Invokes a `/search` REST API request on a Cisco SocialMiner server for all handled chat contacts
1. Processes the response from the server, and extracts chat transcript data
2. Exports transcript for each chat session into a separate text file (with additional metadata)
3. Archives all the exported transcripts into a ZIP file

## Pre-requisites
1. Cisco SocialMiner server (any supported release)

2. Any client machine (Windows, macOS, *nix-based systems) with the following:
    
    a) [Python 2.7+](https://www.python.org/downloads/) installed and configured in `PATH`
    
    b) Direct connectivity to the SocialMiner server

3. The python module `requests` must be pre-installed. Python modules can be installed
    using either `pip` or `easy_install`.

```
pip install requests
```
OR
```
easy_install requests
```

## Running
### STEP 0
On your client machine, ensure `python` is present in your system/user `PATH`.

```
python --version
```
_The version of python installed on your system should be printed on the terminal console._

If you get an error (`command not found`), configure your system/user `PATH` so that `python` is added to it and try again to make sure you are able to make it work.

If the version of python is less than 2.7, please upgrade it to the latest version (in 2.x release). **This sample does not work with python 3.x.**

### STEP 1
Run the sample by providing all the necessary arguments to the python script.

```
python bulk-transcript-downloader.py --host <HOST_ADDRESS> --user <ADMIN_USERNAME> --password <ADMIN_PASSWORD>
```
where

`<HOST_ADDRESS>` is the IP address/hostname of the SocialMiner server

`<ADMIN_USERNAME>` is the login id of the application administrator account of the SocialMiner server

`<ADMIN_PASSWORD>` is the login password of the application administrator account of the SocialMiner server

This script will export chat transcripts as follows:
- The transcript for each individual handled chat session will be exported into a separate text file
- Apart from the chat messages, important metadata pertaining to the chat session are also written into each transcript file
- The filename of an exported chat transcript file is of the form `ChatTranscript_<TIMESTAMP>-<CUSTOMER_NAME>.txt`
- All of these transcript files are compressed into a single ZIP archive that will be created in the current working directory from where the sample is being run.

## Modifying / Extending
This sample has been created using standard python modules, and does not have dependencies on anything else.

All SocialMiner RESTful APIs support XML data format. Modify the URL in the python script to invoke other REST APIs, and use the `xml.etree.ElementTree` module (or any other XML parsing module) in python to enhance and modify the functionality in this sample.

## Disclaimer
The Bulk Chat Transcript Downloader sample is intended to serve as an example of using SocialMiner REST APIs (specifically, the `search` API) using a simple python script.

This is only a sample and is NOT intended to be a production quality application and will not be supported as such. It is NOT guaranteed to be bug free. It is merely provided as a guide for 3rd-party developers on best practices and usage of the SocialMiner RESTful APIs and is not intended for production use "as is".

Cisco's responsibility and liability on this code is limited ONLY to the correctness and accuracy on the usage of the RESTful API interface and the quality of the RESTful API interface itself. Any omissions from this example are not to be considered capabilities that are supported or not supported by the product.

For specific capabilities refer to the documentation that accompanies the latest Cisco SocialMiner release and/or request help from [DevNet](http://developer.cisco.com) or the Cisco Technical Assistance Center (TAC).

## Support Notice
DevNet provides sample support on a “best effort” basis. Like any custom deployment, it is the responsibility of the partner and/or customer to ensure that the customization works correctly. Cisco reserves the right to make changes to APIs and any other published interfaces as part of the normal Cisco SocialMiner release cycle.

https://developer.cisco.com/site/socialminer/overview/