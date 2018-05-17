// https://dev.fitbit.com/build/guides/user-interface/
// Set environmental variables
let system_environment = 'dev';

// Import dependencies
import { HeartMonitor } from "./hrm.js";
import { DeviceSocket } from "./socket.js"
import { MoodUI } from "./ui.js";

// Activate heart rate monitor and take reading
let hrm = new HeartMonitor();
hrm.reading();

// Construct Device Socket
let device_socket = new DeviceSocket();
device_socket.bind();

// Construct UI, determine landing view, draw buttons and bind triggers
let mood_ui = new MoodUI(device_socket, hrm);
mood_ui.landing();
mood_ui.moods();
mood_ui.bind();

