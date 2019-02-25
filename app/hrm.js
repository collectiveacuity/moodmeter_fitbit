// https://dev.fitbit.com/build/guides/sensors/heart-rate/
import { HeartRateSensor } from "heart-rate";

export class HeartMonitor {
  
  /* a class to handle heart rate monitoring */
  
  // initialize object
  constructor() {
    this.hrm = new HeartRateSensor();
    this.bpm = null;
    this.test = ' heart monitor constructed'
  }

  // add reading method
  reading(){
  
    let self = this;
    
    return new Promise(function(resolve, reject) {
      
      self.hrm.onreading = function() {
        
        // Report the current sensor values
        console.log("Current heart rate: " + self.hrm.heartRate);
        self.bpm = self.hrm.heartRate;

        // Stop monitoring and return bpm reading
        self.hrm.stop();
        resolve(self.bpm);
      };
      
      self.hrm.onerror = function(err) {
        
        let error_msg = JSON.stringify(err)
        console.log("Error reading heart rate: " + error_msg)
        self.bpm = null;

        // Stop monitoring and return error message
        self.hrm.stop();
        reject(error_msg);
      }
      
      self.hrm.start();
      
    })
  
  }
  
}