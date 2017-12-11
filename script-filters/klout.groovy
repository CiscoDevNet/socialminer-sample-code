/*
 *                           Cisco Systems, Inc.
 *                           Copyright (c) 2016
 *                           All rights reserved.
 *                         Cisco SocialMiner 11.5(1)
 *-------------------------------------------------------------------------
 * The code included in this module is intended to provide guidance to the
 * developer on best practices and usage of the SocialMiner Script Filter
 * interface and is not intended for production  use "as is".
 *
 * Cisco's responsibility and liability on this code is limited ONLY to the
 * correctness and accuracy on the usage of the script filter interface
 * and the quality of the script filter interface itself. Any omissions
 * from this example are not to be considered capabilities that are
 * supported or not supported by the product.
 *
 * For specific capabilites refer to the documentation that accompanies this
 * release and/or request help from the Cisco Developer Network
 * (http://developer.cisco.com) or the Cisco Technical Assistance Center
 */

/*
 * How to call an external API.
 * 
 * To demonstrate, here is an example script filter that uses Klout.
 * This script will find the "Klout score" of a social contact author
 * by calling Klout API v2 using the provided restClient.
 * It will then log the score.
 * For more information Klout, visit -> http://klout.com/s/developers/home
 * Documentation for Klout API v2 can be accessed http://klout.com/s/developers/v2
 */

//import required classes
import groovyx.net.http.HttpResponseDecorator
 
//Here you will provide your key.  This will be used when calling Klout's APIv2. You can request developer key here: http://developer.klout.com/member/register
def KLOUT_KEY = "YOUR_KEY";
//Anybody with a score above this threshold is influential.
def INFLUENTIAL_THRESHOLD = 20.0;

//If need be, set the proxy using the provided restClient
//restClient.setProxy("PROXY_HOST", 80, null);

//Using the provided socialContact object, find it's author.
String user = socialContact.getAuthor();

//Klout API does not work with full names.
//If the author is a full name, take only the author's first name.
int space = user.indexOf(' ');
if (space != -1)
	user = user.substring(0, space);


//For debugging purposes, log the user.  
log "user = " + user;

//Call Klout's APIv2, providing the KLOUT_KEY and the user's name.
HttpResponseDecorator identityResponse = restClient.get( uri: "http://api.klout.com/v2/identity.json/twitter", query : [screenName: user, key: KLOUT_KEY]);
if (identityResponse.isSuccess()) {
    String kloutIdStr = identityResponse.data.id;
    //First call will return Klout id. This id is used to retrieve Klout score    
    HttpResponseDecorator scoreResponse = restClient.get( uri: "http://api.klout.com/v2/user.json/"+kloutIdStr+"/score", query : [key: KLOUT_KEY]);
    
    //If the call was successful, log the Klout score.  If not, log that the request failed.
    if (scoreResponse.isSuccess()) {
        //Response was a success.  Parse the Klout score.
        double score = Double.parseDouble(scoreResponse.data.score as String);
        
        //Log the Klout score
        log "${user}'s Klout score is ${score}"
        
        //Anybody with a score above the threshold is influential.
        boolean influential = (score > INFLUENTIAL_THRESHOLD); 
        
        //If this author is influential, tag the socialContact.
        if(influential){
            socialContact.tags += "influential"
            log "${user} is influential."
        }
        
        //Keep the social contact in a campaign only if the author is influential.
        return influential ? 100:0;
    } else {
        //Response was a failure.  Log with failure details.
        log "API call to retrieve Klout score failed! "
        log "Response code was " + scoreResponse.getStatus();
        log "Response body was " + scoreResponse.getData();
        
    }
}
else
{
    log "API call to retrieve Klout identity failed! ";
    log "Response code was " + identityResponse.getStatus();
    log "Response body was " + identityResponse.getData();
}
