##
# Cisco SocialMiner Bulk Chat Transcript Downloader
#
# This python script does the following:
#
#   0. Invokes a `/search` REST API request on a Cisco SocialMiner server for all handled chat contacts
#   1. Processes the response from the server, and extracts chat transcript data
#   2. Exports transcript for each chat session into a separate text file (with additional metadata)
#   3. Archives all the exported transcripts into a ZIP file
#
# Requires Python 2.7+
#
# Copyright (c) 2016 by Cisco Systems, Inc.
# All rights reserved.
#
# The code included in this example is intended to provide guidance to the
# developer on best practices and usage of the SocialMiner RESTful
# APIs and is not intended for production use "as is".
#
# Cisco's responsibility and liability on this code is limited ONLY to the
# correctness and accuracy on the usage of the RESTful API interface and
# the quality of the RESTful API interface itself. Any omissions from this
# example are not to be considered capabilities that are supported or not
# supported by the product.
#
# For specific capabilities refer to the documentation that accompanies the latest
# Cisco SocialMiner release and/or request help from the Cisco Developer Network
# (http://developer.cisco.com) or the Cisco Technical Assistance Center
#

import sys
import os
import errno
import shutil
import argparse
import time
import xml.etree.ElementTree as ElementTree
try:
    import requests
except ImportError:
    sys.exit("""
        The `requests` module must be pre-installed to run this script.

        Please install using:

            * pip (run "pip install requests"),
            * easy_install (run "easy_install requests")

        and try running this script again.
    """)


# CONSTANTS
SEARCH_API_URL = "https://{}/ccp-webapp/ccp/search/contacts?q=sc.sourceType:chat%20AND%20sc.socialContactStatus:handled"
TIMESTAMP_FORMAT = "%Y-%m-%d %H:%M:%S %Z"
TIME_FORMAT = "%H:%M:%S"  # for every chat message, just need the time of day
FILENAME_TIMESTAMP_FORMAT = "%Y_%m_%d_%H_%M_%S_%Z"  # timestamp format to compose filenames

TRANSCRIPT_METADATA = """+--------------- WEB CHAT TRANSCRIPT ---------------+
| Exported from Cisco SocialMiner [{}] by '{}' at {}
|
| ID:           {}
| Customer:     {}
| Started:      {}
| Ended:        {}
+---------------------------------------------------+
"""
TRANSCRIPT_MSG = """{} [{}]: {}
"""
TRANSCRIPT_FILENAME = "ChatTranscript_{}-{}.txt"
TRANSCRIPT_ARCHIVENAME = "ChatTranscripts_{}-{}"
TRANSCRIPT_TEMP_DIRNAME = "exported_transcripts"


def usage():
    print __name__ + " --host=<HOSTNAME/IP OF SOCIALMINER> --user=<ADMIN_USERNAME> --password=<ADMIN_PASSWORD>"


def make_search_request(url, user, password):
    print "Making a GET request to the URL: %s\n" % url

    # We are making a HTTPS (secure) request, but ignoring SSL certificate verification intentionally
    # since this is a sample script whose primary goal is to illustrate the use of Cisco SocialMiner REST APIs
    requests.packages.urllib3.disable_warnings(requests.packages.urllib3.exceptions.InsecureRequestWarning)

    response = requests.get(url, auth=(user, password), verify=False)
    if response.status_code != 200:
        print "ERROR - API request to SocialMiner failed with status [%d]\n" % response.status_code
        print "Error response: %s\n" % response.text
        sys.exit(1)
    return response.text


def compose_transcript_metadata(transcript_node, host, user):
    return TRANSCRIPT_METADATA.format(host,
                                      user,
                                      time.strftime(TIMESTAMP_FORMAT, time.localtime(time.time())),
                                      transcript_node.find('id').text,
                                      transcript_node.find('chatInitiator').text,
                                      time.strftime(TIMESTAMP_FORMAT, time.localtime(
                                          float(transcript_node.find('startDate').text) / 1000)),
                                      time.strftime(TIMESTAMP_FORMAT, time.localtime(
                                          float(transcript_node.find('endDate').text) / 1000)));


def extract_chat_messages(transcript_node):
    chat_messages = ""
    for chat_message in transcript_node.iter('chat'):
        chat_messages += TRANSCRIPT_MSG.format(chat_message.find('name').text,
                                               time.strftime(TIME_FORMAT, time.localtime(
                                                   float(chat_message.find('time').text) / 1000)),
                                               chat_message.find('msg').text) + "\n"

    return chat_messages


def extract_transcript(transcript_node, host, user):
    transcript_content = compose_transcript_metadata(transcript_node, host, user)
    transcript_content += "\n" + extract_chat_messages(transcript_node)
    return transcript_content


def create_temp_dir():
    try:
        os.makedirs(TRANSCRIPT_TEMP_DIRNAME)
    except OSError as exception:
        if exception.errno == errno.EEXIST:
            print "Directory `%s` already exists in the current working directory.\n" \
                  "Please delete this directory completely and run the program again." % TRANSCRIPT_TEMP_DIRNAME
            sys.exit(2)
        else:
            raise


def export_transcript(transcript_node, host, user):
    transcript_text = extract_transcript(transcript_node, host, user)
    filename = TRANSCRIPT_FILENAME.format(time.strftime(FILENAME_TIMESTAMP_FORMAT,
                                                        time.localtime(
                                                            float(transcript_node.find('startDate').text) / 1000)),
                                          transcript_node.find('chatInitiator').text)

    print "Exporting transcript into file: %s" % filename
    # write to text file
    with open(TRANSCRIPT_TEMP_DIRNAME + os.path.sep + filename, 'w') as text_file:
        text_file.write(transcript_text)


def archive_transcripts(archive_name):
    print "\nArchiving ...\n"
    shutil.make_archive(archive_name, 'zip', TRANSCRIPT_TEMP_DIRNAME)
    print "\n Transcripts successfully exported into archive: %s\n" % archive_name
    # also, delete the temporary directory holding exported transcripts
    shutil.rmtree(TRANSCRIPT_TEMP_DIRNAME)


def main():
    argParser = argparse.ArgumentParser(description="Cisco SocialMiner Bulk Chat Transcript Downloader")
    argParser.add_argument("--host", help="Hostname / IP Address of SocialMiner", required=True)
    argParser.add_argument("--user", help="Username of application admin account in SocialMiner", required=True)
    argParser.add_argument("--password", help="Password of application admin account in SocialMiner", required=True)
    args = vars(argParser.parse_args())

    host = args["host"]
    username = args["user"]
    password = args["password"]

    # make a search API request to SocialMiner to get all SCs and their transcripts
    search_response = make_search_request(SEARCH_API_URL.format(host), username, password)
    root = ElementTree.fromstring(search_response)

    transcript_count = len(root.findall('.//ChatTranscript'))

    if transcript_count > 0:
        # create a temporary directory to hold exported transcripts
        create_temp_dir()

        print "\nFound %d chat transcripts. Starting export ...\n" % transcript_count

        for chat_transcript in root.iter('ChatTranscript'):
            export_transcript(chat_transcript, host, username)

        archive_name = TRANSCRIPT_ARCHIVENAME.format(host, time.strftime(FILENAME_TIMESTAMP_FORMAT,
                                                                         time.localtime(time.time())))
        archive_transcripts(archive_name)
    else:
        print "No chat transcripts found on %s. Terminating program." % host


if __name__ == '__main__':
    main()
