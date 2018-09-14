# Cisco SocialMiner - Scheduling BubbleChat Sample
_Example javascript application encapsulates the Bubblechat invocation and is designed to be deployed on Customer website_

## Overview

The example intends to address the lack of scheduling facility for bubble chat as of version 11.6.2.
This modifications recommended by this manual are in addition to those instructions that comes with conventional bubblechat deployment.

The core intelligence of chat scheduler lies in scripts/schedule.js which is equipped to get receive config information in JSON format.
Make sure to source this file as shown below.

Template:

<script src='__PATH__/schedule.js'> </script>

Example:

<script src='./scripts/schedule.js'> </script>


Users are expected to send the URL of schedule config as part initializing the script and it is recommended to initialize the same at the time of loading of HTML body tag as shown below.

Template:

<body onload="readConfig(URL)">
//main code
</body>

Example:

<body onload="readConfig('http://localhost:3000/scripts/data.json')">
//main code
</body>

Once, the sourcing and loading the config information is completed, working hours compliance is determined by _isOperatingHour()_. It can be used to display(or not) the buublechat window as shown below.

<script>
function displayBubblechatExample() {

    if (isOperatingHour()) {
        ciscoBubbleChat.showChatWindow();
    } else {
        alert('example2 no window');
    }

}
</script>
<button onclick="displayBubblechatExample()">example2</button>
