var fs = require("fs");
var io = require('socket.io-client');
var gpio = require("pi-gpio");

var config = require('./config.js');

// XXX: hack to accept self signed certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const HIGH = 1;
const LOW = 0;

/**
 * Connects to the socket.io server at 'location' and listens for 'openDoor' events on the socket.
 *
 * @param location The url of the socket.io endpoint.
 */
function connect(location) {
  var socket = io.connect(location, {
    secure: true,
    reconnect: false
  });

  socket.on('connect', function () {
    console.log('socket.io connected.');
  });

  socket.on('openDoor', function (data) {
    console.log("socket.io received 'openDoor' event.", data);
    onOpenDoor(data, function (status) {
      console.log(status);
      socket.emit('status', {status: status});
    });
  });

  socket.on('disconnect', function () {
    console.log('Something went wrong... reconnecting');

    var reconnect = function () {
      if (!socket.socket.connected) {
        console.log('Attempting reconnect...');
        socket.socket.connect();
        setTimeout(reconnect, config.RECONNECT_INTERVAL);
      }
    };

    reconnect();
  });
  
  return socket;
}

/**
 * Handles a socket.io 'openDoor' event.
 *
 * @param msg Must contain a field 'doorNumber' that matches on of the keys in DOOR_PINS.
 * @param cb Callback function that takes a string as argument. Gets called twice.
 */
function onOpenDoor(msg, cb) {
  if (msg.hasOwnProperty('doorNumber')) {
    openDoor(msg['doorNumber'], config.BUZZ_TIME, cb);
  } else {
    throw {
      name: 'DoorNumberMissingError',
      message: "Message does not contain 'doorNumber'"
    }
  }
}

/**
 * Opens a door for a fixed time.
 *
 * @param doorNumber The door number of the door to open.
 * @param time The time the door should buzz in milliseconds.
 * @param cb Callback function that takes a string as argument. Gets called twice.
 */
function openDoor(doorNumber, time, cb) {
  const gpioPin = config.PIN_MAPPING[config.DOOR_PINS[doorNumber]];
  
  gpio.write(gpioPin.pin, HIGH, function (err) {
    if (!err) cb('door opened');
    
    setTimeout(function () {
      gpio.write(gpioPin.pin, LOW, function (err) {
        if (!err) cb('door closed');
      });
    }, time);
  });
}

/**
 * Sets the pins in DOOR_PINS to 'output'.
 *
 * @param cb Callback gets called when all pins in DOOR_PINS have been set.
 */
function configurePins(cb) {
  const doorNumbers = Object.keys(config.DOOR_PINS);
  var c = doorNumbers.length;

  doorNumbers.forEach(function (doorNumber) {
    if (typeof config.DOOR_PINS[doorNumber] == 'undefined') {
      c--;
      return;
    }

    setPinToOut(config.DOOR_PINS[doorNumber], {
        success: function () {
          c--;
          if (c === 0) cb();
        },
        error: function (err) {
          console.log(err);
          c--;
          if (c === 0) cb();
        }
      }
    );
  });
}

/**
 * Checks if a pin has already been configured.
 * 
 * @param bcm The Broadcom chip number of the pin
 * @param cb A callback function
 */
function isPinOpen (bcm, cb) {
  fs.exists('/sys/class/gpio/gpio' + bcm, cb);
}

/**
 * Marks a pin as 'output'
 * Note: gpio-admin creates a directory with the 'bcm' number when the corresponding pin has been opened.
 *
 * @param gpioNumber e.g. 'gpio7', etc..
 * @param options An object containing a success and an error callback
 */
function setPinToOut(gpioNumber, options) {
  const gpioPin = config.PIN_MAPPING[gpioNumber];

  const id = setTimeout(options.error.bind(this, 
    new Error("Callback hasn't been called after " + config.TIMEOUT + ' milliseconds')), 
    config.TIMEOUT);
  
  isPinOpen(gpioPin.bcm, function (isOpen) {
    if (!isOpen) {
      gpio.open(gpioPin.pin, "output", function (err) {
        clearInterval(id);
        if (err) options.error(err);
        options.success();
      });
    } else {
      // set the pin to 0 first, just to be sure
      gpio.write(gpioPin.pin, LOW, function (err) {
        clearInterval(id);
        if (err) options.error(err);
        options.success();
      });
    }
  });
}

exports.connect = connect;
exports.onOpenDoor = onOpenDoor;
exports.openDoor = openDoor;
exports.configurePins = configurePins;
exports.isPinOpen = isPinOpen;
exports.setPinToOut = setPinToOut;
