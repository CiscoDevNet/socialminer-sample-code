/**
 *                           Cisco Systems, Inc.
 *                           Copyright (c) 2014
 *                           All rights reserved.
 *                         Cisco SocialMiner 10.5(1)
 *-------------------------------------------------------------------------
 * The code included in this module is intended to provide guidance to the
 * developer on best practices and usage of the SocialMiner Chat
 * APIs and is not intended for production use “as is”.
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

/**
 * A set of Javascript utilities to be used with customer chat.
 */

var socialminer =  socialminer || {};

socialminer.utils = socialminer.utils || {};

/**
 * Log the given message to the console if the console is defined
 */
socialminer.utils.log = function(message)
{
    if ( console && console.log )
    {
        console.log(message);
    }
}

/**
 * Decode a string carried in a MessageEvent body field.
 *
 * @param str the string to be decoded
 * @returns the decoded string
 */
socialminer.utils.decodeString = function(str)
{
    str = decodeURIComponent(str.replace(/\+/g,  " "));
    str = str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;').replace(/\'/g,'&#x27;').replace(/\//g,'&#x2f;');

    return str;
}

/**
 * This method ensures that the output String has only
 * valid XML unicode characters as specified by the
 * XML 1.0 standard. For reference, please see
 * <a href="http://www.w3.org/TR/xml/#charsets">the
 * standard</a>. This method will return an empty
 * String if the input is null or empty.
 *
 * @param in The String whose non-valid characters we want to remove.
 * @return The in String, stripped of non-valid characters.
 */
socialminer.utils.stripNonValidXMLCharacters = function(text)
{
    var out = []; // Used to hold the output.
    if (!text  || text === '')
        return '';

    for ( var i = 0; i < text.length; i++) {
        var current = text.charCodeAt(i);
        if ((current == 0x9) ||
            (current == 0xA) ||
            (current == 0xD) ||
            ((current >= 0x20) && (current <= 0xD7FF)) ||
            ((current >= 0xE000) && (current <= 0xFFFD)) ||
            ((current >= 0x10000) && (current <= 0x10FFFF)))
            out.push(text.charAt(i));
    }
    return out.join("");
}

/**
 * Returns true if the given string is blank; false otherwise
 */
socialminer.utils.isBlank = function(s)
{
    return !s || (s.replace(/\s/g, '').length === 0);
}

/**
 * trim leading and trailing spaces from the given string.
 */
socialminer.utils.trim = function(s)
{
    if ( !s )
    {
        return "";
    }

    return s.replace(/^\s+|\s+$/g, '');
}