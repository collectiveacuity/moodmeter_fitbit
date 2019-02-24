// https://dev.fitbit.com/build/guides/communications/messaging/
// Import dependencies
import * as messaging from "messaging";
import { localStorage } from "local-storage";
import { settingsStorage } from "settings";
// import { me } from "companion";

// Define api endpoint
var api_token = "";
var token_setting = JSON.parse(settingsStorage.getItem('token'));
if (!token_setting || token_setting.name === undefined){
  api_token = ""
} else {
  api_token = token_setting.name 
}
var api_endpoint = "https://moodhq.herokuapp.com";
var wake_interval = 5 * 60 * 1000; // minimum delay is 5 minutes

// Define relay report function
function postReport(data) {
  let data_field = encodeURIComponent(JSON.stringify(data));
  let report_url = api_endpoint + '/mood?data=' + data_field + '&token=' + api_token;
  fetch(report_url)
  .then(function(response){
      response.json()
      .then(function(response_data) {
        console.log(JSON.stringify(response_data));
        if (response_data.error){
          messaging.peerSocket.send({action: "error", content: { title: "Reporting Error", description: response_data.error }})
        } else {
          messaging.peerSocket.send({action: "report_callback", content: response_data })
        }
      });
    })
 .catch(function (err) {
    let error_desc = JSON.stringify(err);
    console.log("Error posting report: " + error_desc);
    messaging.peerSocket.send({action: "error", content: { title: "Reporting Error", description: error_desc } })
  })
}

// Define settings update method
function putSettings(data) {
  let settings_data = encodeURIComponent(JSON.stringify(data));
  let settings_url = api_endpoint + '/settings_get?data=' + settings_data + '&token=' + api_token;
  console.log(settings_url);
  fetch(settings_url)
  .then(function (response) {
      response.json()
      .then(function(response_data) {
        console.log(JSON.stringify(response_data))
        // messaging.peerSocket.send({action: "report_callback", content: response_data })
      });
  })
  .catch(function (err) {
    console.log("Error posting report: " + err);
    // messaging.peerSocket.send({action: "report_callback", content: { error: err } })
  });
}

// Listen for messages from the device
messaging.peerSocket.onmessage = function(evt) {
  if (evt.data && evt.data.action === "report") {
    if (!api_token){
      let error_title = "Token Missing";
      let error_desc = "To report your moods, you must first setup an access token. To setup an access token, go to the settings menu in your companion app on your phone and enter a secret code for the access token setting."
      console.log(error_title);
      messaging.peerSocket.send({action: "error", content: { title: error_title, description: error_desc } })
    } else {
      postReport(evt.data.content)
    }
  }
};

// Listen for onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
};

// Listen for onopen event
messaging.peerSocket.onopen = function(evt) {
  console.log("Companion connected.")
  // loadMoods()
  // retrieveSchedule(true)
};

// Handle settings changes
settingsStorage.onchange = function(evt) {
  
  // Update api token
  token_setting = JSON.parse(settingsStorage.getItem("token"));
  if (token_setting.name === undefined){
    api_token = ""
  } else { api_token = token_setting.name }
  
  // Update prompt and alert settings
  const prompt_setting = JSON.parse(settingsStorage.getItem("prompt"));
  const alert_setting = JSON.parse(settingsStorage.getItem("alert"));
  const interval_setting = JSON.parse(settingsStorage.getItem("prompt_interval"));
  const wake_setting = JSON.parse(settingsStorage.getItem("prompt_wake"));
  const sleep_setting = JSON.parse(settingsStorage.getItem("prompt_prompt"));
  const settings_data = {
    prompt_phone: prompt_setting ? prompt_setting.name : "",
    alert_phone: alert_setting ? alert_setting.name : "",
    interval: interval_setting ? interval_setting.value : "",
    wake: wake_setting ? wake_setting.value : "",
    sleep: sleep_setting ? sleep_setting.value : ""
  };
  if (api_token){
    putSettings(settings_data)
  }

};