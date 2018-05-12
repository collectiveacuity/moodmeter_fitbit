// https://dev.fitbit.com/build/guides/user-interface/
// Import dependencies
import document from "document";
import * as fs from "fs";
import * as messaging from "messaging";
import { MOOD_MAP, MOOD_LIST } from "../common/globals.js";
import { HeartRateSensor } from "heart-rate";

// Prototype methods
Date.prototype.toIsoString = function() {
    // https://stackoverflow.com/a/17415677/4941585
    // @author https://stackoverflow.com/users/1838763/steven-moseley
    var tzo = -this.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            var norm = Math.floor(Math.abs(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return this.getFullYear() +
        '-' + pad(this.getMonth() + 1) +
        '-' + pad(this.getDate()) +
        'T' + pad(this.getHours()) +
        ':' + pad(this.getMinutes()) +
        ':' + pad(this.getSeconds()) +
        dif + pad(tzo / 60) +
        ':' + pad(tzo % 60);
}


// Retrieve document elements
let moodContain = document.getElementById("mood-container");
let moodConfirm = document.getElementById('mood-confirm');
let moodConfirmLogged = document.getElementById('mood-confirm-logged');
let moodConfirmStatus = document.getElementById('mood-confirm-status');
let moodConfirmButton = document.getElementById('mood-confirm-button');
let moodConfirmText = document.getElementById('mood-confirm-text');
let moodConfirmWait = document.getElementById('mood-confirm-wait');
let moodConfirmAdvice = document.getElementById('mood-confirm-advice');
let moodConfirmTip = document.getElementById('mood-confirm-tip');
let moodConfirmCallback = document.getElementById('mood-confirm-callback')
let moodCheck = document.getElementById('mood-check');
let moodCheckButton = document.getElementById('mood-check-button');

// Get the selected index
let currentIndex = moodContain.value;

// Set selected index
try {
  fs.readFileSync("instructions_read.txt", "cbor")
  moodContain.value = 1; // jump to emotions
} catch (e) {
  fs.writeFileSync("instructions_read.txt", [], "cbor")
  moodContain.value = 0; // show instructions
}

// Define heart rate monitoring
var hrm = new HeartRateSensor();
var bpm = null;
function readHRM(){
  return new Promise(function(resolve, reject) {
    hrm.onreading = function() {

      // Report the current sensor values
      console.log("Current heart rate: " + hrm.heartRate);
      bpm = hrm.heartRate

      // Stop monitoring the sensor
      hrm.stop();
      resolve(bpm);
    }
    hrm.start();
  });
}

// Define report data function
function reportData(data){
  
  // Display wait and confirm popup
  moodConfirm.style.display = "inline"
  moodConfirmStatus.text = "Sending report..."
  
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    let message_data = {
      action: "report",
      content: data
    }
    messaging.peerSocket.send(message_data);
    console.log(JSON.stringify(message_data))
  } else {
    let log_msg = "Phone not connected."
    console.log(log_msg)
    moodConfirmStatus.text = log_msg
  }
  
}

// Define mood button constructor
function constructMoods(mood_settings=null) {

  // TODO Retrieve moods from settings
  
  // Determine included moods
  let mood_list = []
  let mood_opts = mood_settings ? mood_settings : MOOD_LIST
  for (var i = 0; i < mood_opts.length; i++){
    mood_list.push(MOOD_MAP[mood_opts[i]])
  }
  
  let page_count = 1;
  let page_corner = "";
  for (var i = 0; i < mood_list.length; i++){
    
  // Calculate page and corner position 
    if (!(i % 4)){
      page_count += 1
    }
    if (page_corner == "tr"){ page_corner = "bl" }
    else if (page_corner == "bl") { page_corner = "br" }
    else if (page_corner == "br") { page_corner = "tl" }
    else if (page_corner == "tl") { page_corner = "tr" }
    else { page_corner = "tl" }
 
  // Determine element ids
    const mood_name = mood_list[i].name
    let button_id = 'page' + page_count.toString() + '-' + page_corner
    let image_id = button_id + '-img'
    let text_id = button_id + '-txt'
    const moodButton = document.getElementById(button_id)
    const moodImage = document.getElementById(image_id)
    const moodText = document.getElementById(text_id)
  
  // Inject values into DOM
    moodImage.image = 'icons/' + mood_list[i].img
    moodImage.style.fill = mood_list[i].color ? mood_list[i].color : "fb-aqua"
    moodText.text = mood_list[i].title
    
  // Bind listener to button
    moodButton.onclick = function(evt){
      if (bpm == null){
        readHRM().then(function(bpm){
          let dt = new Date()
          reportData({mood: mood_name, dt: dt.getTime() / 1000, iso: dt.toIsoString(), bpm: bpm})
        })
      } else {
        let dt = new Date()
        reportData({mood: mood_name, dt: dt.getTime() / 1000, iso: dt.toIsoString(), bpm: bpm})
      }
    }
  }
 
}

// Read current heartrate
readHRM()

// Construct mood buttons
constructMoods()

// Bind trigger to confirmation
moodConfirmButton.onclick = function(evt) {
  moodConfirm.style.display = "none";
  moodConfirmLogged.style.display = "none";
  moodConfirmAdvice.style.display = "none";
  moodConfirmWait.style.display = "inline";
  moodConfirmCallback.text = "Report Logged";
  bpm = null;
}

// Bind trigger to prompt
moodCheckButton.onclick = function(evt) {
  moodCheck.style.display = "none"
}

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Ready to send or receive messages
  console.log("Connection established.")
}

// Listen for socket onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  console.log("Connection error: " + err.code + " - " + err.message);
}

// Listen for socket onmessage event
messaging.peerSocket.onmessage = function(evt) {
  
  // Verify report reception
  if (evt.data && evt.data.action == "report_callback") {
    console.log(JSON.stringify(evt.data.content))
    
    // Show generic log
    if (evt.data.content.msg === undefined){
      let log_msg = "Report logged."
      console.log(log_msg)
      moodConfirmText.text = log_msg
      moodConfirmLogged.style.display = "inline"
      moodConfirmWait.style.display = "none"
    
    // Show tip
    } else {
      let log_msg = "Mood Reminder: " + evt.data.content.msg
      console.log(log_msg)
      moodConfirmTip.text = log_msg
      moodConfirmAdvice.style.display = "inline"
      moodConfirmWait.style.display = "none"
     
    }
 
  // Report Error
  } else if (evt.data && evt.data.action == "error") {
    
    let error_title = evt.data.content.title
    let error_desc = evt.data.content.description
    moodConfirmCallback.text = error_title
    moodConfirmTip.text = error_desc
    moodConfirmAdvice.style.display = "inline"
    moodConfirmWait.style.display = "none"
  
  }
  
}

