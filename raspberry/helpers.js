var fs = require("fs");
var io = require('socket.io-client');
var gpio = require("pi-gpio");

var config = require('./config.js');

// XXX: hack to accept self signed certificates
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// https://twitter.com/cell303/status/450060094383075329
function a(k,j){return k.every(function(x){return x in j})}

Object.prototype.hasKeys = function (keys) {
  return a(keys, this)
};

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
    console.log('socket.io connected');
    socket.emit('whoami', { deviceid: config.DEVICE_ID});
  });

  socket.on('openDoor', function (data) {
    console.log("socket.io received 'openDoor' event", data);
    onOpenDoor(data, function (status) {
      console.log(status);
      socket.emit('status', status);
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
 * True if somebody else is currently opening the door.
 * @type {boolean}
 */
var isBuzzing = false;

/**
 * Handles a socket.io 'openDoor' event.
 *
 * @param msg Must contain a field 'doorNumber' that matches on of the keys in DOOR_PINS.
 * @param cb Callback function that takes a string as argument. Gets called twice.
 */
function onOpenDoor(msg, cb) {
  if (msg.hasKeys(['doorNumber', 'buzzTime'])) {
    if (!isBuzzing) {
      openDoor(msg.doorNumber, msg.buzzTime, cb);
    }
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
  if (time > config.MAX_BUZZ_TIME) time = config.MAX_BUZZ_TIME;

  var gpioPin = config.PIN_MAPPING[config.DOOR_PINS[doorNumber]];

  gpio.write(gpioPin.pin, HIGH, function (err) {
    if (!err) cb({status: 'opened', buzzTime: time, message: 'Door opened.'});

    setTimeout(function () {
      gpio.write(gpioPin.pin, LOW, function (err) {
        if (!err) {
          isBuzzing = false;
          cb({status: 'closed', buzzTime: time, message: 'Door closed.'});
        }
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
  var doorNumbers = Object.keys(config.DOOR_PINS);
  var c = doorNumbers.length;

  doorNumbers.forEach(function (doorNumber) {
    if (typeof config.DOOR_PINS[doorNumber] === 'undefined') {
      c--;
      if (c === 0) cb();
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
    });
  });
}

/**
 * Checks if a pin has already been configured.
 *
 * @param bcm The Broadcom chip number of the pin
 * @param cb A callback function
 */
function isPinOpen(bcm, cb) {
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
  var gpioPin = config.PIN_MAPPING[gpioNumber];

  var id = setTimeout(
    options.error.bind(this, new Error("Callback hasn't been called after " + config.TIMEOUT + ' milliseconds')),
    config.TIMEOUT
  );

  isPinOpen(gpioPin.bcm, function (isOpen, b) {
    if (!isOpen) {
      gpio.open(gpioPin.pin, "output", function (err) {
        clearTimeout(id);
        if (err) options.error(err);
        options.success();
      });
    } else {
      // set the pin to 0 first, just to be sure
      gpio.write(gpioPin.pin, LOW, function (err) {
        clearTimeout(id);
        if (err) options.error(err);
        options.success();
      });
    }
  });
}

var isFailSave = false;

/**
 * Set the pins to LOW every hour, just to be sure.
 * Calling this more than once will have no effect.
 */
function failSafe() {
  if (!isFailSave) {
    console.log("starting failsafe interval");
    Object.keys(config.DOOR_PINS).forEach(function (id) {
      var gpioPin = config.DOOR_PINS[id];
      setInterval(function () {
        gpio.write(gpioPin.pin, LOW);
      }, 1000 * 60 * 60);
    });
    isFailSave = true;
  }
}

exports.connect = connect;
exports.onOpenDoor = onOpenDoor;
exports.openDoor = openDoor;
exports.configurePins = configurePins;
exports.isPinOpen = isPinOpen;
exports.setPinToOut = setPinToOut;
exports.failSafe = failSafe;
