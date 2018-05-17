import * as messaging from "messaging";

export class DeviceSocket {
  
  constructor(){
    this.test = 'device socket constructed'
  }

  bind(){
    
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
    
  }
  
  receiveData(callback_map){
    
    messaging.peerSocket.onmessage = function(evt){
    
      // call function associated with action in message
      if (evt.data){
        let action = evt.data.action
        let content = evt.data.content
        if (action in callback_map){
          let callback = callback_map[action]
          console.log(JSON.stringify({ action: action, content: content }))
          callback(content)
        }
      }
      
    }   
    
  }
  
  sendingData(action, data){
  
    /* a promise function for sending data from device to companion */

    // construct promise
    return new Promise(function(resolve, reject) {
      if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        let message_data = {
          action: action,
          content: data
        }
        messaging.peerSocket.send(message_data);
        console.log(JSON.stringify(message_data));
        resolve(message_data);
      } else {
        let error_msg = "Phone not connected."
        console.log(JSON.stringify(error_msg));
        reject(error_msg)
      }
    })

  }
}