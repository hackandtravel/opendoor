// XXX: hack to accept self signed certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// XXX: Works where I am...
var config = { location: '192.168.1.213:3000' };

var fs = require("fs");
var io = require('socket.io-client');
var gpio = require("pi-gpio");

const HIGH = 1;
const LOW = 0;

/*
 * On which gpio pin are the doors connected?
 * Must be one of the keys in PIN_MAPPING.
 */
const DOOR_PINS = {
  1: 'gpio0',
  2: undefined, // TODO
  3: undefined  // TODO
};

/*
 * Pin mapping of the Raspberry Pi
 * 'pin' is the number of the pin if counted form the top
 * 'bcm' is the number used by the underlying Broadcom chip
 */
const PIN_MAPPING = {
  gpio7: {pin: 7, bcm: 4},
  gpio0: {pin: 11, bcm: 17}, gpio1: {pin: 12, bcm: 18},
  gpio3: {pin: 15, bcm: 22}, gpio4: {pin: 16, bcm: 23},
  gpio5: {pin: 18, bcm: 24},
  gpio6: {pin: 25, bcm: 25}
};

/**
 * How long sould the door buzz? In milliseconds.
 *
 * @type {number}
 */
const BUZZ_TIME = 4000;

const RECONNECT_INTERVAL = 1000;

configurePins(function () {
  console.log('configured pins');
  listen(config.location);
});

/**
 * Connects to the socket.io server at 'location' and listens for 'openDoor' events on the socket.
 *
 * @param location The url of the socket.io endpoint.
 */
function listen(location) {
  var socket = io.connect(location, { secure: true });

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
        socket.socket.connect(); // Yep, socket.socket ( 2 times )
        setTimeout(reconnect, RECONNECT_INTERVAL);
      }
    };

    reconnect();
  });
}

/**
 * Handles a socket.io 'openDoor' event.
 *
 * @param msg Must contain a field 'doorNumber' that matches on of the keys in DOOR_PINS.
 */
function onOpenDoor(msg, cb) {
  if (msg.hasOwnProperty('doorNumber')) {
    openDoor(msg['doorNumber'], BUZZ_TIME, cb);
  } else {
    throw new Error("Message does not contain 'doorNumber'");
  }
}

/**
 * Opens a door for a fixed time.
 *
 * @param doorNumber The door number of the door to open.
 * @param time The time the door should buzz in milliseconds.
 */
function openDoor(doorNumber, time, cb) {
  const gpioPin = PIN_MAPPING[DOOR_PINS[doorNumber]];
  gpio.write(gpioPin.pin, HIGH, function () {
    cb('door opened');
    setTimeout(function () {
      gpio.write(gpioPin.pin, LOW);
      cb('door closed');
    }, time);
  });
}

/**
 * Sets the pins in DOOR_PINS to 'output'.
 *
 * @param cb Callback gets called when all pins in DOOR_PINS have been set.
 */
function configurePins(cb) {
  var c = Object.keys(DOOR_PINS).length;

  for (var doorNumber in DOOR_PINS) {
    if (typeof DOOR_PINS[doorNumber] == 'undefined') {
      c--;
      continue;
    }

    setPinToOut(DOOR_PINS[doorNumber], function () {
      c--;
      if (c === 0) cb();
    });
  }
}

/**
 * Marks a pin as 'output'
 * Note: gpio-admin creates a directory with the 'bcm' number when the corresponding pin has been opened.
 *
 * @param gpioNumber e.g. 'gpio7', etc..
 * @param cb Callback function
 */
function setPinToOut(gpioNumber, cb) {
  const gpioPin = PIN_MAPPING[gpioNumber];
  fs.exists('/sys/class/gpio/gpio' + gpioPin.bcm, function (exits) {
    if (!exits) {
      gpio.open(gpioPin.pin, "output", cb);
    } else {
      // set the pin to 0 first, just to be sure
      gpio.write(gpioPin.pin, LOW, cb);
    }
  });
}

