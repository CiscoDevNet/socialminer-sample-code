var libraries = [
  'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.13/moment-timezone.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.0/moment.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.13/moment-timezone-with-data-2012-2022.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.4/jstz.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.0/jquery.min.js'
]


function initialize() {
  for (var index = 0; index < libraries.length; index++) {
    var script = document.createElement('script');
    script.src = libraries[index];
    document.getElementsByTagName('head')[0].appendChild(script);
  }
}

initialize();

var config;

function read(path) {
  $.getJSON(path, function(data) {
    config = data;
  });
}

function getLocalTimeZone() {
  var tz = jstz.determine();
  var timezone = tz.name();
  return timezone;
}

function getCurrentTime() {
  const timezone = getLocalTimeZone();
  const currentDateInServerTimeZone = moment().tz(timezone);
  return currentDateInServerTimeZone;
}

//Below variables hold the Chat Schedule Configuration details as provided in the AppAdmin Schedule Configuration Page
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

function isInWorkingHour(workTime, currWorkTimeMins) {
  return currWorkTimeMins <= workTime.endTime && currWorkTimeMins >= workTime.startTime;
}

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

function onLoadInit() {
  var displayChatForm = true;
  read();
  // Ignore Chat Schedule if moment timezone library is not available
  if (window.moment) {
    displayChatForm = isOperatingHour();
  }
  if (displayChatForm) {
    // document.getElementById("chatForm").style.display = "inline";
    // alert("Bubble chat displayed");
    // ciscoBubbleChat.showChatWindow();
    alert('bubble chat displayed');
  } else {
    // document.getElementById("closedMessage").style.display = "inline";
    alert("working hours closed");
  }
}