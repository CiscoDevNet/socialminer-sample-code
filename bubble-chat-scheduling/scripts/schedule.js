/**
 * Sample chat schedule configuration and deployment for UCCX Bubble Chat using javascript.
 *
 * Copyright (c) 2018 by Cisco Systems, Inc.
 * All rights reserved.
 *
 * This sample should act as a guide for a programmer to understand how to
 * add scheduling capabilities for bubble chat in the customer side of the chat session.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * For specific capabilities refer to the documentation that accompanies the latest
 * Cisco SocialMiner release and/or request help from the Cisco Developer Network
 * (http://developer.cisco.com) or the Cisco Technical Assistance Center
 **/


// declare necessary libraries
var libraries = [
  'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.0/moment.min.js', // Needed to egt current datettime from client
  'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.13/moment-timezone-with-data-2012-2022.min.js', //Needed to parse time in accordance with given timezone.
  'https://cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.4/jstz.js', //Needed to determine client's timezone.
  'https://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.0/jquery.min.js' //Needed for simple,better reading/parsing of scheduling configuration which is in json.
]

// source and initialize neccesary libraries
function initialize() {
  for (var index = 0; index < libraries.length; index++) {
    var script = document.createElement('script');
    script.src = libraries[index];
    document.getElementsByTagName('head')[0].appendChild(script);
  }
}

// invoke initialization
initialize();

var config;

// read schedule configuration from external source in JSON format.
function readConfig(path) {
  $.getJSON(path, function(data) {
    config = data;
  });
}

// determine local timezone of the client.
function getLocalTimeZone() {
  var tz = jstz.determine();
  var timezone = tz.name();
  return timezone;
}

// get current datetime
function getCurrentTime() {
  var timezone = getLocalTimeZone();
  var currentDateInServerTimeZone = moment().tz(timezone);
  return currentDateInServerTimeZone;
}

// check whether current date is an holiday
function isOnHoliday(currDate) {
  if (config.holidays == null) {
    return false;
  }
  for (var i = 0; i < config.holidays.length; i++) {
    if (config.holidays[i] == currDate) {
      return true;
    }
  }
  return false;
}

// check whether current date is a special day
function isOnSpecialDay(currDate) {
  if (config.specialDays == null) {
    return false;
  }

  for (var i = 0; i < config.specialDays.length; i++) {
    if (config.specialDays[i].date == currDate) {
      break;
    }
  }
  return config.specialDays[i];
}

// check whether current time is in operating hours.
function isInWorkingHour(workTime, currWorkTimeMins) {
  return currWorkTimeMins <= workTime.endTime && currWorkTimeMins >= workTime.startTime;
}


// determine whether current datetime is in operating hour.
function isOperatingHour() {
  var isOperatingHour = false;
  var current = getCurrentTime();
  if (!isOnHoliday(current)) {
    var specialDate = isOnSpecialDay(current);
    var currWorkTimeMins = (current.hours() * 60) + current.minutes();
    if (specialDate) {
      isOperatingHour = isInWorkingHour(specialDate.workTime, currWorkTimeMins);
    } else {
      if (config.routineDays == null) {
        return false;
      }

      for (var i = 0; i < config.routineDays.length; i++) {
        if (config.routineDays[i].day == current.day()) {
          isOperatingHour = isInWorkingHour(config.routineDays[i].workTime, currWorkTimeMins);
          break;
        }
      }
      if (config.routineDays.length == 0) {
        isOperatingHour = true;
      }
    }
  }
  return isOperatingHour
}