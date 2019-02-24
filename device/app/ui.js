// https://dev.fitbit.com/build/guides/user-interface/
// Import dependencies
import document from "document";
import * as fs from "fs";
import "../common/date_update.js";
import { MOOD_LIST, MOOD_MAP } from "../common/globals.js"

export class MoodUI {
  
  /* a class to control the ui for the app */
  
  // initialize new object
  constructor(device_socket, hrm, gps){
    
    // Assign device socket to property
    this.deviceSocket = device_socket;
    this.gps = gps;
    this.hrm = hrm;
    this.test = 'mood ui construsted.';
    
    // Retrieve document elements
    this.moodContain = document.getElementById("mood-container");
    this.moodSubmit = document.getElementById('mood-submit');
    this.moodConfirmLogged = document.getElementById('mood-confirm-logged');
    this.moodConfirmStatus = document.getElementById('mood-confirm-status');
    this.moodConfirmButton = document.getElementById('mood-confirm-button');
    this.moodConfirmText = document.getElementById('mood-confirm-text');
    this.moodConfirmWait = document.getElementById('mood-confirm-wait');
    this.moodConfirmAdvice = document.getElementById('mood-confirm-advice');
    this.moodConfirmTip = document.getElementById('mood-confirm-tip');
    this.moodConfirmCallback = document.getElementById('mood-confirm-callback');
    this.moodCheck = document.getElementById('mood-check');
    this.moodCheckButton = document.getElementById('mood-check-button');
    
  }
  
  // add landing view method
  landing(){
    
    // Show first mood view Show instructions if newly installed
    try {
      fs.readFileSync("instructions_read.txt", "cbor");
      this.moodContain.value = 1; // jump to emotions
    } catch (e) {
      fs.writeFileSync("instructions_read.txt", [], "cbor");
      this.moodContain.value = 0; // show instructions
    }
    
  }
  
  // add status message renderer
  statusMessage(msg_text){
    this.moodSubmit.style.display = "inline";
    this.moodConfirmStatus.text = msg_text
  }
  
  // add status message callables
  hrmStatus(){ this.statusMessage('Reading heart rate...') }
  gpsStatus(){ this.statusMessage('Reading GPS location...')}
  reportStatus(){ this.statusMessage('Sending report...') }

  // add method to bind triggers
  bind(){
    
    let self = this;
    
    // bind trigger to status
    this.moodConfirmButton.onclick = function(evt) {
      self.moodSubmit.style.display = "none";
      self.moodConfirmLogged.style.display = "none";
      self.moodConfirmAdvice.style.display = "none";
      self.moodConfirmWait.style.display = "inline";
      self.moodConfirmCallback.text = "Report Logged";
    };
    
    // bind trigger to prompt
    this.moodCheckButton.onclick = function(evt) {
      self.moodCheck.style.display = "none"
    };
    
    // construct callback map for incoming messages
    let callback_map = {
      
      report_callback: function(content){
        
        // show generic message
        if (content.msg === undefined){
          let log_msg = "Report logged.";
          self.moodConfirmText.text = log_msg;
          self.moodConfirmLogged.style.display = "inline";
          self.moodConfirmWait.style.display = "none"

        // show tip
        } else {
          let log_msg = "Reminder: " + content.msg;
          self.moodConfirmTip.text = log_msg;
          self.moodConfirmAdvice.style.display = "inline";
          self.moodConfirmWait.style.display = "none"

        }
        
      },
      
      error: function(content){
      
        //show error message
        let error_title = content.title;
        let error_desc = content.description;
        self.moodConfirmCallback.text = error_title;
        self.moodConfirmTip.text = error_desc;
        self.moodConfirmAdvice.style.display = "inline";
        self.moodConfirmWait.style.display = "none"
        
      },
      
      mood_refresh: function(content){
        
        moods(content)
      
      }
      
    };
    
    // bind callback map
    this.deviceSocket.receiveData(callback_map)

  }
  
  // add mood constructor method
  moods(mood_settings=null) {

    // TODO Retrieve moods from settings

    let self = this;
    
    // Determine included moods
    let mood_list = [];
    let mood_opts = mood_settings ? mood_settings : MOOD_LIST;
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
      if (page_corner === "tr"){ page_corner = "bl" }
      else if (page_corner === "bl") { page_corner = "br" }
      else if (page_corner === "br") { page_corner = "tl" }
      else if (page_corner === "tl") { page_corner = "tr" }
      else { page_corner = "tl" }

    // Determine element ids
      const mood_name = mood_list[i].name;
      let button_id = 'page' + page_count.toString() + '-' + page_corner;
      let image_id = button_id + '-img';
      let text_id = button_id + '-txt';
      const moodButton = document.getElementById(button_id);
      const moodImage = document.getElementById(image_id);
      const moodText = document.getElementById(text_id);

    // Inject values into DOM
      moodImage.image = 'icons/' + mood_list[i].img;
      moodImage.style.fill = mood_list[i].color ? mood_list[i].color : "fb-aqua";
      moodText.text = mood_list[i].title;

    // Bind listener to button
      moodButton.onclick = function(evt){

        // define sending data helper function
        function _sending_data(lat, lon){
          let dt = new Date();
          let data = {
            mood: mood_name, 
            dt: dt.getTime() / 1000, 
            iso: dt.toIsoString(), 
            lat: lat,
            lon: lon
          };
          self.reportStatus();
          self.deviceSocket.sendingData('report', data).then(function(){
            self.gps.reset();
          }).catch(function(error){
            self.statusMessage(error);
            self.gps.reset();
            self.gps.reading();
          })
        }
        
        // retrieve date and current gps reading and add to mood report
        console.log(self.gps.latitude);
        if (!self.gps.latitude){
          self.gpsStatus();
          self.gps.reading().then(function(coords){
            _sending_data(coords[0], coords[1])
          }).catch(function(err){
            _sending_data(null)
          })
        } else {
          _sending_data(self.gps.latitude, self.gps.longitude)
        }

      }

    }

  }
  
}

