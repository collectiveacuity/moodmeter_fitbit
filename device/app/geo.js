// https://dev.fitbit.com/build/guides/geolocation/
import { geolocation } from "geolocation";

export class GeoLocation {
  
  /* a class to handle gps coordinate retrieval */
  
  constructor (){
    this.latitude = null;
    this.longitude = null
  }
  
  reading (){
    
    // redefine scope
    let self = this;
    
    // construct promise
    return new Promise(function(resolve, reject) {
      
      geolocation.getCurrentPosition(function(position){
        self.latitude = parseFloat(position.coords.latitude.toFixed(6));
        self.longitude = parseFloat(position.coords.longitude.toFixed(6));
        resolve([self.latitude,self.longitude])
      }, function(error){
        console.log('Message: ' + error.message);
        reject(error)
      })
      setTimeout(function(){
        reject('timeout')
      }, 10000)
      
    })
    
  }
  
  reset (){
    this.latitude = null;
    this.longitude = null;
  }
  
} 


